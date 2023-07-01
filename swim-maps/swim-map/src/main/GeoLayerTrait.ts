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
import type {AnyGeoBox} from "@swim/geo";
import {GeoBox} from "@swim/geo";
import {Model} from "@swim/model";
import {TraitModelSet} from "@swim/model";
import type {GeoTraitObserver} from "./GeoTrait";
import {GeoTrait} from "./GeoTrait";
import type {GeoController} from "./GeoController";
import {GeoLayerController} from "./"; // forward import

/** @public */
export interface GeoLayerTraitObserver<T extends GeoLayerTrait = GeoLayerTrait> extends GeoTraitObserver<T> {
  traitDidSetGeoBounds?(geoBoubnds: GeoBox | null, trait: T): void;

  traitWillAttachFeature?(featureTrait: GeoTrait, trait: T): void;

  traitDidDetachFeature?(featureTrait: GeoTrait, trait: T): void;
}

/** @public */
export class GeoLayerTrait extends GeoTrait {
  declare readonly observerType?: Class<GeoLayerTraitObserver>;

  @Property({
    valueType: GeoBox,
    value: null,
    didSetValue(geoBounds: GeoBox | null): void {
      this.owner.callObservers("traitDidSetGeoBounds", geoBounds, this.owner);
      this.owner.geoPerspective.setValue(geoBounds, Affinity.Intrinsic);
    },
  })
  readonly geoBounds!: Property<this, GeoBox | null, AnyGeoBox | null>;

  @TraitModelSet({
    traitType: GeoTrait,
    traitKey: "feature",
    modelType: Model,
    binds: true,
    willAttachTrait(featureTrait: GeoTrait): void {
      this.owner.callObservers("traitWillAttachFeature", featureTrait, this.owner);
    },
    didAttachTrait(featureTrait: GeoTrait): void {
      if (this.owner.consuming) {
        featureTrait.consume(this.owner);
      }
    },
    willDetachTrait(featureTrait: GeoTrait): void {
      if (this.owner.consuming) {
        featureTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(featureTrait: GeoTrait): void {
      this.owner.callObservers("traitDidDetachFeature", featureTrait, this.owner);
    },
  })
  readonly features!: TraitModelSet<this, GeoTrait, Model>;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.features.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.features.unconsumeTraits(this);
  }

  override createGeoController(): GeoController {
    return new GeoLayerController();
  }
}
