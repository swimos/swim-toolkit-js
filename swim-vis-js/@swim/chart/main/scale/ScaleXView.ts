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

export interface ScaleXView<X = unknown> extends GraphicsView {
  xScale(): ContinuousScale<X, number> | undefined;
  xScale(xScale: ContinuousScale<X, number> | undefined,
         timing?: AnyTiming | boolean): this;

  xDomain(): Domain<X> | undefined;
  xDomain(xDomain: Domain<X> | undefined, timing?: AnyTiming | boolean): this;
  xDomain(xMin: X, xMax: X, timing: AnyTiming | boolean): this;

  xRange(): Range<number> | undefined;

  xDataDomain(): readonly [X, X] | undefined;

  /** @hidden */
  getXDataDomain(): readonly [X, X] | undefined;

  xDataRange(): readonly [number, number] | undefined;
}

export const ScaleXView = {} as {
  is<X>(object: unknown): object is ScaleXView<X>;
};

ScaleXView.is = function <X>(object: unknown): object is ScaleXView<X> {
  if (typeof object === "object" && object !== null) {
    const view = object as ScaleXView<X>;
    return view instanceof ScaleView
        || view instanceof GraphicsView && "xScale" in view;
  }
  return false;
};
