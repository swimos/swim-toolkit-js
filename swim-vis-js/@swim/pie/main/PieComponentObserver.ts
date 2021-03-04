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
import type {PieView} from "./PieView";
import type {SliceTrait} from "./SliceTrait";
import type {PieTrait} from "./PieTrait";
import type {SliceComponent} from "./SliceComponent";
import type {PieComponent} from "./PieComponent";

export interface PieComponentObserver<P extends Trait = PieTrait, S extends Trait = SliceTrait, C extends PieComponent<P, S> = PieComponent<P, S>> extends ComponentObserver<C> {
  pieWillSetView?(newSliceView: PieView | null, oldSliceView: PieView | null, component: C): void;

  pieDidSetView?(newSliceView: PieView | null, oldSliceView: PieView | null, component: C): void;

  pieWillSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, component: C): void;

  pieDidSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, component: C): void;

  pieWillSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieDidSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieWillSetSliceValue?(newValue: number, oldValue: number, sliceComponent: SliceComponent<S>, component: C): void;

  pieDidSetSliceValue?(newValue: number, oldValue: number, sliceComponent: SliceComponent<S>, component: C): void;

  pieWillSetSliceLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieDidSetSliceLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieWillSetSliceLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieDidSetSliceLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieWillSetSliceSource?(newSourceTrait: S | null, oldSourceTrait: S | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieDidSetSliceSource?(newSourceTrait: S | null, oldSourceTrait: S | null, sliceComponent: SliceComponent<S>, component: C): void;

  pieWillSetSource?(newSourceTrait: P | null, oldSourceTrait: P | null, component: C): void;

  pieDidSetSource?(newSourceTrait: P | null, oldSourceTrait: P | null, component: C): void;
}
