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

import {Interpolator} from "@swim/mapping";
import {AnyTransition, Transition} from "@swim/animation";
import {Look} from "./Look";

export class TransitionLook<T = unknown> extends Look<Transition<T>, AnyTransition<T>> {
  combine(combination: Transition<T> | undefined, value: Transition<T>, weight: number): Transition<T> {
    if (weight === void 0 || weight !== 0) {
      return value;
    } else if (combination !== void 0) {
      return combination;
    } else {
      return new Transition(void 0, null, null, null);
    }
  }

  between(a: Transition<T>, b: Transition<T>): Interpolator<Transition<T>> {
    return Interpolator(a, b);
  }

  coerce(value: AnyTransition<T>): Transition<T> {
    return Transition.fromAny(value);
  }
}
