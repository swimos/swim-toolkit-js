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
import {AnyColor, Color} from "@swim/color";
import {Tween} from "@swim/transition";
import {
  ViewScope,
  ViewEdgeInsets,
  ViewContext,
  View,
  ViewAnimator,
  ViewNodeType,
  SvgView,
  HtmlView,
  HtmlViewController,
} from "@swim/view";
import {PositionGestureDelegate} from "@swim/gesture";
import {MembraneView} from "@swim/motif";
import {MenuList} from "./MenuList";

export class MenuItem extends MembraneView implements PositionGestureDelegate {
  /** @hidden */
  _highlighted: boolean;

  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
    this.normalFillColor.setState(Color.parse("#9a9a9a"));
    this.highlightFillColor.setState(Color.parse("#d8d8d8"));
    this.highlightCellColor.setState(Color.parse("#0a1215"));
    this.hoverColor.setState(Color.rgb(255, 255, 255, 0.05));
    this.backgroundColor.setAutoState(this.hoverColor.getValue().alpha(0));
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
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  get viewController(): HtmlViewController<MenuItem> | null {
    return this._viewController;
  }

  @ViewAnimator(Number, {inherit: true})
  drawerStretch: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Color)
  normalFillColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Color)
  highlightFillColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Color)
  highlightCellColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Color)
  hoverColor: ViewAnimator<this, Color, AnyColor>;

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
      icon.fill(this.normalFillColor.getValue());
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
    view.color.setAutoState(this.normalFillColor.getValue());
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

  protected onInsertIcon(icon: HtmlView): void {
    icon.flexShrink.setAutoState(0);
    icon.marginLeft.setAutoState(8);
    icon.marginRight.setAutoState(8);
  }

  protected onRemoveIcon(icon: HtmlView): void {
    // hook
  }

  protected onInsertTitle(title: HtmlView): void {
    title.flexShrink.setAutoState(0);
    title.marginLeft.setAutoState(4);
    title.marginRight.setAutoState(4);
  }

  protected onRemoveTitle(title: HtmlView): void {
    // hook
  }

  highlight(tween?: Tween<any>): this {
    if (!this._highlighted) {
      this._highlighted = true;
      if (tween === true) {
        tween = this.membraneTransition.state;
      }
      this.backgroundColor.setAutoState(this.highlightCellColor.getValue().alpha(1), tween);
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill(this.highlightFillColor.getValue(), tween);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null) {
        titleView.color(this.highlightFillColor.getValue(), tween);
      }
    }
    return this;
  }

  unhighlight(tween?: Tween<any>): this {
    if (this._highlighted) {
      this._highlighted = false;
      if (tween === true) {
        tween = this.membraneTransition.state;
      }
      this.backgroundColor.setAutoState(this.highlightCellColor.getValue().alpha(0), tween);
      const iconView = this.iconView();
      if (iconView !== null) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill(this.normalFillColor.getValue(), tween);
        }
      }
      const titleView = this.titleView();
      if (titleView !== null) {
        titleView.color(this.normalFillColor.getValue(), tween);
      }
    }
    return this;
  }

  didStartHovering(): void {
    const hoverColor = this.hoverColor.value;
    if (hoverColor !== void 0 && this.backgroundColor.isAuto()) {
      if (this.backgroundColor.value === void 0) {
        this.backgroundColor.setAutoState(hoverColor.alpha(0), false);
      }
      this.backgroundColor.setAutoState(hoverColor, this.membraneTransition.state);
    }
  }

  didStopHovering(): void {
    const hoverColor = this.hoverColor.value;
    if (hoverColor !== void 0 && this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(hoverColor.alpha(0), this.membraneTransition.state);
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
