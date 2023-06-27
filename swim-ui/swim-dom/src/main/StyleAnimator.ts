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

import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import type {LengthUnits} from "@swim/math";
import type {LengthBasis} from "@swim/math";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import {PxLength} from "@swim/math";
import {EmLength} from "@swim/math";
import {RemLength} from "@swim/math";
import {PctLength} from "@swim/math";
import type {AnyTransform} from "@swim/math";
import {Transform} from "@swim/math";
import {FontFamily} from "@swim/style";
import {Font} from "@swim/style";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {AnyBoxShadow} from "@swim/style";
import {BoxShadow} from "@swim/style";
import type {ThemeAnimatorDescriptor} from "@swim/theme";
import type {ThemeAnimatorClass} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import {StyleContext} from "./"; // forward import

/** @public */
export interface StyleAnimatorDescriptor<T = unknown, U = T> extends ThemeAnimatorDescriptor<T, U> {
  extends?: Proto<StyleAnimator<any, any, any>> | boolean | null;
  propertyNames?: string | ReadonlyArray<string>;
}

/** @public */
export interface StyleAnimatorClass<A extends StyleAnimator<any, any, any> = StyleAnimator<any, any, any>> extends ThemeAnimatorClass<A> {
}

/** @public */
export interface StyleAnimator<O = unknown, T = unknown, U = T> extends ThemeAnimator<O, T, U> {
  /** @override */
  get descriptorType(): Proto<StyleAnimatorDescriptor<T, U>>;

  readonly propertyNames: string | ReadonlyArray<string>; // prototype property

  get propertyValue(): T;

  getPropertyValue(): NonNullable<T>;

  get computedValue(): T;

  getComputedValue(): NonNullable<T>;

  get cssValue(): T;

  getCssValue(): NonNullable<T>;

  get cssState(): T;

  getCssState(): NonNullable<T>;

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  initPriority(): string | undefined;

  readonly priority: string | undefined;

  setPriority(priority: string | undefined): void;

  /** @internal */
  applyStyle(value: T, priority: string | undefined): void;

  parse(value: string): T;

  fromCssValue(value: CSSStyleValue): T;
}

