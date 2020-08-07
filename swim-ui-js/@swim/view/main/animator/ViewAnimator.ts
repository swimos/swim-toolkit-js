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
import {Objects, FromAny} from "@swim/util";
import {AnyAngle, Angle} from "@swim/angle";
import {AnyLength, Length} from "@swim/length";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/font";
import {AnyTransform, Transform} from "@swim/transform";
import {ContinuousScale} from "@swim/scale";
import {Tween} from "@swim/transition";
import {Animator, TweenAnimator} from "@swim/animate";
import {ViewFlags, View} from "../View";
import {ObjectViewAnimator} from "./ObjectViewAnimator";
import {StringViewAnimator} from "./StringViewAnimator";
import {BooleanViewAnimator} from "./BooleanViewAnimator";
import {NumberViewAnimator} from "./NumberViewAnimator";
import {AngleViewAnimator} from "./AngleViewAnimator";
import {LengthViewAnimator} from "./LengthViewAnimator";
import {ColorViewAnimator} from "./ColorViewAnimator";
import {FontViewAnimator} from "./FontViewAnimator";
import {TransformViewAnimator} from "./TransformViewAnimator";
import {ContinuousScaleViewAnimator} from "./ContinuousScaleViewAnimator";

export type ViewAnimatorType<V, K extends keyof V> =
  V extends {[P in K]: ViewAnimator<any, infer T, any>} ? T : unknown;

