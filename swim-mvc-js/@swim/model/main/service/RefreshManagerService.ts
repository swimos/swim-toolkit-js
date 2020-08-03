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
import {RefreshManager} from "../refresh/RefreshManager";
import {ModelServiceDescriptor, ModelServiceConstructor, ModelService} from "./ModelService";

/** @hidden */
export interface RefreshManagerService<M extends Model> extends ModelService<M, RefreshManager> {
}

/** @hidden */
export const RefreshManagerService: ModelServiceConstructor<RefreshManager> = (function (_super: typeof ModelService): ModelServiceConstructor<RefreshManager> {
  const RefreshManagerService: ModelServiceConstructor<RefreshManager> = function <M extends Model>(
      this: RefreshManagerService<M>, model: M, serviceName: string, descriptor?: ModelServiceDescriptor<M, RefreshManager>): RefreshManagerService<M> {
    let _this: RefreshManagerService<M> = function accessor(): RefreshManager | undefined {
      return _this.state;
    } as RefreshManagerService<M>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, model, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ModelServiceConstructor<RefreshManager>;
  __extends(RefreshManagerService, _super);

  RefreshManagerService.prototype.mount = function (this: RefreshManagerService<Model>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootModel(this._model);
    }
  };

  RefreshManagerService.prototype.unmount = function (this: RefreshManagerService<Model>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootModel(this._model);
    }
    _super.prototype.unmount.call(this);
  };

  RefreshManagerService.prototype.init = function (this: RefreshManagerService<Model>): RefreshManager | undefined {
    return RefreshManager.global();
  };

  return RefreshManagerService;
}(ModelService));
ModelService.Refresh = RefreshManagerService;

Model.decorateModelService(RefreshManagerService, {serviceType: RefreshManagerService}, Model.prototype, "refreshManager");
