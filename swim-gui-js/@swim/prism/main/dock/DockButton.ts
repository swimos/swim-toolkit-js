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

import {SvgView, HtmlView, HtmlViewController} from "@swim/view";
import {DockBar} from "./DockBar";
import {ShellView} from "../shell/ShellView";

export class DockButton extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<DockButton> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("dock-button")
        .display("flex")
        .alignItems("center")
        .paddingLeft(12)
        .paddingRight(16)
        .cursor("pointer");
  }

  protected initChildren(): void {
    this.append(this.createIconView().key("icon"));
  }

  protected createIconView(): SvgView {
    const icon = SvgView.create("svg").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").fill("#828384").d("M2,7 L7,7 L7,2 L2,2 L2,7 Z M9.5,22 L14.5,22 L14.5,17 L9.5,17 L9.5,22 Z M2,22 L7,22 L7,17 L2,17 L2,22 Z M2,14.5 L7,14.5 L7,9.5 L2,9.5 L2,14.5 Z M9.5,14.5 L14.5,14.5 L14.5,9.5 L9.5,9.5 L9.5,14.5 Z M17,2 L17,7 L22,7 L22,2 L17,2 Z M9.5,7 L14.5,7 L14.5,2 L9.5,2 L9.5,7 Z M17,14.5 L22,14.5 L22,9.5 L17,9.5 L17,14.5 Z M17,22 L22,22 L22,17 L17,17 L17,22 Z");
    return icon;
  }

  get viewController(): HtmlViewController<DockButton> | null {
    return this._viewController;
  }

  protected onMount(): void {
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onLayout(): void {
    const parentView = this.parentView;
    if (parentView instanceof DockBar) {
      const appView = this.appView;
      if (appView instanceof ShellView && appView.isMobile()) {
        this.paddingRight(parentView.insetRight.value);
      } else {
        this.paddingRight(16);
      }
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.toggleDockPopover();
    }
  }
}
