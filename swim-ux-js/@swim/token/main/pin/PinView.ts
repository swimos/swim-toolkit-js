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
import {PathContext} from "@swim/render";
import {
  ViewContextType,
  ViewFlags,
  View,
  Subview,
  ViewAnimator,
  ViewNodeType,
  SvgView,
  HtmlView,
} from "@swim/view";
import {
  PositionGestureInput,
  PositionGesture,
  PositionGestureDelegate,
} from "@swim/gesture";
import {
  Look,
  Feel,
  MoodVector,
  ThemeMatrix,
  ThemedViewObserver,
  ThemedSvgView,
  ThemedHtmlViewInit,
  ThemedHtmlView,
} from "@swim/theme";
import {PinViewObserver} from "./PinViewObserver";
import {PinViewController} from "./PinViewController";

export type PinViewState = "collapsed" | "expanding" | "expanded" | "collapsing";

export interface PinViewInit extends ThemedHtmlViewInit {
  controller?: PinViewController;
}

export class PinView extends ThemedHtmlView {
  /** @hidden */
  _pinState: PinViewState;
  /** @hidden */
  _headGesture?: PositionGesture<ThemedSvgView>;
  /** @hidden */
  _bodyGesture?: PositionGesture<ThemedSvgView>;
  /** @hidden */
  _footGesture?: PositionGesture<ThemedSvgView>;

  constructor(node: HTMLElement) {
    super(node);
    this.onClickHead = this.onClickHead.bind(this);
    this.onClickBody = this.onClickBody.bind(this);
    this.onClickFoot = this.onClickFoot.bind(this);
    this._pinState = "expanded";
    this.shape.insert();
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("pin");
    this.position.setAutoState("relative");
    this.height.setAutoState(32);
    this.boxSizing.setAutoState("content-box");
    this.userSelect.setAutoState("none");
  }

  // @ts-ignore
  declare readonly viewController: PinViewController | null;

  // @ts-ignore
  declare readonly viewObservers: ReadonlyArray<PinViewObserver>;

  initView(init: PinViewInit): void {
    super.initView(init);
  }

  protected initShape(shapeView: ThemedSvgView): void {
    shapeView.addClass("shape");
    shapeView.setStyle("position", "absolute");
    shapeView.setStyle("top", "0");
    shapeView.setStyle("left", "0");

    this.head.insert(shapeView, "head");
    this.body.insert(shapeView, "body");
    this.foot.insert(shapeView, "foot");
  }

  protected initHead(headView: ThemedSvgView): void {
    headView.addClass("head");
    headView.pointerEvents.setAutoState("fill");
    headView.cursor.setAutoState("pointer");
    const headGesture = this.createHeadGesture(headView);
    if (headGesture !== null) {
      this._headGesture = headGesture;
    }
  }

  protected createHeadGesture(headView: ThemedSvgView): PositionGesture<ThemedSvgView> | null {
    return new PositionGesture(headView, this.head);
  }

  protected initBody(bodyView: ThemedSvgView): void {
    bodyView.addClass("body");
    bodyView.pointerEvents.setAutoState("fill");
    bodyView.cursor.setAutoState("pointer");
    const bodyGesture = this.createBodyGesture(bodyView);
    if (bodyGesture !== null) {
      this._bodyGesture = bodyGesture;
    }
  }

  protected createBodyGesture(bodyView: ThemedSvgView): PositionGesture<ThemedSvgView> | null {
    return new PositionGesture(bodyView, this.body);
  }

  protected initFoot(footView: ThemedSvgView): void {
    footView.addClass("foot");
    footView.pointerEvents.setAutoState("fill");
    footView.cursor.setAutoState("pointer");
    const footGesture = this.createFootGesture(footView);
    if (footGesture !== null) {
      this._footGesture = footGesture;
    }
  }

  protected createFootGesture(footView: ThemedSvgView): PositionGesture<ThemedSvgView> | null {
    return new PositionGesture(footView, this.foot);
  }

