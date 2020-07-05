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

import {ViewNodeType, HtmlViewInit, HtmlView} from "@swim/view";
import {PositionGestureInput} from "@swim/gesture";
import {TreeCellController} from "./TreeCellController";
import {DisclosureTreeCell} from "./DisclosureTreeCell";

export type AnyTreeCell = TreeCell | TreeCellInit;

export interface TreeCellInit extends HtmlViewInit {
  viewController?: TreeCellController;
  cellType?: TreeCellType;
}

export type TreeCellType = "disclosure";

export class TreeCell extends HtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree-cell");
    this.display.setAutoState("flex");
    this.alignItems.setAutoState("center");
  }

  get viewController(): TreeCellController | null {
    return this._viewController;
  }

  initView(init: TreeCellInit): void {
    super.initView(init);
  }

  didPressHold(input: PositionGestureInput): void {
    // hook
  }

  didPress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  static fromAny(stem: AnyTreeCell): TreeCell {
    if (stem instanceof TreeCell) {
      return stem;
    } else if (typeof stem === "object" && stem !== null) {
      return TreeCell.fromInit(stem);
    }
    throw new TypeError("" + stem);
  }

  static fromInit(init: TreeCellInit): TreeCell {
    let view: TreeCell;
    if (init.cellType === "disclosure") {
      view = HtmlView.create(TreeCell.Disclosure);
    } else {
      view = HtmlView.create(TreeCell);
    }
    view.initView(init);
    return view;
  }

  // Forward type declarations
  /** @hidden */
  static Disclosure: typeof DisclosureTreeCell; // defined by DisclosureTreeCell
}
