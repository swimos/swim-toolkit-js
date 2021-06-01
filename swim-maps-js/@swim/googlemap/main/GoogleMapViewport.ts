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

/// <reference types="googlemaps"/>

import type {Equals} from "@swim/util";
import {AnyPointR2, PointR2} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import type {GeoViewport} from "@swim/map";

export class GoogleMapViewport implements GeoViewport, Equals {
  constructor(projection: google.maps.MapCanvasProjection | null, geoFrame: GeoBox,
              geoCenter: GeoPoint, zoom: number, heading: number, tilt: number) {
    Object.defineProperty(this, "projection", {
      value: projection,
      enumerable: true,
    });
    Object.defineProperty(this, "geoFrame", {
      value: geoFrame,
      enumerable: true,
    });
    Object.defineProperty(this, "geoCenter", {
      value: geoCenter,
      enumerable: true,
    });
    Object.defineProperty(this, "zoom", {
      value: zoom,
      enumerable: true,
    });
    Object.defineProperty(this, "heading", {
      value: heading,
      enumerable: true,
    });
    Object.defineProperty(this, "tilt", {
      value: tilt,
      enumerable: true,
    });
  }

  readonly projection!: google.maps.MapCanvasProjection | null;

  readonly geoFrame!: GeoBox;

  readonly geoCenter!: GeoPoint;

  readonly zoom!: number;

  readonly heading!: number;

  readonly tilt!: number;

  project(geoPoint: AnyGeoPoint): PointR2;
  project(lng: number, lat: number): PointR2;
  project(lng: AnyGeoPoint | number, lat?: number): PointR2 {
    const projection = this.projection;
    if (projection !== null) {
      let geoPoint: google.maps.LatLng;
      if (typeof lng === "number") {
        geoPoint = new google.maps.LatLng(lat!, lng);
      } else if (Array.isArray(lng)) {
        geoPoint = new google.maps.LatLng(lng[1], lng[0]);
      } else {
        geoPoint = new google.maps.LatLng(lng.lat, lng.lng);
      }
      const point = projection.fromLatLngToContainerPixel(geoPoint);
      return new PointR2(point.x, point.y);
    } else {
      return PointR2.undefined();
    }
  }

  unproject(viewPoint: AnyPointR2): GeoPoint;
  unproject(x: number, y: number): GeoPoint;
  unproject(x: AnyPointR2 | number, y?: number): GeoPoint {
    const projection = this.projection;
    if (projection !== null) {
      let viewPoint: google.maps.Point;
      if (typeof x === "number") {
        viewPoint = new google.maps.Point(x, y!);
      } else if (Array.isArray(x)) {
        viewPoint = new google.maps.Point(x[0], x[1]);
      } else {
        viewPoint = new google.maps.Point(x.x, x.y);
      }
      const point = projection.fromContainerPixelToLatLng(viewPoint);
      return new GeoPoint(point.lng(), point.lat());
    } else {
      return GeoPoint.undefined();
    }
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof GoogleMapViewport) {
      return this.projection === that.projection
          && this.geoFrame.equals(that.geoFrame)
          && this.geoCenter.equals(that.geoCenter)
          && this.zoom === that.zoom
          && this.heading === that.heading
          && this.tilt === that.tilt;
    }
    return false;
  }

  static create(map: google.maps.Map, projection: google.maps.MapCanvasProjection | null | undefined): GoogleMapViewport {
    if (projection === void 0) {
      projection = null;
    }
    const mapFrame = map.getBounds();
    let geoFrame: GeoBox;
    if (mapFrame !== void 0 && mapFrame !== null) {
      const sw = mapFrame.getSouthWest();
      const ne = mapFrame.getNorthEast();
      geoFrame = new GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
    } else {
      geoFrame = GeoBox.undefined();
    }
    const mapCenter = map.getCenter();
    const geoCenter = new GeoPoint(mapCenter.lng(), mapCenter.lat());
    const zoom = map.getZoom();
    const heading = map.getHeading();
    const tilt = map.getTilt();
    return new GoogleMapViewport(projection, geoFrame, geoCenter, zoom, heading, tilt);
  }
}
