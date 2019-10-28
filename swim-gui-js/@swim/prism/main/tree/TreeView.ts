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

import {Ease, Tween, Transition} from "@swim/transition";
import {LayoutAnchor, View, ViewNode, HtmlView, HtmlAppView} from "@swim/view";
import {LeafView} from "./LeafView";
import {TreeViewObserver} from "./TreeViewObserver";
import {TreeViewController} from "./TreeViewController";

export class TreeView extends HtmlView {
  /** @hidden */
  _viewController: TreeViewController | null;
  /** @hidden */
  _layoutTransition: Transition<any>;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this._layoutTransition = Transition.duration(250, Ease.cubicOut);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("tree")
        .position("relative")
        .paddingTop(16)
        .paddingBottom(16)
        .overflow("auto");
    this._node.style.setProperty("-webkit-overflow-scrolling", "touch");
  }

  get viewController(): TreeViewController | null {
    return this._viewController;
  }

  @LayoutAnchor("strong")
  insetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  insetRight: LayoutAnchor<this>;

  protected onLayout(): void {
    this.layoutLeafs();
  }

  protected layoutLeafs(tween?: Tween<any>): void {
    if (tween === void 0 || tween === true) {
      tween = this._layoutTransition;
    } else if (tween) {
      tween = Transition.fromAny(tween);
    }

    let y = 16;
    const childNodes = this._node.childNodes;
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof LeafView) {
        childView.opacity(1, tween)
                 .top(y, tween)
                 .right(4)
                 .left(4);
        y += 60;
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof LeafView) {
      this.onInsertLeaf(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof LeafView) {
      this.onRemoveLeaf(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertLeaf(leaf: LeafView): void {
    leaf.position("absolute")
        .opacity(0);

    const appView = this.appView;
    if (appView instanceof HtmlAppView) {
      appView.throttleLayout();
    }
  }

  protected onRemoveLeaf(leaf: LeafView): void {
    const appView = this.appView;
    if (appView instanceof HtmlAppView) {
      appView.throttleLayout();
    }
  }

  /** @hidden */
  didPressLeafDown(leaf: LeafView): void {
    this.didObserve(function (viewObserver: TreeViewObserver): void {
      if (viewObserver.treeDidPressLeafDown) {
        viewObserver.treeDidPressLeafDown(leaf, this);
      }
    });
  }

  /** @hidden */
  didPressLeafHold(leaf: LeafView): void {
    this.didObserve(function (viewObserver: TreeViewObserver): void {
      if (viewObserver.treeDidPressLeafHold) {
        viewObserver.treeDidPressLeafHold(leaf, this);
      }
    });
  }

  /** @hidden */
  didPressLeafUp(duration: number, multi: boolean, leaf: LeafView): void {
    this.didObserve(function (viewObserver: TreeViewObserver): void {
      if (viewObserver.treeDidPressLeafUp) {
        viewObserver.treeDidPressLeafUp(duration, multi, leaf, this);
      }
    });
  }

  /** @hidden */
  didPressLeafAvatar(leaf: LeafView): void {
    this.didObserve(function (viewObserver: TreeViewObserver): void {
      if (viewObserver.treeDidPressLeafAvatar) {
        viewObserver.treeDidPressLeafAvatar(leaf, this);
      }
    });
  }

  /** @hidden */
  didPressLeafArrow(leaf: LeafView): void {
    this.didObserve(function (viewObserver: TreeViewObserver): void {
      if (viewObserver.treeDidPressLeafArrow) {
        viewObserver.treeDidPressLeafArrow(leaf, this);
      }
    });
  }
}
