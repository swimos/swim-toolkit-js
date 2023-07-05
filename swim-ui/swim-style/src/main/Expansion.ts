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

import type {Uninitable} from "@swim/util";
import type {Mutable} from "@swim/util";
import {Lazy} from "@swim/util";
import {Murmur3} from "@swim/util";
import type {Equivalent} from "@swim/util";
import type {HashCode} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import {Objects} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import type {Interpolate} from "@swim/util";
import {Interpolator} from "@swim/util";
import type {Output} from "@swim/codec";
import type {Debug} from "@swim/codec";
import {Format} from "@swim/codec";
import {Affinity} from "@swim/component";
import type {AnimatorClass} from "@swim/component";
import {Animator} from "@swim/component";

/** @public */
export type AnyExpansion = Expansion | ExpansionInit | boolean;

/** @public */
export const AnyExpansion = {
  [Symbol.hasInstance](instance: unknown): instance is AnyExpansion {
    return instance instanceof Expansion
        || ExpansionInit[Symbol.hasInstance](instance)
        || typeof instance === "boolean";
  },
};

/** @public */
export interface ExpansionInit {
  /** @internal */
  typeid?: "ExpansionInit";
  readonly phase: number;
  readonly direction: number;
}

/** @public */
export const ExpansionInit = {
  [Symbol.hasInstance](instance: unknown): instance is ExpansionInit {
    return Objects.hasAllKeys<ExpansionInit>(instance, "phase", "direction");
  },
};

/** @public */
export class Expansion implements Interpolate<Expansion>, HashCode, Equivalent, Debug {
  constructor(phase: number, direction: number) {
    this.phase = phase;
    this.direction = direction;
  }

  /** @internal */
  declare typeid?: "Expansion";

  readonly phase: number;

  withPhase(phase: number): Expansion {
    if (phase === this.phase) {
      return this;
    }
    return Expansion.create(phase, this.direction);
  }

  readonly direction: number;

  withDirection(direction: number): Expansion {
    if (direction === this.direction) {
      return this;
    }
    return Expansion.create(this.phase, direction);
  }

  get collapsed(): boolean {
    return this.phase === 0 && this.direction === 0;
  }

  get expanded(): boolean {
    return this.phase === 1 && this.direction === 0;
  }

  get expanding(): boolean {
    return this.direction > 0;
  }

  get collapsing(): boolean {
    return this.direction < 0;
  }

  asExpanding(): Expansion {
    if (this.expanding) {
      return this;
    }
    return Expansion.expanding(this.phase);
  }

  asCollapsing(): Expansion {
    if (this.collapsing) {
      return this;
    }
    return Expansion.collapsing(this.phase);
  }

  asToggling(): Expansion {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Expansion.collapsing(this.phase);
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Expansion.expanding(this.phase);
    }
    return this;
  }

  asToggled(): Expansion {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Expansion.collapsed();
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Expansion.expanded();
    }
    return this;
  }

  /** @override */
  interpolateTo(that: Expansion): Interpolator<Expansion>;
  interpolateTo(that: unknown): Interpolator<Expansion> | null;
  interpolateTo(that: unknown): Interpolator<Expansion> | null {
    if (that instanceof Expansion) {
      return ExpansionInterpolator(this, that);
    }
    return null;
  }

  /** @override */
  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Expansion) {
      return Numbers.equivalent(this.phase, that.phase, epsilon)
          && Numbers.equivalent(this.direction, that.direction, epsilon);
    }
    return false;
  }

  /** @override */
  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Expansion) {
      return this.phase === that.phase && this.direction === that.direction;
    }
    return false;
  }

  /** @override */
  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(Expansion),
        Numbers.hash(this.phase)), Numbers.hash(this.direction)));
  }

  /** @override */
  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Expansion").write(46/*'.'*/);
    if (this.phase === 0 && this.direction === 0) {
      output = output.write("collapsed").write(40/*'('*/);
    } else if (this.phase === 1 && this.direction === 0) {
      output = output.write("expanded").write(40/*'('*/);
    } else if (this.direction === 1) {
      output = output.write("expanding").write(40/*'('*/);
      if (this.phase !== 0) {
        output = output.debug(this.phase);
      }
    } else if (this.direction === -1) {
      output = output.write("collapsing").write(40/*'('*/);
      if (this.phase !== 1) {
        output = output.debug(this.phase);
      }
    } else {
      output = output.write("create").write(40/*'('*/).debug(this.phase);
      if (this.direction !== 0) {
        output = output.write(", ").debug(this.direction);
      }
    }
    output = output.write(41/*')'*/);
    return output;
  }

  /** @override */
  toString(): string {
    return Format.debug(this);
  }

  @Lazy
  static collapsed(): Expansion {
    return new Expansion(0, 0);
  }

  @Lazy
  static expanded(): Expansion {
    return new Expansion(1, 0);
  }

  static expanding(phase?: number): Expansion {
    if (phase === void 0) {
      phase = 0;
    }
    return new Expansion(phase, 1);
  }

  static collapsing(phase?: number): Expansion {
    if (phase === void 0) {
      phase = 1;
    }
    return new Expansion(phase, -1);
  }

  static create(phase: number, direction?: number): Expansion {
    if (direction === void 0) {
      direction = 0;
    }
    if (phase === 0 && direction === 0) {
      return Expansion.collapsed();
    } else if (phase === 1 && direction === 0) {
      return Expansion.expanded();
    }
    return new Expansion(phase, direction);
  }

  static fromAny<T extends AnyExpansion | null | undefined>(value: T): Expansion | Uninitable<T> {
    if (value === void 0 || value === null || value instanceof Expansion) {
      return value as Expansion | Uninitable<T>;
    } else if (ExpansionInit[Symbol.hasInstance](value)) {
      return Expansion.fromInit(value);
    } else if (value === true) {
      return Expansion.expanded();
    } else if (value === false) {
      return Expansion.collapsed();
    }
    throw new TypeError("" + value);
  }

  static fromInit(value: ExpansionInit): Expansion {
    return new Expansion(value.phase, value.direction);
  }
}