  protected initIcon(iconView: SvgView | HtmlView): void {
    iconView.addClass("icon");
    if (iconView instanceof HtmlView) {
      iconView.position.setAutoState("absolute");
    } else {
      iconView.setStyle("position", "absolute");
    }
    iconView.pointerEvents.setAutoState("none");
  }

  protected initLabelContainer(labelContainer: HtmlView): void {
    labelContainer.addClass("label");
    labelContainer.display.setAutoState("block");
    labelContainer.position.setAutoState("absolute");
    labelContainer.top.setAutoState(0);
    labelContainer.left.setAutoState(0);
    labelContainer.overflowX.setAutoState("hidden");
    labelContainer.overflowY.setAutoState("hidden");
    labelContainer.pointerEvents.setAutoState("none");
  }

  protected initLabel(labelView: HtmlView): void {
    labelView.position.setAutoState("absolute");
    labelView.top.setAutoState(0);
    labelView.bottom.setAutoState(0);
    labelView.left.setAutoState(0);
  }

  protected initActionContainer(actionContainer: HtmlView): void {
    actionContainer.addClass("action");
    actionContainer.display.setAutoState("block");
    actionContainer.position.setAutoState("absolute");
    actionContainer.top.setAutoState(0);
    actionContainer.left.setAutoState(0);
    actionContainer.overflowX.setAutoState("hidden");
    actionContainer.overflowY.setAutoState("hidden");
    actionContainer.pointerEvents.setAutoState("none");
  }

  protected initAction(actionView: SvgView | HtmlView): void {
    if (actionView instanceof HtmlView) {
      actionView.position.setAutoState("absolute");
      actionView.top.setAutoState(0);
      actionView.bottom.setAutoState(0);
      actionView.left.setAutoState(0);
    } else if (actionView !== null) {
      actionView.setStyle("position", "absolute");
      actionView.setStyle("top", "0");
      actionView.setStyle("bottom", "0");
      actionView.setStyle("left", "0");
    }
  }

  get pinState(): PinViewState {
    return this._pinState;
  }

  isExpanded(): boolean {
    return this._pinState === "expanded" || this._pinState === "expanding";
  }

  isCollapsed(): boolean {
    return this._pinState === "collapsed" || this._pinState === "collapsing";
  }

  @ViewAnimator({type: Number, state: 1, updateFlags: View.NeedsLayout})
  expandedPhase: ViewAnimator<this, number>;

  @Subview<PinView, ThemedSvgView>({
    type: ThemedSvgView,
    tag: "svg",
    onSetSubview(shapeView: ThemedSvgView | null): void {
      if (shapeView !== null) {
        this.view.initShape(shapeView);
      }
    },
  })
  readonly shape: Subview<this, ThemedSvgView>;

