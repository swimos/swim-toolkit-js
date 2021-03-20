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

import type {AnyTiming} from "@swim/mapping";
import {AnyLength, Length, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyGeoPoint, GeoPointInit, GeoPointTuple, GeoPoint, GeoBox} from "@swim/geo";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewProperty, ViewAnimator} from "@swim/view";
import {
  GraphicsView,
  TypesetView,
  AnyTextRunView,
  TextRunView,
  CanvasContext,
  CanvasRenderer,
} from "@swim/graphics";
import type {MapGraphicsViewInit} from "../graphics/MapGraphicsView";
import {MapLayerView} from "../layer/MapLayerView";

export type MapPointLabelPlacement = "auto" | "top" | "right" | "bottom" | "left";

export type AnyMapPointView = MapPointView | MapPointViewInit | GeoPoint | GeoPointInit | GeoPointTuple;

export interface MapPointViewInit extends MapGraphicsViewInit {
  lng?: number;
  lat?: number;
  x?: number;
  y?: number;

  radius?: AnyLength;

  hitRadius?: number;

  color?: AnyColor;
  opacity?: number;

  labelPadding?: AnyLength;
  labelPlacement?: MapPointLabelPlacement;

  font?: AnyFont;
  textColor?: AnyColor;

  label?: GraphicsView | string | null;
}

export class MapPointView extends MapLayerView {
  initView(init: MapPointViewInit): void {
    super.initView(init);
    this.setState(init);
  }

  @ViewAnimator<MapPointView, GeoPoint, AnyGeoPoint>({
    type: GeoPoint,
    state: GeoPoint.origin(),
    didSetValue(newValue: GeoPoint, oldValue: GeoPoint): void {
      this.owner.onSetGeoPoint(newValue, oldValue);
    },
  })
  declare geoPoint: ViewAnimator<this, GeoPoint, AnyGeoPoint>;

