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
import type {GraphTrait} from "../graph/GraphTrait";
import type {ChartTrait} from "./ChartTrait";

export interface ChartTraitObserver<X, Y, R extends ChartTrait<X, Y> = ChartTrait<X, Y>> extends TraitObserver<R> {
  chartTraitWillSetGraph?(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null, trait: R): void;

  chartTraitDidSetGraph?(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null, trait: R): void;
}
