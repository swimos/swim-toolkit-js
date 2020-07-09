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

import {Transition} from "@swim/transition";
import {ViewContext, View, ViewAnimator, ViewNodeType, SvgView, HtmlView} from "@swim/view";
import {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {MembraneView} from "@swim/motif";

export class ActionItem extends MembraneView implements PositionGestureDelegate {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("action-item");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.width.setAutoState(48);
    this.height.setAutoState(48);
    this.borderTopLeftRadius.setAutoState("50%");
    this.borderTopRightRadius.setAutoState("50%");
    this.borderBottomLeftRadius.setAutoState("50%");
    this.borderBottomRightRadius.setAutoState("50%");
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  @ViewAnimator(Number, {inherit: true})
  stackPhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  get icon(): SvgView | HtmlView | null {
    const childView = this.getChildView("icon");
    return childView instanceof SvgView || childView instanceof HtmlView ? childView : null;
  }

  get label(): HtmlView | null {
    const childView = this.getChildView("label");
    return childView instanceof HtmlView ? childView : null;
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    const phase = this.stackPhase.getValueOr(1);

    this.backgroundColor.setAutoState(theme.inner(mood, Look.secondaryColor), transition);
    let shadow = theme.inner(Mood.floating, Look.shadow);
    if (shadow !== void 0) {
      const shadowColor = shadow.color();
      shadow = shadow.color(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setAutoState(shadow, transition);

    const icon = this.icon;
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      icon.fill.setAutoState(theme.inner(mood, Look.backgroundColor), transition);
    }

    const label = this.label;
    if (label !== null && label.color.isAuto()) {
      label.color.setAutoState(theme.inner(mood, Look.mutedColor), transition);
    }
  }

  protected onLayout(viewContext: ViewContext): void {
    super.onLayout(viewContext);
    const phase = this.stackPhase.getValueOr(1);

    const label = this.label;
    if (label !== null) {
      label.opacity.setAutoState(phase);
    }

    let shadow = this.getLook(Look.shadow, Mood.floating);
    if (shadow !== void 0) {
      const shadowColor = shadow.color();
      shadow = shadow.color(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setAutoState(shadow);
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onInsertIcon(childView);
    } else if (childKey === "label" && childView instanceof HtmlView) {
      this.onInsertLabel(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onRemoveIcon(childView);
    } else if (childKey === "label" && childView instanceof HtmlView) {
      this.onRemoveLabel(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(icon: SvgView | HtmlView): void {
    // hook
  }

  protected onRemoveIcon(icon: SvgView | HtmlView): void {
    // hook
  }

  protected onInsertLabel(label: HtmlView): void {
    label.display.setAutoState("block");
    label.position.setAutoState("absolute");
    label.top.setAutoState(0);
    label.right.setAutoState(48 + 12);
    label.bottom.setAutoState(0);
    label.fontSize.setAutoState(17);
    label.fontWeight.setAutoState("500");
    label.lineHeight.setAutoState("48px");
    label.whiteSpace.setAutoState("nowrap");
    label.opacity.setAutoState(this.stackPhase.getValueOr(0));
  }

  protected onRemoveLabel(label: HtmlView): void {
    // hook
  }

  protected glow(input: PositionGestureInput): void {
    // nop
  }

  didStartHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, 1]);
    if (this.backgroundColor.isAuto()) {
      const transition = this.getLook(Look.transition);
      this.backgroundColor.setAutoState(this.getLook(Look.secondaryColor), transition);
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      const transition = this.getLook(Look.transition);
      this.backgroundColor.setAutoState(this.getLook(Look.secondaryColor), transition);
    }
  }
}
