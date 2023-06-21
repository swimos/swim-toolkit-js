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
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import {Property} from "@swim/component";
import type {GeoBox} from "@swim/geo";
import type {ControllerObserver} from "@swim/controller";
import {Controller} from "@swim/controller";
import type {TraitViewRef} from "@swim/controller";
import type {GeoView} from "./GeoView";
import type {GeoTrait} from "./GeoTrait";

/** @public */
export interface GeoControllerObserver<C extends GeoController = GeoController> extends ControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoView, controller: C): void;

  controllerWillSetGeoBounds?(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, controller: C): void;

  controllerDidSetGeoBounds?(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, controller: C): void;
}

/** @public */
export abstract class GeoController extends Controller {
  declare readonly observerType?: Class<GeoControllerObserver>;

  @Property({valueType: Timing, inherits: true})
  readonly geoTiming!: Property<this, Timing | boolean | undefined, AnyTiming | boolean | undefined>;

  abstract readonly geo: TraitViewRef<this, GeoTrait, GeoView>;
}
