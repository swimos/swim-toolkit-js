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

import {Color} from "@swim/color";
import {Constraint} from "@swim/constraint";
import {LayoutAnchor, View, SvgView, HtmlView, HtmlViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class CabinetButton extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<CabinetButton> | null;
  /** @hidden */
  _minInsetLeftConstraint: Constraint;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);

    this._minInsetLeftConstraint = this.constraint(this.insetLeft, "ge", 16).enabled(true);

    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("cabinet-button")
        .display("flex")
        .userSelect("none");
  }

  protected initChildren(): void {
    this.append(this.createLogoView(this.createLogo()).key("logo"));
    this.append(this.createNameView().key("name").display("none"));
  }

  protected createLogo(): SvgView {
    const logo = SvgView.create("svg")
        .addClass("brand-logo")
        .width(36)
        .height(36)
        .viewBox("0 0 36 36");
    logo.append("polygon")
        .fill("#9a9a9a")
        .opacity(0.5)
        .points("9 24 27 24 36 30 27 36 9 36 0 30");
    logo.append("polygon")
        .fill("#d8d8d8")
        .opacity(0.5)
        .points("0 6 9 12 9 36 0 30");
    logo.append("polygon")
        .fill("#d8d8d8")
        .opacity(0.75)
        .points("9 12 27 12 27 36 9 36");
    logo.append("polygon")
        .fill("#d8d8d8")
        .opacity(0.5)
        .points("27 12 36 6 36 30 27 36");
    logo.append("polygon")
        .fill("#bbbbbb")
        .points("9 0 27 0 36 6 27 12 9 12 0 6");
    return logo;
  }

  protected createLogoView(logo?: SvgView): HtmlView {
    const view = HtmlView.create("div")
        .display("flex")
        .justifyContent("center")
        .alignItems("center");
    if (logo) {
      view.append(logo);
    }
    return view;
  }

  protected createNameView(): HtmlView {
    return HtmlView.create("span")
        .addClass("brand-name")
        .alignSelf("center")
        .fontFamily("Orbitron")
        .fontSize(20)
        .lineHeight(36)
        .whiteSpace("nowrap")
        .overflow("hidden")
        .color(Color.parse("#d8d8d8").alpha(0.5))
        .cursor("default")
        .text("Prism");
  }

  get viewController(): HtmlViewController<CabinetButton> | null {
    return this._viewController;
  }

  get logoView(): HtmlView | null {
    const childView = this.getChildView("logo");
    return childView instanceof HtmlView ? childView : null;
  }

  get nameView(): HtmlView | null {
    const childView = this.getChildView("name");
    return childView instanceof HtmlView ? childView : null;
  }

  @LayoutAnchor("strong")
  insetLeft: LayoutAnchor<this>;

  protected onMount(): void {
    this.onResize();
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      const isMobile = appView.isMobile();

      const nameView = this.getChildView("name");
      if (nameView instanceof HtmlView) {
        nameView.display(isMobile ? "none" : "block");
      }
    }
  }

  /** @hidden */
  updateLayoutValues(): void {
    const appView = this.appView;
    const isMobile = appView instanceof ShellView && appView.isMobile();
    this.logoView!.paddingLeft(isMobile ? this.insetLeft.value + 5 : 12);
    super.updateLayoutValues();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "logo" && childView instanceof HtmlView) {
      this.onInsertLogo(childView);
    } else if (childKey === "name" && childView instanceof HtmlView) {
      this.onInsertName(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "logo" && childView instanceof HtmlView) {
      this.onRemoveLogo(childView);
    } else if (childKey === "name" && childView instanceof HtmlView) {
      this.onRemoveName(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertLogo(logo: HtmlView): void {
    logo.paddingRight(12)
        .cursor("pointer")
        .on("click", this.onClick);
  }

  protected onRemoveLogo(logo: HtmlView): void {
    this.off("click", this.onClick);
  }

  protected onInsertName(name: HtmlView): void {
    // stub
  }

  protected onRemoveName(name: HtmlView): void {
    // stub
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.toggleCabinet();
    }
  }
}
