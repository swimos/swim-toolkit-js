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

import {Angle} from "@swim/angle";
import {Color} from "@swim/color";
import {Transform} from "@swim/transform";
import {AnyTransition, Transition} from "@swim/transition";
import {BoxShadow} from "@swim/style";
import {View, SvgView, HtmlView, HtmlViewController} from "@swim/view";

export class ActionButton extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<ActionButton> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("action-button")
        .position("relative")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(56)
        .height(56)
        .borderRadius("50%")
        .backgroundColor("#2c2d30")
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .userSelect("none")
        .cursor("pointer");
  }

  get viewController(): HtmlViewController<ActionButton> | null {
    return this._viewController;
  }

  setIcon(icon: SvgView | HtmlView | null, tween?: AnyTransition<any>, ccw: boolean = false): void {
    tween = tween !== void 0 ? Transition.fromAny(tween) : void 0;
    const oldIcon = this.getChildView("icon");
    if (oldIcon instanceof HtmlView) {
      oldIcon.key(null);
      if (tween) {
        oldIcon.opacity(0, tween.onEnd(oldIcon.remove.bind(oldIcon)))
               .transform(Transform.rotate(Angle.deg(ccw ? -90 : 90)), tween);
      } else {
        oldIcon.remove();
      }
    }
    const newIcon = this.createIconContainer(icon)
        .key("icon")
        .opacity(0)
        .opacity(1, tween)
        .transform(Transform.rotate(Angle.deg(ccw ? 90 : -90)))
        .transform(Transform.rotate(Angle.deg(0)), tween);
    this.appendChildView(newIcon);
  }

  protected createIconContainer(icon: View | null): HtmlView {
    const iconContainer = HtmlView.create("div")
        .addClass("action-icon")
        .position("absolute")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(56)
        .height(56)
        .pointerEvents("none");
    if (icon) {
      iconContainer.appendChildView(icon);
    }
    return iconContainer;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onInsertIcon(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "icon" && (childView instanceof SvgView || childView instanceof HtmlView)) {
      this.onRemoveIcon(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertIcon(icon: SvgView | HtmlView): void {
    // hook
  }

  protected onRemoveIcon(icon: SvgView | HtmlView): void {
    // hook
  }
}
