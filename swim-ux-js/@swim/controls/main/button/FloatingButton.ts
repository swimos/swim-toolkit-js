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

import {AnyTiming, Timing} from "@swim/mapping";
import {Length, Angle, Transform} from "@swim/math";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewObserverType,
  ViewAnimator,
  ViewFastener,
  PositionGestureInput,
  PositionGestureDelegate,
} from "@swim/view";
import {Graphics, HtmlIconView} from "@swim/graphics";
import {ButtonMembrane} from "./ButtonMembrane";

export type FloatingButtonType = "regular" | "mini";

export class FloatingButton extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "buttonType", {
      value: "regular",
      enumerable: true,
      configurable: true,
    });
    this.iconCount = 0;
    this.icon = null;
    this.initButton();
  }

  protected initButton(): void {
    this.addClass("floating-button");
    this.position.setAutoState("relative");
    if (this.buttonType === "regular") {
      this.width.setAutoState(56);
      this.height.setAutoState(56);
    } else if (this.buttonType === "mini") {
      this.width.setAutoState(40);
      this.height.setAutoState(40);
    }
    this.borderTopLeftRadius.setAutoState(Length.pct(50));
    this.borderTopRightRadius.setAutoState(Length.pct(50));
    this.borderBottomLeftRadius.setAutoState(Length.pct(50));
    this.borderBottomRightRadius.setAutoState(Length.pct(50));
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  declare readonly buttonType: FloatingButtonType;

  setButtonType(buttonType: FloatingButtonType): void {
    if (this.buttonType !== buttonType) {
      Object.defineProperty(this, "buttonType", {
        value: buttonType,
        enumerable: true,
        configurable: true,
      });
      if (buttonType === "regular") {
        this.width.setAutoState(56);
        this.height.setAutoState(56);
      } else if (buttonType === "mini") {
        this.width.setAutoState(40);
        this.height.setAutoState(40);
      }
    }
  }

  /** @hidden */
  static IconFastener = ViewFastener.define<FloatingButton, HtmlIconView, never, ViewObserverType<HtmlIconView> & {iconIndex: number}>({
    extends: void 0,
    type: HtmlIconView,
    child: false,
    observe: true,
    iconIndex: 0,
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, iconView: HtmlIconView): void {
      const iconColor = theme.getOr(Look.backgroundColor, mood, null);
      iconView.iconColor.setState(iconColor, timing);
    },
    viewDidAnimate(viewContext: ViewContext, iconView: HtmlIconView): void {
      if (!iconView.opacity.isAnimating() && this.iconIndex !== this.owner.iconCount) {
        iconView.remove();
        if (this.iconIndex > this.owner.iconCount) {
          this.owner.setViewFastener(this.key!, null);
        }
      }
    },
  });

  /** @hidden */
  iconCount: number;

  icon: ViewFastener<this, HtmlIconView> | null;

  pushIcon(icon: Graphics, timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconCount = this.iconCount;
    const oldIconKey = "icon" + oldIconCount;
    const oldIconFastener = this.getViewFastener(oldIconKey) as ViewFastener<this, HtmlIconView> | null;
    const oldIconView = oldIconFastener !== null ? oldIconFastener.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.transform.setAutoState(Transform.rotate(Angle.deg(90)), timing);
      } else {
        oldIconView.remove();
      }
    }

    const newIconCount = oldIconCount + 1;
    const newIconKey = "icon" + newIconCount;
    const newIconFastener = new FloatingButton.IconFastener(this, newIconKey, newIconKey);
    newIconFastener.iconIndex = newIconCount;
    const newIconView = HtmlIconView.create();
    newIconView.position.setAutoState("absolute");
    newIconView.left.setAutoState(0);
    newIconView.top.setAutoState(0);
    newIconView.width.setAutoState(this.width.state);
    newIconView.height.setAutoState(this.height.state);
    newIconView.opacity.setAutoState(0);
    newIconView.opacity.setAutoState(1, timing);
    newIconView.transform.setAutoState(Transform.rotate(Angle.deg(-90)));
    newIconView.transform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
    newIconView.pointerEvents.setAutoState("none");
    newIconView.iconWidth.setAutoState(24);
    newIconView.iconHeight.setAutoState(24);
    newIconView.iconColor.setAuto(false);
    newIconView.graphics.setAutoState(icon);
    newIconFastener.setView(newIconView);
    this.setViewFastener(newIconKey, newIconFastener);
    this.appendChildView(newIconView, newIconKey);

    this.iconCount = newIconCount;
    this.icon = newIconFastener;
  }

  popIcon(timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconCount = this.iconCount;
    const oldIconKey = "icon" + oldIconCount;
    const oldIconFastener = this.getViewFastener(oldIconKey) as ViewFastener<this, HtmlIconView> | null;
    const oldIconView = oldIconFastener !== null ? oldIconFastener.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.transform.setAutoState(Transform.rotate(Angle.deg(-90)), timing);
      } else {
        oldIconView.remove();
      }
    }

    const newIconCount = oldIconCount - 1;
    const newIconKey = "icon" + newIconCount;
    const newIconFastener = this.getViewFastener(newIconKey) as ViewFastener<this, HtmlIconView> | null;
    const newIconView = newIconFastener !== null ? newIconFastener.view : null;
    if (newIconView !== null) {
      newIconView.opacity.setAutoState(1, timing);
      newIconView.transform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
      this.appendChildView(newIconView, newIconKey);
    }

    this.iconCount = newIconCount;
    this.icon = newIconFastener;
  }

  @ViewAnimator({type: Number, inherit: true})
  declare stackPhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);

    this.backgroundColor.setAutoState(theme.getOr(Look.accentColor, mood, null), timing);

    let shadow = theme.getOr(Look.shadow, Mood.floating, null);
    if (shadow !== null) {
      const shadowColor = shadow.color;
      const stackPhase = this.stackPhase.getValueOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * stackPhase));
    }
    this.boxShadow.setAutoState(shadow, timing);
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);

    let shadow = this.getLookOr(Look.shadow, Mood.floating, null);
    if (shadow !== null) {
      const shadowColor = shadow.color;
      const stackPhase = this.stackPhase.getValueOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * stackPhase));
    }
    this.boxShadow.setAutoState(shadow);
  }

  didStartHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, 1]);
    if (this.backgroundColor.isAuto()) {
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(this.getLookOr(Look.accentColor, null), timing);
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(this.getLookOr(Look.accentColor, null), timing);
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    // nop
  }
}
