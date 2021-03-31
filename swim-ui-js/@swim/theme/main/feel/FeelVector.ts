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

import {Equals, Lazy, Arrays} from "@swim/util";
import {Debug, Format, Output} from "@swim/codec";
import type {Interpolate, Interpolator} from "@swim/mapping";
import type {Look} from "../look/Look";
import {FeelVectorInterpolator} from "../"; // forward import

export type AnyFeelVector = FeelVector | FeelVectorArray;

export type FeelVectorArray = ReadonlyArray<[Look<unknown>, unknown]>;

export class FeelVector implements Interpolate<FeelVector>, Equals, Debug {
  constructor(array: ReadonlyArray<[Look<unknown>, unknown]>,
              index: {readonly [name: string]: number | undefined}) {
    Object.defineProperty(this, "array", {
      value: array,
      enumerable: true,
    });
    Object.defineProperty(this, "index", {
      value: index,
      enumerable: true,
    });
  }

  /** @hidden */
  declare readonly array: ReadonlyArray<[Look<unknown>, unknown]>;

  /** @hidden */
  declare readonly index: {readonly [name: string]: number | undefined};

  get size(): number {
    return this.array.length;
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  has(look: Look<any>): boolean;
  has(name: string): boolean;
  has(look: Look<any> | string): boolean {
    if (typeof look === "object" && look !== null || typeof look === "function") {
      look = look.name;
    }
    return this.index[look] !== void 0;
  }

  get<T>(look: Look<T, any>): T | undefined;
  get(name: string): unknown | undefined;
  get(index: number): unknown | undefined;
  get<T>(look: Look<T, any> | string | number | undefined): T | unknown | undefined {
    if (typeof look === "object" && look !== null || typeof look === "function") {
      look = look.name;
    }
    if (typeof look === "string") {
      look = this.index[look];
    }
    const entry = typeof look === "number" ? this.array[look] : void 0;
    return entry !== void 0 ? entry[1] : void 0;
  }

  updated<T, U = never>(look: Look<T, U>, value: T | U | undefined): FeelVector {
    const oldArray = this.array;
    const oldIndex = this.index;
    const i = oldIndex[look.name];
    if (value !== void 0 && i !== void 0) { // update
      const newArray = oldArray.slice(0);
      newArray[i] = [look, value];
      return this.copy(newArray, oldIndex);
    } else if (value !== void 0) { // insert
      const newArray = oldArray.slice(0);
      const newIndex: {[name: string]: number | undefined} = {};
      for (const name in oldIndex) {
        newIndex[name] = oldIndex[name];
      }
      newIndex[look.name] = newArray.length;
      newArray.push([look, value]);
      return this.copy(newArray, newIndex);
    } else if (i !== void 0) { // remove
      const newArray = new Array<[Look<unknown>, unknown]>();
      const newIndex: {[name: string]: number | undefined} = {};
      let k = 0;
      for (let j = 0, n = oldArray.length; j < n; j += 1) {
        const entry = oldArray[j]!;
        if (entry[0] !== look) {
          newArray[k] = entry;
          newIndex[entry[0].name] = k;
          k += 1;
        }
      }
      return this.copy(newArray, newIndex);
    } else { // nop
      return this;
    }
  }

  plus(that: FeelVector): FeelVector {
    const thisArray = this.array;
    const thatArray = that.array;
    const newArray = new Array<[Look<unknown>, unknown]>();
    const newIndex: {[name: string]: number | undefined} = {};
    for (let i = 0, n = thisArray.length; i < n; i += 1) {
      const entry = thisArray[i]!;
      const look = entry[0];
      const y = that.get(look);
      newIndex[look.name] = newArray.length;
      newArray.push(y === void 0 ? entry : [look, look.combine(entry[1], y)]);
    }
    for (let i = 0, n = thatArray.length; i < n; i += 1) {
      const entry = thatArray[i]!;
      const look = entry[0];
      if (newIndex[look.name] === void 0) {
        newIndex[look.name] = newArray.length;
        newArray.push(entry);
      }
    }
    return this.copy(newArray, newIndex);
  }

  negative(): FeelVector {
    const oldArray = this.array;
    const n = oldArray.length;
    const newArray = new Array<[Look<unknown>, unknown]>(n);
    for (let i = 0; i < n; i += 1) {
      const [look, x] = oldArray[i]!;
      newArray[i] = [look, look.combine(void 0, x, -1)];
    }
    return this.copy(newArray, this.index);
  }

  minus(that: FeelVector): FeelVector {
    const thisArray = this.array;
    const thatArray = that.array;
    const newArray = new Array<[Look<unknown>, unknown]>();
    const newIndex: {[name: string]: number | undefined} = {};
    for (let i = 0, n = thisArray.length; i < n; i += 1) {
      const entry = thisArray[i]!;
      const look = entry[0];
      const y = that.get(look);
      newIndex[look.name] = newArray.length;
      newArray.push(y === void 0 ? entry : [look, look.combine(entry[1], y, -1)]);
    }
    for (let i = 0, n = thatArray.length; i < n; i += 1) {
      const [look, y] = thatArray[i]!;
      if (newIndex[look.name] === void 0) {
        newIndex[look.name] = newArray.length;
        newArray.push([look, look.combine(void 0, y, -1)]);
      }
    }
    return this.copy(newArray, newIndex);
  }

  times(scalar: number): FeelVector {
    const oldArray = this.array;
    const n = oldArray.length;
    const newArray = new Array<[Look<unknown>, unknown]>(n);
    for (let i = 0; i < n; i += 1) {
      const [look, x] = oldArray[i]!;
      newArray[i] = [look, look.combine(void 0, x, scalar)];
    }
    return this.copy(newArray, this.index);
  }

  protected copy(array: ReadonlyArray<[Look<unknown>, unknown]>,
                 index?: {readonly [name: string]: number | undefined}): FeelVector {
    return FeelVector.fromArray(array, index);
  }

  forEach<R>(callback: <T>(value: T, look: Look<T>) => R | void): R | undefined;
  forEach<R, S>(callback: <T>(this: S, value: T, look: Look<T>) => R | void,
                thisArg: S): R | undefined;
  forEach<R, S>(callback: <T>(this: S | undefined, value: T, look: Look<T>) => R | void,
                thisArg?: S): R | undefined {
    const array = this.array;
    for (let i = 0, n = array.length; i < n; i += 1) {
      const entry = array[i]!;
      const result = callback.call(thisArg, entry[1], entry[0]);
      if (result !== void 0) {
        return result;
      }
    }
    return void 0;
  }

  interpolateTo(that: FeelVector): Interpolator<FeelVector>;
  interpolateTo(that: unknown): Interpolator<FeelVector> | null;
  interpolateTo(that: unknown): Interpolator<FeelVector> | null {
    if (that instanceof FeelVector) {
      return FeelVectorInterpolator(this, that);
    } else {
      return null;
    }
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof FeelVector) {
      return Arrays.equal(this.array, that.array);
    }
    return false;
  }

