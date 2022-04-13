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

import type {Mutable, Proto} from "@swim/util";
import {
  Affinity,
  FastenerFlags,
  FastenerOwner,
  AnimatorValue,
  AnimatorValueInit,
} from "@swim/component";
import {
  ConstraintId,
  ConstraintMap,
  AnyConstraintExpression,
  ConstraintExpression,
  ConstraintTerm,
  ConstraintVariable,
  AnyConstraintStrength,
  ConstraintStrength,
  Constraint,
  ConstraintScope,
  ConstraintSolver,
} from "@swim/constraint";
import {
  ThemeAnimatorRefinement,
  ThemeAnimatorTemplate,
  ThemeAnimatorClass,
  ThemeAnimator,
} from "./ThemeAnimator";

/** @public */
export interface ThemeConstraintAnimatorRefinement extends ThemeAnimatorRefinement {
}

/** @public */
export interface ThemeConstraintAnimatorTemplate<T = unknown, U = T> extends ThemeAnimatorTemplate<T, U> {
  extends?: Proto<ThemeConstraintAnimator<any, any, any>> | string | boolean | null;
  strength?: AnyConstraintStrength;
  constrained?: boolean;
}

/** @public */
export interface ThemeConstraintAnimatorClass<A extends ThemeConstraintAnimator<any, any> = ThemeConstraintAnimator<any, any>> extends ThemeAnimatorClass<A> {
  /** @override */
  specialize(className: string, template: ThemeConstraintAnimatorTemplate): ThemeConstraintAnimatorClass;

  /** @override */
  refine(animatorClass: ThemeConstraintAnimatorClass): void;

  /** @override */
  extend(className: string, template: ThemeConstraintAnimatorTemplate): ThemeConstraintAnimatorClass<A>;

  /** @override */
  specify<O, T = unknown, U = T>(className: string, template: ThisType<ThemeConstraintAnimator<O, T, U>> & ThemeConstraintAnimatorTemplate<T, U> & Partial<Omit<ThemeConstraintAnimator<O, T, U>, keyof ThemeConstraintAnimatorTemplate>>): ThemeConstraintAnimatorClass<A>;

  /** @override */
  <O, T = unknown, U = T>(template: ThisType<ThemeConstraintAnimator<O, T, U>> & ThemeConstraintAnimatorTemplate<T, U> & Partial<Omit<ThemeConstraintAnimator<O, T, U>, keyof ThemeConstraintAnimatorTemplate>>): PropertyDecorator;

  /** @internal */
  readonly ConstrainedFlag: FastenerFlags;
  /** @internal */
  readonly ConstrainingFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type ThemeConstraintAnimatorDef<O, R extends ThemeConstraintAnimatorRefinement> =
  ThemeConstraintAnimator<O, AnimatorValue<R>, AnimatorValueInit<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {});

/** @public */
export function ThemeConstraintAnimatorDef<A extends ThemeConstraintAnimator<any, any, any>>(
  template: A extends ThemeConstraintAnimatorDef<infer O, infer R>
          ? ThisType<ThemeConstraintAnimatorDef<O, R>>
          & ThemeConstraintAnimatorTemplate<AnimatorValue<R>, AnimatorValueInit<R>>
          & Partial<Omit<ThemeConstraintAnimator<O, AnimatorValue<R>, AnimatorValueInit<R>>, keyof ThemeConstraintAnimatorTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ThemeConstraintAnimatorTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          : never
): PropertyDecorator {
  return ThemeConstraintAnimator(template);
}

/** @public */
export interface ThemeConstraintAnimator<O = unknown, T = unknown, U = T> extends ThemeAnimator<O, T, U>, ConstraintVariable {
  /** @internal @override */
  readonly id: number;

  /** @internal @override */
  isExternal(): boolean;

  /** @internal @override */
  isDummy(): boolean;

  /** @internal @override */
  isInvalid(): boolean;

  /** @override */
  isConstant(): boolean;

  /** @internal @override */
  evaluateConstraintVariable(): void;

  /** @internal @override */
  updateConstraintSolution(value: number): void;

  /** @internal @protected */
  initStrength(): ConstraintStrength;

  /** @override */
  readonly strength: ConstraintStrength;

  setStrength(strength: AnyConstraintStrength): void;

  /** @override */
  get coefficient(): number;

  /** @override */
  get variable(): ConstraintVariable | null;

  /** @override */
  get terms(): ConstraintMap<ConstraintVariable, number>;

