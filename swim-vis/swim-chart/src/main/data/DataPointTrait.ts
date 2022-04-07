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
import {Trait} from "@swim/model";
import {AnyColorOrLook, ColorOrLook, ColorLook} from "@swim/theme";
import type {DataPointTraitObserver} from "./DataPointTraitObserver";

/** @public */
export class DataPointTrait<X = unknown, Y = unknown> extends Trait {
  constructor(x: X, y: Y) {
    super();
    this.x.setValue(x);
    this.y.setValue(y);
  }

  override readonly observerType?: Class<DataPointTraitObserver<X, Y>>;

  @PropertyDef<DataPointTrait<X, Y>["x"]>({
    didSetValue(x: X): void {
      this.owner.callObservers("traitDidSetX", x, this.owner);
    },
  })
  readonly x!: PropertyDef<this, {value: X}>;

  @PropertyDef<DataPointTrait<X, Y>["y"]>({
    didSetValue(y: Y): void {
      this.owner.callObservers("traitDidSetY", y, this.owner);
    },
  })
  readonly y!: PropertyDef<this, {value: Y}>;

  @PropertyDef<DataPointTrait<X, Y>["y2"]>({
    didSetValue(y2: Y | undefined): void {
      this.owner.callObservers("traitDidSetY2", y2, this.owner);
    },
  })
  readonly y2!: PropertyDef<this, {value: Y | undefined}>;

  @PropertyDef<DataPointTrait<X, Y>["radius"]>({
    valueType: Length,
    value: null,
    didSetValue(radius: Length | null): void {
      this.owner.callObservers("traitDidSetRadius", radius, this.owner);
    },
  })
  readonly radius!: PropertyDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @PropertyDef<DataPointTrait<X, Y>["color"]>({
    valueType: ColorLook,
    value: null,
    didSetValue(color: ColorOrLook | null): void {
      this.owner.callObservers("traitDidSetColor", color, this.owner);
    },
  })
  readonly color!: PropertyDef<this, {value: ColorOrLook | null, valueInit: AnyColorOrLook | null}>;

  @PropertyDef<DataPointTrait<X, Y>["opacity"]>({
    valueType: Number,
    didSetValue(opacity: number | undefined): void {
      this.owner.callObservers("traitDidSetOpacity", opacity, this.owner);
    },
  })
  readonly opacity!: PropertyDef<this, {value: number | undefined}>;

  formatLabel(x: X | undefined, y: Y | undefined): string | undefined {
    return void 0;
  }

  @PropertyDef<DataPointTrait<X, Y>["label"]>({
    valueType: String,
    didSetValue(label: string | undefined): void {
      this.owner.callObservers("traitDidSetLabel", label, this.owner);
    },
  })
  readonly label!: PropertyDef<this, {value: string | undefined}>;
}
