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
import {Controller, TraitViewRefDef} from "@swim/controller";
import {PanelView} from "./PanelView";
import {PanelTrait} from "./PanelTrait";
import type {PanelControllerObserver} from "./PanelControllerObserver";

/** @public */
export class PanelController extends Controller {
  override readonly observerType?: Class<PanelControllerObserver>;

  @TraitViewRefDef<PanelController["panel"]>({
    traitType: PanelTrait,
    willAttachTrait(panelTrait: PanelTrait): void {
      this.owner.callObservers("controllerWillAttachPanelTrait", panelTrait, this.owner);
    },
    didDetachTrait(panelTrait: PanelTrait): void {
      this.owner.callObservers("controllerDidDetachPanelTrait", panelTrait, this.owner);
    },
    viewType: PanelView,
    willAttachView(panelView: PanelView): void {
      this.owner.callObservers("controllerWillAttachPanelView", panelView, this.owner);
    },
    didDetachView(panelView: PanelView): void {
      this.owner.callObservers("controllerDidDetachPanelView", panelView, this.owner);
    },
  })
  readonly panel!: TraitViewRefDef<this, {
    trait: PanelTrait,
    view: PanelView,
  }>;
  static readonly panel: FastenerClass<PanelController["panel"]>;
}
