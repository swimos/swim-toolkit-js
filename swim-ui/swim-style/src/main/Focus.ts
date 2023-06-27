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

import {Murmur3} from "@swim/util";
import type {Mutable} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import type {Equivalent} from "@swim/util";
import type {HashCode} from "@swim/util";
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
export type AnyFocus = Focus | FocusInit | boolean;

/** @public */
export interface FocusInit {
  /** @internal */
  uid?: never; // force type ambiguity between Focus and FocusInit
  readonly phase: number;
  readonly direction: number;
}

/** @public */
export class Focus implements Interpolate<Focus>, HashCode, Equivalent, Debug {
  constructor(phase: number, direction: number) {
    this.phase = phase;
    this.direction = direction;
  }

  /** @internal */
  declare uid?: unknown; // force type ambiguity between Focus and FocusInit

  readonly phase: number;

  withPhase(phase: number): Focus {
    if (phase !== this.phase) {
      return Focus.create(phase, this.direction);
    } else {
      return this;
    }
  }

  readonly direction: number;

  withDirection(direction: number): Focus {
    if (direction !== this.direction) {
      return Focus.create(this.phase, direction);
    } else {
      return this;
    }
  }

  get unfocused(): boolean {
    return this.phase === 0 && this.direction === 0;
  }

  get focused(): boolean {
    return this.phase === 1 && this.direction === 0;
  }

  get focusing(): boolean {
    return this.direction > 0;
  }

  get unfocusing(): boolean {
    return this.direction < 0;
  }

  asFocusing(): Focus {
    if (!this.focusing) {
      return Focus.focusing(this.phase);
    } else {
      return this;
    }
  }

  asUnfocusing(): Focus {
    if (!this.unfocusing) {
      return Focus.unfocusing(this.phase);
    } else {
      return this;
    }
  }

  asToggling(): Focus {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Focus.unfocusing(this.phase);
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Focus.focusing(this.phase);
    } else {
      return this;
    }
  }

  asToggled(): Focus {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Focus.unfocused();
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Focus.focused();
    } else {
      return this;
    }
  }

  interpolateTo(that: Focus): Interpolator<Focus>;
  interpolateTo(that: unknown): Interpolator<Focus> | null;
  interpolateTo(that: unknown): Interpolator<Focus> | null {
    if (that instanceof Focus) {
      return FocusInterpolator(this, that);
    } else {
      return null;
    }
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Focus) {
      return Numbers.equivalent(this.phase, that.phase, epsilon)
          && Numbers.equivalent(this.direction, that.direction, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Focus) {
      return this.phase === that.phase && this.direction === that.direction;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(Focus),
        Numbers.hash(this.phase)), Numbers.hash(this.direction)));
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Focus").write(46/*'.'*/);
    if (this.phase === 0 && this.direction === 0) {
      output = output.write("unfocused").write(40/*'('*/);
    } else if (this.phase === 1 && this.direction === 0) {
      output = output.write("focused").write(40/*'('*/);
    } else if (this.direction === 1) {
      output = output.write("focusing").write(40/*'('*/);
      if (this.phase !== 0) {
        output = output.debug(this.phase);
      }
    } else if (this.direction === -1) {
      output = output.write("unfocusing").write(40/*'('*/);
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

  toString(): string {
    return Format.debug(this);
  }

  /** @internal */
  static readonly Unfocused: Focus = new this(0, 0);

  static unfocused(): Focus {
    return this.Unfocused;
  }

  /** @internal */
  static readonly Focused: Focus = new this(1, 0);

  static focused(): Focus {
    return this.Focused;
  }

  static focusing(phase?: number): Focus {
    if (phase === void 0) {
      phase = 0;
    }
    return new Focus(phase, 1);
  }

  static unfocusing(phase?: number): Focus {
    if (phase === void 0) {
      phase = 1;
    }
    return new Focus(phase, -1);
  }

  static create(phase: number, direction?: number): Focus {
    if (direction === void 0) {
      direction = 0;
    }
    if (phase === 0 && direction === 0) {
      return Focus.unfocused();
    } else if (phase === 1 && direction === 0) {
      return Focus.focused();
    } else {
      return new Focus(phase, direction);
    }
  }

  static fromInit(value: FocusInit): Focus {
    return new Focus(value.phase, value.direction);
  }

  static fromAny(value: AnyFocus): Focus;
  static fromAny(value: AnyFocus | null): Focus | null;
  static fromAny(value: AnyFocus | null | undefined): Focus | null | undefined;
  static fromAny(value: AnyFocus | null | undefined): Focus | null | undefined {
    if (value === void 0 || value === null || value instanceof Focus) {
      return value;
    } else if (Focus.isInit(value)) {
      return Focus.fromInit(value);
    } else if (value === true) {
      return Focus.focused();
    } else if (value === false) {
      return Focus.unfocused();
    }
    throw new TypeError("" + value);
  }

  /** @internal */
  static isInit(value: unknown): value is FocusInit {
    if (typeof value === "object" && value !== null) {
      const init = value as FocusInit;
      return typeof init.phase === "number"
          && typeof init.direction === "number";
    }
    return false;
  }

  /** @internal */
  static isAny(value: unknown): value is AnyFocus {
    return value instanceof Focus
        || Focus.isInit(value)
        || typeof value === "boolean";
  }
}

