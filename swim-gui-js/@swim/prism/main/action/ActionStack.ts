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
import {MemberAnimator, View, ViewNode, SvgView, HtmlView} from "@swim/view";
import {MultitouchEvent, Multitouch} from "@swim/gesture";
import {ActionButton} from "./ActionButton";
import {ActionItem} from "./ActionItem";
import {ActionStackObserver} from "./ActionStackObserver";
import {ActionStackController} from "./ActionStackController";

export type ActionStackState = "collapsed" | "expanding" | "expanded" | "collapsing";

export class ActionStack extends HtmlView {
  /** @hidden */
  _viewController: ActionStackController | null;
  /** @hidden */
  _stackState: ActionStackState;
  /** @hidden */
  _stackTransition: Transition<any>;
  /** @hidden */
  _buttonIcon: SvgView | HtmlView | null;
  /** @hidden */
  _buttonSpacing: number;
  /** @hidden */
  _itemSpacing: number;
  /** @hiden */
  _multitouch: Multitouch;
  /** @hidden */
  _pressTimer: number;
  /** @hidden */
  _pressDownTime: number | null;
  /** @hidden */
  _pressDownY: number | null;
  /** @hidden */
  _pressDownDY: number | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMultitouchStart = this.onMultitouchStart.bind(this);
    this.onMultitouchHold = this.onMultitouchHold.bind(this);
    this.onMultitouchChange = this.onMultitouchChange.bind(this);
    this.onMultitouchCancel = this.onMultitouchCancel.bind(this);
    this.onMultitouchEnd = this.onMultitouchEnd.bind(this);
    this.stackPhase.setState(0);
    this._stackState = "collapsed";
    this._stackTransition = Transition.duration(250, Ease.cubicOut);
    this._buttonIcon = null;
    this._buttonSpacing = 36;
    this._itemSpacing = 20;
    this._multitouch = Multitouch.create()
        .acceleration(0)
        .wheel(false);
    this._pressTimer = 0;
    this._pressDownTime = null;
    this._pressDownY = null;
    this._pressDownDY = null;
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("action-stack")
        .display("block")
        .position("relative")
        .width(56)
        .height(56)
        .opacity(1)
        .touchAction("none")
        .userSelect("none");
  }

  protected initChildren(): void {
    this.append(ActionButton, "button");
  }

  get viewController(): ActionStackController | null {
    return this._viewController;
  }

  get stackState(): ActionStackState {
    return this._stackState;
  }

  isExpanded(): boolean {
    return this._stackState === "expanded" || this._stackState === "expanding";
  }

  isCollapsed(): boolean {
    return this._stackState === "collapsed" || this._stackState === "collapsing";
  }

  @MemberAnimator(Number)
  stackPhase: MemberAnimator<this, number>; // 0 = collapsed; 1 = expanded

  get button(): ActionButton | null {
    const childView = this.getChildView("button");
    return childView instanceof ActionButton ? childView : null;
  }

  get buttonIcon(): SvgView | HtmlView | null {
    return this._buttonIcon;
  }

  setButtonIcon(buttonIcon: SvgView | HtmlView | null, tween?: Tween<any>, ccw?: boolean): void {
    this._buttonIcon = buttonIcon;
    const button = this.button;
    if (button) {
      if (tween === void 0 || tween === true) {
        tween = this._stackTransition;
      } else if (tween === false) {
        tween = void 0;
      }
      button.setIcon(buttonIcon, tween, ccw);
    }
  }

  protected createCloseIcon(): SvgView {
    const icon = SvgView.create("svg").key("icon").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").fill("#9a9a9a").d("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    return icon;
  }

  get items(): ReadonlyArray<ActionItem> {
    const childNodes = this._node.childNodes;
    const childViews = [];
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ActionItem) {
        childViews.push(childView);
      }
    }
    return childViews;
  }

  insertItem(item: ActionItem, index?: number): void {
    if (index === void 0) {
      index = this.node.childNodes.length - 1;
    }
    this.insertChildNode(item.node, this.node.childNodes[1 + index] || null);
  }

  removeItems(): void {
    const childNodes = this._node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i -= 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ActionItem) {
        this.removeChild(childView);
      }
    }
  }

  protected onUnmount(): void {
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = 0;
    }
  }

  protected onAnimate(t: number): void {
    this.stackPhase.onFrame(t);

    this.cascadeLayout();
  }

  protected onLayout(): void {
    const phase = this.stackPhase.value!;
    const childNodes = this._node.childNodes;
    const buttonHeight = 56;
    const itemHeight = 48;
    let itemIndex = 0;
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i] as ViewNode).view;
      if (childView instanceof ActionItem) {
        const bottom = buttonHeight + this._buttonSpacing + itemIndex * (itemHeight + this._itemSpacing);
        childView.display(phase === 0 ? "none" : "flex")
                 .bottom(phase * bottom)
                 .zIndex(-(itemIndex + 1));
        itemIndex += 1;
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "button" && childView instanceof ActionButton) {
      this.onInsertButton(childView);
    } else if (childView instanceof ActionItem) {
      this.onInsertItem(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "button" && childView instanceof ActionButton) {
      this.onRemoveButton(childView);
    } else if (childView instanceof ActionItem) {
      this.onRemoveItem(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertButton(button: ActionButton): void {
    if (this.isCollapsed && this._buttonIcon) {
      button.setIcon(this._buttonIcon);
    } else if (this.isExpanded) {
      button.setIcon(this.createCloseIcon());
    }
    button.zIndex(0);
    this._multitouch.surface(button).attach(button);
    button.on("click", this.onClick);
    button.on("contextmenu", this.onContextMenu);
    button.on("multitouchstart", this.onMultitouchStart);
    button.on("multitouchchange", this.onMultitouchChange);
    button.on("multitouchcancel", this.onMultitouchCancel);
    button.on("multitouchend", this.onMultitouchEnd);
  }

  protected onRemoveButton(button: ActionButton): void {
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = 0;
    }
    button.off("click", this.onClick);
    button.off("contextmenu", this.onContextMenu);
    button.off("multitouchstart", this.onMultitouchStart);
    button.off("multitouchchange", this.onMultitouchChange);
    button.off("multitouchcancel", this.onMultitouchCancel);
    button.off("multitouchend", this.onMultitouchEnd);
    this._multitouch.surface(null).detach(button);
  }

  protected onInsertItem(item: ActionItem): void {
    item.position("absolute").right(4).bottom(4).left(4).zIndex(0);
    this.cascadeLayout();
  }

  protected onRemoveItem(item: ActionItem): void {
    this.cascadeLayout();
  }

  expand(tween?: Tween<any>): void {
    if (this._stackState === "collapsed" || this._stackState === "collapsing" || this.stackPhase() !== 1) {
      if (tween === void 0 || tween === true) {
        tween = this._stackTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willExpand();
      if (tween) {
        this.button!.setIcon(this.createCloseIcon(), tween);
        if (this.stackPhase() !== 1) {
          this.stackPhase(1, tween.onEnd(this.didExpand.bind(this)));
        } else {
          setTimeout(this.didExpand.bind(this));
        }
      } else {
        this.button!.setIcon(this.createCloseIcon());
        this.stackPhase(1);
        this.cascadeLayout();
        this.didExpand();
      }
    }
  }

  protected willExpand(): void {
    this.willObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackWillExpand) {
        viewObserver.actionStackWillExpand(this);
      }
    });
    this._stackState = "expanding";
  }

  protected didExpand(): void {
    this._stackState = "expanded";
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidExpand) {
        viewObserver.actionStackDidExpand(this);
      }
    });
  }

  collapse(tween?: Tween<any>): void {
    if (this._stackState === "expanded" || this._stackState === "expanding" || this.stackPhase() !== 0) {
      if (tween === void 0 || tween === true) {
        tween = this._stackTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willCollapse();
      if (tween) {
        this.button!.setIcon(this._buttonIcon, tween, true);
        if (this.stackPhase() !== 0) {
          this.stackPhase(0, tween.onEnd(this.didCollapse.bind(this)));
        } else {
          setTimeout(this.didCollapse.bind(this));
        }
      } else {
        this.button!.setIcon(this._buttonIcon);
        this.stackPhase(0);
        this.cascadeLayout();
        this.didCollapse();
      }
    }
  }

  protected willCollapse(): void {
    this.willObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackWillCollapse) {
        viewObserver.actionStackWillCollapse(this);
      }
    });
    this._stackState = "collapsing";
  }

  protected didCollapse(): void {
    this._stackState = "collapsed";
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidCollapse) {
        viewObserver.actionStackDidCollapse(this);
      }
    });
  }

  toggle(tween?: Tween<any>): void {
    if (this._stackState === "collapsed" || this._stackState === "collapsing") {
      this.expand(tween);
    } else if (this._stackState === "expanded" || this._stackState === "expanding") {
      this.collapse(tween);
    }
  }

  show(tween?: Tween<any>): void {
    if (this.opacity.state !== 1) {
      if (tween === void 0 || tween === true) {
        tween = this._stackTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willShow();
      if (tween) {
        this.opacity(1, tween.onEnd(this.didShow.bind(this)));
      } else {
        this.opacity(1);
        this.cascadeLayout();
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    this.willObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackWillShow) {
        viewObserver.actionStackWillShow(this);
      }
    });
    this.display("block");
  }

  protected didShow(): void {
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidShow) {
        viewObserver.actionStackDidShow(this);
      }
    });
  }

  hide(tween?: Tween<any>): void {
    if (this.opacity.state !== 0) {
      if (tween === void 0 || tween === true) {
        tween = this._stackTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willHide();
      if (tween) {
        this.opacity(0, tween.onEnd(this.didHide.bind(this)));
      } else {
        this.opacity(0);
        this.cascadeLayout();
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    this.willObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackWillHide) {
        viewObserver.actionStackWillHide(this);
      }
    });
  }

  protected didHide(): void {
    this.display("none");
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidHide) {
        viewObserver.actionStackDidHide(this);
      }
    });
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onContextMenu(event: MouseEvent): void {
    if (this._pressDownTime !== null) {
      if (this._pressTimer) {
        clearTimeout(this._pressTimer);
        this._pressTimer = 0;
      }
      this._pressDownTime = null;
      this._pressDownY = null;
      this._pressDownDY = null;
    }
    event.preventDefault();
    this.didContextPress();
  }

  protected onMultitouchStart(event: MultitouchEvent): void {
    if (this._pressDownTime === null) {
      this._pressTimer = setTimeout(this.onMultitouchHold, 500) as any;
      this._pressDownTime = event.timeStamp;
      this._pressDownY = event.points[0].cy;
      this._pressDownDY = 0;
      this.didPressDown();
    }
  }

  protected onMultitouchHold(): void {
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = 0;
    }
    if (this._pressDownDY! < 2) {
      this.didPressHold();
    }
  }

  protected onMultitouchChange(event: MultitouchEvent): void {
    if (this.isCollapsed()) {
      this._pressDownDY = this._pressDownY! - event.points[0].cy;
      this.stackPhase(Math.min(Math.max(0, this._pressDownDY / 100), 1));
    }
  }

  protected onMultitouchCancel(event: MultitouchEvent): void {
    if (this._pressDownTime !== null) {
      if (this._pressTimer) {
        clearTimeout(this._pressTimer);
        this._pressTimer = 0;
      }
      this._pressDownTime = null;
      this._pressDownY = null;
      this._pressDownDY = null;
    }
  }

  protected onMultitouchEnd(event: MultitouchEvent): void {
    if (this._pressDownTime !== null) {
      if (this._pressTimer) {
        clearTimeout(this._pressTimer);
        this._pressTimer = 0;
      }
      const pressDuration = event.timeStamp - this._pressDownTime;
      this._pressDownTime = null;
      this._pressDownY = null;
      this._pressDownDY = null;
      this.didPressUp(pressDuration);
    }
  }

  protected didPressDown(): void {
    // stub
  }

  protected didPressUp(duration: number): void {
    if (duration < 500) {
      this.didPress();
    } else {
      this.didLongPress();
    }
  }

  protected didPress(): void {
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidPress) {
        viewObserver.actionStackDidPress(this);
      }
    });
  }

  protected didPressHold(): void {
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidPressHold) {
        viewObserver.actionStackDidPressHold(this);
      }
    });
  }

  protected didLongPress(): void {
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidLongPress) {
        viewObserver.actionStackDidLongPress(this);
      }
    });
  }

  protected didContextPress(): void {
    this.didObserve(function (viewObserver: ActionStackObserver): void {
      if (viewObserver.actionStackDidContextPress) {
        viewObserver.actionStackDidContextPress(this);
      }
    });
  }
}
