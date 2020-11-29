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

import {Interpolator} from "@swim/interpolate";
import {AnyColor, Color} from "./Color";

export abstract class ColorInterpolator<C extends Color = Color> extends Interpolator<C, AnyColor> {
  abstract range(): readonly [C, C];
  abstract range(cs: readonly [C, C]): ColorInterpolator<C>;
  abstract range(c0: C, c1: C): ColorInterpolator<C>;
  abstract range(cs: readonly [AnyColor, AnyColor]): ColorInterpolator;
  abstract range(c0: AnyColor, c1: AnyColor): ColorInterpolator;

  static between(c0: AnyColor, c1: AnyColor): ColorInterpolator;
  static between(a: unknown, b: unknown): Interpolator<unknown>;
  static between(a: unknown, b: unknown): Interpolator<unknown> {
    if (a instanceof Color.Rgb && b instanceof Color.Rgb) {
      return new Color.RgbInterpolator(a, b);
    } else if (a instanceof Color.Hsl && b instanceof Color.Hsl) {
      return new Color.HslInterpolator(a, b);
    } else if (a instanceof Color && b instanceof Color) {
      return new Color.RgbInterpolator(a.rgb(), b.rgb());
    } else if (Color.Rgb.isInit(a) && Color.Rgb.isInit(b)) {
      return new Color.RgbInterpolator(Color.Rgb.fromInit(a), Color.Rgb.fromInit(b));
    } else if (Color.Hsl.isInit(a) && Color.Hsl.isInit(b)) {
      return new Color.HslInterpolator(Color.Hsl.fromInit(a), Color.Hsl.fromInit(b));
    } else if (Color.isAny(a) && Color.isAny(b)) {
      return ColorInterpolator.between(Color.fromAny(a), Color.fromAny(b));
    }
    return Interpolator.between(a, b);
  }

  static tryBetween(a: unknown, b: unknown): ColorInterpolator | null {
    if (a instanceof Color.Rgb && b instanceof Color.Rgb) {
      return new Color.RgbInterpolator(a, b);
    } else if (a instanceof Color.Hsl && b instanceof Color.Hsl) {
      return new Color.HslInterpolator(a, b);
    }
    return null;
  }

  static tryBetweenAny(a: unknown, b: unknown): ColorInterpolator | null {
    if ((a instanceof Color || Color.isInit(a)) && (b instanceof Color || Color.isInit(b))) {
      const c0 = Color.fromAny(a);
      const c1 = Color.fromAny(b);
      if (c0 instanceof Color.Rgb && c1 instanceof Color.Rgb) {
        return new Color.RgbInterpolator(c0, c1);
      } else if (c0 instanceof Color.Hsl && c1 instanceof Color.Hsl) {
        return new Color.HslInterpolator(c0, c1);
      } else if (c0 instanceof Color && c1 instanceof Color) {
        return new Color.RgbInterpolator(c0.rgb(), c1.rgb());
      }
    }
    return null;
  }
}
Color.Interpolator = ColorInterpolator;
Interpolator.registerFactory(ColorInterpolator);
