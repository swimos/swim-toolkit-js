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
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {Graphics, AnyIconLayout, IconLayout} from "@swim/graphics";
import {GeoTrait} from "../geo/GeoTrait";
import type {GeoController} from "../geo/GeoController";
import type {GeoIconTraitObserver} from "./GeoIconTraitObserver";
import {GeoIconController} from "./"; // forward import

/** @public */
export class GeoIconTrait extends GeoTrait {
  override readonly observerType?: Class<GeoIconTraitObserver>;

  override get geoBounds(): GeoBox {
    const geoCenter = this.geoCenter.value;
    return geoCenter !== null ? geoCenter.bounds : GeoBox.undefined();
  }

  @PropertyDef<GeoIconTrait["geoCenter"]>({
    valueType: GeoPoint,
    value: null,
    didSetValue(newGeoCenter: GeoPoint | null, oldGeoCenter: GeoPoint | null): void {
      this.owner.callObservers("traitDidSetGeoCenter", newGeoCenter, this.owner);
    },
  })
  readonly geoCenter!: PropertyDef<this, {value: GeoPoint | null, valueInit: AnyGeoPoint | null}>;

  @PropertyDef<GeoIconTrait["iconLayout"]>({
    valueType: IconLayout,
    value: null,
    didSetValue(newIconLayout: IconLayout | null, oldIconLayout: IconLayout | null): void {
      this.owner.callObservers("traitDidSetIconLayout", newIconLayout, this.owner);
    },
  })
  readonly iconLayout!: PropertyDef<this, {value: IconLayout | null, valueInit: AnyIconLayout | null}>;

  @PropertyDef<GeoIconTrait["graphics"]>({
    valueType: Graphics,
    value: null,
    didSetValue(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
      this.owner.callObservers("traitDidSetGraphics", newGraphics, this.owner);
    },
  })
  readonly graphics!: PropertyDef<this, {value: Graphics | null}>;

  override createGeoController(): GeoController {
    return new GeoIconController();
  }
}
