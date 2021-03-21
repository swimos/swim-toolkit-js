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
import {AnyLength, Length, AnyTransform, Transform} from "@swim/math";
import {AnyColor, Color} from "@swim/style";
import type {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewFlags, View, Animator} from "@swim/view";
import {StringAttributeAnimator} from "../"; // forward import
import {BooleanAttributeAnimator} from "../"; // forward import
import {NumberAttributeAnimator} from "../"; // forward import
import {LengthAttributeAnimator} from "../"; // forward import
import {ColorAttributeAnimator} from "../"; // forward import
import {TransformAttributeAnimator} from "../"; // forward import
import {ElementView} from "../"; // forward import

export type AttributeAnimatorMemberType<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, any>} ? T : unknown;

export type AttributeAnimatorMemberInit<V, K extends keyof V> =
  V extends {[P in K]: AttributeAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface AttributeAnimatorInit<T, U = never> {
  attributeName: string;
  extends?: AttributeAnimatorClass;
  type?: unknown;

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
  parse?(value: string): T
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type AttributeAnimatorDescriptor<V extends ElementView, T, U = never, I = {}> = AttributeAnimatorInit<T, U> & ThisType<AttributeAnimator<V, T, U> & I> & Partial<I>;

export type AttributeAnimatorDescriptorExtends<V extends ElementView, T, U = never, I = {}> = {extends: AttributeAnimatorClass | undefined} & AttributeAnimatorDescriptor<V, T, U, I>;

export type AttributeAnimatorDescriptorFromAny<V extends ElementView, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & AttributeAnimatorDescriptor<V, T, U, I>;

export interface AttributeAnimatorConstructor<V extends ElementView, T, U = never, I = {}> {
  new(owner: V, animatorName: string): AttributeAnimator<V, T, U> & I;
  prototype: AttributeAnimator<any, any> & I;
}

export interface AttributeAnimatorClass extends Function {
  readonly prototype: AttributeAnimator<any, any>;
}

export interface AttributeAnimator<V extends ElementView, T, U = never> extends Animator<T> {
  (): T;
  (value: T | U, timing?: AnyTiming | boolean): V;

  readonly name: string;

  readonly owner: V;

  readonly node: Node;

  readonly attributeName: string;

  readonly attributeValue: T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getValue(): NonNullable<T>;

  getState(): NonNullable<T>;

  setState(state: T | U, timing?: AnyTiming | boolean): void;

  setAutoState(state: T | U, timing?: AnyTiming | boolean): void;

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

  parse(value: string): T;

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

export const AttributeAnimator = function <V extends ElementView, T, U>(
    this: AttributeAnimator<V, T, U> | typeof AttributeAnimator,
    owner: V | AttributeAnimatorDescriptor<V, T, U>,
    animatorName?: string,
  ): AttributeAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof AttributeAnimator) { // constructor
    return AttributeAnimatorConstructor.call(this as AttributeAnimator<V, unknown, unknown>, owner as V, animatorName);
  } else { // decorator factory
    return AttributeAnimatorDecoratorFactory(owner as AttributeAnimatorDescriptor<V, T, U>);
  }
} as {
  /** @hidden */
  new<V extends ElementView, T, U = never, I = {}>(owner: V, animatorName: string): AttributeAnimator<V, T, U> & I;

  <V extends ElementView, T extends Length | undefined = Length | undefined, U extends AnyLength | undefined = AnyLength | undefined>(descriptor: {type: typeof Length} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T extends Color | undefined = Color | undefined, U extends AnyColor | undefined = AnyColor | undefined>(descriptor: {type: typeof Color} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T extends Transform | undefined = Transform | undefined, U extends AnyTransform | undefined = AnyTransform | undefined>(descriptor: {type: typeof Transform} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptorFromAny<V, T, U>): PropertyDecorator;
  <V extends ElementView, T, U = never, I = {}>(descriptor: AttributeAnimatorDescriptorExtends<V, T, U, I>): PropertyDecorator;
  <V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: AttributeAnimator<any, any>;

  /** @hidden */
  getClass(type: unknown): AttributeAnimatorClass | null;

  define<V extends ElementView, T, U = never, I = {}>(descriptor: AttributeAnimatorDescriptorExtends<V, T, U, I>): AttributeAnimatorConstructor<V, T, U, I>;
  define<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): AttributeAnimatorConstructor<V, T, U>;
};
__extends(AttributeAnimator, Animator);

function AttributeAnimatorConstructor<V extends ElementView, T, U>(this: AttributeAnimator<V, T, U>, owner: V, animatorName: string | undefined): AttributeAnimator<V, T, U> {
  const _this: AttributeAnimator<V, T, U> = (Animator as Function).call(this, void 0, null) || this;
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
  return _this;
}

function AttributeAnimatorDecoratorFactory<V extends ElementView, T, U = never>(descriptor: AttributeAnimatorDescriptor<V, T, U>): PropertyDecorator {
  return ElementView.decorateAttributeAnimator.bind(ElementView, AttributeAnimator.define(descriptor as AttributeAnimatorDescriptor<ElementView, unknown>));
}

Object.defineProperty(AttributeAnimator.prototype, "node", {
  get: function (this: AttributeAnimator<ElementView, unknown>): Node {
    return this.owner.node;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
  get: function <T>(this: AttributeAnimator<ElementView, T, unknown>): T | undefined {
    const value = this.owner.getAttribute(this.attributeName);
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
  get: function <T>(this: AttributeAnimator<ElementView, T>): T {
    let value = this.ownValue;
    if (!this.isDefined(value)) {
      const attributeValue = this.attributeValue;
      if (attributeValue !== void 0) {
        value = attributeValue;
        this.setAuto(false);
      }
    }
    return value;
  },
  enumerable: true,
  configurable: true,
});

AttributeAnimator.prototype.isAuto = function (this: AttributeAnimator<ElementView, unknown>): boolean {
  return (this.animatorFlags & Animator.OverrideFlag) === 0;
};

AttributeAnimator.prototype.setAuto = function (this: AttributeAnimator<ElementView, unknown>, auto: boolean): void {
  if (auto && (this.animatorFlags & Animator.OverrideFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~Animator.OverrideFlag);
  } else if (!auto && (this.animatorFlags & Animator.OverrideFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | Animator.OverrideFlag);
  }
};

AttributeAnimator.prototype.getValue = function <T>(this: AttributeAnimator<ElementView, T>): NonNullable<T> {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError(value + " " + this.name + " value");
  }
  return value as NonNullable<T>;
};

AttributeAnimator.prototype.getState = function <T>(this: AttributeAnimator<ElementView, T>): NonNullable<T> {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError(state + " " + this.name + " state");
  }
  return state as NonNullable<T>;
};

AttributeAnimator.prototype.setState = function <T, U>(this: AttributeAnimator<ElementView, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  this.setAnimatorFlags(this.animatorFlags | Animator.OverrideFlag);
  this.setLook(null);
  Animator.prototype.setState.call(this, state, timing);
};

AttributeAnimator.prototype.setAutoState = function <T, U>(this: AttributeAnimator<ElementView, T, U>, state: T | U, timing?: AnyTiming | boolean): void {
  if ((this.animatorFlags & Animator.OverrideFlag) === 0) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    Animator.prototype.setState.call(this, state, timing);
  }
};

AttributeAnimator.prototype.onSetValue = function <T>(this: AttributeAnimator<ElementView, T>, newValue: T, oldValue: T): void {
  this.owner.setAttribute(this.attributeName, newValue);
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

AttributeAnimator.prototype.setLook = function <T>(this: AttributeAnimator<ElementView, T>, newLook: Look<T> | null, timing?: AnyTiming | boolean): void {
  const oldLook = this.look;
  if (newLook !== oldLook) {
    if (timing === void 0) {
      timing = false;
    } else {
      timing = Timing.fromAny(timing);
    }
    this.willSetLook(newLook, oldLook, timing as Timing | boolean);
    Object.defineProperty(this, "look", {
      value: newLook,
      enumerable: true,
      configurable: true,
    });
    this.onSetLook(newLook, oldLook, timing as Timing | boolean);
    this.didSetLook(newLook, oldLook, timing as Timing | boolean);
  }
};

AttributeAnimator.prototype.willSetLook = function <T>(this: AttributeAnimator<ElementView, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
  // hook
};

AttributeAnimator.prototype.onSetLook = function <T>(this: AttributeAnimator<ElementView, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
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

AttributeAnimator.prototype.didSetLook = function <T>(this: AttributeAnimator<ElementView, T>, newLook: Look<T> | null, oldLook: Look<T> | null, timing: Timing | boolean): void {
  // hook
};

AttributeAnimator.prototype.applyTheme = function <T>(this: AttributeAnimator<ElementView, T>, theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
  const look = this.look;
  if (look !== null && this.isAuto()) {
    const state = theme.get(look, mood);
    if (state !== void 0) {
      this.setAutoState(state, timing);
    }
  }
};

AttributeAnimator.prototype.willStartAnimating = function (this: AttributeAnimator<ElementView, unknown>): void {
  this.owner.trackWillStartAnimating(this);
};

AttributeAnimator.prototype.didStartAnimating = function (this: AttributeAnimator<ElementView, unknown>): void {
  this.owner.trackDidStartAnimating(this);
};

AttributeAnimator.prototype.willStopAnimating = function (this: AttributeAnimator<ElementView, unknown>): void {
  this.owner.trackWillStopAnimating(this);
};

AttributeAnimator.prototype.didStopAnimating = function (this: AttributeAnimator<ElementView, unknown>): void {
  this.owner.trackDidStopAnimating(this);
};

AttributeAnimator.prototype.parse = function <T>(this: AttributeAnimator<ElementView, T>): T {
  throw new Error();
};

AttributeAnimator.prototype.fromAny = function <T, U>(this: AttributeAnimator<ElementView, T, U>, value: T | U): T {
  return value as T;
};

AttributeAnimator.prototype.isMounted = function (this: AttributeAnimator<ElementView, unknown>): boolean {
  return (this.animatorFlags & Animator.MountedFlag) !== 0;
};

AttributeAnimator.prototype.mount = function (this: AttributeAnimator<ElementView, unknown>): void {
  if ((this.animatorFlags & Animator.MountedFlag) === 0) {
    this.willMount();
    this.setAnimatorFlags(this.animatorFlags | Animator.MountedFlag);
    this.onMount();
    this.didMount();
  }
};

AttributeAnimator.prototype.willMount = function (this: AttributeAnimator<ElementView, unknown>): void {
  // hook
};

AttributeAnimator.prototype.onMount = function (this: AttributeAnimator<ElementView, unknown>): void {
  const look = this.look;
  if (look !== null) {
    this.owner.requireUpdate(View.NeedsChange);
  }
};

AttributeAnimator.prototype.didMount = function (this: AttributeAnimator<ElementView, unknown>): void {
  // hook
};

AttributeAnimator.prototype.unmount = function (this: AttributeAnimator<ElementView, unknown>): void {
  if ((this.animatorFlags & Animator.MountedFlag) !== 0) {
    this.willUnmount();
    this.setAnimatorFlags(this.animatorFlags & ~Animator.MountedFlag);
    this.onUnmount();
    this.didUnmount();
  }
};

AttributeAnimator.prototype.willUnmount = function (this: AttributeAnimator<ElementView, unknown>): void {
  // hook
};

AttributeAnimator.prototype.onUnmount = function (this: AttributeAnimator<ElementView, unknown>): void {
  this.stopAnimating();
};

AttributeAnimator.prototype.didUnmount = function (this: AttributeAnimator<ElementView, unknown>): void {
  // hook
};

AttributeAnimator.prototype.toString = function (this: AttributeAnimator<ElementView, unknown>): string {
  return this.name;
};

AttributeAnimator.getClass = function (type: unknown): AttributeAnimatorClass | null {
  if (type === String) {
    return StringAttributeAnimator;
  } else if (type === Boolean) {
    return BooleanAttributeAnimator;
  } else if (type === Number) {
    return NumberAttributeAnimator;
  } else if (type === Length) {
    return LengthAttributeAnimator;
  } else if (type === Color) {
    return ColorAttributeAnimator;
  } else if (type === Transform) {
    return TransformAttributeAnimator;
  }
  return null;
};

AttributeAnimator.define = function <V extends ElementView, T, U, I>(descriptor: AttributeAnimatorDescriptor<V, T, U, I>): AttributeAnimatorConstructor<V, T, U, I> {
  let _super: AttributeAnimatorClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const look = descriptor.look;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;

  if (_super === void 0) {
    _super = AttributeAnimator.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = AttributeAnimator;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedAttributeAnimator(this: AttributeAnimator<V, T, U>, owner: V, animatorName: string): AttributeAnimator<V, T, U> {
    let _this: AttributeAnimator<V, T, U> = function AttributeAnimatorAccessor(state?: T | U, timing?: AnyTiming | boolean): T | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(state!, timing);
        return _this.owner;
      }
    } as AttributeAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, animatorName) || _this;
    return _this;
  } as unknown as AttributeAnimatorConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as AttributeAnimator<any, any> & I;
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

  return _constructor;
};
