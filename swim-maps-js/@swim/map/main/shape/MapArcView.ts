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

import {AnyLength, Length, AnyAngle, Angle, AnyPointR2, PointR2, BoxR2, CircleR2} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {AnyColor, Color} from "@swim/style";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import {
  GraphicsView,
  FillViewInit,
  FillView,
  StrokeViewInit,
  StrokeView,
  CanvasContext,
  CanvasRenderer,
} from "@swim/graphics";
import {Arc} from "@swim/graphics";
import type {MapGraphicsViewInit} from "../graphics/MapGraphicsView";
import {MapLayerView} from "../layer/MapLayerView";

export type AnyMapArcView = MapArcView | MapArcViewInit;

export interface MapArcViewInit extends MapGraphicsViewInit, FillViewInit, StrokeViewInit {
  geoCenter?: AnyGeoPoint;
  viewCenter?: PointR2;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  startAngle?: AnyAngle;
  sweepAngle?: AnyAngle;
  padAngle?: AnyAngle;
  padRadius?: AnyLength | null;
  cornerRadius?: AnyLength;
}

export class MapArcView extends MapLayerView implements FillView, StrokeView {
  initView(init: MapArcViewInit): void {
    super.initView(init);
    if (init.geoCenter !== void 0) {
      this.geoCenter(init.geoCenter);
    }
    if (init.viewCenter !== void 0) {
      this.viewCenter(init.viewCenter);
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
    if (init.padAngle !== void 0) {
      this.padAngle(init.padAngle);
    }
    if (init.padRadius !== void 0) {
      this.padRadius(init.padRadius);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
    }
    if (init.fill !== void 0) {
      this.fill(init.fill);
    }
    if (init.stroke !== void 0) {
      this.stroke(init.stroke);
    }
    if (init.strokeWidth !== void 0) {
      this.strokeWidth(init.strokeWidth);
    }
  }

  @ViewAnimator<MapArcView, GeoPoint, AnyGeoPoint>({
    type: GeoPoint,
    state: GeoPoint.origin(),
    didSetValue(newValue: GeoPoint, oldValue: GeoPoint): void {
      this.owner.onSetGeoCenter(newValue, oldValue);
    },
  })
  declare geoCenter: ViewAnimator<this, GeoPoint, AnyGeoPoint>;

  @ViewAnimator({type: PointR2, state: PointR2.origin()})
  declare viewCenter: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Length, state: Length.zero()})
  declare innerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.zero()})
  declare outerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Angle, state: Angle.zero()})
  declare startAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Angle, state: Angle.zero()})
  declare sweepAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Angle, state: Angle.zero()})
  declare padAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Length, state: null})
  declare padRadius: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Length, state: Length.zero()})
  declare cornerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: null, inherit: true})
  declare fill: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Color, state: null, inherit: true})
  declare stroke: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Length, state: null, inherit: true})
  declare strokeWidth: ViewAnimator<this, Length | null, AnyLength | null>;

  get value(): Arc {
    return new Arc(this.viewCenter.value, this.innerRadius.value, this.outerRadius.value,
                   this.startAngle.value, this.sweepAngle.value, this.padAngle.value,
                   this.padRadius.value, this.cornerRadius.value);
  }

  get state(): Arc {
    return new Arc(this.viewCenter.state, this.innerRadius.state, this.outerRadius.state,
                   this.startAngle.state, this.sweepAngle.state, this.padAngle.state,
                   this.padRadius.state, this.cornerRadius.state);
  }

  protected onSetGeoCenter(newGeoCenter: GeoPoint, oldGeoCenter: GeoPoint): void {
    if (newGeoCenter.isDefined()) {
      const oldGeoBounds = this.geoBounds;
      const newGeoBounds = new GeoBox(newGeoCenter.lng, newGeoCenter.lat, newGeoCenter.lng, newGeoCenter.lat);
      if (!oldGeoBounds.equals(newGeoBounds)) {
        Object.defineProperty(this, "geoBounds", {
          value: newGeoBounds,
          enumerable: true,
          configurable: true,
        });
        this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
        this.requireUpdate(View.NeedsProject);
      }
    }
  }

  protected onProject(viewContext: ViewContextType<this>): void {
    super.onProject(viewContext);
    let viewCenter: PointR2;
    if (this.viewCenter.isPrecedent(View.Intrinsic)) {
      const geoProjection = viewContext.geoProjection;
      viewCenter = geoProjection.project(this.geoCenter.getValue());
      this.viewCenter.setState(viewCenter, View.Intrinsic);
    } else {
      viewCenter = this.viewCenter.getValue();
    }
    const frame = this.viewFrame;
    const size = Math.min(frame.width, frame.height);
    const radius = this.outerRadius.getValue().pxValue(size);
    const invalid = !isFinite(viewCenter.x) || !isFinite(viewCenter.y) || !isFinite(radius);
    const culled = invalid || !frame.intersectsCircle(new CircleR2(viewCenter.x, viewCenter.y, radius));
    this.setCulled(culled);
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderArc(renderer.context, this.viewFrame);
      context.restore();
    }
  }

  protected renderArc(context: CanvasContext, frame: BoxR2): void {
    const arc = this.value;
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
  }

  protected doUpdateGeoBounds(): void {
    // nop
  }

  get popoverFrame(): BoxR2 {
    const frame = this.viewFrame;
    const size = Math.min(frame.width, frame.height);
    const inversePageTransform = this.pageTransform.inverse();
    const viewCenter = this.viewCenter.getValue();
    const px = inversePageTransform.transformX(viewCenter.x, viewCenter.y);
    const py = inversePageTransform.transformY(viewCenter.x, viewCenter.y);
    const r = (this.innerRadius.getValue().pxValue(size) + this.outerRadius.getValue().pxValue(size)) / 2;
    const a = this.startAngle.getValue().radValue() + this.sweepAngle.getValue().radValue() / 2;
    const x = px + r * Math.cos(a);
    const y = py + r * Math.sin(a);
    return new BoxR2(x, y, x, y);
  }

  get viewBounds(): BoxR2 {
    const frame = this.viewFrame;
    const size = Math.min(frame.width, frame.height);
    const viewCenter = this.viewCenter.getValue();
    const radius = this.outerRadius.getValue().pxValue(size);
    return new BoxR2(viewCenter.x - radius, viewCenter.y - radius,
                     viewCenter.x + radius, viewCenter.y + radius);
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
        hit = this.hitTestArc(x, y, context, this.viewFrame);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestArc(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    context.beginPath();
    const arc = this.value;
    arc.draw(context, frame);
    if (this.fill.value !== null && context.isPointInPath(x, y)) {
      return this;
    } else if (this.stroke.value !== void 0) {
      const strokeWidth = this.strokeWidth.value;
      if (strokeWidth !== null) {
        const size = Math.min(frame.width, frame.height);
        context.lineWidth = strokeWidth.pxValue(size);
        if (context.isPointInStroke(x, y)) {
          return this;
        }
      }
    }
    return null;
  }

  static create(): MapArcView {
    return new MapArcView();
  }

  static fromInit(init: MapArcViewInit): MapArcView {
    const view = new MapArcView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyMapArcView): MapArcView {
    if (value instanceof MapArcView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
