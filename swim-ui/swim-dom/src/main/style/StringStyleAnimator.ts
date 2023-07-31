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

import type {StyleAnimatorClass} from "./StyleAnimator";
import {StyleAnimator} from "./StyleAnimator";

/** @internal */
export interface StringStyleAnimator<O = unknown, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const StringStyleAnimator = (function (_super: typeof StyleAnimator) {
  const StringStyleAnimator = _super.extend("StringStyleAnimator", {
    valueType: String,
  }) as StyleAnimatorClass<StringStyleAnimator<any, any, any>>;

  StringStyleAnimator.prototype.equalValues = function (newValue: string | undefined, oldValue: string | undefined): boolean {
    return newValue === oldValue;
  };

  StringStyleAnimator.prototype.parse = function (value: string): string | undefined {
    return value;
  };

  StringStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): string | undefined {
    return value.toString();
  };

  StringStyleAnimator.prototype.fromAny = function (value: string): string | undefined {
    return value;
  };

  return StringStyleAnimator;
})(StyleAnimator);
