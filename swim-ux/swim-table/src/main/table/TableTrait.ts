// Copyright 2015-2022 Swim.inc
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

import type {Class} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import {AnyLength, Length} from "@swim/math";
import {Model, Trait, TraitRefDef, TraitSetDef} from "@swim/model";
import type {ColLayout} from "../layout/ColLayout";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import {RowTrait} from "../row/RowTrait";
import {ColTrait} from "../col/ColTrait";
import {HeaderTrait} from "../header/HeaderTrait";
import type {TableTraitObserver} from "./TableTraitObserver";

/** @public */
export class TableTrait extends Trait {
  override readonly observerType?: Class<TableTraitObserver>;

  protected createLayout(): TableLayout | null {
    const colLayouts: ColLayout[] = [];
    const colTraits = this.cols.traits;
    for (const traitId in colTraits) {
      const colTrait = colTraits[traitId]!;
      const colLayout = colTrait.layout.value;
      if (colLayout !== null) {
        colLayouts.push(colLayout);
      }
    }
    const colSpacing = this.colSpacing.value;
    return new TableLayout(null, null, null, colSpacing, colLayouts);
  }

  protected updateLayout(): void {
    const layout = this.createLayout();
    this.layout.setValue(layout, Affinity.Intrinsic);
  }

  @PropertyDef<TableTrait["layout"]>({
    valueType: TableLayout,
    value: null,
    didSetValue(layout: TableLayout | null): void {
      this.owner.callObservers("traitDidSetTableLayout", layout, this.owner);
    },
  })
  readonly layout!: PropertyDef<this, {value: TableLayout | null, valueInit: AnyTableLayout | null}>;

  @PropertyDef<TableTrait["colSpacing"]>({
    valueType: Length,
    value: null,
    didSetValue(newColSpacing: Length | null, oldColSpacing: Length | null): void {
      this.owner.updateLayout();
    },
  })
  readonly colSpacing!: PropertyDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @TraitRefDef<TableTrait["header"]>({
    traitType: HeaderTrait,
    binds: true,
    willAttachTrait(headerTrait: HeaderTrait): void {
      this.owner.callObservers("traitWillAttachHeader", headerTrait, this.owner);
    },
    didDetachTrait(headerTrait: HeaderTrait): void {
      this.owner.callObservers("traitDidDetachHeader", headerTrait, this.owner);
    },
    detectTrait(trait: Trait): HeaderTrait | null {
      return trait instanceof HeaderTrait ? trait : null;
    },
  })
  readonly header!: TraitRefDef<this, {trait: HeaderTrait}>;
  static readonly header: FastenerClass<TableTrait["header"]>;

  @TraitSetDef<TableTrait["cols"]>({
    traitType: ColTrait,
    binds: true,
    observes: true,
    willAttachTrait(colTrait: ColTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachCol", colTrait, targetTrait, this.owner);
    },
    didAttachTrait(colTrait: ColTrait): void {
      this.owner.updateLayout();
      if (this.owner.consuming) {
        colTrait.consume(this.owner);
      }
    },
    willDetachTrait(colTrait: ColTrait): void {
      if (this.owner.consuming) {
        colTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(colTrait: ColTrait): void {
      this.owner.updateLayout();
      this.owner.callObservers("traitDidDetachCol", colTrait, this.owner);
    },
    traitDidSetLayout(colLayout: ColLayout | null): void {
      this.owner.updateLayout();
    },
    detectModel(model: Model): ColTrait | null {
      return model.getTrait(ColTrait);
    },
  })
  readonly cols!: TraitSetDef<this, {trait: ColTrait, observes: true}>;
  static readonly cols: FastenerClass<TableTrait["cols"]>;

  @TraitSetDef<TableTrait["rows"]>({
    traitType: RowTrait,
    binds: true,
    willAttachTrait(rowTrait: RowTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachRow", rowTrait, targetTrait, this.owner);
    },
    didAttachTrait(rowTrait: RowTrait): void {
      if (this.owner.consuming) {
        rowTrait.consume(this.owner);
      }
    },
    willDetachTrait(rowTrait: RowTrait): void {
      if (this.owner.consuming) {
        rowTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(rowTrait: RowTrait): void {
      this.owner.callObservers("traitDidDetachRow", rowTrait, this.owner);
    },
    detectModel(model: Model): RowTrait | null {
      return model.getTrait(RowTrait);
    },
    detectTrait(trait: Trait): RowTrait | null {
      return null;
    },
  })
  readonly rows!: TraitSetDef<this, {trait: RowTrait}>;
  static readonly rows: FastenerClass<TableTrait["rows"]>;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.cols.consumeTraits(this);
    this.rows.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.rows.unconsumeTraits(this);
    this.cols.unconsumeTraits(this);
  }
}
