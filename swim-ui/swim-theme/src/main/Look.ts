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

import {Numbers} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import {Interpolator} from "@swim/util";
import {NumberInterpolator} from "@swim/util";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import {LengthInterpolator} from "@swim/math";
import type {AnyFont} from "@swim/style";
import {Font} from "@swim/style";
import {FontInterpolator} from "@swim/style";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {AnyBoxShadow} from "@swim/style";
import {BoxShadow} from "@swim/style";
import {BoxShadowInterpolator} from "@swim/style";
import {LookVector} from "./LookVector";
import type {MoodVector} from "./MoodVector";
import type {Feel} from "./Feel";
import type {Mood} from "./Mood";

/** @public */
export abstract class Look<T, U = T> implements Mood {
  constructor(name: string) {
    this.name = name;
  }

  readonly name: string;

  add(a: LookVector<T>, b: LookVector<T>): LookVector<T> {
    const aArray = a.array;
    const bArray = b.array;
    const newArray = new Array<[Feel, T]>();
    const newIndex: {[name: string]: number | undefined} = {};
    for (let i = 0, n = aArray.length; i < n; i += 1) {
      const entry = aArray[i]!;
      const feel = entry[0];
      const y = b.get(feel);
      newIndex[feel.name] = newArray.length;
      newArray.push(y === void 0 ? entry : [feel, feel.combine(this, entry[1], y)]);
    }
    for (let i = 0, n = bArray.length; i < n; i += 1) {
      const entry = bArray[i]!;
      const feel = entry[0];
      if (newIndex[feel.name] === void 0) {
        newIndex[feel.name] = newArray.length;
        newArray.push(entry);
      }
    }
    return this.fromArray(newArray, newIndex);
  }

  negate(a: LookVector<T>): LookVector<T> {
    const oldArray = a.array;
    const n = oldArray.length;
    const newArray = new Array<[Feel, T]>(n);
    for (let i = 0; i < n; i += 1) {
      const [feel, x] = oldArray[i]!;
      newArray[i] = [feel, feel.combine(this, void 0, x, -1)];
    }
    return this.fromArray(newArray, a.index);
  }

  subtract(a: LookVector<T>, b: LookVector<T>): LookVector<T> {
    const aArray = a.array;
    const bArray = b.array;
    const newArray = new Array<[Feel, T]>();
    const newIndex: {[name: string]: number | undefined} = {};
    for (let i = 0, n = aArray.length; i < n; i += 1) {
      const entry = aArray[i]!;
      const feel = entry[0];
      const y = b.get(feel);
      newIndex[feel.name] = newArray.length;
      newArray.push(y === void 0 ? entry : [feel, feel.combine(this, entry[1], y, -1)]);
    }
    for (let i = 0, n = bArray.length; i < n; i += 1) {
      const [feel, y] = bArray[i]!;
      if (newIndex[feel.name] === void 0) {
        newIndex[feel.name] = newArray.length;
        newArray.push([feel, feel.combine(this, void 0, y, -1)]);
      }
    }
    return this.fromArray(newArray, newIndex);
  }

  multiply(a: LookVector<T>, scalar: number): LookVector<T> {
    const oldArray = a.array;
    const n = oldArray.length;
    const newArray = new Array<[Feel, T]>(n);
    for (let i = 0; i < n; i += 1) {
      const [feel, x] = oldArray[i]!;
      newArray[i] = [feel, feel.combine(this, void 0, x, scalar)];
    }
    return this.fromArray(newArray, a.index);
  }

  dot(a: LookVector<T>, b: MoodVector): T | undefined {
    const array = a.array;
    let combination: T | undefined;
    for (let i = 0, n = array.length; i < n; i += 1) {
      const [feel, value] = array[i]!;
      const weight = b.get(feel);
      if (weight !== void 0 && weight !== 0) {
        combination = feel.combine(this, combination, value, weight);
      }
    }
    return combination;
  }

