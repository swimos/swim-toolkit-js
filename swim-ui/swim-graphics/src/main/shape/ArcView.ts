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

import type {AnyTiming} from "@swim/util";
import {Affinity, AnimatorDef} from "@swim/component";
import {AnyLength, Length, AnyAngle, Angle, AnyR2Point, R2Point, R2Box} from "@swim/math";
import {AnyColor, Color} from "@swim/style";
import {ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, View} from "@swim/view";
import {GraphicsView} from "../graphics/GraphicsView";
import type {PaintingContext} from "../painting/PaintingContext";
import {PaintingRenderer} from "../painting/PaintingRenderer";
import type {CanvasContext} from "../canvas/CanvasContext";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import type {FillViewInit, FillView} from "./FillView";
import type {StrokeViewInit, StrokeView} from "./StrokeView";
import {ArcInit, Arc} from "./Arc";

/** @public */
export type AnyArcView = ArcView | Arc | ArcViewInit;

/** @public */
export interface ArcViewInit extends FillViewInit, StrokeViewInit, ArcInit {
}

/** @public */
export class ArcView extends GraphicsView implements FillView, StrokeView {
  @AnimatorDef({valueType: Number, value: 0.5, updateFlags: View.NeedsRender})
  readonly xAlign!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: Number, value: 0.5, updateFlags: View.NeedsRender})
  readonly yAlign!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: R2Point, value: R2Point.origin(), updateFlags: View.NeedsRender})
  readonly center!: AnimatorDef<this, {value: R2Point, valueInit: AnyR2Point}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero(), updateFlags: View.NeedsRender})
  readonly innerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero(), updateFlags: View.NeedsRender})
  readonly outerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.zero(), updateFlags: View.NeedsRender})
  readonly startAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.zero(), updateFlags: View.NeedsRender})
  readonly sweepAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Angle, value: Angle.zero(), updateFlags: View.NeedsRender})
  readonly padAngle!: ThemeAnimatorDef<this, {value: Angle, valueInit: AnyAngle}>;

  @ThemeAnimatorDef({valueType: Length, value: null, updateFlags: View.NeedsRender})
  readonly padRadius!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero(), updateFlags: View.NeedsRender})
  readonly cornerRadius!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ThemeAnimatorDef({valueType: Color, value: null, inherits: true, updateFlags: View.NeedsRender})
  readonly fill!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Color, value: null, inherits: true, updateFlags: View.NeedsRender})
  readonly stroke!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsRender})
  readonly strokeWidth!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  get value(): Arc {
    return new Arc(this.center.value, this.innerRadius.value, this.outerRadius.value,
                   this.startAngle.value, this.sweepAngle.value, this.padAngle.value,
                   this.padRadius.value, this.cornerRadius.value);
  }

  get state(): Arc {
    return new Arc(this.center.state, this.innerRadius.state, this.outerRadius.state,
                   this.startAngle.state, this.sweepAngle.state, this.padAngle.state,
                   this.padRadius.state, this.cornerRadius.state);
  }

  setState(arc: Arc | ArcViewInit, timing?: AnyTiming | boolean): void {
    if (arc instanceof Arc) {
      arc = arc.toAny();
    }
    if (arc.center !== void 0) {
      this.center(arc.center, timing);
    }
    if (arc.innerRadius !== void 0) {
      this.innerRadius(arc.innerRadius, timing);
    }
    if (arc.outerRadius !== void 0) {
      this.outerRadius(arc.outerRadius, timing);
    }
    if (arc.startAngle !== void 0) {
      this.startAngle(arc.startAngle, timing);
    }
    if (arc.sweepAngle !== void 0) {
      this.sweepAngle(arc.sweepAngle, timing);
    }
    if (arc.padAngle !== void 0) {
      this.padAngle(arc.padAngle, timing);
    }
    if (arc.padRadius !== void 0) {
      this.padRadius(arc.padRadius, timing);
    }
    if (arc.cornerRadius !== void 0) {
      this.cornerRadius(arc.cornerRadius, timing);
    }
    if (arc.fill !== void 0) {
      this.fill(arc.fill, timing);
    }
    if (arc.stroke !== void 0) {
      this.stroke(arc.stroke, timing);
    }
    if (arc.strokeWidth !== void 0) {
      this.strokeWidth(arc.strokeWidth, timing);
    }
  }

  protected layoutArc(): void {
    if (this.center.hasAffinity(Affinity.Intrinsic)) {
      const viewFrame = this.viewFrame;
      const cx = viewFrame.xMin + viewFrame.width * this.xAlign.getValue();
      const cy = viewFrame.yMin + viewFrame.height * this.yAlign.getValue();
      this.center.setState(new R2Point(cx, cy), Affinity.Intrinsic);
    }
  }

  protected override onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof PaintingRenderer && !this.hidden && !this.culled) {
      this.layoutArc();
      this.renderArc(renderer.context, this.viewFrame);
    }
  }

  protected renderArc(context: PaintingContext, frame: R2Box): void {
    // save
    const contextFillStyle = context.fillStyle;
    const contextLineWidth = context.lineWidth;
    const contextStrokeStyle = context.strokeStyle;

    const arc = this.value;
    context.beginPath();
    arc.draw(context, frame);

    const fill = this.fill.value;
    if (fill !== null) {
      context.fillStyle = fill.toString();
      context.fill();
    }

    const stroke = this.stroke.value;
    if (stroke !== null) {
      const strokeWidth = this.strokeWidth.value;
      if (strokeWidth !== null) {
        const size = Math.min(frame.width, frame.height);
        context.lineWidth = strokeWidth.pxValue(size);
      }
      context.strokeStyle = stroke.toString();
      context.stroke();
    }

    // restore
    context.fillStyle = contextFillStyle;
    context.lineWidth = contextLineWidth;
    context.strokeStyle = contextStrokeStyle;
  }

  override get popoverFrame(): R2Box {
    const frame = this.viewFrame;
    const size = Math.min(frame.width, frame.height);
    const inversePageTransform = this.pageTransform.inverse();
    const center = this.center.getValue();
    const px = inversePageTransform.transformX(center.x, center.y);
    const py = inversePageTransform.transformY(center.x, center.y);
    const r = (this.innerRadius.getValue().pxValue(size) + this.outerRadius.getValue().pxValue(size)) / 2;
    const a = this.startAngle.getValue().radValue() + this.sweepAngle.getValue().radValue() / 2;
    const x = px + r * Math.cos(a);
    const y = py + r * Math.sin(a);
    return new R2Box(x, y, x, y);
  }

  declare readonly viewBounds: R2Box; // getter defined below to work around useDefineForClassFields lunacy

  protected override hitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const p = renderer.transform.transform(x, y);
      this.layoutArc();
      return this.hitTestArc(p.x, p.y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestArc(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    const arc = this.value;
    context.beginPath();
    arc.draw(context, frame);
    if (this.fill.value !== null && context.isPointInPath(x, y)) {
      return this;
    } else if (this.stroke.value !== null) {
      const strokeWidth = this.strokeWidth.value;
      if (strokeWidth !== null) {
        // save
        const contextLineWidth = context.lineWidth;

        const size = Math.min(frame.width, frame.height);
        context.lineWidth = strokeWidth.pxValue(size);
        const pointInStroke = context.isPointInStroke(x, y);

        // restore
        context.lineWidth = contextLineWidth;

        if (pointInStroke) {
          return this;
        }
      }
    }
    return null;
  }

  override init(init: Arc | ArcViewInit): void {
    if (!(init instanceof Arc)) {
      super.init(init);
    }
    this.setState(init);
  }

  static fromArc(arc: Arc): ArcView {
    const view = new ArcView();
    view.setState(arc);
    return view;
  }
}
Object.defineProperty(ArcView.prototype, "viewBounds", {
  get(this: ArcView): R2Box {
    const frame = this.viewFrame;
    const size = Math.min(frame.width, frame.height);
    const center = this.center.getValue();
    const radius = this.outerRadius.getValue().pxValue(size);
    return new R2Box(center.x - radius, center.y - radius,
                     center.x + radius, center.y + radius);
  },
  configurable: true,
});
