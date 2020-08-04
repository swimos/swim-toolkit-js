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
import {ComponentServiceDescriptor, ComponentService} from "./ComponentService";

/** @hidden */
export interface ObjectComponentServiceClass {
  new<C extends Component, T>(component: C, serviceName: string, descriptor?: ComponentServiceDescriptor<C, T>): ObjectComponentService<C, T>;
}

/** @hidden */
export interface ObjectComponentService<C extends Component, T> extends ComponentService<C, T> {
}

/** @hidden */
export const ObjectComponentService: ObjectComponentServiceClass = (function (_super: typeof ComponentService): ObjectComponentServiceClass {
  const ObjectComponentService: ObjectComponentServiceClass = function <C extends Component, T>(
      this: ObjectComponentService<C, T>, component: C, serviceName: string,
      descriptor?: ComponentServiceDescriptor<C, T>): ObjectComponentService<C, T> {
    let _this: ObjectComponentService<C, T> = function accessor(): T | undefined {
      return _this.state;
    } as ObjectComponentService<C, T>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, component, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ObjectComponentServiceClass;
  __extends(ObjectComponentService, _super);

  return ObjectComponentService;
}(ComponentService));
ComponentService.Object = ObjectComponentService;
