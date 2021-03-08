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
import type {ComponentObserver} from "@swim/component";
import type {SliceView} from "./SliceView";
import type {PieView} from "./PieView";
import type {SliceTrait} from "./SliceTrait";
import type {PieTrait} from "./PieTrait";
import type {SliceComponent} from "./SliceComponent";
import type {PieComponent} from "./PieComponent";

export interface PieComponentObserver<C extends PieComponent = PieComponent> extends ComponentObserver<C> {
  pieWillSetView?(newPieView: PieView | null, oldPieView: PieView | null, component: C): void;

  pieDidSetView?(newPieView: PieView | null, oldPieView: PieView | null, component: C): void;

  pieWillSetTrait?(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null, component: C): void;

  pieDidSetTrait?(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null, component: C): void;

  pieWillSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, component: C): void;

  pieDidSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, component: C): void;

  pieWillSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent, component: C): void;

  pieDidSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent, component: C): void;

  pieWillSetSliceValue?(newValue: number, oldValue: number, sliceComponent: SliceComponent, component: C): void;

  pieDidSetSliceValue?(newValue: number, oldValue: number, sliceComponent: SliceComponent, component: C): void;

  pieWillSetSliceLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent, component: C): void;

  pieDidSetSliceLabel?(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent, component: C): void;

  pieWillSetSliceLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent, component: C): void;

  pieDidSetSliceLegend?(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent, component: C): void;

  pieWillSetSliceTrait?(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent, component: C): void;

  pieDidSetSliceTrait?(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent, component: C): void;
}
