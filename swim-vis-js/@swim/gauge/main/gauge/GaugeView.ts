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

import {AnyLength, Length, AnyAngle, Angle, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, View, ViewAnimator, ViewFastener} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  GraphicsViewController,
  LayerView,
  TypesetView,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";
import {AnyDialView, DialView} from "../dial/DialView";
import type {GaugeViewObserver} from "./GaugeViewObserver";

export type AnyGaugeView = GaugeView | GaugeViewInit;

export interface GaugeViewInit extends GraphicsViewInit {
  limit?: number;
  center?: AnyPointR2;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  startAngle?: AnyAngle;
  sweepAngle?: AnyAngle;
  cornerRadius?: AnyLength;
  dialSpacing?: AnyLength;
  dialColor?: AnyColor;
  meterColor?: AnyColor;
  labelPadding?: AnyLength;
  tickAlign?: number;
  tickRadius?: AnyLength;
  tickLength?: AnyLength;
  tickWidth?: AnyLength;
  tickPadding?: AnyLength;
  tickColor?: AnyColor;
  font?: AnyFont;
  textColor?: AnyColor;
  title?: GraphicsView | string;
  dials?: AnyDialView[];
}

export class GaugeView extends LayerView {
  constructor() {
    super();
    Object.defineProperty(this, "dialFasteners", {
      value: [],
      enumerable: true,
    });
  }

  initView(init: GaugeViewInit): void {
    super.initView(init);
    if (init.limit !== void 0) {
      this.limit(init.limit);
    }
    if (init.innerRadius !== void 0) {
      this.innerRadius(init.innerRadius);
    }
    if (init.outerRadius !== void 0) {
      this.outerRadius(init.outerRadius);
    }
    if (init.startAngle !== void 0) {
      this.startAngle(init.startAngle);
    }
    if (init.sweepAngle !== void 0) {
      this.sweepAngle(init.sweepAngle);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
    }
    if (init.dialSpacing !== void 0) {
      this.dialSpacing(init.dialSpacing);
    }
    if (init.dialColor !== void 0) {
      this.dialColor(init.dialColor);
    }
    if (init.meterColor !== void 0) {
      this.meterColor(init.meterColor);
    }
    if (init.labelPadding !== void 0) {
      this.labelPadding(init.labelPadding);
    }
    if (init.tickAlign !== void 0) {
      this.tickAlign(init.tickAlign);
    }
    if (init.tickRadius !== void 0) {
      this.tickRadius(init.tickRadius);
    }
    if (init.tickLength !== void 0) {
      this.tickLength(init.tickLength);
    }
    if (init.tickWidth !== void 0) {
      this.tickWidth(init.tickWidth);
    }
    if (init.tickPadding !== void 0) {
      this.tickPadding(init.tickPadding);
    }
    if (init.tickColor !== void 0) {
      this.tickColor(init.tickColor);
    }
    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
    if (init.title !== void 0) {
      this.title(init.title);
    }
    const dials = init.dials;
    if (dials !== void 0) {
      for (let i = 0, n = dials.length; i < n; i += 1) {
        const dial = dials[i]!;
        this.appendChildView(DialView.fromAny(dial), dial.key);
      }
    }
  }

  declare readonly viewController: GraphicsViewController & GaugeViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<GaugeViewObserver>;

  @ViewAnimator({type: Number, state: 0, updateFlags: View.NeedsLayout})
  declare limit: ViewAnimator<this, number>;

