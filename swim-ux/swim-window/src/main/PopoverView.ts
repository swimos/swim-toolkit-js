// Copyright 2015-2023 Swim.inc
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

import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import {Arrays} from "@swim/util";
import type {Timing} from "@swim/util";
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyR2Box} from "@swim/math";
import {R2Box} from "@swim/math";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {AnyPresence} from "@swim/style";
import {Presence} from "@swim/style";
import {PresenceAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import {StyleAnimator} from "@swim/dom";
import type {HtmlViewObserver} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import type {ModalViewObserver} from "@swim/dom";
import type {ModalView} from "@swim/dom";

/** @public */
export type PopoverPlacement = "none" | "above" | "below" | "over" | "top" | "bottom" | "right" | "left";

/** @public */
export interface PopoverViewObserver<V extends PopoverView = PopoverView> extends HtmlViewObserver<V>, ModalViewObserver<V> {
  popoverWillAttachSource?(sourceView: View, view: V): void;

  popoverDidDetachSource?(sourceView: View, view: V): void;

  popoverWillPlace?(placement: PopoverPlacement, view: V): void;

  popoverDidPlace?(placement: PopoverPlacement, view: V): void;
}

/** @public */
export class PopoverView extends HtmlView implements ModalView {
  constructor(node: HTMLElement) {
    super(node);
    this.sourceFrame = null;
    this.allowedPlacement = ["top", "bottom", "right", "left"];
    this.currentPlacement = "none";
    this.onClick = this.onClick.bind(this);
    this.initArrow();
  }

  declare readonly observerType?: Class<PopoverViewObserver>;

  protected initArrow(): void {
    const arrow = this.createArrow();
    if (arrow !== null) {
      this.prependChild(arrow, "arrow");
    }
  }

  protected createArrow(): HtmlView | null {
    const arrow = HtmlView.fromTag("div");
    arrow.addClass("popover-arrow");
    arrow.display.setState("none", Affinity.Intrinsic);
    arrow.position.setState("absolute", Affinity.Intrinsic);
    arrow.width.setState(0, Affinity.Intrinsic);
    arrow.height.setState(0, Affinity.Intrinsic);
    return arrow;
  }

  @StyleAnimator({
    extends: true,
    didSetValue(backgroundColor: Color): void {
      this.owner.place();
    },
  })
  override get backgroundColor(): StyleAnimator<this, Color | null, AnyColor | null> {
    return StyleAnimator.dummy();
  }

  @ThemeAnimator({valueType: Length, value: Length.zero()})
  readonly placementGap!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.px(10)})
  readonly arrowWidth!: ThemeAnimator<this, Length, AnyLength>;

  @ThemeAnimator({valueType: Length, value: Length.px(8)})
  readonly arrowHeight!: ThemeAnimator<this, Length, AnyLength>;

  @ViewRef({
    observes: true,
    willAttachView(sourceView: View): void {
      this.owner.callObservers("popoverWillAttachSource", sourceView, this.owner);
    },
    didAttachView(sourceView: View): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
    didDetachView(sourceView: View): void {
      this.owner.callObservers("popoverDidDetachSource", sourceView, this.owner);
    },
    viewDidMount(view: View): void {
      this.owner.place();
    },
    viewDidResize(view: View): void {
      this.owner.place();
    },
    viewDidScroll(view: View): void {
      this.owner.place();
    },
    viewDidAnimate(view: View): void {
      this.owner.place();
    },
    viewDidLayout(view: View): void {
      this.owner.place();
    },
    viewDidProject(view: View): void {
      this.owner.place();
    },
    viewDidSetAttribute(name: string, value: unknown, view: HtmlView): void {
      this.owner.place();
    },
    viewDidSetStyle(name: string, value: unknown, priority: string | undefined, view: HtmlView): void {
      this.owner.place();
    },
  })
  readonly source!: ViewRef<this, View> & Observes<HtmlView>;

  /** @override */
  @PresenceAnimator({
    value: Presence.dismissed(),
    updateFlags: View.NeedsLayout,
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    didSetValue(presence: Presence): void {
      const phase = presence.phase;
      const placement = this.owner.currentPlacement;
      if (placement === "above") {
        this.owner.opacity.setState(void 0, Affinity.Intrinsic);
        this.owner.marginTop.setState((1 - phase) * -this.owner.node.clientHeight, Affinity.Intrinsic);
      } else if (placement === "below") {
        this.owner.opacity.setState(void 0, Affinity.Intrinsic);
        this.owner.marginTop.setState((1 - phase) * this.owner.node.clientHeight, Affinity.Intrinsic);
      } else {
        this.owner.marginTop.setState(null, Affinity.Intrinsic);
        this.owner.opacity.setState(phase, Affinity.Intrinsic);
      }
      this.owner.callObservers("viewDidSetPresence", presence, this.owner);
    },
    willPresent(): void {
      this.owner.callObservers("viewWillPresent", this.owner);
      this.owner.place();
      this.owner.visibility.setState("visible", Affinity.Intrinsic);
    },
    didPresent(): void {
      this.owner.pointerEvents.setState("auto", Affinity.Intrinsic);
      this.owner.marginTop.setState(null, Affinity.Intrinsic);
      this.owner.opacity.setState(void 0, Affinity.Intrinsic);
      this.owner.callObservers("viewDidPresent", this.owner);
    },
    willDismiss(): void {
      this.owner.callObservers("viewWillDismiss", this.owner);
      this.owner.pointerEvents.setState("none", Affinity.Intrinsic);
    },
    didDismiss(): void {
      this.owner.visibility.setState("hidden", Affinity.Intrinsic);
      this.owner.marginTop.setState(null, Affinity.Intrinsic);
      this.owner.opacity.setState(void 0, Affinity.Intrinsic);
      this.owner.callObservers("viewDidDismiss", this.owner);
    },
  })
  readonly presence!: PresenceAnimator<this, Presence, AnyPresence>;

  /** @override */
  @Property({
    valueType: Number,
    value: 0,
    didSetValue(modality: number): void {
      this.owner.callObservers("viewDidSetModality", modality, this.owner);
    },
  })
  readonly modality!: Property<this, number>;

  /** @internal */
  readonly allowedPlacement: PopoverPlacement[];

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

  /** @internal */
  readonly currentPlacement: PopoverPlacement;

  @Property({
    valueType: R2Box,
    value: null,
    didSetValue(placementFrame: R2Box | null): void {
      this.owner.place();
    },
    fromAny(value: AnyR2Box | null): R2Box | null {
      return value !== null ? R2Box.fromAny(value) : null;
    },
  })
  readonly placementFrame!: Property<this, R2Box | null, AnyR2Box | null>;

  @Property({
    valueType: Boolean,
    value: false,
    didSetValue(dropdown: boolean): void {
      this.owner.place();
    }
  })
  readonly dropdown!: Property<this, boolean>;

  protected override onMount(): void {
    super.onMount();
    this.attachEvents();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.detachEvents();
  }

  protected attachEvents(): void {
    this.addEventListener("click", this.onClick);
  }

  protected detachEvents(): void {
    this.removeEventListener("click", this.onClick);
  }

  protected override needsProcess(processFlags: ViewFlags): ViewFlags {
    if ((processFlags & (View.NeedsScroll | View.NeedsAnimate)) !== 0) {
      this.requireUpdate(View.NeedsLayout);
    }
    return processFlags;
  }

  protected override onLayout(): void {
    super.onLayout();
    this.place();
  }

  /** @internal */
  readonly sourceFrame: R2Box | null;

  place(force: boolean = false): PopoverPlacement {
    const sourceView = this.source.view;
    const oldSourceFrame = this.sourceFrame;
    const newSourceFrame = sourceView !== null ? sourceView.popoverFrame : null;
    if (newSourceFrame !== null && this.allowedPlacement.length !== 0 &&
        (force || !newSourceFrame.equals(oldSourceFrame))) {
      (this as Mutable<this>).sourceFrame = null;
      const placement = this.placePopover(sourceView!, newSourceFrame);
      const arrow = this.getChild("arrow");
      if (arrow instanceof HtmlView) {
        this.placeArrow(sourceView!, newSourceFrame, arrow, placement);
      }
      return placement;
    } else {
      return "none";
    }
  }

  /** @internal */
  protected placePopover(sourceView: View, sourceFrame: R2Box): PopoverPlacement {
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
    const placementFrame = this.placementFrame.value;
    const placementLeft = (placementFrame !== null ? placementFrame.left : 0);
    const placementRight = (placementFrame !== null ? placementFrame.right : window.innerWidth) - parentLeft;
    const placementTop = (placementFrame !== null ? placementFrame.top : 0);
    const placementBottom = (placementFrame !== null ? placementFrame.bottom : window.innerHeight) - parentTop;

    // source bound margins relative to placement bounds
    const marginLeft = sourceLeft - placementLeft - window.pageXOffset;
    const marginRight = placementRight - sourceLeft - sourceWidth;
    const marginTop = sourceTop - placementTop - window.pageYOffset;
    const marginBottom = placementBottom - sourceTop - sourceHeight;

    const dropdown = this.dropdown.value;
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
    let right: number | null = null;
    let bottom: number | null = null;

    let oldWidth: Length | number | null = this.width.state;
    oldWidth = oldWidth instanceof Length ? oldWidth.pxValue() : null;
    let oldHeight: Length | number | null = this.height.state;
    oldHeight = oldHeight instanceof Length ? oldHeight.pxValue() : null;
    let width = oldWidth;
    let height = oldHeight;

    let oldMaxWidth: Length | number | null = this.maxWidth.state;
    oldMaxWidth = oldMaxWidth instanceof Length ? oldMaxWidth.pxValue() : null;
    let oldMaxHeight: Length | number | null = this.maxHeight.state;
    oldMaxHeight = oldMaxHeight instanceof Length ? oldMaxHeight.pxValue() : null;
    let maxWidth = oldMaxWidth;
    let maxHeight = oldMaxHeight;

    if (placement === "above") {
      left = Math.round(placementLeft);
      top = Math.round(placementTop);
      right = Math.round((placementFrame !== null ? placementFrame.width : window.innerWidth) - placementRight);
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = null;
      maxWidth = null;
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "below") {
      left = Math.round(placementLeft);
      top = Math.round(placementBottom - popoverHeight);
      right = Math.round(placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth));
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = null;
      maxWidth = null;
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "over") {
      left = Math.round(placementLeft);
      top = Math.round(placementTop);
      right = Math.round(placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth));
      bottom = Math.round(placementBottom - (placementFrame !== null ? placementFrame.height : window.innerHeight));
      width = Math.round(Math.max(0, placementRight - placementLeft));
      height = Math.round(Math.max(0, placementBottom - placementTop));
      maxWidth = null;
      maxHeight = null;
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
      height = null;
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, sourceBottom - placementTop));
    } else if (placement === "bottom" && dropdown) {
      left = Math.max(placementLeft, sourceLeft);
      top = Math.round(Math.max(placementTop, sourceBottom + placementGap));
      width = Math.round(Math.max(0, Math.min(sourceWidth, placementRight - sourceLeft)));
      height = null;
      maxWidth = Math.round(Math.max(0, placementRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - sourceTop));
    } else if (placement === "left" && dropdown) {
      left = Math.round(Math.max(placementLeft, sourceLeft - (popoverWidth + placementGap)));
      top = Math.max(placementTop, sourceTop);
      width = null;
      height = Math.round(Math.max(0, Math.min(sourceHeight, placementBottom - sourceTop)));
      maxWidth = Math.round(Math.max(0, sourceRight - placementLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    } else if (placement === "right" && dropdown) {
      left = Math.round(Math.max(placementLeft, sourceRight + placementGap));
      top = Math.max(placementTop, sourceTop);
      width = null;
      height = Math.round(Math.max(0, Math.min(sourceHeight, placementBottom - sourceTop)));
      maxWidth = Math.round(Math.max(0, placementRight - sourceLeft));
      maxHeight = Math.round(Math.max(0, placementBottom - placementTop));
    }

    if (placement !== "none" && (left !== node.offsetLeft && this.left.hasAffinity(Affinity.Intrinsic)
                              || top !== node.offsetTop && this.top.hasAffinity(Affinity.Intrinsic)
                              || width !== oldWidth && this.width.hasAffinity(Affinity.Intrinsic)
                              || height !== oldHeight && this.height.hasAffinity(Affinity.Intrinsic)
                              || maxWidth !== oldMaxWidth && this.maxWidth.hasAffinity(Affinity.Intrinsic)
                              || maxHeight !== oldMaxHeight && this.maxHeight.hasAffinity(Affinity.Intrinsic))) {
      this.willPlacePopover(placement!);
      this.position.setState("absolute", Affinity.Intrinsic);
      this.left.setState(left, Affinity.Intrinsic);
      this.right.setState(right, Affinity.Intrinsic);
      this.top.setState(top, Affinity.Intrinsic);
      this.bottom.setState(bottom, Affinity.Intrinsic);
      this.width.setState(width, Affinity.Intrinsic);
      this.height.setState(height, Affinity.Intrinsic);
      this.maxWidth.setState(maxWidth, Affinity.Intrinsic);
      this.maxHeight.setState(maxHeight, Affinity.Intrinsic);
      this.onPlacePopover(placement!);
      this.didPlacePopover(placement!);
    }

    (this as Mutable<this>).currentPlacement = placement;
    return placement;
  }

  protected willPlacePopover(placement: PopoverPlacement): void {
    this.callObservers("popoverWillPlace", placement, this);
  }

  protected onPlacePopover(placement: PopoverPlacement): void {
    // hook
  }

  protected didPlacePopover(placement: PopoverPlacement): void {
    this.callObservers("popoverDidPlace", placement, this);
  }

  /** @internal */
  protected placeArrow(sourceView: View, sourceFrame: R2Box, arrow: HtmlView,
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
    if (backgroundColor === null) {
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

    arrow.top.setState(null, Affinity.Intrinsic);
    arrow.right.setState(null, Affinity.Intrinsic);
    arrow.bottom.setState(null, Affinity.Intrinsic);
    arrow.left.setState(null, Affinity.Intrinsic);
    arrow.borderLeftWidth.setState(null, Affinity.Intrinsic);
    arrow.borderLeftStyle.setState(void 0, Affinity.Intrinsic);
    arrow.borderLeftColor.setState(null, Affinity.Intrinsic);
    arrow.borderRightWidth.setState(null, Affinity.Intrinsic);
    arrow.borderRightStyle.setState(void 0, Affinity.Intrinsic);
    arrow.borderRightColor.setState(null, Affinity.Intrinsic);
    arrow.borderTopWidth.setState(null, Affinity.Intrinsic);
    arrow.borderTopStyle.setState(void 0, Affinity.Intrinsic);
    arrow.borderTopColor.setState(null, Affinity.Intrinsic);
    arrow.borderBottomWidth.setState(null, Affinity.Intrinsic);
    arrow.borderBottomStyle.setState(void 0, Affinity.Intrinsic);
    arrow.borderBottomColor.setState(null, Affinity.Intrinsic);
    arrow.zIndex.setState(100, Affinity.Intrinsic);

    if (placement === "none" || placement === "above" || placement === "below" || placement === "over") {
      // hide arrow
      arrow.display.setState("none", Affinity.Intrinsic);
    } else if (Math.round(sourceY) <= Math.round(offsetTop - arrowHeight) // arrow tip below source center
        && arrowXMin <= sourceX && sourceX <= arrowXMax) { // arrow base on top popover edge
      // top arrow
      arrow.display.setState("block", Affinity.Intrinsic);
      arrow.top.setState(Math.round(-arrowHeight), Affinity.Intrinsic);
      arrow.left.setState(Math.round(sourceX - offsetLeft - arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderLeftWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderLeftStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderLeftColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderRightWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderRightStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderRightColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderBottomWidth.setState(Math.round(arrowHeight), Affinity.Intrinsic);
      arrow.borderBottomStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderBottomColor.setState(backgroundColor, Affinity.Intrinsic);
    } else if (Math.round(offsetBottom + arrowHeight) <= Math.round(sourceY) // arrow tip above source center
        && arrowXMin <= sourceX && sourceX <= arrowXMax) { // arrow base on bottom popover edge
      // bottom arrow
      arrow.display.setState("block", Affinity.Intrinsic);
      arrow.bottom.setState(Math.round(-arrowHeight), Affinity.Intrinsic);
      arrow.left.setState(Math.round(sourceX - offsetLeft - arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderLeftWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderLeftStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderLeftColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderRightWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderRightStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderRightColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderTopWidth.setState(Math.round(arrowHeight), Affinity.Intrinsic);
      arrow.borderTopStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderTopColor.setState(backgroundColor, Affinity.Intrinsic);
    } else if (Math.round(sourceX) <= Math.round(offsetLeft - arrowHeight) // arrow tip right of source center
        && arrowYMin <= sourceY && sourceY <= arrowYMax) { // arrow base on left popover edge
      // left arrow
      arrow.display.setState("block");
      arrow.left.setState(Math.round(-arrowHeight), Affinity.Intrinsic);
      arrow.top.setState(Math.round(sourceY - offsetTop - arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderTopWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderTopStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderTopColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderBottomWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderBottomStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderBottomColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderRightWidth.setState(Math.round(arrowHeight), Affinity.Intrinsic);
      arrow.borderRightStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderRightColor.setState(backgroundColor, Affinity.Intrinsic);
    } else if (Math.round(offsetRight + arrowHeight) <= Math.round(sourceX) // arrow tip left of source center
        && arrowYMin <= sourceY && sourceY <= arrowYMax) { // arrow base on right popover edge
      // right arrow
      arrow.display.setState("block", Affinity.Intrinsic);
      arrow.right.setState(Math.round(-arrowHeight), Affinity.Intrinsic);
      arrow.top.setState(Math.round(sourceY - offsetTop - arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderTopWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderTopStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderTopColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderBottomWidth.setState(Math.round(arrowWidth / 2), Affinity.Intrinsic);
      arrow.borderBottomStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderBottomColor.setState(Color.transparent(), Affinity.Intrinsic);
      arrow.borderLeftWidth.setState(Math.round(arrowHeight), Affinity.Intrinsic);
      arrow.borderLeftStyle.setState("solid", Affinity.Intrinsic);
      arrow.borderLeftColor.setState(backgroundColor, Affinity.Intrinsic);
    } else {
      // no arrow
      arrow.display.setState("none", Affinity.Intrinsic);
    }
  }

  protected onClick(event: Event): void {
    event.stopPropagation();
  }

  /** @internal */
  static readonly HiddenState: number = 0;
  /** @internal */
  static readonly HidingState: number = 1;
  /** @internal */
  static readonly HideState: number = 2;
  /** @internal */
  static readonly ShownState: number = 3;
  /** @internal */
  static readonly ShowingState: number = 4;
  /** @internal */
  static readonly ShowState: number = 5;
}
