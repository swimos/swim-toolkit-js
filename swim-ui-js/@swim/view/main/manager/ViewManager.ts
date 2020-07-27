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
import {UpdateManager} from "../update/UpdateManager";
import {LayoutManager} from "../layout/LayoutManager";
import {ViewportManager} from "../viewport/ViewportManager";
import {ModalManager} from "../modal/ModalManager";

export abstract class ViewManager<V extends View = View> {
  /** @hidden */
  readonly _rootViews: V[];
  /** @hidden */
  _managerObservers?: ViewManagerObserver[];

  constructor() {
    this._rootViews = [];
  }

  isAttached(): boolean {
    return this._rootViews.length !== 0;
  }

  protected willAttach(): void {
    this.willObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerWillAttach !== void 0) {
        managerObserver.managerWillAttach(this);
      }
    });
  }

  protected onAttach(): void {
    // hook
  }

  protected didAttach(): void {
    this.didObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerDidAttach !== void 0) {
        managerObserver.managerDidAttach(this);
      }
    });
  }

  protected willDetach(): void {
    this.willObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerWillDetach !== void 0) {
        managerObserver.managerWillDetach(this);
      }
    });
  }

  protected onDetach(): void {
    // hook
  }

  protected didDetach(): void {
    this.didObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerDidDetach !== void 0) {
        managerObserver.managerDidDetach(this);
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
    this.willObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerWillAddRootView !== void 0) {
        managerObserver.managerWillAddRootView(rootView, this);
      }
    });
  }

  protected onAddRootView(rootView: V): void {
    // hook
  }

  protected didAddRootView(rootView: V): void {
    this.didObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerDidAddRootView !== void 0) {
        managerObserver.managerDidAddRootView(rootView, this);
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
    this.willObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerWillRemoveRootView !== void 0) {
        managerObserver.managerWillRemoveRootView(rootView, this);
      }
    });
  }

  protected onRemoveRootView(rootView: V): void {
    // hook
  }

  protected didRemoveRootView(rootView: V): void {
    this.didObserve(function (managerObserver: ViewManagerObserver): void {
      if (managerObserver.managerDidRemoveRootView !== void 0) {
        managerObserver.managerDidRemoveRootView(rootView, this);
      }
    });
  }

  get managerObservers(): ReadonlyArray<ViewManagerObserver> {
    let managerObservers = this._managerObservers;
    if (managerObservers === void 0) {
      managerObservers = [];
      this._managerObservers = managerObservers;
    }
    return managerObservers;
  }

  addManagerObserver(managerObserver: ViewManagerObserver): void {
    let managerObservers = this._managerObservers;
    let index: number;
    if (managerObservers === void 0) {
      managerObservers = [];
      this._managerObservers = managerObservers;
      index = -1;
    } else {
      index = managerObservers.indexOf(managerObserver);
    }
    if (index < 0) {
      this.willAddManagerObserver(managerObserver);
      managerObservers.push(managerObserver);
      this.onAddManagerObserver(managerObserver);
      this.didAddManagerObserver(managerObserver);
    }
  }

  protected willAddManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  protected onAddManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  protected didAddManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  removeManagerObserver(managerObserver: ViewManagerObserver): void {
    const managerObservers = this._managerObservers;
    if (managerObservers !== void 0) {
      const index = managerObservers.indexOf(managerObserver);
      if (index >= 0) {
        this.willRemoveManagerObserver(managerObserver);
        managerObservers.splice(index, 1);
        this.onRemoveManagerObserver(managerObserver);
        this.didRemoveManagerObserver(managerObserver);
      }
    }
  }

  protected willRemoveManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  protected onRemoveManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  protected didRemoveManagerObserver(managerObserver: ViewManagerObserver): void {
    // hook
  }

  protected willObserve(callback: (this: this, managerObserver: ViewManagerObserver) => void): void {
    const managerObservers = this._managerObservers;
    if (managerObservers !== void 0) {
      for (let i = 0, n = managerObservers.length; i < n; i += 1) {
        callback.call(this, managerObservers[i]);
      }
    }
  }

  protected didObserve(callback: (this: this, managerObserver: ViewManagerObserver) => void): void {
    const managerObservers = this._managerObservers;
    if (managerObservers !== void 0) {
      for (let i = 0, n = managerObservers.length; i < n; i += 1) {
        callback.call(this, managerObservers[i]);
      }
    }
  }

  // Forward type declarations
  /** @hidden */
  static Update: typeof UpdateManager; // defined by UpdateManager
  /** @hidden */
  static Layout: typeof LayoutManager; // defined by LayoutManager
  /** @hidden */
  static Viewport: typeof ViewportManager; // defined by ViewportManager
  /** @hidden */
  static Modal: typeof ModalManager; // defined by ModalManager
}
View.Manager = ViewManager;
