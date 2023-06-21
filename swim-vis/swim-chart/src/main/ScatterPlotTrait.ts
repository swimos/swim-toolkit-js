// Copyright 2015-2023 Swim.inc
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

import type {Class} from "@swim/util";
import type {PlotTraitObserver} from "./PlotTrait";
import {PlotTrait} from "./PlotTrait";
import type {ScatterPlotController} from "./ScatterPlotController";

/** @public */
export interface ScatterPlotTraitObserver<X = unknown, Y = unknown, T extends ScatterPlotTrait<X, Y> = ScatterPlotTrait<X, Y>> extends PlotTraitObserver<X, Y, T> {
}

/** @public */
export abstract class ScatterPlotTrait<X = unknown, Y = unknown> extends PlotTrait<X, Y> {
  declare readonly observerType?: Class<ScatterPlotTraitObserver<X, Y>>;

  abstract override createPlotController(): ScatterPlotController<X, Y>;
}
