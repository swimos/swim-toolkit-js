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

import {Domain} from "@swim/util";
import {Range} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {ContinuousScale} from "@swim/util";
import type {AnyDateTime} from "@swim/time";
import {DateTime} from "@swim/time";
import {TimeDomain} from "@swim/time";
import {Affinity} from "@swim/component";
import type {AnimatorClass} from "@swim/component";
import {Animator} from "@swim/component";
import type {View} from "@swim/view";
import {ScaledView} from "../"; // forward import

/** @public */
export interface ContinuousScaleAnimator<O extends View = View, X = unknown, Y = unknown, T extends ContinuousScale<X, Y> | null | undefined = ContinuousScale<X, Y> | null, U extends ContinuousScale<X, Y> | string | null | undefined = ContinuousScale<X, Y> | string | T> extends Animator<O, T, U> {
  setScale(domain: Domain<X> | string, range: Range<Y>, timing?: AnyTiming | boolean | null): void;
  setScale(xMin: X, xMax: X, yMin: Y, yMax: Y, timing?: AnyTiming | boolean | null): void;

  setDomain(domain: Domain<X> | string, timing?: AnyTiming | boolean | null): void;
  setDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean | null): void;

  setRange(range: Range<Y>, timing?: AnyTiming | boolean | null): void;
  setRange(yMin: Y, yMax: Y, timing?: AnyTiming | boolean | null): void;

  setBaseScale(domain: Domain<X> | string, range: Range<Y>, timing?: AnyTiming | boolean | null): void;
  setBaseScale(xMin: X, xMax: X, yMin: Y, yMax: Y, timing?: AnyTiming | boolean | null): void;

  setBaseDomain(domain: Domain<X> | string, timing?: AnyTiming | boolean | null): void;
  setBaseDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean | null): void;

  setBaseRange(range: Range<Y>, timing?: AnyTiming | boolean | null): void;
  setBaseRange(yMin: Y, yMax: Y, timing?: AnyTiming | boolean | null): void;

  createDomain(xMin: X, xMax: X): Domain<X>;

  /** @override */
  fromAny(value: T | U): T;
}

/** @public */
export const ContinuousScaleAnimator = (function (_super: typeof Animator) {
  const ContinuousScaleAnimator = _super.extend("ContinuousScaleAnimator", {
    valueType: ContinuousScale,
  }) as AnimatorClass<ContinuousScaleAnimator<any, any, any, any, any>>;

  ContinuousScaleAnimator.prototype.setScale = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
                                                               yMin?: Y | AnyTiming | boolean | null, yMax?: Y, timing?: AnyTiming | boolean | null): void {
    if (typeof xMin === "string") {
      xMin = ScaledView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      timing = yMin as AnyTiming | boolean | null;
      if (xMax instanceof Domain) {
        yMax = (xMax as Domain<Y>)[1];
        yMin = (xMax as Domain<Y>)[0];
      }
      xMax = (xMin as Domain<X>)[1];
      xMin = (xMin as Domain<X>)[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0 && oldState !== null) {
      newState = oldState.withDomain(xMin as X, xMax as X);
      if (yMin !== void 0 && yMax !== void 0) {
        newState = newState.overRange(yMin as Y, yMax);
      }
      if ((timing === void 0 || timing === null || timing === false) && (this.flags & Animator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        this.setValue(newValue, Affinity.Extrinsic);
        timing = true;
      }
    } else {
      newState = ScaledView.createScale(xMin as X, xMax as X, yMin as Y, yMax as Y);
    }
    this.setState(newState, timing, Affinity.Extrinsic);
  };

  ContinuousScaleAnimator.prototype.setDomain = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean | null, timing?: AnyTiming | boolean | null): void {
    if (typeof xMin === "string") {
      xMin = ScaledView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      timing = xMax as AnyTiming | boolean | null;
      xMax = (xMin as Domain<X>)[1];
      xMin = (xMin as Domain<X>)[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0 && oldState !== null) {
      newState = oldState.withDomain(xMin as X, xMax as X);
      if ((timing === void 0 || timing === null || timing === false) && (this.flags & Animator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        this.setValue(newValue, Affinity.Extrinsic);
        timing = true;
      }
    } else {
      newState = ScaledView.createScale(xMin as X, xMax as X, 0 as unknown as Y, 1 as unknown as Y);
    }
    this.setState(newState, timing, Affinity.Extrinsic);
  };

  ContinuousScaleAnimator.prototype.setRange = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, yMin?: Range<Y> | Y, yMax?: Y | AnyTiming | boolean | null, timing?: AnyTiming | boolean | null): void {
    const oldState = this.state;
    if (oldState !== void 0 && oldState !== null) {
      if (yMin instanceof Range) {
        timing = yMax as AnyTiming | boolean | null;
        yMax = (yMin as Range<Y>)[1];
        yMin = (yMin as Range<Y>)[0];
      }
      const newState = oldState.overRange(yMin as Y, yMax as Y);
      if ((timing === void 0 || timing === null || timing === false) && (this.flags & Animator.TweeningFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.overRange(yMin as Y, yMax as Y);
        this.setValue(newValue, Affinity.Extrinsic);
        timing = true;
      }
      this.setState(newState, timing, Affinity.Extrinsic);
    }
  };

  ContinuousScaleAnimator.prototype.setBaseScale = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
                                                                   yMin?: Y | AnyTiming | boolean | null, yMax?: Y, timing?: AnyTiming | boolean | null): void {
    if (this.derived && this.inlet instanceof ContinuousScaleAnimator) {
      this.inlet.setBaseScale(xMin as any, xMax as any, yMin as any, yMax as any, timing);
    } else {
      this.setScale(xMin as any, xMax as any, yMin as any, yMax as any, timing);
    }
  };

  ContinuousScaleAnimator.prototype.setBaseDomain = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean | null, timing?: AnyTiming | boolean | null): void {
    if (this.derived && this.inlet instanceof ContinuousScaleAnimator) {
      this.inlet.setBaseDomain(xMin as any, xMax as any, timing);
    } else {
      this.setDomain(xMin as any, xMax as any, timing);
    }
  };

  ContinuousScaleAnimator.prototype.setBaseRange = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, yMin?: Range<Y> | Y, yMax?: Y | AnyTiming | boolean | null, timing?: AnyTiming | boolean | null): void {
    if (this.derived && this.inlet instanceof ContinuousScaleAnimator) {
      this.inlet.setBaseRange(yMin as any, yMax as any, timing);
    } else {
      this.setRange(yMin as any, yMax as any, timing);
    }
  };

  ContinuousScaleAnimator.prototype.createDomain = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, xMin: X, xMax: X): Domain<X> {
    if (xMin instanceof DateTime || xMax instanceof DateTime) {
      return TimeDomain(DateTime.fromAny(xMin as AnyDateTime), DateTime.fromAny(xMax as AnyDateTime)) as unknown as Domain<X>;
    } else {
      return Domain(xMin, xMax);
    }
  };

  ContinuousScaleAnimator.prototype.fromAny = function <X, Y>(this: ContinuousScaleAnimator<View, X, Y>, value: ContinuousScale<X, Y> | string | null): ContinuousScale<X, Y> | null {
    if (typeof value === "string") {
      value = ScaledView.parseScale(value);
    }
    return value;
  };

  return ContinuousScaleAnimator;
})(Animator);