  /** @override */
  get constant(): number;

  /** @override */
  plus(that: AnyConstraintExpression): ConstraintExpression;

  /** @override */
  negative(): ConstraintTerm;

  /** @override */
  minus(that: AnyConstraintExpression): ConstraintExpression;

  /** @override */
  times(scalar: number): ConstraintExpression;

  /** @override */
  divide(scalar: number): ConstraintExpression;

  get constrained(): boolean;

  constrain(constrained?: boolean): this;

  /** @internal */
  readonly conditionCount: number;

  /** @internal @override */
  addConstraintCondition(constraint: Constraint, solver: ConstraintSolver): void;

  /** @internal @override */
  removeConstraintCondition(constraint: Constraint, solver: ConstraintSolver): void;

  /** @internal */
  get constraining(): boolean;

  /** @internal */
  startConstraining(): void;

  /** @protected */
  willStartConstraining(): void;

  /** @protected */
  onStartConstraining(): void;

  /** @protected */
  didStartConstraining(): void;

  /** @internal */
  stopConstraining(): void;

  /** @protected */
  willStopConstraining(): void;

  /** @protected */
  onStopConstraining(): void;

  /** @protected */
  didStopConstraining(): void;

  /** @internal */
  updateConstraintVariable(): void;

  /** @protected @override */
  onSetValue(newValue: T, oldValue: T): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;

  /** @internal @protected */
  toNumber(value: T): number;
}

