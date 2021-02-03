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
import type {BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewScope, ViewAnimator} from "@swim/view";
import {LayerView, CanvasContext, CanvasRenderer} from "@swim/graphics";
import {AnyDataPointView, DataPointView} from "../data/DataPointView";
import {ScaleViewAnimator} from "../scale/ScaleViewAnimator";
import type {PlotViewInit, PlotView} from "./PlotView";
import type {PlotViewObserver} from "./PlotViewObserver";
import type {PlotViewController} from "./PlotViewController";
import {BubblePlotView} from "../"; // forward import

export type ScatterPlotType = "bubble";

export type AnyScatterPlotView<X, Y> = ScatterPlotView<X, Y> | ScatterPlotViewInit<X, Y> | ScatterPlotType;

export interface ScatterPlotViewInit<X, Y> extends PlotViewInit<X, Y> {
  plotType?: ScatterPlotType;
}

export abstract class ScatterPlotView<X, Y> extends LayerView implements PlotView<X, Y> {
  declare readonly viewController: PlotViewController<X, Y> | null;

  declare readonly viewObservers: ReadonlyArray<PlotViewObserver<X, Y>>;

  initView(init: ScatterPlotViewInit<X, Y>): void {
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
  }

  abstract readonly plotType: ScatterPlotType;

  getDataPoint(key: string): DataPointView<X, Y> | undefined {
    const point = this.getChildView(key);
    return point instanceof DataPointView ? point : void 0;
  }

  insertDataPoint(point: AnyDataPointView<X, Y>, key?: string): DataPointView<X, Y> {
    if (key === void 0) {
      key = point.key;
    }
    point = DataPointView.fromAny(point);
    this.appendChildView(point, key);
    return point;
  }

  insertDataPoints(...points: AnyDataPointView<X, Y>[]): void {
    for (let i = 0, n = points.length; i < n; i += 1) {
      this.insertDataPoint(points[i]!);
    }
  }

