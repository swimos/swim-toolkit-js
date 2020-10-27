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

import {ViewContextType} from "@swim/view";
import {GraphicsViewController} from "@swim/graphics";
import {GeoBox} from "../geo/GeoBox";
import {GeoProjection} from "../geo/GeoProjection";
import {MapGraphicsView} from "./MapGraphicsView";
import {MapGraphicsViewObserver} from "./MapGraphicsViewObserver";

export class MapGraphicsViewController<V extends MapGraphicsView = MapGraphicsView> extends GraphicsViewController<V> implements MapGraphicsViewObserver<V> {
  get geoProjection(): GeoProjection | null {
    const view = this._view;
    return view !== null ? view.geoProjection : null;
  }

  get mapZoom(): number {
    const view = this._view;
    return view !== null ? view.mapZoom : 0;
  }

  get mapHeading(): number {
    const view = this._view;
    return view !== null ? view.mapHeading : 0;
  }

  get mapTilt(): number {
    const view = this._view;
    return view !== null ? view.mapTilt : 0;
  }

  get geoFrame(): GeoBox {
    const view = this._view;
    return view !== null ? view.geoFrame : GeoBox.globe();
  }

  get geoBounds(): GeoBox {
    const view = this._view;
    return view !== null ? view.geoBounds : GeoBox.undefined();
  }

  viewWillProject(viewContext: ViewContextType<V>, view: V): void {
    // hook
  }

  viewDidProject(viewContext: ViewContextType<V>, view: V): void {
    // hook
  }
}
