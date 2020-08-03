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
import {DisplayManager} from "../display/DisplayManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface DisplayManagerService<V extends View> extends ViewService<V, DisplayManager> {
}

/** @hidden */
export const DisplayManagerService: ViewServiceConstructor<DisplayManager> = (function (_super: typeof ViewService): ViewServiceConstructor<DisplayManager> {
  const DisplayManagerService: ViewServiceConstructor<DisplayManager> = function <V extends View>(
      this: DisplayManagerService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, DisplayManager>): DisplayManagerService<V> {
    let _this: DisplayManagerService<V> = function accessor(): DisplayManager | undefined {
      return _this.state;
    } as DisplayManagerService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<DisplayManager>;
  __extends(DisplayManagerService, _super);

  DisplayManagerService.prototype.mount = function (this: DisplayManagerService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  DisplayManagerService.prototype.unmount = function (this: DisplayManagerService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  DisplayManagerService.prototype.init = function (this: DisplayManagerService<View>): DisplayManager | undefined {
    return DisplayManager.global();
  };

  return DisplayManagerService;
}(ViewService));
ViewService.Display = DisplayManagerService;

View.decorateViewService(DisplayManagerService, {serviceType: DisplayManagerService}, View.prototype, "displayManager");
