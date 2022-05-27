// Copyright 2015-2022 Swim.inc
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

import type {Class} from "@swim/util";
import {PropertyDef} from "@swim/component";
import {AnyGeoPath, GeoPath, GeoBox} from "@swim/geo";
import {GeoTrait} from "../geo/GeoTrait";
import type {GeoPathTraitObserver} from "./GeoPathTraitObserver";

/** @public */
export abstract class GeoPathTrait extends GeoTrait {
  override readonly observerType?: Class<GeoPathTraitObserver>;

  override get geoBounds(): GeoBox {
    const geoPath = this.geoPath.value;
    return geoPath !== null ? geoPath.bounds : GeoBox.undefined();
  }

  @PropertyDef<GeoPathTrait["geoPath"]>({
    valueType: GeoPath,
    value: null,
    didSetValue(geoPath: GeoPath | null): void {
      this.owner.callObservers("traitDidSetGeoPath", geoPath, this.owner);
    },
  })
  readonly geoPath!: PropertyDef<this, {value: GeoPath | null, valueInit: AnyGeoPath | null}>;
}