/** @public */
export const StyleAnimator = (function (_super: typeof ThemeAnimator) {
  const StyleAnimator = _super.extend("StyleAnimator", {}) as StyleAnimatorClass;

  Object.defineProperty(StyleAnimator.prototype, "propertyValue", {
    get: function <T>(this: StyleAnimator<unknown, T>): T {
      const styleContext = this.owner;
      if (StyleContext.is(styleContext)) {
        let value: T | CSSStyleValue | string | undefined = styleContext.getStyle(this.propertyNames);
        if (typeof CSSStyleValue !== "undefined" && value instanceof CSSStyleValue) { // CSS Typed OM support
          try {
            value = this.fromCssValue(value);
          } catch (e) {
            value = "" + value; // coerce to string on decode error
          }
        }
        if (typeof value === "string" && value.length !== 0) {
          try {
            return this.parse(value);
          } catch (e) {
            // swallow parse errors
          }
        }
      }
      return (Object.getPrototypeOf(this) as StyleAnimator<unknown, T>).value;
    },
    configurable: true,
  });

  StyleAnimator.prototype.getPropertyValue = function <T>(this: StyleAnimator<unknown, T>): NonNullable<T> {
    const propertyValue = this.propertyValue;
    if (propertyValue === void 0 || propertyValue === null) {
      let message = propertyValue + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "property value";
      throw new TypeError(message);
    }
    return propertyValue as NonNullable<T>;
  };

  Object.defineProperty(StyleAnimator.prototype, "computedValue", {
    get: function <T>(this: StyleAnimator<unknown, T>): T {
      let computedValue: T | undefined;
      const node = StyleContext.is(this.owner) ? this.owner.node : void 0;
      if (node instanceof Element) {
        const styles = getComputedStyle(node);
        const propertyNames = this.propertyNames;
        let propertyValue = "";
        if (typeof propertyNames === "string") {
          propertyValue = styles.getPropertyValue(propertyNames);
        } else {
          for (let i = 0, n = propertyNames.length; i < n && propertyValue.length === 0; i += 1) {
            propertyValue = styles.getPropertyValue(propertyNames[i]!);
          }
        }
        if (propertyValue.length !== 0) {
          try {
            computedValue = this.parse(propertyValue);
          } catch (e) {
            // swallow parse errors
          }
        }
      }
      if (computedValue === void 0) {
        computedValue = (Object.getPrototypeOf(this) as StyleAnimator<unknown, T>).value;
      }
      return computedValue;
    },
    configurable: true,
  });

  StyleAnimator.prototype.getComputedValue = function <T>(this: StyleAnimator<unknown, T>): NonNullable<T> {
    const computedValue = this.computedValue;
    if (computedValue === void 0 || computedValue === null) {
      let message = computedValue + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "computed value";
      throw new TypeError(message);
    }
    return computedValue as NonNullable<T>;
  };

  Object.defineProperty(StyleAnimator.prototype, "cssValue", {
    get<T>(this: StyleAnimator<unknown, T>): T {
      let value = this.value;
      if (!this.definedValue(value)) {
        value = this.computedValue;
      }
      return value;
    },
    configurable: true,
  });

  StyleAnimator.prototype.getCssValue = function <T>(this: StyleAnimator<unknown, T>): NonNullable<T> {
    const cssValue = this.cssValue;
    if (cssValue === void 0 || cssValue === null) {
      let message = cssValue + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "css value";
      throw new TypeError(message);
    }
    return cssValue as NonNullable<T>;
  };

  Object.defineProperty(StyleAnimator.prototype, "cssState", {
    get<T>(this: StyleAnimator<unknown, T>): T {
      let state = this.state;
      if (!this.definedValue(state)) {
        state = this.computedValue;
      }
      return state;
    },
    configurable: true,
  });

  StyleAnimator.prototype.getCssState = function <T>(this: StyleAnimator<unknown, T>): NonNullable<T> {
    const cssState = this.cssState;
    if (cssState === void 0 || cssState === null) {
      let message = cssState + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "css state";
      throw new TypeError(message);
    }
    return cssState as NonNullable<T>;
  };

  StyleAnimator.prototype.onSetValue = function <T>(this: StyleAnimator<unknown, T>, newValue: T, oldValue: T): void {
    this.applyStyle(newValue, this.priority);
    _super.prototype.onSetValue.call(this, newValue, oldValue);
  };

  StyleAnimator.prototype.initPriority = function (this: StyleAnimator): string | undefined {
    return (Object.getPrototypeOf(this) as StyleAnimator).priority as string | undefined;
  };

  StyleAnimator.prototype.setPriority = function (this: StyleAnimator, priority: string | undefined): void {
    (this as Mutable<typeof this>).priority = priority;
    this.applyStyle(this.value, priority);
  };

  StyleAnimator.prototype.applyStyle = function <T>(this: StyleAnimator<unknown, T>, value: T, priority: string | undefined): void {
    const styleContext = this.owner;
    if (!StyleContext.is(styleContext)) {
      return;
    }
    const propertyNames = this.propertyNames;
    if (typeof propertyNames === "string") {
      styleContext.setStyle(propertyNames, value, priority);
    } else {
      for (let i = 0, n = propertyNames.length; i < n; i += 1) {
        styleContext.setStyle(propertyNames[i]!, value, priority);
      }
    }
  };

  StyleAnimator.prototype.parse = function <T>(this: StyleAnimator<unknown, T>): T {
    throw new Error();
  };

  StyleAnimator.prototype.fromCssValue = function <T>(this: StyleAnimator<unknown, T>, value: CSSStyleValue): T {
    throw new Error();
  };

  StyleAnimator.construct = function <A extends StyleAnimator<any, any, any>>(animator: A | null, owner: A extends StyleAnimator<infer O, any, any> ? O : never): A {
    animator = _super.construct.call(this, animator, owner) as A;
    (animator as Mutable<typeof animator>).priority = animator.initPriority();
    return animator;
  };

  StyleAnimator.specialize = function (template: StyleAnimatorDescriptor<any, any>): StyleAnimatorClass {
    let superClass = template.extends as StyleAnimatorClass | null | undefined;
    if (superClass === void 0 || superClass === null) {
      const valueType = template.valueType;
      if (valueType === String) {
        superClass = StringStyleAnimator;
      } else if (valueType === Number) {
        superClass = NumberStyleAnimator;
      } else if (valueType === Length) {
        superClass = LengthStyleAnimator;
      } else if (valueType === Color) {
        superClass = ColorStyleAnimator;
      } else if (valueType === FontFamily) {
        superClass = FontFamilyStyleAnimator;
      } else if (valueType === BoxShadow) {
        superClass = BoxShadowStyleAnimator;
      } else if (valueType === Transform) {
        superClass = TransformStyleAnimator;
      } else {
        superClass = this;
      }
    }
    return superClass;
  };

  return StyleAnimator;
})(ThemeAnimator);

