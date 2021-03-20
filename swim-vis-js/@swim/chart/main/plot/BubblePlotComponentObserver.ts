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

import type {BubblePlotView} from "./BubblePlotView";
import type {BubblePlotTrait} from "./BubblePlotTrait";
import type {ScatterPlotComponentObserver} from "./ScatterPlotComponentObserver";
import type {BubblePlotComponent} from "./BubblePlotComponent";

export interface BubblePlotComponentObserver<X, Y, C extends BubblePlotComponent<X, Y> = BubblePlotComponent<X, Y>> extends ScatterPlotComponentObserver<X, Y, C> {
  plotWillSetTrait?(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null, component: C): void;

  plotDidSetTrait?(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null, component: C): void;

  plotWillSetView?(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null, component: C): void;

  plotDidSetView?(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null, component: C): void;
}
