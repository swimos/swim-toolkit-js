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

import type {TraitObserver} from "@swim/model";
import type {BarTrait} from "@swim/toolbar";
import type {SheetTrait} from "../sheet/SheetTrait";
import type {FolioTrait} from "./FolioTrait";

/** @public */
export interface FolioTraitObserver<T extends FolioTrait = FolioTrait> extends TraitObserver<T> {
  traitWillAttachAppbar?(appbarTrait: BarTrait, trait: T): void;

  traitDidDetachAppbar?(appbarTrait: BarTrait, trait: T): void;

  traitWillAttachCover?(coverTrait: SheetTrait,trait: T): void;

  traitDidDetachCover?(coverTrait: SheetTrait, trait: T): void;
}
