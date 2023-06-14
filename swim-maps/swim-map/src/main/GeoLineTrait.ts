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
import {Property} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyColorOrLook} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {ColorLook} from "@swim/theme";
import type {GeoController} from "./GeoController";
import type {GeoPathTraitObserver} from "./GeoPathTrait";
import {GeoPathTrait} from "./GeoPathTrait";
import {GeoLineController} from "./"; // forward import

/** @public */
export interface GeoLineTraitObserver<T extends GeoLineTrait = GeoLineTrait> extends GeoPathTraitObserver<T> {
  traitDidSetStroke?(stroke: ColorOrLook | null, trait: T): void;

  traitDidSetStrokeWidth?(strokeWidth: Length | null, trait: T): void;
}

/** @public */
export abstract class GeoLineTrait extends GeoPathTrait {
  override readonly observerType?: Class<GeoLineTraitObserver>;

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
    return new GeoLineController();
  }
}
