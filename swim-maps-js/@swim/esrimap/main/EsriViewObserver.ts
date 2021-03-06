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

import type {MapViewObserver} from "@swim/map";
import type {EsriViewport} from "./EsriViewport";
import type {EsriView} from "./EsriView";

export interface EsriViewObserver<V extends EsriView = EsriView> extends MapViewObserver<V> {
  viewWillSetGeoViewport?(newGeoViewport: EsriViewport, oldGeoViewport: EsriViewport, view: V): void;

  viewDidSetGeoViewport?(newGeoViewport: EsriViewport, oldGeoViewport: EsriViewport, view: V): void;
}
