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

import {Lazy} from "@swim/util";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import type {ViewManagerObserverType} from "../manager/ViewManagerObserver";
import type {ViewIdiom} from "./ViewIdiom";
import {Viewport} from "./Viewport";
import type {ViewportContext} from "./ViewportContext";
import type {ViewportManagerObserver} from "./ViewportManagerObserver";

export class ViewportManager<V extends View = View> extends ViewManager<V> {
  constructor() {
    super();
    Object.defineProperty(this, "viewContext", {
      value: this.initViewContext(),
      enumerable: true,
      configurable: true,
    });
    this.reorientationTimer = 0;

    this.throttleScroll = this.throttleScroll.bind(this);
    this.throttleResize = this.throttleResize.bind(this);
    this.debounceReorientation = this.debounceReorientation.bind(this);
    this.throttleReorientation = this.throttleReorientation.bind(this);
  }

  declare readonly viewContext: ViewportContext;

  protected initViewContext(): ViewportContext {
    return {
      updateTime: 0,
      viewIdiom: "unspecified",
      viewport: this.detectViewport(),
    };
  }

  get viewport(): Viewport {
    return this.viewContext.viewport;
  }

  get viewIdiom(): ViewIdiom {
    return this.viewContext.viewIdiom;
  }

  /** @hidden */
  detectViewport(): Viewport {
    return Viewport.detect();
  }

  /** @hidden */
  detectViewIdiom(viewport: Viewport): ViewIdiom | undefined {
    if (viewport.width < 960 || viewport.height < 480) {
      return "mobile";
    } else {
      return "desktop";
    }
  }

  /** @hidden */
  updateViewIdiom(viewport: Viewport): void {
    let viewIdiom: ViewIdiom | undefined;
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.detectViewIdiom !== void 0) {
        viewIdiom = viewManagerObserver.detectViewIdiom(viewport, this) as ViewIdiom | undefined;
        if (viewIdiom !== void 0) {
          break;
        }
      }
    }
    if (viewIdiom === void 0) {
      viewIdiom = this.detectViewIdiom(viewport);
    }
    if (viewIdiom !== void 0) {
      this.setViewIdiom(viewIdiom);
    }
  }

  setViewIdiom(newViewIdiom: ViewIdiom): void {
    const viewContext = this.viewContext;
    const oldViewIdiom = viewContext.viewIdiom;
    if (oldViewIdiom !== newViewIdiom) {
      this.willSetViewIdiom(newViewIdiom, oldViewIdiom);
      viewContext.viewIdiom = newViewIdiom;
      this.onSetViewIdiom(newViewIdiom, oldViewIdiom);
      this.didSetViewIdiom(newViewIdiom, oldViewIdiom);
    }
  }

  protected willSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.viewportManagerWillSetViewIdiom !== void 0) {
        viewManagerObserver.viewportManagerWillSetViewIdiom(newViewIdiom, oldViewIdiom, this);
      }
    }
  }

  protected onSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i]!.requireUpdate(View.NeedsLayout);
    }
  }

  protected didSetViewIdiom(newViewIdiom: ViewIdiom, oldViewIdiom: ViewIdiom): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.viewportManagerDidSetViewIdiom !== void 0) {
        viewManagerObserver.viewportManagerDidSetViewIdiom(newViewIdiom, oldViewIdiom, this);
      }
    }
  }

  protected willReorient(orientation: OrientationType): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.viewportManagerWillReorient !== void 0) {
        viewManagerObserver.viewportManagerWillReorient(orientation, this);
      }
    }
  }

  protected onReorient(orientation: OrientationType): void {
    // hook
  }

  protected didReorient(orientation: OrientationType): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.viewportManagerDidReorient !== void 0) {
        viewManagerObserver.viewportManagerDidReorient(orientation, this);
      }
    }
  }

  declare readonly viewManagerObservers: ReadonlyArray<ViewportManagerObserver>;

  protected onAddViewManagerObserver(viewManagerObserver: ViewManagerObserverType<this>): void {
    super.onAddViewManagerObserver(viewManagerObserver);
    if (this.isAttached()) {
      this.updateViewIdiom(this.viewport);
    }
  }

  protected onAttach(): void {
    super.onAttach();
    this.attachEvents();
    this.updateViewIdiom(this.viewport);
  }

  protected onDetach(): void {
    this.detachEvents();
    super.onDetach();
  }

  protected attachEvents(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", this.throttleScroll, {passive: true});
      window.addEventListener("resize", this.throttleResize);
      window.addEventListener("orientationchange", this.debounceReorientation);
    }
  }

  protected detachEvents(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.throttleScroll);
      window.removeEventListener("resize", this.throttleResize);
      window.removeEventListener("orientationchange", this.debounceReorientation);
    }
  }

  /** @hidden */
  throttleScroll(): void {
    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i]!.requireUpdate(View.NeedsScroll);
    }
  }

  /** @hidden */
  throttleResize(): void {
    const viewport = this.detectViewport();
    this.viewContext.viewport = viewport;
    this.updateViewIdiom(viewport);

    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i]!.requireUpdate(View.NeedsResize | View.NeedsLayout);
    }
  }

  /** @hidden */
  reorientationTimer: number;

  /** @hidden */
  protected debounceReorientation(): void {
    if (this.reorientationTimer !== 0) {
      clearTimeout(this.reorientationTimer);
      this.reorientationTimer = 0;
    }
    this.reorientationTimer = setTimeout(this.throttleReorientation, ViewportManager.ReorientationDelay) as any;
  }

  /** @hidden */
  protected throttleReorientation(): void {
    if (this.reorientationTimer !== 0) {
      clearTimeout(this.reorientationTimer);
      this.reorientationTimer = 0;
    }

    const viewport = this.detectViewport();
    this.viewContext.viewport = viewport;
    this.willReorient(viewport.orientation);
    this.updateViewIdiom(viewport);
    this.onReorient(viewport.orientation);
    this.didReorient(viewport.orientation);

    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i]!.requireUpdate(View.NeedsResize | View.NeedsScroll | View.NeedsLayout);
    }
  }

  /** @hidden */
  static ReorientationDelay: number = 100;

  @Lazy
  static global<V extends View>(): ViewportManager<V> {
    return new ViewportManager();
  }
}
