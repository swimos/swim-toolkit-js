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
import {GenericTrait} from "@swim/model";
import type {GraphicsView} from "@swim/graphics";
import type {DialTraitObserver} from "./DialTraitObserver";

export type DialLabel = DialLabelFunction | string;
export type DialLabelFunction = (dialTrait: DialTrait) => GraphicsView | string | null;

export type DialLegend = DialLegendFunction | string;
export type DialLegendFunction = (dialTrait: DialTrait) => GraphicsView | string | null;

export class DialTrait extends GenericTrait {
  constructor() {
    super();
    Object.defineProperty(this, "value", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "limit", {
      value: 1,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "label", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "legend", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<DialTraitObserver>;

  declare readonly value: number;

  setValue(newValue: number): void {
    const oldValue = this.value;
    if (newValue !== oldValue) {
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
      if (traitObserver.traitWillSetDialValue !== void 0) {
        traitObserver.traitWillSetDialValue(newValue, oldValue, this);
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
      if (traitObserver.traitDidSetDialValue !== void 0) {
        traitObserver.traitDidSetDialValue(newValue, oldValue, this);
      }
    }
  }

  declare readonly limit: number;

  setLimit(newLimit: number): void {
    const oldLimit = this.limit;
    if (newLimit !== oldLimit) {
      this.willSetLimit(newLimit, oldLimit);
      Object.defineProperty(this, "limit", {
        value: newLimit,
        enumerable: true,
        configurable: true,
      });
      this.onSetLimit(newLimit, oldLimit);
      this.didSetLimit(newLimit, oldLimit);
    }
  }

  protected willSetLimit(newLimit: number, oldLimit: number): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDialLimit !== void 0) {
        traitObserver.traitWillSetDialLimit(newLimit, oldLimit, this);
      }
    }
  }

  protected onSetLimit(newLimit: number, oldLimit: number): void {
    // hook
  }

  protected didSetLimit(newLimit: number, oldLimit: number): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDialLimit !== void 0) {
        traitObserver.traitDidSetDialLimit(newLimit, oldLimit, this);
      }
    }
  }

  declare readonly label: DialLabel | null;

  setLabel(newLabel: DialLabel | null): void {
    const oldLabel = this.label;
    if (!Equals(newLabel, oldLabel)) {
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

  protected willSetLabel(newLabel: DialLabel | null, oldLabel: DialLabel | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDialLabel !== void 0) {
        traitObserver.traitWillSetDialLabel(newLabel, oldLabel, this);
      }
    }
  }

  protected onSetLabel(newLabel: DialLabel | null, oldLabel: DialLabel | null): void {
    // hook
  }

  protected didSetLabel(newLabel: DialLabel | null, oldLabel: DialLabel | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDialLabel !== void 0) {
        traitObserver.traitDidSetDialLabel(newLabel, oldLabel, this);
      }
    }
  }

  formatLabel(value: number, limit: number): string | undefined {
    return void 0;
  }

  declare readonly legend: DialLegend | null;

  setLegend(newLegend: DialLegend | null): void {
    const oldLegend = this.legend;
    if (!Equals(newLegend, oldLegend)) {
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

  protected willSetLegend(newLegend: DialLegend | null, oldLegend: DialLegend | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDialLegend !== void 0) {
        traitObserver.traitWillSetDialLegend(newLegend, oldLegend, this);
      }
    }
  }

  protected onSetLegend(newLegend: DialLegend | null, oldLegend: DialLegend | null): void {
    // hook
  }

  protected didSetLegend(newLegend: DialLegend | null, oldLegend: DialLegend | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDialLegend !== void 0) {
        traitObserver.traitDidSetDialLegend(newLegend, oldLegend, this);
      }
    }
  }

  formatLegend(value: number, limit: number): string | undefined {
    return void 0;
  }
}
