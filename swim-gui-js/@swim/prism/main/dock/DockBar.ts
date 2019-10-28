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

import {LayoutAnchor, View, HtmlView, HtmlViewController} from "@swim/view";
import {DockButton} from "./DockButton";
import {AccountButton} from "../account/AccountButton";

export class DockBar extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<DockBar> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("dock-bar")
        .display("flex")
        .justifyContent("flex-end")
        .boxSizing("border-box");
  }

  protected initChildren(): void {
    this.append(DockButton, "dockButton");
    this.append(AccountButton, "accountButton");
  }

  get viewController(): HtmlViewController<DockBar> | null {
    return this._viewController;
  }

  @LayoutAnchor("strong")
  insetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  dockButtonInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  accountButtonInsetRight: LayoutAnchor<this>;

  get dockButton(): DockButton | null {
    const childView = this.getChildView("dockButton");
    return childView instanceof DockButton ? childView : null;
  }

  get accountButton(): AccountButton | null {
    const childView = this.getChildView("accountButton");
    return childView instanceof AccountButton ? childView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "dockButton" && childView instanceof DockButton) {
      this.onInsertDockButton(childView);
    } else if (childKey === "accountButton" && childView instanceof AccountButton) {
      this.onInsertAccountButton(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "dockButton" && childView instanceof DockButton) {
      this.onRemoveDockButton(childView);
    } else if (childKey === "accountButton" && childView instanceof AccountButton) {
      this.onRemoveAccountButton(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertDockButton(dockButton: DockButton): void {
    // stub
  }

  protected onRemoveDockButton(dockButton: DockButton): void {
    // stub
  }

  protected onInsertAccountButton(accountButton: AccountButton): void {
    // stub
  }

  protected onRemoveAccountButton(accountButton: AccountButton): void {
    // stub
  }
}
