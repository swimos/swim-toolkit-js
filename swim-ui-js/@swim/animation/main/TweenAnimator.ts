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

import {Values} from "@swim/util";
import {Interpolator, AnyEasing, Easing} from "@swim/mapping";
import {Tween, AnyTransition, Transition} from "./Transition";
import {Animator} from "./Animator";

export type TweenAnimatorFlags = number;

export abstract class TweenAnimator<T> extends Animator {
  /** @hidden */
  _duration: number;
  /** @hidden */
  _easing: Easing;
  /** @hidden */
  _interpolator: Interpolator<T> | null;
  /** @hidden */
  _value: T;
  /** @hidden */
  _state: T;
  /** @hidden */
  _baseTime: number;

  constructor(value: T, transition: Transition<T> | null) {
    super();
    if (transition !== null) {
      this._duration = transition._duration !== void 0 ? transition._duration : 0;
      this._easing = transition._easing !== null ? transition._easing : Easing.linear;
      this._interpolator = transition._interpolator !== null ? transition._interpolator : null;
    } else {
      this._duration = 0;
      this._easing = Easing.linear;
      this._interpolator = null;
    }
    this._value = value;
    this._state = value;
    this._baseTime = 0;
    Object.defineProperty(this, "animatorFlags", {
      value: TweenAnimator.UpdatedFlag,
      enumerable: true,
      configurable: true,
    });
  }

  duration(): number;
  duration(duration: number): this;
  duration(duration?: number): number | this {
    if (duration === void 0) {
      return this._duration;
    } else {
      this._duration = Math.max(0, duration);
      return this;
    }
  }

  easing(): Easing;
  easing(easing: AnyEasing): this;
  easing(easing?: AnyEasing): Easing | this {
    if (easing === void 0) {
      return this._easing;
    } else {
      this._easing = Easing.fromAny(easing);
      return this;
    }
  }

  interpolator(): Interpolator<T> | null;
  interpolator(interpolator: Interpolator<T> | null): this;
  interpolator(interpolator?: Interpolator<T> | null): Interpolator<T> | null | this {
    if (interpolator === void 0) {
      return this._interpolator;
    } else {
      this._interpolator = interpolator;
      return this;
    }
  }

  transition(): Transition<T>;
  transition(transition: AnyTransition<T>): this;
  transition(transition?: AnyTransition<T>): Transition<T> | this {
    if (transition === void 0) {
      return new Transition(this._duration, this._easing, this._interpolator);
    } else {
      transition = Transition.fromAny(transition);
      if (transition._duration !== void 0) {
        this._duration = transition._duration;
      }
      if (transition._easing !== null) {
        this._easing = transition._easing;
      }
      if (transition._interpolator !== null) {
        this._interpolator = transition._interpolator;
      }
      return this;
    }
  }

  cancel(): void {
    // nop
  }

  /** @hidden */
  declare readonly animatorFlags: TweenAnimatorFlags;

  /** @hidden */
  setAnimatorFlags(animatorFlags: TweenAnimatorFlags): void {
    Object.defineProperty(this, "animatorFlags", {
      value: animatorFlags,
      enumerable: true,
      configurable: true,
    });
  }

  isTweening(): boolean {
    return (this.animatorFlags & TweenAnimator.TweeningFlag) !== 0;
  }

  isUpdated(): boolean {
    return (this.animatorFlags & TweenAnimator.UpdatedFlag) !== 0;
  }

  get value(): T {
    return this._value;
  }

  get state(): T {
    return this._state;
  }