/** @internal */
export const FocusInterpolator = (function (_super: typeof Interpolator) {
  const FocusInterpolator = function (f0: Focus, f1: Focus): Interpolator<Focus> {
    const interpolator = function (u: number): Focus {
      const f0 = interpolator[0];
      const f1 = interpolator[1];
      const phase = f0.phase + u * (f1.phase - f0.phase);
      const direction = u !== 1 ? f0.direction : f1.direction;
      return Focus.create(phase, direction);
    } as Interpolator<Focus>;
    Object.setPrototypeOf(interpolator, FocusInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = f0;
    (interpolator as Mutable<typeof interpolator>)[1] = f1;
    return interpolator;
  } as {
    (f0: Focus, f1: Focus): Interpolator<Focus>;

    /** @internal */
    prototype: Interpolator<Focus>;
  };

  FocusInterpolator.prototype = Object.create(_super.prototype);
  FocusInterpolator.prototype.constructor = FocusInterpolator;

  return FocusInterpolator;
})(Interpolator);

/** @public */
export interface FocusAnimator<O = unknown, T extends Focus | null | undefined = Focus | null | undefined, U extends AnyFocus | null | undefined = AnyFocus | T> extends Animator<O, T, U> {
  get phase(): number | undefined;

  getPhase(): number;

  getPhaseOr<E>(elsePhase: E): number | E;

  setPhase(newPhase: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setPhase(newPhase: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get direction(): number;

  setDirection(newDirection: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setDirection(newDirection: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get unfocused(): boolean;

  get focused(): boolean;

  get focusing(): boolean;

  get unfocusing(): boolean;

  focus(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  focus(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  unfocus(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  unfocus(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  toggle(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  toggle(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  setState(newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setState(newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  willFocus(): void;

  /** @protected */
  didFocus(): void;

  /** @protected */
  willUnfocus(): void;

  /** @protected */
  didUnfocus(): void;

  /** @override */
  equalValues(newState: T, oldState: T | undefined): boolean;

  /** @override */
  fromAny(value: T | U): T;
}

/** @public */
export const FocusAnimator = (function (_super: typeof Animator) {
  const FocusAnimator = _super.extend("FocusAnimator", {
    valueType: Focus,
  }) as AnimatorClass<FocusAnimator<any, any, any>>;

  Object.defineProperty(FocusAnimator.prototype, "phase", {
    get(this: FocusAnimator): number | undefined {
      const value = this.value;
      return value !== void 0 && value !== null ? value.phase : void 0;
    },
    configurable: true,
  });

  FocusAnimator.prototype.getPhase = function (this: FocusAnimator): number {
    return this.getValue().phase;
  };

  FocusAnimator.prototype.getPhaseOr = function <E>(this: FocusAnimator, elsePhase: E): number | E {
    const value = this.value;
    if (value !== void 0 && value !== null) {
      return value.phase;
    } else {
      return elsePhase;
    }
  };

  FocusAnimator.prototype.setPhase = function (this: FocusAnimator, newPhase: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
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

  Object.defineProperty(FocusAnimator.prototype, "direction", {
    get(this: FocusAnimator): number {
      const value = this.value;
      return value !== void 0 && value !== null ? value.direction : 0;
    },
    configurable: true,
  });

  FocusAnimator.prototype.setDirection = function (this: FocusAnimator, newDirection: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
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

  Object.defineProperty(FocusAnimator.prototype, "unfocused", {
    get(this: FocusAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.unfocused;
    },
    configurable: true,
  });

  Object.defineProperty(FocusAnimator.prototype, "focused", {
    get(this: FocusAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.focused;
    },
    configurable: true,
  });

  Object.defineProperty(FocusAnimator.prototype, "focusing", {
    get(this: FocusAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.focusing;
    },
    configurable: true,
  });

  Object.defineProperty(FocusAnimator.prototype, "unfocusing", {
    get(this: FocusAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.unfocusing;
    },
    configurable: true,
  });

  FocusAnimator.prototype.focus = function (this: FocusAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.focused) {
        return;
      }
      this.setValue(oldValue.asFocusing(), Affinity.Reflexive);
    }
    this.setState(Focus.focused(), timing as any, affinity);
  };

  FocusAnimator.prototype.unfocus = function (this: FocusAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.unfocused) {
        return;
      }
      this.setValue(oldValue.asUnfocusing(), Affinity.Reflexive);
    }
    this.setState(Focus.unfocused(), timing as any, affinity);
  };

  FocusAnimator.prototype.toggle = function (this: FocusAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null) {
      return;
    }
    this.setValue(oldValue.asToggling(), Affinity.Reflexive);
    this.setState(oldValue.asToggled(), timing as any, affinity);
  };

  FocusAnimator.prototype.setState = function (this: FocusAnimator, newState: AnyFocus | null | undefined, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    if (timing === void 0 || timing === true) {
      timing = this.transition;
    }
    if (typeof newState === "boolean") {
      const oldValue = this.value;
      const newValue = newState ? Focus.focused() : Focus.unfocused();
      if (oldValue !== void 0 && oldValue !== null && !oldValue.equals(newValue)) {
        this.setValue(newState ? oldValue.asFocusing() : oldValue.asUnfocusing(), Affinity.Reflexive);
      }
      newState = newValue;
    }
    _super.prototype.setState.call(this, newState, timing, affinity);
  };

  FocusAnimator.prototype.onSetValue = function (this: FocusAnimator, newValue: Focus | null | undefined, oldValue: Focus | null | undefined): void {
    _super.prototype.onSetValue.call(this, newValue, oldValue);
    if (newValue === void 0 || newValue === null || oldValue === void 0 || oldValue === null) {
      return;
    } else if (newValue.focusing && !oldValue.focusing) {
      this.willFocus();
    } else if (newValue.focused && !oldValue.focused) {
      this.didFocus();
    } else if (newValue.unfocusing && !oldValue.unfocusing) {
      this.willUnfocus();
    } else if (newValue.unfocused && !oldValue.unfocused) {
      this.didUnfocus();
    }
  };

  FocusAnimator.prototype.willFocus = function (this: FocusAnimator): void {
    // hook
  };

  FocusAnimator.prototype.didFocus = function (this: FocusAnimator): void {
    // hook
  };

  FocusAnimator.prototype.willUnfocus = function (this: FocusAnimator): void {
    // hook
  };

  FocusAnimator.prototype.didUnfocus = function (this: FocusAnimator): void {
    // hook
  };

  FocusAnimator.prototype.fromAny = function (this: FocusAnimator, value: AnyFocus | null | undefined): Focus | null | undefined {
    return value !== void 0 && value !== null ? Focus.fromAny(value) : null;
  };

  FocusAnimator.prototype.equalValues = function (this: FocusAnimator, newState: Focus | null | undefined, oldState: Focus | null | undefined): boolean {
    if (newState !== void 0 && newState !== null) {
      return newState.equals(oldState);
    } else {
      return newState === oldState;
    }
  };

  return FocusAnimator;
})(Animator);
