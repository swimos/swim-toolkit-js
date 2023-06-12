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
import {Timing} from "@swim/util";
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
import {Look} from "@swim/theme";
import type {Feel} from "@swim/theme";
import {Mood} from "@swim/theme";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeContext} from "@swim/theme";
import type {CssContext} from "./CssContext";
import {CssRule} from "./CssRule";

/** @public */
export type StyleSheetDecorator<F extends StyleSheet<any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;
};

/** @public */
export interface StyleSheetDescriptor extends FastenerDescriptor {
  extends?: Proto<StyleSheet<any>> | boolean | null;
  css?: string;
}

/** @public */
export type StyleSheetTemplate<F extends StyleSheet<any>> =
  ThisType<F> &
  StyleSheetDescriptor &
  Partial<Omit<F, keyof StyleSheetDescriptor>>;

/** @public */
export interface StyleSheetClass<F extends StyleSheet<any> = StyleSheet<any>> extends FastenerClass<F> {
  /** @override */
  specialize(template: StyleSheetDescriptor): StyleSheetClass<F>;

  /** @override */
  refine(fastenerClass: StyleSheetClass<any>): void;

  /** @override */
  extend<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;
  extend<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;

  /** @override */
  define<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;
  define<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;

  /** @override */
  <F2 extends F>(template: StyleSheetTemplate<F2>): StyleSheetDecorator<F2>;
}

/** @public */
export interface StyleSheet<O = unknown> extends Fastener<O>, FastenerContext, ConstraintScope, ThemeContext, CssContext {
  /** @override */
  get fastenerType(): Proto<StyleSheet<any>>;

  /** @internal */
  initStylesheet(): CSSStyleSheet | null;

  readonly stylesheet: CSSStyleSheet | null;

  /** @override */
  getRule(index: number): CSSRule | null;

  /** @override */
  insertRule(css: string, index?: number): number;

