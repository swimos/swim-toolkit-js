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

import {Lazy} from "@swim/util";
import type {Class} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import {EventHandler} from "@swim/component";
import {Length} from "@swim/math";
import type {AnyPresence} from "@swim/style";
import {Presence} from "@swim/style";
import {PresenceAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import {ViewSet} from "@swim/view";
import type {PositionGestureInput} from "@swim/view";
import {PositionGesture} from "@swim/view";
import {StyleAnimator} from "@swim/dom";
import type {ViewNode} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import type {ModalView} from "@swim/dom";
import type {Graphics} from "@swim/graphics";
import {VectorIcon} from "@swim/graphics";
import {FloatingButton} from "./FloatingButton";
import {ButtonItem} from "./ButtonItem";
import type {ButtonStackObserver} from "./ButtonStackObserver";

/** @public */
export class ButtonStack extends HtmlView implements ModalView {
  constructor(node: HTMLElement) {
    super(node);
    this.initButtonStack();
  }

  protected initButtonStack(): void {
    this.addClass("button-stack");
    this.display.setState("block", Affinity.Intrinsic);
    this.position.setState("relative", Affinity.Intrinsic);
    this.width.setState(56, Affinity.Intrinsic);
    this.height.setState(56, Affinity.Intrinsic);
    this.opacity.setState(1, Affinity.Intrinsic);
    this.userSelect.setState("none", Affinity.Intrinsic);
    this.cursor.setState("pointer", Affinity.Intrinsic);
    this.button.insertView();
  }

  declare readonly observerType?: Class<ButtonStackObserver>;

  /** @internal */
  @Property({valueType: Number, value: 0})
  readonly stackHeight!: Property<this, number>;

  @ThemeAnimator({valueType: Number, value: 28, updateFlags: View.NeedsLayout})
  readonly buttonSpacing!: ThemeAnimator<this, number>;

  @ThemeAnimator({valueType: Number, value: 20, updateFlags: View.NeedsLayout})
  readonly itemSpacing!: ThemeAnimator<this, number>;

  @StyleAnimator({
    extends: true,
    didTransition(opacity: number | undefined): void {
      if (opacity === 1) {
        this.owner.didShowStack();
      } else if (opacity === 0) {
        this.owner.didHideStack();
      }
    },
  })
  override get opacity(): StyleAnimator<this, number | undefined> {
    return StyleAnimator.dummy();
  }

  get closeIcon(): Graphics {
    return ButtonStack.closeIcon;
  }

  @ViewRef({
    viewType: FloatingButton,
    viewKey: true,
    binds: true,
    willAttachView(buttonView: FloatingButton, target: View | null): void {
      buttonView.presence.setState(Presence.presented(), Affinity.Intrinsic);
      if (this.owner.presence.presented || this.owner.presence.presenting) {
        buttonView.icon.push(this.owner.closeIcon);
      }
    },
    initView(buttonView: FloatingButton): void {
      buttonView.zIndex.setState(0, Affinity.Intrinsic);
    },
  })
  readonly button!: ViewRef<this, FloatingButton>;

  @ViewSet({
    viewType: ButtonItem,
    binds: true,
    willAttachView(itemView: ButtonItem, target: View | null): void {
      itemView.position.setState("absolute", Affinity.Intrinsic);
      itemView.right.setState(8, Affinity.Intrinsic);
      itemView.bottom.setState(8, Affinity.Intrinsic);
      itemView.left.setState(8, Affinity.Intrinsic);
      itemView.zIndex.setState(0, Affinity.Intrinsic);
    },
  })
  readonly items!: ViewSet<this, ButtonItem>;

  insertItem(item: ButtonItem, index?: number, key?: string): void {
    if (index === void 0) {
      index = this.node.childNodes.length - 1;
    }
    this.insertChild(item.node, this.node.childNodes[1 + index] || null, key);
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

  /** @override */
  @PresenceAnimator({
    value: Presence.dismissed(),
    updateFlags: View.NeedsLayout,
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    didSetValue(presence: Presence): void {
      this.owner.callObservers("viewDidSetPresence", presence, this.owner);
      this.owner.modality.setValue(presence.phase, Affinity.Intrinsic);
    },
    willPresent(): void {
      this.owner.callObservers("viewWillPresent", this.owner);
      const buttonView = this.owner.button.view;
      if (buttonView !== null) {
        const timing = this.timing;
        buttonView.icon.push(this.owner.closeIcon, timing !== null ? timing : void 0);
      }
      this.owner.modal.present();
    },
    didPresent(): void {
      this.owner.callObservers("viewDidPresent", this.owner);
    },
    willDismiss(): void {
      this.owner.callObservers("viewWillDismiss", this.owner);
      const buttonView = this.owner.button.view;
      if (buttonView !== null && buttonView.icons.viewCount > 1) {
        const timing = this.timing;
        buttonView.icon.pop(timing !== null ? timing : void 0);
      }
    },
    didDismiss(): void {
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

  @PositionGesture({
    binds: true,
    viewKey: "button",
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      if (!input.defaultPrevented && !this.owner.presence.presented) {
        const stackHeight = this.owner.stackHeight.value;
        const phase = Math.min(Math.max(0, -(input.y - input.y0) / (0.5 * stackHeight)), 1);
        this.owner.presence.setPhase(phase);
        if (phase > 0.1) {
          input.clearHoldTimer();
          if (!this.owner.presence.presenting) {
            this.owner.presence.setState(this.owner.presence.value.asPresenting());
          }
        }
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      if (!input.defaultPrevented) {
        const phase = this.owner.presence.getPhase();
        if (input.t - input.t0 < input.holdDelay) {
          if (phase < 0.1 || this.owner.presence.presented) {
            this.owner.presence.dismiss();
          } else {
            this.owner.presence.present();
          }
        } else {
          if (phase < 0.5) {
            this.owner.presence.dismiss();
          } else if (phase >= 0.5) {
            this.owner.presence.present();
          }
        }
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      if (input.buttons === 2) {
        this.owner.presence.toggle();
      } else {
        const phase = this.owner.presence.getPhase();
        if (phase < 0.1 || this.owner.presence.presented) {
          this.owner.presence.dismiss();
        } else {
          this.owner.presence.present();
        }
      }
    },
    didLongPress(input: PositionGestureInput): void {
      input.preventDefault();
      this.owner.presence.toggle();
    },
  })
  readonly gesture!: PositionGesture<this, HtmlView>;

  @EventHandler({
    type: "click",
    handle(event: MouseEvent): void {
      if (event.target === this.owner.button.view?.node) {
        event.stopPropagation();
      }
    },
  })
  readonly click!: EventHandler<this>;

  @EventHandler({
    type: "contextmenu",
    handle(event: MouseEvent): void {
      event.preventDefault();
    },
  })
  readonly contextmenu!: EventHandler<this>;

  protected override onLayout(): void {
    super.onLayout();
    this.layoutStack();
  }

  protected layoutStack(): void {
    const phase = this.presence.getPhase();
    const childNodes = this.node.childNodes;
    const childCount = childNodes.length;
    const buttonView = this.button.view;
    let zIndex = childCount - 1;
    let itemIndex = 0;
    let stackHeight = 0;
    let y: number;
    if (buttonView !== null) {
      buttonView.zIndex.setState(childCount, Affinity.Intrinsic);
      const buttonHeight = buttonView !== null ? buttonView.height.value : void 0;
      y = buttonHeight instanceof Length
        ? buttonHeight.pxValue()
        : buttonView.node.offsetHeight;
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
        childView.display.setState(phase === 0 ? "none" : "flex", Affinity.Intrinsic);
        childView.bottom.setState(phase * y, Affinity.Intrinsic);
        childView.zIndex.setState(zIndex, Affinity.Intrinsic);
        y += dy;
        stackHeight += dy;
        itemIndex += 1;
        zIndex -= 1;
      }
    }
    this.stackHeight.setValue(stackHeight);
  }

  show(timing?: AnyTiming | boolean): void {
    if (this.opacity.state !== 1) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willShowStack();
      if (timing !== false) {
        this.opacity.setState(1, timing, Affinity.Intrinsic);
      } else {
        this.opacity.setState(1, Affinity.Intrinsic);
        this.didShowStack();
      }
    }
  }

  protected willShowStack(): void {
    this.callObservers("buttonStackWillShow", this);
    this.display("block");
  }

  protected didShowStack(): void {
    this.requireUpdate(View.NeedsLayout);
    this.callObservers("buttonStackDidShow", this);
  }

  hide(timing?: AnyTiming | boolean): void {
    if (this.opacity.state !== 0) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willHideStack();
      if (timing !== false) {
        this.opacity.setState(0, timing, Affinity.Intrinsic);
      } else {
        this.opacity.setState(0, Affinity.Intrinsic);
        this.didHideStack();
      }
    }
  }

  protected willHideStack(): void {
    this.callObservers("buttonStackWillHide", this);
  }

  protected didHideStack(): void {
    this.display("none");
    this.requireUpdate(View.NeedsLayout);
    this.callObservers("buttonStackDidHide", this);
  }

  @Lazy
  static get closeIcon(): Graphics {
    return VectorIcon.create(24, 24, "M19,6.4L17.6,5L12,10.6L6.4,5L5,6.4L10.6,12L5,17.6L6.4,19L12,13.4L17.6,19L19,17.6L13.4,12Z");
  }
}
