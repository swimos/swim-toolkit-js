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

import {__runInitializers} from "tslib";
import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import {FastenerContext} from "@swim/component";
import {Fastener} from "@swim/component";
import type {AnyConstraintExpression} from "@swim/constraint";
import type {ConstraintVariable} from "@swim/constraint";
import type {ConstraintProperty} from "@swim/constraint";
import type {ConstraintRelation} from "@swim/constraint";
import type {AnyConstraintStrength} from "@swim/constraint";
import type {Constraint} from "@swim/constraint";
import type {ConstraintScope} from "@swim/constraint";
import {ToStyleString} from "@swim/style";
import {ToCssValue} from "@swim/style";
import {Look} from "@swim/theme";
import type {Feel} from "@swim/theme";
import {Mood} from "@swim/theme";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import {ThemeContext} from "@swim/theme";
import {StyleAnimator} from "./StyleAnimator";
import type {StyleMapInit} from "./StyleMap";
import {StyleMap} from "./StyleMap";
import type {CssRuleDescriptor} from "./CssRule";
import type {CssRuleClass} from "./CssRule";
import {CssRule} from "./CssRule";

/** @public */
export interface StyleRuleDescriptor extends CssRuleDescriptor<CSSStyleRule> {
  extends?: Proto<StyleRule<any>> | boolean | null;
  style?: StyleMapInit;
}

/** @public */
export interface StyleRuleClass<F extends StyleRule<any> = StyleRule<any>> extends CssRuleClass<F> {
  /** @internal */
  readonly fieldInitializers: {[name: PropertyKey]: Function[]};
  /** @internal */
  readonly instanceInitializers: Function[];
}

/** @public */
export interface StyleRule<O = unknown> extends CssRule<O, CSSStyleRule>, FastenerContext, ConstraintScope, ThemeContext, StyleMap {
  /** @override */
  get descriptorType(): Proto<StyleRuleDescriptor>;

  /** @override */
  get fastenerType(): Proto<StyleRule<any>>;

  /** @override */
  transformInletCss(inletCss: CSSStyleSheet | CSSRule | null): CSSStyleRule | null;

  /** @override */
  createRule(inletCss: CSSStyleSheet | CSSGroupingRule): CSSStyleRule | null;

  /** @protected @override */
  onAttachCss(css: CSSStyleRule): void;

  /** @override */
  get selector(): string;

