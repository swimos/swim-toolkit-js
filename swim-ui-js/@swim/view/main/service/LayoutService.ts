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
import {LayoutManager} from "../layout/LayoutManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface LayoutService<V extends View> extends ViewService<V, LayoutManager> {
}

/** @hidden */
export const LayoutService: ViewServiceConstructor<LayoutManager> = (function (_super: typeof ViewService): ViewServiceConstructor<LayoutManager> {
  const LayoutService: ViewServiceConstructor<LayoutManager> = function <V extends View>(
      this: LayoutService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, LayoutManager>): LayoutService<V> {
    let _this: LayoutService<V> = function accessor(): LayoutManager | undefined {
      return _this.state;
    } as LayoutService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<LayoutManager>;
  __extends(LayoutService, _super);

  LayoutService.prototype.mount = function (this: LayoutService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  LayoutService.prototype.unmount = function (this: LayoutService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  LayoutService.prototype.init = function (this: LayoutService<View>): LayoutManager | undefined {
    return LayoutManager.global();
  };

  return LayoutService;
}(ViewService));
ViewService.Layout = LayoutService;

View.decorateViewService(LayoutService, {serviceType: LayoutService}, View.prototype, "layoutManager");
