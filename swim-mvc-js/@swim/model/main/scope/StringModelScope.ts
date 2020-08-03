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
export interface StringModelScope<M extends Model> extends ModelScope<M, string> {
}

/** @hidden */
export const StringModelScope: ModelScopeConstructor<string> = (function (_super: typeof ModelScope): ModelScopeConstructor<string> {
  const StringModelScope: ModelScopeConstructor<string> = function <M extends Model>(
      this: StringModelScope<M>, model: M, scopeName: string, descriptor?: ModelScopeDescriptor<M, string>): StringModelScope<M> {
    let _this: StringModelScope<M> = function accessor(state?: string): string | undefined | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._model;
      }
    } as StringModelScope<M>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ModelScopeConstructor<string>;
  __extends(StringModelScope, _super);

  StringModelScope.prototype.fromAny = function (this: StringModelScope<Model>, value: string | null): string | null {
    return value;
  };

  return StringModelScope;
}(ModelScope));
ModelScope.String = StringModelScope;
