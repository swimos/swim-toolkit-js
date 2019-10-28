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

import {Tween, Transition} from "@swim/transition";
import {View, SvgView, HtmlView, HtmlViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class SettingsItem extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<SettingsItem> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("settings-item")
        .display("flex")
        .alignItems("center")
        .height(44)
        .marginLeft(4)
        .marginRight(4)
        .boxSizing("border-box")
        .lineHeight(44)
        .userSelect("none")
        .cursor("pointer");
  }

  protected initChildren(): void {
    this.append(this.createIconView(this.createIcon()).key("icon"));
    this.append(this.createTitleView().key("title"));
  }

  protected createIcon(): SvgView {
    const icon = SvgView.create("svg").width(20).height(20).viewBox("0 0 20 20");
    icon.append("path").fill("#9a9a9a").d("M17.6501795,10.975 C17.6887518,10.6625 17.7144667,10.3375 17.7144667,10 C17.7144667,9.6625 17.6887518,9.3375 17.637322,9.025 L19.8102301,7.375 C20.0030918,7.225 20.0545216,6.95 19.9388046,6.7375 L17.8816135,3.275 C17.753039,3.05 17.4830327,2.975 17.2515987,3.05 L14.6929672,4.05 C14.1529546,3.65 13.587227,3.325 12.9572122,3.075 L12.5714889,0.425 C12.5329166,0.175 12.31434,0 12.0571911,0 L7.94280888,0 C7.68566,0 7.47994088,0.175 7.44136855,0.425 L7.05564522,3.075 C6.42563044,3.325 5.84704544,3.6625 5.31989021,4.05 L2.76125876,3.05 C2.52982476,2.9625 2.25981843,3.05 2.13124398,3.275 L0.0740528683,6.7375 C-0.0545215764,6.9625 -0.00309179853,7.225 0.202627313,7.375 L2.37553543,9.025 C2.32410565,9.3375 2.28553332,9.675 2.28553332,10 C2.28553332,10.325 2.31124821,10.6625 2.36267798,10.975 L0.189769869,12.625 C-0.00309179853,12.775 -0.0545215764,13.05 0.0611954238,13.2625 L2.11838654,16.725 C2.24696098,16.95 2.51696732,17.025 2.74840132,16.95 L5.30703277,15.95 C5.84704544,16.35 6.41277299,16.675 7.04278777,16.925 L7.42851111,19.575 C7.47994088,19.825 7.68566,20 7.94280888,20 L12.0571911,20 C12.31434,20 12.5329166,19.825 12.5586314,19.575 L12.9443548,16.925 C13.5743696,16.675 14.1529546,16.3375 14.6801098,15.95 L17.2387412,16.95 C17.4701752,17.0375 17.7401816,16.95 17.868756,16.725 L19.9259471,13.2625 C20.0545216,13.0375 20.0030918,12.775 19.7973727,12.625 L17.6501795,10.975 L17.6501795,10.975 Z M10,13.75 C7.87852166,13.75 6.14276666,12.0625 6.14276666,10 C6.14276666,7.9375 7.87852166,6.25 10,6.25 C12.1214783,6.25 13.8572333,7.9375 13.8572333,10 C13.8572333,12.0625 12.1214783,13.75 10,13.75 Z");
    return icon;
  }

  protected createIconView(icon?: SvgView): HtmlView {
    const view = HtmlView.create("div")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(36)
        .height(44);
    if (icon !== void 0) {
      view.append(icon);
    }
    return view;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span")
        .addClass("settings-title")
        .display("block")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#9a9a9a")
        .text("Settings");
    if (text !== void 0) {
      view.text(text);
    }
    return view;
  }

  get viewController(): HtmlViewController<SettingsItem> | null {
    return this._viewController;
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
    if (appView instanceof ShellView) {
      this.paddingBottom(appView.viewport.safeArea.insetBottom)
          .paddingLeft(appView.viewport.safeArea.insetLeft);
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
    icon.flexShrink(0)
        .marginLeft(8)
        .marginRight(8);
  }

  protected onRemoveIcon(icon: HtmlView): void {
    // stub
  }

  protected onInsertTitle(title: HtmlView): void {
    title.flexShrink(0)
         .marginLeft(4)
         .marginRight(4);
  }

  protected onRemoveTitle(title: HtmlView): void {
    // stub
  }

  expand(tween?: Tween<any>): void {
    const titleView = this.titleView()!;
    this.willExpand();
    titleView.display("block");
    if (tween instanceof Transition) {
      tween = tween.onEnd(this.didExpand.bind(this));
      titleView.opacity(1, tween);
    } else {
      titleView.opacity(1);
      this.didExpand();
    }
  }

  protected willExpand(): void {
    // stub
  }

  protected didExpand(): void {
    // stub
  }

  collapse(tween?: Tween<any>): void {
    const titleView = this.titleView()!;
    this.willCollapse();
    if (tween instanceof Transition) {
      tween = tween.onEnd(this.didCollapse.bind(this));
      titleView.opacity(0, tween);
    } else {
      titleView.opacity(0);
      this.didCollapse();
    }
  }

  protected willCollapse(): void {
    // stub
  }

  protected didCollapse(): void {
    const titleView = this.titleView()!;
    titleView.display("none");
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.showSettingsDialog();
    }
  }
}