  @ViewAnimator({type: PointR2, state: PointR2.origin()})
  declare viewPoint: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Length, state: null})
  declare radius: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Color, state: null})
  declare color: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Number})
  declare opacity: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, state: null})
  declare labelPadding: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Font, state: null, inherit: true})
  declare font: ViewAnimator<this, Font | null, AnyFont | null>;

  @ViewAnimator({type: Color, state: null, inherit: true})
  declare textColor: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewProperty({type: Number})
  declare hitRadius: ViewProperty<this, number | undefined>;

  label(): GraphicsView | null;
  label(label: GraphicsView | AnyTextRunView | null): this;
  label(label?: GraphicsView | AnyTextRunView | null): GraphicsView | null | this {
    if (label === void 0) {
      const childView = this.getChildView("label");
      return childView instanceof GraphicsView ? childView : null;
    } else {
      if (label !== null && !(label instanceof GraphicsView)) {
        label = TextRunView.fromAny(label);
      }
      this.setChildView("label", label);
      return this;
    }
  }

  @ViewProperty({type: String, state: "auto"})
  declare labelPlacement: ViewProperty<this, MapPointLabelPlacement>;

  isGradientStop(): boolean {
    return !!this.color.value || typeof this.opacity.value === "number";
  }

  setState(point: AnyMapPointView, timing?: AnyTiming | boolean): void {
    let init: MapPointViewInit;
    if (point instanceof MapPointView) {
      init = point.toAny();
    } else if (point instanceof GeoPoint) {
      init = point.toAny();
    } else if (GeoPoint.isTuple(point)) {
      init = {lng: point[0], lat: point[1]};
    } else {
      init = point;
    }
    if (init.lng !== void 0 && init.lat !== void 0) {
      this.geoPoint(new GeoPoint(init.lng, init.lat), timing);
    } else if (init.x !== void 0 && init.y !== void 0) {
      this.viewPoint(new PointR2(init.x, init.y), timing);
    }

    if (init.radius !== void 0) {
      this.radius(init.radius, timing);
    }

    if (init.hitRadius !== void 0) {
      this.hitRadius(init.hitRadius);
    }

    if (init.color !== void 0) {
      this.color(init.color, timing);
    }
    if (init.opacity !== void 0) {
      this.opacity(init.opacity, timing);
    }

    if (init.labelPadding !== void 0) {
      this.labelPadding(init.labelPadding, timing);
    }
    if (init.labelPlacement !== void 0) {
      this.labelPlacement(init.labelPlacement);
    }

    if (init.font !== void 0) {
      this.font(init.font, timing);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor, timing);
    }

    if (init.label !== void 0) {
      this.label(init.label);
    }
  }

  protected onSetGeoPoint(newGeoPoint: GeoPoint, oldGeoPoint: GeoPoint): void {
    if (newGeoPoint.isDefined()) {
      const oldGeoBounds = this.geoBounds;
      const newGeoBounds = new GeoBox(newGeoPoint.lng, newGeoPoint.lat, newGeoPoint.lng, newGeoPoint.lat);
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

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsProject) !== 0 && this.label() !== null) {
      this.requireUpdate(View.NeedsLayout);
    }
    return processFlags;
  }

  protected onProject(viewContext: ViewContextType<this>): void {
    super.onProject(viewContext);
    if (this.viewPoint.isAuto()) {
      const viewPoint = viewContext.geoProjection.project(this.geoPoint.getValue());
      //this.viewPoint.setAutoState(viewPoint);
      Object.defineProperty(this.viewPoint, "ownValue", {
        value: viewPoint,
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(this.viewPoint, "ownState", {
        value: viewPoint,
        enumerable: true,
        configurable: true,
      });
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const label = this.label();
    if (label !== null) {
      this.layoutLabel(label, this.viewFrame);
    }
  }

  protected layoutLabel(label: GraphicsView, frame: BoxR2): void {
    const placement = this.labelPlacement.state;
    // TODO: auto placement

    const size = Math.min(frame.width, frame.height);
    const padding = this.labelPadding.getValue().pxValue(size);
    const {x, y} = this.viewPoint.getValue();
    let y1 = y;
    if (placement === "top") {
      y1 -= padding;
    } else if (placement === "bottom") {
      y1 += padding;
    }

    if (TypesetView.is(label)) {
      label.textAlign.setAutoState("center");
      label.textBaseline.setAutoState("bottom");
      label.textOrigin.setAutoState(new PointR2(x, y1));
    }
  }

  protected doUpdateGeoBounds(): void {
    // nop
  }

  get viewBounds(): BoxR2 {
    const {x, y} = this.viewPoint.getValue();
    return new BoxR2(x, y, x, y);
  }

  get hitBounds(): BoxR2 {
    const {x, y} = this.viewPoint.getValue();
    const hitRadius = this.hitRadius.getStateOr(0);
    return new BoxR2(x - hitRadius, y - hitRadius, x + hitRadius, y + hitRadius);
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        hit = this.hitTestPoint(x, y, context, this.viewFrame);
      }
    }
    return hit;
  }

  protected hitTestPoint(hx: number, hy: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    const {x, y} = this.viewPoint.getValue();
    const radius = this.radius.value;

    let hitRadius = this.hitRadius.getStateOr(0);
    if (radius !== null) {
      const size = Math.min(frame.width, frame.height);
      hitRadius = Math.max(hitRadius, radius.pxValue(size));
    }

    const dx = x - hx;
    const dy = y - hy;
    if (dx * dx + dy * dy < hitRadius * hitRadius) {
      return this;
    }
    return null;
  }

  toAny(): MapPointViewInit {
    const init: MapPointViewInit = {};
    init.lng = this.geoPoint.value.lng;
    init.lat = this.geoPoint.value.lat;
    if (!this.viewPoint.isAuto()) {
      init.x = this.viewPoint.value.x;
      init.y = this.viewPoint.value.y;
    }
    if (this.radius.value !== null) {
      init.radius = this.radius.value;
    }
    if (this.hitRadius.state !== void 0) {
      init.hitRadius = this.hitRadius.state;
    }
    if (this.color.value !== null) {
      init.color = this.color.value;
    }
    if (this.opacity.value !== void 0) {
      init.opacity = this.opacity.value;
    }
    if (this.labelPadding.value !== null) {
      init.labelPadding = this.labelPadding.value;
    }
    if (this.labelPlacement.state !== void 0) {
      init.labelPlacement = this.labelPlacement.state;
    }
    return init;
  }

  static create(): MapPointView {
    return new MapPointView();
  }

  static fromGeoPoint(point: AnyGeoPoint): MapPointView {
    const view = new MapPointView();
    view.setState(point);
    return view;
  }

  static fromInit(init: MapPointViewInit): MapPointView {
    const view = new MapPointView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyMapPointView): MapPointView {
    if (value instanceof MapPointView) {
      return value;
    } else if (value instanceof GeoPoint || GeoPoint.isTuple(value)) {
      return this.fromGeoPoint(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
