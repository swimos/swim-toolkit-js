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

import {Component} from "../Component";
import {ExecuteManager} from "../execute/ExecuteManager";
import {ExecuteManagerObserver} from "../execute/ExecuteManagerObserver";
import {ComponentService} from "./ComponentService";

/** @hidden */
export abstract class ExecuteManagerService<C extends Component> extends ComponentService<C, ExecuteManager> {
  /** @hidden */
  readonly observer?: boolean;

  mount(): void {
    super.mount();
    const state = this._state;
    if (state !== void 0) {
      state.insertRootComponent(this._component);
      if (this.observer === true) {
        state.addComponentManagerObserver(this as ExecuteManagerObserver<C>);
      }
    }
  }

  unmount(): void {
    const state = this._state;
    if (state !== void 0) {
      if (this.observer === true) {
        state.removeComponentManagerObserver(this as ExecuteManagerObserver<C>);
      }
      state.removeRootComponent(this._component);
    }
    super.unmount();
  }

  init(): ExecuteManager | undefined {
    return ExecuteManager.global();
  }
}
ComponentService.Execute = ExecuteManagerService;

ComponentService({type: ExecuteManager})(Component.prototype, "executeManager");
