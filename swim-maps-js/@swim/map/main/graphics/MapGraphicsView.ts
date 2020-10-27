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

import {ViewContextType, ViewFlags, View} from "@swim/view";
import {GraphicsViewInit, GraphicsView} from "@swim/graphics";
import {GeoBox} from "../geo/GeoBox";
import {GeoProjection} from "../geo/GeoProjection";
import {MapGraphicsViewContext} from "./MapGraphicsViewContext";
import {MapGraphicsViewObserver} from "./MapGraphicsViewObserver";
import {MapGraphicsViewController} from "./MapGraphicsViewController";

export interface MapGraphicsViewInit extends GraphicsViewInit {
}

export abstract class MapGraphicsView extends GraphicsView {
  // @ts-ignore
  declare readonly viewController: MapGraphicsViewController | null;

  // @ts-ignore
  declare readonly viewObservers: ReadonlyArray<MapGraphicsViewObserver>;

  initView(init: MapGraphicsViewInit): void {
    super.initView(init);
  }

  get geoProjection(): GeoProjection | null {
    const parentView = this.parentView;
    return parentView instanceof MapGraphicsView ? parentView.geoProjection : null;
  }

  get mapZoom(): number {
    const parentView = this.parentView;
    return parentView instanceof MapGraphicsView ? parentView.mapZoom : 0;
  }

  get mapHeading(): number {
    const parentView = this.parentView;
    return parentView instanceof MapGraphicsView ? parentView.mapHeading : 0;
  }

  get mapTilt(): number {
    const parentView = this.parentView;
    return parentView instanceof MapGraphicsView ? parentView.mapTilt : 0;
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this._viewFlags & View.NeedsAnimate) === 0) {
      processFlags &= ~View.NeedsAnimate;
    }
    return processFlags;
  }

  /** @hidden */
  protected doProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    let cascadeFlags = processFlags;
    this._viewFlags |= View.TraversingFlag | View.ProcessingFlag;
    this._viewFlags &= ~View.NeedsProcess;
    try {
      this.willProcess(viewContext);
      if (((this._viewFlags | processFlags) & View.NeedsResize) !== 0) {
        this.willResize(viewContext);
        cascadeFlags |= View.NeedsResize;
        this._viewFlags &= ~View.NeedsResize;
      }
      if (((this._viewFlags | processFlags) & View.NeedsScroll) !== 0) {
        this.willScroll(viewContext);
        cascadeFlags |= View.NeedsScroll;
        this._viewFlags &= ~View.NeedsScroll;
      }
      if (((this._viewFlags | processFlags) & View.NeedsChange) !== 0) {
        this.willChange(viewContext);
        cascadeFlags |= View.NeedsChange;
        this._viewFlags &= ~View.NeedsChange;
      }
      if (((this._viewFlags | processFlags) & View.NeedsAnimate) !== 0) {
        this.willAnimate(viewContext);
        cascadeFlags |= View.NeedsAnimate;
        this._viewFlags &= ~View.NeedsAnimate;
      }
      if (((this._viewFlags | processFlags) & View.NeedsLayout) !== 0) {
        this.willLayout(viewContext);
        cascadeFlags |= View.NeedsLayout;
        this._viewFlags &= ~View.NeedsLayout;
      }
      if (((this._viewFlags | processFlags) & View.NeedsProject) !== 0) {
        this.willProject(viewContext);
        cascadeFlags |= View.NeedsProject;
        this._viewFlags &= ~View.NeedsProject;
      }

      this.onProcess(viewContext);
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
      this.didProcess(viewContext);
    } finally {
      this._viewFlags &= ~(View.TraversingFlag | View.ProcessingFlag);
    }
  }

  protected willProject(viewContext: ViewContextType<this>): void {
    this.willObserve(function (viewObserver: MapGraphicsViewObserver): void {
      if (viewObserver.viewWillProject !== void 0) {
        viewObserver.viewWillProject(viewContext, this);
      }
    });
  }

  protected onProject(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didProject(viewContext: ViewContextType<this>): void {
    this.didObserve(function (viewObserver: MapGraphicsViewObserver): void {
      if (viewObserver.viewDidProject !== void 0) {
        viewObserver.viewDidProject(viewContext, this);
      }
    });
  }

  protected onSetHidden(hidden: boolean): void {
    if (!hidden) {
      this.requireUpdate(View.NeedsProject);
    }
  }

  cullGeoFrame(geoFrame: GeoBox = this.geoFrame): void {
    this.setCulled(!geoFrame.intersects(this.geoBounds));
  }

  // @ts-ignore
  declare readonly viewContext: MapGraphicsViewContext;

  /**
   * The map-specified geographic bounding box in which this view should layout
   * and render geometry.
   */
  get geoFrame(): GeoBox {
    const parentView = this.parentView;
    return parentView instanceof MapGraphicsView ? parentView.geoFrame : GeoBox.globe();
  }

  /**
   * The self-defined geographic bounding box surrounding all geometry this
   * view could possibly render.  Views with geo bounds that don't overlap
   * their map frames may be culled from rendering and hit testing.
   */
  get geoBounds(): GeoBox {
    return this.geoFrame;
  }

  deriveGeoBounds(): GeoBox {
    let geoBounds: GeoBox | undefined;
    this.forEachChildView(function (childView: View): void {
      if (childView instanceof MapGraphicsView && !childView.isHidden()) {
        const childGeoBounds = childView.geoBounds;
        if (childGeoBounds.isDefined()) {
          if (geoBounds !== void 0) {
            geoBounds = geoBounds.union(childGeoBounds);
          } else {
            geoBounds = childGeoBounds;
          }
        }
      }
    }, this);
    if (geoBounds === void 0) {
      geoBounds = this.geoFrame;
    }
    return geoBounds;
  }

  protected didSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const parentView = this._parentView;
    if (parentView instanceof MapGraphicsView) {
      parentView.childViewDidSetGeoBounds(this, newGeoBounds, oldGeoBounds);
    }
  }

  childViewDidSetGeoBounds(childView: MapGraphicsView, newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    // hook
  }

  static readonly mountFlags: ViewFlags = GraphicsView.mountFlags | View.NeedsProject;
  static readonly uncullFlags: ViewFlags = GraphicsView.uncullFlags | View.NeedsProject;
}
