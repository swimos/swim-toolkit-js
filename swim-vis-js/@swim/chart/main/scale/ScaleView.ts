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

import {Equivalent, Values} from "@swim/util";
import {
  AnyDomain,
  Domain,
  Range,
  AnyTiming,
  Timing,
  Easing,
  LinearDomain,
  LinearRange,
  ContinuousScale,
  LinearScale,
} from "@swim/mapping";
import type {BoxR2} from "@swim/math";
import {DateTime, TimeDomain, TimeScale} from "@swim/time";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {
  ViewContextType,
  ViewFlags,
  View,
  ViewProperty,
  ViewAnimator,
  ScaleGestureInput,
  ScaleGestureDelegate,
  ScaleGesture,
} from "@swim/view";
import {GraphicsViewInit, LayerView} from "@swim/graphics";
import {ScaleXView} from "./ScaleXView";
import {ScaleYView} from "./ScaleYView";
import type {ScaleXYView} from "./ScaleXYView";
import {ScaleViewAnimator} from "./ScaleViewAnimator";
import type {ScaleViewObserver} from "./ScaleViewObserver";
import type {ScaleViewController} from "./ScaleViewController";

/** @hidden */
export type ScaleFlags = number;

export interface ScaleViewInit<X = unknown, Y = unknown> extends GraphicsViewInit {
  viewController?: ScaleViewController<X, Y>;
  xScale?: ContinuousScale<X, number>;
  yScale?: ContinuousScale<Y, number>;

  xDomainBounds?: [X | boolean, X | boolean];
  yDomainBounds?: [Y | boolean, Y | boolean];
  xZoomBounds?: [number | boolean, number | boolean];
  yZoomBounds?: [number | boolean, number | boolean];

  xDomainPadding?: [X | boolean, X | boolean];
  yDomainPadding?: [Y | boolean, Y | boolean];
  xRangePadding?: [number, number];
  yRangePadding?: [number, number];

  fitAlign?: [number, number] | number;
  xFitAlign?: number;
  yFitAlign?: number;
  fitAspectRatio?: number;
  preserveAspectRatio?: boolean;

  domainTracking?: [boolean, boolean] | boolean;
  xDomainTracking?: boolean;
  yDomainTracking?: boolean;

  gestures?: [boolean, boolean] | boolean;
  xGestures?: boolean;
  yGestures?: boolean;

  scaleGesture?: ScaleGesture<X, Y>;
  rescaleTransition?: AnyTiming;
  reboundTransition?: AnyTiming;

  font?: AnyFont;
  textColor?: AnyColor;
}

