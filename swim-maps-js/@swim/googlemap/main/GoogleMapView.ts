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
import {ViewHtml, HtmlView} from "@swim/dom";
import {GraphicsViewContext, CanvasView} from "@swim/graphics";
import {MapLayerView} from "@swim/map";
import {GoogleMapProjection} from "./GoogleMapProjection";
import type {GoogleMapViewObserver} from "./GoogleMapViewObserver";
import type {GoogleMapViewController} from "./GoogleMapViewController";

export class GoogleMapView extends MapLayerView {
  constructor(map: google.maps.Map) {
    super();
    Object.defineProperty(this, "map", {
      value: map,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "geoProjection", {
      value: new GoogleMapProjection(this),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapOverlay", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapZoom", {
      value: map.getZoom(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapHeading", {
      value: map.getHeading(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapTilt", {
      value: map.getTilt(),
      enumerable: true,
      configurable: true,
    });
    this.onMapRender = this.onMapRender.bind(this);
    this.initMap(map);
  }

  declare readonly viewController: GoogleMapViewController | null;

  declare readonly viewObservers: ReadonlyArray<GoogleMapViewObserver>;

  declare readonly map: google.maps.Map;

  protected initMap(map: google.maps.Map): void {
    // hook
  }

  project(lnglat: AnyGeoPoint): PointR2;
  project(lng: number, lat: number): PointR2;
  project(lng: AnyGeoPoint | number, lat?: number): PointR2 {
    if (arguments.length === 1) {
      return this.geoProjection.project(lng as AnyGeoPoint);
    } else {
      return this.geoProjection.project(lng as number, lat!);
    }
  }

  unproject(point: AnyPointR2): GeoPoint;
  unproject(x: number, y: number): GeoPoint;
  unproject(x: AnyPointR2 | number, y?: number): GeoPoint {
    if (arguments.length === 1) {
      return this.geoProjection.unproject(x as AnyPointR2);
    } else {
      return this.geoProjection.unproject(x as number, y!);
    }
  }

  // @ts-ignore
  declare readonly geoProjection: GoogleMapProjection;

  setGeoProjection(geoProjection: GoogleMapProjection): void {
    this.willSetGeoProjection(geoProjection);
    Object.defineProperty(this, "geoProjection", {
      value: geoProjection,
      enumerable: true,
      configurable: true,
    });
    this.onSetGeoProjection(geoProjection);
    this.didSetGeoProjection(geoProjection);
  }

  protected willSetGeoProjection(geoProjection: GoogleMapProjection): void {
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

  protected onSetGeoProjection(geoProjection: GoogleMapProjection): void {
    if (!this.isHidden() && !this.isCulled()) {
      this.requireUpdate(View.NeedsProject, true);
    }
  }

  protected didSetGeoProjection(geoProjection: GoogleMapProjection): void {
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

  declare readonly mapOverlay: google.maps.OverlayView | null;

  // @ts-ignore
  declare readonly mapZoom: number;

  setMapZoom(newMapZoom: number): void {
    const oldMapZoom = this.mapZoom;
    if (oldMapZoom !== newMapZoom) {
      this.willSetMapZoom(newMapZoom, oldMapZoom);
      Object.defineProperty(this, "mapZoom", {
        value: newMapZoom,
        enumerable: true,
        configurable: true,
      });
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

  // @ts-ignore
  declare readonly mapHeading: number;

  // @ts-ignore
  declare readonly mapTilt: number;

  extendViewContext(viewContext: GraphicsViewContext): ViewContextType<this> {
    const mapViewContext = Object.create(viewContext);
    mapViewContext.geoProjection = this.geoProjection;
    mapViewContext.geoFrame = this.geoFrame;
    mapViewContext.mapZoom = this.mapZoom;
    mapViewContext.mapHeading = this.mapHeading;
    mapViewContext.mapTilt = this.mapTilt;
    return mapViewContext;
  }

  get geoFrame(): GeoBox {
    const bounds = this.map.getBounds()!;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return new GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
  }

  /** @hidden */
  onMapRender(): void {
    const map = this.map;
    Object.defineProperty(this, "mapHeading", {
      value: map.getHeading(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapTilt", {
      value: map.getTilt(),
      enumerable: true,
      configurable: true,
    });
    this.setMapZoom(map.getZoom());
    this.setGeoProjection(this.geoProjection);
  }

  overlayCanvas(): CanvasView | null {
    if (this.isMounted()) {
      return this.getSuperView(CanvasView);
    } else {
      class GoogleMapOverlayView extends google.maps.OverlayView {
        constructor(mapView: GoogleMapView) {
          super();
          Object.defineProperty(this, "mapView", {
            value: mapView,
            enumerable: true,
            configurable: true,
          });
          Object.defineProperty(this, "canvasView", {
            value: CanvasView.create(),
            enumerable: true,
            configurable: true,
          });
          this.canvasView.append(mapView);
        }
        declare readonly mapView: GoogleMapView;
        declare readonly canvasView: CanvasView;
        onAdd(): void {
          const panes = this.getPanes();
          const overlayMouseTarget = GoogleMapView.materializeAncestors(panes.overlayMouseTarget as HTMLElement);
          const overlayContainer = overlayMouseTarget.parentView as HtmlView;
          const container = overlayContainer.parentView as HtmlView;
          container.append(this.canvasView!);
        }
        onRemove(): void {
          this.canvasView.remove();
        }
        draw(): void {
          this.mapView.onMapRender();
        }
      }
      const mapOverlay = new GoogleMapOverlayView(this);
      mapOverlay.setMap(this.map);
      Object.defineProperty(this, "mapOverlay", {
        value: mapOverlay,
        enumerable: true,
        configurable: true,
      });
      return mapOverlay.canvasView;
    }
  }

  /** @hidden */
  static materializeAncestors(node: HTMLElement): HtmlView {
    const parentNode = node.parentNode;
    if (parentNode instanceof HTMLElement && !(parentNode as ViewHtml).view) {
      GoogleMapView.materializeAncestors(parentNode);
    }
    return HtmlView.fromNode(node);
  }

  static readonly powerFlags: ViewFlags = MapLayerView.powerFlags | View.NeedsProject;
}
