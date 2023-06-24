// Copyright 2015-2023 Swim.inc
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

import type {Class} from "@swim/util";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {R2Box} from "@swim/math";
import {Property} from "@swim/component";
import type {GeoBox} from "@swim/geo";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import {ThemeAnimator} from "@swim/theme";
import {View} from "@swim/view";
import type {GraphicsView} from "@swim/graphics";
import type {FillViewInit} from "@swim/graphics";
import type {FillView} from "@swim/graphics";
import type {StrokeViewInit} from "@swim/graphics";
import type {StrokeView} from "@swim/graphics";
import type {PaintingContext} from "@swim/graphics";
import {PaintingRenderer} from "@swim/graphics";
import type {CanvasContext} from "@swim/graphics";
import {CanvasRenderer} from "@swim/graphics";
import type {GeoPathViewInit} from "./GeoPathView";
import type {GeoPathViewObserver} from "./GeoPathView";
import {GeoPathView} from "./GeoPathView";

/** @public */
export interface GeoAreaViewInit extends GeoPathViewInit, FillViewInit, StrokeViewInit {
  clipViewport?: true;
}

/** @public */
export interface GeoAreaViewObserver<V extends GeoAreaView = GeoAreaView> extends GeoPathViewObserver<V> {
  viewDidSetFill?(fill: Color | null, view: V): void;

  viewDidSetStroke?(stoke: Color | null, view: V): void;

  viewDidSetStrokeWidth?(strokeWidth: Length | null, view: V): void;
}

/** @public */
export class GeoAreaView extends GeoPathView implements FillView, StrokeView {
  declare readonly observerType?: Class<GeoAreaViewObserver>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    inherits: true,
    updateFlags: View.NeedsRender,
    didSetValue(fill: Color | null): void {
      this.owner.callObservers("viewDidSetFill", fill, this.owner);
    },
  })
  readonly fill!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    inherits: true,
    updateFlags: View.NeedsRender,
    didSetValue(stroke: Color | null): void {
      this.owner.callObservers("viewDidSetStroke", stroke, this.owner);
    },
  })
  readonly stroke!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    valueType: Length,
    value: null,
    inherits: true,
    updateFlags: View.NeedsRender,
    didSetValue(strokeWidth: Length | null): void {
      this.owner.callObservers("viewDidSetStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly strokeWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @Property({valueType: Boolean, value: true})
  readonly clipViewport!: Property<this, boolean>;

  override cullGeoFrame(geoFrame: GeoBox = this.geoFrame): void {
    if (!geoFrame.intersects(this.geoBounds)) {
      this.setCulled(true);
      return;
    }
    const viewFrame = this.viewFrame;
    const bounds = this.viewBounds;
    // check if 9x9 view frame fully contains view bounds
    const contained = !this.clipViewport.value
                   || viewFrame.xMin - 4 * viewFrame.width <= bounds.xMin
                   && bounds.xMax <= viewFrame.xMax + 4 * viewFrame.width
                   && viewFrame.yMin - 4 * viewFrame.height <= bounds.yMin
                   && bounds.yMax <= viewFrame.yMax + 4 * viewFrame.height;
    this.setCulled(!contained || !viewFrame.intersects(bounds));
  }

  protected override onRender(): void {
    super.onRender();
    const renderer = this.renderer.value;
    if (renderer instanceof PaintingRenderer && !this.hidden && !this.culled) {
      this.renderArea(renderer.context, this.viewFrame);
    }
  }

  protected renderArea(context: PaintingContext, frame: R2Box): void {
    const viewPath = this.viewPath.value;
    if (viewPath === null || !viewPath.isDefined()) {
      return;
    }

    // save
    const contextFillStyle = context.fillStyle;
    const contextLineWidth = context.lineWidth;
    const contextStrokeStyle = context.strokeStyle;

    context.beginPath();
    viewPath.draw(context);
    const fill = this.fill.value;
    if (fill !== null) {
      context.fillStyle = fill.toString();
      context.fill();
    }
    const stroke = this.stroke.value;
    const strokeWidth = this.strokeWidth.value;
    if (stroke !== null && strokeWidth !== null) {
      const size = Math.min(frame.width, frame.height);
      context.lineWidth = strokeWidth.pxValue(size);
      context.strokeStyle = stroke.toString();
      context.stroke();
    }

    // restore
    context.fillStyle = contextFillStyle;
    context.lineWidth = contextLineWidth;
    context.strokeStyle = contextStrokeStyle;
  }

  protected override hitTest(x: number, y: number): GraphicsView | null {
    const renderer = this.renderer.value;
    if (renderer instanceof CanvasRenderer) {
      const p = renderer.transform.transform(x, y);
      return this.hitTestArea(p.x, p.y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestArea(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    const viewPath = this.viewPath.value;
    if (viewPath === null || !viewPath.isDefined()) {
      return null;
    }
    context.beginPath();
    viewPath.draw(context);
    if (this.fill.value !== null && context.isPointInPath(x, y)) {
      return this;
    }
    let strokeWidth: Length | null;
    if (this.stroke.value === null || (strokeWidth = this.strokeWidth.value) === null) {
      return null;
    }

    // save
    const contextLineWidth = context.lineWidth;

    const size = Math.min(frame.width, frame.height);
    context.lineWidth = strokeWidth.pxValue(size);
    const pointInStroke = context.isPointInStroke(x, y);

    // restore
    context.lineWidth = contextLineWidth;

    return pointInStroke ? this : null;
  }

  override init(init: GeoAreaViewInit): void {
    super.init(init);
    if (init.fill !== void 0) {
      this.fill(init.fill);
    }
    if (init.stroke !== void 0) {
      this.stroke(init.stroke);
    }
    if (init.strokeWidth !== void 0) {
      this.strokeWidth(init.strokeWidth);
    }
    if (init.clipViewport !== void 0) {
      this.clipViewport(init.clipViewport);
    }
  }
}
