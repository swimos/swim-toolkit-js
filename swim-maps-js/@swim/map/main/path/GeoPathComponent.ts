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

import type {ComponentViewTrait} from "@swim/component";
import {GeoComponent} from "../geo/GeoComponent";
import type {GeoPathView} from "./GeoPathView";
import type {GeoPathTrait} from "./GeoPathTrait";
import type {GeoPathComponentObserver} from "./GeoPathComponentObserver";

export abstract class GeoPathComponent extends GeoComponent {
  declare readonly componentObservers: ReadonlyArray<GeoPathComponentObserver>;

  abstract readonly geo: ComponentViewTrait<this, GeoPathView, GeoPathTrait>;
}
