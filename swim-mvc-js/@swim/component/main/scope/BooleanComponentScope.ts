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
export interface BooleanComponentScope<C extends Component> extends ComponentScope<C, boolean, boolean | string> {
}

/** @hidden */
export const BooleanComponentScope: ComponentScopeConstructor<boolean, boolean | string> = (function (_super: typeof ComponentScope): ComponentScopeConstructor<boolean, boolean | string> {
  const BooleanComponentScope: ComponentScopeConstructor<boolean, boolean | string> = function <C extends Component>(
      this: BooleanComponentScope<C>, component: C, scopeName: string, descriptor?: ComponentScopeDescriptor<C, boolean, boolean | string>): BooleanComponentScope<C> {
    let _this: BooleanComponentScope<C> = function accessor(state?: boolean | string): boolean | undefined | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state);
        return _this._component;
      }
    } as BooleanComponentScope<C>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, component, scopeName, descriptor) || _this;
    return _this;
  } as unknown as ComponentScopeConstructor<boolean, boolean | string>;
  __extends(BooleanComponentScope, _super);

  BooleanComponentScope.prototype.fromAny = function (this: BooleanComponentScope<Component>, value: boolean | string | null): boolean | null {
    if (typeof value === "string") {
      return !!value;
    } else {
      return value;
    }
  };

  return BooleanComponentScope;
}(ComponentScope));
ComponentScope.Boolean = BooleanComponentScope;
