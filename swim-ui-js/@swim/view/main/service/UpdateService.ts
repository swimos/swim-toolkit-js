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
import {UpdateManager} from "../update/UpdateManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface UpdateService<V extends View> extends ViewService<V, UpdateManager> {
}

/** @hidden */
export const UpdateService: ViewServiceConstructor<UpdateManager> = (function (_super: typeof ViewService): ViewServiceConstructor<UpdateManager> {
  const UpdateService: ViewServiceConstructor<UpdateManager> = function <V extends View>(
      this: UpdateService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, UpdateManager>): UpdateService<V> {
    let _this: UpdateService<V> = function accessor(): UpdateManager | undefined {
      return _this.state;
    } as UpdateService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<UpdateManager>;
  __extends(UpdateService, _super);

  UpdateService.prototype.mount = function (this: UpdateService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  UpdateService.prototype.unmount = function (this: UpdateService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  UpdateService.prototype.init = function (this: UpdateService<View>): UpdateManager | undefined {
    return UpdateManager.global();
  };

  return UpdateService;
}(ViewService));
ViewService.Update = UpdateService;

View.decorateViewService(UpdateService, {serviceType: UpdateService}, View.prototype, "updateManager");
