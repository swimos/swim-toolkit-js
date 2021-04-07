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

import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import type {Graphics} from "@swim/graphics";
import {GeoTrait} from "../geo/GeoTrait";
import type {GeoIconTraitObserver} from "./GeoIconTraitObserver";

export class GeoIconTrait extends GeoTrait {
  constructor() {
    super();
    Object.defineProperty(this, "geoCenter", {
      value: GeoPoint.origin(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "graphics", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<GeoIconTraitObserver>;

  get geoBounds(): GeoBox {
    return this.geoCenter.bounds;
  }

  declare readonly geoCenter: GeoPoint;

  setGeoCenter(newGeoCenter: AnyGeoPoint): void {
    const oldGeoCenter = this.geoCenter;
    newGeoCenter = GeoPoint.fromAny(newGeoCenter);
    if (!(newGeoCenter as GeoPoint).equals(oldGeoCenter)) {
      this.willSetGeoCenter(newGeoCenter as GeoPoint, oldGeoCenter);
      Object.defineProperty(this, "geoCenter", {
        value: newGeoCenter,
        enumerable: true,
        configurable: true,
      });
      this.onSetGeoCenter(newGeoCenter as GeoPoint, oldGeoCenter);
      this.didSetGeoCenter(newGeoCenter as GeoPoint, oldGeoCenter);
    }
  }

  protected willSetGeoCenter(newGeoCenter: GeoPoint, oldGeoCenter: GeoPoint): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetGeoCenter !== void 0) {
        traitObserver.traitWillSetGeoCenter(newGeoCenter, oldGeoCenter, this);
      }
    }
  }

  protected onSetGeoCenter(newGeoCenter: GeoPoint, oldGeoCenter: GeoPoint): void {
    // hook
  }

  protected didSetGeoCenter(newGeoCenter: GeoPoint, oldGeoCenter: GeoPoint): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetGeoCenter !== void 0) {
        traitObserver.traitDidSetGeoCenter(newGeoCenter, oldGeoCenter, this);
      }
    }
  }

  declare readonly graphics: Graphics | null;

  setGraphics(newGraphics: Graphics | null): void {
    const oldGraphics = this.graphics;
    if (newGraphics !== oldGraphics) {
      this.willSetGraphics(newGraphics, oldGraphics);
      Object.defineProperty(this, "graphics", {
        value: newGraphics,
        enumerable: true,
        configurable: true,
      });
      this.onSetGraphics(newGraphics, oldGraphics);
      this.didSetGraphics(newGraphics, oldGraphics);
    }
  }

  protected willSetGraphics(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetGraphics !== void 0) {
        traitObserver.traitWillSetGraphics(newGraphics, oldGraphics, this);
      }
    }
  }

  protected onSetGraphics(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
    // hook
  }

  protected didSetGraphics(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetGraphics !== void 0) {
        traitObserver.traitDidSetGraphics(newGraphics, oldGraphics, this);
      }
    }
  }
}
