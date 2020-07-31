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
import {ViewManagerObserver} from "../manager/ViewManagerObserver";
import {HistoryState} from "./HistoryState";
import {HistoryManager} from "./HistoryManager";

export interface HistoryObserver<V extends View = View, M extends HistoryManager<V> = HistoryManager<V>> extends ViewManagerObserver<V, M> {
  historyWillPushState?(state: HistoryState, manager: M): void;

  historyDidPushState?(state: HistoryState, manager: M): void;

  historyWillReplaceState?(state: HistoryState, manager: M): void;

  historyDidReplaceState?(state: HistoryState, manager: M): void;

  historyWillPopState?(state: HistoryState, manager: M): void | boolean;

  historyDidPopState?(state: HistoryState, manager: M): void;
}
