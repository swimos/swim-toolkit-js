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
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, View, ViewProperty, ViewAnimator} from "@swim/view";
import {
  GraphicsView,
  FillViewInit,
  FillView,
  StrokeViewInit,
  StrokeView,
  CanvasContext,
  CanvasRenderer,
} from "@swim/graphics";
import type {MapGraphicsViewInit} from "../graphics/MapGraphicsView";
import {MapLayerView} from "../layer/MapLayerView";
import {AnyMapPointView, MapPointView} from "./MapPointView";

export type AnyMapPolygonView = MapPolygonView | MapPolygonViewInit;

export interface MapPolygonViewInit extends MapGraphicsViewInit, FillViewInit, StrokeViewInit {
  points?: ReadonlyArray<AnyMapPointView>;

  clipViewport?: true;

  font?: AnyFont;
  textColor?: AnyColor;
}

export class MapPolygonView extends MapLayerView implements FillView, StrokeView {
  constructor() {
    super();
    Object.defineProperty(this, "viewBounds", {
      value: BoxR2.undefined(),
      enumerable: true,
      configurable: true,
    });
  }

  initView(init: MapPolygonViewInit): void {
    super.initView(init);
    if (init.clipViewport !== void 0) {
      this.clipViewport(init.clipViewport);
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
    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
    const points = init.points;
    if (points !== void 0) {
      this.points(points);
    }
  }

  points(): ReadonlyArray<MapPointView>;
  points(points: ReadonlyArray<AnyMapPointView>, timing?: AnyTiming | boolean): this;
  points(points?: ReadonlyArray<AnyMapPointView>, timing?: AnyTiming | boolean): ReadonlyArray<MapPointView> | this {
    const childViews = this.childViews;
    if (points === void 0) {
      const points: MapPointView[] = [];
      for (let i = 0; i < childViews.length; i += 1) {
        const childView = childViews[i];
        if (childView instanceof MapPointView) {
          points.push(childView);
        }
      }
      return points;
    } else {
      const oldGeoBounds = this.geoBounds;
      let lngMin = Infinity;
      let latMin = Infinity;
      let lngMax = -Infinity;
      let latMax = -Infinity;
      let lngMid = 0;
      let latMid = 0;
      let invalid = false;
      let i = 0;
      let j = 0;
      while (i < childViews.length && j < points.length) {
        const childView = childViews[i];
        if (childView instanceof MapPointView) {
          const point = points[j]!;
          childView.setState(point);
          const {lng, lat} = childView.geoPoint.getValue();
          lngMid += lng;
          latMid += lat;
          lngMin = Math.min(lngMin, lng);
          latMin = Math.min(latMin, lat);
          lngMax = Math.max(lng, lngMax);
          latMax = Math.max(lat, latMax);
          invalid = invalid || !isFinite(lng) || !isFinite(lat);
          j += 1;
        }
        i += 1;
      }
      while (j < points.length) {
        const point = MapPointView.fromAny(points[j]!);
        this.appendChildView(point);
        const {lng, lat} = point.geoPoint.getValue();
        lngMid += lng;
        latMid += lat;
        lngMin = Math.min(lngMin, lng);
        latMin = Math.min(latMin, lat);
        lngMax = Math.max(lng, lngMax);
        latMax = Math.max(lat, latMax);
        invalid = invalid || !isFinite(lng) || !isFinite(lat);
        i += 1;
        j += 1;
      }
      while (i < childViews.length) {
        const childView = childViews[i];
        if (childView instanceof MapPointView) {
          this.removeChildView(childView);
        } else {
          i += 1;
        }
      }
      if (!invalid && j !== 0) {
        lngMid /= j;
        latMid /= j;
        this.geoCentroid.setAutoState(new GeoPoint(lngMid, latMid));
        Object.defineProperty(this, "geoBounds", {
          value: new GeoBox(lngMin, latMin, lngMax, latMax),
          enumerable: true,
          configurable: true,
        });
      } else {
        this.geoCentroid.setAutoState(GeoPoint.origin());
        Object.defineProperty(this, "geoBounds", {
          value: GeoBox.undefined(),
          enumerable: true,
          configurable: true,
        });
      }
      const newGeoBounds = this.geoBounds;
      if (!oldGeoBounds.equals(newGeoBounds)) {
        this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
      }
      return this;
    }
  }

  appendPoint(point: AnyMapPointView, key?: string): MapPointView {
    point = MapPointView.fromAny(point);
    this.appendChildView(point, key);
    return point;
  }

  setPoint(key: string, point: AnyMapPointView): MapPointView {
    point = MapPointView.fromAny(point);
    this.setChildView(key, point);
    return point;
  }

  @ViewProperty({type: Boolean, state: true})
  declare clipViewport: ViewProperty<this, boolean>;

  @ViewProperty({type: GeoPoint, state: GeoPoint.origin()})
  declare geoCentroid: ViewProperty<this, GeoPoint, AnyGeoPoint>;

  @ViewProperty({type: PointR2, state: PointR2.origin()})
  declare viewCentroid: ViewProperty<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Color, inherit: true})
  declare fill: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare stroke: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare strokeWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof MapPointView) {
      this.onInsertPoint(childView);
    }
  }

  protected onInsertPoint(childView: MapPointView): void {
    childView.requireUpdate(View.NeedsAnimate | View.NeedsProject);
  }

  protected didProject(viewContext: ViewContextType<this>): void {
    const oldGeoBounds = this.geoBounds;
    let lngMin = Infinity;
    let latMin = Infinity;
    let lngMax = -Infinity;
    let latMax = -Infinity;
    let lngMid = 0;
    let latMid = 0;
    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    let xMid = 0;
    let yMid = 0;
    let invalid = false;
    let pointCount = 0;
    const childViews = this.childViews;
    for (let i = 0; i < childViews.length; i += 1) {
      const childView = childViews[i];
      if (childView instanceof MapPointView) {
        const {lng, lat} = childView.geoPoint.getValue();
        lngMid += lng;
        latMid += lat;
        lngMin = Math.min(lngMin, lng);
        latMin = Math.min(latMin, lat);
        lngMax = Math.max(lng, lngMax);
        latMax = Math.max(lat, latMax);
        invalid = invalid || !isFinite(lng) || !isFinite(lat);
        const {x, y} = childView.viewPoint.getValue();
        xMin = Math.min(xMin, x);
        yMin = Math.min(yMin, y);
        xMax = Math.max(x, xMax);
        yMax = Math.max(y, yMax);
        xMid += x;
        yMid += y;
        invalid = invalid || !isFinite(x) || !isFinite(y);
        pointCount += 1;
      }
    }
    if (!invalid && pointCount !== 0) {
      lngMid /= pointCount;
      latMid /= pointCount;
      this.geoCentroid.setAutoState(new GeoPoint(lngMid, latMid));
      Object.defineProperty(this, "geoBounds", {
        value: new GeoBox(lngMin, latMin, lngMax, latMax),
        enumerable: true,
        configurable: true,
      });
      xMid /= pointCount;
      yMid /= pointCount;
      this.viewCentroid.setAutoState(new PointR2(xMid, yMid));
      Object.defineProperty(this, "viewBounds", {
        value: new BoxR2(xMin, yMin, xMax, yMax),
        enumerable: true,
        configurable: true,
      });
      if (viewContext.geoFrame.intersects(this.geoBounds)) {
        const frame = this.viewFrame;
        const bounds = this.viewBounds;
        // check if 9x9 view frame fully contains view bounds
        const contained = !this.clipViewport.state
                       || frame.xMin - 4 * frame.width <= bounds.xMin
                       && bounds.xMax <= frame.xMax + 4 * frame.width
                       && frame.yMin - 4 * frame.height <= bounds.yMin
                       && bounds.yMax <= frame.yMax + 4 * frame.height;
        const culled = !contained || !frame.intersects(bounds);
        this.setCulled(culled);
      } else {
        this.setCulled(true);
      }
    } else {
      this.geoCentroid.setAutoState(GeoPoint.origin());
      Object.defineProperty(this, "geoBounds", {
        value: GeoBox.undefined(),
        enumerable: true,
        configurable: true,
      });
      this.viewCentroid.setAutoState(PointR2.origin());
      Object.defineProperty(this, "viewBounds", {
        value: BoxR2.undefined(),
        enumerable: true,
        configurable: true,
      });
      this.setCulled(true);
    }
    const newGeoBounds = this.geoBounds;
    if (!oldGeoBounds.equals(newGeoBounds)) {
      this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
    }
    super.didProject(viewContext);
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderPolygon(context, this.viewFrame);
      context.restore();
    }
  }

  protected renderPolygon(context: CanvasContext, frame: BoxR2): void {
    const childViews = this.childViews;
    const childCount = childViews.length;
    let pointCount = 0;
    context.beginPath();
    for (let i = 0; i < childCount; i += 1) {
      const childView = childViews[i];
      if (childView instanceof MapPointView) {
        const {x, y} = childView.viewPoint.getValue();
        if (pointCount === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
        pointCount += 1;
      }
    }
    context.closePath();
    if (pointCount !== 0) {
      const fill = this.fill.value;
      if (fill !== void 0) {
        context.fillStyle = fill.toString();
        context.fill();
      }
      const stroke = this.stroke.value;
      const strokeWidth = this.strokeWidth.value;
      if (stroke !== void 0 && strokeWidth !== void 0) {
        const size = Math.min(frame.width, frame.height);
        context.lineWidth = strokeWidth.pxValue(size);
        context.strokeStyle = stroke.toString();
        context.stroke();
      }
    }
  }

  protected doUpdateGeoBounds(): void {
    // nop
  }

  get popoverFrame(): BoxR2 {
    const viewCentroid = this.viewCentroid.state;
    const inversePageTransform = this.pageTransform.inverse();
    const px = inversePageTransform.transformX(viewCentroid.x, viewCentroid.y);
    const py = inversePageTransform.transformY(viewCentroid.x, viewCentroid.y);
    return new BoxR2(px, py, px, py);
  }

  // @ts-ignore
  declare readonly viewBounds: BoxR2;

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        x *= renderer.pixelRatio;
        y *= renderer.pixelRatio;
        hit = this.hitTestPolygon(x, y, context, this.viewFrame);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestPolygon(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    const childViews = this.childViews;
    const childCount = childViews.length;
    let pointCount = 0;
    context.beginPath();
    for (let i = 0; i < childCount; i += 1) {
      const childView = this.childViews[i];
      if (childView instanceof MapPointView) {
        const {x, y} = childView.viewPoint.getValue();
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
        pointCount += 1;
      }
    }
    context.closePath();
    if (pointCount !== 0) {
      if (this.fill.value !== void 0 && context.isPointInPath(x, y)) {
        return this;
      }
      if (this.stroke.value !== void 0) {
        const strokeWidth = this.strokeWidth.value;
        if (strokeWidth !== void 0) {
          const size = Math.min(frame.width, frame.height);
          context.lineWidth = strokeWidth.pxValue(size);
          if (context.isPointInStroke(x, y)) {
            return this;
          }
        }
      }
    }
    return null;
  }

  static create(): MapPolygonView {
    return new MapPolygonView();
  }

  static fromInit(init: MapPolygonViewInit): MapPolygonView {
    const view = new MapPolygonView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyMapPolygonView): MapPolygonView {
    if (value instanceof MapPolygonView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
