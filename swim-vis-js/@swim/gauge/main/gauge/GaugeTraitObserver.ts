// Copyright 2015-2021 Swim inc.
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
import type {DialTrait} from "../dial/DialTrait";
import type {GaugeTitle, GaugeTrait} from "./GaugeTrait";

export interface GaugeTraitObserver<R extends GaugeTrait = GaugeTrait> extends TraitObserver<R> {
  traitWillSetGaugeTitle?(newTitle: GaugeTitle | null, oldTitle: GaugeTitle | null, trait: R): void;

  traitDidSetGaugeTitle?(newTitle: GaugeTitle | null, oldTitle: GaugeTitle | null, trait: R): void;

  traitWillSetDial?(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null, targetTrait: Trait | null, trait: R): void;

  traitDidSetDial?(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null, targetTrait: Trait | null, trait: R): void;
}
