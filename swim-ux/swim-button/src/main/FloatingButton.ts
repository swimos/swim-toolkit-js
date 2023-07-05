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

import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import {Length} from "@swim/math";
import {Angle} from "@swim/math";
import {Transform} from "@swim/math";
import type {AnyPresence} from "@swim/style";
import type {Presence} from "@swim/style";
import {PresenceAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {Feel} from "@swim/theme";
import {Mood} from "@swim/theme";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ViewRef} from "@swim/view";
import {ViewSet} from "@swim/view";
import type {PositionGestureInput} from "@swim/view";
import {PositionGesture} from "@swim/view";
import type {HtmlView} from "@swim/dom";
import type {Graphics} from "@swim/graphics";
import {HtmlIconView} from "@swim/graphics";
import {ButtonMembrane} from "./ButtonMembrane";

/** @public */
export type FloatingButtonType = "regular" | "mini";

/** @public */
export class FloatingButton extends ButtonMembrane {
  constructor(node: HTMLElement) {
    super(node);
    this.initButton();
  }

  protected initButton(): void {
    this.addClass("floating-button");
    this.position.setState("relative", Affinity.Intrinsic);
    this.borderTopLeftRadius.setState(Length.pct(50), Affinity.Intrinsic);
    this.borderTopRightRadius.setState(Length.pct(50), Affinity.Intrinsic);
    this.borderBottomLeftRadius.setState(Length.pct(50), Affinity.Intrinsic);
    this.borderBottomRightRadius.setState(Length.pct(50), Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
    this.userSelect.setState("none", Affinity.Intrinsic);
    this.cursor.setState("pointer", Affinity.Intrinsic);
  }

  @Property({
    valueType: String,
    value: "regular",
    init(): void {
      this.updateButtonType(this.value);
    },
    didSetValue(newButtonType: FloatingButtonType, oldButtonType: FloatingButtonType): void {
      if (newButtonType === oldButtonType) {
        return;
      }
      this.updateButtonType(newButtonType);
    },
    updateButtonType(buttonType: FloatingButtonType): void {
      if (buttonType === "regular") {
        this.owner.width.setState(56, Affinity.Intrinsic);
        this.owner.height.setState(56, Affinity.Intrinsic);
      } else if (buttonType === "mini") {
        this.owner.width.setState(40, Affinity.Intrinsic);
        this.owner.height.setState(40, Affinity.Intrinsic);
      }
    },
  })
  readonly buttonType!: Property<this, FloatingButtonType> & {
    updateButtonType(buttonType: FloatingButtonType): void;
  };

  @ViewSet({
    viewType: HtmlIconView,
    observes: true,
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, iconView: HtmlIconView): void {
      const iconColor = theme.getOr(Look.backgroundColor, mood, null);
      iconView.iconColor.setState(iconColor, timing);
    },
    viewDidAnimate(iconView: HtmlIconView): void {
      if (!iconView.opacity.tweening && iconView !== this.owner.icon.view) {
        this.deleteView(iconView);
      }
    },
  })
  readonly icons!: ViewSet<this, HtmlIconView> & Observes<HtmlIconView>;

