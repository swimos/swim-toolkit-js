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
import {Length} from "@swim/math";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewObserver, ViewAnimator, ViewRelation} from "@swim/view";
import {ElementView, HtmlViewInit, HtmlView, SvgView} from "@swim/dom";
import {PathContext} from "@swim/graphics";
import {PositionGestureInput, PositionGesture, PositionGestureDelegate} from "@swim/gesture";
import type {TokenViewObserver} from "./TokenViewObserver";
import type {TokenViewController} from "./TokenViewController";

export type TokenViewState = "collapsed" | "expanding" | "expanded" | "collapsing";

export interface TokenViewInit extends HtmlViewInit {
  controller?: TokenViewController;
}

export class TokenView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "tokenState", {
      value: "expanded",
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "headGesture", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "bodyGesture", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "footGesture", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    this.onClickHead = this.onClickHead.bind(this);
    this.onClickBody = this.onClickBody.bind(this);
    this.onClickFoot = this.onClickFoot.bind(this);
    this.initNode(node);
    this.initChildViews();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("token");
    this.position.setAutoState("relative");
    this.height.setAutoState(32);
    this.boxSizing.setAutoState("content-box");
    this.userSelect.setAutoState("none");
  }

  declare readonly viewController: TokenViewController | null;

  declare readonly viewObservers: ReadonlyArray<TokenViewObserver>;

  initView(init: TokenViewInit): void {
    super.initView(init);
  }

  protected initChildViews(): void {
    this.shape.insert();
  }

  protected initShape(shapeView: SvgView): void {
    shapeView.addClass("shape");
    shapeView.setStyle("position", "absolute");
    shapeView.setStyle("top", "0");
    shapeView.setStyle("left", "0");

    this.head.insert(shapeView, "head");
    this.body.insert(shapeView, "body");
    this.foot.insert(shapeView, "foot");
  }

  protected initHead(headView: SvgView): void {
    headView.addClass("head");
    headView.pointerEvents.setAutoState("fill");
    headView.cursor.setAutoState("pointer");
    const headGesture = this.createHeadGesture(headView);
    if (headGesture !== null) {
      Object.defineProperty(this, "headGesture", {
        value: headGesture,
        enumerable: true,
        configurable: true,
      });
    }
  }

  /** @hidden */
  declare readonly headGesture: PositionGesture<SvgView> | null;

  protected createHeadGesture(headView: SvgView): PositionGesture<SvgView> | null {
    return new PositionGesture(headView, this.head);
  }

  protected initBody(bodyView: SvgView): void {
    bodyView.addClass("body");
    bodyView.pointerEvents.setAutoState("fill");
    bodyView.cursor.setAutoState("pointer");
    const bodyGesture = this.createBodyGesture(bodyView);
    if (bodyGesture !== null) {
      Object.defineProperty(this, "bodyGesture", {
        value: bodyGesture,
        enumerable: true,
        configurable: true,
      });
    }
  }

  /** @hidden */
  declare readonly bodyGesture: PositionGesture<SvgView> | null;

  protected createBodyGesture(bodyView: SvgView): PositionGesture<SvgView> | null {
    return new PositionGesture(bodyView, this.body);
  }

  protected initFoot(footView: SvgView): void {
    footView.addClass("foot");
    footView.pointerEvents.setAutoState("fill");
    footView.cursor.setAutoState("pointer");
    const footGesture = this.createFootGesture(footView);
    if (footGesture !== null) {
      Object.defineProperty(this, "footGesture", {
        value: footGesture,
        enumerable: true,
        configurable: true,
      });
    }
  }

  /** @hidden */
  declare readonly footGesture: PositionGesture<SvgView> | null;

  protected createFootGesture(footView: SvgView): PositionGesture<SvgView> | null {
    return new PositionGesture(footView, this.foot);
  }

  protected initIcon(iconView: ElementView): void {
    iconView.addClass("icon");
    if (iconView instanceof HtmlView) {
      iconView.position.setAutoState("absolute");
      iconView.pointerEvents.setAutoState("none");
    } else if (iconView instanceof SvgView) {
      iconView.setStyle("position", "absolute");
      iconView.pointerEvents.setAutoState("none");
    }
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

  protected initAction(actionView: ElementView): void {
    if (actionView instanceof HtmlView) {
      actionView.position.setAutoState("absolute");
      actionView.top.setAutoState(0);
      actionView.bottom.setAutoState(0);
      actionView.left.setAutoState(0);
    } else if (actionView instanceof SvgView) {
      actionView.setStyle("position", "absolute");
      actionView.setStyle("top", "0");
      actionView.setStyle("bottom", "0");
      actionView.setStyle("left", "0");
    }
  }

  declare readonly tokenState: TokenViewState;

  isExpanded(): boolean {
    return this.tokenState === "expanded" || this.tokenState === "expanding";
  }

  isCollapsed(): boolean {
    return this.tokenState === "collapsed" || this.tokenState === "collapsing";
  }

  @ViewAnimator<TokenView, number>({
    type: Number,
    state: 1,
    updateFlags: View.NeedsLayout,
    onEnd(expandedPhase: number): void {
      const tokenState = this.owner.tokenState;
      if (tokenState === "expanding" && expandedPhase === 1) {
        this.owner.didExpand();
      } else if (tokenState === "collapsing" && expandedPhase === 0) {
        this.owner.didCollapse();
      }
    },
  })
  declare expandedPhase: ViewAnimator<this, number>;

  @ViewRelation<TokenView, SvgView>({
    type: SvgView,
    onSetView(shapeView: SvgView | null): void {
      if (shapeView !== null) {
        this.owner.initShape(shapeView);
      }
    },
  })
  declare shape: ViewRelation<this, SvgView>;

  @ViewRelation<TokenView, SvgView, SvgView, ViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: SvgView.path,
    onSetView(headView: SvgView | null): void {
      if (headView !== null) {
        this.owner.initHead(headView);
      }
    },
    viewDidMount(headView: SvgView): void {
      headView.on("click", this.owner.onClickHead);
    },
    viewWillUnmount(headView: SvgView): void {
      headView.off("click", this.owner.onClickHead);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, headView: SvgView): void {
      headView.fill.setAutoState(theme.inner(mood, Look.accentColor), timing);
      const iconView = this.owner.icon.view;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.owner.icon.embossed ? theme.inner(mood.updated(Feel.embossed, 1), Look.accentColor)
                                                   : theme.inner(mood, Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, timing);
      }
    },
    didStartHovering(): void {
      const headView = this.view!;
      headView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const timing = headView.getLook(Look.timing);
      headView.fill.setAutoState(headView.getLook(Look.accentColor), timing);
      const iconView = this.owner.icon.view;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.owner.icon.embossed ? headView.getLook(Look.accentColor, headView.mood.getState().updated(Feel.embossed, 1))
                                                   : headView.getLook(Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, timing);
      }
    },
    didStopHovering(): void {
      const headView = this.view!;
      headView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const timing = headView.getLook(Look.timing);
      headView.fill.setAutoState(headView.getLook(Look.accentColor), timing);
      const iconView = this.owner.icon.view;
      if (iconView instanceof SvgView && iconView.fill.isAuto()) {
        const iconColor = this.owner.icon.embossed ? headView.getLook(Look.accentColor, headView.mood.getState().updated(Feel.embossed, 1))
                                                   : headView.getLook(Look.backgroundColor);
        iconView.fill.setAutoState(iconColor, timing);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      const headGesture = this.owner.headGesture;
      if (headGesture !== null && input.inputType !== "mouse") {
        headGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      const headGesture = this.owner.headGesture;
      if (headGesture !== null && input.isRunaway()) {
        headGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      const headGesture = this.owner.headGesture;
      if (headGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        headGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      const headGesture = this.owner.headGesture;
      if (headGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        headGesture.endHover(input, event);
      }
    },
  })
  declare head: ViewRelation<this, SvgView> & PositionGestureDelegate;

  @ViewRelation<TokenView, SvgView, SvgView, ViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: SvgView.path,
    onSetView(bodyView: SvgView | null): void {
      if (bodyView !== null) {
        this.owner.initBody(bodyView);
      }
    },
    viewDidMount(headView: SvgView): void {
      headView.on("click", this.owner.onClickBody);
    },
    viewWillUnmount(headView: SvgView): void {
      headView.off("click", this.owner.onClickBody);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, bodyView: SvgView): void {
      bodyView.fill.setAutoState(theme.inner(mood, Look.accentColor), timing);
      const labelView = this.owner.label.view;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(theme.inner(mood, Look.backgroundColor), timing);
      }
    },
    didStartHovering(): void {
      const bodyView = this.view!;
      bodyView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const timing = bodyView.getLook(Look.timing);
      bodyView.fill.setAutoState(bodyView.getLook(Look.accentColor), timing);
      const labelView = this.owner.label.view;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(bodyView.getLook(Look.backgroundColor), timing);
      }
    },
    didStopHovering(): void {
      const bodyView = this.view!;
      bodyView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const timing = bodyView.getLook(Look.timing);
      bodyView.fill.setAutoState(bodyView.getLook(Look.accentColor), timing);
      const labelView = this.owner.label.view;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(bodyView.getLook(Look.backgroundColor), timing);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      const bodyGesture = this.owner.bodyGesture;
      if (bodyGesture !== null && input.inputType !== "mouse") {
        bodyGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      const bodyGesture = this.owner.bodyGesture;
      if (bodyGesture !== null && input.isRunaway()) {
        bodyGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      const bodyGesture = this.owner.bodyGesture;
      if (bodyGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        bodyGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      const bodyGesture = this.owner.bodyGesture;
      if (bodyGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        bodyGesture.endHover(input, event);
      }
    },
  })
  declare body: ViewRelation<this, SvgView> & PositionGestureDelegate;

  @ViewRelation<TokenView, SvgView, SvgView, ViewObserver & PositionGestureDelegate>({
    extends: void 0,
    child: false,
    type: SvgView.path,
    onSetView(footView: SvgView | null): void {
      if (footView !== null) {
        this.owner.initFoot(footView);
      }
    },
    viewDidMount(footView: SvgView): void {
      footView.on("click", this.owner.onClickFoot);
    },
    viewWillUnmount(footView: SvgView): void {
      footView.off("click", this.owner.onClickFoot);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, footView: SvgView): void {
      footView.fill.setAutoState(theme.inner(mood, Look.accentColor), timing);
      const actionView = this.owner.action.view;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.owner.action.embossed ? theme.inner(mood.updated(Feel.embossed, 1), Look.accentColor)
                                                     : theme.inner(mood, Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, timing);
      }
    },
    didStartHovering(): void {
      const footView = this.view!;
      footView.modifyMood(Feel.default, [Feel.hovering, 1]);
      const timing = footView.getLook(Look.timing);
      footView.fill.setAutoState(footView.getLook(Look.accentColor), timing);
      const actionView = this.owner.action.view;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.owner.action.embossed ? footView.getLook(Look.accentColor, footView.mood.getState().updated(Feel.embossed, 1))
                                                     : footView.getLook(Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, timing);
      }
    },
    didStopHovering(): void {
      const footView = this.view!;
      footView.modifyMood(Feel.default, [Feel.hovering, void 0]);
      const timing = footView.getLook(Look.timing);
      footView.fill.setAutoState(footView.getLook(Look.accentColor), timing);
      const actionView = this.owner.action.view;
      if (actionView instanceof SvgView && actionView.fill.isAuto()) {
        const iconColor = this.owner.action.embossed ? footView.getLook(Look.accentColor, footView.mood.getState().updated(Feel.embossed, 1))
                                                     : footView.getLook(Look.backgroundColor);
        actionView.fill.setAutoState(iconColor, timing);
      }
    },
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      const footGesture = this.owner.footGesture;
      if (footGesture !== null && input.inputType !== "mouse") {
        footGesture.beginHover(input, event);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      const footGesture = this.owner.footGesture;
      if (footGesture !== null && input.isRunaway()) {
        footGesture.cancelPress(input, event);
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      const footGesture = this.owner.footGesture;
      if (footGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        footGesture.endHover(input, event);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      const footGesture = this.owner.footGesture;
      if (footGesture !== null && (input.inputType !== "mouse" || !this.view!.clientBounds.contains(input.x, input.y))) {
        footGesture.endHover(input, event);
      }
    },
  })
  declare foot: ViewRelation<this, SvgView> & PositionGestureDelegate;

  @ViewRelation<TokenView, ElementView, Element, {embossed: boolean}>({
    extends: void 0,
    type: SvgView.path,
    embossed: true,
    onSetView(iconView: ElementView | null): void {
      if (iconView !== null) {
        this.owner.initIcon(iconView);
      }
    },
    fromAny(value: ElementView | Element): ElementView {
      return ElementView.fromAny(value);
    },
  })
  declare icon: ViewRelation<this, ElementView> & {embossed: boolean};

  @ViewRelation<TokenView, HtmlView>({
    type: HtmlView,
    onSetView(labelContainer: HtmlView | null): void {
      if (labelContainer !== null) {
        this.owner.initLabelContainer(labelContainer);
      }
    },
  })
  declare labelContainer: ViewRelation<this, HtmlView>;

  @ViewRelation<TokenView, HtmlView>({
    child: false,
    type: HtmlView,
    onSetView(labelView: HtmlView | null): void {
      if (labelView !== null) {
        if (labelView.parentView === null) {
          this.owner.labelContainer.insert();
          const labelContainer = this.owner.labelContainer.view;
          if (labelContainer !== null) {
            labelContainer.appendChildView(labelView);
          }
        }
        this.owner.initLabel(labelView);
      }
    },
  })
  declare label: ViewRelation<this, HtmlView>;

  @ViewRelation<TokenView, HtmlView>({
    type: HtmlView,
    onSetView(actionContainer: HtmlView | null): void {
      if (actionContainer !== null) {
        this.owner.initActionContainer(actionContainer);
      }
    },
  })
  declare actionContainer: ViewRelation<this, HtmlView>;

  @ViewRelation<TokenView, ElementView, Element, {embossed: boolean}>({
    extends: void 0,
    child: false,
    type: HtmlView,
    embossed: true,
    onSetView(actionView: ElementView | null): void {
      if (actionView !== null) {
        if (actionView.parentView === null) {
          this.owner.actionContainer.insert();
          const actionContainer = this.owner.actionContainer.view;
          if (actionContainer !== null) {
            actionContainer.appendChildView(actionView);
          }
        }
        this.owner.initAction(actionView);
      }
    },
    fromAny(value: ElementView | Element): ElementView {
      return ElementView.fromAny(value);
    },
  })
  declare action: ViewRelation<this, ElementView> & {embossed: boolean};

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsLayout) !== 0) {
      processFlags |= View.NeedsAnimate;
    }
    return processFlags;
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutToken();
  }

  protected layoutToken(): void {
    const gap = 2;

    const paddingTop = this.paddingTop.getStateOr(Length.zero()).pxValue();
    const paddingRight = this.paddingRight.getStateOr(Length.zero()).pxValue();
    const paddingBottom = this.paddingBottom.getStateOr(Length.zero()).pxValue();
    const paddingLeft = this.paddingLeft.getStateOr(Length.zero()).pxValue();
    const boxHeight = this.node.clientHeight;
    const tokenHeight = boxHeight - paddingTop - paddingBottom;
    const radius = tokenHeight / 2;
    const pad = Math.sqrt(gap * gap + 2 * radius * gap);
    const padAngle = Math.asin(pad / (radius + gap));
    const labelPaddingLeft = radius / 2;
    const labelPaddingRight = radius;
    const actionPaddingRight = radius / 2;
    const expandedPhase = this.expandedPhase.value;

    const shapeView = this.shape.view;
    const headView = this.head.view;
    const bodyView = this.body.view;
    const footView = this.foot.view;
    const iconView = this.icon.view;
    const labelContainer = this.labelContainer.view;
    const labelView = this.label.view;
    const actionContainer = this.actionContainer.view;
    const actionView = this.action.view;

    let labelWidth = 0;
    let bodyWidth = 0;
    if (labelView !== null) {
      labelWidth = labelView.node.clientWidth;
      bodyWidth += labelPaddingLeft + labelWidth + labelPaddingRight;
    }

    let actionWidth = 0;
    let footWidth = 0;
    if (actionView instanceof SvgView) {
      actionWidth = actionView.width.getStateOr(Length.zero()).pxValue();
      footWidth += actionWidth + actionPaddingRight;
    } else if (actionView !== null) {
      actionWidth = actionView.node.clientWidth;
      footWidth += actionWidth + actionPaddingRight;
    }

    let tokenWidth = tokenHeight
    if (expandedPhase !== 0 && bodyWidth !== 0) {
      tokenWidth += gap + expandedPhase * bodyWidth;
    }
    const bodyRight = tokenWidth;
    if (expandedPhase !== 0 && footWidth !== 0) {
      tokenWidth += gap + expandedPhase * footWidth;
    }

    const width = tokenWidth + paddingLeft + paddingRight;
    const height = boxHeight;

    this.width.setAutoState(tokenWidth);

    if (labelContainer !== null) {
      labelContainer.display.setAutoState(expandedPhase !== 0 ? "block" : "none");
      labelContainer.left.setAutoState(paddingLeft + tokenHeight + gap + labelPaddingLeft);
      labelContainer.top.setAutoState(paddingTop);
      labelContainer.width.setAutoState(expandedPhase * labelWidth);
      labelContainer.height.setAutoState(tokenHeight);
    }

    if (actionContainer !== null) {
      actionContainer.display.setAutoState(expandedPhase !== 0 ? "block" : "none");
      actionContainer.left.setAutoState(paddingLeft + bodyRight + gap);
      actionContainer.top.setAutoState(paddingTop);
      actionContainer.width.setAutoState(expandedPhase * actionWidth);
      actionContainer.height.setAutoState(tokenHeight);
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
        context.arc(paddingLeft + tokenWidth - radius - u * gap, paddingTop + radius, radius + u * gap, Math.PI / 2 - u * padAngle, -(Math.PI / 2) + u * padAngle, true);
        context.closePath();
      }
      footView.d.setAutoState(context.toString());
    }

    if (iconView instanceof HtmlView) {
      iconView.left.setAutoState(paddingLeft);
      iconView.top.setAutoState(paddingTop);
      iconView.width.setAutoState(tokenHeight);
      iconView.height.setAutoState(tokenHeight);
    } else if (iconView instanceof SvgView) {
      iconView.setStyle("left", paddingLeft + "px");
      iconView.setStyle("top", paddingTop + "px");
      iconView.setStyle("width", tokenHeight + "px");
      iconView.setStyle("height", tokenHeight + "px");
    }

    if (actionView instanceof HtmlView) {
      actionView.top.setAutoState(0);
      actionView.bottom.setAutoState(0);
    } else if (actionView instanceof SvgView) {
      const actionHeight = actionView.height.getStateOr(Length.zero()).pxValue();
      const actionPadding = (height - actionHeight) / 2;
      actionView.setStyle("top", actionPadding + "px");
      actionView.setStyle("bottom", actionPadding + "px");
    }
  }

  expand(timing?: AnyTiming | boolean): void {
    if (this.tokenState !== "expanded" || this.expandedPhase.value !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.tokenState !== "expanding") {
        this.willExpand();
      }
      if (timing !== null) {
        if (this.expandedPhase.value !== 1) {
          this.expandedPhase.setAutoState(1, timing);
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
    Object.defineProperty(this, "tokenState", {
      value: "expanding",
      enumerable: true,
      configurable: true,
    });
    const labelContainer = this.labelContainer.view;
    if (labelContainer !== null) {
      labelContainer.display.setAutoState("block");
    }
    const actionContainer = this.actionContainer.view;
    if (actionContainer !== null) {
      actionContainer.display.setAutoState("block");
    }

    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenWillExpand !== void 0) {
      viewController.tokenWillExpand(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenWillExpand !== void 0) {
        viewObserver.tokenWillExpand(this);
      }
    }
  }

  protected didExpand(): void {
    Object.defineProperty(this, "tokenState", {
      value: "expanded",
      enumerable: true,
      configurable: true,
    });
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidExpand !== void 0) {
        viewObserver.tokenDidExpand(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidExpand !== void 0) {
      viewController.tokenDidExpand(this);
    }
  }

  collapse(timing?: AnyTiming | boolean): void {
    if (this.tokenState !== "collapsed" || this.expandedPhase.value !== 0) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.tokenState !== "collapsing") {
        this.willCollapse();
      }
      if (timing !== null) {
        if (this.expandedPhase.value !== 0) {
          this.expandedPhase.setAutoState(0, timing);
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
    Object.defineProperty(this, "tokenState", {
      value: "collapsing",
      enumerable: true,
      configurable: true,
    });

    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenWillCollapse !== void 0) {
      viewController.tokenWillCollapse(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenWillCollapse !== void 0) {
        viewObserver.tokenWillCollapse(this);
      }
    }
  }

  protected didCollapse(): void {
    Object.defineProperty(this, "tokenState", {
      value: "collapsed",
      enumerable: true,
      configurable: true,
    });
    this.requireUpdate(View.NeedsLayout);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidCollapse !== void 0) {
        viewObserver.tokenDidCollapse(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidCollapse !== void 0) {
      viewController.tokenDidCollapse(this);
    }
  }

  toggle(timing?: AnyTiming | boolean): void {
    const tokenState = this.tokenState;
    if (tokenState === "collapsed" || tokenState === "collapsing") {
      this.expand(timing);
    } else if (tokenState === "expanded" || tokenState === "expanding") {
      this.collapse(timing);
    }
  }

  protected onClickHead(event: MouseEvent): void {
    this.didPressHead();
  }

  protected didPressHead(): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidPressHead !== void 0) {
        viewObserver.tokenDidPressHead(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidPressHead !== void 0) {
      viewController.tokenDidPressHead(this);
    }
  }

  protected onClickBody(event: MouseEvent): void {
    this.didPressBody();
  }

  protected didPressBody(): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidPressBody !== void 0) {
        viewObserver.tokenDidPressBody(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidPressBody !== void 0) {
      viewController.tokenDidPressBody(this);
    }
  }

  protected onClickFoot(event: MouseEvent): void {
    this.didPressFoot();
  }

  protected didPressFoot(): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidPressFoot !== void 0) {
        viewObserver.tokenDidPressFoot(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidPressFoot !== void 0) {
      viewController.tokenDidPressFoot(this);
    }
  }
}
