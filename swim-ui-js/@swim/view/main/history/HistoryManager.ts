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
import {HistoryManagerObserver} from "./HistoryManagerObserver";

export class HistoryManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _historyState: {
    fragment: string | undefined;
    readonly permanent: {[key: string]: string | undefined};
    readonly ephemeral: {[key: string]: string | undefined};
  };

  constructor() {
    super();
    this.popHistory = this.popHistory.bind(this);
    this._historyState = {
      fragment: void 0,
      permanent: {},
      ephemeral: {},
    };
    this.initHistory();
  }

  protected initHistory(): void {
    this.updateHistoryUrl(window.location.href);
  }

  get historyState(): HistoryState {
    return this._historyState;
  }

  get historyUrl(): string | undefined {
    const historyState = this._historyState;
    const queryBuilder = UriQuery.builder();
    if (historyState.fragment !== void 0) {
      queryBuilder.add(null, historyState.fragment);
    }
    for (const key in historyState.permanent) {
      const value = historyState.permanent[key]!;
      queryBuilder.add(key, value);
    }
    return Uri.fragment(UriFragment.from(queryBuilder.bind().toString())).toString();
  }

  protected updateHistoryUrl(historyUrl: string): void {
    try {
      const uri = Uri.parse(historyUrl);
      const fragment = uri.fragmentIdentifier();
      if (fragment !== null) {
        this.updateHistoryUrlFragment(fragment);
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected updateHistoryUrlFragment(fragment: string): void {
    const historyState = this._historyState;
    let query = UriQuery.parse(fragment);
    while (!query.isEmpty()) {
      const key = query.key();
      const value = query.value();
      if (key !== null) {
        historyState.permanent[key] = value;
      } else {
        historyState.fragment = value;
      }
      query = query.tail();
    }
  }

  protected clearHistoryState(): void {
    const historyState = this._historyState;
    for (const key in historyState.permanent) {
      delete historyState.permanent[key];
    }
    for (const key in historyState.ephemeral) {
      delete historyState.ephemeral[key];
    }
  }

  updateHistoryState(deltaState: HistoryState): HistoryState {
    const historyState = this._historyState;
    if ("fragment" in deltaState) {
      historyState.fragment = deltaState.fragment;
    }
    for (const key in deltaState.permanent) {
      const value = deltaState.permanent[key];
      if (value !== void 0) {
        historyState.permanent[key] = value;
      } else {
        delete historyState.permanent[key];
      }
    }
    for (const key in deltaState.ephemeral) {
      const value = deltaState.ephemeral[key];
      if (value !== void 0) {
        historyState.ephemeral[key] = value;
      } else {
        delete historyState.ephemeral[key];
      }
    }
    return historyState;
  }

  setHistoryState(newState: HistoryState): void {
    this.clearHistoryState();
    this.updateHistoryUrl(document.location.href);
    this.updateHistoryState(newState);
  }

  pushHistory(deltaState: HistoryState): void {
    const historyState = this.updateHistoryState(deltaState);
    const historyUrl = this.historyUrl;
    this.willPushHistory(historyState);
    window.history.pushState(historyState, "", historyUrl);
    this.onPushHistory(historyState);
    this.didPushHistory(historyState);
  }

  protected willPushHistory(historyState: HistoryState): void {
    this.willObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerWillPushHistory !== void 0) {
        viewManagerObserver.viewManagerWillPushHistory(historyState, this);
      }
    });
  }

  protected onPushHistory(historyState: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsChange);
    }
  }

  protected didPushHistory(historyState: HistoryState): void {
    this.didObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerDidPushHistory !== void 0) {
        viewManagerObserver.viewManagerDidPushHistory(historyState, this);
      }
    });
  }

  replaceHistory(deltaState: HistoryState): void {
    const historyState = this.updateHistoryState(deltaState);
    const historyUrl = this.historyUrl;
    this.willReplaceHistory(historyState);
    window.history.replaceState(historyState, "", historyUrl);
    this.onReplaceHistory(historyState);
    this.didReplaceHistory(historyState);
  }

  protected willReplaceHistory(historyState: HistoryState): void {
    this.willObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerWillReplaceHistory !== void 0) {
        viewManagerObserver.viewManagerWillReplaceHistory(historyState, this);
      }
    });
  }

  protected onReplaceHistory(historyState: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsChange);
    }
  }

  protected didReplaceHistory(historyState: HistoryState): void {
    this.didObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerDidReplaceHistory !== void 0) {
        viewManagerObserver.viewManagerDidReplaceHistory(historyState, this);
      }
    });
  }

  /** @hidden */
  popHistory(event: PopStateEvent): void {
    const historyState = this._historyState;
    this.willPopHistory(historyState);
    this.setHistoryState(event.state);
    this.onPopHistory(historyState);
    this.didPopHistory(historyState);
  }

  protected willPopHistory(historyState: HistoryState): void {
    this.willObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerWillPopHistory !== void 0) {
        viewManagerObserver.viewManagerWillPopHistory(historyState, this);
      }
    });
  }

  protected onPopHistory(historyState: HistoryState): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsChange);
    }
  }

  protected didPopHistory(historyState: HistoryState): void {
    this.didObserve(function (viewManagerObserver: HistoryManagerObserver): void {
      if (viewManagerObserver.viewManagerDidPopHistory !== void 0) {
        viewManagerObserver.viewManagerDidPopHistory(historyState, this);
      }
    });
  }

  readonly viewManagerObservers: ReadonlyArray<HistoryManagerObserver>;

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
      window.addEventListener("popstate", this.popHistory);
    }
  }

  protected detachEvents(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.popHistory);
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
