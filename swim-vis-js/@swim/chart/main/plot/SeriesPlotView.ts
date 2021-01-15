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

import {Values} from "@swim/util";
import {BTree} from "@swim/collections";
import type {BoxR2} from "@swim/math";
import {ContinuousScale} from "@swim/scale";
import type {Tween} from "@swim/animation";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import {GraphicsView, CanvasContext, CanvasRenderer} from "@swim/graphics";
import type {DataPointCategory} from "../data/DataPoint";
import {AnyDataPointView, DataPointView} from "../data/DataPointView";
import {ScaleViewAnimator} from "../scale/ScaleViewAnimator";
import {PlotViewInit, PlotView} from "./PlotView";
import type {PlotViewObserver} from "./PlotViewObserver";
import type {PlotViewController} from "./PlotViewController";

export type SeriesPlotHitMode = "domain" | "plot" | "data" | "none";

export type SeriesPlotType = "line" | "area";

export type AnySeriesPlotView<X, Y> = SeriesPlotView<X, Y> | SeriesPlotViewInit<X, Y> | SeriesPlotType;

export interface SeriesPlotViewInit<X, Y> extends PlotViewInit<X, Y> {
  plotType?: SeriesPlotType;
  hitMode?: SeriesPlotHitMode;
}

export abstract class SeriesPlotView<X, Y> extends GraphicsView implements PlotView<X, Y> {
  /** @hidden */
  readonly _data: BTree<X, DataPointView<X, Y>>;
  /** @hidden */
  _xDataDomain: [X, X] | undefined;
  /** @hidden */
  _yDataDomain: [Y, Y] | undefined;
  /** @hidden */
  _xDataRange: [number, number] | undefined;
  /** @hidden */
  _yDataRange: [number, number] | undefined;
  /** @hidden */
  _hitMode: SeriesPlotHitMode;
  /** @hidden */
  _gradientStops: number;

  constructor() {
    super();
    this._data = new BTree();
    this._xDataDomain = void 0;
    this._yDataDomain = void 0;
    this._xDataRange = void 0;
    this._yDataRange = void 0;
    this._hitMode = "domain";
    this._gradientStops = 0;
  }

  declare readonly viewController: PlotViewController<X, Y> | null;

  declare readonly viewObservers: ReadonlyArray<PlotViewObserver<X, Y>>;

  initView(init: SeriesPlotViewInit<X, Y>): void {
    super.initView(init);
    if (init.xScale !== void 0) {
      this.xScale(init.xScale);
    }
    if (init.yScale !== void 0) {
      this.yScale(init.yScale);
    }

    const data = init.data;
    if (data !== void 0) {
      for (let i = 0, n = data.length; i < n; i += 1) {
        this.insertDataPoint(data[i]!);
      }
    }

    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }

