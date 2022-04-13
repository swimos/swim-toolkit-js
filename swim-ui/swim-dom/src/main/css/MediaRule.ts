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

import {Proto, AnyTiming, Timing} from "@swim/util";
import {Look, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {CssContext} from "./CssContext";
import {CssRuleRefinement, CssRuleTemplate, CssRuleClass, CssRule} from "./CssRule";

/** @public */
export interface MediaRuleRefinement extends CssRuleRefinement {
}

/** @public */
export interface MediaRuleTemplate extends CssRuleTemplate {
  extends?: Proto<MediaRule<any>> | string | boolean | null;
}

/** @public */
export interface MediaRuleClass<F extends MediaRule<any> = MediaRule<any>> extends CssRuleClass<F> {
  /** @override */
  specialize(className: string, template: MediaRuleTemplate): MediaRuleClass;

  /** @override */
  refine(fastenerClass: MediaRuleClass): void;

  /** @override */
  extend(className: string, template: MediaRuleTemplate): MediaRuleClass<F>;

  /** @override */
  specify<O>(className: string, template: ThisType<MediaRule<O>> & MediaRuleTemplate & Partial<Omit<MediaRule<O>, keyof MediaRuleTemplate>>): MediaRuleClass<F>;

  /** @override */
  <O>(template: ThisType<MediaRule<O>> & MediaRuleTemplate & Partial<Omit<MediaRule<O>, keyof MediaRuleTemplate>>): PropertyDecorator;
}

/** @public */
export type MediaRuleDef<O, R extends MediaRuleRefinement> =
  MediaRule<O> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function MediaRuleDef<P extends MediaRule<any>>(
  template: P extends MediaRuleDef<infer O, infer R>
          ? ThisType<MediaRuleDef<O, R>>
          & MediaRuleTemplate
          & Partial<Omit<MediaRule<O>, keyof MediaRuleTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof MediaRuleTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return MediaRule(template);
}

/** @public */
export interface MediaRule<O = unknown> extends CssRule<O>, CssContext {
  /** @internal */
  initRule(): CSSMediaRule;

  /** @internal */
  createRule(css: string): CSSMediaRule;

  /** @override */
  readonly rule: CSSMediaRule;

  /** @override */
  getRule(index: number): CSSRule | null;

  /** @override */
  insertRule(css: string, index?: number): number;

  /** @override */
  removeRule(index: number): void;

  /** @override */
  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void;
}

/** @public */
export const MediaRule = (function (_super: typeof CssRule) {
  const MediaRule = _super.extend("MediaRule", {}) as MediaRuleClass;

  MediaRule.prototype.createRule = function (this: MediaRule, css: string): CSSMediaRule {
    const cssContext = this.owner;
    if (CssContext.is(cssContext)) {
      const index = cssContext.insertRule(css);
      const rule = cssContext.getRule(index);
      if (rule instanceof CSSMediaRule) {
        return rule;
      } else {
        throw new TypeError("" + rule);
      }
    } else {
      throw new Error("no css context");
    }
  };

  MediaRule.prototype.getRule = function (this: MediaRule, index: number): CSSRule | null {
    return this.rule.cssRules.item(index);
  };

  MediaRule.prototype.insertRule = function (this: MediaRule, css: string, index?: number): number {
    return this.rule.insertRule(css, index);
  };

  MediaRule.prototype.removeRule = function (this: MediaRule, index: number): void {
    this.rule.deleteRule(index);
  };

  MediaRule.prototype.applyTheme = function (theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    if (timing === void 0 || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      if (fastener instanceof CssRule) {
        fastener.applyTheme(theme, mood, timing);
      }
    }
  };

  return MediaRule;
})(CssRule);