  dotOr<E>(a: LookVector<T>, b: MoodVector, elseValue: E): T | E {
    const array = a.array;
    const n = array.length;
    if (n !== 0) {
      let combination: T | undefined;
      for (let i = 0, n = array.length; i < n; i += 1) {
        const [feel, value] = array[i]!;
        const weight = b.get(feel);
        if (weight !== void 0 && weight !== 0) {
          combination = feel.combine(this, combination, value, weight);
        }
      }
      return combination!;
    } else {
      return elseValue;
    }
  }

  abstract combine(combination: T | undefined, value: T, weight?: number): T;

  abstract between(a: T, b: T): Interpolator<T>;

  abstract coerce(value: T | U): T;

  empty(): LookVector<T> {
    return LookVector.empty();
  }

  of(...feels: [Feel, T | U][]): LookVector<T> {
    const n = feels.length;
    const array = new Array<[Feel, T]>(n);
    const index: {[name: string]: number | undefined} = {};
    for (let i = 0; i < n; i += 1) {
      const [feel, value] = feels[i]!;
      array[i] = [feel, this.coerce(value)];
      index[feel.name] = i;
    }
    return this.fromArray(array, index);
  }

  fromArray(array: ReadonlyArray<[Feel, T]>,
            index?: {readonly [name: string]: number | undefined}): LookVector<T> {
    return LookVector.fromArray(array, index);
  }

  toString(): string {
    return "Look" + "." + this.name;
  }

  static font: Look<Font, AnyFont>; // defined by looks
  static smallFont: Look<Font, AnyFont>; // defined by looks
  static largeFont: Look<Font, AnyFont>; // defined by looks

  static textColor: Look<Color, AnyColor>; // defined by looks
  static iconColor: Look<Color, AnyColor>; // defined by looks
  static labelColor: Look<Color, AnyColor>; // defined by looks
  static legendColor: Look<Color, AnyColor>; // defined by looks
  static placeholderColor: Look<Color, AnyColor>; // defined by looks
  static highlightColor: Look<Color, AnyColor>; // defined by looks

  static statusColor: Look<Color, AnyColor>; // defined by looks
  static accentColor: Look<Color, AnyColor>; // defined by looks

  static backgroundColor: Look<Color, AnyColor>; // defined by looks
  static selectionColor: Look<Color, AnyColor>; // defined by looks
  static borderColor: Look<Color, AnyColor>; // defined by looks
  static focusColor: Look<Color, AnyColor>; // defined by looks

  static etchColor: Look<Color, AnyColor>; // defined by looks
  static maskColor: Look<Color, AnyColor>; // defined by looks
  static tickColor: Look<Color, AnyColor>; // defined by looks
  static gridColor: Look<Color, AnyColor>; // defined by looks

  static opacity: Look<number>; // defined by looks
  static shadow: Look<BoxShadow, AnyBoxShadow>; // defined by looks
  static spacing: Look<Length, AnyLength>; // defined by looks
  static timing: Look<Timing, AnyTiming>; // defined by looks
}

/** @public */
export type AnyNumberOrLook = Look<number, any> | number | string | boolean;

/** @public */
export type NumberOrLook = Look<number, any> | number;

/** @public */
export class NumberLook extends Look<number> {
  override combine(combination: number | undefined, value: number, weight: number): number {
    if (combination !== void 0) {
      if (weight === void 0 || weight === 1) {
        return value;
      } else if (weight === 0) {
        return combination;
      } else {
        return (1.0 - weight) * combination + weight * value;
      }
    } else if (weight !== void 0 && weight !== 1) {
      return value * weight;
    } else {
      return value;
    }
  }

  override between(a: number, b: number): Interpolator<number> {
    return NumberInterpolator(a, b);
  }

  override coerce(value: number): number {
    return value;
  }

