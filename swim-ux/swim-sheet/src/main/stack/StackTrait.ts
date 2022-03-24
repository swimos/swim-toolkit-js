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
import type {StackTraitObserver} from "./StackTraitObserver";

/** @public */
export class StackTrait extends Trait {
  override readonly observerType?: Class<StackTraitObserver>;

  @TraitRef<StackTrait, BarTrait>({
    type: BarTrait,
    binds: true,
    willAttachTrait(navBarTrait: BarTrait): void {
      this.owner.callObservers("traitWillAttachNavBar", navBarTrait, this.owner);
    },
    didDetachTrait(navBarTrait: BarTrait): void {
      this.owner.callObservers("traitDidDetachNavBar", navBarTrait, this.owner);
    },
    detectTrait(trait: Trait): BarTrait | null {
      return trait instanceof BarTrait ? trait : null;
    },
  })
  readonly navBar!: TraitRef<this, BarTrait>;
  static readonly navBar: MemberFastenerClass<StackTrait, "navBar">;

  @TraitSet<StackTrait, SheetTrait>({
    type: SheetTrait,
    binds: true,
    willAttachTrait(sheetTrait: SheetTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachSheet", sheetTrait, targetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("traitDidDetachSheet", sheetTrait, this.owner);
    },
    detectModel(model: Model): SheetTrait | null {
      return model.getTrait(SheetTrait);
    },
  })
  readonly sheets!: TraitSet<this, SheetTrait>;
  static readonly sheets: MemberFastenerClass<StackTrait, "sheets">;
}
