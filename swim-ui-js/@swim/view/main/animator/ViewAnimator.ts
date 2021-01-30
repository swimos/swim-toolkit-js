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
import {Values, FromAny} from "@swim/util";
import {AnyLength, Length, AnyAngle, Angle, AnyTransform, Transform} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {Tween, Animator, TweenAnimator} from "@swim/animation";
import {AnyFont, Font} from "@swim/style";
import {ViewFlags, View} from "../View";
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
  state?: T | U;
  inherit?: string | boolean;

  updateFlags?: ViewFlags;
  willUpdate?(newValue: T, oldValue: T): void;
  onUpdate?(newValue: T, oldValue: T): void;
  didUpdate?(newValue: T, oldValue: T): void;
  onBegin?(value: T): void;
  onEnd?(value: T): void;
  onInterrupt?(value: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type ViewAnimatorDescriptor<V extends View, T, U = never, I = {}> = ViewAnimatorInit<T, U> & ThisType<ViewAnimator<V, T, U> & I> & I;

export type ViewAnimatorDescriptorExtends<V extends View, T, U = never, I = {}> = {extends: ViewAnimatorClass | undefined} & ViewAnimatorDescriptor<V, T, U, I>;

export type ViewAnimatorDescriptorFromAny<V extends View, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ViewAnimatorDescriptor<V, T, U, I>;

export interface ViewAnimatorConstructor<V extends View, T, U = never, I = {}> {
  new(owner: V, animatorName: string | undefined): ViewAnimator<V, T, U> & I;
  prototype: ViewAnimator<any, any> & I;
}

export interface ViewAnimatorClass extends Function {
  readonly prototype: ViewAnimator<any, any>;
}

export interface ViewAnimator<V extends View, T, U = never> extends TweenAnimator<T> {
  (): T;
  (state: T | U, tween?: Tween<T>): V;

  readonly name: string;

  readonly owner: V;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  updateFlags?: ViewFlags;

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

  isTweening(): boolean;

  readonly ownValue: T | undefined;

  readonly ownState: T | undefined;

  readonly superValue: T | undefined;

  readonly superState: T | undefined;

  getValue(): T extends undefined ? never : T;

  getState(): T extends undefined ? never : T;

  getValueOr<E>(elseValue: E): (T extends undefined ? never : T) | E;

  getStateOr<E>(elseState: E): (T extends undefined ? never : T) | E;

  setState(state: T | U, tween?: Tween<T>): void;

  setAutoState(state: T | U, tween?: Tween<T>): void;

  setOwnState(state: T | U, tween?: Tween<T>): void;

  setBaseState(state: T | U, tween?: Tween<T>): void;

  onAnimate(t: number): void;

  onAnimateInherited(): void;

  update(newValue: T, oldValue: T): void;

  onUpdate(newValue: T, oldValue: T): void;

  /** @hidden */
  updateSubAnimators(newValue: T, oldValue: T): void;

  animate(animator?: Animator): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;
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

  <V extends View, T extends Angle | undefined = Angle | undefined, U extends AnyAngle | undefined = AnyAngle | undefined>(descriptor: {type: typeof Angle} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Length | undefined = Length | undefined, U extends AnyLength | undefined = AnyLength | undefined>(descriptor: {type: typeof Length} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Color | undefined = Color | undefined, U extends AnyColor | undefined = AnyColor | undefined>(descriptor: {type: typeof Color} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Font | undefined = Font | undefined, U extends AnyFont | undefined = AnyFont | undefined>(descriptor: {type: typeof Font} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends Transform | undefined = Transform | undefined, U extends AnyTransform | undefined = AnyTransform | undefined>(descriptor: {type: typeof Transform} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ViewAnimatorDescriptor<V, T, U>): PropertyDecorator;
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
__extends(ViewAnimator, TweenAnimator);

function ViewAnimatorConstructor<V extends View, T, U>(this: ViewAnimator<V, T, U>, owner: V, animatorName: string | undefined): ViewAnimator<V, T, U> {
  const _this: ViewAnimator<V, T, U> = (TweenAnimator as Function).call(this, void 0, null) || this;
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
    const initState = _this.initState();
    if (initState !== void 0) {
      _this._state = _this.fromAny(initState);
      _this._value = _this._state;
    }
  } else if (_this.inherit !== false) {
    Object.defineProperty(_this, "animatorFlags", {
      value: _this.animatorFlags | TweenAnimator.InheritedFlag,
      enumerable: true,
      configurable: true,
    });
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
      if ((this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
        this.setAnimatorFlags(this.animatorFlags | (TweenAnimator.UpdatedFlag | TweenAnimator.InheritedFlag));
        this.animate();
      }
    } else if (this.inherit !== false) {
      this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag);
    }
  }
};

ViewAnimator.prototype.isInherited = function (this: ViewAnimator<View, unknown>): boolean {
  return (this.animatorFlags & TweenAnimator.InheritedFlag) !== 0;
};

ViewAnimator.prototype.setInherited = function (this: ViewAnimator<View, unknown>, inherited: boolean): void {
  if (inherited && (this.animatorFlags & TweenAnimator.InheritedFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | TweenAnimator.InheritedFlag);
    this.animate();
  } else if (!inherited && (this.animatorFlags & TweenAnimator.InheritedFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag);
    this.animate();
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
  let view = this.owner;
  if (view.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const animator = view.getLazyViewAnimator(superName);
          if (animator !== null) {
            Object.defineProperty(this, "superAnimator", {
              value: animator,
              enumerable: true,
              configurable: true,
            });
            animator.addSubAnimator(this);
            if (this.isInherited()) {
              this._state = animator._state;
              this._value = animator._value;
              this.setAnimatorFlags(this.animatorFlags | TweenAnimator.UpdatedFlag);
              this.animate();
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
  return (this.animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

ViewAnimator.prototype.setAuto = function (this: ViewAnimator<View, unknown>, auto: boolean): void {
  if (auto && (this.animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.OverrideFlag);
  } else if (!auto && (this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
  }
};

ViewAnimator.prototype.isTweening = function (this: ViewAnimator<View, unknown>): boolean {
  if (!this.isInherited()) {
    return (this.animatorFlags & TweenAnimator.TweeningFlag) !== 0;
  } else {
    const superAnimator = this.superAnimator;
    return superAnimator !== null && superAnimator.isTweening();
  }
};

Object.defineProperty(ViewAnimator.prototype, "ownValue", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    return !this.isInherited() ? this.value : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "ownState", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

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

ViewAnimator.prototype.getValue = function <T, U>(this: ViewAnimator<View, T, U>): T extends undefined ? never : T {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError("undefined " + this.name + " value");
  }
  return value as T extends undefined ? never : T;
};

ViewAnimator.prototype.getState = function <T, U>(this: ViewAnimator<View, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ViewAnimator.prototype.getValueOr = function <T, U, E>(this: ViewAnimator<View, T, U>, elseValue: E): (T extends undefined ? never : T) | E {
  let value: T | E | undefined = this.value;
  if (value === void 0) {
    value = elseValue;
  }
  return value as (T extends undefined ? never : T) | E;
};

ViewAnimator.prototype.getStateOr = function <T, U, E>(this: ViewAnimator<View, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState
  }
  return state as (T extends undefined ? never : T) | E;
};

ViewAnimator.prototype.setState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, tween?: Tween<T>): void {
  this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
  this.setOwnState(state, tween);
};

ViewAnimator.prototype.setAutoState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, tween?: Tween<T>): void {
  if ((this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this.setOwnState(state, tween);
  }
};

ViewAnimator.prototype.setOwnState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, tween?: Tween<T>): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.InheritedFlag);
  TweenAnimator.prototype.setState.call(this, state, tween);
};

ViewAnimator.prototype.setBaseState = function <T, U>(this: ViewAnimator<View, T, U>, state: T | U, tween?: Tween<T>): void {
  let superAnimator: ViewAnimator<View, T> | null;
  if (this.isInherited() && (superAnimator = this.superAnimator, superAnimator !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superAnimator.setBaseState(state as T, tween);
  } else {
    this.setState(state, tween);
  }
};

ViewAnimator.prototype.onAnimate = function (this: ViewAnimator<View, unknown>, t: number): void {
  if (!this.isInherited()) {
    TweenAnimator.prototype.onAnimate.call(this, t);
  } else if (this.isUpdated()) {
    this.onAnimateInherited();
  } else {
    this.onIdle();
  }
};

ViewAnimator.prototype.onAnimateInherited = function (this: ViewAnimator<View, unknown>): void {
  const superAnimator = this.superAnimator;
  if (superAnimator !== null) {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.UpdatedFlag);
    this.update(superAnimator.value, this.value);
  } else {
    this.onIdle();
  }
};

ViewAnimator.prototype.update = function <T>(this: ViewAnimator<View, T>, newValue: T, oldValue: T): void {
  if (!Values.equal(oldValue, newValue)) {
    this.willUpdate(newValue, oldValue);
    this._value = newValue;
    this.setAnimatorFlags(this.animatorFlags | TweenAnimator.UpdatedFlag);
    this.onUpdate(newValue, oldValue);
    this.updateSubAnimators(newValue, oldValue);
    this.didUpdate(newValue, oldValue);
  }
};

ViewAnimator.prototype.onUpdate = function <T>(this: ViewAnimator<View, T>, newValue: T, oldValue: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ViewAnimator.prototype.updateSubAnimators = function <T>(this: ViewAnimator<View, T>, newValue: T, oldValue: T): void {
  const subAnimators = this.subAnimators;
  if (subAnimators !== null) {
    for (let i = 0, n = subAnimators.length; i < n; i += 1) {
      const subAnimator = subAnimators[i]!;
      if (subAnimator.isInherited()) {
        subAnimator.setAnimatorFlags(subAnimator.animatorFlags | TweenAnimator.UpdatedFlag);
        subAnimator.animate();
      }
    }
  }
};

ViewAnimator.prototype.animate = function (this: ViewAnimator<View, unknown>, animator?: Animator): void {
  this.owner.animate(animator !== void 0 ? animator : this);
};

ViewAnimator.prototype.mount = function (this: ViewAnimator<View, unknown>): void {
  this.bindSuperAnimator();
};

ViewAnimator.prototype.unmount = function (this: ViewAnimator<View, unknown>): void {
  this.unbindSuperAnimator();
};

ViewAnimator.prototype.fromAny = function <T, U>(this: ViewAnimator<View, T, U>, value: T | U): T {
  return value as T;
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
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

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
    let _this: ViewAnimator<V, T, U> = function ViewAnimatorAccessor(state?: T | U, tween?: Tween<T>): T | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(state!, tween);
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
  Object.defineProperty(_prototype, "inherit", {
    value: inherit ?? false,
    enumerable: true,
    configurable: true,
  });

  return _constructor;
};
