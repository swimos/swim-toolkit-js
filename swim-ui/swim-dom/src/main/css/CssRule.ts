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

import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {FastenerContext} from "@swim/component";
import type {FastenerOwner} from "@swim/component";
import type {FastenerDescriptor} from "@swim/component";
import type {FastenerClass} from "@swim/component";
import {Fastener} from "@swim/component";
import type {AnyConstraintExpression} from "@swim/constraint";
import type {ConstraintVariable} from "@swim/constraint";
import type {ConstraintProperty} from "@swim/constraint";
import type {ConstraintRelation} from "@swim/constraint";
import type {AnyConstraintStrength} from "@swim/constraint";
import type {Constraint} from "@swim/constraint";
import type {ConstraintScope} from "@swim/constraint";
import type {Look} from "@swim/theme";
import type {Feel} from "@swim/theme";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeContext} from "@swim/theme";
import {CssContext} from "./CssContext";

/** @public */
export type CssRuleDecorator<F extends CssRule<any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;
};

/** @public */
export interface CssRuleDescriptor extends FastenerDescriptor {
  extends?: Proto<CssRule<any>> | boolean | null;
  css?: string;
}

/** @public */
export type CssRuleTemplate<F extends CssRule<any>> =
  ThisType<F> &
  CssRuleDescriptor &
  Partial<Omit<F, keyof CssRuleDescriptor>>;

/** @public */
export interface CssRuleClass<F extends CssRule<any> = CssRule<any>> extends FastenerClass<F> {
  /** @override */
  specialize(template: CssRuleDescriptor): CssRuleClass<F>;

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
export interface CssRule<O = unknown> extends Fastener<O>, FastenerContext, ConstraintScope, ThemeContext {
  /** @override */
  get fastenerType(): Proto<CssRule<any>>;

  /** @protected */
  initCss(): string;

  readonly css?: string; // optional prototype property

  /** @internal */
  initRule(): CSSRule | null;

  /** @internal */
  createRule(css: string): CSSRule;

  readonly rule: CSSRule | null;

  /** @override */
  getParentFastener<F extends Fastener<any>>(fastenerName: string, fastenerBound: Proto<F>): F | null;
  /** @override */
  getParentFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null;

  /** @internal @protected */
  mountFasteners(): void;

  /** @internal @protected */
  unmountFasteners(): void;

  /** @override */
  requireUpdate(updateFlags: number): void;

  /** @internal */
  readonly decoherent: ReadonlyArray<Fastener> | null;

  /** @override */
  decohereFastener(fastener: Fastener): void;

  /** @override */
  recohere(t: number): void

  /** @internal @protected */
  recohereFasteners(t: number): void

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

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean): void;

  /** @protected @override */
  willMount(): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;

  /** @protected @override */
  didUnmount(): void;
}

