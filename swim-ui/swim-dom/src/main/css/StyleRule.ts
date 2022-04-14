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

import {Mutable, Proto, AnyTiming, Timing} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import {ToStyleString, ToCssValue} from "@swim/style";
import {Look, Mood, MoodVector, ThemeMatrix, ThemeAnimator} from "@swim/theme";
import {StyleMapInit, StyleMap} from "./StyleMap";
import {CssContext} from "./CssContext";
import {CssRuleRefinement, CssRuleTemplate, CssRuleClass, CssRule} from "./CssRule";

/** @public */
export interface StyleRuleRefinement extends CssRuleRefinement {
}

/** @public */
export interface StyleRuleTemplate extends CssRuleTemplate {
  extends?: Proto<StyleRule<any>> | string | boolean | null;
  style?: StyleMapInit;
}

/** @public */
export interface StyleRuleClass<F extends StyleRule<any> = StyleRule<any>> extends CssRuleClass<F> {
  /** @override */
  specialize(className: string, template: StyleRuleTemplate): StyleRuleClass;

  /** @override */
  refine(fastenerClass: StyleRuleClass): void;

  /** @override */
  extend(className: string, template: StyleRuleTemplate): StyleRuleClass<F>;

  /** @override */
  specify<O>(className: string, template: ThisType<StyleRule<O>> & StyleRuleTemplate & Partial<Omit<StyleRule<O>, keyof StyleRuleTemplate>>): StyleRuleClass<F>;

  /** @override */
  <O>(template: ThisType<StyleRule<O>> & StyleRuleTemplate & Partial<Omit<StyleRule<O>, keyof StyleRuleTemplate>>): PropertyDecorator;
}

/** @public */
export type StyleRuleDef<O, R extends StyleRuleRefinement = {}> =
  StyleRule<O> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function StyleRuleDef<P extends StyleRule<any>>(
  template: P extends StyleRuleDef<infer O, infer R>
          ? ThisType<StyleRuleDef<O, R>>
          & StyleRuleTemplate
          & Partial<Omit<StyleRule<O>, keyof StyleRuleTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof StyleRuleTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return StyleRule(template);
}

/** @public */
export interface StyleRule<O = unknown> extends CssRule<O>, StyleMap {
  (property: string): unknown;
  (property: string, value: unknown): O;

  /** @internal @override */
  initRule(): CSSStyleRule;

  /** @internal @override */
  createRule(css: string): CSSStyleRule;

  /** @override */
  readonly rule: CSSStyleRule;

  get selector(): string;

  setSelector(selector: string): void;

  /** @protected */
  readonly style?: StyleMapInit; // optional prototype property

  /** @override */
  getStyle(propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined;

  /** @override */
  setStyle(propertyName: string, value: unknown, priority?: string): this;

  /** @protected */
  willSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @protected */
  onSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @protected */
  didSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @override */
  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void;
}

/** @public */
export const StyleRule = (function (_super: typeof CssRule) {
  const StyleRule = _super.extend("StyleRule", {}) as StyleRuleClass;

  StyleRule.prototype.createRule = function (this: StyleRule, css: string): CSSStyleRule {
    const cssContext = this.owner;
    if (CssContext.is(cssContext)) {
      const index = cssContext.insertRule(css);
      const rule = cssContext.getRule(index);
      if (rule instanceof CSSStyleRule) {
        return rule;
      } else {
        throw new TypeError("" + rule);
      }
    } else {
      throw new Error("no css context");
    }
  };

  Object.defineProperty(StyleRule.prototype, "selector", {
    get: function (this: StyleRule): string {
      return this.rule.selectorText;
    },
    configurable: true,
  });

  StyleRule.prototype.setSelector = function (this: StyleRule, selector: string): void {
    this.rule.selectorText = selector;
  };

  StyleRule.prototype.getStyle = function (this: StyleRule, propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined {
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      const style = this.rule.styleMap;
      if (typeof propertyNames === "string") {
        return style.get(propertyNames);
      } else {
        for (let i = 0, n = propertyNames.length; i < n; i += 1) {
          const value = style.get(propertyNames[i]!);
          if (value !== void 0) {
            return value;
          }
        }
        return "";
      }
    } else {
      const style = this.rule.style;
      if (typeof propertyNames === "string") {
        return style.getPropertyValue(propertyNames);
      } else {
        for (let i = 0, n = propertyNames.length; i < n; i += 1) {
          const value = style.getPropertyValue(propertyNames[i]!);
          if (value.length !== 0) {
            return value;
          }
        }
        return "";
      }
    }
  };

  StyleRule.prototype.setStyle = function (this: StyleRule, propertyName: string, value: unknown, priority?: string): StyleRule {
    this.willSetStyle(propertyName, value, priority);
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      if (value !== void 0 && value !== null) {
        const cssValue = ToCssValue(value);
        if (cssValue !== null) {
          try {
            this.rule.styleMap.set(propertyName, cssValue);
          } catch (e) {
            // swallow
          }
        } else {
          this.rule.style.setProperty(propertyName, ToStyleString(value), priority);
        }
      } else {
        this.rule.styleMap.delete(propertyName);
      }
    } else {
      if (value !== void 0 && value !== null) {
        this.rule.style.setProperty(propertyName, ToStyleString(value), priority);
      } else {
        this.rule.style.removeProperty(propertyName);
      }
    }
    this.onSetStyle(propertyName, value, priority);
    this.didSetStyle(propertyName, value, priority);
    return this;
  };

  StyleRule.prototype.willSetStyle = function (this: StyleRule, propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  };

  StyleRule.prototype.onSetStyle = function (this: StyleRule, propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  };

  StyleRule.prototype.didSetStyle = function (this: StyleRule, propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  };

  StyleRule.prototype.applyTheme = function (theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    if (timing === void 0 || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      if (fastener instanceof ThemeAnimator) {
        fastener.applyTheme(theme, mood, timing as Timing | boolean);
      }
    }
  };

  StyleMap.define(StyleRule.prototype);

  StyleRule.construct = function <F extends StyleRule<any>>(rule: F | null, owner: FastenerOwner<F>): F {
    if (rule === null) {
      rule = function (property: string, value: unknown): unknown | FastenerOwner<F> {
        if (value === void 0) {
          return rule!.getStyle(property);
         } else {
          rule!.setStyle(property, value);
          return rule!.owner;
        }
      } as F;
      delete (rule as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(rule, this.prototype);
    }
    rule = _super.construct.call(this, rule, owner) as F;
    if (rule.style !== void 0) {
      StyleMap.init(rule, rule.style);
    }
    return rule;
  };

  return StyleRule;
})(CssRule);
