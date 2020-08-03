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
import {ViewManagerObserver} from "./ViewManagerObserver";
import {DisplayManager} from "../display/DisplayManager";
import {LayoutManager} from "../layout/LayoutManager";
import {ViewportManager} from "../viewport/ViewportManager";
import {HistoryManager} from "../history/HistoryManager";
import {ModalManager} from "../modal/ModalManager";

export type ViewManagerObserverType<VM extends ViewManager> =
  VM extends {readonly viewManagerObservers: ReadonlyArray<infer VMO>} ? VMO : unknown;

export abstract class ViewManager<V extends View = View> {
  /** @hidden */
  readonly _rootViews: V[];
  /** @hidden */
  _viewManagerObservers?: ViewManagerObserverType<this>[];

  constructor() {
    this._rootViews = [];
  }

  get viewManagerObservers(): ReadonlyArray<ViewManagerObserver> {
    let viewManagerObservers = this._viewManagerObservers;
    if (viewManagerObservers === void 0) {
      viewManagerObservers = [];
      this._viewManagerObservers = viewManagerObservers;
    }
    return viewManagerObservers;
  }

  addViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    let viewManagerObservers = this._viewManagerObservers;
    let index: number;
    if (viewManagerObservers === void 0) {
      viewManagerObservers = [];
      this._viewManagerObservers = viewManagerObservers;
      index = -1;
    } else {
      index = viewManagerObservers.indexOf(viewManagerObserver);
    }
    if (index < 0) {
      this.willAddViewManagerObserver(viewManagerObserver);
      viewManagerObservers.push(viewManagerObserver);
      this.onAddViewManagerObserver(viewManagerObserver);
      this.didAddViewManagerObserver(viewManagerObserver);
    }
  }

  protected willAddViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  protected onAddViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  protected didAddViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  removeViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    const viewManagerObservers = this._viewManagerObservers;
    if (viewManagerObservers !== void 0) {
      const index = viewManagerObservers.indexOf(viewManagerObserver);
      if (index >= 0) {
        this.willRemoveViewManagerObserver(viewManagerObserver);
        viewManagerObservers.splice(index, 1);
        this.onRemoveViewManagerObserver(viewManagerObserver);
        this.didRemoveViewManagerObserver(viewManagerObserver);
      }
    }
  }

  protected willRemoveViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  protected onRemoveViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  protected didRemoveViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    // hook
  }

  protected willObserve(callback: (this: this, viewManagerObserver: ViewManagerObserverType<this>) => void): void {
    const viewManagerObservers = this._viewManagerObservers;
    if (viewManagerObservers !== void 0) {
      for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
        callback.call(this, viewManagerObservers[i]);
      }
    }
  }

  protected didObserve(callback: (this: this, viewManagerObserver: ViewManagerObserverType<this>) => void): void {
    const viewManagerObservers = this._viewManagerObservers;
    if (viewManagerObservers !== void 0) {
      for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
        callback.call(this, viewManagerObservers[i]);
      }
    }
  }

  isAttached(): boolean {
    return this._rootViews.length !== 0;
  }

  protected willAttach(): void {
    this.willObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerWillAttach !== void 0) {
        viewManagerObserver.managerWillAttach(this);
      }
    });
  }

  protected onAttach(): void {
    // hook
  }

  protected didAttach(): void {
    this.didObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerDidAttach !== void 0) {
        viewManagerObserver.managerDidAttach(this);
      }
    });
  }

  protected willDetach(): void {
    this.willObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerWillDetach !== void 0) {
        viewManagerObserver.managerWillDetach(this);
      }
    });
  }

  protected onDetach(): void {
    // hook
  }

  protected didDetach(): void {
    this.didObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerDidDetach !== void 0) {
        viewManagerObserver.managerDidDetach(this);
      }
    });
  }

  get rootViews(): ReadonlyArray<V> {
    return this._rootViews;
  }

  addRootView(rootView: V): void {
    const rootViews = this._rootViews;
    const index = rootViews.indexOf(rootView);
    if (index < 0) {
      const needsAttach = rootViews.length === 0;
      if (needsAttach) {
        this.willAttach();
      }
      this.willAddRootView(rootView);
      rootViews.push(rootView);
      if (needsAttach) {
        this.onAttach();
      }
      this.onAddRootView(rootView);
      this.didAddRootView(rootView);
      if (needsAttach) {
        this.didAttach();
      }
    }
  }

  protected willAddRootView(rootView: V): void {
    this.willObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerWillAddRootView !== void 0) {
        viewManagerObserver.managerWillAddRootView(rootView, this);
      }
    });
  }

  protected onAddRootView(rootView: V): void {
    // hook
  }

  protected didAddRootView(rootView: V): void {
    this.didObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerDidAddRootView !== void 0) {
        viewManagerObserver.managerDidAddRootView(rootView, this);
      }
    });
  }

  removeRootView(rootView: V): void {
    const rootViews = this._rootViews;
    const index = rootViews.indexOf(rootView);
    if (index >= 0) {
      const needsDetach = rootViews.length === 1;
      if (needsDetach) {
        this.willDetach();
      }
      this.willRemoveRootView(rootView);
      rootViews.splice(index, 1);
      if (needsDetach) {
        this.onDetach();
      }
      this.onRemoveRootView(rootView);
      this.didRemoveRootView(rootView);
      if (needsDetach) {
        this.didDetach();
      }
    }
  }

  protected willRemoveRootView(rootView: V): void {
    this.willObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerWillRemoveRootView !== void 0) {
        viewManagerObserver.managerWillRemoveRootView(rootView, this);
      }
    });
  }

  protected onRemoveRootView(rootView: V): void {
    // hook
  }

  protected didRemoveRootView(rootView: V): void {
    this.didObserve(function (viewManagerObserver: ViewManagerObserver): void {
      if (viewManagerObserver.managerDidRemoveRootView !== void 0) {
        viewManagerObserver.managerDidRemoveRootView(rootView, this);
      }
    });
  }

  // Forward type declarations
  /** @hidden */
  static Display: typeof DisplayManager; // defined by DisplayManager
  /** @hidden */
  static Layout: typeof LayoutManager; // defined by LayoutManager
  /** @hidden */
  static Viewport: typeof ViewportManager; // defined by ViewportManager
  /** @hidden */
  static History: typeof HistoryManager; // defined by HistoryManager
  /** @hidden */
  static Modal: typeof ModalManager; // defined by ModalManager
}
View.Manager = ViewManager;
