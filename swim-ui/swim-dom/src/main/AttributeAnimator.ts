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

import type {Proto} from "@swim/util";
import type {FastenerClass} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyTransform} from "@swim/math";
import {Transform} from "@swim/math";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {ThemeAnimatorDescriptor} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import {ElementView} from "./"; // forward import

/** @public */
export interface AttributeAnimatorDescriptor<T = unknown, U = T> extends ThemeAnimatorDescriptor<T, U> {
  extends?: Proto<AttributeAnimator<any, any, any>> | boolean | null;
  attributeName?: string;
}

/** @public */
export interface AttributeAnimator<O = unknown, T = unknown, U = T> extends ThemeAnimator<O, T, U> {
  /** @override */
  get descriptorType(): Proto<AttributeAnimatorDescriptor<T, U>>;

  readonly attributeName: string; // prototype property

  get attributeValue(): T;

  getAttributeValue(): NonNullable<T>;

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  parse(value: string): T;
}

/** @public */
export const AttributeAnimator = (function (_super: typeof ThemeAnimator) {
  const AttributeAnimator = _super.extend("AttributeAnimator", {}) as FastenerClass<AttributeAnimator<any, any, any>>;

  Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
    get: function <T>(this: AttributeAnimator<unknown, T>): T {
      const view = this.owner;
      if (view instanceof ElementView) {
        const value = view.getAttribute(this.attributeName);
        if (value !== null) {
          try {
            return this.parse(value);
          } catch (e) {
            // swallow parse errors
          }
        }
      }
      return (Object.getPrototypeOf(this) as AttributeAnimator<unknown, T>).value;
    },
    configurable: true,
  });

  AttributeAnimator.prototype.getAttributeValue = function <T>(this: AttributeAnimator<unknown, T>): NonNullable<T> {
    const attributeValue = this.attributeValue;
    if (attributeValue === void 0 || attributeValue === null) {
      let message = attributeValue + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "attribute value";
      throw new TypeError(message);
    }
    return attributeValue as NonNullable<T>;
  };

  AttributeAnimator.prototype.onSetValue = function <T>(this: AttributeAnimator<unknown, T>, newValue: T, oldValue: T): void {
    const view = this.owner;
    if (view instanceof ElementView) {
      view.setAttribute(this.attributeName, newValue);
    }
    _super.prototype.onSetValue.call(this, newValue, oldValue);
  };

  AttributeAnimator.prototype.parse = function <T>(this: AttributeAnimator<unknown, T>): T {
    throw new Error();
  };

  AttributeAnimator.specialize = function (template: AttributeAnimatorDescriptor<any, any>): FastenerClass<AttributeAnimator<any, any, any>> {
    let superClass = template.extends as FastenerClass<AttributeAnimator<any, any, any>> | null | undefined;
    if (superClass === void 0 || superClass === null) {
      const valueType = template.valueType;
      if (valueType === String) {
        superClass = StringAttributeAnimator;
      } else if (valueType === Number) {
        superClass = NumberAttributeAnimator;
      } else if (valueType === Boolean) {
        superClass = BooleanAttributeAnimator;
      } else if (valueType === Length) {
        superClass = LengthAttributeAnimator;
      } else if (valueType === Color) {
        superClass = ColorAttributeAnimator;
      } else if (valueType === Transform) {
        superClass = TransformAttributeAnimator;
      } else {
        superClass = this;
      }
    }
    return superClass;
  };

  return AttributeAnimator;
})(ThemeAnimator);

/** @internal */
export interface StringAttributeAnimator<O = unknown, T extends string | undefined = string | undefined, U extends string | undefined = T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const StringAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const StringAttributeAnimator = _super.extend("StringAttributeAnimator", {
    valueType: String,
  }) as FastenerClass<StringAttributeAnimator<any, any, any>>;

  StringAttributeAnimator.prototype.equalValues = function (newValue: string | undefined, oldValue: string | undefined): boolean {
    return newValue === oldValue;
  };

  StringAttributeAnimator.prototype.parse = function (value: string): string | undefined {
    return value;
  };

  StringAttributeAnimator.prototype.fromAny = function (value: string): string | undefined {
    return value;
  };

  return StringAttributeAnimator;
})(AttributeAnimator);

