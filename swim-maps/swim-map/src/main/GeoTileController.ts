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
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyUri} from "@swim/uri";
import type {Uri} from "@swim/uri";
import type {GeoTile} from "@swim/geo";
import type {Trait} from "@swim/model";
import type {Controller} from "@swim/controller";
import {TraitViewRef} from "@swim/controller";
import {TraitViewControllerRef} from "@swim/controller";
import {TraitViewControllerSet} from "@swim/controller";
import type {GeoView} from "./GeoView";
import type {GeoTrait} from "./GeoTrait";
import {GeoController} from "./GeoController";
import type {GeoLayerControllerObserver} from "./GeoLayerController";
import {GeoLayerController} from "./GeoLayerController";
import {GeoTileView} from "./GeoTileView";
import {GeoTileTrait} from "./GeoTileTrait";

/** @public */
export interface GeoTileControllerObserver<C extends GeoTileController = GeoTileController> extends GeoLayerControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoTileTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoTileTrait, controller: C): void;

  controllerWillAttachTile?(tileController: GeoTileController, controller: C): void;

  controllerDidDetachTile?(tileController: GeoTileController, controller: C): void;

  controllerWillAttachTileTrait?(tileTrait: GeoTrait, tileController: GeoTileController, controller: C): void;

  controllerDidDetachTileTrait?(tileTrait: GeoTrait, tileController: GeoTileController, controller: C): void;

  controllerWillAttachTileView?(tileView: GeoView, tileController: GeoTileController, controller: C): void;

  controllerDidDetachTileView?(tileView: GeoView, tileController: GeoTileController, controller: C): void;
}

/** @public */
export class GeoTileController extends GeoLayerController {
  constructor(geoTile: GeoTile) {
    super();
    this.geoTile = geoTile;
    this.minVisibleZoom.setValue(geoTile.z, Affinity.Intrinsic);
    this.maxVisibleZoom.setValue(geoTile.z + 1, Affinity.Intrinsic);
    this.minConsumeZoom.setValue(geoTile.z, Affinity.Intrinsic);
    this.maxConsumeZoom.setValue(geoTile.z + 1, Affinity.Intrinsic);
  }

  declare readonly observerType?: Class<GeoTileControllerObserver>;

  readonly geoTile: GeoTile;

  @Property({extends: true, inherits: false})
  override get nodeUri(): Property<this, Uri | null, AnyUri | null> {
    return Property.dummy();
  }

  protected override autoConsume(): void {
    if (!this.mounted) {
      return;
    }
    const geoView = this.geo.view;
    if (geoView === null) {
      return;
    }
    const geoViewport = geoView.geoViewport.value;
    if (geoViewport === null) {
      return;
    }

    const intersectsViewport = geoViewport.geoFrame.intersects(geoView.geoBounds);
    const isConsumable = this.minConsumeZoom.value <= geoViewport.zoom
                      && geoViewport.zoom < this.maxConsumeZoom.value
                      && intersectsViewport;

    if (intersectsViewport && this.maxConsumeZoom.value <= geoViewport.zoom) {
      const geoTrait = this.geo.trait;
      if (geoTrait !== null) {
        geoTrait.tiles.insert();
      }
      this.tiles.insert();
    } else if (!intersectsViewport || geoViewport.zoom < this.minConsumeZoom.value) {
      const geoTrait = this.geo.trait;
      if (geoTrait !== null) {
        geoTrait.tiles.delete();
      }
      this.tiles.delete();
    }

    if (isConsumable) {
      this.consume(geoView);
    } else {
      this.unconsume(geoView);
    }
  }

