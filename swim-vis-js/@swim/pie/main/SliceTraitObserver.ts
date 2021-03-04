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

import type {GraphicsView} from "@swim/graphics";
import type {TraitObserver} from "@swim/model";
import type {SliceTrait} from "./SliceTrait";

export interface SliceTraitObserver<R extends SliceTrait = SliceTrait> extends TraitObserver<R> {
  sliceWillSetValue?(newValue: number, oldValue: number, trait: R): void;

  sliceDidSetValue?(newValue: number, oldValue: number, trait: R): void;

  sliceWillSetLabel?(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined, trait: R): void;

  sliceDidSetLabel?(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined, trait: R): void;

  sliceWillSetLegend?(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined, trait: R): void;

  sliceDidSetLegend?(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined, trait: R): void;
}
