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
import {AnyLength, Length} from "@swim/length";
import {AnyColor, Color} from "@swim/color";
import {AnyTransform, Transform} from "@swim/transform";
import {Tween} from "@swim/transition";
import {Animator, TweenAnimator} from "@swim/animate";
import {StringAttributeAnimator} from "./StringAttributeAnimator";
import {BooleanAttributeAnimator} from "./BooleanAttributeAnimator";
import {NumberAttributeAnimator} from "./NumberAttributeAnimator";
import {LengthAttributeAnimator} from "./LengthAttributeAnimator";
import {ColorAttributeAnimator} from "./ColorAttributeAnimator";
import {TransformAttributeAnimator} from "./TransformAttributeAnimator";
import {NumberOrStringAttributeAnimator} from "./NumberOrStringAttributeAnimator";
import {LengthOrStringAttributeAnimator} from "./LengthOrStringAttributeAnimator";
import {ColorOrStringAttributeAnimator} from "./ColorOrStringAttributeAnimator";
import {ViewFlags} from "../View";
import {ElementView} from "../element/ElementView";

export type AttributeAnimatorType<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, any>} ? T : unknown;

export type AttributeAnimatorInitType<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface AttributeAnimatorInit<V extends ElementView, T, U = T> {
  attributeName: string;
  type?: unknown;

  updateFlags?: ViewFlags;
  parse?(value: string): T
  fromAny?(value: T | U): T;

  extends?: AttributeAnimatorPrototype<T, U>;
}

export type AttributeAnimatorDescriptor<V extends ElementView, T, U = T, I = {}> = AttributeAnimatorInit<V, T, U> & ThisType<AttributeAnimator<V, T, U> & I> & I;

export type AttributeAnimatorPrototype<T, U = T> = Function & { prototype: AttributeAnimator<ElementView, T, U> };

export type AttributeAnimatorConstructor<T, U = T> = new <V extends ElementView>(view: V, animatorName: string) => AttributeAnimator<V, T, U>;

export declare abstract class AttributeAnimator<V extends ElementView, T, U = T> {
  /** @hidden */
  _view: V;

  constructor(view: V, animatorName: string);

  get name(): string;

  get view(): V;

  get node(): Element;

  abstract readonly attributeName: string;

  get attributeValue(): T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getValue(): T;

  getState(): T;

  getValueOr<E>(elseValue: E): T | E;

  getStateOr<E>(elseState: E): T | E;

  setState(state: T | U | undefined, tween?: Tween<T>): void;

  setAutoState(state: T | U | undefined, tween?: Tween<T>): void;

  animate(animator?: Animator): void;

  updateFlags?: ViewFlags;

  cancel(): void;

  delete(): void;

  abstract parse(value: string): T;

  abstract fromAny(value: T | U): T;

  /** @hidden */
  static constructorForType(type: unknown): AttributeAnimatorPrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static String: typeof StringAttributeAnimator; // defined by StringAttributeAnimator
  /** @hidden */
  static Boolean: typeof BooleanAttributeAnimator; // defined by BooleanAttributeAnimator
  /** @hidden */
  static Number: typeof NumberAttributeAnimator; // defined by NumberAttributeAnimator
  /** @hidden */
  static Length: typeof LengthAttributeAnimator; // defined by LengthAttributeAnimator
  /** @hidden */
  static Color: typeof ColorAttributeAnimator; // defined by ColorAttributeAnimator
  /** @hidden */
  static Transform: typeof TransformAttributeAnimator; // defined by TransformAttributeAnimator
  /** @hidden */
  static NumberOrString: typeof NumberOrStringAttributeAnimator; // defined by NumberOrStringAttributeAnimator
  /** @hidden */
  static LengthOrString: typeof LengthOrStringAttributeAnimator; // defined by LengthOrStringAttributeAnimator
  /** @hidden */
  static ColorOrString: typeof ColorOrStringAttributeAnimator; // defined by ColorOrStringAttributeAnimator
}

export interface AttributeAnimator<V extends ElementView, T, U = T> extends TweenAnimator<T> {
  (): T | undefined;
  (value: T | U | undefined, tween?: Tween<T>): V;
}

