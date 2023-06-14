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
import type {FastenerOwner} from "@swim/component";
import type {CssScopeDescriptor} from "./CssScope";
import type {CssScopeClass} from "./CssScope";
import {CssScope} from "./CssScope";

/** @public */
export type CssRuleDecorator<F extends CssRule<any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;
};

/** @public */
export interface CssRuleDescriptor<S extends CSSRule = CSSRule> extends CssScopeDescriptor<S> {
  extends?: Proto<CssRule<any>> | boolean | null;
  selector?: string;
  cssText?: string;
}

/** @public */
export type CssRuleTemplate<F extends CssRule<any>> =
  ThisType<F> &
  CssRuleDescriptor &
  Partial<Omit<F, keyof CssRuleDescriptor>>;

/** @public */
export interface CssRuleClass<F extends CssRule<any> = CssRule<any>> extends CssScopeClass<F> {
  /** @override */
  specialize(template: CssRuleDescriptor<any>): CssRuleClass<F>;

  /** @override */
  refine(fastenerClass: CssRuleClass<any>): void;

  /** @override */
  extend<F2 extends F>(className: string | symbol, template: CssRuleTemplate<F2>): CssRuleClass<F2>;
  extend<F2 extends F>(className: string | symbol, template: CssRuleTemplate<F2>): CssRuleClass<F2>;

  /** @override */
  define<F2 extends F>(className: string | symbol, template: CssRuleTemplate<F2>): CssRuleClass<F2>;
  define<F2 extends F>(className: string | symbol, template: CssRuleTemplate<F2>): CssRuleClass<F2>;

  /** @override */
  <F2 extends F>(template: CssRuleTemplate<F2>): CssRuleDecorator<F2>;
}

/** @public */
export interface CssRule<O = unknown, S extends CSSRule = CSSRule> extends CssScope<O, S> {
  /** @override */
  get fastenerType(): Proto<CssRule<any>>;

  /** @override */
  transformInletCss(inletCss: CSSStyleSheet | CSSRule): S | null;

  createRule(inletCss: CSSStyleSheet | CSSGroupingRule): S | null;

  get selector(): string;

  get cssText(): string;
}

/** @public */
export const CssRule = (function (_super: typeof CssScope) {
  const CssRule = _super.extend("CssRule", {}) as CssRuleClass;

  Object.defineProperty(CssRule.prototype, "fastenerType", {
    value: CssRule,
    enumerable: true,
    configurable: true,
  });

  CssRule.prototype.transformInletCss = function <S extends CSSRule>(this: CssRule<unknown, S>, inletCss: CSSStyleSheet | CSSRule): S | null {
    if (inletCss instanceof CSSStyleSheet || inletCss instanceof CSSGroupingRule) {
      return this.createRule(inletCss);
    }
    return null;
  };

  CssRule.prototype.createRule = function <S extends CSSRule>(this: CssRule<unknown, S>, inletCss: CSSStyleSheet | CSSGroupingRule): S | null {
    const index = inletCss.insertRule(this.cssText);
    return inletCss.cssRules.item(index) as S;
  };

  Object.defineProperty(CssRule.prototype, "selector", {
    value: "*",
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(CssRule.prototype, "cssText", {
    get<S extends CSSRule>(this: CssRule<unknown, S>): string {
      return this.selector + " {}";
    },
    enumerable: true,
    configurable: true,
  });

  CssRule.construct = function <F extends CssRule<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    return fastener;
  };

  return CssRule;
})(CssScope);
