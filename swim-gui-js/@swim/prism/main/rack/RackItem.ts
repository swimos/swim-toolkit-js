// Copyright 2015-2019 SWIM.AI inc.
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

import {AnyColor, Color} from "@swim/color";
import {Tween, Transition} from "@swim/transition";
import {MemberAnimator, View, SvgView, HtmlView, HtmlViewController} from "@swim/view";
import {RackView} from "./RackView";
import {ShellView} from "../shell/ShellView";

export class RackItem extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<RackItem> | null;
  /** @hidden */
  _highlighted: boolean;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.normalFillColor.setState(Color.parse("#9a9a9a"));
    this.highlightFillColor.setState(Color.parse("#d8d8d8"));
    this.highlightCellColor.setState(Color.parse("#0a1215"));
    this.backgroundColor(this.highlightCellColor.value!.alpha(0));
    this._highlighted = false;
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("rack-item")
        .display("flex")
        .height(44)
        .marginLeft(4)
        .marginRight(4)
        .borderRadius(4)
        .boxSizing("border-box")
        .lineHeight(44)
        .userSelect("none")
        .cursor("pointer");
  }

  get viewController(): HtmlViewController<RackItem> | null {
    return this._viewController;
  }

  protected createIconView(icon?: SvgView): HtmlView {
    const view = HtmlView.create("div")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(36)
        .height(44);
    if (icon !== void 0) {
      icon.key("icon").fill(this.normalFillColor.value!);
      view.append(icon);
    }
    return view;
  }

  protected createTitleView(text?: string): HtmlView {
    const view = HtmlView.create("span")
        .display("block")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(17)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .color(this.normalFillColor.value!);
    if (text !== void 0) {
      view.text(text);
    }
    return view;
  }

  @MemberAnimator(Color)
  normalFillColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  highlightFillColor: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  highlightCellColor: MemberAnimator<this, Color, AnyColor>;

  get highlighted(): boolean {
    return this._highlighted;
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
          newIconView = this.createIconView(newIconView).key("icon");
          this.appendChildView(newIconView);
        } else {
          oldIconView.removeAll();
          oldIconView.append(newIconView);
          newIconView = oldIconView;
        }
      } else if (newIconView !== null) {
        if (oldIconView === null) {
          this.appendChildView(newIconView.key("icon"));
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
          newTitleView = this.createTitleView(newTitleView).key("title");
          this.appendChildView(newTitleView);
        } else {
          oldTitleView.text(newTitleView);
          newTitleView = oldTitleView;
        }
      } else if (newTitleView !== null) {
        if (oldTitleView === null) {
          this.appendChildView(newTitleView.key("title"));
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
    this.on("click", this.onClick);
    this.onResize();
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      this.marginLeft(Math.max(4, appView.viewport.safeArea.insetLeft));
    }
  }

  protected onAnimate(t: number): void {
    this.normalFillColor.onFrame(t);
    this.highlightFillColor.onFrame(t);
    this.highlightCellColor.onFrame(t);
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onInsertIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onInsertTitle(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof HtmlView) {
      this.onRemoveIcon(childView);
    } else if (childKey === "title" && childView instanceof HtmlView) {
      this.onRemoveTitle(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(icon: HtmlView): void {
    icon.flexShrink(0)
        .marginLeft(8)
        .marginRight(8);
  }

  protected onRemoveIcon(icon: HtmlView): void {
    // stub
  }

  protected onInsertTitle(title: HtmlView): void {
    title.flexShrink(0)
         .marginLeft(4)
         .marginRight(4);
  }

  protected onRemoveTitle(title: HtmlView): void {
    // stub
  }

  expand(tween?: Tween<any>): void {
    const titleView = this.titleView()!;
    this.willExpand();
    titleView.display("block");
    if (tween instanceof Transition) {
      tween = tween.onEnd(this.didExpand.bind(this));
      titleView.opacity(1, tween);
    } else {
      titleView.opacity(1);
      this.didExpand();
    }
  }

  protected willExpand(): void {
    // stub
  }

  protected didExpand(): void {
    // stub
  }

  collapse(tween?: Tween<any>): void {
    const titleView = this.titleView()!;
    this.willCollapse();
    if (tween instanceof Transition) {
      tween = tween.onEnd(this.didCollapse.bind(this));
      titleView.opacity(0, tween);
    } else {
      titleView.opacity(0);
      this.didCollapse();
    }
  }

  protected willCollapse(): void {
    // stub
  }

  protected didCollapse(): void {
    const titleView = this.titleView()!;
    titleView.display("none");
  }

  highlight(tween?: Tween<any>): this {
    if (!this._highlighted) {
      this._highlighted = true;
      if (tween === true) {
        tween = (this.appView as ShellView).cabinet!._cabinetTransition;
      }
      this.backgroundColor(this.highlightCellColor.value!.alpha(1), tween);
      const iconView = this.iconView();
      if (iconView) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill(this.highlightFillColor.value!, tween);
        }
      }
      const titleView = this.titleView();
      if (titleView) {
        titleView.color(this.highlightFillColor.value!, tween);
      }
    }
    return this;
  }

  unhighlight(tween?: Tween<any>): this {
    if (this._highlighted) {
      this._highlighted = false;
      if (tween === true) {
        tween = (this.appView as ShellView).cabinet!._cabinetTransition;
      }
      this.backgroundColor(this.highlightCellColor.value!.alpha(0), tween);
      const iconView = this.iconView();
      if (iconView) {
        const icon = iconView.getChildView("icon");
        if (icon instanceof SvgView) {
          icon.fill(this.normalFillColor.value!, tween);
        }
      }
      const titleView = this.titleView();
      if (titleView) {
        titleView.color(this.normalFillColor.value!, tween);
      }
    }
    return this;
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const parentView = this.parentView;
    if (parentView instanceof RackView) {
      parentView.onItemClick(this);
    }
  }
}