export abstract class ScaleView<X = unknown, Y = unknown> extends LayerView
  implements ScaleXYView<X, Y>, ScaleGestureDelegate<X, Y> {

  constructor() {
    super();
    Object.defineProperty(this, "scaleFlags", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
  }

  initView(init: ScaleViewInit<X, Y>): void {
    super.initView(init);
    if (init.xScale !== void 0) {
      this.xScale(init.xScale);
    }
    if (init.yScale !== void 0) {
      this.yScale(init.yScale);
    }

    if (init.xDomainBounds !== void 0) {
      this.xDomainBounds(init.xDomainBounds);
    }
    if (init.yDomainBounds !== void 0) {
      this.yDomainBounds(init.yDomainBounds);
    }
    if (init.xZoomBounds !== void 0) {
      this.xZoomBounds(init.xZoomBounds);
    }
    if (init.yZoomBounds !== void 0) {
      this.yZoomBounds(init.yZoomBounds);
    }

    if (init.xDomainPadding !== void 0) {
      this.xDomainPadding(init.xDomainPadding);
    }
    if (init.yDomainPadding !== void 0) {
      this.yDomainPadding(init.yDomainPadding);
    }
    if (init.xRangePadding !== void 0) {
      this.xRangePadding(init.xRangePadding);
    }
    if (init.yRangePadding !== void 0) {
      this.yRangePadding(init.yRangePadding);
    }

    if (init.fitAlign !== void 0) {
      this.fitAlign(init.fitAlign);
    }
    if (init.xFitAlign !== void 0) {
      this.xFitAlign(init.xFitAlign);
    }
    if (init.yFitAlign !== void 0) {
      this.yFitAlign(init.yFitAlign);
    }
    if (init.fitAspectRatio !== void 0) {
      this.fitAspectRatio(init.fitAspectRatio);
    }
    if (init.preserveAspectRatio !== void 0) {
      this.preserveAspectRatio(init.preserveAspectRatio);
    }

    if (init.domainTracking !== void 0) {
      this.domainTracking(init.domainTracking);
    }
    if (init.xDomainTracking !== void 0) {
      this.xDomainTracking(init.xDomainTracking);
    }
    if (init.yDomainTracking !== void 0) {
      this.yDomainTracking(init.yDomainTracking);
    }

    if (init.gestures !== void 0) {
      this.gestures(init.gestures);
    }
    if (init.xGestures !== void 0) {
      this.xGestures(init.xGestures);
    }
    if (init.yGestures !== void 0) {
      this.yGestures(init.yGestures);
    }

    if (init.scaleGesture !== void 0) {
      this.scaleGesture.setState(init.scaleGesture);
      init.scaleGesture.setView(this);
    }
    if (init.rescaleTransition !== void 0) {
      this.rescaleTransition.setState(init.rescaleTransition);
    }
    if (init.reboundTransition !== void 0) {
      this.reboundTransition.setState(init.reboundTransition);
    }

    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
  }

  declare readonly viewController: ScaleViewController<X, Y> | null;

  declare readonly viewObservers: ReadonlyArray<ScaleViewObserver<X, Y>>;

  /** @hidden */
  declare readonly scaleFlags: ScaleFlags;

  /** @hidden */
  setScaleFlags(scaleFlags: ScaleFlags): void {
    Object.defineProperty(this, "scaleFlags", {
      value: scaleFlags,
      enumerable: true,
      configurable: true,
    });
  }

  @ViewAnimator<ScaleView<X, Y>, ContinuousScale<X, number>>({
    extends: ScaleViewAnimator,
    type: ContinuousScale,
    inherit: true,
    updateFlags: View.NeedsAnimate | View.NeedsLayout,
    onBegin(xScale: ContinuousScale<X, number>): void {
      if ((this.owner.scaleFlags & ScaleView.XFittingFlag) !== 0) {
        this.owner.onBeginFittingXScale(xScale);
      }
      if ((this.owner.scaleFlags & ScaleView.XBoundingFlag) !== 0) {
        this.owner.onBeginBoundingXScale(xScale);
      }
    },
    onEnd(xScale: ContinuousScale<X, number>): void {
      if ((this.owner.scaleFlags & ScaleView.XFittingFlag) !== 0) {
        this.owner.onEndFittingXScale(xScale);
      }
      if ((this.owner.scaleFlags & ScaleView.XBoundingFlag) !== 0) {
        this.owner.onEndBoundingXScale(xScale);
      }
    },
    onInterrupt(xScale: ContinuousScale<X, number>): void {
      if ((this.owner.scaleFlags & ScaleView.XFittingFlag) !== 0) {
        this.owner.onInterruptFittingXScale(xScale);
      }
      if ((this.owner.scaleFlags & ScaleView.XBoundingFlag) !== 0) {
        this.owner.onInterruptBoundingXScale(xScale);
      }
    },
  })
  declare xScale: ScaleViewAnimator<this, X, number>;

  @ViewAnimator<ScaleView<X, Y>, ContinuousScale<Y, number>>({
    extends: ScaleViewAnimator,
    type: ContinuousScale,
    inherit: true,
    updateFlags: View.NeedsAnimate | View.NeedsLayout,
    onBegin(yScale: ContinuousScale<Y, number>): void {
      if ((this.owner.scaleFlags & ScaleView.YFittingFlag) !== 0) {
        this.owner.onBeginFittingYScale(yScale);
      }
      if ((this.owner.scaleFlags & ScaleView.YBoundingFlag) !== 0) {
        this.owner.onBeginBoundingYScale(yScale);
      }
    },
    onEnd(yScale: ContinuousScale<Y, number>): void {
      if ((this.owner.scaleFlags & ScaleView.YFittingFlag) !== 0) {
        this.owner.onEndFittingYScale(yScale);
      }
      if ((this.owner.scaleFlags & ScaleView.YBoundingFlag) !== 0) {
        this.owner.onEndBoundingYScale(yScale);
      }
    },
    onInterrupt(yScale: ContinuousScale<Y, number>): void {
      if ((this.owner.scaleFlags & ScaleView.YFittingFlag) !== 0) {
        this.owner.onInterruptFittingYScale(yScale);
      }
      if ((this.owner.scaleFlags & ScaleView.YBoundingFlag) !== 0) {
        this.owner.onInterruptBoundingYScale(yScale);
      }
    },
  })
  declare yScale: ScaleViewAnimator<this, Y, number>;

  xDomain(): Domain<X> | undefined;
  xDomain(xDomain: Domain<X> | string | undefined, timing?: AnyTiming | boolean): this;
  xDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean): this;
  xDomain(xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<X> | undefined | this {
    if (xMin === void 0) {
      const xScale = this.xScale.value;
      return xScale !== void 0 ? xScale.domain : void 0;
    } else {
      if (xMin instanceof Domain || typeof xMin === "string") {
        timing = xMax as AnyTiming | boolean;
      }
      if (timing === true) {
        timing = this.rescaleTransition.state;
      }
      const xRange = this.xRange();
      if (xMin instanceof Domain || typeof xMin === "string") {
        if (xRange !== void 0) {
          this.xScale.setBaseScale(xMin as Domain<X> | string, xRange, timing);
        } else {
          this.xScale.setBaseDomain(xMin as Domain<X> | string, timing);
        }
      } else {
        if (xRange !== void 0) {
          this.xScale.setBaseScale(xMin as X, xMax as X, xRange[0], xRange[1], timing);
        } else {
          this.xScale.setBaseDomain(xMin as X, xMax as X, timing);
        }
      }
      return this;
    }
  }

  yDomain(): Domain<Y> | undefined;
  yDomain(yDomain: Domain<Y> | string | undefined, timing?: AnyTiming | boolean): this;
  yDomain(yMin: Y, yMax: Y, timing?: AnyTiming | boolean): this;
  yDomain(yMin?: Domain<Y> | Y | string, yMax?: Y | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<Y> | undefined | this {
    if (yMin === void 0) {
      const yScale = this.yScale.value;
      return yScale !== void 0 ? yScale.domain : void 0;
    } else {
      if (yMin instanceof Domain || typeof yMin === "string") {
        timing = yMax as AnyTiming | boolean;
      }
      if (timing === true) {
        timing = this.rescaleTransition.state;
      }
      const yRange = this.yRange();
      if (yMin instanceof Domain || typeof yMin === "string") {
        if (yRange !== void 0) {
          this.yScale.setBaseScale(yMin as Domain<Y> | string, LinearRange(yRange[1], yRange[0]), timing);
        } else {
          this.yScale.setBaseDomain(yMin as Domain<Y>| string, timing);
        }
      } else {
        if (yRange !== void 0) {
          this.yScale.setBaseScale(yMin as Y, yMax as Y, yRange[1], yRange[0], timing);
        } else {
          this.yScale.setBaseDomain(yMin as Y, yMax as Y, timing);
        }
      }
      return this;
    }
  }

  xRange(): Range<number> | undefined {
    const xRangePadding = this.xRangePadding.state;
    const xRangeMin = xRangePadding[0];
    const xRangeMax = this.viewFrame.width - xRangePadding[1];
    return LinearRange(xRangeMin, xRangeMax);
  }

  yRange(): Range<number> | undefined {
    const yRangePadding = this.yRangePadding.state;
    const yRangeMin = yRangePadding[0];
    const yRangeMax = this.viewFrame.height - yRangePadding[1];
    return LinearRange(yRangeMin, yRangeMax);
  }

  @ViewProperty<ScaleView<X, Y>, readonly [X | boolean, X | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [X | boolean, X | boolean] {
      return [true, true];
    },
  })
  declare xDomainBounds: ViewProperty<this, readonly [X | boolean, X | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [Y | boolean, Y | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [Y | boolean, Y | boolean] {
      return [true, true];
    },
  })
  declare yDomainBounds: ViewProperty<this, readonly [Y | boolean, Y | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [number | boolean, number | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [number | boolean, number | boolean] {
      return [true, true];
    },
  })
  declare xZoomBounds: ViewProperty<this, readonly [number | boolean, number | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [number | boolean, number | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [number | boolean, number | boolean] {
      return [true, true];
    },
  })
  declare yZoomBounds: ViewProperty<this, readonly [number | boolean, number | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [X | boolean, X | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [X | boolean, X | boolean] {
      return [false, false];
    },
  })
  declare xDomainPadding: ViewProperty<this, readonly [X | boolean, X | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [Y | boolean, Y | boolean]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [Y | boolean, Y | boolean] {
      return [false, false];
    },
  })
  declare yDomainPadding: ViewProperty<this, readonly [Y | boolean, Y | boolean]>

  @ViewProperty<ScaleView<X, Y>, readonly [number, number]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [number, number] {
      return [0, 0];
    },
  })
  declare xRangePadding: ViewProperty<this, readonly [number, number]>

  @ViewProperty<ScaleView<X, Y>, readonly [number, number]>({
    type: Object,
    updateFlags: View.NeedsAnimate,
    initState: function (): readonly [number, number] {
      return [0, 0];
    },
  })
  declare yRangePadding: ViewProperty<this, readonly [number, number]>

  @ViewProperty({type: Object})
  declare xDataDomain: ViewProperty<this, readonly [X, X] | undefined>;

  getXDataDomain(): readonly [X, X] | undefined {
    let xDataDomain = this.xDataDomain.state;
    if (xDataDomain === void 0) {
      let xDataDomainMin: X | undefined;
      let xDataDomainMax: X | undefined;
      const childViews = this.childViews;
      for (let i = 0, n = childViews.length; i < n; i += 1) {
        const childView = childViews[i];
        if (ScaleXView.is<X>(childView)) {
          if (childView.xScale() === void 0) {
            const childXDataDomain = childView.getXDataDomain();
            if (childXDataDomain !== void 0) {
              if (xDataDomainMin === void 0 || childXDataDomain[0] !== void 0 && +childXDataDomain[0] < +xDataDomainMin) {
                xDataDomainMin = childXDataDomain[0];
              }
              if (xDataDomainMax === void 0 || childXDataDomain[1] !== void 0 && +xDataDomainMax < +childXDataDomain[1]) {
                xDataDomainMax = childXDataDomain[1];
              }
            }
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

  @ViewProperty({type: Object})
  declare yDataDomain: ViewProperty<this, readonly [Y, Y] | undefined>;

  getYDataDomain(): readonly [Y, Y] | undefined {
    let yDataDomain = this.yDataDomain.state;
    if (yDataDomain === void 0) {
      let yDataDomainMin: Y | undefined;
      let yDataDomainMax: Y | undefined;
      const childViews = this.childViews;
      for (let i = 0, n = childViews.length; i < n; i += 1) {
        const childView = childViews[i];
        if (ScaleYView.is<Y>(childView)) {
          if (childView.yScale() === void 0) {
            const childYDataDomain = childView.getYDataDomain();
            if (childYDataDomain !== void 0) {
              if (yDataDomainMin === void 0 || childYDataDomain[0] !== void 0 && +childYDataDomain[0] < +yDataDomainMin) {
                yDataDomainMin = childYDataDomain[0];
              }
              if (yDataDomainMax === void 0 || childYDataDomain[1] !== void 0 && +yDataDomainMax < +childYDataDomain[1]) {
                yDataDomainMax = childYDataDomain[1];
              }
            }
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

  @ViewProperty({type: Object})
  declare xDataDomainPadded: ViewProperty<this, readonly [X, X] | undefined>;

  @ViewProperty({type: Object})
  declare yDataDomainPadded: ViewProperty<this, readonly [Y, Y] | undefined>;

  @ViewProperty({type: Object})
  declare xDataRange: ViewProperty<this, readonly [number, number] | undefined>;

  @ViewProperty({type: Object})
  declare yDataRange: ViewProperty<this, readonly [number, number] | undefined>;

  @ViewProperty<ScaleView<X, Y>, readonly [number, number], number>({
    type: Object,
    initState: function (): readonly [number, number] {
      return [1.0, 0.5];
    },
    fromAny(value: readonly [number, number] | number): readonly [number, number] {
      if (typeof value === "number") {
        return [value, value];
      } else {
        return value;
      }
    },
  })
  declare fitAlign: ViewProperty<this, readonly [number, number], number>;

  xFitAlign(): number;
  xFitAlign(xFitAlign: number): this;
  xFitAlign(xFitAlign?: number): number | this {
    const fitAlign = this.fitAlign.state;
    if (xFitAlign === void 0) {
      return fitAlign[0];
    } else {
      this.fitAlign.setState([xFitAlign, fitAlign[1]]);
      return this;
    }
  }

  yFitAlign(): number;
  yFitAlign(yFitAlign: number): this;
  yFitAlign(yFitAlign?: number): number | this {
    const fitAlign = this.fitAlign.state;
    if (yFitAlign === void 0) {
      return fitAlign[0];
    } else {
      this.fitAlign.setState([fitAlign[0], yFitAlign]);
      return this;
    }
  }

  @ViewProperty({type: Number})
  declare fitAspectRatio: ViewProperty<this, number | undefined>;

  preserveAspectRatio(): boolean;
  preserveAspectRatio(preserveAspectRatio: boolean): this;
  preserveAspectRatio(preserveAspectRatio?: boolean): boolean | this {
    if (preserveAspectRatio === void 0) {
      return (this.scaleFlags & ScaleView.PreserveAspectRatioFlag) !== 0;
    } else {
      if (preserveAspectRatio) {
        this.setScaleFlags(this.scaleFlags | ScaleView.PreserveAspectRatioFlag);
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.PreserveAspectRatioFlag);
      }
      return this;
    }
  }

  domainTracking(): readonly [boolean, boolean];
  domainTracking(domainTracking: readonly [boolean, boolean] | boolean): this;
  domainTracking(xDomainTracking: boolean, yDomainTracking: boolean): this;
  domainTracking(xDomainTracking?: readonly [boolean, boolean] | boolean,
                 yDomainTracking?: boolean): readonly [boolean, boolean] | this {
    if (xDomainTracking === void 0) {
      return [(this.scaleFlags & ScaleView.XDomainTrackingFlag) !== 0,
              (this.scaleFlags & ScaleView.YDomainTrackingFlag) !== 0];
    } else {
      if (Array.isArray(xDomainTracking)) {
        yDomainTracking = xDomainTracking[1] as boolean;
        xDomainTracking = xDomainTracking[0] as boolean;
      } else if (yDomainTracking === void 0) {
        yDomainTracking = xDomainTracking as boolean;
      }
      if (xDomainTracking as boolean) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XDomainTrackingFlag);
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.XDomainTrackingFlag);
      }
      if (yDomainTracking) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YDomainTrackingFlag);
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.YDomainTrackingFlag);
      }
      return this;
    }
  }

  xDomainTracking(): boolean;
  xDomainTracking(xDomainTracking: boolean): this;
  xDomainTracking(xDomainTracking?: boolean): boolean | this {
    if (xDomainTracking === void 0) {
      return (this.scaleFlags & ScaleView.XDomainTrackingFlag) !== 0;
    } else {
      if (xDomainTracking) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XDomainTrackingFlag);
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.XDomainTrackingFlag);
      }
      return this;
    }
  }

  yDomainTracking(): boolean;
  yDomainTracking(yDomainTracking: boolean): this;
  yDomainTracking(yDomainTracking?: boolean): boolean | this {
    if (yDomainTracking === void 0) {
      return (this.scaleFlags & ScaleView.YDomainTrackingFlag) !== 0;
    } else {
      if (yDomainTracking) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YDomainTrackingFlag);
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.YDomainTrackingFlag);
      }
      return this;
    }
  }

  gestures(): readonly [boolean, boolean];
  gestures(gestures: readonly [boolean, boolean] | boolean): this;
  gestures(xGestures: boolean, yGestures: boolean): this;
  gestures(xGestures?: readonly [boolean, boolean] | boolean,
           yGestures?: boolean): readonly [boolean, boolean] | this {
    if (xGestures === void 0) {
      return [(this.scaleFlags & ScaleView.XGesturesFlag) !== 0,
              (this.scaleFlags & ScaleView.YGesturesFlag) !== 0];
    } else {
      if (Array.isArray(xGestures)) {
        yGestures = xGestures[1] as boolean;
        xGestures = xGestures[0] as boolean;
      } else if (yGestures === void 0) {
        yGestures = xGestures as boolean;
      }
      if (xGestures as boolean) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XGesturesFlag);
        this.didEnableXGestures();
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.XGesturesFlag);
        this.didDisableXGestures();
      }
      if (yGestures) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YGesturesFlag);
        this.didEnableYGestures();
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.YGesturesFlag);
        this.didDisableYGestures();
      }
      return this;
    }
  }

  xGestures(): boolean;
  xGestures(xGestures: boolean): this;
  xGestures(xGestures?: boolean): boolean | this {
    if (xGestures === void 0) {
      return (this.scaleFlags & ScaleView.XGesturesFlag) !== 0;
    } else {
      if (xGestures) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XGesturesFlag);
        this.didEnableXGestures();
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.XGesturesFlag);
        this.didDisableXGestures();
      }
      return this;
    }
  }

  yGestures(): boolean;
  yGestures(yGestures: boolean): this;
  yGestures(yGestures?: boolean): boolean | this {
    if (yGestures === void 0) {
      return (this.scaleFlags & ScaleView.YGesturesFlag) !== 0;
    } else {
      if (yGestures) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YGesturesFlag);
        this.didEnableYGestures();
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.YGesturesFlag);
        this.didDisableYGestures();
      }
      return this;
    }
  }

  protected didEnableXGestures(): void {
    if (this.scaleGesture.state === void 0) {
      this.scaleGesture(true);
    }
  }

  protected didDisableXGestures(): void {
    // hook
  }

  protected didEnableYGestures(): void {
    if (this.scaleGesture.state === void 0) {
      this.scaleGesture(true);
    }
  }

  protected didDisableYGestures(): void {
    // hook
  }

  protected createScaleGesture(): ScaleGesture<X, Y> | undefined {
    return new ScaleGesture(this, this);
  }

  @ViewProperty<ScaleView<X, Y>, ScaleGesture<X, Y> | undefined, ScaleGesture<X, Y> | boolean | undefined>({
    type: ScaleGesture,
    inherit: true,
    fromAny(value: ScaleGesture<X, Y> | boolean | undefined): ScaleGesture<X, Y> | undefined {
      if (value === true) {
        return this.owner.createScaleGesture();
      } else if (value === false) {
        return void 0;
      } else {
        return value;
      }
    }
  })
  declare scaleGesture: ViewProperty<this, ScaleGesture<X, Y> | undefined, ScaleGesture<X, Y> | boolean | undefined>;

  @ViewProperty({
    type: Timing,
    inherit: true,
    initState(): Timing | undefined {
      return Easing.linear.withDuration(250);
    },
  })
  declare rescaleTransition: ViewProperty<this, Timing | undefined, AnyTiming | undefined>;

  @ViewProperty({
    type: Timing,
    inherit: true,
    initState(): Timing | undefined {
      return Easing.cubicOut.withDuration(250);
    },
  })
  declare reboundTransition: ViewProperty<this, Timing | undefined, AnyTiming | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  xDomainInRange(): boolean {
    return (this.scaleFlags & ScaleView.XInRangeMask) === ScaleView.XInRangeMask;
  }

  xInRange(): boolean {
    return (this.scaleFlags & ScaleView.XInRangeMask) !== 0;
  }

  xMinInRange(): boolean {
    return (this.scaleFlags & ScaleView.XMinInRangeFlag) !== 0;
  }

  xMaxInRange(): boolean {
    return (this.scaleFlags & ScaleView.XMaxInRangeFlag) !== 0;
  }

  yDomainInRange(): boolean {
    return (this.scaleFlags & ScaleView.XInRangeMask) === ScaleView.YInRangeMask;
  }

  yInRange(): boolean {
    return (this.scaleFlags & ScaleView.YInRangeMask) !== 0;
  }

  yMinInRange(): boolean {
    return (this.scaleFlags & ScaleView.YMinInRangeFlag) !== 0;
  }

  yMaxInRange(): boolean {
    return (this.scaleFlags & ScaleView.YMaxInRangeFlag) !== 0;
  }

  fitX(tween: boolean = false): void {
    this.setScaleFlags(this.scaleFlags | ScaleView.XFitFlag);
    if (tween === true) {
      this.setScaleFlags(this.scaleFlags | ScaleView.XFitTweenFlag);
    }
    this.requireUpdate(View.NeedsAnimate);
  }

  fitY(tween: boolean = false): void {
    this.setScaleFlags(this.scaleFlags | ScaleView.YFitFlag);
    if (tween === true) {
      this.setScaleFlags(this.scaleFlags | ScaleView.YFitTweenFlag);
    }
    this.requireUpdate(View.NeedsAnimate);
  }

  fit(tween: boolean = false): void {
    this.setScaleFlags(this.scaleFlags | (ScaleView.XFitFlag | ScaleView.YFitFlag));
    if (tween === true) {
      this.setScaleFlags(this.scaleFlags | ScaleView.FitTweenMask);
    }
    this.requireUpdate(View.NeedsAnimate);
  }

  protected onRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    super.onRequireUpdate(updateFlags, immediate);
    const parentView = this.parentView;
    if (parentView !== null) {
      parentView.requireUpdate(updateFlags & View.NeedsAnimate);
    }
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & (View.NeedsResize | View.NeedsLayout)) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected willResize(viewContext: ViewContextType<this>): void {
    super.willResize(viewContext);
    this.resizeScales(this.viewFrame);
  }

  /**
   * Updates own scale ranges to project onto view frame.  Infers own scales
   * from child view data domains if inherited x/y scales are undefined.
   */
  protected resizeScales(frame: BoxR2): void {
    let xScale: ContinuousScale<X, number> | undefined;
    const xRange = this.xRange();
    if (xRange !== void 0) {
      xScale = !this.xScale.isInherited() ? this.xScale.ownValue : void 0;
      if (xScale !== void 0 && !Values.equal(xScale.range, xRange)) {
        this.xScale.setRange(xRange);
        this.requireUpdate(View.NeedsAnimate);
        this.setScaleFlags(this.scaleFlags | ScaleView.RescaleFlag);
      } else if (this.xScale.superValue === void 0) {
        const xDataDomain = this.getXDataDomain();
        if (xDataDomain !== void 0) {
          xScale = ScaleView.createScale(xDataDomain[0], xDataDomain[1], xRange[0], xRange[1]);
          this.xScale.setState(xScale);
          this.setScaleFlags(this.scaleFlags | ScaleView.XFitFlag);
        }
      }
    }

    let yScale: ContinuousScale<Y, number> | undefined;
    const yRange = this.yRange();
    if (yRange !== void 0) {
      yScale = !this.yScale.isInherited() ? this.yScale.ownValue : void 0;
      if (yScale !== void 0 && !Values.equal(yScale.range, yRange)) {
        this.yScale.setRange(yRange[1], yRange[0]);
        this.requireUpdate(View.NeedsAnimate);
        this.setScaleFlags(this.scaleFlags | ScaleView.RescaleFlag);
      } else if (this.yScale.superValue === void 0) {
        const yDataDomain = this.getYDataDomain();
        if (yDataDomain !== void 0) {
          yScale = ScaleView.createScale(yDataDomain[0], yDataDomain[1], yRange[1], yRange[0]);
          this.yScale.setState(yScale);
          this.setScaleFlags(this.scaleFlags | ScaleView.YFitFlag);
        }
      }
    }
  }

  protected didAnimate(viewContext: ViewContextType<this>): void {
    this.updateScales();
    super.didAnimate(viewContext);
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

  protected updateScales(): void {
    let xScale = this.xScale.value;
    let yScale = this.yScale.value;
    this.updateDataBounds(xScale, yScale);

    xScale = !this.xScale.isInherited() ? this.xScale.ownValue : void 0;
    yScale = !this.yScale.isInherited() ? this.yScale.ownValue : void 0;
    if (xScale !== void 0 && yScale !== void 0) {
      this.updateOwnScales(xScale, yScale);
    }
  }

  /**
   * Computes domain and range extrema from child view scales.
   */
  protected updateDataBounds(xScale: ContinuousScale<X, number> | undefined,
                             yScale: ContinuousScale<Y, number> | undefined): void {
    let xDataDomainMin: X | undefined;
    let xDataDomainMax: X | undefined;
    let yDataDomainMin: Y | undefined;
    let yDataDomainMax: Y | undefined;
    let xDataRangeMin = Infinity;
    let xDataRangeMax = -Infinity;
    let yDataRangeMin = Infinity;
    let yDataRangeMax = -Infinity;
    const childViews = this.childViews;
    for (let i = 0, n = childViews.length; i < n; i += 1) {
      const childView = childViews[i];
      if (ScaleXView.is<X>(childView)) {
        if (childView.xScale() === xScale) {
          const childXDataDomain = childView.getXDataDomain();
          if (childXDataDomain !== void 0) {
            if (xDataDomainMin === void 0 || +childXDataDomain[0] < +xDataDomainMin) {
              xDataDomainMin = childXDataDomain[0];
            }
            if (xDataDomainMax === void 0 || +xDataDomainMax < +childXDataDomain[1]) {
              xDataDomainMax = childXDataDomain[1];
            }
          }
          const childXDataRange = childView.xDataRange();
          if (childXDataRange !== void 0) {
            xDataRangeMin = Math.min(xDataRangeMin, childXDataRange[0]);
            xDataRangeMax = Math.max(xDataRangeMax, childXDataRange[1]);
          }
        }
      }
      if (ScaleYView.is<Y>(childView)) {
        if (childView.yScale() === yScale) {
          const childYDataDomain = childView.getYDataDomain();
          if (childYDataDomain !== void 0) {
            if (yDataDomainMin === void 0 || +childYDataDomain[0] < +yDataDomainMin) {
              yDataDomainMin = childYDataDomain[0];
            }
            if (yDataDomainMax === void 0 || +yDataDomainMax < +childYDataDomain[1]) {
              yDataDomainMax = childYDataDomain[1];
            }
          }
          const childYDataRange = childView.yDataRange();
          if (childYDataRange !== void 0) {
            yDataRangeMin = Math.min(yDataRangeMin, childYDataRange[0]);
            yDataRangeMax = Math.max(yDataRangeMax, childYDataRange[1]);
          }
        }
      }
    }

    if (xDataDomainMin !== void 0 && xDataDomainMax !== void 0 &&
        yDataDomainMin !== void 0 && yDataDomainMax !== void 0 &&
        isFinite(xDataRangeMin) && isFinite(xDataRangeMax) &&
        isFinite(yDataRangeMin) && isFinite(yDataRangeMax)) {
      const xDataDomain = this.xDataDomain.state as [X, X] | undefined;
      if (xDataDomain === void 0) {
        this.xDataDomain.setState([xDataDomainMin, xDataDomainMax]);
        this.setScaleFlags(this.scaleFlags | ScaleView.XChangingMask);
      } else {
        if (+xDataDomain[0] !== +xDataDomainMin) {
          xDataDomain[0] = xDataDomainMin;
          this.setScaleFlags(this.scaleFlags | ScaleView.XMinChangingFlag);
        }
        if (+xDataDomain[1] !== +xDataDomainMax) {
          xDataDomain[1] = xDataDomainMax;
          this.setScaleFlags(this.scaleFlags | ScaleView.XMaxChangingFlag);
        }
      }
      const yDataDomain = this.yDataDomain.state as [Y, Y] | undefined;
      if (yDataDomain === void 0) {
        this.yDataDomain.setState([yDataDomainMin, yDataDomainMax]);
        this.setScaleFlags(this.scaleFlags | ScaleView.YChangingMask);
      } else {
        if (+yDataDomain[0] !== +yDataDomainMin) {
          yDataDomain[0] = yDataDomainMin;
          this.setScaleFlags(this.scaleFlags | ScaleView.YMinChangingFlag);
        }
        if (+yDataDomain[1] !== +yDataDomainMax) {
          yDataDomain[1] = yDataDomainMax;
          this.setScaleFlags(this.scaleFlags | ScaleView.YMaxChangingFlag);
        }
      }

      this.xDataRange.setState([xDataRangeMin, xDataRangeMax]);
      this.yDataRange.setState([yDataRangeMin, yDataRangeMax]);

      const xDomainPadding = this.xDomainPadding.state;
      let xDataDomainPaddedMin: X;
      if (typeof xDomainPadding[0] !== "boolean") {
        xDataDomainPaddedMin = (+xDataDomainMin - +xDomainPadding[0]) as unknown as X;
      } else {
        xDataDomainPaddedMin = xDataDomainMin;
      }
      let xDataDomainPaddedMax: X;
      if (typeof xDomainPadding[1] !== "boolean") {
        xDataDomainPaddedMax = (+xDataDomainMax + +xDomainPadding[1]) as unknown as X;
      } else {
        xDataDomainPaddedMax = xDataDomainMax;
      }
      const xDataDomainPadded = this.xDataDomainPadded.state as [X, X] | undefined;
      if (xDataDomainPadded === void 0) {
        this.xDataDomainPadded.setState([xDataDomainPaddedMin, xDataDomainPaddedMax]);
        this.setScaleFlags(this.scaleFlags | ScaleView.XChangingMask);
      } else {
        if (+xDataDomainPadded[0] !== +xDataDomainPaddedMin) {
          xDataDomainPadded[0] = xDataDomainPaddedMin;
          this.setScaleFlags(this.scaleFlags | ScaleView.XMinChangingFlag);
        }
        if (+xDataDomainPadded[1] !== +xDataDomainPaddedMax) {
          xDataDomainPadded[1] = xDataDomainPaddedMax;
          this.setScaleFlags(this.scaleFlags | ScaleView.XMaxChangingFlag);
        }
      }

      const yDomainPadding = this.yDomainPadding.state;
      let yDataDomainPaddedMin: Y;
      if (typeof yDomainPadding[0] !== "boolean") {
        yDataDomainPaddedMin = (+yDataDomainMin - +yDomainPadding[0]) as unknown as Y;
      } else {
        yDataDomainPaddedMin = yDataDomainMin;
      }
      let yDataDomainPaddedMax: Y;
      if (typeof yDomainPadding[1] !== "boolean") {
        yDataDomainPaddedMax = (+yDataDomainMax + +yDomainPadding[1]) as unknown as Y;
      } else {
        yDataDomainPaddedMax = yDataDomainMax;
      }
      const yDataDomainPadded = this.yDataDomainPadded.state as [Y, Y] | undefined;
      if (yDataDomainPadded === void 0) {
        this.yDataDomainPadded.setState([yDataDomainPaddedMin, yDataDomainPaddedMax]);
        this.setScaleFlags(this.scaleFlags | ScaleView.YChangingMask);
      } else {
        if (+yDataDomainPadded[0] !== +yDataDomainPaddedMin) {
          yDataDomainPadded[0] = yDataDomainPaddedMin;
          this.setScaleFlags(this.scaleFlags | ScaleView.YMinChangingFlag);
        }
        if (+yDataDomainPadded[1] !== +yDataDomainPaddedMax) {
          yDataDomainPadded[1] = yDataDomainPaddedMax;
          this.setScaleFlags(this.scaleFlags | ScaleView.YMaxChangingFlag);
        }
      }
    } else {
      this.xDataDomain.setState(void 0);
      this.yDataDomain.setState(void 0);
      this.xDataDomainPadded.setState(void 0);
      this.yDataDomainPadded.setState(void 0);
      this.xDataRange.setState(void 0);
      this.yDataRange.setState(void 0);
    }
  }

  protected updateOwnScales(xScale: ContinuousScale<X, number>,
                            yScale: ContinuousScale<Y, number>): void {
    if ((this.scaleFlags & ScaleView.FitMask) !== 0) {
      this.fitScales(xScale, yScale);
    }

    xScale = this.xScale.ownValue!;
    yScale = this.yScale.ownValue!;
    this.boundScales(xScale, yScale);
  }

  /**
   * Fits scales to domains, and corrects aspect ratio.
   */
  protected fitScales(oldXScale: ContinuousScale<X, number>, oldYScale: ContinuousScale<Y, number>): void {
    const xDataDomain = this.xDataDomain.state;
    let oldXDomain: AnyDomain<X> | undefined;
    let newXDomain: AnyDomain<X> | undefined;
    if (xDataDomain !== void 0 && (this.scaleFlags & ScaleView.XFitFlag) !== 0) {
      oldXDomain = oldXScale.domain;
      if (+oldXDomain[0] !== +xDataDomain[0] ||
          +oldXDomain[1] !== +xDataDomain[1]) {
        newXDomain = xDataDomain as [X, X];
      }
    }

    const yDataDomain = this.yDataDomain.state;
    let oldYDomain: AnyDomain<Y> | undefined;
    let newYDomain: AnyDomain<Y> | undefined;
    if (yDataDomain !== void 0 && (this.scaleFlags & ScaleView.YFitFlag) !== 0) {
      oldYDomain = oldYScale.domain;
      if (+oldYDomain[0] !== +yDataDomain[0] ||
          +oldYDomain[1] !== +yDataDomain[1]) {
        newYDomain = yDataDomain as [Y, Y];
      }
    }

    const fitAspectRatio = this.fitAspectRatio.state;
    if (fitAspectRatio !== void 0) {
      const xDomain = newXDomain !== void 0 ? newXDomain : oldXScale.domain;
      const yDomain = newYDomain !== void 0 ? newYDomain : oldYScale.domain;
      const xRange = oldXScale.range;
      const yRange = oldYScale.range;
      const oldDomainWidth = +xDomain[1] - +xDomain[0];
      const oldDomainHeight = +yDomain[1] - +yDomain[0];
      const domainAspectRatio = oldDomainWidth / oldDomainHeight;
      const rangeAspectRatio = (xRange[1] - xRange[0]) / (yRange[0] - yRange[1]);
      const anamorphicAspectRatio = Math.abs(fitAspectRatio * rangeAspectRatio);
      if (Math.abs(domainAspectRatio - anamorphicAspectRatio) >= Equivalent.Epsilon) {
        const fitAlign = this.fitAlign.state;
        if (fitAspectRatio < 0 && domainAspectRatio < anamorphicAspectRatio ||
            fitAspectRatio > 0 && domainAspectRatio > anamorphicAspectRatio) {
          const newDomainWidth = oldDomainHeight * anamorphicAspectRatio;
          const dx = newDomainWidth - oldDomainWidth;
          newXDomain = [+xDomain[0] - dx * fitAlign[0] as unknown as X,
                        +xDomain[1] + dx * (1 - fitAlign[0]) as unknown as X];
        } else {
          const newDomainHeight = oldDomainWidth / anamorphicAspectRatio;
          const dy = newDomainHeight - oldDomainHeight;
          newYDomain = [+yDomain[0] - dy * fitAlign[1] as unknown as Y,
                        +yDomain[1] + dy * (1 - fitAlign[1]) as unknown as Y];
        }
      }
    }

    if (xDataDomain !== void 0) {
      const xDomain = newXDomain !== void 0 ? newXDomain :
                      oldXDomain !== void 0 ? oldXDomain :
                      (oldXDomain = oldXScale.domain, oldXDomain);
      const xDomainBounds = this.xDomainBounds.state;
      const xDomainMin = typeof xDomainBounds[0] === "boolean" ? xDataDomain[0] : xDomainBounds[0];
      const xDomainMax = typeof xDomainBounds[1] === "boolean" ? xDataDomain[1] : xDomainBounds[1];
      if (+xDomain[0] - Equivalent.Epsilon <= +xDomainMin + Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XMinInRangeFlag);
      }
      if (+xDomainMax - Equivalent.Epsilon <= +xDomain[1] + Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XMaxInRangeFlag);
      }
    }

    if (yDataDomain !== void 0) {
      const yDomain = newYDomain !== void 0 ? newYDomain :
                      oldYDomain !== void 0 ? oldYDomain :
                      (oldYDomain = oldYScale.domain, oldYDomain);
      const yDomainBounds = this.yDomainBounds.state;
      const yDomainMin = typeof yDomainBounds[0] === "boolean" ? yDataDomain[0] : yDomainBounds[0];
      const yDomainMax = typeof yDomainBounds[1] === "boolean" ? yDataDomain[1] : yDomainBounds[1];
      if (+yDomain[0] - Equivalent.Epsilon <= +yDomainMin + Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YMinInRangeFlag);
      }
      if (+yDomainMax - Equivalent.Epsilon <= +yDomain[1] + Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YMaxInRangeFlag);
      }
    }

    if (newXDomain !== void 0) {
      let timing: Timing | undefined;
      if ((this.scaleFlags & ScaleView.XFitTweenFlag) !== 0 &&
          (timing = this.rescaleTransition.state, timing !== void 0)) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XFittingFlag);
      }
      this.willFitX(oldXScale);
      this.xDomain(newXDomain instanceof Domain ? newXDomain : Domain(newXDomain[0], newXDomain[1]), timing);
      this.requireUpdate(View.NeedsLayout);
      this.setScaleFlags(this.scaleFlags & ~ScaleView.XFitFlag);
      if (timing === void 0) {
        this.didFitX(this.xScale.getState());
      }
    }

    if (newYDomain !== void 0) {
      let timing: Timing | undefined;
      if ((this.scaleFlags & ScaleView.YFitTweenFlag) !== 0 &&
          (timing = this.rescaleTransition.state, timing !== void 0)) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YFittingFlag);
      }
      this.willFitY(oldYScale);
      this.yDomain(newYDomain instanceof Domain ? newYDomain : Domain(newYDomain[0], newYDomain[1]), timing);
      this.requireUpdate(View.NeedsLayout);
      this.setScaleFlags(this.scaleFlags & ~ScaleView.YFitFlag);
      if (timing === void 0) {
        this.didFitY(this.yScale.getState());
      }
    }

    this.setScaleFlags(this.scaleFlags & ~(ScaleView.FitMask | ScaleView.FitTweenMask));
  }

  protected onBeginFittingXScale(xScale: ContinuousScale<X, number>): void {
    // hook
  }

  protected onEndFittingXScale(xScale: ContinuousScale<X, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.XFittingFlag);
    this.didFitX(xScale);
  }

  protected onInterruptFittingXScale(xScale: ContinuousScale<X, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.XFittingFlag);
    this.didFitX(xScale);
  }

  protected onBeginFittingYScale(yScale: ContinuousScale<Y, number>): void {
    // hook
  }

  protected onEndFittingYScale(yScale: ContinuousScale<Y, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.YFittingFlag);
    this.didFitY(yScale);
  }

  protected onInterruptFittingYScale(yScale: ContinuousScale<Y, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.YFittingFlag);
    this.didFitY(yScale);
  }

  protected willFitX(xScale: ContinuousScale<X, number>): void {
    // hook
  }

  protected didFitX(xScale: ContinuousScale<X, number>): void {
    // hook
  }

  protected willFitY(yScale: ContinuousScale<Y, number>): void {
    // hook
  }

  protected didFitY(yScale: ContinuousScale<Y, number>): void {
    // hook
  }

  /**
   * Clamps scales to domain bounds, and corrects aspect ratio.
   */
  protected boundScales(oldXScale: ContinuousScale<X, number>,
                        oldYScale: ContinuousScale<Y, number>): void {
    const scaleGesture = this.scaleGesture.state;
    const isPressing = scaleGesture !== void 0 && scaleGesture.isPressing();
    const isCoasting = scaleGesture !== void 0 && scaleGesture.isCoasting();
    this.setScaleFlags(this.scaleFlags & ~ScaleView.ClampedMask);

    const xZoomBounds = this.xZoomBounds.state;
    let xZoomMin: number | boolean | undefined = xZoomBounds[0];
    let xZoomMax: number | boolean | undefined = xZoomBounds[1];
    if (xZoomMin === true) {
      if (oldXScale instanceof LinearScale) {
        xZoomMin = ScaleView.LinearZoomMin;
      } else if (oldXScale instanceof TimeScale) {
        xZoomMin = ScaleView.TimeZoomMin;
      } else {
        xZoomMin = void 0;
      }
    } else if (xZoomMin === false) {
      xZoomMin = void 0;
    }
    if (xZoomMax === true) {
      if (oldXScale instanceof LinearScale) {
        xZoomMax = ScaleView.LinearZoomMax;
      } else if (oldXScale instanceof TimeScale) {
        xZoomMax = ScaleView.TimeZoomMax;
      } else {
        xZoomMax = void 0;
      }
    } else if (xZoomMax === false) {
      xZoomMax = void 0;
    }
    const oldXDomain = oldXScale.domain;
    const xDomainBounds = this.xDomainBounds.state;
    const xDataDomainPadded = this.xDataDomainPadded.state;
    const xDomainPadded = xDataDomainPadded !== void 0 ? xDataDomainPadded : oldXDomain;
    const xDomainMin = xDomainBounds[0] === false ? void 0
                     : xDomainBounds[0] === true ? xDomainPadded[0]
                     : xDomainBounds[0];
    const xDomainMax = xDomainBounds[1] === false ? void 0
                     : xDomainBounds[1] === true ? xDomainPadded[1]
                     : xDomainBounds[1];
    const xDomainClamped = oldXScale.clampDomain(xDomainMin, xDomainMax, xZoomMin, xZoomMax).domain;
    let newXDomain: AnyDomain<X> | undefined;
    if (Math.abs(+oldXDomain[0] - +xDomainClamped[0]) >= Equivalent.Epsilon ||
        Math.abs(+oldXDomain[1] - +xDomainClamped[1]) >= Equivalent.Epsilon) {
      newXDomain = xDomainClamped;
      if (Math.abs((+oldXDomain[1] - +oldXDomain[0]) - (+newXDomain[1] - +newXDomain[0])) >= Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.XClampedFlag);
      }
    }

    const yZoomBounds = this.yZoomBounds.state;
    let yZoomMin: number | boolean | undefined = yZoomBounds[0];
    let yZoomMax: number | boolean | undefined = yZoomBounds[1];
    if (yZoomMin === true) {
      if (oldYScale instanceof LinearScale) {
        yZoomMin = ScaleView.LinearZoomMin;
      } else if (oldYScale instanceof TimeScale) {
        yZoomMin = ScaleView.TimeZoomMin;
      } else {
        yZoomMin = void 0;
      }
    } else if (yZoomMin === false) {
      yZoomMin = void 0;
    }
    if (yZoomMax === true) {
      if (oldYScale instanceof LinearScale) {
        yZoomMax = ScaleView.LinearZoomMax;
      } else if (oldYScale instanceof TimeScale) {
        yZoomMax = ScaleView.TimeZoomMax;
      } else {
        yZoomMax = void 0;
      }
    } else if (yZoomMax === false) {
      yZoomMax = void 0;
    }
    const oldYDomain = oldYScale.domain;
    const yDomainBounds = this.yDomainBounds.state;
    const yDataDomainPadded = this.yDataDomainPadded.state;
    const yDomainPadded = yDataDomainPadded !== void 0 ? yDataDomainPadded : oldYDomain;
    const yDomainMin = yDomainBounds[0] === false ? void 0
                     : yDomainBounds[0] === true ? yDomainPadded[0]
                     : yDomainBounds[0];
    const yDomainMax = yDomainBounds[1] === false ? void 0
                     : yDomainBounds[1] === true ? yDomainPadded[1]
                     : yDomainBounds[1];
    const yDomainClamped = oldYScale.clampDomain(yDomainMin, yDomainMax, yZoomMin, yZoomMax).domain;
    let newYDomain: AnyDomain<Y> | undefined;
    if (Math.abs(+oldYDomain[0] - +yDomainClamped[0]) >= Equivalent.Epsilon ||
        Math.abs(+oldYDomain[1] - +yDomainClamped[1]) >= Equivalent.Epsilon) {
      newYDomain = yDomainClamped;
      if (Math.abs((+oldYDomain[1] - +oldYDomain[0]) - (+newYDomain[1] - +newYDomain[0])) >= Equivalent.Epsilon) {
        this.setScaleFlags(this.scaleFlags | ScaleView.YClampedFlag);
      }
    }

    const xDataDomain = this.xDataDomain.state;
    if (xDataDomain !== void 0 && !isPressing && !isCoasting &&
        (this.scaleFlags & ScaleView.XDomainTrackingFlag) !== 0 &&
        ((this.scaleFlags & ScaleView.XMinReboundMask) === ScaleView.XMinReboundMask ||
         (this.scaleFlags & ScaleView.XMaxReboundMask) === ScaleView.XMaxReboundMask)) {
      const xDomain = newXDomain !== void 0 ? newXDomain : oldXDomain;
      let xDomainMin: X;
      let xDomainMax: X;
      if ((this.scaleFlags & ScaleView.XInRangeMask) === ScaleView.XInRangeMask) {
        xDomainMin = xDataDomain[0];
        xDomainMax = xDataDomain[1];
      } else {
        const xDomainWidth = +xDomain[1] - +xDomain[0] as unknown as X;
        if ((this.scaleFlags & ScaleView.XMinReboundMask) === ScaleView.XMinReboundMask) {
          xDomainMin = xDataDomain[0];
          xDomainMax = +xDataDomain[0] + +xDomainWidth as unknown as X;
        } else {
          xDomainMin = +xDataDomain[1] - +xDomainWidth as unknown as X;
          xDomainMax = xDataDomain[1];
        }
      }
      if (Math.abs(+xDomain[0] - +xDomainMin) >= Equivalent.Epsilon ||
          Math.abs(+xDomain[1] - +xDomainMax) >= Equivalent.Epsilon) {
        newXDomain = [xDomainMin, xDomainMax];
      }
    }

    const yDataDomain = this.yDataDomain.state;
    if (yDataDomain !== void 0 && !isPressing && !isCoasting &&
        (this.scaleFlags & ScaleView.YDomainTrackingFlag) !== 0 &&
        ((this.scaleFlags & ScaleView.YMinReboundMask) === ScaleView.YMinReboundMask ||
         (this.scaleFlags & ScaleView.YMaxReboundMask) === ScaleView.YMaxReboundMask)) {
      const yDomain = newYDomain !== void 0 ? newYDomain : oldYDomain;
      let yDomainMin: Y;
      let yDomainMax: Y;
      if ((this.scaleFlags & ScaleView.YInRangeMask) === ScaleView.YInRangeMask) {
        yDomainMin = yDataDomain[0];
        yDomainMax = yDataDomain[1];
      } else {
        const yDomainHeight = +yDomain[1] - +yDomain[0] as unknown as Y;
        if ((this.scaleFlags & ScaleView.YMinReboundMask) === ScaleView.YMinReboundMask) {
          yDomainMin = yDataDomain[0];
          yDomainMax = +yDataDomain[0] + +yDomainHeight as unknown as Y;
        } else {
          yDomainMin = +yDataDomain[1] - +yDomainHeight as unknown as Y;
          yDomainMax = yDataDomain[1];
        }
      }
      if (Math.abs(+yDomain[0] - +yDomainMin) >= Equivalent.Epsilon ||
          Math.abs(+yDomain[1] - +yDomainMax) >= Equivalent.Epsilon) {
        newYDomain = [yDomainMin, yDomainMax];
      }
    }

    const fitAspectRatio = this.fitAspectRatio.state;
    if (fitAspectRatio !== void 0 && (this.scaleFlags & ScaleView.PreserveAspectRatioFlag) !== 0 &&
        (newXDomain !== void 0 || newYDomain !== void 0 || (this.scaleFlags & ScaleView.RescaleFlag) !== 0)) {
      const xDomain = newXDomain !== void 0 ? newXDomain : oldXDomain;
      const yDomain = newYDomain !== void 0 ? newYDomain : oldYDomain;
      const xRange = oldXScale.range;
      const yRange = oldYScale.range;
      const oldDomainWidth = +xDomain[1] - +xDomain[0];
      const oldDomainHeight = +yDomain[1] - +yDomain[0];
      const domainAspectRatio = oldDomainWidth / oldDomainHeight;
      const rangeAspectRatio = (xRange[1] - xRange[0]) / (yRange[0] - yRange[1]);
      const anamorphicAspectRatio = Math.abs(fitAspectRatio * rangeAspectRatio);
      if (Math.abs(domainAspectRatio - anamorphicAspectRatio) >= Equivalent.Epsilon ||
          (this.scaleFlags & ScaleView.RescaleFlag) !== 0) {
        const fitAlign = this.fitAlign.state;
        if (fitAspectRatio < 0 && domainAspectRatio < anamorphicAspectRatio) {
          const newDomainWidth = oldDomainHeight * anamorphicAspectRatio;
          const dx = newDomainWidth - oldDomainWidth;
          newXDomain = [+xDomain[0] - dx * fitAlign[0] as unknown as X,
                        +xDomain[1] + dx * (1 - fitAlign[0]) as unknown as X];
        } else {
          const newDomainHeight = oldDomainWidth / anamorphicAspectRatio;
          const dy = newDomainHeight - oldDomainHeight;
          newYDomain = [+yDomain[0] - dy * fitAlign[1] as unknown as Y,
                        +yDomain[1] + dy * (1 - fitAlign[1]) as unknown as Y];
        }
      }
    }

    if (!isPressing && !isCoasting && (this.scaleFlags & (ScaleView.XTweeningMask)) === 0) {
      const xDataDomain = this.xDataDomain.state;
      if (xDataDomain !== void 0) {
        const xDomain = newXDomain !== void 0 ? newXDomain : oldXDomain;
        const xDomainBounds = this.xDomainBounds.state;
        const xDomainMin = typeof xDomainBounds[0] === "boolean" ? xDataDomain[0] : xDomainBounds[0];
        const xDomainMax = typeof xDomainBounds[1] === "boolean" ? xDataDomain[1] : xDomainBounds[1];
        if (+xDomain[0] - Equivalent.Epsilon <= +xDomainMin + Equivalent.Epsilon) {
          this.setScaleFlags(this.scaleFlags | ScaleView.XMinInRangeFlag);
        } else {
          this.setScaleFlags(this.scaleFlags & ~ScaleView.XMinInRangeFlag);
        }
        if (+xDomainMax - Equivalent.Epsilon <= +xDomain[1] + Equivalent.Epsilon) {
          this.setScaleFlags(this.scaleFlags | ScaleView.XMaxInRangeFlag);
        } else {
          this.setScaleFlags(this.scaleFlags & ~ScaleView.XMaxInRangeFlag);
        }
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.XInRangeMask);
      }
    }

    if (!isPressing && !isCoasting && (this.scaleFlags & (ScaleView.YTweeningMask)) === 0) {
      const yDataDomain = this.yDataDomain.state;
      if (yDataDomain !== void 0) {
        const yDomain = newYDomain !== void 0 ? newYDomain : oldYDomain;
        const yDomainBounds = this.yDomainBounds.state;
        const yDomainMin = typeof yDomainBounds[0] === "boolean" ? yDataDomain[0] : yDomainBounds[0];
        const yDomainMax = typeof yDomainBounds[1] === "boolean" ? yDataDomain[1] : yDomainBounds[1];
        if (+yDomain[0] - Equivalent.Epsilon <= +yDomainMin + Equivalent.Epsilon) {
          this.setScaleFlags(this.scaleFlags | ScaleView.YMinInRangeFlag);
        } else {
          this.setScaleFlags(this.scaleFlags & ~ScaleView.YMinInRangeFlag);
        }
        if (+yDomainMax - Equivalent.Epsilon <= +yDomain[1] + Equivalent.Epsilon) {
          this.setScaleFlags(this.scaleFlags | ScaleView.YMaxInRangeFlag);
        } else {
          this.setScaleFlags(this.scaleFlags & ~ScaleView.YMaxInRangeFlag);
        }
      } else {
        this.setScaleFlags(this.scaleFlags & ~ScaleView.YInRangeMask);
      }
    }

    if (newXDomain !== void 0 && !isPressing && (this.scaleFlags & ScaleView.XTweeningMask) === 0 &&
        (Math.abs(+newXDomain[0] - +oldXDomain[0]) >= Equivalent.Epsilon ||
         Math.abs(+newXDomain[1] - +oldXDomain[1]) >= Equivalent.Epsilon)) {
      let timing: Timing | undefined;
      if ((this.scaleFlags & (ScaleView.XBoundingFlag | ScaleView.RescaleFlag)) === 0) {
        timing = (this.scaleFlags & ScaleView.InteractingMask) !== 0
               ? this.reboundTransition.state : this.rescaleTransition.state;
        if (timing !== void 0) {
          this.setScaleFlags(this.scaleFlags | ScaleView.XBoundingFlag);
        }
      }
      this.willReboundX(oldXScale);
      this.xDomain(newXDomain instanceof Domain ? newXDomain : Domain(newXDomain[0], newXDomain[1]), timing);
      this.requireUpdate(View.NeedsLayout);
      if (timing === void 0) {
        this.didReboundX(this.xScale.getState());
      }
    }

    if (newYDomain !== void 0 && !isPressing && (this.scaleFlags & ScaleView.YTweeningMask) === 0 &&
        (Math.abs(+newYDomain[0] - +oldYDomain[0]) >= Equivalent.Epsilon ||
         Math.abs(+newYDomain[1] - +oldYDomain[1]) >= Equivalent.Epsilon)) {
      let timing: Timing | undefined;
      if ((this.scaleFlags & (ScaleView.YBoundingFlag | ScaleView.RescaleFlag)) === 0) {
        timing = (this.scaleFlags & ScaleView.InteractingMask) !== 0
               ? this.reboundTransition.state : this.rescaleTransition.state;
        if (timing !== void 0) {
          this.setScaleFlags(this.scaleFlags | ScaleView.YBoundingFlag);
        }
      }
      this.willReboundY(oldYScale);
      this.yDomain(newYDomain instanceof Domain ? newYDomain : Domain(newYDomain[0], newYDomain[1]), timing);
      this.requireUpdate(View.NeedsLayout);
      if (timing === void 0) {
        this.didReboundY(this.yScale.getState());
      }
    }

    if ((this.scaleFlags & ScaleView.XBoundingFlag) === 0) {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.XChangingMask);
    }
    if ((this.scaleFlags & ScaleView.YBoundingFlag) === 0) {
      this.setScaleFlags(this.scaleFlags & ~ScaleView.YChangingMask);
    }
    this.setScaleFlags(this.scaleFlags & ~(ScaleView.InteractedFlag | ScaleView.RescaleFlag));
  }

  protected onBeginBoundingXScale(xScale: ContinuousScale<X, number>): void {
    // hook
  }

  protected onEndBoundingXScale(xScale: ContinuousScale<X, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.XBoundingFlag);
    this.didReboundX(xScale);
  }

  protected onInterruptBoundingXScale(xScale: ContinuousScale<X, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.XBoundingFlag);
    this.didReboundX(xScale);
  }

  protected onBeginBoundingYScale(yScale: ContinuousScale<Y, number>): void {
    // hook
  }

  protected onEndBoundingYScale(yScale: ContinuousScale<Y, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.YBoundingFlag);
    this.didReboundY(yScale);
  }

  protected onInterruptBoundingYScale(yScale: ContinuousScale<Y, number>): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.YBoundingFlag);
    this.didReboundY(yScale);
  }

  protected willReboundX(xScale: ContinuousScale<X, number>): void {
    const scaleGesture = this.scaleGesture.state;
    if (scaleGesture !== void 0) {
      scaleGesture.neutralizeX();
    }
  }

  protected didReboundX(xScale: ContinuousScale<X, number>): void {
    // hook
  }

  protected willReboundY(yScale: ContinuousScale<Y, number>): void {
    const scaleGesture = this.scaleGesture.state;
    if (scaleGesture !== void 0) {
      scaleGesture.neutralizeY();
    }
  }

  protected didReboundY(yScale: ContinuousScale<Y, number>): void {
    // hook
  }

  willStartInteracting(): void {
    this.setScaleFlags(this.scaleFlags | ScaleView.InteractingFlag);
  }

  didStopInteracting(): void {
    this.setScaleFlags(this.scaleFlags & ~ScaleView.InteractingFlag | ScaleView.InteractedFlag);
  }

  didStopPressing(): void {
    this.requireUpdate(View.NeedsAnimate);
  }

  willBeginCoast(input: ScaleGestureInput<X, Y>, event: Event | null): boolean | void {
    if ((this.scaleFlags & ScaleView.XGesturesFlag) === 0) {
      input.disableX = true;
      input.vx = 0;
      input.ax = 0;
    }
    if ((this.scaleFlags & ScaleView.YGesturesFlag) === 0) {
      input.disableY = true;
      input.vy = 0;
      input.ay = 0;
    }
  }

  /** @hidden */
  static createScale<X, Y>(x0: X, x1: X, y0: Y | undefined, y1: Y | undefined): ContinuousScale<X, Y> {
    let range: LinearRange;
    if (typeof y0 === "number" && typeof y1 === "number") {
      range = LinearRange(y0, y1);
    } else {
      range = LinearRange(0, 1);
    }
    if (typeof x0 === "number" && typeof x1 === "number") {
      return LinearScale(LinearDomain(x0, x1), range) as unknown as ContinuousScale<X, Y>;
    } else if (x0 instanceof DateTime && x1 instanceof DateTime) {
      return TimeScale(TimeDomain(x0, x1), range) as unknown as ContinuousScale<X, Y>;
    } else {
      throw new TypeError(x0 + ", " + x1 + ", " + y0 + ", " + y1);
    }
  }

  /** @hidden */
  static parseScale<X, Y>(string: string): ContinuousScale<X, Y> {
    if (string === "linear") {
      return LinearScale(LinearDomain(0, 1), LinearRange(0, 1)) as unknown as ContinuousScale<X, Y>;
    } else if (string === "time") {
      const d1 = DateTime.current();
      const d0 = d1.withDay(d1.day - 1);
      return TimeScale(TimeDomain(d0, d1), LinearRange(0, 1)) as unknown as ContinuousScale<X, Y>;
    } else {
      const domain = string.split("...");
      const x0 = +domain[0]!;
      const x1 = +domain[1]!;
      if (isFinite(x0) && isFinite(x1)) {
        return LinearScale(LinearDomain(x0, x1), LinearRange(0, 1)) as unknown as ContinuousScale<X, Y>;
      } else {
        const d0 = DateTime.parse(domain[0]!);
        const d1 = DateTime.parse(domain[1]!);
        return TimeScale(TimeDomain(d0, d1), LinearRange(0, 1)) as unknown as ContinuousScale<X, Y>;
      }
    }
    throw new TypeError("" + string);
  }

  /** @hidden */
  static readonly PreserveAspectRatioFlag: ScaleFlags = 1 << 0;
  /** @hidden */
  static readonly XDomainTrackingFlag: ScaleFlags = 1 << 1;
  /** @hidden */
  static readonly YDomainTrackingFlag: ScaleFlags = 1 << 2;
  /** @hidden */
  static readonly XGesturesFlag: ScaleFlags = 1 << 3;
  /** @hidden */
  static readonly YGesturesFlag: ScaleFlags = 1 << 4;
  /** @hidden */
  static readonly XMinInRangeFlag: ScaleFlags = 1 << 5;
  /** @hidden */
  static readonly XMaxInRangeFlag: ScaleFlags = 1 << 6;
  /** @hidden */
  static readonly YMinInRangeFlag: ScaleFlags = 1 << 7;
  /** @hidden */
  static readonly YMaxInRangeFlag: ScaleFlags = 1 << 8;
  /** @hidden */
  static readonly XMinChangingFlag: ScaleFlags = 1 << 9;
  /** @hidden */
  static readonly XMaxChangingFlag: ScaleFlags = 1 << 10;
  /** @hidden */
  static readonly YMinChangingFlag: ScaleFlags = 1 << 11;
  /** @hidden */
  static readonly YMaxChangingFlag: ScaleFlags = 1 << 12;
  /** @hidden */
  static readonly InteractingFlag: ScaleFlags = 1 << 13;
  /** @hidden */
  static readonly InteractedFlag: ScaleFlags = 1 << 14;
  /** @hidden */
  static readonly XFittingFlag: ScaleFlags = 1 << 15;
  /** @hidden */
  static readonly YFittingFlag: ScaleFlags = 1 << 16;
  /** @hidden */
  static readonly XBoundingFlag: ScaleFlags = 1 << 17;
  /** @hidden */
  static readonly YBoundingFlag: ScaleFlags = 1 << 18;
  /** @hidden */
  static readonly XClampedFlag: ScaleFlags = 1 << 19;
  /** @hidden */
  static readonly YClampedFlag: ScaleFlags = 1 << 20;
  /** @hidden */
  static readonly XFitFlag: ScaleFlags = 1 << 21;
  /** @hidden */
  static readonly YFitFlag: ScaleFlags = 1 << 22;
  /** @hidden */
  static readonly XFitTweenFlag: ScaleFlags = 1 << 23;
  /** @hidden */
  static readonly YFitTweenFlag: ScaleFlags = 1 << 24;
  /** @hidden */
  static readonly RescaleFlag: ScaleFlags = 1 << 25;

  /** @hidden */
  static readonly DomainTrackingMask: ScaleFlags = ScaleView.XDomainTrackingFlag
                                                 | ScaleView.YDomainTrackingFlag;
  /** @hidden */
  static readonly GesturesMask: ScaleFlags = ScaleView.XGesturesFlag
                                           | ScaleView.YGesturesFlag;
  /** @hidden */
  static readonly XInRangeMask: ScaleFlags = ScaleView.XMinInRangeFlag
                                           | ScaleView.XMaxInRangeFlag;
  /** @hidden */
  static readonly YInRangeMask: ScaleFlags = ScaleView.YMinInRangeFlag
                                           | ScaleView.YMaxInRangeFlag;
  /** @hidden */
  static readonly XChangingMask: ScaleFlags = ScaleView.XMinChangingFlag
                                            | ScaleView.XMaxChangingFlag;
  /** @hidden */
  static readonly YChangingMask: ScaleFlags = ScaleView.YMinChangingFlag
                                            | ScaleView.YMaxChangingFlag;
  /** @hidden */
  static readonly ChangingMask: ScaleFlags = ScaleView.XChangingMask
                                           | ScaleView.YChangingMask;
  /** @hidden */
  static readonly XMinReboundMask: ScaleFlags = ScaleView.XMinInRangeFlag
                                              | ScaleView.XMinChangingFlag;
  /** @hidden */
  static readonly XMaxReboundMask: ScaleFlags = ScaleView.XMaxInRangeFlag
                                              | ScaleView.XMaxChangingFlag;
  /** @hidden */
  static readonly YMinReboundMask: ScaleFlags = ScaleView.YMinInRangeFlag
                                              | ScaleView.YMinChangingFlag;
  /** @hidden */
  static readonly YMaxReboundMask: ScaleFlags = ScaleView.YMaxInRangeFlag
                                              | ScaleView.YMaxChangingFlag;
  /** @hidden */
  static readonly XReboundMask: ScaleFlags = ScaleView.XMinReboundMask
                                           | ScaleView.XMaxReboundMask;
  /** @hidden */
  static readonly YReboundMask: ScaleFlags = ScaleView.YMinReboundMask
                                           | ScaleView.YMaxReboundMask;
  /** @hidden */
  static readonly InteractingMask: ScaleFlags = ScaleView.InteractingFlag
                                              | ScaleView.InteractedFlag;
  /** @hidden */
  static readonly FittingMask: ScaleFlags = ScaleView.XFittingFlag
                                          | ScaleView.YFittingFlag;
  /** @hidden */
  static readonly BoundingMask: ScaleFlags = ScaleView.XBoundingFlag
                                           | ScaleView.YBoundingFlag;
  /** @hidden */
  static readonly ClampedMask: ScaleFlags = ScaleView.XClampedFlag
                                          | ScaleView.YClampedFlag;
  /** @hidden */
  static readonly FitMask: ScaleFlags = ScaleView.XFitFlag
                                      | ScaleView.YFitFlag;
  /** @hidden */
  static readonly FitTweenMask: ScaleFlags = ScaleView.XFitTweenFlag
                                           | ScaleView.YFitTweenFlag;
  /** @hidden */
  static readonly XTweeningMask: ScaleFlags = ScaleView.XBoundingFlag
                                            | ScaleView.XFittingFlag;
  /** @hidden */
  static readonly YTweeningMask: ScaleFlags = ScaleView.YBoundingFlag
                                            | ScaleView.YFittingFlag;
  /** @hidden */
  static readonly TweeningMask: ScaleFlags = ScaleView.XTweeningMask
                                           | ScaleView.YTweeningMask;

  /** @hidden */
  static LinearZoomMin: number = 1000000;
  /** @hidden */
  static LinearZoomMax: number = 0.001;
  /** @hidden */
  static TimeZoomMin: number = 86400000;
  /** @hidden */
  static TimeZoomMax: number = 1;

  static readonly mountFlags: ViewFlags = LayerView.mountFlags | View.NeedsAnimate;
  static readonly powerFlags: ViewFlags = LayerView.powerFlags | View.NeedsResize | View.NeedsAnimate;

  static readonly insertChildFlags: ViewFlags = LayerView.insertChildFlags | View.NeedsResize | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = LayerView.removeChildFlags | View.NeedsAnimate;
}
