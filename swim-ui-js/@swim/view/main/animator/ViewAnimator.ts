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

import {__extends} from "tslib";
import {FromAny} from "@swim/util";
import {AnyTiming, Timing} from "@swim/mapping";
import {AnyLength, Length, AnyAngle, Angle, AnyTransform, Transform} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import type {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewFlags, View} from "../View";
import {Animator} from "./Animator";
import {StringViewAnimator} from "../"; // forward import
import {BooleanViewAnimator} from "../"; // forward import
import {NumberViewAnimator} from "../"; // forward import
import {AngleViewAnimator} from "../"; // forward import
import {LengthViewAnimator} from "../"; // forward import
import {ColorViewAnimator} from "../"; // forward import
import {FontViewAnimator} from "../"; // forward import
import {TransformViewAnimator} from "../"; // forward import

export type ViewAnimatorMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewAnimator<any, infer T, any>} ? T : unknown;

export type ViewAnimatorMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface ViewAnimatorInit<T, U = never> {
  extends?: ViewAnimatorClass;
  type?: unknown;
  inherit?: string | boolean;

  state?: T | U;
  look?: Look<T>;
  updateFlags?: ViewFlags;
  isDefined?(value: T): boolean;
  willSetState?(newValue: T, oldValue: T): void;
  onSetState?(newValue: T, oldValue: T): void;
  didSetState?(newValue: T, oldValue: T): void;
  willSetValue?(newValue: T, oldValue: T): void;
  onSetValue?(newValue: T, oldValue: T): void;
  didSetValue?(newValue: T, oldValue: T): void;
  onBegin?(value: T): void;
  onEnd?(value: T): void;
  onInterrupt?(value: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type ViewAnimatorDescriptor<V extends View, T, U = never, I = {}> = ViewAnimatorInit<T, U> & ThisType<ViewAnimator<V, T, U> & I> & Partial<I>;

export type ViewAnimatorDescriptorExtends<V extends View, T, U = never, I = {}> = {extends: ViewAnimatorClass | undefined} & ViewAnimatorDescriptor<V, T, U, I>;

export type ViewAnimatorDescriptorFromAny<V extends View, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ViewAnimatorDescriptor<V, T, U, I>;

export interface ViewAnimatorConstructor<V extends View, T, U = never, I = {}> {
  new(owner: V, animatorName: string | undefined): ViewAnimator<V, T, U> & I;
  prototype: ViewAnimator<any, any> & I;
}

export interface ViewAnimatorClass extends Function {
  readonly prototype: ViewAnimator<any, any>;
}

export interface ViewAnimator<V extends View, T, U = never> extends Animator<T> {
  (): T;
  (state: T | U, timing?: AnyTiming | boolean): V;

  readonly name: string;

  readonly owner: V;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superAnimator: ViewAnimator<View, T> | null;

  /** @hidden */
  bindSuperAnimator(): void;

  /** @hidden */
  unbindSuperAnimator(): void;

  /** @hidden */
  subAnimators: ViewAnimator<View, T>[] | null;

  /** @hidden */
  addSubAnimator(subAnimator: ViewAnimator<View, T>): void;

  /** @hidden */
  removeSubAnimator(subAnimator: ViewAnimator<View, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  readonly superValue: T | undefined;

  readonly superState: T | undefined;

  getValue(): NonNullable<T>;

  getState(): NonNullable<T>;

  setState(state: T | U, timing?: AnyTiming | boolean): void;

  setAutoState(state: T | U, timing?: AnyTiming | boolean): void;

  setOwnState(state: T | U, timing?: AnyTiming | boolean): void;

  setBaseState(state: T | U, timing?: AnyTiming | boolean): void;

  /** @hidden */
  setImmediateState(newState: T, oldState: T): void;

  onAnimate(t: number): void;

  onAnimateInherited(): void;

  onSetValue(newValue: T, oldValue: T): void;

  readonly look: Look<T> | null;

  setLook(newLook: Look<T> | null, timing?: AnyTiming | boolean): void;

  willSetLook(newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void;

  onSetLook(newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void;

  didSetLook(newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void;

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void;

  willStartAnimating(): void;

  didStartAnimating(): void;

  willStopAnimating(): void;

  didStopAnimating(): void;

  updateFlags?: ViewFlags;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;

  isMounted(): boolean;

  /** @hidden */
  mount(): void;

  /** @hidden */
  willMount(): void;

  /** @hidden */
  onMount(): void;

  /** @hidden */
  didMount(): void;

  /** @hidden */
  unmount(): void;

  /** @hidden */
  willUnmount(): void;

  /** @hidden */
  onUnmount(): void;

  /** @hidden */
  didUnmount(): void;

  toString(): string;
}

export const ViewAnimator = function <V extends View, T, U>(
    this: ViewAnimator<V, T, U> | typeof ViewAnimator,
    owner: V | ViewAnimatorDescriptor<V, T, U>,
    animatorName?: string,
  ): ViewAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof ViewAnimator) { // constructor
    return ViewAnimatorConstructor.call(this as ViewAnimator<V, unknown, unknown>, owner as V, animatorName);
  } else { // decorator factory
    return ViewAnimatorDecoratorFactory(owner as ViewAnimatorDescriptor<V, T, U>);
  }
} as {
  /** @hidden */
  new<V extends View, T, U = never>(owner: V, animatorName: string | undefined): ViewAnimator<V, T, U>;

  <V extends View, T extends Angle | null | undefined = Angle | null | undefined, U extends AnyAngle | null | undefined = AnyAngle | null | undefined>(descriptor: {type: typeof Angle} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Length | null | undefined = Length | null | undefined, U extends AnyLength | null | undefined = AnyLength | null | undefined>(descriptor: {type: typeof Length} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Color | null | undefined = Color | null | undefined, U extends AnyColor | null | undefined = AnyColor | null | undefined>(descriptor: {type: typeof Color} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Font | null | undefined = Font | null | undefined, U extends AnyFont | null | undefined = AnyFont | null | undefined>(descriptor: {type: typeof Font} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Transform | null | undefined = Transform | null | undefined, U extends AnyTransform | null | undefined = AnyTransform | null | undefined>(descriptor: {type: typeof Transform} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends string | null | undefined = string | null | undefined, U extends string | null | undefined = string | null | undefined>(descriptor: {type: typeof String} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends boolean | null | undefined = boolean | null | undefined, U extends boolean | string | null | undefined = boolean | string | null | undefined>(descriptor: {type: typeof Boolean} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends number | null | undefined = number | null | undefined, U extends number | string | null | undefined = number | string | null | undefined>(descriptor: {type: typeof Number} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewAnimatorDescriptorFromAny<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never, I = {}>(descriptor: ViewAnimatorDescriptorExtends<V, T, U, I>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;

  /** @hiddem */
  prototype: ViewAnimator<any, any>;

  /** @hidden */
  getClass(type: unknown): ViewAnimatorClass | null;

  define<V extends View, T, U = never, I = {}>(descriptor: ViewAnimatorDescriptorExtends<V, T, U, I>): ViewAnimatorConstructor<V, T, U, I>;
  define<V extends View, T, U = never>(descriptor: ViewAnimatorDescriptor<V, T, U>): ViewAnimatorConstructor<V, T, U>;
};
__extends(ViewAnimator, Animator);

function ViewAnimatorConstructor<V extends View, T, U>(this: ViewAnimator<V, T, U>, owner: V, animatorName: string | undefined): ViewAnimator<V, T, U> {
  const _this: ViewAnimator<V, T, U> = (Animator as Function).call(this, void 0, null) || this;
  if (animatorName !== void 0) {
    Object.defineProperty(_this, "name", {
      value: animatorName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(_this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(_this, "look", {
    value: _this.look ?? null, // seed from prototype
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "inherit", {
    value: _this.inherit ?? false, // seed from prototype
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "superAnimator", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "subAnimators", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  if (_this.initState !== void 0) {
    Object.defineProperty(_this, "ownState", {
      value: _this.fromAny(_this.initState()),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(_this, "ownValue", {
      value: _this.ownState,
      enumerable: true,
      configurable: true,
    });
  }
  if (_this.inherit !== false) {
    _this.setAnimatorFlags(_this.animatorFlags | Animator.InheritedFlag);
  }
  return _this;
}

function ViewAnimatorDecoratorFactory<V extends View, T, U>(descriptor: ViewAnimatorDescriptor<V, T, U>): PropertyDecorator {
  return View.decorateViewAnimator.bind(ViewAnimator, ViewAnimator.define(descriptor as ViewAnimatorDescriptor<View, unknown>));
}

ViewAnimator.prototype.setInherit = function (this: ViewAnimator<View, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperAnimator();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperAnimator();
      if ((this.animatorFlags & Animator.OverrideFlag) === 0) {
        this.setAnimatorFlags(this.animatorFlags | Animator.InheritedFlag);
        this.startAnimating();
      }
    } else if (this.inherit !== false) {
      this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag);
    }
  }
};

ViewAnimator.prototype.isInherited = function (this: ViewAnimator<View, unknown>): boolean {
  return (this.animatorFlags & Animator.InheritedFlag) !== 0;
};

ViewAnimator.prototype.setInherited = function (this: ViewAnimator<View, unknown>, inherited: boolean): void {
  if (inherited && (this.animatorFlags & Animator.InheritedFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | Animator.InheritedFlag);
    this.startAnimating();
  } else if (!inherited && (this.animatorFlags & Animator.InheritedFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag);
    this.startAnimating();
  }
};

Object.defineProperty(ViewAnimator.prototype, "superName", {
  get: function (this: ViewAnimator<View, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewAnimator.prototype.bindSuperAnimator = function (this: ViewAnimator<View, unknown>): void {
  if (this.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      let view = this.owner;
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const superAnimator = view.getLazyViewAnimator(superName);
          if (superAnimator !== null) {
            Object.defineProperty(this, "superAnimator", {
              value: superAnimator,
              enumerable: true,
              configurable: true,
            });
            superAnimator.addSubAnimator(this);
            if (this.isInherited()) {
              Object.defineProperty(this, "ownState", {
                value: superAnimator.state,
                enumerable: true,
                configurable: true,
              });
              Object.defineProperty(this, "ownValue", {
                value: superAnimator.value,
                enumerable: true,
                configurable: true,
              });
              this.setAnimatorFlags(this.animatorFlags | Animator.UpdatedFlag);
              if (superAnimator.isAnimating()) {
                this.startAnimating();
              }
            }
          } else {
            continue;
          }
        }
        break;
      } while (true);
    }
  }
};

ViewAnimator.prototype.unbindSuperAnimator = function (this: ViewAnimator<View, unknown>): void {
  const superAnimator = this.superAnimator;
  if (superAnimator !== null) {
    superAnimator.removeSubAnimator(this);
    Object.defineProperty(this, "superAnimator", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }
};

ViewAnimator.prototype.addSubAnimator = function <T>(this: ViewAnimator<View, T>, subAnimator: ViewAnimator<View, T>): void {
  let subAnimators = this.subAnimators;
  if (subAnimators === null) {
    subAnimators = [];
    Object.defineProperty(this, "subAnimators", {
      value: subAnimators,
      enumerable: true,
      configurable: true,
    });
  }
  subAnimators.push(subAnimator);
};

ViewAnimator.prototype.removeSubAnimator = function <T>(this: ViewAnimator<View, T>,  subAnimator: ViewAnimator<View, T>): void {
  const subAnimators = this.subAnimators;
  if (subAnimators !== null) {
    const index = subAnimators.indexOf(subAnimator);
    if (index >= 0) {
      subAnimators.splice(index, 1);
    }
  }
};

ViewAnimator.prototype.isAuto = function (this: ViewAnimator<View, unknown>): boolean {
  return (this.animatorFlags & Animator.OverrideFlag) === 0;
};

ViewAnimator.prototype.setAuto = function (this: ViewAnimator<View, unknown>, auto: boolean): void {
  if (auto && (this.animatorFlags & Animator.OverrideFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~Animator.OverrideFlag);
  } else if (!auto && (this.animatorFlags & Animator.OverrideFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | Animator.OverrideFlag);
  }
};

Object.defineProperty(ViewAnimator.prototype, "superValue", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    const superAnimator = this.superAnimator;
    return superAnimator !== null ? superAnimator.value : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "superState", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    const superAnimator = this.superAnimator;
    return superAnimator !== null ? superAnimator.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewAnimator.prototype.getValue = function <T, U>(this: ViewAnimator<View, T, U>): NonNullable<T> {
  const value = this.value;
  if (value === void 0 || value === null) {
    throw new TypeError(value + " " + this.name + " value");
  }
  return value as NonNullable<T>;
};

ViewAnimator.prototype.getState = function <T, U>(this: ViewAnimator<View, T, U>): NonNullable<T> {
  const state = this.state;
  if (state === void 0 || state === null) {
    throw new TypeError(state + " " + this.name + " state");
  }
  return state as NonNullable<T>;
};

ViewAnimator.prototype.setState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  this.setAnimatorFlags(this.animatorFlags | Animator.OverrideFlag);
  this.setLook(null);
  this.setOwnState(state, timing);
};

ViewAnimator.prototype.setAutoState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  if ((this.animatorFlags & Animator.OverrideFlag) === 0) {
    this.setOwnState(state, timing);
  }
};

ViewAnimator.prototype.setOwnState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  state = this.fromAny(state);
  this.setAnimatorFlags(this.animatorFlags & ~Animator.InheritedFlag);
  Animator.prototype.setState.call(this, state, timing);
};

ViewAnimator.prototype.setBaseState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  let superAnimator: ViewAnimator<View, T> | null;
  if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator !== null)) {
    state = this.fromAny(state);
    superAnimator.setBaseState(state as T, timing);
  } else {
    this.setState(state, timing);
  }
};

ViewAnimator.prototype.setImmediateState = function <T>(this: ViewAnimator<View, T>, newState: T, oldState: T): void {
  Animator.prototype.setImmediateState.call(this, newState, oldState);
  const subAnimators = this.subAnimators;
  if (subAnimators !== null) {
    for (let i = 0, n = subAnimators.length; i < n; i += 1) {
      const subAnimator = subAnimators[i]!;
      if (subAnimator.isInherited()) {
        subAnimator.startAnimating();
      }
    }
  }
};

ViewAnimator.prototype.onAnimate = function (this: ViewAnimator<View, unknown>, t: number): void {
  if ((this.animatorFlags & Animator.InheritedFlag) === 0) {
    Animator.prototype.onAnimate.call(this, t);
  } else {
    this.onAnimateInherited();
  }
};

ViewAnimator.prototype.onAnimateInherited = function (this: ViewAnimator<View, unknown>): void {
  const superAnimator = this.superAnimator;
  if (superAnimator !== null) {
    Object.defineProperty(this, "ownState", {
      value: superAnimator.state,
      enumerable: true,
      configurable: true,
    });
    this.setValue(superAnimator.value, this.value);
    if (!superAnimator.isAnimating()) {
      this.stopAnimating();
    }
  } else {
    this.stopAnimating();
  }
};

ViewAnimator.prototype.onSetValue = function <T>(this: ViewAnimator<View, T>, newValue: T, oldValue: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ViewAnimator.prototype.setLook = function <T>(this: ViewAnimator<View, T>, newLook: Look<T> | null, timing?: AnyTiming | boolean): void {
  const oldLook = this.look;
  if (newLook !== oldLook) {
    if (timing === void 0) {
      timing = false;
    } else {
      timing = Timing.fromAny(timing);
    }
    this.willSetLook(newLook, oldLook, timing);
    Object.defineProperty(this, "look", {
      value: newLook,
      enumerable: true,
      configurable: true,
    });
    this.onSetLook(newLook, oldLook, timing);
    this.didSetLook(newLook, oldLook, timing);
  }
};

ViewAnimator.prototype.willSetLook = function <T>(this: ViewAnimator<View, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
  // hook
};

ViewAnimator.prototype.onSetLook = function <T>(this: ViewAnimator<View, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
  if (newLook !== null) {
    if (this.owner.isMounted()) {
      const state = this.owner.getLook(newLook);
      if (state !== void 0) {
        this.setAutoState(state, timing);
      }
    } else {
      this.owner.requireUpdate(View.NeedsChange);
    }
  }
};

ViewAnimator.prototype.didSetLook = function <T>(this: ViewAnimator<View, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
  // hook
};

ViewAnimator.prototype.applyTheme = function <T>(this: ViewAnimator<View, T>, theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
  const look = this.look;
  if (look !== null && this.isAuto()) {
    const state = theme.get(look, mood);
    if (state !== void 0) {
      this.setAutoState(state, timing);
    }
  }
};

ViewAnimator.prototype.willStartAnimating = function (this: ViewAnimator<View, unknown>): void {
  this.owner.trackWillStartAnimating(this);
  const subAnimators = this.subAnimators;
  if (subAnimators !== null) {
    for (let i = 0, n = subAnimators.length; i < n; i += 1) {
      const subAnimator = subAnimators[i]!;
      if (subAnimator.isInherited()) {
        subAnimator.startAnimating();
      }
    }
  }
};

ViewAnimator.prototype.didStartAnimating = function (this: ViewAnimator<View, unknown>): void {
  this.owner.trackDidStartAnimating(this);
};

ViewAnimator.prototype.willStopAnimating = function (this: ViewAnimator<View, unknown>): void {
  this.owner.trackWillStopAnimating(this);
};

ViewAnimator.prototype.didStopAnimating = function (this: ViewAnimator<View, unknown>): void {
  this.owner.trackDidStopAnimating(this);
};

ViewAnimator.prototype.fromAny = function <T, U>(this: ViewAnimator<View, T, U>, value: T | U): T {
  return value as T;
};

ViewAnimator.prototype.isMounted = function (this: ViewAnimator<View, unknown>): boolean {
  return (this.animatorFlags & Animator.MountedFlag) !== 0;
};

ViewAnimator.prototype.mount = function (this: ViewAnimator<View, unknown>): void {
  if ((this.animatorFlags & Animator.MountedFlag) === 0) {
    this.willMount();
    this.setAnimatorFlags(this.animatorFlags | Animator.MountedFlag);
    this.onMount();
    this.didMount();
  }
};

ViewAnimator.prototype.willMount = function (this: ViewAnimator<View, unknown>): void {
  // hook
};

ViewAnimator.prototype.onMount = function (this: ViewAnimator<View, unknown>): void {
  this.bindSuperAnimator();
  const look = this.look;
  if (look !== null) {
    this.owner.requireUpdate(View.NeedsChange);
  }
};

ViewAnimator.prototype.didMount = function (this: ViewAnimator<View, unknown>): void {
  // hook
};

ViewAnimator.prototype.unmount = function (this: ViewAnimator<View, unknown>): void {
  if ((this.animatorFlags & Animator.MountedFlag) !== 0) {
    this.willUnmount();
    this.setAnimatorFlags(this.animatorFlags & ~Animator.MountedFlag);
    this.onUnmount();
    this.didUnmount();
  }
};

ViewAnimator.prototype.willUnmount = function (this: ViewAnimator<View, unknown>): void {
  // hook
};

ViewAnimator.prototype.onUnmount = function (this: ViewAnimator<View, unknown>): void {
  this.stopAnimating();
  this.unbindSuperAnimator();
};

ViewAnimator.prototype.didUnmount = function (this: ViewAnimator<View, unknown>): void {
  // hook
};

ViewAnimator.prototype.toString = function (this: ViewAnimator<View, unknown>): string {
  return this.name;
};

ViewAnimator.getClass = function (type: unknown): ViewAnimatorClass | null {
  if (type === String) {
    return StringViewAnimator;
  } else if (type === Boolean) {
    return BooleanViewAnimator;
  } else if (type === Number) {
    return NumberViewAnimator;
  } else if (type === Angle) {
    return AngleViewAnimator;
  } else if (type === Length) {
    return LengthViewAnimator;
  } else if (type === Color) {
    return ColorViewAnimator;
  } else if (type === Font) {
    return FontViewAnimator;
  } else if (type === Transform) {
    return TransformViewAnimator;
  }
  return null;
};

ViewAnimator.define = function <V extends View, T, U, I>(descriptor: ViewAnimatorDescriptor<V, T, U, I>): ViewAnimatorConstructor<V, T, U, I> {
  let _super: ViewAnimatorClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const look = descriptor.look;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;

  if (_super === void 0) {
    _super = ViewAnimator.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ViewAnimator;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedViewAnimator(this: ViewAnimator<V, T, U>, owner: V, animatorName: string | undefined): ViewAnimator<V, T, U> {
    let _this: ViewAnimator<V, T, U> = function ViewAnimatorAccessor(state?: T | U, timing?: AnyTiming | boolean): T | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(state!, timing);
        return _this.owner;
      }
    } as ViewAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, animatorName) || _this;
    return _this;
  } as unknown as ViewAnimatorConstructor<V, T, U, I>

  const _prototype = descriptor as unknown as ViewAnimator<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (state !== void 0 && initState === void 0) {
    _prototype.initState = function (): T | U {
      return state;
    };
  }
  Object.defineProperty(_prototype, "look", {
    value: look ?? null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_prototype, "inherit", {
    value: inherit ?? false,
    enumerable: true,
    configurable: true,
  });

  return _constructor;
};