  removeDataPoint(key: string): DataPointView<X, Y> | null {
    const point = this.getChildView(key);
    if (point instanceof DataPointView) {
      point.remove();
      return point;
    } else {
      return null;
    }
  }

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true, updateFlags: View.NeedsAnimate})
  declare xScale: ScaleViewAnimator<this, X, number>;

  @ViewAnimator({extends: ScaleViewAnimator, type: ContinuousScale, inherit: true, updateFlags: View.NeedsAnimate})
  declare yScale: ScaleViewAnimator<this, Y, number>;

  xDomain(): Domain<X> | undefined;
  xDomain(xDomain: Domain<X> | string | undefined, timing?: AnyTiming | boolean): this;
  xDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean): this;
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

  @ViewScope({type: Object})
  declare xDataDomain: ViewScope<this, readonly [X, X] | undefined>;

  /** @hidden */
  getXDataDomain(): readonly [X, X] | undefined {
    let xDataDomain = this.xDataDomain.state;
    if (xDataDomain === void 0) {
      let xDataDomainMin: X | undefined;
      let xDataDomainMax: X | undefined;
      const childViews = this.childViews;
      for (let i = 0, n = childViews.length; i < n; i += 1) {
        const point = childViews[i];
        if (point instanceof DataPointView) {
          const x = point.x.value;
          if (xDataDomainMin === void 0 || Values.compare(x, xDataDomainMin) < 0) {
            xDataDomainMin = x;
          }
          if (xDataDomainMax === void 0 || Values.compare(xDataDomainMax, x) < 0) {
            xDataDomainMax = x;
          }
        }
      }
      if (xDataDomainMin !== void 0 && xDataDomainMax !== void 0) {
        xDataDomain = [xDataDomainMin, xDataDomainMax];
        this.xDataDomain.setState(xDataDomain);
      }
    }
    return xDataDomain;
  }

  @ViewScope({type: Object})
  declare yDataDomain: ViewScope<this, readonly [Y, Y] | undefined>;

  /** @hidden */
  getYDataDomain(): readonly [Y, Y] | undefined {
    let yDataDomain = this.yDataDomain.state;
    if (yDataDomain === void 0) {
      let yDataDomainMin: Y | undefined;
      let yDataDomainMax: Y | undefined;
      const childViews = this.childViews;
      for (let i = 0, n = childViews.length; i < n; i += 1) {
        const point = childViews[i];
        if (point instanceof DataPointView) {
          const y = point.y.value;
          if (yDataDomainMin === void 0 || Values.compare(y, yDataDomainMin) < 0) {
            yDataDomainMin = y;
          }
          if (yDataDomainMax === void 0 || Values.compare(yDataDomainMax, y) < 0) {
            yDataDomainMax = y;
          }
        }
      }
      if (yDataDomainMin !== void 0 && yDataDomainMax !== void 0) {
        yDataDomain = [yDataDomainMin, yDataDomainMax];
        this.yDataDomain.setState(yDataDomain);
      }
    }
    return yDataDomain;
  }

  @ViewScope({type: Object})
  declare xDataRange: ViewScope<this, readonly [number, number] | undefined>;

  @ViewScope({type: Object})
  declare yDataRange: ViewScope<this, readonly [number, number] | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

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
    let xDomainMin: X | undefined;
    let yDomainMin: Y | undefined;
    let xDomainMax: X | undefined;
    let yDomainMax: Y | undefined;
    let xRangeMin: number | undefined;
    let yRangeMin: number | undefined;
    let xRangeMax: number | undefined;
    let yRangeMax: number | undefined;

    type self = this;
    function animateChildView(this: self, point1: View, processFlags: ViewFlags,
                              viewContext: ViewContextType<self>): void {
      if (point1 instanceof DataPointView) {
        const x1 = point1.x.getValue();
        const y1 = point1.y.getValue();
        const sx1 = xScale(x1);
        const sy1 = yScale(y1);
        point1.setXCoord(frame.xMin + sx1);
        point1.setYCoord(frame.yMin + sy1);

        if (point0 !== void 0) {
          // compute extrema
          if (Values.compare(x1, xDomainMin!) < 0) {
            xDomainMin = x1;
          } else if (Values.compare(xDomainMax!, x1) < 0) {
            xDomainMax = x1;
          }
          if (Values.compare(y1, yDomainMin!) < 0) {
            yDomainMin = y1;
          } else if (Values.compare(yDomainMax!, y1) < 0) {
            yDomainMax = y1;
          }
          if (sx1 < xRangeMin!) {
            xRangeMin = sx1;
          } else if (sx1 > xRangeMax!) {
            xRangeMax = sx1;
          }
          if (sy1 < yRangeMin!) {
            yRangeMin = sy1;
          } else if (sy1 > yRangeMax!) {
            yRangeMax = sy1;
          }
        } else {
          xDomainMin = x1;
          yDomainMin = y1;
          xDomainMax = x1;
          yDomainMax = y1;
          xRangeMin = sx1;
          yRangeMin = sy1;
          xRangeMax = sx1;
          yRangeMax = sy1;
        }

        point0 = point1;
      }

      processChildView.call(this, point1, processFlags, viewContext);
    }
    super.processChildViews(processFlags, viewContext, animateChildView);

    if (point0 !== void 0) {
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
    function layoutChildView(this: self, point1: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (point1 instanceof DataPointView) {
        const x1 = point1.x.getValue();
        const y1 = point1.y.getValue();
        const sx1 = xScale(x1);
        const sy1 = yScale(y1);
        point1.setXCoord(frame.xMin + sx1);
        point1.setYCoord(frame.yMin + sy1);

        if (point0 !== void 0) {
          // compute extrema
          if (sx1 < xRangeMin!) {
            xRangeMin = sx1;
          } else if (sx1 > xRangeMax!) {
            xRangeMax = sx1;
          }
          if (sy1 < yRangeMin!) {
            yRangeMin = sy1;
          } else if (sy1 > yRangeMax!) {
            yRangeMax = sy1;
          }
        } else {
          xRangeMin = sx1;
          yRangeMin = sy1;
          xRangeMax = sx1;
          yRangeMax = sy1;
        }

        point0 = point1;
      }

      displayChildView.call(this, point1, displayFlags, viewContext);
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

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      this.renderPlot(context, this.viewFrame);
    }
  }

  protected abstract renderPlot(context: CanvasContext, frame: BoxR2): void;

  static fromType<X, Y>(type: ScatterPlotType): ScatterPlotView<X, Y> {
    if (type === "bubble") {
      return new BubblePlotView();
    }
    throw new TypeError("" + type);
  }

  static fromInit<X, Y>(init: ScatterPlotViewInit<X, Y>): ScatterPlotView<X, Y> {
    const type = init.plotType;
    if (type === "bubble") {
      return BubblePlotView.fromInit(init);
    }
    throw new TypeError("" + init);
  }

  static fromAny<X, Y>(value: AnyScatterPlotView<X, Y>): ScatterPlotView<X, Y> {
    if (value instanceof ScatterPlotView) {
      return value;
    } else if (typeof value === "string") {
      return this.fromType(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static readonly mountFlags: ViewFlags = LayerView.mountFlags | View.NeedsAnimate;
  static readonly powerFlags: ViewFlags = LayerView.powerFlags | View.NeedsAnimate;
  static readonly insertChildFlags: ViewFlags = LayerView.insertChildFlags | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = LayerView.removeChildFlags | View.NeedsAnimate;
}
