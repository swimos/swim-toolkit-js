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

import type {Trait} from "@swim/model";
import type {ComponentObserver} from "@swim/component";
import type {GraphicsView} from "@swim/graphics";
import type {SliceView} from "./SliceView";
import type {SliceTrait} from "./SliceTrait";
import type {SliceComponent} from "./SliceComponent";

export interface SliceComponentObserver<S extends Trait = SliceTrait, C extends SliceComponent<S> = SliceComponent<S>> extends ComponentObserver<C> {
  sliceWillSetView?(newSliceView: SliceView | null, oldSliceView: SliceView | null, component: C): void;

  sliceDidSetView?(newSliceView: SliceView | null, oldSliceView: SliceView | null, component: C): void;

  sliceWillSetValue?(newValue: number, oldValue: number, component: C): void;

  sliceDidSetValue?(newValue: number, oldValue: number, component: C): void;

  sliceWillSetLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, component: C): void;

  sliceDidSetLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, component: C): void;

  sliceWillSetLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, component: C): void;

  sliceDidSetLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, component: C): void;

  sliceWillSetSource?(newSourceTrait: S | null, oldSourceTrait: S | null, component: C): void;

  sliceDidSetSource?(newSourceTrait: S | null, oldSourceTrait: S | null, component: C): void;
}
