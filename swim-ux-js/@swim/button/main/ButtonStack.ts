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

import {Lazy} from "@swim/util";
import {AnyTiming, Timing} from "@swim/mapping";
import {Length} from "@swim/math";
import {Look} from "@swim/theme";
import {ViewContextType, View, ModalOptions, ModalState, Modal, ViewAnimator} from "@swim/view";
import {StyleAnimator, ViewNode, HtmlView} from "@swim/dom";
import {Graphics, VectorIcon} from "@swim/graphics";
import {PositionGestureInput, PositionGesture, PositionGestureDelegate} from "@swim/gesture";
import {FloatingButton} from "./FloatingButton";
import {ButtonItem} from "./ButtonItem";
import type {ButtonStackObserver} from "./ButtonStackObserver";
import type {ButtonStackController} from "./ButtonStackController";

export type ButtonStackState = "collapsed" | "expanding" | "expanded" | "collapsing";

export class ButtonStack extends HtmlView implements Modal, PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "stackState", {
      value: "collapsed",
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "stackHeight", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "gesture", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    this.onClick = this.onClick.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.initButtonStack();
    this.initButton();
  }

  protected initButtonStack(): void {
    this.addClass("button-stack");
    this.display.setAutoState("block");
    this.position.setAutoState("relative");
    this.width.setAutoState(56);
    this.height.setAutoState(56);
    this.opacity.setAutoState(1);
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  protected initButton(): void {
    const button = this.createButton();
    if (button !== null) {
      this.append(button, "button");
    }
  }

  declare readonly viewController: ButtonStackController | null;

  declare readonly viewObservers: ReadonlyArray<ButtonStackObserver>;

  declare readonly stackState: ButtonStackState

  /** @hidden */
  declare readonly stackHeight: number;

  protected createButton(): HtmlView | null {
    return FloatingButton.create();
  }

  /** @hidden */
  declare readonly gesture: PositionGesture<HtmlView> | null;

  isExpanded(): boolean {
    return this.stackState === "expanded" || this.stackState === "expanding";
  }

  isCollapsed(): boolean {
    return this.stackState === "collapsed" || this.stackState === "collapsing";
  }

  @ViewAnimator<ButtonStack, number>({
    type: Number,
    state: 0,
    updateFlags: View.NeedsLayout,
    onEnd(stackPhase: number): void {
      const stackState = this.owner.stackState;
      if (stackState === "expanding" && stackPhase === 1) {
        this.owner.didExpand();
      } else if (stackState === "collapsing" && stackPhase === 0) {
        this.owner.didCollapse();
      }
    },
  })
  declare stackPhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator({type: Number, state: 28, updateFlags: View.NeedsLayout})
  declare buttonSpacing: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 20, updateFlags: View.NeedsLayout})
  declare itemSpacing: ViewAnimator<this, number>;

  @StyleAnimator<ButtonStack, number, number | string>({
    propertyNames: "opacity",
    type: Number,
    onEnd(opacity: number): void {
      if (opacity === 1) {
        this.owner.didShow();
      } else if (opacity === 0) {
        this.owner.didHide();
      }
    },
  })
  declare opacity: StyleAnimator<this, number, number | string>;

  get modalView(): View | null {
    return null;
  }

  get modalState(): ModalState {
    const stackState = this.stackState;
    if (stackState === "collapsed") {
      return "hidden";
    } else if (stackState === "expanding") {
      return "showing";
    } else if (stackState === "expanded") {
      return "shown";
    } else if (stackState === "collapsing") {
      return "hiding";
    } else {
      return void 0 as any; // unreachable
    }
  }

  get modality(): boolean | number {
    return this.stackPhase.getValue();
  }

  showModal(options: ModalOptions, timing?: AnyTiming | boolean): void {
    this.expand(timing);
  }

  hideModal(timing?: AnyTiming | boolean): void {
    this.collapse(timing);
  }

  get button(): HtmlView | null {
    const childView = this.getChildView("button");
    return childView instanceof HtmlView ? childView : null;
  }

  get closeIcon(): Graphics {
    return ButtonStack.closeIcon;
  }

  get items(): ReadonlyArray<ButtonItem> {
    const childNodes = this.node.childNodes;
    const childViews = [];
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ButtonItem) {
        childViews.push(childView);
      }
    }
    return childViews;
  }

  insertItem(item: ButtonItem, index?: number, key?: string): void {
    if (index === void 0) {
      index = this.node.childNodes.length - 1;
    }
    this.insertChildNode(item.node, this.node.childNodes[1 + index] || null, key);
  }

  removeItems(): void {
    const childNodes = this.node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i -= 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ButtonItem) {
        this.removeChild(childView);
      }
    }
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
    this.on("contextmenu", this.onContextMenu);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    this.off("contextmenu", this.onContextMenu);
    super.onUnmount();
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutStack();
    const modalManager = this.modalService.manager;
    if (modalManager !== void 0) {
      modalManager.updateModality();
    }
  }

  protected layoutStack(): void {
    const stackPhase = this.stackPhase.getValue();
    const childNodes = this.node.childNodes;
    const childCount = childNodes.length;
    const button = this.button;
    let zIndex = childCount - 1;
    let itemIndex = 0;
    let stackHeight = 0;
    let y: number;
    if (button !== null) {
      button.zIndex.setAutoState(childCount);
      const buttonHeight = button !== null ? button.height.value : void 0;
      y = buttonHeight instanceof Length
        ? buttonHeight.pxValue()
        : button.node.offsetHeight;
    } else {
      y = 0;
    }
    const buttonSpacing = this.buttonSpacing.value;
    const itemSpacing = this.itemSpacing.value;
    for (let i = 0; i < childCount; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ButtonItem) {
        if (itemIndex === 0) {
          stackHeight += buttonSpacing;
          y += buttonSpacing;
        } else {
          stackHeight += itemSpacing;
          y += itemSpacing;
        }
        const itemHeight = childView.height.value;
        const dy = itemHeight instanceof Length
                 ? itemHeight.pxValue()
                 : childView.node.offsetHeight;
        childView.display.setAutoState(stackPhase === 0 ? "none" : "flex");
        childView.bottom.setAutoState(stackPhase * y);
        childView.zIndex.setAutoState(zIndex);
        y += dy;
        stackHeight += dy;
        itemIndex += 1;
        zIndex -= 1;
      }
    }
    Object.defineProperty(this, "stackHeight", {
      value: stackHeight,
      enumerable: true,
      configurable: true,
    });
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "button" && childView instanceof HtmlView) {
      this.onInsertButton(childView);
    } else if (childView instanceof ButtonItem) {
      this.onInsertItem(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "button" && childView instanceof HtmlView) {
      this.onRemoveButton(childView);
    } else if (childView instanceof ButtonItem) {
      this.onRemoveItem(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertButton(button: HtmlView): void {
    const gesture = new PositionGesture(button, this);
    Object.defineProperty(this, "gesture", {
      value: gesture,
      enumerable: true,
      configurable: true,
    });
    button.addViewObserver(gesture);
    if (button instanceof FloatingButton) {
      button.stackPhase.setAutoState(1);
      if (this.isExpanded()) {
        button.pushIcon(this.closeIcon);
      }
    }
    button.zIndex.setAutoState(0);
  }

  protected onRemoveButton(button: HtmlView): void {
    button.removeViewObserver(this.gesture!);
    Object.defineProperty(this, "gesture", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  protected onInsertItem(item: ButtonItem): void {
    item.position.setAutoState("absolute");
    item.right.setAutoState(8);
    item.bottom.setAutoState(8);
    item.left.setAutoState(8);
    item.zIndex.setAutoState(0);
  }

  protected onRemoveItem(item: ButtonItem): void {
    // hook
  }

  expand(timing?: AnyTiming | boolean): void {
    if (this.stackState !== "expanded" || this.stackPhase.value !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.stackState !== "expanding") {
        this.willExpand();
        const button = this.button;
        if (button instanceof FloatingButton) {
          button.pushIcon(this.closeIcon, timing);
        }
      }
      if (timing !== false) {
        if (this.stackPhase.value !== 1) {
          this.stackPhase.setAutoState(1, timing);
        } else {
          setTimeout(this.didExpand.bind(this));
        }
      } else {
        this.stackPhase.setAutoState(1);
        this.didExpand();
      }
    }
  }

  protected willExpand(): void {
    Object.defineProperty(this, "stackState", {
      value: "expanding",
      enumerable: true,
      configurable: true,
    });

    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackWillExpand !== void 0) {
      viewController.buttonStackWillExpand(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackWillExpand !== void 0) {
        viewObserver.buttonStackWillExpand(this);
      }
    }
  }

  protected didExpand(): void {
    Object.defineProperty(this, "stackState", {
      value: "expanded",
      enumerable: true,
      configurable: true,
    });
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackDidExpand !== void 0) {
        viewObserver.buttonStackDidExpand(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackDidExpand !== void 0) {
      viewController.buttonStackDidExpand(this);
    }
  }

  collapse(timing?: AnyTiming | boolean): void {
    if (this.stackState !== "collapsed" || this.stackPhase.value !== 0) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.stackState !== "collapsing") {
        this.willCollapse();
        const button = this.button;
        if (button instanceof FloatingButton && button.iconCount > 1) {
          button.popIcon(timing);
        }
      }
      if (timing !== false) {
        if (this.stackPhase.value !== 0) {
          this.stackPhase.setAutoState(0, timing);
        } else {
          setTimeout(this.didCollapse.bind(this));
        }
      } else {
        this.stackPhase.setAutoState(0);
        this.didCollapse();
      }
    }
  }

  protected willCollapse(): void {
    Object.defineProperty(this, "stackState", {
      value: "collapsing",
      enumerable: true,
      configurable: true,
    });

    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackWillCollapse !== void 0) {
      viewController.buttonStackWillCollapse(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackWillCollapse !== void 0) {
        viewObserver.buttonStackWillCollapse(this);
      }
    }
  }

  protected didCollapse(): void {
    Object.defineProperty(this, "stackState", {
      value: "collapsed",
      enumerable: true,
      configurable: true,
    });
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackDidCollapse !== void 0) {
        viewObserver.buttonStackDidCollapse(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackDidCollapse !== void 0) {
      viewController.buttonStackDidCollapse(this);
    }
  }

  toggle(timing?: AnyTiming | boolean): void {
    const stackState = this.stackState;
    if (stackState === "collapsed" || stackState === "collapsing") {
      this.expand(timing);
    } else if (stackState === "expanded" || stackState === "expanding") {
      this.collapse(timing);
    }
  }

  show(timing?: AnyTiming | boolean): void {
    if (this.opacity.state !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willShow();
      if (timing !== false) {
        this.opacity.setAutoState(1, timing);
      } else {
        this.opacity.setAutoState(1);
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackWillShow !== void 0) {
      viewController.buttonStackWillShow(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackWillShow !== void 0) {
        viewObserver.buttonStackWillShow(this);
      }
    }

    this.display("block");
  }

  protected didShow(): void {
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackDidShow !== void 0) {
        viewObserver.buttonStackDidShow(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackDidShow !== void 0) {
      viewController.buttonStackDidShow(this);
    }
  }

  hide(timing?: AnyTiming | boolean): void {
    if (this.opacity.state !== 0) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willHide();
      if (timing !== false) {
        this.opacity.setAutoState(0, timing);
      } else {
        this.opacity.setAutoState(0);
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackWillHide !== void 0) {
      viewController.buttonStackWillHide(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackWillHide !== void 0) {
        viewObserver.buttonStackWillHide(this);
      }
    }
  }

  protected didHide(): void {
    this.display("none");
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonStackDidHide !== void 0) {
        viewObserver.buttonStackDidHide(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonStackDidHide !== void 0) {
      viewController.buttonStackDidHide(this);
    }
  }

  didBeginPress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    if (!input.defaultPrevented && this.stackState !== "expanded") {
      const stackHeight = this.stackHeight;
      const stackPhase = Math.min(Math.max(0, -(input.y - input.y0) / (0.5 * stackHeight)), 1);
      this.stackPhase.setAutoState(stackPhase);
      this.requireUpdate(View.NeedsLayout);
      if (stackPhase > 0.1) {
        input.clearHoldTimer();
        if (this.stackState === "collapsed") {
          this.willExpand();
          const button = this.button;
          if (button instanceof FloatingButton) {
            button.pushIcon(this.closeIcon);
          }
        }
      }
    }
  }

  didEndPress(input: PositionGestureInput, event: Event | null): void {
    if (!input.defaultPrevented) {
      const stackPhase = this.stackPhase.getValue();
      if (input.t - input.t0 < input.holdDelay) {
        if (stackPhase < 0.1 || this.stackState === "expanded") {
          this.collapse();
        } else {
          this.expand();
        }
      } else {
        if (stackPhase < 0.5) {
          this.collapse();
        } else if (stackPhase >= 0.5) {
          this.expand();
        }
      }
    }
  }

  didCancelPress(input: PositionGestureInput, event: Event | null): void {
    if (input.buttons === 2) {
      this.toggle();
    } else {
      const stackPhase = this.stackPhase.getValue();
      if (stackPhase < 0.1 || this.stackState === "expanded") {
        this.collapse();
      } else {
        this.expand();
      }
    }
  }

  didLongPress(input: PositionGestureInput): void {
    input.preventDefault();
    this.toggle();
  }

  protected onClick(event: MouseEvent): void {
    if (event.target === this.button?.node) {
      event.stopPropagation();
    }
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  @Lazy
  static get closeIcon(): Graphics {
    return VectorIcon.create(24, 24, "M19,6.4L17.6,5L12,10.6L6.4,5L5,6.4L10.6,12L5,17.6L6.4,19L12,13.4L17.6,19L19,17.6L13.4,12Z");
  }
}
