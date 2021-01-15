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

import type {AnyPointR2, PointR2} from "@swim/math";
import type {AnyGeoPoint, GeoPoint} from "@swim/geo";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import type {GraphicsViewContext, CanvasView} from "@swim/graphics";
import {MapLayerView} from "@swim/map";
import {EsriProjection} from "./EsriProjection";
import type {EsriViewObserver} from "./EsriViewObserver";
import type {EsriViewController} from "./EsriViewController";

export abstract class EsriView extends MapLayerView {
  constructor() {
    super();
    EsriProjection.init();
  }

  abstract get map(): __esri.View;

  declare readonly viewController: EsriViewController | null;

  declare readonly viewObservers: ReadonlyArray<EsriViewObserver>;

  abstract project(lnglat: AnyGeoPoint): PointR2;
  abstract project(lng: number, lat: number): PointR2;

  abstract unproject(point: AnyPointR2): GeoPoint;
  abstract unproject(x: number, y: number): GeoPoint;

  abstract get geoProjection(): EsriProjection;

  protected willSetGeoProjection(geoProjection: EsriProjection): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetGeoProjection !== void 0) {
      viewController.viewWillSetGeoProjection(geoProjection, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetGeoProjection !== void 0) {
        viewObserver.viewWillSetGeoProjection(geoProjection, this);
      }
    }
  }

  protected onSetGeoProjection(geoProjection: EsriProjection): void {
    if (!this.isHidden() && !this.isCulled()) {
      this.requireUpdate(View.NeedsProject, false);
    }
  }

  protected didSetGeoProjection(geoProjection: EsriProjection): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetGeoProjection !== void 0) {
        viewObserver.viewDidSetGeoProjection(geoProjection, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetGeoProjection !== void 0) {
      viewController.viewDidSetGeoProjection(geoProjection, this);
    }
  }

  abstract get mapZoom(): number;

  protected willSetMapZoom(newMapZoom: number, oldMapZoom: number): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetMapZoom !== void 0) {
      viewController.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetMapZoom !== void 0) {
        viewObserver.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
      }
    }
  }

  protected onSetMapZoom(newMapZoom: number, oldMapZoom: number): void {
    // hook
  }

  protected didSetMapZoom(newMapZoom: number, oldMapZoom: number): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetMapZoom !== void 0) {
        viewObserver.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetMapZoom !== void 0) {
      viewController.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
    }
  }

  abstract get mapHeading(): number;

  abstract get mapTilt(): number;

  extendViewContext(viewContext: GraphicsViewContext): ViewContextType<this> {
    const mapViewContext = Object.create(viewContext);
    mapViewContext.geoProjection = this.geoProjection;
    mapViewContext.geoFrame = this.geoFrame;
    mapViewContext.mapZoom = this.mapZoom;
    mapViewContext.mapHeading = this.mapHeading;
    mapViewContext.mapTilt = this.mapTilt;
    return mapViewContext;
  }

  abstract overlayCanvas(): CanvasView | null;

  static readonly powerFlags: ViewFlags = MapLayerView.powerFlags | View.NeedsProject;
}
