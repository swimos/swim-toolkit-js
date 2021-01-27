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

import type {Iterator, Map} from "@swim/util";

/** @hidden */
export interface ConstraintKey {
  readonly id: number;
}

/** @hidden */
export class ConstraintMap<K extends ConstraintKey, V> implements Map<K, V> {
  constructor(index?: {[id: number]: number | undefined}, array?: Array<[K, V]>) {
    Object.defineProperty(this, "index", {
      value: index !== void 0 ? index : {},
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "array", {
      value: array !== void 0 ? array : [],
      enumerable: true,
    });
  }

  /** @hidden */
  declare readonly index: {[id: number]: number | undefined};

  /** @hidden */
  declare readonly array: Array<[K, V]>;

  get size(): number {
    return this.array.length;
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  has(key: K): boolean {
    return this.index[key.id] !== void 0;
  }

  get(key: K): V | undefined {
    const index = this.index[key.id];
    return index !== void 0 ? this.array[index]![1] : void 0;
  }

  getField(key: K): [K, V] | undefined {
    const index = this.index[key.id];
    return index !== void 0 ? this.array[index] : void 0;
  }

  getEntry(index: number): [K, V] | undefined {
    return this.array[index];
  }

  set(key: K, newValue: V): this {
    const index = this.index[key.id];
    if (index !== void 0) {
      this.array[index]![1] = newValue;
    } else {
      this.index[key.id] = this.array.length;
      this.array.push([key, newValue]);
    }
    return this;
  }

  delete(key: K): boolean {
    const index = this.index[key.id];
    if (index !== void 0) {
      delete this.index[key.id];
      const item = this.array[index];
      const last = this.array.pop()!;
      if (item !== last) {
        this.array[index] = last;
        this.index[last[0].id] = index;
      }
      return true;
    } else {
      return false;
    }
  }

  remove(key: K): V | undefined {
    const index = this.index[key.id];
    if (index !== void 0) {
      delete this.index[key.id];
      const item = this.array[index]!;
      const last = this.array.pop()!;
      if (item !== last) {
        this.array[index] = last;
        this.index[last[0].id] = index;
      }
      return item[1];
    } else {
      return void 0;
    }
  }

  clear(): void {
    Object.defineProperty(this, "index", {
      value: {},
      enumerable: true,
      configurable: true,
    });
    this.array.length = 0;
  }

  forEach<T>(callback: (key: K, value: V) => T | void): T | undefined;
  forEach<T, S>(callback: (this: S, key: K, value: V) => T | void,
                thisArg: S): T | undefined;
  forEach<T, S>(callback: (this: S | undefined, key: K, value: V) => T | void,
                thisArg?: S): T | undefined {
    const array = this.array;
    for (let i = 0, n = array.length; i < n; i += 1) {
      const item = array[i]!;
      const result = callback.call(thisArg, item[0], item[1]);
      if (result !== void 0) {
        return result;
      }
    }
    return void 0;
  }

  keys(): Iterator<K> {
    throw new Error(); // not implemented
  }

  values(): Iterator<V> {
    throw new Error(); // not implemented
  }

  entries(): Iterator<[K, V]> {
    throw new Error(); // not implemented
  }

  clone(): ConstraintMap<K, V> {
    const oldArray = this.array;
    const n = oldArray.length;
    const newIndex = {} as {[id: number]: number | undefined};
    const newArray = new Array<[K, V]>(n);
    for (let i = 0; i < n; i += 1) {
      const [key, value] = oldArray[i]!;
      newArray[i] = [key, value];
      newIndex[key.id] = i;
    }
    return new ConstraintMap(newIndex, newArray);
  }

  /** @hidden */
  static idCount: number = 1;

  static nextId(): number {
    const nextId = ConstraintMap.idCount;
    ConstraintMap.idCount = nextId + 1;
    return nextId;
  }
}
