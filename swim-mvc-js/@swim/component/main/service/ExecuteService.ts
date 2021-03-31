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
import {ComponentService} from "./ComponentService";
import {ComponentManagerService} from "./ComponentManagerService";

export abstract class ExecuteService<C extends Component> extends ComponentManagerService<C, ExecuteManager<C>> {
  initManager(): ExecuteManager<C> {
    return ExecuteManager.global();
  }
}

ComponentService({type: ExecuteManager, observe: false})(Component.prototype, "executeService");