    if (init.hitMode !== void 0) {
      this.hitMode(init.hitMode);
    }
  }

  abstract get plotType(): SeriesPlotType;

  getDataPoint(x: X): DataPointView<X, Y> | undefined {
    return this._data.get(x);
  }

  insertDataPoint(point: AnyDataPointView<X, Y>): DataPointView<X, Y> {
    point = DataPointView.fromAny(point);
    point.remove();
    this.willInsertChildView(point, null);
    this._data.set(point.x.getState(), point);
    point.setParentView(this, null);
    this.onInsertChildView(point, null);
    this.didInsertChildView(point, null);
    point.cascadeInsert();
    return point;
  }

  insertDataPoints(...points: AnyDataPointView<X, Y>[]): void {
    for (let i = 0, n = arguments.length; i < n; i += 1) {
      this.insertDataPoint(arguments[i]);
    }
  }

  removeDataPoint(x: X): DataPointView<X, Y> | null {
    const point = this._data.get(x);
    if (point !== void 0) {
      if (point.parentView !== this) {
        throw new Error("not a child view");
      }
      this.willRemoveChildView(point);
      point.setParentView(null, this);
      this._data.delete(x);
      this.onRemoveChildView(point);
      this.didRemoveChildView(point);
      point.setKey(void 0);
      return point;
    }
    return null;
  }

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true})
  declare xScale: ScaleViewAnimator<this, X, number>;

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true})
  declare yScale: ScaleViewAnimator<this, Y, number>;

  xDomain(): readonly [X, X] | undefined;
  xDomain(xDomain: readonly [X, X] | string | undefined, tween?: Tween<ContinuousScale<X, number>>): this;
  xDomain(xMin: X, xMax: X, tween: Tween<ContinuousScale<X, number>>): this;
  xDomain(xMin?: readonly [X, X] | X | string, xMax?: X | Tween<ContinuousScale<X, number>>,
          tween?: Tween<ContinuousScale<X, number>>): readonly [X, X] | undefined | this {
    if (arguments.length === 0) {
      const xScale = this.xScale.value;
      return xScale !== void 0 ? xScale.domain() : void 0;
    } else {
      this.xScale.setDomain(xMin as any, xMax as any, tween);
      return this;
    }
  }

  yDomain(): readonly [Y, Y] | undefined;
  yDomain(yDomain: readonly [Y, Y] | string | undefined, tween?: Tween<ContinuousScale<Y, number>>): this;
  yDomain(yMin: Y, yMax: Y, tween: Tween<ContinuousScale<Y, number>>): this;
  yDomain(yMin?: readonly [Y, Y] | Y | string, yMax?: Y | Tween<ContinuousScale<Y, number>>,
          tween?: Tween<ContinuousScale<Y, number>>): readonly [Y, Y] | undefined | this {
    if (arguments.length === 0) {
      const yScale = this.yScale.value;
      return yScale !== void 0 ? yScale.domain() : void 0;
    } else {
      this.yScale.setDomain(yMin as any, yMax as any, tween);
      return this;
    }
  }

  xRange(): readonly [number, number] | undefined {
    const xScale = this.xScale.value;
    return xScale !== void 0 ? xScale.range() : void 0;
  }

  yRange(): readonly [number, number] | undefined {
    const yScale = this.yScale.value;
    return yScale !== void 0 ? yScale.range() : void 0;
  }

  xDataDomain(): readonly [X, X] | undefined {
    let xDataDomain = this._xDataDomain;
    if (xDataDomain === void 0) {
      const xDataDomainMin = this._data.firstKey();
      const xDataDomainMax = this._data.lastKey();
      if (xDataDomainMin !== void 0 && xDataDomainMax !== void 0) {
        xDataDomain = [xDataDomainMin, xDataDomainMax];
        this._xDataDomain = xDataDomain;
      }
    }
    return xDataDomain;
  }

  yDataDomain(): readonly [Y, Y] | undefined {
    let yDataDomain = this._yDataDomain;
    if (yDataDomain === void 0) {
      let yDataDomainMin: Y | undefined;
      let yDataDomainMax: Y | undefined;
      this._data.forEachValue(function (point: DataPointView<X, Y>): void {
        const y = point.y.value;
        if (yDataDomainMin === void 0 || Values.compare(y, yDataDomainMin) < 0) {
          yDataDomainMin = y;
        }
        if (yDataDomainMax === void 0 || Values.compare(yDataDomainMax, y) < 0) {
          yDataDomainMax = y;
        }
      }, this);
      if (yDataDomainMin !== void 0 && yDataDomainMax !== void 0) {
        yDataDomain = [yDataDomainMin, yDataDomainMax];
        this._yDataDomain = yDataDomain;
      }
    }
    return yDataDomain;
  }

  xDataRange(): readonly [number, number] | undefined {
    return this._xDataRange;
  }

  yDataRange(): readonly [number, number] | undefined {
    return this._yDataRange;
  }

  hitMode(): SeriesPlotHitMode;
  hitMode(hitMode: SeriesPlotHitMode): this;
  hitMode(hitMode?: SeriesPlotHitMode): SeriesPlotHitMode | this {
    if (hitMode === void 0) {
      return this._hitMode;
    } else {
      this._hitMode = hitMode;
      return this;
    }
  }

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  get childViewCount(): number {
    return this._data.size;
  }

  get childViews(): ReadonlyArray<View> {
    const childViews: View[] = [];
    this._data.forEachValue(function (childView: DataPointView<X, Y>): void {
      childViews.push(childView);
    }, this);
    return childViews;
  }

  firstChildView(): View | null {
    const childView = this._data.firstValue();
    return childView !== void 0 ? childView : null;
  }

  lastChildView(): View | null {
    const childView = this._data.lastValue();
    return childView !== void 0 ? childView : null;
  }

  nextChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const childView = this._data.nextValue(targetView.x.state);
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  previousChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const childView = this._data.previousValue(targetView.x.state);
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  forEachChildView<T>(callback: (childView: View) => T | void): T | undefined;
  forEachChildView<T, S>(callback: (this: S, childView: View) => T | void,
                         thisArg: S): T | undefined;
  forEachChildView<T, S>(callback: (this: S | undefined, childView: View) => T | void,
                         thisArg?: S): T | undefined {
    return this._data.forEachValue(callback, thisArg);
  }

  getChildView(key: string): View | null {
    return null;
  }

  setChildView(key: string, newChildView: View | null): View | null {
    throw new Error("unsupported");
  }

  appendChildView(childView: View, key?: string): void {
    if (key !== void 0) {
      throw new Error("unsupported");
    }
    if (!(childView instanceof DataPointView)) {
      throw new TypeError("" + childView);
    }
    this.insertDataPoint(childView);
  }

  prependChildView(childView: View, key?: string): void {
    if (key !== void 0) {
      throw new Error("unsupported");
    }
    if (!(childView instanceof DataPointView)) {
      throw new TypeError("" + childView);
    }
    this.insertDataPoint(childView);
  }

  insertChildView(childView: View, targetView: View | null, key?: string): void {
    if (key !== void 0) {
      throw new Error("unsupported");
    }
    if (!(childView instanceof DataPointView)) {
      throw new TypeError("" + childView);
    }
    this.insertDataPoint(childView);
  }

  removeChildView(key: string): View | null;
  removeChildView(childView: View): void;
  removeChildView(childView: string | View): View | null | void {
    if (typeof childView === "string") {
      throw new Error("unsupported");
    }
    if (!(childView instanceof DataPointView)) {
      throw new TypeError("" + childView);
    }
    this.removeDataPoint(childView.x.getState());
  }

  removeAll(): void {
    this._data.forEach(function (x: X, childView: DataPointView<X, Y>): void {
      this.willRemoveChildView(childView);
      childView.setParentView(null, this);
      this._data.delete(x);
      this.onRemoveChildView(childView);
      this.didRemoveChildView(childView);
      childView.setKey(void 0);
    }, this);
  }

  protected onRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    super.onRequireUpdate(updateFlags, immediate);
    const parentView = this.parentView;
    if (parentView !== null) {
      parentView.requireUpdate(updateFlags & View.NeedsAnimate);
    }
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsLayout) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected willResize(viewContext: ViewContextType<this>): void {
    super.willResize(viewContext);
    this.resizeScales(this.viewFrame);
  }

  /**
   * Updates own scale ranges to project onto view frame.
   */
  protected resizeScales(frame: BoxR2): void {
    const xScale = this.xScale.ownValue;
    if (xScale !== void 0 && xScale.range()[1] !== frame.width) {
      this.xScale.setRange(0, frame.width);
    }
    const yScale = this.yScale.ownValue;
    if (yScale !== void 0 && yScale.range()[1] !== frame.height) {
      this.yScale.setRange(0, frame.height);
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    let xScale: ContinuousScale<X, number> | undefined;
    let yScale: ContinuousScale<Y, number> | undefined;
    if ((processFlags & View.NeedsAnimate) !== 0 &&
        (xScale = this.xScale.value, xScale !== void 0) &&
        (yScale = this.yScale.value, yScale !== void 0)) {
      this.animateChildViews(xScale, yScale, processFlags, viewContext, processChildView);
    } else {
      super.processChildViews(processFlags, viewContext, processChildView);
    }
  }

  protected animateChildViews(xScale: ContinuousScale<X, number>,
                              yScale: ContinuousScale<Y, number>,
                              processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    // Compute domain and range extrema while animating child views.
    const frame = this.viewFrame;
    let point0: DataPointView<X, Y> | undefined;
    let point1: DataPointView<X, Y> | undefined;
    let y0: Y | undefined;
    let y1: Y | undefined;
    let xDomainMin: X | undefined;
    let yDomainMin: Y | undefined;
    let xDomainMax: X | undefined;
    let yDomainMax: Y | undefined;
    let xRangeMin: number | undefined;
    let yRangeMin: number | undefined;
    let xRangeMax: number | undefined;
    let yRangeMax: number | undefined;
    let gradientStops = 0;

    type self = this;
    function animateChildView(this: self, childView: View, processFlags: ViewFlags,
                              viewContext: ViewContextType<self>): void {
      const point2 = childView as DataPointView<X, Y>;
      const x2 = point2.x.getValue();
      const y2 = point2.y.getValue();
      const dy2 = point2.y2.value;

      const sx2 = xScale.scale(x2);
      const sy2 = yScale.scale(y2);
      point2._xCoord = frame.xMin + sx2;
      point2._yCoord = frame.yMin + sy2;

      const sdy2 = dy2 !== void 0 ? yScale!.scale(dy2) : void 0;
      if (sdy2 !== void 0) {
        point2._y2Coord = frame.yMin + sdy2;
      } else if (point2._y2Coord !== void 0) {
        point2._y2Coord = void 0;
      }

      if (point2.isGradientStop()) {
        gradientStops += 1;
      }

      if (point1 !== void 0) {
        let category: DataPointCategory;
        if (point0 !== void 0) {
          // categorize mid point
          if (Values.compare(y0!, y1!) < 0 && Values.compare(y2, y1!) < 0) {
            category = "maxima";
          } else if (Values.compare(y1!, y0!) < 0 && Values.compare(y1!, y2) < 0) {
            category = "minima";
          } else if (Values.compare(y0!, y1!) < 0 && Values.compare(y1!, y2) < 0) {
            category = "increasing";
          } else if (Values.compare(y1!, y0!) < 0 && Values.compare(y2, y1!) < 0) {
            category = "decreasing";
          } else {
            category = "flat";
          }
        } else {
          // categorize start point
          if (Values.compare(y1!, y2) < 0) {
            category = "increasing";
          } else if (Values.compare(y2, y1!) < 0) {
            category = "decreasing";
          } else {
            category = "flat";
          }
        }
        point1.category(category);

        // compute extrema
        if (Values.compare(y2, yDomainMin!) < 0) {
          yDomainMin = y2;
        } else if (Values.compare(yDomainMax!, y2) < 0) {
          yDomainMax = y2;
        }
        if (dy2 !== void 0) {
          if (Values.compare(dy2, yDomainMin!) < 0) {
            yDomainMin = dy2;
          } else if (Values.compare(yDomainMax!, dy2) < 0) {
            yDomainMax = dy2;
          }
        }
        if (sy2 < yRangeMin!) {
          yRangeMin = sy2;
        } else if (sy2 > yRangeMax!) {
          yRangeMax = sy2;
        }
      } else {
        xDomainMin = x2;
        yDomainMin = y2;
        yDomainMax = y2;
        xRangeMin = sx2;
        yRangeMin = sy2;
        yRangeMax = sy2;
      }

      point0 = point1;
      point1 = point2;
      y0 = y1;
      y1 = y2;
      xDomainMax = x2;
      xRangeMax = sx2;

      processChildView.call(this, childView, processFlags, viewContext);
    }
    super.processChildViews(processFlags, viewContext, animateChildView);

    if (point1 !== void 0) {
      let category: DataPointCategory;
      if (point0 !== void 0) {
        // categorize end point
        if (Values.compare(y0!, y1!) < 0) {
          category = "increasing";
        } else if (Values.compare(y1!, y0!) < 0) {
          category = "decreasing";
        } else {
          category = "flat";
        }
      } else {
        // categorize only point
        category = "flat";
      }
      point1.category(category);

      // update extrema
      let xDataDomain = this._xDataDomain;
      if (xDataDomain === void 0) {
        xDataDomain = [xDomainMin!, xDomainMax!];
        this._xDataDomain = xDataDomain;
      } else {
        xDataDomain[0] = xDomainMin!;
        xDataDomain[1] = xDomainMax!;
      }
      let yDataDomain = this._yDataDomain;
      if (yDataDomain === void 0) {
        yDataDomain = [yDomainMin!, yDomainMax!];
        this._yDataDomain = yDataDomain;
      } else {
        yDataDomain[0] = yDomainMin!;
        yDataDomain[1] = yDomainMax!;
      }
      let xDataRange = this._xDataRange;
      if (xDataRange === void 0) {
        xDataRange = [xRangeMin!, xRangeMax!];
        this._xDataRange = xDataRange;
      } else {
        xDataRange[0] = xRangeMin!;
        xDataRange[1] = xRangeMax!;
      }
      let yDataRange = this._yDataRange;
      if (yDataRange === void 0) {
        yDataRange = [yRangeMin!, yRangeMax!];
        this._yDataRange = yDataRange;
      } else {
        yDataRange[0] = yRangeMin!;
        yDataRange[1] = yRangeMax!;
      }
    } else {
      this._xDataDomain = void 0;
      this._yDataDomain = void 0;
      this._xDataRange = void 0;
      this._yDataRange = void 0;
    }
    this._gradientStops = gradientStops;

    // We don't need to run the layout phase unless the view frame changes
    // between now and the display pass.
    this.setViewFlags(this.viewFlags & ~View.NeedsLayout);
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.NeedsLayout) === 0) {
      displayFlags &= ~View.NeedsLayout;
    }
    return displayFlags;
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    let xScale: ContinuousScale<X, number> | undefined;
    let yScale: ContinuousScale<Y, number> | undefined;
    if ((displayFlags & View.NeedsLayout) !== 0 &&
        (xScale = this.xScale.value, xScale !== void 0) &&
        (yScale = this.yScale.value, yScale !== void 0)) {
      this.layoutChildViews(xScale, yScale, displayFlags, viewContext, displayChildView);
    } else {
      super.displayChildViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(xScale: ContinuousScale<X, number>,
                             yScale: ContinuousScale<Y, number>,
                             displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    // Recompute range extrema when laying out child views.
    const frame = this.viewFrame;
    let point0: DataPointView<X, Y> | undefined;
    let xRangeMin: number | undefined;
    let yRangeMin: number | undefined;
    let xRangeMax: number | undefined;
    let yRangeMax: number | undefined;

    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      const point1 = childView as DataPointView<X, Y>;
      const x1 = point1.x.getValue();
      const y1 = point1.y.getValue();
      const dy1 = point1.y2.value;

      const sx1 = xScale.scale(x1);
      const sy1 = yScale.scale(y1);
      point1._xCoord = frame.xMin + sx1;
      point1._yCoord = frame.yMin + sy1;

      const sdy1 = dy1 !== void 0 ? yScale!.scale(dy1) : void 0;
      if (sdy1 !== void 0) {
        point1._y2Coord = frame.yMin + sdy1;
      } else if (point1._y2Coord !== void 0) {
        point1._y2Coord = void 0;
      }

      if (point0 !== void 0) {
        // compute extrema
        if (sy1 < yRangeMin!) {
          yRangeMin = sy1;
        } else if (sy1 > yRangeMax!) {
          yRangeMax = sy1;
        }
      } else {
        xRangeMin = sx1;
        yRangeMin = sy1;
        yRangeMax = sy1;
      }

      point0 = point1;
      xRangeMax = sx1;

      displayChildView.call(this, childView, displayFlags, viewContext);
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);

    if (point0 !== void 0) {
      // update extrema
      let xDataRange = this._xDataRange;
      if (xDataRange === void 0) {
        xDataRange = [xRangeMin!, xRangeMax!];
        this._xDataRange = xDataRange;
      } else {
        xDataRange[0] = xRangeMin!;
        xDataRange[1] = xRangeMax!;
      }
      let yDataRange = this._yDataRange;
      if (yDataRange === void 0) {
        yDataRange = [yRangeMin!, yRangeMax!];
        this._yDataRange = yDataRange;
      } else {
        yDataRange[0] = yRangeMin!;
        yDataRange[1] = yRangeMax!;
      }
    } else {
      this._xDataRange = void 0;
      this._yDataRange = void 0;
    }
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      this.renderPlot(context, this.viewFrame);
    }
  }

  protected abstract renderPlot(context: CanvasContext, frame: BoxR2): void;

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit: GraphicsView | null = null;
    if (this._hitMode !== "none") {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        x *= renderer.pixelRatio;
        y *= renderer.pixelRatio;
        if (this._hitMode === "domain") {
          hit = this.hitTestDomain(x, y, renderer);
        } else {
          hit = this.hitTestPlot(x, y, renderer);
        }
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestDomain(x: number, y: number, renderer: CanvasRenderer): GraphicsView | null {
    const xScale = this.xScale.value;
    if (xScale !== void 0) {
      const d = xScale.unscale(x / renderer.pixelRatio - this.viewFrame.xMin);
      const x0 = this._data.previousValue(d);
      const x1 = this._data.nextValue(d);
      const dx0 = x0 !== void 0 ? +d - +x0.x.getState() : NaN;
      const dx1 = x1 !== void 0 ? +x1.x.getState() - +d : NaN;
      if (dx0 <= dx1) {
        return x0!;
      } else if (dx0 > dx1) {
        return x1!;
      } else if (x0 !== void 0) {
        return x0!;
      } else if (x1 !== void 0) {
        return x1!;
      }
    }
    return null;
  }

  protected abstract hitTestPlot(x: number, y: number, renderer: CanvasRenderer): GraphicsView | null;

  static fromType<X, Y>(type: SeriesPlotType): SeriesPlotView<X, Y> {
    if (type === "line") {
      return new PlotView.Line();
    } else if (type === "area") {
      return new PlotView.Area();
    }
    throw new TypeError("" + type);
  }

  static fromInit<X, Y>(init: SeriesPlotViewInit<X, Y>): SeriesPlotView<X, Y> {
    const type = init.plotType;
    if (type === "line") {
      return PlotView.Line.fromInit(init);
    } else if (type === "area") {
      return PlotView.Area.fromInit(init);
    }
    throw new TypeError("" + init);
  }

  static fromAny<X, Y>(value: AnySeriesPlotView<X, Y>): SeriesPlotView<X, Y> {
    if (value instanceof SeriesPlotView) {
      return value;
    } else if (typeof value === "string") {
      return this.fromType(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static readonly insertChildFlags: ViewFlags = GraphicsView.insertChildFlags | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = GraphicsView.removeChildFlags | View.NeedsAnimate;
}
PlotView.Series = SeriesPlotView;
