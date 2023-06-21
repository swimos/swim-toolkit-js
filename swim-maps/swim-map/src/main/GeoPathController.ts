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
import type {GeoPath} from "@swim/geo";
import type {TraitViewRef} from "@swim/controller";
import type {GeoPathView} from "./GeoPathView";
import type {GeoPathTrait} from "./GeoPathTrait";
import type {GeoControllerObserver} from "./GeoController";
import {GeoController} from "./GeoController";

/** @public */
export interface GeoPathControllerObserver<C extends GeoPathController = GeoPathController> extends GeoControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoPathTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoPathTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoPathView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoPathView, controller: C): void;

  controllerDidSetGeoPath?(geoPath: GeoPath | null, controller: C): void;
}

/** @public */
export abstract class GeoPathController extends GeoController {
  declare readonly observerType?: Class<GeoPathControllerObserver>;

  abstract override readonly geo: TraitViewRef<this, GeoPathTrait, GeoPathView>;
}
