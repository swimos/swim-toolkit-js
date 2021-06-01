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
import {StorageManager} from "../storage/StorageManager";
import {WebStorageManager} from "../storage/WebStorageManager";
import {EphemeralStorageManager} from "../storage/EphemeralStorageManager";
import {ComponentService} from "./ComponentService";
import {ComponentManagerService} from "./ComponentManagerService";

export abstract class StorageService<C extends Component> extends ComponentManagerService<C, StorageManager<C>> {
  get(key: string): string | undefined {
    return this.manager.get(key);
  }

  set(key: string, newValue: string | undefined): string | undefined {
    return this.manager.set(key, newValue);
  }

  clear(): void {
    this.manager.clear();
  }

  override initManager(): StorageManager<C> {
    let manager: StorageManager<C> | null = WebStorageManager.local();
    if (manager === null) {
      manager = new EphemeralStorageManager();
    }
    return manager;
  }
}

ComponentService({type: StorageManager, observe: false})(Component.prototype, "storageService");