/** @public */
export const ThemeConstraintAnimator = (function (_super: typeof ThemeAnimator) {
  const ThemeConstraintAnimator = _super.extend("ThemeConstraintAnimator", {}) as ThemeConstraintAnimatorClass;

  ThemeConstraintAnimator.prototype.isExternal = function (this: ThemeConstraintAnimator): boolean {
    return true;
  };

  ThemeConstraintAnimator.prototype.isDummy = function (this: ThemeConstraintAnimator): boolean {
    return false;
  };

  ThemeConstraintAnimator.prototype.isInvalid = function (this: ThemeConstraintAnimator): boolean {
    return false;
  };

  ThemeConstraintAnimator.prototype.isConstant = function (this: ThemeConstraintAnimator): boolean {
    return false;
  };

  ThemeConstraintAnimator.prototype.evaluateConstraintVariable = function <T>(this: ThemeConstraintAnimator<unknown, T>): void {
    // hook
  };

  ThemeConstraintAnimator.prototype.updateConstraintSolution = function <T>(this: ThemeConstraintAnimator<unknown, T>, state: number): void {
    if (this.constrained && this.toNumber(this.state) !== state) {
      this.setState(state as unknown as T, Affinity.Reflexive);
    }
  };

  ThemeConstraintAnimator.prototype.initStrength = function (this: ThemeConstraintAnimator): ConstraintStrength {
    let strength = (Object.getPrototypeOf(this) as ThemeConstraintAnimator).strength as ConstraintStrength | undefined;
    if (strength === void 0) {
      strength = ConstraintStrength.Strong;
    }
    return strength;
  };

  ThemeConstraintAnimator.prototype.setStrength = function (this: ThemeConstraintAnimator, strength: AnyConstraintStrength): void {
    (this as Mutable<typeof this>).strength = ConstraintStrength.fromAny(strength);
  };

  Object.defineProperty(ThemeConstraintAnimator.prototype, "coefficient", {
    value: 1,
    configurable: true,
  });

  Object.defineProperty(ThemeConstraintAnimator.prototype, "variable", {
    get(this: ThemeConstraintAnimator): ConstraintVariable {
      return this;
    },
    configurable: true,
  });

  Object.defineProperty(ThemeConstraintAnimator.prototype, "terms", {
    get(this: ThemeConstraintAnimator): ConstraintMap<ConstraintVariable, number> {
      const terms = new ConstraintMap<ConstraintVariable, number>();
      terms.set(this, 1);
      return terms;
    },
    configurable: true,
  });

  Object.defineProperty(ThemeConstraintAnimator.prototype, "constant", {
    value: 0,
    configurable: true,
  });

  ThemeConstraintAnimator.prototype.plus = function (this: ThemeConstraintAnimator, that: AnyConstraintExpression): ConstraintExpression {
    that = ConstraintExpression.fromAny(that);
    if (this === that) {
      return ConstraintExpression.product(2, this);
    } else {
      return ConstraintExpression.sum(this, that);
    }
  };

  ThemeConstraintAnimator.prototype.negative = function (this: ThemeConstraintAnimator): ConstraintTerm {
    return ConstraintExpression.product(-1, this);
  };

  ThemeConstraintAnimator.prototype.minus = function (this: ThemeConstraintAnimator, that: AnyConstraintExpression): ConstraintExpression {
    that = ConstraintExpression.fromAny(that);
    if (this === that) {
      return ConstraintExpression.zero;
    } else {
      return ConstraintExpression.sum(this, that.negative());
    }
  };

  ThemeConstraintAnimator.prototype.times = function (this: ThemeConstraintAnimator, scalar: number): ConstraintExpression {
    return ConstraintExpression.product(scalar, this);
  };

  ThemeConstraintAnimator.prototype.divide = function (this: ThemeConstraintAnimator, scalar: number): ConstraintExpression {
    return ConstraintExpression.product(1 / scalar, this);
  };

  Object.defineProperty(ThemeConstraintAnimator.prototype, "constrained", {
    get(this: ThemeConstraintAnimator): boolean {
      return (this.flags & ThemeConstraintAnimator.ConstrainedFlag) !== 0;
    },
    configurable: true,
  });

  ThemeConstraintAnimator.prototype.constrain = function (this: ThemeConstraintAnimator<unknown, unknown, unknown>, constrained?: boolean): typeof this {
    if (constrained === void 0) {
      constrained = true;
    }
    const flags = this.flags;
    if (constrained && (flags & ThemeConstraintAnimator.ConstrainedFlag) === 0) {
      this.setFlags(flags | ThemeConstraintAnimator.ConstrainedFlag);
      if (this.conditionCount !== 0 && this.mounted) {
        this.stopConstraining();
      }
    } else if (!constrained && (flags & ThemeConstraintAnimator.ConstrainedFlag) !== 0) {
      this.setFlags(flags & ~ThemeConstraintAnimator.ConstrainedFlag);
      if (this.conditionCount !== 0 && this.mounted) {
        this.startConstraining();
        this.updateConstraintVariable();
      }
    }
    return this;
  };

  ThemeConstraintAnimator.prototype.addConstraintCondition = function (this: ThemeConstraintAnimator, constraint: Constraint, solver: ConstraintSolver): void {
    (this as Mutable<typeof this>).conditionCount += 1;
    if (!this.constrained && this.conditionCount === 1 && this.mounted) {
      this.startConstraining();
      this.updateConstraintVariable();
    }
  };

  ThemeConstraintAnimator.prototype.removeConstraintCondition = function (this: ThemeConstraintAnimator, constraint: Constraint, solver: ConstraintSolver): void {
    (this as Mutable<typeof this>).conditionCount -= 1;
    if (!this.constrained && this.conditionCount === 0 && this.mounted) {
      this.stopConstraining();
    }
  };

  Object.defineProperty(ThemeConstraintAnimator.prototype, "constraining", {
    get(this: ThemeConstraintAnimator): boolean {
      return (this.flags & ThemeConstraintAnimator.ConstrainingFlag) !== 0;
    },
    configurable: true,
  });

  ThemeConstraintAnimator.prototype.startConstraining = function (this: ThemeConstraintAnimator): void {
    if ((this.flags & ThemeConstraintAnimator.ConstrainingFlag) === 0) {
      this.willStartConstraining();
      this.setFlags(this.flags | ThemeConstraintAnimator.ConstrainingFlag);
      this.onStartConstraining();
      this.didStartConstraining();
    }
  };

  ThemeConstraintAnimator.prototype.willStartConstraining = function (this: ThemeConstraintAnimator): void {
    // hook
  };

  ThemeConstraintAnimator.prototype.onStartConstraining = function (this: ThemeConstraintAnimator): void {
    const constraintScope = this.owner;
    if (ConstraintScope.is(constraintScope)) {
      constraintScope.addConstraintVariable(this);
    }
  };

  ThemeConstraintAnimator.prototype.didStartConstraining = function (this: ThemeConstraintAnimator): void {
    // hook
  };

  ThemeConstraintAnimator.prototype.stopConstraining = function (this: ThemeConstraintAnimator): void {
    if ((this.flags & ThemeConstraintAnimator.ConstrainingFlag) !== 0) {
      this.willStopConstraining();
      this.setFlags(this.flags & ~ThemeConstraintAnimator.ConstrainingFlag);
      this.onStopConstraining();
      this.didStopConstraining();
    }
  };

  ThemeConstraintAnimator.prototype.willStopConstraining = function (this: ThemeConstraintAnimator): void {
    // hook
  };

  ThemeConstraintAnimator.prototype.onStopConstraining = function (this: ThemeConstraintAnimator): void {
    const constraintScope = this.owner;
    if (ConstraintScope.is(constraintScope)) {
      constraintScope.removeConstraintVariable(this);
    }
  };

  ThemeConstraintAnimator.prototype.didStopConstraining = function (this: ThemeConstraintAnimator): void {
    // hook
  };

  ThemeConstraintAnimator.prototype.updateConstraintVariable = function (this: ThemeConstraintAnimator): void {
    const constraintScope = this.owner;
    const value = this.value;
    if (value !== void 0 && ConstraintScope.is(constraintScope)) {
      constraintScope.setConstraintVariable(this, this.toNumber(value));
    }
  };

  ThemeConstraintAnimator.prototype.onSetValue = function <T>(this: ThemeConstraintAnimator<unknown, T>, newValue: T, oldValue: T): void {
    _super.prototype.onSetValue.call(this, newValue, oldValue);
    const constraintScope = this.owner;
    if (this.constraining && ConstraintScope.is(constraintScope)) {
      constraintScope.setConstraintVariable(this, newValue !== void 0 && newValue !== null ? this.toNumber(newValue) : 0);
    }
  };

  ThemeConstraintAnimator.prototype.onMount = function <T>(this: ThemeConstraintAnimator<unknown, T>): void {
    _super.prototype.onMount.call(this);
    if (!this.constrained && this.conditionCount !== 0) {
      this.startConstraining();
    }
  };

  ThemeConstraintAnimator.prototype.onUnmount = function <T>(this: ThemeConstraintAnimator<unknown, T>): void {
    if (!this.constrained && this.conditionCount !== 0) {
      this.stopConstraining();
    }
    _super.prototype.onUnmount.call(this);
  };

  ThemeConstraintAnimator.prototype.toNumber = function <T>(this: ThemeConstraintAnimator<unknown, T>, value: T): number {
    return value !== void 0 && value !== null ? +value : 0;
  };

  ThemeConstraintAnimator.construct = function <A extends ThemeConstraintAnimator<any, any>>(animator: A | null, owner: FastenerOwner<A>): A {
    animator = _super.construct.call(this, animator, owner) as A;
    (animator as Mutable<typeof animator>).id = ConstraintId.next();
    (animator as Mutable<typeof animator>).strength = animator.initStrength();
    (animator as Mutable<typeof animator>).conditionCount = 0;
    const flagsInit = animator.flagsInit;
    if (flagsInit !== void 0) {
      animator.constrain((flagsInit & ThemeConstraintAnimator.ConstrainedFlag) !== 0);
    }
    return animator;
  };

  ThemeConstraintAnimator.refine = function (animatorClass: ThemeConstraintAnimatorClass): void {
    _super.refine.call(this, animatorClass);
    const animatorPrototype = animatorClass.prototype;
    let flagsInit = animatorPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(animatorPrototype, "constrained")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (animatorPrototype.constrained) {
        flagsInit |= ThemeConstraintAnimator.ConstrainedFlag;
      } else {
        flagsInit &= ~ThemeConstraintAnimator.ConstrainedFlag;
      }
      delete (animatorPrototype as ThemeConstraintAnimatorTemplate).constrained;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(animatorPrototype, "flagsInit", {
        value: flagsInit,
        configurable: true,
      });
    }

    if (Object.prototype.hasOwnProperty.call(animatorPrototype, "strength")) {
      Object.defineProperty(animatorPrototype, "strength", {
        value: animatorPrototype.fromAny(animatorPrototype.strength),
        enumerable: true,
        configurable: true,
      });
    }
  };

  (ThemeConstraintAnimator as Mutable<typeof ThemeConstraintAnimator>).ConstrainedFlag = 1 << (_super.FlagShift + 0);
  (ThemeConstraintAnimator as Mutable<typeof ThemeConstraintAnimator>).ConstrainingFlag = 1 << (_super.FlagShift + 1);

  (ThemeConstraintAnimator as Mutable<typeof ThemeConstraintAnimator>).FlagShift = _super.FlagShift + 2;
  (ThemeConstraintAnimator as Mutable<typeof ThemeConstraintAnimator>).FlagMask = (1 << ThemeConstraintAnimator.FlagShift) - 1;

  return ThemeConstraintAnimator;
})(ThemeAnimator);
