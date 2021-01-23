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
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {GraphicsViewContext, CanvasView} from "@swim/graphics";
import {MapLayerView} from "@swim/map";
import {MapboxProjection} from "./MapboxProjection";
import type {MapboxViewObserver} from "./MapboxViewObserver";
import type {MapboxViewController} from "./MapboxViewController";

export class MapboxView extends MapLayerView {
  /** @hidden */
  readonly _map: mapboxgl.Map;
  /** @hidden */
  _geoProjection: MapboxProjection;
  /** @hidden */
  _mapZoom: number;
  /** @hidden */
  _mapHeading: number;
  /** @hidden */
  _mapTilt: number;

  constructor(map: mapboxgl.Map) {
    super();
    this.onMapRender = this.onMapRender.bind(this);
    this._map = map;
    this._geoProjection = new MapboxProjection(this._map);
    this._mapZoom = map.getZoom();
    this._mapHeading = map.getBearing();
    this._mapTilt = map.getPitch();
    this.initMap(this._map);
  }

  get map(): mapboxgl.Map {
    return this._map;
  }

  protected initMap(map: mapboxgl.Map): void {
    map.on("render", this.onMapRender);
  }

  declare readonly viewController: MapboxViewController | null;

  declare readonly viewObservers: ReadonlyArray<MapboxViewObserver>;

  project(lnglat: AnyGeoPoint): PointR2;
  project(lng: number, lat: number): PointR2;
  project(lng: AnyGeoPoint | number, lat?: number): PointR2 {
    if (arguments.length === 1) {
      return this._geoProjection.project(lng as AnyGeoPoint);
    } else {
      return this._geoProjection.project(lng as number, lat!);
    }
  }

  unproject(point: AnyPointR2): GeoPoint;
  unproject(x: number, y: number): GeoPoint;
  unproject(x: AnyPointR2 | number, y?: number): GeoPoint {
    if (arguments.length === 1) {
      return this._geoProjection.unproject(x as AnyPointR2);
    } else {
      return this._geoProjection.unproject(x as number, y!);
    }
  }

  get geoProjection(): MapboxProjection {
    return this._geoProjection;
  }

  setGeoProjection(geoProjection: MapboxProjection): void {
    this.willSetGeoProjection(geoProjection);
    this._geoProjection = geoProjection;
    this.onSetGeoProjection(geoProjection);
    this.didSetGeoProjection(geoProjection);
  }

  protected willSetGeoProjection(geoProjection: MapboxProjection): void {
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

  protected onSetGeoProjection(geoProjection: MapboxProjection): void {
    if (!this.isHidden() && !this.isCulled()) {
      this.requireUpdate(View.NeedsProject, true);
    }
  }

  protected didSetGeoProjection(geoProjection: MapboxProjection): void {
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

  get mapZoom(): number {
    return this._mapZoom;
  }

  setMapZoom(newMapZoom: number): void {
    const oldMapZoom = this._mapZoom;
    if (oldMapZoom !== newMapZoom) {
      this.willSetMapZoom(newMapZoom, oldMapZoom);
      this._mapZoom = newMapZoom;
      this.onSetMapZoom(newMapZoom, oldMapZoom);
      this.didSetMapZoom(newMapZoom, oldMapZoom);
    }
  }

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
      const viewObserver = viewObservers[i]!
      if (viewObserver.viewDidSetMapZoom !== void 0) {
        viewObserver.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetMapZoom !== void 0) {
      viewController.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
    }
  }

  get mapHeading(): number {
    return this._mapHeading;
  }

  get mapTilt(): number {
    return this._mapTilt;
  }

  extendViewContext(viewContext: GraphicsViewContext): ViewContextType<this> {
    const mapViewContext = Object.create(viewContext);
    mapViewContext.geoProjection = this._geoProjection;
    mapViewContext.geoFrame = this.geoFrame;
    mapViewContext.mapZoom = this._mapZoom;
    mapViewContext.mapHeading = this._mapHeading;
    mapViewContext.mapTilt = this._mapTilt;
    return mapViewContext;
  }

  get geoFrame(): GeoBox {
    const bounds = this._map.getBounds();
    return new GeoBox(bounds.getWest(), bounds.getSouth(),
                      bounds.getEast(), bounds.getNorth());
  }

  protected onMapRender(): void {
    this._mapHeading = this._map.getBearing();
    this._mapTilt = this._map.getPitch();
    this.setMapZoom(this._map.getZoom());
    this.setGeoProjection(this._geoProjection);
  }

  overlayCanvas(): CanvasView | null {
    if (this.isMounted()) {
      return this.getSuperView(CanvasView);
    } else {
      const map = this._map;
      HtmlView.fromNode(map.getContainer());
      const canvasContainer = HtmlView.fromNode(map.getCanvasContainer());
      const canvas = canvasContainer.append(CanvasView);
      canvas.setEventNode(canvasContainer.node);
      canvas.append(this);
      return canvas;
    }
  }

  static readonly powerFlags: ViewFlags = MapLayerView.powerFlags | View.NeedsProject;
}
