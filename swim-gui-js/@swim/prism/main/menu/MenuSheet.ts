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

import {BoxR2} from "@swim/math";
import {Color} from "@swim/color";
import {BoxShadow} from "@swim/style";
import {View, ViewNode, PopoverView} from "@swim/view";
import {MenuItem} from "./MenuItem";
import {MenuSeparator} from "./MenuSeparator";
import {MenuSheetObserver} from "./MenuSheetObserver";
import {MenuSheetController} from "./MenuSheetController";
import {ShellView} from "../shell/ShellView";

export class MenuSheet extends PopoverView {
  /** @hidden */
  _viewController: MenuSheetController | null;

  constructor(node?: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: HTMLElement) {
    this.addClass("menu-sheet")
        .minWidth(240)
        .height(160)
        .paddingTop(8)
        .paddingBottom(8)
        .borderRadius(2)
        .boxSizing("border-box")
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .backgroundColor(Color.parse("#2c2d30").alpha(0.9))
        .backdropFilter("blur(2px)")
        .zIndex(10);
  }

  get viewController(): MenuSheetController | null {
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
      let height = 0;
      const childNodes = this._node.childNodes;
      for (let i = 0; i < childNodes.length; i += 1) {
        const childView = (childNodes[i] as ViewNode).view;
        if (childView instanceof MenuItem) {
          height += 48;
        } else if (childView instanceof MenuSeparator) {
          height += 1;
        }
      }

      const viewport = appView.viewport;
      if (appView.isMobile()) {
        const paddingTop = 16;
        const paddingBottom = Math.max(16, appView.viewport.safeArea.insetBottom);
        this.placement(["below"])
            .placementBounds(null)
            .height(Math.min(paddingTop + height + paddingBottom, appView._node.offsetHeight - appView.beamHeight.value - appView.toolbarHeight.value))
            .paddingTop(paddingTop)
            .paddingBottom(paddingBottom)
            .borderRadius(0)
            .backgroundColor("#2c2d30");
      } else {
        this.placement(["bottom", "top", "left"])
            .placementBounds(new BoxR2(0, appView.beamHeight.value + appView.toolbarHeight.value, viewport.width, viewport.height))
            .height(8 + height + 8)
            .paddingTop(8)
            .paddingBottom(8)
            .borderRadius(2)
            .backgroundColor(Color.parse("#2c2d30").alpha(0.9));
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof MenuItem) {
      this.onInsertItem(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof MenuItem) {
      this.onRemoveItem(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertItem(item: MenuItem): void {
    // stub
  }

  protected onRemoveItem(item: MenuItem): void {
    // stub
  }

  protected didHide(): void {
    super.didHide();
    this.remove();
  }

  /** @hidden */
  onItemClick(item: MenuItem): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.hidePopovers();
    }

    this.didObserve(function (viewObserver: MenuSheetObserver): void {
      if (viewObserver.menuDidPressItem) {
        viewObserver.menuDidPressItem(item, this);
      }
    });
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
