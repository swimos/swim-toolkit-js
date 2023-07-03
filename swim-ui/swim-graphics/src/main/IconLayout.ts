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

import type {Uninitable} from "@swim/util";
import {Objects} from "@swim/util";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";

/** @public */
export type AnyIconLayout = IconLayout | IconLayoutInit;

/** @public */
export interface IconLayoutInit {
  iconWidth: AnyLength;
  iconHeight: AnyLength;
  xAlign?: number;
  yAlign?: number;
}

/** @public */
export const IconLayoutInit = {
  [Symbol.hasInstance](instance: unknown): instance is IconLayoutInit {
    return Objects.hasAllKeys<IconLayoutInit>(instance, "iconWidth", "iconHeight", "xAlign", "yAlign");
  },
};

/** @public */
export interface IconLayout {
  readonly iconWidth: Length;
  readonly iconHeight: Length;
  readonly xAlign: number | undefined;
  readonly yAlign: number | undefined;
}

/** @public */
export const IconLayout = {
  fromAny<T extends AnyIconLayout | null | undefined>(value: T): IconLayout | Uninitable<T> {
    if (value === void 0 || value === null || IconLayout[Symbol.hasInstance](value)) {
      return value as IconLayout | Uninitable<T>;
    } else if (IconLayoutInit[Symbol.hasInstance](value)) {
      return IconLayout.fromInit(value);
    }
    throw new TypeError("" + value);
  },

  fromInit(init: IconLayoutInit): IconLayout {
    const iconWidth = Length.fromAny(init.iconWidth);
    const iconHeight = Length.fromAny(init.iconHeight);
    const xAlign = init.xAlign;
    const yAlign = init.yAlign;
    return {iconWidth, iconHeight, xAlign, yAlign};
  },

  [Symbol.hasInstance](instance: unknown): instance is IconLayout {
    return Objects.hasAllKeys<IconLayout>(instance, "iconWidth", "iconHeight", "xAlign", "yAlign")
        && instance.iconWidth instanceof Length
        && instance.iconHeight instanceof Length
        && typeof instance.xAlign === "number"
        && typeof instance.yAlign === "number";
  },
};
