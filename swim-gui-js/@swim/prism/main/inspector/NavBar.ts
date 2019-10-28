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

import {View, HtmlView, HtmlViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class NavBar extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<NavBar> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onBackItemClick = this.onBackItemClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("nav-bar")
        .position("relative")
        .display("flex")
        .height(60)
        .marginBottom(-4)
        .boxSizing("border-box")
        .userSelect("none");
  }

  protected initChildren(): void {
    this.append(this.createBackView().key("back"));
    this.append(this.createTitleView().key("title"));
    this.append(this.createMenuView().key("menu"));
  }

  protected createBackView(): HtmlView {
    const item = HtmlView.create("div")
        .display("flex")
        .flexShrink(0)
        .justifyContent("center")
        .alignItems("center")
        .width(60)
        .paddingLeft(16)
        .paddingRight(4)
        .boxSizing("content-box")
        .cursor("pointer");
    const icon = item.append("svg").width(12).height(20).viewBox("0 0 12 20");
    icon.append("path")
        .fill("#828384")
        .d("M9.54,19.59 L0.29,10.68 C-0.1,10.3 -0.08,9.7 0.292,9.32 L9.54,0.41 C10.1,-0.12 11.01,-0.14 11.58,0.41 C12.14,0.95 12.14,1.83 11.58,2.37 L3.67,10 L11.58,17.63 C12.14,18.17 12.14,19.05 11.58,19.59 C11.01,20.14 10.1,20.14 9.54,19.59");
    item.append("span")
        .display("block")
        .paddingLeft(6)
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .lineHeight(60)
        .color("#828384")
        .text("Back");
    return item;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span")
        .display("flex")
        .justifyContent("center")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .lineHeight(60)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#d8d8d8");
    if (text !== void 0) {
      view.text(text);
    }
    return view;
  }

  protected createMenuView(): HtmlView {
    const item = HtmlView.create("div")
        .display("flex")
        .flexShrink(0)
        .justifyContent("center")
        .alignItems("center")
        .width(36)
        .paddingLeft(28)
        .paddingRight(16)
        .boxSizing("content-box")
        .cursor("pointer");
    const icon = item.append("svg")
        .key("icon")
        .width(24)
        .height(24)
        .viewBox("0 0 24 24");
    icon.append("path")
        .fill("#d8d8d8")
        .d("M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z");
    return item;
  }

  get viewController(): HtmlViewController<NavBar> | null {
    return this._viewController;
  }

  backView(): HtmlView | null {
    const childView = this.getChildView("back");
    return childView instanceof HtmlView ? childView : null;
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
          newTitleView = this.createTitleView(newTitleView);
          this.insertChildView(newTitleView, this.menuView());
        } else {
          oldTitleView.text(newTitleView);
          newTitleView = oldTitleView;
        }
      } else if (newTitleView !== null) {
        if (oldTitleView === null) {
          this.insertChildView(newTitleView.key("title"), this.menuView());
        } else {
          this.setChildView("title", newTitleView);
        }
      } else if (oldTitleView !== null) {
        oldTitleView.remove();
      }
      return this;
    }
  }

  menuView(): HtmlView | null {
    const childView = this.getChildView("menu");
    return childView instanceof HtmlView ? childView : null;
  }

  protected onMount(): void {
    this.onResize();
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      const isMobile = appView.isMobile();
      const backView = this.backView();
      if (backView) {
        backView.display(isMobile ? "flex" : "none")
                .paddingLeft(Math.max(16, appView.viewport.safeArea.insetLeft));
      }
      const titleView = this.titleView();
      if (titleView) {
        titleView.justifyContent(isMobile ? "center" : "flex-start")
                 .paddingLeft(isMobile ? 4 : 32)
                 .paddingRight(4);
      }
      const menuView = this.menuView();
      if (menuView) {
        menuView.paddingLeft(isMobile ? 28 : 8)
                .paddingRight(Math.max(16, appView.viewport.safeArea.insetRight));
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "back" && childView instanceof HtmlView) {
      this.onInsertBackView(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitleView(childView);
    } else if (childKey === "menu" && childView instanceof HtmlView) {
      this.onInsertMenuView(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "back" && childView instanceof HtmlView) {
      this.onRemoveBackItem(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitleView(childView);
    } else if (childKey === "menu" && childView instanceof HtmlView) {
      this.onRemoveMenuView(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertBackView(backView: HtmlView): void {
    backView.on("click", this.onBackItemClick);
  }

  protected onRemoveBackItem(backView: HtmlView): void {
    backView.off("click", this.onBackItemClick);
  }

  protected onInsertTitleView(titleView: HtmlView): void {
    titleView.flexGrow(1);
  }

  protected onRemoveTitleView(titleView: HtmlView): void {
    // stub
  }

  protected onInsertMenuView(menuView: HtmlView): void {
    // stub
  }

  protected onRemoveMenuView(menuView: HtmlView): void {
    // stub
  }

  protected onBackItemClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.hideInspector();
    }
  }
}
