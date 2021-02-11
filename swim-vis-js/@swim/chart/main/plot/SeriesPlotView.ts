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
import {Domain, Range, AnyTiming, ContinuousScale} from "@swim/mapping";
import {BTree} from "@swim/collections";
import type {BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewProperty, ViewAnimator} from "@swim/view";
import {GraphicsView, CanvasContext, CanvasRenderer} from "@swim/graphics";
import type {DataPointCategory} from "../data/DataPoint";
import {AnyDataPointView, DataPointView} from "../data/DataPointView";
import {ScaleViewAnimator} from "../scale/ScaleViewAnimator";
import type {PlotViewInit, PlotView} from "./PlotView";
import type {PlotViewObserver} from "./PlotViewObserver";
import type {PlotViewController} from "./PlotViewController";
import {AreaPlotView} from "../"; // forward import
import {LinePlotView} from "../"; // forward import

export type SeriesPlotHitMode = "domain" | "plot" | "data" | "none";

export type SeriesPlotType = "line" | "area";

export type AnySeriesPlotView<X, Y> = SeriesPlotView<X, Y> | SeriesPlotViewInit<X, Y> | SeriesPlotType;

export interface SeriesPlotViewInit<X, Y> extends PlotViewInit<X, Y> {
  plotType?: SeriesPlotType;
  hitMode?: SeriesPlotHitMode;
}

export abstract class SeriesPlotView<X, Y> extends GraphicsView implements PlotView<X, Y> {
  constructor() {
    super();
    Object.defineProperty(this, "data", {
      value: new BTree(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "gradientStops", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
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

  abstract readonly plotType: SeriesPlotType;

  /** @hidden */
  declare readonly data: BTree<X, DataPointView<X, Y>>;

  getDataPoint(x: X): DataPointView<X, Y> | undefined {
    return this.data.get(x);
  }

  insertDataPoint(point: AnyDataPointView<X, Y>): DataPointView<X, Y> {
    point = DataPointView.fromAny(point);
    point.remove();
    this.willInsertChildView(point, null);
    this.data.set(point.x.getState(), point);
    point.setParentView(this, null);
    this.onInsertChildView(point, null);
    this.didInsertChildView(point, null);
    point.cascadeInsert();
    return point;
  }

  insertDataPoints(...points: AnyDataPointView<X, Y>[]): void {
    for (let i = 0, n = points.length; i < n; i += 1) {
      this.insertDataPoint(points[i]!);
    }
  }

  removeDataPoint(x: X): DataPointView<X, Y> | null {
    const point = this.data.get(x);
    if (point !== void 0) {
      if (point.parentView !== this) {
        throw new Error("not a child view");
      }
      this.willRemoveChildView(point);
      point.setParentView(null, this);
      this.data.delete(x);
      this.onRemoveChildView(point);
      this.didRemoveChildView(point);
      point.setKey(void 0);
      return point;
    }
    return null;
  }

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true, updateFlags: View.NeedsAnimate | View.NeedsLayout})
  declare xScale: ScaleViewAnimator<this, X, number>;

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true, updateFlags: View.NeedsAnimate | View.NeedsLayout})
  declare yScale: ScaleViewAnimator<this, Y, number>;

