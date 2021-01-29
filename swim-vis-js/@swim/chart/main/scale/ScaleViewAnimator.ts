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

import {Domain, Range, Interpolator, ContinuousScale} from "@swim/mapping";
import {Tween, Transition, TweenAnimator} from "@swim/animation";
import {View, ViewAnimator} from "@swim/view";
import {ScaleView} from "../"; // forward import

export abstract class ScaleViewAnimator<V extends View, X, Y> extends ViewAnimator<V, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> {
  setScale(domain: Domain<X> | string, range: Range<Y>, tween?: Tween<ContinuousScale<X, Y>>): void;
  setScale(xMin: X, xMax: X, yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setScale(xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
           yMin?: Y | Tween<ContinuousScale<X, Y>>, yMax?: Y,
           tween?: Tween<ContinuousScale<X, Y>>): void {
    if (typeof xMin === "string") {
      xMin = ScaleView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      tween = yMin as Tween<ContinuousScale<X, Y>>;
      if (xMax instanceof Domain) {
        yMax = (xMax as Domain<Y>)[1];
        yMin = (xMax as Domain<Y>)[0];
      }
      xMax = (xMin as Domain<X>)[1];
      xMin = (xMin as Domain<X>)[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0) {
      newState = oldState.withDomain(xMin as X, xMax as X);
      if (yMin !== void 0 && yMax !== void 0) {
        newState = newState.overRange(yMin as Y, yMax);
      }
      if ((tween === void 0 || tween === null || tween === false) && (this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator(newValue, newState));
      }
    } else {
      newState = ScaleView.createScale(xMin as X, xMax as X, yMin as Y, yMax as Y);
    }
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag | TweenAnimator.OverrideFlag);
    super.setState(newState, tween);
  }

  setDomain(domain: Domain<X> | string, tween?: Tween<ContinuousScale<X, Y>>): void;
  setDomain(xMin: X, xMax: X, tween?: Tween<ContinuousScale<X, Y>>): void;
  setDomain(xMin?: Domain<X> | X | string, xMax?: X | Tween<ContinuousScale<X, Y>>,
            tween?: Tween<ContinuousScale<X, Y>>): void {
    if (typeof xMin === "string") {
      xMin = ScaleView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      tween = xMax as Tween<ContinuousScale<X, Y>>;
      xMax = (xMin as Domain<X>)[1];
      xMin = (xMin as Domain<X>)[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0) {
      newState = oldState.withDomain(xMin as X, xMax as X);
      if ((tween === void 0 || tween === null || tween === false) && (this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator(newValue, newState));
      }
    } else {
      newState = ScaleView.createScale(xMin as X, xMax as X, 0 as unknown as Y, 1 as unknown as Y);
    }
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag | TweenAnimator.OverrideFlag);
    super.setState(newState, tween);
  }

  setRange(range: Range<Y>, tween?: Tween<ContinuousScale<X, Y>>): void;
  setRange(yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setRange(yMin?: Range<Y> | Y, yMax?: Y | Tween<ContinuousScale<X, Y>>,
           tween?: Tween<ContinuousScale<X, Y>>): void {
    const oldState = this.state;
    if (oldState !== void 0) {
      if (yMin instanceof Range) {
        tween = yMax as Tween<ContinuousScale<X, Y>>;
        yMax = (yMin as Range<Y>)[1];
        yMin = (yMin as Range<Y>)[0];
      }
      const newState = oldState.overRange(yMin as Y, yMax as Y);
      if ((tween === void 0 || tween === null || tween === false) && (this.animatorFlags & TweenAnimator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.overRange(yMin as Y, yMax as Y);
        const duration = this._duration - this._baseTime;
        tween = Transition.duration(duration, void 0, Interpolator(newValue, newState));
      }
      this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag | TweenAnimator.OverrideFlag);
      super.setState(newState, tween);
    }
  }

  setBaseScale(domain: Domain<X> | string, range: Range<Y>, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseScale(xMin: X, xMax: X, yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseScale(xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
               yMin?: Y | Tween<ContinuousScale<X, Y>>, yMax?: Y,
               tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseScale(xMin as any, xMax as any, yMin as any, yMax as any, tween);
    } else {
      this.setScale(xMin as any, xMax as any, yMin as any, yMax as any, tween);
    }
  }

  setBaseDomain(domain: Domain<X> | string, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseDomain(xMin: X, xMax: X, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseDomain(xMin?: Domain<X> | X | string, xMax?: X | Tween<ContinuousScale<X, Y>>,
                tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseDomain(xMin as any, xMax as any, tween);
    } else {
      this.setDomain(xMin as any, xMax as any, tween);
    }
  }

  setBaseRange(range: Range<Y>, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseRange(yMin: Y, yMax: Y, tween?: Tween<ContinuousScale<X, Y>>): void;
  setBaseRange(yMin?: Range<Y> | Y, yMax?: Y | Tween<ContinuousScale<X, Y>>,
               tween?: Tween<ContinuousScale<X, Y>>): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseRange(yMin as any, yMax as any, tween);
    } else {
      this.setRange(yMin as any, yMax as any, tween);
    }
  }

  fromAny(value: ContinuousScale<X, Y> | string | undefined): ContinuousScale<X, Y> | undefined {
    if (typeof value === "string") {
      value = ScaleView.parseScale(value);
    }
    return value;
  }
}