  /** @override */
  removeRule(index: number): void;

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

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void;

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
export const StyleSheet = (function (_super: typeof Fastener) {
  const StyleSheet = _super.extend("StyleSheet", {}) as StyleSheetClass;

  Object.defineProperty(StyleSheet.prototype, "fastenerType", {
    value: StyleSheet,
    configurable: true,
  });

  StyleSheet.prototype.initStylesheet = function (this: StyleSheet): CSSStyleSheet | null {
    return null;
  };

  StyleSheet.prototype.getRule = function (this: StyleSheet, index: number): CSSRule | null {
    const stylesheet = this.stylesheet;
    if (stylesheet !== null) {
      return stylesheet.cssRules.item(index);
    } else {
      throw new Error("no stylesheet");
    }
  };

  StyleSheet.prototype.insertRule = function (this: StyleSheet, css: string, index?: number): number {
    const stylesheet = this.stylesheet;
    if (stylesheet !== null) {
      return stylesheet.insertRule(css, index);
    } else {
      throw new Error("no stylesheet");
    }
  };

  StyleSheet.prototype.removeRule = function (this: StyleSheet, index: number): void {
    const stylesheet = this.stylesheet;
    if (stylesheet !== null) {
      stylesheet.deleteRule(index);
    } else {
      throw new Error("no stylesheet");
    }
  };

  StyleSheet.prototype.getParentFastener = function (this: StyleSheet, fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null {
    return null;
  };

  StyleSheet.prototype.mountFasteners = function (this: StyleSheet): void {
    const fastenerNames = FastenerContext.getFastenerNames(this);
    for (let i = 0; i < fastenerNames.length; i += 1) {
      const fastener = this[fastenerNames[i]!];
      if (fastener instanceof Fastener) {
        fastener.mount();
      }
    }
  };

  StyleSheet.prototype.unmountFasteners = function (this: StyleSheet): void {
    const fastenerNames = FastenerContext.getFastenerNames(this);
    for (let i = 0; i < fastenerNames.length; i += 1) {
      const fastener = this[fastenerNames[i]!];
      if (fastener instanceof Fastener) {
        fastener.unmount();
      }
    }
  };

  StyleSheet.prototype.requireUpdate = function (this: StyleSheet, updateFlags: number): void {
    const owner = this.owner;
    if (owner == null || typeof owner !== "object" && typeof owner !== "function"
        || !("requireUpdate" in owner)) {
      return;
    }
    (owner as FastenerContext).requireUpdate!(updateFlags);
  };

  StyleSheet.prototype.decohereFastener = function (this: StyleSheet, fastener: Fastener): void {
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

  StyleSheet.prototype.recohereFasteners = function (this: StyleSheet, t: number): void {
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

  StyleSheet.prototype.recohere = function (this: StyleSheet, t: number): void {
    this.recohereFasteners(t);
    if (this.decoherent === null || this.decoherent.length === 0) {
      this.setCoherent(true);
    } else {
      this.setCoherent(false);
      this.decohere();
    }
  };

  StyleSheet.prototype.constraint = function (this: StyleSheet<ConstraintScope>, lhs: AnyConstraintExpression, relation: ConstraintRelation,
                                              rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint {
    return this.owner.constraint(lhs, relation, rhs, strength);
  };

  StyleSheet.prototype.hasConstraint = function (this: StyleSheet<ConstraintScope>, constraint: Constraint): boolean {
    return this.owner.hasConstraint(constraint);
  };

  StyleSheet.prototype.addConstraint = function (this: StyleSheet<ConstraintScope>, constraint: Constraint): void {
    this.owner.addConstraint(constraint);
  };

  StyleSheet.prototype.removeConstraint = function (this: StyleSheet<ConstraintScope>, constraint: Constraint): void {
    this.owner.removeConstraint(constraint);
  };

  StyleSheet.prototype.constraintVariable = function (this: StyleSheet<ConstraintScope>, name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number> {
    return this.owner.constraintVariable(name, value, strength);
  };

  StyleSheet.prototype.hasConstraintVariable = function (this: StyleSheet<ConstraintScope>, constraintVariable: ConstraintVariable): boolean {
    return this.owner.hasConstraintVariable(constraintVariable);
  };

  StyleSheet.prototype.addConstraintVariable = function (this: StyleSheet<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.addConstraintVariable(constraintVariable);
  };

  StyleSheet.prototype.removeConstraintVariable = function (this: StyleSheet<ConstraintScope>, constraintVariable: ConstraintVariable): void {
    this.owner.removeConstraintVariable(constraintVariable);
  };

  StyleSheet.prototype.setConstraintVariable = function (this: StyleSheet<ConstraintScope>, constraintVariable: ConstraintVariable, state: number): void {
    this.owner.setConstraintVariable(constraintVariable, state);
  };

  StyleSheet.prototype.getLook = function <T>(this: StyleSheet, look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined {
    const themeContext = this.owner;
    if (ThemeContext.is(themeContext)) {
      return themeContext.getLook(look, mood);
    } else {
      return void 0;
    }
  };

  StyleSheet.prototype.getLookOr = function <T, E>(this: StyleSheet, look: Look<T, unknown>, mood: MoodVector<Feel> | null | E, elseValue?: E): T | E {
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

  StyleSheet.prototype.applyTheme = function (this: StyleSheet, theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    if (timing === void 0 || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    const fastenerNames = FastenerContext.getFastenerNames(this);
    for (let i = 0; i < fastenerNames.length; i += 1) {
      const fastener = this[fastenerNames[i]!];
      if (fastener instanceof CssRule) {
        fastener.applyTheme(theme, mood, timing);
      }
    }
  };

  StyleSheet.prototype.willMount = function (this: StyleSheet): void {
    _super.prototype.willMount.call(this);
    (this as Mutable<typeof this>).stylesheet = this.initStylesheet();
  };

  StyleSheet.prototype.onMount = function (this: StyleSheet): void {
    _super.prototype.onMount.call(this);
    this.mountFasteners();
  };

  StyleSheet.prototype.onUnmount = function (this: StyleSheet): void {
    this.unmountFasteners();
    _super.prototype.onUnmount.call(this);
  };

  StyleSheet.prototype.didUnmount = function (this: StyleSheet): void {
    (this as Mutable<typeof this>).stylesheet = null;
    _super.prototype.didUnmount.call(this);
  };

  StyleSheet.construct = function <F extends StyleSheet<any>>(sheet: F | null, owner: FastenerOwner<F>): F {
    sheet = _super.construct.call(this, sheet, owner) as F;
    (sheet as Mutable<typeof sheet>).decoherent = null;
    (sheet as Mutable<typeof sheet>).stylesheet = null;
    return sheet;
  };

  return StyleSheet;
})(Fastener);
