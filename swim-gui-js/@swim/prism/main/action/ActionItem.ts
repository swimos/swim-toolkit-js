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
import {MemberAnimator, View, ElementView, HtmlView, HtmlViewController} from "@swim/view";

export class ActionItem extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<ActionItem> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("action-item")
        .position("relative")
        .display("flex")
        .justifyContent("center")
        .alignItems("center")
        .width(48)
        .height(48)
        .borderRadius("50%")
        .backgroundColor("#ababab")
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .userSelect("none")
        .cursor("pointer");
  }

  get viewController(): HtmlViewController<ActionItem> | null {
    return this._viewController;
  }

  @MemberAnimator(Number, "inherit")
  stackPhase: MemberAnimator<this, number>; // 0 = collapsed; 1 = expanded

  get icon(): ElementView | null {
    const childView = this.getChildView("icon");
    return childView instanceof ElementView ? childView : null;
  }

  get label(): HtmlView | null {
    const childView = this.getChildView("label");
    return childView instanceof HtmlView ? childView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof ElementView) {
      this.onInsertIcon(childView);
    } else if (childKey === "label" && childView instanceof HtmlView) {
      this.onInsertLabel(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "icon" && childView instanceof ElementView) {
      this.onRemoveIcon(childView);
    } else if (childKey === "label" && childView instanceof HtmlView) {
      this.onRemoveLabel(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onAnimate(t: number): void {
    this.stackPhase.onFrame(t);
  }

  protected onLayout(): void {
    const label = this.label;
    if (label) {
      label.opacity(this.stackPhase.value!);
    }
  }

  protected onInsertIcon(icon: ElementView): void {
    // stub
  }

  protected onRemoveIcon(icon: ElementView): void {
    // stub
  }

  protected onInsertLabel(label: HtmlView): void {
    label.position("absolute")
        .top(0)
        .right(48 + 12)
        .bottom(0)
        .fontFamily("'Open Sans', sans-serif")
        .fontSize(17)
        .fontWeight("500")
        .lineHeight("48px")
        .whiteSpace("nowrap")
        .color("#cccccc");
  }

  protected onRemoveLabel(label: HtmlView): void {
    // stub
  }
}
