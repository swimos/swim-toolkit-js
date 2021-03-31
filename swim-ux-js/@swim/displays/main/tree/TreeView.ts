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

import type {Timing} from "@swim/mapping";
import {Length, BoxR2} from "@swim/math";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewFlags,
  View,
  ViewEdgeInsets,
  ViewProperty,
  ViewAnimator,
} from "@swim/view";
import {HtmlViewConstructor, HtmlViewInit, HtmlView} from "@swim/dom";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import type {TreeViewContext} from "./TreeViewContext";
import {AnyTreeLimb, TreeLimb, TreeLimbState} from "./TreeLimb";
import {AnyTreeStem, TreeStem} from "./TreeStem";
import type {TreeViewObserver} from "./TreeViewObserver";
import type {TreeViewController} from "./TreeViewController";

export type AnyTreeView = TreeView | TreeViewInit | HTMLElement;

export interface TreeViewInit extends HtmlViewInit {
  viewController?: TreeViewController;
  limbSpacing?: number;

  seed?: AnyTreeSeed;
  stem?: AnyTreeStem;
  limbs?: AnyTreeLimb[];
  depth?: number;
}

export class TreeView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "visibleViews", {
      value: [],
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "visibleFrame", {
      value: new BoxR2(0, 0, window.innerWidth, window.innerHeight),
      enumerable: true,
      configurable: true,
    });
    this.initTree();
  }

  protected initTree(): void {
    this.addClass("tree");
    this.display.setAutoState("block");
    this.position.setAutoState("relative");
    this.opacity.setAutoState(0);
  }

  declare readonly viewController: TreeViewController | null;

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
    if (key === void 0 && "key" in limb) {
      key = limb.key;
    }
    limb = TreeLimb.fromAny(limb);
    this.appendChildView(limb, key);
    return limb;
  }

  addLimbs(limbs: ReadonlyArray<AnyTreeLimb>): void {
    for (let i = 0, n = limbs.length; i < n; i += 1) {
      this.addLimb(limbs[i]!);
    }
  }

  @ViewProperty({type: TreeSeed, inherit: true, updateFlags: View.NeedsResize | View.NeedsLayout})
  declare seed: ViewProperty<this, TreeSeed | undefined, AnyTreeSeed | undefined>;

  @ViewProperty<TreeView, number>({
    type: Number,
    state: 0,
    onUpdate(depth: number): void {
      this.owner.onUpdateDepth(depth);
    },
  })
  declare depth: ViewProperty<this, number>;

  @ViewProperty({type: Object, inherit: true})
  declare edgeInsets: ViewProperty<this, ViewEdgeInsets | undefined>;

  @ViewProperty({type: Number, state: 2})
  declare limbSpacing: ViewProperty<this, number>;

  @ViewProperty({type: String, inherit: true})
  declare disclosureState: ViewProperty<this, TreeLimbState | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare disclosurePhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  @ViewAnimator({type: Number, inherit: true})
  declare disclosingPhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  /** @hidden */
  declare readonly visibleViews: View[];

  protected onInsertChildView(childView: View, targetView: View | null): void {
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
    const visibleViews = this.visibleViews;
    const visibleIndex = visibleViews.indexOf(childView);
    if (visibleIndex >= 0) {
      visibleViews.splice(visibleIndex, 1);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertStem(stem: TreeStem): void {
    stem.position.setAutoState("absolute");
    stem.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed.width !== null ? seed.width : void 0;
    stem.width.setAutoState(width);
    stem.visibility.setAutoState("hidden");
  }

  protected onRemoveStem(stem: TreeStem): void {
    // hook
  }

  protected onInsertLimb(limb: TreeLimb): void {
    limb.position.setAutoState("absolute");
    limb.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed.width !== null ? seed.width : void 0;
    limb.width.setAutoState(width);
    limb.depth.setAutoState(this.depth.state + 1);
    limb.visibility.setAutoState("hidden");
    limb.setCulled(true);
  }

  protected onRemoveLimb(limb: TreeLimb): void {
    // hook
  }

  protected onInsertTopBranch(topBranch: HtmlView): void {
    topBranch.addClass("branch-top");
    topBranch.position.setAutoState("absolute");
    topBranch.top.setAutoState(0);
    topBranch.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed.width !== null ? seed.width : void 0;
    topBranch.width.setAutoState(width);
    topBranch.visibility.setAutoState("hidden");
  }

  protected onRemoveTopBranch(topBranch: HtmlView): void {
    // hook
  }

  protected onInsertBottomBranch(bottomBranch: HtmlView): void {
    bottomBranch.addClass("branch-bottom");
    bottomBranch.position.setAutoState("absolute");
    bottomBranch.bottom.setAutoState(0);
    bottomBranch.left.setAutoState(0);
    const seed = this.seed.state;
    const width = seed !== void 0 && seed.width !== null ? seed.width : void 0;
    bottomBranch.width.setAutoState(width);
    bottomBranch.visibility.setAutoState("hidden");
  }

  protected onRemoveBottomBranch(bottomBranch: HtmlView): void {
    // hook
  }

  protected onUpdateDepth(depth: number): void {
    this.modifyTheme(Feel.default, [Feel.nested, depth !== 0 ? 1 : void 0]);
  }

  /** @hidden */
  descendantDidSetDisclosurePhase(descendantView: HtmlView, disclosurePhase: number): void {
    this.requireUpdate(View.NeedsLayout);
    const parentView = this.parentView;
    if (parentView instanceof TreeLimb) {
      parentView.descendantDidSetDisclosurePhase(descendantView, disclosurePhase);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    const depth = this.depth.state;
    if (depth !== void 0 && depth !== 0) {
      let superTheme = this.theme.superState;
      if (superTheme === void 0) {
        superTheme = theme;
      }
      const limbView = this.parentView;
      const leafView = limbView instanceof TreeLimb ? limbView.leaf : null;
      const leafMood = leafView !== null ? leafView.moodModifier.state : void 0;
      const superMood = leafMood !== void 0 ? leafMood.timesCol(mood) : mood;

      const backgroundColor = theme.dot(Look.backgroundColor, mood);
      this.backgroundColor.setAutoState(backgroundColor, timing);

      const accentColor = superTheme.dot(Look.accentColor, superMood);
      const borderColor = superTheme.dot(Look.borderColor, superMood);
      const limbSpacing = this.limbSpacing.getState();

      let bottomBranch = this.getChildView("bottomBranch") as HtmlView | null;
      if (bottomBranch === null) {
        bottomBranch = this.prepend("div", "bottomBranch");
      }
      bottomBranch.height.setAutoState(limbSpacing / 2, timing);
      bottomBranch.backgroundColor.setAutoState(borderColor, timing);
      bottomBranch.zIndex.setAutoState(1000 - depth);

      let topBranch = this.getChildView("topBranch") as HtmlView | null;
      if (topBranch === null) {
        topBranch = this.prepend("div", "topBranch");
      }
      topBranch.height.setAutoState(limbSpacing, timing);
      topBranch.backgroundColor.setAutoState(accentColor, timing);
      topBranch.zIndex.setAutoState(1000 - depth);
    } else {
      this.removeChildView("topBranch");
      this.removeChildView("bottomBranch");
    }
  }

  /** @hidden */
  declare readonly visibleFrame: BoxR2;

  protected detectVisibleFrame(viewContext: ViewContext): BoxR2 {
    const xBleed = 0;
    const yBleed = 64;
    const parentVisibleFrame = (viewContext as TreeViewContext).visibleFrame as BoxR2 | undefined;
    if (parentVisibleFrame !== void 0) {
      const left = this.left.state;
      const x = left instanceof Length ? left.pxValue() : 0;
      const top = this.top.state;
      const y = top instanceof Length ? top.pxValue() : 0;
      return new BoxR2(parentVisibleFrame.xMin - x - xBleed, parentVisibleFrame.yMin - y - yBleed,
                       parentVisibleFrame.xMax - x + xBleed, parentVisibleFrame.yMax - y + yBleed);
    } else {
      const {x, y} = this.node.getBoundingClientRect();
      return new BoxR2(-x - xBleed,
                       -y - yBleed,
                       window.innerWidth - x + xBleed,
                       window.innerHeight - y + yBleed);
    }
  }

  extendViewContext(viewContext: ViewContext): ViewContextType<this> {
    const treeViewContext = Object.create(viewContext);
    treeViewContext.visibleFrame = this.visibleFrame;
    return treeViewContext;
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsResize) !== 0) {
      processFlags |= View.NeedsScroll;
    }
    return processFlags;
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeTree();
  }

  protected resizeTree(): void {
    const oldSeed = !this.seed.isInherited() ? this.seed.state : void 0;
    if (oldSeed !== void 0) {
      const superSeed = this.seed.superState;
      let width: Length | string | number | undefined = void 0;
      if (superSeed !== void 0 && superSeed.width !== null) {
        width = superSeed.width.pxValue();
      }
      if (width === void 0) {
        width = this.width.state;
        width = width instanceof Length ? width.pxValue() : this.node.offsetWidth;
      }
      const edgeInsets = this.edgeInsets.state;
      const left = edgeInsets !== void 0 ? edgeInsets.insetLeft : 0;
      const right = edgeInsets !== void 0 ? edgeInsets.insetRight : 0;
      const spacing = this.limbSpacing.getState();
      const newSeed = oldSeed.resized(width, left, right, spacing);
      this.seed.setState(newSeed);
    }
  }

  protected processVisibleViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                                processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                   viewContext: ViewContextType<this>) => void): void {
    const visibleViews = this.visibleViews;
    let i = 0;
    while (i < visibleViews.length) {
      const childView = visibleViews[i]!;
      processChildView.call(this, childView, processFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
        continue;
      }
      i += 1;
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if (!this.isCulled()) {
      if ((processFlags & (View.NeedsScroll | View.NeedsChange)) !== 0) {
        this.scrollChildViews(processFlags, viewContext, processChildView);
      } else {
        this.processVisibleViews(processFlags, viewContext, processChildView);
      }
    }
  }

  protected scrollChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                             processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    const depth = this.depth.getState();

    const visibleViews = this.visibleViews;
    visibleViews.length = 0;

    const visibleFrame = this.detectVisibleFrame(Object.getPrototypeOf(viewContext));
    (viewContext as any).visibleFrame = visibleFrame;
    Object.defineProperty(this, "visibleFrame", {
      value: visibleFrame,
      enumerable: true,
      configurable: true,
    });

    type self = this;
    function scrollChildView(this: self, childView: View, processFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if ((processFlags & View.NeedsChange) !== 0 && childView instanceof TreeLimb) {
        const subtree = childView.subtree;
        if (subtree !== null) {
          subtree.depth.setAutoState(depth + 1);
        }
      }
      let isVisible: boolean;
      if (childView instanceof HtmlView) {
        const top = childView.top.state;
        const height = childView.height.state;
        if (top instanceof Length && height instanceof Length) {
          const yMin0 = visibleFrame.yMin;
          const yMax0 = visibleFrame.yMax;
          const yMin1 = top.pxValue();
          const yMax1 = yMin1 + height.pxValue();
          isVisible = yMin0 <= yMax1 && yMin1 <= yMax0;
          childView.visibility.setAutoState(isVisible ? "visible" : "hidden");
          childView.setCulled(!isVisible);
        } else {
          isVisible = true;
        }
      } else {
        isVisible = true;
      }
      if (isVisible) {
        visibleViews.push(childView);
        processChildView.call(this, childView, processFlags, viewContext);
      }
    }
    super.processChildViews(processFlags, viewContext, scrollChildView);
  }

  protected displayVisibleViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                   viewContext: ViewContextType<this>) => void): void {
    const visibleViews = this.visibleViews;
    let i = 0;
    while (i < visibleViews.length) {
      const childView = visibleViews[i]!;
      displayChildView.call(this, childView, displayFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
        continue;
      }
      i += 1;
    }
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildViews(displayFlags, viewContext, displayChildView);
    } else {
      this.displayVisibleViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    this.resizeTree();
    const seed = this.seed.state;
    let width: Length | undefined;
    if (seed !== void 0 && seed.width !== null) {
      width = seed.width;
    }

    let yValue = this.limbSpacing.getState();
    let yState = yValue;
    const disclosingPhase = this.disclosingPhase.getValueOr(1);

    const visibleViews = this.visibleViews;
    visibleViews.length = 0;

    const visibleFrame = this.detectVisibleFrame(Object.getPrototypeOf(viewContext));
    (viewContext as any).visibleFrame = visibleFrame;
    Object.defineProperty(this, "visibleFrame", {
      value: visibleFrame,
      enumerable: true,
      configurable: true,
    });

    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      let isVisible: boolean;
      if (childView instanceof HtmlView) {
        childView.width.setAutoState(width);
        if (childView instanceof TreeLimb || childView instanceof TreeStem) {
          if (childView.top.isAuto()) {
            childView.top.setIntermediateValue(Length.px(yValue * disclosingPhase), Length.px(yState));
          }
        }
        const top = childView.top.state;
        const height = childView.height.state;
        if (top instanceof Length && height instanceof Length) {
          const yMin0 = visibleFrame.yMin;
          const yMax0 = visibleFrame.yMax;
          const yMin1 = top.pxValue();
          const yMax1 = yMin1 + height.pxValue();
          isVisible = yMin0 <= yMax1 && yMin1 <= yMax0;
        } else {
          isVisible = true;
        }
        childView.visibility.setAutoState(isVisible ? "visible" : "hidden");
        childView.setCulled(!isVisible);
      } else {
        isVisible = true;
      }
      if (isVisible) {
        visibleViews.push(childView);
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
      if (childView instanceof TreeLimb || childView instanceof TreeStem) {
        let heightValue: Length | string | number | undefined = childView.height.value;
        heightValue = heightValue instanceof Length ? heightValue.pxValue() : childView.node.offsetHeight;
        let heightState: Length | string | number | undefined = childView.height.state;
        heightState = heightState instanceof Length ? heightState.pxValue() : heightValue;
        yValue += heightValue * disclosingPhase;
        yState += heightState;
      }
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);

    if (this.height.isAuto()) {
      this.height.setIntermediateValue(Length.px(yValue), Length.px(yState));
    }

    const disclosurePhase = this.disclosurePhase.getValueOr(1);
    this.opacity.setAutoState(disclosurePhase);
  }

  static fromInit(init: TreeViewInit): TreeView {
    const view = TreeView.create();
    view.initView(init);
    return view;
  }

  static fromAny<S extends HtmlViewConstructor<InstanceType<S>>>(this: S, value: InstanceType<S> | HTMLElement): InstanceType<S>;
  static fromAny(value: AnyTreeView): TreeView;
  static fromAny(value: AnyTreeView): TreeView {
    if (value instanceof this) {
      return value;
    } else if (value instanceof HTMLElement) {
      return this.fromNode(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