/** @internal */
export interface StringStyleAnimator<O = unknown, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const StringStyleAnimator = (function (_super: typeof StyleAnimator) {
  const StringStyleAnimator = _super.extend("StringStyleAnimator", {
    valueType: String,
  }) as StyleAnimatorClass<StringStyleAnimator<any, any, any>>;

  StringStyleAnimator.prototype.equalValues = function (newValue: string | undefined, oldValue: string | undefined): boolean {
    return newValue === oldValue;
  };

  StringStyleAnimator.prototype.parse = function (value: string): string | undefined {
    return value;
  };

  StringStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): string | undefined {
    return value.toString();
  };

  StringStyleAnimator.prototype.fromAny = function (value: string): string | undefined {
    return value;
  };

  return StringStyleAnimator;
})(StyleAnimator);

/** @internal */
export interface NumberStyleAnimator<O = unknown, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | T> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const NumberStyleAnimator = (function (_super: typeof StyleAnimator) {
  const NumberStyleAnimator = _super.extend("NumberStyleAnimator", {
    valueType: Number,
  }) as StyleAnimatorClass<NumberStyleAnimator<any, any, any>>;

  NumberStyleAnimator.prototype.equalValues = function (newValue: number | undefined, oldValue: number | undefined): boolean {
    return newValue === oldValue;
  };

  NumberStyleAnimator.prototype.parse = function (value: string): number | undefined {
    const number = +value;
    return isFinite(number) ? number : void 0;
  };

  NumberStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): number | undefined {
    if (value instanceof CSSNumericValue) {
      return value.to("number").value;
    } else {
      return void 0;
    }
  };

  NumberStyleAnimator.prototype.fromAny = function (value: number | string): number | undefined {
    if (typeof value === "number") {
      return value;
    } else {
      const number = +value;
      return isFinite(number) ? number : void 0;
    }
  };

  return NumberStyleAnimator;
})(StyleAnimator);

/** @public */
export interface LengthStyleAnimator<O = unknown, T extends Length | null = Length | null, U extends AnyLength | null = AnyLength | T> extends StyleAnimator<O, T, U>, LengthBasis {
  get units(): LengthUnits;

  pxValue(basis?: LengthBasis | number, defaultValue?: number): number;

  emValue(basis?: LengthBasis | number, defaultValue?: number): number;

  remValue(basis?: LengthBasis | number, defaultValue?: number): number;

  pctValue(basis?: LengthBasis | number, defaultValue?: number): number;

  pxState(basis?: LengthBasis | number, defaultValue?: number): number;

  emState(basis?: LengthBasis | number, defaultValue?: number): number;

  remState(basis?: LengthBasis | number, defaultValue?: number): number;

  pctState(basis?: LengthBasis | number, defaultValue?: number): number;

  px(basis?: LengthBasis | number, defaultValue?: number): PxLength;

  em(basis?: LengthBasis | number, defaultValue?: number): EmLength;

  rem(basis?: LengthBasis | number, defaultValue?: number): RemLength;

  pct(basis?: LengthBasis | number, defaultValue?: number): PctLength;

  to(units: LengthUnits, basis?: LengthBasis | number, defaultValue?: number): Length;

  /** @override */
  get emUnit(): Node | number | undefined;

  /** @override */
  get remUnit(): number | undefined;

  /** @override */
  get pctUnit(): number | undefined;

  /** @override */
  parse(value: string): T;

  /** @override */
  fromCssValue(value: CSSStyleValue): T;

  /** @override */
  equalValues(newValue: T, oldValue: T | undefined): boolean;

