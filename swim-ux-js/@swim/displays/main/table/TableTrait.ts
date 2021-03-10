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

import {Model, TraitModelType, Trait, TraitFastener, GenericTrait} from "@swim/model";
import {ColTrait} from "../col/ColTrait";
import {RowTrait} from "../row/RowTrait";
import type {TableTraitObserver} from "./TableTraitObserver";

export class TableTrait extends GenericTrait {
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

  declare readonly traitObservers: ReadonlyArray<TableTraitObserver>;

  insertCol(colTrait: ColTrait, targetTrait: Trait | null = null): void {
    const colFasteners = this.colFasteners as TraitFastener<this, ColTrait>[];
    let targetIndex = -1;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      if (colFastener.trait === colTrait) {
        return;
      } else if (colFastener.trait === targetTrait) {
        targetIndex = i;
      }
    }
    const colFastener = this.createColFastener(colTrait);
    colFasteners.splice(targetIndex, 0, colFastener);
    colFastener.setTrait(colTrait, targetTrait);
    if (this.isMounted()) {
      colFastener.mount();
    }
  }

  removeCol(colTrait: ColTrait): void {
    const colFasteners = this.colFasteners as TraitFastener<this, ColTrait>[];
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colFastener = colFasteners[i]!;
      if (colFastener.trait === colTrait) {
        colFastener.setTrait(null);
        if (this.isMounted()) {
          colFastener.unmount();
        }
        colFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initCol(colTrait: ColTrait, colFastener: TraitFastener<this, ColTrait>): void {
    // hook
  }

  protected attachCol(colTrait: ColTrait, colFastener: TraitFastener<this, ColTrait>): void {
    if (this.isConsuming()) {
      colTrait.addTraitConsumer(this);
    }
  }

  protected detachCol(colTrait: ColTrait, colFastener: TraitFastener<this, ColTrait>): void {
    if (this.isConsuming()) {
      colTrait.removeTraitConsumer(this);
    }
  }

  protected willSetCol(newColTrait: ColTrait | null, oldColTrait: ColTrait | null,
                       targetTrait: Trait | null, colFastener: TraitFastener<this, ColTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.tableTraitWillSetCol !== void 0) {
        traitObserver.tableTraitWillSetCol(newColTrait, oldColTrait, targetTrait, this);
      }
    }
  }

  protected onSetCol(newColTrait: ColTrait | null, oldColTrait: ColTrait | null,
                     targetTrait: Trait | null, colFastener: TraitFastener<this, ColTrait>): void {
    if (newColTrait !== null) {
      this.initCol(newColTrait, colFastener);
    }
  }

  protected didSetCol(newColTrait: ColTrait | null, oldColTrait: ColTrait | null,
                      targetTrait: Trait | null, colFastener: TraitFastener<this, ColTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.tableTraitDidSetCol !== void 0) {
        traitObserver.tableTraitDidSetCol(newColTrait, oldColTrait, targetTrait, this);
      }
    }
  }

  /** @hidden */
  static ColFastener = TraitFastener.define<TableTrait, ColTrait>({
    type: ColTrait,
    sibling: false,
    willSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait | null): void {
      this.owner.willSetCol(newColTrait, oldColTrait, targetTrait, this);
    },
    onSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait | null): void {
      if (oldColTrait !== null) {
        this.owner.detachCol(oldColTrait, this);
      }
      if (newColTrait !== null) {
        this.owner.attachCol(newColTrait, this);
      }
      this.owner.onSetCol(newColTrait, oldColTrait, targetTrait, this);
    },
    didSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait | null): void {
      this.owner.didSetCol(newColTrait, oldColTrait, targetTrait, this);
    },
  });

  protected createColFastener(colTrait: ColTrait): TraitFastener<this, ColTrait> {
    return new TableTrait.ColFastener(this, colTrait.key, "col") as TraitFastener<this, ColTrait>;
  }

  /** @hidden */
  declare readonly colFasteners: ReadonlyArray<TraitFastener<this, ColTrait>>;

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

  /** @hidden */
  protected startConsumingCols(): void {
    const colFasteners = this.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colTrait = colFasteners[i]!.trait;
      if (colTrait !== null) {
        colTrait.addTraitConsumer(this);
      }
    }
  }

  /** @hidden */
  protected stopConsumingCols(): void {
    const colFasteners = this.colFasteners;
    for (let i = 0, n = colFasteners.length; i < n; i += 1) {
      const colTrait = colFasteners[i]!.trait;
      if (colTrait !== null) {
        colTrait.removeTraitConsumer(this);
      }
    }
  }

  insertRow(rowTrait: RowTrait, targetTrait: Trait | null = null): void {
    const rowFasteners = this.rowFasteners as TraitFastener<this, RowTrait>[];
    let targetIndex = -1;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.trait === rowTrait) {
        return;
      } else if (rowFastener.trait === targetTrait) {
        targetIndex = i;
      }
    }
    const rowFastener = this.createRowFastener(rowTrait);
    rowFasteners.splice(targetIndex, 0, rowFastener);
    rowFastener.setTrait(rowTrait, targetTrait);
    if (this.isMounted()) {
      rowFastener.mount();
    }
  }

  removeRow(rowTrait: RowTrait): void {
    const rowFasteners = this.rowFasteners as TraitFastener<this, RowTrait>[];
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.trait === rowTrait) {
        rowFastener.setTrait(null);
        if (this.isMounted()) {
          rowFastener.unmount();
        }
        rowFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initRow(rowTrait: RowTrait, rowFastener: TraitFastener<this, RowTrait>): void {
    // hook
  }

  protected attachRow(rowTrait: RowTrait, rowFastener: TraitFastener<this, RowTrait>): void {
    if (this.isConsuming()) {
      rowTrait.addTraitConsumer(this);
    }
  }

  protected detachRow(rowTrait: RowTrait, rowFastener: TraitFastener<this, RowTrait>): void {
    if (this.isConsuming()) {
      rowTrait.removeTraitConsumer(this);
    }
  }

  protected willSetRow(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null,
                       targetTrait: Trait | null, rowFastener: TraitFastener<this, RowTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.tableTraitWillSetRow !== void 0) {
        traitObserver.tableTraitWillSetRow(newRowTrait, oldRowTrait, targetTrait, this);
      }
    }
  }

  protected onSetRow(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null,
                     targetTrait: Trait | null, rowFastener: TraitFastener<this, RowTrait>): void {
    if (newRowTrait !== null) {
      this.initRow(newRowTrait, rowFastener);
    }
  }

  protected didSetRow(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null,
                      targetTrait: Trait | null, rowFastener: TraitFastener<this, RowTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.tableTraitDidSetRow !== void 0) {
        traitObserver.tableTraitDidSetRow(newRowTrait, oldRowTrait, targetTrait, this);
      }
    }
  }

  /** @hidden */
  static RowFastener = TraitFastener.define<TableTrait, RowTrait>({
    type: RowTrait,
    sibling: false,
    willSetTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait | null): void {
      this.owner.willSetRow(newRowTrait, oldRowTrait, targetTrait, this);
    },
    onSetTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait | null): void {
      if (oldRowTrait !== null) {
        this.owner.detachRow(oldRowTrait, this);
      }
      if (newRowTrait !== null) {
        this.owner.attachRow(newRowTrait, this);
      }
      this.owner.onSetRow(newRowTrait, oldRowTrait, targetTrait, this);
    },
    didSetTrait(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait | null): void {
      this.owner.didSetRow(newRowTrait, oldRowTrait, targetTrait, this);
    },
  });

  protected createRowFastener(rowTrait: RowTrait): TraitFastener<this, RowTrait> {
    return new TableTrait.RowFastener(this, rowTrait.key, "row") as TraitFastener<this, RowTrait>;
  }

  /** @hidden */
  declare readonly rowFasteners: ReadonlyArray<TraitFastener<this, RowTrait>>;

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

  /** @hidden */
  protected startConsumingRows(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowTrait = rowFasteners[i]!.trait;
      if (rowTrait !== null) {
        rowTrait.addTraitConsumer(this);
      }
    }
  }

  /** @hidden */
  protected stopConsumingRows(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowTrait = rowFasteners[i]!.trait;
      if (rowTrait !== null) {
        rowTrait.removeTraitConsumer(this);
      }
    }
  }

  protected detectCol(model: Model): ColTrait | null {
    return model.getTrait(ColTrait);
  }

  protected onInsertCol(colTrait: ColTrait, targetTrait: Trait | null): void {
    this.insertCol(colTrait, targetTrait);
  }

  protected onRemoveCol(colTrait: ColTrait): void {
    this.removeCol(colTrait);
  }

  protected detectRow(model: Model): RowTrait | null {
    return model.getTrait(RowTrait);
  }

  protected onInsertRow(rowTrait: RowTrait, targetTrait: Trait | null): void {
    this.insertRow(rowTrait, targetTrait);
  }

  protected onRemoveRow(rowTrait: RowTrait): void {
    this.removeRow(rowTrait);
  }

  protected detectChildModels(model: TraitModelType<this>): void {
    const childModels = model.childModels;
    for (let i = 0, n = childModels.length; i < n; i += 1) {
      const childModel = childModels[i]!;
      const colTrait = this.detectCol(childModel);
      if (colTrait !== null) {
        this.insertCol(colTrait);
      }
      const rowTrait = this.detectRow(childModel);
      if (rowTrait !== null) {
        this.insertRow(rowTrait);
      }
    }
  }

  protected didSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    if (newModel !== null) {
      this.detectChildModels(newModel);
    }
    super.didSetModel(newModel, oldModel);
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null): void {
    super.onInsertChildModel(childModel, targetModel);
    const colTrait = this.detectCol(childModel);
    if (colTrait !== null) {
      const targetTrait = targetModel !== null ? this.detectCol(targetModel) : null;
      this.onInsertCol(colTrait, targetTrait);
    }
    const rowTrait = this.detectRow(childModel);
    if (rowTrait !== null) {
      const targetTrait = targetModel !== null ? this.detectRow(targetModel) : null;
      this.onInsertRow(rowTrait, targetTrait);
    }
  }

  protected onRemoveChildModel(childModel: Model): void {
    super.onRemoveChildModel(childModel);
    const colTrait = this.detectCol(childModel);
    if (colTrait !== null) {
      this.onRemoveCol(colTrait);
    }
    const rowTrait = this.detectRow(childModel);
    if (rowTrait !== null) {
      this.onRemoveRow(rowTrait);
    }
  }

  /** @hidden */
  protected mountTraitFasteners(): void {
    super.mountTraitFasteners();
    this.mountColFasteners();
    this.mountRowFasteners();
  }

  /** @hidden */
  protected unmountTraitFasteners(): void {
    this.unmountRowFasteners();
    this.unmountColFasteners();
    super.unmountTraitFasteners();
  }

  protected onStartConsuming(): void {
    super.onStartConsuming();
    this.startConsumingCols();
    this.startConsumingRows();
  }

  protected onStopConsuming(): void {
    super.onStopConsuming();
    this.stopConsumingRows();
    this.stopConsumingCols();
  }
}
