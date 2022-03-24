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
import type {MemberFastenerClass} from "@swim/component";
import {Model, Trait, TraitRef, TraitSet} from "@swim/model";
import {BarTrait} from "@swim/toolbar";
import {SheetTrait} from "../sheet/SheetTrait";
import type {PanelTraitObserver} from "./PanelTraitObserver";

/** @public */
export class PanelTrait extends Trait {
  override readonly observerType?: Class<PanelTraitObserver>;

  @TraitRef<PanelTrait, BarTrait>({
    type: BarTrait,
    binds: true,
    willAttachTrait(tabBarTrait: BarTrait): void {
      this.owner.callObservers("traitWillAttachTabBar", tabBarTrait, this.owner);
    },
    didDetachTrait(tabBarTrait: BarTrait): void {
      this.owner.callObservers("traitDidDetachTabBar", tabBarTrait, this.owner);
    },
    detectTrait(trait: Trait): BarTrait | null {
      return trait instanceof BarTrait ? trait : null;
    },
  })
  readonly tabBar!: TraitRef<this, BarTrait>;
  static readonly tabBar: MemberFastenerClass<PanelTrait, "tabBar">;

  @TraitSet<PanelTrait, SheetTrait>({
    type: SheetTrait,
    binds: true,
    willAttachTrait(tabTrait: SheetTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachTab", tabTrait, targetTrait, this.owner);
    },
    didDetachTrait(tabTrait: SheetTrait): void {
      this.owner.callObservers("traitDidDetachTab", tabTrait, this.owner);
    },
    detectModel(model: Model): SheetTrait | null {
      return model.getTrait(SheetTrait);
    },
  })
  readonly tabs!: TraitSet<this, SheetTrait>;
  static readonly tabs: MemberFastenerClass<PanelTrait, "tabs">;
}
