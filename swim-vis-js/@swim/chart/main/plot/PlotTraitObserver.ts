// Copyright 2015-2021 Swim inc.
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
import type {DataSetTrait} from "../data/DataSetTrait";
import type {PlotTrait} from "./PlotTrait";

export interface PlotTraitObserver<X, Y, R extends PlotTrait<X, Y> = PlotTrait<X, Y>> extends TraitObserver<R> {
  traitWillSetDataSet?(newDataSetTrait: DataSetTrait<X, Y> | null, oldDataSetTrait: DataSetTrait<X, Y> | null, targetTrait: Trait | null, trait: R): void;

  traitDidSetDataSet?(newDataSetTrait: DataSetTrait<X, Y> | null, oldDataSetTrait: DataSetTrait<X, Y> | null, targetTrait: Trait | null, trait: R): void;
}
