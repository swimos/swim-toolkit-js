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
import {CssContext} from "./CssContext";
import type {CssRule} from "./CssRule";

export class StyleSheet implements CssContext {
  constructor(owner: AnimatorContext, stylesheet?: CSSStyleSheet) {
    Object.defineProperty(this, "owner", {
      value: owner,
      enumerable: true,
    });
    Object.defineProperty(this, "stylesheet", {
      value: stylesheet !== void 0 ? stylesheet : this.createStylesheet(),
      enumerable: true,
    });
    Object.defineProperty(this, "cssRules", {
      value: {},
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly owner: AnimatorContext;

  declare readonly stylesheet: CSSStyleSheet;

  protected createStylesheet(): CSSStyleSheet {
    return new CSSStyleSheet();
  }

  getRule(index: number): CSSRule | null {
    return this.stylesheet.cssRules.item(index);
  }

  insertRule(cssText: string, index?: number): number {
    return this.stylesheet.insertRule(cssText, index);
  }

  removeRule(index: number): void {
    this.stylesheet.deleteRule(index);
  }

  /** @hidden */
  declare readonly cssRules: {[ruleName: string]: CssRule<StyleSheet> | undefined};

  hasCssRule(ruleName: string): boolean {
    return this.cssRules[ruleName] !== void 0;
  }

  getCssRule(ruleName: string): CssRule<this> | null {
    const cssRule = this.cssRules[ruleName] as CssRule<this> | undefined;
    return cssRule !== void 0 ? cssRule : null;
  }

  setCssRule(ruleName: string, cssRule: CssRule<this> | null): void {
    if (cssRule !== null) {
      this.cssRules[ruleName] = cssRule;
    } else {
      delete this.cssRules[ruleName];
    }
  }

  /** @hidden */
  getLazyCssRule(ruleName: string): CssRule<this> | null {
    let cssRule = this.getCssRule(ruleName);
    if (cssRule === null) {
      const constructor = CssContext.getCssRuleConstructor(ruleName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        cssRule = new constructor(this, ruleName);
        this.setCssRule(ruleName, cssRule);
      }
    }
    return cssRule;
  }

  onAnimate(t: number): void {
    const cssRules = this.cssRules;
    for (const ruleName in cssRules) {
      const cssRule = cssRules[ruleName]!;
      cssRule.onAnimate(t);
    }
  }

  animate(animator: Animator): void {
    this.owner.animate(animator);
  }

  requireUpdate(updateFlags: number): void {
    if (typeof (this.owner as any).requireUpdate === "function") {
      (this.owner as any).requireUpdate(updateFlags);
    }
  }
}
