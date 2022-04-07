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
import {AnyLength, Length} from "@swim/math";
import {AnyColorOrLook, ColorOrLook, ColorLook} from "@swim/theme";
import {SeriesPlotTrait} from "./SeriesPlotTrait";
import type {LinePlotTraitObserver} from "./LinePlotTraitObserver";
import type {SeriesPlotController} from "./SeriesPlotController";
import {LinePlotController} from "./"; // forward import

/** @public */
export class LinePlotTrait<X = unknown, Y = unknown> extends SeriesPlotTrait<X, Y> {
  override readonly observerType?: Class<LinePlotTraitObserver<X, Y>>;

  @PropertyDef<LinePlotTrait<X, Y>["stroke"]>({
    valueType: ColorLook,
    value: null,
    didSetValue(stroke: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetStroke", stroke, this.owner);
    },
  })
  readonly stroke!: PropertyDef<this, {value: ColorOrLook | null, valueInit: AnyColorOrLook | null}>;

  @PropertyDef<LinePlotTrait<X, Y>["strokeWidth"]>({
    valueType: Length,
    value: null,
    didSetValue(strokeWidth: Length | null): void {
      this.owner.callObservers("traitDidSetStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly strokeWidth!: PropertyDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  override createPlotController(): SeriesPlotController<X, Y> {
    return new LinePlotController<X, Y>();
  }
}