  /** @protected */
  get style(): StyleMapInit; // optional prototype property

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
  constraint(lhs: AnyConstraintExpression, relation: ConstraintRelation,
             rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint;

  /** @override */
  hasConstraint(constraint: Constraint): boolean;

  /** @override */
  addConstraint(constraint: Constraint): void;

  /** @override */
  removeConstraint(constraint: Constraint): void;

  /** @override */
  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number>;

  /** @override */
  hasConstraintVariable(variable: ConstraintVariable): boolean;

  /** @override */
  addConstraintVariable(variable: ConstraintVariable): void;

  /** @override */
  removeConstraintVariable(variable: ConstraintVariable): void;

  /** @internal @override */
  setConstraintVariable(constraintVariable: ConstraintVariable, state: number): void;

  /** @override */
  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined;

  /** @override */
  getLookOr<T, E>(look: Look<T, unknown>, elseValue: E): T | E;
  /** @override */
  getLookOr<T, E>(look: Look<T, unknown>, mood: MoodVector<Feel> | null, elseValue: E): T | E;

  /** @override */
  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void;

  /** @internal */
  applyStyles(): void;

  /** @override */
  getParentFastener<F extends Fastener<any>>(fastenerName: string, fastenerType: Proto<F>, contextType?: Proto<unknown>): F | null;

  /** @override */
  attachFastener(fastener: Fastener): void;

  /** @internal @protected */
  mountFasteners(): void;

  /** @internal @protected */
  unmountFasteners(): void;

  /** @override */
  requireUpdate(updateFlags: number): void;

  /** @internal */
  readonly decoherent: readonly Fastener[] | null;

  /** @override */
  decohereFastener(fastener: Fastener): void;

  /** @internal @protected */
  recohereFasteners(t: number): void

  /** @override */
  recohere(t: number): void

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const StyleRule = (function (_super: typeof CssRule) {
  const StyleRule = _super.extend("StyleRule", {}) as StyleRuleClass;

  Object.defineProperty(StyleRule.prototype, "fastenerType", {
    value: StyleRule,
    enumerable: true,
    configurable: true,
  });

  StyleRule.prototype.transformInletCss = function (this: StyleRule, inletCss: CSSStyleSheet | CSSRule | null): CSSStyleRule | null {
    if (inletCss instanceof CSSStyleRule) {
      return inletCss;
    } else if (inletCss instanceof CSSStyleSheet || inletCss instanceof CSSGroupingRule) {
      return this.createRule(inletCss);
    }
    return null;
  };

  StyleRule.prototype.createRule = function (this: StyleRule, inletCss: CSSStyleSheet | CSSGroupingRule): CSSStyleRule | null {
    const index = inletCss.insertRule(this.cssText);
    const rule = inletCss.cssRules.item(index);
    if (!(rule instanceof CSSStyleRule)) {
      throw new TypeError("not a style rule: " + rule);
    }
    return rule;
  };

  Object.defineProperty(StyleRule.prototype, "selector", {
    value: "*",
    enumerable: true,
    configurable: true,
  });

  StyleRule.prototype.onAttachCss = function (this: StyleRule, css: CSSStyleRule): void {
    if (this.mounted) {
      this.applyStyles();
    }
  };

  StyleRule.prototype.getStyle = function (this: StyleRule, propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined {
    const css = this.css;
    if (css === null) {
      return void 0;
    }
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      const style = css.styleMap;
      if (typeof propertyNames === "string") {
        return style.get(propertyNames);
      }
      for (let i = 0, n = propertyNames.length; i < n; i += 1) {
        const value = style.get(propertyNames[i]!);
        if (value !== void 0) {
          return value;
        }
      }
      return "";
    }
    const style = css.style;
    if (typeof propertyNames === "string") {
      return style.getPropertyValue(propertyNames);
    }
    for (let i = 0, n = propertyNames.length; i < n; i += 1) {
      const value = style.getPropertyValue(propertyNames[i]!);
      if (value.length !== 0) {
        return value;
      }
    }
    return "";
  };

  StyleRule.prototype.setStyle = function (this: StyleRule, propertyName: string, value: unknown, priority?: string): StyleRule {
    const css = this.css;
    if (css === null) {
      return this;
    }
    this.willSetStyle(propertyName, value, priority);
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      if (value !== void 0 && value !== null) {
        const cssValue = ToCssValue(value);
        if (cssValue !== null) {
          try {
            css.styleMap.set(propertyName, cssValue);
          } catch (e) {
            // swallow
          }
        } else {
          css.style.setProperty(propertyName, ToStyleString(value), priority);
        }
      } else {
        try {
          css.styleMap.delete(propertyName);
        } catch (e) {
          // swallow
        }
      }
    } else if (value !== void 0 && value !== null) {
      css.style.setProperty(propertyName, ToStyleString(value), priority);
    } else {
      css.style.removeProperty(propertyName);
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

  StyleRule.prototype.constraint = function (this: StyleRule<ConstraintScope>, lhs: AnyConstraintExpression, relation: ConstraintRelation,
                                             rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint {
    return this.owner.constraint(lhs, relation, rhs, strength);
  };

  StyleRule.prototype.hasConstraint = function (this: StyleRule<ConstraintScope>, constraint: Constraint): boolean {
    return this.owner.hasConstraint(constraint);
  };

  StyleRule.prototype.addConstraint = function (this: StyleRule<ConstraintScope>, constraint: Constraint): void {
    this.owner.addConstraint(constraint);
  };

  StyleRule.prototype.removeConstraint = function (this: StyleRule<ConstraintScope>, constraint: Constraint): void {
    this.owner.removeConstraint(constraint);
  };

  StyleRule.prototype.constraintVariable = function (this: StyleRule<ConstraintScope>, name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number> {
    return this.owner.constraintVariable(name, value, strength);
  };

  StyleRule.prototype.hasConstraintVariable = function (this: StyleRule<ConstraintScope>, constraintVariable: ConstraintVariable): boolean {
    return this.owner.hasConstraintVariable(constraintVariable);
  };

  StyleRule.prototype.addConstraintVariable = function (this: StyleRule<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.addConstraintVariable(constraintVariable);
  };

  StyleRule.prototype.removeConstraintVariable = function (this: StyleRule<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.removeConstraintVariable(constraintVariable);
  };

  StyleRule.prototype.setConstraintVariable = function (this: StyleRule<ConstraintScope>, constraintVariable: ConstraintVariable, state: number): void {
    this.owner.setConstraintVariable(constraintVariable, state);
  };

  StyleRule.prototype.getLook = function <T>(this: StyleRule, look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined {
    const themeContext = this.owner;
    if (!ThemeContext[Symbol.hasInstance](themeContext)) {
      return void 0;
    }
    return themeContext.getLook(look, mood);
  };

  StyleRule.prototype.getLookOr = function <T, E>(this: StyleRule, look: Look<T, unknown>, mood: MoodVector<Feel> | null | E, elseValue?: E): T | E {
    const themeContext = this.owner;
    if (ThemeContext[Symbol.hasInstance](themeContext)) {
      if (arguments.length === 2) {
        return themeContext.getLookOr(look, mood as E);
      } else {
        return themeContext.getLookOr(look, mood as MoodVector<Feel> | null, elseValue!);
      }
    } else if (arguments.length === 2) {
      return mood as E;
    } else {
      return elseValue!;
    }
  };

  StyleRule.prototype.applyTheme = function (this: StyleRule, theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    if (timing === void 0 || timing === null || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof ThemeAnimator) {
        fastener.applyTheme(theme, mood, timing);
      }
    }
    _super.prototype.applyTheme.call(this, theme, mood, timing);
  };

  StyleRule.prototype.applyStyles = function(this: StyleRule): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof StyleAnimator) {
        fastener.applyStyle(fastener.value, fastener.priority);
      }
    }
  };

  StyleRule.prototype.getParentFastener = function <F extends Fastener<any>>(this: StyleRule, fastenerName: string, fastenerType: Proto<F>, contextType?: Proto<unknown>): F | null {
    return null;
  };

  StyleRule.prototype.attachFastener = function (this: StyleRule, fastener: Fastener): void {
    if (this.mounted) {
      fastener.mount();
    }
  };

  StyleRule.prototype.mountFasteners = function (this: StyleRule): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof Fastener) {
        fastener.mount();
      }
    }
  };

