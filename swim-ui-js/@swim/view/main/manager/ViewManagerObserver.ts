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
import {ViewManager} from "./ViewManager";

export interface ViewManagerObserver<V extends View = View, M extends ViewManager<V> = ViewManager<V>> {
  managerWillAttach?(manager: M): void;

  managerDidAttach?(manager: M): void;

  managerWillDetach?(manager: M): void;

  managerDidDetach?(manager: M): void;

  managerWillAddRootView?(rootView: V, manager: M): void;

  managerDidAddRootView?(rootView: V, manager: M): void;

  managerWillRemoveRootView?(rootView: V, manager: M): void;

  managerDidRemoveRootView?(rootView: V, manager: M): void;
}
