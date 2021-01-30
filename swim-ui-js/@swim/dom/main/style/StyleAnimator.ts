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
import {AnyLineHeight, LineHeight, FontFamily, AnyBoxShadow, BoxShadow} from "@swim/style";
import {StyleContext} from "./StyleContext";
import {StringStyleAnimator} from "../"; // forward import
import {NumberStyleAnimator} from "../"; // forward import
import {LengthStyleAnimator} from "../"; // forward import
import {ColorStyleAnimator} from "../"; // forward import
import {LineHeightStyleAnimator} from "../"; // forward import
import {FontFamilyStyleAnimator} from "../"; // forward import
import {TransformStyleAnimator} from "../"; // forward import
import {BoxShadowStyleAnimator} from "../"; // forward import
import {NumberOrStringStyleAnimator} from "../"; // forward import
import {LengthOrStringStyleAnimator} from "../"; // forward import
import {ColorOrStringStyleAnimator} from "../"; // forward import

export type StyleAnimatorMemberType<V, K extends keyof V> =
  V extends {[P in K]: StyleAnimator<any, infer T, any>} ? T : unknown;

export type StyleAnimatorMemberInit<V, K extends keyof V> =
  V extends {[P in K]: StyleAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface StyleAnimatorInit<T, U = never> {
  propertyNames: string | ReadonlyArray<string>;
  extends?: StyleAnimatorClass;
  type?: unknown;

  updateFlags?: number;
  willUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  onUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  didUpdate?(newValue: T | undefined, oldValue: T | undefined): void;
  onBegin?(value: T): void;
  onEnd?(value: T): void;
  onInterrupt?(value: T): void;
  parse?(value: string): T | undefined;
  fromCssValue?(value: CSSStyleValue): T | undefined;
  fromAny?(value: T | U): T | undefined;
}

export type StyleAnimatorDescriptor<V extends StyleContext, T, U = never, I = {}> = StyleAnimatorInit<T, U> & ThisType<StyleAnimator<V, T, U> & I> & I;

export type StyleAnimatorDescriptorExtends<V extends StyleContext, T, U = never, I = {}> = {extends: StyleAnimatorClass | undefined} & StyleAnimatorDescriptor<V, T, U, I>;

export type StyleAnimatorDescriptorFromAny<V extends StyleContext, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T | undefined}) & StyleAnimatorDescriptor<V, T, U, I>;

export interface StyleAnimatorConstructor<V extends StyleContext, T, U = never, I = {}> {
  new(owner: V, animatorName: string): StyleAnimator<V, T, U> & I;
  prototype: StyleAnimator<any, any> & I;
}

export interface StyleAnimatorClass extends Function {
  readonly prototype: StyleAnimator<any, any>;
}

export interface StyleAnimator<V extends StyleContext, T, U = never> extends TweenAnimator<T | undefined> {
  (): T | undefined;
  (state: T | U | undefined, tween?: Tween<T>, priority?: string): V;

  readonly name: string;

  readonly owner: V;

  readonly node: Node | undefined;

  readonly propertyNames: string | ReadonlyArray<string>;

  readonly propertyValue: T | undefined;

  readonly priority: string | undefined;

  updateFlags?: number;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getValue(): T;

  getState(): T;

  getValueOr<E>(elseValue: E): T | E;

  getStateOr<E>(elseState: E): T | E;

  setState(state: T | U | undefined, tween?: Tween<T>, priority?: string): void;

  setAutoState(state: T | U | undefined, tween?: Tween<T>, priority?: string): void;

  onUpdate(newValue: T | undefined, oldValue: T | undefined): void;

  animate(animator?: Animator): void;

  parse(value: string): T | undefined;

  fromCssValue(value: CSSStyleValue): T | undefined;

  fromAny(value: T | U): T | undefined;
}

