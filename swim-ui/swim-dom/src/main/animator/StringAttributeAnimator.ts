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

import {AttributeAnimatorClass, AttributeAnimator} from "./AttributeAnimator";

/** @internal */
export const StringAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const StringAttributeAnimator = _super.extend("StringAttributeAnimator", {}) as AttributeAnimatorClass<AttributeAnimator<any, string | undefined, string | undefined>>;

  StringAttributeAnimator.prototype.parse = function (value: string): string | undefined {
    return value;
  };

  StringAttributeAnimator.prototype.fromAny = function (value: string): string | undefined {
    return value;
  };

  StringAttributeAnimator.prototype.equalValues = function (newValue: string | undefined, oldValue: string | undefined): boolean {
    return newValue === oldValue;
  };

  return StringAttributeAnimator;
})(AttributeAnimator);
