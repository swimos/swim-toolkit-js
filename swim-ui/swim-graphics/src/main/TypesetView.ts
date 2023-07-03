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

import type {AnyR2Point} from "@swim/math";
import type {R2Point} from "@swim/math";
import type {AnyFont} from "@swim/style";
import type {Font} from "@swim/style";
import type {AnyColor} from "@swim/style";
import type {Color} from "@swim/style";
import type {ThemeAnimator} from "@swim/theme";
import type {GraphicsViewInit} from "./GraphicsView";
import {GraphicsView} from "./GraphicsView";

/** @public */
export interface TypesetViewInit extends GraphicsViewInit {
  font?: AnyFont;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  textOrigin?: AnyR2Point;
  textColor?: AnyColor;
}

/** @public */
export interface TypesetView extends GraphicsView {
  readonly font: ThemeAnimator<this, Font | null, AnyFont | null>;

  readonly textAlign: ThemeAnimator<this, CanvasTextAlign | undefined>;

  readonly textBaseline: ThemeAnimator<this, CanvasTextBaseline | undefined>;

  readonly textOrigin: ThemeAnimator<this, R2Point | null, AnyR2Point | null>;

  readonly textColor: ThemeAnimator<this, Color | null, AnyColor | null>;
}

/** @public */
export const TypesetView = {
  init(view: TypesetView, init: TypesetViewInit): void {
    if (init.font !== void 0) {
      view.font(init.font);
    }
    if (init.textAlign !== void 0) {
      view.textAlign(init.textAlign);
    }
    if (init.textBaseline !== void 0) {
      view.textBaseline(init.textBaseline);
    }
    if (init.textOrigin !== void 0) {
      view.textOrigin(init.textOrigin);
    }
    if (init.textColor !== void 0) {
      view.textColor(init.textColor);
    }
  },

  [Symbol.hasInstance](instance: unknown): instance is TypesetView {
    return instance instanceof GraphicsView
          && "font" in instance
          && "textAlign" in instance
          && "textBaseline" in instance
          && "textOrigin" in instance
          && "textColor" in instance;
  },
};
