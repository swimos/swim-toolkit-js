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
import {AnyLength, Length, AnyAngle, Angle, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {Look} from "@swim/theme";
import {ViewContextType, ViewAnimator, ViewFastener} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  GraphicsViewController,
  LayerView,
  CanvasContext,
  CanvasRenderer,
  FillView,
  Arc,
  TypesetView,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";
import type {SliceViewObserver} from "./SliceViewObserver";

export type AnySliceView = SliceView | SliceViewInit;

export interface SliceViewInit extends GraphicsViewInit {
  value?: number;
  total?: number;
  center?: AnyPointR2;
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

export class SliceView extends LayerView {
  initView(init: SliceViewInit): void {
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

  declare readonly viewController: GraphicsViewController & SliceViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<SliceViewObserver>;

  protected willSetValue(newValue: number, oldValue: number): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewWillSetValue !== void 0) {
      viewController.sliceViewWillSetValue(newValue, oldValue, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewWillSetValue !== void 0) {
        viewObserver.sliceViewWillSetValue(newValue, oldValue, this);
      }
    }
  }

  protected onSetValue(newValue: number, oldValue: number): void {
    // hook
  }

  protected didSetValue(newValue: number, oldValue: number): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewDidSetValue !== void 0) {
        viewObserver.sliceViewDidSetValue(newValue, oldValue, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewDidSetValue !== void 0) {
      viewController.sliceViewDidSetValue(newValue, oldValue, this);
    }
  }

  @ViewAnimator<SliceView, number>({
    type: Number,
    state: 0,
    willSetValue(newValue: number, oldValue: number): void {
      this.owner.willSetValue(newValue, oldValue);
    },
    onSetValue(newValue: number, oldValue: number): void {
      this.owner.onSetValue(newValue, oldValue);
    },
    didSetValue(newValue: number, oldValue: number): void {
      this.owner.didSetValue(newValue, oldValue);
    },
  })
  declare value: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 1})
  declare total: ViewAnimator<this, number>;

  @ViewAnimator({type: PointR2, inherit: true, state: PointR2.origin()})
  declare center: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Length, inherit: true, state: Length.pct(3)})
  declare innerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, inherit: true, state: Length.pct(25)})
  declare outerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Angle, state: Angle.zero()})
  declare phaseAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Angle, inherit: true, state: Angle.deg(2)})
  declare padAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Length, inherit: true, state: null})
  declare padRadius: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Length, inherit: true, state: Length.zero()})
  declare cornerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, inherit: true, state: Length.pct(50)})
  declare labelRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, inherit: true, state: null, look: Look.accentColor})
  declare sliceColor: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Number, inherit: true, state: 0.5})
  declare tickAlign: ViewAnimator<this, number>;

  @ViewAnimator({type: Length, inherit: true, state: Length.pct(30)})
  declare tickRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, inherit: true, state: Length.pct(50)})
  declare tickLength: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, inherit: true, state: Length.px(1)})
  declare tickWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, inherit: true, state: Length.px(2)})
  declare tickPadding: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, inherit: true, state: null, look: Look.neutralColor})
  declare tickColor: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Font, inherit: true, state: null})
  declare font: ViewAnimator<this, Font | null, AnyFont | null>;

  @ViewAnimator({type: Color, inherit: true, state: null, look: Look.mutedColor})
  declare textColor: ViewAnimator<this, Color | null, AnyColor | null>;

  protected initLabel(labelView: GraphicsView): void {
    // hook
  }

  protected attachLabel(labelView: GraphicsView): void {
    // hook
  }

  protected detachLabel(labelView: GraphicsView): void {
    // hook
  }

  protected willSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewWillSetLabel !== void 0) {
      viewController.sliceViewWillSetLabel(newLabelView, oldLabelView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewWillSetLabel !== void 0) {
        viewObserver.sliceViewWillSetLabel(newLabelView, oldLabelView, this);
      }
    }
  }

  protected onSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (oldLabelView !== null) {
      this.detachLabel(oldLabelView);
    }
    if (newLabelView !== null) {
      this.attachLabel(newLabelView);
      this.initLabel(newLabelView);
    }
  }

  protected didSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewDidSetLabel !== void 0) {
        viewObserver.sliceViewDidSetLabel(newLabelView, oldLabelView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewDidSetLabel !== void 0) {
      viewController.sliceViewDidSetLabel(newLabelView, oldLabelView, this);
    }
  }

  @ViewFastener<SliceView, GraphicsView, AnyTextRunView>({
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
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetLabel(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetLabel(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetLabel(newLabelView, oldLabelView);
    },
  })
  declare label: ViewFastener<this, GraphicsView, AnyTextRunView>;

  protected initLegend(legendView: GraphicsView | null): void {
    // hook
  }

  protected attachLegend(legendView: GraphicsView | null): void {
    // hook
  }

  protected detachLegend(legendView: GraphicsView | null): void {
    // hook
  }

  protected willSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewWillSetLegend !== void 0) {
      viewController.sliceViewWillSetLegend(newLegendView, oldLegendView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewWillSetLegend !== void 0) {
        viewObserver.sliceViewWillSetLegend(newLegendView, oldLegendView, this);
      }
    }
  }

  protected onSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    if (oldLegendView !== null) {
      this.detachLegend(oldLegendView);
    }
    if (newLegendView !== null) {
      this.attachLegend(newLegendView);
      this.initLegend(newLegendView);
    }
  }

  protected didSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.sliceViewDidSetLegend !== void 0) {
        viewObserver.sliceViewDidSetLegend(newLegendView, oldLegendView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.sliceViewDidSetLegend !== void 0) {
      viewController.sliceViewDidSetLegend(newLegendView, oldLegendView, this);
    }
  }

  @ViewFastener<SliceView, GraphicsView, AnyTextRunView>({
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
    willSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.willSetLegend(newLegendView, oldLegendView);
    },
    onSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.onSetLegend(newLegendView, oldLegendView);
    },
    didSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.didSetLegend(newLegendView, oldLegendView);
    },
  })
  declare legend: ViewFastener<this, GraphicsView, AnyTextRunView>;

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.center.onAnimate(viewContext.updateTime);
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderSlice(context, this.viewFrame);
      context.restore();
    }
  }

  protected renderSlice(context: CanvasContext, frame: BoxR2): void {
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
      context.beginPath();
      context.fillStyle = sliceColor.toString();
      arc.draw(context, frame);
      context.fill();
    }

    const labelView = this.label.view;
    if (labelView !== null && !labelView.isHidden()) {
      const labelRadius = this.labelRadius.getValue().pxValue(deltaRadius);
      const labelAngle = startAngle.value + sweepAngle.value / 2;
      const r = innerRadius.value + labelRadius;
      const rx = r * Math.cos(labelAngle);
      const ry = r * Math.sin(labelAngle);

      if (TypesetView.is(labelView)) {
        labelView.textAlign.setAutoState("center");
        labelView.textBaseline.setAutoState("middle");
        labelView.textOrigin.setAutoState(new PointR2(center.x + rx, center.y + ry));
      }
    }

    const legendView = this.legend.view;
    if (legendView !== null && !legendView.isHidden()) {
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
        hit = this.hitTestSlice(x, y, context, this.viewFrame);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestSlice(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
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

  static create(): SliceView {
    return new SliceView();
  }

  static fromInit(init: SliceViewInit): SliceView {
    const view = new SliceView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnySliceView): SliceView {
    if (value instanceof SliceView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
