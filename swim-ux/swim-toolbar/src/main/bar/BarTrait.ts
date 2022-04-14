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

import type {Class, Instance, Creatable} from "@swim/util";
import type {FastenerClass} from "@swim/component";
import {Model, Trait, TraitSetDef} from "@swim/model";
import {ToolTrait} from "../tool/ToolTrait";
import type {BarTraitObserver} from "./BarTraitObserver";

/** @public */
export class BarTrait extends Trait {
  override readonly observerType?: Class<BarTraitObserver>;

  getTool<F extends Class<ToolTrait>>(key: string, toolTraitClass: F): InstanceType<F> | null;
  getTool(key: string): ToolTrait | null;
  getTool(key: string, toolTraitClass?: Class<ToolTrait>): ToolTrait | null {
    if (toolTraitClass === void 0) {
      toolTraitClass = ToolTrait;
    }
    const toolTrait = this.getTrait(key);
    return toolTrait instanceof toolTraitClass ? toolTrait : null;
  }

  getOrCreateTool<F extends Class<Instance<F, ToolTrait>> & Creatable<Instance<F, ToolTrait>>>(key: string, toolTraitClass: F): InstanceType<F> {
    let toolTrait = this.getTrait(key, toolTraitClass);
    if (toolTrait === null) {
      toolTrait = toolTraitClass.create();
      this.setTrait(key, toolTrait);
    }
    return toolTrait!;
  }

  setTool(key: string, toolTrait: ToolTrait | null): void {
    this.setTrait(key, toolTrait);
  }

  @TraitSetDef<BarTrait["tools"]>({
    traitType: ToolTrait,
    binds: true,
    willAttachTrait(toolTrait: ToolTrait, targetTrait: Trait | null): void {
      this.owner.callObservers("traitWillAttachTool", toolTrait, targetTrait, this.owner);
    },
    didAttachTrait(toolTrait: ToolTrait, targetTrait: Trait | null): void {
      if (this.owner.consuming) {
        toolTrait.consume(this.owner);
      }
    },
    willDetachTrait(toolTrait: ToolTrait): void {
      if (this.owner.consuming) {
        toolTrait.unconsume(this.owner);
      }
    },
    didDetachTrait(toolTrait: ToolTrait): void {
      this.owner.callObservers("traitDidDetachTool", toolTrait, this.owner);
    },
    detectModel(model: Model): ToolTrait | null {
      return model.getTrait(ToolTrait);
    },
  })
  readonly tools!: TraitSetDef<this, {trait: ToolTrait}>;
  static readonly tools: FastenerClass<BarTrait["tools"]>;

  protected override onStartConsuming(): void {
    super.onStartConsuming();
    this.tools.consumeTraits(this);
  }

  protected override onStopConsuming(): void {
    super.onStopConsuming();
    this.tools.unconsumeTraits(this);
  }
}