  StyleRule.prototype.unmountFasteners = function (this: StyleRule): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof Fastener) {
        fastener.unmount();
      }
    }
  };

  StyleRule.prototype.requireUpdate = function (this: StyleRule, updateFlags: number): void {
    const owner = this.owner;
    if (owner === null || typeof owner !== "object" && typeof owner !== "function"
        || !("requireUpdate" in owner)) {
      return;
    }
    (owner as FastenerContext).requireUpdate!(updateFlags);
  };

  StyleRule.prototype.decohereFastener = function (this: StyleRule, fastener: Fastener): void {
    let decoherent = this.decoherent as Fastener[] | null;
    if (decoherent === null) {
      decoherent = [];
      (this as Mutable<typeof this>).decoherent = decoherent;
    }
    decoherent.push(fastener);

    if ((this.flags & Fastener.DecoherentFlag) === 0) {
      this.setCoherent(false);
      this.decohere();
    }
  };

  StyleRule.prototype.recohereFasteners = function (this: StyleRule, t: number): void {
    const decoherent = this.decoherent;
    if (decoherent === null) {
      return;
    }
    const decoherentCount = decoherent.length;
    if (decoherentCount === 0) {
      return;
    }
    (this as Mutable<typeof this>).decoherent = null;
    for (let i = 0; i < decoherentCount; i += 1) {
      const fastener = decoherent[i]!;
      fastener.recohere(t);
    }
  };

  StyleRule.prototype.recohere = function (this: StyleRule, t: number): void {
    _super.prototype.recohere.call(this, t);
    this.recohereFasteners(t);
    if (this.decoherent === null || this.decoherent.length === 0) {
      this.setCoherent(true);
    } else {
      this.setCoherent(false);
      this.decohere();
    }
  };

  StyleRule.prototype.onMount = function (this: StyleRule): void {
    _super.prototype.onMount.call(this);
    this.mountFasteners();
    if (this.css !== null) {
      this.applyStyles();
    }
  };

  StyleRule.prototype.onUnmount = function (this: StyleRule): void {
    this.unmountFasteners();
    _super.prototype.onUnmount.call(this);
  };

  (StyleRule as Mutable<typeof StyleRule>).fieldInitializers = {};
  (StyleRule as Mutable<typeof StyleRule>).instanceInitializers = [];
  StyleMap.define(StyleRule, StyleRule.fieldInitializers, StyleRule.instanceInitializers);

  StyleRule.construct = function <F extends StyleRule<any>>(fastener: F | null, owner: F extends StyleRule<infer O> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).decoherent = null;
    __runInitializers(fastener, StyleRule.instanceInitializers);
    for (const key in StyleRule.fieldInitializers) {
      (fastener as any)[key] = __runInitializers(fastener, StyleRule.fieldInitializers[key]!, void 0);
    }
    if (fastener.style !== void 0) {
      StyleMap.init(fastener, fastener.style);
    }
    return fastener;
  };

  return StyleRule;
})(CssRule);
