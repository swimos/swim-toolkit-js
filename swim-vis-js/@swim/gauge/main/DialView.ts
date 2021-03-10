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

import {Equivalent} from "@swim/util";
import {AnyLength, Length, AnyAngle, Angle, BoxR2, AnyPointR2, PointR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {
  ViewContextType,
  ViewFlags,
  View,
  ViewProperty,
  ViewAnimator,
  ViewFastener,
} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  LayerView,
  CanvasContext,
  CanvasRenderer,
  FillView,
  Arc,
  TypesetView,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";

export type DialViewArrangement = "auto" | "manual";

export type AnyDialView = DialView | DialViewInit;

export interface DialViewInit extends GraphicsViewInit {
  value?: number;
  total?: number;
  center?: AnyPointR2;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  startAngle?: AnyAngle;
  sweepAngle?: AnyAngle;
  cornerRadius?: AnyLength;
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
  arrangement?: DialViewArrangement;
  label?: GraphicsView | string | null;
  legend?: GraphicsView | string | null;
}

export class DialView extends LayerView {
  initView(init: DialViewInit): void {
    super.initView(init);
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
    if (init.startAngle !== void 0) {
      this.startAngle(init.startAngle);
    }
    if (init.sweepAngle !== void 0) {
      this.sweepAngle(init.sweepAngle);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
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
    if (init.arrangement !== void 0) {
      this.arrangement(init.arrangement);
    }
    if (init.label !== void 0) {
      this.label(init.label);
    }
    if (init.legend !== void 0) {
      this.legend(init.legend);
    }
  }

  @ViewAnimator({type: Number, state: 0})
  declare value: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 1})
  declare total: ViewAnimator<this, number>;

  @ViewAnimator({type: PointR2, inherit: true})
  declare center: ViewAnimator<this, PointR2 | undefined, AnyPointR2 | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare innerRadius: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare outerRadius: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Angle, inherit: true})
  declare startAngle: ViewAnimator<this, Angle | undefined, AnyAngle | undefined>;

  @ViewAnimator({type: Angle, inherit: true})
  declare sweepAngle: ViewAnimator<this, Angle | undefined, AnyAngle | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare cornerRadius: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare dialColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare meterColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare labelPadding: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare tickAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare tickRadius: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare tickLength: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare tickWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare tickPadding: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare tickColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewFastener<DialView, GraphicsView, AnyTextRunView>({
    key: true,
    type: TextRunView,
    fromAny(value: GraphicsView | AnyTextRunView): GraphicsView {
      if (value instanceof GraphicsView) {
        return value;
      } else {
        return TextRunView.fromAny(value);
      }
    },
  })
  declare label: ViewFastener<this, GraphicsView, AnyTextRunView>;

  @ViewFastener<DialView, GraphicsView, AnyTextRunView>({
    key: true,
    type: TextRunView,
    fromAny(value: GraphicsView | AnyTextRunView): GraphicsView {
      if (value instanceof GraphicsView) {
        return value;
      } else {
        return TextRunView.fromAny(value);
      }
    },
  })
  declare legend: ViewFastener<this, GraphicsView, AnyTextRunView>;

  @ViewProperty({type: String, state: "auto"})
  declare arrangement: ViewProperty<this, DialViewArrangement>;

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderDial(context, this.viewFrame);
      context.restore();
    }
  }

  protected renderDial(context: CanvasContext, frame: BoxR2): void {
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
    const startAngle = this.startAngle.getValue().rad();
    const sweepAngle = this.sweepAngle.getValue().rad();
    const cornerRadius = this.cornerRadius.getValue().px(deltaRadius);
    const dial = new Arc(center, innerRadius, outerRadius, startAngle,
                         sweepAngle, Angle.zero(), null, cornerRadius);
    const meter = dial.withSweepAngle(sweepAngle.times(delta));

    context.save();

    context.beginPath();
    context.fillStyle = this.dialColor.getValue().toString();
    dial.draw(context, frame);
    context.fill();
    context.clip();

    context.beginPath();
    context.fillStyle = this.meterColor.getValue().toString();
    meter.draw(context, frame);
    context.fill();

    context.restore();

    const labelView = this.label.view;
    if (labelView !== null && !labelView.isHidden()) {
      const r = (innerRadius.value + outerRadius.value) / 2;
      const rx = r * Math.cos(startAngle.value + Equivalent.Epsilon);
      const ry = r * Math.sin(startAngle.value + Equivalent.Epsilon);

      let textAlign: CanvasTextAlign;
      if (rx >= 0) {
        if (ry >= 0) { // top-right
          textAlign = "start";
        } else { // bottom-right
          textAlign = "end";
        }
      } else {
        if (ry < 0) { // bottom-left
          textAlign = "end";
        } else { // top-left
          textAlign = "start";
        }
      }
      const padAngle = startAngle.value - Math.PI / 2;
      const labelPadding = this.labelPadding.getValue().pxValue(deltaRadius);
      const dx = labelPadding * Math.cos(padAngle);
      const dy = labelPadding * Math.sin(padAngle);

      if (TypesetView.is(labelView)) {
        labelView.textAlign.setAutoState(textAlign);
        labelView.textBaseline.setAutoState("middle");
        labelView.textOrigin.setAutoState(new PointR2(center.x + rx + dx, center.y + ry + dy));
      }
    }

    const legendView = this.legend.view;
    if (legendView !== null && !legendView.isHidden()) {
      const tickAlign = this.tickAlign.getValue();
      const tickAngle = startAngle.value + sweepAngle.value * delta * tickAlign;
      const tickRadius = this.tickRadius.getValue().pxValue(size);
      const tickLength = this.tickLength.getValue().pxValue(width);
      const tickWidth = this.tickWidth.getValue().pxValue(size);
      const tickColor = this.tickColor.getValue();

      const cx = center.x;
      const cy = center.y;
      const r1x = outerRadius.value * Math.cos(tickAngle + Equivalent.Epsilon);
      const r1y = outerRadius.value * Math.sin(tickAngle + Equivalent.Epsilon);
      const r2x = tickRadius * Math.cos(tickAngle + Equivalent.Epsilon);
      const r2y = tickRadius * Math.sin(tickAngle + Equivalent.Epsilon);
      let dx = 0;

      context.beginPath();
      context.strokeStyle = tickColor.toString();
      context.lineWidth = tickWidth;
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
          legendView.fill.setAutoState(tickColor);
        }
        legendView.textAlign.setAutoState(textAlign);
        legendView.textBaseline.setAutoState("alphabetic");
        legendView.textOrigin.setAutoState(new PointR2(cx + r2x + dx, cy + r2y - tickPadding));
      }
    }
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        x *= renderer.pixelRatio;
        y *= renderer.pixelRatio;
        hit = this.hitTestDial(x, y, context, this.viewFrame);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestDial(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    const size = Math.min(frame.width, frame.height);
    const center = this.center.getValue();
    const innerRadius = this.innerRadius.getValue().px(size);
    const outerRadius = this.outerRadius.getValue().px(size);
    const deltaRadius = outerRadius.value - innerRadius.value;
    const startAngle = this.startAngle.getValue();
    const sweepAngle = this.sweepAngle.getValue();
    const cornerRadius = this.cornerRadius.getValue().px(deltaRadius);
    const dial = new Arc(center, innerRadius, outerRadius, startAngle,
                         sweepAngle, Angle.zero(), null, cornerRadius);

    context.beginPath();
    dial.draw(context, frame);
    if (context.isPointInPath(x, y)) {
      return this;
    }
    return null;
  }

  static create(): DialView {
    return new DialView();
  }

  static fromInit(init: DialViewInit): DialView {
    const view = new DialView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyDialView): DialView {
    if (value instanceof DialView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return DialView.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static readonly insertChildFlags: ViewFlags = LayerView.insertChildFlags | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = LayerView.removeChildFlags | View.NeedsAnimate;
}
