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
import {ShellView} from "../shell/ShellView";

export class SearchButton extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<SearchButton> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("search-button")
        .display("flex")
        .flexShrink(0)
        .alignItems("center")
        .paddingLeft(8)
        .cursor("pointer");
  }

  protected initChildren(): void {
    this.append(this.createIconView().key("icon"));
  }

  protected createIconView(): SvgView {
    const icon = SvgView.create("svg").width(24).height(24).viewBox("0 0 24 24");
    icon.append("circle").fill("#828384").cx(12).cy(4.5).r(2.5);
    icon.append("circle").fill("#828384").cx(12).cy(12).r(2.5);
    icon.append("circle").fill("#828384").cx(12).cy(19.5).r(2.5);
    return icon;
  }

  get viewController(): HtmlViewController<SearchButton> | null {
    return this._viewController;
  }

  protected onMount(): void {
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.toggleSearchPopover();
    }
  }
}
