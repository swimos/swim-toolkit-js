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

import {TraitProperty} from "@swim/model";
import {AnyColor, Color} from "@swim/style";
import {Look} from "@swim/theme";
import {SeriesPlotTrait} from "./SeriesPlotTrait";
import type {AreaPlotTraitObserver} from "./AreaPlotTraitObserver";

export class AreaPlotTrait<X, Y> extends SeriesPlotTrait<X, Y> {
  override readonly traitObservers!: ReadonlyArray<AreaPlotTraitObserver<X, Y>>;

  protected willSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetPlotFill !== void 0) {
        traitObserver.traitWillSetPlotFill(newFill, oldFill, this);
      }
    }
  }

  protected onSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    // hook
  }

  protected didSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetPlotFill !== void 0) {
        traitObserver.traitDidSetPlotFill(newFill, oldFill, this);
      }
    }
  }

  @TraitProperty<AreaPlotTrait<X, Y>, Look<Color> | Color | null, Look<Color> | AnyColor | null>({
    state: null,
    willSetState(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
      this.owner.willSetFill(newFill, oldFill);
    },
    didSetState(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
      this.owner.onSetFill(newFill, oldFill);
      this.owner.didSetFill(newFill, oldFill);
    },
    fromAny(fill: Look<Color> | AnyColor | null): Look<Color> | Color | null {
      if (fill !== null && !(fill instanceof Look)) {
        fill = Color.fromAny(fill);
      }
      return fill;
    },
  })
  readonly fill!: TraitProperty<this, Look<Color> | Color | null, Look<Color> | AnyColor | null>;
}
