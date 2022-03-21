// Copyright 2015-2022 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type {Mutable, Class} from "@swim/util";
import {Property} from "@swim/component";
import {R2Box, Transform} from "@swim/math";
import {ThemeConstraintAnimator} from "@swim/theme";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import type {AnyGraphicsRenderer, GraphicsRendererType, GraphicsRenderer} from "../graphics/GraphicsRenderer";
import type {GraphicsViewContext} from "../graphics/GraphicsViewContext";
import {GraphicsViewInit, GraphicsView} from "../graphics/GraphicsView";
import {WebGLRenderer} from "../webgl/WebGLRenderer";
import type {CanvasCompositeOperation} from "../canvas/CanvasContext";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import {CanvasView} from "../canvas/CanvasView";
import type {RasterViewContext} from "./RasterViewContext";

/** @public */
export interface RasterViewInit extends GraphicsViewInit {
  opacity?: number;
  compositeOperation?: CanvasCompositeOperation;
}

/** @public */
export class RasterView extends GraphicsView {
  constructor() {
    super();
    this.canvas = this.createCanvas();
    Object.defineProperty(this, "renderer", {
      value: this.createRenderer(),
      writable: true,
      enumerable: true,
      configurable: true,
    });
    this.ownRasterFrame = null;
  }

  override readonly contextType?: Class<RasterViewContext>;

  @ThemeConstraintAnimator({type: Number, value: 1, updateFlags: View.NeedsComposite})
  readonly opacity!: ThemeConstraintAnimator<this, number>;

  @Property({type: String, value: "source-over", updateFlags: View.NeedsComposite})
  readonly compositeOperation!: Property<this, CanvasCompositeOperation>;

  get pixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  /** @internal */
  readonly canvas: HTMLCanvasElement;

  get compositor(): GraphicsRenderer | null {
    const parent = this.parent;
    if (parent instanceof GraphicsView || parent instanceof CanvasView) {
      return parent.renderer;
    } else {
      return null;
    }
  }

  override readonly renderer!: GraphicsRenderer | null;

  setRenderer(renderer: AnyGraphicsRenderer | null): void {
    if (typeof renderer === "string") {
      renderer = this.createRenderer(renderer as GraphicsRendererType);
    }
    (this as Mutable<this>).renderer = renderer;
    this.requireUpdate(View.NeedsRender | View.NeedsComposite);
  }

  protected createRenderer(rendererType: GraphicsRendererType = "canvas"): GraphicsRenderer | null {
    if (rendererType === "canvas") {
      const context = this.canvas.getContext("2d");
      if (context !== null) {
        return new CanvasRenderer(context, Transform.identity(), this.pixelRatio);
      } else {
        throw new Error("Failed to create canvas rendering context");
      }
    } else if (rendererType === "webgl") {
      const context = this.canvas.getContext("webgl");
      if (context !== null) {
        return new WebGLRenderer(context, this.pixelRatio);
      } else {
        throw new Error("Failed to create webgl rendering context");
      }
    } else {
      throw new Error("Failed to create " + rendererType + " renderer");
    }
  }

  protected override needsUpdate(updateFlags: ViewFlags, immediate: boolean): ViewFlags {
    updateFlags = super.needsUpdate(updateFlags, immediate);
    const rasterFlags = updateFlags & (View.NeedsRender | View.NeedsComposite);
    if (rasterFlags !== 0) {
      updateFlags |= View.NeedsComposite;
      this.setFlags(this.flags | View.NeedsDisplay | View.NeedsComposite | rasterFlags);
    }
    return updateFlags;
  }

