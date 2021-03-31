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

import {Trait} from "../Trait";
import {TraitScope} from "./TraitScope";

/** @hidden */
export abstract class BooleanTraitScope<R extends Trait> extends TraitScope<R, boolean | null | undefined, boolean | string | null | undefined> {
  fromAny(value: boolean | string | null | undefined): boolean | null | undefined {
    return !!value;
  }
}
TraitScope.Boolean = BooleanTraitScope;
