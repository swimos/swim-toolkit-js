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
export interface NumberModelScope<M extends Model> extends ModelScope<M, number, number | string> {
}

/** @hidden */
export const NumberModelScope: ModelScopeConstructor<number, number | string> = (function (_super: typeof ModelScope): ModelScopeConstructor<number, number | string> {
  const NumberModelScope: ModelScopeConstructor<number, number | string> = function <M extends Model>(
      this: NumberModelScope<M>, model: M, scopeName: string, descriptor?: ModelScopeDescriptor<M, number, number | string>): NumberModelScope<M> {
    let _this: NumberModelScope<M> = function accessor(state?: number | string): number | undefined | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._model;
      }
    } as NumberModelScope<M>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ModelScopeConstructor<number, number | string>;
  __extends(NumberModelScope, _super);

  NumberModelScope.prototype.fromAny = function (this: NumberModelScope<Model>, value: number | string | null): number | null {
    if (typeof value === "string") {
      const number = +value;
      if (isFinite(number)) {
        return number;
      } else {
        throw new Error(value);
      }
    } else {
      return value;
    }
  };

  return NumberModelScope;
}(ModelScope));
ModelScope.Number = NumberModelScope;
