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

import {Length} from "@swim/length";
import {Tween, Transition} from "@swim/transition";
import {
  ViewScope,
  ViewEdgeInsets,
  ViewContext,
  View,
  ViewAnimator,
  ViewNodeType,
  SvgView,
  HtmlView,
} from "@swim/view";
import {PositionGestureInput, PositionGestureDelegate} from "@swim/gesture";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {MembraneView} from "@swim/motif";
import {MenuList} from "./MenuList";

export class MenuItem extends MembraneView implements PositionGestureDelegate {
  /** @hidden */
  _highlighted: boolean;

  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
    this._highlighted = false;
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("memu-item");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.flexShrink.setAutoState(0);
    this.height.setAutoState(44);
    this.paddingLeft.setAutoState(Length.px(4));
    this.paddingRight.setAutoState(Length.px(4));
    this.boxSizing.setAutoState("border-box");
    this.lineHeight.setAutoState(44);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.cursor.setAutoState("pointer");
  }

  @ViewAnimator(Number, {inherit: true})
  drawerStretch: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewScope(Object, {inherit: true})
  edgeInsets: ViewScope<this, ViewEdgeInsets>;

  get highlighted(): boolean {
    return this._highlighted;
  }

  protected createIconView(icon?: SvgView): HtmlView {
    const view = HtmlView.create("div");
    view.display.setAutoState("flex");
    view.justifyContent.setAutoState("center");
    view.alignItems.setAutoState("center");
    view.width.setAutoState(36);
    view.height.setAutoState(44);
    if (icon !== void 0) {
      view.append(icon, "icon");
    }
    return view;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span");
    view.display.setAutoState("block");
    view.fontFamily.setAutoState("system-ui, 'Open Sans', sans-serif");
    view.fontSize.setAutoState(17);
    view.whiteSpace.setAutoState("nowrap");
    view.textOverflow.setAutoState("ellipsis");
    view.overflowX.setAutoState("hidden");
    view.overflowY.setAutoState("hidden");
    if (text !== void 0) {
      view.text(text);
    }
    return view;
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
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    const itemColor = theme.inner(mood, this._highlighted ? Look.color : Look.mutedColor);

    const iconView = this.iconView();
    if (iconView !== null) {
      const icon = iconView.getChildView("icon");
      if (icon instanceof SvgView && icon.fill.isAuto()) {
        icon.fill.setAutoState(itemColor, transition);
      }
    }

    const title = this.titleView();
    if (title !== null && title.color.isAuto()) {
      title.color.setAutoState(itemColor, transition);
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

  protected onAnimate(viewContext: ViewContext): void {
    super.onAnimate(viewContext);
    const drawerStretch = this.drawerStretch.value;
    if (typeof drawerStretch === "number") {
      const titleView = this.titleView()!;
      titleView.display.setAutoState(drawerStretch === 0 ? "none" : "block");
      titleView.opacity.setAutoState(drawerStretch);
    }
  }

  protected onLayout(viewContext: ViewContext): void {
    super.onLayout(viewContext);
    const edgeInsets = this.edgeInsets.state;
    if (edgeInsets !== void 0) {
      this.paddingLeft.setAutoState(Length.px(Math.max(4, edgeInsets.insetLeft)));
      this.paddingRight.setAutoState(Length.px(Math.max(4, edgeInsets.insetRight)));
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onInsertIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitle(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onRemoveIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitle(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(iconView: HtmlView): void {
    iconView.flexShrink.setAutoState(0);
    iconView.marginLeft.setAutoState(8);
    iconView.marginRight.setAutoState(8);
    const icon = iconView.getChildView("icon");
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      icon.fill.setAutoState(this.getLook(Look.mutedColor));
    }
  }

  protected onRemoveIcon(iconView: HtmlView): void {
    // hook
  }

  protected onInsertTitle(title: HtmlView): void {
    title.flexShrink.setAutoState(0);
    title.marginLeft.setAutoState(4);
    title.marginRight.setAutoState(4);
    if (title.color.isAuto()) {
      const itemColor = this.getLook(this._highlighted ? Look.color : Look.mutedColor);
      title.color.setAutoState(itemColor);
    }
  }

  protected onRemoveTitle(title: HtmlView): void {
    // hook
  }

  highlight(tween?: Tween<any>): this {
    if (!this._highlighted) {
      this._highlighted = true;
      this.modifyMood(Feel.default, [Feel.selected, 1], [Feel.hovering, void 0]);
      if (tween === true) {
        tween = this.getLook(Look.transition);
      } else {
        tween = Transition.forTween(tween);
      }
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(void 0, tween);
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), tween);
      }
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView && icon.fill.isAuto()) {
          icon.fill.setAutoState(this.getLook(Look.color), tween);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null && titleView.color.isAuto()) {
        titleView.color.setAutoState(this.getLook(Look.color), tween);
      }
    }
    return this;
  }

  unhighlight(tween?: Tween<any>): this {
    if (this._highlighted) {
      this._highlighted = false;
      this.modifyMood(Feel.default, [Feel.selected, 1], [Feel.selected, void 0]);
      if (tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), tween);
      }
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill.setAutoState(this.getLook(Look.mutedColor), tween);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null && titleView.color.isAuto()) {
        titleView.color.setAutoState(this.getLook(Look.mutedColor), tween);
      }
    }
    return this;
  }

  protected glow(input: PositionGestureInput): void {
    if (!this._highlighted) {
      super.glow(input);
    }
  }

  didStartHovering(): void {
    if (!this._highlighted) {
      this.modifyMood(Feel.default, [Feel.hovering, 1]);
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor));
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      const transition = this.getLook(Look.transition);
      this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), transition);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const parentView = this.parentView;
    if (parentView instanceof MenuList) {
      parentView.onPressItem(this);
    }
  }
}
