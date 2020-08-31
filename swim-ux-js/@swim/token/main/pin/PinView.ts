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

  constructor(node: HTMLElement) {
    super(node);
    this.onClickHead = this.onClickHead.bind(this);
    this.onClickBody = this.onClickBody.bind(this);
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
    shapeView.setStyle("right", "0");
    shapeView.setStyle("bottom", "0");
    shapeView.setStyle("left", "0");

    this.head.insert(shapeView, "head");
    this.body.insert(shapeView, "body");
  }

  protected initHead(headView: ThemedSvgView): void {
    headView.addClass("head");
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
    bodyView.cursor.setAutoState("pointer");
    const bodyGesture = this.createBodyGesture(bodyView);
    if (bodyGesture !== null) {
      this._bodyGesture = new PositionGesture(bodyView, this.body);
    }
  }

  protected createBodyGesture(bodyView: ThemedSvgView): PositionGesture<ThemedSvgView> | null {
    return new PositionGesture(bodyView, this.body);
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

  protected initLabel(labelView: HtmlView): void {
    labelView.position.setAutoState("absolute");
    labelView.left.setAutoState(0);
    labelView.top.setAutoState(0);
    labelView.visibility.setAutoState("visible");
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
    onSetSubview(labelView: HtmlView | null): void {
      if (labelView !== null) {
        this.view.initLabel(labelView);
      }
    },
  })
  readonly label: Subview<this, HtmlView>;

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

    const nodeStyle = window.getComputedStyle(this._node);
    const paddingTop = Length.parse(nodeStyle.paddingTop).pxValue();
    const paddingRight = Length.parse(nodeStyle.paddingRight).pxValue();
    const paddingBottom = Length.parse(nodeStyle.paddingBottom).pxValue();
    const paddingLeft = Length.parse(nodeStyle.paddingLeft).pxValue();
    const boxHeight = this._node.offsetHeight;
    const pinHeight = boxHeight - paddingTop - paddingBottom;
    const radius = pinHeight / 2;
    const pad = Math.sqrt(gap * gap + 2 * radius * gap);
    const padAngle = Math.asin(pad / (radius + gap));
    const expandedPhase = this.expandedPhase.value;

    const shapeView = this.shape.subview;
    const headView = this.head.subview;
    const bodyView = this.body.subview;
    const iconView = this.icon.subview;
    const labelView = this.label.subview;

    if (labelView !== null) {
      labelView.visibility.setAutoState(expandedPhase !== 0 ? "visible" : "hidden");
      labelView.left.setAutoState(paddingLeft + pinHeight + gap);
      labelView.top.setAutoState(paddingTop);
      labelView.height.setAutoState(pinHeight);
      labelView.paddingLeft.setAutoState(radius / 2);
      labelView.paddingRight.setAutoState(radius);
    }

    let bodyWidth = 0;
    if (labelView !== null) {
      bodyWidth += labelView._node.offsetWidth;
    }

    let pinWidth = pinHeight
    if (expandedPhase !== 0 && bodyWidth !== 0) {
      pinWidth += gap + expandedPhase * bodyWidth;
    }

    const width = pinWidth + paddingLeft + paddingRight;
    const height = boxHeight;

    this.width.setAutoState(pinWidth);

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
        context.arc(paddingLeft + pinWidth - radius - u * gap, paddingTop + radius, radius + u * gap, Math.PI / 2 - u * padAngle, -(Math.PI / 2) + u * padAngle, true);
        context.closePath();
      }
      bodyView.d.setAutoState(context.toString());
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
    const labelView = this.label.subview;
    if (labelView !== null) {
      labelView.visibility.setAutoState("visible");
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
}
