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
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyGeoShape} from "@swim/geo";
import {GeoShape} from "@swim/geo";
import type {AnyNumberOrLook} from "@swim/theme";
import type {NumberOrLook} from "@swim/theme";
import {NumberLook} from "@swim/theme";
import type {AnyColorOrLook} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {ColorLook} from "@swim/theme";
import {TraitViewRef} from "@swim/controller";
import {GeoShapeView} from "./GeoShapeView";
import {GeoShapeTrait} from "./GeoShapeTrait";
import type {GeoControllerObserver} from "./GeoController";
import {GeoController} from "./GeoController";

/** @public */
export interface GeoShapeControllerObserver<C extends GeoShapeController = GeoShapeController> extends GeoControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoShapeTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoShapeTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoShapeView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoShapeView, controller: C): void;

  controllerDidSetGeoShape?(geoShape: GeoShape | null, controller: C): void;
}

/** @public */
export class GeoShapeController extends GeoController {
  declare readonly observerType?: Class<GeoShapeControllerObserver>;

  @TraitViewRef({
    extends: true,
    traitType: GeoShapeTrait,
    initTrait(geoTrait: GeoShapeTrait): void {
      super.initTrait(geoTrait);
      this.owner.geoShape.bindInlet(geoTrait.geoShape);
      this.owner.fill.bindInlet(geoTrait.fill);
      this.owner.fillOpacity.bindInlet(geoTrait.fillOpacity);
      this.owner.stroke.bindInlet(geoTrait.stroke);
      this.owner.strokeOpacity.bindInlet(geoTrait.strokeOpacity);
      this.owner.strokeWidth.bindInlet(geoTrait.strokeWidth);
    },
    deinitTrait(geoTrait: GeoShapeTrait): void {
      this.owner.geoShape.unbindInlet(geoTrait.geoShape);
      this.owner.fill.unbindInlet(geoTrait.fill);
      this.owner.fillOpacity.unbindInlet(geoTrait.fillOpacity);
      this.owner.stroke.unbindInlet(geoTrait.stroke);
      this.owner.strokeOpacity.unbindInlet(geoTrait.strokeOpacity);
      this.owner.strokeWidth.unbindInlet(geoTrait.strokeWidth);
      super.deinitTrait(geoTrait);
    },
    viewType: GeoShapeView,
    initView(geoView: GeoShapeView): void {
      super.initView(geoView);
      geoView.geoShape.bindInlet(this.owner.geoShape);
      geoView.fill.bindInlet(this.owner.fill);
      geoView.fillOpacity.bindInlet(this.owner.fillOpacity);
      geoView.stroke.bindInlet(this.owner.stroke);
      geoView.strokeOpacity.bindInlet(this.owner.strokeOpacity);
      geoView.strokeWidth.bindInlet(this.owner.strokeWidth);
    },
    deinitView(geoView: GeoShapeView): void {
      geoView.geoShape.unbindInlet(this.owner.geoShape);
      geoView.fill.unbindInlet(this.owner.fill);
      geoView.fillOpacity.unbindInlet(this.owner.fillOpacity);
      geoView.stroke.unbindInlet(this.owner.stroke);
      geoView.strokeOpacity.unbindInlet(this.owner.strokeOpacity);
      geoView.strokeWidth.unbindInlet(this.owner.strokeWidth);
      super.deinitView(geoView);
    },
  })
  override readonly geo!: TraitViewRef<this, GeoShapeTrait, GeoShapeView> & GeoController["geo"];

  @Property({
    valueType: GeoShape,
    value: null,
    didSetValue(geoShape: GeoShape | null): void {
      this.owner.callObservers("controllerDidSetGeoShape", geoShape, this.owner);
      this.owner.geoPerspective.setValue(geoShape, Affinity.Intrinsic);
    },
  })
  readonly geoShape!: Property<this, GeoShape | null, AnyGeoShape | null>;

  @Property({valueType: ColorLook, value: null})
  readonly fill!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({valueType: NumberLook})
  readonly fillOpacity!: Property<this, NumberOrLook | undefined, AnyNumberOrLook | undefined>;

  @Property({valueType: ColorLook, value: null})
  readonly stroke!: Property<this, ColorOrLook | null, AnyColorOrLook | null>;

  @Property({valueType: NumberLook})
  readonly strokeOpacity!: Property<this, NumberOrLook | undefined, AnyNumberOrLook | undefined>;

  @Property({valueType: Length, value: null})
  readonly strokeWidth!: Property<this, Length | null, AnyLength | null>;
}