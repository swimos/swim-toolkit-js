// Copyright 2015-2020 Swim inc.
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

import {TraitModelType, Trait, TraitFastener, GenericTrait} from "@swim/model";
import {GraphTrait} from "../graph/GraphTrait";
import type {ChartTraitObserver} from "./ChartTraitObserver";

export class ChartTrait<X, Y> extends GenericTrait {
  declare readonly traitObservers: ReadonlyArray<ChartTraitObserver<X, Y>>;

  protected initGraph(graphTrait: GraphTrait<X, Y>): void {
    // hook
  }

  protected attachGraph(graphTrait: GraphTrait<X, Y>): void {
    if (this.isConsuming()) {
      graphTrait.addTraitConsumer(this);
    }
  }

  protected detachGraph(graphTrait: GraphTrait<X, Y>): void {
    if (this.isConsuming()) {
      graphTrait.removeTraitConsumer(this);
    }
  }

  protected willSetGraph(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.chartTraitWillSetGraph !== void 0) {
        traitObserver.chartTraitWillSetGraph(newGraphTrait, oldGraphTrait, targetTrait, this);
      }
    }
  }

  protected onSetGraph(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
    if (newGraphTrait !== null) {
      this.initGraph(newGraphTrait);
    }
  }

  protected didSetGraph(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.chartTraitDidSetGraph !== void 0) {
        traitObserver.chartTraitDidSetGraph(newGraphTrait, oldGraphTrait, targetTrait, this);
      }
    }
  }

  @TraitFastener<ChartTrait<X, Y>, GraphTrait<X, Y>>({
    type: GraphTrait,
    sibling: true,
    willSetTrait(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
      this.owner.willSetGraph(newGraphTrait, oldGraphTrait, targetTrait);
    },
    onSetTrait(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
      if (oldGraphTrait !== null) {
        this.owner.detachGraph(oldGraphTrait);
      }
      if (newGraphTrait !== null) {
        this.owner.attachGraph(newGraphTrait);
      }
      this.owner.onSetGraph(newGraphTrait, oldGraphTrait, targetTrait);
    },
    didSetTrait(newGraphTrait: GraphTrait<X, Y> | null, oldGraphTrait: GraphTrait<X, Y> | null, targetTrait: Trait | null): void {
      this.owner.didSetGraph(newGraphTrait, oldGraphTrait, targetTrait);
    },
  })
  declare graph: TraitFastener<this, GraphTrait<X, Y>>;

  protected detectGraphTrait(trait: Trait): GraphTrait<X, Y> | null {
    return trait instanceof GraphTrait ? trait : null;
  }

  protected detectTraits(model: TraitModelType<this>): void {
    if (this.graph.trait === null) {
      const traits = model.traits;
      for (let i = 0, n = traits.length; i < n; i += 1) {
        const trait = traits[i]!;
        const graphTrait = this.detectGraphTrait(trait);
        if (graphTrait !== null) {
          this.graph.setTrait(graphTrait);
        }
      }
    }
  }

  protected didSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    if (newModel !== null) {
      this.detectTraits(newModel);
    }
    super.didSetModel(newModel, oldModel);
  }

  protected onStartConsuming(): void {
    super.onStartConsuming();
    const graphTrait = this.graph.trait;
    if (graphTrait !== null) {
      graphTrait.addTraitConsumer(this);
    }
  }

  protected onStopConsuming(): void {
    super.onStopConsuming();
    const graphTrait = this.graph.trait;
    if (graphTrait !== null) {
      graphTrait.removeTraitConsumer(this);
    }
  }
}
