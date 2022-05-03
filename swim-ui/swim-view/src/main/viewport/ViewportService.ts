// Copyright 2015-2022 Swim.inc
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

import type {Mutable, Class} from "@swim/util";
import {Affinity, FastenerClass, Property, EventHandler, EventTimer, Service} from "@swim/component";
import {Length} from "@swim/math";
import type {ViewIdiom} from "../view/ViewIdiom";
import {ViewInsets} from "../view/ViewInsets";
import {LayoutViewport} from "./LayoutViewport";
import {VisualViewport} from "./VisualViewport";
import type {ViewportOrientation} from "./ViewportOrientation";
import type {ViewportColorScheme} from "./ViewportColorScheme";
import type {ViewportServiceObserver} from "./ViewportServiceObserver";

/** @public */
export class ViewportService extends Service {
  override readonly observerType?: Class<ViewportServiceObserver>;

  @Property<ViewportService["layoutViewport"]>({
    valueType: LayoutViewport,
    initValue(): LayoutViewport {
      return this.detect();
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const layoutViewport = this.detect();
        this.setValue(layoutViewport, Affinity.Intrinsic);
      }
    },
    detect(): LayoutViewport {
      //const documentWidth = document.documentElement.style.width;
      //const documentHeight = document.documentElement.style.height;
      //document.documentElement.style.width = "100%";
      //document.documentElement.style.height = "100%";
      //const div = document.createElement("div");
      //div.style.setProperty("position", "fixed");
      //div.style.setProperty("top", "0");
      //div.style.setProperty("right", "0");
      //div.style.setProperty("width", window.innerWidth === document.documentElement.offsetWidth ? "100%" : "100vw");
      //div.style.setProperty("height", window.innerHeight === document.documentElement.offsetHeight ? "100%" : "100vh");
      //div.style.setProperty("box-sizing", "border-box");
      //div.style.setProperty("overflow", "hidden");
      //div.style.setProperty("visibility", "hidden");
      //document.body.appendChild(div);
      //const style = window.getComputedStyle(div);
      //const width = document.documentElement.clientWidth;
      //const height = document.documentElement.clientHeight;
      //const pageLeft = window.pageXOffset;
      //const pageTop = window.pageYOffset;
      //document.body.removeChild(div);
      //document.documentElement.style.width = documentWidth;
      //document.documentElement.style.height = documentHeight;
      //return {width, height, pageLeft, pageTop};
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        pageLeft: window.pageXOffset,
        pageTop: window.pageYOffset,
      };
    },
    didSetValue(newLayoutViewport: LayoutViewport, oldLayoutViewport: LayoutViewport): void {
      if (newLayoutViewport.width !== oldLayoutViewport.width || newLayoutViewport.height !== oldLayoutViewport.height) {
        this.owner.callObservers("serviceDidResizeLayoutViewport", newLayoutViewport, this.owner);
        this.owner.viewIdiom.update();
      } else {
        this.owner.callObservers("serviceDidScrollLayoutViewport", newLayoutViewport, this.owner);
      }
    },
    equalValues: LayoutViewport.equal,
  })
  readonly layoutViewport!: Property<this, LayoutViewport> & {
    update(): void,
    detect(): LayoutViewport,
  };

  @EventTimer<ViewportService["layoutViewportChange"]>({
    delay: 0,
    type: ["resize", "scroll"],
    initTarget(): EventTarget | null {
      if (typeof window !== "undefined") {
        return window;
      } else {
        return null;
      }
    },
    handle(event: Event): void {
      this.owner.layoutViewport.update();
    },
  })
  readonly layoutViewportChange!: EventTimer<this>;
  static readonly layoutViewportChange: FastenerClass<ViewportService["layoutViewportChange"]>;

  @Property<ViewportService["visualViewport"]>({
    valueType: VisualViewport,
    initValue(): VisualViewport {
      return this.detect();
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const visualViewport = this.detect();
        this.setValue(visualViewport, Affinity.Intrinsic);
      }
    },
    detect(): VisualViewport {
      let visualViewport: VisualViewport;
      if (window.visualViewport !== void 0) {
        visualViewport = {
          width: window.visualViewport.width,
          height: window.visualViewport.height,
          pageLeft: window.visualViewport.pageLeft,
          pageTop: window.visualViewport.pageTop,
          offsetLeft: window.visualViewport.offsetLeft,
          offsetTop: window.visualViewport.offsetTop,
          scale: window.visualViewport.scale,
        };
      } else {
        visualViewport = {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          pageLeft: window.pageXOffset,
          pageTop: window.pageYOffset,
          offsetLeft: 0,
          offsetTop: 0,
          scale: 1,
        };
      }
      return visualViewport;
    },
    didSetValue(visualViewport: VisualViewport): void {
      this.owner.callObservers("serviceDidResizeVisualViewport", visualViewport, this.owner);
    },
    equalValues: VisualViewport.equal,
  })
  readonly visualViewport!: Property<this, VisualViewport> & {
    update(): void,
    detect(): VisualViewport,
  };

  @EventTimer<ViewportService["visualViewportChange"]>({
    delay: 0,
    type: "resize",
    initTarget(): EventTarget | null {
      if (typeof window !== "undefined" && window.visualViewport !== void 0) {
        return window.visualViewport;
      } else {
        return null;
      }
    },
    handle(event: Event): void {
      this.owner.visualViewport.update();
    },
  })
  readonly visualViewportChange!: EventTimer<this>;
  static readonly visualViewportChange: FastenerClass<ViewportService["visualViewportChange"]>;

  @Property<ViewportService["safeArea"]>({
    valueType: ViewInsets,
    value: ViewInsets.zero,
    init(): void {
      let observer: MutationObserver | null;
      if (typeof MutationObserver !== "undefined") {
        observer = new MutationObserver(this.update.bind(this));
      } else {
        observer = null;
      }
      (this as Mutable<typeof this>).observer = observer;
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const safeArea = this.detect();
        this.setValue(safeArea, Affinity.Intrinsic);
      }
    },
    detect(): ViewInsets {
      let safeArea: ViewInsets;
      try {
        const documentStyle = document.documentElement.style;
        const insetTop = Length.parse(documentStyle.getPropertyValue("--safe-area-inset-top")).pxValue();
        const insetRight = Length.parse(documentStyle.getPropertyValue("--safe-area-inset-right")).pxValue();
        const insetBottom = Length.parse(documentStyle.getPropertyValue("--safe-area-inset-bottom")).pxValue();
        const insetLeft = Length.parse(documentStyle.getPropertyValue("--safe-area-inset-left")).pxValue();
        safeArea = {insetTop, insetRight, insetBottom, insetLeft};
      } catch (swallow) {
        safeArea = ViewInsets.zero;
      }
      return safeArea;
    },
    didSetValue(safeArea: ViewInsets): void {
      this.owner.callObservers("serviceDidResizeViewportSafeArea", safeArea, this.owner);
      this.owner.viewIdiom.update();
    },
    equalValues: ViewInsets.equal,
    didMount(): void {
      if (typeof CSS !== "undefined" && CSS.supports !== void 0 &&
          CSS.supports("--safe-area-inset-top: env(safe-area-inset-top)")) {
        const documentStyle = document.documentElement.style;
        documentStyle.setProperty("--safe-area-inset-top", "env(safe-area-inset-top)");
        documentStyle.setProperty("--safe-area-inset-right", "env(safe-area-inset-right)");
        documentStyle.setProperty("--safe-area-inset-bottom", "env(safe-area-inset-bottom)");
        documentStyle.setProperty("--safe-area-inset-left", "env(safe-area-inset-left)");
        this.update();
        const observer = this.observer;
        if (observer !== null) {
          observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style"],
          });
        }
      }
    },
    willUnmount(): void {
      const observer = this.observer;
      if (observer !== null) {
        observer.disconnect();
      }
    },
  })
  readonly safeArea!: Property<this, ViewInsets> & {
    /** @internal */
    readonly observer: MutationObserver | null,
    update(): void,
    detect(): ViewInsets,
  };

  @Property<ViewportService["orientation"]>({
    valueType: String,
    initValue(): ViewportOrientation {
      return this.detect();
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const orientation = this.detect();
        this.setValue(orientation, Affinity.Intrinsic);
      }
    },
    detect(): ViewportOrientation {
      let orientation: ViewportOrientation;
      if (typeof window !== "undefined" && window.matchMedia("(orientation: portrait)").matches) {
        orientation = "portrait";
      } else if (typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches) {
        orientation = "landscape";
      } else {
        orientation = "landscape";
      }
      return orientation;
    },
    didSetValue(orientation: ViewportOrientation): void {
      this.owner.callObservers("serviceDidSetViewportOrientation", orientation, this.owner);
      this.owner.viewIdiom.update();
    },
  })
  readonly orientation!: Property<this, ViewportOrientation> & {
    update(): void,
    detect(): ViewportOrientation,
  };

  @EventHandler<ViewportService["orientationChange"]>({
    type: "change",
    initTarget(): EventTarget | null {
      if (typeof window !== "undefined") {
        return window.matchMedia("(orientation: landscape)");
      } else {
        return null;
      }
    },
    handle(event: MediaQueryListEvent): void {
      this.owner.orientation.update();
    },
  })
  readonly orientationChange!: EventHandler<this>;
  static readonly orientationChange: FastenerClass<ViewportService["orientationChange"]>;

  @Property<ViewportService["colorScheme"]>({
    valueType: String,
    initValue(): ViewportColorScheme {
      return this.detect();
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const colorScheme = this.detect();
        this.setValue(colorScheme, Affinity.Intrinsic);
      }
    },
    detect(): ViewportColorScheme {
      let colorScheme: ViewportColorScheme;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        colorScheme = "dark";
      } else if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
        colorScheme = "light";
      } else {
        colorScheme = "no-preference";
      }
      return colorScheme;
    },
    didSetValue(colorScheme: ViewportColorScheme): void {
      this.owner.callObservers("serviceDidSetViewportColorScheme", colorScheme, this.owner);
    },
  })
  readonly colorScheme!: Property<this, ViewportColorScheme> & {
    update(): void,
    detect(): ViewportColorScheme,
  };

  @EventHandler<ViewportService["colorSchemeChange"]>({
    type: "change",
    initTarget(): EventTarget | null {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)");
      } else {
        return null;
      }
    },
    handle(event: MediaQueryListEvent): void {
      this.owner.colorScheme.update();
    },
  })
  readonly colorSchemeChange!: EventHandler<this>;
  static readonly colorSchemeChange: FastenerClass<ViewportService["colorSchemeChange"]>;

  @Property<ViewportService["viewIdiom"]>({
    valueType: String,
    initValue(): ViewIdiom {
      return this.detect();
    },
    update(): void {
      if (this.hasAffinity(Affinity.Intrinsic)) {
        const viewIdiom = this.detect();
        this.setValue(viewIdiom, Affinity.Intrinsic);
      }
    },
    detect(): ViewIdiom {
      let viewIdiom: ViewIdiom;
      const viewport = this.owner.layoutViewport.value;
      if (viewport.width < 600) {
        viewIdiom = "mobile";
      } else if (viewport.width < 800) {
        viewIdiom = "tablet";
      } else {
        viewIdiom = "desktop";
      }
      return viewIdiom;
    },
    didSetValue(viewIdiom: ViewIdiom): void {
      return this.owner.callObservers("serviceDidSetViewIdiom", viewIdiom, this.owner);
    },
  })
  readonly viewIdiom!: Property<this, ViewIdiom> & {
    update(): void,
    detect(): ViewIdiom,
  };
}
