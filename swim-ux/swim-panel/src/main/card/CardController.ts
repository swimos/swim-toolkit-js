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
import type {FastenerClass} from "@swim/component";
import {TraitViewRef} from "@swim/controller";
import {FrameController} from "../frame/FrameController";
import {CardView} from "./CardView";
import {CardTrait} from "./CardTrait";
import type {CardControllerObserver} from "./CardControllerObserver";

/** @public */
export class CardController extends FrameController {
  override readonly observerType?: Class<CardControllerObserver>;

  @TraitViewRef<CardController["panel"]>({
    extends: true,
    traitType: CardTrait,
    viewType: CardView,
  })
  override readonly panel!: TraitViewRef<this, CardTrait, CardView> & FrameController["panel"];
  static override readonly panel: FastenerClass<CardController["panel"]>;
}
