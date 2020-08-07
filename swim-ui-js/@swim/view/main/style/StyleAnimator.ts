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
import {AnyLineHeight, LineHeight, FontFamily} from "@swim/font";
import {AnyBoxShadow, BoxShadow} from "@swim/shadow";
import {AnyTransform, Transform} from "@swim/transform";
import {Tween} from "@swim/transition";
import {StyledElement} from "@swim/style";
import {Animator, TweenAnimator} from "@swim/animate";
import {StringStyleAnimator} from "./StringStyleAnimator";
import {NumberStyleAnimator} from "./NumberStyleAnimator";
import {LengthStyleAnimator} from "./LengthStyleAnimator";
import {ColorStyleAnimator} from "./ColorStyleAnimator";
import {LineHeightStyleAnimator} from "./LineHeightStyleAnimator";
import {FontFamilyStyleAnimator} from "./FontFamilyStyleAnimator";
import {TransformStyleAnimator} from "./TransformStyleAnimator";
import {BoxShadowStyleAnimator} from "./BoxShadowStyleAnimator";
import {NumberOrStringStyleAnimator} from "./NumberOrStringStyleAnimator";
import {LengthOrStringStyleAnimator} from "./LengthOrStringStyleAnimator";
import {ColorOrStringStyleAnimator} from "./ColorOrStringStyleAnimator";
import {ViewFlags} from "../View";
import {ElementView} from "../element/ElementView";

export type StyleAnimatorType<V, K extends keyof V> =
  V extends {[P in K]: StyleAnimator<any, infer T, any>} ? T : unknown;

export type StyleAnimatorInitType<V, K extends keyof V> =
  V extends {[P in K]: StyleAnimator<any, infer T, infer U>} ? T | U : unknown;

export interface StyleAnimatorInit<V extends ElementView, T, U = T> {
  propertyNames: string | ReadonlyArray<string>;
  type?: unknown;

  updateFlags?: ViewFlags;
  parse?(value: string): T
  fromAny?(value: T | U): T;

  extends?: StyleAnimatorPrototype<T, U>;
}

export type StyleAnimatorDescriptor<V extends ElementView, T, U = T> = StyleAnimatorInit<V, T, U> & ThisType<StyleAnimator<V, T, U>>;

export type StyleAnimatorPrototype<T, U = T> = Function & { prototype: StyleAnimator<ElementView, T, U> };

export type StyleAnimatorConstructor<T, U = T> = new <V extends ElementView>(view: V, animatorName: string) => StyleAnimator<V, T, U>;

export declare abstract class StyleAnimator<V extends ElementView, T, U = T> {
  /** @hidden */
  _view: V;
  /** @hidden */
  _priority: string | undefined;

  constructor(view: V, animatorName: string);

  get view(): V;

  get name(): string;

  get node(): StyledElement;

  abstract readonly propertyNames: string | ReadonlyArray<string>;

  get propertyValue(): T | undefined;

  get priority(): string | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getValue(): T;

  getState(): T;

  getValueOr<E>(elseValue: E): T | E;

  getStateOr<E>(elseState: E): T | E;

  setState(state: T | U | undefined, tween?: Tween<T>, priority?: string): void;

  setAutoState(state: T | U | undefined, tween?: Tween<T>, priority?: string): void;

  animate(animator?: Animator): void;

  updateFlags?: ViewFlags;

  cancel(): void;

  delete(): void;

  abstract parse(value: string): T;

  abstract fromAny(value: T | U): T;

