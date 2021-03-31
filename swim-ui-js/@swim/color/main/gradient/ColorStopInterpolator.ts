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

import {__extends} from "tslib";
import {Interpolator} from "@swim/mapping";
import type {Length} from "@swim/math";
import type {Color} from "../color/Color";
import {ColorStop} from "./ColorStop";

/** @hidden */
export declare abstract class ColorStopInterpolator {
  /** @hidden */
  declare readonly colorInterpolator: Interpolator<Color>;
  /** @hidden */
  declare readonly stopInterpolator: Interpolator<Length | null>;
  /** @hidden */
  declare readonly hintInterpolator: Interpolator<Length | null>;

  get 0(): ColorStop;

  get 1(): ColorStop;

  equals(that: unknown): boolean;
}

export interface ColorStopInterpolator extends Interpolator<ColorStop> {
}

/** @hidden */
export function ColorStopInterpolator(y0: ColorStop, y1: ColorStop): ColorStopInterpolator {
  const interpolator = function (u: number): ColorStop {
    const color = interpolator.colorInterpolator(u);
    const stop = interpolator.stopInterpolator(u);
    const hint = interpolator.hintInterpolator(u);
    return new ColorStop(color, stop, hint);
  } as ColorStopInterpolator;
  Object.setPrototypeOf(interpolator, ColorStopInterpolator.prototype);
  Object.defineProperty(interpolator, "colorInterpolator", {
    value: y0._color.interpolateTo(y1._color),
    enumerable: true,
  });
  Object.defineProperty(interpolator, "stopInterpolator", {
    value: Interpolator(y0._stop, y1._stop),
    enumerable: true,
  });
  Object.defineProperty(interpolator, "hintInterpolator", {
    value: Interpolator(y0._hint, y1._hint),
    enumerable: true,
  });
  return interpolator;
}
__extends(ColorStopInterpolator, Interpolator);

Object.defineProperty(ColorStopInterpolator.prototype, 0, {
  get(this: ColorStopInterpolator): ColorStop {
    const color = this.colorInterpolator[0];
    const stop = this.stopInterpolator[0];
    const hint = this.hintInterpolator[0];
    return new ColorStop(color, stop, hint);
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ColorStopInterpolator.prototype, 1, {
  get(this: ColorStopInterpolator): ColorStop {
    const color = this.colorInterpolator[1];
    const stop = this.stopInterpolator[1];
    const hint = this.hintInterpolator[1];
    return new ColorStop(color, stop, hint);
  },
  enumerable: true,
  configurable: true,
});

ColorStopInterpolator.prototype.equals = function (that: unknown): boolean {
  if (this === that) {
    return true;
  } else if (that instanceof ColorStopInterpolator) {
    return this.colorInterpolator.equals(that.colorInterpolator)
        && this.stopInterpolator.equals(that.stopInterpolator)
        && this.hintInterpolator.equals(that.hintInterpolator);
  }
  return false;
};
