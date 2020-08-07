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

import {View} from "../View";
import {ModalManager} from "../modal/ModalManager";
import {ViewService} from "./ViewService";

/** @hidden */
export abstract class ModalManagerService<V extends View> extends ViewService<V, ModalManager> {
  mount(): void {
    super.mount();
    const state = this._state;
    if (state !== void 0) {
      state.addRootView(this._view);
    }
  }

  unmount(): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootView(this._view);
    }
    super.unmount();
  }

  init(): ModalManager | undefined {
    return ModalManager.global();
  }
}
ViewService.Modal = ModalManagerService;

ViewService({type: ModalManager})(View.prototype, "modalManager");
