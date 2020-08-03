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
import {ModalManager} from "../modal/ModalManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface ModalManagerService<V extends View> extends ViewService<V, ModalManager> {
}

/** @hidden */
export const ModalManagerService: ViewServiceConstructor<ModalManager> = (function (_super: typeof ViewService): ViewServiceConstructor<ModalManager> {
  const ModalManagerService: ViewServiceConstructor<ModalManager> = function <V extends View>(
      this: ModalManagerService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, ModalManager>): ModalManagerService<V> {
    let _this: ModalManagerService<V> = function accessor(): ModalManager | undefined {
      return _this.state;
    } as ModalManagerService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<ModalManager>;
  __extends(ModalManagerService, _super);

  ModalManagerService.prototype.mount = function (this: ModalManagerService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  ModalManagerService.prototype.unmount = function (this: ModalManagerService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  ModalManagerService.prototype.init = function (this: ModalManagerService<View>): ModalManager | undefined {
    return ModalManager.global();
  };

  return ModalManagerService;
}(ViewService));
ViewService.Modal = ModalManagerService;

View.decorateViewService(ModalManagerService, {serviceType: ModalManagerService}, View.prototype, "modalManager");