  @ViewAnimator({type: PointR2, state: PointR2.origin(), updateFlags: View.NeedsLayout})
  declare center: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Length, state: Length.pct(30), updateFlags: View.NeedsLayout})
  declare innerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.pct(40), updateFlags: View.NeedsLayout})
  declare outerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Angle, state: Angle.rad(-Math.PI / 2), updateFlags: View.NeedsLayout})
  declare startAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Angle, state: Angle.rad(2 * Math.PI), updateFlags: View.NeedsLayout})
  declare sweepAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Length, state: Length.pct(50)})
  declare cornerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(1), updateFlags: View.NeedsLayout})
  declare dialSpacing: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: Color.transparent()})
  declare dialColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare meterColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Length, state: Length.pct(25)})
  declare labelPadding: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Number, state: 0.5})
  declare tickAlign: ViewAnimator<this, number>;

  @ViewAnimator({type: Length, state: Length.pct(45)})
  declare tickRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.pct(50)})
  declare tickLength: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(1)})
  declare tickWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(2)})
  declare tickPadding: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare tickColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  protected initTitle(titleView: GraphicsView): void {
    if (TypesetView.is(titleView)) {
      titleView.textAlign.setAutoState("center");
      titleView.textBaseline.setAutoState("middle");
      titleView.textOrigin.setAutoState(this.center.state);
    }
  }

  protected willSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.gaugeViewWillSetTitle !== void 0) {
      viewController.gaugeViewWillSetTitle(newTitleView, oldTitleView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.gaugeViewWillSetTitle !== void 0) {
        viewObserver.gaugeViewWillSetTitle(newTitleView, oldTitleView, this);
      }
    }
  }

  protected onSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    if (newTitleView !== null) {
      this.initTitle(newTitleView);
    }
  }

  protected didSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.gaugeViewDidSetTitle !== void 0) {
        viewObserver.gaugeViewDidSetTitle(newTitleView, oldTitleView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.gaugeViewDidSetTitle !== void 0) {
      viewController.gaugeViewDidSetTitle(newTitleView, oldTitleView, this);
    }
  }

  @ViewFastener<GaugeView, GraphicsView, AnyTextRunView>({
    key: true,
    type: TextRunView,
    fromAny(value: GraphicsView | AnyTextRunView): GraphicsView {
      if (value instanceof GraphicsView) {
        return value;
      } else if (typeof value === "string" && this.view instanceof TextRunView) {
        this.view.text(value);
        return this.view;
      } else {
        return TextRunView.fromAny(value);
      }
    },
    willSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.willSetTitle(newTitleView, oldTitleView);
    },
    onSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.onSetTitle(newTitleView, oldTitleView);
    },
    didSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.didSetTitle(newTitleView, oldTitleView);
    },
  })
  declare title: ViewFastener<this, GraphicsView, AnyTextRunView>;

  insertDial(dialView: AnyDialView, targetView: View | null = null): void {
    dialView = DialView.fromAny(dialView);
    const dialFasteners = this.dialFasteners as ViewFastener<this, DialView>[];
    let targetIndex = dialFasteners.length;
    for (let i = 0, n = dialFasteners.length; i < n; i += 1) {
      const dialFastener = dialFasteners[i]!;
      if (dialFastener.view === dialView) {
        return;
      } else if (dialFastener.view === targetView) {
        targetIndex = i;
      }
    }
    const dialFastener = this.createDialFastener(dialView);
    dialFasteners.splice(targetIndex, 0, dialFastener);
    dialFastener.setView(dialView, targetView);
    if (this.isMounted()) {
      dialFastener.mount();
    }
  }

  removeDial(dialView: DialView): void {
    const dialFasteners = this.dialFasteners as ViewFastener<this, DialView>[];
    for (let i = 0, n = dialFasteners.length; i < n; i += 1) {
      const dialFastener = dialFasteners[i]!;
      if (dialFastener.view === dialView) {
        dialFastener.setView(null);
        if (this.isMounted()) {
          dialFastener.unmount();
        }
        dialFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initDial(dialView: DialView, dialFastener: ViewFastener<this, DialView>): void {
    const labelView = dialView.label.view;
    if (labelView !== null) {
      this.initDialLabel(labelView, dialView);
    }
    const legendView = dialView.legend.view;
    if (legendView !== null) {
      this.initDialLegend(legendView, dialView);
    }
  }

  protected willSetDial(newDialView: DialView | null, oldDialView: DialView | null,
                        targetView: View | null, dialFastener: ViewFastener<this, DialView>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.gaugeViewWillSetDial !== void 0) {
      viewController.gaugeViewWillSetDial(newDialView, oldDialView, targetView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.gaugeViewWillSetDial !== void 0) {
        viewObserver.gaugeViewWillSetDial(newDialView, oldDialView, targetView, this);
      }
    }
  }

  protected onSetDial(newDialView: DialView | null, oldDialView: DialView | null,
                      targetView: View | null, dialFastener: ViewFastener<this, DialView>): void {
    if (newDialView !== null) {
      this.initDial(newDialView, dialFastener);
    }
  }

  protected didSetDial(newDialView: DialView | null, oldDialView: DialView | null,
                       targetView: View | null, dialFastener: ViewFastener<this, DialView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.gaugeViewDidSetDial !== void 0) {
        viewObserver.gaugeViewDidSetDial(newDialView, oldDialView, targetView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.gaugeViewDidSetDial !== void 0) {
      viewController.gaugeViewDidSetDial(newDialView, oldDialView, targetView, this);
    }
  }

  protected onSetDialValue(value: number, dialView: DialView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected initDialLabel(labelView: GraphicsView, dialView: DialView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected initDialLegend(legendView: GraphicsView, dialView: DialView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  /** @hidden */
  static DialFastener = ViewFastener.define<GaugeView, DialView>({
    type: DialView,
    child: false,
    observe: true,
    willSetView(newDialView: DialView | null, oldDialView: DialView | null, targetView: View | null): void {
      this.owner.willSetDial(newDialView, oldDialView, targetView, this);
    },
    onSetView(newDialView: DialView | null, oldDialView: DialView | null, targetView: View | null): void {
      this.owner.onSetDial(newDialView, oldDialView, targetView, this);
    },
    didSetView(newDialView: DialView | null, oldDialView: DialView | null, targetView: View | null): void {
      this.owner.didSetDial(newDialView, oldDialView, targetView, this);
    },
    dialViewDidSetValue(newValue: number, oldValue: number, dialView: DialView): void {
      this.owner.onSetDialValue(newValue, dialView);
    },
    dialViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, dialView: DialView): void {
      if (newLabelView !== null) {
        this.owner.initDialLabel(newLabelView, dialView);
      }
    },
    dialViewDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, dialView: DialView): void {
      if (newLegendView !== null) {
        this.owner.initDialLegend(newLegendView, dialView);
      }
    },
  });

  protected createDialFastener(dialView: DialView): ViewFastener<this, DialView> {
    return new GaugeView.DialFastener(this, dialView.key, "dial");
  }

  /** @hidden */
  declare readonly dialFasteners: ReadonlyArray<ViewFastener<this, DialView>>;

  /** @hidden */
  protected mountDialFasteners(): void {
    const dialFasteners = this.dialFasteners;
    for (let i = 0, n = dialFasteners.length; i < n; i += 1) {
      const dialFastener = dialFasteners[i]!;
      dialFastener.mount();
    }
  }

  /** @hidden */
  protected unmountDialFasteners(): void {
    const dialFasteners = this.dialFasteners;
    for (let i = 0, n = dialFasteners.length; i < n; i += 1) {
      const dialFastener = dialFasteners[i]!;
      dialFastener.unmount();
    }
  }

  protected detectDial(view: View): DialView | null {
    return view instanceof DialView ? view : null;
  }

  protected onInsertDial(dialView: DialView, targetView: View | null): void {
    this.insertDial(dialView, targetView);
  }

  protected onRemoveDial(dialView: DialView): void {
    this.removeDial(dialView);
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    const dialView = this.detectDial(childView);
    if (dialView !== null) {
      this.onInsertDial(dialView, targetView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    const dialView = this.detectDial(childView);
    if (dialView !== null) {
      this.onRemoveDial(dialView);
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutGauge(this.viewFrame);
  }

  protected layoutGauge(frame: BoxR2): void {
    if (this.center.isAuto()) {
      const cx = (frame.xMin + frame.xMax) / 2;
      const cy = (frame.yMin + frame.yMax) / 2;
      this.center.setAutoState(new PointR2(cx, cy));
    }

    const dialFasteners = this.dialFasteners;
    const dialCount = dialFasteners.length;

    let autoCount = 0;
    for (let i = 0; i < dialCount; i += 1) {
      const dialView = dialFasteners[i]!.view;
      if (dialView !== null && dialView.arrangement.state === "auto") {
        autoCount += 1;
      }
    }

    const size = Math.min(frame.width, frame.height);
    const limit = this.limit.getValue();
    const startAngle = this.startAngle.getValue();
    const sweepAngle = this.sweepAngle.getValue();
    let r0 = this.innerRadius.getValue().pxValue(size);
    const r1 = this.outerRadius.getValue().pxValue(size);
    const rs = this.dialSpacing.getValue().pxValue(size);
    const dr = autoCount > 1 ? (r1 - r0 - rs * (autoCount - 1)) / autoCount : r1 - r0;

    for (let i = 0; i < dialCount; i += 1) {
      const dialView = dialFasteners[i]!.view;
      if (dialView !== null && dialView.arrangement.state === "auto") {
        if (isFinite(limit)) {
          const total = dialView.total.getValue();
          dialView.total.setAutoState(Math.max(total, limit));
        }
        dialView.startAngle.setAutoState(startAngle);
        dialView.sweepAngle.setAutoState(sweepAngle);
        dialView.innerRadius.setAutoState(Length.px(r0));
        dialView.outerRadius.setAutoState(Length.px(r0 + dr));
        r0 = r0 + dr + rs;
      }
    }

    const titleView = this.title.view;
    if (TypesetView.is(titleView)) {
      titleView.textOrigin.setAutoState(this.center.state);
    }
  }

  /** @hidden */
  protected mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountDialFasteners();
  }

  /** @hidden */
  protected unmountViewFasteners(): void {
    this.unmountDialFasteners();
    super.unmountViewFasteners();
  }

  static create(): GaugeView {
    return new GaugeView();
  }

  static fromInit(init: GaugeViewInit): GaugeView {
    const view = new GaugeView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyGaugeView): GaugeView {
    if (value instanceof GaugeView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}