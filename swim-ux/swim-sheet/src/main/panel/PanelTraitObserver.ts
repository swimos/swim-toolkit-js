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

import type {Trait, TraitObserver} from "@swim/model";
import type {BarTrait} from "@swim/toolbar";
import type {SheetTrait} from "../sheet/SheetTrait";
import type {PanelTrait} from "./PanelTrait";

/** @public */
export interface PanelTraitObserver<T extends PanelTrait = PanelTrait> extends TraitObserver<T> {
  traitWillAttachTabBar?(tabBarTrait: BarTrait, trait: T): void;

  traitDidDetachTabBar?(tabBarTrait: BarTrait, trait: T): void;

  traitWillAttachTab?(tabTrait: SheetTrait, targetTrait: Trait | null, trait: T): void;

  traitDidDetachTab?(tabTrait: SheetTrait, trait: T): void;
}
