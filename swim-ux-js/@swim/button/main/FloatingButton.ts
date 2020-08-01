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

import {Tween, Transition} from "@swim/transition";
import {View, ViewNodeType, SvgView, HtmlView} from "@swim/view";
import {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {MembraneView, MorphView} from "@swim/motif";

export type FloatingButtonType = "regular" | "mini";

export class FloatingButton extends MembraneView implements PositionGestureDelegate {
  /** @hidden */
  _buttonType: FloatingButtonType;

  constructor(node: HTMLElement) {
    super(node);
    this._buttonType = "regular";
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("floating-button");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.width.setAutoState(56);
    this.height.setAutoState(56);
    this.borderTopLeftRadius.setAutoState("50%");
    this.borderTopRightRadius.setAutoState("50%");
    this.borderBottomLeftRadius.setAutoState("50%");
    this.borderBottomRightRadius.setAutoState("50%");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  get buttonType(): FloatingButtonType {
    return this._buttonType;
  }

  setButtonType(buttonType: FloatingButtonType, tween?: Tween<any>): void {
    if (this._buttonType !== buttonType) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this._buttonType = buttonType;
      this.onSetButtonType(buttonType, tween);
    }
  }

  protected onSetButtonType(buttonType: FloatingButtonType, transition: Transition<any> | null): void {
    if (buttonType === "regular") {
      this.width.setAutoState(56, transition);
      this.height.setAutoState(56, transition);
      this.backgroundColor.setAutoState(this.getLook(Look.primaryColor), transition);
    } else if (buttonType === "mini") {
      this.width.setAutoState(40, transition);
      this.height.setAutoState(40, transition);
      this.backgroundColor.setAutoState(this.getLook(Look.secondaryColor), transition);
    } else {
      throw new Error("unsupported floating button type: " + buttonType);
    }
  }

  get morph(): MorphView | null {
    const childView = this.getChildView("morph");
    return childView instanceof MorphView ? childView : null;
  }

  get icon(): SvgView | HtmlView | null {
    const morph = this.morph;
    return morph !== null ? morph.icon : null;
  }

  setIcon(icon: SvgView | HtmlView | null, tween?: Tween<any>, ccw: boolean = false): void {
    let morph = this.morph;
    if (morph === null) {
      morph = this.append(MorphView, "morph");
    }
    morph.setIcon(icon, tween, ccw);
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);

    if (this._buttonType === "regular") {
      this.backgroundColor.setAutoState(theme.inner(mood, Look.primaryColor), transition);
    } else if (this._buttonType === "mini") {
      this.backgroundColor.setAutoState(theme.inner(mood, Look.secondaryColor), transition);
    }
    this.boxShadow.setAutoState(theme.inner(Mood.floating, Look.shadow), transition);

    const icon = this.icon;
    if (icon instanceof SvgView) {
      icon.fill.setAutoState(theme.inner(mood, Look.backgroundColor), transition);
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof MorphView) {
      this.onInsertMorph(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof MorphView) {
      this.onRemoveMorph(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertMorph(morph: MorphView): void {
    // hook
  }

  protected onRemoveMorph(morph: MorphView): void {
    // hook
  }

  didStartHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, 1]);
    if (this.backgroundColor.isAuto()) {
      const transition = this.getLook(Look.transition);
      if (this._buttonType === "regular") {
        this.backgroundColor.setAutoState(this.getLook(Look.primaryColor), transition);
      } else if (this._buttonType === "mini") {
        this.backgroundColor.setAutoState(this.getLook(Look.secondaryColor), transition);
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      const transition = this.getLook(Look.transition);
      if (this._buttonType === "regular") {
        this.backgroundColor.setAutoState(this.getLook(Look.primaryColor), transition);
      } else if (this._buttonType === "mini") {
        this.backgroundColor.setAutoState(this.getLook(Look.secondaryColor), transition);
      }
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    // nop
  }
}
