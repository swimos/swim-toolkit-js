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
import {Model, Trait, TraitSetDef} from "@swim/model";
import {PanelTrait} from "../panel/PanelTrait";
import type {FrameTraitObserver} from "./FrameTraitObserver";
import {FrameController} from "./"; // forward import

/** @public */
export class FrameTrait extends PanelTrait {
  override readonly observerType?: Class<FrameTraitObserver>;

  @TraitSetDef<FrameTrait["panes"]>({
    traitType: PanelTrait,
    binds: true,
    willAttachTrait(paneTrait: PanelTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachPane", paneTrait, targetTrait, this.owner);
    },
    didAttachTrait(paneTrait: PanelTrait, targetTrait: Trait | null): void {
      if (this.owner.consuming) {
        paneTrait.consume(this.owner);
      }
    },
    willDetachTrait(paneTrait: PanelTrait): void {
      if (this.owner.consuming) {
        paneTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(paneTrait: PanelTrait): void {
      this.owner.callObservers("traitDidDetachPane", paneTrait, this.owner);
    },
    detectModel(model: Model): PanelTrait | null {
      return model.getTrait(PanelTrait);
    },
  })
  readonly panes!: TraitSetDef<this, {trait: PanelTrait}>;
  static readonly panes: FastenerClass<FrameTrait["panes"]>;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.panes.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.panes.unconsumeTraits(this);
  }

  override createPanelController(): FrameController {
    return new FrameController();
  }
}
