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

import {ViewContext} from "../ViewContext";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {ViewIdiom} from "./ViewIdiom";
import {Viewport} from "./Viewport";
import {ViewportContext} from "./ViewportContext";
import {ViewportObserver} from "./ViewportObserver";

export class ViewportManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _viewContext: ViewportContext;
  /** @hidden */
  _reorientationTimer: number;

  constructor() {
    super();
    this.throttleResize = this.throttleResize.bind(this);
    this.throttleScroll = this.throttleScroll.bind(this);
    this.debounceReorientation = this.debounceReorientation.bind(this);
    this.throttleReorientation = this.throttleReorientation.bind(this);

    this._reorientationTimer = 0;
    this._viewContext = this.initViewContext();
  }

  protected initViewContext(): ViewportContext {
    return {
      updateTime: performance.now(),
      viewIdiom: "unspecified",
      viewport: this.detectViewport(),
    };
  }

  protected detectViewport(): Viewport {
    return Viewport.detect();
  }

  get viewContext(): ViewContext {
    return this._viewContext;
  }

  get viewIdiom(): ViewIdiom {
    return this._viewContext.viewIdiom;
  }

  get viewport(): Viewport {
    return this._viewContext.viewport;
  }

  setViewIdiom(newViewIdiom: ViewIdiom): void {
    const viewContext = this._viewContext;
    const oldViewIdiom = viewContext.viewIdiom;
    if (oldViewIdiom !== newViewIdiom) {
      this.willSetViewIdiom(newViewIdiom, oldViewIdiom);
      viewContext.viewIdiom = newViewIdiom;
      this.onSetViewIdiom(newViewIdiom, oldViewIdiom);
      this.didSetViewIdiom(newViewIdiom, oldViewIdiom);
    }
  }

  protected willSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    this.willObserve(function (viewportObserver: ViewportObserver): void {
      if (viewportObserver.managerWillSetViewIdiom !== void 0) {
        viewportObserver.managerWillSetViewIdiom(newViewIdiom, oldViewIdiom, this);
      }
    });
  }

  protected onSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsLayout);
    }
  }

  protected didSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    this.didObserve(function (viewportObserver: ViewportObserver): void {
      if (viewportObserver.managerDidSetViewIdiom !== void 0) {
        viewportObserver.managerDidSetViewIdiom(newViewIdiom, oldViewIdiom, this);
      }
    });
  }

  updateViewIdiom(viewport: Viewport) {
    if (viewport.width < 960 || viewport.height < 480) {
      this.setViewIdiom("mobile");
    } else {
      this.setViewIdiom("desktop");
    }
  }

  addManagerObserver: (viewportObserver: ViewportObserver) => void;

  removeManagerObserver: (viewportObserver: ViewportObserver) => void;

  protected onAttach(): void {
    super.onAttach();
    this.attachEvents();
    this.updateViewIdiom(this._viewContext.viewport);
  }

  protected onDetach(): void {
    this.detachEvents();
    super.onDetach();
  }

  protected attachEvents(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.throttleResize);
      window.addEventListener("scroll", this.throttleScroll, {passive: true});
      window.addEventListener("orientationchange", this.debounceReorientation);
    }
  }

  protected detachEvents(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.throttleResize);
      window.removeEventListener("scroll", this.throttleScroll);
      window.removeEventListener("orientationchange", this.debounceReorientation);
    }
  }

  /** @hidden */
  throttleResize(): void {
    const viewport = this.detectViewport();
    this._viewContext.viewport = viewport;
    this.updateViewIdiom(viewport);

    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsResize | View.NeedsLayout);
    }
  }

  /** @hidden */
  throttleScroll(): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsScroll);
    }
  }

  /** @hidden */
  protected debounceReorientation(): void {
    if (this._reorientationTimer !== 0) {
      clearTimeout(this._reorientationTimer);
      this._reorientationTimer = 0;
    }
    this._reorientationTimer = setTimeout(this.throttleReorientation, ViewportManager.ReorientationDelay) as any;
  }

  /** @hidden */
  protected throttleReorientation(): void {
    if (this._reorientationTimer !== 0) {
      clearTimeout(this._reorientationTimer);
      this._reorientationTimer = 0;
    }
    this.throttleResize();
  }

  /** @hidden */
  static ReorientationDelay: number = 500;

  private static _global?: ViewportManager;
  static global(): ViewportManager {
    if (ViewportManager._global === void 0) {
      ViewportManager._global = new ViewportManager();
    }
    return ViewportManager._global;
  }
}
ViewManager.Viewport = ViewportManager;
