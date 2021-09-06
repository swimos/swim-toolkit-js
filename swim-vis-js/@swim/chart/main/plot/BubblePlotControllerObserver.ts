// Copyright 2015-2021 Swim Inc.
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

import type {Length} from "@swim/math";
import type {Color} from "@swim/style";
import type {BubblePlotView} from "./BubblePlotView";
import type {BubblePlotTrait} from "./BubblePlotTrait";
import type {ScatterPlotControllerObserver} from "./ScatterPlotControllerObserver";
import type {BubblePlotController} from "./BubblePlotController";

export interface BubblePlotControllerObserver<X, Y, C extends BubblePlotController<X, Y> = BubblePlotController<X, Y>> extends ScatterPlotControllerObserver<X, Y, C> {
  controllerWillSetPlotTrait?(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null, controller: C): void;

  controllerDidSetPlotTrait?(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null, controller: C): void;

  controllerWillSetPlotView?(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null, controller: C): void;

  controllerDidSetPlotView?(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null, controller: C): void;

  controllerWillSetPlotRadius?(newRadius: Length | null, oldRadius: Length | null, controller: C): void;

  controllerDidSetPlotRadius?(newRadius: Length | null, oldRadius: Length | null, controller: C): void;

  controllerWillSetPlotFill?(newFill: Color | null, oldFill: Color | null, controller: C): void;

  controllerDidSetPlotFill?(newFill: Color | null, oldFill: Color | null, controller: C): void;
}
