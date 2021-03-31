// Copyright 2015-2020 Swim inc.
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

import {BoxR2, Transform} from "@swim/math";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import type {AnyGraphicsRenderer, GraphicsRendererType, GraphicsRenderer} from "../graphics/GraphicsRenderer";
import type {GraphicsViewContext} from "../graphics/GraphicsViewContext";
import {GraphicsViewInit, GraphicsView} from "../graphics/GraphicsView";
import {LayerView} from "../layer/LayerView";
import {WebGLRenderer} from "../webgl/WebGLRenderer";
import type {CanvasCompositeOperation} from "../canvas/CanvasContext";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import {CanvasView} from "../canvas/CanvasView";
import type {RasterViewContext} from "./RasterViewContext";

export interface RasterViewInit extends GraphicsViewInit {
  opacity?: number;
  compositeOperation?: CanvasCompositeOperation;
}

export class RasterView extends LayerView {
  constructor() {
    super();
    Object.defineProperty(this, "canvas", {
      value: this.createCanvas(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "renderer", {
      value: this.createRenderer(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "rasterFrame", {
      value: BoxR2.undefined(),
      enumerable: true,
      configurable: true,
    });
  }

  initView(init: RasterViewInit): void {
    super.initView(init);
    if (init.opacity !== void 0) {
      this.opacity(init.opacity);
    }
    if (init.compositeOperation !== void 0) {
      this.compositeOperation(init.compositeOperation);
    }
  }

  @ViewAnimator({type: Number, state: 1})
  declare opacity: ViewAnimator<this, number>;

  @ViewAnimator({type: String, state: "source-over"})
  declare compositeOperation: ViewAnimator<this, CanvasCompositeOperation>;

  get pixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  /** @hidden */
  declare readonly canvas: HTMLCanvasElement;

  get compositor(): GraphicsRenderer | null {
    const parentView = this.parentView;
    if (parentView instanceof GraphicsView || parentView instanceof CanvasView) {
      return parentView.renderer;
    } else {
      return null;
    }
  }

  // @ts-ignore
  declare readonly renderer: GraphicsRenderer | null;

  setRenderer(renderer: AnyGraphicsRenderer | null): void {
    if (typeof renderer === "string") {
      renderer = this.createRenderer(renderer as GraphicsRendererType);
    }
    Object.defineProperty(this, "renderer", {
      value: renderer,
      enumerable: true,
      configurable: true,
    });
    this.resetRenderer();
  }

  protected createRenderer(rendererType: GraphicsRendererType = "canvas"): GraphicsRenderer | null {
    if (rendererType === "canvas") {
      const context = this.canvas.getContext("2d");
      if (context !== null) {
        return new CanvasRenderer(context, this.pixelRatio, this.theme.state, this.mood.state);
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

  protected didRequestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    super.didRequestUpdate(targetView, updateFlags, immediate);
    this.requireUpdate(View.NeedsRender | View.NeedsComposite);
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.ProcessMask) !== 0 || (processFlags & View.NeedsResize) !== 0) {
      this.requireUpdate(View.NeedsRender | View.NeedsComposite);
    } else {
      processFlags = 0;
    }
    return processFlags;
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeCanvas(this.canvas);
    this.resetRenderer();
    this.requireUpdate(View.NeedsRender | View.NeedsComposite);
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.DisplayMask) !== 0) {
      displayFlags |= View.NeedsRender | View.NeedsComposite;
    } else if ((displayFlags & View.NeedsComposite) !== 0) {
      displayFlags = View.NeedsDisplay | View.NeedsComposite;
    } else {
      displayFlags = 0;
    }
    return displayFlags;
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.resizeCanvas(this.canvas);
    this.resetRenderer();
  }

  protected willRender(viewContext: ViewContextType<this>): void {
    super.willRender(viewContext);
    this.clearCanvas();
  }

  protected didComposite(viewContext: ViewContextType<this>): void {
    this.compositeImage(viewContext);
    super.didComposite(viewContext);
  }

  protected onSetHidden(hidden: boolean): void {
    if (!hidden) {
      this.requireUpdate(View.NeedsRender | View.NeedsComposite);
    }
  }

  extendViewContext(viewContext: GraphicsViewContext): ViewContextType<this> {
    const rasterViewContext = Object.create(viewContext);
    rasterViewContext.compositor = viewContext.renderer;
    rasterViewContext.renderer = this.renderer;
    return rasterViewContext;
  }

  // @ts-ignore
  declare readonly viewContext: RasterViewContext;

  /** @hidden */
  get compositeFrame(): BoxR2 {
    let viewFrame = this.ownViewFrame;
    if (viewFrame === null) {
      const parentView = this.parentView;
      if (parentView instanceof GraphicsView || parentView instanceof CanvasView) {
        viewFrame = parentView.viewFrame;
      } else {
        viewFrame = BoxR2.undefined();
      }
    }
    return viewFrame;
  }

  /** @hidden */
  declare readonly rasterFrame: BoxR2;

  get viewFrame(): BoxR2 {
    return this.rasterFrame;
  }

  setViewFrame(viewFrame: BoxR2 | null): void {
    Object.defineProperty(this, "ownViewFrame", {
      value: viewFrame,
      enumerable: true,
      configurable: true,
    });
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const compositeFrame = this.compositeFrame;
    x -= Math.floor(compositeFrame.xMin);
    y -= Math.floor(compositeFrame.yMin);

    let hit: GraphicsView | null = null;
    const childViews = this.childViews;
    for (let i = childViews.length - 1; i >= 0; i -= 1) {
      const childView = childViews[i];
      if (childView instanceof GraphicsView && !childView.isHidden() && !childView.isCulled()) {
        const hitBounds = childView.hitBounds;
        if (hitBounds.contains(x, y)) {
          hit = childView.hitTest(x, y, viewContext);
          if (hit !== null) {
            break;
          }
        }
      }
    }
    return hit;
  }

  get parentTransform(): Transform {
    const compositeFrame = this.compositeFrame;
    const dx = Math.floor(compositeFrame.xMin);
    const dy = Math.floor(compositeFrame.yMin);
    if (dx !== 0 || dy !== 0) {
      return Transform.translate(-dx, -dy);
    }
    return Transform.identity();
  }

  protected createCanvas(): HTMLCanvasElement {
    return document.createElement("canvas");
  }

  protected resizeCanvas(canvas: HTMLCanvasElement): void {
    const compositeFrame = this.compositeFrame;
    const xMin = compositeFrame.xMin - Math.floor(compositeFrame.xMin);
    const yMin = compositeFrame.yMin - Math.floor(compositeFrame.yMin);
    const xMax = Math.ceil(xMin + compositeFrame.width);
    const yMax = Math.ceil(yMin + compositeFrame.height);
    const rasterFrame = new BoxR2(xMin, yMin, xMax, yMax);
    if (!this.rasterFrame.equals(rasterFrame)) {
      const pixelRatio = this.pixelRatio;
      canvas.width = xMax * pixelRatio;
      canvas.height = yMax * pixelRatio;
      canvas.style.width = xMax + "px";
      canvas.style.height = yMax + "px";
      Object.defineProperty(this, "rasterFrame", {
        value: rasterFrame,
        enumerable: true,
        configurable: true,
      });
    }
  }

  clearCanvas(): void {
    const renderer = this.renderer;
    if (renderer instanceof CanvasRenderer) {
      const rasterFrame = this.rasterFrame;
      renderer.context.clearRect(0, 0, rasterFrame.xMax, rasterFrame.yMax);
    } else if (renderer instanceof WebGLRenderer) {
      const context = renderer.context;
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    }
  }

  resetRenderer(): void {
    const renderer = this.renderer;
    if (renderer instanceof CanvasRenderer) {
      const pixelRatio = this.pixelRatio;
      renderer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    } else if (renderer instanceof WebGLRenderer) {
      const rasterFrame = this.rasterFrame;
      renderer.context.viewport(0, 0, rasterFrame.xMax, rasterFrame.yMax);
    }
  }

  protected compositeImage(viewContext: ViewContextType<this>): void {
    const compositor = viewContext.compositor;
    const renderer = viewContext.renderer;
    if (compositor instanceof CanvasRenderer && renderer instanceof CanvasRenderer) {
      const compositeFrame = this.compositeFrame;
      const context = compositor.context;
      context.save();
      context.globalAlpha = this.opacity.getValue();
      context.globalCompositeOperation = this.compositeOperation.getValue();
      const x = Math.floor(compositeFrame.x);
      const y = Math.floor(compositeFrame.y);
      context.drawImage(this.canvas, x, y, compositeFrame.width, compositeFrame.height);
      context.restore();
    }
  }

  static create(): RasterView {
    return new RasterView();
  }

  static readonly mountFlags: ViewFlags = LayerView.mountFlags | View.NeedsRender | View.NeedsComposite;
  static readonly powerFlags: ViewFlags = LayerView.powerFlags | View.NeedsRender | View.NeedsComposite;
  static readonly uncullFlags: ViewFlags = LayerView.uncullFlags | View.NeedsRender | View.NeedsComposite;
}
