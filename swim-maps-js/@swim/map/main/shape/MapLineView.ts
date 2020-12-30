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

import {AnyLength, Length, BoxR2} from "@swim/math";
import {GeoPath} from "@swim/geo";
import {AnyColor, Color} from "@swim/color";
import {ViewContextType, ViewAnimator} from "@swim/view";
import {
  GraphicsView,
  StrokeViewInit,
  StrokeView,
  CanvasContext,
  CanvasRenderer,
} from "@swim/graphics";
import {MapPathViewInit, MapPathView} from "./MapPathView";

export interface MapLineViewInit extends MapPathViewInit, StrokeViewInit {
  hitWidth?: number;
}

export class MapLineView extends MapPathView implements StrokeView {
  /** @hidden */
  _hitWidth?: number;

  initView(init: MapLineViewInit): void {
    super.initView(init);
    if (init.stroke !== void 0) {
      this.stroke(init.stroke);
    }
    if (init.strokeWidth !== void 0) {
      this.strokeWidth(init.strokeWidth);
    }
    if (init.hitWidth !== void 0) {
      this.hitWidth(init.hitWidth);
    }
  }

  @ViewAnimator({type: Color, inherit: true})
  stroke: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  strokeWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  hitWidth(): number | null;
  hitWidth(hitWidth: number | null): this;
  hitWidth(hitWidth?: number | null): number | null | this {
    if (hitWidth === void 0) {
      return this._hitWidth !== void 0 ? this._hitWidth : null;
    } else {
      if (hitWidth !== null) {
        this._hitWidth = hitWidth;
      } else if (this._hitWidth !== void 0) {
        this._hitWidth = void 0;
      }
      return this;
    }
  }

  protected onSetGeoPath(newGeoPath: GeoPath, oldGeoPath: GeoPath): void {
    super.onSetGeoPath(newGeoPath, oldGeoPath);
    if (this.geoCentroid.isAuto()) {
      this.geoCentroid.setAutoState(newGeoPath.centroid());
    }
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderLine(context, this.viewFrame);
      context.restore();
    }
  }

  protected renderLine(context: CanvasContext, frame: BoxR2): void {
    const viewPath = this.viewPath.getValue();
    if (viewPath.isDefined()) {
      context.beginPath();
      viewPath.draw(context);
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

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        x *= renderer.pixelRatio;
        y *= renderer.pixelRatio;
        hit = this.hitTestLine(x, y, context, this.viewFrame);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestLine(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    const viewPath = this.viewPath.getValue();
    if (viewPath.isDefined()) {
      context.beginPath();
      viewPath.draw(context);
      if (this.stroke.value !== void 0) {
        let hitWidth = this._hitWidth !== void 0 ? this._hitWidth : 0;
        const strokeWidth = this.strokeWidth.value;
        if (strokeWidth !== void 0) {
          const size = Math.min(frame.width, frame.height);
          hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
        }
        context.lineWidth = hitWidth;
        if (context.isPointInStroke(x, y)) {
          return this;
        }
      }
    }
    return null;
  }

  static fromInit(init: MapLineViewInit): MapLineView {
    const view = new MapLineView();
    view.initView(init);
    return view;
  }
}
