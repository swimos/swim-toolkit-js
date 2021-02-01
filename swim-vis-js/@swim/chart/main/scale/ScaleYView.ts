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

import type {Domain, Range, AnyTiming, ContinuousScale} from "@swim/mapping";
import {GraphicsView} from "@swim/graphics";
import {ScaleView} from "./ScaleView";

export interface ScaleYView<Y = unknown> extends GraphicsView {
  yScale(): ContinuousScale<Y, number> | undefined;
  yScale(yScale: ContinuousScale<Y, number> | undefined,
         timing?: AnyTiming | boolean): this;

  yDomain(): Domain<Y> | undefined;
  yDomain(yDomain: Domain<Y> | undefined, timing?: AnyTiming | boolean): this;
  yDomain(yMin: Y, yMax: Y, timing: AnyTiming | boolean): this;

  yRange(): Range<number> | undefined;

  yDataDomain(): readonly [Y, Y] | undefined;

  yDataRange(): readonly [number, number] | undefined;
}

export const ScaleYView = {} as {
  is<Y>(object: unknown): object is ScaleYView<Y>
};

ScaleYView.is = function <Y>(object: unknown): object is ScaleYView<Y> {
  if (typeof object === "object" && object !== null) {
    const view = object as ScaleYView<Y>;
    return view instanceof ScaleView
        || view instanceof GraphicsView && "yScale" in view;
  }
  return false;
};
