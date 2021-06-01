// Copyright 2015-2021 Swim inc.
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

import type {Component} from "../Component";
import type {ComponentManagerObserver} from "../manager/ComponentManagerObserver";
import type {StorageManager} from "./StorageManager";

export interface StorageManagerObserver<C extends Component = Component, CM extends StorageManager<C> = StorageManager<C>> extends ComponentManagerObserver<C, CM> {
  storageManagerWillSet?(key: string, newValue: string | undefined, oldValue: string | undefined, storageManager: CM): void;

  storageManagerDidSet?(key: string, newValue: string | undefined, oldValue: string | undefined, storageManager: CM): void;

  storageManagerWillClear?(storageManager: CM): void;

  storageManagerDidClear?(storageManager: CM): void;
}
