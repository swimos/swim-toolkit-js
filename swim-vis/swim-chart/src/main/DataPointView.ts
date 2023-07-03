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

import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import type {Instance} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import {R2Point} from "@swim/math";
import type {R2Box} from "@swim/math";
import type {AnyFont} from "@swim/style";
import {Font} from "@swim/style";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import {ThemeAnimator} from "@swim/theme";
import type {AnyView} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import type {GraphicsViewInit} from "@swim/graphics";
import type {GraphicsViewObserver} from "@swim/graphics";
import {GraphicsView} from "@swim/graphics";
import type {CanvasContext} from "@swim/graphics";
import {CanvasRenderer} from "@swim/graphics";
import {TypesetView} from "@swim/graphics";
import {TextRunView} from "@swim/graphics";

/** @public */
export type DataPointCategory = "flat" | "increasing" | "decreasing" | "maxima" | "minima";

/** @public */
export type DataPointLabelPlacement = "auto" | "above" | "middle" | "below";

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
export interface DataPointViewObserver<X = unknown, Y = unknown, V extends DataPointView<X, Y> = DataPointView<X, Y>> extends GraphicsViewObserver<V> {
  viewDidSetX?(x: X | undefined, view: V): void;

  viewDidSetY?(y: Y | undefined, view: V): void;

  viewDidSetY2?(y2: Y | undefined, view: V): void;

  viewDidSetRadius?(radius: Length | null, view: V): void;

  viewDidSetColor?(color: Color | null, view: V): void;

  viewDidSetOpacity?(opacity: number | undefined, view: V): void;

  viewWillAttachLabel?(labelView: GraphicsView, view: V): void;

  viewDidDetachLabel?(labelView: GraphicsView | null, view: V): void;
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

  declare readonly observerType?: Class<DataPointViewObserver<X, Y>>;

  readonly xCoord: number;

  /** @internal */
  setXCoord(xCoord: number): void {
    (this as Mutable<this>).xCoord = xCoord;
  }

  readonly yCoord: number;

  /** @internal */
  setYCoord(yCoord: number): void {
    (this as Mutable<this>).yCoord = yCoord;
  }

  readonly y2Coord: number | undefined;

  /** @internal */
  setY2Coord(y2Coord: number | undefined): void {
    (this as Mutable<this>).y2Coord = y2Coord;
  }

  @Animator({
    didSetValue(x: X | undefined, oldX: X | undefined): void {
      this.owner.callObservers("viewDidSetX", x, this.owner);
    },
  })
  readonly x!: Animator<this, X | undefined>;

  @Animator({
    didSetValue(y: Y | undefined, oldY: Y | undefined): void {
      this.owner.callObservers("viewDidSetY", y, this.owner);
    },
  })
  readonly y!: Animator<this, Y | undefined>;

  @Animator({
    didSetValue(y2: Y | undefined, oldY2: Y | undefined): void {
      this.owner.callObservers("viewDidSetY2", y2, this.owner);
    },
  })
  get y2(): Animator<this, Y | undefined> {
    return Animator.dummy();
  }

  @ThemeAnimator({
    valueType: Length,
    value: null,
    didSetValue(radius: Length | null): void {
      this.owner.callObservers("viewDidSetRadius", radius, this.owner);
    },
  })
  get radius(): ThemeAnimator<this, Length | null, AnyLength | null> {
    return ThemeAnimator.dummy();
  }

  @Property({valueType: Number, value: 5})
  get hitRadius(): Property<this, number> {
    return Property.dummy();
  }

  @ThemeAnimator({
    valueType: Color,
    value: null,
    didSetValue(color: Color | null): void {
      this.owner.updateGradientStop();
      this.owner.callObservers("viewDidSetColor", color, this.owner);
    },
  })
  get color(): ThemeAnimator<this, Color | null, AnyColor | null> {
    return ThemeAnimator.dummy();
  }

  @ThemeAnimator({
    valueType: Number,
    didSetValue(opacity: number | undefined): void {
      this.owner.updateGradientStop();
      this.owner.callObservers("viewDidSetOpacity", opacity, this.owner);
    },
  })
  get opacity(): ThemeAnimator<this, number | undefined> {
    return ThemeAnimator.dummy();
  }

  @ThemeAnimator({valueType: Font, inherits: true})
  get font(): ThemeAnimator<this, Font | undefined, AnyFont | undefined> {
    return ThemeAnimator.dummy();
  }

  @ThemeAnimator({valueType: Color, inherits: true})
  get textColor(): ThemeAnimator<this, Color | undefined, AnyColor | undefined> {
    return ThemeAnimator.dummy();
  }

  @Property({valueType: String})
  get category(): Property<this, DataPointCategory> {
    return Property.dummy();
  }

  @ThemeAnimator({valueType: Length, value: Length.zero(), updateFlags: View.NeedsLayout})
  get labelPadding(): ThemeAnimator<this, Length, AnyLength> {
    return ThemeAnimator.dummy();
  }

  @ViewRef({
    viewType: TextRunView,
    viewKey: true,
    binds: true,
    willAttachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewWillAttachLabel", labelView, this.owner);
    },
    didDetachView(labelView: GraphicsView): void {
      this.owner.callObservers("viewDidDetachLabel", labelView, this.owner);
    },
    setText(label: string | undefined): GraphicsView {
      let labelView = this.view;
      if (labelView === null) {
        labelView = this.createView();
        this.setView(labelView);
      }
      if (labelView instanceof TextRunView) {
        labelView.text(label !== void 0 ? label : "");
      }
      return labelView;
    },
  })
  readonly label!: ViewRef<this, GraphicsView> & {
    setText(label: string | undefined): GraphicsView,
  };

  @Property({valueType: String, value: "auto"})
  get labelPlacement(): Property<this, DataPointLabelPlacement> {
    return Property.dummy();
  }

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
    if (typeof point.label === "string") {
      this.label.setText(point.label);
    } else if (point.label !== void 0) {
      this.label.setView(point.label);
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

  protected override onLayout(): void {
    super.onLayout();
    this.layoutDataPoint(this.viewFrame);
  }

  protected layoutDataPoint(frame: R2Box): void {
    const labelView = ViewRef.tryView(this, "label");
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

    if (TypesetView[Symbol.hasInstance](labelView)) {
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

  protected override hitTest(x: number, y: number): GraphicsView | null {
    const renderer = this.renderer.value;
    if (renderer instanceof CanvasRenderer) {
      return this.hitTestPoint(x, y, renderer.context, this.viewFrame);
    }
    return null;
  }

  protected hitTestPoint(x: number, y: number, context: CanvasContext, frame: R2Box): GraphicsView | null {
    let hitRadius: number = Property.tryValue(this, "hitRadius");
    const radius = ThemeAnimator.tryValue(this, "radius");
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