  static fromAny(value: Look<number> | number | string | boolean): Look<number> | number;
  static fromAny(value: Look<number> | number | string | boolean | undefined): Look<number> | number | undefined;
  static fromAny(value: Look<number> | number | string | boolean | null | undefined): Look<number> | number | null | undefined;
  static fromAny(value: Look<number> | number | string | boolean | null | undefined): Look<number> | number | null | undefined {
    if (value === void 0 || value === null || value instanceof Look) {
      return value;
    } else {
      return Numbers.fromAny(value);
    }
  }
}

/** @public */
export type AnyLengthOrLook = Look<Length, any> | AnyLength;

/** @public */
export type LengthOrLook = Look<Length, any> | Length;

/** @public */
export class LengthLook extends Look<Length, AnyLength> {
  override combine(combination: Length | undefined, value: Length, weight?: number): Length {
    if (combination !== void 0) {
      if (weight === void 0 || weight === 1) {
        return value;
      } else if (weight === 0) {
        return combination;
      } else {
        return LengthInterpolator(combination, value)(weight);
      }
    } else if (weight !== void 0 && weight !== 1) {
      return value.times(weight);
    } else {
      return value;
    }
  }

  override between(a: Length, b: Length): Interpolator<Length> {
    return LengthInterpolator(a, b);
  }

  override coerce(value: AnyLength): Length {
    return Length.fromAny(value);
  }

  static fromAny(value: Look<Length> | AnyLength): Look<Length> | Length;
  static fromAny(value: Look<Length> | AnyLength | null): Look<Length> | Length | null;
  static fromAny(value: Look<Length> | AnyLength | null | undefined): Look<Length> | Length | null | undefined;
  static fromAny(value: Look<Length> | AnyLength | null | undefined): Look<Length> | Length | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof Length) {
      return value;
    } else {
      return Length.fromAny(value);
    }
  }
}

/** @public */
export type AnyColorOrLook = Look<Color, any> | AnyColor;

/** @public */
export type ColorOrLook = Look<Color, any> | Color;

/** @public */
export class ColorLook extends Look<Color, AnyColor> {
  override combine(combination: Color | undefined, value: Color, weight?: number): Color {
    if (combination !== void 0) {
      if (weight === void 0 || weight === 1) {
        return value;
      } else if (weight === 0) {
        return combination;
      } else {
        return combination.interpolateTo(value)(weight);
      }
    } else if (weight !== void 0 && weight !== 1) {
      return value.times(weight);
    } else {
      return value;
    }
  }

  override between(a: Color, b: Color): Interpolator<Color> {
    return a.interpolateTo(b);
  }

  override coerce(value: AnyColor): Color {
    return Color.fromAny(value);
  }

  static fromAny(value: Look<Color> | AnyColor): Look<Color> | Color;
  static fromAny(value: Look<Color> | AnyColor | null): Look<Color> | Color | null;
  static fromAny(value: Look<Color> | AnyColor | null | undefined): Look<Color> | Color | null | undefined;
  static fromAny(value: Look<Color> | AnyColor | null | undefined): Look<Color> | Color | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof Color) {
      return value;
    } else {
      return Color.fromAny(value);
    }
  }
}

/** @public */
export type AnyFontOrLook = Look<Font, any> | AnyFont;

/** @public */
export type FontOrLook = Look<Font, any> | Font;

/** @public */
export class FontLook extends Look<Font, AnyFont> {
  override combine(combination: Font | undefined, value: Font, weight?: number): Font {
    if (weight === void 0 || weight !== 0) {
      return value;
    } else if (combination !== void 0) {
      return combination;
    } else {
      return Font.family(value.family);
    }
  }

  override between(a: Font, b: Font): Interpolator<Font> {
    return FontInterpolator(a, b);
  }

  override coerce(value: AnyFont): Font {
    return Font.fromAny(value);
  }

  static fromAny(value: Look<Font> | AnyFont): Look<Font> | Font;
  static fromAny(value: Look<Font> | AnyFont | null): Look<Font> | Font | null;
  static fromAny(value: Look<Font> | AnyFont | null | undefined): Look<Font> | Font | null | undefined;
  static fromAny(value: Look<Font> | AnyFont | null | undefined): Look<Font> | Font | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof Font) {
      return value;
    } else {
      return Font.fromAny(value);
    }
  }
}

