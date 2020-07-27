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
import {ViewportManager} from "../viewport/ViewportManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface ViewportService<V extends View> extends ViewService<V, ViewportManager> {
}

/** @hidden */
export const ViewportService: ViewServiceConstructor<ViewportManager> = (function (_super: typeof ViewService): ViewServiceConstructor<ViewportManager> {
  const ViewportService: ViewServiceConstructor<ViewportManager> = function <V extends View>(
      this: ViewportService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, ViewportManager>): ViewportService<V> {
    let _this: ViewportService<V> = function accessor(): ViewportManager | undefined {
      return _this.state;
    } as ViewportService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<ViewportManager>;
  __extends(ViewportService, _super);

  ViewportService.prototype.mount = function (this: ViewportService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  ViewportService.prototype.unmount = function (this: ViewportService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  ViewportService.prototype.init = function (this: ViewportService<View>): ViewportManager | undefined {
    return ViewportManager.global();
  };

  return ViewportService;
}(ViewService));
ViewService.Viewport = ViewportService;

View.decorateViewService(ViewportService, {serviceType: ViewportService}, View.prototype, "viewportManager");
