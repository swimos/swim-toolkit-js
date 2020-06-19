// Copyright 2015-2020 SWIM.AI inc.
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

import {AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/font";
import {Transition} from "@swim/transition";
import {TweenState} from "@swim/animate";
import {CanvasContext, CanvasRenderer} from "@swim/render";
import {
  ViewFlags,
  View,
  ViewAnimator,
  GraphicsViewContext,
  GraphicsViewInit,
  GraphicsView,
  GraphicsViewController,
  GraphicsNodeView,
} from "@swim/view";
import {AnyTextRunView, TextRunView} from "@swim/typeset";
import {TopTickView} from "./TopTickView";
import {RightTickView} from "./RightTickView";
import {BottomTickView} from "./BottomTickView";
import {LeftTickView} from "./LeftTickView";

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

  tickLabel?: GraphicsView | string | null;
}

export abstract class TickView<D> extends GraphicsNodeView {
  /** @hidden */
  readonly _value: D;
  /** @hidden */
  _offset: number;
  /** @hidden */
  _offset0: number;
  /** @hidden */
  _state: TickState;
  /** @hidden */
  _preserve: boolean;

  constructor(value: D) {
    super();
    this._value = value;
    this._offset = 0;
    this._offset0 = NaN;
    this._state = TickState.Excluded;
    this._preserve = true;
    this.opacity.interpolate = TickView.interpolateOpacity;
  }

  get viewController(): GraphicsViewController<TickView<D>> | null {
    return this._viewController;
  }

  abstract get orientation(): TickOrientation;

  get value(): D {
    return this._value;
  }

  @ViewAnimator(PointR2, {value: PointR2.origin()})
  anchor: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator(Number, {value: 1})
  opacity: ViewAnimator<this, number>;

  @ViewAnimator(Number, {inherit: true})
  tickMarkSpacing: ViewAnimator<this, number>;

