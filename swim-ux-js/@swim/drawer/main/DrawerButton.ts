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
import {View, ViewNodeType, SvgView, HtmlView} from "@swim/view";
import {Look, MoodVector, ThemeMatrix, ThemedHtmlView} from "@swim/theme";
import {DrawerView} from "./DrawerView";

export class DrawerButton extends ThemedHtmlView {
  /** @hidden */
  _drawerView: DrawerView | null;

  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
    this._drawerView = null;
    this.initChildren();
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("drawer-button");
    this.display.setAutoState("flex")
    this.justifyContent.setAutoState("center")
    this.alignItems.setAutoState("center")
    this.width.setAutoState(48)
    this.height.setAutoState(48)
    this.userSelect.setAutoState("none")
    this.cursor.setAutoState("pointer");
  }

  protected initChildren(): void {
    this.append(this.createIcon(), "icon");
  }

  protected createIcon(): SvgView {
    const icon = SvgView.create("svg");
    icon.width.setAutoState(30);
    icon.height.setAutoState(30);
    icon.viewBox.setAutoState("0 0 30 30");
    icon.strokeWidth.setAutoState(2);
    icon.strokeLinecap.setAutoState("round");
    const path = icon.append("path");
    path.d.setAutoState("M4 7h22M4 15h22M4 23h22");
    return icon;
  }

  get drawerView(): DrawerView | null {
    return this._drawerView;
  }

  setDrawerView(drawerView: DrawerView | null) {
    this._drawerView = drawerView;
  }

  get icon(): SvgView | HtmlView | null {
    const childView = this.getChildView("icon");
    return childView instanceof SvgView || childView instanceof HtmlView ? childView : null;
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    const icon = this.icon;
    if (icon instanceof SvgView && icon.stroke.isAuto()) {
      icon.stroke.setAutoState(theme.inner(mood, Look.color), transition);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    super.onUnmount();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onInsertIcon(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onRemoveIcon(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(icon: SvgView | HtmlView): void {
    if (icon instanceof SvgView && icon.stroke.isAuto()) {
      icon.stroke.setAutoState(this.getLook(Look.color));
    }
  }

  protected onRemoveIcon(icon: SvgView | HtmlView): void {
    // hook
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const drawerView = this._drawerView;
    if (drawerView !== null) {
      drawerView.toggle();
    }
  }
}