  /** @override */
  fromAny(value: T | U): T;
}

/** @public */
export const LengthStyleAnimator = (function (_super: typeof StyleAnimator) {
  const LengthStyleAnimator = _super.extend("LengthStyleAnimator", {
    valueType: Length,
    value: null,
  }) as StyleAnimatorClass<LengthStyleAnimator<any, any, any>>;

  Object.defineProperty(LengthStyleAnimator.prototype, "units", {
    get(this: LengthStyleAnimator): LengthUnits {
      const value = this.cssValue;
      return value !== null ? value.units : "";
    },
    configurable: true,
  });

  LengthStyleAnimator.prototype.pxValue = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssValue;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.pxValue(basis);
  };

  LengthStyleAnimator.prototype.emValue = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssValue;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.emValue(basis);
  };

  LengthStyleAnimator.prototype.remValue = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssValue;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.remValue(basis);
  };

  LengthStyleAnimator.prototype.pctValue = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssValue;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.pctValue(basis);
  };

  LengthStyleAnimator.prototype.pxState = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssState;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.pxValue(basis);
  };

  LengthStyleAnimator.prototype.emState = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssState;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.emValue(basis);
  };

  LengthStyleAnimator.prototype.remState = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssState;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.remValue(basis);
  };

  LengthStyleAnimator.prototype.pctState = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): number {
    const value = this.cssState;
    if (value === null) {
      return defaultValue !== void 0 ? defaultValue : 0;
    } else if (basis === void 0) {
      basis = this;
    }
    return value.pctValue(basis);
  };

  LengthStyleAnimator.prototype.px = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): PxLength {
    const value = this.cssValue;
    if (value === null) {
      return PxLength.of(defaultValue !== void 0 ? defaultValue : 0);
    } else if (basis === void 0) {
      basis = this;
    }
    return value.px(basis);
  };

  LengthStyleAnimator.prototype.em = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): EmLength {
    const value = this.cssValue;
    if (value === null) {
      return EmLength.of(defaultValue !== void 0 ? defaultValue : 0);
    } else if (basis === void 0) {
      basis = this;
    }
    return value.em(basis);
  };

  LengthStyleAnimator.prototype.rem = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): RemLength {
    const value = this.cssValue;
    if (value === null) {
      return RemLength.of(defaultValue !== void 0 ? defaultValue : 0);
    } else if (basis === void 0) {
      basis = this;
    }
    return value.rem(basis);
  };

  LengthStyleAnimator.prototype.pct = function (this: LengthStyleAnimator, basis?: LengthBasis | number, defaultValue?: number): PctLength {
    const value = this.cssValue;
    if (value === null) {
      return PctLength.of(defaultValue !== void 0 ? defaultValue : 0);
    } else if (basis === void 0) {
      basis = this;
    }
    return value.pct(basis);
  };

  LengthStyleAnimator.prototype.to = function (this: LengthStyleAnimator, units: LengthUnits, basis?: LengthBasis | number, defaultValue?: number): Length {
    const value = this.cssValue;
    if (value === null) {
      return Length.of(defaultValue !== void 0 ? defaultValue : 0, units);
    } else if (basis === void 0) {
      basis = this;
    }
    return value.to(units, basis);
  };

  Object.defineProperty(LengthStyleAnimator.prototype, "emUnit", {
    get(this: LengthStyleAnimator): Node | number | undefined {
      const styleContext = this.owner;
      if (StyleContext.is(styleContext)) {
        const node = styleContext.node;
        if (node !== void 0) {
          return node;
        }
      }
      return 0;
    },
    configurable: true,
  });

  Object.defineProperty(LengthStyleAnimator.prototype, "remUnit", {
    value: 0,
    configurable: true,
  });

  Object.defineProperty(LengthStyleAnimator.prototype, "pctUnit", {
    value: 0,
    configurable: true,
  });

  LengthStyleAnimator.prototype.equalValues = function (newValue: Length | null, oldValue: Length | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  LengthStyleAnimator.prototype.parse = function (value: string): Length | null {
    return Length.parse(value);
  };

  LengthStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): Length | null {
    return Length.fromCssValue(value);
  };

  LengthStyleAnimator.prototype.fromAny = function (value: AnyLength | string): Length | null {
    try {
      return Length.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return LengthStyleAnimator;
})(StyleAnimator);

