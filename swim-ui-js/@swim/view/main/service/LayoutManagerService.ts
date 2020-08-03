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
export interface LayoutManagerService<V extends View> extends ViewService<V, LayoutManager> {
}

/** @hidden */
export const LayoutManagerService: ViewServiceConstructor<LayoutManager> = (function (_super: typeof ViewService): ViewServiceConstructor<LayoutManager> {
  const LayoutManagerService: ViewServiceConstructor<LayoutManager> = function <V extends View>(
      this: LayoutManagerService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, LayoutManager>): LayoutManagerService<V> {
    let _this: LayoutManagerService<V> = function accessor(): LayoutManager | undefined {
      return _this.state;
    } as LayoutManagerService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<LayoutManager>;
  __extends(LayoutManagerService, _super);

  LayoutManagerService.prototype.mount = function (this: LayoutManagerService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  LayoutManagerService.prototype.unmount = function (this: LayoutManagerService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  LayoutManagerService.prototype.init = function (this: LayoutManagerService<View>): LayoutManager | undefined {
    return LayoutManager.global();
  };

  return LayoutManagerService;
}(ViewService));
ViewService.Layout = LayoutManagerService;

View.decorateViewService(LayoutManagerService, {serviceType: LayoutManagerService}, View.prototype, "layoutManager");
