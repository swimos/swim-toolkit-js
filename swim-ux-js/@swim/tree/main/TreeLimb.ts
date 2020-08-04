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

import {Length} from "@swim/length";
import {Tween, Transition} from "@swim/transition";
import {ViewContextType, View, ViewScope, ViewAnimator, ViewNodeType, HtmlView} from "@swim/view";
import {Look, ThemedHtmlViewInit, ThemedHtmlView} from "@swim/theme";
import {AnyTreeLeaf, TreeLeaf} from "./TreeLeaf";
import {TreeLimbObserver} from "./TreeLimbObserver";
import {TreeLimbController} from "./TreeLimbController";
import {AnyTreeView, TreeView} from "./TreeView";

export type AnyTreeLimb = TreeLimb | TreeLimbInit;

export interface TreeLimbInit extends ThemedHtmlViewInit {
  viewController?: TreeLimbController;
  expanded?: boolean;

  leaf?: AnyTreeLeaf;
  tree?: AnyTreeView;
}

export type TreeLimbState = "collapsed" | "expanding" | "expanded" | "collapsing";

export class TreeLimb extends ThemedHtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree-limb");
    this.position.setAutoState("relative");
  }

  readonly viewController: TreeLimbController | null;

  readonly viewObservers: ReadonlyArray<TreeLimbObserver>;

  initView(init: TreeLimbInit): void {
    super.initView(init);
    if (init.expanded === true) {
      this.expand();
    } else if (init.expanded === false) {
      this.collapse();
    }

    if (init.leaf !== void 0) {
      this.setLeaf(init.leaf);
    }
    if (init.tree !== void 0) {
      this.setTree(init.tree);
    }
  }

  get leaf(): TreeLeaf | null {
    const childView = this.getChildView("leaf");
    return childView instanceof TreeLeaf ? childView : null;
  }

  setLeaf(leaf: AnyTreeLeaf | null): void {
    if (leaf !== null) {
      leaf = TreeLeaf.fromAny(leaf);
    }
    this.setChildView("leaf", leaf);
  }

  get tree(): TreeView | null {
    const childView = this.getChildView("tree");
    return childView instanceof TreeView ? childView : null;
  }

  setTree(tree: AnyTreeView | null): void {
    if (tree !== null) {
      tree = TreeView.fromAny(tree);
    }
    this.setChildView("tree", tree);
  }

  isExpanded(): boolean {
    const disclosureState = this.disclosureState.state;
    return disclosureState === "expanded" || disclosureState === "expanding";
  }

  isCollapsed(): boolean {
    const disclosureState = this.disclosureState.state;
    return disclosureState === "collapsed" || disclosureState === "collapsing";
  }

  @ViewScope(Object, {value: "collapsed"})
  disclosureState: ViewScope<this, TreeLimbState>;

  @ViewAnimator(Number, {value: 0})
  disclosurePhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Number, {inherit: true})
  disclosingPhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewScope(Number, {inherit: true})
  limbSpacing: ViewScope<this, number>;

  expand(tween?: Tween<any>): void {
    const disclosurePhase = this.disclosurePhase.value;
    if (this.isCollapsed() || disclosurePhase !== 1) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willExpand(tween);
      if (tween !== null) {
        if (disclosurePhase !== 1) {
          this.disclosurePhase.setState(1, tween.onEnd(this.didExpand.bind(this, tween)));
          this.disclosingPhase.setState(this.disclosurePhase.value);
          this.disclosingPhase.setState(1, tween);
        } else {
          setTimeout(this.didExpand.bind(this, tween));
        }
      } else {
        this.disclosurePhase.setState(1);
        this.disclosingPhase.setState(1);
        this.didExpand(tween);
      }
    }
  }

  protected willExpand(tween: Tween<any>): void {
    this.willObserve(function (viewObserver: TreeLimbObserver): void {
      if (viewObserver.limbWillExpand !== void 0) {
        viewObserver.limbWillExpand(this);
      }
    });
    this.disclosureState.setAutoState("expanding");
    this.requireUpdate(View.NeedsResize | View.NeedsChange);
    const tree = this.tree;
    if (tree !== null) {
      tree.display.setAutoState("block");
    }
  }

  protected didExpand(tween: Tween<any>): void {
    this.disclosureState.setAutoState("expanded");
    this.disclosingPhase.setState(void 0);
    this.didObserve(function (viewObserver: TreeLimbObserver): void {
      if (viewObserver.limbDidExpand !== void 0) {
        viewObserver.limbDidExpand(this);
      }
    });
  }

  collapse(tween?: Tween<any>): void {
    const disclosurePhase = this.disclosurePhase.value;
    if (this.isExpanded() || disclosurePhase !== 0) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willCollapse(tween);
      if (tween !== null) {
        if (disclosurePhase !== 0) {
          this.disclosurePhase.setState(0, tween.onEnd(this.didCollapse.bind(this, tween)));
          this.disclosingPhase.setState(this.disclosurePhase.value);
          this.disclosingPhase.setState(0, tween);
        } else {
          setTimeout(this.didCollapse.bind(this, tween));
        }
      } else {
        this.disclosurePhase.setState(0);
        this.disclosingPhase.setState(0);
        this.didCollapse(tween);
      }
    }
  }

  protected willCollapse(tween: Tween<any>): void {
    this.willObserve(function (viewObserver: TreeLimbObserver): void {
      if (viewObserver.limbWillCollapse !== void 0) {
        viewObserver.limbWillCollapse(this);
      }
    });
    this.disclosureState.setAutoState("collapsing");
    const tree = this.tree;
    if (tree !== null) {
      tree.height.setAutoState(0, tween);
    }
  }

  protected didCollapse(tween: Tween<any>): void {
    this.disclosureState.setAutoState("collapsed");
    this.disclosingPhase.setState(void 0);
    this.requireUpdate(View.NeedsResize);
    const tree = this.tree;
    if (tree !== null) {
      tree.display.setAutoState("none");
    }
    this.didObserve(function (viewObserver: TreeLimbObserver): void {
      if (viewObserver.limbDidCollapse !== void 0) {
        viewObserver.limbDidCollapse(this);
      }
    });
  }

  toggle(tween?: Tween<any>): void {
    const disclosureState = this.disclosureState.getStateOr("collapsed");
    if (disclosureState === "collapsed" || disclosureState === "collapsing") {
      this.expand(tween);
    } else if (disclosureState === "expanded" || disclosureState === "expanding") {
      this.collapse(tween);
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "leaf" && childView instanceof TreeLeaf) {
      this.onInsertLeaf(childView);
    } else if (childView.key === "tree" && childView instanceof TreeView) {
      this.onInsertTree(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView.key === "leaf" && childView instanceof TreeLeaf) {
      this.onRemoveLeaf(childView);
    } else if (childView.key === "tree" && childView instanceof TreeView) {
      this.onRemoveTree(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertLeaf(leaf: TreeLeaf): void {
    leaf.position.setAutoState("absolute");
  }

  protected onRemoveLeaf(leaf: TreeLeaf): void {
    // hook
  }

  protected onInsertTree(tree: TreeView): void {
    tree.display.setAutoState(this.isExpanded() ? "block" : "none");
    tree.position.setAutoState("absolute");
    tree.left.setAutoState(0);
    tree.right.setAutoState(0);
  }

  protected onRemoveTree(tree: TreeView): void {
    // hook
  }

  protected didAnimate(viewContext: ViewContextType<this>): void {
    this.layoutLimb();
    super.didAnimate(viewContext);
  }

  protected layoutLimb(): void {
    const disclosingPhase = this.disclosureState.state === "expanded"
                          ? this.disclosingPhase.getValueOr(1)
                          : 1;
    const limbSpacing = this.limbSpacing.getStateOr(0);
    let y = 0;
    const leaf = this.leaf;
    if (leaf !== null) {
      const leafHeight = leaf.height.value;
      const dy = leafHeight instanceof Length
               ? leafHeight.pxValue()
               : leaf._node.offsetHeight;
      leaf.top.setAutoState(y * disclosingPhase);
      leaf.left.setAutoState(limbSpacing);
      leaf.right.setAutoState(limbSpacing);
      y += dy * disclosingPhase;
    }
    const tree = this.tree;
    if (tree !== null && this.disclosureState.state !== "collapsed") {
      const limbHeight = tree.height.value;
      const dy = limbHeight instanceof Length
               ? limbHeight.pxValue()
               : tree._node.offsetHeight;
      tree.top.setAutoState(y * disclosingPhase);
      y += dy * disclosingPhase;
    } else {
      y += limbSpacing * disclosingPhase;
    }
    this.height.setAutoState(y);
  }

  static fromAny(limb: AnyTreeLimb): TreeLimb {
    if (limb instanceof TreeLimb) {
      return limb;
    } else if (typeof limb === "object" && limb !== null) {
      return TreeLimb.fromInit(limb);
    }
    throw new TypeError("" + limb);
  }

  static fromInit(init: TreeLimbInit): TreeLimb {
    const view = HtmlView.create(TreeLimb);
    view.initView(init);
    return view;
  }
}
