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

import {__extends} from "tslib";
import {Model} from "../Model";
import {ModelScopeDescriptor, ModelScopeConstructor, ModelScope} from "./ModelScope";

/** @hidden */
export interface BooleanModelScope<M extends Model> extends ModelScope<M, boolean, boolean | string> {
}

/** @hidden */
export const BooleanModelScope: ModelScopeConstructor<boolean, boolean | string> = (function (_super: typeof ModelScope): ModelScopeConstructor<boolean, boolean | string> {
  const BooleanModelScope: ModelScopeConstructor<boolean, boolean | string> = function <M extends Model>(
      this: BooleanModelScope<M>, model: M, scopeName: string, descriptor?: ModelScopeDescriptor<M, boolean, boolean | string>): BooleanModelScope<M> {
    let _this: BooleanModelScope<M> = function accessor(state?: boolean | string): boolean | undefined | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._model;
      }
    } as BooleanModelScope<M>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ModelScopeConstructor<boolean, boolean | string>;
  __extends(BooleanModelScope, _super);

  BooleanModelScope.prototype.fromAny = function (this: BooleanModelScope<Model>, value: boolean | string | null): boolean | null {
    if (typeof value === "string") {
      return !!value;
    } else {
      return value;
    }
  };

  return BooleanModelScope;
}(ModelScope));
ModelScope.Boolean = BooleanModelScope;
