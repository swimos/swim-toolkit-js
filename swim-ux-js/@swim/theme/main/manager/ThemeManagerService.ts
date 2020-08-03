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
import {View, ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "@swim/view";
import {ThemeManager} from "./ThemeManager";

/** @hidden */
export interface ThemeManagerService<V extends View> extends ViewService<V, ThemeManager> {
}

/** @hidden */
export const ThemeManagerService: ViewServiceConstructor<ThemeManager> = (function (_super: typeof ViewService): ViewServiceConstructor<ThemeManager> {
  const ThemeManagerService: ViewServiceConstructor<ThemeManager> = function <V extends View>(
      this: ThemeManagerService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, ThemeManager>): ThemeManagerService<V> {
    let _this: ThemeManagerService<V> = function accessor(): ThemeManager | undefined {
      return _this.state;
    } as ThemeManagerService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<ThemeManager>;
  __extends(ThemeManagerService, _super);

  ThemeManagerService.prototype.mount = function (this: ThemeManagerService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  ThemeManagerService.prototype.unmount = function (this: ThemeManagerService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  ThemeManagerService.prototype.init = function (this: ThemeManagerService<View>): ThemeManager | undefined {
    return ThemeManager.global();
  };

  return ThemeManagerService;
}(ViewService));

View.decorateViewService(ThemeManagerService, {serviceType: ThemeManagerService}, View.prototype, "themeManager");
