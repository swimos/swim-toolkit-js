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
import type {AnyFocus} from "./Focus";
import {Focus} from "./Focus";

/** @public */
export interface FocusAnimator<O = unknown, T extends Focus | null | undefined = Focus | null | undefined, U extends AnyFocus | null | undefined = AnyFocus | T> extends Animator<O, T, U> {
  get phase(): number | undefined;

  getPhase(): number;

  getPhaseOr<E>(elsePhase: E): number | E;

  setPhase(newPhase: number, timingOrAffinity: Affinity | AnyTiming | boolean | undefined): void;
  setPhase(newPhase: number, timing?: AnyTiming | boolean, affinity?: Affinity): void;

  get direction(): number;

  setDirection(newDirection: number, timingOrAffinity: Affinity | AnyTiming | boolean | undefined): void;
  setDirection(newDirection: number, timing?: AnyTiming | boolean, affinity?: Affinity): void;

  get unfocused(): boolean;

  get focused(): boolean;

  get focusing(): boolean;

  get unfocusing(): boolean;

  focus(timingOrAffinity: Affinity | AnyTiming | boolean | undefined): void;
  focus(timing?: AnyTiming | boolean, affinity?: Affinity): void;

  unfocus(timingOrAffinity: Affinity | AnyTiming | boolean | undefined): void;
  unfocus(timing?: AnyTiming | boolean, affinity?: Affinity): void;

  toggle(timingOrAffinity: Affinity | AnyTiming | boolean | undefined): void;
  toggle(timing?: AnyTiming | boolean, affinity?: Affinity): void;

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
    if (oldValue !== void 0 && oldValue !== null) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      this.setState(oldValue.withPhase(newPhase), timing, affinity);
    }
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
    if (oldValue !== void 0 && oldValue !== null) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      this.setState(oldValue.withDirection(newDirection), timing, affinity);
    }
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
    if (oldValue === void 0 || oldValue === null || !oldValue.focused) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      if (timing === void 0 || timing === true) {
        timing = this.transition;
      }
      if (oldValue !== void 0 && oldValue !== null) {
        this.setValue(oldValue.asFocusing(), Affinity.Reflexive);
      }
      this.setState(Focus.focused(), timing, affinity);
    }
  };

  FocusAnimator.prototype.unfocus = function (this: FocusAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue === void 0 || oldValue === null || !oldValue.unfocused) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      if (timing === void 0 || timing === true) {
        timing = this.transition;
      }
      if (oldValue !== void 0 && oldValue !== null) {
        this.setValue(oldValue.asUnfocusing(), Affinity.Reflexive);
      }
      this.setState(Focus.unfocused(), timing, affinity);
    }
  };

  FocusAnimator.prototype.toggle = function (this: FocusAnimator, timing?: Affinity | AnyTiming | boolean | null, affinity?: Affinity): void {
    const oldValue = this.value;
    if (oldValue !== void 0 && oldValue !== null) {
      if (typeof timing === "number") {
        affinity = timing;
        timing = void 0;
      }
      if (timing === void 0 || timing === true) {
        timing = this.transition;
      }
      this.setValue(oldValue.asToggling(), Affinity.Reflexive);
      this.setState(oldValue.asToggled(), timing, affinity);
    }
  };

  FocusAnimator.prototype.onSetValue = function (this: FocusAnimator, newValue: Focus | null | undefined, oldValue: Focus | null | undefined): void {
    _super.prototype.onSetValue.call(this, newValue, oldValue);
    if (newValue !== void 0 && newValue !== null && oldValue !== void 0 && oldValue !== null) {
      if (newValue.focusing && !oldValue.focusing) {
        this.willFocus();
      } else if (newValue.focused && !oldValue.focused) {
        this.didFocus();
      } else if (newValue.unfocusing && !oldValue.unfocusing) {
        this.willUnfocus();
      } else if (newValue.unfocused && !oldValue.unfocused) {
        this.didUnfocus();
      }
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
