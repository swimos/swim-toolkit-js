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
import {HistoryManager} from "../history/HistoryManager";
import {ViewServiceDescriptor, ViewServiceConstructor, ViewService} from "./ViewService";

/** @hidden */
export interface HistoryManagerService<V extends View> extends ViewService<V, HistoryManager> {
}

/** @hidden */
export const HistoryManagerService: ViewServiceConstructor<HistoryManager> = (function (_super: typeof ViewService): ViewServiceConstructor<HistoryManager> {
  const HistoryManagerService: ViewServiceConstructor<HistoryManager> = function <V extends View>(
      this: HistoryManagerService<V>, view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, HistoryManager>): HistoryManagerService<V> {
    let _this: HistoryManagerService<V> = function accessor(): HistoryManager | undefined {
      return _this.state;
    } as HistoryManagerService<V>;
    (_this as any).__proto__ = this;
    _this = _super.call(_this, view, serviceName, descriptor) || _this;
    return _this;
  } as unknown as ViewServiceConstructor<HistoryManager>;
  __extends(HistoryManagerService, _super);

  HistoryManagerService.prototype.mount = function (this: HistoryManagerService<View>): void {
    _super.prototype.mount.call(this);
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  };

  HistoryManagerService.prototype.unmount = function (this: HistoryManagerService<View>): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    _super.prototype.unmount.call(this);
  };

  HistoryManagerService.prototype.init = function (this: HistoryManagerService<View>): HistoryManager | undefined {
    return HistoryManager.global();
  };

  return HistoryManagerService;
}(ViewService));
ViewService.History = HistoryManagerService;

View.decorateViewService(HistoryManagerService, {serviceType: HistoryManagerService}, View.prototype, "historyManager");
