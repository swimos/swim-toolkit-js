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

import type {ComponentObserver} from "@swim/component";
import type {ColView} from "../col/ColView";
import type {ColTrait} from "../col/ColTrait";
import type {ColComponent} from "../col/ColComponent";
import type {RowView} from "../row/RowView";
import type {RowTrait} from "../row/RowTrait";
import type {RowComponent} from "../row/RowComponent";
import type {TableView} from "./TableView";
import type {TableTrait} from "./TableTrait";
import type {TableComponent} from "./TableComponent";

export interface TableComponentObserver<C extends TableComponent = TableComponent> extends ComponentObserver<C> {
  tableWillSetView?(newTableView: TableView | null, oldTableView: TableView | null, component: C): void;

  tableDidSetView?(newTableView: TableView | null, oldTableView: TableView | null, component: C): void;

  tableWillSetTrait?(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null, component: C): void;

  tableDidSetTrait?(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null, component: C): void;

  tableWillSetColView?(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent, component: C): void;

  tableDidSetColView?(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent, component: C): void;

  tableWillSetColTrait?(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent, component: C): void;

  tableDidSetColTrait?(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent, component: C): void;

  tableWillSetRowView?(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent, component: C): void;

  tableDidSetRowView?(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent, component: C): void;

  tableWillSetRowTrait?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent, component: C): void;

  tableDidSetRowTrait?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent, component: C): void;
}