/** @internal */
export interface NumberAttributeAnimator<O = unknown, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const NumberAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const NumberAttributeAnimator = _super.extend("NumberAttributeAnimator", {
    valueType: Number,
  }) as FastenerClass<NumberAttributeAnimator<any, any, any>>;

  NumberAttributeAnimator.prototype.equalValues = function (newValue: number | undefined, oldValue: number | undefined): boolean {
    return newValue === oldValue;
  };

  NumberAttributeAnimator.prototype.parse = function (value: string): number | undefined {
    const number = +value;
    return isFinite(number) ? number : void 0;
  };

  NumberAttributeAnimator.prototype.fromAny = function (value: number | string): number | undefined {
    if (typeof value === "number") {
      return value;
    } else {
      const number = +value;
      return isFinite(number) ? number : void 0;
    }
  };

  return NumberAttributeAnimator;
})(AttributeAnimator);

/** @internal */
export interface BooleanAttributeAnimator<O = unknown, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const BooleanAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const BooleanAttributeAnimator = _super.extend("BooleanAttributeAnimator", {
    valueType: Boolean,
  }) as FastenerClass<BooleanAttributeAnimator<any, any, any>>;

  BooleanAttributeAnimator.prototype.equalValues = function (newValue: boolean | undefined, oldValue: boolean | undefined): boolean {
    return newValue === oldValue;
  };

  BooleanAttributeAnimator.prototype.parse = function (value: string): boolean | undefined {
    return !!value;
  };

  BooleanAttributeAnimator.prototype.fromAny = function (value: boolean | string): boolean | undefined {
    return !!value;
  };

  return BooleanAttributeAnimator;
})(AttributeAnimator);

/** @internal */
export interface LengthAttributeAnimator<O = unknown, T extends Length | null = Length | null, U extends AnyLength | null = AnyLength | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const LengthAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const LengthAttributeAnimator = _super.extend("LengthAttributeAnimator", {
    valueType: Length,
    value: null,
  }) as FastenerClass<LengthAttributeAnimator<any, any, any>>;

  LengthAttributeAnimator.prototype.equalValues = function (newValue: Length | null, oldValue: Length | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  LengthAttributeAnimator.prototype.parse = function (value: string): Length | null {
    return Length.parse(value);
  };

  LengthAttributeAnimator.prototype.fromAny = function (value: AnyLength): Length | null {
    try {
      return Length.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return LengthAttributeAnimator;
})(AttributeAnimator);

/** @internal */
export interface ColorAttributeAnimator<O = unknown, T extends Color | null = Color | null, U extends AnyColor | null = AnyColor | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const ColorAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const ColorAttributeAnimator = _super.extend("ColorAttributeAnimator", {
    valueType: Color,
    value: null,
  }) as FastenerClass<ColorAttributeAnimator<any, any, any>>;

  ColorAttributeAnimator.prototype.equalValues = function (newValue: Color | null, oldValue: Color | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  ColorAttributeAnimator.prototype.parse = function (value: string): Color | null {
    return Color.parse(value);
  };

  ColorAttributeAnimator.prototype.fromAny = function (value: AnyColor): Color | null {
    try {
      return Color.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return ColorAttributeAnimator;
})(AttributeAnimator);

/** @internal */
export interface TransformAttributeAnimator<O = unknown, T extends Transform | null = Transform | null, U extends AnyTransform | null = AnyTransform | T> extends AttributeAnimator<O, T, U> {
}

/** @internal */
export const TransformAttributeAnimator = (function (_super: typeof AttributeAnimator) {
  const TransformAttributeAnimator = _super.extend("TransformAttributeAnimator", {
    valueType: Transform,
    value: null,
  }) as FastenerClass<TransformAttributeAnimator<any, any, any>>;

  TransformAttributeAnimator.prototype.equalValues = function (newValue: Transform | null, oldValue: Transform | null): boolean {
    if (newValue !== void 0 && newValue !== null) {
      return newValue.equals(oldValue);
    } else {
      return newValue === oldValue;
    }
  };

  TransformAttributeAnimator.prototype.parse = function (value: string): Transform | null {
    return Transform.parse(value);
  };

  TransformAttributeAnimator.prototype.fromAny = function (value: AnyTransform): Transform | null {
    try {
      return Transform.fromAny(value);
    } catch (swallow) {
      return null;
    }
  };

  return TransformAttributeAnimator;
})(AttributeAnimator);
