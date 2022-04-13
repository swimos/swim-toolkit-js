// Copyright 2015-2022 Swim.inc
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

import type {Mutable, Proto} from "@swim/util";
import {Affinity, AnimatorValue, AnimatorValueInit} from "@swim/component";
import {Length, Transform} from "@swim/math";
import {Color} from "@swim/style";
import {
  ThemeAnimatorRefinement,
  ThemeAnimatorTemplate,
  ThemeAnimatorClass,
  ThemeAnimator,
} from "@swim/theme";
import {StringAttributeAnimator} from "./"; // forward import
import {NumberAttributeAnimator} from "./"; // forward import
import {BooleanAttributeAnimator} from "./"; // forward import
import {LengthAttributeAnimator} from "./"; // forward import
import {ColorAttributeAnimator} from "./"; // forward import
import {TransformAttributeAnimator} from "./"; // forward import
import {ElementView} from "../"; // forward import

/** @public */
export interface AttributeAnimatorRefinement extends ThemeAnimatorRefinement {
}

/** @public */
export interface AttributeAnimatorTemplate<T = unknown, U = T> extends ThemeAnimatorTemplate<T, U> {
  extends?: Proto<AttributeAnimator<any, any, any>> | string | boolean | null;
  attributeName?: string;
}

/** @public */
export interface AttributeAnimatorClass<A extends AttributeAnimator<any, any, any> = AttributeAnimator<any, any, any>> extends ThemeAnimatorClass<A> {
  /** @override */
  specialize(className: string, template: AttributeAnimatorTemplate): AttributeAnimatorClass;

  /** @override */
  extend(className: string, template: AttributeAnimatorTemplate): AttributeAnimatorClass<A>;

  /** @override */
  specify<O, T = unknown, U = T>(className: string, template: ThisType<AttributeAnimator<O, T, U>> & AttributeAnimatorTemplate<T, U> & Partial<Omit<AttributeAnimator<O, T, U>, keyof AttributeAnimatorTemplate>>): AttributeAnimatorClass<A>;

  /** @override */
  <O, T = unknown, U = T>(template: ThisType<AttributeAnimator<O, T, U>> & AttributeAnimatorTemplate<T, U> & Partial<Omit<AttributeAnimator<O, T, U>, keyof AttributeAnimatorTemplate>>): PropertyDecorator;
}

/** @public */
export type AttributeAnimatorDef<O, R extends AttributeAnimatorRefinement> =
  AttributeAnimator<O, AnimatorValue<R>, AnimatorValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function AttributeAnimatorDef<A extends AttributeAnimator<any, any, any>>(
  template: A extends AttributeAnimatorDef<infer O, infer R>
          ? ThisType<AttributeAnimatorDef<O, R>>
          & AttributeAnimatorTemplate<AnimatorValue<R>, AnimatorValueInit<R>>
          & Partial<Omit<AttributeAnimator<O, AnimatorValue<R>, AnimatorValueInit<R>>, keyof AttributeAnimatorTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof AttributeAnimatorTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return AttributeAnimator(template);
}

/** @public */
export interface AttributeAnimator<O = unknown, T = unknown, U = T> extends ThemeAnimator<O, T, U> {
  readonly attributeName: string; // prototype property

  get attributeValue(): T | undefined;

  /** @internal */
  readonly ownValue: T;

  get value(): T;
  set value(value: T);

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  parse(value: string): T;
}

/** @public */
export const AttributeAnimator = (function (_super: typeof ThemeAnimator) {
  const AttributeAnimator = _super.extend("AttributeAnimator", {}) as AttributeAnimatorClass;

  Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
    get: function <T>(this: AttributeAnimator<unknown, T>): T | undefined {
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
      return void 0;
    },
    configurable: true,
  });

  Object.defineProperty(AttributeAnimator.prototype, "value", {
    get<T>(this: AttributeAnimator<unknown, T>): T {
      let value = this.ownValue;
      if (!this.definedValue(value)) {
        const attributeValue = this.attributeValue;
        if (attributeValue !== void 0) {
          value = attributeValue;
          this.setAffinity(Affinity.Extrinsic);
        }
      }
      return value;
    },
    set<T>(this: AttributeAnimator<unknown, T>, value: T): void {
      (this as Mutable<typeof this>).ownValue = value;
    },
    configurable: true,
  });

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

  AttributeAnimator.specialize = function (className: string, template: AttributeAnimatorTemplate): AttributeAnimatorClass {
    let superClass = template.extends as AttributeAnimatorClass | null | undefined;
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
    return superClass
  };

  return AttributeAnimator;
})(ThemeAnimator);
