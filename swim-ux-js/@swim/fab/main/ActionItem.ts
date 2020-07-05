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

import {AnyColor, Color} from "@swim/color";
import {
  ViewScope,
  ViewContext,
  View,
  ViewAnimator,
  ViewNodeType,
  SvgView,
  HtmlView,
  HtmlViewController,
} from "@swim/view";
import {Theme} from "@swim/theme";

export class ActionItem extends HtmlView {
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

  get viewController(): HtmlViewController<ActionItem> | null {
    return this._viewController;
  }

  @ViewScope(Theme, {inherit: true})
  theme: ViewScope<this, Theme>;

  @ViewAnimator(Number, {inherit: true})
  stackPhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Color)
  hoverColor: ViewAnimator<this, Color, AnyColor>;

  get icon(): SvgView | HtmlView | null {
    const childView = this.getChildView("icon");
    return childView instanceof SvgView || childView instanceof HtmlView ? childView : null;
  }

  get label(): HtmlView | null {
    const childView = this.getChildView("label");
    return childView instanceof HtmlView ? childView : null;
  }

  setTheme(theme: Theme): void {
    this.backgroundColor.setAutoState(theme.secondary.fillColor);
    this.boxShadow.setAutoState(theme.floating.shadow);
    this.hoverColor.setAutoState(theme.secondary.fillColor.darker(0.5));

    const icon = this.icon;
    if (icon instanceof SvgView) {
      icon.fill.setAutoState(theme.secondary.iconColor);
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

  protected onLayout(viewContext: ViewContext): void {
    super.onLayout(viewContext);
    const label = this.label;
    const phase = this.stackPhase.value;
    if (label !== null && phase !== void 0) {
      label.opacity.setAutoState(phase);
    }
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
    label.color.setAutoState("#cccccc");
    label.opacity.setAutoState(this.stackPhase.getValueOr(0));
  }

  protected onRemoveLabel(label: HtmlView): void {
    // hook
  }
}
