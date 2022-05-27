// Copyright 2015-2022 Swim.inc
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

import {AnyLength, Length} from "@swim/math";
import {StyleAnimatorClass, StyleAnimator} from "./StyleAnimator";

/** @internal */
export const LengthStyleAnimator = (function (_super: typeof StyleAnimator) {
  const LengthStyleAnimator = _super.extend("LengthStyleAnimator", {}) as StyleAnimatorClass<StyleAnimator<any, Length | null, AnyLength | null>>;

  LengthStyleAnimator.prototype.parse = function (value: string): Length | null {
    return Length.parse(value);
  };

  LengthStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): Length | null {
    return Length.fromCssValue(value);
  };

  LengthStyleAnimator.prototype.fromAny = function (value: AnyLength | string): Length | null {
    try {
      return Length.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  LengthStyleAnimator.prototype.equalValues = function (newValue: Length | null, oldValue: Length | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  return LengthStyleAnimator;
})(StyleAnimator);
