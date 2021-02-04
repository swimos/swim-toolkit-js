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

import {Arrays} from "@swim/util";
import {AnyTiming, Timing} from "@swim/mapping";
import {AnyLength, Length, AnyBoxR2, BoxR2} from "@swim/math";
import {Color} from "@swim/color";
import {Look} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewFlags,
  View,
  ViewProperty,
  ViewAnimator,
  ModalOptions,
  ModalState,
  Modal,
} from "@swim/view";
import {HtmlViewInit, HtmlView, HtmlViewObserver} from "@swim/dom";
import type {PopoverViewObserver} from "./PopoverViewObserver";
import type {PopoverViewController} from "./PopoverViewController";

export type PopoverPlacement = "none" | "above" | "below" | "over" | "top" | "bottom" | "right" | "left";

export interface PopoverViewInit extends HtmlViewInit {
  viewController?: PopoverViewController;
  source?: View;
  placement?: PopoverPlacement[];
  placementFrame?: BoxR2;
  arrowWidth?: AnyLength;
  arrowHeight?: AnyLength;
}

export class PopoverView extends HtmlView implements Modal, HtmlViewObserver {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "source", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "sourceFrame", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "displayState", {
      value: PopoverView.HiddenState,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modality", {
      value: false,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "allowedPlacement", {
      value: ["top", "bottom", "right", "left"],
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "currentPlacement", {
      value: "none",
      enumerable: true,
      configurable: true,
    });
    this.onClick = this.onClick.bind(this);
    this.initArrow();
  }

  protected initArrow(): void {
    const arrow = this.createArrow();
    if (arrow !== null) {
      this.prependChildView(arrow, "arrow");
    }
  }

  protected createArrow(): HtmlView | null {
    const arrow = HtmlView.create("div");
    arrow.addClass("popover-arrow");
    arrow.display.setAutoState("none");
    arrow.position.setAutoState("absolute");
    arrow.width.setAutoState(0);
    arrow.height.setAutoState(0);
    return arrow;
  }

  declare readonly viewController: PopoverViewController | null;

  declare readonly viewObservers: ReadonlyArray<PopoverViewObserver>;

