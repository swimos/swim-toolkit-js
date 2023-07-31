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
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import {ThemeAnimator} from "@swim/theme";
import {View} from "@swim/view";
import type {GraphicsView} from "@swim/graphics";
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
export interface GeoLineViewInit extends GeoPathViewInit, StrokeViewInit {
  hitWidth?: number;
}

/** @public */
export interface GeoLineViewObserver<V extends GeoLineView = GeoLineView> extends GeoPathViewObserver<V> {
  viewDidSetStroke?(stroke: Color | null, view: V): void;

  viewDidSetStrokeWidth?(strokeWidth: Length | null, view: V): void;
}

/** @public */
export class GeoLineView extends GeoPathView implements StrokeView {
  override readonly observerType?: Class<GeoLineViewObserver>;

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
    didSetValue(strokeWIdth: Length | null): void {
      this.owner.callObservers("viewDidSetStrokeWidth", strokeWIdth, this.owner);
    },
  })
  readonly strokeWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @Property({valueType: Number})
  readonly hitWidth!: Property<this, number | undefined>;

  protected override onRender(): void {
    super.onRender();
    const renderer = this.renderer.value;
    if (renderer instanceof PaintingRenderer && !this.hidden && !this.culled) {
      this.renderLine(renderer.context, this.viewFrame);
    }
  }

  protected renderLine(context: PaintingContext, frame: R2Box): void {
    const viewPath = this.viewPath.value;
    if (viewPath !== null && viewPath.isDefined()) {
      const stroke = this.stroke.value;
      const strokeWidth = this.strokeWidth.value;
      if (stroke !== null && strokeWidth !== null) {
        // save
        const contextLineWidth = context.lineWidth;
        const contextStrokeStyle = context.strokeStyle;

        context.beginPath();
        viewPath.draw(context);

        const size = Math.min(frame.width, frame.height);
        context.lineWidth = strokeWidth.pxValue(size);
        context.strokeStyle = stroke.toString();
        context.stroke();

        // restore
        context.lineWidth = contextLineWidth;
        context.strokeStyle = contextStrokeStyle;
      }
    }
  }

  protected override hitTest(x: number, y: number): GraphicsView | null {
    const renderer = this.renderer.value;
    if (renderer instanceof CanvasRenderer) {
      const p = renderer.transform.transform(x, y);
      return this.hitTestLine(p.x, p.y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestLine(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    const viewPath = this.viewPath.value;
    if (viewPath !== null && viewPath.isDefined()) {
      if (this.stroke.value !== null) {
        // save
        const contextLineWidth = context.lineWidth;

        context.beginPath();
        viewPath.draw(context);

        let hitWidth = this.hitWidth.getValueOr(0);
        const strokeWidth = this.strokeWidth.value;
        if (strokeWidth !== null) {
          const size = Math.min(frame.width, frame.height);
          hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
        }
        context.lineWidth = hitWidth;
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

  override init(init: GeoLineViewInit): void {
    super.init(init);
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
}
