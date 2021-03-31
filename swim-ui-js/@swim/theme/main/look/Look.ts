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

import type {AnyTiming, Timing, Interpolator} from "@swim/mapping";
import type {AnyLength, Length} from "@swim/math";
import type {AnyColor, Color} from "@swim/color";
import type {AnyFont, Font, AnyBoxShadow, BoxShadow} from "@swim/style";
import {LookVector} from "./LookVector";
import type {Feel} from "../feel/Feel";
import type {Mood} from "../mood/Mood";
import type {MoodVector} from "../mood/MoodVector";

export abstract class Look<T, U = never> implements Mood {
  declare readonly name: string;

  constructor(name: string) {
    Object.defineProperty(this, "name", {
      value: name,
      configurable: true,
      enumerable: true,
    });
  }

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

  static color: Look<Color, AnyColor>; // defined by looks
  static iconColor: Look<Color, AnyColor>; // defined by looks
  static statusColor: Look<Color, AnyColor>; // defined by looks
  static accentColor: Look<Color, AnyColor>; // defined by looks
  static mutedColor: Look<Color, AnyColor>; // defined by looks
  static neutralColor: Look<Color, AnyColor>; // defined by looks
  static subduedColor: Look<Color, AnyColor>; // defined by looks
  static faintColor: Look<Color, AnyColor>; // defined by looks
  static highlightColor: Look<Color, AnyColor>; // defined by looks

  static backgroundColor: Look<Color, AnyColor>; // defined by looks
  static borderColor: Look<Color, AnyColor>; // defined by looks

  static opacity: Look<number>; // defined by looks
  static shadow: Look<BoxShadow, AnyBoxShadow>; // defined by looks
  static spacing: Look<Length, AnyLength>; // defined by looks
  static timing: Look<Timing, AnyTiming>; // defined by looks
}
