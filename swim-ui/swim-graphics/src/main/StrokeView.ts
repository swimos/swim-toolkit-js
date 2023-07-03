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

import type {AnyLength} from "@swim/math";
import type {Length} from "@swim/math";
import type {AnyColor} from "@swim/style";
import type {Color} from "@swim/style";
import type {ThemeAnimator} from "@swim/theme";
import type {GraphicsViewInit} from "./GraphicsView";
import {GraphicsView} from "./GraphicsView";

/** @public */
export interface StrokeViewInit extends GraphicsViewInit {
  stroke?: AnyColor;
  strokeWidth?: AnyLength;
}

/** @public */
export interface StrokeView extends GraphicsView {
  readonly stroke: ThemeAnimator<this, Color | null, AnyColor | null>;

  readonly strokeWidth: ThemeAnimator<this, Length | null, AnyLength | null>;
}

/** @public */
export const StrokeView = {
  init(view: StrokeView, init: StrokeViewInit): void {
    if (init.stroke !== void 0) {
      view.stroke(init.stroke);
    }
    if (init.strokeWidth !== void 0) {
      view.strokeWidth(init.strokeWidth);
    }
  },

  [Symbol.hasInstance](instance: unknown): instance is StrokeView {
    return instance instanceof GraphicsView
        && "stroke" in instance
        && "strokeWidth" in instance;
  },
};
