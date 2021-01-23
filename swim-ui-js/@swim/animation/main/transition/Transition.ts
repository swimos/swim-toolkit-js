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
import {AnyRange, Range, Interpolator, IdentityInterpolator, AnyEasing, Easing} from "@swim/mapping";
import {TransitionObserver} from "./TransitionObserver";

export type Tween<T> = AnyTransition<T> | boolean | null;

export type AnyTransition<T> = Transition<T> | TransitionInit<T>;

export interface TransitionInit<T> extends TransitionObserver<T> {
  duration?: number | null;
  easing?: AnyEasing | null;
  interpolator?: Interpolator<T> | null;
}

export type TransitionBegin<T> = (value: T) => void;
export type TransitionEnd<T> = (value: T) => void;
export type TransitionInterrupt<T> = (value: T) => void;

export class Transition<T> {
  /** @hidden */
  readonly _duration?: number;
  /** @hidden */
  readonly _easing?: Easing;
  /** @hidden */
  readonly _interpolator?: Interpolator<T>;
  /** @hidden */
  readonly _observers?: ReadonlyArray<TransitionObserver<T>>;

  constructor(duration: number | null, easing: Easing | null,
              interpolator: Interpolator<T> | null,
              observers: ReadonlyArray<TransitionObserver<T>> | null) {
    if (duration !== null) {
      this._duration = duration;
    }
    if (easing !== null) {
      this._easing = easing;
    }
    if (interpolator !== null) {
      this._interpolator = interpolator;
    }
    if (observers !== null) {
      this._observers = observers;
    }
  }

  duration(): number | null;
  duration(duration: number | null): Transition<T>;
  duration(duration?: number | null): number | null | Transition<T> {
    if (duration === void 0) {
      return this._duration !== void 0 ? this._duration : null;
    } else {
      return Transition.create(duration, this._easing, this._interpolator, this._observers);
    }
  }

  easing(): Easing | null;
  easing(easing: AnyEasing | null): Transition<T>;
  easing(easing?: AnyEasing | null): Easing | null | Transition<T> {
    if (easing === void 0) {
      return this._easing !== void 0 ? this._easing : null;
    } else {
      return Transition.create(this._duration, easing, this._interpolator, this._observers);
    }
  }

  interpolator(): Interpolator<T> | null;
  interpolator(interpolator: Interpolator<T> | null): Transition<T>;
  interpolator(interpolator?: Interpolator<T> | null): Interpolator<T> | null | Transition<T> {
    if (interpolator === void 0) {
      return this._interpolator !== void 0 ? this._interpolator : null;
    } else {
      return Transition.create(this._duration, this._easing, interpolator, this._observers);
    }
  }

  range(): Range<T> | null;
  range(ys: AnyRange<T>): Transition<T>;
  range(y0: T, y1: T): Transition<T>;
  range(y0?: AnyRange<T> | T, y1?: T): Range<T> | null | Transition<T> {
    if (y0 === void 0) {
      return this._interpolator !== void 0 ? this._interpolator : null;
    } else {
      let interpolator: Interpolator<T>;
      if (arguments.length === 1) {
        if (y0 instanceof Interpolator) {
          interpolator = y0;
        } else {
          interpolator = Interpolator((y0 as AnyRange<T>)[0], (y0 as AnyRange<T>)[1]);
        }
      } else {
        interpolator = Interpolator(y0 as T, y1!);
      }
      return Transition.create(this._duration, this._easing, interpolator, this._observers);
    }
  }

  observers(): ReadonlyArray<TransitionObserver<T>> | null;
  observers(observers: ReadonlyArray<TransitionObserver<T>> | null): Transition<T>;
  observers(observers?: ReadonlyArray<TransitionObserver<T>> | null): ReadonlyArray<TransitionObserver<T>> | null | Transition<T> {
    if (observers === void 0) {
      return this._observers !== void 0 ? this._observers : null;
    } else {
      return Transition.create(this._duration, this._easing, this._interpolator, observers);
    }
  }

  observer(observer: TransitionObserver<T>): Transition<T> {
    const observers = this._observers !== void 0 ? this._observers.slice(0) : [];
    observers.push(observer);
    return Transition.create(this._duration, this._easing, this._interpolator, observers);
  }

  onBegin(onBegin: TransitionBegin<T>): Transition<T> {
    const observer: TransitionObserver<T> = {onBegin};
    const observers = this._observers !== void 0 ? this._observers.slice(0) : [];
    observers.push(observer);
    return Transition.create(this._duration, this._easing, this._interpolator, observers);
  }

  onEnd(onEnd: TransitionEnd<T>): Transition<T> {
    const observer: TransitionObserver<T> = {onEnd};
    const observers = this._observers !== void 0 ? this._observers.slice(0) : [];
    observers.push(observer);
    return Transition.create(this._duration, this._easing, this._interpolator, observers);
  }

