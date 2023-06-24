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
import type {FastenerClass} from "@swim/component";
import {Animator} from "@swim/component";

/** @public */
export type AnyPresence = Presence | PresenceInit | boolean;

/** @public */
export interface PresenceInit {
  /** @internal */
  uid?: never; // force type ambiguity between Presence and PresenceInit
  readonly phase: number;
  readonly direction: number;
}

/** @public */
export class Presence implements Interpolate<Presence>, HashCode, Equivalent, Debug {
  constructor(phase: number, direction: number) {
    this.phase = phase;
    this.direction = direction;
  }

  /** @internal */
  declare uid?: unknown; // force type ambiguity between Presence and PresenceInit

  readonly phase: number;

  withPhase(phase: number): Presence {
    if (phase !== this.phase) {
      return Presence.create(phase, this.direction);
    } else {
      return this;
    }
  }

  readonly direction: number;

  withDirection(direction: number): Presence {
    if (direction !== this.direction) {
      return Presence.create(this.phase, direction);
    } else {
      return this;
    }
  }

  get dismissed(): boolean {
    return this.phase === 0 && this.direction === 0;
  }

  get presented(): boolean {
    return this.phase === 1 && this.direction === 0;
  }

  get presenting(): boolean {
    return this.direction > 0;
  }

  get dismissing(): boolean {
    return this.direction < 0;
  }

  asPresenting(): Presence {
    if (!this.presenting) {
      return Presence.presenting(this.phase);
    } else {
      return this;
    }
  }

  asDismissing(): Presence {
    if (!this.dismissing) {
      return Presence.dismissing(this.phase);
    } else {
      return this;
    }
  }

  asToggling(): Presence {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Presence.dismissing(this.phase);
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Presence.presenting(this.phase);
    } else {
      return this;
    }
  }

  asToggled(): Presence {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Presence.dismissed();
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Presence.presented();
    } else {
      return this;
    }
  }

  interpolateTo(that: Presence): Interpolator<Presence>;
  interpolateTo(that: unknown): Interpolator<Presence> | null;
  interpolateTo(that: unknown): Interpolator<Presence> | null {
    if (that instanceof Presence) {
      return PresenceInterpolator(this, that);
    } else {
      return null;
    }
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Presence) {
      return Numbers.equivalent(this.phase, that.phase, epsilon)
          && Numbers.equivalent(this.direction, that.direction, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Presence) {
      return this.phase === that.phase && this.direction === that.direction;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(Presence),
        Numbers.hash(this.phase)), Numbers.hash(this.direction)));
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Presence").write(46/*'.'*/);
    if (this.phase === 0 && this.direction === 0) {
      output = output.write("dismissed").write(40/*'('*/);
    } else if (this.phase === 1 && this.direction === 0) {
      output = output.write("presented").write(40/*'('*/);
    } else if (this.direction === 1) {
      output = output.write("presenting").write(40/*'('*/);
      if (this.phase !== 0) {
        output = output.debug(this.phase);
      }
    } else if (this.direction === -1) {
      output = output.write("dismissing").write(40/*'('*/);
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
  static readonly Dismissed: Presence = new this(0, 0);

  static dismissed(): Presence {
    return this.Dismissed;
  }

  /** @internal */
  static readonly Presented: Presence = new this(1, 0);

  static presented(): Presence {
    return this.Presented;
  }

  static presenting(phase?: number): Presence {
    if (phase === void 0) {
      phase = 0;
    }
    return new Presence(phase, 1);
  }

  static dismissing(phase?: number): Presence {
    if (phase === void 0) {
      phase = 1;
    }
    return new Presence(phase, -1);
  }

  static create(phase: number, direction?: number): Presence {
    if (direction === void 0) {
      direction = 0;
    }
    if (phase === 0 && direction === 0) {
      return Presence.dismissed();
    } else if (phase === 1 && direction === 0) {
      return Presence.presented();
    } else {
      return new Presence(phase, direction);
    }
  }

  static fromInit(value: PresenceInit): Presence {
    return new Presence(value.phase, value.direction);
  }

  static fromAny(value: AnyPresence): Presence;
  static fromAny(value: AnyPresence | null): Presence | null;
  static fromAny(value: AnyPresence | null | undefined): Presence | null | undefined;
  static fromAny(value: AnyPresence | null | undefined): Presence | null | undefined {
    if (value === void 0 || value === null || value instanceof Presence) {
      return value;
    } else if (Presence.isInit(value)) {
      return Presence.fromInit(value);
    } else if (value === true) {
      return Presence.presented();
    } else if (value === false) {
      return Presence.dismissed();
    }
    throw new TypeError("" + value);
  }

  /** @internal */
  static isInit(value: unknown): value is PresenceInit {
    if (typeof value === "object" && value !== null) {
      const init = value as PresenceInit;
      return typeof init.phase === "number"
          && typeof init.direction === "number";
    }
    return false;
  }

  /** @internal */
  static isAny(value: unknown): value is AnyPresence {
    return value instanceof Presence
        || Presence.isInit(value)
        || typeof value === "boolean";
  }
}