/** @public */
export const CssRule = (function (_super: typeof Fastener) {
  const CssRule = _super.extend("CssRule", {}) as CssRuleClass;

  Object.defineProperty(CssRule.prototype, "fastenerType", {
    value: CssRule,
    configurable: true,
  });

  CssRule.prototype.initCss = function (this: CssRule): string {
    let css = (Object.getPrototypeOf(this) as CssRule).css as string | undefined;
    if (css === void 0) {
      css = "";
    }
    return css;
  };

  CssRule.prototype.initRule = function (this: CssRule): CSSRule | null {
    return this.createRule(this.initCss());
  };

  CssRule.prototype.createRule = function (this: CssRule, css: string): CSSRule {
    const cssContext = this.owner;
    if (CssContext.is(cssContext)) {
      const index = cssContext.insertRule(css);
      const rule = cssContext.getRule(index);
      if (rule instanceof CSSRule) {
        return rule;
      } else {
        throw new TypeError("" + rule);
      }
    } else {
      throw new Error("no css context");
    }
  };

  CssRule.prototype.getParentFastener = function (this: CssRule, fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null {
    return null;
  };

  CssRule.prototype.mountFasteners = function (this: CssRule): void {
    const fastenerNames = FastenerContext.getFastenerNames(this);
    for (let i = 0; i < fastenerNames.length; i += 1) {
      const fastener = this[fastenerNames[i]!];
      if (fastener instanceof Fastener) {
        fastener.mount();
      }
    }
  };

  CssRule.prototype.unmountFasteners = function (this: CssRule): void {
    const fastenerNames = FastenerContext.getFastenerNames(this);
    for (let i = 0; i < fastenerNames.length; i += 1) {
      const fastener = this[fastenerNames[i]!];
      if (fastener instanceof Fastener) {
        fastener.unmount();
      }
    }
  };

  CssRule.prototype.requireUpdate = function (this: CssRule, updateFlags: number): void {
    const owner = this.owner;
    if (owner == null || typeof owner !== "object" && typeof owner !== "function"
        || !("requireUpdate" in owner)) {
      return;
    }
    (owner as FastenerContext).requireUpdate!(updateFlags);
  };

  CssRule.prototype.decohereFastener = function (this: CssRule, fastener: Fastener): void {
    let decoherent = this.decoherent as Fastener[];
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

  CssRule.prototype.recohereFasteners = function (this: CssRule, t: number): void {
    const decoherent = this.decoherent;
    if (decoherent !== null) {
      const decoherentCount = decoherent.length;
      if (decoherentCount !== 0) {
        (this as Mutable<typeof this>).decoherent = null;
        for (let i = 0; i < decoherentCount; i += 1) {
          const fastener = decoherent[i]!;
          fastener.recohere(t);
        }
      }
    }
  };

  CssRule.prototype.recohere = function (this: CssRule, t: number): void {
    this.recohereFasteners(t);
    if (this.decoherent === null || this.decoherent.length === 0) {
      this.setCoherent(true);
    } else {
      this.setCoherent(false);
      this.decohere();
    }
  };

  CssRule.prototype.constraint = function (this: CssRule<ConstraintScope>, lhs: AnyConstraintExpression, relation: ConstraintRelation,
                                           rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint {
    return this.owner.constraint(lhs, relation, rhs, strength);
  };

  CssRule.prototype.hasConstraint = function (this: CssRule<ConstraintScope>, constraint: Constraint): boolean {
    return this.owner.hasConstraint(constraint);
  };

  CssRule.prototype.addConstraint = function (this: CssRule<ConstraintScope>, constraint: Constraint): void {
    this.owner.addConstraint(constraint);
  };

  CssRule.prototype.removeConstraint = function (this: CssRule<ConstraintScope>, constraint: Constraint): void {
    this.owner.removeConstraint(constraint);
  };

  CssRule.prototype.constraintVariable = function (this: CssRule<ConstraintScope>, name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number> {
    return this.owner.constraintVariable(name, value, strength);
  };

  CssRule.prototype.hasConstraintVariable = function (this: CssRule<ConstraintScope>, constraintVariable: ConstraintVariable): boolean {
    return this.owner.hasConstraintVariable(constraintVariable);
  };

  CssRule.prototype.addConstraintVariable = function (this: CssRule<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.addConstraintVariable(constraintVariable);
  };

  CssRule.prototype.removeConstraintVariable = function (this: CssRule<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.removeConstraintVariable(constraintVariable);
  };

  CssRule.prototype.setConstraintVariable = function (this: CssRule<ConstraintScope>, constraintVariable: ConstraintVariable, state: number): void {
    this.owner.setConstraintVariable(constraintVariable, state);
  };

  CssRule.prototype.getLook = function <T>(this: CssRule, look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined {
    const themeContext = this.owner;
    if (ThemeContext.is(themeContext)) {
      return themeContext.getLook(look, mood);
    } else {
      return void 0;
    }
  };

  CssRule.prototype.getLookOr = function <T, E>(this: CssRule, look: Look<T, unknown>, mood: MoodVector<Feel> | null | E, elseValue?: E): T | E {
    const themeContext = this.owner;
    if (ThemeContext.is(themeContext)) {
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

  CssRule.prototype.applyTheme = function (this: CssRule, theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    // hook
  };

  CssRule.prototype.willMount = function (this: CssRule): void {
    _super.prototype.willMount.call(this);
    (this as Mutable<typeof this>).rule = this.initRule();
  };

  CssRule.prototype.onMount = function (this: CssRule): void {
    _super.prototype.onMount.call(this);
    this.mountFasteners();
  };

  CssRule.prototype.onUnmount = function (this: CssRule): void {
    this.unmountFasteners();
    _super.prototype.onUnmount.call(this);
  };

  CssRule.prototype.didUnmount = function (this: CssRule): void {
    (this as Mutable<typeof this>).rule = null;
    _super.prototype.didUnmount.call(this);
  };

  CssRule.construct = function <F extends CssRule<any>>(rule: F | null, owner: FastenerOwner<F>): F {
    rule = _super.construct.call(this, rule, owner) as F;
    (rule as Mutable<typeof rule>).decoherent = null;
    (rule as Mutable<typeof rule>).rule = null;
    return rule;
  };

  return CssRule;
})(Fastener);
