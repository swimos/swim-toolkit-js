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
import type {GeoPath} from "@swim/geo";
import {AnyColor, Color} from "@swim/style";
import {ViewContextType, View, ViewProperty, ViewAnimator} from "@swim/view";
import {
  GraphicsView,
  StrokeViewInit,
  StrokeView,
  CanvasContext,
  CanvasRenderer,
} from "@swim/graphics";
import type {GeoViewController} from "../geo/GeoViewController";
import {GeoPathViewInit, GeoPathView} from "./GeoPathView";
import type {GeoLineViewObserver} from "./GeoLineViewObserver";

export interface GeoLineViewInit extends GeoPathViewInit, StrokeViewInit {
  hitWidth?: number;
}

export class GeoLineView extends GeoPathView implements StrokeView {
  initView(init: GeoLineViewInit): void {
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

  declare readonly viewController: GeoViewController<GeoLineView> & GeoLineViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<GeoLineViewObserver>;

  protected willSetStroke(newStroke: Color | null, oldStroke: Color | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetStroke !== void 0) {
      viewController.viewWillSetStroke(newStroke, oldStroke, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetStroke !== void 0) {
        viewObserver.viewWillSetStroke(newStroke, oldStroke, this);
      }
    }
  }

  protected onSetStroke(newStroke: Color | null, oldStroke: Color | null): void {
    this.requireUpdate(View.NeedsRender);
  }

  protected didSetStroke(newStroke: Color | null, oldStroke: Color | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetStroke !== void 0) {
        viewObserver.viewDidSetStroke(newStroke, oldStroke, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetStroke !== void 0) {
      viewController.viewDidSetStroke(newStroke, oldStroke, this);
    }
  }

  @ViewAnimator<GeoLineView, Color | null, AnyColor | null>({
    type: Color,
    state: null,
    inherit: true,
    willSetValue(newStroke: Color | null, oldStroke: Color | null): void {
      this.owner.willSetStroke(newStroke, oldStroke);
    },
    didSetValue(newStroke: Color | null, oldStroke: Color | null): void {
      this.owner.onSetStroke(newStroke, oldStroke);
      this.owner.didSetStroke(newStroke, oldStroke);
    },
  })
  declare stroke: ViewAnimator<this, Color | null, AnyColor | null>;

  protected willSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetStrokeWidth !== void 0) {
      viewController.viewWillSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetStrokeWidth !== void 0) {
        viewObserver.viewWillSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
      }
    }
  }

  protected onSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    this.requireUpdate(View.NeedsRender);
  }

  protected didSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetStrokeWidth !== void 0) {
        viewObserver.viewDidSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetStrokeWidth !== void 0) {
      viewController.viewDidSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
    }
  }

  @ViewAnimator<GeoLineView, Length | null, AnyLength | null>({
    type: Length,
    state: null,
    inherit: true,
    willSetValue(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
      this.owner.willSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
    },
    didSetValue(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
      this.owner.onSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
      this.owner.didSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
    },
  })
  declare strokeWidth: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewProperty({type: Number})
  declare hitWidth: ViewProperty<this, number | undefined>;

  protected onSetGeoPath(newGeoPath: GeoPath, oldGeoPath: GeoPath): void {
    super.onSetGeoPath(newGeoPath, oldGeoPath);
    if (this.geoCentroid.takesPrecedence(View.Intrinsic)) {
      this.geoCentroid.setState(newGeoPath.centroid(), View.Intrinsic);
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
      if (stroke !== null && strokeWidth !== null) {
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
      if (this.stroke.value !== null) {
        let hitWidth = this.hitWidth.getStateOr(0);
        const strokeWidth = this.strokeWidth.value;
        if (strokeWidth !== null) {
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

  static create(): GeoLineView {
    return new GeoLineView();
  }

  static fromInit(init: GeoLineViewInit): GeoLineView {
    const view = new GeoLineView();
    view.initView(init);
    return view;
  }
}