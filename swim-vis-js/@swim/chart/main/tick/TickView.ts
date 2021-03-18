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
import {AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {ViewContextType, ViewAnimator, ViewFastener} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  LayerView,
  CanvasContext,
  CanvasRenderer,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";
import {TopTickView} from "../"; // forward import
import {RightTickView} from "../"; // forward import
import {BottomTickView} from "../"; // forward import
import {LeftTickView} from "../"; // forward import

/** @hidden */
export const enum TickState {
  Excluded,
  Entering,
  Included,
  Leaving,
}

export type TickOrientation = "top" | "right" | "bottom" | "left";

export type AnyTickView<D> = TickView<D> | TickViewInit<D>;

export interface TickViewInit<D> extends GraphicsViewInit {
  value: D;
  orientation?: TickOrientation;

  tickMarkColor?: AnyColor;
  tickMarkWidth?: number;
  tickMarkLength?: number;
  tickLabelPadding?: number;

  gridLineColor?: AnyColor;
  gridLineWidth?: number;

  font?: AnyFont;
  textColor?: AnyColor;

  label?: GraphicsView | string | null;
}

export abstract class TickView<D> extends LayerView {
  constructor(value: D) {
    super();
    Object.defineProperty(this, "value", {
      value: value,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "offset", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    //Object.defineProperty(this, "offset0", {
    //  value: NaN,
    //  enumerable: true,
    //  configurable: true,
    //});
    Object.defineProperty(this, "tickState", {
      value: TickState.Excluded,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "preserved", {
      value: true,
      enumerable: true,
      configurable: true,
    });
    //this.opacity.interpolator = TickView.interpolateOpacity;
  }

  initView(init: TickViewInit<D>): void {
    super.initView(init);
    if (init.tickMarkColor !== void 0) {
      this.tickMarkColor(init.tickMarkColor);
    }
    if (init.tickMarkWidth !== void 0) {
      this.tickMarkWidth(init.tickMarkWidth);
    }
    if (init.tickMarkLength !== void 0) {
      this.tickMarkLength(init.tickMarkLength);
    }
    if (init.tickLabelPadding !== void 0) {
      this.tickLabelPadding(init.tickLabelPadding);
    }

    if (init.gridLineColor !== void 0) {
      this.gridLineColor(init.gridLineColor);
    }
    if (init.gridLineWidth !== void 0) {
      this.gridLineWidth(init.gridLineWidth);
    }

    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }

    if (init.label !== void 0) {
      this.label(init.label);
    }
  }

  abstract readonly orientation: TickOrientation;

  declare readonly value: D;

  /** @hidden */
  declare readonly offset: number;

  /** @hidden */
  setOffset(offset: number): void {
    Object.defineProperty(this, "offset", {
      value: offset,
      enumerable: true,
      configurable: true,
    });
  }

  ///** @hidden */
  //declare readonly offset0: number;

  /** @hidden */
  declare readonly tickState: TickState;

  @ViewAnimator({type: PointR2, state: PointR2.origin()})
  declare anchor: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Number, state: 1})
  declare opacity: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, inherit: true})
  declare tickMarkSpacing: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare tickMarkColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare tickMarkWidth: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare tickMarkLength: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare tickLabelPadding: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare gridLineColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare gridLineWidth: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  protected initLabel(labelView: GraphicsView): void {
    // hook
  }

  protected willSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    // hook
  }

  protected onSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (newLabelView !== null) {
      this.initLabel(newLabelView);
    }
  }

  protected didSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    // hook
  }

  @ViewFastener<TickView<D>, GraphicsView, AnyTextRunView>({
    key: true,
    type: TextRunView,
    fromAny(value: GraphicsView | AnyTextRunView): GraphicsView {
      if (value instanceof GraphicsView) {
        return value;
      } else if (typeof value === "string" && this.view instanceof TextRunView) {
        this.view.text(value);
        return this.view;
      } else {
        return TextRunView.fromAny(value);
      }
    },
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetLabel(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetLabel(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetLabel(newLabelView, oldLabelView);
    },
  })
  declare label: ViewFastener<this, GraphicsView, AnyTextRunView>;

  /** @hidden */
  declare readonly preserved: boolean;

  preserve(): boolean;
  preserve(preserve: boolean): this;
  preserve(preserve?: boolean): this | boolean {
    if (preserve === void 0) {
      return this.preserved;
    } else {
      Object.defineProperty(this, "preserved", {
        value: preserve,
        enumerable: true,
        configurable: true,
      });
      return this;
    }
  }

  fadeIn(timing?: Timing | boolean): void {
    if (this.tickState === TickState.Excluded || this.tickState === TickState.Leaving) {
      this.opacity.setState(1, timing);
      Object.defineProperty(this, "tickState", {
        value: TickState.Entering,
        enumerable: true,
        configurable: true,
      });
    }
  }

  fadeOut(timing?: Timing | boolean): void {
    if (this.tickState === TickState.Entering || this.tickState === TickState.Included) {
      this.opacity.setState(0, timing);
      Object.defineProperty(this, "tickState", {
        value: TickState.Leaving,
        enumerable: true,
        configurable: true,
      });
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const labelView = this.label.view;
    if (labelView !== null) {
      this.layoutLabel(labelView);
    }
  }

  protected willRender(viewContext: ViewContextType<this>): void {
    super.willRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const context = renderer.context;
      context.save();
    }
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.globalAlpha = this.opacity.getValue();
      this.renderTick(context, this.viewFrame);
    }
  }

  protected didRender(viewContext: ViewContextType<this>): void {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const context = renderer.context;
      context.restore();
    }
    super.didRender(viewContext);
  }

  protected abstract layoutLabel(labelView: GraphicsView): void;

  protected abstract renderTick(context: CanvasContext, frame: BoxR2): void;

  //private static interpolateOpacity<D>(this: ViewAnimator<TickView<D>, number>, u: number): number {
  //  // Interpolate over max of time and distance translated
  //  const view = this.owner;
  //  const offset = view.offset;
  //  if (isNaN(view.offset0)) {
  //    Object.defineProperty(this, "offset0", {
  //      value: offset,
  //      enumerable: true,
  //      configurable: true,
  //    });
  //  }
  //  const tickSpacing = view.tickMarkSpacing.getValue() / 2;
  //  const v = Math.min(Math.abs(offset - view.offset0) / tickSpacing, 1);
  //  const opacity = this.interpolator!(Math.max(u, v));
  //  if (u === 1 || v === 1) {
  //    this.setAnimatorFlags(this.animatorFlags & ~Animator.AnimatingFlag);
  //  }
  //  if (opacity === 0 && view.tickState === TickState.Leaving) {
  //    Object.defineProperty(view, "tickState", {
  //      value: TickState.Excluded,
  //      enumerable: true,
  //      configurable: true,
  //    });
  //    Object.defineProperty(view, "offset0", {
  //      value: NaN,
  //      enumerable: true,
  //      configurable: true,
  //    });
  //    view.remove();
  //  } else if (opacity === 1 && view.tickState === TickState.Entering) {
  //    Object.defineProperty(view, "tickState", {
  //      value: TickState.Included,
  //      enumerable: true,
  //      configurable: true,
  //    });
  //    Object.defineProperty(view, "offset0", {
  //      value: NaN,
  //      enumerable: true,
  //      configurable: true,
  //    });
  //  }
  //  return opacity;
  //}

  static top<D>(value: D): TopTickView<D> {
    return new TopTickView(value);
  }

  static right<D>(value: D): RightTickView<D> {
    return new RightTickView(value);
  }

  static bottom<D>(value: D): BottomTickView<D> {
    return new BottomTickView(value);
  }

  static left<D>(value: D): LeftTickView<D> {
    return new LeftTickView(value);
  }

  static from<D>(value: D, orientation: TickOrientation): TickView<D> {
    if (orientation === "top") {
      return this.top(value);
    } else if (orientation === "right") {
      return this.right(value);
    } else if (orientation === "bottom") {
      return this.bottom(value);
    } else if (orientation === "left") {
      return this.left(value);
    } else {
      throw new TypeError(orientation);
    }
  }

  static fromInit<D>(init: TickViewInit<D>, orientation?: TickOrientation): TickView<D> {
    if (init.orientation !== void 0) {
      orientation = init.orientation;
    }
    if (orientation === void 0) {
      throw new TypeError();
    }
    const view = this.from(init.value, orientation);
    view.initView(init);
    return view;
  }

  static fromAny<D>(value: AnyTickView<D>, orientation?: TickOrientation): TickView<D> {
    if (value instanceof TickView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value, orientation);
    }
    throw new TypeError("" + value);
  }
}
