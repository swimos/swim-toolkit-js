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

import type {GeoPoint} from "@swim/geo";
import {MapGraphicsViewController, MapViewController} from "@swim/map";
import type {GoogleMapView} from "./GoogleMapView";
import type {GoogleMapViewObserver} from "./GoogleMapViewObserver";

export class GoogleMapViewController<V extends GoogleMapView = GoogleMapView> extends MapGraphicsViewController<V> implements MapViewController<V>, GoogleMapViewObserver<V> {
  mapViewWillMove(mapCenter: GeoPoint, mapZoom: number, view: V): void {
    // hook
  }

  mapViewDidMove(mapCenter: GeoPoint, mapZoom: number, view: V): void {
    // hook
  }
}
