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
import {Objects} from "@swim/util";
import type {TimingLike} from "@swim/util";
import {Timing} from "@swim/util";
import {FastenerContext} from "@swim/component";
import {Fastener} from "@swim/component";
import type {ConstraintExpressionLike} from "@swim/constraint";
import type {ConstraintVariable} from "@swim/constraint";
import type {ConstraintProperty} from "@swim/constraint";
import type {ConstraintRelation} from "@swim/constraint";
import type {ConstraintStrengthLike} from "@swim/constraint";
import type {Constraint} from "@swim/constraint";
import {ConstraintScope} from "@swim/constraint";
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
import {StyleMap} from "./StyleMap";
import type {CssRuleDescriptor} from "./CssRule";
import type {CssRuleClass} from "./CssRule";
import {CssRule} from "./CssRule";

/** @public */
export interface StyleRuleDescriptor<R> extends CssRuleDescriptor<R, CSSStyleRule> {
  extends?: Proto<StyleRule<any>> | boolean | null;
}

/** @public */
export interface StyleRuleClass<F extends StyleRule<any> = StyleRule> extends CssRuleClass<F> {
  /** @internal */
  readonly fieldInitializers: {[name: PropertyKey]: Function[]};
  /** @internal */
  readonly instanceInitializers: Function[];
}

/** @public */
export interface StyleRule<R = any> extends CssRule<R, CSSStyleRule>, FastenerContext, ConstraintScope, ThemeContext, StyleMap {
  /** @override */
  get descriptorType(): Proto<StyleRuleDescriptor<R>>;

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

  /** @override */
  getStyle(propertyNames: string | readonly string[]): CSSStyleValue | string | undefined;

  /** @override */
  setStyle(propertyName: string, value: unknown, priority?: string): this;

  /** @protected */
  willSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @protected */
  onSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @protected */
  didSetStyle(propertyName: string, value: unknown, priority: string | undefined): void;

  /** @override */
  constraint(lhs: ConstraintExpressionLike, relation: ConstraintRelation,
             rhs?: ConstraintExpressionLike, strength?: ConstraintStrengthLike): Constraint;

  /** @override */
  hasConstraint(constraint: Constraint): boolean;

  /** @override */
  addConstraint(constraint: Constraint): void;

  /** @override */
  removeConstraint(constraint: Constraint): void;

  /** @override */
  constraintVariable(name: string, value?: number, strength?: ConstraintStrengthLike): ConstraintProperty<any, number>;

  /** @override */
  hasConstraintVariable(variable: ConstraintVariable): boolean;

  /** @override */
  addConstraintVariable(variable: ConstraintVariable): void;

  /** @override */
  removeConstraintVariable(variable: ConstraintVariable): void;

  /** @internal @override */
  setConstraintVariable(constraintVariable: ConstraintVariable, state: number): void;

  /** @override */
  getLook<T>(look: Look<T>, mood?: MoodVector<Feel> | null): T | undefined;

  /** @override */
  getLookOr<T, E>(look: Look<T>, elseValue: E): T | E;
  /** @override */
  getLookOr<T, E>(look: Look<T>, mood: MoodVector<Feel> | null, elseValue: E): T | E;

  /** @override */
  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: TimingLike | boolean | null): void;

  /** @internal */
  applyStyles(): void;

  /** @override */
  getFastener<F extends Fastener>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null;

  /** @override */
  getParentFastener<F extends Fastener>(fastenerName: string, fastenerType?: Proto<F>, contextType?: Proto<any>): F | null;

  /** @override */
  attachFastener(fastener: Fastener): void;

  /** @internal @protected */
  mountFasteners(): void;

  /** @internal @protected */
  unmountFasteners(): void;

  /** @override */
  requireUpdate(updateFlags: number): void;

  /** @internal */
  readonly coherentTime: number;

  /** @internal */
  readonly decoherent: readonly Fastener[] | null;

  /** @internal */
  readonly recohering: readonly Fastener[] | null;

  /** @override */
  decohereFastener(fastener: Fastener): void;

  /** @internal @protected */
  enqueueFastener(fastener: Fastener): void;

  /** @internal @protected */
  recohereFasteners(t: number): void

  /** @override */
  recohere(t: number): void

  /** @protected @override */
  didMount(): void;

  /** @protected @override */
  willUnmount(): void;
}