  initView(init: PopoverViewInit): void {
    super.initView(init);
    if (init.source !== void 0) {
      this.setSource(init.source);
    }
    if (init.placement !== void 0) {
      this.placement(init.placement);
    }
    if (init.placementFrame !== void 0) {
      this.placementFrame(init.placementFrame);
    }
    if (init.arrowWidth !== void 0) {
      this.arrowWidth(init.arrowWidth);
    }
    if (init.arrowHeight !== void 0) {
      this.arrowHeight(init.arrowHeight);
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

  /** @hidden */
  @ViewAnimator<PopoverView, number>({
    type: Number,
    state: 0,
    onBegin(phase: number): void {
      const displayState = this.owner.displayState;
      if (displayState === PopoverView.ShowState) {
        this.owner.willShow();
      } else if (displayState === PopoverView.HideState) {
        this.owner.willHide();
      }
    },
    onEnd(phase: number): void {
      const displayState = this.owner.displayState;
      if (displayState === PopoverView.ShowingState) {
        this.owner.didShow();
      } else if (displayState === PopoverView.HidingState) {
        this.owner.didHide();
      }
    },
  })
  declare displayPhase: ViewAnimator<this, number>; // 0 = hidden; 1 = shown

  @ViewAnimator({type: Length, state: Length.zero()})
  declare placementGap: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(10)})
  declare arrowWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(8)})
  declare arrowHeight: ViewAnimator<this, Length, AnyLength>;

  declare readonly source: View | null;

  setSource(newSource: View | null): void {
    const oldSource = this.source;
    if (oldSource !== newSource) {
      this.willSetSource(newSource);
      if (oldSource !== null && this.isMounted()) {
        oldSource.removeViewObserver(this);
      }
      Object.defineProperty(this, "source", {
        value: newSource,
        enumerable: true,
        configurable: true,
      });
      this.onSetSource(newSource);
      if (newSource !== null && this.isMounted()) {
        newSource.addViewObserver(this);
      }
      this.didSetSource(newSource);
    }
  }

  protected willSetSource(source: View | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverWillSetSource !== void 0) {
      viewController.popoverWillSetSource(source, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverWillSetSource !== void 0) {
        viewObserver.popoverWillSetSource(source, this);
      }
    }
  }

  protected onSetSource(source: View | null): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected didSetSource(source: View | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverDidSetSource !== void 0) {
        viewObserver.popoverDidSetSource(source, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverDidSetSource !== void 0) {
      viewController.popoverDidSetSource(source, this);
    }
  }

  get modalView(): View | null {
    return this;
  }

  get modalState(): ModalState {
    switch (this.displayState) {
      case PopoverView.HiddenState: return "hidden";
      case PopoverView.HidingState:
      case PopoverView.HideState: return "hiding";
      case PopoverView.ShownState: return "shown";
      case PopoverView.ShowingState:
      case PopoverView.ShowState: return "showing";
      default: throw new Error("" + this.displayState);
    }
  }

  isShown(): boolean {
    switch (this.displayState) {
      case PopoverView.ShownState:
      case PopoverView.ShowingState:
      case PopoverView.ShowState: return true;
      default: return false;
    }
  }

  isHidden(): boolean {
    switch (this.displayState) {
      case PopoverView.HiddenState:
      case PopoverView.HidingState:
      case PopoverView.HideState: return true;
      default: return false;
    }
  }

  declare readonly modality: boolean | number;

  showModal(options: ModalOptions, timing?: AnyTiming | boolean): void {
    if (this.isHidden()) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (options.modal !== void 0) {
        Object.defineProperty(this, "modality", {
          value: options.modal,
          enumerable: true,
          configurable: true,
        });
      }
      this.setDisplayState(PopoverView.ShowState);
      if (timing !== null) {
        this.displayPhase.setState(1, timing);
      } else {
        this.willShow();
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    this.setDisplayState(PopoverView.ShowingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverWillShow !== void 0) {
      viewController.popoverWillShow(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverWillShow !== void 0) {
        viewObserver.popoverWillShow(this);
      }
    }

    this.visibility.setAutoState("visible");
    this.place();
  }

  protected didShow(): void {
    this.setDisplayState(PopoverView.ShownState);

    this.pointerEvents.setAutoState("auto");
    this.marginTop.setAutoState(void 0);
    this.opacity.setAutoState(void 0);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverDidShow !== void 0) {
        viewObserver.popoverDidShow(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverDidShow !== void 0) {
      viewController.popoverDidShow(this);
    }
  }

  hideModal(timing?: AnyTiming | boolean): void {
    if (this.isShown()) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(PopoverView.HideState);
      if (timing !== null) {
        this.displayPhase.setState(0, timing);
      } else {
        this.willHide();
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    this.setDisplayState(PopoverView.HidingState);

    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverWillHide !== void 0) {
      viewController.popoverWillHide(this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverWillHide !== void 0) {
        viewObserver.popoverWillHide(this);
      }
    }

    this.pointerEvents.setAutoState("none");
  }

  protected didHide(): void {
    this.setDisplayState(PopoverView.HiddenState);

    this.visibility.setAutoState("hidden");
    this.marginTop.setAutoState(void 0);
    this.opacity.setAutoState(void 0);

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverDidHide !== void 0) {
        viewObserver.popoverDidHide(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverDidHide !== void 0) {
      viewController.popoverDidHide(this);
    }
  }

  /** @hidden */
  declare readonly allowedPlacement: PopoverPlacement[];

  placement(): ReadonlyArray<PopoverPlacement>;
  placement(placement: ReadonlyArray<PopoverPlacement>): this;
  placement(placement?: ReadonlyArray<PopoverPlacement>): ReadonlyArray<PopoverPlacement> | this {
    if (placement === void 0) {
      return this.allowedPlacement;
    } else {
      if (!Arrays.equal(this.allowedPlacement, placement)) {
        this.allowedPlacement.length = 0;
        this.allowedPlacement.push(...placement);
        this.place();
      }
      return this;
    }
  }

  /** @hidden */
  declare readonly currentPlacement: PopoverPlacement;

  @ViewProperty<PopoverView, BoxR2 | null, AnyBoxR2 | null>({
    type: BoxR2,
    state: null,
    onUpdate(placementFrame: BoxR2 | null): void {
      this.owner.place();
    },
    fromAny(value: AnyBoxR2 | null): BoxR2 | null {
      return value !== null ? BoxR2.fromAny(value) : null;
    },
  })
  declare placementFrame: ViewProperty<this, BoxR2 | null, AnyBoxR2 | null>;

  @ViewProperty<PopoverView, boolean>({
    type: Boolean,
    state: false,
    onUpdate(dropdown: boolean): void {
      this.owner.place();
    }
  })
  declare dropdown: ViewProperty<this, boolean>;

  protected onMount(): void {
    super.onMount();
    this.attachEvents();
    if (this.source !== null) {
      this.source.addViewObserver(this);
    }
  }

  protected onUnmount(): void {
    super.onUnmount();
    this.detachEvents();
    if (this.source !== null) {
      this.source.removeViewObserver(this);
    }
  }

  protected attachEvents(): void {
    this.on("click", this.onClick);
  }

  protected detachEvents(): void {
    this.off("click", this.onClick);
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & (View.NeedsScroll | View.NeedsAnimate)) !== 0) {
      this.requireUpdate(View.NeedsLayout);
    }
    return processFlags;
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    if (this.backgroundColor.takeUpdatedValue() !== void 0) {
      this.place(true);
    }
    const displayPhase = this.displayPhase.takeUpdatedValue();
    if (displayPhase !== void 0) {
      this.updateDisplayPhase(displayPhase);
    }
  }

  protected updateDisplayPhase(displayPhase: number): void {
    const placement = this.currentPlacement;
    if (placement === "above") {
      this.opacity.setAutoState(void 0);
      this.marginTop.setAutoState((1 - displayPhase) * -this.node.clientHeight);
    } else if (placement === "below") {
      this.opacity.setAutoState(void 0);
      this.marginTop.setAutoState((1 - displayPhase) * this.node.clientHeight);
    } else {
      this.marginTop.setAutoState(void 0);
      this.opacity.setAutoState(displayPhase);
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.place();
  }

  /** @hidden */
  declare readonly sourceFrame: BoxR2 | null;

  place(force: boolean = true): PopoverPlacement {
    const source = this.source;
    const oldSourceFrame = this.sourceFrame;
    const newSourceFrame = source !== null ? source.popoverFrame : null;
    if (newSourceFrame !== null && this.allowedPlacement.length !== 0 &&
        (force || !newSourceFrame.equals(oldSourceFrame))) {
      Object.defineProperty(this, "newSourceFrame", {
        value: null,
        enumerable: true,
        configurable: true,
      });
      const placement = this.placePopover(source!, newSourceFrame);
      const arrow = this.getChildView("arrow");
      if (arrow instanceof HtmlView) {
        this.placeArrow(source!, newSourceFrame, arrow, placement);
      }
      return placement;
    } else {
      return "none";
    }
  }

  /** @hidden */
  protected placePopover(source: View, sourceFrame: BoxR2): PopoverPlacement {
    const node = this.node;
    const parent = node.offsetParent;
    if (parent === null) {
      return "none";
    }
    const popoverWidth = node.clientWidth;
    const popoverHeight = node.clientHeight;

    // offsetParent bounds in client coordinates
    const parentBounds = parent.getBoundingClientRect();
    const parentLeft = parentBounds.left;
    const parentTop = parentBounds.top;

    // source bounds in offsetParent coordinates (transformed from page coordinates)
    const sourceLeft = sourceFrame.left - window.pageXOffset - parentLeft;
    const sourceRight = sourceFrame.right - window.pageXOffset - parentLeft;
    const sourceTop = sourceFrame.top - window.pageYOffset - parentTop;
    const sourceBottom = sourceFrame.bottom - window.pageYOffset - parentTop;
    const sourceWidth = sourceFrame.width;
    const sourceHeight = sourceFrame.height;
    const sourceX = sourceLeft + sourceWidth / 2;
    const sourceY = sourceTop + sourceHeight / 2;

    // placement frame in offsetParent coordinates (transformed from client coordinates)
    const placementFrame = this.placementFrame.state;
    const placementLeft = (placementFrame !== null ? placementFrame.left : 0);
    const placementRight = (placementFrame !== null ? placementFrame.right : window.innerWidth) - parentLeft;
    const placementTop = (placementFrame !== null ? placementFrame.top : 0);
    const placementBottom = (placementFrame !== null ? placementFrame.bottom : window.innerHeight) - parentTop;

    // source bound margins relative to placement bounds
    const marginLeft = sourceLeft - placementLeft - window.pageXOffset;
    const marginRight = placementRight - sourceLeft - sourceWidth;
    const marginTop = sourceTop - placementTop - window.pageYOffset;
    const marginBottom = placementBottom - sourceTop - sourceHeight;

    const dropdown = this.dropdown.state;
    const arrowHeight = this.arrowHeight.getValue().pxValue();
    const placementGap = this.placementGap.getValue().pxValue();

    let placement: PopoverPlacement | undefined;
    const allowedPlacement = this.allowedPlacement;
    for (let i = 0, n = allowedPlacement.length; i < n; i += 1) { // first fit
      const p = allowedPlacement[i]!;
      if (p === "above" || p === "below" || p === "over") {
        placement = p;
        break;
      } else if (p === "top" && popoverHeight + arrowHeight + placementGap <= marginTop) {
        placement = p;
        break;
      } else if (p === "bottom" && popoverHeight + arrowHeight + placementGap <= marginBottom) {
        placement = p;
        break;
      } else if (p === "left" && popoverWidth + arrowHeight + placementGap <= marginLeft) {
        placement = p;
        break;
      } else if (p === "right" && popoverWidth + arrowHeight + placementGap <= marginRight) {
        placement = p;
        break;
      }
    }
    if (placement === void 0) {
      placement = "none";
      for (let i = 0, n = allowedPlacement.length; i < n; i += 1) { // best fit
        const p = allowedPlacement[i]!;
        if (p === "top" && marginTop >= marginBottom) {
          placement = p;
          break;
        } else if (p === "bottom" && marginBottom >= marginTop) {
          placement = p;
          break;
        } else if (p === "left" && marginLeft >= marginRight) {
          placement = p;
          break;
        } else if (p === "right" && marginRight >= marginLeft) {
          placement = p;
          break;
        }
      }
    }

    let left = node.offsetLeft;
    let top = node.offsetTop;
    let right: number | undefined;
    let bottom: number | undefined;

    let oldWidth: Length | string | number | undefined = this.width.state;
    oldWidth = oldWidth instanceof Length ? oldWidth.pxValue() : void 0;
    let oldHeight: Length | string | number | undefined = this.height.state;
    oldHeight = oldHeight instanceof Length ? oldHeight.pxValue() : void 0;
    let width = oldWidth;
    let height = oldHeight;

    let oldMaxWidth: Length | string | number | undefined = this.maxWidth.state;
    oldMaxWidth = oldMaxWidth instanceof Length ? oldMaxWidth.pxValue() : void 0;
    let oldMaxHeight: Length | string | number | undefined = this.maxHeight.state;
    oldMaxHeight = oldMaxHeight instanceof Length ? oldMaxHeight.pxValue() : void 0;
    let maxWidth = oldMaxWidth;
    let maxHeight = oldMaxHeight;

    if (placement === "above") {
      left = Math.round(placementLeft);
      top = Math.round(placementTop);
      right = Math.round((placementFrame !== null ? placementFrame.width : window.innerWidth) - placementRight);
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = void 0;
      maxWidth = void 0;
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "below") {
      left = Math.round(placementLeft);
      top = Math.round(placementBottom - popoverHeight);
      right = Math.round(placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth));
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = void 0;
      maxWidth = void 0;
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "over") {
      left = Math.round(placementLeft);
      top = Math.round(placementTop);
      right = Math.round(placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth));
      bottom = Math.round(placementBottom - (placementFrame !== null ? placementFrame.height : window.innerHeight));
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = Math.round(Math.max(0, placementBottom - placementTop));
      maxWidth = void 0;
      maxHeight = void 0;
    } else if (placement === "top" && !dropdown) {
      if (sourceX - popoverWidth / 2 <= placementLeft) {
        left = Math.round(placementLeft);
      } else if (sourceX + popoverWidth / 2 >= placementRight) {
        left = Math.round(placementRight - popoverWidth);
      } else {
        left = Math.round(sourceX - popoverWidth / 2);
      }
      top = Math.round(Math.max(placementTop, sourceTop - (popoverHeight + arrowHeight + placementGap)));
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, sourceBottom - placementTop));
    } else if (placement === "bottom" && !dropdown) {
      if (sourceX - popoverWidth / 2 <= placementLeft) {
        left = Math.round(placementLeft);
      } else if (sourceX + popoverWidth / 2 >= placementRight) {
        left = Math.round(placementRight - popoverWidth);
      } else {
        left = Math.round(sourceX - popoverWidth / 2);
      }
      top = Math.round(Math.max(placementTop, sourceBottom + arrowHeight + placementGap));
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - sourceTop));
    } else if (placement === "left" && !dropdown) {
      left = Math.round(Math.max(placementLeft, sourceLeft - (popoverWidth + arrowHeight + placementGap)));
      if (sourceY - popoverHeight / 2 <= placementTop) {
        top = Math.round(placementTop);
      } else if (sourceY + popoverHeight / 2 >= placementBottom) {
        top = Math.round(placementBottom - popoverHeight);
      } else {
        top = Math.round(sourceY - popoverHeight / 2);
      }
      maxWidth = Math.round(Math.max(0, sourceRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "right" && !dropdown) {
      left = Math.round(Math.max(placementLeft, sourceRight + arrowHeight + placementGap));
      if (sourceY - popoverHeight / 2 <= placementTop) {
        top = Math.round(placementTop);
      } else if (sourceY + popoverHeight / 2 >= placementBottom) {
        top = Math.round(placementBottom - popoverHeight);
      } else {
        top = Math.round(sourceY - popoverHeight / 2);
      }
      maxWidth = Math.round(Math.max(0, placementRight - sourceLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "top" && dropdown) {
      left = Math.max(placementLeft, sourceLeft);
      top = Math.round(Math.max(placementTop, sourceTop - (popoverHeight + placementGap)));
      width = Math.round(Math.max(0, Math.min(sourceWidth, placementRight - sourceLeft)));
      height = void 0;
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, sourceBottom - placementTop));
    } else if (placement === "bottom" && dropdown) {
      left = Math.max(placementLeft, sourceLeft);
      top = Math.round(Math.max(placementTop, sourceBottom + placementGap));
      width = Math.round(Math.max(0, Math.min(sourceWidth, placementRight - sourceLeft)));
      height = void 0;
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - sourceTop));
    } else if (placement === "left" && dropdown) {
      left = Math.round(Math.max(placementLeft, sourceLeft - (popoverWidth + placementGap)));
      top = Math.max(placementTop, sourceTop);
      width = void 0;
      height = Math.round(Math.max(0, Math.min(sourceHeight, placementBottom - sourceTop)));
      maxWidth = Math.round(Math.max(0, sourceRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "right" && dropdown) {
      left = Math.round(Math.max(placementLeft, sourceRight + placementGap));
      top = Math.max(placementTop, sourceTop);
      width = void 0;
      height = Math.round(Math.max(0, Math.min(sourceHeight, placementBottom - sourceTop)));
      maxWidth = Math.round(Math.max(0, placementRight - sourceLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    }

    if (placement !== "none" && (left !== node.offsetLeft && this.left.isAuto() ||
                                 top !== node.offsetTop && this.top.isAuto() ||
                                 width !== oldWidth && this.width.isAuto() ||
                                 height !== oldHeight && this.height.isAuto() ||
                                 maxWidth !== oldMaxWidth && this.maxWidth.isAuto() ||
                                 maxHeight !== oldMaxHeight && this.maxHeight.isAuto())) {
      this.willPlacePopover(placement!);
      this.position.setAutoState("absolute");
      this.left.setAutoState(left);
      this.right.setAutoState(right);
      this.top.setAutoState(top);
      this.bottom.setAutoState(bottom);
      this.width.setAutoState(width);
      this.height.setAutoState(height);
      this.maxWidth.setAutoState(maxWidth);
      this.maxHeight.setAutoState(maxHeight);
      this.onPlacePopover(placement!);
      this.didPlacePopover(placement!);
    }

    Object.defineProperty(this, "currentPlacement", {
      value: placement,
      enumerable: true,
      configurable: true,
    });
    return placement;
  }

  protected willPlacePopover(placement: PopoverPlacement): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverWillPlace !== void 0) {
      viewController.popoverWillPlace(placement, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverWillPlace !== void 0) {
        viewObserver.popoverWillPlace(placement, this);
      }
    }
  }

  protected onPlacePopover(placement: PopoverPlacement): void {
    // hook
  }

  protected didPlacePopover(placement: PopoverPlacement): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.popoverDidPlace !== void 0) {
        viewObserver.popoverDidPlace(placement, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.popoverDidPlace !== void 0) {
      viewController.popoverDidPlace(placement, this);
    }
  }

  /** @hidden */
  protected placeArrow(source: View, sourceFrame: BoxR2, arrow: HtmlView,
                       placement: PopoverPlacement): void {
    const node = this.node;
    const parent = node.offsetParent;
    if (parent === null) {
      return;
    }

    // offsetParent bounds in client coordinates
    const parentBounds = parent.getBoundingClientRect();
    const parentLeft = parentBounds.left;
    const parentTop = parentBounds.top;

    // source bounds in offsetParent coordinates (transformed from page coordinates)
    const sourceLeft = sourceFrame.left - window.pageXOffset - parentLeft;
    const sourceTop = sourceFrame.top - window.pageYOffset - parentTop;
    const sourceWidth = sourceFrame.width;
    const sourceHeight = sourceFrame.height;
    const sourceX = sourceLeft + sourceWidth / 2;
    const sourceY = sourceTop + sourceHeight / 2;

    const offsetLeft = node.offsetLeft;
    const offsetRight = offsetLeft + node.clientWidth;
    const offsetTop = node.offsetTop;
    const offsetBottom = offsetTop + node.clientHeight;

    let backgroundColor = this.backgroundColor.value;
    if (backgroundColor === void 0) {
      backgroundColor = Color.transparent();
    }
    const borderRadius = this.borderRadius();
    const radius = borderRadius instanceof Length ? borderRadius.pxValue() : 0;

    const arrowWidth = this.arrowWidth.getValue().pxValue();
    const arrowHeight = this.arrowHeight.getValue().pxValue();

    const arrowXMin = offsetLeft + radius + arrowWidth / 2;
    const arrowXMax = offsetRight - radius - arrowWidth / 2;
    const arrowYMin = offsetTop + radius + arrowWidth / 2;
    const arrowYMax = offsetBottom - radius - arrowWidth / 2;

    arrow.top.setAutoState(void 0);
    arrow.right.setAutoState(void 0);
    arrow.bottom.setAutoState(void 0);
    arrow.left.setAutoState(void 0);
    arrow.borderLeftWidth.setAutoState(void 0);
    arrow.borderLeftStyle.setAutoState(void 0);
    arrow.borderLeftColor.setAutoState(void 0);
    arrow.borderRightWidth.setAutoState(void 0);
    arrow.borderRightStyle.setAutoState(void 0);
    arrow.borderRightColor.setAutoState(void 0);
    arrow.borderTopWidth.setAutoState(void 0);
    arrow.borderTopStyle.setAutoState(void 0);
    arrow.borderTopColor.setAutoState(void 0);
    arrow.borderBottomWidth.setAutoState(void 0);
    arrow.borderBottomStyle.setAutoState(void 0);
    arrow.borderBottomColor.setAutoState(void 0);
    arrow.zIndex.setAutoState(100);

    if (placement === "none" || placement === "above" || placement === "below" || placement === "over") {
      // hide arrow
      arrow.display.setAutoState("none");
    } else if (Math.round(sourceY) <= Math.round(offsetTop - arrowHeight) // arrow tip below source center
        && arrowXMin <= sourceX && sourceX <= arrowXMax) { // arrow base on top popover edge
      // top arrow
      arrow.display.setAutoState("block");
      arrow.top.setAutoState(Math.round(-arrowHeight));
      arrow.left.setAutoState(Math.round(sourceX - offsetLeft - arrowWidth / 2));
      arrow.borderLeftWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderLeftStyle.setAutoState("solid");
      arrow.borderLeftColor.setAutoState(Color.transparent());
      arrow.borderRightWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderRightStyle.setAutoState("solid");
      arrow.borderRightColor.setAutoState(Color.transparent());
      arrow.borderBottomWidth.setAutoState(Math.round(arrowHeight));
      arrow.borderBottomStyle.setAutoState("solid");
      arrow.borderBottomColor.setAutoState(backgroundColor.toString());
    } else if (Math.round(offsetBottom + arrowHeight) <= Math.round(sourceY) // arrow tip above source center
        && arrowXMin <= sourceX && sourceX <= arrowXMax) { // arrow base on bottom popover edge
      // bottom arrow
      arrow.display.setAutoState("block");
      arrow.bottom.setAutoState(Math.round(-arrowHeight));
      arrow.left.setAutoState(Math.round(sourceX - offsetLeft - arrowWidth / 2));
      arrow.borderLeftWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderLeftStyle.setAutoState("solid");
      arrow.borderLeftColor.setAutoState(Color.transparent());
      arrow.borderRightWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderRightStyle.setAutoState("solid");
      arrow.borderRightColor.setAutoState(Color.transparent());
      arrow.borderTopWidth.setAutoState(Math.round(arrowHeight));
      arrow.borderTopStyle.setAutoState("solid");
      arrow.borderTopColor.setAutoState(backgroundColor.toString());
    } else if (Math.round(sourceX) <= Math.round(offsetLeft - arrowHeight) // arrow tip right of source center
        && arrowYMin <= sourceY && sourceY <= arrowYMax) { // arrow base on left popover edge
      // left arrow
      arrow.display.setAutoState("block");
      arrow.left.setAutoState(Math.round(-arrowHeight));
      arrow.top.setAutoState(Math.round(sourceY - offsetTop - arrowWidth / 2));
      arrow.borderTopWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderTopStyle.setAutoState("solid");
      arrow.borderTopColor.setAutoState(Color.transparent());
      arrow.borderBottomWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderBottomStyle.setAutoState("solid");
      arrow.borderBottomColor.setAutoState(Color.transparent());
      arrow.borderRightWidth.setAutoState(Math.round(arrowHeight));
      arrow.borderRightStyle.setAutoState("solid");
      arrow.borderRightColor.setAutoState(backgroundColor.toString());
    } else if (Math.round(offsetRight + arrowHeight) <= Math.round(sourceX) // arrow tip left of source center
        && arrowYMin <= sourceY && sourceY <= arrowYMax) { // arrow base on right popover edge
      // right arrow
      arrow.display.setAutoState("block");
      arrow.right.setAutoState(Math.round(-arrowHeight));
      arrow.top.setAutoState(Math.round(sourceY - offsetTop - arrowWidth / 2));
      arrow.borderTopWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderTopStyle.setAutoState("solid");
      arrow.borderTopColor.setAutoState(Color.transparent());
      arrow.borderBottomWidth.setAutoState(Math.round(arrowWidth / 2));
      arrow.borderBottomStyle.setAutoState("solid");
      arrow.borderBottomColor.setAutoState(Color.transparent());
      arrow.borderLeftWidth.setAutoState(Math.round(arrowHeight));
      arrow.borderLeftStyle.setAutoState("solid");
      arrow.borderLeftColor.setAutoState(backgroundColor.toString());
    } else {
      // no arrow
      arrow.display.setAutoState("none");
    }
  }

  viewDidMount(view: View): void {
    this.place();
  }

  viewDidPower(view: View): void {
    this.place();
  }

  viewDidResize(viewContext: ViewContext, view: View): void {
    this.place();
  }

  viewDidScroll(viewContext: ViewContext, view: View): void {
    this.place();
  }

  viewDidAnimate(viewContext: ViewContext, view: View): void {
    this.place();
  }

  viewDidLayout(viewContext: ViewContext, view: View): void {
    this.place();
  }

  viewDidProject(viewContext: ViewContext, view: View): void {
    this.place();
  }

  viewDidSetAttribute(name: string, value: unknown, view: HtmlView): void {
    this.place();
  }

  viewDidSetStyle(name: string, value: unknown, priority: string | undefined, view: HtmlView): void {
    this.place();
  }

  protected onClick(event: Event): void {
    event.stopPropagation();
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
}