  setState(newState: T, tween: Tween<T> = null): void {
    const oldState = this._state;
    if (newState === void 0 || tween === false || tween === null) {
      this.willSetState(newState, oldState);
      this._duration = 0;
      this._state = newState;
      this._baseTime = 0;
      if ((this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.TweeningFlag);
        this.doInterrupt(this._value);
      }
      const oldValue = this._value;
      this._value = newState;
      this._interpolator = null;
      this.onSetState(newState, oldState);
      this.cancel();
      this.update(newState, oldValue);
      this.didSetState(newState, oldState);
    } else if (!Values.equal(oldState, newState)) {
      this.willSetState(newState, oldState);
      if (tween !== true) {
        this.transition(tween);
      }
      const value = this.value;
      if (value !== void 0) {
        this._interpolator = Interpolator(value, newState);
      } else {
        this._interpolator = Interpolator(newState, newState);
      }
      this._state = newState;
      this._baseTime = 0;
      if ((this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        this.setAnimatorFlags(this.animatorFlags | (TweenAnimator.InterruptFlag | TweenAnimator.DivergedFlag));
      } else {
        this.setAnimatorFlags(this.animatorFlags | (TweenAnimator.TweeningFlag | TweenAnimator.DivergedFlag));
      }
      this.onSetState(newState, oldState);
      this.animate();
      this.didSetState(newState, oldState);
    } else if (tween !== true) {
      tween = Transition.fromAny(tween);
      // immediately complete quiesced transitions
      if ((this.animatorFlags & TweenAnimator.TweeningFlag) === 0) {
        this.doEnd(this._value);
      }
    }
  }

  protected willSetState(newState: T, oldState: T): void {
    // hook
  }

  protected onSetState(newState: T, oldState: T): void {
    // hook
  }

  protected didSetState(newState: T, oldState: T): void {
    // hook
  }

  onAnimate(t: number): void {
    if ((this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
      if ((this.animatorFlags & TweenAnimator.InterruptFlag) !== 0) {
        this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InterruptFlag);
        this.doInterrupt(this._value);
      }

      if ((this.animatorFlags & TweenAnimator.DivergedFlag) !== 0) {
        this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.DivergedFlag);
        this.doBegin(this._value);
        if (!Values.equal(this._value, this._state)) {
          this._baseTime = t;
        } else {
          this.tween(1);
        }
      }

      if ((this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const u = this._duration !== 0 ? Math.min(Math.max(0, (t - this._baseTime) / this._duration), 1) : 1;
        this.tween(u);
      }

      if ((this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        this.animate();
      } else {
        this._baseTime = 0;
        this.doEnd(this._value);
      }
    } else {
      this.onIdle();
    }
  }

  interpolate(u: number): T {
    const interpolator = this._interpolator;
    return interpolator !== null ? interpolator(u) : this._state;
  }

  tween(u: number): void {
    u = this._easing(u);
    const oldValue = this._value;
    const newValue = this.interpolate(u);
    this.update(newValue, oldValue);
    if (u === 1) {
      this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.TweeningFlag);
    }
  }

  update(newValue: T, oldValue: T): void {
    if (!Values.equal(oldValue, newValue)) {
      this.willUpdate(newValue, oldValue);
      this._value = newValue;
      this.setAnimatorFlags(this.animatorFlags | TweenAnimator.UpdatedFlag);
      this.onUpdate(newValue, oldValue);
      this.didUpdate(newValue, oldValue);
    }
  }

  willUpdate(newValue: T, oldValue: T): void {
    // hook
  }

  onUpdate(newValue: T, oldValue: T): void {
    // hook
  }

  didUpdate(newValue: T, oldValue: T): void {
    // hook
  }

  /** @hidden */
  protected doBegin(value: T): void {
    this.onBegin(value);
  }

  onBegin(value: T): void {
    // hook
  }

  /** @hidden */
  protected doEnd(value: T): void {
    this.onEnd(value);
  }

  onEnd(value: T): void {
    // hook
  }

  /** @hidden */
  protected doInterrupt(value: T): void {
    this.onInterrupt(value);
  }

  onInterrupt(value: T): void {
    // hook
  }

  /** @hidden */
  protected onIdle(): void {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.UpdatedFlag);
  }

  /** @hidden */
  static TweeningFlag: TweenAnimatorFlags = 1 << 0;
  /** @hidden */
  static DivergedFlag: TweenAnimatorFlags = 1 << 1;
  /** @hidden */
  static InterruptFlag: TweenAnimatorFlags = 1 << 2;
  /** @hidden */
  static UpdatedFlag: TweenAnimatorFlags = 1 << 3;
  /** @hidden */
  static OverrideFlag: TweenAnimatorFlags = 1 << 4;
  /** @hidden */
  static InheritedFlag: TweenAnimatorFlags = 1 << 5;

  /** @hidden */
  static AnimatorFlagsShift: number = 8;
}
