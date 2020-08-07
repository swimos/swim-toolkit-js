// Copyright 2015-2020 Swim inc.
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
import {Tween, Transition} from "@swim/transition";
import {ViewContextType, ViewFlags, View, ViewScope, ViewNode, ViewNodeType, HtmlView} from "@swim/view";
import {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {Look} from "@swim/theme";
import {ButtonMembraneInit, ButtonMembrane} from "@swim/button";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import {AnyTreeCell, TreeCell} from "./TreeCell";
import {TreeLeafObserver} from "./TreeLeafObserver";
import {TreeLeafController} from "./TreeLeafController";

export type AnyTreeLeaf = TreeLeaf | TreeLeafInit;

export interface TreeLeafInit extends ButtonMembraneInit {
  viewController?: TreeLeafController;
  highlighted?: boolean;

  cells?: AnyTreeCell[];
}

export class TreeLeaf extends ButtonMembrane implements PositionGestureDelegate {
  /** @hidden */
  _highlighted: boolean;

  constructor(node: HTMLElement) {
    super(node);
    this._highlighted = false;
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree-leaf");
    this.position.setAutoState("relative");
    this.height.setAutoState(58);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  readonly viewController: TreeLeafController | null;

  readonly viewObservers: ReadonlyArray<TreeLeafObserver>;

  initView(init: TreeLeafInit): void {
    super.initView(init);
    if (init.highlighted === true) {
      this.highlight();
    } else if (init.highlighted === false) {
      this.unhighlight();
    }

    if (init.cells !== void 0) {
      this.addCells(init.cells);
    }
  }

  addCell(cell: AnyTreeCell, key?: string): TreeCell {
    if (key === void 0) {
      key = cell.key;
    }
    cell = TreeCell.fromAny(cell);
    this.appendChildView(cell, key);
    return cell;
  }

  addCells(cells: ReadonlyArray<AnyTreeCell>): void {
    for (let i = 0, n = cells.length; i < n; i += 1) {
      this.addCell(cells[i]);
    }
  }

  @ViewScope({type: TreeSeed, inherit: true})
  seed: ViewScope<this, TreeSeed, AnyTreeSeed>;

  @ViewScope({type: Number, inherit: true})
  limbSpacing: ViewScope<this, number>;

  get highlighted(): boolean {
    return this._highlighted;
  }

  highlight(tween?: Tween<any>): this {
    if (!this._highlighted) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willHighlight(tween);
      this._highlighted = true;
      this.onHighlight(tween);
      this.didHighlight(tween);
    }
    return this;
  }

  protected willHighlight(tween: Tween<any>): void {
    this.willObserve(function (viewObserver: TreeLeafObserver): void {
      if (viewObserver.leafWillHighlight !== void 0) {
        viewObserver.leafWillHighlight(tween, this);
      }
    });
  }

  protected onHighlight(tween: Tween<any>): void {
    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), tween);
    }
  }

  protected didHighlight(tween: Tween<any>): void {
    this.didObserve(function (viewObserver: TreeLeafObserver): void {
      if (viewObserver.leafDidHighlight !== void 0) {
        viewObserver.leafDidHighlight(tween, this);
      }
    });
  }

  unhighlight(tween?: Tween<any>): this {
    if (this._highlighted) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willUnhighlight(tween);
      this._highlighted = false;
      this.onUnhighlight(tween);
      this.didUnhighlight(tween);
    }
    return this;
  }

  protected willUnhighlight(tween: Tween<any>): void {
    this.willObserve(function (viewObserver: TreeLeafObserver): void {
      if (viewObserver.leafWillUnhighlight !== void 0) {
        viewObserver.leafWillUnhighlight(tween, this);
      }
    });
  }

  protected onUnhighlight(tween: Tween<any>): void {
    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(Color.transparent(), tween);
    }
  }

  protected didUnhighlight(tween: Tween<any>): void {
    this.didObserve(function (viewObserver: TreeLeafObserver): void {
      if (viewObserver.leafDidUnhighlight !== void 0) {
        viewObserver.leafDidUnhighlight(tween, this);
      }
    });
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof TreeCell) {
      this.onInsertCell(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof TreeCell) {
      this.onRemoveCell(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertCell(cell: TreeCell): void {
    cell.position.setAutoState("absolute");
    cell.top.setAutoState(0);
    cell.bottom.setAutoState(0);
  }

  protected onRemoveCell(cell: TreeCell): void {
    // hook
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              callback?: (this: this, childView: View) => void): void {
    const needsLayout = (displayFlags & View.NeedsLayout) !== 0;
    const seed = needsLayout ? this.seed.state : void 0;
    function layoutChildView(this: TreeLeaf, childView: View): void {
      if (childView instanceof TreeCell) {
        const key = childView.key;
        const root = seed !== void 0 && key !== void 0 ? seed.getRoot(key) : null;
        if (root !== null) {
          childView.display.setAutoState(!root._hidden ? "flex" : "none");
          const left = root._left;
          childView.left.setAutoState(left !== null ? left : void 0);
          const width = root._width;
          childView.width.setAutoState(width !== null ? width : void 0);
        } else {
          childView.display.setAutoState("none");
          childView.left.setAutoState(void 0);
          childView.right.setAutoState(void 0);
        }
      }
      if (callback !== void 0) {
        callback.call(this, childView);
      }
    }
    super.displayChildViews(displayFlags, viewContext, needsLayout ? layoutChildView : callback);
  }

  didHoldPress(input: PositionGestureInput): void {
    let target = input.target;
    while (target !== null && target !== this._node) {
      const targetView = (target as ViewNode).view;
      if (targetView instanceof TreeCell) {
        targetView.didPressHold(input);
        break;
      }
      target = target instanceof Node ? target.parentNode : null;
    }
  }

  didEndPress(input: PositionGestureInput, event: Event | null): void {
    super.didEndPress(input, event);
    let target = input.target;
    while (target !== null && target !== this._node) {
      const targetView = (target as ViewNode).view;
      if (targetView instanceof TreeCell) {
        targetView.didPress(input, event);
        break;
      }
      target = target instanceof Node ? target.parentNode : null;
    }
  }

  static fromAny(leaf: AnyTreeLeaf): TreeLeaf {
    if (leaf instanceof TreeLeaf) {
      return leaf;
    } else if (typeof leaf === "object" && leaf !== null) {
      return TreeLeaf.fromInit(leaf);
    }
    throw new TypeError("" + leaf);
  }

  static fromInit(init: TreeLeafInit): TreeLeaf {
    const view = HtmlView.create(TreeLeaf);
    view.initView(init);
    return view;
  }
}
