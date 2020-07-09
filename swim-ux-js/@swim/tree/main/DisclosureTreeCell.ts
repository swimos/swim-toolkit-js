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

import {View, ViewNodeType} from "@swim/view";
import {PositionGestureInput} from "@swim/gesture";
import {DisclosureArrow} from "@swim/motif";
import {TreeCell} from "./TreeCell";
import {TreeLeaf} from "./TreeLeaf";
import {TreeLimb} from "./TreeLimb";

export class DisclosureTreeCell extends TreeCell {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("disclosure-tree-cell");
    this.append(DisclosureArrow, "arrow");
  }

  get arrow(): DisclosureArrow {
    return this.getChildView("arrow") as DisclosureArrow;
  }

  didPress(input: PositionGestureInput, event: Event | null): void {
    const leaf = this.parentView;
    if (leaf instanceof TreeLeaf) {
      const limb = leaf.parentView;
      if (limb instanceof TreeLimb) {
        limb.toggle();
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "arrow" && childView instanceof DisclosureArrow) {
      this.onInsertArrow(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView.key === "arrow" && childView instanceof DisclosureArrow) {
      this.onRemoveArrow(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertArrow(arrow: DisclosureArrow): void {
    // hook
  }

  protected onRemoveArrow(arrow: DisclosureArrow): void {
    // hook
  }
}
TreeCell.Disclosure = DisclosureTreeCell;
