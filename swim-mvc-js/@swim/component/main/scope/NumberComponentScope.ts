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
import {Component} from "../Component";
import {ComponentScopeDescriptor, ComponentScopeConstructor, ComponentScope} from "./ComponentScope";

/** @hidden */
export interface NumberComponentScope<C extends Component> extends ComponentScope<C, number, number | string> {
}

/** @hidden */
export const NumberComponentScope: ComponentScopeConstructor<number, number | string> = (function (_super: typeof ComponentScope): ComponentScopeConstructor<number, number | string> {
  const NumberComponentScope: ComponentScopeConstructor<number, number | string> = function <C extends Component>(
      this: NumberComponentScope<C>, component: C, scopeName: string, descriptor?: ComponentScopeDescriptor<C, number, number | string>): NumberComponentScope<C> {
    let _this: NumberComponentScope<C> = function accessor(state?: number | string): number | undefined | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._component;
      }
    } as NumberComponentScope<C>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, component, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ComponentScopeConstructor<number, number | string>;
  __extends(NumberComponentScope, _super);

  NumberComponentScope.prototype.fromAny = function (this: NumberComponentScope<Component>, value: number | string | null): number | null {
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

  return NumberComponentScope;
}(ComponentScope));
ComponentScope.Number = NumberComponentScope;
