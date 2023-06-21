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

import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import {GeoBox} from "@swim/geo";
import type {Model} from "@swim/model";
import type {Trait} from "@swim/model";
import {TraitSet} from "@swim/model";
import type {GeoTraitObserver} from "./GeoTrait";
import {GeoTrait} from "./GeoTrait";
import type {GeoController} from "./GeoController";
import {GeoLayerController} from "./"; // forward import

/** @public */
export interface GeoLayerTraitObserver<T extends GeoLayerTrait = GeoLayerTrait> extends GeoTraitObserver<T> {
  traitWillAttachFeature?(featureTrait: GeoTrait, trait: T): void;

  traitDidDetachFeature?(featureTrait: GeoTrait, trait: T): void;
}

/** @public */
export class GeoLayerTrait extends GeoTrait {
  constructor() {
    super();
    this.geoBounds = GeoBox.globe();
  }

  declare readonly observerType?: Class<GeoLayerTraitObserver>;

  override readonly geoBounds: GeoBox;

  setGeoBounds(newGeoBounds: GeoBox): void {
    const oldGeoBounds = this.geoBounds;
    if (!newGeoBounds.equals(oldGeoBounds)) {
      this.willSetGeoBounds(newGeoBounds, oldGeoBounds);
      (this as Mutable<this>).geoBounds = newGeoBounds;
      this.onSetGeoBounds(newGeoBounds, oldGeoBounds);
      this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
    }
  }

  protected willSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    this.callObservers("traitWillSetGeoBounds", newGeoBounds, oldGeoBounds, this);
  }

  protected onSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    // hook
  }

  protected didSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    this.callObservers("traitDidSetGeoBounds", newGeoBounds, oldGeoBounds, this);
  }

  @TraitSet({
    traitType: GeoTrait,
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
    detectModel(model: Model): GeoTrait | null {
      return model.getTrait(GeoTrait);
    },
    detectTrait(trait: Trait): GeoTrait | null {
      return null;
    },
  })
  readonly features!: TraitSet<this, GeoTrait>;

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