/** @internal */
export const PresenceInterpolator = (function (_super: typeof Interpolator) {
  const PresenceInterpolator = function (p0: Presence, p1: Presence): Interpolator<Presence> {
    const interpolator = function (u: number): Presence {
      const p0 = interpolator[0];
      const p1 = interpolator[1];
      const phase = p0.phase + u * (p1.phase - p0.phase);
      const direction = u !== 1 ? p0.direction : p1.direction;
      return Presence.create(phase, direction);
    } as Interpolator<Presence>;
    Object.setPrototypeOf(interpolator, PresenceInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = p0;
    (interpolator as Mutable<typeof interpolator>)[1] = p1;
    return interpolator;
  } as {
    (p0: Presence, p1: Presence): Interpolator<Presence>;

    /** @internal */
    prototype: Interpolator<Presence>;
  };

  PresenceInterpolator.prototype = Object.create(_super.prototype);
  PresenceInterpolator.prototype.constructor = PresenceInterpolator;

  return PresenceInterpolator;
})(Interpolator);

/** @public */
export interface PresenceAnimator<O = unknown, T extends Presence | null | undefined = Presence | null | undefined, U extends AnyPresence | null | undefined = AnyPresence | T> extends Animator<O, T, U> {
  get phase(): number | undefined;

  getPhase(): number;

  getPhaseOr<E>(elsePhase: E): number | E;

  setPhase(newPhase: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setPhase(newPhase: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get direction(): number;

  setDirection(newDirection: number, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setDirection(newDirection: number, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  get dismissed(): boolean;

  get presented(): boolean;

  get presenting(): boolean;

  get dismissing(): boolean;

  present(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  present(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  dismiss(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  dismiss(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  toggle(timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  toggle(timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  setState(newState: T | U, timingOrAffinity: Affinity | AnyTiming | boolean | null | undefined): void;
  setState(newState: T | U, timing?: AnyTiming | boolean | null, affinity?: Affinity): void;

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected */
  willPresent(): void;

  /** @protected */
  didPresent(): void;

  /** @protected */
  willDismiss(): void;

  /** @protected */
  didDismiss(): void;

  /** @override */
  equalValues(newValue: T, oldValue: T | undefined): boolean;

  /** @override */
  fromAny(value: T | U): T;
}

/** @public */
export const PresenceAnimator = (function (_super: typeof Animator) {
  const PresenceAnimator = _super.extend("PresenceAnimator", {
    valueType: Presence,
  }) as FastenerClass<PresenceAnimator<any, any, any>>;

  Object.defineProperty(PresenceAnimator.prototype, "phase", {
    get(this: PresenceAnimator): number | undefined {
      const value = this.value;
      return value !== void 0 && value !== null ? value.phase : void 0;
    },
    configurable: true,
  });

  PresenceAnimator.prototype.getPhase = function (this: PresenceAnimator): number {
    return this.getValue().phase;
  };

  PresenceAnimator.prototype.getPhaseOr = function <E>(this: PresenceAnimator, elsePhase: E): number | E {
    const value = this.value;
    if (value !== void 0 && value !== null) {
      return value.phase;
    } else {
      return elsePhase;
    }
  };

  PresenceAnimator.prototype.setPhase = function (this: PresenceAnimator, newPhase: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
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

  Object.defineProperty(PresenceAnimator.prototype, "direction", {
    get(this: PresenceAnimator): number {
      const value = this.value;
      return value !== void 0 && value !== null ? value.direction : 0;
    },
    configurable: true,
  });

  PresenceAnimator.prototype.setDirection = function (this: PresenceAnimator, newDirection: number, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
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

  Object.defineProperty(PresenceAnimator.prototype, "dismissed", {
    get(this: PresenceAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.dismissed;
    },
    configurable: true,
  });

  Object.defineProperty(PresenceAnimator.prototype, "presented", {
    get(this: PresenceAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.presented;
    },
    configurable: true,
  });

  Object.defineProperty(PresenceAnimator.prototype, "presenting", {
    get(this: PresenceAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.presenting;
    },
    configurable: true,
  });

  Object.defineProperty(PresenceAnimator.prototype, "dismissing", {
    get(this: PresenceAnimator): boolean {
      const value = this.value;
      return value !== void 0 && value !== null && value.dismissing;
    },
    configurable: true,
  });

  PresenceAnimator.prototype.present = function (this: PresenceAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.presented) {
        return;
      }
      this.setValue(oldValue.asPresenting(), Affinity.Reflexive);
    }
    this.setState(Presence.presented(), timing as any, affinity);
  };

  PresenceAnimator.prototype.dismiss = function (this: PresenceAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (oldValue.dismissed) {
        return;
      }
      this.setValue(oldValue.asDismissing(), Affinity.Reflexive);
    }
    this.setState(Presence.dismissed(), timing as any, affinity);
  };

  PresenceAnimator.prototype.toggle = function (this: PresenceAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null) {
      return;
    }
    this.setValue(oldValue.asToggling(), Affinity.Reflexive);
    this.setState(oldValue.asToggled(), timing as any, affinity);
  };

  PresenceAnimator.prototype.setState = function (this: PresenceAnimator, newState: AnyPresence | null | undefined, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    if (typeof timing === "number") {
      affinity = timing;
      timing = void 0;
    }
    if (timing === void 0 || timing === true) {
      timing = this.transition;
    }
    if (typeof newState === "boolean") {
      const oldValue = this.value;
      const newValue = newState ? Presence.presented() : Presence.dismissed();
      if (oldValue !== void 0 && oldValue !== null && !oldValue.equals(newValue)) {
        this.setValue(newState ? oldValue.asPresenting() : oldValue.asDismissing(), Affinity.Reflexive);
      }
      newState = newValue;
    }
    _super.prototype.setState.call(this, newState, timing, affinity);
  };

  PresenceAnimator.prototype.onSetValue = function (this: PresenceAnimator, newValue: Presence | null | undefined, oldValue: Presence | null | undefined): void {
    _super.prototype.onSetValue.call(this, newValue, oldValue);
    if (newValue === void 0 || newValue === null || oldValue === void 0 || oldValue === null) {
      return;
    } else if (newValue.presenting && !oldValue.presenting) {
      this.willPresent();
    } else if (newValue.presented && !oldValue.presented) {
      this.didPresent();
    } else if (newValue.dismissing && !oldValue.dismissing) {
      this.willDismiss();
    } else if (newValue.dismissed && !oldValue.dismissed) {
      this.didDismiss();
    }
  };

  PresenceAnimator.prototype.willPresent = function (this: PresenceAnimator): void {
    // hook
  };

  PresenceAnimator.prototype.didPresent = function (this: PresenceAnimator): void {
    // hook
  };

  PresenceAnimator.prototype.willDismiss = function (this: PresenceAnimator): void {
    // hook
  };

  PresenceAnimator.prototype.didDismiss = function (this: PresenceAnimator): void {
    // hook
  };

  PresenceAnimator.prototype.fromAny = function (this: PresenceAnimator, value: AnyPresence | null | undefined): Presence | null | undefined {
    return value !== void 0 && value !== null ? Presence.fromAny(value) : null;
  };

  PresenceAnimator.prototype.equalValues = function (this: PresenceAnimator, newValue: Presence | null | undefined, oldState: Presence | null | undefined): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldState);
    } else {
      return newValue === oldState;
    }
  };

  return PresenceAnimator;
})(Animator);
