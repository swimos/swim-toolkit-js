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

import type {Class} from "@swim/util";
import {Affinity, FastenerClass, AnimatorDef} from "@swim/component";
import {AnyLength, Length, AnyAngle, Angle, AnyR2Point, R2Point, R2Box} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {Look, ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, View, ViewRefDef, ViewSetDef} from "@swim/view";
import {GraphicsViewInit, GraphicsView, TypesetView, TextRunView} from "@swim/graphics";
import {AnySliceView, SliceView} from "../slice/SliceView";
import type {PieViewObserver} from "./PieViewObserver";

/** @public */
export type AnyPieView = PieView | PieViewInit;

/** @public */
export interface PieViewInit extends GraphicsViewInit {
  limit?: number;
  center?: AnyR2Point;
  baseAngle?: AnyAngle;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  padAngle?: AnyAngle;
  padRadius?: AnyLength | null;
  cornerRadius?: AnyLength;
  labelRadius?: AnyLength;
  sliceColor?: AnyColor;
  tickAlign?: number;
  tickRadius?: AnyLength;
  tickLength?: AnyLength;
  tickWidth?: AnyLength;
  tickPadding?: AnyLength;
  tickColor?: AnyColor;
  font?: AnyFont;
  textColor?: AnyColor;
  title?: GraphicsView | string;
  slices?: AnySliceView[];
}

/** @public */
export class PieView extends GraphicsView {
  override readonly observerType?: Class<PieViewObserver>;

