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
import {AnyLength, Length, AnyTransform, Transform} from "@swim/math";
import {Tween, Animator, TweenAnimator} from "@swim/animation";
import {AnyColor, Color} from "@swim/color";
import type {ViewFlags} from "@swim/view";
import type {StringAttributeAnimator} from "./StringAttributeAnimator";
import type {BooleanAttributeAnimator} from "./BooleanAttributeAnimator";
import type {NumberAttributeAnimator} from "./NumberAttributeAnimator";
import type {LengthAttributeAnimator} from "./LengthAttributeAnimator";
import type {ColorAttributeAnimator} from "./ColorAttributeAnimator";
import type {TransformAttributeAnimator} from "./TransformAttributeAnimator";
import type {NumberOrStringAttributeAnimator} from "./NumberOrStringAttributeAnimator";
import type {LengthOrStringAttributeAnimator} from "./LengthOrStringAttributeAnimator";
import type {ColorOrStringAttributeAnimator} from "./ColorOrStringAttributeAnimator";
import type {ViewNodeType} from "../node/NodeView";
import {ElementView} from "../element/ElementView";

export type AttributeAnimatorMemberType<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, any>} ? T : unknown;

export type AttributeAnimatorMemberInit<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface AttributeAnimatorInit<T, U = never> {
  attributeName: string;
  extends?: AttributeAnimatorClass;
  type?: unknown;

  updateFlags?: ViewFlags;
  willUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  onUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  didUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  parse?(value: string): T | undefined
  fromAny?(value: T | U): T | undefined;
}

export type AttributeAnimatorDescriptor<V extends ElementView, T, U = never, I = {}> = AttributeAnimatorInit<T, U> & ThisType<AttributeAnimator<V, T, U> & I> & I;

export type AttributeAnimatorDescriptorExtends<V extends ElementView, T, U = never, I = {}> = {extends: AttributeAnimatorClass | undefined} & AttributeAnimatorDescriptor<V, T, U, I>;

export type AttributeAnimatorDescriptorFromAny<V extends ElementView, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T | undefined}) & AttributeAnimatorDescriptor<V, T, U, I>;

export interface AttributeAnimatorConstructor<V extends ElementView, T, U = never, I = {}> {
  new(owner: V, animatorName: string): AttributeAnimator<V, T, U> & I;
  prototype: AttributeAnimator<any, any, any> & I;
}

export interface AttributeAnimatorClass extends Function {
  readonly prototype: AttributeAnimator<any, any, any>;
}

export declare abstract class AttributeAnimator<V extends ElementView, T, U = never> {
  /** @hidden */
  _owner: V;

  constructor(owner: V, animatorName: string);

  get name(): string;

  get owner(): V;

  get node(): ViewNodeType<V>;

  updateFlags?: ViewFlags;

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

  onUpdate(newValue: T | undefined, oldValue: T | undefined): void;

  animate(animator?: Animator): void;

  parse(value: string): T | undefined;

  fromAny(value: T | U): T | undefined;

  /** @hidden */
  static getClass(type: unknown): AttributeAnimatorClass | null;

  static define<V extends ElementView, T, U = never, I = {}>(descriptor: AttributeAnimatorDescriptorExtends<V, T, U, I>): AttributeAnimatorConstructor<V, T, U, I>;
  static define<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): AttributeAnimatorConstructor<V, T, U>;

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

export interface AttributeAnimator<V extends ElementView, T, U = never> extends TweenAnimator<T | undefined> {
  (): T | undefined;
  (value: T | U | undefined, tween?: Tween<T>): V;
}