  protected override needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.flags & View.ProcessMask) === 0 && (processFlags & View.NeedsResize) === 0) {
      processFlags = 0;
    }
    return processFlags;
  }

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.requireUpdate(View.NeedsRender | View.NeedsComposite);
  }

  protected override needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.flags & View.DisplayMask) !== 0) {
      displayFlags |= View.NeedsComposite;
    } else if ((displayFlags & View.NeedsComposite) !== 0) {
      displayFlags = View.NeedsDisplay | View.NeedsComposite;
    } else {
      displayFlags = 0;
    }
    return displayFlags;
  }

  protected override onRender(viewContext: ViewContextType<this>): void {
    const rasterFrame = this.rasterFrame;
    this.resizeCanvas(this.canvas, rasterFrame);
    this.resetRenderer(rasterFrame);
    this.clearCanvas(rasterFrame);
    super.onRender(viewContext);
  }

  protected override didComposite(viewContext: ViewContextType<this>): void {
    this.compositeImage(viewContext);
    super.didComposite(viewContext);
  }

  override extendViewContext(viewContext: GraphicsViewContext): ViewContextType<this> {
    const rasterViewContext = Object.create(viewContext);
    rasterViewContext.compositor = viewContext.renderer;
    rasterViewContext.renderer = this.renderer;
    return rasterViewContext;
  }

  declare readonly viewBounds: R2Box; // getter defined below to work around useDefineForClassFields lunacy

  /** @internal */
  readonly ownRasterFrame: R2Box | null;

  get rasterFrame(): R2Box {
    let rasterFrame = this.ownRasterFrame;
    if (rasterFrame === null) {
      rasterFrame = this.deriveRasterFrame();
    }
    return rasterFrame;
  }

  /** @internal */
  setRasterFrame(rasterFrame: R2Box | null): void {
    (this as Mutable<this>).ownRasterFrame = rasterFrame;
  }

  protected deriveRasterFrame(): R2Box {
    return this.viewBounds;
  }

  protected createCanvas(): HTMLCanvasElement {
    return document.createElement("canvas");
  }

  protected resizeCanvas(canvas: HTMLCanvasElement, rasterFrame: R2Box): void {
    const pixelRatio = this.pixelRatio;
    const newWidth = rasterFrame.width;
    const newHeight = rasterFrame.height;
    const newCanvasWidth = newWidth * pixelRatio;
    const newCanvasHeight = newHeight * pixelRatio;
    const oldCanvasWidth = canvas.width;
    const oldCanvasHeight = canvas.height;
    if (newCanvasWidth !== oldCanvasWidth || newCanvasHeight !== oldCanvasHeight) {
      canvas.width = newCanvasWidth;
      canvas.height = newCanvasHeight;
      canvas.style.width = newWidth + "px";
      canvas.style.height = newHeight + "px";
    }
  }

  protected clearCanvas(rasterFrame: R2Box): void {
    const renderer = this.renderer;
    if (renderer instanceof CanvasRenderer) {
      renderer.context.clearRect(0, 0, rasterFrame.xMax, rasterFrame.yMax);
    } else if (renderer instanceof WebGLRenderer) {
      const context = renderer.context;
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    }
  }

  protected resetRenderer(rasterFrame: R2Box): void {
    const renderer = this.renderer;
    if (renderer instanceof CanvasRenderer) {
      const pixelRatio = this.pixelRatio;
      const dx = rasterFrame.xMin * pixelRatio;
      const dy = rasterFrame.yMin * pixelRatio;
      renderer.context.setTransform(pixelRatio, 0, 0, pixelRatio, -dx, -dy);
      renderer.setTransform(Transform.affine(pixelRatio, 0, 0, pixelRatio, -dx, -dy));
    } else if (renderer instanceof WebGLRenderer) {
      renderer.context.viewport(rasterFrame.x, rasterFrame.y, rasterFrame.xMax, rasterFrame.yMax);
    }
  }

  protected compositeImage(viewContext: ViewContextType<this>): void {
    const compositor = viewContext.compositor;
    if (compositor instanceof CanvasRenderer) {
      const context = compositor.context;
      const rasterFrame = this.rasterFrame;
      const canvas = this.canvas;
      if (rasterFrame.isDefined() && rasterFrame.width !== 0 && rasterFrame.height !== 0 &&
          canvas.width !== 0 && canvas.height !== 0) {
        const globalAlpha = context.globalAlpha;
        const globalCompositeOperation = context.globalCompositeOperation;
        context.globalAlpha = this.opacity.getValue();
        context.globalCompositeOperation = this.compositeOperation.getValue();
        context.drawImage(canvas, rasterFrame.x, rasterFrame.y, rasterFrame.width, rasterFrame.height);
        context.globalAlpha = globalAlpha;
        context.globalCompositeOperation = globalCompositeOperation;
      }
    }
  }

  override init(init: RasterViewInit): void {
    super.init(init);
    if (init.opacity !== void 0) {
      this.opacity(init.opacity);
    }
    if (init.compositeOperation !== void 0) {
      this.compositeOperation(init.compositeOperation);
    }
  }

  static override readonly MountFlags: ViewFlags = GraphicsView.MountFlags | View.NeedsComposite;
  static override readonly UncullFlags: ViewFlags = GraphicsView.UncullFlags | View.NeedsComposite;
  static override readonly UnhideFlags: ViewFlags = GraphicsView.UnhideFlags | View.NeedsComposite;
}
Object.defineProperty(RasterView.prototype, "viewBounds", {
  get(this: RasterView): R2Box {
    return this.deriveViewBounds();
  },
  configurable: true,
});