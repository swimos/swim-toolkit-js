// Copyright 2015-2019 SWIM.AI inc.
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

import {View, SvgView, HtmlView, HtmlViewController} from "@swim/view";
import {MenuSheet} from "./MenuSheet";
import {ShellView} from "../shell/ShellView";

export class MenuItem extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<MenuItem> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("menu-item")
        .display("flex")
        .height(48)
        .lineHeight(48)
        .userSelect("none")
        .cursor("pointer");
  }

  get viewController(): HtmlViewController<MenuItem> | null {
    return this._viewController;
  }

  protected createIconView(icon?: SvgView): HtmlView {
    const view = HtmlView.create("div")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(48)
        .height(48);
    if (icon !== void 0) {
      view.append(icon);
    }
    return view;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span")
        .display("block")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#cccccc");
    if (text !== void 0) {
      view.text(text);
    }
    return view;
  }

  iconView(): HtmlView | null;
  iconView(iconView: HtmlView | SvgView | null): this;
  iconView(newIconView?: HtmlView | SvgView | null): HtmlView | null | this {
    const childView = this.getChildView("icon");
    const oldIconView = childView instanceof HtmlView ? childView : null;
    if (newIconView === void 0) {
      return oldIconView;
    } else {
      if (newIconView instanceof SvgView) {
        if (oldIconView === null) {
          newIconView = this.createIconView(newIconView).key("icon");
          this.appendChildView(newIconView);
        } else {
          oldIconView.removeAll();
          oldIconView.append(newIconView);
          newIconView = oldIconView;
        }
      } else if (newIconView !== null) {
        if (oldIconView === null) {
          this.appendChildView(newIconView.key("icon"));
        } else {
          this.setChildView("icon", newIconView);
        }
      } else if (oldIconView !== null) {
        oldIconView.remove();
      }
      return this;
    }
  }

  titleView(): HtmlView | null;
  titleView(titleView: HtmlView | string | null): this;
  titleView(newTitleView?: HtmlView | string | null): HtmlView | null | this {
    const childView = this.getChildView("title");
    const oldTitleView = childView instanceof HtmlView ? childView : null;
    if (newTitleView === void 0) {
      return oldTitleView;
    } else {
      if (typeof newTitleView === "string") {
        if (oldTitleView === null) {
          newTitleView = this.createTitleView(newTitleView).key("title");
          this.appendChildView(newTitleView);
        } else {
          oldTitleView.text(newTitleView);
          newTitleView = oldTitleView;
        }
      } else if (newTitleView !== null) {
        if (oldTitleView === null) {
          this.appendChildView(newTitleView.key("title"));
        } else {
          this.setChildView("title", newTitleView);
        }
      } else if (oldTitleView !== null) {
        oldTitleView.remove();
      }
      return this;
    }
  }

  protected onMount(): void {
    this.on("click", this.onClick);
    this.onResize();
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView && appView.isMobile()) {
      this.paddingLeft(appView.viewport.safeArea.insetLeft);
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onInsertIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitle(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onRemoveIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitle(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(icon: HtmlView): void {
    icon.flexShrink(0);
  }

  protected onRemoveIcon(icon: HtmlView): void {
    // stub
  }

  protected onInsertTitle(title: HtmlView): void {
    title.flexShrink(0);
  }

  protected onRemoveTitle(title: HtmlView): void {
    // stub
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const parentView = this.parentView;
    if (parentView instanceof MenuSheet) {
      parentView.onItemClick(this);
    }
  }
}