export type ViewAnimatorInitType<V, K extends keyof V> =
  V extends {[P in K]: ViewAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface ViewAnimatorInit<V extends View, T, U = T> {
  type?: unknown;

  init?(): T | U | undefined;
  value?: T | U;
  inherit?: string | boolean;

  updateFlags?: ViewFlags;
  fromAny?(value: T | U): T | undefined;

  extends?: ViewAnimatorPrototype<T, U>;
}

export type ViewAnimatorDescriptor<V extends View, T, U = T, I = {}> = ViewAnimatorInit<V, T, U> & ThisType<ViewAnimator<V, T, U> & I> & I;

export type ViewAnimatorPrototype<T, U = T> = Function & { prototype: ViewAnimator<View, T, U> };

export type ViewAnimatorConstructor<T, U = T> = new <V extends View>(view: V, animatorName: string | undefined) => ViewAnimator<V, T, U>;

export declare abstract class ViewAnimator<V extends View, T, U = T> {
  /** @hidden */
  _view: V;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superAnimator?: ViewAnimator<View, T, U>;
  /** @hidden */
  _subAnimators?: ViewAnimator<View, T, U>[];

  constructor(view: V, animatorName: string | undefined);

  get name(): string;

  get view(): V;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superAnimator(): ViewAnimator<View, T, U> | null;

  /** @hidden */
  bindSuperAnimator(): void;

  /** @hidden */
  unbindSuperAnimator(): void;

  /** @hidden */
  addSubAnimator(subAnimator: ViewAnimator<View, T, U>): void;

  /** @hidden */
  removeSubAnimator(subAnimator: ViewAnimator<View, T, U>): void;

  get superValue(): T | undefined;

  get superState(): T | undefined;

  get ownValue(): T | undefined;

  get ownState(): T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  /** @hidden */
  superIsUpdated(): boolean;

  isUpdated(): boolean;

  /** @hidden */
  superIsTweening(): boolean;

  isTweening(): boolean;

  getValue(): T;

  getState(): T;

  getValueOr<E>(elseValue: E): T | E;

  getStateOr<E>(elseState: E): T | E;

  setState(state: T | U | undefined, tween?: Tween<T>): void;

  setAutoState(state: T | U | undefined, tween?: Tween<T>): void;

  setOwnState(state: T | U | undefined, tween?: Tween<T>): void;

  setBaseState(state: T | U | undefined, tween?: Tween<T>): void;

  animate(animator?: Animator): void;

  updateFlags?: ViewFlags;

  /** @hidden */
  cascadeUpdate(newValue: T | undefined, oldValue: T | undefined): void;

  mount(): void;

  unmount(): void;

  cancel(): void;

  delete(): void;

  abstract fromAny(value: T | U): T | undefined;

  /** @hidden */
  static constructorForType(type: unknown): ViewAnimatorPrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Object: typeof ObjectViewAnimator; // defined by ObjectViewAnimator
  /** @hidden */
  static String: typeof StringViewAnimator; // defined by StringViewAnimator
  /** @hidden */
  static Boolean: typeof BooleanViewAnimator; // defined by BooleanViewAnimator
  /** @hidden */
  static Number: typeof NumberViewAnimator; // defined by NumberViewAnimator
  /** @hidden */
  static Angle: typeof AngleViewAnimator; // defined by AngleViewAnimator
  /** @hidden */
  static Length: typeof LengthViewAnimator; // defined by LengthViewAnimator
  /** @hidden */
  static Color: typeof ColorViewAnimator; // defined by ColorViewAnimator
  /** @hidden */
  static Font: typeof FontViewAnimator; // defined by FontViewAnimator
  /** @hidden */
  static Transform: typeof TransformViewAnimator; // defined by TransformViewAnimator
  /** @hidden */
  static ContinuousScale: typeof ContinuousScaleViewAnimator; // defined by ContinuousScaleViewAnimator
}

export interface ViewAnimator<V extends View, T, U = T> extends TweenAnimator<T> {
  (): T | undefined;
  (value: T | U | undefined, tween?: Tween<T>): V;
}

export function ViewAnimator<V extends View, T, U = T, I = {}>(descriptor: {extends: ViewAnimatorPrototype<T, U>} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Object = object, U extends Object = T, I = {}>(descriptor: {type: typeof Object} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends string = string, U extends string = T, I = {}>(descriptor: {type: typeof String} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends boolean = boolean, U extends boolean | string = T | string, I = {}>(descriptor: {type: typeof Boolean} & ViewAnimatorDescriptor<V, T, U, I> ): PropertyDecorator;
export function ViewAnimator<V extends View, T extends number = number, U extends number | string = T | string, I = {}>(descriptor: {type: typeof Number} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Angle | null = Angle, U extends AnyAngle | null = T | AnyAngle, I = {}>(descriptor: {type: typeof Angle} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Length | null = Length, U extends AnyLength | null = T | AnyLength, I = {}>(descriptor: {type: typeof Length} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Color | null = Color, U extends AnyColor | null = T | AnyColor, I = {}>(descriptor: {type: typeof Color} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Font | null = Font, U extends AnyFont | null = T | AnyFont, I = {}>(descriptor: {type: typeof Font} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends Transform | null = Transform, U extends AnyTransform | null = T | AnyTransform, I = {}>(descriptor: {type: typeof Transform} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T extends ContinuousScale<unknown, unknown> = ContinuousScale<unknown, unknown>, U extends ContinuousScale<unknown, unknown> | string = T | string, I = {}>(descriptor: {type: typeof ContinuousScale} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T, U = T, I = {}>(descriptor: {type: FromAny<T, U>} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewAnimator<V extends View, T, U = T, I = {}>(descriptor: {type: Function & { prototype: T }} & ViewAnimatorDescriptor<V, T, U, I>): PropertyDecorator;

export function ViewAnimator<V extends View, T, U>(
    this: ViewAnimator<V, T, U> | typeof ViewAnimator,
    view: V | ViewAnimatorInit<V, T, U>,
    animatorName?: string,
  ): ViewAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof ViewAnimator) { // constructor
    return ViewAnimatorConstructor.call(this, view as V, animatorName);
  } else { // decorator factory
    return ViewAnimatorDecoratorFactory(view as ViewAnimatorInit<V, T, U>);
  }
};
__extends(ViewAnimator, TweenAnimator);
View.Animator = ViewAnimator;

function ViewAnimatorConstructor<V extends View, T, U>(this: ViewAnimator<V, T, U>, view: V, animatorName: string | undefined): ViewAnimator<V, T, U> {
  const _this: ViewAnimator<V, T, U> = TweenAnimator.call(this, void 0, null) || this;
  if (animatorName !== void 0) {
    Object.defineProperty(_this, "name", {
      value: animatorName,
      enumerable: true,
      configurable: true,
    });
  }
  _this._view = view;
  return _this;
}

function ViewAnimatorDecoratorFactory<V extends View, T, U = T>(descriptor: ViewAnimatorInit<V, T, U>): PropertyDecorator {
  const type = descriptor.type;
  const init = descriptor.init;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.init;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseViewAnimator = descriptor.extends;
  delete descriptor.extends;
  if (BaseViewAnimator === void 0) {
    BaseViewAnimator = ViewAnimator.constructorForType(type) as ViewAnimatorPrototype<T, U>;
  }
  if (BaseViewAnimator === null) {
    if (FromAny.is<T, U>(type)) {
      BaseViewAnimator = ViewAnimator;
      if (!("fromAny" in descriptor)) {
        descriptor.fromAny = type.fromAny;
      }
    } else {
      BaseViewAnimator = ViewAnimator.Object;
    }
  }

  function DecoratedViewAnimator(this: ViewAnimator<V, T, U>, view: V, animatorName: string | undefined): ViewAnimator<V, T, U> {
    let _this: ViewAnimator<V, T, U> = function accessor(value?: T | U, tween?: Tween<T>): T | undefined | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(value, tween);
        return _this._view;
      }
    } as ViewAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseViewAnimator!.call(_this, view, animatorName) || _this;
    if (typeof inherit === "string") {
      _this._inherit = inherit;
    } else if (inherit === true && animatorName !== void 0) {
      _this._inherit = animatorName;
    }
    let initValue: T | undefined;
    if (init !== void 0) {
      const lazyValue = init.call(_this);
      if (lazyValue !== void 0) {
        initValue = _this.fromAny(lazyValue);
      }
    } else if (value !== void 0) {
      initValue = _this.fromAny(value);
    }
    if (initValue !== void 0) {
      _this._value = initValue;
      _this._state = initValue;
    }
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedViewAnimator, BaseViewAnimator);
    DecoratedViewAnimator.prototype = descriptor as ViewAnimator<V, T, U>;
    DecoratedViewAnimator.prototype.constructor = DecoratedViewAnimator;
    Object.setPrototypeOf(DecoratedViewAnimator.prototype, BaseViewAnimator.prototype);
  } else {
    __extends(DecoratedViewAnimator, BaseViewAnimator);
  }

  return View.decorateViewAnimator.bind(void 0, DecoratedViewAnimator);
}

Object.defineProperty(ViewAnimator.prototype, "view", {
  get: function <V extends View>(this: ViewAnimator<V, unknown>): V {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "inherit", {
  get: function (this: ViewAnimator<View, unknown>): string | undefined {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

ViewAnimator.prototype.setInherit = function (this: ViewAnimator<View, unknown>,
                                              inherit: string | undefined): void {
  this.unbindSuperAnimator();
  if (inherit !== void 0) {
    this._inherit = inherit;
    this.bindSuperAnimator();
  } else if (this._inherit !== void 0) {
    this._inherit = void 0;
  }
};

Object.defineProperty(ViewAnimator.prototype, "superAnimator", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): ViewAnimator<View, T, U> | null {
    let superAnimator: ViewAnimator<View, T, U> | null | undefined = this._superAnimator;
    if (superAnimator === void 0) {
      superAnimator = null;
      let view = this._view;
      if (!view.isMounted()) {
        const inherit = this._inherit;
        if (inherit !== void 0) {
          do {
            const parentView = view.parentView;
            if (parentView !== null) {
              view = parentView;
              const animator = view.getLazyViewAnimator(inherit);
              if (animator === null) {
                continue;
              } else {
                superAnimator = animator as ViewAnimator<View, T, U>;
              }
            }
            break;
          } while (true);
        }
      }
    }
    return superAnimator;
  },
  enumerable: true,
  configurable: true,
});

ViewAnimator.prototype.bindSuperAnimator = function (this: ViewAnimator<View, unknown>): void {
  let view = this._view;
  if (view.isMounted()) {
    const inherit = this._inherit;
    if (inherit !== void 0) {
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const animator = view.getLazyViewAnimator(inherit);
          if (animator === null) {
            continue;
          } else {
            this._superAnimator = animator;
            animator.addSubAnimator(this);
          }
        }
        break;
      } while (true);
    }
  }
};

ViewAnimator.prototype.unbindSuperAnimator = function (this: ViewAnimator<View, unknown>): void {
  const superAnimator = this._superAnimator;
  if (superAnimator !== void 0) {
    superAnimator.removeSubAnimator(this);
    this._superAnimator = void 0;
  }
};

ViewAnimator.prototype.addSubAnimator = function <T, U>(this: ViewAnimator<View, T, U>,
                                                        subAnimator: ViewAnimator<View, T, U>): void {
  let subAnimators = this._subAnimators;
  if (subAnimators === void 0) {
    subAnimators = [];
    this._subAnimators = subAnimators;
  }
  subAnimators.push(subAnimator);
};

ViewAnimator.prototype.removeSubAnimator = function <T, U>(this: ViewAnimator<View, T, U>,
                                                           subAnimator: ViewAnimator<View, T, U>): void {
  const subAnimators = this._subAnimators;
  if (subAnimators !== void 0) {
    const index = subAnimators.indexOf(subAnimator);
    if (index >= 0) {
      subAnimators.splice(index, 1);
    }
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

Object.defineProperty(ViewAnimator.prototype, "ownValue", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    return this._value;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "ownState", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    return this._state;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "value", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    const value = this._value;
    return value !== void 0 ? value : this.superValue;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewAnimator.prototype, "state", {
  get: function <T, U>(this: ViewAnimator<View, T, U>): T | undefined {
    const state = this._state;
    return state !== void 0 ? state : this.superState;
  },
  enumerable: true,
  configurable: true,
});

ViewAnimator.prototype.isAuto = function (this: ViewAnimator<View, unknown>): boolean {
  return (this._animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

ViewAnimator.prototype.setAuto = function (this: ViewAnimator<View, unknown>,
                                           auto: boolean): void {
  if (auto && (this._animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this._animatorFlags &= ~TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, true);
  } else if (!auto && (this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this._animatorFlags |= TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, false);
  }
};

ViewAnimator.prototype.superIsUpdated = function (this: ViewAnimator<View, unknown>): boolean {
  const superAnimator = this.superAnimator;
  return superAnimator !== null && superAnimator.isUpdated();
};

ViewAnimator.prototype.isUpdated = function (this: ViewAnimator<View, unknown>): boolean {
  return this._value !== void 0 ? TweenAnimator.prototype.isUpdated.call(this) : this.superIsUpdated();
};

ViewAnimator.prototype.superIsTweening = function (this: ViewAnimator<View, unknown>): boolean {
  const superAnimator = this.superAnimator;
  return superAnimator !== null && superAnimator.isTweening();
};

ViewAnimator.prototype.isTweening = function (this: ViewAnimator<View, unknown>): boolean {
  return this._value !== void 0 ? TweenAnimator.prototype.isTweening.call(this) : this.superIsTweening();
};

ViewAnimator.prototype.getValue = function <T, U>(this: ViewAnimator<View, T, U>): T {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError("undefined " + this.name + " value");
  }
  return value;
};

ViewAnimator.prototype.getState = function <T, U>(this: ViewAnimator<View, T, U>): T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state;
};

ViewAnimator.prototype.getValueOr = function <T, U, E>(this: ViewAnimator<View, T, U>,
                                                       elseValue: E): T | E {
  let value: T | E | undefined = this.value;
  if (value === void 0) {
    value = elseValue;
  }
  return value;
};

ViewAnimator.prototype.getStateOr = function <T, U, E>(this: ViewAnimator<View, T, U>,
                                                       elseState: E): T | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState
  }
  return state;
};

ViewAnimator.prototype.setState = function <T, U>(this: ViewAnimator<View, T, U>,
                                                  state: T | U | undefined,
                                                  tween?: Tween<T>): void {
  this._animatorFlags |= TweenAnimator.OverrideFlag;
  this.setOwnState(state, tween);
};

ViewAnimator.prototype.setAutoState = function <T, U>(this: ViewAnimator<View, T, U>,
                                                      state: T | U | undefined,
                                                      tween?: Tween<T>): void {
  if ((this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this.setOwnState(state, tween);
  }
};

ViewAnimator.prototype.setOwnState = function <T, U>(this: ViewAnimator<View, T, U>,
                                                     state: T | U | undefined,
                                                     tween?: Tween<T>): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  TweenAnimator.prototype.setState.call(this, state, tween);
};

ViewAnimator.prototype.setBaseState = function <T, U>(this: ViewAnimator<View, T, U>,
                                                      state: T | U | undefined,
                                                      tween?: Tween<T>): void {
  let superAnimator: ViewAnimator<View, T, U> | null | undefined;
  if (this._value === void 0 && (superAnimator = this.superAnimator, superAnimator !== null)) {
    superAnimator.setBaseState(state, tween);
  } else {
    this.setState(state, tween);
  }
};

ViewAnimator.prototype.animate = function <T, U>(this: ViewAnimator<View, T, U>,
                                                 animator: Animator = this): void {
  if (animator !== this || (this._animatorFlags & TweenAnimator.DisabledFlag) === 0) {
    this._view.animate(animator);
  }
};

ViewAnimator.prototype.update = function <T, U>(this: ViewAnimator<View, T, U>,
                                                newValue: T | undefined,
                                                oldValue: T | undefined): void {
  if (!Objects.equal(oldValue, newValue)) {
    this.willUpdate(newValue, oldValue);
    this._animatorFlags |= TweenAnimator.UpdatedFlag;
    this._value = newValue;
    this.onUpdate(newValue, oldValue);
    this.cascadeUpdate(newValue, oldValue);
    this.didUpdate(newValue, oldValue);
  }
};

ViewAnimator.prototype.cascadeUpdate = function <T, U>(this: ViewAnimator<View, T, U>,
                                                       newValue: T | undefined,
                                                       oldValue: T | undefined): void {
  const subAnimators = this._subAnimators;
  if (subAnimators !== void 0) {
    for (let i = 0, n = subAnimators.length; i < n; i += 1) {
      const subAnimator = subAnimators[i];
      if (subAnimator._value === void 0) {
        subAnimator.willUpdate(newValue, oldValue);
        subAnimator._animatorFlags |= TweenAnimator.UpdatedFlag;
        subAnimator.onUpdate(newValue, oldValue);
        subAnimator.cascadeUpdate(newValue, oldValue);
        subAnimator.didUpdate(newValue, oldValue);
      }
    }
  }
};

ViewAnimator.prototype.onUpdate = function <T, U>(this: ViewAnimator<View, T, U>,
                                                  newValue: T | undefined,
                                                  oldValue: T | undefined): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._view.requireUpdate(updateFlags);
  }
};

ViewAnimator.prototype.onIdle = function (this: ViewAnimator<View, unknown>): void {
  if (this._value !== void 0) {
    TweenAnimator.prototype.onIdle.call(this);
  }
};

ViewAnimator.prototype.mount = function (this: ViewAnimator<View, unknown>): void {
  this.bindSuperAnimator();
};

ViewAnimator.prototype.unmount = function (this: ViewAnimator<View, unknown>): void {
  this.unbindSuperAnimator();
};

ViewAnimator.prototype.cancel = function (this: ViewAnimator<View, unknown>): void {
  // nop
};

ViewAnimator.prototype.delete = function (this: ViewAnimator<View, unknown>): void {
  // nop
};

ViewAnimator.constructorForType = function (type: unknown): ViewAnimatorPrototype<unknown> | null {
  if (type === String) {
    return ViewAnimator.String;
  } else if (type === Boolean) {
    return ViewAnimator.Boolean;
  } else if (type === Number) {
    return ViewAnimator.Number;
  } else if (type === Angle) {
    return ViewAnimator.Angle;
  } else if (type === Length) {
    return ViewAnimator.Length;
  } else if (type === Color) {
    return ViewAnimator.Color;
  } else if (type === Font) {
    return ViewAnimator.Font;
  } else if (type === Transform) {
    return ViewAnimator.Transform;
  } else if (type === ContinuousScale) {
    return ViewAnimator.ContinuousScale;
  }
  return null;
}
