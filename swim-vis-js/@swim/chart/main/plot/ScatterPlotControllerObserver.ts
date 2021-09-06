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

import type {PlotControllerObserver} from "./PlotControllerObserver";
import type {ScatterPlotView} from "./ScatterPlotView";
import type {ScatterPlotTrait} from "./ScatterPlotTrait";
import type {ScatterPlotController} from "./ScatterPlotController";

export interface ScatterPlotControllerObserver<X, Y, C extends ScatterPlotController<X, Y> = ScatterPlotController<X, Y>> extends PlotControllerObserver<X, Y, C> {
  controllerWillSetPlotTrait?(newPlotTrait: ScatterPlotTrait<X, Y> | null, oldPlotTrait: ScatterPlotTrait<X, Y> | null, controller: C): void;

  controllerDidSetPlotTrait?(newPlotTrait: ScatterPlotTrait<X, Y> | null, oldPlotTrait: ScatterPlotTrait<X, Y> | null, controller: C): void;

  controllerWillSetPlotView?(newPlotView: ScatterPlotView<X, Y> | null, oldPlotView: ScatterPlotView<X, Y> | null, controller: C): void;

  controllerDidSetPlotView?(newPlotView: ScatterPlotView<X, Y> | null, oldPlotView: ScatterPlotView<X, Y> | null, controller: C): void;
}
