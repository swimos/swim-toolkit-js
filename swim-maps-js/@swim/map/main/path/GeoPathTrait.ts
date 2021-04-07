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

import {AnyGeoPath, GeoPath, GeoBox} from "@swim/geo";
import {GeoTrait} from "../geo/GeoTrait";
import type {GeoPathTraitObserver} from "./GeoPathTraitObserver";

export abstract class GeoPathTrait extends GeoTrait {
  constructor() {
    super();
    Object.defineProperty(this, "geoPath", {
      value: GeoPath.empty(),
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<GeoPathTraitObserver>;

  get geoBounds(): GeoBox {
    return this.geoPath.bounds;
  }

  declare readonly geoPath: GeoPath;

  setGeoPath(newGeoPath: AnyGeoPath): void {
    const oldGeoPath = this.geoPath;
    newGeoPath = GeoPath.fromAny(newGeoPath);
    if (!newGeoPath.equals(oldGeoPath)) {
      this.willSetGeoPath(newGeoPath, oldGeoPath);
      Object.defineProperty(this, "geoPath", {
        value: newGeoPath,
        enumerable: true,
        configurable: true,
      });
      this.onSetGeoPath(newGeoPath, oldGeoPath);
      this.didSetGeoPath(newGeoPath, oldGeoPath);
    }
  }

  protected willSetGeoPath(newGeoPath: GeoPath, oldGeoPath: GeoPath): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetGeoPath !== void 0) {
        traitObserver.traitWillSetGeoPath(newGeoPath, oldGeoPath, this);
      }
    }
  }

  protected onSetGeoPath(newGeoPath: GeoPath, oldGeoPath: GeoPath): void {
    // hook
  }

  protected didSetGeoPath(newGeoPath: GeoPath, oldGeoPath: GeoPath): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetGeoPath !== void 0) {
        traitObserver.traitDidSetGeoPath(newGeoPath, oldGeoPath, this);
      }
    }
  }
}