export function AttributeAnimator<V extends ElementView, T, U = T, I = {}>(descriptor: {extends: AttributeAnimatorPrototype<T, U>} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = string, U = T, I = {}>(descriptor: {type: typeof String} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = boolean, U = T | string, I = {}>(descriptor: {type: typeof Boolean} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = number, U = T | string, I = {}>(descriptor: {type: typeof Number} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = Length, U = T | AnyLength, I = {}>(descriptor: {type: typeof Length} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = Color, U = T | AnyColor, I = {}>(descriptor: {type: typeof Color} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = Transform, U = T | AnyTransform, I = {}>(descriptor: {type: typeof Transform} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = number | string, U = T | string, I = {}>(descriptor: {type: [typeof Number, typeof String]} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = Length | string, U = T | AnyLength, I = {}>(descriptor: {type: [typeof Length, typeof String]} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T = Color | string, U = T | AnyColor, I = {}>(descriptor: {type: [typeof Color, typeof String]} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T, U = T, I = {}>(descriptor: {type: FromAny<T, U>} & AttributeAnimatorDescriptor<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T, U = T, I = {}>(descriptor: {type: Function & { prototype: T }} & AttributeAnimatorDescriptor<V, T, I>): PropertyDecorator;

export function AttributeAnimator<V extends ElementView, T, U>(
    this: AttributeAnimator<V, T, U> | typeof AttributeAnimator,
    view: V | AttributeAnimatorInit<V, T, U>,
    animatorName?: string,
  ): AttributeAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof AttributeAnimator) { // constructor
    return AttributeAnimatorConstructor.call(this, view as V, animatorName as string);
  } else { // decorator factory
    return AttributeAnimatorDecoratorFactory(view as AttributeAnimatorInit<V, T, U>);
  }
};
__extends(AttributeAnimator, TweenAnimator);

function AttributeAnimatorConstructor<V extends ElementView, T, U = T>(this: AttributeAnimator<V, T, U>, view: V, animatorName: string): AttributeAnimator<V, T, U> {
  const _this: AttributeAnimator<V, T, U> = TweenAnimator.call(this, void 0, null) || this;
  Object.defineProperty(_this, "name", {
    value: animatorName,
    enumerable: true,
    configurable: true,
  });
  _this._view = view;
  return _this;
}

function AttributeAnimatorDecoratorFactory<V extends ElementView, T, U = T>(descriptor: AttributeAnimatorInit<V, T, U>): PropertyDecorator {
  const type = descriptor.type;
  delete descriptor.type;

  let BaseAttributeAnimator = descriptor.extends;
  delete descriptor.extends;
  if (BaseAttributeAnimator === void 0) {
    BaseAttributeAnimator = AttributeAnimator.constructorForType(type) as AttributeAnimatorPrototype<T, U>;
  }
  if (BaseAttributeAnimator === null) {
    BaseAttributeAnimator = AttributeAnimator;
    if (!("fromAny" in descriptor) && FromAny.is<T, U>(type)) {
      descriptor.fromAny = type.fromAny;
    }
  }

  function DecoratedAttributeAnimator(this: AttributeAnimator<V, T, U>, view: V, animatorName: string): AttributeAnimator<V, T, U> {
    let _this: AttributeAnimator<V, T, U> = function accessor(value?: T | U, tween?: Tween<T>): T | undefined | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(value, tween);
        return _this._view;
      }
    } as AttributeAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseAttributeAnimator!.call(_this, view, animatorName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedAttributeAnimator, BaseAttributeAnimator);
    DecoratedAttributeAnimator.prototype = descriptor as AttributeAnimator<V, T, U>;
    DecoratedAttributeAnimator.prototype.constructor = DecoratedAttributeAnimator;
    Object.setPrototypeOf(DecoratedAttributeAnimator.prototype, BaseAttributeAnimator.prototype);
  } else {
    __extends(DecoratedAttributeAnimator, BaseAttributeAnimator);
  }

  return ElementView.decorateAttributeAnimator.bind(void 0, DecoratedAttributeAnimator);
}

Object.defineProperty(AttributeAnimator.prototype, "view", {
  get: function (this: AttributeAnimator<ElementView, unknown, unknown>): ElementView {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "node", {
  get: function (this: AttributeAnimator<ElementView, unknown, unknown>): Element {
    return this._view._node;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
  get: function <T, U>(this: AttributeAnimator<ElementView, T, unknown>): T | undefined {
    const value = this._view.getAttribute(this.attributeName);
    if (value !== null) {
      try {
        return this.parse(value);
      } catch (e) {
        // swallow parse errors
      }
    }
    return void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "value", {
  get: function <T, U>(this: AttributeAnimator<ElementView, T, U>): T | undefined {
    let value = this._value;
    if (value === void 0) {
      value = this.attributeValue;
      if (value !== void 0) {
        this.setAuto(false);
      }
    }
    return value;
  },
  enumerable: true,
  configurable: true,
});

AttributeAnimator.prototype.isAuto = function (this: AttributeAnimator<ElementView, unknown, unknown>): boolean {
  return (this._animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

AttributeAnimator.prototype.setAuto = function (this: AttributeAnimator<ElementView, unknown, unknown>,
                                                auto: boolean): void {
  if (auto && (this._animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this._animatorFlags &= ~TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, true);
  } else if (!auto && (this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this._animatorFlags |= TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, false);
  }
};

AttributeAnimator.prototype.getValue = function <T, U>(this: AttributeAnimator<ElementView, T, U>): T {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError("undefined " + this.name + " value");
  }
  return value;
};

AttributeAnimator.prototype.getState = function <T, U>(this: AttributeAnimator<ElementView, T, U>): T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state;
};

AttributeAnimator.prototype.getValueOr = function <T, U, E>(this: AttributeAnimator<ElementView, T, U>,
                                                            elseValue: E): T | E {
  let value: T | E | undefined = this.value;
  if (value === void 0) {
    value = elseValue;
  }
  return value;
};

AttributeAnimator.prototype.getStateOr = function <T, U, E>(this: AttributeAnimator<ElementView, T, U>,
                                                            elseState: E): T | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState
  }
  return state;
};

AttributeAnimator.prototype.setState = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                       state: T | U | undefined, tween?: Tween<T>): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  this._animatorFlags |= TweenAnimator.OverrideFlag;
  TweenAnimator.prototype.setState.call(this, state, tween);
};

AttributeAnimator.prototype.setAutoState = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                           state: T | U | undefined, tween?: Tween<T>): void {
  if ((this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    TweenAnimator.prototype.setState.call(this, state, tween);
  }
};

AttributeAnimator.prototype.animate = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                      animator: Animator = this): void {
  if (animator !== this || (this._animatorFlags & TweenAnimator.DisabledFlag) === 0) {
    this._view.animate(animator);
  }
};

AttributeAnimator.prototype.onUpdate = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                       newValue: T | undefined,
                                                       oldValue: T | undefined): void {
  this._view.setAttribute(this.attributeName, newValue);
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._view.requireUpdate(updateFlags);
  }
};

AttributeAnimator.prototype.cancel = function <T, U>(this: AttributeAnimator<ElementView, T, U>): void {
  // nop
};

AttributeAnimator.prototype.delete = function <T, U>(this: AttributeAnimator<ElementView, T, U>): void {
  this._view.setAttribute(this.attributeName, void 0);
};

AttributeAnimator.constructorForType = function (type: unknown): AttributeAnimatorPrototype<unknown> | null {
  if (type === String) {
    return AttributeAnimator.String;
  } else if (type === Boolean) {
    return AttributeAnimator.Boolean;
  } else if (type === Number) {
    return AttributeAnimator.Number;
  } else if (type === Length) {
    return AttributeAnimator.Length;
  } else if (type === Color) {
    return AttributeAnimator.Color;
  } else if (type === Transform) {
    return AttributeAnimator.Transform;
  } else if (Array.isArray(type) && type.length === 2) {
    const [type0, type1] = type;
    if (type0 === Number && type1 === String) {
      return AttributeAnimator.NumberOrString;
    } else if (type0 === Length && type1 === String) {
      return AttributeAnimator.LengthOrString;
    } else if (type0 === Color && type1 === String) {
      return AttributeAnimator.ColorOrString;
    }
  }
  return null;
}
