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

import {Class, Equivalent, Initable} from "@swim/util";
import {Affinity, FastenerClass, AnimatorDef} from "@swim/component";
import {AnyLength, Length, AnyAngle, Angle, AnyR2Point, R2Point, R2Box} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {Look, ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, AnyView, View, ViewRefDef} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  PaintingContext,
  PaintingRenderer,
  CanvasContext,
  CanvasRenderer,
  FillView,
  Arc,
  TypesetView,
  TextRunView,
} from "@swim/graphics";
import type {SliceViewObserver} from "./SliceViewObserver";

/** @public */
export type AnySliceView = SliceView | SliceViewInit;

/** @public */
export interface SliceViewInit extends GraphicsViewInit {
  value?: number;
  total?: number;
  center?: AnyR2Point;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  phaseAngle?: AnyAngle;
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
  label?: GraphicsView | string;
  legend?: GraphicsView | string;
}

/** @public */
export class SliceView extends GraphicsView {
  override readonly observerType?: Class<SliceViewObserver>;

  @AnimatorDef<SliceView["value"]>({
    valueType: Number,
    value: 0,
    updateFlags: View.NeedsRender,
    didSetValue(value: number): void {
      this.owner.callObservers("viewDidSetValue", value, this.owner);
    },
  })
  readonly value!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: Number, value: 1, updateFlags: View.NeedsRender})
  readonly total!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: R2Point, value: R2Point.origin(), inherits: true, updateFlags: View.NeedsRender})
  readonly center!: AnimatorDef<this, {value: R2Point, valueInit: AnyR2Point}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(3), inherits: true, updateFlags: View.NeedsRender})
  readonly innerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(25), inherits: true, updateFlags: View.NeedsRender})
  readonly outerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.zero(), updateFlags: View.NeedsRender})
  readonly phaseAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.deg(2), inherits: true, updateFlags: View.NeedsRender})
  readonly padAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsRender})
  readonly padRadius!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero(), inherits: true, updateFlags: View.NeedsRender})
  readonly cornerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(50), inherits: true, updateFlags: View.NeedsRender})
  readonly labelRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.accentColor, inherits: true, updateFlags: View.NeedsRender})
  readonly sliceColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Number, value: 0.5, inherits: true, updateFlags: View.NeedsRender})
  readonly tickAlign!: ThemeAnimatorDef<this, {value: number}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(30), inherits: true, updateFlags: View.NeedsRender})
  readonly tickRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.pct(50), inherits: true, updateFlags: View.NeedsRender})
  readonly tickLength!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.px(1), inherits: true, updateFlags: View.NeedsRender})
  readonly tickWidth!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.px(2), inherits: true, updateFlags: View.NeedsRender})
  readonly tickPadding!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.legendColor, inherits: true, updateFlags: View.NeedsRender})
  readonly tickColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Font, value: null, inherits: true, updateFlags: View.NeedsRender})
  readonly font!: ThemeAnimatorDef<this, {value: Font | null, valueInit: AnyFont | null}>;

  @ThemeAnimatorDef({valueType: Color, value: null, look: Look.legendColor, inherits: true, updateFlags: View.NeedsRender})
  readonly textColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ViewRefDef<SliceView["label"]>({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    willAttachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachLabel", labelView, this.owner);
    },
    didDetachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachLabel", labelView, this.owner);
    },
    fromAny(value: AnyView<GraphicsView> | string): GraphicsView {
      if (typeof value === "string") {
        if (this.view instanceof TextRunView) {
          this.view.text(value);
          return this.view;
        } else {
          return TextRunView.fromAny(value);
        }
      } else {
        return GraphicsView.fromAny(value);
      }
    },
  })
  readonly label!: ViewRefDef<this, {
    view: GraphicsView & Initable<GraphicsViewInit | string>,
  }>;
  static readonly label: FastenerClass<SliceView["label"]>;

  @ViewRefDef<SliceView["legend"]>({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    willAttachView(legendView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachLegend", legendView, this.owner);
    },
    didDetachView(legendView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachLegend", legendView, this.owner);
    },
    fromAny(value: AnyView<GraphicsView> | string): GraphicsView {
      if (typeof value === "string") {
        if (this.view instanceof TextRunView) {
          this.view.text(value);
          return this.view;
        } else {
          return TextRunView.fromAny(value);
        }
      } else {
        return GraphicsView.fromAny(value);
      }
    },
  })
  readonly legend!: ViewRefDef<this, {
    view: GraphicsView & Initable<GraphicsViewInit | string>,
  }>;
  static readonly legend: FastenerClass<SliceView["legend"]>;

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.center.recohere(viewContext.updateTime);
  }

  protected override onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof PaintingRenderer && !this.hidden && !this.culled) {
      this.renderSlice(renderer.context, this.viewFrame);
    }
  }

  protected renderSlice(context: PaintingContext, frame: R2Box): void {
    const width = frame.width;
    const height = frame.height;
    const size = Math.min(width, height);
    const value = this.value.getValue();
    const total = this.total.getValue();
    const delta = total !== 0 ? value / total : 0;

    const center = this.center.getValue();
    const innerRadius = this.innerRadius.getValue().px(size);
    const outerRadius = this.outerRadius.getValue().px(size);
    const deltaRadius = outerRadius.value - innerRadius.value;
    const startAngle = this.phaseAngle.getValue().rad();
    const sweepAngle = Angle.rad(2 * Math.PI * delta);
    const padAngle = this.padAngle.getValue();
    const padRadius = this.padRadius.getValueOr(null);
    const cornerRadius = this.cornerRadius.getValue().px(deltaRadius);
    const arc = new Arc(center, innerRadius, outerRadius, startAngle,
                        sweepAngle, padAngle, padRadius, cornerRadius);

    const sliceColor = this.sliceColor.value;
    if (sliceColor !== null) {
      // save
      const contextFillStyle = context.fillStyle;

      context.beginPath();
      context.fillStyle = sliceColor.toString();
      arc.draw(context, frame);
      context.fill();

      // restore
      context.fillStyle = contextFillStyle;
    }

    const labelView = this.label.view;
    if (labelView !== null && !labelView.hidden) {
      const labelRadius = this.labelRadius.getValue().pxValue(deltaRadius);
      const labelAngle = startAngle.value + sweepAngle.value / 2;
      const r = innerRadius.value + labelRadius;
      const rx = r * Math.cos(labelAngle);
      const ry = r * Math.sin(labelAngle);

      if (TypesetView.is(labelView)) {
        labelView.textAlign.setState("center", Affinity.Intrinsic);
        labelView.textBaseline.setState("middle", Affinity.Intrinsic);
        labelView.textOrigin.setState(new R2Point(center.x + rx, center.y + ry), Affinity.Intrinsic);
      }
    }

    const legendView = this.legend.view;
    if (legendView !== null && !legendView.hidden) {
      const tickAlign = this.tickAlign.getValue();
      const tickAngle = startAngle.value + sweepAngle.value * tickAlign;
      const tickRadius = this.tickRadius.getValue().pxValue(size);
      const tickLength = this.tickLength.getValue().pxValue(width);
      const tickWidth = this.tickWidth.getValue().pxValue(size);
      const tickColor = this.tickColor.value;

      const cx = center.x;
      const cy = center.y;
      const r1x = outerRadius.value * Math.cos(tickAngle + Equivalent.Epsilon);
      const r1y = outerRadius.value * Math.sin(tickAngle + Equivalent.Epsilon);
      const r2x = tickRadius * Math.cos(tickAngle + Equivalent.Epsilon);
      const r2y = tickRadius * Math.sin(tickAngle + Equivalent.Epsilon);
      let dx = 0;

      if (tickColor !== null && tickWidth !== 0) {
        // save
        const contextLineWidth = context.lineWidth;
        const contextStrokeStyle = context.strokeStyle;

        context.beginPath();
        context.lineWidth = tickWidth;
        context.strokeStyle = tickColor.toString();
        context.moveTo(cx + r1x, cy + r1y);
        context.lineTo(cx + r2x, cy + r2y);
        if (tickLength !== 0) {
          if (r2x >= 0) {
            context.lineTo(cx + tickLength, cy + r2y);
            dx = tickLength - r2x;
          } else if (r2x < 0) {
            context.lineTo(cx - tickLength, cy + r2y);
            dx = tickLength + r2x;
          }
        }
        context.stroke();

        // restore
        context.lineWidth = contextLineWidth;
        context.strokeStyle = contextStrokeStyle;
      }

      let textAlign: CanvasTextAlign;
      if (r2x >= 0) {
        if (r2y >= 0) { // top-right
          textAlign = "end";
        } else { // bottom-right
          textAlign = "end";
        }
      } else {
        dx = -dx;
        if (r2y < 0) { // bottom-left
          textAlign = "start";
        } else { // top-left
          textAlign = "start";
        }
      }

      if (TypesetView.is(legendView)) {
        const tickPadding = this.tickPadding.getValue().pxValue(size);
        if (FillView.is(legendView)) {
          legendView.fill.setState(tickColor, Affinity.Intrinsic);
        }
        legendView.textAlign.setState(textAlign, Affinity.Intrinsic);
        legendView.textBaseline.setState("alphabetic", Affinity.Intrinsic);
        legendView.textOrigin.setState(new R2Point(cx + r2x + dx, cy + r2y - tickPadding), Affinity.Intrinsic);
      }
    }
  }

  protected override hitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const p = renderer.transform.transform(x, y);
      return this.hitTestSlice(p.x, p.y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestSlice(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    const size = Math.min(frame.width, frame.height);
    const value = this.value.getValue();
    const total = this.total.getValue();
    const delta = total !== 0 ? value / total : 0;

    const center = this.center.getValue();
    const innerRadius = this.innerRadius.getValue().px(size);
    const outerRadius = this.outerRadius.getValue().px(size);
    const deltaRadius = outerRadius.value - innerRadius.value;
    const startAngle = this.phaseAngle.getValue().rad();
    const sweepAngle = Angle.rad(2 * Math.PI * delta);
    const padAngle = this.padAngle.getValue();
    const padRadius = this.padRadius.getValueOr(null);
    const cornerRadius = this.cornerRadius.getValue().px(deltaRadius);
    const arc = new Arc(center, innerRadius, outerRadius, startAngle,
                        sweepAngle, padAngle, padRadius, cornerRadius);

    context.beginPath();
    arc.draw(context, frame);
    if (context.isPointInPath(x, y)) {
      return this;
    }
    return null;
  }

  override init(init: SliceViewInit): void {
    super.init(init);
    if (init.value !== void 0) {
      this.value(init.value);
    }
    if (init.total !== void 0) {
      this.total(init.total);
    }
    if (init.center !== void 0) {
      this.center(init.center);
    }
    if (init.innerRadius !== void 0) {
      this.innerRadius(init.innerRadius);
    }
    if (init.outerRadius !== void 0) {
      this.outerRadius(init.outerRadius);
    }
    if (init.phaseAngle !== void 0) {
      this.phaseAngle(init.phaseAngle);
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
    if (init.label !== void 0) {
      this.label(init.label);
    }
    if (init.legend !== void 0) {
      this.legend(init.legend);
    }
  }
}
