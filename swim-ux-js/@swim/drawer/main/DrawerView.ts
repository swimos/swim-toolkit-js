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

import {AnyTiming, Timing} from "@swim/mapping";
import {AnyLength, Length} from "@swim/math";
import {Color} from "@swim/color";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  View,
  ViewEdgeInsets,
  ModalOptions,
  ModalState,
  Modal,
  ViewProperty,
  ViewAnimator,
} from "@swim/view";
import {HtmlViewInit, HtmlView} from "@swim/dom";
import type {DrawerViewObserver} from "./DrawerViewObserver";
import type {DrawerViewController} from "./DrawerViewController";

export type DrawerPlacement = "top" | "right" | "bottom" | "left";

export type DrawerState = "hidden" | "hiding"
                        | "shown" | "showing"
                        | "collapsed" | "collapsing";

export interface DrawerViewInit extends HtmlViewInit {
  viewController?: DrawerViewController;
  drawerPlacement?: DrawerPlacement;
  collapsedWidth?: AnyLength;
  expandedWidth?: AnyLength;
}

export class DrawerView extends HtmlView implements Modal {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "displayState", {
      value: DrawerView.HiddenState,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "placement", {
      value: "left",
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modality", {
      value: true,
      enumerable: true,
      configurable: true,
    });
    this.initDrawer();
    this.initTheme();
  }

  protected initDrawer(): void {
    this.addClass("drawer");
    this.display.setAutoState("none");
    this.flexDirection.setAutoState("column");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("auto");
    this.overscrollBehaviorY.setAutoState("contain");
    this.overflowScrolling.setAutoState("touch");
  }

  protected initTheme(): void {
    this.modifyTheme(Feel.default, [Feel.raised, 1]);
  }

  declare readonly viewController: DrawerViewController | null;

  declare readonly viewObservers: ReadonlyArray<DrawerViewObserver>;

  initView(init: DrawerViewInit): void {
    super.initView(init);
    if (init.drawerPlacement !== void 0) {
      this.drawerPlacement(init.drawerPlacement);
    }
    if (init.collapsedWidth !== void 0) {
      this.collapsedWidth(init.collapsedWidth);
    }
    if (init.expandedWidth !== void 0) {
      this.expandedWidth(init.expandedWidth);
    }
  }

  /** @hidden */
  declare readonly displayState: number;

  /** @hidden */
  setDisplayState(displayState: number): void {
    Object.defineProperty(this, "displayState", {
      value: displayState,
      enumerable: true,
      configurable: true,
    });
  }

  get drawerState(): DrawerState {
    switch (this.displayState) {
      case DrawerView.HiddenState: return "hidden";
      case DrawerView.HidingState:
      case DrawerView.HideState: return "hiding";
      case DrawerView.ShownState: return "shown";
      case DrawerView.ShowingState:
      case DrawerView.ShowState: return "showing";
      case DrawerView.CollapsedState: return "collapsed";
      case DrawerView.CollapsingState:
      case DrawerView.CollapseState: return "collapsing";
      case DrawerView.ExpandingState:
      case DrawerView.ExpandState: return "shown";
      default: throw new Error("" + this.displayState);
    }
  }

  isShown(): boolean {
    switch (this.displayState) {
      case DrawerView.ShownState:
      case DrawerView.ShowingState:
      case DrawerView.ShowState:
      case DrawerView.ExpandingState:
      case DrawerView.ExpandState: return true;
      default: return false;
    }
  }

  isHidden(): boolean {
    switch (this.displayState) {
      case DrawerView.HiddenState:
      case DrawerView.HidingState:
      case DrawerView.HideState: return true;
      default: return false;
    }
  }

  isCollapsed(): boolean {
    switch (this.displayState) {
      case DrawerView.CollapsedState:
      case DrawerView.CollapsingState:
      case DrawerView.CollapseState: return true;
      default: return false;
    }
  }

  @ViewAnimator({type: Length, state: Length.px(60)})
  declare collapsedWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(200)})
  declare expandedWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Number, state: 0, updateFlags: View.NeedsAnimate})
  declare drawerSlide: ViewAnimator<this, number>; // 0 = hidden; 1 = shown

  @ViewAnimator({type: Number, state: 1, updateFlags: View.NeedsAnimate})
  declare drawerStretch: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  /** @hidden */
  declare readonly placement: DrawerPlacement;

  drawerPlacement(): DrawerPlacement;
  drawerPlacement(drawerPlacement: DrawerPlacement): this;
  drawerPlacement(newPlacement?: DrawerPlacement): DrawerPlacement | this {
    const oldPlacement = this.placement;
    if (newPlacement === void 0) {
      return oldPlacement;
    } else {
      if (oldPlacement !== newPlacement) {
        this.willSetDrawerPlacement(newPlacement, oldPlacement);
        Object.defineProperty(this, "placement", {
          value: newPlacement,
          enumerable: true,
          configurable: true,
        });
        this.onSetDrawerPlacement(newPlacement, oldPlacement);
        this.didSetDrawerPlacement(newPlacement, oldPlacement);
      }
      return this;
    }
  }

  isHorizontal(): boolean {
    return this.placement === "top" || this.placement === "bottom";
  }

  isVertical(): boolean {
    return this.placement === "left" || this.placement === "right";
  }

  get effectiveWidth(): Length {
    const width = this.width.value;
    if (this.placement === "left") {
      const left = this.left.value;
      if (width instanceof Length && left instanceof Length) {
        return width.plus(left);
      }
    } else if (this.placement === "right") {
      const right = this.left.value;
      if (width instanceof Length && right instanceof Length) {
        return width.plus(right);
      }
    }
    if (width instanceof Length) {
      return width;
    } else {
      return Length.px(this.clientBounds.width);
    }
  }

  get effectiveHeight(): Length {
    const height = this.height.value;
    if (this.placement === "top") {
      const top = this.top.value;
      if (height instanceof Length && top instanceof Length) {
        return height.plus(top);
      }
    } else if (this.placement === "bottom") {
      const bottom = this.bottom.value;
      if (height instanceof Length && bottom instanceof Length) {
        return height.plus(bottom);
      }
    }
    if (height instanceof Length) {
      return height;
    } else {
      return Length.px(this.clientBounds.height);
    }
  }

  @ViewProperty({type: Object, inherit: true})
  declare edgeInsets: ViewProperty<this, ViewEdgeInsets | undefined>;

  protected willSetDrawerPlacement(newPlacement: DrawerPlacement, oldPlacement: DrawerPlacement): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerWillSetPlacement !== void 0) {
      viewController.drawerWillSetPlacement(newPlacement, oldPlacement, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerWillSetPlacement !== void 0) {
        viewObserver.drawerWillSetPlacement(newPlacement, oldPlacement, this);
      }
    }
  }

  protected onSetDrawerPlacement(newPlacement: DrawerPlacement, oldPlacement: DrawerPlacement): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetDrawerPlacement(newPlacement: DrawerPlacement, oldPlacement: DrawerPlacement): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerDidSetPlacement !== void 0) {
        viewObserver.drawerDidSetPlacement(newPlacement, oldPlacement, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerDidSetPlacement !== void 0) {
      viewController.drawerDidSetPlacement(newPlacement, oldPlacement, this);
    }
  }

  /** @hidden */
  protected updateDrawerSlide(drawerSlide: number): void {
    const placement = this.placement;
    if (placement === "top") {
      this.updateDrawerSlideTop(drawerSlide);
    } else if (placement === "right") {
      this.updateDrawerSlideRight(drawerSlide);
    } else if (placement === "bottom") {
      this.updateDrawerSlideBottom(drawerSlide);
    } else if (placement === "left") {
      this.updateDrawerSlideLeft(drawerSlide);
    }
  }

  /** @hidden */
  protected updateDrawerSlideTop(drawerSlide: number): void {
    this.top.setAutoState(Length.px((drawerSlide - 1) * this.node.offsetHeight));
  }

  /** @hidden */
  protected updateDrawerSlideRight(drawerSlide: number): void {
    this.right.setAutoState(Length.px((drawerSlide - 1) * this.node.offsetWidth));
  }

  /** @hidden */
  protected updateDrawerSlideBottom(drawerSlide: number): void {
    this.bottom.setAutoState(Length.px((drawerSlide - 1) * this.node.offsetHeight));
  }

  /** @hidden */
  protected updateDrawerSlideLeft(drawerSlide: number): void {
    this.left.setAutoState(Length.px((drawerSlide - 1) * this.node.offsetWidth));
  }

  /** @hidden */
  protected updateDrawerStretch(drawerStretch: number): void {
    if (this.isVertical()) {
      const collapsedWidth = this.collapsedWidth.getValue();
      const expandedWidth = this.expandedWidth.getValue();
      const width = collapsedWidth.times(1 - drawerStretch).plus(expandedWidth.times(drawerStretch));
      this.width.setAutoState(width);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(theme.dot(Look.backgroundColor, mood), timing);
    }
  }

  protected willAnimate(viewContext: ViewContextType<this>): void {
    super.willAnimate(viewContext);
    const displayState = this.displayState;
    if (displayState === DrawerView.ShowState) {
      this.willShow();
    } else if (displayState === DrawerView.HideState) {
      this.willHide();
    } else if (displayState === DrawerView.ExpandState) {
      this.willExpand();
    } else if (displayState === DrawerView.CollapseState) {
      this.willCollapse();
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    const drawerSlide = this.drawerSlide.takeUpdatedValue();
    if (drawerSlide !== void 0) {
      this.updateDrawerSlide(drawerSlide);
    }
    const drawerStretch = this.drawerStretch.takeUpdatedValue();
    if (drawerStretch !== void 0) {
      this.updateDrawerStretch(drawerStretch);
    }
  }

  protected didAnimate(viewContext: ViewContextType<this>): void {
    const displayState = this.displayState;
    const drawerStretch = this.drawerStretch.value;
    const drawerSlide = this.drawerSlide.value;
    if (displayState === DrawerView.ShowingState && drawerSlide === 1) {
      this.didShow();
    } else if (displayState === DrawerView.HidingState && drawerSlide === 0) {
      this.didHide();
    } else if (displayState === DrawerView.ExpandingState && drawerStretch === 1) {
      this.didExpand();
    } else if (displayState === DrawerView.CollapsingState && drawerStretch === 0) {
      this.didCollapse();
    }
    super.didAnimate(viewContext);
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.place(viewContext);
    if (viewContext.viewIdiom === "mobile") {
      this.borderRightColor.setAutoState(Color.transparent());
      this.boxShadow.setAutoState(this.getLook(Look.shadow, Mood.floating));
    } else {
      this.borderRightColor.setAutoState(this.getLook(Look.borderColor));
      this.boxShadow.setAutoState(this.getLook(Look.shadow));
    }
  }

  protected place(viewContext: ViewContextType<this>): void {
    const placement = this.placement;
    if (placement === "top") {
      this.placeTop(viewContext);
    } else if (placement === "right") {
      this.placeRight(viewContext);
    } else if (placement === "bottom") {
      this.placeBottom(viewContext);
    } else if (placement === "left") {
      this.placeLeft(viewContext);
    }
  }

  /** @hidden */
  protected placeTop(viewContext: ViewContextType<this>): void {
    this.addClass("drawer-top")
        .removeClass("drawer-right")
        .removeClass("drawer-bottom")
        .removeClass("drawer-left");

    this.position.setAutoState("fixed");
    this.width.setAutoState(void 0);
    this.height.setAutoState(void 0);
    this.top.setAutoState(void 0);
    this.right.setAutoState(Length.zero());
    this.bottom.setAutoState(void 0);
    this.left.setAutoState(Length.zero());
    this.updateDrawerSlideTop(this.drawerSlide.getValue());

    let edgeInsets = this.edgeInsets.superState;
    if (edgeInsets === void 0) {
      edgeInsets = viewContext.viewport.safeArea;
    }
    this.edgeInsets.setAutoState({
      insetTop: 0,
      insetRight: edgeInsets.insetRight,
      insetBottom: 0,
      insetLeft: edgeInsets.insetLeft,
    });

    if (this.isCollapsed()) {
      this.expand();
    }
  }

  /** @hidden */
  protected placeRight(viewContext: ViewContextType<this>): void {
    this.removeClass("drawer-top")
        .addClass("drawer-right")
        .removeClass("drawer-bottom")
        .removeClass("drawer-left");

    this.position.setAutoState("fixed");
    this.width.setAutoState(void 0);
    this.height.setAutoState(void 0);
    this.top.setAutoState(Length.zero());
    this.right.setAutoState(void 0);
    this.bottom.setAutoState(Length.zero());
    this.left.setAutoState(void 0);
    this.updateDrawerSlideRight(this.drawerSlide.getValue());
    this.updateDrawerStretch(this.drawerStretch.getValue());

    let edgeInsets = this.edgeInsets.superState;
    if (edgeInsets === void 0) {
      edgeInsets = viewContext.viewport.safeArea;
    }
    this.paddingTop.setAutoState(Length.px(edgeInsets.insetTop));
    this.paddingBottom.setAutoState(Length.px(edgeInsets.insetBottom));
    this.edgeInsets.setAutoState({
      insetTop: 0,
      insetRight: edgeInsets.insetRight,
      insetBottom: 0,
      insetLeft: 0,
    });
  }

  /** @hidden */
  protected placeBottom(viewContext: ViewContextType<this>): void {
    this.removeClass("drawer-top")
        .removeClass("drawer-right")
        .addClass("drawer-bottom")
        .removeClass("drawer-left");

    this.position.setAutoState("fixed");
    this.width.setAutoState(void 0);
    this.height.setAutoState(void 0);
    this.top.setAutoState(void 0);
    this.right.setAutoState(Length.zero());
    this.bottom.setAutoState(void 0);
    this.left.setAutoState(Length.zero());
    this.updateDrawerSlideBottom(this.drawerSlide.getValue());

    let edgeInsets = this.edgeInsets.superState;
    if (edgeInsets === void 0) {
      edgeInsets = viewContext.viewport.safeArea;
    }
    this.edgeInsets.setAutoState({
      insetTop: 0,
      insetRight: edgeInsets.insetRight,
      insetBottom: 0,
      insetLeft: edgeInsets.insetLeft,
    });

    if (this.isCollapsed()) {
      this.expand();
    }
  }

  /** @hidden */
  protected placeLeft(viewContext: ViewContextType<this>): void {
    this.removeClass("drawer-top")
        .removeClass("drawer-right")
        .removeClass("drawer-bottom")
        .addClass("drawer-left");

    this.position.setAutoState("fixed");
    this.width.setAutoState(void 0);
    this.height.setAutoState(void 0);
    this.top.setAutoState(Length.zero());
    this.right.setAutoState(void 0);
    this.bottom.setAutoState(Length.zero());
    this.left.setAutoState(void 0);
    this.updateDrawerSlideLeft(this.drawerSlide.getValue());
    this.updateDrawerStretch(this.drawerStretch.getValue());

    let edgeInsets = this.edgeInsets.superState;
    if (edgeInsets === void 0) {
      edgeInsets = viewContext.viewport.safeArea;
    }
    this.paddingTop.setAutoState(Length.px(edgeInsets.insetTop));
    this.paddingBottom.setAutoState(Length.px(edgeInsets.insetBottom));
    this.edgeInsets.setAutoState({
      insetTop: 0,
      insetRight: 0,
      insetBottom: 0,
      insetLeft: edgeInsets.insetLeft,
    });
  }

  get modalView(): View | null {
    return this;
  }

  get modalState(): ModalState {
    switch (this.displayState) {
      case DrawerView.HiddenState: return "hidden";
      case DrawerView.HidingState:
      case DrawerView.HideState: return "hiding";
      case DrawerView.ShownState: return "shown";
      case DrawerView.ShowingState:
      case DrawerView.ShowState: return "showing";
      case DrawerView.CollapsedState:
      case DrawerView.CollapsingState:
      case DrawerView.CollapseState:
      case DrawerView.ExpandingState:
      case DrawerView.ExpandState: return "shown";
      default: throw new Error("" + this.displayState);
    }
  }

  declare readonly modality: boolean | number;

  showModal(options: ModalOptions, timing?: AnyTiming | boolean): void {
    if (options.modal !== void 0) {
      Object.defineProperty(this, "modality", {
        value: options.modal,
        enumerable: true,
        configurable: true,
      });
    }
    this.show(timing);
  }

  hideModal(timing?: AnyTiming | boolean): void {
    this.hide(timing);
  }

  show(timing?: AnyTiming | boolean): void {
    if (!this.isShown() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(DrawerView.ShowState);
      if (timing !== false) {
        if (this.drawerSlide.value !== 1) {
          this.drawerStretch.setAutoState(1, timing);
          this.drawerSlide.setAutoState(1, timing);
        } else {
          this.drawerStretch.setAutoState(1, timing);
        }
      } else {
        this.willShow();
        this.drawerStretch.setAutoState(1);
        this.drawerSlide.setAutoState(1);
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    this.setDisplayState(DrawerView.ShowingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerWillShow !== void 0) {
      viewController.drawerWillShow(this);
    }
    const viewObservers = this.viewObservers!;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerWillShow !== void 0) {
        viewObserver.drawerWillShow(this);
      }
    }

    this.display.setAutoState("flex");
    this.place(this.viewContext as ViewContextType<this>);
  }

  protected didShow(): void {
    this.setDisplayState(DrawerView.ShownState);
    this.requireUpdate(View.NeedsAnimate);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerDidShow !== void 0) {
        viewObserver.drawerDidShow(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerDidShow !== void 0) {
      viewController.drawerDidShow(this);
    }
  }

  hide(timing?: AnyTiming | boolean): void {
    if (!this.isHidden() || this.drawerSlide.value !== 0) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(DrawerView.HideState);
      this.modalService.dismissModal(this);
      if (timing !== false) {
        this.drawerSlide.setAutoState(0, timing);
      } else {
        this.willHide();
        this.drawerSlide.setAutoState(0);
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    this.setDisplayState(DrawerView.HidingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerWillHide !== void 0) {
      viewController.drawerWillHide(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerWillHide !== void 0) {
        viewObserver.drawerWillHide(this);
      }
    }
  }

  protected didHide(): void {
    this.setDisplayState(DrawerView.HiddenState);
    this.requireUpdate(View.NeedsAnimate);

    this.display.setAutoState("none");

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerDidHide !== void 0) {
        viewObserver.drawerDidHide(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerDidHide !== void 0) {
      viewController.drawerDidHide(this);
    }
  }

  expand(timing?: AnyTiming | boolean): void {
    if (!this.isShown() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(DrawerView.ExpandState);
      this.modalService.dismissModal(this);
      if (timing !== false) {
        if (this.drawerStretch.value !== 1) {
          this.drawerSlide.setAutoState(1, timing);
          this.drawerStretch.setAutoState(1, timing);
        } else {
          this.drawerSlide.setAutoState(1, timing);
        }
      } else {
        this.willExpand();
        this.drawerSlide.setAutoState(1)
        this.drawerStretch.setAutoState(1);
        this.didExpand();
      }
    }
  }

  protected willExpand(): void {
    this.setDisplayState(DrawerView.ExpandingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerWillExpand !== void 0) {
      viewController.drawerWillExpand(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerWillExpand !== void 0) {
        viewObserver.drawerWillExpand(this);
      }
    }
  }

  protected didExpand(): void {
    this.setDisplayState(DrawerView.ShownState);
    this.requireUpdate(View.NeedsAnimate);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerDidExpand !== void 0) {
        viewObserver.drawerDidExpand(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerDidExpand !== void 0) {
      viewController.drawerDidExpand(this);
    }
  }

  collapse(timing?: AnyTiming | boolean): void {
    if (this.isVertical() && (!this.isCollapsed() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 0)) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(DrawerView.CollapseState);
      this.modalService.dismissModal(this);
      if (this.drawerSlide.value === 0) {
        this.drawerStretch.setAutoState(0);
      }
      if (timing !== false) {
        if (this.drawerStretch.value !== 0) {
          this.drawerSlide.setAutoState(1, timing);
          this.drawerStretch.setAutoState(0, timing);
        } else {
          this.drawerSlide.setAutoState(1, timing);
        }
      } else {
        this.willCollapse();
        this.drawerSlide.setAutoState(1);
        this.drawerStretch.setAutoState(0);
        this.didCollapse();
      }
    }
  }

  protected willCollapse(): void {
    this.setDisplayState(DrawerView.CollapsingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerWillCollapse !== void 0) {
      viewController.drawerWillCollapse(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerWillCollapse !== void 0) {
        viewObserver.drawerWillCollapse(this);
      }
    }

    this.display.setAutoState("flex");
  }

  protected didCollapse(): void {
    this.setDisplayState(DrawerView.CollapsedState);
    this.requireUpdate(View.NeedsAnimate);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.drawerDidCollapse !== void 0) {
        viewObserver.drawerDidCollapse(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.drawerDidCollapse !== void 0) {
      viewController.drawerDidCollapse(this);
    }
  }

  toggle(timing?: AnyTiming | boolean): void {
    const drawerState = this.drawerState;
    if (this.viewIdiom === "mobile" && (drawerState === "hidden" || drawerState === "hiding")) {
      this.modalService.presentModal(this, {modal: true});
    } else if (drawerState === "hidden" || drawerState === "hiding") {
      this.show(timing);
    } else if (drawerState === "collapsed" || drawerState === "collapsing") {
      this.expand(timing);
    } else if (this.viewIdiom === "mobile") {
      this.hide(timing);
    } else {
      this.collapse(timing);
    }
  }

  /** @hidden */
  static readonly HiddenState: number = 0;
  /** @hidden */
  static readonly HidingState: number = 1;
  /** @hidden */
  static readonly HideState: number = 2;
  /** @hidden */
  static readonly ShownState: number = 3;
  /** @hidden */
  static readonly ShowingState: number = 4;
  /** @hidden */
  static readonly ShowState: number = 5;
  /** @hidden */
  static readonly CollapsedState: number = 6;
  /** @hidden */
  static readonly CollapsingState: number = 7;
  /** @hidden */
  static readonly CollapseState: number = 8;
  /** @hidden */
  static readonly ExpandingState: number = 9;
  /** @hidden */
  static readonly ExpandState: number = 10;
}
