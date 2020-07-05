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
import {AnyColor, Color} from "@swim/color";
import {Ease, AnyTransition, Transition} from "@swim/transition";
import {
  ViewContext,
  ViewFlags,
  View,
  ViewEdgeInsets,
  ViewScope,
  ViewAnimator,
  ViewNodeType,
  HtmlViewInit,
  HtmlView,
} from "@swim/view";
import {HandlebarView, TopHandlebarView, BottomHandlebarView} from "@swim/motif";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import {AnyTreeLimb, TreeLimb, TreeLimbState} from "./TreeLimb";
import {AnyTreeStem, TreeStem} from "./TreeStem";
import {TreeViewController} from "./TreeViewController";

export type AnyTreeView = TreeView | TreeViewInit;

export interface TreeViewInit extends HtmlViewInit {
  viewController?: TreeViewController;
  treeTransition?: AnyTransition<any>;
  limbSpacing?: number;
  branchColor?: AnyColor;
  depthColor?: AnyColor;

  seed?: AnyTreeSeed;
  stem?: AnyTreeStem;
  limbs?: AnyTreeLimb[];
  depth?: number;
}

export class TreeView extends HtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree");
    this.position.setAutoState("relative");
    this.opacity.setAutoState(1);
  }

  get viewController(): TreeViewController | null {
    return this._viewController;
  }

  initView(init: TreeViewInit): void {
    super.initView(init);
    if (init.depthColor !== void 0) {
      this.depthColor(init.depthColor);
    }
    if (init.branchColor !== void 0) {
      this.branchColor(init.branchColor);
    }
    if (init.limbSpacing !== void 0) {
      this.limbSpacing(init.limbSpacing);
    }
    if (init.treeTransition !== void 0) {
      this.treeTransition(init.treeTransition);
    }

    if (init.seed !== void 0) {
      this.seed(init.seed);
    }
    if (init.stem !== void 0) {
      this.setStem(init.stem);
    }
    if (init.limbs !== void 0) {
      this.addLimbs(init.limbs);
    }
    if (init.depth !== void 0) {
      this.depth(init.depth);
    }
  }

  get stem(): TreeStem | null {
    const childView = this.getChildView("stem");
    return childView instanceof TreeStem ? childView : null;
  }

  setStem(stem: AnyTreeStem | null): void {
    if (stem !== null) {
      stem = TreeStem.fromAny(stem);
    }
    this.setChildView("stem", stem);
  }

  addLimb(limb: AnyTreeLimb, key?: string): TreeLimb {
    if (key === void 0) {
      key = limb.key;
    }
    limb = TreeLimb.fromAny(limb);
    this.appendChildView(limb, key);
    return limb;
  }

  addLimbs(limbs: ReadonlyArray<AnyTreeLimb>): void {
    for (let i = 0, n = limbs.length; i < n; i += 1) {
      this.addLimb(limbs[i]);
    }
  }

  @ViewScope(TreeSeed, {inherit: true})
  seed: ViewScope<this, TreeSeed, AnyTreeSeed>;

  @ViewScope(Number, {value: 0})
  depth: ViewScope<this, number>;

  @ViewScope(Transition, {
    init(): Transition<any> {
      return Transition.duration(250, Ease.cubicOut);
    },
  })
  treeTransition: ViewScope<this, Transition<any>, AnyTransition<any>>;

  @ViewScope(Object, {inherit: true})
  edgeInsets: ViewScope<this, ViewEdgeInsets>;

  @ViewScope(Number, {value: 2})
  limbSpacing: ViewScope<this, number>;

  @ViewScope(Object, {inherit: true})
  disclosureState: ViewScope<this, TreeLimbState>;

  @ViewAnimator(Number, {inherit: true})
  disclosurePhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Number, {inherit: true})
  disclosingPhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Color, {value: Color.parse("#44d7b6")})
  branchColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Color, {value: Color.parse("#1e2022")})
  depthColor: ViewAnimator<this, Color, AnyColor>;

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "stem" && childView instanceof TreeStem) {
      this.onInsertStem(childView);
    } else if (childView instanceof TreeLimb) {
      this.onInsertLimb(childView);
    } else if (childView instanceof HandlebarView) {
      this.onInsertBranch(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView.key === "stem" && childView instanceof TreeStem) {
      this.onRemoveStem(childView);
    } else if (childView instanceof TreeLimb) {
      this.onRemoveLimb(childView);
    } else if (childView instanceof HandlebarView) {
      this.onRemoveBranch(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertStem(stem: TreeStem): void {
    stem.position.setAutoState("absolute");
    stem.left.setAutoState(0);
    stem.right.setAutoState(0);
  }

  protected onRemoveStem(stem: TreeStem): void {
    // hook
  }

  protected onInsertLimb(limb: TreeLimb): void {
    limb.position.setAutoState("absolute");
    limb.left.setAutoState(0);
    limb.right.setAutoState(0);
    const tree = limb.tree;
    if (tree !== null) {
      tree.depth.setState(this.depth.getState() + 1);
    }
  }

  protected onRemoveLimb(limb: TreeLimb): void {
    // hook
  }

  protected onInsertBranch(branch: HandlebarView): void {
    // hook
  }

  protected onRemoveBranch(branch: HandlebarView): void {
    // hook
  }

  protected onMount(): void {
    super.onMount();
    this.requireUpdate(View.NeedsCompute);
  }

  protected modifyUpdate(targetView: View, updateFlags: ViewFlags): ViewFlags {
    let additionalFlags = 0;
    if (targetView instanceof TreeLimb && (updateFlags & View.NeedsAnimate) !== 0) {
      additionalFlags |= View.NeedsAnimate;
    }
    additionalFlags |= super.modifyUpdate(targetView, updateFlags | additionalFlags);
    return additionalFlags;
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContext): ViewFlags {
    if ((processFlags & View.NeedsLayout) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected onResize(viewContext: ViewContext): void {
    super.onResize(viewContext);
    this.resizeTree();
  }

  protected resizeTree(): void {
    const oldSeed = this.seed.ownState;
    if (oldSeed !== void 0) {
      const treeWith = this.width.state;
      const width = treeWith instanceof Length
                  ? treeWith.pxValue()
                  : this._node.offsetWidth;
      const edgeInsets = this.edgeInsets.state;
      const left = edgeInsets !== void 0 ? edgeInsets.insetLeft : 0;
      const right = edgeInsets !== void 0 ? edgeInsets.insetRight : 0;
      const spacing = this.limbSpacing.getState();
      const newSeed = oldSeed.resized(width, left, right, spacing);
      this.seed.setState(newSeed);
    }
  }

  protected onCompute(viewContext: ViewContext): void {
    const depth = this.depth.state;
    if (depth !== void 0) {
      this.updateBranches(depth);
    }
  }

  protected updateBranches(depth: number): void {
    const depthColor = depth !== 0 ? this.depthColor.getState().darker(0.33 * depth) : void 0;
    this.backgroundColor.setAutoState(depthColor);

    if (depth !== 0) {
      const armRadius = 8;
      const limbSpacing = this.limbSpacing.getState();
      const branchColor = this.branchColor.getState().darker(0.75 * depth);

      let bottomBranch = this.getChildView("bottomBranch") as BottomHandlebarView | null;
      if (bottomBranch === null) {
        bottomBranch = HtmlView.create(BottomHandlebarView);
        this.prepend(bottomBranch, "bottomBranch");
      }
      bottomBranch.thickness.setAutoState(limbSpacing);
      bottomBranch.armRadius.setAutoState(armRadius);
      bottomBranch.tipRadius.setAutoState(1.5 * limbSpacing);
      bottomBranch.iconColor.setAutoState(branchColor);
      bottomBranch.zIndex(Math.max(0, 1000 - depth));

      let topBranch = this.getChildView("topBranch") as TopHandlebarView | null;
      if (topBranch === null) {
        topBranch = HtmlView.create(TopHandlebarView);
        this.prepend(topBranch, "topBranch");
      }
      topBranch.thickness.setAutoState(limbSpacing);
      topBranch.armRadius.setAutoState(armRadius);
      topBranch.tipRadius.setAutoState(1.5 * limbSpacing);
      topBranch.iconColor.setAutoState(branchColor);
      topBranch.zIndex(Math.max(0, 1000 - depth));

      this.borderTopLeftRadius.setAutoState(armRadius);
      this.borderTopRightRadius.setAutoState(armRadius);
      this.borderBottomLeftRadius.setAutoState(armRadius);
      this.borderBottomRightRadius.setAutoState(armRadius);
    } else {
      this.removeChildView("topBranch");
      this.removeChildView("bottomBranch");
    }
  }

  protected onAnimate(viewContext: ViewContext): void {
    super.onAnimate(viewContext);
    const disclosurePhase = this.disclosurePhase.value;
    if (disclosurePhase !== void 0) {
      this.opacity.setAutoState(disclosurePhase);
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContext,
                              callback?: (this: this, childView: View) => void): void {
    const needsCompute = (processFlags & View.NeedsCompute) !== 0;
    const needsAnimate = (processFlags & View.NeedsAnimate) !== 0;
    const depth = needsCompute ? this.depth.getState() : void 0;
    const disclosingPhase = needsAnimate ? this.disclosingPhase.getValueOr(1) : void 0;
    const limbSpacing = needsAnimate ? this.limbSpacing.getState() : 0;
    let y = limbSpacing;
    function processChildView(this: TreeView, childView: View): void {
      if (needsCompute && childView instanceof TreeLimb) {
        const childTree = childView.tree;
        if (childTree !== null) {
          childTree.depth.setState(depth! + 1);
        }
      }
      if (needsAnimate && (childView instanceof TreeLimb || childView instanceof TreeStem)) {
        const childHeight = childView.height.value;
        const dy = childHeight instanceof Length
                 ? childHeight.pxValue()
                 : childView._node.offsetHeight;
        childView.top.setAutoState(y * disclosingPhase!);
        y += dy * disclosingPhase!;
      }
      if (callback !== void 0) {
        callback.call(this, childView);
      }
    }
    super.processChildViews(processFlags, viewContext,
                            needsCompute || needsAnimate ? processChildView : callback);
    if (needsAnimate) {
      this.height.setAutoState(y);
    }
  }

  static fromAny(tree: AnyTreeView): TreeView {
    if (tree instanceof TreeView) {
      return tree;
    } else if (typeof tree === "object" && tree !== null) {
      return TreeView.fromInit(tree);
    }
    throw new TypeError("" + tree);
  }

  static fromInit(init: TreeViewInit): TreeView {
    const view = HtmlView.create(TreeView);
    view.initView(init);
    return view;
  }
}
