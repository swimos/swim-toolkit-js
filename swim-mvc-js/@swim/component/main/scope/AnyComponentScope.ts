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
import {Component} from "../Component";
import {ComponentScopeDescriptor, ComponentScope} from "./ComponentScope";

/** @hidden */
export interface AnyComponentScopeClass {
  new<C extends Component, T, U = T>(type: FromAny<T, U>, component: C, scopeName?: string,
                                 descriptor?: ComponentScopeDescriptor<C, T, U>): AnyComponentScope<C, T, U>;
}

/** @hidden */
export interface AnyComponentScope<C extends Component, T, U = T> extends ComponentScope<C, T, U> {
  /** @hidden */
  readonly _type: FromAny<T, U>;

  readonly type: FromAny<T, U>;
}

/** @hidden */
export const AnyComponentScope: AnyComponentScopeClass = (function (_super: typeof ComponentScope): AnyComponentScopeClass {
  const AnyComponentScope: AnyComponentScopeClass = function <C extends Component, T, U>(
      this: AnyComponentScope<C, T, U>, type: FromAny<T, U>, component: C, scopeName: string,
      descriptor?: ComponentScopeDescriptor<C, T, U>): AnyComponentScope<C, T, U> {
    let _this: AnyComponentScope<C, T, U> = function accessor(state?: T | U): T | undefined | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state as T | undefined);
        return _this._component;
      }
    } as AnyComponentScope<C, T, U>;
    (_this as any).__proto__ = this;
    (_this as any)._type = type;
    _this = _super.call(_this, component, scopeName, descriptor) || _this;
    return _this;
  } as unknown as AnyComponentScopeClass;
  __extends(AnyComponentScope, _super);

  Object.defineProperty(AnyComponentScope.prototype, "type", {
    get: function <C extends Component, T, U>(this: AnyComponentScope<C, T, U>): FromAny<T, U> {
      return this._type;
    },
    enumerable: true,
    configurable: true,
  });

  AnyComponentScope.prototype.fromAny = function <T, U>(this: AnyComponentScope<Component, T, U>, value: T | U): T {
    return this._type.fromAny(value);
  };

  return AnyComponentScope;
}(ComponentScope));
ComponentScope.Any = AnyComponentScope;
