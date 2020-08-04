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
import {View} from "../View";
import {ViewServiceDescriptor, ViewService} from "./ViewService";

/** @hidden */
export interface ObjectViewServiceClass {
  new<V extends View, T>(view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, T>): ObjectViewService<V, T>;
}

/** @hidden */
export interface ObjectViewService<V extends View, T> extends ViewService<V, T> {
}

/** @hidden */
export const ObjectViewService: ObjectViewServiceClass = (function (_super: typeof ViewService): ObjectViewServiceClass {
  const ObjectViewService: ObjectViewServiceClass = function <V extends View, T>(
      this: ObjectViewService<V, T>, view: V, serviceName: string,
      descriptor?: ViewServiceDescriptor<V, T>): ObjectViewService<V, T> {
    let _this: ObjectViewService<V, T> = function accessor(): T | undefined {
      return _this.state;
    } as ObjectViewService<V, T>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ObjectViewServiceClass;
  __extends(ObjectViewService, _super);

  return ObjectViewService;
}(ViewService));
ViewService.Object = ObjectViewService;