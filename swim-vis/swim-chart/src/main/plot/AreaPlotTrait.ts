// Copyright 2015-2022 Swim.inc
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
import {PropertyDef} from "@swim/component";
import {AnyColorOrLook, ColorOrLook, ColorLook} from "@swim/theme";
import {SeriesPlotTrait} from "./SeriesPlotTrait";
import type {AreaPlotTraitObserver} from "./AreaPlotTraitObserver";
import type {SeriesPlotController} from "./SeriesPlotController";
import {AreaPlotController} from "./"; // forward import

/** @public */
export class AreaPlotTrait<X = unknown, Y = unknown> extends SeriesPlotTrait<X, Y> {
  override readonly observerType?: Class<AreaPlotTraitObserver<X, Y>>;

  @PropertyDef<AreaPlotTrait<X, Y>["fill"]>({
    valueType: ColorLook,
    value: null,
    didSetValue(fill: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetFill", fill, this.owner);
    },
  })
  readonly fill!: PropertyDef<this, {value: ColorOrLook | null, valueInit: AnyColorOrLook | null}>;

  override createPlotController(): SeriesPlotController<X, Y> {
    return new AreaPlotController<X, Y>();
  }
}