  debug(output: Output): void {
    const array = this.array;
    const n = array.length;
    output = output.write("FeelVector").write(46/*'.'*/)
        .write(n !== 0 ? "of" : "empty").write(40/*'('*/);
    for (let i = 0; i < n; i += 1) {
      const [look, value] = array[i]!;
      if (i !== 0) {
        output = output.write(", ");
      }
      output = output.write(91/*'['*/).debug(look).write(", ").debug(value).write(93/*']'*/);
    }
    output = output.write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }

  @Lazy
  static empty(): FeelVector {
    return new FeelVector([], {});
  }

  static of(...looks: [Look<unknown>, unknown][]): FeelVector {
    const n = looks.length;
    const array = new Array<[Look<unknown>, unknown]>(n);
    const index: {[name: string]: number | undefined} = {};
    for (let i = 0; i < n; i += 1) {
      const [look, value] = looks[i]!;
      array[i] = [look, look.coerce(value)];
      index[look.name] = i;
    }
    return new FeelVector(array, index);
  }

  static fromArray(array: ReadonlyArray<[Look<unknown>, unknown]>,
                   index?: {readonly [name: string]: number | undefined}): FeelVector {
    if (index === void 0) {
      index = FeelVector.index(array);
    }
    return new FeelVector(array, index);
  }

  static fromAny(vector: AnyFeelVector): FeelVector {
    if (vector instanceof FeelVector) {
      return vector;
    } else if (Array.isArray(vector)) {
      return FeelVector.of(...vector);
    }
    throw new TypeError("" + vector);
  }

  /** @hidden */
  static index<T>(array: ReadonlyArray<[Look<T>, T]>): {readonly [name: string]: number | undefined} {
    const index: {[name: string]: number | undefined} = {};
    for (let i = 0, n = array.length; i < n; i += 1) {
      const entry = array[i]!;
      index[entry[0].name] = i;
    }
    return index;
  }
}
