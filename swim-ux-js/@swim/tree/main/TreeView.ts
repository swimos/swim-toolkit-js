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

import {BoxR2} from "@swim/math";
import {Length} from "@swim/length";
import {Transition} from "@swim/transition";
import {
  ViewContextType,
  ViewContext,
  ViewFlags,
  View,
  ViewEdgeInsets,
  ViewScope,
  ViewAnimator,
  ViewNodeType,
  HtmlView,
} from "@swim/view";
import {
  Look,
  Feel,
  MoodVector,
  ThemeMatrix,
  ThemedHtmlViewInit,
  ThemedHtmlView,
} from "@swim/theme";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import {TreeViewContext} from "./TreeViewContext";
import {AnyTreeLimb, TreeLimb, TreeLimbState} from "./TreeLimb";
import {AnyTreeStem, TreeStem} from "./TreeStem";
import {TreeViewObserver} from "./TreeViewObserver";
import {TreeViewController} from "./TreeViewController";

export type AnyTreeView = TreeView | TreeViewInit;

export interface TreeViewInit extends ThemedHtmlViewInit {
  viewController?: TreeViewController;
  limbSpacing?: number;

  seed?: AnyTreeSeed;
  stem?: AnyTreeStem;
  limbs?: AnyTreeLimb[];
  depth?: number;
}

