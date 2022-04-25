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
import {Model, Trait, TraitSet} from "@swim/model";
import type {BoardTraitObserver} from "./BoardTraitObserver";
import {PanelTrait} from "../panel/PanelTrait";
import {BoardController} from "./"; // forward import

/** @public */
export class BoardTrait extends Trait {
  override readonly observerType?: Class<BoardTraitObserver>;

  @TraitSet<BoardTrait["panels"]>({
    traitType: PanelTrait,
    binds: true,
    willAttachTrait(panelTrait: PanelTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachPanel", panelTrait, targetTrait, this.owner);
    },
    didAttachTrait(panelTrait: PanelTrait, targetTrait: Trait | null): void {
      if (this.owner.consuming) {
        panelTrait.consume(this.owner);
      }
    },
    willDetachTrait(panelTrait: PanelTrait): void {
      if (this.owner.consuming) {
        panelTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(panelTrait: PanelTrait): void {
      this.owner.callObservers("traitDidDetachPanel", panelTrait, this.owner);
    },
    detectModel(model: Model): PanelTrait | null {
      return model.getTrait(PanelTrait);
    },
  })
  readonly panels!: TraitSet<this, PanelTrait>;
  static readonly panels: FastenerClass<BoardTrait["panels"]>;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.panels.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.panels.unconsumeTraits(this);
  }

  createBoardController(): BoardController {
    return new BoardController();
  }
}
