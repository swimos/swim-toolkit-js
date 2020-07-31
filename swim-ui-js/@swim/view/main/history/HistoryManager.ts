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

import {Uri, UriQuery, UriFragment} from "@swim/uri";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {HistoryState} from "./HistoryState";
import {HistoryObserver} from "./HistoryObserver";

export class HistoryManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _state: {[key: string]: string | null | undefined};

  constructor() {
    super();
    this.popState = this.popState.bind(this);
    this._state = {};
    this.initState();
  }

  protected initState(): void {
    this.updateStateUrl(window.location.href);
  }

  get state(): HistoryState {
    return this._state;
  }

  get stateUrl(): string | undefined {
    const state = this._state;
    const builder = UriQuery.builder();
    for (const key in state) {
      const value = state[key];
      if (typeof value === "string") {
        builder.add(key, value);
      } else if (value === null) {
        builder.add(null, key);
      }
    }
    return Uri.fragment(UriFragment.from(builder.bind().toString())).toString();
  }

  protected clearState(): void {
    const state = this._state;
    for (const key in state) {
      delete state[key];
    }
  }

  protected updateStateUrl(stateUrl: string): void {
    try {
      const uri = Uri.parse(stateUrl);
      const fragment = uri.fragmentIdentifier();
      if (fragment !== null) {
        this.updateStateUrlFragment(fragment);
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected updateStateUrlFragment(fragment: string): void {
    const state = this._state;
    let query = UriQuery.parse(fragment);
    while (!query.isEmpty()) {
      const key = query.key();
      const value = query.value();
      if (key !== null) {
        state[key] = value;
      } else {
        state[value] = null;
      }
      query = query.tail();
    }
  }

  updateState(deltaState: HistoryState): HistoryState {
    const state = this._state;
    for (const key in deltaState) {
      const value = deltaState[key];
      if (value !== void 0) {
        state[key] = value;
      } else {
        delete state[key];
      }
    }
    return state;
  }

  setState(newState: HistoryState): void {
    this.clearState();
    this.updateStateUrl(document.location.href);
    this.updateState(newState);
  }

  pushState(deltaState: HistoryState): void {
    const state = this.updateState(deltaState);
    const url = this.stateUrl;
    this.willPushState(state);
    window.history.pushState(state, "", url);
    this.onPushState(state);
    this.didPushState(state);
  }

  protected willPushState(state: HistoryState): void {
    this.willObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyWillPushState !== void 0) {
        historyObserver.historyWillPushState(state, this);
      }
    });
  }

  protected onPushState(state: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsCompute);
    }
  }

  protected didPushState(state: HistoryState): void {
    this.didObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyDidPushState !== void 0) {
        historyObserver.historyDidPushState(state, this);
      }
    });
  }

  replaceState(deltaState: HistoryState): void {
    const state = this.updateState(deltaState);
    const url = this.stateUrl;
    this.willReplaceState(state);
    window.history.replaceState(state, "", url);
    this.onReplaceState(state);
    this.didReplaceState(state);
  }

  protected willReplaceState(state: HistoryState): void {
    this.willObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyWillReplaceState !== void 0) {
        historyObserver.historyWillReplaceState(state, this);
      }
    });
  }

  protected onReplaceState(state: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsCompute);
    }
  }

  protected didReplaceState(state: HistoryState): void {
    this.didObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyDidReplaceState !== void 0) {
        historyObserver.historyDidReplaceState(state, this);
      }
    });
  }

  /** @hidden */
  popState(event: PopStateEvent): void {
    const state = this._state;
    this.willPopState(state);
    this.setState(event.state);
    this.onPopState(state);
    this.didPopState(state);
  }

  protected willPopState(state: HistoryState): void {
    this.willObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyWillPopState !== void 0) {
        historyObserver.historyWillPopState(state, this);
      }
    });
  }

  protected onPopState(state: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsCompute);
    }
  }

  protected didPopState(state: HistoryState): void {
    this.didObserve(function (historyObserver: HistoryObserver): void {
      if (historyObserver.historyDidPopState !== void 0) {
        historyObserver.historyDidPopState(state, this);
      }
    });
  }

  addManagerObserver: (historyObserver: HistoryObserver) => void;

  removeManagerObserver: (historyObserver: HistoryObserver) => void;

  protected onAttach(): void {
    super.onAttach();
    this.attachEvents();
  }

  protected onDetach(): void {
    this.detachEvents();
    super.onDetach();
  }

  protected attachEvents(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", this.popState);
    }
  }

  protected detachEvents(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.popState);
    }
  }

  private static _global?: HistoryManager;
  static global(): HistoryManager {
    if (HistoryManager._global === void 0) {
      HistoryManager._global = new HistoryManager();
    }
    return HistoryManager._global;
  }
}
ViewManager.History = HistoryManager;
