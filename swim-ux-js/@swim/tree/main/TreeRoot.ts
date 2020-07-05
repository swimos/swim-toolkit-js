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

import {AnyLength, Length} from "@swim/length";

export type AnyTreeRoot = TreeRoot | TreeRootInit;

export interface TreeRootInit {
  key?: string;
  grow?: number;
  shrink?: number;
  optional?: boolean;
  basis?: AnyLength;
  width?: AnyLength | null;
  left?: AnyLength | null;
  right?: AnyLength | null;
  hidden?: boolean;
}

export class TreeRoot {
  /** @hidden */
  readonly _key: string;
  /** @hidden */
  readonly _grow: number;
  /** @hidden */
  readonly _shrink: number;
  /** @hidden */
  readonly _optional: boolean;
  /** @hidden */
  readonly _basis: Length;
  /** @hidden */
  readonly _width: Length | null;
  /** @hidden */
  readonly _left: Length | null;
  /** @hidden */
  readonly _right: Length | null;
  /** @hidden */
  readonly _hidden: boolean;

  constructor(key: string, grow: number, shrink: number, optional: boolean,
              basis: Length, width: Length | null, left: Length | null,
              right: Length | null, hidden: boolean) {
    this._key = key;
    this._grow = grow;
    this._shrink = shrink;
    this._optional = optional;
    this._basis = basis;
    this._width = width;
    this._left = left;
    this._right = right;
    this._hidden = hidden;
  }

  get key(): string {
    return this._key;
  }

  grow(): number;
  grow(grow: number): TreeRoot;
  grow(grow?: number): number | TreeRoot {
    if (grow === void 0) {
      return this._grow;
    } else {
      return this.copy(this._key, grow, this._shrink, this._optional, this._basis,
                       this._width, this._left, this._right, this._hidden);
    }
  }

  shrink(): number;
  shrink(shrink: number): TreeRoot;
  shrink(shrink?: number): number | TreeRoot {
    if (shrink === void 0) {
      return this._shrink;
    } else {
      return this.copy(this._key, this._grow, shrink, this._optional, this._basis,
                       this._width, this._left, this._right, this._hidden);
    }
  }

  optional(): boolean;
  optional(optional: boolean): TreeRoot;
  optional(optional?: boolean): boolean | TreeRoot {
    if (optional === void 0) {
      return this._optional;
    } else {
      return this.copy(this._key, this._grow, this._shrink, optional, this._basis,
                       this._width, this._left, this._right, this._hidden);
    }
  }

  basis(): Length;
  basis(basis: AnyLength): TreeRoot;
  basis(basis?: AnyLength): Length | TreeRoot {
    if (basis === void 0) {
      return this._basis;
    } else {
      basis = Length.fromAny(basis);
      return this.copy(this._key, this._grow, this._shrink, this._optional, basis,
                       this._width, this._left, this._right, this._hidden);
    }
  }

  width(): Length | null;
  width(width: AnyLength | null): TreeRoot;
  width(width?: AnyLength | null): Length | null | TreeRoot {
    if (width === void 0) {
      return this._width;
    } else {
      if (width !== null) {
        width = Length.fromAny(width);
      }
      return this.copy(this._key, this._grow, this._shrink, this._optional,
                       this._basis, width, this._left, this._right, this._hidden);
    }
  }

  left(): Length | null;
  left(left: AnyLength | null): TreeRoot;
  left(left?: AnyLength | null): Length | null | TreeRoot {
    if (left === void 0) {
      return this._left;
    } else {
      if (left !== null) {
        left = Length.fromAny(left);
      }
      return this.copy(this._key, this._grow, this._shrink, this._optional,
                       this._basis, this._width, left, this._right, this._hidden);
    }
  }

  right(): Length | null;
  right(right: AnyLength | null): TreeRoot;
  right(right?: AnyLength | null): Length | null | TreeRoot {
    if (right === void 0) {
      return this._right;
    } else {
      if (right !== null) {
        right = Length.fromAny(right);
      }
      return this.copy(this._key, this._grow, this._shrink, this._optional,
                       this._basis, this._width, this._left, right, this._hidden);
    }
  }

  hidden(): boolean;
  hidden(hidden: boolean): TreeRoot;
  hidden(hidden?: boolean): boolean | TreeRoot {
    if (hidden === void 0) {
      return this._hidden;
    } else {
      return this.copy(this._key, this._grow, this._shrink, this._optional,
                       this._basis, this._width, this._left, this._right, hidden);
    }
  }

  resized(width: AnyLength | null, left: AnyLength | null,
          right: AnyLength | null, hidden?: boolean): TreeRoot {
    if (width !== null) {
      width = Length.fromAny(width);
    }
    if (left !== null) {
      left = Length.fromAny(left);
    }
    if (right !== null) {
      right = Length.fromAny(right);
    }
    if (hidden === void 0) {
      hidden = this._hidden;
    }
    return this.copy(this._key, this._grow, this._shrink, this._optional,
                     this._basis, width, left, right, hidden);
  }

  protected copy(key: string, grow: number, shrink: number, optional: boolean,
                 basis: Length, width: Length | null, left: Length | null,
                 right: Length | null, hidden: boolean): TreeRoot {
    return new TreeRoot(key, grow, shrink, optional, basis,
                        width, left, right, hidden);
  }

  static fromAny(grain: AnyTreeRoot): TreeRoot {
    if (grain instanceof TreeRoot) {
      return grain;
    } else if (typeof grain === "object" && grain !== null) {
      return TreeRoot.fromInit(grain);
    }
    throw new TypeError("" + grain);
  }

  static fromInit(init: TreeRootInit): TreeRoot {
    let key = init.key;
    if (key === void 0) {
      key = "";
    }
    let grow = init.grow;
    if (grow === void 0) {
      grow = 0;
    }
    let shrink = init.shrink;
    if (shrink === void 0) {
      shrink = 1;
    }
    let optional = init.optional;
    if (optional === void 0) {
      optional = false;
    }
    let basis = init.basis;
    if (basis !== void 0) {
      basis = Length.fromAny(basis);
    } else {
      basis = Length.zero();
    }
    let width = init.width;
    if (width !== void 0 && width !== null) {
      width = Length.fromAny(width);
    } else {
      width = null
    }
    let left = init.left;
    if (left !== void 0 && left !== null) {
      left = Length.fromAny(left);
    } else {
      left = null
    }
    let right = init.right;
    if (right !== void 0 && right !== null) {
      right = Length.fromAny(right);
    } else {
      right = null
    }
    let hidden = init.hidden;
    if (hidden === void 0) {
      hidden = false;
    }
    return new TreeRoot(key, grow, shrink, optional, basis,
                        width, left, right, hidden);
  }
}
