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
import type {CssScopeDescriptor} from "./CssScope";
import {CssScope} from "./CssScope";

/** @public */
export interface CssRuleDescriptor<S extends CSSRule = CSSRule> extends CssScopeDescriptor<S> {
  extends?: Proto<CssRule<any>> | boolean | null;
  selector?: string;
  cssText?: string;
}

/** @public */
export interface CssRule<O = unknown, S extends CSSRule = CSSRule> extends CssScope<O, S> {
  /** @override */
  get descriptorType(): Proto<CssRuleDescriptor>;

  /** @override */
  get fastenerType(): Proto<CssRule<any>>;

  /** @override */
  transformInletCss(inletCss: CSSStyleSheet | CSSRule | null): S | null;

  createRule(inletCss: CSSStyleSheet | CSSGroupingRule): S | null;

  get selector(): string;

  get cssText(): string;
}

/** @public */
export const CssRule = (function (_super: typeof CssScope) {
  const CssRule = _super.extend("CssRule", {}) as FastenerClass<CssRule<any>>;

  Object.defineProperty(CssRule.prototype, "fastenerType", {
    value: CssRule,
    enumerable: true,
    configurable: true,
  });

  CssRule.prototype.transformInletCss = function <S extends CSSRule>(this: CssRule<unknown, S>, inletCss: CSSStyleSheet | CSSRule | null): S | null {
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

  CssRule.construct = function <F extends CssRule<any, any>>(fastener: F | null, owner: F extends CssRule<infer O> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    return fastener;
  };

  return CssRule;
})(CssScope);
