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

import type {Observer} from "@swim/util";
import type {Model} from "../model/Model";
import type {TraitModelType, TraitContextType, Trait} from "./Trait";

/** @public */
export interface TraitObserver<T extends Trait = Trait> extends Observer<T> {
  traitWillAttachModel?(model: TraitModelType<T>, trait: T): void;

  traitDidAttachModel?(model: TraitModelType<T>, trait: T): void;

  traitWillDetachModel?(model: TraitModelType<T>, trait: T): void;

  traitDidDetachModel?(model: TraitModelType<T>, trait: T): void;

  traitWillAttachParent?(parent: Model, trait: T): void;

  traitDidAttachParent?(parent: Model, trait: T): void;

  traitWillDetachParent?(parent: Model, trait: T): void;

  traitDidDetachParent?(parent: Model, trait: T): void;

  traitWillInsertChild?(child: Model, target: Model | null, trait: T): void;

  traitDidInsertChild?(child: Model, target: Model | null, trait: T): void;

  traitWillRemoveChild?(child: Model, trait: T): void;

  traitDidRemoveChild?(child: Model, trait: T): void;

  traitWillReinsertChild?(child: Model, target: Model | null, trait: T): void;

  traitDidReinsertChild?(child: Model, target: Model | null, trait: T): void;

  traitWillInsertTrait?(member: Trait, target: Trait | null, trait: T): void;

  traitDidInsertTrait?(member: Trait, target: Trait | null, trait: T): void;

  traitWillRemoveTrait?(member: Trait, trait: T): void;

  traitDidRemoveTrait?(member: Trait, trait: T): void;

  traitWillMount?(trait: T): void;

  traitDidMount?(trait: T): void;

  traitWillUnmount?(trait: T): void;

  traitDidUnmount?(trait: T): void;

  traitWillMutate?(modelContext: TraitContextType<T>, trait: T): void;

  traitDidMutate?(modelContext: TraitContextType<T>, trait: T): void;

  traitWillAggregate?(modelContext: TraitContextType<T>, trait: T): void;

  traitDidAggregate?(modelContext: TraitContextType<T>, trait: T): void;

  traitWillCorrelate?(modelContext: TraitContextType<T>, trait: T): void;

  traitDidCorrelate?(modelContext: TraitContextType<T>, trait: T): void;

  traitWillValidate?(modelContext: TraitContextType<T>, trait: T): void;

  traitDidValidate?(modelContext: TraitContextType<T>, trait: T): void;

  traitWillReconcile?(modelContext: TraitContextType<T>, trait: T): void;

  traitDidReconcile?(modelContext: TraitContextType<T>, trait: T): void;

  traitWillStartConsuming?(trait: T): void;

  traitDidStartConsuming?(trait: T): void;

  traitWillStopConsuming?(trait: T): void;

  traitDidStopConsuming?(trait: T): void;
}
