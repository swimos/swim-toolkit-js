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

import {Tween} from "@swim/transition";
import {View, ViewNode, HtmlView} from "@swim/view";
import {RackItem} from "./RackItem";
import {RackViewObserver} from "./RackViewObserver";
import {RackViewController} from "./RackViewController";
import {ShellView} from "../shell/ShellView";

export class RackView extends HtmlView {
  /** @hidden */
  _viewController: RackViewController | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("rack")
        .marginTop(12)
        .marginBottom(12);
  }

  get viewController(): RackViewController | null {
    return this._viewController;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof RackItem) {
      this.onInsertItem(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof RackItem) {
      this.onRemoveItem(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertItem(item: RackItem): void {
    // stub
  }

  protected onRemoveItem(item: RackItem): void {
    // stub
  }

  expand(tween?: Tween<any>): void {
    const childNodes = this._node.childNodes;
    for (let i = 0; i < childNodes.length; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof RackItem) {
        childView.expand(tween);
      }
    }
  }

  collapse(tween?: Tween<any>): void {
    const childNodes = this._node.childNodes;
    for (let i = 0; i < childNodes.length; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof RackItem) {
        childView.collapse(tween);
      }
    }
  }

  /** @hidden */
  onItemClick(item: RackItem): void {
    this.didObserve(function (viewObserver: RackViewObserver): void {
      if (viewObserver.rackDidClickItem) {
        viewObserver.rackDidClickItem(item, this);
      }
    });

    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.hideCabinet();
    }
  }
}
