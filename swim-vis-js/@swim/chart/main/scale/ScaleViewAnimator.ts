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

import {Domain, Range, AnyTiming, ContinuousScale} from "@swim/mapping";
import {Animator} from "@swim/animation";
import {View, ViewAnimator} from "@swim/view";
import {ScaleView} from "../"; // forward import

export abstract class ScaleViewAnimator<V extends View, X, Y> extends ViewAnimator<V, ContinuousScale<X, Y> | undefined, ContinuousScale<X, Y> | string | undefined> {
  setScale(domain: Domain<X> | string, range: Range<Y>, timing?: AnyTiming | boolean): void;
  setScale(xMin: X, xMax: X, yMin: Y, yMax: Y, timing?: AnyTiming | boolean): void;
  setScale(xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
           yMin?: Y | AnyTiming | boolean, yMax?: Y, timing?: AnyTiming | boolean): void {
    if (typeof xMin === "string") {
      xMin = ScaleView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      timing = yMin as AnyTiming | boolean;
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
      if ((timing === void 0 || timing === false) && (this.animatorFlags & Animator.AnimatingFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        this.setValue(newValue);
        timing = true;
      }
    } else {
      newState = ScaleView.createScale(xMin as X, xMax as X, yMin as Y, yMax as Y);
    }
    this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag | Animator.OverrideFlag);
    super.setState(newState, timing);
  }

  setDomain(domain: Domain<X> | string, timing?: AnyTiming | boolean): void;
  setDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean): void;
  setDomain(xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean,
            timing?: AnyTiming | boolean): void {
    if (typeof xMin === "string") {
      xMin = ScaleView.parseScale<X, Y>(xMin).domain;
    }
    if (xMin instanceof Domain) {
      timing = xMax as AnyTiming | boolean;
      xMax = (xMin as Domain<X>)[1];
      xMin = (xMin as Domain<X>)[0];
    }
    const oldState = this.state;
    let newState: ContinuousScale<X, Y>;
    if (oldState !== void 0) {
      newState = oldState.withDomain(xMin as X, xMax as X);
      if ((timing === void 0 || timing === false) && (this.animatorFlags & Animator.AnimatingFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.withDomain(xMin as X, xMax as X);
        this.setValue(newValue);
        timing = true;
      }
    } else {
      newState = ScaleView.createScale(xMin as X, xMax as X, 0 as unknown as Y, 1 as unknown as Y);
    }
    this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag | Animator.OverrideFlag);
    super.setState(newState, timing);
  }

  setRange(range: Range<Y>, timing?: AnyTiming | boolean): void;
  setRange(yMin: Y, yMax: Y, timing?: AnyTiming | boolean): void;
  setRange(yMin?: Range<Y> | Y, yMax?: Y | AnyTiming | boolean, timing?: AnyTiming | boolean): void {
    const oldState = this.state;
    if (oldState !== void 0) {
      if (yMin instanceof Range) {
        timing = yMax as AnyTiming | boolean;
        yMax = (yMin as Range<Y>)[1];
        yMin = (yMin as Range<Y>)[0];
      }
      const newState = oldState.overRange(yMin as Y, yMax as Y);
      if ((timing === void 0 || timing === false) && (this.animatorFlags & Animator.AnimatingFlag) !== 0) {
        const oldValue = this.getValue();
        const newValue = oldValue.overRange(yMin as Y, yMax as Y);
        this.setValue(newValue);
        timing = true;
      }
      this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag | Animator.OverrideFlag);
      super.setState(newState, timing);
    }
  }

  setBaseScale(domain: Domain<X> | string, range: Range<Y>, timing?: AnyTiming | boolean): void;
  setBaseScale(xMin: X, xMax: X, yMin: Y, yMax: Y, timing?: AnyTiming | boolean): void;
  setBaseScale(xMin?: Domain<X> | X | string, xMax?: Range<Y> | X,
               yMin?: Y | AnyTiming | boolean, yMax?: Y, timing?: AnyTiming | boolean): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseScale(xMin as any, xMax as any, yMin as any, yMax as any, timing);
    } else {
      this.setScale(xMin as any, xMax as any, yMin as any, yMax as any, timing);
    }
  }

  setBaseDomain(domain: Domain<X> | string, timing?: AnyTiming | boolean): void;
  setBaseDomain(xMin: X, xMax: X, timing?: AnyTiming | boolean): void;
  setBaseDomain(xMin?: Domain<X> | X | string, xMax?: X | AnyTiming | boolean,
                timing?: AnyTiming | boolean): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseDomain(xMin as any, xMax as any, timing);
    } else {
      this.setDomain(xMin as any, xMax as any, timing);
    }
  }

  setBaseRange(range: Range<Y>, timing?: AnyTiming | boolean): void;
  setBaseRange(yMin: Y, yMax: Y, timing?: AnyTiming | boolean): void;
  setBaseRange(yMin?: Range<Y> | Y, yMax?: Y | AnyTiming | boolean, timing?: AnyTiming | boolean): void {
    let superAnimator: ViewAnimator<View, ContinuousScale<X, Y> | undefined> | null | undefined;
    if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator instanceof ScaleViewAnimator)) {
      superAnimator.setBaseRange(yMin as any, yMax as any, timing);
    } else {
      this.setRange(yMin as any, yMax as any, timing);
    }
  }

  fromAny(value: ContinuousScale<X, Y> | string | undefined): ContinuousScale<X, Y> | undefined {
    if (typeof value === "string") {
      value = ScaleView.parseScale(value);
    }
    return value;
  }
}
