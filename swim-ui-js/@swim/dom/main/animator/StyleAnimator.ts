// Copyright 2015-2021 Swim Inc.
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

import {Mutable, FromAny} from "@swim/util";
import {Affinity, FastenerOwner, FastenerFlags} from "@swim/fastener";
import {AnyLength, Length, AnyTransform, Transform} from "@swim/math";
import {FontFamily, AnyColor, Color, AnyBoxShadow, BoxShadow} from "@swim/style";
import {ThemeAnimatorInit, ThemeAnimator} from "@swim/theme";
import {StringStyleAnimator} from "./"; // forward import
import {NumberStyleAnimator} from "./"; // forward import
import {LengthStyleAnimator} from "./"; // forward import
import {ColorStyleAnimator} from "./"; // forward import
import {FontFamilyStyleAnimator} from "./"; // forward import
import {TransformStyleAnimator} from "./"; // forward import
import {BoxShadowStyleAnimator} from "./"; // forward import
import {StyleContext} from "../"; // forward import

export interface StyleAnimatorInit<T = unknown, U = never> extends ThemeAnimatorInit<T, U> {
  propertyNames: string | ReadonlyArray<string>;

  parse?(value: string): T;
  fromCssValue?(value: CSSStyleValue): T;
}

export type StyleAnimatorDescriptor<V = unknown, T = unknown, U = never, I = {}> = ThisType<StyleAnimator<V, T, U> & I> & StyleAnimatorInit<T, U> & Partial<I>;

export interface StyleAnimatorClass<A extends StyleAnimator<any, any> = StyleAnimator<any, any, any>> {
  /** @internal */
  prototype: A;

  create(owner: FastenerOwner<A>, animatorName: string): A;

  construct(animatorClass: {prototype: A}, animator: A | null, owner: FastenerOwner<A>, animatorName: string): A;

  specialize(type: unknown): StyleAnimatorClass | null;

  extend<I = {}>(classMembers?: Partial<I> | null): StyleAnimatorClass<A> & I;

  define<V, T, U = never>(descriptor: StyleAnimatorDescriptor<V, T, U>): StyleAnimatorClass<StyleAnimator<any, T, U>>;
  define<V, T, U = never, I = {}>(descriptor: StyleAnimatorDescriptor<V, T, U, I>): StyleAnimatorClass<StyleAnimator<any, T, U> & I>;

