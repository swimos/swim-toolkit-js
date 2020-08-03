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
import {FromAny} from "@swim/util";
import {Model} from "../Model";
import {ModelScopeDescriptor, ModelScope} from "./ModelScope";

/** @hidden */
export interface AnyModelScopeClass {
  new<M extends Model, T, U = T>(type: FromAny<T, U>, model: M, scopeName?: string,
                                 descriptor?: ModelScopeDescriptor<M, T, U>): AnyModelScope<M, T, U>;
}

/** @hidden */
export interface AnyModelScope<M extends Model, T, U = T> extends ModelScope<M, T, U> {
  /** @hidden */
  readonly _type: FromAny<T, U>;

  readonly type: FromAny<T, U>;
}

/** @hidden */
export const AnyModelScope: AnyModelScopeClass = (function (_super: typeof ModelScope): AnyModelScopeClass {
  const AnyModelScope: AnyModelScopeClass = function <M extends Model, T, U>(
      this: AnyModelScope<M, T, U>, type: FromAny<T, U>, model: M, scopeName: string,
      descriptor?: ModelScopeDescriptor<M, T, U>): AnyModelScope<M, T, U> {
    let _this: AnyModelScope<M, T, U> = function accessor(state?: T | U): T | undefined | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state as T | undefined);
        return _this._model;
      }
    } as AnyModelScope<M, T, U>;
    (_this as any).__proto__ = this;
    (_this as any)._type = type;
    _this = _super.call(_this, model, scopeName, descriptor) || _this;
    return _this;
  } as unknown as AnyModelScopeClass;
  __extends(AnyModelScope, _super);

  Object.defineProperty(AnyModelScope.prototype, "type", {
    get: function <M extends Model, T, U>(this: AnyModelScope<M, T, U>): FromAny<T, U> {
      return this._type;
    },
    enumerable: true,
    configurable: true,
  });

  AnyModelScope.prototype.fromAny = function <T, U>(this: AnyModelScope<Model, T, U>, value: T | U): T {
    return this._type.fromAny(value);
  };

  return AnyModelScope;
}(ModelScope));
ModelScope.Any = AnyModelScope;
