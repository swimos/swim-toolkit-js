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

import {Equals} from "@swim/util";
import type {GraphicsView} from "@swim/graphics";
import {GenericTrait} from "@swim/model";
import type {SliceTraitObserver} from "./SliceTraitObserver";

export class SliceTrait extends GenericTrait {
  constructor() {
    super();
    Object.defineProperty(this, "value", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "label", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "legend", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<SliceTraitObserver>;

  declare readonly value: number;

  setValue(newValue: number): void {
    const oldValue = this.value;
    if (oldValue !== newValue) {
      this.willSetValue(newValue, oldValue);
      Object.defineProperty(this, "value", {
        value: newValue,
        enumerable: true,
        configurable: true,
      });
      this.onSetValue(newValue, oldValue);
      this.didSetValue(newValue, oldValue);
    }
  }

  protected willSetValue(newValue: number, oldValue: number): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceWillSetValue !== void 0) {
        traitObserver.sliceWillSetValue(newValue, oldValue, this);
      }
    }
  }

  protected onSetValue(newValue: number, oldValue: number): void {
    // hook
  }

  protected didSetValue(newValue: number, oldValue: number): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceDidSetValue !== void 0) {
        traitObserver.sliceDidSetValue(newValue, oldValue, this);
      }
    }
  }

  declare readonly label: GraphicsView | string | undefined;

  setLabel(newLabel: GraphicsView | string | undefined): void {
    const oldLabel = this.label;
    if (!Equals(oldLabel, newLabel)) {
      this.willSetLabel(newLabel, oldLabel);
      Object.defineProperty(this, "label", {
        value: newLabel,
        enumerable: true,
        configurable: true,
      });
      this.onSetLabel(newLabel, oldLabel);
      this.didSetLabel(newLabel, oldLabel);
    }
  }

  protected willSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceWillSetLabel !== void 0) {
        traitObserver.sliceWillSetLabel(newLabel, oldLabel, this);
      }
    }
  }

  protected onSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
    // hook
  }

  protected didSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceDidSetLabel !== void 0) {
        traitObserver.sliceDidSetLabel(newLabel, oldLabel, this);
      }
    }
  }

  formatLabel(value: number): string | undefined {
    return void 0;
  }

  declare readonly legend: GraphicsView | string | undefined;

  setLegend(newLegend: GraphicsView | string | undefined): void {
    const oldLegend = this.legend;
    if (!Equals(oldLegend, newLegend)) {
      this.willSetLegend(newLegend, oldLegend);
      Object.defineProperty(this, "legend", {
        value: newLegend,
        enumerable: true,
        configurable: true,
      });
      this.onSetLegend(newLegend, oldLegend);
      this.didSetLegend(newLegend, oldLegend);
    }
  }

  protected willSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceWillSetLegend !== void 0) {
        traitObserver.sliceWillSetLegend(newLegend, oldLegend, this);
      }
    }
  }

  protected onSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined): void {
    // hook
  }

  protected didSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.sliceDidSetLegend !== void 0) {
        traitObserver.sliceDidSetLegend(newLegend, oldLegend, this);
      }
    }
  }

  formatLegend(value: number): string | undefined {
    return void 0;
  }
}
