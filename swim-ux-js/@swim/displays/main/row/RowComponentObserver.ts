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

import type {HtmlView} from "@swim/dom";
import type {ComponentObserver} from "@swim/component";
import type {CellView} from "../cell/CellView";
import type {CellTrait} from "../cell/CellTrait";
import type {CellComponent} from "../cell/CellComponent";
import type {RowView} from "./RowView";
import type {RowTrait} from "./RowTrait";
import type {RowComponent} from "./RowComponent";

export interface RowComponentObserver<C extends RowComponent = RowComponent> extends ComponentObserver<C> {
  rowWillSetView?(newRowView: RowView | null, oldRowView: RowView | null, component: C): void;

  rowDidSetView?(newRowView: RowView | null, oldRowView: RowView | null, component: C): void;

  rowWillSetTrait?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, component: C): void;

  rowDidSetTrait?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, component: C): void;

  rowWillSetCellView?(newCellView: CellView | null, oldCellView: CellView | null, cellComponent: CellComponent, component: C): void;

  rowDidSetCellView?(newCellView: CellView | null, oldCellView: CellView | null, cellComponent: CellComponent, component: C): void;

  rowWillSetCellTrait?(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null, cellComponent: CellComponent, component: C): void;

  rowDidSetCellTrait?(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null, cellComponent: CellComponent, component: C): void;

  rowWillSetCellContent?(newContentView: HtmlView | null, oldContentView: HtmlView | null, cellComponent: CellComponent, component: C): void;

  rowDidSetCellContent?(newContentView: HtmlView | null, oldContentView: HtmlView | null, cellComponent: CellComponent, component: C): void;
}
