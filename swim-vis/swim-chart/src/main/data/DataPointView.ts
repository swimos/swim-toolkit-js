// Copyright 2015-2022 Swim.inc
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

import type {Mutable, Class, Instance, Initable, AnyTiming} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef, AnimatorDef} from "@swim/component";
import {AnyLength, Length, R2Point, R2Box} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, AnyView, View, ViewRefDef} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  CanvasContext,
  CanvasRenderer,
  TypesetView,
  TextRunView,
} from "@swim/graphics";
import type {DataPointCategory, DataPointLabelPlacement} from "./DataPoint";
import type {DataPointViewObserver} from "./DataPointViewObserver";

/** @public */
export type AnyDataPointView<X = unknown, Y = unknown> = DataPointView<X, Y> | DataPointViewInit<X, Y>;

/** @public */
export interface DataPointViewInit<X = unknown, Y = unknown> extends GraphicsViewInit {
  x: X;
  y: Y;
  y2?: Y;
  radius?: AnyLength;
  hitRadius?: number;

  color?: AnyColor;
  opacity?: number;

  font?: AnyFont;
  textColor?: AnyColor;

  category?: DataPointCategory;

  labelPadding?: AnyLength;
  labelPlacement?: DataPointLabelPlacement;
  label?: GraphicsView | string;
}

/** @public */
export class DataPointView<X = unknown, Y = unknown> extends GraphicsView {
  constructor() {
    super();
    this.xCoord = NaN;
    this.yCoord = NaN;
    this.y2Coord = void 0;
    this.gradientStop = false;
  }

  override readonly observerType?: Class<DataPointViewObserver<X, Y>>;

  readonly xCoord: number

  /** @internal */
  setXCoord(xCoord: number): void {
    (this as Mutable<this>).xCoord = xCoord;
  }

  readonly yCoord: number

  /** @internal */
  setYCoord(yCoord: number): void {
    (this as Mutable<this>).yCoord = yCoord;
  }

  readonly y2Coord: number | undefined;

  /** @internal */
  setY2Coord(y2Coord: number | undefined): void {
    (this as Mutable<this>).y2Coord = y2Coord;
  }

  @AnimatorDef<DataPointView<X, Y>["x"]>({
    didSetValue(x: X | undefined, oldX: X | undefined): void {
      this.owner.callObservers("viewDidSetX", x, this.owner);
    },
  })
  readonly x!: AnimatorDef<this, {value: X | undefined}>;

  @AnimatorDef<DataPointView<X, Y>["y"]>({
    didSetValue(y: Y | undefined, oldY: Y | undefined): void {
      this.owner.callObservers("viewDidSetY", y, this.owner);
    },
  })
  readonly y!: AnimatorDef<this, {value: Y | undefined}>;

  @AnimatorDef<DataPointView<X, Y>["y2"]>({
    didSetValue(y2: Y | undefined, oldY2: Y | undefined): void {
      this.owner.callObservers("viewDidSetY2", y2, this.owner);
    },
  })
  readonly y2!: AnimatorDef<this, {value: Y | undefined}>;

  @ThemeAnimatorDef<DataPointView<X, Y>["radius"]>({
    valueType: Length,
    value: null,
    didSetValue(radius: Length | null): void {
      this.owner.callObservers("viewDidSetRadius", radius, this.owner);
    },
  })
  readonly radius!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @PropertyDef({valueType: Number, value: 5})
  readonly hitRadius!: PropertyDef<this, {value: number}>;

  @ThemeAnimatorDef<DataPointView<X, Y>["color"]>({
    valueType: Color,
    value: null,
    didSetValue(color: Color | null): void {
      this.owner.updateGradientStop();
      this.owner.callObservers("viewDidSetColor", color, this.owner);
    },
  })
  readonly color!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef<DataPointView<X, Y>["opacity"]>({
    valueType: Number,
    didSetValue(opacity: number | undefined): void {
      this.owner.updateGradientStop();
      this.owner.callObservers("viewDidSetOpacity", opacity, this.owner);
    },
  })
  readonly opacity!: ThemeAnimatorDef<this, {value: number | undefined}>;

  @ThemeAnimatorDef({valueType: Font, inherits: true})
  readonly font!: ThemeAnimatorDef<this, {value: Font | undefined, valueInit: AnyFont | undefined}>;

  @ThemeAnimatorDef({valueType: Color, inherits: true})
  readonly textColor!: ThemeAnimatorDef<this, {value: Color | undefined, valueInit: AnyColor | undefined}>;

  @PropertyDef({valueType: String})
  readonly category!: PropertyDef<this, {value: DataPointCategory | undefined}>;

  @ThemeAnimatorDef({valueType: Length, value: Length.zero(), updateFlags: View.NeedsLayout})
  readonly labelPadding!: ThemeAnimatorDef<this, {value: Length, valueInit: AnyLength}>;

