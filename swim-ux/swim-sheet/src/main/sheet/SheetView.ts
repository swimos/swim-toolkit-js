// Copyright 2015-2022 Swim.inc
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

import type {Class, AnyTiming, Timing} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef, AnimatorDef} from "@swim/component";
import {Length} from "@swim/math";
import {AnyPresence, Presence, PresenceAnimator} from "@swim/style";
import {Look, Mood} from "@swim/theme";
import {ViewportInsets, View, ViewRefDef} from "@swim/view";
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
    this.overflowX.setState("auto", Affinity.Intrinsic);
    this.overflowY.setState("auto", Affinity.Intrinsic);
    this.overscrollBehaviorY.setState("contain", Affinity.Intrinsic);
    this.overflowScrolling.setState("touch", Affinity.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, Affinity.Intrinsic);
  }

  override readonly observerType?: Class<SheetViewObserver>;

  override setStyle(propertyName: string, value: unknown, priority?: string): this {
    super.setStyle(propertyName, value, priority);
    return this;
  }

  @ViewRefDef<SheetView["back"]>({
    viewType: SheetView,
    binds: false,
    willAttachView(backView: SheetView): void {
      this.owner.callObservers("viewWillAttachBack", backView, this.owner);
    },
    didDetachView(backView: SheetView): void {
      this.owner.callObservers("viewDidDetachBack", backView, this.owner);
    },
  })
  readonly back!: ViewRefDef<this, {view: SheetView}>;
  static readonly back: FastenerClass<SheetView["back"]>;

  @ViewRefDef<SheetView["forward"]>({
    viewType: SheetView,
    binds: false,
    willAttachView(forwardView: SheetView): void {
      this.owner.callObservers("viewWillAttachForward", forwardView, this.owner);
    },
    didDetachView(forwardView: SheetView): void {
      this.owner.callObservers("viewDidDetachForward", forwardView, this.owner);
    },
  })
  readonly forward!: ViewRefDef<this, {view: SheetView}>;
  static readonly forward: FastenerClass<SheetView["forward"]>;

  @PropertyDef<SheetView["fullBleed"]>({
    valueType: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.callObservers("viewDidSetFullBleed", fullBleed, this.owner);
    },
  })
  readonly fullBleed!: PropertyDef<this, {value: boolean}>;

  @PropertyDef<SheetView["sheetAlign"]>({valueType: Number, value: 1})
  readonly sheetAlign!: PropertyDef<this, {value: number}>;

  @PropertyDef<SheetView["edgeInsets"]>({
    valueType: ViewportInsets,
    value: null,
    inherits: true,
    equalValues: ViewportInsets.equal,
  })
  readonly edgeInsets!: PropertyDef<this, {value: ViewportInsets | null}>;

  @AnimatorDef<SheetView["presence"]>({
    extends: PresenceAnimator,
    value: Presence.presented(),
    updateFlags: View.NeedsLayout,
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
      this.owner.pointerEvents.setState("none", Affinity.Transient);
      this.owner.overflowX.setState("hidden", Affinity.Intrinsic);
      this.owner.overflowY.setState("hidden", Affinity.Intrinsic);
    },
    didDismiss(): void {
      this.owner.overflowY.setState("auto", Affinity.Intrinsic);
      this.owner.overflowX.setState("auto", Affinity.Intrinsic);
      this.owner.pointerEvents.setState(void 0, Affinity.Transient);
      this.owner.callObservers("viewDidDismiss", this.owner);
    },
  })
  readonly presence!: AnimatorDef<this, {
    extends: PresenceAnimator<SheetView, Presence, AnyPresence>,
  }>;

  present(timing?: AnyTiming | boolean): void {
    this.presence.present(timing);
  }

  dismiss(timing?: AnyTiming | boolean): void {
    this.presence.dismiss(timing);
  }

  /** @internal */
  layoutSheet(): void {
    let sheetWidth: Length | number | null = this.width.state;
    sheetWidth = sheetWidth instanceof Length ? sheetWidth.pxValue() : this.node.offsetWidth;
    const presence = this.presence.value;
    this.left.setState(sheetWidth * this.sheetAlign.value * (1 - presence.phase), Affinity.Intrinsic);
  }

  protected onSheetScroll(event: Event): void {
    this.requireUpdate(View.NeedsScroll);
  }
}
