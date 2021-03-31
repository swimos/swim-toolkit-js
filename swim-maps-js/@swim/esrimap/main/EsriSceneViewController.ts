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

import {EsriViewController} from "./EsriViewController";
import type {EsriSceneViewProjection} from "./EsriSceneViewProjection";
import type {EsriSceneView} from "./EsriSceneView";
import type {EsriSceneViewObserver} from "./EsriSceneViewObserver";

export class EsriSceneViewController<V extends EsriSceneView = EsriSceneView> extends EsriViewController<V> implements EsriSceneViewObserver<V> {
  viewWillSetGeoProjection(geoProjection: EsriSceneViewProjection, view: V): void {
    // hook
  }

  viewDidSetGeoProjection(geoProjection: EsriSceneViewProjection, view: V): void {
    // hook
  }
}
