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

import type {Class} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import type {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyPresence} from "@swim/style";
import {Presence} from "@swim/style";
import {PresenceAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {Mood} from "@swim/theme";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import type {Overflow} from "@swim/dom";
import type {PointerEvents} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import type {SheetViewObserver} from "./SheetViewObserver";

/** @public */
export class SheetView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initSheet();
    node.addEventListener("scroll", this.onSheetScroll.bind(this));
  }

  protected initSheet(): void {
    this.addClass("sheet");
    this.position.setState("relative", Affinity.Intrinsic);
    this.boxSizing.setState("border-box", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("auto", Affinity.Intrinsic);
    this.overscrollBehaviorY.setState("contain", Affinity.Intrinsic);
    this.overflowScrolling.setState("touch", Affinity.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, Affinity.Intrinsic);
  }

  override readonly observerType?: Class<SheetViewObserver>;

  @ViewRef({
    get viewType(): typeof SheetView {
      return SheetView;
    },
    binds: false,
    willAttachView(backView: SheetView): void {
      this.owner.callObservers("viewWillAttachBack", backView, this.owner);
    },
    didDetachView(backView: SheetView): void {
      this.owner.callObservers("viewDidDetachBack", backView, this.owner);
    },
  })
  readonly back!: ViewRef<this, SheetView>;

  @ViewRef({
    get viewType(): typeof SheetView {
      return SheetView;
    },
    binds: false,
    willAttachView(forwardView: SheetView): void {
      this.owner.callObservers("viewWillAttachForward", forwardView, this.owner);
    },
    didDetachView(forwardView: SheetView): void {
      this.owner.callObservers("viewDidDetachForward", forwardView, this.owner);
    },
  })
  readonly forward!: ViewRef<this, SheetView>;

  @Property({
    valueType: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.callObservers("viewDidSetFullBleed", fullBleed, this.owner);
    },
  })
  readonly fullBleed!: Property<this, boolean>;

  @Property({valueType: Number, value: 1})
  readonly sheetAlign!: Property<this, number>;

  @PresenceAnimator({
    value: Presence.presented(),
    updateFlags: View.NeedsLayout,
    init(): void {
      this.pointerEvents = void 0;
      this.overflowX = void 0;
      this.overflowY = void 0;
    },
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, Mood.navigating, null);
    },
    willPresent(): void {
      this.owner.callObservers("viewWillPresent", this.owner);
    },
    didPresent(): void {
      this.owner.pointerEvents.setState(void 0, Affinity.Transient);
      this.owner.callObservers("viewDidPresent", this.owner);
    },
    willDismiss(): void {
      this.owner.callObservers("viewWillDismiss", this.owner);
      this.pointerEvents = this.owner.pointerEvents.state;
      this.overflowX = this.owner.overflowX.state;
      this.overflowY = this.owner.overflowY.state;
      this.owner.pointerEvents.setState("none", Affinity.Transient);
      this.owner.overflowX.setState("hidden", Affinity.Intrinsic);
      this.owner.overflowY.setState("hidden", Affinity.Intrinsic);
    },
    didDismiss(): void {
      this.owner.pointerEvents.setState(this.pointerEvents, Affinity.Transient);
      this.owner.overflowX.setState(this.overflowX, Affinity.Intrinsic);
      this.owner.overflowY.setState(this.overflowY, Affinity.Intrinsic);
      this.pointerEvents = void 0;
      this.overflowX = void 0;
      this.overflowY = void 0;
      this.owner.callObservers("viewDidDismiss", this.owner);
    },
  })
  readonly presence!: PresenceAnimator<SheetView, Presence, AnyPresence> & {
    /** @internal */
    pointerEvents: PointerEvents | undefined,
    /** @internal */
    overflowX: Overflow | undefined,
    /** @internal */
    overflowY: Overflow | undefined,
  };

  present(timing?: AnyTiming | boolean): void {
    this.presence.present(timing);
  }

  dismiss(timing?: AnyTiming | boolean): void {
    this.presence.dismiss(timing);
  }

  /** @internal */
  layoutSheet(): void {
    const sheetWidth = this.width.pxState();
    const sheetAlign = this.sheetAlign.value;
    const phase = this.presence.value.phase;
    this.left.setState(sheetWidth * sheetAlign * (1 - phase), Affinity.Intrinsic);
  }

  protected onSheetScroll(event: Event): void {
    this.requireUpdate(View.NeedsScroll);
  }
}