/** @internal */
export const ExpansionInterpolator = (function (_super: typeof Interpolator) {
  const ExpansionInterpolator = function (e0: Expansion, e1: Expansion): Interpolator<Expansion> {
    const interpolator = function (u: number): Expansion {
      const e0 = interpolator[0];
      const e1 = interpolator[1];
      const phase = e0.phase + u * (e1.phase - e0.phase);
      const direction = u !== 1 ? e0.direction : e1.direction;
      return Expansion.create(phase, direction);
    } as Interpolator<Expansion>;
    Object.setPrototypeOf(interpolator, ExpansionInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = e0;
    (interpolator as Mutable<typeof interpolator>)[1] = e1;
    return interpolator;
  } as {
    (e0: Expansion, e1: Expansion): Interpolator<Expansion>;

    /** @internal */
    prototype: Interpolator<Expansion>;
  };

  ExpansionInterpolator.prototype = Object.create(_super.prototype);
  ExpansionInterpolator.prototype.constructor = ExpansionInterpolator;

  return ExpansionInterpolator;
})(Interpolator);

/** @public */
export interface ExpansionAnimator<O = unknown, T extends Expansion | null | undefined = Expansion | null | undefined, U extends AnyExpansion | null | undefined = AnyExpansion | T, I = T> extends Animator<O, T, U, I> {
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
    if (oldValue === void 0 || oldValue === null) {
      return;
    }
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    this.setState(oldValue.withPhase(newPhase), timing, affinity);
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
    if (oldValue === void 0 || oldValue === null) {
      return;
    }
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    this.setState(oldValue.withDirection(newDirection), timing, affinity);
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
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.expanded) {
        return;
      }
      this.setValue(oldValue.asExpanding(), Affinity.Reflexive);
    }
    this.setState(Expansion.expanded(), timing as any, affinity);
  };

  ExpansionAnimator.prototype.collapse = function (this: ExpansionAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.collapsed) {
        return;
      }
      this.setValue(oldValue.asCollapsing(), Affinity.Reflexive);
    }
    this.setState(Expansion.collapsed(), timing as any, affinity);
  };

  ExpansionAnimator.prototype.toggle = function (this: ExpansionAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null) {
      return;
    }
    this.setValue(oldValue.asToggling(), Affinity.Reflexive);
    this.setState(oldValue.asToggled(), timing as any, affinity);
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
    if (newValue === void 0 || newValue === null || oldValue === void 0 || oldValue === null) {
      return;
    } else if (newValue.expanding && !oldValue.expanding) {
      this.willExpand();
    } else if (newValue.expanded && !oldValue.expanded) {
      this.didExpand();
    } else if (newValue.collapsing && !oldValue.collapsing) {
      this.willCollapse();
    } else if (newValue.collapsed && !oldValue.collapsed) {
      this.didCollapse();
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
