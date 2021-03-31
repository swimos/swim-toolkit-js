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

import {Interpolator} from "@swim/interpolate";
import {Scale, ContinuousScale} from "@swim/scale";
import {Tween, Transition, TweenAnimator} from "@swim/tween";
import {View, ViewAnimator} from "@swim/view";

export abstract class ScaleViewAnimator<V extends View, X, Y> extends ViewAnimator<V, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> {
  setScale(domain: readonly [X, X] | string, range: readonly [Y, Y], tween?: Tween<ContinuousScale<X, Y>>): void;
  setScale(xMin: X, xMax: X, yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setScale(xMin?: readonly [X, X] | X | string, xMax?: readonly [Y, Y] | X,
           yMin?: Y | Tween<ContinuousScale<X, Y>>, yMax?: Y,
           tween?: Tween<ContinuousScale<X, Y>>): void {
    if (typeof xMin === "string") {
      xMin = Scale.parse<X, Y>(xMin).domain();
    }
    if (Array.isArray(xMin)) {
      tween = yMin as Tween<ContinuousScale<X, Y>>;
      if (Array.isArray(xMax)) {
        yMax = (xMax as readonly [Y, Y])[1];
        yMin = (xMax as readonly [Y, Y])[0];
      }
      xMax = (xMin as readonly [X, X])[1];
      xMin = (xMin as readonly [X, X])[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0) {
      newState = oldState.domain(xMin as X, xMax as X);
      if (yMin !== void 0 && yMax !== void 0) {
        newState = newState.range(yMin as Y, yMax);
      }
      if ((tween === void 0 || tween === null || tween === false) && (this._animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.domain(xMin as X, xMax as X);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator.between(newValue, newState));
      }
    } else {
      newState = Scale.from(xMin as X, xMax as X, Interpolator.between(yMin as Y, yMax as Y));
    }
    this._animatorFlags |= TweenAnimator.OverrideFlag;
    this._animatorFlags &= ~TweenAnimator.InheritedFlag;
    super.setState(newState, tween);
  }

  setDomain(domain: readonly [X, X] | string, tween?: Tween<ContinuousScale<X, Y>>): void;
  setDomain(xMin: X, xMax: X, tween?: Tween<ContinuousScale<X, Y>>): void;
  setDomain(xMin?: readonly [X, X] | X | string, xMax?: X | Tween<ContinuousScale<X, Y>>,
            tween?: Tween<ContinuousScale<X, Y>>): void {
    if (typeof xMin === "string") {
      xMin = Scale.parse<X, Y>(xMin).domain();
    }
    if (Array.isArray(xMin)) {
      tween = xMax as Tween<ContinuousScale<X, Y>>;
      xMax = (xMin as readonly [X, X])[1];
      xMin = (xMin as readonly [X, X])[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0) {
      newState = oldState.domain(xMin as X, xMax as X);
      if ((tween === void 0 || tween === null || tween === false) && (this._animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.domain(xMin as X, xMax as X);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator.between(newValue, newState));
      }
    } else {
      newState = Scale.from(xMin as X, xMax as X, Interpolator.between(void 0 as unknown as Y, void 0 as unknown as Y));
    }
    this._animatorFlags |= TweenAnimator.OverrideFlag;
    this._animatorFlags &= ~TweenAnimator.InheritedFlag;
    super.setState(newState, tween);
  }

  setRange(range: readonly [Y, Y], tween?: Tween<ContinuousScale<X, Y>>): void;
  setRange(yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setRange(yMin?: readonly [Y, Y] | Y, yMax?: Y | Tween<ContinuousScale<X, Y>>,
           tween?: Tween<ContinuousScale<X, Y>>): void {
    const oldState = this.state;
    if (oldState !== void 0) {
      if (Array.isArray(yMin)) {
        tween = yMax as Tween<ContinuousScale<X, Y>>;
        yMax = (yMin as readonly [Y, Y])[1];
        yMin = (yMin as readonly [Y, Y])[0];
      }
      const newState = oldState.range(yMin as Y, yMax as Y);
      if ((tween === void 0 || tween === null || tween === false) && (this._animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.range(yMin as Y, yMax as Y);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator.between(newValue, newState));
      }
      this._animatorFlags |= TweenAnimator.OverrideFlag;
      this._animatorFlags &= ~TweenAnimator.InheritedFlag;
      super.setState(newState, tween);
    }
  }

  setBaseScale(domain: readonly [X, X] | string, range: readonly [Y, Y], tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseScale(xMin: X, xMax: X, yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseScale(xMin?: readonly [X, X] | X | string, xMax?: readonly [Y, Y] | X,
               yMin?: Y | Tween<ContinuousScale<X, Y>>, yMax?: Y,
               tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseScale(xMin as any, xMax as any, yMin as any, yMax as any, tween);
    } else {
      this.setScale(xMin as any, xMax as any, yMin as any, yMax as any, tween);
    }
  }

  setBaseDomain(domain: readonly [X, X] | string, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseDomain(xMin: X, xMax: X, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseDomain(xMin?: readonly [X, X] | X | string, xMax?: X | Tween<ContinuousScale<X, Y>>,
                tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseDomain(xMin as any, xMax as any, tween);
    } else {
      this.setDomain(xMin as any, xMax as any, tween);
    }
  }

  setBaseRange(range: readonly [Y, Y], tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseRange(yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseRange(yMin?: readonly [Y, Y] | Y, yMax?: Y | Tween<ContinuousScale<X, Y>>,
               tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseRange(yMin as any, yMax as any, tween);
    } else {
      this.setRange(yMin as any, yMax as any, tween);
    }
  }

  fromAny(value: ContinuousScale<X, Y> | string | undefined): ContinuousScale<X, Y> | undefined {
    if (typeof value === "string") {
      value = Scale.parse(value);
    }
    return value;
  }
}
