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
import type {Observes} from "@swim/util";
import {Property} from "@swim/component";
import {View} from "@swim/view";
import type {ControllerObserver} from "@swim/controller";
import {Controller} from "@swim/controller";
import {TraitViewRef} from "@swim/controller";
import type {AnyGeoPerspective} from "./GeoPerspective";
import {GeoPerspective} from "./GeoPerspective";
import {GeoView} from "./GeoView";
import {GeoTrait} from "./GeoTrait";

/** @public */
export interface GeoControllerObserver<C extends GeoController = GeoController> extends ControllerObserver<C> {
  controllerDidSetGeoPerspective?(geoPerspective: GeoPerspective | null, controller: C): void;

  controllerWillAttachGeoTrait?(geoTrait: GeoTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoView, controller: C): void;
}

/** @public */
export class GeoController extends Controller {
  declare readonly observerType?: Class<GeoControllerObserver>;

  @Property({
    valueType: GeoPerspective,
    value: null,
    didSetValue(geoPerspective: GeoPerspective | null): void {
      this.owner.callObservers("controllerDidSetGeoPerspective", geoPerspective, this.owner);
    },
  })
  readonly geoPerspective!: Property<this, GeoPerspective | null, AnyGeoPerspective | null>;

  @Property({
    valueType: Number,
    value: 0,
    inherits: true,
    didSetValue(minVisibleZoom: number): void {
      this.owner.autoCull();
    },
  })
  readonly minVisibleZoom!: Property<this, number>;

  @Property({
    valueType: Number,
    value: Infinity,
    inherits: true,
    didSetValue(maxVisibleZoom: number): void {
      this.owner.autoCull();
    },
  })
  readonly maxVisibleZoom!: Property<this, number>;

  protected autoCull(): void {
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

    const isVisible = this.minVisibleZoom.value <= geoViewport.zoom
                   && geoViewport.zoom < this.maxVisibleZoom.value
                   && geoViewport.geoFrame.intersects(geoView.geoBounds);
    geoView.setCulled(!isVisible);
  }

  @Property({
    valueType: Number,
    value: 0,
    inherits: true,
    didSetValue(minConsumeZoom: number): void {
      this.owner.autoConsume();
    },
  })
  readonly minConsumeZoom!: Property<this, number>;

  @Property({
    valueType: Number,
    value: Infinity,
    inherits: true,
    didSetValue(maxConsumeZoom: number): void {
      this.owner.autoConsume();
    },
  })
  readonly maxConsumeZoom!: Property<this, number>;

  protected autoConsume(): void {
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

    const isConsumable = this.minConsumeZoom.value <= geoViewport.zoom
                          && geoViewport.zoom < this.maxConsumeZoom.value
                          && geoViewport.geoFrame.intersects(geoView.geoBounds);
    if (isConsumable) {
      this.consume(geoView);
    } else {
      this.unconsume(geoView);
    }
  }

  @Property({valueType: Timing, inherits: true})
  get geoTiming(): Property<this, Timing | boolean | undefined, AnyTiming | boolean | undefined> {
    return Property.dummy();
  }

  @TraitViewRef({
    traitType: GeoTrait,
    willAttachTrait(geoTrait: GeoTrait): void {
      this.owner.callObservers("controllerWillAttachGeoTrait", geoTrait, this.owner);
    },
    initTrait(geoTrait: GeoTrait): void {
      this.owner.geoPerspective.bindInlet(geoTrait.geoPerspective);
    },
    deinitTrait(geoTrait: GeoTrait): void {
      this.owner.geoPerspective.unbindInlet(geoTrait.geoPerspective);
    },
    didDetachTrait(geoTrait: GeoTrait): void {
      this.owner.callObservers("controllerDidDetachGeoTrait", geoTrait, this.owner);
    },
    viewType: GeoView,
    observesView: true,
    willAttachView(geoView: GeoView): void {
      geoView.setCulled(true);
      geoView.requireUpdate(View.NeedsProject);
      this.owner.callObservers("controllerWillAttachGeoView", geoView, this.owner);
    },
    didDetachView(geoView: GeoView): void {
      this.owner.callObservers("controllerDidDetachGeoView", geoView, this.owner);
    },
    viewDidProject(geoView: GeoView): void {
      this.owner.autoCull();
      this.owner.autoConsume();
    },
  })
  readonly geo!: TraitViewRef<this, GeoTrait, GeoView> & Observes<GeoView>;
}