  xDomain(): Domain<X> | undefined;
  xDomain(xDomain: Domain<X> | string | undefined, timing?: AnyTiming | boolean): this;
  xDomain(xMin: X, xMax: X, timing: AnyTiming | boolean): this;
  xDomain(xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<X> | undefined | this {
    if (arguments.length === 0) {
      const xScale = this.xScale.value;
      return xScale !== void 0 ? xScale.domain : void 0;
    } else {
      this.xScale.setDomain(xMin as any, xMax as any, timing);
      return this;
    }
  }

  yDomain(): Domain<Y> | undefined;
  yDomain(yDomain: Domain<Y> | string | undefined, timing?: AnyTiming | boolean): this;
  yDomain(yMin: Y, yMax: Y, timing: AnyTiming | boolean): this;
  yDomain(yMin?: Domain<Y> | Y | string, yMax?: Y | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<Y> | undefined | this {
    if (arguments.length === 0) {
      const yScale = this.yScale.value;
      return yScale !== void 0 ? yScale.domain : void 0;
    } else {
      this.yScale.setDomain(yMin as any, yMax as any, timing);
      return this;
    }
  }

  xRange(): Range<number> | undefined {
    const xScale = this.xScale.value;
    return xScale !== void 0 ? xScale.range : void 0;
  }

  yRange(): Range<number> | undefined {
    const yScale = this.yScale.value;
    return yScale !== void 0 ? yScale.range : void 0;
  }

  @ViewProperty({type: Object})
  declare xDataDomain: ViewProperty<this, readonly [X, X] | undefined>;

  /** @hidden */
  getXDataDomain(): readonly [X, X] | undefined {
    let xDataDomain = this.xDataDomain.state;
    if (xDataDomain === void 0) {
      const xDataDomainMin = this.data.firstKey();
      const xDataDomainMax = this.data.lastKey();
      if (xDataDomainMin !== void 0 && xDataDomainMax !== void 0) {
        xDataDomain = [xDataDomainMin, xDataDomainMax];
        this.xDataDomain.setState(xDataDomain);
      }
    }
    return xDataDomain;
  }

  @ViewProperty({type: Object})
  declare yDataDomain: ViewProperty<this, readonly [Y, Y] | undefined>;

  /** @hidden */
  getYDataDomain(): readonly [Y, Y] | undefined {
    let yDataDomain = this.yDataDomain.state;
    if (yDataDomain === void 0) {
      let yDataDomainMin: Y | undefined;
      let yDataDomainMax: Y | undefined;
      this.data.forEachValue(function (point: DataPointView<X, Y>): void {
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
        this.yDataDomain.setState(yDataDomain);
      }
    }
    return yDataDomain;
  }

  @ViewProperty({type: Object})
  declare xDataRange: ViewProperty<this, readonly [number, number] | undefined>;

  @ViewProperty({type: Object})
  declare yDataRange: ViewProperty<this, readonly [number, number] | undefined>;

  @ViewProperty({type: String, state: "domain"})
  declare hitMode: ViewProperty<this, SeriesPlotHitMode>;

  /** @hidden */
  declare readonly gradientStops: number;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  get childViewCount(): number {
    return this.data.size;
  }

  get childViews(): ReadonlyArray<View> {
    const childViews: View[] = [];
    this.data.forEachValue(function (childView: DataPointView<X, Y>): void {
      childViews.push(childView);
    }, this);
    return childViews;
  }

  firstChildView(): View | null {
    const childView = this.data.firstValue();
    return childView !== void 0 ? childView : null;
  }

  lastChildView(): View | null {
    const childView = this.data.lastValue();
    return childView !== void 0 ? childView : null;
  }

  nextChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const childView = this.data.nextValue(targetView.x.state);
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  previousChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const childView = this.data.previousValue(targetView.x.state);
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
    return this.data.forEachValue(callback, thisArg);
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
    this.data.forEach(function (x: X, childView: DataPointView<X, Y>): void {
      this.willRemoveChildView(childView);
      childView.setParentView(null, this);
      this.data.delete(x);
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
    const xScale = !this.xScale.isInherited() ? this.xScale.ownValue : void 0;
    if (xScale !== void 0 && xScale.range[1] !== frame.width) {
      this.xScale.setRange(0, frame.width);
    }
    const yScale = !this.yScale.isInherited() ? this.yScale.ownValue : void 0;
    if (yScale !== void 0 && yScale.range[1] !== frame.height) {
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

      const sx2 = xScale(x2);
      const sy2 = yScale(y2);
      point2.setXCoord(frame.xMin + sx2);
      point2.setYCoord(frame.yMin + sy2);

      const sdy2 = dy2 !== void 0 ? yScale(dy2) : void 0;
      if (sdy2 !== void 0) {
        point2.setY2Coord(frame.yMin + sdy2);
      } else if (point2.y2Coord !== void 0) {
        point2.setY2Coord(void 0);
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
      this.xDataDomain.setState([xDomainMin!, xDomainMax!]);
      this.yDataDomain.setState([yDomainMin!, yDomainMax!]);
      this.xDataRange.setState([xRangeMin!, xRangeMax!]);
      this.yDataRange.setState([yRangeMin!, yRangeMax!]);
    } else {
      this.xDataDomain.setState(void 0);
      this.yDataDomain.setState(void 0);
      this.xDataRange.setState(void 0);
      this.yDataRange.setState(void 0);
    }
    Object.defineProperty(this, "gradientStops", {
      value: gradientStops,
      enumerable: true,
      configurable: true,
    });

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

  protected willDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    super.willDisplay(displayFlags, viewContext);
    if (this.xScale.isInherited() && this.xScale.isAnimating()) {
      this.xScale.onAnimate(viewContext.updateTime);
    }
    if (this.yScale.isInherited() && this.yScale.isAnimating()) {
      this.yScale.onAnimate(viewContext.updateTime);
    }
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

      const sx1 = xScale(x1);
      const sy1 = yScale(y1);
      point1.setXCoord(frame.xMin + sx1);
      point1.setYCoord(frame.yMin + sy1);

      const sdy1 = dy1 !== void 0 ? yScale(dy1) : void 0;
      if (sdy1 !== void 0) {
        point1.setY2Coord(frame.yMin + sdy1);
      } else if (point1.y2Coord !== void 0) {
        point1.setY2Coord(void 0);
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
      this.xDataRange.setState([xRangeMin!, xRangeMax!]);
      this.yDataRange.setState([yRangeMin!, yRangeMax!]);
    } else {
      this.xDataRange.setState(void 0);
      this.yDataRange.setState(void 0);
    }
  }

  protected didRender(viewContext: ViewContextType<this>): void {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      this.renderPlot(context, this.viewFrame);
    }
    super.didRender(viewContext);
  }

  protected abstract renderPlot(context: CanvasContext, frame: BoxR2): void;

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit: GraphicsView | null = null;
    const hitMode = this.hitMode.state;
    if (hitMode !== "none") {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        x *= renderer.pixelRatio;
        y *= renderer.pixelRatio;
        if (hitMode === "domain") {
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
      const d = xScale.inverse(x / renderer.pixelRatio - this.viewFrame.xMin);
      const x0 = this.data.previousValue(d);
      const x1 = this.data.nextValue(d);
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
      return new LinePlotView();
    } else if (type === "area") {
      return new AreaPlotView();
    }
    throw new TypeError("" + type);
  }

  static fromInit<X, Y>(init: SeriesPlotViewInit<X, Y>): SeriesPlotView<X, Y> {
    const type = init.plotType;
    if (type === "line") {
      return LinePlotView.fromInit(init);
    } else if (type === "area") {
      return AreaPlotView.fromInit(init);
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

  static readonly mountFlags: ViewFlags = GraphicsView.mountFlags | View.NeedsAnimate;
  static readonly powerFlags: ViewFlags = GraphicsView.powerFlags | View.NeedsAnimate;
  static readonly insertChildFlags: ViewFlags = GraphicsView.insertChildFlags | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = GraphicsView.removeChildFlags | View.NeedsAnimate;
}