  /** @hidden */
  static constructorForType(type: unknown): StyleAnimatorPrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static String: typeof StringStyleAnimator; // defined by StringStyleAnimator
  /** @hidden */
  static Number: typeof NumberStyleAnimator; // defined by NumberStyleAnimator
  /** @hidden */
  static Length: typeof LengthStyleAnimator; // defined by LengthStyleAnimator
  /** @hidden */
  static Color: typeof ColorStyleAnimator; // defined by ColorStyleAnimator
  /** @hidden */
  static LineHeight: typeof LineHeightStyleAnimator; // defined by LineHeightStyleAnimator
  /** @hidden */
  static FontFamily: typeof FontFamilyStyleAnimator; // defined by FontFamilyStyleAnimator
  /** @hidden */
  static BoxShadow: typeof BoxShadowStyleAnimator; // defined by BoxShadowStyleAnimator
  /** @hidden */
  static Transform: typeof TransformStyleAnimator; // defined by TransformStyleAnimator
  /** @hidden */
  static NumberOrString: typeof NumberOrStringStyleAnimator; // defined by NumberOrStringStyleAnimator
  /** @hidden */
  static LengthOrString: typeof LengthOrStringStyleAnimator; // defined by LengthOrStringStyleAnimator
  /** @hidden */
  static ColorOrString: typeof ColorOrStringStyleAnimator; // defined by ColorOrStringStyleAnimator
}

export interface StyleAnimator<V extends ElementView, T, U = T> extends TweenAnimator<T> {
  (): T | undefined;
  (value: T | U | undefined, tween?: Tween<T>, priority?: string): V;
}

