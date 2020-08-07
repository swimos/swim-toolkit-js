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

import {Model} from "../Model";
import {RefreshManager} from "../refresh/RefreshManager";
import {ModelService} from "./ModelService";

/** @hidden */
export abstract class RefreshManagerService<M extends Model> extends ModelService<M, RefreshManager> {
  mount(): void {
    super.mount();
    const state = this._state;
    if (state !== void 0) {
      state.addRootModel(this._model);
    }
  }

  unmount(): void {
    const state = this._state;
    if (state !== void 0) {
      state.removeRootModel(this._model);
    }
    super.unmount();
  }

  init(): RefreshManager | undefined {
    return RefreshManager.global();
  }
}
ModelService.Refresh = RefreshManagerService;

ModelService({type: RefreshManager})(Model.prototype, "refreshManager");
