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
import {Trait, TraitRef} from "@swim/model";
import {BarTrait} from "@swim/toolbar";
import {SheetTrait} from "../sheet/SheetTrait";
import type {FolioTraitObserver} from "./FolioTraitObserver";

/** @public */
export class FolioTrait extends Trait {
  override readonly observerType?: Class<FolioTraitObserver>;

  @TraitRef<FolioTrait, BarTrait>({
    type: BarTrait,
    binds: true,
    willAttachTrait(appbarTrait: BarTrait): void {
      this.owner.callObservers("traitWillAttachAppbar", appbarTrait, this.owner);
    },
    didDetachTrait(appbarTrait: BarTrait): void {
      this.owner.callObservers("traitDidDetachAppbar", appbarTrait, this.owner);
    },
    detectTrait(trait: Trait): BarTrait | null {
      return trait instanceof BarTrait ? trait : null;
    },
  })
  readonly appbar!: TraitRef<this, BarTrait>;
  static readonly appbar: MemberFastenerClass<FolioTrait, "appbar">;

  @TraitRef<FolioTrait, SheetTrait>({
    type: SheetTrait,
    willAttachTrait(sheetTrait: SheetTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachCover", sheetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("traitDidDetachCover", sheetTrait, this.owner);
    },
  })
  readonly cover!: TraitRef<this, SheetTrait>;
  static readonly cover: MemberFastenerClass<FolioTrait, "cover">;
}
