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
import type {AnyUri} from "@swim/uri";
import type {Uri} from "@swim/uri";
import type {GeoTile} from "@swim/geo";
import {Model} from "@swim/model";
import {TraitModelRef} from "@swim/model";
import {TraitModelSet} from "@swim/model";
import type {GeoTrait} from "./GeoTrait";
import type {GeoLayerTraitObserver} from "./GeoLayerTrait";
import {GeoLayerTrait} from "./GeoLayerTrait";

/** @public */
export interface GeoTileTraitObserver<T extends GeoTileTrait = GeoTileTrait> extends GeoLayerTraitObserver<T> {
  traitWillAttachTile?(tileTrait: GeoTileTrait, trait: T): void;

  traitDidDetachTile?(tileTrait: GeoTileTrait, trait: T): void;
}

/** @public */
export class GeoTileTrait extends GeoLayerTrait {
  constructor(geoTile: GeoTile) {
    super();
    this.geoTile = geoTile;
  }

  declare readonly observerType?: Class<GeoTileTraitObserver>;

  readonly geoTile: GeoTile;

  @Property({extends: true, inherits: false})
  override get nodeUri(): Property<this, Uri | null, AnyUri | null> {
    return Property.dummy();
  }

  @TraitModelSet({
    extends: true,
    detectModelTrait(model: Model): GeoTrait | null {
      const geoTrait = super.detectModelTrait(model) as GeoTrait | null;
      return !(geoTrait instanceof GeoTileTrait) ? geoTrait : null;
    },
  })
  override readonly features!: TraitModelSet<this, GeoTrait, Model> & GeoLayerTrait["features"];

  @TraitModelSet({
    get traitType(): typeof GeoTileTrait {
      return GeoTileTrait;
    },
    traitKey: "tile",
    modelType: Model,
    binds: true,
    willAttachTrait(tileTrait: GeoTileTrait): void {
      this.owner.callObservers("traitWillAttachTile", tileTrait, this.owner);
    },
    didDetachTrait(tileTrait: GeoTileTrait): void {
      this.owner.callObservers("traitDidDetachTile", tileTrait, this.owner);
    },
    insert(): void {
      this.owner.southWest.insertModel();
      this.owner.northWest.insertModel();
      this.owner.southEast.insertModel();
      this.owner.northEast.insertModel();
    },
    delete(): void {
      this.owner.southWest.deleteModel();
      this.owner.northWest.deleteModel();
      this.owner.southEast.deleteModel();
      this.owner.northEast.deleteModel();
    },
  })
  readonly tiles!: TraitModelSet<this, GeoTileTrait, Model> & {
    insert(): void;
    delete(): void;
  };

  @TraitModelRef({
    get traitType(): typeof GeoTileTrait {
      return GeoTileTrait;
    },
    traitKey: "tile",
    modelType: Model,
    modelKey: "southWest",
    binds: true,
    createTrait(): GeoTileTrait {
      return this.owner.createTileTrait(this.owner.geoTile.southWestTile);
    },
  })
  readonly southWest!: TraitModelRef<this, GeoTileTrait, Model>;

  @TraitModelRef({
    get traitType(): typeof GeoTileTrait {
      return GeoTileTrait;
    },
    traitKey: "tile",
    modelType: Model,
    modelKey: "northWest",
    binds: true,
    createTrait(): GeoTileTrait {
      return this.owner.createTileTrait(this.owner.geoTile.northWestTile);
    },
  })
  readonly northWest!: TraitModelRef<this, GeoTileTrait, Model>;

  @TraitModelRef({
    get traitType(): typeof GeoTileTrait {
      return GeoTileTrait;
    },
    traitKey: "tile",
    modelType: Model,
    modelKey: "southEast",
    binds: true,
    createTrait(): GeoTileTrait {
      return this.owner.createTileTrait(this.owner.geoTile.southEastTile);
    },
  })
  readonly southEast!: TraitModelRef<this, GeoTileTrait, Model>;

  @TraitModelRef({
    get traitType(): typeof GeoTileTrait {
      return GeoTileTrait;
    },
    traitKey: "tile",
    modelType: Model,
    modelKey: "northEast",
    binds: true,
    createTrait(): GeoTileTrait {
      return this.owner.createTileTrait(this.owner.geoTile.northEastTile);
    },
  })
  readonly northEast!: TraitModelRef<this, GeoTileTrait, Model>;

  protected createTileTrait(geoTile: GeoTile): GeoTileTrait {
    return new (this.constructor as typeof GeoTileTrait)(geoTile);
  }

  protected createTileModel(geoTile: GeoTile): Model | null {
    const tileTrait = this.createTileTrait(geoTile);
    if (tileTrait === null) {
      return null;
    }
    const tileModel = new Model();
    tileModel.setTrait("tile", tileTrait);
    return tileModel;
  }

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.tiles.insert();
  }
}
