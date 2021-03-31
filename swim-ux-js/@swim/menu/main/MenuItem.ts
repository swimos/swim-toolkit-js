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
import {AnyLength, Length} from "@swim/math";
import type {Height} from "@swim/style";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, View, ViewEdgeInsets, ViewScope, ViewAnimator} from "@swim/view";
import {HtmlView, SvgView} from "@swim/dom";
import type {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {ButtonMembrane} from "@swim/button";
import type {MenuItemObserver} from "./MenuItemObserver";
import type {MenuItemController} from "./MenuItemController";
import {MenuList} from "./MenuList";

export class MenuItem extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: HTMLElement): void {
    super.initNode(node);
    this.addClass("memu-item");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.flexShrink.setAutoState(0);
    this.height.setAutoState(44);
    this.boxSizing.setAutoState("border-box");
    this.lineHeight.setAutoState(this.height.state);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.cursor.setAutoState("pointer");
    this.userSelect.setAutoState("none");
  }

  declare readonly viewController: MenuItemController | null;

  declare readonly viewObservers: ReadonlyArray<MenuItemObserver>;

  @ViewScope({type: Boolean, state: false})
  declare highlighted: ViewScope<this, boolean>;

  @ViewScope({type: Object, inherit: true})
  declare edgeInsets: ViewScope<this, ViewEdgeInsets | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare collapsedWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Number, inherit: true, updateFlags: View.NeedsAnimate})
  declare drawerStretch: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  protected createIconView(icon?: SvgView): HtmlView {
    const iconView = HtmlView.create("div");
    iconView.display.setAutoState("flex");
    iconView.justifyContent.setAutoState("center");
    iconView.alignItems.setAutoState("center");
    iconView.width.setAutoState(this.collapsedWidth.getStateOr(MenuItem.DefaultCollapsedWidth));
    iconView.height.setAutoState("100%");
    iconView.boxSizing.setAutoState("border-box");
    if (icon !== void 0) {
      iconView.append(icon, "icon");
    }
    return iconView;
  }

  protected createTitleView(text?: string): HtmlView {
    const titleView = HtmlView.create("span");
    titleView.display.setAutoState("block");
    titleView.fontFamily.setAutoState("system-ui, 'Open Sans', sans-serif");
    titleView.fontSize.setAutoState(17);
    titleView.whiteSpace.setAutoState("nowrap");
    titleView.textOverflow.setAutoState("ellipsis");
    titleView.overflowX.setAutoState("hidden");
    titleView.overflowY.setAutoState("hidden");
    if (text !== void 0) {
      titleView.text(text);
    }
    return titleView;
  }

  iconView(): HtmlView | null;
  iconView(iconView: HtmlView | SvgView | null): this;
  iconView(newIconView?: HtmlView | SvgView | null): HtmlView | null | this {
    const childView = this.getChildView("icon");
    const oldIconView = childView instanceof HtmlView ? childView : null;
    if (newIconView === void 0) {
      return oldIconView;
    } else {
      if (newIconView instanceof SvgView) {
        if (oldIconView === null) {
          newIconView = this.createIconView(newIconView);
          this.appendChildView(newIconView, "icon");
        } else {
          oldIconView.removeAll();
          oldIconView.append(newIconView);
          newIconView = oldIconView;
        }
      } else if (newIconView !== null) {
        if (oldIconView === null) {
          this.appendChildView(newIconView, "icon");
        } else {
          this.setChildView("icon", newIconView);
        }
      } else if (oldIconView !== null) {
        oldIconView.remove();
      }
      return this;
    }
  }

  titleView(): HtmlView | null;
  titleView(titleView: HtmlView | string | null): this;
  titleView(newTitleView?: HtmlView | string | null): HtmlView | null | this {
    const childView = this.getChildView("title");
    const oldTitleView = childView instanceof HtmlView ? childView : null;
    if (newTitleView === void 0) {
      return oldTitleView;
    } else {
      if (typeof newTitleView === "string") {
        if (oldTitleView === null) {
          newTitleView = this.createTitleView(newTitleView);
          this.appendChildView(newTitleView, "title");
        } else {
          oldTitleView.text(newTitleView);
          newTitleView = oldTitleView;
        }
      } else if (newTitleView !== null) {
        if (oldTitleView === null) {
          this.appendChildView(newTitleView, "title");
        } else {
          this.setChildView("title", newTitleView);
        }
      } else if (oldTitleView !== null) {
        oldTitleView.remove();
      }
      return this;
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    const itemColor = theme.inner(mood, this.highlighted.state ? Look.color : Look.mutedColor);

    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor !== void 0 && !this.highlighted.state && !this._gesture.isHovering()) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }

    const iconView = this.iconView();
    if (iconView !== null) {
      const icon = iconView.getChildView("icon");
      if (icon instanceof SvgView) {
        icon.fill.setAutoState(itemColor, timing);
      }
    }

    const titleView = this.titleView();
    if (titleView !== null) {
      titleView.color.setAutoState(itemColor, timing);
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

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    this.lineHeight.setAutoState(this.height.state);
    const drawerStretch = this.drawerStretch.value;
    if (typeof drawerStretch === "number") {
      const titleView = this.titleView();
      if (titleView !== null) {
        titleView.display.setAutoState(drawerStretch === 0 ? "none" : "block");
        titleView.opacity.setAutoState(drawerStretch);
      }
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const edgeInsets = this.edgeInsets.state;
    if (edgeInsets !== void 0) {
      let collapsedWidth: Length | number | undefined = this.collapsedWidth.state;
      collapsedWidth = collapsedWidth !== void 0 ? collapsedWidth.pxValue() : MenuItem.DefaultCollapsedWidth;
      let height: Height | number | undefined = this.height.state;
      height = height instanceof Length ? height.pxValue() : this.clientBounds.height;
      const iconPadding = Math.max(0, (collapsedWidth - height) / 2);

      this.paddingLeft.setAutoState(Math.max(0, edgeInsets.insetLeft - iconPadding));
      const iconView = this.iconView();
      if (iconView !== null) {
        iconView.width.setAutoState(collapsedWidth);
      }
      const titleView = this.titleView();
      if (titleView !== null) {
        titleView.paddingRight.setAutoState(edgeInsets.insetRight);
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onInsertIconView(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitleView(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onRemoveIconView(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitleView(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIconView(iconView: HtmlView): void {
    iconView.flexShrink.setAutoState(0);
    const icon = iconView.getChildView("icon");
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      icon.fill.setAutoState(this.getLook(Look.mutedColor));
    }
  }

  protected onRemoveIconView(iconView: HtmlView): void {
    // hook
  }

  protected onInsertTitleView(title: HtmlView): void {
    title.flexShrink.setAutoState(0);
    if (title.color.isAuto()) {
      const itemColor = this.getLook(this.highlighted.state ? Look.color : Look.mutedColor);
      title.color.setAutoState(itemColor);
    }
  }

  protected onRemoveTitleView(title: HtmlView): void {
    // hook
  }

  highlight(timing?: AnyTiming | boolean): this {
    if (!this.highlighted.state) {
      this.highlighted.setState(true);
      this.modifyMood(Feel.default, [Feel.selected, 1], [Feel.hovering, void 0]);
      if (timing === true) {
        timing = this.getLook(Look.timing);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor));
      }
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView && icon.fill.isAuto()) {
          icon.fill.setAutoState(this.getLook(Look.color), timing);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null && titleView.color.isAuto()) {
        titleView.color.setAutoState(this.getLook(Look.color), timing);
      }
    }
    return this;
  }

  unhighlight(timing?: AnyTiming | boolean): this {
    if (this.highlighted.state) {
      this.highlighted.setState(false);
      this.modifyMood(Feel.default, [Feel.selected, void 0]);
      if (timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.backgroundColor.isAuto()) {
        let backgroundColor = this.getLook(Look.backgroundColor);
        if (backgroundColor !== void 0 && !this._gesture.isHovering()) {
          backgroundColor = backgroundColor.alpha(0);
        }
        this.backgroundColor.setAutoState(backgroundColor, timing);
      }
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill.setAutoState(this.getLook(Look.mutedColor), timing);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null && titleView.color.isAuto()) {
        titleView.color.setAutoState(this.getLook(Look.mutedColor), timing);
      }
    }
    return this;
  }

  protected glow(input: PositionGestureInput): void {
    if (!this.highlighted.state) {
      super.glow(input);
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
    if (!this.highlighted.state && this.hovers) {
      this.modifyMood(Feel.default, [Feel.hovering, 1]);
      if (this.backgroundColor.isAuto()) {
        const timing = this._gesture.isPressing() ? this.getLook(Look.timing) : false;
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), timing);
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor !== void 0 && !this.highlighted.state) {
        backgroundColor = backgroundColor.alpha(0);
      }
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.menuItemDidPress !== void 0) {
        viewObserver.menuItemDidPress(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.menuItemDidPress !== void 0) {
      viewController.menuItemDidPress(this);
    }

    const parentView = this.parentView;
    if (parentView instanceof MenuList) {
      parentView.onPressItem(this);
    }
  }

  /** @hidden */
  static DefaultCollapsedWidth: number = 60;
}
