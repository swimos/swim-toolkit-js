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

import {Tween} from "@swim/transition";
import {
  ViewScope,
  ViewContext,
  View,
  ViewNodeType,
  SvgView,
  HtmlView,
  HtmlViewController,
} from "@swim/view";
import {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {Theme} from "@swim/theme";
import {MembraneView, MorphView} from "@swim/motif";

export class ActionButton extends MembraneView implements PositionGestureDelegate {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("action-button");
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

  get viewController(): HtmlViewController<ActionButton> | null {
    return this._viewController;
  }

  @ViewScope(Theme, {inherit: true})
  theme: ViewScope<this, Theme>;

  get morph(): MorphView | null {
    const childView = this.getChildView("morph");
    return childView instanceof MorphView ? childView : null;
  }

  get icon(): SvgView | HtmlView | null {
    const morph = this.morph;
    return morph !== null ? morph.icon : null;
  }

  setIcon(icon: SvgView | HtmlView | null, tween: Tween<any> = null, ccw: boolean = false): void {
    let morph = this.morph;
    if (morph === null) {
      morph = this.append(MorphView, "morph");
    }
    morph.setIcon(icon, tween, ccw);
  }

  setTheme(theme: Theme): void {
    this.backgroundColor.setAutoState(theme.primary.fillColor);
    this.boxShadow.setAutoState(theme.floating.shadow);

    const icon = this.icon;
    if (icon instanceof SvgView) {
      icon.fill.setAutoState(theme.primary.iconColor);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.requireUpdate(View.NeedsCompute);
  }

  protected onCompute(viewContext: ViewContext): void {
    super.onCompute(viewContext);
    const theme = this.theme.state;
    if (theme !== void 0) {
      this.setTheme(theme);
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
    const theme = this.theme.state;
    if (theme !== void 0) {
      this.backgroundColor.setAutoState(theme.primary.fillColor.darker(0.5), this.membraneTransition.state);
    }
  }

  didStopHovering(): void {
    const theme = this.theme.state;
    if (theme !== void 0) {
      this.backgroundColor.setAutoState(theme.primary.fillColor, this.membraneTransition.state);
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    // nop
  }
}
