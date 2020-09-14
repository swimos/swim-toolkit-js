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

import {ViewFlags, View, ViewNodeType, HtmlView} from "@swim/view";
import {PositionGestureInput} from "@swim/gesture";
import {ThemedHtmlViewInit, ThemedHtmlView} from "@swim/theme";
import {TreeCellObserver} from "./TreeCellObserver";
import {TreeCellController} from "./TreeCellController";
import {TitleTreeCell} from "./TitleTreeCell";
import {DisclosureTreeCell} from "./DisclosureTreeCell";
import {PolygonTreeCell} from "./PolygonTreeCell";

export type AnyTreeCell = TreeCell | TreeCellInit;

export interface TreeCellInit extends ThemedHtmlViewInit {
  viewController?: TreeCellController;
  cellType?: TreeCellType;
}

export type TreeCellType = "title" | "disclosure" | "polygon";

export class TreeCell extends ThemedHtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("tree-cell");
    this.display.setAutoState("none");
    this.alignItems.setAutoState("center");
  }

  // @ts-ignore
  declare readonly viewController: TreeCellController | null;

  // @ts-ignore
  declare readonly viewObservers: ReadonlyArray<TreeCellObserver>;

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
    if (init.cellType === "title") {
      view = HtmlView.create(TreeCell.Title);
    } else if (init.cellType === "disclosure") {
      view = HtmlView.create(TreeCell.Disclosure);
    } else if (init.cellType === "polygon") {
      view = HtmlView.create(TreeCell.Polygon);
    } else {
      view = HtmlView.create(TreeCell);
    }
    view.initView(init);
    return view;
  }

  // Forward type declarations
  /** @hidden */
  static Title: typeof TitleTreeCell; // defined by TitleTreeCell
  /** @hidden */
  static Disclosure: typeof DisclosureTreeCell; // defined by DisclosureTreeCell
  /** @hidden */
  static Polygon: typeof PolygonTreeCell; // defined by PolygonTreeCell

  static readonly mountFlags: ViewFlags = ThemedHtmlView.mountFlags | View.NeedsAnimate;
  static readonly powerFlags: ViewFlags = ThemedHtmlView.powerFlags | View.NeedsAnimate;
  static readonly uncullFlags: ViewFlags = ThemedHtmlView.uncullFlags | View.NeedsAnimate;
}