export function StyleAnimator<V extends ElementView, T, U = T>(descriptor: {extends: StyleAnimatorPrototype<T, U>} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof String} & StyleAnimatorDescriptor<V, string>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof Number} & StyleAnimatorDescriptor<V, number, number | string>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof Length} & StyleAnimatorDescriptor<V, Length, AnyLength>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof Color} & StyleAnimatorDescriptor<V, Color, AnyColor>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof LineHeight} & StyleAnimatorDescriptor<V, LineHeight, AnyLineHeight>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof FontFamily} & StyleAnimatorDescriptor<V, FontFamily | FontFamily[], FontFamily | ReadonlyArray<FontFamily>>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof BoxShadow} & StyleAnimatorDescriptor<V, BoxShadow, AnyBoxShadow>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: typeof Transform} & StyleAnimatorDescriptor<V, Transform, AnyTransform>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: [typeof Number, typeof String]} & StyleAnimatorDescriptor<V, number | string>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: [typeof Length, typeof String]} & StyleAnimatorDescriptor<V, Length | string, AnyLength | string>): PropertyDecorator;
export function StyleAnimator<V extends ElementView>(descriptor: {type: [typeof Color, typeof String]} & StyleAnimatorDescriptor<V, Color | string, AnyColor | string>): PropertyDecorator;
export function StyleAnimator<V extends ElementView, T, U = T>(descriptor: {type: FromAny<T, U>} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
export function StyleAnimator<V extends ElementView, T>(descriptor: {type: Function & { prototype: T }} & StyleAnimatorDescriptor<V, T>): PropertyDecorator;

export function StyleAnimator<V extends ElementView, T, U>(
    this: StyleAnimator<V, T, U> | typeof StyleAnimator,
    view: V | StyleAnimatorInit<V, T, U>,
    animatorName?: string,
  ): StyleAnimator<V, T, U> | PropertyDecorator {
  if (this instanceof StyleAnimator) { // constructor
    return StyleAnimatorConstructor.call(this, view as V, animatorName as string);
  } else { // decorator factory
    return StyleAnimatorDecoratorFactory(view as StyleAnimatorInit<V, T, U>);
  }
};
__extends(StyleAnimator, TweenAnimator);

function StyleAnimatorConstructor<V extends ElementView, T, U = T>(this: StyleAnimator<V, T, U>, view: V, animatorName: string): StyleAnimator<V, T, U> {
  const _this: StyleAnimator<V, T, U> = TweenAnimator.call(this, void 0, null) || this;
  Object.defineProperty(_this, "name", {
    value: animatorName,
    enumerable: true,
    configurable: true,
  });
  _this._view = view;
  return _this;
}

function StyleAnimatorDecoratorFactory<V extends ElementView, T, U = T>(descriptor: StyleAnimatorInit<V, T, U>): PropertyDecorator {
  const type = descriptor.type;
  delete descriptor.type;

  let BaseStyleAnimator = descriptor.extends;
  delete descriptor.extends;
  if (BaseStyleAnimator === void 0) {
    BaseStyleAnimator = StyleAnimator.constructorForType(type) as StyleAnimatorPrototype<T, U>;
  }
  if (BaseStyleAnimator === null) {
    BaseStyleAnimator = StyleAnimator;
    if (!("fromAny" in descriptor) && FromAny.is<T, U>(type)) {
      descriptor.fromAny = type.fromAny;
    }
  }

  function DecoratedStyleAnimator(this: StyleAnimator<V, T, U>, view: V, animatorName: string): StyleAnimator<V, T, U> {
    let _this: StyleAnimator<V, T, U> = function accessor(value?: T | U, tween?: Tween<T>, priority?: string): T | undefined | V {
      if (arguments.length === 0) {
        return _this.value;
      } else {
        _this.setState(value, tween, priority);
        return _this._view;
      }
    } as StyleAnimator<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseStyleAnimator!.call(_this, view, animatorName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedStyleAnimator, BaseStyleAnimator);
    DecoratedStyleAnimator.prototype = descriptor as StyleAnimator<V, T, U>;
    DecoratedStyleAnimator.prototype.constructor = DecoratedStyleAnimator;
    Object.setPrototypeOf(DecoratedStyleAnimator.prototype, BaseStyleAnimator.prototype);
  } else {
    __extends(DecoratedStyleAnimator, BaseStyleAnimator);
  }

  return ElementView.decorateStyleAnimator.bind(void 0, DecoratedStyleAnimator);
}

Object.defineProperty(StyleAnimator.prototype, "view", {
  get: function (this: StyleAnimator<ElementView, unknown, unknown>): ElementView {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(StyleAnimator.prototype, "node", {
  get: function (this: StyleAnimator<ElementView, unknown, unknown>): StyledElement {
    return this._view._node;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(StyleAnimator.prototype, "propertyValue", {
  get: function <T, U>(this: StyleAnimator<ElementView, T, U>): T | undefined {
    const value = this._view.getStyle(this.propertyNames);
    if (value !== "") {
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

Object.defineProperty(StyleAnimator.prototype, "priority", {
  get: function (this: StyleAnimator<ElementView, unknown, unknown>): string | undefined {
    return this._priority;
  },
  set: function (this: StyleAnimator<ElementView, unknown, unknown>, value: string | undefined): void {
    this._priority = value;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(StyleAnimator.prototype, "value", {
  get: function <T, U>(this: StyleAnimator<ElementView, T, U>): T | undefined {
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

StyleAnimator.prototype.isAuto = function (this: StyleAnimator<ElementView, unknown, unknown>): boolean {
  return (this._animatorFlags & TweenAnimator.OverrideFlag) === 0;
};

StyleAnimator.prototype.setAuto = function (this: StyleAnimator<ElementView, unknown, unknown>,
                                            auto: boolean): void {
  if (auto && (this._animatorFlags & TweenAnimator.OverrideFlag) !== 0) {
    this._animatorFlags &= ~TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, true);
  } else if (!auto && (this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    this._animatorFlags |= TweenAnimator.OverrideFlag;
    this._view.animatorDidSetAuto(this, false);
  }
};

StyleAnimator.prototype.getValue = function <T, U>(this: StyleAnimator<ElementView, T, U>): T {
  const value = this.value;
  if (value === void 0) {
    throw new TypeError("undefined " + this.name + " value");
  }
  return value;
};

StyleAnimator.prototype.getState = function <T, U>(this: StyleAnimator<ElementView, T, U>): T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state;
};

StyleAnimator.prototype.getValueOr = function <T, U, E>(this: StyleAnimator<ElementView, T, U>,
                                                        elseValue: E): T | E {
  let value: T | E | undefined = this.value;
  if (value === void 0) {
    value = elseValue;
  }
  return value;
};

StyleAnimator.prototype.getStateOr = function <T, U, E>(this: StyleAnimator<ElementView, T, U>,
                                                        elseState: E): T | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState
  }
  return state;
};

StyleAnimator.prototype.setState = function <T, U>(this: StyleAnimator<ElementView, T, U>,
                                                   state: T | U | undefined, tween?: Tween<T>,
                                                   priority?: string): void {
  if (state !== void 0) {
    state = this.fromAny(state);
  }
  if (priority !== void 0) {
    if (priority !== "") {
      this._priority = priority;
    } else if (this._priority !== void 0) {
      this._priority = void 0;
    }
  }
  this._animatorFlags |= TweenAnimator.OverrideFlag;
  TweenAnimator.prototype.setState.call(this, state, tween);
};

StyleAnimator.prototype.setAutoState = function <T, U>(this: StyleAnimator<ElementView, T, U>,
                                                       state: T | U | undefined, tween?: Tween<T>,
                                                       priority?: string): void {
  if ((this._animatorFlags & TweenAnimator.OverrideFlag) === 0) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    if (priority !== void 0) {
      if (priority !== "") {
        this._priority = priority;
      } else if (this._priority !== void 0) {
        this._priority = void 0;
      }
    }
    TweenAnimator.prototype.setState.call(this, state, tween);
  }
};

StyleAnimator.prototype.animate = function <T, U>(this: StyleAnimator<ElementView, T, U>,
                                                  animator: Animator = this): void {
  if (animator !== this || (this._animatorFlags & TweenAnimator.DisabledFlag) === 0) {
    this._view.animate(animator);
  }
};

StyleAnimator.prototype.onUpdate = function <T, U>(this: StyleAnimator<ElementView, T, U>,
                                                   newValue: T | undefined,
                                                   oldValue: T | undefined): void {
  const propertyNames = this.propertyNames;
  if (typeof propertyNames === "string") {
    this._view.setStyle(propertyNames, newValue, this._priority);
  } else {
    for (let i = 0, n = propertyNames.length; i < n; i += 1) {
      this._view.setStyle(propertyNames[i], newValue, this._priority);
    }
  }
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._view.requireUpdate(updateFlags);
  }
};

StyleAnimator.prototype.cancel = function <T, U>(this: StyleAnimator<ElementView, T, U>): void {
  // nop
};

StyleAnimator.prototype.delete = function <T, U>(this: StyleAnimator<ElementView, T, U>): void {
  const propertyNames = this.propertyNames;
  if (typeof propertyNames === "string") {
    this._view.setStyle(propertyNames, void 0);
  } else {
    for (let i = 0, n = propertyNames.length; i < n; i += 1) {
      this._view.setStyle(propertyNames[i], void 0);
    }
  }
};

StyleAnimator.constructorForType = function (type: unknown): StyleAnimatorPrototype<unknown> | null {
  if (type === String) {
    return StyleAnimator.String;
  } else if (type === Number) {
    return StyleAnimator.Number;
  } else if (type === Length) {
    return StyleAnimator.Length;
  } else if (type === Color) {
    return StyleAnimator.Color;
  } else if (type === LineHeight) {
    return StyleAnimator.LineHeight;
  } else if (type === FontFamily) {
    return StyleAnimator.FontFamily;
  } else if (type === BoxShadow) {
    return StyleAnimator.BoxShadow;
  } else if (type === Transform) {
    return StyleAnimator.Transform;
  } else if (Array.isArray(type) && type.length === 2) {
    const [type0, type1] = type;
    if (type0 === Number && type1 === String) {
      return StyleAnimator.NumberOrString;
    } else if (type0 === Length && type1 === String) {
      return StyleAnimator.LengthOrString;
    } else if (type0 === Color && type1 === String) {
      return StyleAnimator.ColorOrString;
    }
  }
  return null;
}