  @TraitViewRef({
    extends: true,
    consumed: true,
    traitType: GeoTileTrait,
    observesTrait: true,
    initTrait(geoTrait: GeoTileTrait): void {
      super.initTrait(geoTrait);
      this.owner.tiles.addTraits(geoTrait.tiles.traits);
    },
    deinitTrait(geoTrait: GeoTileTrait): void {
      this.owner.tiles.deleteTraits(geoTrait.tiles.traits);
      super.deinitTrait(geoTrait);
    },
    traitWillAttachTile(tileTrait: GeoTileTrait, targetTrait: Trait): void {
      this.owner.tiles.addTrait(tileTrait, targetTrait);
    },
    traitDidDetachTile(tileTrait: GeoTileTrait): void {
      this.owner.tiles.deleteTrait(tileTrait);
    },
    viewType: GeoTileView,
    observesView: true,
    initView(geoView: GeoView): void {
      super.initView(geoView);
      const tileControllers = this.owner.tiles.controllers;
      for (const controllerId in tileControllers) {
        const tileController = tileControllers[controllerId]!;
        const tileView = tileController.geo.view;
        if (tileView !== null && tileView.parent === null) {
          tileController.geo.insertView(geoView);
        }
      }
    },
    deinitView(geoView: GeoView): void {
      this.owner.unconsume(geoView);
      super.deinitView(geoView);
    },
    createView(): GeoTileView {
      return new GeoTileView(this.owner.geoTile);
    },
  })
  override readonly geo!: TraitViewRef<this, GeoTileTrait, GeoView> & GeoLayerController["geo"] & Observes<GeoTileTrait> & Observes<GeoTileView>;

  @TraitViewControllerSet({
    extends: true,
    detectController(controller: Controller): GeoController | null {
      return controller instanceof GeoController && !(controller instanceof GeoTileController) ? controller : null;
    },
  })
  override readonly features!: TraitViewControllerSet<this, GeoTrait, GeoView, GeoController> & GeoLayerController["features"];

  @TraitViewControllerSet({
    get controllerType(): typeof GeoTileController {
      return GeoTileController;
    },
    binds: true,
    observes: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(tileController: GeoTileController): TraitViewRef<unknown, GeoTileTrait, GeoView> {
      return tileController.geo;
    },
    willAttachController(tileController: GeoTileController): void {
      this.owner.callObservers("controllerWillAttachTile", tileController, this.owner);
    },
    didAttachController(tileController: GeoTileController): void {
      const tileTrait = tileController.geo.trait;
      if (tileTrait !== null) {
        this.attachTileTrait(tileTrait, tileController);
      }
      const tileView = tileController.geo.view;
      if (tileView !== null) {
        this.attachTileView(tileView, tileController);
      }
    },
    willDetachController(tileController: GeoTileController): void {
      const tileView = tileController.geo.view;
      if (tileView !== null) {
        this.detachTileView(tileView, tileController);
      }
      const tileTrait = tileController.geo.trait;
      if (tileTrait !== null) {
        this.detachTileTrait(tileTrait, tileController);
      }
    },
    didDetachController(tileController: GeoTileController): void {
      this.owner.callObservers("controllerDidDetachTile", tileController, this.owner);
    },
    controllerWillAttachGeoTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void {
      this.owner.callObservers("controllerWillAttachTileTrait", tileTrait, tileController, this.owner);
      this.attachTileTrait(tileTrait, tileController);
    },
    controllerDidDetachGeoTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void {
      this.detachTileTrait(tileTrait, tileController);
      this.owner.callObservers("controllerDidDetachTileTrait", tileTrait, tileController, this.owner);
    },
    attachTileTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void {
      // hook
    },
    detachTileTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void {
      this.deleteController(tileController);
    },
    controllerWillAttachGeoView(tileView: GeoView, tileController: GeoTileController): void {
      this.owner.callObservers("controllerWillAttachTileView", tileView, tileController, this.owner);
      this.attachTileView(tileView, tileController);
    },
    controllerDidDetachGeoView(tileView: GeoView, tileController: GeoTileController): void {
      this.detachTileView(tileView, tileController);
      this.owner.callObservers("controllerDidDetachTileView", tileView, tileController, this.owner);
    },
    attachTileView(tileView: GeoView, tileController: GeoTileController): void {
      const geoView = this.owner.geo.view;
      if (geoView !== null && tileView.parent === null) {
        tileController.geo.insertView(geoView);
      }
    },
    detachTileView(tileView: GeoView, tileController: GeoTileController): void {
      tileView.remove();
    },
    createController(tileTrait?: GeoTileTrait): GeoTileController {
      if (tileTrait !== void 0) {
        return this.owner.createTileController(tileTrait.geoTile, tileTrait);
      }
      return super.createController();
    },
    insert(): void {
      this.owner.southWest.insertController();
      this.owner.northWest.insertController();
      this.owner.southEast.insertController();
      this.owner.northEast.insertController();
    },
    delete(): void {
      this.owner.southWest.deleteController();
      this.owner.northWest.deleteController();
      this.owner.southEast.deleteController();
      this.owner.northEast.deleteController();
    },
  })
  readonly tiles!: TraitViewControllerSet<this, GeoTileTrait, GeoView, GeoTileController> & Observes<GeoTileController> & {
    attachTileTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void;
    detachTileTrait(tileTrait: GeoTileTrait, tileController: GeoTileController): void;
    attachTileView(tileView: GeoView, tileController: GeoTileController): void;
    detachTileView(tileView: GeoView, tileController: GeoTileController): void;
    insert(): void;
    delete(): void;
  };

