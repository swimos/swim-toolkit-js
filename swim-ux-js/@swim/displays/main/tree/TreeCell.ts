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

import {HtmlViewConstructor, HtmlViewInit, HtmlView} from "@swim/dom";
import type {PositionGestureInput} from "@swim/gesture";
import type {TreeCellObserver} from "./TreeCellObserver";
import type {TreeCellController} from "./TreeCellController";
import {TitleTreeCell} from "../"; // forward import
import {DisclosureTreeCell} from "../"; // forward import
import {IconTreeCell} from "../"; // forward import

export type AnyTreeCell = TreeCell | TreeCellInit | HTMLElement;

export interface TreeCellInit extends HtmlViewInit {
  viewController?: TreeCellController;
  cellType?: TreeCellType;
}

export type TreeCellType = "title" | "disclosure" | "icon";

export class TreeCell extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initCell();
  }

  protected initCell(): void {
    this.addClass("tree-cell");
    this.display.setAutoState("none");
    this.alignItems.setAutoState("center");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: TreeCellController | null;

  declare readonly viewObservers: ReadonlyArray<TreeCellObserver>;

  initView(init: TreeCellInit): void {
    super.initView(init);
  }

  didPress(input: PositionGestureInput, event: Event | null): void {
    if (!input.defaultPrevented) {
      const viewObservers = this.viewObservers;
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        if (viewObserver.cellDidPress !== void 0) {
          viewObserver.cellDidPress(input, event, this);
        }
      }
      const viewController = this.viewController;
      if (viewController !== null && viewController.cellDidPress !== void 0) {
        viewController.cellDidPress(input, event, this);
      }
    }
  }

  didLongPress(input: PositionGestureInput): void {
    if (!input.defaultPrevented) {
      const viewObservers = this.viewObservers;
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        if (viewObserver.cellDidLongPress !== void 0) {
          viewObserver.cellDidLongPress(input, this);
        }
      }
      const viewController = this.viewController;
      if (viewController !== null && viewController.cellDidLongPress !== void 0) {
        viewController.cellDidLongPress(input, this);
      }
    }
  }

  static fromInit(init: TreeCellInit): TreeCell {
    let view: TreeCell;
    if (init.cellType === "title") {
      view = TitleTreeCell.create();
    } else if (init.cellType === "disclosure") {
      view = DisclosureTreeCell.create();
    } else if (init.cellType === "icon") {
      view = IconTreeCell.create();
    } else {
      view = TreeCell.create();
    }
    view.initView(init);
    return view;
  }

  static fromAny<S extends HtmlViewConstructor<InstanceType<S>>>(this: S, value: InstanceType<S> | HTMLElement): InstanceType<S>;
  static fromAny(value: AnyTreeCell): TreeCell;
  static fromAny(value: AnyTreeCell): TreeCell {
    if (value instanceof this) {
      return value;
    } else if (value instanceof HTMLElement) {
      return this.fromNode(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
