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
import {MemberFastenerClass, Property} from "@swim/component";
import {Model, Trait, TraitSet} from "@swim/model";
import type {GraphicsView} from "@swim/graphics";
import {DialTrait} from "../dial/DialTrait";
import type {GaugeTraitObserver} from "./GaugeTraitObserver";

/** @public */
export type GaugeTitle = GaugeTitleFunction | string;
/** @public */
export type GaugeTitleFunction = (gaugeTrait: GaugeTrait) => GraphicsView | string | null;

/** @public */
export class GaugeTrait extends Trait {
  override readonly observerType?: Class<GaugeTraitObserver>;

  @Property<GaugeTrait, GaugeTitle | null>({
    value: null,
    willSetValue(newTitle: GaugeTitle | null, oldTitle: GaugeTitle | null): void {
      this.owner.callObservers("traitWillSetGaugeTitle", newTitle, oldTitle, this.owner);
    },
    didSetValue(newTitle: GaugeTitle | null, oldTitle: GaugeTitle | null): void {
      this.owner.callObservers("traitDidSetGaugeTitle", newTitle, oldTitle, this.owner);
    },
  })
  readonly title!: Property<this, GaugeTitle | null>;
  static readonly title: MemberFastenerClass<GaugeTrait, "title">;

  @Property<GaugeTrait, number>({
    value: 0,
    willSetValue(newLimit: number, oldLimit: number): void {
      this.owner.callObservers("traitWillSetGaugeLimit", newLimit, oldLimit, this.owner);
    },
    didSetValue(newLimit: number, oldLimit: number): void {
      this.owner.callObservers("traitDidSetGaugeLimit", newLimit, oldLimit, this.owner);
    },
  })
  readonly limit!: Property<this, number>;
  static readonly limit: MemberFastenerClass<GaugeTrait, "limit">;

  @TraitSet<GaugeTrait, DialTrait>({
    type: DialTrait,
    binds: true,
    willAttachTrait(dialTrait: DialTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachDial", dialTrait, targetTrait, this.owner);
    },
    didAttachTrait(dialTrait: DialTrait): void {
      if (this.owner.consuming) {
        dialTrait.consume(this.owner);
      }
    },
    willDetachTrait(dialTrait: DialTrait): void {
      if (this.owner.consuming) {
        dialTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(dialTrait: DialTrait): void {
      this.owner.callObservers("traitDidDetachDial", dialTrait, this.owner);
    },
    detectModel(model: Model): DialTrait | null {
      return model.getTrait(DialTrait);
    },
  })
  readonly dials!: TraitSet<this, DialTrait>;
  static readonly dials: MemberFastenerClass<GaugeTrait, "dials">;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.dials.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.dials.unconsumeTraits(this);
  }
}
