// Copyright 2015-2021 Swim inc.
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

import type {View} from "../View";
import {ViewPropertyConstraint} from "./ViewPropertyConstraint";

/** @hidden */
export abstract class NumberViewPropertyConstraint<V extends View> extends ViewPropertyConstraint<V, number | null | undefined, number | string | null | undefined> {
  override toNumber(value: number | null | undefined): number {
    return typeof value === "number" ? value : 0;
  }

  override fromAny(value: number | string | null | undefined): number | null | undefined {
    if (typeof value === "number") {
      return value;
    } else if (typeof value === "string") {
      const number = +value;
      if (isFinite(number)) {
        return number;
      } else {
        throw new Error(value);
      }
    } else {
      return value;
    }
  }
}