  @ViewAnimator(Color, {inherit: true})
  tickMarkColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Number, {inherit: true})
  tickMarkWidth: ViewAnimator<this, number>;

  @ViewAnimator(Number, {inherit: true})
  tickMarkLength: ViewAnimator<this, number>;

  @ViewAnimator(Number, {inherit: true})
  tickLabelPadding: ViewAnimator<this, number>;

  @ViewAnimator(Color, {inherit: true})
  gridLineColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Number, {inherit: true})
  gridLineWidth: ViewAnimator<this, number>;

  @ViewAnimator(Font, {inherit: true})
  font: ViewAnimator<this, Font, AnyFont>;

  @ViewAnimator(Color, {inherit: true})
  textColor: ViewAnimator<this, Color, AnyColor>;

  tickLabel(): GraphicsView | null;
  tickLabel(tickLabel: GraphicsView | AnyTextRunView | null): this;
  tickLabel(tickLabel?: GraphicsView | AnyTextRunView | null): GraphicsView | null | this {
    if (tickLabel === void 0) {
      const childView = this.getChildView("tickLabel");
      return childView instanceof GraphicsView ? childView : null;
    } else {
      if (tickLabel !== null && !(tickLabel instanceof GraphicsView)) {
        tickLabel = TextRunView.fromAny(tickLabel);
      }
      this.setChildView("tickLabel", tickLabel);
      return this;
    }
  }

  preserve(): boolean;
  preserve(preserve: boolean): this;
  preserve(preserve?: boolean): this | boolean {
    if (preserve === void 0) {
      return this._preserve;
    } else {
      this._preserve = preserve;
      return this;
    }
  }

  fadeIn(transition?: Transition<any>): void {
    if (this._state === TickState.Excluded || this._state === TickState.Leaving) {
      this.opacity.setState(1, transition);
      this._state = TickState.Entering;
    }
  }

  fadeOut(transition?: Transition<any>): void {
    if (this._state === TickState.Entering || this._state === TickState.Included) {
      this.opacity.setState(0, transition);
      this._state = TickState.Leaving;
    }
  }

  protected modifyUpdate(updateFlags: ViewFlags): ViewFlags {
    let additionalFlags = 0;
    if ((updateFlags & View.NeedsAnimate) !== 0) {
      additionalFlags |= View.NeedsAnimate;
    }
    additionalFlags |= super.modifyUpdate(updateFlags | additionalFlags);
    return additionalFlags;
  }

  needsProcess(processFlags: ViewFlags, viewContext: GraphicsViewContext): ViewFlags {
    if ((processFlags & View.NeedsLayout) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected onAnimate(viewContext: GraphicsViewContext): void {
    super.onAnimate(viewContext);
    const tickLabel = this.tickLabel();
    if (tickLabel !== null) {
      this.layoutTickLabel(tickLabel);
    }

    // We don't need to run the layout phase unless the view frame changes
    // between now and the display pass.
    this._viewFlags &= ~View.NeedsLayout;
  }

  protected onLayout(viewContext: GraphicsViewContext): void {
    super.onLayout(viewContext);
    const tickLabel = this.tickLabel();
    if (tickLabel !== null) {
      this.layoutTickLabel(tickLabel);
    }
  }

  protected willRender(viewContext: GraphicsViewContext): void {
    super.willRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const context = renderer.context;
      context.save();
    }
  }

  protected onRender(viewContext: GraphicsViewContext): void {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.globalAlpha = this.opacity.value!;
      this.renderTick(context, this.viewFrame);
    }
  }

  protected didRender(viewContext: GraphicsViewContext): void {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      const context = renderer.context;
      context.restore();
    }
    super.didRender(viewContext);
  }

  protected abstract layoutTickLabel(tickLabel: GraphicsView): void;

  protected abstract renderTick(context: CanvasContext, frame: BoxR2): void;

  private static interpolateOpacity<D>(this: ViewAnimator<TickView<D>, number>, u: number): number {
    // Interpolate over max of time and distance translated
    const view = this._view;
    const offset = view._offset;
    if (isNaN(view._offset0)) {
      view._offset0 = offset;
    }
    const tickSpacing = view.tickMarkSpacing.value! / 2;
    const v = Math.min(Math.abs(offset - view._offset0) / tickSpacing, 1);
    const opacity = this._interpolator!.interpolate(Math.max(u, v));
    if (u === 1 || v === 1) {
      this._tweenState = TweenState.Converged;
    }
    if (opacity === 0 && view._state === TickState.Leaving) {
      view._state = TickState.Excluded;
      view._offset0 = NaN;
      view.remove();
    } else if (opacity === 1 && view._state === TickState.Entering) {
      view._state = TickState.Included;
      view._offset0 = NaN;
    }
    return opacity;
  }

  static top<D>(value: D): TopTickView<D> {
    return new TickView.Top(value);
  }

  static right<D>(value: D): RightTickView<D> {
    return new TickView.Right(value);
  }

  static bottom<D>(value: D): BottomTickView<D> {
    return new TickView.Bottom(value);
  }

  static left<D>(value: D): LeftTickView<D> {
    return new TickView.Left(value);
  }

  static from<D>(value: D, orientation: TickOrientation): TickView<D> {
    if (orientation === "top") {
      return TickView.top(value);
    } else if (orientation === "right") {
      return TickView.right(value);
    } else if (orientation === "bottom") {
      return TickView.bottom(value);
    } else if (orientation === "left") {
      return TickView.left(value);
    } else {
      throw new TypeError(orientation);
    }
  }

  static fromAny<D>(tick: AnyTickView<D>, orientation?: TickOrientation): TickView<D> {
    if (tick instanceof TickView) {
      return tick;
    } else if (typeof tick === "object" && tick !== null) {
      return TickView.fromInit(tick, orientation);
    }
    throw new TypeError("" + tick);
  }

  static fromInit<D>(init: TickViewInit<D>, orientation?: TickOrientation): TickView<D> {
    if (init.orientation !== void 0) {
      orientation = init.orientation;
    }
    if (orientation === void 0) {
      throw new TypeError();
    }
    const view = TickView.from(init.value, orientation);

    if (init.tickMarkColor !== void 0) {
      view.tickMarkColor(init.tickMarkColor);
    }
    if (init.tickMarkWidth !== void 0) {
      view.tickMarkWidth(init.tickMarkWidth);
    }
    if (init.tickMarkLength !== void 0) {
      view.tickMarkLength(init.tickMarkLength);
    }
    if (init.tickLabelPadding !== void 0) {
      view.tickLabelPadding(init.tickLabelPadding);
    }

    if (init.gridLineColor !== void 0) {
      view.gridLineColor(init.gridLineColor);
    }
    if (init.gridLineWidth !== void 0) {
      view.gridLineWidth(init.gridLineWidth);
    }

    if (init.font !== void 0) {
      view.font(init.font);
    }
    if (init.textColor !== void 0) {
      view.textColor(init.textColor);
    }

    if (init.tickLabel !== void 0) {
      view.tickLabel(init.tickLabel);
    }

    if (init.hidden !== void 0) {
      view.setHidden(init.hidden);
    }
    if (init.culled !== void 0) {
      view.setCulled(init.culled);
    }

    return view;
  }

  // Forward type declarations
  /** @hidden */
  static Top: typeof TopTickView; // defined by TopTickView
  /** @hidden */
  static Right: typeof RightTickView; // defined by RightTickView
  /** @hidden */
  static Bottom: typeof BottomTickView; // defined by BottomTickView
  /** @hidden */
  static Left: typeof LeftTickView; // defined by LeftTickView
}