/** @public */
export type AnyShadowOrLook = Look<BoxShadow, any> | AnyBoxShadow;

/** @public */
export type ShadowOrLook = Look<BoxShadow, any> | BoxShadow;

/** @public */
export class ShadowLook extends Look<BoxShadow, AnyBoxShadow> {
  override combine(combination: BoxShadow | undefined, value: BoxShadow, weight?: number): BoxShadow {
    if (weight === void 0 || weight !== 0) {
      return value;
    } else if (combination !== void 0) {
      return combination;
    } else {
      return value;
    }
  }

  override between(a: BoxShadow, b: BoxShadow): Interpolator<BoxShadow> {
    return BoxShadowInterpolator(a, b);
  }

  override coerce(value: AnyBoxShadow): BoxShadow {
    return BoxShadow.fromAny(value)!;
  }

  static fromAny(value: Look<BoxShadow> | AnyBoxShadow): Look<BoxShadow> | BoxShadow;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null): Look<BoxShadow> | BoxShadow | null;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null | undefined): Look<BoxShadow> | BoxShadow | null | undefined;
  static fromAny(value: Look<BoxShadow> | AnyBoxShadow | null | undefined): Look<BoxShadow> | BoxShadow | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof BoxShadow) {
      return value;
    } else {
      return BoxShadow.fromAny(value);
    }
  }
}

/** @public */
export type AnyTimingOrLook = Look<Timing, any> | AnyTiming;

/** @public */
export type TimingOrLook = Look<Timing, any> | Timing;

/** @public */
export class TimingLook extends Look<Timing, AnyTiming> {
  override combine(combination: Timing | undefined, value: Timing, weight: number): Timing {
    if (weight === void 0 || weight !== 0) {
      return value;
    } else if (combination !== void 0) {
      return combination;
    } else {
      return value;
    }
  }

  override between(a: Timing, b: Timing): Interpolator<Timing> {
    return Interpolator(a, b);
  }

  override coerce(value: AnyTiming): Timing {
    return Timing.fromAny(value);
  }

  static fromAny(value: Look<Timing> | AnyTiming): Look<Timing> | Timing;
  static fromAny(value: Look<Timing> | AnyTiming | null): Look<Timing> | Timing | null;
  static fromAny(value: Look<Timing> | AnyTiming | null | undefined): Look<Timing> | Timing | null | undefined;
  static fromAny(value: Look<Timing> | AnyTiming | null | undefined): Look<Timing> | Timing | null | undefined {
    if (value === void 0 || value === null || value instanceof Look || value instanceof Timing) {
      return value;
    } else {
      return Timing.fromAny(value);
    }
  }
}

Look.font = new FontLook("font");
Look.smallFont = new FontLook("smallFont");
Look.largeFont = new FontLook("largeFont");

Look.textColor = new ColorLook("textColor");
Look.iconColor = new ColorLook("iconColor");
Look.labelColor = new ColorLook("labelColor");
Look.legendColor = new ColorLook("legendColor");
Look.placeholderColor = new ColorLook("placeholderColor");
Look.highlightColor = new ColorLook("highlightColor");

Look.statusColor = new ColorLook("statusColor");
Look.accentColor = new ColorLook("accentColor");

Look.backgroundColor = new ColorLook("backgroundColor");
Look.selectionColor = new ColorLook("selectionColor");
Look.borderColor = new ColorLook("borderColor");
Look.focusColor = new ColorLook("focusColor");

Look.etchColor = new ColorLook("etchColor");
Look.maskColor = new ColorLook("maskColor");
Look.tickColor = new ColorLook("tickColor");
Look.gridColor = new ColorLook("gridColor");

Look.opacity = new NumberLook("opacity");
Look.shadow = new ShadowLook("shadow");
Look.spacing = new LengthLook("spacing");
Look.timing = new TimingLook("timing");