/** @public */
export const StyleRule = (<R, F extends StyleRule<any>>() => CssRule.extend<StyleRule<R>, StyleRuleClass<F>>("StyleRule", {
  get fastenerType(): Proto<StyleRule<any>> {
    return StyleRule;
  },

  selector: "*",

  transformInletCss(inletCss: CSSStyleSheet | CSSRule | null): CSSStyleRule | null {
    if (inletCss !== null) {
      (inletCss as any).RANDOM_MARKER_ID = Math.random();
    }
    if (inletCss instanceof CSSStyleRule) {
      return inletCss;
    } else if (inletCss instanceof CSSStyleSheet || inletCss instanceof CSSGroupingRule) {
      return this.createRule(inletCss);
    }
    return null;
  },

  createRule(inletCss: CSSStyleSheet | CSSGroupingRule): CSSStyleRule | null {
    const index = inletCss.insertRule(this.cssText);
    const rule = inletCss.cssRules.item(index);
    if (!(rule instanceof CSSStyleRule)) {
      throw new TypeError("not a style rule: " + rule);
    }
    return rule;
  },

  onAttachCss(css: CSSStyleRule): void {
    if (this.mounted) {
      this.applyStyles();
    }
  },

  getStyle(propertyNames: string | readonly string[]): CSSStyleValue | string | undefined {
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
  },

  setStyle(propertyName: string, value: unknown, priority?: string): StyleRule {
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
  },

  willSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  },

  onSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  },

  didSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  },

  constraint(lhs: ConstraintExpressionLike, relation: ConstraintRelation,
             rhs?: ConstraintExpressionLike, strength?: ConstraintStrengthLike): Constraint {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    return this.owner.constraint(lhs, relation, rhs, strength);
  },

  hasConstraint(constraint: Constraint): boolean {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    return this.owner.hasConstraint(constraint);
  },

  addConstraint(constraint: Constraint): void {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    this.owner.addConstraint(constraint);
  },

  removeConstraint(constraint: Constraint): void {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    this.owner.removeConstraint(constraint);
  },

  constraintVariable(name: string, value?: number, strength?: ConstraintStrengthLike): ConstraintProperty<any, number> {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    return this.owner.constraintVariable(name, value, strength);
  },

  hasConstraintVariable(constraintVariable: ConstraintVariable): boolean {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    return this.owner.hasConstraintVariable(constraintVariable);
  },

  addConstraintVariable(constraintVariable: ConstraintVariable): void {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    this.owner.addConstraintVariable(constraintVariable);
  },

  removeConstraintVariable(constraintVariable: ConstraintVariable): void {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    this.owner.removeConstraintVariable(constraintVariable);
  },

  setConstraintVariable(constraintVariable: ConstraintVariable, state: number): void {
    if (!ConstraintScope[Symbol.hasInstance](this.owner)) {
      throw new Error("no constraint scope");
    }
    this.owner.setConstraintVariable(constraintVariable, state);
  },

  getLook<T>(look: Look<T>, mood?: MoodVector<Feel> | null): T | undefined {
    const themeContext = this.owner;
    if (!ThemeContext[Symbol.hasInstance](themeContext)) {
      return void 0;
    }
    return themeContext.getLook(look, mood);
  },

  getLookOr<T, E>(look: Look<T>, mood: MoodVector<Feel> | null | E, elseValue?: E): T | E {
    const themeContext = this.owner;
    if (ThemeContext[Symbol.hasInstance](themeContext)) {
      if (arguments.length === 2) {
        return themeContext.getLookOr(look, mood as E);
      } else {
        return themeContext.getLookOr(look, mood as MoodVector<Feel> | null, elseValue!);
      }
    } else if (arguments.length === 2) {
      return mood as E;
    }
    return elseValue!;
  },

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: TimingLike | boolean | null): void {
    if (timing === void 0 || timing === null || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromLike(timing);
    }
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof ThemeAnimator) {
        fastener.applyTheme(theme, mood, timing);
      }
    }
    super.applyTheme(theme, mood, timing);
  },

  applyStyles(): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof StyleAnimator) {
        fastener.applyStyle(fastener.value, fastener.priority);
      }
    }
  },

  getFastener<F extends Fastener>(fastenerName: PropertyKey, fastenerType?: Proto<F>, contextType?: Proto<any> | null): F | null {
    if (contextType !== void 0 && contextType !== null && !(this instanceof contextType)) {
      return null;
    }
    const fastener = (this as any)[fastenerName] as F | null | undefined;
    if (fastener === void 0 || (fastenerType !== void 0 && fastenerType !== null && !(fastener instanceof fastenerType))) {
      return null;
    }
    return fastener;
  },

  getParentFastener<F extends Fastener>(fastenerName: string, fastenerType?: Proto<F>, contextType?: Proto<any>): F | null {
    return null;
  },

  attachFastener(fastener: Fastener): void {
    if (this.mounted) {
      fastener.mount();
    }
  },

  mountFasteners(): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof Fastener) {
        fastener.mount();
      }
    }
  },

  unmountFasteners(): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof Fastener) {
        fastener.unmount();
      }
    }
  },

  requireUpdate(updateFlags: number): void {
    if (Objects.hasAllKeys<FastenerContext>(this.owner, "requireUpdate")) {
      this.owner.requireUpdate!(updateFlags);
    }
  },

  decohereFastener(fastener: Fastener): void {
    const recohering = this.recohering as Fastener[] | null;
    if (recohering !== null && fastener.coherentTime !== this.coherentTime) {
      recohering.push(fastener);
      return;
    }
    this.enqueueFastener(fastener);
  },

  enqueueFastener(fastener: Fastener): void {
    let decoherent = this.decoherent as Fastener[] | null;
    if (decoherent === null) {
      decoherent = [];
      (this as Mutable<typeof this>).decoherent = decoherent;
    }
    decoherent.push(fastener);
    this.decohere();
  },

  recohereFasteners(t: number): void {
    const decoherent = this.decoherent;
    if (decoherent === null || decoherent.length === 0) {
      return;
    } else if (t === void 0) {
      t = performance.now();
    }
    (this as Mutable<typeof this>).coherentTime = t;
    (this as Mutable<typeof this>).decoherent = null;
    (this as Mutable<typeof this>).recohering = decoherent;
    try {
      for (let i = 0; i < decoherent.length; i += 1) {
        const fastener = decoherent[i]!;
        fastener.recohere(t);
      }
    } finally {
      (this as Mutable<typeof this>).recohering = null;
    }
  },

  recohere(t: number): void {
    super.recohere(t);
    this.recohereFasteners(t);
    if (this.decoherent === null || this.decoherent.length === 0) {
      this.setCoherent(true);
    } else {
      this.setCoherent(false);
      this.decohere();
    }
  },

  didMount(): void {
    this.mountFasteners();
    if (this.css !== null) {
      this.applyStyles();
    }
    super.didMount();
  },

  willUnmount(): void {
    super.willUnmount();
    this.unmountFasteners();
  },
},
{
  construct(fastener: F | null, owner: F extends Fastener<infer R, any, any> ? R : never): F {
    fastener = super.construct(fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).coherentTime = 0;
    (fastener as Mutable<typeof fastener>).decoherent = null;
    (fastener as Mutable<typeof fastener>).recohering = null;
    __runInitializers(fastener, StyleRule.instanceInitializers);
    for (const key in StyleRule.fieldInitializers) {
      (fastener as any)[key] = __runInitializers(fastener, StyleRule.fieldInitializers[key]!, void 0);
    }
    return fastener;
  },

  fieldInitializers: {},
  instanceInitializers: [],
}))();
StyleMap.define(StyleRule, StyleRule.fieldInitializers, StyleRule.instanceInitializers);
