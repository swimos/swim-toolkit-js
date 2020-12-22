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

import {AnyLength, Length, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {Transition} from "@swim/tween";
import {AnyColor, Color} from "@swim/color";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import {Graphics, GraphicsView, IconViewInit, IconView, CanvasRenderer} from "@swim/graphics";
import {MapGraphicsViewInit} from "../graphics/MapGraphicsView";
import {MapGraphicsViewController} from "../graphics/MapGraphicsViewController";
import {MapLayerView} from "../layer/MapLayerView";

export type AnyMapIconView = MapIconView | MapIconViewInit;

export interface MapIconViewInit extends MapGraphicsViewInit, IconViewInit {
  viewController?: MapGraphicsViewController;
  geoCenter?: AnyGeoPoint;
  viewCenter?: AnyPointR2;
}

export class MapIconView extends MapLayerView implements IconView {
  /** @hidden */
  _canvas: HTMLCanvasElement | null;

  constructor() {
    super();
    this._canvas = null;
  }

  initView(init: MapIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
    if (init.geoCenter !== void 0) {
      this.geoCenter(init.geoCenter);
    }
    if (init.viewCenter !== void 0) {
      this.viewCenter(init.viewCenter);
    }
  }

  @ViewAnimator<MapIconView, GeoPoint, AnyGeoPoint>({
    type: GeoPoint,
    state: GeoPoint.origin(),
    onUpdate(newValue: GeoPoint, oldValue: GeoPoint): void {
      this.owner.onSetGeoCenter(newValue, oldValue);
    },
  })
  geoCenter: ViewAnimator<this, GeoPoint, AnyGeoPoint>;

  @ViewAnimator({type: PointR2, state: PointR2.origin()})
  viewCenter: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Number})
  xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number})
  yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsRender | View.NeedsComposite})
  iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsRender | View.NeedsComposite})
  iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, updateFlags: View.NeedsRender | View.NeedsComposite})
  iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Object, updateFlags: View.NeedsRender | View.NeedsComposite})
  graphics: ViewAnimator<this, Graphics | undefined>;

  protected onSetGeoCenter(newGeoCenter: GeoPoint, oldGeoCenter: GeoPoint): void {
    if (newGeoCenter.isDefined()) {
      const oldGeoBounds = this._geoBounds;
      const newGeoBounds = new GeoBox(newGeoCenter._lng, newGeoCenter._lat, newGeoCenter._lng, newGeoCenter._lat);
      this._geoBounds = newGeoBounds;
      this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
    }
    this.requireUpdate(View.NeedsProject);
  }

  protected onProject(viewContext: ViewContextType<this>): void {
    super.onProject(viewContext);
    let viewCenter: PointR2;
    if (this.viewCenter.isAuto()) {
      const geoProjection = viewContext.geoProjection;
      viewCenter = geoProjection.project(this.geoCenter.getValue());
      this.viewCenter.setAutoState(viewCenter);
    } else {
      viewCenter = this.viewCenter.getValue();
    }
    const invalid = !isFinite(viewCenter.x) || !isFinite(viewCenter.y);
    const culled = invalid || !this.viewFrame.intersectsBox(this.viewBounds);
    this.setCulled(culled);
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    if (this.iconColor.isAuto() && !this.iconColor.isInherited()) {
      this.iconColor.setAutoState(theme.inner(mood, Look.accentColor), transition);
    }
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this._viewFlags & View.NeedsRender) === 0) {
      displayFlags &= ~View.NeedsRender;
    }
    return displayFlags;
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      this.renderIcon(renderer, this.viewBounds);
    }
  }

  protected renderIcon(renderer: CanvasRenderer, frame: BoxR2): void {
    const graphics = this.graphics.value;
    if (graphics !== void 0) {
      let canvas = this._canvas;
      if (canvas === null) {
        canvas = document.createElement("canvas");
        this._canvas = canvas;
      }
      const pixelRatio = renderer.pixelRatio;
      const width = frame.width;
      const height = frame.height;

      const context = canvas.getContext("2d")!;
      if (canvas.width !== pixelRatio * width || canvas.height !== pixelRatio * height) {
        canvas.width = pixelRatio * width;
        canvas.height = pixelRatio * height;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }
      context.clearRect(0, 0, width, height);

      context.beginPath();
      const iconColor = this.iconColor.value;
      if (iconColor !== void 0) {
        context.fillStyle = iconColor.toString();
      }
      graphics.render(new CanvasRenderer(context, pixelRatio), new BoxR2(0, 0, width, height));
      if (iconColor !== void 0) {
        context.fill();
      }
    } else {
      this._canvas = null;
    }
  }

  protected onComposite(viewContext: ViewContextType<this>): void {
    super.onComposite(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      this.compositeIcon(renderer, this.viewBounds);
    }
  }

  protected compositeIcon(renderer: CanvasRenderer, frame: BoxR2): void {
    const canvas = this._canvas;
    if (canvas !== null) {
      renderer.context.drawImage(canvas, frame.x, frame.y, frame.width, frame.height);
    }
  }

  protected doUpdateGeoBounds(): void {
    // nop
  }

  get popoverFrame(): BoxR2 {
    const frame = this.viewFrame;
    const viewSize = Math.min(frame.width, frame.height);
    const inversePageTransform = this.pageTransform.inverse();
    const viewCenter = this.viewCenter.getValue();
    const [px, py] = inversePageTransform.transform(viewCenter.x, viewCenter.y);
    let iconWidth: Length | number | undefined = this.iconWidth.value;
    iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
    let iconHeight: Length | number | undefined = this.iconHeight.value;
    iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
    const x = px - iconWidth * this.xAlign.getValueOr(0.5);
    const y = py - iconHeight * this.yAlign.getValueOr(0.5);
    return new BoxR2(x, y, x + iconWidth, y + iconHeight);
  }

  get viewBounds(): BoxR2 {
    const frame = this.viewFrame;
    const viewSize = Math.min(frame.width, frame.height);
    const viewCenter = this.viewCenter.getValue();
    let iconWidth: Length | number | undefined = this.iconWidth.value;
    iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
    let iconHeight: Length | number | undefined = this.iconHeight.value;
    iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
    const x = viewCenter.x - iconWidth * this.xAlign.getValueOr(0.5);
    const y = viewCenter.y - iconHeight * this.yAlign.getValueOr(0.5);
    return new BoxR2(x, y, x + iconWidth, y + iconHeight);
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        hit = this.hitTestIcon(x, y, renderer, this.viewBounds);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestIcon(x: number, y: number, renderer: CanvasRenderer, frame: BoxR2): GraphicsView | null {
    // TODO: icon hit test mode
    if (this.hitBounds.contains(x, y)) {
      return this;
    }
    //const graphics = this.graphics.value;
    //if (graphics !== void 0) {
    //  const context = renderer.context;
    //  graphics.render(renderer, frame);
    //  if (context.isPointInPath(x * renderer.pixelRatio, y * renderer.pixelRatio)) {
    //    return this;
    //  }
    //}
    return null;
  }

  static fromInit(init: MapIconViewInit): MapIconView {
    const view = new MapIconView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyMapIconView): MapIconView {
    if (value instanceof MapIconView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