  @ViewRefDef<DataPointView<X, Y>["label"]>({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    willAttachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachLabel", labelView, this.owner);
    },
    didDetachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachLabel", labelView, this.owner);
    },
    fromAny(value: AnyView<GraphicsView> | string): GraphicsView {
      if (typeof value === "string") {
        if (this.view instanceof TextRunView) {
          this.view.text(value);
          return this.view;
        } else {
          return TextRunView.fromAny(value);
        }
      } else {
        return GraphicsView.fromAny(value);
      }
    },
  })
  readonly label!: ViewRefDef<this, {
    view: GraphicsView & Initable<GraphicsViewInit | string>,
  }>;
  static readonly label: FastenerClass<DataPointView["label"]>;

  @PropertyDef({valueType: String, value: "auto"})
  readonly labelPlacement!: PropertyDef<this, {value: DataPointLabelPlacement}>;

  setState(point: DataPointViewInit<X, Y>, timing?: AnyTiming | boolean): void {
    if (point.x !== void 0) {
      this.x(point.x, timing);
    }
    if (point.y !== void 0) {
      this.y(point.y, timing);
    }
    if (point.y2 !== void 0) {
      this.y2(point.y2, timing);
    }
    if (point.radius !== void 0) {
      this.radius(point.radius, timing);
    }
    if (point.hitRadius !== void 0) {
      this.hitRadius(point.hitRadius);
    }

    if (point.color !== void 0) {
      this.color(point.color, timing);
    }
    if (point.opacity !== void 0) {
      this.opacity(point.opacity, timing);
    }

    if (point.font !== void 0) {
      this.font(point.font, timing);
    }
    if (point.textColor !== void 0) {
      this.textColor(point.textColor, timing);
    }

    if (point.category !== void 0) {
      this.category(point.category);
    }

    if (point.labelPadding !== void 0) {
      this.labelPadding(point.labelPadding, timing);
    }
    if (point.labelPlacement !== void 0) {
      this.labelPlacement(point.labelPlacement);
    }
    if (point.label !== void 0) {
      this.label(point.label);
    }
  }

  /** @internal */
  readonly gradientStop: boolean;

  isGradientStop(): boolean {
    return this.gradientStop;
  }

  protected updateGradientStop(): void {
    (this as Mutable<this>).gradientStop = this.color.value !== null || this.opacity.value !== void 0;
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutDataPoint(this.viewFrame);
  }

  protected layoutDataPoint(frame: R2Box): void {
    const labelView = this.label.view;
    if (labelView !== null) {
      this.layoutLabel(labelView, frame);
    }
  }

  protected layoutLabel(labelView: GraphicsView, frame: R2Box): void {
    let placement = this.labelPlacement.value;
    if (placement !== "above" && placement !== "below" && placement !== "middle") {
      const category = this.category.value;
      if (category === "increasing" || category === "maxima") {
        placement = "above";
      } else if (category === "decreasing" || category === "minima") {
        placement = "below";
      } else {
        placement = "above";
      }
    }

    const x = this.xCoord;
    const y0 = this.yCoord;
    let y1 = y0;
    if (placement === "above") {
      y1 -= this.labelPadding.getValue().pxValue(Math.min(frame.width, frame.height));
    } else if (placement === "below") {
      y1 += this.labelPadding.getValue().pxValue(Math.min(frame.width, frame.height));
    }

    if (TypesetView.is(labelView)) {
      labelView.textAlign.setState("center", Affinity.Intrinsic);
      if (placement === "above") {
        labelView.textBaseline.setState("bottom", Affinity.Intrinsic);
      } else if (placement === "below") {
        labelView.textBaseline.setState("top", Affinity.Intrinsic);
      } else if (placement === "middle") {
        labelView.textBaseline.setState("middle", Affinity.Intrinsic);
      }
      labelView.textOrigin.setState(new R2Point(x, y1), Affinity.Intrinsic);
    }
  }

  protected override hitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      return this.hitTestPoint(x, y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestPoint(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    let hitRadius = this.hitRadius.value;
    const radius = this.radius.value;
    if (radius !== null) {
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

  override init(init: DataPointViewInit<X, Y>): void {
    super.init(init);
    this.setState(init);
  }

  static override fromAny<X, Y>(value: AnyDataPointView<X, Y>): DataPointView<X, Y>;
  static override fromAny<S extends Class<Instance<S, View>>>(this: S, value: AnyView<InstanceType<S>>): InstanceType<S>;
  static override fromAny<S extends Class<Instance<S, View>>>(this: S, value: AnyView<InstanceType<S>>): InstanceType<S> {
    return super.fromAny(value as any) as InstanceType<S>;
  }
}
