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
import {AnyLength, Length, Angle, Transform} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewContext, View, ViewObserverType, ViewAnimator, ViewRelation} from "@swim/view";
import type {HtmlViewObserver, HtmlViewController} from "@swim/dom";
import {Graphics, Icon, FilledIcon, IconViewInit, IconView, IconViewAnimator, SvgIconView} from "@swim/graphics";
import type {PositionGestureDelegate} from "@swim/gesture";
import type {ButtonObserver} from "./ButtonObserver";
import {ButtonMembraneInit, ButtonMembrane} from "./ButtonMembrane";

export interface IconButtonInit extends ButtonMembraneInit, IconViewInit {
  viewController?: HtmlViewController;
}

export class IconButton extends ButtonMembrane implements IconView, PositionGestureDelegate {
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

  initView(init: IconButtonInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  declare readonly viewController: HtmlViewController & ButtonObserver | null;

  declare readonly viewObservers: ReadonlyArray<HtmlViewObserver & ButtonObserver>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsLayout})
  declare xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsLayout})
  declare yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, state: Length.px(24), updateFlags: View.NeedsLayout})
  declare iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, state: Length.px(24), updateFlags: View.NeedsLayout})
  declare iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, updateFlags: View.NeedsLayout})
  declare iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({extends: IconViewAnimator, type: Object, updateFlags: View.NeedsLayout})
  declare graphics: ViewAnimator<this, Graphics | undefined>;

  /** @hidden */
  static IconRelation = ViewRelation.define<IconButton, SvgIconView, never, ViewObserverType<SvgIconView> & {iconIndex: number}>({
    extends: void 0,
    type: SvgIconView,
    child: false,
    iconIndex: 0,
    viewDidAnimate(viewContext: ViewContext, iconView: SvgIconView): void {
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

  icon: ViewRelation<this, SvgIconView> | null;

  pushIcon(icon: Graphics, timing?: AnyTiming | boolean): void {
    const oldIconCount = this.iconCount;
    const newIconCount = oldIconCount + 1;
    this.iconCount = newIconCount;

    if (timing === void 0 && oldIconCount === 0) {
      timing = false;
    } else if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconKey = "icon" + oldIconCount;
    const oldIconRelation = this.getViewRelation(oldIconKey) as ViewRelation<this, SvgIconView> | null;
    const oldIconView = oldIconRelation !== null ? oldIconRelation.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.cssTransform.setAutoState(Transform.rotate(Angle.deg(90)), timing);
      } else {
        oldIconView.remove();
      }
    }

    const newIconKey = "icon" + newIconCount;
    const newIconRelation = new IconButton.IconRelation(this, newIconKey) as ViewRelation<this, SvgIconView> & {iconIndex: number};
    newIconRelation.iconIndex = newIconCount;
    this.icon = newIconRelation;
    const newIconView = SvgIconView.create();

    newIconView.setStyle("position", "absolute");
    newIconView.setStyle("left", "0");
    newIconView.setStyle("top", "0");
    newIconView.opacity.setAutoState(0);
    newIconView.opacity.setAutoState(1, timing);
    newIconView.cssTransform.setAutoState(Transform.rotate(Angle.deg(-90)));
    newIconView.cssTransform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
    newIconView.pointerEvents.setAutoState("none");
    newIconView.xAlign.setInherit(true);
    newIconView.yAlign.setInherit(true);
    newIconView.iconWidth.setInherit(true);
    newIconView.iconHeight.setInherit(true);
    newIconView.iconColor.setInherit(true);
    newIconView.graphics.setAutoState(icon);
    newIconRelation.setView(newIconView);
    this.setViewRelation(newIconKey, newIconRelation);
    this.appendChildView(newIconView, newIconKey);
  }

  popIcon(timing?: AnyTiming | boolean): void {
    const oldIconCount = this.iconCount;
    const newIconCount = oldIconCount - 1;
    this.iconCount = newIconCount;

    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    const oldIconKey = "icon" + oldIconCount;
    const oldIconRelation = this.getViewRelation(oldIconKey) as ViewRelation<this, SvgIconView> | null;
    const oldIconView = oldIconRelation !== null ? oldIconRelation.view : null;
    if (oldIconView !== null) {
      if (timing !== false) {
        oldIconView.opacity.setAutoState(0, timing);
        oldIconView.cssTransform.setAutoState(Transform.rotate(Angle.deg(-90)), timing);
      } else {
        oldIconView.remove();
        this.setViewRelation(oldIconKey, null);
      }
    }

    const newIconKey = "icon" + newIconCount;
    const newIconRelation = this.getViewRelation(newIconKey) as ViewRelation<this, SvgIconView> | null;
    this.icon = newIconRelation;
    const newIconView = newIconRelation !== null ? newIconRelation.view : null;
    if (newIconView !== null) {
      newIconView.opacity.setAutoState(1, timing);
      newIconView.cssTransform.setAutoState(Transform.rotate(Angle.deg(0)), timing);
      this.appendChildView(newIconView, newIconKey);
    }
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
    if (!this.graphics.isInherited()) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setOwnState(newGraphics, oldGraphics.isThemed() ? timing : false);
      }
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    const iconColor = this.iconColor.takeUpdatedValue();
    if (iconColor !== void 0) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof FilledIcon) {
        const newGraphics = oldGraphics.withFillColor(iconColor);
        this.graphics.setOwnState(newGraphics);
      }
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutIcon();
  }

  protected layoutIcon(): void {
    const viewRelations = this.viewRelations;
    if (viewRelations !== null) {
      let viewWidth: Length | string | number | undefined = this.width.value;
      viewWidth = viewWidth instanceof Length ? viewWidth.pxValue() : this.node.offsetWidth;
      let viewHeight: Length | string | number | undefined = this.height.value;
      viewHeight = viewHeight instanceof Length ? viewHeight.pxValue() : this.node.offsetHeight;
      for (const relationName in viewRelations) {
        const viewRelation = viewRelations[relationName];
        if (viewRelation instanceof IconButton.IconRelation) {
          const iconView = viewRelation.view;
          if (iconView !== null) {
            iconView.width.setAutoState(viewWidth);
            iconView.height.setAutoState(viewHeight);
            iconView.viewBox.setAutoState("0 0 " + viewWidth + " " + viewHeight);
          }
        }
      }
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
