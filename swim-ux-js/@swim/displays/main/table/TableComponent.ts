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

import type {Timing} from "@swim/mapping";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import type {Trait} from "@swim/model";
import {Component,ComponentViewTrait, ComponentFastener, CompositeComponent} from "@swim/component";
import type {ColView} from "../col/ColView";
import type {ColTrait} from "../col/ColTrait";
import {ColComponent} from "../col/ColComponent";
import type {RowView} from "../row/RowView";
import type {RowTrait} from "../row/RowTrait";
import {RowComponent} from "../row/RowComponent";
import {TableView} from "./TableView";
import {TableTrait} from "./TableTrait";
import type {TableComponentObserver} from "./TableComponentObserver";

export class TableComponent extends CompositeComponent {
  constructor() {
    super();
    Object.defineProperty(this, "colFasteners", {
      value: [],
      enumerable: true,
    });
    Object.defineProperty(this, "rowFasteners", {
      value: [],
      enumerable: true,
    });
  }

  declare readonly componentObservers: ReadonlyArray<TableComponentObserver>;

  protected updateTableLayout(tableView: TableView): void {
    // hook
  }

  protected createTableView(): TableView | null {
    return TableView.create();
  }

  protected initTableView(tableView: TableView): void {
    this.updateTableLayout(tableView);
  }

