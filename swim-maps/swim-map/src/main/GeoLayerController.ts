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
import {Property} from "@swim/component";
import type {GeoBox} from "@swim/geo";
import type {Trait} from "@swim/model";
import {TraitViewRef} from "@swim/controller";
import {TraitViewControllerSet} from "@swim/controller";
import type {GeoView} from "./GeoView";
import type {GeoTrait} from "./GeoTrait";
import type {GeoControllerObserver} from "./GeoController";
import {GeoController} from "./GeoController";
import {GeoTreeView} from "./GeoTreeView";
import {GeoLayerTrait} from "./GeoLayerTrait";

/** @public */
export interface GeoLayerControllerObserver<C extends GeoLayerController = GeoLayerController> extends GeoControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoLayerTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoLayerTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoView, controller: C): void;

  controllerWillAttachFeature?(featureController: GeoController, controller: C): void;

  controllerDidDetachFeature?(featureController: GeoController, controller: C): void;

  controllerWillAttachFeatureTrait?(featureTrait: GeoTrait, featureController: GeoController, controller: C): void;

  controllerDidDetachFeatureTrait?(featureTrait: GeoTrait, featureController: GeoController, controller: C): void;

  controllerWillAttachFeatureView?(featureView: GeoView, featureController: GeoController, controller: C): void;

  controllerDidDetachFeatureView?(featureView: GeoView, featureController: GeoController, controller: C): void;

  controllerWillSetFeatureGeoBounds?(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, featureController: GeoController, controller: C): void;

  controllerDidSetFeatureGeoBounds?(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, featureController: GeoController, controller: C): void;
}

/** @public */
export class GeoLayerController extends GeoController {
  declare readonly observerType?: Class<GeoLayerControllerObserver>;

  @Property({extends: true, inherits: false})
  override readonly minVisibleZoom!: Property<this, number>;

  @Property({extends: true, inherits: false})
  override readonly maxVisibleZoom!: Property<this, number>;

  protected override autoCull(): void {
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

    // Layer controllers ignore maxVisibleZoom;
    // child geo controllers inherit maxVisibleZoom and cull themselves.
    const isVisible = this.minVisibleZoom.value <= geoViewport.zoom
                   && geoViewport.geoFrame.intersects(geoView.geoBounds);
    geoView.setCulled(!isVisible);
  }

  @Property({extends: true, inherits: false})
  override readonly minConsumeZoom!: Property<this, number>;

  @Property({extends: true, inherits: false})
  override readonly maxConsumeZoom!: Property<this, number>;

