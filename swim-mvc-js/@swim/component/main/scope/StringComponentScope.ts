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
export interface StringComponentScope<C extends Component> extends ComponentScope<C, string> {
}

/** @hidden */
export const StringComponentScope: ComponentScopeConstructor<string> = (function (_super: typeof ComponentScope): ComponentScopeConstructor<string> {
  const StringComponentScope: ComponentScopeConstructor<string> = function <C extends Component>(
      this: StringComponentScope<C>, component: C, scopeName: string, descriptor?: ComponentScopeDescriptor<C, string>): StringComponentScope<C> {
    let _this: StringComponentScope<C> = function accessor(state?: string): string | undefined | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._component;
      }
    } as StringComponentScope<C>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, component, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ComponentScopeConstructor<string>;
  __extends(StringComponentScope, _super);

  StringComponentScope.prototype.fromAny = function (this: StringComponentScope<Component>, value: string | null): string | null {
    return value;
  };

  return StringComponentScope;
}(ComponentScope));
ComponentScope.String = StringComponentScope;
