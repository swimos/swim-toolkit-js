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

import {Angle} from "@swim/angle";
import {AnyColor, Color} from "@swim/color";
import {Transform} from "@swim/transform";
import {Ease, Tween, Transition} from "@swim/transition";
import {MemberAnimator, View, SvgView, HtmlView} from "@swim/view";
import {MultitouchEvent, Multitouch} from "@swim/gesture";
import {LeafViewObserver} from "./LeafViewObserver";
import {LeafViewController} from "./LeafViewController";
import {TreeView} from "./TreeView";
import {ShellView} from "../shell/ShellView";

export class LeafView extends HtmlView {
  /** @hidden */
  _viewController: LeafViewController | null;
  /** @hidden */
  _depth: number;
  /** @hidden */
  _highlighted: boolean;
  /** @hidden */
  _selected: boolean;
  /** @hidden */
  _focussed: boolean;
  /** @hidden */
  _expanded: boolean;
  /** @hidden */
  _expandable: boolean;
  /** @hiden */
  _multitouch: Multitouch;
  /** @hidden */
  _pressTimer: number;
  /** @hidden */
  _pressDownTime: number | null;
  /** @hidden */
  _layoutTransition: Transition<any>;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.onMultitouchStart = this.onMultitouchStart.bind(this);
    this.onMultitouchHold = this.onMultitouchHold.bind(this);
    this.onMultitouchChange = this.onMultitouchChange.bind(this);
    this.onMultitouchCancel = this.onMultitouchCancel.bind(this);
    this.onMultitouchEnd = this.onMultitouchEnd.bind(this);
    this.depthColor.setState(Color.parse("#1e2022"));
    this.primaryColor.setState(Color.parse("#44d7b6"));
    this.secondaryColor.setState(Color.parse("#d8d8d8"));
    this.highlightColor.setState(Color.parse("#0e1418"));
    this.branchColor.setState(Color.rgb(255, 255, 255, 0.1));
    this._depth = 0;
    this._highlighted = false;
    this._selected = false;
    this._focussed = false;
    this._expanded = false;
    this._expandable = false;
    this._multitouch = Multitouch.create()
        .acceleration(0)
        .wheel(false);
    this._pressTimer = 0;
    this._pressDownTime = null;
    this._layoutTransition = Transition.duration(250, Ease.cubicOut);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("leaf")
        .display("flex")
        .position("absolute")
        .alignItems("center")
        .height(60)
        .paddingBottom(2)
        .boxSizing("border-box")
        .userSelect("none");
  }

  protected initChildren(): void {
    this.append(this.createHighlightView().key("highlight"));
    this.append(this.createBranchView().key("branch"));
    this.append(this.createSelectView().key("select"));
    this.append(this.createStemView().key("stem"));
    this.append(this.createAvatarView().key("avatar"));
    this.append(this.createTitleView("").key("title"));
    this.append(this.createArrowView().key("arrow"));
  }

  protected createHighlightView(): HtmlView {
    const highlightView = HtmlView.create("div")
        .addClass("leaf-highlight")
        .position("absolute")
        .top(0)
        .right(0)
        .bottom(2)
        .left(0)
        .borderRadius(4);
    return highlightView;
  }

  protected createBranchView(): HtmlView {
    const branchView = HtmlView.create("div")
        .addClass("leaf-branch")
        .position("absolute")
        .top(0)
        .bottom(0)
        .left(0)
        .width(20);
    return branchView;
  }

  protected createSelectView(): HtmlView {
    const selectView = HtmlView.create("div")
        .addClass("leaf-select")
        .position("absolute")
        .top(4)
        .bottom(6)
        .left(-2)
        .width(4)
        .borderRadius(2)
        .backgroundColor(Color.transparent());
    return selectView;
  }

  protected createStemView(): HtmlView {
    const stemView = HtmlView.create("div")
        .addClass("leaf-stem")
        .position("absolute")
        .top(0)
        .right(0)
        .bottom(0)
        .left(0)
        .borderBottomWidth(2)
        .borderBottomStyle("solid")
        .borderBottomColor(Color.transparent());
    return stemView;
  }

  protected createAvatarView(): HtmlView {
    const avatarView = HtmlView.create("div")
        .addClass("leaf-avatar")
        .position("relative")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .flexShrink(0)
        .width(56)
        .height(58)
        .paddingTop(9)
        .paddingRight(10)
        .paddingBottom(9)
        .boxSizing("border-box")
        .cursor("pointer")
        .zIndex(1);
    const avatarBody = avatarView.append("svg")
        .key("body")
        .width(46)
        .height(40)
        .viewBox("0 0 46 40");
    avatarBody.node.style.setProperty("position", "absolute");
    avatarBody.append("polygon")
        .key("fill")
        .fill(this.primaryColor.value!)
        .points("11.5 0 34.5 0 46 20 34.5 40 11.5 40 0 20");
    return avatarView;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span")
        .display("block")
        .flexGrow(1)
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color("#e3e3e3")
        .zIndex(1);
    if (text !== void 0) {
      view.text(text);
    }
    return view;
  }

  protected createArrowView(): HtmlView {
    const arrowView = HtmlView.create("div")
        .addClass("leaf-arrow")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .flexShrink(0)
        .width(56)
        .height(58)
        .opacity(0)
        .cursor("default")
        .zIndex(1);
    const arrowIcon = arrowView.append("svg")
        .key("icon")
        .width(24)
        .height(24)
        .viewBox("0 0 24 24");
    arrowIcon.append("polygon")
        .key("fill")
        .fill(this.secondaryColor.value!)
        .points("0 4 -6 -2 -4.59 -3.41 0 1.17 4.59 -3.41 6 -2")
        .transform(Transform.translate(12, 12).rotate(Angle.deg(0)));
    return arrowView;
  }

  get viewController(): LeafViewController | null {
    return this._viewController;
  }

  @MemberAnimator(Color)
  depthColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  primaryColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  secondaryColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  highlightColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  branchColor: MemberAnimator<this, Color, AnyColor>;

  highlightView(): HtmlView | null;
  highlightView(highlightView: HtmlView | null): this;
  highlightView(highlightView?: HtmlView | null): HtmlView | null | this {
    if (highlightView === void 0) {
      const childView = this.getChildView("highlight");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("highlight", highlightView);
      return this;
    }
  }

  branchView(): HtmlView | null;
  branchView(branchView: HtmlView | null): this;
  branchView(branchView?: HtmlView | null): HtmlView | null | this {
    if (branchView === void 0) {
      const childView = this.getChildView("branch");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("branch", branchView);
      return this;
    }
  }

  selectView(): HtmlView | null;
  selectView(selectView: HtmlView | null): this;
  selectView(selectView?: HtmlView | null): HtmlView | null | this {
    if (selectView === void 0) {
      const childView = this.getChildView("select");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("select", selectView);
      return this;
    }
  }

  stemView(): HtmlView | null;
  stemView(stemView: HtmlView | null): this;
  stemView(stemView?: HtmlView | null): HtmlView | null | this {
    if (stemView === void 0) {
      const childView = this.getChildView("stem");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("stem", stemView);
      return this;
    }
  }

  avatarView(): HtmlView | null;
  avatarView(avatarView: HtmlView | null): this;
  avatarView(avatarView?: HtmlView | null): HtmlView | null | this {
    if (avatarView === void 0) {
      const childView = this.getChildView("avatar");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("avatar", avatarView);
      return this;
    }
  }

  avatarIcon(): SvgView | HtmlView | null;
  avatarIcon(avatarIcon: SvgView | HtmlView | null): this;
  avatarIcon(avatarIcon?: SvgView | HtmlView | null): SvgView | HtmlView | null | this {
    const avatarView = this.getChildView("avatar");
    if (avatarIcon === void 0) {
      const childView = avatarView && avatarView.getChildView("icon");
      return childView instanceof SvgView || childView instanceof HtmlView ? childView : null;
    } else {
      if (avatarView) {
        if (avatarIcon) {
          avatarIcon.node.style.setProperty("z-index", "1");
        }
        avatarView.setChildView("icon", avatarIcon);
      }
      return this;
    }
  }

  titleView(): HtmlView | null;
  titleView(titleView: HtmlView | string | null): this;
  titleView(newTitleView?: HtmlView | string | null): HtmlView | null | this {
    const childView = this.getChildView("title");
    const oldTitleView = childView instanceof HtmlView ? childView : null;
    if (newTitleView === void 0) {
      return oldTitleView;
    } else {
      if (typeof newTitleView === "string") {
        if (oldTitleView === null) {
          newTitleView = this.createTitleView(newTitleView);
          this.appendChildView(newTitleView);
        } else {
          oldTitleView.text(newTitleView);
          newTitleView = oldTitleView;
        }
      } else if (newTitleView !== null) {
        if (oldTitleView === null) {
          this.appendChildView(newTitleView.key("title"));
        } else {
          this.setChildView("title", newTitleView);
        }
      } else if (oldTitleView !== null) {
        oldTitleView.remove();
      }
      return this;
    }
  }

  arrowView(): HtmlView | null;
  arrowView(arrowView: HtmlView | null): this;
  arrowView(arrowView?: HtmlView | null): HtmlView | null | this {
    if (arrowView === void 0) {
      const childView = this.getChildView("arrow");
      return childView instanceof HtmlView ? childView : null;
    } else {
      this.setChildView("arrow", arrowView);
      return this;
    }
  }

  protected onMount(): void {
    this._multitouch.surface(this).attach(this);
    this.on("click", this.onClick);
    this.on("multitouchstart", this.onMultitouchStart);
    this.on("multitouchchange", this.onMultitouchChange);
    this.on("multitouchcancel", this.onMultitouchCancel);
    this.on("multitouchend", this.onMultitouchEnd);
    (this.appView as ShellView).throttleLayout();
  }

  protected onUnmount(): void {
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = 0;
    }
    this.off("click", this.onClick);
    this.off("multitouchstart", this.onMultitouchStart);
    this.off("multitouchchange", this.onMultitouchChange);
    this.off("multitouchcancel", this.onMultitouchCancel);
    this.off("multitouchend", this.onMultitouchEnd);
    this._multitouch.surface(null).detach(this);
  }

  protected onAnimate(t: number): void {
    this.depthColor.onFrame(t);
    this.primaryColor.onFrame(t);
    this.secondaryColor.onFrame(t);
    this.highlightColor.onFrame(t);
    this.branchColor.onFrame(t);
  }

  /** @hidden */
  updateLayoutValues(): void {
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      const branchView = this.branchView();
      if (branchView) {
        branchView.left(Math.max(0, parentView.insetLeft.value - 24));
      }
      const selectView = this.selectView();
      if (selectView) {
        selectView.left(Math.max(-2, parentView.insetLeft.value - 26));
      }
      const avatarView = this.avatarView();
      if (avatarView) {
        avatarView.marginLeft(parentView.insetLeft.value - 4);
      }
      const arrowView = this.arrowView();
      if (arrowView) {
        arrowView.marginRight(parentView.insetRight.value - 4);
      }
    }
    super.updateLayoutValues();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "avatar" && childView instanceof HtmlView) {
      this.onInsertAvatar(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitle(childView);
    } else if (childKey === "arrow" && childView instanceof HtmlView) {
      this.onInsertArrow(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "avatar" && childView instanceof HtmlView) {
      this.onRemoveAvatar(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitle(childView);
    } else if (childKey === "arrow" && childView instanceof HtmlView) {
      this.onRemoveArrow(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertAvatar(avatar: HtmlView): void {
    // stub
  }

  protected onRemoveAvatar(avatar: HtmlView): void {
    // stub
  }

  protected onInsertTitle(title: HtmlView): void {
    // stub
  }

  protected onRemoveTitle(title: HtmlView): void {
    // stub
  }

  protected onInsertArrow(arrow: HtmlView): void {
    // stub
  }

  protected onRemoveArrow(arrow: HtmlView): void {
    // stub
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onMultitouchStart(event: MultitouchEvent): void {
    if (this._pressDownTime === null) {
      this._pressTimer = setTimeout(this.onMultitouchHold, 500) as any;
      this._pressDownTime = event.timeStamp;
      this.didPressDown();
    }
  }

  protected onMultitouchHold(): void {
    if (this._pressTimer) {
      clearTimeout(this._pressTimer);
      this._pressTimer = 0;
    }
    this.didPressHold();
  }

  protected onMultitouchChange(event: MultitouchEvent): void {
    // nop
  }

  protected onMultitouchCancel(event: TouchEvent): void {
    if (this._pressDownTime !== null) {
      event.preventDefault();
      if (this._pressTimer) {
        clearTimeout(this._pressTimer);
        this._pressTimer = 0;
      }
      this._pressDownTime = null;
    }
  }

  protected onMultitouchEnd(event: MultitouchEvent): void {
    if (this._pressDownTime !== null) {
      event.preventDefault();
      if (this._pressTimer) {
        clearTimeout(this._pressTimer);
        this._pressTimer = 0;
      }
      const pressDuration = event.timeStamp - this._pressDownTime;
      this._pressDownTime = null;

      const point = event.points[0];
      const clientX = point ? point.cx : NaN;
      const clientY = point ? point.cy : NaN;

      const avatarView = this.avatarView();
      const arrowView = this.arrowView();
      if (pressDuration < 500 && avatarView && avatarView.clientBounds.contains(clientX, clientY)) {
        this.didPressAvatar();
      } else if (pressDuration < 500 && this._expandable && arrowView && arrowView.clientBounds.contains(clientX, clientY)) {
        this.didPressArrow();
      } else {
        this.didPressUp(pressDuration, event.originalEvent instanceof MouseEvent && event.originalEvent.shiftKey);
      }
    }
  }

  protected didPressDown(): void {
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      parentView.didPressLeafDown(this);
    }
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidPressDown) {
        viewObserver.leafDidPressDown(this);
      }
    });
  }

  protected didPressHold(): void {
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      parentView.didPressLeafHold(this);
    }
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidPressHold) {
        viewObserver.leafDidPressHold(this);
      }
    });
  }

  protected didPressUp(duration: number, multi: boolean): void {
    const appView = this.appView;
    if (appView) {
      appView.hidePopovers();
    }

    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      parentView.didPressLeafUp(duration, multi, this);
    }
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidPressUp) {
        viewObserver.leafDidPressUp(duration, multi, this);
      }
    });
  }

  protected didPressAvatar(): void {
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      parentView.didPressLeafAvatar(this);
    }
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidPressAvatar) {
        viewObserver.leafDidPressAvatar(this);
      }
    });
  }

  protected didPressArrow(): void {
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      parentView.didPressLeafArrow(this);
    }
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidPressArrow) {
        viewObserver.leafDidPressArrow(this);
      }
    });
  }

  get depth(): number {
    return this._depth;
  }

  setDepth(depth: number, tween?: Tween<any>): void {
    if (this._depth !== depth) {
      if (tween === void 0 || tween === true) {
        tween = this._layoutTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willSetDepth(depth);
      this._depth = depth;
      this.onSetDepth(depth, tween);
      this.didSetDepth(depth);
    }
  }

  protected willSetDepth(depth: number): void {
    // hook
  }

  protected onSetDepth(depth: number, tween: Tween<any>): void {
    if (this._depth !== 0) {
      this.backgroundColor(this.depthColor.state!.darker(0.33 * this._depth), tween);
    }

    const branchView = this.branchView();
    if (branchView) {
      branchView.removeAll();
      if (depth > 0) {
        for (let i = 0; i < depth; i += 1) {
          branchView.append("div")
              .position("absolute")
              .top(0)
              .bottom(0)
              .left(6 * i)
              .width(2)
              .backgroundColor(this.branchColor.state!);
        }
        if (depth < 4) {
          branchView.append("div")
              .position("absolute")
              .top(28)
              .right(-8)
              .left(6 * (depth - 1) + 2)
              .height(2)
              .backgroundColor(this.branchColor.state!);
        }
      }
    }

    const avatarView = this.avatarView();
    const avatarBody = avatarView ? avatarView.getChildView("body") as SvgView | null : null;
    const avatarFill = avatarBody ? avatarBody.getChildView("fill") as SvgView | null : null;
    if (avatarFill) {
      avatarFill.fill(this.primaryColor.state!.darker(0.33 * this._depth), tween);
    }

    if (this._expanded) {
      const arrowView = this.arrowView();
      const arrowIcon = arrowView ? arrowView.getChildView("icon") as SvgView | null : null;
      const arrowFill = arrowIcon ? arrowIcon.getChildView("fill") as SvgView | null : null;
      if (arrowFill) {
        arrowFill.fill(this.primaryColor.state!.darker(0.33 * this._depth), tween);
      }
    }
  }

  protected didSetDepth(depth: number): void {
    // hook
  }

  get highlighted(): boolean {
    return this._highlighted;
  }

  highlight(tween?: Tween<any>): this {
    if (!this._highlighted) {
      this._highlighted = true;
      if (tween === true) {
        tween = (this.appView as ShellView)._inspectorTransition;
      }
      const highlightView = this.highlightView();
      if (highlightView) {
        highlightView.backgroundColor(this.highlightColor.value!.alpha(1), tween);
      }
      const selectView = this.selectView();
      if (selectView) {
        selectView.backgroundColor(this.primaryColor.state!.darker(0.33 * this._depth), tween);
      }
    }
    return this;
  }

  unhighlight(tween?: Tween<any>): this {
    if (this._highlighted) {
      this._highlighted = false;
      if (tween === true) {
        tween = (this.appView as ShellView)._inspectorTransition;
      }
      const highlightView = this.highlightView();
      if (highlightView) {
        highlightView.backgroundColor(this.highlightColor.value!.alpha(0), tween);
      }
      const selectView = this.selectView();
      if (selectView) {
        selectView.backgroundColor(Color.transparent(), tween);
      }
    }
    return this;
  }

  //get selected(): boolean {
  //  return this._selected;
  //}

  /** @hidden */
  willSelect(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillSelect) {
        viewObserver.leafWillSelect(this);
      }
    });
  }

  /** @hidden */
  didSelect(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidSelect) {
        viewObserver.leafDidSelect(this);
      }
    });
  }

  /** @hidden */
  willDeselect(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillDeselect) {
        viewObserver.leafWillDeselect(this);
      }
    });
  }

  /** @hidden */
  didDeselect(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidDeselect) {
        viewObserver.leafDidDeselect(this);
      }
    });
  }

  get focussed(): boolean {
    return this._focussed;
  }

  /** @hidden */
  willFocus(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillFocus) {
        viewObserver.leafWillFocus(this);
      }
    });
  }

  /** @hidden */
  didFocus(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidFocus) {
        viewObserver.leafDidFocus(this);
      }
    });
  }

  /** @hidden */
  willDefocus(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillDefocus) {
        viewObserver.leafWillDefocus(this);
      }
    });
  }

  /** @hidden */
  didDefocus(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidDefocus) {
        viewObserver.leafDidDefocus(this);
      }
    });
  }

  get expanded(): boolean {
    return this._expanded;
  }

  expand(tween?: Tween<any>): void {
    if (!this._expanded) {
      if (tween === void 0 || tween === true) {
        tween = this._layoutTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willExpand();
      this._expanded = true;
      this.onExpand(tween);
      this.didExpand();
    }
  }

  collapse(tween?: Tween<any>): void {
    if (this._expanded) {
      if (tween === void 0 || tween === true) {
        tween = this._layoutTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willCollapse();
      this._expanded = false;
      this.onCollapse(tween);
      this.didCollapse();
    }
  }

  toggle(tween?: Tween<any>): void {
    if (tween === void 0 || tween === true) {
      tween = this._layoutTransition;
    } else if (tween) {
      tween = Transition.fromAny(tween);
    }
    if (!this._expanded) {
      this.willExpand();
      this._expanded = true;
      this.onExpand(tween);
      this.didExpand();
    } else {
      this.willCollapse();
      this._expanded = false;
      this.onCollapse(tween);
      this.didCollapse();
    }
  }

  protected willExpand(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillExpand) {
        viewObserver.leafWillExpand(this);
      }
    });
  }

  protected onExpand(tween: Tween<any>): void {
    const stemView = this.stemView();
    if (stemView) {
      stemView.borderBottomColor(this.primaryColor.state!.darker(0.33 * this._depth), tween);
    }

    const arrowView = this.arrowView();
    const arrowIcon = arrowView ? arrowView.getChildView("icon") as SvgView | null : null;
    const arrowFill = arrowIcon ? arrowIcon.getChildView("fill") as SvgView | null : null;
    if (arrowFill) {
      arrowFill.fill(this.primaryColor.state!.darker(0.33 * this._depth), tween)
               .transform(Transform.translate(12, 12).rotate(Angle.deg(-180)), tween);
    }
  }

  protected didExpand(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidExpand) {
        viewObserver.leafDidExpand(this);
      }
    });
  }

  protected willCollapse(): void {
    this.willObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafWillCollapse) {
        viewObserver.leafWillCollapse(this);
      }
    });
  }

  protected onCollapse(tween: Tween<any>): void {
    const stemView = this.stemView();
    if (stemView) {
      stemView.borderBottomColor(Color.transparent(), tween);
    }

    const arrowView = this.arrowView();
    const arrowIcon = arrowView ? arrowView.getChildView("icon") as SvgView | null : null;
    const arrowFill = arrowIcon ? arrowIcon.getChildView("fill") as SvgView | null : null;
    if (arrowFill) {
      arrowFill.fill(this.secondaryColor.value!, tween)
               .transform(Transform.translate(12, 12).rotate(Angle.deg(0)), tween);
    }
  }

  protected didCollapse(): void {
    this.didObserve(function (viewObserver: LeafViewObserver): void {
      if (viewObserver.leafDidCollapse) {
        viewObserver.leafDidCollapse(this);
      }
    });
  }

  get expandable(): boolean {
    return this._expandable;
  }

  setExpandable(expandable: boolean, tween?: Tween<any>): void {
    if (this._expandable !== expandable) {
      if (tween === void 0 || tween === true) {
        tween = this._layoutTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willSetExpandable(expandable);
      this._expandable = expandable;
      this.onSetExpandable(expandable, tween);
      this.didSetExpandable(expandable);
    }
  }

  protected willSetExpandable(expandable: boolean): void {
    // hook
  }

  protected onSetExpandable(expandable: boolean, tween: Tween<any>): void {
    const arrowView = this.arrowView();
    if (arrowView) {
      if (expandable) {
        arrowView.opacity(1, tween)
                 .cursor("pointer");
      } else {
        arrowView.opacity(0, tween)
                 .cursor("default");
        this.collapse();
      }
    }
  }

  protected didSetExpandable(expandable: boolean): void {
    // hook
  }
}
