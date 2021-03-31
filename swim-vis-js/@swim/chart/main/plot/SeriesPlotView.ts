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

import {Equals, Values} from "@swim/util";
import {Domain, Range, AnyTiming, LinearRange, ContinuousScale} from "@swim/mapping";
import {BTree} from "@swim/collections";
import type {BoxR2} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewProperty, ViewAnimator, ViewFastener} from "@swim/view";
import {GraphicsView, CanvasContext, CanvasRenderer} from "@swim/graphics";
import type {DataPointCategory} from "../data/DataPoint";
import {AnyDataPointView, DataPointView} from "../data/DataPointView";
import {ContinuousScaleAnimator} from "../scaled/ContinuousScaleAnimator";
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
    Object.defineProperty(this, "dataPointFasteners", {
      value: new BTree(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "xDataDomain", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "yDataDomain", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "xDataRange", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "yDataRange", {
      value: null,
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

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewProperty({type: String, state: "domain"})
  declare hitMode: ViewProperty<this, SeriesPlotHitMode>;

  protected willSetXScale(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewWillSetXScale !== void 0) {
      viewController.scaledViewWillSetXScale(newXScale, oldXScale, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewWillSetXScale !== void 0) {
        viewObserver.scaledViewWillSetXScale(newXScale, oldXScale, this);
      }
    }
  }

  protected onSetXScale(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
    this.updateXDataRange();
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetXScale(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewDidSetXScale !== void 0) {
        viewObserver.scaledViewDidSetXScale(newXScale, oldXScale, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewDidSetXScale !== void 0) {
      viewController.scaledViewDidSetXScale(newXScale, oldXScale, this);
    }
  }

  @ViewAnimator<SeriesPlotView<X, Y>, ContinuousScale<X, number> | null>({
    extends: ContinuousScaleAnimator,
    type: ContinuousScale,
    inherit: true,
    willSetValue(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
      this.owner.willSetXScale(newXScale, oldXScale);
    },
    onSetValue(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
      this.owner.onSetXScale(newXScale, oldXScale);
    },
    didSetValue(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null): void {
      this.owner.didSetXScale(newXScale, oldXScale);
    },
  })
  declare xScale: ContinuousScaleAnimator<this, X, number>;

  protected willSetYScale(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewWillSetYScale !== void 0) {
      viewController.scaledViewWillSetYScale(newYScale, oldYScale, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewWillSetYScale !== void 0) {
        viewObserver.scaledViewWillSetYScale(newYScale, oldYScale, this);
      }
    }
  }

  protected onSetYScale(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
    this.updateYDataRange();
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetYScale(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewDidSetYScale !== void 0) {
        viewObserver.scaledViewDidSetYScale(newYScale, oldYScale, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewDidSetYScale !== void 0) {
      viewController.scaledViewDidSetYScale(newYScale, oldYScale, this);
    }
  }

  @ViewAnimator<SeriesPlotView<X, Y>, ContinuousScale<Y, number> | null>({
    extends: ContinuousScaleAnimator,
    type: ContinuousScale,
    inherit: true,
    willSetValue(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
      this.owner.willSetYScale(newYScale, oldYScale);
    },
    onSetValue(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
      this.owner.onSetYScale(newYScale, oldYScale);
    },
    didSetValue(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null): void {
      this.owner.didSetYScale(newYScale, oldYScale);
    },
  })
  declare yScale: ContinuousScaleAnimator<this, Y, number>;

  xDomain(): Domain<X> | null;
  xDomain(xDomain: Domain<X> | string | null, timing?: AnyTiming | boolean): this;
  xDomain(xMin: X, xMax: X, timing: AnyTiming | boolean): this;
  xDomain(xMin?: Domain<X> | X | string | null, xMax?: X | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<X> | null | this {
    if (arguments.length === 0) {
      const xScale = this.xScale.value;
      return xScale !== null ? xScale.domain : null;
    } else {
      this.xScale.setDomain(xMin as any, xMax as any, timing);
      return this;
    }
  }

  yDomain(): Domain<Y> | null;
  yDomain(yDomain: Domain<Y> | string | null, timing?: AnyTiming | boolean): this;
  yDomain(yMin: Y, yMax: Y, timing: AnyTiming | boolean): this;
  yDomain(yMin?: Domain<Y> | Y | string | null, yMax?: Y | AnyTiming | boolean,
          timing?: AnyTiming | boolean): Domain<Y> | null | this {
    if (arguments.length === 0) {
      const yScale = this.yScale.value;
      return yScale !== null ? yScale.domain : null;
    } else {
      this.yScale.setDomain(yMin as any, yMax as any, timing);
      return this;
    }
  }

  xRange(): Range<number> | null {
    const xScale = this.xScale.value;
    return xScale !== null ? xScale.range : null;
  }

  yRange(): Range<number> | null {
    const yScale = this.yScale.value;
    return yScale !== null ? yScale.range : null;
  }

  declare readonly xDataDomain: Domain<X> | null;

  protected setXDataDomain(newXDataDomain: Domain<X> | null): void {
    const oldXDataDomain = this.xDataDomain;
    if (!Equals(newXDataDomain, oldXDataDomain)) {
      this.willSetXDataDomain(newXDataDomain, oldXDataDomain);
      Object.defineProperty(this, "xDataDomain", {
        value: newXDataDomain,
        enumerable: true,
        configurable: true,
      });
      this.onSetXDataDomain(newXDataDomain, oldXDataDomain);
      this.didSetXDataDomain(newXDataDomain, oldXDataDomain);
    }
  }

  protected willSetXDataDomain(newXDataDomain: Domain<X> | null, oldXDataDomain: Domain<X> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewWillSetXDataDomain !== void 0) {
      viewController.scaledViewWillSetXDataDomain(newXDataDomain, oldXDataDomain, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewWillSetXDataDomain !== void 0) {
        viewObserver.scaledViewWillSetXDataDomain(newXDataDomain, oldXDataDomain, this);
      }
    }
  }

  protected onSetXDataDomain(newXDataDomain: Domain<X> | null, oldXDataDomain: Domain<X> | null): void {
    this.updateXDataRange();
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetXDataDomain(newXDataDomain: Domain<X> | null, oldXDataDomain: Domain<X> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewDidSetXDataDomain !== void 0) {
        viewObserver.scaledViewDidSetXDataDomain(newXDataDomain, oldXDataDomain, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewDidSetXDataDomain !== void 0) {
      viewController.scaledViewDidSetXDataDomain(newXDataDomain, oldXDataDomain, this);
    }
  }

  protected updateXDataDomain(dataPointView: DataPointView<X, Y>): void {
    const x = dataPointView.x.value;
    let xDataDomain = this.xDataDomain;
    if (xDataDomain === null) {
      xDataDomain = Domain(x, x);
    } else {
      if (Values.compare(x, xDataDomain[0]) < 0) {
        xDataDomain = Domain(x, xDataDomain[1]);
      } else if (Values.compare(xDataDomain[1], x) < 0) {
        xDataDomain = Domain(xDataDomain[0], x);
      }
    }
    this.setXDataDomain(xDataDomain);
  }

  declare readonly yDataDomain: Domain<Y> | null;

  protected setYDataDomain(newYDataDomain: Domain<Y> | null): void {
    const oldYDataDomain = this.yDataDomain;
    if (!Equals(newYDataDomain, oldYDataDomain)) {
      this.willSetYDataDomain(newYDataDomain, oldYDataDomain);
      Object.defineProperty(this, "yDataDomain", {
        value: newYDataDomain,
        enumerable: true,
        configurable: true,
      });
      this.onSetYDataDomain(newYDataDomain, oldYDataDomain);
      this.didSetYDataDomain(newYDataDomain, oldYDataDomain);
    }
  }

  protected willSetYDataDomain(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewWillSetYDataDomain !== void 0) {
      viewController.scaledViewWillSetYDataDomain(newYDataDomain, oldYDataDomain, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewWillSetYDataDomain !== void 0) {
        viewObserver.scaledViewWillSetYDataDomain(newYDataDomain, oldYDataDomain, this);
      }
    }
  }

  protected onSetYDataDomain(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null): void {
    this.updateYDataRange();
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetYDataDomain(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.scaledViewDidSetYDataDomain !== void 0) {
        viewObserver.scaledViewDidSetYDataDomain(newYDataDomain, oldYDataDomain, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.scaledViewDidSetYDataDomain !== void 0) {
      viewController.scaledViewDidSetYDataDomain(newYDataDomain, oldYDataDomain, this);
    }
  }

  protected updateYDataDomain(dataPointView: DataPointView<X, Y>): void {
    const y = dataPointView.y.value;
    const y2 = dataPointView.y2.value;
    let yDataDomain = this.yDataDomain;
    if (yDataDomain === null) {
      yDataDomain = Domain(y, y);
    } else {
      if (Values.compare(y, yDataDomain[0]) < 0) {
        yDataDomain = Domain(y, yDataDomain[1]);
      } else if (Values.compare(yDataDomain[1], y) < 0) {
        yDataDomain = Domain(yDataDomain[0], y);
      }
      if (y2 !== void 0) {
        if (Values.compare(y2, yDataDomain[0]) < 0) {
          yDataDomain = Domain(y2, yDataDomain[1]);
        } else if (Values.compare(yDataDomain[1], y2) < 0) {
          yDataDomain = Domain(yDataDomain[0], y2);
        }
      }
    }
    this.setYDataDomain(yDataDomain);
  }

  declare readonly xDataRange: Range<number> | null;

  protected setXDataRange(xDataRange: Range<number> | null): void {
    Object.defineProperty(this, "xDataRange", {
      value: xDataRange,
      enumerable: true,
      configurable: true,
    });
  }

  protected updateXDataRange(): void {
    const xDataDomain = this.xDataDomain;
    if (xDataDomain !== null) {
      const xScale = this.xScale.value;
      if (xScale !== null) {
        this.setXDataRange(LinearRange(xScale(xDataDomain[0]), xScale(xDataDomain[1])));
      } else {
        this.setXDataRange(null);
      }
    }
  }

  declare readonly yDataRange: Range<number> | null;

  protected setYDataRange(yDataRange: Range<number> | null): void {
    Object.defineProperty(this, "yDataRange", {
      value: yDataRange,
      enumerable: true,
      configurable: true,
    });
  }

  protected updateYDataRange(): void {
    const yDataDomain = this.yDataDomain;
    if (yDataDomain !== null) {
      const yScale = this.yScale.value;
      if (yScale !== null) {
        this.setYDataRange(LinearRange(yScale(yDataDomain[0]), yScale(yDataDomain[1])));
      } else {
        this.setYDataRange(null);
      }
    }
  }

  /** @hidden */
  declare readonly gradientStops: number;

  insertDataPoint(dataPointView: AnyDataPointView<X, Y>, targetView: View | null = null): void {
    dataPointView = DataPointView.fromAny(dataPointView);
    dataPointView.remove();
    const x = dataPointView.x.getState();
    this.removeDataPoint(x);
    const dataPointFastener = this.createDataPointFastener(dataPointView);
    this.willInsertChildView(dataPointView, null);
    this.dataPointFasteners.set(x, dataPointFastener);
    dataPointFastener.setView(dataPointView, targetView);
    dataPointView.setParentView(this, null);
    this.onInsertChildView(dataPointView, null);
    this.didInsertChildView(dataPointView, null);
    dataPointView.cascadeInsert();
    if (this.isMounted()) {
      dataPointFastener.mount();
    }
  }

  insertDataPoints(...dataPointViews: AnyDataPointView<X, Y>[]): void {
    for (let i = 0, n = dataPointViews.length; i < n; i += 1) {
      this.insertDataPoint(dataPointViews[i]!);
    }
  }

  removeDataPoint(x: X): void;
  removeDataPoint(dataPointView: DataPointView<X, Y>): void;
  removeDataPoint(x: X | DataPointView<X, Y>): void {
    if (x instanceof DataPointView) {
      x = x.x.getState();
    }
    const dataPointFastener = this.dataPointFasteners.get(x);
    if (dataPointFastener !== void 0) {
      const dataPointView = dataPointFastener.view!;
      if (dataPointView.parentView !== this) {
        throw new Error("not a child view");
      }
      this.willRemoveChildView(dataPointView);
      dataPointView.setParentView(null, this);
      this.dataPointFasteners.delete(x);
      this.onRemoveChildView(dataPointView);
      this.didRemoveChildView(dataPointView);
      dataPointView.setKey(void 0);
      dataPointFastener.setView(null);
      if (this.isMounted()) {
        dataPointFastener.unmount();
      }
    }
  }

  protected initDataPoint(dataPointView: DataPointView<X, Y>, dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    const labelView = dataPointView.label.view;
    if (labelView !== null) {
      this.initDataPointLabel(labelView, dataPointView, dataPointFastener);
    }
  }

  protected willSetDataPoint(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null,
                             targetView: View | null, dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.plotViewWillSetDataPoint !== void 0) {
      viewController.plotViewWillSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.plotViewWillSetDataPoint !== void 0) {
        viewObserver.plotViewWillSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
      }
    }
  }

  protected onSetDataPoint(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null,
                           targetView: View | null, dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    if (newDataPointView !== null) {
      this.initDataPoint(newDataPointView, dataPointFastener);
      if (newDataPointView !== null) {
        this.updateXDataDomain(newDataPointView);
        this.updateYDataDomain(newDataPointView);
      }
    }
  }

  protected didSetDataPoint(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null,
                            targetView: View | null, dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.plotViewDidSetDataPoint !== void 0) {
        viewObserver.plotViewDidSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.plotViewDidSetDataPoint !== void 0) {
      viewController.plotViewDidSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
    }
  }

  protected onSetDataPointX(x: X, dataPointView: DataPointView<X, Y>,
                            dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    this.updateXDataDomain(dataPointView);
    this.requireUpdate(View.NeedsLayout);
  }

  protected onSetDataPointY(y: Y, dataPointView: DataPointView<X, Y>,
                            dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    this.updateYDataDomain(dataPointView);
    this.requireUpdate(View.NeedsLayout);
  }

  protected onSetDataPointY2(y2: Y | undefined, dataPointView: DataPointView<X, Y>,
                             dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    this.updateYDataDomain(dataPointView);
    this.requireUpdate(View.NeedsLayout);
  }

  protected initDataPointLabel(labelView: GraphicsView, dataPointView: DataPointView<X, Y>,
                               dataPointFastener: ViewFastener<this, DataPointView<X, Y>>): void {
    this.requireUpdate(View.NeedsLayout);
  }

  /** @hidden */
  static DataPointFastener = ViewFastener.define<SeriesPlotView<unknown, unknown>, DataPointView<unknown, unknown>>({
    child: false,
    observe: true,
    willSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null, targetView: View | null): void {
      this.owner.willSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
    },
    onSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null, targetView: View | null): void {
      this.owner.onSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
    },
    didSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null, targetView: View | null): void {
      this.owner.didSetDataPoint(newDataPointView, oldDataPointView, targetView, this);
    },
    dataPointViewDidSetX(newX: unknown, oldX: unknown, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointX(newX, dataPointView, this);
    },
    dataPointViewDidSetY(newY: unknown, oldY: unknown, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointY(newY, dataPointView, this);
    },
    dataPointViewDidSetY2(newY2: unknown, oldY2: unknown, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointY2(newY2, dataPointView, this);
    },
    dataPointViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, dataPointView: DataPointView<unknown, unknown>): void {
      if (newLabelView !== null) {
        this.owner.initDataPointLabel(newLabelView, dataPointView, this);
      }
    },
  });

  protected createDataPointFastener(dataPointView: DataPointView<X, Y>): ViewFastener<this, DataPointView<X, Y>> {
    return new SeriesPlotView.DataPointFastener(this as SeriesPlotView<unknown, unknown>, dataPointView.key, "dataPoint") as ViewFastener<this, DataPointView<X, Y>>;
  }

  /** @hidden */
  declare readonly dataPointFasteners: BTree<X, ViewFastener<this, DataPointView<X, Y>>>;

  /** @hidden */
  getDataPointFastener(x: X): ViewFastener<this, DataPointView<X, Y>> | null {
    const dataPointFastener = this.dataPointFasteners.get(x);
    return dataPointFastener !== void 0 ? dataPointFastener : null;
  }

  getDataPointView(x: X): DataPointView<X, Y> | null {
    const dataPointFastener = this.dataPointFasteners.get(x);
    return dataPointFastener !== void 0 ? dataPointFastener.view : null;
  }

  /** @hidden */
  protected mountDataPointFasteners(): void {
    type self = this;
    this.dataPointFasteners.forEachValue(function (dataPointFastener: ViewFastener<self, DataPointView<X, Y>>): void {
      dataPointFastener.mount();
    }, this);
  }

  /** @hidden */
  protected unmountDataPointFasteners(): void {
    type self = this;
    this.dataPointFasteners.forEachValue(function (dataPointFastener: ViewFastener<self, DataPointView<X, Y>>): void {
      dataPointFastener.unmount();
    }, this);
  }

  get childViewCount(): number {
    return this.dataPointFasteners.size;
  }

  get childViews(): ReadonlyArray<View> {
    const childViews: View[] = [];
    type self = this;
    this.dataPointFasteners.forEachValue(function (dataPointFastener: ViewFastener<self, DataPointView<X, Y>>): void {
      childViews.push(dataPointFastener.view!);
    }, this);
    return childViews;
  }

  firstChildView(): View | null {
    const dataPointFastener = this.dataPointFasteners.firstValue();
    return dataPointFastener !== void 0 ? dataPointFastener.view! : null;
  }

  lastChildView(): View | null {
    const dataPointFastener = this.dataPointFasteners.lastValue();
    return dataPointFastener !== void 0 ? dataPointFastener.view! : null;
  }

  nextChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const dataPointFastener = this.dataPointFasteners.nextValue(targetView.x.getState());
      if (dataPointFastener !== void 0) {
        return dataPointFastener.view!;
      }
    }
    return null;
  }

  previousChildView(targetView: View): View | null {
    if (targetView instanceof DataPointView) {
      const dataPointFastener = this.dataPointFasteners.previousValue(targetView.x.getState());
      if (dataPointFastener !== void 0) {
        return dataPointFastener.view!;
      }
    }
    return null;
  }

  forEachChildView<T>(callback: (childView: View) => T | void): T | undefined;
  forEachChildView<T, S>(callback: (this: S, childView: View) => T | void,
                         thisArg: S): T | undefined;
  forEachChildView<T, S>(callback: (this: S | undefined, childView: View) => T | void,
                         thisArg?: S): T | undefined {
    type self = this;
    return this.dataPointFasteners.forEachValue(function (dataPointFastener: ViewFastener<self, DataPointView<X, Y>>): T | void {
      const result = callback.call(thisArg, dataPointFastener.view!);
      if (result !== void 0) {
        return result;
      }
    }, thisArg);
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
    type self = this;
    this.dataPointFasteners.forEach(function (x: X, dataPointFastener: ViewFastener<self, DataPointView<X, Y>>): void {
      const childView = dataPointFastener.view!;
      this.willRemoveChildView(childView);
      childView.setParentView(null, this);
      this.dataPointFasteners.delete(x);
      this.onRemoveChildView(childView);
      this.didRemoveChildView(childView);
      childView.setKey(void 0);
      dataPointFastener.setView(null);
      if (this.isMounted()) {
        dataPointFastener.unmount();
      }
    }, this);
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.xScale.onAnimate(viewContext.updateTime);
    this.yScale.onAnimate(viewContext.updateTime);
    this.resizeScales(this.viewFrame);
  }

  /**
   * Updates own scale ranges to project onto view frame.
   */
  protected resizeScales(frame: BoxR2): void {
    const xScale = !this.xScale.isInherited() ? this.xScale.ownValue : null;
    if (xScale !== null && xScale.range[1] !== frame.width) {
      this.xScale.setRange(0, frame.width);
    }
    const yScale = !this.yScale.isInherited() ? this.yScale.ownValue : null;
    if (yScale !== null && yScale.range[1] !== frame.height) {
      this.yScale.setRange(0, frame.height);
    }
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    let xScale: ContinuousScale<X, number> | null;
    let yScale: ContinuousScale<Y, number> | null;
    if ((displayFlags & View.NeedsLayout) !== 0 &&
        (xScale = this.xScale.value, xScale !== null) &&
        (yScale = this.yScale.value, yScale !== null)) {
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
    // Recompute extrema when laying out child views.
    const frame = this.viewFrame;
    let xDataDomainMin: X | undefined;
    let xDataDomainMax: X | undefined;
    let yDataDomainMin: Y | undefined;
    let yDataDomainMax: Y | undefined;
    let gradientStops = 0;

    let point0 = null as DataPointView<X, Y> | null;
    let point1 = null as DataPointView<X, Y> | null;
    let y0: Y | undefined;
    let y1: Y | undefined;
    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
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

      if (point1 !== null) {
        let category: DataPointCategory;
        if (point0 !== null) {
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
        point1.category.setAutoState(category);

        // update extrema
        if (Values.compare(y2, yDataDomainMin) < 0) {
          yDataDomainMin = y2;
        } else if (Values.compare(yDataDomainMax, y2) < 0) {
          yDataDomainMax = y2;
        }
        if (dy2 !== void 0) {
          if (Values.compare(dy2, yDataDomainMin) < 0) {
            yDataDomainMin = dy2;
          } else if (Values.compare(yDataDomainMax, dy2) < 0) {
            yDataDomainMax = dy2;
          }
        }
      } else {
        xDataDomainMin = x2;
        xDataDomainMax = x2;
        yDataDomainMin = y2;
        yDataDomainMax = y2;
      }

      point0 = point1;
      point1 = point2;
      y0 = y1;
      y1 = y2;
      xDataDomainMax = x2;

      displayChildView.call(this, childView, displayFlags, viewContext);
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);

    if (point1 !== null) {
      let category: DataPointCategory;
      if (point0 !== null) {
        // categorize end point
        if (Values.compare(y0!, y1!) < 0) {
          category = "increasing";
        } else if (Values.compare(y1!, y0!) < 0) {
          category = "decreasing";
        } else {
          category = "flat";
        }
      } else {
        // categorize sole point
        category = "flat";
      }
      point1.category.setAutoState(category);
    }

    this.setXDataDomain(point0 !== null ? Domain<X>(xDataDomainMin!, xDataDomainMax!) : null);
    this.setYDataDomain(point0 !== null ? Domain<Y>(yDataDomainMin!, yDataDomainMax!) : null);
    Object.defineProperty(this, "gradientStops", {
      value: gradientStops,
      enumerable: true,
      configurable: true,
    });
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
    if (xScale !== null) {
      const d = xScale.inverse(x / renderer.pixelRatio - this.viewFrame.xMin);
      const v0 = this.dataPointFasteners.previousValue(d);
      const v1 = this.dataPointFasteners.nextValue(d);
      const x0 = v0 !== void 0 ? v0.view!.x.value : void 0;
      const x1 = v1 !== void 0 ? v1.view!.x.value : void 0;
      const dx0 = x0 !== void 0 ? +d - +x0 : NaN;
      const dx1 = x1 !== void 0 ? +x1 - +d : NaN;
      if (dx0 <= dx1) {
        return v0!.view;
      } else if (dx0 > dx1) {
        return v1!.view;
      } else if (v0 !== void 0) {
        return v0!.view;
      } else if (v1 !== void 0) {
        return v1!.view;
      }
    }
    return null;
  }

  protected abstract hitTestPlot(x: number, y: number, renderer: CanvasRenderer): GraphicsView | null;

  /** @hidden */
  protected mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountDataPointFasteners();
  }

  /** @hidden */
  protected unmountViewFasteners(): void {
    this.unmountDataPointFasteners();
    super.unmountViewFasteners();
  }

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
}