export const StyleAnimator = function <V extends StyleContext, T, U>(
    this: StyleAnimator<V, T, U> | typeof StyleAnimator,
    owner: V | StyleAnimatorDescriptor<V, T, U>,
    animatorName?: string,
  ): StyleAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof StyleAnimator) { // constructor
    return StyleAnimatorConstructor.call(this as StyleAnimator<V, unknown, unknown>, owner as V, animatorName!);
  } else { // decorator factory
    return StyleAnimatorDecoratorFactory(owner as StyleAnimatorDescriptor<V, T, U>);
  }
} as {
  /** @hidden */
  new<V extends StyleContext, T, U = never>(owner: V, animatorName: string): StyleAnimator<V, T, U>;

  <V extends StyleContext, T extends LineHeight | undefined = LineHeight | undefined, U extends AnyLineHeight | undefined = AnyLineHeight | undefined>(descriptor: {type: typeof LineHeight} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends Length | undefined = Length | undefined, U extends AnyLength | undefined = AnyLength | undefined>(descriptor: {type: typeof Length} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends Color | undefined = Color | undefined, U extends AnyColor | undefined = AnyColor | undefined>(descriptor: {type: typeof Color} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends BoxShadow | undefined = BoxShadow | undefined, U extends AnyBoxShadow | undefined = AnyBoxShadow | undefined>(descriptor: {type: typeof BoxShadow} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends Transform | undefined = Transform | undefined, U extends AnyTransform | undefined = AnyTransform | undefined>(descriptor: {type: typeof Transform} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends FontFamily | ReadonlyArray<FontFamily> | undefined = FontFamily | ReadonlyArray<FontFamily> | undefined, U extends FontFamily | ReadonlyArray<FontFamily> | undefined = FontFamily | ReadonlyArray<FontFamily> | undefined>(descriptor: {type: typeof FontFamily} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends Length | string | undefined = Length | string | undefined, U extends AnyLength | string | undefined = AnyLength | string | undefined>(descriptor: {type: [typeof Length, typeof String]} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends Color | string | undefined = Color | string | undefined, U extends AnyColor | string | undefined = AnyColor | string | undefined>(descriptor: {type: [typeof Color, typeof String]} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T extends number | string | undefined = number | string | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: [typeof Number, typeof String]} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T, U = never>(descriptor: StyleAnimatorDescriptorFromAny<V, T, U>): PropertyDecorator;
  <V extends StyleContext, T, U = never, I = {}>(descriptor: StyleAnimatorDescriptorExtends<V, T, U, I>): PropertyDecorator;
  <V extends StyleContext, T, U = never>(descriptor: StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: StyleAnimator<any, any>;

  /** @hidden */
  getClass(type: unknown): StyleAnimatorClass | null;

  define<V extends StyleContext, T, U = never, I = {}>(descriptor: StyleAnimatorDescriptorExtends<V, T, U, I>): StyleAnimatorConstructor<V, T, U, I>;
  define<V extends StyleContext, T, U = never>(descriptor: StyleAnimatorDescriptor<V, T, U>): StyleAnimatorConstructor<V, T, U>;
};
__extends(StyleAnimator, TweenAnimator);

function StyleAnimatorConstructor<V extends StyleContext, T, U>(this: StyleAnimator<V, T, U>, owner: V, animatorName: string): StyleAnimator<V, T, U> {
  const _this: StyleAnimator<V, T, U> = (TweenAnimator as Function).call(this, void 0, null) || this;
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
  Object.defineProperty(_this, "priority", {
    value: void 0,
    enumerable: true,
  });
  return _this;
}

function StyleAnimatorDecoratorFactory<V extends StyleContext, T, U>(descriptor: StyleAnimatorDescriptor<V, T, U>): PropertyDecorator {
  return StyleContext.decorateStyleAnimator.bind(StyleContext, StyleAnimator.define(descriptor as StyleAnimatorDescriptor<StyleContext, unknown>));
}

Object.defineProperty(StyleAnimator.prototype, "node", {
  get: function (this: StyleAnimator<StyleContext, unknown>): Node | undefined {
    return this.owner.node;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(StyleAnimator.prototype, "propertyValue", {
  get: function <T>(this: StyleAnimator<StyleContext, T>): T | undefined {
    let propertyValue: T | undefined;
    let value = this.owner.getStyle(this.propertyNames);
    if (typeof CSSStyleValue !== "undefined" && value instanceof CSSStyleValue) { // CSS Typed OM support
      try {
        propertyValue = this.fromCssValue(value);
      } catch (e) {
        // swallow decode errors
      }
      if (propertyValue === void 0) {
        value = value.toString();
      }
    }
    if (typeof value === "string" && value !== "") {
      try {
        propertyValue = this.parse(value);
      } catch (e) {
        // swallow parse errors
      }
    }
    return propertyValue;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(StyleAnimator.prototype, "value", {
  get: function <T>(this: StyleAnimator<StyleContext, T>): T | undefined {
    let value = this._value;
    if (value === void 0) {
      value = this.propertyValue;
      if (value !== void 0) {
        this.setAuto(false);
      }
    }
    return value;
  },
  enumerable: true,
  configurable: true,
});

StyleAnimator.prototype.isAuto = function (this: StyleAnimator<StyleContext, unknown>): boolean {
  return (this.animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

StyleAnimator.prototype.setAuto = function (this: StyleAnimator<StyleContext, unknown>, auto: boolean): void {
  if (auto && (this.animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this.setAnimatorFlags(this.animatorFlags & ~TweenAnimator.OverrideFlag);
  } else if (!auto && (this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
  }
};

StyleAnimator.prototype.getValue = function <T>(this: StyleAnimator<StyleContext, T>): T {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError("undefined " + this.name + " value");
  }
  return value;
};

StyleAnimator.prototype.getState = function <T>(this: StyleAnimator<StyleContext, T>): T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state;
};

StyleAnimator.prototype.getValueOr = function <T, E>(this: StyleAnimator<StyleContext, T>, elseValue: E): T | E {
  let value: T | E | undefined = this.value;
  if (value === void 0) {
    value = elseValue;
  }
  return value;
};

StyleAnimator.prototype.getStateOr = function <T, E>(this: StyleAnimator<StyleContext, T>, elseState: E): T | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState
  }
  return state;
};

StyleAnimator.prototype.setState = function <T, U>(this: StyleAnimator<StyleContext, T, U>, state: T | U | undefined, tween?: Tween<T>, priority?: string): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  if (arguments.length >= 3) {
    Object.defineProperty(this, "priority", {
      value: priority,
      enumerable: true,
    });
  }
  this.setAnimatorFlags(this.animatorFlags | TweenAnimator.OverrideFlag);
  TweenAnimator.prototype.setState.call(this, state, tween);
};

StyleAnimator.prototype.setAutoState = function <T, U>(this: StyleAnimator<StyleContext, T, U>, state: T | U | undefined, tween?: Tween<T>, priority?: string): void {
  if ((this.animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    if (arguments.length >= 3) {
      Object.defineProperty(this, "priority", {
        value: priority,
        enumerable: true,
      });
    }
    TweenAnimator.prototype.setState.call(this, state, tween);
  }
};

StyleAnimator.prototype.onUpdate = function <T>(this: StyleAnimator<StyleContext, T>, newValue: T | undefined, oldValue: T | undefined): void {
  const propertyNames = this.propertyNames;
  if (typeof propertyNames === "string") {
    this.owner.setStyle(propertyNames, newValue, this.priority);
  } else {
    for (let i = 0, n = propertyNames.length; i < n; i += 1) {
      this.owner.setStyle(propertyNames[i]!, newValue, this.priority);
    }
  }
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

StyleAnimator.prototype.animate = function (this: StyleAnimator<StyleContext, unknown>, animator?: Animator): void {
  this.owner.animate(animator !== void 0 ? animator : this);
};

StyleAnimator.prototype.parse = function <T>(this: StyleAnimator<StyleContext, T>, value: string): T | undefined {
  return void 0;
};

StyleAnimator.prototype.fromCssValue = function <T>(this: StyleAnimator<StyleContext, T>, value: CSSStyleValue): T | undefined {
  return void 0;
};

StyleAnimator.prototype.fromAny = function <T, U>(this: StyleAnimator<StyleContext, T, U>, value: T | U): T | undefined {
  return void 0;
};

StyleAnimator.getClass = function (type: unknown): StyleAnimatorClass | null {
  if (type === String) {
    return StringStyleAnimator;
  } else if (type === Number) {
    return NumberStyleAnimator;
  } else if (type === Length) {
    return LengthStyleAnimator;
  } else if (type === Color) {
    return ColorStyleAnimator;
  } else if (type === LineHeight) {
    return LineHeightStyleAnimator;
  } else if (type === FontFamily) {
    return FontFamilyStyleAnimator;
  } else if (type === BoxShadow) {
    return BoxShadowStyleAnimator;
  } else if (type === Transform) {
    return TransformStyleAnimator;
  } else if (Array.isArray(type) && type.length === 2) {
    const [type0, type1] = type;
    if (type0 === Number && type1 === String) {
      return NumberOrStringStyleAnimator;
    } else if (type0 === Length && type1 === String) {
      return LengthOrStringStyleAnimator;
    } else if (type0 === Color && type1 === String) {
      return ColorOrStringStyleAnimator;
    }
  }
  return null;
};

StyleAnimator.define = function <V extends StyleContext, T, U, I>(descriptor: StyleAnimatorDescriptor<V, T, U, I>): StyleAnimatorConstructor<V, T, U, I> {
  let _super: StyleAnimatorClass | null | undefined = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = StyleAnimator.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = StyleAnimator;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedStyleAnimator(this: StyleAnimator<V, T, U>, owner: V, animatorName: string): StyleAnimator<V, T, U> {
    let _this: StyleAnimator<V, T, U> = function StyleAnimatorAccessor(state?: T | U, tween?: Tween<T>, priority?: string): T | undefined | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(state, tween, priority);
        return _this.owner;
      }
    } as StyleAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, animatorName) || _this;
    return _this;
  } as unknown as StyleAnimatorConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as StyleAnimator<V, T, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  return _constructor;
};
