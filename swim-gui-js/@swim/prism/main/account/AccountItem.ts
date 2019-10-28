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

import {HtmlView, HtmlViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class AccountItem extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<AccountItem> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("account-item")
        .display("flex")
        .alignItems("center")
        .height(60)
        .userSelect("none")
        .cursor("pointer");
  }

  protected initChildren(): void {
    this.append(this.createIconView().key("icon"));
    this.append(this.createIdentityView().key("identity"));
  }

  protected createIconView(): HtmlView {
    const view = HtmlView.create("div")
        .addClass("account-icon")
        .display("flex")
        .flexShrink(0)
        .justifyContent("center")
        .alignItems("center")
        .width(40)
        .height(36)
        .marginLeft(6)
        .marginRight(6);
    const icon = view.append("svg").width(36).height(36).viewBox("0 0 36 36");
    icon.append("path").fill("#828384").d("M6,31.416639 C2.31750384,28.1207157 0,23.3309989 0,18 C0,8.0588745 8.0588745,0 18,0 C27.9411255,0 36,8.0588745 36,18 C36,23.3309989 33.6824962,28.1207157 30,31.416639 L30,31.1770667 C30,29.3434667 29.0029565,27.6944 27.3986087,26.8741333 L22.4144348,24.3269333 C21.9443478,24.0864 21.6521739,23.6032 21.6521739,23.0656 L21.6521739,21.2624 C21.7716522,21.1130667 21.8973913,20.9429333 22.0273043,20.7552 C22.6737391,19.8218667 23.1918261,18.7829333 23.5685217,17.6624 C24.3046957,17.3173333 24.7826087,16.5733333 24.7826087,15.7333333 L24.7826087,13.6 C24.7826087,13.0864 24.5947826,12.5888 24.2608696,12.2 L24.2608696,9.3632 C24.290087,9.06986667 24.4048696,7.32373333 23.1693913,5.8832 C22.0977391,4.6336 20.3587826,4 18,4 C15.6412174,4 13.9022609,4.6336 12.8306087,5.88266667 C11.5951304,7.3232 11.709913,9.06986667 11.7391304,9.3632 L11.7391304,12.2 C11.4052174,12.5888 11.2173913,13.0864 11.2173913,13.6 L11.2173913,15.7333333 C11.2173913,16.3824 11.505913,16.9877333 11.9984348,17.3914667 C12.4763478,19.3258667 13.4765217,20.7834667 13.826087,21.2512 L13.826087,23.016 C13.826087,23.5322667 13.5506087,24.0058667 13.1076522,24.2533333 L8.45321739,26.8485333 C6.93965217,27.6928 6,29.3109333 6,31.0730667 L6,31.416639 L6,31.416639 Z");
    return view;
  }

  protected createIdentityView(): HtmlView {
    const identity = HtmlView.create("div")
        .addClass("account-identity")
        .display("flex")
        .flexDirection("column")
        .height(36)
        .marginLeft(4)
        .marginRight(4);
    identity.append(this.createNameView().key("name"));
    identity.append(this.createOrganizationView().key("organiation"));
    return identity;
  }

  protected createNameView(): HtmlView {
    return HtmlView.create("span")
        .addClass("account-name")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(20)
        .lineHeight(20)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#a8a8ab")
        .text("Chris Sachs");
  }

  protected createOrganizationView(): HtmlView {
    return HtmlView.create("span")
        .addClass("account-organization")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(16)
        .lineHeight(16)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#6d7278")
        .text("Swim, inc.");
  }

  get iconView(): HtmlView | null {
    const childView = this.getChildView("icon");
    return childView instanceof HtmlView ? childView : null;
  }

  get identityView(): HtmlView | null {
    const childView = this.getChildView("identity");
    return childView instanceof HtmlView ? childView : null;
  }

  get nameView(): HtmlView | null {
    const identityView = this.identityView;
    const childView = identityView ? identityView.getChildView("name") : null;
    return childView instanceof HtmlView ? childView : null;
  }

  get organizationView(): HtmlView | null {
    const identityView = this.identityView;
    const childView = identityView ? identityView.getChildView("organization") : null;
    return childView instanceof HtmlView ? childView : null;
  }

  get viewController(): HtmlViewController<AccountItem> | null {
    return this._viewController;
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
      if (appView.isMobile()) {
        this.display("flex")
            .marginLeft(Math.max(4, appView.viewport.safeArea.insetLeft));
      } else {
        this.display("none");
      }
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.toggleAccountPopover();
      appView.hideCabinet();
    }
  }
}
