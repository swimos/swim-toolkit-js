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

import {Constraint} from "@swim/constraint";
import {LayoutAnchor, View, HtmlView, HtmlViewController} from "@swim/view";
import {CabinetButton} from "./CabinetButton";

export class CabinetBar extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<CabinetBar> | null;

  /** @hidden */
  _cabinetButtonInsetLeftConstraint: Constraint | undefined;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("cabinet-bar")
        .display("flex")
        .boxSizing("border-box");
  }

  protected initChildren(): void {
    this.append(CabinetButton, "cabinetButton");
  }

  get viewController(): HtmlViewController<CabinetBar> | null {
    return this._viewController;
  }

  @LayoutAnchor("strong")
  insetLeft: LayoutAnchor<this>;

  get cabinetButton(): CabinetButton | null {
    const childView = this.getChildView("cabinetButton");
    return childView instanceof CabinetButton ? childView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "cabinetButton" && childView instanceof CabinetButton) {
      this.onInsertBrand(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "cabinetButton" && childView instanceof CabinetButton) {
      this.onRemoveBrand(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertBrand(cabinetButton: CabinetButton): void {
    this._cabinetButtonInsetLeftConstraint = this.constraint(cabinetButton.insetLeft, "eq", this.insetLeft).enabled(true);
  }

  protected onRemoveBrand(cabinetButton: CabinetButton): void {
    if (this._cabinetButtonInsetLeftConstraint) {
      this._cabinetButtonInsetLeftConstraint.enabled(false);
      this._cabinetButtonInsetLeftConstraint = void 0;
    }
  }
}
