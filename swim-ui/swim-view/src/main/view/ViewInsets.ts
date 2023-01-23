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

/** @public */
export interface ViewInsets {
  readonly insetTop: number;
  readonly insetRight: number;
  readonly insetBottom: number;
  readonly insetLeft: number;
}

/** @public */
export const ViewInsets = (function () {
  const ViewInsets = {} as {
    readonly zero: ViewInsets;
    equal(x: ViewInsets | null | undefined, y: ViewInsets | null | undefined): boolean;
  };

  Object.defineProperty(ViewInsets, "zero", {
    value: Object.freeze({
      insetTop: 0,
      insetRight: 0,
      insetBottom: 0,
      insetLeft: 0,
    }),
    enumerable: true,
    configurable: true,
  });

  ViewInsets.equal = function (x: ViewInsets | null | undefined, y: ViewInsets | null | undefined): boolean {
    if (x === y) {
      return true;
    } else if (typeof x === "object" && x !== null && typeof y === "object" && y !== null) {
      return x.insetTop === y.insetTop
          && x.insetRight === y.insetRight
          && x.insetBottom === y.insetBottom
          && x.insetLeft === y.insetLeft;
    }
    return false;
  };

  return ViewInsets;
})();