  @ViewRef({
    viewType: HtmlIconView,
    createView(): HtmlIconView {
      const iconView = HtmlIconView.create();
      iconView.position.setState("absolute", Affinity.Intrinsic);
      iconView.left.setState(0, Affinity.Intrinsic);
      iconView.top.setState(0, Affinity.Intrinsic);
      iconView.width.setState(this.owner.width.state, Affinity.Intrinsic);
      iconView.height.setState(this.owner.height.state, Affinity.Intrinsic);
      iconView.opacity.setState(0, Affinity.Intrinsic);
      iconView.transform.setState(Transform.rotate(Angle.deg(-90)), Affinity.Intrinsic);
      iconView.pointerEvents.setState("none", Affinity.Intrinsic);
      iconView.iconLayout.setState({width: 24, height: 24}, Affinity.Intrinsic);
      iconView.iconColor.setAffinity(Affinity.Extrinsic);
      return iconView;
    },
    push(icon: Graphics, timing?: AnyTiming | boolean): HtmlIconView {
      if (timing === void 0 && this.owner.icons.viewCount === 0) {
        timing = false;
      } else if (timing === void 0 || timing === true) {
        timing = this.owner.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }

      const oldIconView = this.view;
      if (oldIconView !== null) {
        if (timing !== false) {
          oldIconView.opacity.setState(0, timing, Affinity.Intrinsic);
          oldIconView.transform.setState(Transform.rotate(Angle.deg(90)), timing, Affinity.Intrinsic);
        } else {
          this.owner.icons.deleteView(oldIconView);
        }
      }

      const newIconView = this.createView();
      newIconView.graphics.setState(icon, Affinity.Intrinsic);
      this.owner.icons.attachView(newIconView);
      this.insertView(void 0, newIconView);
      newIconView.opacity.setState(1, timing, Affinity.Intrinsic);
      newIconView.transform.setState(Transform.rotate(Angle.deg(0)), timing, Affinity.Intrinsic);

      return newIconView;
    },
    pop(timing?: AnyTiming | boolean): HtmlIconView | null {
      if (timing === void 0 || timing === true) {
        timing = this.owner.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }

      const oldIconView = this.view;
      let newIconView: HtmlIconView | null = null;
      const iconViews = this.owner.icons.views;
      for (const viewId in iconViews) {
        const iconView = iconViews[viewId]!;
        if (iconView !== oldIconView) {
          newIconView = iconView;
        }
      }

      if (oldIconView !== null) {
        if (timing !== false) {
          oldIconView.opacity.setState(0, timing, Affinity.Intrinsic);
          oldIconView.transform.setState(Transform.rotate(Angle.deg(-90)), timing, Affinity.Intrinsic);
          this.owner.icons.insertView(void 0, oldIconView);
        } else {
          this.owner.icons.deleteView(oldIconView);
        }
      }

      if (newIconView !== null) {
        this.insertView(void 0, newIconView);
        newIconView.opacity.setState(1, timing, Affinity.Intrinsic);
        newIconView.transform.setState(Transform.rotate(Angle.deg(0)), timing, Affinity.Intrinsic);
      }

      return oldIconView;
    },
  })
  readonly icon!: ViewRef<this, HtmlIconView> & {
    push(icon: Graphics, timing?: AnyTiming | boolean): HtmlIconView;
    pop(timing?: AnyTiming | boolean): HtmlIconView | null;
  };

  @PresenceAnimator({
    inherits: true,
  })
  readonly presence!: PresenceAnimator<this, Presence | undefined, AnyPresence | undefined>;

  @PositionGesture({
    extends: true,
    didStartHovering(): void {
      this.owner.modifyMood(Feel.default, [[Feel.hovering, 1]]);
      if (this.owner.backgroundColor.hasAffinity(Affinity.Intrinsic)) {
        const timing = this.owner.getLook(Look.timing);
        this.owner.backgroundColor.setState(this.owner.getLookOr(Look.accentColor, null), timing, Affinity.Intrinsic);
      }
    },
    didStopHovering(): void {
      this.owner.modifyMood(Feel.default, [[Feel.hovering, void 0]]);
      if (this.owner.backgroundColor.hasAffinity(Affinity.Intrinsic)) {
        const timing = this.owner.getLook(Look.timing);
        this.owner.backgroundColor.setState(this.owner.getLookOr(Look.accentColor, null), timing, Affinity.Intrinsic);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      // nop
    },
  })
  override readonly gesture!: PositionGesture<this, HtmlView>;

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);

    this.backgroundColor.setState(theme.getOr(Look.accentColor, mood, null), timing, Affinity.Intrinsic);

    let shadow = theme.getOr(Look.shadow, Mood.floating, null);
    if (shadow !== null) {
      const shadowColor = shadow.color;
      const phase = this.presence.getPhaseOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setState(shadow, timing, Affinity.Intrinsic);
  }

  protected override onLayout(): void {
    super.onLayout();
    let shadow = this.getLookOr(Look.shadow, Mood.floating, null);
    if (shadow !== null) {
      const shadowColor = shadow.color;
      const phase = this.presence.getPhaseOr(1);
      shadow = shadow.withColor(shadowColor.alpha(shadowColor.alpha() * phase));
    }
    this.boxShadow.setState(shadow, Affinity.Intrinsic);
  }
}
