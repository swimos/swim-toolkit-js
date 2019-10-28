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
import {CardView} from "./CardView";

export class CardPanel extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<CardPanel> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("card-panel")
        .position("relative")
        .overflowX("hidden")
        .overflowY("scroll");
    this._node.style.setProperty("-webkit-overflow-scrolling", "touch");
  }

  get viewController(): HtmlViewController<CardPanel> | null {
    return this._viewController;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof CardView) {
      this.onInsertCard(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof CardView) {
      this.onRemoveCard(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertCard(tabItem: CardView): void {
    // stub
  }

  protected onRemoveCard(tabItem: CardView): void {
    // stub
  }
}