  @TraitViewControllerRef({
    get controllerType(): typeof GeoTileController {
      return GeoTileController;
    },
    controllerKey: true,
    binds: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(tileController: GeoTileController): TraitViewRef<unknown, GeoTileTrait, GeoView> {
      return tileController.geo;
    },
    createController(tileTrait?: GeoTileTrait): GeoTileController {
      return this.owner.createTileController(this.owner.geoTile.southWestTile, tileTrait);
    },
  })
  readonly southWest!: TraitViewControllerRef<this, GeoTileTrait, GeoView, GeoTileController>;

  @TraitViewControllerRef({
    get controllerType(): typeof GeoTileController {
      return GeoTileController;
    },
    controllerKey: true,
    binds: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(tileController: GeoTileController): TraitViewRef<unknown, GeoTileTrait, GeoView> {
      return tileController.geo;
    },
    createController(tileTrait?: GeoTileTrait): GeoTileController {
      return this.owner.createTileController(this.owner.geoTile.northWestTile, tileTrait);
    },
  })
  readonly northWest!: TraitViewControllerRef<this, GeoTileTrait, GeoView, GeoTileController>;

  @TraitViewControllerRef({
    get controllerType(): typeof GeoTileController {
      return GeoTileController;
    },
    controllerKey: true,
    binds: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(tileController: GeoTileController): TraitViewRef<unknown, GeoTileTrait, GeoView> {
      return tileController.geo;
    },
    createController(tileTrait?: GeoTileTrait): GeoTileController {
      return this.owner.createTileController(this.owner.geoTile.southEastTile, tileTrait);
    },
  })
  readonly southEast!: TraitViewControllerRef<this, GeoTileTrait, GeoView, GeoTileController>;

  @TraitViewControllerRef({
    get controllerType(): typeof GeoTileController {
      return GeoTileController;
    },
    controllerKey: true,
    binds: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(tileController: GeoTileController): TraitViewRef<unknown, GeoTileTrait, GeoView> {
      return tileController.geo;
    },
    createController(tileTrait?: GeoTileTrait): GeoTileController {
      return this.owner.createTileController(this.owner.geoTile.northEastTile, tileTrait);
    },
  })
  readonly northEast!: TraitViewControllerRef<this, GeoTileTrait, GeoView, GeoTileController>;

  protected createTileController(geoTile: GeoTile, tileTrait?: GeoTileTrait | null): GeoTileController {
    return new GeoTileController(geoTile);
  }

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.tiles.insert();
  }
}