/** @public */
export interface ColorStyleAnimator<O = unknown, T extends Color | null = Color | null, U extends AnyColor | null = AnyColor | T> extends StyleAnimator<O, T, U> {
}

/** @public */
export const ColorStyleAnimator = (function (_super: typeof StyleAnimator) {
  const ColorStyleAnimator = _super.extend("ColorStyleAnimator", {
    valueType: Color,
    value: null,
  }) as StyleAnimatorClass<ColorStyleAnimator<any, any, any>>;

  ColorStyleAnimator.prototype.equalValues = function (newValue: Color | null, oldValue: Color | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  ColorStyleAnimator.prototype.parse = function (value: string): Color | null {
    return Color.parse(value);
  };

  ColorStyleAnimator.prototype.fromAny = function (value: AnyColor): Color | null {
    try {
      return Color.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return ColorStyleAnimator;
})(StyleAnimator);

/** @internal */
export interface FontFamilyStyleAnimator<O = unknown, T extends FontFamily | ReadonlyArray<FontFamily> | undefined = FontFamily | ReadonlyArray<FontFamily> | undefined, U extends FontFamily | ReadonlyArray<FontFamily> | undefined = T> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const FontFamilyStyleAnimator = (function (_super: typeof StyleAnimator) {
  const FontFamilyStyleAnimator = _super.extend("FontFamilyStyleAnimator", {
    valueType: Font,
  }) as StyleAnimatorClass<FontFamilyStyleAnimator<any, any, any>>;

  FontFamilyStyleAnimator.prototype.parse = function (value: string): FontFamily | ReadonlyArray<FontFamily> | undefined {
    return Font.parse(value).family;
  };

  FontFamilyStyleAnimator.prototype.fromAny = function (value: FontFamily | ReadonlyArray<FontFamily>): FontFamily | ReadonlyArray<FontFamily> | undefined {
    return Font.family(value).family;
  };

  return FontFamilyStyleAnimator;
})(StyleAnimator);

/** @internal */
export interface BoxShadowStyleAnimator<O = unknown, T extends BoxShadow | null = BoxShadow | null, U extends AnyBoxShadow | null = AnyBoxShadow | T> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const BoxShadowStyleAnimator = (function (_super: typeof StyleAnimator) {
  const BoxShadowStyleAnimator = _super.extend("BoxShadowStyleAnimator", {
    valueType: BoxShadow,
    value: null,
  }) as StyleAnimatorClass<BoxShadowStyleAnimator<any, any, any>>;

  BoxShadowStyleAnimator.prototype.equalValues = function (newValue: BoxShadow | null, oldValue: BoxShadow | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  BoxShadowStyleAnimator.prototype.parse = function (value: string): BoxShadow | null {
    return BoxShadow.parse(value);
  };

  BoxShadowStyleAnimator.prototype.fromAny = function (value: AnyBoxShadow): BoxShadow | null {
    return BoxShadow.fromAny(value);
  };

  return BoxShadowStyleAnimator;
})(StyleAnimator);

/** @internal */
export interface TransformStyleAnimator<O = unknown, T extends Transform | null = Transform | null, U extends AnyTransform | null = AnyTransform | T> extends StyleAnimator<O, T, U> {
}

/** @internal */
export const TransformStyleAnimator = (function (_super: typeof StyleAnimator) {
  const TransformStyleAnimator = _super.extend("TransformStyleAnimator", {
    valueType: Transform,
    value: null,
  }) as StyleAnimatorClass<StyleAnimator<any, any, any>>;

  TransformStyleAnimator.prototype.equalValues = function (newValue: Transform | null, oldValue: Transform | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  TransformStyleAnimator.prototype.parse = function (value: string): Transform | null {
    return Transform.parse(value);
  };

  TransformStyleAnimator.prototype.fromCssValue = function (value: CSSStyleValue): Transform | null {
    return Transform.fromCssValue(value);
  };

  TransformStyleAnimator.prototype.fromAny = function (value: AnyTransform): Transform | null {
    try {
      return Transform.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return TransformStyleAnimator;
})(StyleAnimator);
