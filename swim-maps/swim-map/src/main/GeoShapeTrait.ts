// Copyright 2015-2023 Swim.inc
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
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyGeoShape} from "@swim/geo";
import {GeoShape} from "@swim/geo";
import type {AnyNumberOrLook} from "@swim/theme";
import type {NumberOrLook} from "@swim/theme";
import {NumberLook} from "@swim/theme";
import type {AnyColorOrLook} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {ColorLook} from "@swim/theme";
import type {GeoTraitObserver} from "./GeoTrait";
import {GeoTrait} from "./GeoTrait";
import type {GeoController} from "./GeoController";
import {GeoShapeController} from "./"; // forward import

/** @public */
export interface GeoShapeTraitObserver<T extends GeoShapeTrait = GeoShapeTrait> extends GeoTraitObserver<T> {
  traitDidSetGeoShape?(geoShape: GeoShape | null, trait: T): void;
}

/** @public */
export class GeoShapeTrait extends GeoTrait {
  declare readonly observerType?: Class<GeoShapeTraitObserver>;

  @Property({
    valueType: GeoShape,
    value: null,
    didSetValue(geoShape: GeoShape | null): void {
      this.owner.callObservers("traitDidSetGeoShape", geoShape, this.owner);
      this.owner.geoPerspective.setValue(geoShape, Affinity.Intrinsic);
    },
  })
  readonly geoShape!: Property<this, GeoShape | null, AnyGeoShape | null>;

  @Property({valueType: ColorLook, value: null})
  readonly fill!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({valueType: NumberLook})
  readonly fillOpacity!: Property<this, NumberOrLook | undefined, AnyNumberOrLook | undefined>;

  @Property({valueType: ColorLook, value: null})
  readonly stroke!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({valueType: NumberLook})
  readonly strokeOpacity!: Property<this, NumberOrLook | undefined, AnyNumberOrLook | undefined>;

  @Property({valueType: Length, value: null})
  readonly strokeWidth!: Property<this, Length | null, AnyLength | null>;

  override createGeoController(): GeoController {
    return new GeoShapeController();
  }
}
