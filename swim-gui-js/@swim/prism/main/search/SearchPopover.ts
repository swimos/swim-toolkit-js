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
import {BoxShadow} from "@swim/style";
import {PopoverView, PopoverViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class SearchPopover extends PopoverView {
  /** @hidden */
  _viewController: PopoverViewController<SearchPopover> | null;

  constructor(node?: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: HTMLElement) {
    this.addClass("search-popover")
        .minWidth(320)
        .height(360)
        .borderRadius(2)
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .backgroundColor(Color.parse("#2c2d30").alpha(0.9))
        //.backdropFilter("blur(2px)") // glitchy
        .zIndex(10);
  }

  get viewController(): PopoverViewController<SearchPopover> | null {
    return this._viewController;
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
      if (appView.isMobile()) {
        this.placement(["below"])
            .height(Math.min(360, appView._node.offsetHeight - appView.beamHeight.value - appView.toolbarHeight.value))
            .borderRadius(0)
            .backgroundColor("#2c2d30");
      } else {
        this.placement(["bottom"])
            .height(360)
            .borderRadius(2)
            .backgroundColor(Color.parse("#2c2d30").alpha(0.9));
      }
    }
  }

  protected didHide(): void {
    super.didHide();
    this.remove();
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
