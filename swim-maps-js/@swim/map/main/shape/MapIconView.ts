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

import type {Timing} from "@swim/mapping";
import {AnyLength, Length, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {AnyColor, Color} from "@swim/color";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import {Graphics, GraphicsView, Icon, IconViewInit, IconView, IconViewAnimator, CanvasRenderer} from "@swim/graphics";
import type {MapGraphicsViewInit} from "../graphics/MapGraphicsView";
import type {MapGraphicsViewController} from "../graphics/MapGraphicsViewController";
import {MapLayerView} from "../layer/MapLayerView";

export type AnyMapIconView = MapIconView | MapIconViewInit;

export interface MapIconViewInit extends MapGraphicsViewInit, IconViewInit {
  viewController?: MapGraphicsViewController;
  geoCenter?: AnyGeoPoint;
  viewCenter?: AnyPointR2;
}

export class MapIconView extends MapLayerView implements IconView {
  constructor() {
    super();
    Object.defineProperty(this, "canvas", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "iconBounds", {
      value: null,
      enumerable: true,
      configurable: true,
    });
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

  /** @hidden */
  declare readonly canvas: HTMLCanvasElement | null;

  @ViewAnimator<MapIconView, GeoPoint, AnyGeoPoint>({
    type: GeoPoint,
    state: GeoPoint.origin(),
    onSetValue(newValue: GeoPoint, oldValue: GeoPoint): void {
      this.owner.onSetGeoCenter(newValue, oldValue);
    },
  })
  declare geoCenter: ViewAnimator<this, GeoPoint, AnyGeoPoint>;

  @ViewAnimator({type: PointR2, state: PointR2.origin()})
  declare viewCenter: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({extends: IconViewAnimator, type: Object, updateFlags: View.NeedsRender | View.NeedsComposite})
  declare graphics: ViewAnimator<this, Graphics | undefined>;

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

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (!this.graphics.isInherited()) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setOwnState(newGraphics, oldGraphics.isThemed() ? timing : false);
      }
    }
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
    Object.defineProperty(this, "iconBounds", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    const invalid = !isFinite(viewCenter.x) || !isFinite(viewCenter.y);
    const culled = invalid || !this.viewFrame.intersectsBox(this.viewBounds);
    this.setCulled(culled);
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.NeedsRender) === 0) {
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
      let canvas = this.canvas;
      if (canvas === null) {
        canvas = document.createElement("canvas");
        Object.defineProperty(this, "canvas", {
          value: canvas,
          enumerable: true,
          configurable: true,
        });
      }
      const pixelRatio = renderer.pixelRatio;
      const width = frame.width;
      const height = frame.height;

      const iconContext = canvas.getContext("2d")!;
      if (canvas.width !== pixelRatio * width || canvas.height !== pixelRatio * height) {
        canvas.width = pixelRatio * width;
        canvas.height = pixelRatio * height;
        iconContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      }
      iconContext.clearRect(0, 0, width, height);

      iconContext.beginPath();
      const iconColor = this.iconColor.value;
      if (iconColor !== void 0) {
        iconContext.fillStyle = iconColor.toString();
      }
      const iconRenderer = new CanvasRenderer(iconContext, pixelRatio, this.theme.state, this.mood.state);
      const iconFrame = new BoxR2(0, 0, width, height);
      graphics.render(iconRenderer, iconFrame);
    } else {
      Object.defineProperty(this, "canvas", {
        value: null,
        enumerable: true,
        configurable: true,
      });
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
    const canvas = this.canvas;
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
    const px = inversePageTransform.transformX(viewCenter.x, viewCenter.y);
    const py = inversePageTransform.transformY(viewCenter.x, viewCenter.y);
    let iconWidth: Length | number | undefined = this.iconWidth.value;
    iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
    let iconHeight: Length | number | undefined = this.iconHeight.value;
    iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
    const x = px - iconWidth * this.xAlign.getValueOr(0.5);
    const y = py - iconHeight * this.yAlign.getValueOr(0.5);
    return new BoxR2(x, y, x + iconWidth, y + iconHeight);
  }

  /** @hidden */
  declare readonly iconBounds: BoxR2 | null;

  get viewBounds(): BoxR2 {
    let iconBounds = this.iconBounds;
    if (iconBounds === null) {
      const frame = this.viewFrame;
      const viewSize = Math.min(frame.width, frame.height);
      const viewCenter = this.viewCenter.getValue();
      let iconWidth: Length | number | undefined = this.iconWidth.value;
      iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
      let iconHeight: Length | number | undefined = this.iconHeight.value;
      iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
      const x = viewCenter.x - iconWidth * this.xAlign.getValueOr(0.5);
      const y = viewCenter.y - iconHeight * this.yAlign.getValueOr(0.5);
      iconBounds = new BoxR2(x, y, x + iconWidth, y + iconHeight);
      Object.defineProperty(this, "iconBounds", {
        value: iconBounds,
        enumerable: true,
        configurable: true,
      });
    }
    return iconBounds;
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

  static create(): MapIconView {
    return new MapIconView();
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
