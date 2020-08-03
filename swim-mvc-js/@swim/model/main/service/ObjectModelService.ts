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
import {ModelServiceDescriptor, ModelService} from "./ModelService";

/** @hidden */
export interface ObjectModelServiceClass {
  new<M extends Model, T>(model: M, serviceName: string, descriptor?: ModelServiceDescriptor<M, T>): ObjectModelService<M, T>;
}

/** @hidden */
export interface ObjectModelService<M extends Model, T> extends ModelService<M, T> {
}

/** @hidden */
export const ObjectModelService: ObjectModelServiceClass = (function (_super: typeof ModelService): ObjectModelServiceClass {
  const ObjectModelService: ObjectModelServiceClass = function <M extends Model, T>(
      this: ObjectModelService<M, T>, model: M, serviceName: string,
      descriptor?: ModelServiceDescriptor<M, T>): ObjectModelService<M, T> {
    let _this: ObjectModelService<M, T> = function accessor(): T | undefined {
      return _this.state;
    } as ObjectModelService<M, T>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ObjectModelServiceClass;
  __extends(ObjectModelService, _super);

  return ObjectModelService;
}(ModelService));
ModelService.Object = ObjectModelService;
