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

import type {Trait, TraitObserver} from "@swim/model";
import type {RowTrait} from "./RowTrait";
import type {ColTrait} from "./ColTrait";
import type {TableTrait} from "./TableTrait";

export interface TableTraitObserver<R extends TableTrait = TableTrait> extends TraitObserver<R> {
  tableTraitWillSetRow?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait | null, trait: R): void;

  tableTraitDidSetRow?(newRowTrait: RowTrait | null, oldRowTrait: RowTrait | null, targetTrait: Trait | null, trait: R): void;

  tableTraitWillSetCol?(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait | null, trait: R): void;

  tableTraitDidSetCol?(newColTrait: ColTrait | null, oldColTrait: ColTrait | null, targetTrait: Trait | null, trait: R): void;
}
