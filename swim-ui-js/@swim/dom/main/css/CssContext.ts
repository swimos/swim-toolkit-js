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

import type {AnimatorContext, Animator} from "@swim/animation";
import type {CssRuleConstructor, CssRule} from "./CssRule";

export interface CssContextPrototype {
  /** @hidden */
  _cssRuleConstructors?: {[ruleName: string]: CssRuleConstructor<CssContext> | undefined};
}

export interface CssContext extends AnimatorContext {
  getRule(index: number): CSSRule | null;

  insertRule(cssText: string, index?: number): number;

  removeRule(index: number): void;

  hasCssRule(ruleName: string): boolean;

  getCssRule(ruleName: string): CssRule<this> | null;

  setCssRule(ruleName: string, cssRule: CssRule<this> | null): void;

  animate(animator: Animator): void;

  requireUpdate(updateFlags: number): void;
}

/** @hidden */
export const CssContext = {} as {
  getCssRuleConstructor(ruleName: string, contextPrototype: CssContextPrototype | null): CssRuleConstructor<any> | null;
  decorateCssRule(constructor: CssRuleConstructor<CssContext>,
                  target: Object, propertyKey: string | symbol): void;
};

CssContext.getCssRuleConstructor = function (ruleName: string, contextPrototype: CssContextPrototype): CssRuleConstructor<CssContext> | null {
  while (contextPrototype !== null) {
    if (Object.prototype.hasOwnProperty.call(contextPrototype, "_cssRuleConstructors")) {
      const constructor = contextPrototype._cssRuleConstructors![ruleName];
      if (constructor !== void 0) {
        return constructor;
      }
    }
    contextPrototype = Object.getPrototypeOf(contextPrototype);
  }
  return null;
};

CssContext.decorateCssRule = function (constructor: CssRuleConstructor<any>,
                                       target: Object, propertyKey: string | symbol): void {
  const contextPrototype = target as CssContextPrototype;
  if (!Object.prototype.hasOwnProperty.call(contextPrototype, "_cssRuleConstructors")) {
    contextPrototype._cssRuleConstructors = {};
  }
  contextPrototype._cssRuleConstructors![propertyKey.toString()] = constructor;
  Object.defineProperty(target, propertyKey, {
    get: function (this: CssContext): CssRule<CssContext> {
      let cssRule = this.getCssRule(propertyKey.toString());
      if (cssRule === null) {
        cssRule = new constructor(this, propertyKey.toString());
        this.setCssRule(propertyKey.toString(), cssRule);
      }
      return cssRule;
    },
    configurable: true,
    enumerable: true,
  });
};
