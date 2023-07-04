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
import {Affinity} from "@swim/component";
import type {Length} from "@swim/math";
import type {GeoPath} from "@swim/geo";
import {Look} from "@swim/theme";
import {Mood} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {TraitViewRef} from "@swim/controller";
import {GeoAreaView} from "./GeoAreaView";
import {GeoAreaTrait} from "./GeoAreaTrait";
import type {GeoPathControllerObserver} from "./GeoPathController";
import {GeoPathController} from "./GeoPathController";

/** @public */
export interface GeoAreaControllerObserver<C extends GeoAreaController = GeoAreaController> extends GeoPathControllerObserver<C> {
  controllerWillAttachGeoTrait?(geoTrait: GeoAreaTrait, controller: C): void;

  controllerDidDetachGeoTrait?(geoTrait: GeoAreaTrait, controller: C): void;

  controllerWillAttachGeoView?(geoView: GeoAreaView, controller: C): void;

  controllerDidDetachGeoView?(geoView: GeoAreaView, controller: C): void;
}

/** @public */
export class GeoAreaController extends GeoPathController {
  declare readonly observerType?: Class<GeoAreaControllerObserver>;

  protected setGeoPath(geoPath: GeoPath | null, timing?: AnyTiming | boolean): void {
    const geoView = this.geo.view;
    if (geoView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.geoTiming.value;
      if (timing === true) {
        timing = geoView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromAny(timing);
    }
    geoView.geoPath.setState(geoPath, timing, Affinity.Intrinsic);
  }

  protected setFill(fill: ColorOrLook | null, timing?: AnyTiming | boolean): void {
    const geoView = this.geo.view;
    if (geoView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.geoTiming.value;
      if (timing === true) {
        timing = geoView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromAny(timing);
    }
    if (fill instanceof Look) {
      geoView.fill.setLook(fill, timing, Affinity.Intrinsic);
    } else {
      geoView.fill.setState(fill, timing, Affinity.Intrinsic);
    }
  }

  protected setStroke(stroke: ColorOrLook | null, timing?: AnyTiming | boolean): void {
    const geoView = this.geo.view;
    if (geoView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.geoTiming.value;
      if (timing === true) {
        timing = geoView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromAny(timing);
    }
    if (stroke instanceof Look) {
      geoView.stroke.setLook(stroke, timing, Affinity.Intrinsic);
    } else {
      geoView.stroke.setState(stroke, timing, Affinity.Intrinsic);
    }
  }

  protected setStrokeWidth(strokeWidth: Length | null, timing?: AnyTiming | boolean): void {
    const geoView = this.geo.view;
    if (geoView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.geoTiming.value;
      if (timing === true) {
        timing = geoView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromAny(timing);
    }
    geoView.strokeWidth.setState(strokeWidth, timing, Affinity.Intrinsic);
  }

  @TraitViewRef({
    extends: true,
    traitType: GeoAreaTrait,
    observesTrait: true,
    initTrait(geoTrait: GeoAreaTrait): void {
      super.initTrait(geoTrait);
      const geoView = this.view;
      if (geoView === null) {
        return;
      }
      this.owner.setGeoPath(geoTrait.geoPath.value);
      const fill = geoTrait.fill.value;
      if (fill !== null) {
        this.owner.setFill(fill);
      }
      const stroke = geoTrait.stroke.value;
      if (stroke !== null) {
        this.owner.setStroke(stroke);
      }
      const strokeWidth = geoTrait.strokeWidth.value;
      if (strokeWidth !== null) {
        this.owner.setStrokeWidth(strokeWidth);
      }
    },
    traitDidSetGeoPath(geoPath: GeoPath | null): void {
      this.owner.setGeoPath(geoPath);
    },
    traitDidSetFill(fill: ColorOrLook | null): void {
      this.owner.setFill(fill);
    },
    traitDidSetStroke(stroke: ColorOrLook | null): void {
      this.owner.setStroke(stroke);
    },
    traitDidSetStrokeWidth(strokeWidth: Length | null): void {
      this.owner.setStrokeWidth(strokeWidth);
    },
    viewType: GeoAreaView,
    observesView: true,
    initView(geoView: GeoAreaView): void {
      super.initView(geoView);
      const geoTrait = this.trait;
      if (geoTrait === null) {
        return;
      }
      this.owner.setGeoPath(geoTrait.geoPath.value);
      const fill = geoTrait.fill.value;
      if (fill !== null) {
        this.owner.setFill(fill);
      }
      const stroke = geoTrait.stroke.value;
      if (stroke !== null) {
        this.owner.setStroke(stroke);
      }
      const strokeWidth = geoTrait.strokeWidth.value;
      if (strokeWidth !== null) {
        this.owner.setStrokeWidth(strokeWidth);
      }
    },
    viewDidSetGeoPath(geoPath: GeoPath | null): void {
      this.owner.callObservers("controllerDidSetGeoPath", geoPath, this.owner);
    },
  })
  override readonly geo!: TraitViewRef<this, GeoAreaTrait, GeoAreaView> & GeoPathController["geo"] & Observes<GeoAreaTrait> & Observes<GeoAreaView>;
}