  protected attachTableView(tableView: TableView): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowComponent = rowFasteners[i]!.component;
      if (rowComponent !== null) {
        const rowView = rowComponent.row.view;
        if (rowView !== null && !rowView.isMounted()) {
          rowComponent.row.injectView(tableView);
        }
      }
    }
  }

  protected detachTableView(tableView: TableView): void {
    // hook
  }

  protected willSetTableView(newTableView: TableView | null, oldTableView: TableView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetView !== void 0) {
        componentObserver.tableWillSetView(newTableView, oldTableView, this);
      }
    }
  }

  protected onSetTableView(newTableView: TableView | null, oldTableView: TableView | null): void {
    if (oldTableView !== null) {
      this.detachTableView(oldTableView);
    }
    if (newTableView !== null) {
      this.attachTableView(newTableView);
      this.initTableView(newTableView);
    }
  }

  protected didSetTableView(newTableView: TableView | null, oldTableView: TableView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetView !== void 0) {
        componentObserver.tableDidSetView(newTableView, oldTableView, this);
      }
    }
  }

  protected themeTableView(tableView: TableView, theme: ThemeMatrix,
                           mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected initTableTrait(tableTrait: TableTrait): void {
    // hook
  }

  protected attachTableTrait(tableTrait: TableTrait): void {
    const colFasteners = tableTrait.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colTrait = colFasteners[i]!.trait;
      if (colTrait !== null) {
        this.insertColTrait(colTrait);
      }
    }

    const rowFasteners = tableTrait.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowTrait = rowFasteners[i]!.trait;
      if (rowTrait !== null) {
        this.insertRowTrait(rowTrait);
      }
    }
  }

  protected detachTableTrait(tableTrait: TableTrait): void {
    const rowFasteners = tableTrait.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowTrait = rowFasteners[i]!.trait;
      if (rowTrait !== null) {
        this.removeRowTrait(rowTrait);
      }
    }

    const colFasteners = tableTrait.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colTrait = colFasteners[i]!.trait;
      if (colTrait !== null) {
        this.removeColTrait(colTrait);
      }
    }
  }

  protected willSetTableTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetTrait !== void 0) {
        componentObserver.tableWillSetTrait(newTableTrait, oldTableTrait, this);
      }
    }
  }

  protected onSetTableTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
    if (oldTableTrait !== null) {
      this.detachTableTrait(oldTableTrait);
    }
    if (newTableTrait !== null) {
      this.attachTableTrait(newTableTrait);
      this.initTableTrait(newTableTrait);
    }
  }

  protected didSetTableTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetTrait !== void 0) {
        componentObserver.tableDidSetTrait(newTableTrait, oldTableTrait, this);
      }
    }
  }

  /** @hidden */
  static TableFastener = ComponentViewTrait.define<TableComponent, TableView, TableTrait>({
    viewType: TableView,
    observeView: true,
    willSetView(newTableView: TableView | null, oldTableView: TableView | null): void {
      this.owner.willSetTableView(newTableView, oldTableView);
    },
    onSetView(newTableView: TableView | null, oldTableView: TableView | null): void {
      this.owner.onSetTableView(newTableView, oldTableView);
    },
    didSetView(newTableView: TableView | null, oldTableView: TableView | null): void {
      this.owner.didSetTableView(newTableView, oldTableView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, tableView: TableView): void {
      this.owner.themeTableView(tableView, theme, mood, timing);
    },
    createView(): TableView | null {
      return this.owner.createTableView();
    },
    traitType: TableTrait,
    observeTrait: true,
    willSetTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
      this.owner.willSetTableTrait(newTableTrait, oldTableTrait);
    },
    onSetTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
      this.owner.onSetTableTrait(newTableTrait, oldTableTrait);
    },
    didSetTrait(newTableTrait: TableTrait | null, oldTableTrait: TableTrait | null): void {
      this.owner.didSetTableTrait(newTableTrait, oldTableTrait);
    },
    tableTraitWillSetCol(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait, tableTrait: TableTrait): void {
      if (oldColTrait !== null) {
        this.owner.removeColTrait(oldColTrait);
      }
    },
    tableTraitDidSetCol(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait, tableTrait: TableTrait): void {
      if (newColTrait !== null) {
        this.owner.insertColTrait(newColTrait, targetTrait);
      }
    },
    tableTraitWillSetRow(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait, tableTrait: TableTrait): void {
      if (oldRowTrait !== null) {
        this.owner.removeRowTrait(oldRowTrait);
      }
    },
    tableTraitDidSetRow(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait, tableTrait: TableTrait): void {
      if (newRowTrait !== null) {
        this.owner.insertRowTrait(newRowTrait, targetTrait);
      }
    },
  });

  @ComponentViewTrait<TableComponent, TableView, TableTrait>({
    extends: TableComponent.TableFastener,
  })
  declare table: ComponentViewTrait<this, TableView, TableTrait>;

  protected createColView(colComponent: ColComponent): ColView | null {
    return colComponent.col.createView();
  }

  protected initColView(colView: ColView, colComponent: ColComponent): void {
    // hook
  }

  protected willSetColView(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetColView !== void 0) {
        componentObserver.tableWillSetColView(newColView, oldColView, colComponent, this);
      }
    }
  }

  protected onSetColView(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent): void {
    if (newColView !== null) {
      this.initColView(newColView, colComponent);
    }
  }

  protected didSetColView(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetColView !== void 0) {
        componentObserver.tableDidSetColView(newColView, oldColView, colComponent, this);
      }
    }
  }

  insertColTrait(colTrait: ColTrait, targetTrait: Trait | null = null): void {
    const colFasteners = this.colFasteners as ComponentFastener<this, ColComponent>[];
    let targetComponent: ColComponent | null = null;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colComponent = colFasteners[i]!.component;
      if (colComponent !== null) {
        if (colComponent.col.trait === colTrait) {
          return;
        } else if (colComponent.col.trait === targetTrait) {
          targetComponent = colComponent;
        }
      }
    }
    const colComponent = this.createCol(colTrait);
    if (colComponent !== null) {
      this.insertChildComponent(colComponent, targetComponent);
      colComponent.col.setTrait(colTrait);
      if (colComponent.col.view === null) {
        const colView = this.createColView(colComponent);
        let targetView: ColView | null = null;
        if (targetComponent !== null) {
          targetView = targetComponent.col.view;
        }
        const tableView = this.table.view;
        if (tableView !== null) {
          colComponent.col.injectView(tableView, colView, targetView, null);
        } else {
          colComponent.col.setView(colView, targetView);
        }
      }
    }
  }

  removeColTrait(colTrait: ColTrait): void {
    const colFasteners = this.colFasteners as ComponentFastener<this, ColComponent>[];
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      const colComponent = colFastener.component;
      if (colComponent !== null && colComponent.col.trait === colTrait) {
        colFastener.setComponent(null);
        if (this.isMounted()) {
          colFastener.unmount();
        }
        colFasteners.splice(i, 1);
        colComponent.remove();
        return;
      }
    }
  }

  protected initColTrait(colTrait: ColTrait | null, colComponent: ColComponent): void {
    // hook
  }

  protected willSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetColTrait !== void 0) {
        componentObserver.tableWillSetColTrait(newColTrait, oldColTrait, colComponent, this);
      }
    }
  }

  protected onSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent): void {
    if (newColTrait !== null) {
      this.initColTrait(newColTrait, colComponent);
    }
    const tableView = this.table.view;
    if (tableView !== null) {
      this.updateTableLayout(tableView);
    }
  }

  protected didSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetColTrait !== void 0) {
        componentObserver.tableDidSetColTrait(newColTrait, oldColTrait, colComponent, this);
      }
    }
  }

  insertCol(colComponent: ColComponent, targetComponent: Component | null = null): void {
    const colFasteners = this.colFasteners as ComponentFastener<this, ColComponent>[];
    let targetIndex = -1;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      if (colFastener.component === colComponent) {
        return;
      } else if (colFastener.component === targetComponent) {
        targetIndex = i;
      }
    }
    const colFastener = this.createColFastener(colComponent);
    colFasteners.splice(targetIndex, 0, colFastener);
    colFastener.setComponent(colComponent, targetComponent);
    if (this.isMounted()) {
      colFastener.mount();
    }
  }

  removeCol(colComponent: ColComponent): void {
    const colFasteners = this.colFasteners as ComponentFastener<this, ColComponent>[];
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      if (colFastener.component === colComponent) {
        colFastener.setComponent(null);
        if (this.isMounted()) {
          colFastener.unmount();
        }
        colFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected createCol(colTrait: ColTrait): ColComponent | null {
    return new ColComponent();
  }

  protected initCol(colComponent: ColComponent): void {
    const colView = colComponent.col.view;
    if (colView !== null) {
      this.initColView(colView, colComponent);
    }
  }

  protected willSetCol(newColComponent: ColComponent | null, oldColComponent: ColComponent | null,
                       colFastener: ComponentFastener<this, ColComponent>): void {
    // hook
  }

  protected onSetCol(newColComponent: ColComponent | null, oldColComponent: ColComponent | null,
                     colFastener: ComponentFastener<this, ColComponent>): void {
    if (newColComponent !== null) {
      this.initCol(newColComponent);
    }
  }

  protected didSetCol(newColComponent: ColComponent | null, oldColComponent: ColComponent | null,
                      colFastener: ComponentFastener<this, ColComponent>): void {
    // hook
  }

  /** @hidden */
  static ColFastener = ComponentFastener.define<TableComponent, ColComponent>({
    type: ColComponent,
    child: false,
    observe: true,
    willSetComponent(newColComponent: ColComponent | null, oldColComponent: ColComponent | null): void {
      this.owner.willSetCol(newColComponent, oldColComponent, this);
    },
    onSetComponent(newColComponent: ColComponent | null, oldColComponent: ColComponent | null): void {
      this.owner.onSetCol(newColComponent, oldColComponent, this);
    },
    didSetComponent(newColComponent: ColComponent | null, oldColComponent: ColComponent | null): void {
      this.owner.didSetCol(newColComponent, oldColComponent, this);
    },
    colWillSetView(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent): void {
      this.owner.willSetColView(newColView, oldColView, colComponent);
    },
    colDidSetView(newColView: ColView | null, oldColView: ColView | null, colComponent: ColComponent): void {
      this.owner.onSetColView(newColView, oldColView, colComponent);
      this.owner.didSetColView(newColView, oldColView, colComponent);
    },
    colWillSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent): void {
      this.owner.willSetColTrait(newColTrait, oldColTrait, colComponent);
    },
    colDidSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, colComponent: ColComponent): void {
      this.owner.onSetColTrait(newColTrait, oldColTrait, colComponent);
      this.owner.didSetColTrait(newColTrait, oldColTrait, colComponent);
    },
  });

  protected createColFastener(colComponent: ColComponent): ComponentFastener<this, ColComponent> {
    return new TableComponent.ColFastener(this, colComponent.key, "col") as unknown as ComponentFastener<this, ColComponent>;
  }

  /** @hidden */
  declare readonly colFasteners: ReadonlyArray<ComponentFastener<this, ColComponent>>;

  protected getColFastener(colTrait: ColTrait): ComponentFastener<this, ColComponent> | null {
    const colFasteners = this.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      const colComponent = colFastener.component;
      if (colComponent !== null && colComponent.col.trait === colTrait) {
        return colFastener;
      }
    }
    return null;
  }

  /** @hidden */
  protected mountColFasteners(): void {
    const colFasteners = this.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      colFastener.mount();
    }
  }

  /** @hidden */
  protected unmountColFasteners(): void {
    const colFasteners = this.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      colFastener.unmount();
    }
  }

  protected createRowView(rowComponent: RowComponent): RowView | null {
    return rowComponent.row.createView();
  }

  protected initRowView(rowView: RowView, rowComponent: RowComponent): void {
    // hook
  }

  protected willSetRowView(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetRowView !== void 0) {
        componentObserver.tableWillSetRowView(newRowView, oldRowView, rowComponent, this);
      }
    }
  }

  protected onSetRowView(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent): void {
    if (newRowView !== null) {
      this.initRowView(newRowView, rowComponent);
    }
  }

  protected didSetRowView(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetRowView !== void 0) {
        componentObserver.tableDidSetRowView(newRowView, oldRowView, rowComponent, this);
      }
    }
  }

  insertRowTrait(rowTrait: RowTrait, targetTrait: Trait | null = null): void {
    const rowFasteners = this.rowFasteners as ComponentFastener<this, RowComponent>[];
    let targetComponent: RowComponent | null = null;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowComponent = rowFasteners[i]!.component;
      if (rowComponent !== null) {
        if (rowComponent.row.trait === rowTrait) {
          return;
        } else if (rowComponent.row.trait === targetTrait) {
          targetComponent = rowComponent;
        }
      }
    }
    const rowComponent = this.createRow(rowTrait);
    if (rowComponent !== null) {
      this.insertChildComponent(rowComponent, targetComponent);
      rowComponent.row.setTrait(rowTrait);
      if (rowComponent.row.view === null) {
        const rowView = this.createRowView(rowComponent);
        let targetView: RowView | null = null;
        if (targetComponent !== null) {
          targetView = targetComponent.row.view;
        }
        const tableView = this.table.view;
        if (tableView !== null) {
          rowComponent.row.injectView(tableView, rowView, targetView, null);
        } else {
          rowComponent.row.setView(rowView, targetView);
        }
      }
    }
  }

  removeRowTrait(rowTrait: RowTrait): void {
    const rowFasteners = this.rowFasteners as ComponentFastener<this, RowComponent>[];
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      const rowComponent = rowFastener.component;
      if (rowComponent !== null && rowComponent.row.trait === rowTrait) {
        rowFastener.setComponent(null);
        if (this.isMounted()) {
          rowFastener.unmount();
        }
        rowFasteners.splice(i, 1);
        rowComponent.remove();
        return;
      }
    }
  }

  protected initRowTrait(rowTrait: RowTrait | null, rowComponent: RowComponent): void {
    // hook
  }

  protected willSetRowTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableWillSetRowTrait !== void 0) {
        componentObserver.tableWillSetRowTrait(newRowTrait, oldRowTrait, rowComponent, this);
      }
    }
  }

  protected onSetRowTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent): void {
    if (newRowTrait !== null) {
      this.initRowTrait(newRowTrait, rowComponent);
    }
  }

  protected didSetRowTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.tableDidSetRowTrait !== void 0) {
        componentObserver.tableDidSetRowTrait(newRowTrait, oldRowTrait, rowComponent, this);
      }
    }
  }

  insertRow(rowComponent: RowComponent, targetComponent: Component | null = null): void {
    const rowFasteners = this.rowFasteners as ComponentFastener<this, RowComponent>[];
    let targetIndex = -1;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.component === rowComponent) {
        return;
      } else if (rowFastener.component === targetComponent) {
        targetIndex = i;
      }
    }
    const rowFastener = this.createRowFastener(rowComponent);
    rowFasteners.splice(targetIndex, 0, rowFastener);
    rowFastener.setComponent(rowComponent, targetComponent);
    if (this.isMounted()) {
      rowFastener.mount();
    }
  }

  removeRow(rowComponent: RowComponent): void {
    const rowFasteners = this.rowFasteners as ComponentFastener<this, RowComponent>[];
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.component === rowComponent) {
        rowFastener.setComponent(null);
        if (this.isMounted()) {
          rowFastener.unmount();
        }
        rowFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected createRow(rowTrait: RowTrait): RowComponent | null {
    return new RowComponent();
  }

  protected initRow(rowComponent: RowComponent): void {
    const rowView = rowComponent.row.view;
    if (rowView !== null) {
      this.initRowView(rowView, rowComponent);
    }
  }

  protected willSetRow(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null,
                       rowFastener: ComponentFastener<this, RowComponent>): void {
    // hook
  }

  protected onSetRow(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null,
                     rowFastener: ComponentFastener<this, RowComponent>): void {
    if (newRowComponent !== null) {
      this.initRow(newRowComponent);
    }
  }

  protected didSetRow(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null,
                      rowFastener: ComponentFastener<this, RowComponent>): void {
    // hook
  }

  /** @hidden */
  static RowFastener = ComponentFastener.define<TableComponent, RowComponent>({
    type: RowComponent,
    child: false,
    observe: true,
    willSetComponent(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null): void {
      this.owner.willSetRow(newRowComponent, oldRowComponent, this);
    },
    onSetComponent(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null): void {
      this.owner.onSetRow(newRowComponent, oldRowComponent, this);
    },
    didSetComponent(newRowComponent: RowComponent | null, oldRowComponent: RowComponent | null): void {
      this.owner.didSetRow(newRowComponent, oldRowComponent, this);
    },
    rowWillSetView(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent): void {
      this.owner.willSetRowView(newRowView, oldRowView, rowComponent);
    },
    rowDidSetView(newRowView: RowView | null, oldRowView: RowView | null, rowComponent: RowComponent): void {
      this.owner.onSetRowView(newRowView, oldRowView, rowComponent);
      this.owner.didSetRowView(newRowView, oldRowView, rowComponent);
    },
    rowWillSetTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent): void {
      this.owner.willSetRowTrait(newRowTrait, oldRowTrait, rowComponent);
    },
    rowDidSetTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, rowComponent: RowComponent): void {
      this.owner.onSetRowTrait(newRowTrait, oldRowTrait, rowComponent);
      this.owner.didSetRowTrait(newRowTrait, oldRowTrait, rowComponent);
    },
  });

  protected createRowFastener(rowComponent: RowComponent): ComponentFastener<this, RowComponent> {
    return new TableComponent.RowFastener(this, rowComponent.key, "row") as unknown as ComponentFastener<this, RowComponent>;
  }

  /** @hidden */
  declare readonly rowFasteners: ReadonlyArray<ComponentFastener<this, RowComponent>>;

  protected getRowFastener(rowTrait: RowTrait): ComponentFastener<this, RowComponent> | null {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      const rowComponent = rowFastener.component;
      if (rowComponent !== null && rowComponent.row.trait === rowTrait) {
        return rowFastener;
      }
    }
    return null;
  }

  /** @hidden */
  protected mountRowFasteners(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      rowFastener.mount();
    }
  }

  /** @hidden */
  protected unmountRowFasteners(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      rowFastener.unmount();
    }
  }

  protected detectRowComponent(component: Component): RowComponent | null {
    return component instanceof RowComponent ? component : null;
  }

  protected onInsertRowComponent(rowComponent: RowComponent, targetComponent: Component | null): void {
    this.insertRow(rowComponent, targetComponent);
  }

  protected onRemoveRowComponent(rowComponent: RowComponent): void {
    this.removeRow(rowComponent);
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    const rowComponent = this.detectRowComponent(childComponent);
    if (rowComponent !== null) {
      this.onInsertRowComponent(rowComponent, targetComponent);
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    const rowComponent = this.detectRowComponent(childComponent);
    if (rowComponent !== null) {
      this.onRemoveRowComponent(rowComponent);
    }
  }

  /** @hidden */
  protected mountComponentFasteners(): void {
    super.mountComponentFasteners();
    this.mountColFasteners();
    this.mountRowFasteners();
  }

  /** @hidden */
  protected unmountComponentFasteners(): void {
    this.unmountRowFasteners();
    this.unmountColFasteners();
    super.unmountComponentFasteners();
  }
}