export class TreeView extends ThemedHtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree");
    this.display.setAutoState("block");
    this.position.setAutoState("relative");
    this.opacity.setAutoState(1);
  }

  // @ts-ignore
  declare readonly viewController: TreeViewController | null;

  // @ts-ignore
  declare readonly viewObservers: ReadonlyArray<TreeViewObserver>;

  // @ts-ignore
  declare readonly viewContext: TreeViewContext;

  initView(init: TreeViewInit): void {
    super.initView(init);
    if (init.limbSpacing !== void 0) {
      this.limbSpacing(init.limbSpacing);
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

  @ViewScope({type: TreeSeed, inherit: true})
  seed: ViewScope<this, TreeSeed | undefined, AnyTreeSeed | undefined>;

  @ViewScope<TreeView, number>({
    type: Number,
    state: 0,
    onUpdate(depth: number): void {
      this.view.onUpdateDepth(depth);
    },
  })
  depth: ViewScope<this, number>;

  @ViewScope({type: Object, inherit: true})
  edgeInsets: ViewScope<this, ViewEdgeInsets | undefined>;

  @ViewScope({type: Number, state: 2})
  limbSpacing: ViewScope<this, number>;

  @ViewScope({type: String, inherit: true})
  disclosureState: ViewScope<this, TreeLimbState | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  disclosurePhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  @ViewAnimator({type: Number, inherit: true})
  disclosingPhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const key = childView.key;
    if (key === "stem" && childView instanceof TreeStem) {
      this.onInsertStem(childView);
    } else if (childView instanceof TreeLimb) {
      this.onInsertLimb(childView);
    } else if (key === "topBranch" && childView instanceof HtmlView) {
      this.onInsertTopBranch(childView);
    } else if (key === "bottomBranch" && childView instanceof HtmlView) {
      this.onInsertBottomBranch(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const key = childView.key;
    if (key === "stem" && childView instanceof TreeStem) {
      this.onRemoveStem(childView);
    } else if (childView instanceof TreeLimb) {
      this.onRemoveLimb(childView);
    } else if (key === "topBranch" && childView instanceof HtmlView) {
      this.onRemoveTopBranch(childView);
    } else if (key === "bottomBranch" && childView instanceof HtmlView) {
      this.onRemoveBottomBranch(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertStem(stem: TreeStem): void {
    stem.position.setAutoState("absolute");
    stem.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed._width !== null ? seed._width : void 0;
    stem.width.setAutoState(width);
  }

  protected onRemoveStem(stem: TreeStem): void {
    // hook
  }

  protected onInsertLimb(limb: TreeLimb): void {
    limb.position.setAutoState("absolute");
    limb.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed._width !== null ? seed._width : void 0;
    limb.width.setAutoState(width);
    limb.depth.setAutoState(this.depth.state + 1);
  }

  protected onRemoveLimb(limb: TreeLimb): void {
    // hook
  }

  protected onInsertTopBranch(topBranch: HtmlView): void {
    topBranch.position.setAutoState("absolute");
    topBranch.top.setAutoState(0);
    topBranch.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed._width !== null ? seed._width : void 0;
    topBranch.width.setAutoState(width);
  }

  protected onRemoveTopBranch(topBranch: HtmlView): void {
    // hook
  }

  protected onInsertBottomBranch(bottomBranch: HtmlView): void {
    bottomBranch.position.setAutoState("absolute");
    bottomBranch.bottom.setAutoState(0);
    bottomBranch.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed._width !== null ? seed._width : void 0;
    bottomBranch.width.setAutoState(width);
  }

  protected onRemoveBottomBranch(bottomBranch: HtmlView): void {
    // hook
  }

  protected onUpdateDepth(depth: number): void {
    this.modifyTheme(Feel.default, [Feel.nested, depth !== 0 ? 1 : void 0]);
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    const depth = this.depth.state;
    if (depth !== void 0 && depth !== 0) {
      let superTheme = this.theme.superState;
      if (superTheme === void 0) {
        superTheme = theme;
      }
      const limbView = this.parentView;
      const leafView = limbView instanceof TreeLimb ? limbView.leaf : null;
      const leafMood = leafView !== null ? leafView.moodModifier.state : void 0;
      const superMood = leafMood !== void 0 ? leafMood.transform(mood) : mood;

      const backgroundColor = theme.inner(mood, Look.backgroundColor);
      this.backgroundColor.setAutoState(backgroundColor, transition);

      const accentColor = superTheme.inner(superMood, Look.accentColor);
      const borderColor = superTheme.inner(superMood, Look.borderColor);
      const limbSpacing = this.limbSpacing.getState();

      let bottomBranch = this.getChildView("bottomBranch") as HtmlView | null;
      if (bottomBranch === null) {
        bottomBranch = this.prepend("div", "bottomBranch");
      }
      bottomBranch.height.setAutoState(limbSpacing / 2, transition);
      bottomBranch.backgroundColor.setAutoState(borderColor, transition);
      bottomBranch.zIndex.setAutoState(1000 - depth);

      let topBranch = this.getChildView("topBranch") as HtmlView | null;
      if (topBranch === null) {
        topBranch = this.prepend("div", "topBranch");
      }
      topBranch.height.setAutoState(limbSpacing, transition);
      topBranch.backgroundColor.setAutoState(accentColor, transition);
      topBranch.zIndex.setAutoState(1000 - depth);
    } else {
      this.removeChildView("topBranch");
      this.removeChildView("bottomBranch");
    }
  }

  extendViewContext(viewContext: ViewContext): ViewContextType<this> {
    const treeViewContext = Object.create(viewContext);
    const parentVisibleFrame = (viewContext as TreeViewContext).visibleFrame as BoxR2 | undefined;
    let childVisibleFrame: BoxR2;
    if (parentVisibleFrame !== void 0) {
      const left = this.left.state;
      const x = left instanceof Length ? left.pxValue() : this._node.offsetLeft;
      const top = this.top.state;
      const y = top instanceof Length ? top.pxValue() : this._node.offsetTop;
      childVisibleFrame = new BoxR2(parentVisibleFrame.xMin - x, parentVisibleFrame.yMin - y,
                                    parentVisibleFrame.xMax - x, parentVisibleFrame.yMax - y);
    } else {
      const {x, y} = this._node.getBoundingClientRect();
      childVisibleFrame = new BoxR2(-x, -y, window.innerWidth - x, window.innerHeight - y);
    }
    treeViewContext.visibleFrame = childVisibleFrame;
    return treeViewContext;
  }

  protected modifyUpdate(targetView: View, updateFlags: ViewFlags): ViewFlags {
    let additionalFlags = 0;
    if (targetView instanceof TreeLimb && (updateFlags & View.NeedsAnimate) !== 0) {
      additionalFlags |= View.NeedsAnimate;
    }
    additionalFlags |= super.modifyUpdate(targetView, updateFlags | additionalFlags);
    return additionalFlags;
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this._viewFlags & View.NeedsAnimate) === 0) {
      processFlags &= ~View.NeedsAnimate;
    }
    if ((processFlags & View.NeedsResize) !== 0) {
      processFlags |= View.NeedsScroll | View.NeedsAnimate;
    }
    return processFlags;
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    if (this.display.state !== "none") {
      this.resizeTree();
    }
  }

  protected resizeTree(): void {
    const oldSeed = this.seed.ownState;
    if (oldSeed !== void 0) {
      const superSeed = this.seed.superState;
      let width: number | undefined;
      if (superSeed !== void 0 && superSeed._width !== null) {
        width = superSeed._width.pxValue();
      }
      if (width === void 0) {
        const treeWidth = this.width.state;
        width = treeWidth instanceof Length
              ? treeWidth.pxValue()
              : this._node.offsetWidth;
      }
      const edgeInsets = this.edgeInsets.state;
      const left = edgeInsets !== void 0 ? edgeInsets.insetLeft : 0;
      const right = edgeInsets !== void 0 ? edgeInsets.insetRight : 0;
      const spacing = this.limbSpacing.getState();
      const newSeed = oldSeed.resized(width, left, right, spacing);
      this.seed.setState(newSeed);
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    const disclosurePhase = this.disclosurePhase.value;
    if (disclosurePhase !== void 0) {
      this.opacity.setAutoState(disclosurePhase);
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              callback?: (this: this, childView: View) => void): void {
    const needsScroll = (processFlags & View.NeedsScroll) !== 0;
    const needsChange = (processFlags & View.NeedsChange) !== 0;
    const needsAnimate = (processFlags & View.NeedsAnimate) !== 0;
    const depth = needsChange ? this.depth.getState() : void 0;
    const disclosingPhase = needsAnimate ? this.disclosingPhase.getValueOr(1) : void 0;
    const seed = needsAnimate ? this.seed.state : void 0;
    const width = seed !== void 0 && seed._width !== null ? seed._width : void 0;
    const limbSpacing = needsAnimate ? this.limbSpacing.getState() : 0;
    let y = limbSpacing;
    function animateChildView(this: TreeView, childView: View): void {
      if (needsChange && childView instanceof TreeLimb) {
        const subtree = childView.subtree;
        if (subtree !== null) {
          subtree.depth.setAutoState(depth! + 1);
        }
      }
      if (needsAnimate && childView instanceof HtmlView) {
        if (childView instanceof TreeLimb || childView instanceof TreeStem) {
          const childHeight = childView.height.value;
          const dy = childHeight instanceof Length
                   ? childHeight.pxValue()
                   : childView._node.offsetHeight;
          childView.top.setAutoState(y * disclosingPhase!);
          y += dy * disclosingPhase!;
        }
        childView.width.setAutoState(width);
      }
      if (callback !== void 0) {
        callback.call(this, childView);
      }
      if ((needsScroll || needsAnimate) && childView instanceof HtmlView) {
        const top = childView.top.state;
        const height = childView.height.state;
        if (top instanceof Length && height instanceof Length) {
          const visibleFrame = viewContext.visibleFrame;
          const yMin0 = visibleFrame.yMin;
          const yMax0 = visibleFrame.yMax;
          const yMin1 = top.pxValue();
          const yMax1 = yMin1 + height.pxValue();
          const isVisible = yMin0 <= yMax1 && yMin1 <= yMax0;
          childView.setCulled(!isVisible);
        }
      }
    }
    super.processChildViews(processFlags, viewContext,
                            needsScroll || needsChange || needsAnimate ? animateChildView : callback);
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

  static readonly mountFlags: ViewFlags = ThemedHtmlView.mountFlags | View.NeedsAnimate;
  static readonly powerFlags: ViewFlags = ThemedHtmlView.powerFlags | View.NeedsAnimate;
  static readonly uncullFlags: ViewFlags = ThemedHtmlView.uncullFlags | View.NeedsAnimate;
}
