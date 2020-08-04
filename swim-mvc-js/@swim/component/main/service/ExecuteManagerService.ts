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
import {ExecuteManager} from "../execute/ExecuteManager";
import {
  ComponentServiceDescriptor,
  ComponentServiceConstructor,
  ComponentService,
} from "./ComponentService";

/** @hidden */
export interface ExecuteManagerService<C extends Component> extends ComponentService<C, ExecuteManager> {
}

/** @hidden */
export const ExecuteManagerService: ComponentServiceConstructor<ExecuteManager> = (function (_super: typeof ComponentService): ComponentServiceConstructor<ExecuteManager> {
  const ExecuteManagerService: ComponentServiceConstructor<ExecuteManager> = function <C extends Component>(
      this: ExecuteManagerService<C>, component: C, serviceName: string, descriptor?: ComponentServiceDescriptor<C, ExecuteManager>): ExecuteManagerService<C> {
    let _this: ExecuteManagerService<C> = function accessor(): ExecuteManager | undefined {
      return _this.state;
    } as ExecuteManagerService<C>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, component, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ComponentServiceConstructor<ExecuteManager>;
  __extends(ExecuteManagerService, _super);

  ExecuteManagerService.prototype.mount = function (this: ExecuteManagerService<Component>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootComponent(this._component);
    }
  };

  ExecuteManagerService.prototype.unmount = function (this: ExecuteManagerService<Component>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootComponent(this._component);
    }
    _super.prototype.unmount.call(this);
  };

  ExecuteManagerService.prototype.init = function (this: ExecuteManagerService<Component>): ExecuteManager | undefined {
    return ExecuteManager.global();
  };

  return ExecuteManagerService;
}(ComponentService));
ComponentService.Execute = ExecuteManagerService;

Component.decorateComponentService(ExecuteManagerService, {serviceType: ExecuteManagerService}, Component.prototype, "executeManager");
