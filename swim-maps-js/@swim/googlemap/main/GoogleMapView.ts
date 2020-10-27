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

import {AnyPointR2, PointR2} from "@swim/math";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import {ViewHtml, HtmlView} from "@swim/dom";
import {GraphicsViewContext, CanvasView} from "@swim/graphics";
import {AnyGeoPoint, GeoPoint, GeoBox, MapLayerView} from "@swim/map";
import {GoogleMapProjection} from "./GoogleMapProjection";
import {GoogleMapViewObserver} from "./GoogleMapViewObserver";
import {GoogleMapViewController} from "./GoogleMapViewController";

export class GoogleMapView extends MapLayerView {
  /** @hidden */
  readonly _map: google.maps.Map;
  /** @hidden */
  _geoProjection: GoogleMapProjection;
  /** @hidden */
  _mapOverlay: google.maps.OverlayView | null;
  /** @hidden */
  _mapZoom: number;
  /** @hidden */
  _mapHeading: number;
  /** @hidden */
  _mapTilt: number;

  constructor(map: google.maps.Map) {
    super();
    this.onMapRender = this.onMapRender.bind(this);
    this._map = map;
    this._geoProjection = new GoogleMapProjection(this);
    this._mapOverlay = null;
    this._mapZoom = map.getZoom();
    this._mapHeading = map.getHeading();
    this._mapTilt = map.getTilt();
    this.initMap(map);
  }

  get map(): google.maps.Map {
    return this._map;
  }

  protected initMap(map: google.maps.Map): void {
    // hook
  }

  // @ts-ignore
  declare readonly viewController: GoogleMapViewController | null;

  // @ts-ignore
  declare readonly viewObservers: ReadonlyArray<GoogleMapViewObserver>;

  project(lnglat: AnyGeoPoint): PointR2;
  project(lng: number, lat: number): PointR2;
  project(lng: AnyGeoPoint | number, lat?: number): PointR2 {
    return this._geoProjection.project.apply(this._geoProjection, arguments);
  }

  unproject(point: AnyPointR2): GeoPoint;
  unproject(x: number, y: number): GeoPoint;
  unproject(x: AnyPointR2 | number, y?: number): GeoPoint {
    return this._geoProjection.unproject.apply(this._geoProjection, arguments);
  }

  get geoProjection(): GoogleMapProjection {
    return this._geoProjection;
  }

  setGeoProjection(geoProjection: GoogleMapProjection): void {
    this.willSetGeoProjection(geoProjection);
    this._geoProjection = geoProjection;
    this.onSetGeoProjection(geoProjection);
    this.didSetGeoProjection(geoProjection);
  }

  protected willSetGeoProjection(geoProjection: GoogleMapProjection): void {
    this.willObserve(function (viewObserver: GoogleMapViewObserver): void {
      if (viewObserver.viewWillSetGeoProjection !== void 0) {
        viewObserver.viewWillSetGeoProjection(geoProjection, this);
      }
    });
  }

  protected onSetGeoProjection(geoProjection: GoogleMapProjection): void {
    if (!this.isHidden() && !this.isCulled()) {
      this.requireUpdate(View.NeedsProject, true);
    }
  }

  protected didSetGeoProjection(geoProjection: GoogleMapProjection): void {
    this.didObserve(function (viewObserver: GoogleMapViewObserver): void {
      if (viewObserver.viewDidSetGeoProjection !== void 0) {
        viewObserver.viewDidSetGeoProjection(geoProjection, this);
      }
    });
  }

  get mapOverlay(): google.maps.OverlayView | null {
    return this._mapOverlay;
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
    this.didObserve(function (viewObserver: GoogleMapViewObserver): void {
      if (viewObserver.viewWillSetMapZoom !== void 0) {
        viewObserver.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
      }
    });
  }

  protected onSetMapZoom(newMapZoom: number, oldMapZoom: number): void {
    // hook
  }

  protected didSetMapZoom(newMapZoom: number, oldMapZoom: number): void {
    this.didObserve(function (viewObserver: GoogleMapViewObserver): void {
      if (viewObserver.viewDidSetMapZoom !== void 0) {
        viewObserver.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
      }
    });
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
    const bounds = this._map.getBounds()!;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return new GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
  }

  protected onMapRender(): void {
    this._mapHeading = this._map.getHeading();
    this._mapTilt = this._map.getTilt();
    this.setMapZoom(this._map.getZoom());
    this.setGeoProjection(this._geoProjection);
  }

  overlayCanvas(): CanvasView | null {
    if (this.isMounted()) {
      return this.getSuperView(CanvasView);
    } else {
      class GoogleMapOverlayView extends google.maps.OverlayView {
        readonly _mapView: GoogleMapView;
        readonly _canvasView: CanvasView;
        constructor(mapView: GoogleMapView) {
          super();
          this._mapView = mapView;
          this._canvasView = CanvasView.create();
          this._canvasView.append(this._mapView);
        }
        onAdd(): void {
          const panes = this.getPanes();
          const overlayMouseTarget = GoogleMapView.materializeAncestors(panes.overlayMouseTarget as HTMLElement);
          const overlayContainer = overlayMouseTarget.parentView as HtmlView;
          const container = overlayContainer.parentView as HtmlView;
          container.append(this._canvasView!);
        }
        onRemove(): void {
          this._canvasView.remove();
        }
        draw(): void {
          this._mapView.onMapRender();
        }
      }
      const mapOverlay = new GoogleMapOverlayView(this);
      mapOverlay.setMap(this._map);
      this._mapOverlay = mapOverlay;
      return mapOverlay._canvasView;
    }
  }

  private static materializeAncestors(node: HTMLElement): HtmlView {
    const parentNode = node.parentNode;
    if (parentNode instanceof HTMLElement && !(parentNode as ViewHtml).view) {
      GoogleMapView.materializeAncestors(parentNode);
    }
    return HtmlView.fromNode(node);
  }

  static readonly powerFlags: ViewFlags = MapLayerView.powerFlags | View.NeedsProject;
}
