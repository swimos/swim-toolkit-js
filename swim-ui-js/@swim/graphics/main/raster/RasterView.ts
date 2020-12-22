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
import {AnyGraphicsRenderer, GraphicsRendererType, GraphicsRenderer} from "../graphics/GraphicsRenderer";
import {GraphicsViewContext} from "../graphics/GraphicsViewContext";
import {GraphicsViewInit, GraphicsView} from "../graphics/GraphicsView";
import {LayerView} from "../layer/LayerView";
import {WebGLRenderer} from "../webgl/WebGLRenderer";
import {CanvasCompositeOperation} from "../canvas/CanvasContext";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import {RasterViewContext} from "./RasterViewContext";

export interface RasterViewInit extends GraphicsViewInit {
  opacity?: number;
  compositeOperation?: CanvasCompositeOperation;
}

export class RasterView extends LayerView {
  /** @hidden */
  _canvas: HTMLCanvasElement;
  /** @hidden */
  _renderer: GraphicsRenderer | null | undefined;
  /** @hidden */
  _rasterFrame: BoxR2;

  constructor() {
    super();
    this._canvas = this.createCanvas();
    this._renderer = void 0;
    this._rasterFrame = BoxR2.undefined();
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
  opacity: ViewAnimator<this, number>;

  @ViewAnimator({type: String, state: "source-over"})
  compositeOperation: ViewAnimator<this, CanvasCompositeOperation>;

  get pixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  get compositor(): GraphicsRenderer | null {
    const parentView = this.parentView;
    if (parentView instanceof GraphicsView || parentView instanceof GraphicsView.Canvas) {
      return parentView.renderer;
    } else {
      return null;
    }
  }

  get renderer(): GraphicsRenderer | null {
    let renderer = this._renderer;
    if (renderer === void 0) {
      renderer = this.createRenderer();
      this._renderer = renderer;
    }
    return renderer;
  }

  setRenderer(renderer: AnyGraphicsRenderer | null): void {
    if (typeof renderer === "string") {
      renderer = this.createRenderer(renderer as GraphicsRendererType);
    }
    this._renderer = renderer;
    this.resetRenderer();
  }

  protected createRenderer(rendererType: GraphicsRendererType = "canvas"): GraphicsRenderer | null {
    if (rendererType === "canvas") {
      const context = this._canvas.getContext("2d");
      if (context !== null) {
        return new CanvasRenderer(context, this.pixelRatio);
      } else {
        throw new Error("Failed to create canvas rendering context");
      }
    } else if (rendererType === "webgl") {
      const context = this._canvas.getContext("webgl");
      if (context !== null) {
        return new WebGLRenderer(context, this.pixelRatio);
      } else {
        throw new Error("Failed to create webgl rendering context");
      }
    } else {
      throw new Error("Failed to create " + rendererType + " renderer");
    }
  }

  protected modifyUpdate(targetView: View, updateFlags: ViewFlags): ViewFlags {
    let additionalFlags = 0;
    if ((updateFlags & View.UpdateMask) !== 0) {
      if ((updateFlags & View.ProcessMask) !== 0) {
        additionalFlags |= View.NeedsProcess;
      }
      if ((updateFlags & View.DisplayMask) !== 0) {
        additionalFlags |= View.NeedsDisplay;
      }
      additionalFlags |= View.NeedsRender | View.NeedsComposite;
    }
    return additionalFlags;
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.resizeCanvas(this._canvas);
    this.resetRenderer();
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    this.clearCanvas();
  }

  protected onComposite(viewContext: ViewContextType<this>): void {
    super.onComposite(viewContext);
    this.compositeImage(viewContext);
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
    let viewFrame = this._viewFrame;
    if (viewFrame === void 0) {
      const parentView = this._parentView;
      if (parentView instanceof GraphicsView || parentView instanceof GraphicsView.Canvas) {
        viewFrame = parentView.viewFrame;
      } else {
        viewFrame = BoxR2.undefined();
      }
    }
    return viewFrame;
  }

  get viewFrame(): BoxR2 {
    return this._rasterFrame;
  }

  setViewFrame(viewFrame: BoxR2 | null): void {
    if (viewFrame !== null) {
      this._viewFrame = viewFrame;
    } else if (this._viewFrame !== void 0) {
      this._viewFrame = void 0;
    }
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const compositeFrame = this.compositeFrame;
    x -= Math.floor(compositeFrame.xMin);
    y -= Math.floor(compositeFrame.yMin);

    let hit: GraphicsView | null = null;
    const childViews = this._childViews;
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

  protected resizeCanvas(node: HTMLCanvasElement): void {
    const compositeFrame = this.compositeFrame;
    const xMin = compositeFrame.xMin - Math.floor(compositeFrame.xMin);
    const yMin = compositeFrame.yMin - Math.floor(compositeFrame.yMin);
    const xMax = Math.ceil(xMin + compositeFrame.width);
    const yMax = Math.ceil(yMin + compositeFrame.height);
    const rasterFrame = new BoxR2(xMin, yMin, xMax, yMax);
    if (!this._rasterFrame.equals(rasterFrame)) {
      const pixelRatio = this.pixelRatio;
      node.width = xMax * pixelRatio;
      node.height = yMax * pixelRatio;
      node.style.width = xMax + "px";
      node.style.height = yMax + "px";
      this._rasterFrame = rasterFrame;
    }
  }

  clearCanvas(): void {
    const renderer = this.renderer;
    if (renderer instanceof CanvasRenderer) {
      const rasterFrame = this._rasterFrame;
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
      const rasterFrame = this._rasterFrame;
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
      context.drawImage(this._canvas, x, y, this._canvas.width, this._canvas.height);
      context.restore();
    }
  }

  static create(): RasterView {
    return new RasterView();
  }
}
GraphicsView.Raster = RasterView;