  <V, T extends Length | null | undefined = Length | null | undefined, U extends AnyLength | null | undefined = AnyLength | null | undefined>(descriptor: {type: typeof Length} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends Color | null | undefined = Color | null | undefined, U extends AnyColor | null | undefined = AnyColor | null | undefined>(descriptor: {type: typeof Color} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends BoxShadow | null | undefined = BoxShadow | null | undefined, U extends AnyBoxShadow | null | undefined = AnyBoxShadow | null | undefined>(descriptor: {type: typeof BoxShadow} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends Transform | null | undefined = Transform | null | undefined, U extends AnyTransform | null | undefined = AnyTransform | null | undefined>(descriptor: {type: typeof Transform} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends FontFamily | ReadonlyArray<FontFamily> | null | undefined = FontFamily | ReadonlyArray<FontFamily> | null | undefined, U extends FontFamily | ReadonlyArray<FontFamily> | null | undefined = FontFamily | ReadonlyArray<FontFamily> | null | undefined>(descriptor: {type: typeof FontFamily} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends string | null | undefined = string | null | undefined, U extends string | null | undefined = string | null | undefined>(descriptor: {type: typeof String} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T extends number | null | undefined = number | null | undefined, U extends number | string | null | undefined = number | string | null | undefined>(descriptor: {type: typeof Number} & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T, U = never>(descriptor: ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T, U = never>(descriptor: StyleAnimatorDescriptor<V, T, U>): PropertyDecorator;
  <V, T, U = never, I = {}>(descriptor: StyleAnimatorDescriptor<V, T, U, I>): PropertyDecorator;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

export interface StyleAnimator<V = unknown, T = unknown, U = never> extends ThemeAnimator<V, T, U> {
  get propertyNames(): string | ReadonlyArray<string>; // prototype property

  get propertyValue(): T | undefined;

  /** @internal */
  readonly ownValue: T;

  get value(): T;
  set value(value: T);

  /** @override @protected */
  onSetValue(newValue: T, oldValue: T): void;

  readonly priority: string | undefined;

  setPriority(priority: string | undefined): void;

  parse(value: string): T;

  fromCssValue(value: CSSStyleValue): T;
}

export const StyleAnimator = (function (_super: typeof ThemeAnimator) {
  const StyleAnimator: StyleAnimatorClass = _super.extend();

  Object.defineProperty(StyleAnimator.prototype, "propertyNames", {
    get(this: StyleAnimator): string | ReadonlyArray<string> {
      throw new Error("no property names");
    },
    configurable: true,
  });

  Object.defineProperty(StyleAnimator.prototype, "propertyValue", {
    get: function <T>(this: StyleAnimator<unknown, T>): T | undefined {
      let propertyValue: T | undefined;
      const styleContext = this.owner;
      if (StyleContext.is(styleContext)) {
        let value = styleContext.getStyle(this.propertyNames);
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
      }
      return propertyValue;
    },
    configurable: true,
  });

  Object.defineProperty(StyleAnimator.prototype, "value", {
    get<T>(this: StyleAnimator<unknown, T>): T {
      let value = this.ownValue;
      if (!this.isDefined(value)) {
        const propertyValue = this.propertyValue;
        if (propertyValue !== void 0) {
          value = propertyValue;
          this.setAffinity(Affinity.Extrinsic);
        }
      }
      return value;
    },
    set<T>(this: StyleAnimator<unknown, T>, value: T): void {
      (this as Mutable<typeof this>).ownValue = value;
    },
    configurable: true,
  });

  StyleAnimator.prototype.onSetValue = function <T>(this: StyleAnimator<unknown, T>, newValue: T, oldValue: T): void {
    const styleContext = this.owner;
    if (StyleContext.is(styleContext)) {
      const propertyNames = this.propertyNames;
      if (typeof propertyNames === "string") {
        styleContext.setStyle(propertyNames, newValue, this.priority);
      } else {
        for (let i = 0, n = propertyNames.length; i < n; i += 1) {
          styleContext.setStyle(propertyNames[i]!, newValue, this.priority);
        }
      }
    }
    _super.prototype.onSetValue.call(this, newValue, oldValue);
  };

  StyleAnimator.prototype.setPriority = function (this: StyleAnimator<unknown, unknown>, priority: string | undefined): void {
    (this as Mutable<typeof this>).priority = priority;
    const styleContext = this.owner;
    const value = this.value;
    if (StyleContext.is(styleContext) && this.isDefined(value)) {
      const propertyNames = this.propertyNames;
      if (typeof propertyNames === "string") {
        styleContext.setStyle(propertyNames, value, priority);
      } else {
        for (let i = 0, n = propertyNames.length; i < n; i += 1) {
          styleContext.setStyle(propertyNames[i]!, value, priority);
        }
      }
    }
  };

  StyleAnimator.prototype.parse = function <T>(this: StyleAnimator<unknown, T>): T {
    throw new Error();
  };

  StyleAnimator.prototype.fromCssValue = function <T>(this: StyleAnimator<unknown, T>, value: CSSStyleValue): T {
    throw new Error();
  };

  StyleAnimator.construct = function <A extends StyleAnimator<any, any, any>>(animatorClass: {prototype: A}, animator: A | null, owner: FastenerOwner<A>, animatorName: string): A {
    animator = _super.construct(animatorClass, animator, owner, animatorName) as A;
    (animator as Mutable<typeof animator>).priority = void 0;
    return animator;
  };

  StyleAnimator.specialize = function (type: unknown): StyleAnimatorClass | null {
    if (type === String) {
      return StringStyleAnimator;
    } else if (type === Number) {
      return NumberStyleAnimator;
    } else if (type === Length) {
      return LengthStyleAnimator;
    } else if (type === Color) {
      return ColorStyleAnimator;
    } else if (type === FontFamily) {
      return FontFamilyStyleAnimator;
    } else if (type === BoxShadow) {
      return BoxShadowStyleAnimator;
    } else if (type === Transform) {
      return TransformStyleAnimator;
    }
    return null;
  };

  StyleAnimator.define = function <V, T, U>(descriptor: StyleAnimatorDescriptor<V, T, U>): StyleAnimatorClass<StyleAnimator<any, T, U>> {
    let superClass = descriptor.extends as StyleAnimatorClass | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    const look = descriptor.look;
    const state = descriptor.state;
    const initState = descriptor.initState;
    delete descriptor.extends;
    delete descriptor.affinity;
    delete descriptor.inherits;
    delete descriptor.look;
    delete descriptor.state;
    delete descriptor.initState;

    if (superClass === void 0 || superClass === null) {
      superClass = this.specialize(descriptor.type);
    }
    if (superClass === null) {
      superClass = this;
      if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
        descriptor.fromAny = descriptor.type.fromAny;
      }
    }

    const animatorClass = superClass.extend(descriptor);

    animatorClass.construct = function (animatorClass: {prototype: StyleAnimator<any, any, any>}, animator: StyleAnimator<V, T, U> | null, owner: V, animatorName: string): StyleAnimator<V, T, U> {
      animator = superClass!.construct(animatorClass, animator, owner, animatorName);
      if (affinity !== void 0) {
        animator.initAffinity(affinity);
      }
      if (inherits !== void 0) {
        animator.initInherits(inherits);
      }
      if (look !== void 0) {
        (animator as Mutable<typeof animator>).look = look;
      }
      if (initState !== void 0) {
        (animator as Mutable<typeof animator>).state = animator.fromAny(initState());
        (animator as Mutable<typeof animator>).value = animator.state;
      } else if (state !== void 0) {
        (animator as Mutable<typeof animator>).state = animator.fromAny(state);
        (animator as Mutable<typeof animator>).value = animator.state;
      }
      return animator;
    };

    return animatorClass;
  };

  return StyleAnimator;
})(ThemeAnimator);
