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
import {ModelScopeDescriptor, ModelScope} from "./ModelScope";

/** @hidden */
export interface ObjectModelScopeClass {
  new<M extends Model, T>(model: M, scopeName: string, descriptor?: ModelScopeDescriptor<M, T>): ObjectModelScope<M, T>;
}

/** @hidden */
export interface ObjectModelScope<M extends Model, T> extends ModelScope<M, T> {
}

/** @hidden */
export const ObjectModelScope: ObjectModelScopeClass = (function (_super: typeof ModelScope): ObjectModelScopeClass {
  const ObjectModelScope: ObjectModelScopeClass = function <M extends Model, T>(
      this: ObjectModelScope<M, T>, model: M, scopeName: string,
      descriptor?: ModelScopeDescriptor<M, T>): ObjectModelScope<M, T> {
    let _this: ObjectModelScope<M, T> = function accessor(state?: T): T | undefined | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._model;
      }
    } as ObjectModelScope<M, T>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ObjectModelScopeClass;
  __extends(ObjectModelScope, _super);

  ObjectModelScope.prototype.fromAny = function <T>(this: ObjectModelScope<Model, T>, value: T | null): T | null {
    return value;
  };

  return ObjectModelScope;
}(ModelScope));
ModelScope.Object = ObjectModelScope;