  onInterrupt(onInterrupt: TransitionInterrupt<T>): Transition<T> {
    const observer: TransitionObserver<T> = {onInterrupt};
    const observers = this._observers !== void 0 ? this._observers.slice(0) : [];
    observers.push(observer);
    return Transition.create(this._duration, this._easing, this._interpolator, observers);
  }

  toAny(): TransitionInit<T> {
    const init: TransitionInit<T> = {};
    if (this._duration !== void 0) {
      init.duration = this._duration;
    }
    if (this._easing !== void 0) {
      init.easing = this._easing;
    }
    if (this._interpolator !== void 0) {
      init.interpolator = this._interpolator;
    }
    return init;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Transition) {
      return this._duration === that._duration && this._easing === that._easing
          && Equals(this._interpolator, that._interpolator);
    }
    return false;
  }

  static create<T>(duration?: number | null, easing?: AnyEasing | null,
                   interpolator?: Interpolator<T> | null,
                   observers?: ReadonlyArray<TransitionObserver<T>> | null): Transition<T> {
    if (duration === void 0) {
      duration = null;
    }
    easing = easing !== void 0 && easing !== null ? Easing.fromAny(easing) : null;
    if (interpolator === void 0) {
      interpolator = null;
    }
    if (observers === void 0) {
      observers = null;
    }
    return new Transition(duration, easing, interpolator, observers);
  }

  static duration<T>(duration: number, easing?: AnyEasing | null,
                     interpolator?: Interpolator<T> | null): Transition<T> {
    easing = easing !== void 0 && easing !== null ? Easing.fromAny(easing) : null;
    if (interpolator === void 0) {
      interpolator = null;
    }
    return new Transition(duration, easing, interpolator, null);
  }

  static easing<T>(easing: AnyEasing, interpolator?: Interpolator<T> | null): Transition<T> {
    easing = Easing.fromAny(easing);
    if (interpolator === void 0) {
      interpolator = null;
    }
    return new Transition(null, easing, interpolator, null);
  }

  static interpolator<T>(interpolator: Interpolator<T>): Transition<T> {
    return new Transition(null, null, interpolator, null);
  }

  static range<T>(y0: AnyRange<T>): Transition<T>;
  static range<T>(y0: T, y1: T): Transition<T>;
  static range<T>(y0: AnyRange<T> | T, y1?: T): Transition<T> {
    let interpolator: Interpolator<T>;
    if (arguments.length === 1) {
      if (y0 instanceof Interpolator) {
        interpolator = y0;
      } else {
        interpolator = Interpolator((y0 as AnyRange<T>)[0], (y0 as AnyRange<T>)[1]);
      }
    } else {
      interpolator = Interpolator(y0 as T, y1!);
    }
    return new Transition(null, null, interpolator, null);
  }

  static fromInit<T>(transition: TransitionInit<T>): Transition<T> {
    let observers: ReadonlyArray<TransitionObserver<T>> | undefined;
    if (TransitionObserver.is(transition)) {
      const observer: TransitionObserver<T> = {};
      if (transition.onBegin !== void 0) {
        observer.onBegin = transition.onBegin;
      }
      if (transition.onEnd !== void 0) {
        observer.onEnd = transition.onEnd;
      }
      if (transition.onInterrupt !== void 0) {
        observer.onInterrupt = transition.onInterrupt;
      }
      observers = [observer];
    }
    return Transition.create(transition.duration, transition.easing, transition.interpolator, observers);
  }

  static fromAny<T>(transition: AnyTransition<T>): Transition<T> {
    if (transition instanceof Transition) {
      return transition;
    } else if (Transition.isInit(transition)) {
      return Transition.fromInit(transition);
    }
    throw new TypeError("" + transition);
  }

  static forTween<T>(tween: Tween<T> | undefined, value?: T extends undefined ? never : T,
                     duration: number | null = null,
                     easing: AnyEasing | null = null): Transition<T> | null {
    if (tween instanceof Transition) {
      return tween;
    } else if (Transition.isInit(tween)) {
      return Transition.fromInit(tween);
    } else if (tween === true && value !== void 0) {
      return Transition.create(duration, easing, IdentityInterpolator(value));
    }
    return null;
  }

  /** @hidden */
  static isInit(value: unknown): value is TransitionInit<any> {
    if (typeof value === "object" && value !== null) {
      const init = value as TransitionInit<any>;
      return init.duration !== void 0
          || init.easing !== void 0
          || init.interpolator !== void 0;
    }
    return false;
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyTransition<any> {
    return value instanceof Transition
        || Transition.isInit(value);
  }

  /** @hidden */
  static isTween(value: unknown): value is Tween<any> {
    return Transition.isAny(value)
        || typeof value === "boolean"
        || value === null;
  }
}
