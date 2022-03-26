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

import type {Class, Initable, AnyTiming, Timing} from "@swim/util";
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {Length} from "@swim/math";
import {AnyPresence, Presence, PresenceAnimator} from "@swim/style";
import {Look, Mood} from "@swim/theme";
import {ViewportInsets, AnyView, View, ViewRef} from "@swim/view";
import {Graphics} from "@swim/graphics";
import {HtmlViewInit, HtmlView} from "@swim/dom";
import {ToolView, TitleToolView, ButtonToolView} from "@swim/toolbar";
import type {SheetViewObserver} from "./SheetViewObserver";

/** @public */
export class SheetView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initSheet();
  }

  protected initSheet(): void {
    this.addClass("sheet");
    this.position.setState("relative", Affinity.Intrinsic);
    this.boxSizing.setState("border-box", Affinity.Intrinsic);
    this.overflowX.setState("auto", Affinity.Intrinsic);
    this.overflowY.setState("auto", Affinity.Intrinsic);
    this.overflowScrolling.setState("touch", Affinity.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, Affinity.Intrinsic);
  }

  override readonly observerType?: Class<SheetViewObserver>;

  @ViewRef<SheetView, SheetView>({
    type: SheetView,
    binds: false,
    willAttachView(backView: SheetView): void {
      this.owner.callObservers("viewWillAttachBack", backView, this.owner);
    },
    didDetachView(backView: SheetView): void {
      this.owner.callObservers("viewDidDetachBack", backView, this.owner);
    },
  })
  readonly back!: ViewRef<this, SheetView>;
  static readonly back: MemberFastenerClass<SheetView, "back">;

  @ViewRef<SheetView, SheetView>({
    type: SheetView,
    binds: false,
    willAttachView(forwardView: SheetView): void {
      this.owner.callObservers("viewWillAttachForward", forwardView, this.owner);
    },
    didDetachView(forwardView: SheetView): void {
      this.owner.callObservers("viewDidDetachForward", forwardView, this.owner);
    },
  })
  readonly forward!: ViewRef<this, SheetView>;
  static readonly forward: MemberFastenerClass<SheetView, "forward">;

  @ViewRef<SheetView, ToolView & Initable<HtmlViewInit | string>, {create(value?: string): ToolView}>({
    implements: true,
    type: ToolView,
    willAttachView(titleToolView: ToolView): void {
      this.owner.callObservers("viewWillAttachTitleTool", titleToolView, this.owner);
    },
    didDetachView(titleToolView: ToolView): void {
      this.owner.callObservers("viewDidDetachTitleTool", titleToolView, this.owner);
    },
    create(value?: string): ToolView {
      const toolView = TitleToolView.create();
      toolView.fontSize.setState(14, Affinity.Intrinsic);
      if (value !== void 0) {
        toolView.content.setView(value);
      }
      return toolView;
    },
    fromAny(value: AnyView<ToolView> | string): ToolView {
      if (typeof value === "string") {
        return this.create(value);
      } else {
        return ToolView.fromAny(value);
      }
    },
  })
  readonly titleTool!: ViewRef<this, ToolView & Initable<HtmlViewInit | string>> & {create(value?: string): ToolView};
  static readonly titleTool: MemberFastenerClass<SheetView, "titleTool">;

  @ViewRef<SheetView, ToolView & Initable<HtmlViewInit | Graphics>, {create(value?: Graphics): ToolView}>({
    implements: true,
    type: ToolView,
    willAttachView(iconToolView: ToolView): void {
      this.owner.callObservers("viewWillAttachIconTool", iconToolView, this.owner);
    },
    didDetachView(iconToolView: ToolView): void {
      this.owner.callObservers("viewDidDetachIconTool", iconToolView, this.owner);
    },
    create(value?: Graphics): ToolView {
      const toolView = ButtonToolView.create();
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      if (value !== void 0) {
        toolView.graphics.setState(value, Affinity.Intrinsic);
      }
      return toolView;
    },
    fromAny(value: AnyView<ToolView> | Graphics): ToolView {
      if (!(value instanceof View) && Graphics.is(value)) {
        return this.create(value);
      } else {
        return ToolView.fromAny(value);
      }
    },
  })
  readonly iconTool!: ViewRef<this, ToolView & Initable<HtmlViewInit | Graphics>> & {create(value?: Graphics): ToolView};
  static readonly iconTool: MemberFastenerClass<SheetView, "iconTool">;

  @Property<SheetView, boolean>({
    type: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.callObservers("viewDidSetFullBleed", fullBleed, this.owner);
    },
  })
  readonly fullBleed!: Property<this, boolean>;

  @Property({type: Number, value: 1})
  readonly sheetAlign!: Property<this, number>;

  @Property<SheetView, ViewportInsets | null>({
    type: ViewportInsets,
    inherits: true,
    value: null,
    equalValues: ViewportInsets.equal,
  })
  readonly edgeInsets!: Property<this, ViewportInsets | null>;

  @PresenceAnimator<SheetView, Presence, AnyPresence, {tween(t: number): void}>({
    implements: true,
    type: Presence,
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
    },
    didDismiss(): void {
      this.owner.pointerEvents.setState(void 0, Affinity.Transient);
      this.owner.callObservers("viewDidDismiss", this.owner);
    },
  })
  readonly presence!: PresenceAnimator<this, Presence, AnyPresence>;

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
}
