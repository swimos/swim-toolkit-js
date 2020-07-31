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

import {ViewFlags, View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {UpdateContext} from "./UpdateContext";
import {UpdateObserver} from "./UpdateObserver";

export class UpdateManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  _processTimer: number;
  /** @hidden */
  _displayFrame: number;
  /** @hidden */
  _updateDelay: number;

  constructor() {
    super();
    this.runProcessPass = this.runProcessPass.bind(this);
    this.runDisplayPass = this.runDisplayPass.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    this._processTimer = 0;
    this._displayFrame = 0;
    this._updateDelay = UpdateManager.MinUpdateDelay;
  }

  protected onPower(): void {
    this.powerRootViews();
  }

  protected powerRootViews(): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      const rootView = rootViews[i];
      if (!rootView.isPowered()) {
        this.powerRootView(rootView);
      }
    }
  }

  protected powerRootView(rootView: V): void {
    rootView.cascadePower();
    rootView.requireUpdate(View.NeedsResize | View.NeedsScroll);
  }

  protected onUnpower(): void {
    this.cancelUpdate();
    this._updateDelay = UpdateManager.MinUpdateDelay;
    this.unpowerRootViews();
  }

  protected unpowerRootViews(): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      const rootView = rootViews[i];
      if (rootView.isPowered()) {
        this.unpowerRootView(rootView);
      }
    }
  }

  protected unpowerRootView(rootView: V): void {
    rootView.cascadeUnpower();
  }

  requestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    if (immediate && this._updateDelay <= UpdateManager.MaxProcessInterval) {
      this.runImmediatePass();
    } else {
      this.scheduleUpdate();
    }
  }

  /** @hidden */
  protected scheduleUpdate(): void {
    let viewFlags = 0;
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      viewFlags |= rootViews[i].viewFlags;
    }

    if (this._displayFrame === 0 && this._processTimer === 0
        && (viewFlags & (View.ProcessingFlag | View.DisplayingFlag)) === 0
        && (viewFlags & View.UpdateMask) !== 0) {
      this._processTimer = setTimeout(this.runProcessPass, this._updateDelay) as any;
    }
  }

  /** @hidden */
  protected cancelUpdate(): void {
    if (this._processTimer !== 0) {
      clearTimeout(this._processTimer);
      this._processTimer = 0;
    }
    if (this._displayFrame !== 0) {
      cancelAnimationFrame(this._displayFrame);
      this._displayFrame = 0;
    }
  }

  protected runImmediatePass(): void {
    let viewFlags = 0;
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      viewFlags |= rootViews[i].viewFlags;
    }
    if ((viewFlags & View.ProcessMask) !== 0) {
      this.cancelUpdate();
      this.runProcessPass(true);
    }
    if ((viewFlags & View.DisplayMask) !== 0 &&
        this._updateDelay <= UpdateManager.MaxProcessInterval) {
      this.cancelUpdate();
      this.runDisplayPass(void 0, true);
    }
  }

  /** @hidden */
  runProcessPass(immediate: boolean = false): void {
    const rootViews = this._rootViews;
    const rootViewCount = rootViews.length;
    if (immediate) {
      for (let i = 0; i < rootViewCount; i += 1) {
        const rootView = rootViews[i];
        rootView.setViewFlags(rootView.viewFlags | View.ImmediateFlag);
      }
    }

    const t0 = performance.now();
    for (let i = 0; i < rootViewCount; i += 1) {
      const rootView = rootViews[i];
      const viewContext = rootView.viewContext as UpdateContext;
      viewContext.updateTime = t0;
      rootView.cascadeProcess(0, viewContext);
    }

    const t1 = performance.now();
    let processDelay = Math.max(UpdateManager.MinProcessInterval, this._updateDelay);
    if (t1 - t0 > processDelay) {
      this._updateDelay = Math.min(Math.max(2, this._updateDelay << 1), UpdateManager.MaxUpdateDelay);
    } else {
      this._updateDelay = Math.min(UpdateManager.MinUpdateDelay, this._updateDelay >>> 1);
    }

    this.cancelUpdate();
    let viewFlags = 0;
    for (let i = 0; i < rootViewCount; i += 1) {
      viewFlags |= rootViews[i].viewFlags;
    }
    if ((viewFlags & View.DisplayMask) !== 0) {
      this._displayFrame = requestAnimationFrame(this.runDisplayPass);
    } else if ((viewFlags & View.ProcessMask) !== 0) {
      if ((viewFlags & View.ImmediateFlag) !== 0) {
        processDelay = Math.max(UpdateManager.MaxProcessInterval, processDelay);
      }
      this._processTimer = setTimeout(this.runProcessPass, processDelay) as any;
    }

    if (!immediate) {
      for (let i = 0; i < rootViewCount; i += 1) {
        const rootView = rootViews[i];
        rootView.setViewFlags(rootView.viewFlags & ~View.ImmediateFlag);
      }
    }
  }

  /** @hidden */
  runDisplayPass(time?: number, immediate: boolean = false): void {
    const rootViews = this._rootViews;
    const rootViewCount = rootViews.length;
    if (immediate) {
      for (let i = 0; i < rootViewCount; i += 1) {
        const rootView = rootViews[i];
        rootView.setViewFlags(rootView.viewFlags | View.ImmediateFlag);
      }
    }

    for (let i = 0; i < rootViewCount; i += 1) {
      const rootView = rootViews[i];
      const viewContext = rootView.viewContext as UpdateContext;
      rootView.cascadeDisplay(0, viewContext);
    }

    this.cancelUpdate();
    let viewFlags = 0;
    for (let i = 0; i < rootViewCount; i += 1) {
      viewFlags |= rootViews[i].viewFlags;
    }
    if ((viewFlags & View.ProcessMask) !== 0) {
      let processDelay = this._updateDelay;
      if ((viewFlags & View.ImmediateFlag) !== 0) {
        processDelay = Math.max(UpdateManager.MaxProcessInterval, processDelay);
      }
      this._processTimer = setTimeout(this.runProcessPass, processDelay) as any;
    } else if ((viewFlags & View.DisplayMask) !== 0) {
      this._displayFrame = requestAnimationFrame(this.runDisplayPass);
    }

    if (!immediate) {
      for (let i = 0; i < rootViewCount; i += 1) {
        const rootView = rootViews[i];
        rootView.setViewFlags(rootView.viewFlags & ~View.ImmediateFlag);
      }
    }
  }

  addManagerObserver: (updateObserver: UpdateObserver) => void;

  removeManagerObserver: (updateObserver: UpdateObserver) => void;

  protected onAttach(): void {
    super.onAttach();
    this.attachEvents();
  }

  protected onDetach(): void {
    this.detachEvents();
    super.onDetach();
  }

  protected attachEvents(): void {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.onVisibilityChange);
    }
  }

  protected detachEvents(): void {
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }
  }

  /** @hidden */
  protected onVisibilityChange(): void {
    if (document.visibilityState === "visible") {
      this.onPower();
    } else {
      this.onUnpower();
    }
  }

  /** @hidden */
  static MinUpdateDelay: number = 0;
  /** @hidden */
  static MaxUpdateDelay: number = 167;
  /** @hidden */
  static MinProcessInterval: number = 12;
  /** @hidden */
  static MaxProcessInterval: number = 33;

  private static _global?: UpdateManager;
  static global(): UpdateManager {
    if (UpdateManager._global === void 0) {
      UpdateManager._global = new UpdateManager();
    }
    return UpdateManager._global;
  }
}
ViewManager.Update = UpdateManager;
