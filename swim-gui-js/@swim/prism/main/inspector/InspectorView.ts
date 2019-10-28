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

import {Color} from "@swim/color";
import {BoxShadow} from "@swim/style";
import {View, HtmlView} from "@swim/view";
import {NavBar} from "./NavBar";
import {InspectorViewController} from "./InspectorViewController";
import {CardPanel} from "./CardPanel";
import {ShellView} from "../shell/ShellView";

export class InspectorView extends HtmlView {
  /** @hidden */
  _viewController: InspectorViewController | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("inspector")
        .position("relative")
        .display("flex")
        .flexDirection("column")
        .width(360)
        .boxSizing("border-box")
        .backgroundColor("#1e2022");
  }

  protected initChildren(): void {
    this.append(NavBar, "navBar").display("none");
    this.append(CardPanel, "cardPanel");
  }

  get viewController(): InspectorViewController | null {
    return this._viewController;
  }

  get navBar(): NavBar | null {
    const childView = this.getChildView("navBar");
    return childView instanceof NavBar ? childView : null;
  }

  get cardPanel(): CardPanel | null {
    const childView = this.getChildView("cardPanel");
    return childView instanceof CardPanel ? childView : null;
  }

  focus(): void {
    this.navBar!.display("flex");
  }

  defocus(): void {
    this.navBar!.display("none").titleView("");
    this.cardPanel!.removeAll();
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
    const isMobile = appView instanceof ShellView && appView.isMobile();
    this.boxShadow.setState(isMobile ? BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)) : void 0);
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "navBar" && childView instanceof NavBar) {
      this.onInsertNavBar(childView);
    } else if (childKey === "cardPanel" && childView instanceof CardPanel) {
      this.onInsertCardPanel(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "navBar" && childView instanceof NavBar) {
      this.onRemoveNavBar(childView);
    } else if (childKey === "cardPanel" && childView instanceof CardPanel) {
      this.onRemoveCardPanel(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertNavBar(navBar: NavBar): void {
    navBar.flexShrink(0);
  }

  protected onRemoveNavBar(navBar: NavBar): void {
    // stub
  }

  protected onInsertCardPanel(cardPanel: CardPanel): void {
    cardPanel.flexGrow(1);
  }

  protected onRemoveCardPanel(cardPanel: CardPanel): void {
    // stub
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView) {
      appView.hidePopovers();
    }
  }
}
