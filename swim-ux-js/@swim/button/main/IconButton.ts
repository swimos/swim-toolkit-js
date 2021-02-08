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
import {Angle, Transform} from "@swim/math";
import {Color} from "@swim/color";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewContext, ViewObserverType, ViewRelation} from "@swim/view";
import type {HtmlViewObserver, HtmlViewController} from "@swim/dom";
import {Graphics, HtmlIconView} from "@swim/graphics";
import type {PositionGestureDelegate} from "@swim/gesture";
import type {ButtonObserver} from "./ButtonObserver";
import {ButtonMembrane} from "./ButtonMembrane";

export class IconButton extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    this.iconCount = 0;
    this.icon = null;
    this.onClick = this.onClick.bind(this);
    this.initButton();
  }

  protected initButton(): void {
    this.addClass("icon-button");
    this.position.setAutoState("relative");
    this.width.setAutoState(44);
    this.height.setAutoState(44);
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.borderTopLeftRadius.setAutoState(4);
    this.borderTopRightRadius.setAutoState(4);
    this.borderBottomLeftRadius.setAutoState(4);
    this.borderBottomRightRadius.setAutoState(4);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  declare readonly viewController: HtmlViewController & ButtonObserver | null;

  declare readonly viewObservers: ReadonlyArray<HtmlViewObserver & ButtonObserver>;

  /** @hidden */
  static IconRelation = ViewRelation.define<IconButton, HtmlIconView, never, ViewObserverType<HtmlIconView> & {iconIndex: number}>({
    extends: void 0,
    type: HtmlIconView,
    child: false,
    iconIndex: 0,
    viewDidAnimate(viewContext: ViewContext, iconView: HtmlIconView): void {
      if (!iconView.opacity.isAnimating() && this.iconIndex !== this.owner.iconCount) {
        iconView.remove();
        if (this.iconIndex > this.owner.iconCount) {
          this.owner.setViewRelation(this.name, null);
        }
      }
    },
  });

  /** @hidden */
  iconCount: number;

  icon: ViewRelation<this, HtmlIconView> | null;

  pushIcon(icon: Graphics, timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconCount = this.iconCount;
    const oldIconKey = "icon" + oldIconCount;
    const oldIconRelation = this.getViewRelation(oldIconKey) as ViewRelation<this, HtmlIconView> | null;
    const oldIconView = oldIconRelation !== null ? oldIconRelation.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.transform.setAutoState(Transform.rotate(Angle.deg(90)), timing);
      } else {
        oldIconView.remove();
      }
    }

    const newIconCount = oldIconCount + 1;
    const newIconKey = "icon" + newIconCount;
    const newIconRelation = new IconButton.IconRelation(this, newIconKey) as ViewRelation<this, HtmlIconView> & {iconIndex: number};
    newIconRelation.iconIndex = newIconCount;
    const newIconView = HtmlIconView.create();
    newIconView.position.setAutoState("absolute");
    newIconView.left.setAutoState(0);
    newIconView.top.setAutoState(0);
    newIconView.width.setAutoState(this.width.state);
    newIconView.height.setAutoState(this.height.state);
    newIconView.opacity.setAutoState(0);
    newIconView.opacity.setAutoState(1, timing);
    newIconView.transform.setAutoState(Transform.rotate(Angle.deg(-90)));
    newIconView.transform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
    newIconView.pointerEvents.setAutoState("none");
    newIconView.iconWidth.setAutoState(24);
    newIconView.iconHeight.setAutoState(24);
    newIconView.graphics.setAutoState(icon);
    newIconRelation.setView(newIconView);
    this.setViewRelation(newIconKey, newIconRelation);
    this.appendChildView(newIconView, newIconKey);

    this.iconCount = newIconCount;
    this.icon = newIconRelation;
  }

  popIcon(timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconCount = this.iconCount;
    const oldIconKey = "icon" + oldIconCount;
    const oldIconRelation = this.getViewRelation(oldIconKey) as ViewRelation<this, HtmlIconView> | null;
    const oldIconView = oldIconRelation !== null ? oldIconRelation.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.transform.setAutoState(Transform.rotate(Angle.deg(-90)), timing);
      } else {
        oldIconView.remove();
      }
    }

    const newIconCount = oldIconCount - 1;
    const newIconKey = "icon" + newIconCount;
    const newIconRelation = this.getViewRelation(newIconKey) as ViewRelation<this, HtmlIconView> | null;
    const newIconView = newIconRelation !== null ? newIconRelation.view : null;
    if (newIconView !== null) {
      newIconView.opacity.setAutoState(1, timing);
      newIconView.transform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
      this.appendChildView(newIconView, newIconKey);
    }

    this.iconCount = newIconCount;
    this.icon = newIconRelation;
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);

    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (!this.gesture.isHovering() && backgroundColor instanceof Color) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    super.onUnmount();
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const viewRelations = this.viewRelations;
    for (const relationName in viewRelations) {
      const viewRelation = viewRelations[relationName];
      if (viewRelation instanceof IconButton.IconRelation) {
        const iconView = viewRelation.view;
        if (iconView !== null) {
          iconView.width.setAutoState(this.width.state);
          iconView.height.setAutoState(this.height.state);
        }
      }
    }
  }

  get hovers(): boolean {
    return true;
  }

  setHovers(hovers: boolean): void {
    if (this.hovers !== hovers) {
      Object.defineProperty(this, "hovers", {
        value: hovers,
        configurable: true,
        enumerable: true,
      });
    }
  }

  didStartHovering(): void {
    if (this.hovers) {
      this.modifyMood(Feel.default, [Feel.hovering, 1]);
      const timing = this.getLook(Look.timing);
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), timing);
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    const timing = this.getLook(Look.timing);
    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor instanceof Color) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.buttonDidPress !== void 0) {
        viewObserver.buttonDidPress(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.buttonDidPress !== void 0) {
      viewController.buttonDidPress(this);
    }
  }
}