  @TraitViewRef({
    extends: true,
    traitType: GeoLayerTrait,
    observesTrait: true,
    initTrait(geoTrait: GeoLayerTrait): void {
      super.initTrait(geoTrait);
      this.owner.features.addTraits(geoTrait.features.traits);
    },
    deinitTrait(geoTrait: GeoLayerTrait): void {
      this.owner.features.deleteTraits(geoTrait.features.traits);
      super.deinitTrait(geoTrait);
    },
    traitWillSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
      this.owner.callObservers("controllerWillSetGeoBounds", newGeoBounds, oldGeoBounds, this.owner);
    },
    traitDidSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
      this.owner.callObservers("controllerDidSetGeoBounds", newGeoBounds, oldGeoBounds, this.owner);
    },
    traitWillAttachFeature(featureTrait: GeoTrait, targetTrait: Trait | null): void {
      this.owner.features.addTrait(featureTrait, targetTrait);
    },
    traitDidDetachFeature(featureTrait: GeoTrait): void {
      this.owner.features.deleteTrait(featureTrait);
    },
    viewType: GeoTreeView,
    initView(geoView: GeoView): void {
      super.initView(geoView);
      const featureControllers = this.owner.features.controllers;
      for (const controllerId in featureControllers) {
        const featureController = featureControllers[controllerId]!;
        const featureView = featureController.geo.view;
        if (featureView !== null && featureView.parent === null) {
          featureController.geo.insertView(geoView);
        }
      }
    },
  })
  override readonly geo!: TraitViewRef<this, GeoLayerTrait, GeoView> & GeoController["geo"] & Observes<GeoLayerTrait>;

  @TraitViewControllerSet({
    controllerType: GeoController,
    binds: true,
    observes: true,
    get parentView(): GeoView | null {
      return this.owner.geo.view;
    },
    getTraitViewRef(featureController: GeoController): TraitViewRef<unknown, GeoTrait, GeoView> {
      return featureController.geo;
    },
    willAttachController(featureController: GeoController): void {
      this.owner.callObservers("controllerWillAttachFeature", featureController, this.owner);
    },
    didAttachController(featureController: GeoController): void {
      const featureTrait = featureController.geo.trait;
      if (featureTrait !== null) {
        this.attachFeatureTrait(featureTrait, featureController);
      }
      const featureView = featureController.geo.view;
      if (featureView !== null) {
        this.attachFeatureView(featureView, featureController);
      }
    },
    willDetachController(featureController: GeoController): void {
      const featureView = featureController.geo.view;
      if (featureView !== null) {
        this.detachFeatureView(featureView, featureController);
      }
      const featureTrait = featureController.geo.trait;
      if (featureTrait !== null) {
        this.detachFeatureTrait(featureTrait, featureController);
      }
    },
    didDetachController(featureController: GeoController): void {
      this.owner.callObservers("controllerDidDetachFeature", featureController, this.owner);
    },
    controllerWillAttachGeoTrait(featureTrait: GeoTrait, featureController: GeoController): void {
      this.owner.callObservers("controllerWillAttachFeatureTrait", featureTrait, featureController, this.owner);
      this.attachFeatureTrait(featureTrait, featureController);
    },
    controllerDidDetachGeoTrait(featureTrait: GeoTrait, featureController: GeoController): void {
      this.detachFeatureTrait(featureTrait, featureController);
      this.owner.callObservers("controllerDidDetachFeatureTrait", featureTrait, featureController, this.owner);
    },
    attachFeatureTrait(featureTrait: GeoTrait, featureController: GeoController): void {
      // hook
    },
    detachFeatureTrait(featureTrait: GeoTrait, featureController: GeoController): void {
      this.deleteController(featureController);
    },
    controllerWillAttachGeoView(featureView: GeoView, featureController: GeoController): void {
      this.owner.callObservers("controllerWillAttachFeatureView", featureView, featureController, this.owner);
      this.attachFeatureView(featureView, featureController);
    },
    controllerDidDetachGeoView(featureView: GeoView, featureController: GeoController): void {
      this.detachFeatureView(featureView, featureController);
      this.owner.callObservers("controllerDidDetachFeatureView", featureView, featureController, this.owner);
    },
    attachFeatureView(featureView: GeoView, featureController: GeoController): void {
      const geoView = this.owner.geo.view;
      if (geoView !== null && featureView.parent === null) {
        featureController.geo.insertView(geoView);
      }
    },
    detachFeatureView(featureView: GeoView, featureController: GeoController): void {
      featureView.remove();
    },
    controllerWillSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, featureController: GeoController): void {
      this.owner.callObservers("controllerWillSetFeatureGeoBounds", newGeoBounds, oldGeoBounds, featureController, this.owner);
    },
    controllerDidSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox, featureController: GeoController): void {
      this.owner.callObservers("controllerDidSetFeatureGeoBounds", newGeoBounds, oldGeoBounds, featureController, this.owner);
    },
    createController(featureTrait?: GeoTrait): GeoController {
      if (featureTrait !== void 0) {
        return featureTrait.createGeoController();
      }
      return super.createController();
    },
  })
  readonly features!: TraitViewControllerSet<this, GeoTrait, GeoView, GeoController> & Observes<GeoController> & {
    attachFeatureTrait(featureTrait: GeoTrait, featureController: GeoController): void,
    detachFeatureTrait(featureTrait: GeoTrait, featureController: GeoController): void,
    attachFeatureView(featureView: GeoView, featureController: GeoController): void,
    detachFeatureView(featureView: GeoView, featureController: GeoController): void,
  };
}
