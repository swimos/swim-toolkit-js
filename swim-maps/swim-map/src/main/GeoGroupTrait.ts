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
import {GeoGroup} from "@swim/geo";
import type {AnyColorOrLook} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {ColorLook} from "@swim/theme";
import type {GeoController} from "./GeoController";
import type {GeoTraitObserver} from "./GeoTrait";
import {GeoTrait} from "./GeoTrait";
import {GeoGroupController} from "./"; // forward import

/** @public */
export interface GeoGroupTraitObserver<T extends GeoGroupTrait = GeoGroupTrait> extends GeoTraitObserver<T> {
  traitDidSetGeoGroup?(geoGroup: GeoGroup | null, trait: T): void;

  traitDidSetFill?(fill: ColorOrLook | null, trait: T): void;

  traitDidSetStroke?(stroke: ColorOrLook | null, trait: T): void;

  traitDidSetStrokeWidth?(strokeWidth: Length | null, trait: T): void;
}

/** @public */
export class GeoGroupTrait extends GeoTrait {
  declare readonly observerType?: Class<GeoGroupTraitObserver>;

  @Property({
    valueType: GeoGroup,
    value: null,
    didSetValue(geoGroup: GeoGroup | null): void {
      this.owner.callObservers("traitDidSetGeoGroup", geoGroup, this.owner);
      this.owner.geoPerspective.setValue(geoGroup, Affinity.Intrinsic);
    },
  })
  readonly geoGroup!: Property<this, GeoGroup | null>;

  @Property({
    valueType: ColorLook,
    value: null,
    didSetValue(fill: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetFill", fill, this.owner);
    },
  })
  readonly fill!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({
    valueType: ColorLook,
    value: null,
    didSetValue(stroke: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetStroke", stroke, this.owner);
    },
  })
  readonly stroke!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({
    valueType: Length,
    value: null,
    didSetValue(strokeWidth: Length | null): void {
      this.owner.callObservers("traitDidSetStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly strokeWidth!: Property<this, Length | null, AnyLength | null>;

  override createGeoController(): GeoController {
    return new GeoGroupController();
  }
}