export function AttributeAnimator<V extends ElementView, T extends Length | undefined = Length | undefined, U extends AnyLength | undefined = AnyLength | undefined>(descriptor: {type: typeof Length} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends Color | undefined = Color | undefined, U extends AnyColor | undefined = AnyColor | undefined>(descriptor: {type: typeof Color} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends Transform | undefined = Transform | undefined, U extends AnyTransform | undefined = AnyTransform | undefined>(descriptor: {type: typeof Transform} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends Length | string | undefined = Length | string | undefined, U extends AnyLength | string | undefined = AnyLength | string | undefined>(descriptor: {type: [typeof Length, typeof String]} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends Color | string | undefined = Color | string | undefined, U extends AnyColor | string | undefined = AnyColor | string | undefined>(descriptor: {type: [typeof Color, typeof String]} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T extends number | string | undefined = number | string | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: [typeof Number, typeof String]} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptorFromAny<V, T, U>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T, U = never, I = {}>(descriptor: AttributeAnimatorDescriptorExtends<V, T, U, I>): PropertyDecorator;
export function AttributeAnimator<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;

export function AttributeAnimator<V extends ElementView, T, U>(
    this: AttributeAnimator<V, T, U> | typeof AttributeAnimator,
    owner: V | AttributeAnimatorDescriptor<V, T, U>,
    animatorName?: string,
  ): AttributeAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof AttributeAnimator) { // constructor
    return AttributeAnimatorConstructor.call(this as AttributeAnimator<V, unknown, unknown>, owner as V, animatorName);
  } else { // decorator factory
    return AttributeAnimatorDecoratorFactory(owner as AttributeAnimatorDescriptor<V, T, U>);
  }
}
__extends(AttributeAnimator, TweenAnimator);

function AttributeAnimatorConstructor<V extends ElementView, T, U>(this: AttributeAnimator<V, T, U>, owner: V, animatorName: string | undefined): AttributeAnimator<V, T, U> {
  const _this: AttributeAnimator<V, T, U> = (TweenAnimator as Function).call(this, void 0, null) || this;
  if (animatorName !== void 0) {
    Object.defineProperty(_this, "name", {
      value: animatorName,
      enumerable: true,
      configurable: true,
    });
  }
  _this._owner = owner;
  return _this;
}

function AttributeAnimatorDecoratorFactory<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator {
  return ElementView.decorateAttributeAnimator.bind(ElementView, AttributeAnimator.define(descriptor as AttributeAnimatorDescriptor<ElementView, unknown>));
}

Object.defineProperty(AttributeAnimator.prototype, "owner", {
  get: function (this: AttributeAnimator<ElementView, unknown, unknown>): ElementView {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "node", {
  get: function (this: AttributeAnimator<ElementView, unknown, unknown>): Element {
    return this._owner.node;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
  get: function <T, U>(this: AttributeAnimator<ElementView, T, unknown>): T | undefined {
    const value = this._owner.getAttribute(this.attributeName);
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
  return (this.animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

AttributeAnimator.prototype.setAuto = function (this: AttributeAnimator<ElementView, unknown, unknown>,
                                                auto: boolean): void {
  if (auto && (this.animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.OverrideFlag);
  } else if (!auto && (this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
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
  this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
  TweenAnimator.prototype.setState.call(this, state, tween);
};

AttributeAnimator.prototype.setAutoState = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                           state: T | U | undefined, tween?: Tween<T>): void {
  if ((this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    TweenAnimator.prototype.setState.call(this, state, tween);
  }
};

AttributeAnimator.prototype.onUpdate = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                       newValue: T | undefined,
                                                       oldValue: T | undefined): void {
  this._owner.setAttribute(this.attributeName, newValue);
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._owner.requireUpdate(updateFlags);
  }
};

AttributeAnimator.prototype.animate = function <T, U>(this: AttributeAnimator<ElementView, T, U>,
                                                      animator: Animator = this): void {
  if (animator !== this || (this.animatorFlags & TweenAnimator.DisabledFlag) === 0) {
    this._owner.animate(animator);
  }
};

AttributeAnimator.prototype.parse = function <T, U>(this: AttributeAnimator<ElementView, T, U>): T | undefined {
  return void 0;
};

AttributeAnimator.prototype.fromAny = function <T, U>(this: AttributeAnimator<ElementView, T, U>, value: T | U): T | undefined {
  return void 0;
};

AttributeAnimator.getClass = function (type: unknown): AttributeAnimatorClass | null {
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
};

AttributeAnimator.define = function <V extends ElementView, T, U, I>(descriptor: AttributeAnimatorDescriptor<V, T, U, I>): AttributeAnimatorConstructor<V, T, U, I> {
  let _super: AttributeAnimatorClass | null | undefined = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = AttributeAnimator.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = AttributeAnimator;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function AttributeAnimatorAccessor(this: AttributeAnimator<V, T, U>, owner: V, animatorName: string): AttributeAnimator<V, T, U> {
    let _this: AttributeAnimator<V, T, U> = function accessor(value?: T | U, tween?: Tween<T>): T | undefined | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(value, tween);
        return _this._owner;
      }
    } as AttributeAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, animatorName) || _this;
    return _this;
  } as unknown as AttributeAnimatorConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as AttributeAnimator<V, T, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  return _constructor;
};