  @Subview<PinView, ThemedSvgView, ThemedSvgView, ThemedViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: ThemedSvgView,
    tag: "path",
    onSetSubview(headView: ThemedSvgView | null): void {
      if (headView !== null) {
        this.view.initHead(headView);
      }
    },
    viewDidMount(headView: ThemedSvgView): void {
      headView.on("click", this.view.onClickHead);
    },
    viewWillUnmount(headView: ThemedSvgView): void {
      headView.off("click", this.view.onClickHead);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, headView: ThemedSvgView): void {
      headView.fill.setAutoState(theme.inner(mood, Look.accentColor), transition);
      const iconView = this.view.icon.subview;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.view.icon.embossed ? theme.inner(mood.updated(Feel.embossed, 1), Look.accentColor)
                                                  : theme.inner(mood, Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, transition);
      }
    },
    didStartHovering(): void {
      const headView = this.subview!;
      headView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const transition = headView.getLook(Look.transition);
      headView.fill.setAutoState(headView.getLook(Look.accentColor), transition);
      const iconView = this.view.icon.subview;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.view.icon.embossed ? headView.getLook(Look.accentColor, headView.mood.getState().updated(Feel.embossed, 1))
                                                  : headView.getLook(Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, transition);
      }
    },
    didStopHovering(): void {
      const headView = this.subview!;
      headView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const transition = headView.getLook(Look.transition);
      headView.fill.setAutoState(headView.getLook(Look.accentColor), transition);
      const iconView = this.view.icon.subview;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.view.icon.embossed ? headView.getLook(Look.accentColor, headView.mood.getState().updated(Feel.embossed, 1))
                                                  : headView.getLook(Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, transition);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._headGesture !== void 0 && input.inputType !== "mouse") {
        this.view._headGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._headGesture !== void 0 && input.isRunaway()) {
        this.view._headGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._headGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._headGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._headGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._headGesture.endHover(input, event);
      }
    },
  })
  readonly head: Subview<this, ThemedSvgView> & PositionGestureDelegate;

  @Subview<PinView, ThemedSvgView, ThemedSvgView, ThemedViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: ThemedSvgView,
    tag: "path",
    onSetSubview(bodyView: ThemedSvgView | null): void {
      if (bodyView !== null) {
        this.view.initBody(bodyView);
      }
    },
    viewDidMount(headView: ThemedSvgView): void {
      headView.on("click", this.view.onClickBody);
    },
    viewWillUnmount(headView: ThemedSvgView): void {
      headView.off("click", this.view.onClickBody);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, bodyView: ThemedSvgView): void {
      bodyView.fill.setAutoState(theme.inner(mood, Look.accentColor), transition);
      const labelView = this.view.label.subview;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(theme.inner(mood, Look.backgroundColor), transition);
      }
    },
    didStartHovering(): void {
      const bodyView = this.subview!;
      bodyView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const transition = bodyView.getLook(Look.transition);
      bodyView.fill.setAutoState(bodyView.getLook(Look.accentColor), transition);
      const labelView = this.view.label.subview;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(bodyView.getLook(Look.backgroundColor), transition);
      }
    },
    didStopHovering(): void {
      const bodyView = this.subview!;
      bodyView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const transition = bodyView.getLook(Look.transition);
      bodyView.fill.setAutoState(bodyView.getLook(Look.accentColor), transition);
      const labelView = this.view.label.subview;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(bodyView.getLook(Look.backgroundColor), transition);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._bodyGesture !== void 0 && input.inputType !== "mouse") {
        this.view._bodyGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._bodyGesture !== void 0 && input.isRunaway()) {
        this.view._bodyGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._bodyGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._bodyGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._bodyGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._bodyGesture.endHover(input, event);
      }
    },
  })
  readonly body: Subview<this, ThemedSvgView> & PositionGestureDelegate;

  @Subview<PinView, ThemedSvgView, ThemedSvgView, ThemedViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: ThemedSvgView,
    tag: "path",
    onSetSubview(footView: ThemedSvgView | null): void {
      if (footView !== null) {
        this.view.initFoot(footView);
      }
    },
    viewDidMount(footView: ThemedSvgView): void {
      footView.on("click", this.view.onClickFoot);
    },
    viewWillUnmount(footView: ThemedSvgView): void {
      footView.off("click", this.view.onClickFoot);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, footView: ThemedSvgView): void {
      footView.fill.setAutoState(theme.inner(mood, Look.accentColor), transition);
      const actionView = this.view.action.subview;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.view.action.embossed ? theme.inner(mood.updated(Feel.embossed, 1), Look.accentColor)
                                                    : theme.inner(mood, Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, transition);
      }
    },
    didStartHovering(): void {
      const footView = this.subview!;
      footView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const transition = footView.getLook(Look.transition);
      footView.fill.setAutoState(footView.getLook(Look.accentColor), transition);
      const actionView = this.view.action.subview;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.view.action.embossed ? footView.getLook(Look.accentColor, footView.mood.getState().updated(Feel.embossed, 1))
                                                    : footView.getLook(Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, transition);
      }
    },
    didStopHovering(): void {
      const footView = this.subview!;
      footView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const transition = footView.getLook(Look.transition);
      footView.fill.setAutoState(footView.getLook(Look.accentColor), transition);
      const actionView = this.view.action.subview;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.view.action.embossed ? footView.getLook(Look.accentColor, footView.mood.getState().updated(Feel.embossed, 1))
                                                    : footView.getLook(Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, transition);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._footGesture !== void 0 && input.inputType !== "mouse") {
        this.view._footGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._footGesture !== void 0 && input.isRunaway()) {
        this.view._footGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._footGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._footGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      if (this.view._footGesture !== void 0 && (input.inputType !== "mouse" || !this.subview!.clientBounds.contains(input.x, input.y))) {
        this.view._footGesture.endHover(input, event);
      }
    },
  })
  readonly foot: Subview<this, ThemedSvgView> & PositionGestureDelegate;

  @Subview<PinView, SvgView | HtmlView, SvgView | HtmlView, {embossed: boolean}>({
    extends: void 0,
    type: SvgView,
    tag: "path",
    embossed: true,
    onSetSubview(iconView: SvgView | HtmlView | null): void {
      if (iconView !== null) {
        this.view.initIcon(iconView);
      }
    },
  })
  readonly icon: Subview<this, SvgView | HtmlView> & {embossed: boolean};

  @Subview<PinView, HtmlView>({
    type: HtmlView,
    onSetSubview(labelContainer: HtmlView | null): void {
      if (labelContainer !== null) {
        this.view.initLabelContainer(labelContainer);
      }
    },
  })
  readonly labelContainer: Subview<this, HtmlView>;

  @Subview<PinView, HtmlView>({
    child: false,
    type: HtmlView,
    onSetSubview(labelView: HtmlView | null): void {
      if (labelView !== null) {
        if (labelView.parentView === null) {
          this.view.labelContainer.insert();
          const labelContainer = this.view.labelContainer.subview;
          if (labelContainer !== null) {
            labelContainer.appendChildView(labelView);
          }
        }
        this.view.initLabel(labelView);
      }
    },
  })
  readonly label: Subview<this, HtmlView>;

  @Subview<PinView, HtmlView>({
    type: HtmlView,
    onSetSubview(actionContainer: HtmlView | null): void {
      if (actionContainer !== null) {
        this.view.initActionContainer(actionContainer);
      }
    },
  })
  readonly actionContainer: Subview<this, HtmlView>;

  @Subview<PinView, SvgView | HtmlView, SvgView | HtmlView, {embossed: boolean}>({
    extends: void 0,
    child: false,
    type: HtmlView,
    embossed: true,
    onSetSubview(actionView: SvgView | HtmlView | null): void {
      if (actionView !== null) {
        if (actionView.parentView === null) {
          this.view.actionContainer.insert();
          const actionContainer = this.view.actionContainer.subview;
          if (actionContainer !== null) {
            actionContainer.appendChildView(actionView);
          }
        }
        this.view.initAction(actionView);
      }
    },
  })
  readonly action: Subview<this, SvgView | HtmlView> & {embossed: boolean};

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsLayout) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutPin();
  }

  protected layoutPin(): void {
    const gap = 2;

    const paddingTop = this.paddingTop.getStateOr(Length.zero()).pxValue();
    const paddingRight = this.paddingRight.getStateOr(Length.zero()).pxValue();
    const paddingBottom = this.paddingBottom.getStateOr(Length.zero()).pxValue();
    const paddingLeft = this.paddingLeft.getStateOr(Length.zero()).pxValue();
    const boxHeight = this._node.clientHeight;
    const pinHeight = boxHeight - paddingTop - paddingBottom;
    const radius = pinHeight / 2;
    const pad = Math.sqrt(gap * gap + 2 * radius * gap);
    const padAngle = Math.asin(pad / (radius + gap));
    const labelPaddingLeft = radius / 2;
    const labelPaddingRight = radius;
    const actionPaddingRight = radius / 2;
    const expandedPhase = this.expandedPhase.value;

    const shapeView = this.shape.subview;
    const headView = this.head.subview;
    const bodyView = this.body.subview;
    const footView = this.foot.subview;
    const iconView = this.icon.subview;
    const labelContainer = this.labelContainer.subview;
    const labelView = this.label.subview;
    const actionContainer = this.actionContainer.subview;
    const actionView = this.action.subview;

    let labelWidth = 0;
    let bodyWidth = 0;
    if (labelView !== null) {
      labelWidth = labelView._node.clientWidth;
      bodyWidth += labelPaddingLeft + labelWidth + labelPaddingRight;
    }

    let actionWidth = 0;
    let footWidth = 0;
    if (actionView instanceof SvgView) {
      actionWidth = actionView.width.getStateOr(Length.zero()).pxValue();
      footWidth += actionWidth + actionPaddingRight;
    } else if (actionView !== null) {
      actionWidth = actionView._node.clientWidth;
      footWidth += actionWidth + actionPaddingRight;
    }

    let pinWidth = pinHeight
    if (expandedPhase !== 0 && bodyWidth !== 0) {
      pinWidth += gap + expandedPhase * bodyWidth;
    }
    const bodyRight = pinWidth;
    if (expandedPhase !== 0 && footWidth !== 0) {
      pinWidth += gap + expandedPhase * footWidth;
    }

    const width = pinWidth + paddingLeft + paddingRight;
    const height = boxHeight;

    this.width.setAutoState(pinWidth);

    if (labelContainer !== null) {
      labelContainer.display.setAutoState(expandedPhase !== 0 ? "block" : "none");
      labelContainer.left.setAutoState(paddingLeft + pinHeight + gap + labelPaddingLeft);
      labelContainer.top.setAutoState(paddingTop);
      labelContainer.width.setAutoState(expandedPhase * labelWidth);
      labelContainer.height.setAutoState(pinHeight);
    }

    if (actionContainer !== null) {
      actionContainer.display.setAutoState(expandedPhase !== 0 ? "block" : "none");
      actionContainer.left.setAutoState(paddingLeft + bodyRight + gap);
      actionContainer.top.setAutoState(paddingTop);
      actionContainer.width.setAutoState(expandedPhase * actionWidth);
      actionContainer.height.setAutoState(pinHeight);
    }

    if (shapeView !== null) {
      shapeView.width.setAutoState(width);
      shapeView.height.setAutoState(height);
      shapeView.viewBox.setAutoState("0 0 " + width + " " + height);
    }

    if (headView !== null) {
      const context = new PathContext();
      context.arc(paddingLeft + radius, paddingTop + radius, radius, -(Math.PI / 2), 3 * (Math.PI / 2));
      headView.d.setAutoState(context.toString());
    }

    if (bodyView !== null) {
      const context = new PathContext();
      if (expandedPhase !== 0) {
        const u = 1 - expandedPhase;
        context.arc(paddingLeft + radius, paddingTop + radius, radius + gap, -(Math.PI / 2) + padAngle, Math.PI / 2 - padAngle);
        context.arc(paddingLeft + bodyRight - radius - u * gap, paddingTop + radius, radius + u * gap, Math.PI / 2 - u * padAngle, -(Math.PI / 2) + u * padAngle, true);
        context.closePath();
      }
      bodyView.d.setAutoState(context.toString());
    }

    if (footView !== null && actionView !== null) {
      const context = new PathContext();
      if (expandedPhase !== 0) {
        const u = 1 - expandedPhase;
        context.arc(paddingLeft + bodyRight - radius, paddingTop + radius, radius + gap, -(Math.PI / 2) + padAngle, Math.PI / 2 - padAngle);
        context.arc(paddingLeft + pinWidth - radius - u * gap, paddingTop + radius, radius + u * gap, Math.PI / 2 - u * padAngle, -(Math.PI / 2) + u * padAngle, true);
        context.closePath();
      }
      footView.d.setAutoState(context.toString());
    }

    if (iconView instanceof HtmlView) {
      iconView.left.setAutoState(paddingLeft);
      iconView.top.setAutoState(paddingTop);
      iconView.width.setAutoState(pinHeight);
      iconView.height.setAutoState(pinHeight);
    } else if (iconView !== null) {
      iconView.setStyle("left", paddingLeft + "px");
      iconView.setStyle("top", paddingTop + "px");
      iconView.setStyle("width", pinHeight + "px");
      iconView.setStyle("height", pinHeight + "px");
    }

    if (actionView instanceof HtmlView) {
      actionView.top.setAutoState(0);
      actionView.bottom.setAutoState(0);
    } else if (actionView !== null) {
      const actionHeight = actionView.height.getStateOr(Length.zero()).pxValue();
      const actionPadding = (height - actionHeight) / 2;
      actionView.setStyle("top", actionPadding + "px");
      actionView.setStyle("bottom", actionPadding + "px");
    }
  }

  expand(tween?: Tween<any>): void {
    if (this._pinState !== "expanded" || this.expandedPhase.value !== 1) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      if (this._pinState !== "expanding") {
        this.willExpand();
      }
      if (tween !== null) {
        if (this.expandedPhase.value !== 1) {
          this.expandedPhase.setAutoState(1, tween.onEnd(this.didExpand.bind(this)));
        } else {
          setTimeout(this.didExpand.bind(this));
        }
      } else {
        this.expandedPhase.setAutoState(1);
        this.didExpand();
      }
    }
  }

  protected willExpand(): void {
    this._pinState = "expanding";
    const labelContainer = this.labelContainer.subview;
    if (labelContainer !== null) {
      labelContainer.display.setAutoState("block");
    }
    const actionContainer = this.actionContainer.subview;
    if (actionContainer !== null) {
      actionContainer.display.setAutoState("block");
    }
    this.willObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinWillExpand !== void 0) {
        viewObserver.pinWillExpand(this);
      }
    });
  }

  protected didExpand(): void {
    this._pinState = "expanded";
    this.requireUpdate(View.NeedsLayout);
    this.didObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinDidExpand !== void 0) {
        viewObserver.pinDidExpand(this);
      }
    });
  }

  collapse(tween?: Tween<any>): void {
    if (this._pinState !== "collapsed" || this.expandedPhase.value !== 0) {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      if (this._pinState !== "collapsing") {
        this.willCollapse();
      }
      if (tween !== null) {
        if (this.expandedPhase.value !== 0) {
          this.expandedPhase.setAutoState(0, tween.onEnd(this.didCollapse.bind(this)));
        } else {
          setTimeout(this.didCollapse.bind(this));
        }
      } else {
        this.expandedPhase.setAutoState(0);
        this.didCollapse();
      }
    }
  }

  protected willCollapse(): void {
    this._pinState = "collapsing";
    this.willObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinWillCollapse !== void 0) {
        viewObserver.pinWillCollapse(this);
      }
    });
  }

  protected didCollapse(): void {
    this._pinState = "collapsed";
    this.requireUpdate(View.NeedsLayout);
    this.didObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinDidCollapse !== void 0) {
        viewObserver.pinDidCollapse(this);
      }
    });
  }

  toggle(tween?: Tween<any>): void {
    const pinState = this._pinState;
    if (pinState === "collapsed" || pinState === "collapsing") {
      this.expand(tween);
    } else if (pinState === "expanded" || pinState === "expanding") {
      this.collapse(tween);
    }
  }

  protected onClickHead(event: MouseEvent): void {
    this.didPressHead();
  }

  protected didPressHead(): void {
    this.didObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinDidPressHead !== void 0) {
        viewObserver.pinDidPressHead(this);
      }
    });
  }

  protected onClickBody(event: MouseEvent): void {
    this.didPressBody();
  }

  protected didPressBody(): void {
    this.didObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinDidPressBody !== void 0) {
        viewObserver.pinDidPressBody(this);
      }
    });
  }

  protected onClickFoot(event: MouseEvent): void {
    this.didPressFoot();
  }

  protected didPressFoot(): void {
    this.didObserve(function (viewObserver: PinViewObserver): void {
      if (viewObserver.pinDidPressFoot !== void 0) {
        viewObserver.pinDidPressFoot(this);
      }
    });
  }
}
