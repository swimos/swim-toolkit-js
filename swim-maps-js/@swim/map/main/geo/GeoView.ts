// Copyright 2015-2021 Swim inc.
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

import {Arrays} from "@swim/util";
import {GeoBox} from "@swim/geo";
import {
  ViewContextType,
  ViewFlags,
  View,
  ViewObserverType,
  ViewWillProject,
  ViewDidProject,
} from "@swim/view";
import {GraphicsViewInit, GraphicsView} from "@swim/graphics";
import type {GeoViewport} from "./GeoViewport";
import type {GeoViewContext} from "./GeoViewContext";
import type {GeoViewObserver} from "./GeoViewObserver";
import type {GeoViewController} from "./GeoViewController";

export interface GeoViewInit extends GraphicsViewInit {
}

export abstract class GeoView extends GraphicsView {
  override readonly viewController!: GeoViewController | null;

  override readonly viewObservers!: ReadonlyArray<GeoViewObserver>;

  override initView(init: GeoViewInit): void {
    super.initView(init);
  }

  protected override onAddViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onAddViewObserver(viewObserver);
    if (viewObserver.viewWillProject !== void 0) {
      this.viewObserverCache.viewWillProjectObservers = Arrays.inserted(viewObserver as ViewWillProject, this.viewObserverCache.viewWillProjectObservers);
    }
    if (viewObserver.viewDidProject !== void 0) {
      this.viewObserverCache.viewDidProjectObservers = Arrays.inserted(viewObserver as ViewDidProject, this.viewObserverCache.viewDidProjectObservers);
    }
  }

  protected override onRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onRemoveViewObserver(viewObserver);
    if (viewObserver.viewWillProject !== void 0) {
      this.viewObserverCache.viewWillProjectObservers = Arrays.removed(viewObserver as ViewWillProject, this.viewObserverCache.viewWillProjectObservers);
    }
    if (viewObserver.viewDidProject !== void 0) {
      this.viewObserverCache.viewDidProjectObservers = Arrays.removed(viewObserver as ViewDidProject, this.viewObserverCache.viewDidProjectObservers);
    }
  }

  override needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.NeedsAnimate) === 0) {
      processFlags &= ~View.NeedsAnimate;
    }
    return processFlags;
  }

  /** @hidden */
  protected override doProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    let cascadeFlags = processFlags;
    this.setViewFlags(this.viewFlags & ~View.NeedsProcess | (View.TraversingFlag | View.ProcessingFlag));
    try {
      this.willProcess(cascadeFlags, viewContext);
      if (((this.viewFlags | processFlags) & View.NeedsResize) !== 0) {
        cascadeFlags |= View.NeedsResize;
        this.setViewFlags(this.viewFlags & ~View.NeedsResize);
        this.willResize(viewContext);
      }
      if (((this.viewFlags | processFlags) & View.NeedsScroll) !== 0) {
        cascadeFlags |= View.NeedsScroll;
        this.setViewFlags(this.viewFlags & ~View.NeedsScroll);
        this.willScroll(viewContext);
      }
      if (((this.viewFlags | processFlags) & View.NeedsChange) !== 0) {
        cascadeFlags |= View.NeedsChange;
        this.setViewFlags(this.viewFlags & ~View.NeedsChange);
        this.willChange(viewContext);
      }
      if (((this.viewFlags | processFlags) & View.NeedsAnimate) !== 0) {
        cascadeFlags |= View.NeedsAnimate;
        this.setViewFlags(this.viewFlags & ~View.NeedsAnimate);
        this.willAnimate(viewContext);
      }
      if (((this.viewFlags | processFlags) & View.NeedsLayout) !== 0) {
        cascadeFlags |= View.NeedsLayout;
        this.setViewFlags(this.viewFlags & ~View.NeedsLayout);
        this.willLayout(viewContext);
      }
      if (((this.viewFlags | processFlags) & View.NeedsProject) !== 0) {
        cascadeFlags |= View.NeedsProject;
        this.setViewFlags(this.viewFlags & ~View.NeedsProject);
        this.willProject(viewContext);
      }

      this.onProcess(cascadeFlags, viewContext);
      if ((cascadeFlags & View.NeedsResize) !== 0) {
        this.onResize(viewContext);
      }
      if ((cascadeFlags & View.NeedsScroll) !== 0) {
        this.onScroll(viewContext);
      }
      if ((cascadeFlags & View.NeedsChange) !== 0) {
        this.onChange(viewContext);
      }
      if ((cascadeFlags & View.NeedsAnimate) !== 0) {
        this.onAnimate(viewContext);
      }
      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.onLayout(viewContext);
      }
      if ((cascadeFlags & View.NeedsProject) !== 0) {
        this.onProject(viewContext);
      }

      this.doProcessChildViews(cascadeFlags, viewContext);

      if ((cascadeFlags & View.NeedsProject) !== 0) {
        this.didProject(viewContext);
      }
      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.didLayout(viewContext);
      }
      if ((cascadeFlags & View.NeedsAnimate) !== 0) {
        this.didAnimate(viewContext);
      }
      if ((cascadeFlags & View.NeedsChange) !== 0) {
        this.didChange(viewContext);
      }
      if ((cascadeFlags & View.NeedsScroll) !== 0) {
        this.didScroll(viewContext);
      }
      if ((cascadeFlags & View.NeedsResize) !== 0) {
        this.didResize(viewContext);
      }
      this.didProcess(cascadeFlags, viewContext);
    } finally {
      this.setViewFlags(this.viewFlags & ~(View.TraversingFlag | View.ProcessingFlag));
    }
  }

  protected willProject(viewContext: ViewContextType<this>): void {
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewWillProject(viewContext, this);
    }
    const viewObservers = this.viewObserverCache.viewWillProjectObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewWillProject(viewContext, this);
      }
    }
  }

  protected onProject(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didProject(viewContext: ViewContextType<this>): void {
    const viewObservers = this.viewObserverCache.viewDidProjectObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewDidProject(viewContext, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewDidProject(viewContext, this);
    }
  }

  protected override onSetHidden(hidden: boolean): void {
    const parentView = this.parentView;
    if (parentView instanceof GeoView) {
      parentView.onSetChildViewHidden(this, hidden);
    }
    if (!hidden) {
      this.requireUpdate(View.NeedsProject);
    }
  }

  onSetChildViewHidden(childView: GeoView, hidden: boolean): void {
    // hook
  }

  cullGeoFrame(geoFrame: GeoBox = this.geoFrame): void {
    this.setCulled(!geoFrame.intersects(this.geoBounds));
  }

  override readonly viewContext!: GeoViewContext;

  get geoViewport(): GeoViewport {
    return this.viewContext.geoViewport;
  }

  /**
   * The map-specified geo-coordinate bounding box in which this view should layout
   * and render geometry.
   */
  get geoFrame(): GeoBox {
    const parentView = this.parentView;
    return parentView instanceof GeoView ? parentView.geoFrame : GeoBox.globe();
  }

  /**
   * The self-defined geo-coordinate bounding box surrounding all geometry this
   * view could possibly render.  Views with geo bounds that don't overlap
   * their map frames may be culled from rendering and hit testing.
   */
  declare readonly geoBounds: GeoBox; // getter defined below to work around useDefineForClassFields lunacy

  get ownGeoBounds(): GeoBox | null {
    return null;
  }

  willSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetGeoBounds !== void 0) {
      viewController.viewWillSetGeoBounds(newGeoBounds, oldGeoBounds, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetGeoBounds !== void 0) {
        viewObserver.viewWillSetGeoBounds(newGeoBounds, oldGeoBounds, this);
      }
    }
  }

  protected onSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const parentView = this.parentView;
    if (parentView instanceof GeoView) {
      parentView.onSetChildViewGeoBounds(this, newGeoBounds, oldGeoBounds);
    }
  }

  didSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetGeoBounds !== void 0) {
        viewObserver.viewDidSetGeoBounds(newGeoBounds, oldGeoBounds, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetGeoBounds !== void 0) {
      viewController.viewDidSetGeoBounds(newGeoBounds, oldGeoBounds, this);
    }
  }

  onSetChildViewGeoBounds(childView: GeoView, newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    // hook
  }

  deriveGeoBounds(): GeoBox {
    let geoBounds = this.ownGeoBounds;
    type self = this;
    function accumulateGeoBounds(this: self, childView: View): void {
      if (childView instanceof GeoView && !childView.isHidden()) {
        const childGeoBounds = childView.geoBounds;
        if (childGeoBounds.isDefined()) {
          if (geoBounds !== null) {
            geoBounds = geoBounds.union(childGeoBounds);
          } else {
            geoBounds = childGeoBounds;
          }
        }
      }
    }
    this.forEachChildView(accumulateGeoBounds, this);
    if (geoBounds === null) {
      geoBounds = this.geoFrame;
    }
    return geoBounds;
  }

  static override readonly mountFlags: ViewFlags = GraphicsView.mountFlags | View.NeedsProject;
  static override readonly uncullFlags: ViewFlags = GraphicsView.uncullFlags | View.NeedsProject;
}
Object.defineProperty(GeoView.prototype, "geoBounds", {
  get(this: GeoView): GeoBox {
    return this.geoFrame;
  },
  enumerable: true,
  configurable: true,
});
