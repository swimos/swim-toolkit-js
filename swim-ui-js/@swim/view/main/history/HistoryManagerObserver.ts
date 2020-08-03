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

export interface HistoryManagerObserver<V extends View = View, VM extends HistoryManager<V> = HistoryManager<V>> extends ViewManagerObserver<V, VM> {
  viewManagerWillPushHistory?(historyState: HistoryState, viewManager: VM): void;

  viewManagerDidPushHistory?(historyState: HistoryState, viewManager: VM): void;

  viewManagerWillReplaceHistory?(historyState: HistoryState, viewManager: VM): void;

  viewManagerDidReplaceHistory?(historyState: HistoryState, viewManager: VM): void;

  viewManagerWillPopHistory?(historyState: HistoryState, viewManager: VM): void | boolean;

  viewManagerDidPopHistory?(historyState: HistoryState, viewManager: VM): void;
}
