// Copyright 2015-2023 Swim.inc
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

import type {AnyTiming} from "@swim/util";
import {Affinity} from "@swim/component";
import type {AnimatorClass} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyExpansion} from "./Expansion";
import {Expansion} from "./Expansion";

/** @public */
export interface ExpansionAnimator<O = unknown, T extends Expansion | null | undefined = Expansion | null | undefined, U extends AnyExpansion | null | undefined = AnyExpansion | T> extends Animator<O, T, U> {
  get phase(): number | undefined;

  getPhase(): number;

  getPhaseOr<E>(elsePhase: E): number | E;

  setPhase(newPhase: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setPhase(newPhase: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get direction(): number;

  setDirection(newDirection: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setDirection(newDirection: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get collapsed(): boolean;

  get expanded(): boolean;

  get expanding(): boolean;

  get collapsing(): boolean;

  expand(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  expand(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  collapse(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  collapse(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  toggle(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  toggle(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  /** @override */
  setState(newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  /** @override */
  setState(newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  willExpand(): void;

  /** @protected */
  didExpand(): void;

  /** @protected */
  willCollapse(): void;

  /** @protected */
  didCollapse(): void;

  /** @override */
  equalValues(newValue: T, oldValue: T | undefined): boolean;

  /** @override */
  fromAny(value: T | U): T;
}

/** @public */
export const ExpansionAnimator = (function (_super: typeof Animator) {
  const ExpansionAnimator = _super.extend("ExpansionAnimator", {
    valueType: Expansion,
  }) as AnimatorClass<ExpansionAnimator<any, any, any>>;

  Object.defineProperty(ExpansionAnimator.prototype, "phase", {
    get(this: ExpansionAnimator): number | undefined {
      const value = this.value;
      return value !== void 0 && value !== null ? value.phase : void 0;
    },
    configurable: true,
  });

  ExpansionAnimator.prototype.getPhase = function (this: ExpansionAnimator): number {
    return this.getValue().phase;
  };

  ExpansionAnimator.prototype.getPhaseOr = function <E>(this: ExpansionAnimator, elsePhase: E): number | E {
    const value = this.value;
    if (value !== void 0 && value !== null) {
      return value.phase;
    } else {
      return elsePhase;
    }
  };

  ExpansionAnimator.prototype.setPhase = function (this: ExpansionAnimator, newPhase: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      this.setState(oldValue.withPhase(newPhase), timing, affinity);
    }
  };

  Object.defineProperty(ExpansionAnimator.prototype, "direction", {
    get(this: ExpansionAnimator): number {
      const value = this.value;
      return value !== void 0 && value !== null ? value.direction : 0;
    },
    configurable: true,
  });

  ExpansionAnimator.prototype.setDirection = function (this: ExpansionAnimator, newDirection: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      this.setState(oldValue.withDirection(newDirection), timing, affinity);
    }
  };

  Object.defineProperty(ExpansionAnimator.prototype, "collapsed", {
    get(this: ExpansionAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.collapsed;
    },
    configurable: true,
  });

  Object.defineProperty(ExpansionAnimator.prototype, "expanded", {
    get(this: ExpansionAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.expanded;
    },
    configurable: true,
  });

  Object.defineProperty(ExpansionAnimator.prototype, "expanding", {
    get(this: ExpansionAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.expanding;
    },
    configurable: true,
  });

  Object.defineProperty(ExpansionAnimator.prototype, "collapsing", {
    get(this: ExpansionAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.collapsing;
    },
    configurable: true,
  });

  ExpansionAnimator.prototype.expand = function (this: ExpansionAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null || !oldValue.expanded) {
      if (oldValue !== void 0 && oldValue !== null) {
        this.setValue(oldValue.asExpanding(), Affinity.Reflexive);
      }
      this.setState(Expansion.expanded(), timing as any, affinity);
    }
  };

  ExpansionAnimator.prototype.collapse = function (this: ExpansionAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null || !oldValue.collapsed) {
      if (oldValue !== void 0 && oldValue !== null) {
        this.setValue(oldValue.asCollapsing(), Affinity.Reflexive);
      }
      this.setState(Expansion.collapsed(), timing as any, affinity);
    }
  };

  ExpansionAnimator.prototype.toggle = function (this: ExpansionAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      this.setValue(oldValue.asToggling(), Affinity.Reflexive);
      this.setState(oldValue.asToggled(), timing as any, affinity);
    }
  };

  ExpansionAnimator.prototype.setState = function (this: ExpansionAnimator, newState: AnyExpansion | null | undefined, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    if (timing === void 0 || timing === true) {
      timing = this.transition;
    }
    if (typeof newState === "boolean") {
      const oldValue = this.value;
      const newValue = newState ? Expansion.expanded() : Expansion.collapsed();
      if (oldValue !== void 0 && oldValue !== null && !oldValue.equals(newValue)) {
        this.setValue(newState ? oldValue.asExpanding() : oldValue.asCollapsing(), Affinity.Reflexive);
      }
      newState = newValue;
    }
    _super.prototype.setState.call(this, newState, timing, affinity);
  };

  ExpansionAnimator.prototype.onSetValue = function (this: ExpansionAnimator, newValue: Expansion | null | undefined, oldValue: Expansion | null | undefined): void {
    _super.prototype.onSetValue.call(this, newValue, oldValue);
    if (newValue !== void 0 && newValue !== null && oldValue !== void 0 && oldValue !== null) {
      if (newValue.expanding && !oldValue.expanding) {
        this.willExpand();
      } else if (newValue.expanded && !oldValue.expanded) {
        this.didExpand();
      } else if (newValue.collapsing && !oldValue.collapsing) {
        this.willCollapse();
      } else if (newValue.collapsed && !oldValue.collapsed) {
        this.didCollapse();
      }
    }
  };

  ExpansionAnimator.prototype.willExpand = function (this: ExpansionAnimator): void {
    // hook
  };

  ExpansionAnimator.prototype.didExpand = function (this: ExpansionAnimator): void {
    // hook
  };

  ExpansionAnimator.prototype.willCollapse = function (this: ExpansionAnimator): void {
    // hook
  };

  ExpansionAnimator.prototype.didCollapse = function (this: ExpansionAnimator): void {
    // hook
  };

  ExpansionAnimator.prototype.fromAny = function (this: ExpansionAnimator, value: AnyExpansion | null | undefined): Expansion | null | undefined {
    return value !== void 0 && value !== null ? Expansion.fromAny(value) : null;
  };

  ExpansionAnimator.prototype.equalValues = function (this: ExpansionAnimator, newValue: Expansion | null | undefined, oldValue: Expansion | null | undefined): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  return ExpansionAnimator;
})(Animator);
