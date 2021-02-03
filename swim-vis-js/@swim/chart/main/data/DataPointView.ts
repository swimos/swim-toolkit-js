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
import {AnyLength, Length, PointR2, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, ViewFlags, View, ViewScope, ViewAnimator} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  LayerView,
  CanvasContext,
  CanvasRenderer,
  TypesetView,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";
import type {DataPointCategory, DataPointLabelPlacement} from "./DataPoint";

export type AnyDataPointView<X, Y> = DataPointView<X, Y> | DataPointViewInit<X, Y>;

export interface DataPointViewInit<X, Y> extends GraphicsViewInit {
  x: X;
  y: Y;
  y2?: Y;
  r?: AnyLength;

  hitRadius?: number;

  category?: DataPointCategory;

  color?: AnyColor;
  opacity?: number;

  labelPadding?: AnyLength;
  labelPlacement?: DataPointLabelPlacement;

  font?: AnyFont;
  textColor?: AnyColor;

  label?: GraphicsView | string;
}

export class DataPointView<X, Y> extends LayerView {
  constructor(x: X, y: Y) {
    super();
    Object.defineProperty(this, "xCoord", {
      value: NaN,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "yCoord", {
      value: NaN,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "y2Coord", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "gradientStop", {
      value: false,
      enumerable: true,
      configurable: true,
    });
    this.x.setAutoState(x);
    this.y.setAutoState(y);
  }

  initView(init: DataPointViewInit<X, Y>): void {
    super.initView(init);
    this.setState(init);
  }

  declare readonly xCoord: number

  /** @hidden */
  setXCoord(xCoord: number): void {
    Object.defineProperty(this, "xCoord", {
      value: xCoord,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly yCoord: number

  /** @hidden */
  setYCoord(yCoord: number): void {
    Object.defineProperty(this, "yCoord", {
      value: yCoord,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly y2Coord: number | undefined;

  /** @hidden */
  setY2Coord(y2Coord: number | undefined): void {
    Object.defineProperty(this, "y2Coord", {
      value: y2Coord,
      enumerable: true,
      configurable: true,
    });
  }

  @ViewAnimator({type: Object})
  declare x: ViewAnimator<this, X | undefined>;

  @ViewAnimator({type: Object})
  declare y: ViewAnimator<this, Y | undefined>;

  @ViewAnimator({type: Object})
  declare y2: ViewAnimator<this, Y | undefined>;

  @ViewAnimator({type: Length})
  declare r: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, updateFlags: View.NeedsAnimate})
  declare color: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsAnimate})
  declare opacity: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length})
  declare labelPadding: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewScope({type: Number, state: 5})
  declare hitRadius: ViewScope<this, number>;

  @ViewScope({type: String})
  declare category: ViewScope<this, DataPointCategory | undefined>;

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

  @ViewScope({type: String, state: "auto"})
  declare labelPlacement: ViewScope<this, DataPointLabelPlacement>;

  setState(point: DataPointViewInit<X, Y>, timing?: AnyTiming | boolean): void {
    if (point.y2 !== void 0) {
      this.y2(point.y2, timing);
    }
    if (point.r !== void 0) {
      this.r(point.r, timing);
    }

    if (point.hitRadius !== void 0) {
      this.hitRadius(point.hitRadius);
    }

    if (point.category !== void 0) {
      this.category(point.category);
    }

    if (point.color !== void 0) {
      this.color(point.color, timing);
    }
    if (point.opacity !== void 0) {
      this.opacity(point.opacity, timing);
    }

    if (point.labelPadding !== void 0) {
      this.labelPadding(point.labelPadding, timing);
    }
    if (point.labelPlacement !== void 0) {
      this.labelPlacement(point.labelPlacement);
    }

    if (point.font !== void 0) {
      this.font(point.font, timing);
    }
    if (point.textColor !== void 0) {
      this.textColor(point.textColor, timing);
    }

    if (point.label !== void 0) {
      this.label(point.label);
    }
  }

  /** @hidden */
  declare readonly gradientStop: boolean;

  isGradientStop(): boolean {
    return this.gradientStop;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "label" && childView instanceof GraphicsView) {
      this.onInsertLabel(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    if (childView.key === "label" && childView instanceof GraphicsView) {
      this.onRemoveLabel(childView);
    }
  }

  protected onInsertLabel(label: GraphicsView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected onRemoveLabel(label: GraphicsView): void {
    // hook
  }

  protected onRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    super.onRequireUpdate(updateFlags, immediate);
    const parentView = this.parentView;
    if (parentView !== null) {
      parentView.requireUpdate(updateFlags & View.NeedsAnimate);
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    Object.defineProperty(this, "gradientStop", {
      value: this.color.value !== void 0 || this.opacity.value !== void 0,
      enumerable: true,
      configurable: true,
    });
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const label = this.label();
    if (label !== null) {
      this.layoutLabel(label, this.viewFrame);
    }
  }

  protected layoutLabel(label: GraphicsView, frame: BoxR2): void {
    let placement = this.labelPlacement.state;
    if (placement !== "above" && placement !== "below" && placement !== "middle") {
      const category = this.category.state;
      if (category === "increasing" || category === "maxima") {
        placement = "above";
      } else if (category === "decreasing" || category === "minima") {
        placement = "below";
      } else {
        placement = "above";
      }
    }

    const labelPadding = this.labelPadding.value;
    const padding = labelPadding !== void 0 ? labelPadding.pxValue(Math.min(frame.width, frame.height)) : 0;
    const x = this.xCoord;
    const y0 = this.yCoord;
    let y1 = y0;
    if (placement === "above") {
      y1 -= padding;
    } else if (placement === "below") {
      y1 += padding;
    }

    if (TypesetView.is(label)) {
      label.textAlign.setAutoState("center");
      if (placement === "above") {
        label.textBaseline.setAutoState("bottom");
      } else if (placement === "below") {
        label.textBaseline.setAutoState("top");
      } else if (placement === "middle") {
        label.textBaseline.setAutoState("middle");
      }
      label.textOrigin.setAutoState(new PointR2(x, y1));
    }
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

  protected hitTestPoint(x: number, y: number, context: CanvasContext, frame: BoxR2): GraphicsView | null {
    let hitRadius = this.hitRadius();
    const radius = this.r.value;
    if (radius !== void 0) {
      const size = Math.min(frame.width, frame.height);
      hitRadius = Math.max(hitRadius, radius.pxValue(size));
    }

    const dx = this.xCoord - x;
    const dy = this.yCoord - y;
    if (dx * dx + dy * dy < hitRadius * hitRadius) {
      return this;
    }
    return null;
  }

  static fromInit<X, Y>(init: DataPointViewInit<X, Y>): DataPointView<X, Y> {
    const view = new DataPointView(init.x, init.y);
    view.initView(init);
    return view;
  }

  static fromAny<X, Y>(value: AnyDataPointView<X, Y>): DataPointView<X, Y> {
    if (value instanceof DataPointView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static readonly insertChildFlags: ViewFlags = LayerView.insertChildFlags | View.NeedsAnimate;
  static readonly removeChildFlags: ViewFlags = LayerView.removeChildFlags | View.NeedsAnimate;
}
