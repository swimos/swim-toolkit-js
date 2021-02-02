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

import type {AnyTiming, Timing} from "@swim/mapping";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import {HtmlView, SvgView} from "@swim/dom";
import type {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {ButtonMorph} from "./ButtonMorph";
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
  }

  protected initNode(node: HTMLElement): void {
    super.initNode(node);
    this.addClass("floating-button");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.borderTopLeftRadius.setAutoState("50%");
    this.borderTopRightRadius.setAutoState("50%");
    this.borderBottomLeftRadius.setAutoState("50%");
    this.borderBottomRightRadius.setAutoState("50%");
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
      this.requireUpdate(View.NeedsChange);
    }
  }

  get morph(): ButtonMorph | null {
    const childView = this.getChildView("morph");
    return childView instanceof ButtonMorph ? childView : null;
  }

  get icon(): HtmlView | SvgView | null {
    const morph = this.morph;
    return morph !== null ? morph.icon : null;
  }

  setIcon(icon: HtmlView | SvgView | null, timing?: AnyTiming | boolean, ccw: boolean = false): void {
    let morph = this.morph;
    if (morph === null) {
      morph = this.append(ButtonMorph, "morph");
    }
    if (icon instanceof SvgView) {
      icon.fill.setAutoState(this.getLook(Look.backgroundColor), timing);
    }
    morph.setIcon(icon, timing, ccw);
  }

  @ViewAnimator({type: Number, inherit: true})
  declare stackPhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);

    if (this.buttonType === "regular") {
      this.width.setAutoState(56, timing);
      this.height.setAutoState(56, timing);
    } else if (this.buttonType === "mini") {
      this.width.setAutoState(40, timing);
      this.height.setAutoState(40, timing);
    }

    this.backgroundColor.setAutoState(theme.inner(mood, Look.accentColor), timing);

    let shadow = theme.inner(Mood.floating, Look.shadow);
    if (shadow !== void 0) {
      const shadowColor = shadow.color;
      const phase = this.stackPhase.getValueOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setAutoState(shadow, timing);

    const icon = this.icon;
    if (icon instanceof SvgView) {
      icon.fill.setAutoState(theme.inner(mood, Look.backgroundColor), timing);
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);

    let shadow = this.getLook(Look.shadow, Mood.floating);
    if (shadow !== void 0) {
      const shadowColor = shadow.color;
      const phase = this.stackPhase.getValueOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setAutoState(shadow);
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof ButtonMorph) {
      this.onInsertMorph(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof ButtonMorph) {
      this.onRemoveMorph(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertMorph(morph: ButtonMorph): void {
    // hook
  }

  protected onRemoveMorph(morph: ButtonMorph): void {
    // hook
  }

  didStartHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, 1]);
    if (this.backgroundColor.isAuto()) {
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(this.getLook(Look.accentColor), timing);
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(this.getLook(Look.accentColor), timing);
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    // nop
  }
}
