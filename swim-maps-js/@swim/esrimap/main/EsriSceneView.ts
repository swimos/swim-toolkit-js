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
import {HtmlView} from "@swim/dom";
import {CanvasView} from "@swim/graphics";
import {EsriProjection} from "./EsriProjection";
import {EsriView} from "./EsriView";
import {EsriSceneViewProjection} from "./EsriSceneViewProjection";
import type {EsriSceneViewObserver} from "./EsriSceneViewObserver";
import type {EsriSceneViewController} from "./EsriSceneViewController";

export class EsriSceneView extends EsriView {
  constructor(map: __esri.SceneView) {
    super();
    Object.defineProperty(this, "map", {
      value: map,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "geoProjection", {
      value: new EsriSceneViewProjection(map),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapZoom", {
      value: map.zoom,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapHeading", {
      value: map.camera.heading,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapTilt", {
      value: map.camera.tilt,
      enumerable: true,
      configurable: true,
    });
    this.onMapRender = this.onMapRender.bind(this);
    this.initMap(map);
  }

  declare readonly viewController: EsriSceneViewController | null;

  declare readonly viewObservers: ReadonlyArray<EsriSceneViewObserver>;

  declare readonly map: __esri.SceneView;

  protected initMap(map: __esri.SceneView): void {
    map.watch("extent", this.onMapRender);
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

  declare readonly geoProjection: EsriSceneViewProjection;

  setGeoProjection(geoProjection: EsriSceneViewProjection): void {
    this.willSetGeoProjection(geoProjection);
    Object.defineProperty(this, "geoProjection", {
      value: geoProjection,
      enumerable: true,
      configurable: true,
    });
    this.onSetGeoProjection(geoProjection);
    this.didSetGeoProjection(geoProjection);
  }

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

  declare readonly mapHeading: number;

  declare readonly mapTilt: number;

  get geoFrame(): GeoBox {
    let extent = this.map.extent;
    if (extent !== null) {
      extent = EsriProjection.webMercatorUtils!.webMercatorToGeographic(extent) as __esri.Extent;
    }
    if (extent !== null) {
      return new GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
    } else {
      return GeoBox.globe();
    }
  }

  protected onMapRender(): void {
    const map = this.map;
    Object.defineProperty(this, "mapHeading", {
      value: map.camera.heading,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "mapTilt", {
      value: map.camera.tilt,
      enumerable: true,
      configurable: true,
    });
    this.setMapZoom(map.zoom);
    this.setGeoProjection(this.geoProjection);
  }

  overlayCanvas(): CanvasView | null {
    if (this.isMounted()) {
      return this.getSuperView(CanvasView);
    } else {
      const map = this.map;
      const container = HtmlView.fromNode(map.container);
      const esriViewRoot = HtmlView.fromNode(container.node.querySelector(".esri-view-root") as HTMLDivElement);
      const esriViewSurface = HtmlView.fromNode(esriViewRoot.node.querySelector(".esri-view-surface") as HTMLDivElement);
      const canvas = esriViewSurface.append(CanvasView);
      canvas.append(this);
      return canvas;
    }
  }
}