  @AnimatorDef({valueType: Number, value: 0, updateFlags: View.NeedsLayout})
  readonly limit!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: R2Point, value: R2Point.origin(), updateFlags: View.NeedsLayout})
  readonly center!: AnimatorDef<this, {value: R2Point, valueInit: AnyR2Point}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.rad(-Math.PI / 2), updateFlags: View.NeedsLayout})
  readonly baseAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(3)})
  readonly innerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(25)})
  readonly outerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.deg(2)})
  readonly padAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Length, value: null})
  readonly padRadius!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero()})
  readonly cornerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(50)})
  readonly labelRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.accentColor})
  readonly sliceColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Number, value: 0.5})
  readonly tickAlign!: ThemeAnimatorDef<this, {value: number}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(30)})
  readonly tickRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(50)})
  readonly tickLength!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.px(1)})
  readonly tickWidth!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.px(2)})
  readonly tickPadding!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.legendColor})
  readonly tickColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Font, value: null, inherits: true})
  readonly font!: ThemeAnimatorDef<this, {value: Font | null, valueInit: AnyFont | null}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.legendColor})
  readonly textColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ViewRefDef<PieView["title"]>({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    initView(titleView: GraphicsView): void {
      if (TypesetView.is(titleView)) {
        titleView.textAlign.setState("center", Affinity.Intrinsic);
        titleView.textBaseline.setState("middle", Affinity.Intrinsic);
        titleView.textOrigin.setState(this.owner.center.state, Affinity.Intrinsic);
      }
    },
    willAttachView(titleView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachTitle", titleView, this.owner);
    },
    didDetachView(titleView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachTitle", titleView, this.owner);
    },
    setText(title: string | undefined): GraphicsView {
      let titleView = this.view;
      if (titleView === null) {
        titleView = this.createView();
        this.setView(titleView);
      }
      if (titleView instanceof TextRunView) {
        titleView.text(title !== void 0 ? title : "");
      }
      return titleView;
    },
  })
  readonly title!: ViewRefDef<this, {
    view: GraphicsView,
    implements: {
      setText(title: string | undefined): GraphicsView,
    },
  }>;
  static readonly title: FastenerClass<PieView["title"]>;

  @ViewSetDef<PieView["slices"]>({
    viewType: SliceView,
    binds: true,
    observes: true,
    willAttachView(sliceView: SliceView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachSlice", sliceView, targetView, this.owner);
    },
    didAttachView(sliceView: SliceView): void {
      const labelView = sliceView.label.view;
      if (labelView !== null) {
        this.attachLabelView(labelView);
      }
      const legendView = sliceView.legend.view;
      if (legendView !== null) {
        this.attachLegendView(legendView);
      }
    },
    willDetachView(sliceView: SliceView): void {
      const legendView = sliceView.legend.view;
      if (legendView !== null) {
        this.detachLegendView(legendView);
      }
      const labelView = sliceView.label.view;
      if (labelView !== null) {
        this.detachLabelView(labelView);
      }
    },
    didDetachView(sliceView: SliceView): void {
      this.owner.callObservers("viewDidDetachSlice", sliceView, this.owner);
    },
    viewDidSetValue(value: number): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
    viewWillAttachLabel(labelView: GraphicsView): void {
      this.attachLabelView(labelView);
    },
    viewDidDetachLabel(labelView: GraphicsView): void {
      this.detachLabelView(labelView);
    },
    attachLabelView(labelView: GraphicsView): void {
      // hook
    },
    detachLabelView(labelView: GraphicsView): void {
      // hook
    },
    viewWillAttachLegend(legendView: GraphicsView): void {
      this.attachLegendView(legendView);
    },
    viewDidDetachLegend(legendView: GraphicsView): void {
      this.detachLegendView(legendView);
    },
    attachLegendView(legendView: GraphicsView): void {
      // hook
    },
    detachLegendView(legendView: GraphicsView): void {
      // hook
    },
  })
  readonly slices!: ViewSetDef<this, {
    view: SliceView,
    implements: {
      attachLabelView(labelView: GraphicsView): void;
      detachLabelView(labelView: GraphicsView): void;
      attachLegendView(legendView: GraphicsView): void;
      detachLegendView(legendView: GraphicsView): void;
    },
    observes: true,
  }>;
  static readonly slices: FastenerClass<PieView["slices"]>;

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutPie(this.viewFrame);
  }

  protected layoutPie(frame: R2Box): void {
    if (this.center.hasAffinity(Affinity.Intrinsic)) {
      const cx = (frame.xMin + frame.xMax) / 2;
      const cy = (frame.yMin + frame.yMax) / 2;
      this.center.setState(new R2Point(cx, cy), Affinity.Intrinsic);
    }

    const sliceViews = this.slices.views;

    let total = 0;
    for (const viewId in sliceViews) {
      const sliceView = sliceViews[viewId]!;
      const value = sliceView.value.getValue();
      if (isFinite(value)) {
        total += value;
      }
    }
    total = Math.max(total, this.limit.getValue());

    let baseAngle = this.baseAngle.getValue().rad();
    for (const viewId in sliceViews) {
      const sliceView = sliceViews[viewId]!;
      sliceView.total.setState(total, Affinity.Intrinsic);
      sliceView.phaseAngle.setState(baseAngle, Affinity.Intrinsic);
      const value = sliceView.value.getValue();
      if (isFinite(value)) {
        const delta = total !== 0 ? value / total : 0;
        baseAngle = Angle.rad(baseAngle.value + 2 * Math.PI * delta);
      }
    }

    const titleView = this.title.view;
    if (TypesetView.is(titleView)) {
      titleView.textOrigin.setState(this.center.value, Affinity.Intrinsic);
    }
  }

  override init(init: PieViewInit): void {
    super.init(init);
    if (init.limit !== void 0) {
      this.limit(init.limit);
    }
    if (init.center !== void 0) {
      this.center(init.center);
    }
    if (init.baseAngle !== void 0) {
      this.baseAngle(init.baseAngle);
    }
    if (init.innerRadius !== void 0) {
      this.innerRadius(init.innerRadius);
    }
    if (init.outerRadius !== void 0) {
      this.outerRadius(init.outerRadius);
    }
    if (init.padAngle !== void 0) {
      this.padAngle(init.padAngle);
    }
    if (init.padRadius !== void 0) {
      this.padRadius(init.padRadius);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
    }
    if (init.labelRadius !== void 0) {
      this.labelRadius(init.labelRadius);
    }
    if (init.sliceColor !== void 0) {
      this.sliceColor(init.sliceColor);
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
    if (typeof init.title === "string") {
      this.title.setText(init.title);
    } else if (init.title !== void 0) {
      this.title.setView(init.title);
    }
    const slices = init.slices;
    if (slices !== void 0) {
      for (let i = 0, n = slices.length; i < n; i += 1) {
        const slice = slices[i]!;
        this.appendChild(SliceView.fromAny(slice), slice.key);
      }
    }
  }
}
