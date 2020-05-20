// Copyright 2015-2020 SWIM.AI inc.
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

import {View} from "@swim/view";
import {GeoBox} from "../geo/GeoBox";
import {MapView} from "../MapView";
import {MapGraphicsView} from "../graphics/MapGraphicsView";

export class MapGroupView extends MapGraphicsView {
  /** @hidden */
  _geoBounds: GeoBox;

  constructor() {
    super();
    this._geoBounds = GeoBox.globe();
  }

  protected didInsertChildView(childView: View, targetView: View | null | undefined): void {
    this.doUpdateGeoBounds();
    super.didInsertChildView(childView, targetView);
  }

  protected didRemoveChildVIew(childView: View): void {
    this.doUpdateGeoBounds();
    super.didRemoveChildView(childView);
  }

  get geoBounds(): GeoBox {
    return this._geoBounds;
  }

  protected doUpdateGeoBounds(): void {
    const oldGeoBounds = this._geoBounds;
    const newGeoBounds = this.deriveGeoBounds();
    if (!oldGeoBounds.equals(newGeoBounds)) {
      this._geoBounds = newGeoBounds;
      this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
    }
  }

  childViewDidSetGeoBounds(childView: MapView, newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    this.doUpdateGeoBounds();
  }
}
