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

import {MapGraphicsViewController} from "@swim/map";
import type {GoogleMapProjection} from "./GoogleMapProjection";
import type {GoogleMapView} from "./GoogleMapView";
import type {GoogleMapViewObserver} from "./GoogleMapViewObserver";

export class GoogleMapViewController<V extends GoogleMapView = GoogleMapView> extends MapGraphicsViewController<V> implements GoogleMapViewObserver<V> {
  viewWillSetGeoProjection(geoProjection: GoogleMapProjection, view: V): void {
    // hook
  }

  viewDidSetGeoProjection(geoProjection: GoogleMapProjection, view: V): void {
    // hook
  }

  viewWillSetMapZoom(newMapZoom: number, oldMapZoom: number, view: V): void {
    // hook
  }

  viewDidSetMapZoom(newMapZoom: number, oldMapZoom: number, view: V): void {
    // hook
  }
}
