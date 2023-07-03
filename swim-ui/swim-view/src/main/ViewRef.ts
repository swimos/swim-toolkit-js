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
import {Affinity} from "@swim/component";
import {FastenerContext} from "@swim/component";
import {Fastener} from "@swim/component";
import type {AnyConstraintExpression} from "@swim/constraint";
import {ConstraintExpression} from "@swim/constraint";
import type {ConstraintVariable} from "@swim/constraint";
import {ConstraintProperty} from "@swim/constraint";
import type {ConstraintRelation} from "@swim/constraint";
import type {AnyConstraintStrength} from "@swim/constraint";
import {ConstraintStrength} from "@swim/constraint";
import {Constraint} from "@swim/constraint";
import type {ConstraintScope} from "@swim/constraint";
import type {ConstraintContext} from "@swim/constraint";
import type {AnyView} from "./View";
import type {View} from "./View";
import type {ViewRelationDescriptor} from "./ViewRelation";
import type {ViewRelationClass} from "./ViewRelation";
import {ViewRelation} from "./ViewRelation";

/** @public */
export interface ViewRefDescriptor<V extends View = View> extends ViewRelationDescriptor<V> {
  extends?: Proto<ViewRef<any, any>> | boolean | null;
  viewKey?: string | boolean;
}

/** @public */
export interface ViewRefClass<F extends ViewRef<any, any> = ViewRef<any, any>> extends ViewRelationClass<F> {
  tryView<O, K extends keyof O, F extends O[K] = O[K]>(owner: O, fastenerName: K): F extends ViewRef<any, infer V> ? V | null : null;
}

/** @public */
export interface ViewRef<O = unknown, V extends View = View> extends ViewRelation<O, V>, ConstraintScope, ConstraintContext {
  (): V | null;
  (view: AnyView<V> | null, target?: View | null, key?: string): O;

  /** @override */
  get descriptorType(): Proto<ViewRefDescriptor<V>>;

  /** @override */
  get fastenerType(): Proto<ViewRef<any, any>>;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  willDerive(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  onDerive(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  didDerive(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  willUnderive(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  onUnderive(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  didUnderive(inlet: ViewRef<unknown, V>): void;

  /** @override */
  get parent(): ViewRef<unknown, V> | null;

  /** @override */
  readonly inlet: ViewRef<unknown, V> | null;

  /** @override */
  bindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  willBindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  onBindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  didBindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ViewRef<unknown, V>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ViewRef<unknown, V>): void;

  /** @internal @override */
  readonly outlets: ReadonlyArray<ViewRef<unknown, V>> | null;

  /** @internal @override */
  attachOutlet(outlet: ViewRef<unknown, V>): void;

  /** @internal @override */
  detachOutlet(outlet: ViewRef<unknown, V>): void;

  get inletView(): V | null;

  getInletView(): V;

  /** @internal */
  readonly viewKey?: string; // optional prototype property

  readonly view: V | null;

  getView(): V;

  setView(view: AnyView<V> | null, target?: View | null, key?: string): V | null;

  attachView(view?: AnyView<V>, target?: View | null): V;

  detachView(): V | null;

  insertView(parent?: View | null, view?: AnyView<V>, target?: View | null, key?: string): V;

  removeView(): V | null;

  deleteView(): V | null;

  /** @internal @override */
  bindView(view: View, target: View | null): void;

  /** @internal @override */
  unbindView(view: View): void;

  /** @override */
  detectView(view: View): V | null;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ViewRef<unknown, V>): void;

  /** @override */
  recohere(t: number): void;

  constraint(lhs: AnyConstraintExpression, relation: ConstraintRelation, rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint;

  /** @internal */
  readonly constraints: ReadonlySet<Constraint> | null;

  /** @override */
  hasConstraint(constraint: Constraint): boolean;

  /** @override */
  addConstraint(constraint: Constraint): void;

  /** @override */
  removeConstraint(constraint: Constraint): void;

  /** @override */
  activateConstraint(constraint: Constraint): void;

  /** @override */
  deactivateConstraint(constraint: Constraint): void;

  /** @override */
  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number>;

  /** @internal */
  readonly constraintVariables: ReadonlySet<ConstraintVariable> | null;

  /** @override */
  hasConstraintVariable(variable: ConstraintVariable): boolean;

  /** @override */
  addConstraintVariable(variable: ConstraintVariable): void;

  /** @override */
  removeConstraintVariable(variable: ConstraintVariable): void;

  /** @override */
  activateConstraintVariable(constraintVariable: ConstraintVariable): void;

  /** @override */
  deactivateConstraintVariable(constraintVariable: ConstraintVariable): void;

  /** @override */
  setConstraintVariable(constraintVariable: ConstraintVariable, state: number): void;

  /** @internal @protected */
  activateLayout(): void;

  /** @internal @protected */
  deactivateLayout(): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const ViewRef = (function (_super: typeof ViewRelation) {
  const ViewRef = _super.extend("ViewRef", {}) as ViewRefClass;

  Object.defineProperty(ViewRef.prototype, "fastenerType", {
    value: ViewRef,
    enumerable: true,
    configurable: true,
  });

  ViewRef.prototype.onDerive = function (this: ViewRef, inlet: ViewRef): void {
    const inletView = inlet.view;
    if (inletView !== null) {
      this.attachView(inletView);
    } else {
      this.detachView();
    }
  };

  Object.defineProperty(ViewRef.prototype, "inletView", {
    get: function <V extends View>(this: ViewRef<unknown, V>): V | null {
      const inlet = this.inlet;
      return inlet !== null ? inlet.view : null;
    },
    enumerable: true,
    configurable: true,
  });

  ViewRef.prototype.getInletView = function <V extends View>(this: ViewRef<unknown, V>): V {
    const inletView = this.inletView;
    if (inletView === void 0 || inletView === null) {
      let message = inletView + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet view";
      throw new TypeError(message);
    }
    return inletView;
  };

  ViewRef.prototype.getView = function <V extends View>(this: ViewRef<unknown, V>): V {
    const view = this.view;
    if (view === null) {
      let message = view + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "view";
      throw new TypeError(message);
    }
    return view;
  };

  ViewRef.prototype.setView = function <V extends View>(this: ViewRef<unknown, V>, newView: AnyView<V> | null, target?: View | null, key?: string): V | null {
    if (newView !== null) {
      newView = this.fromAny(newView);
    }
    if (target === void 0) {
      target = null;
    }
    let oldView = this.view;
    if (oldView === newView) {
      this.setCoherent(true);
      return oldView;
    }
    let parent: View | null;
    if (this.binds && (parent = this.parentView, parent !== null)) {
      if (oldView !== null && oldView.parent === parent) {
        if (target === null) {
          target = oldView.nextSibling;
        }
        oldView.remove();
      }
      if (newView !== null) {
        if (key === void 0) {
          key = this.viewKey;
        }
        this.insertChild(parent, newView, target, key);
      }
      oldView = this.view;
      if (oldView === newView) {
        return oldView;
      }
    }
    if (oldView !== null) {
      this.deactivateLayout();
      (this as Mutable<typeof this>).view = null;
      this.willDetachView(oldView);
      this.onDetachView(oldView);
      this.deinitView(oldView);
      this.didDetachView(oldView);
    }
    if (newView !== null) {
      (this as Mutable<typeof this>).view = newView;
      this.willAttachView(newView, target);
      this.onAttachView(newView, target);
      this.initView(newView);
      this.didAttachView(newView, target);
    }
    this.setCoherent(true);
    this.decohereOutlets();
    return oldView;
  };

  ViewRef.prototype.attachView = function <V extends View>(this: ViewRef<unknown, V>, newView?: AnyView<V>, target?: View | null): V {
    const oldView = this.view;
    if (newView !== void 0 && newView !== null) {
      newView = this.fromAny(newView);
    } else if (oldView === null) {
      newView = this.createView();
    } else {
      newView = oldView;
    }
    if (oldView !== newView) {
      if (target === void 0) {
        target = null;
      }
      if (oldView !== null) {
        this.deactivateLayout();
        (this as Mutable<typeof this>).view = null;
        this.willDetachView(oldView);
        this.onDetachView(oldView);
        this.deinitView(oldView);
        this.didDetachView(oldView);
      }
      (this as Mutable<typeof this>).view = newView;
      this.willAttachView(newView, target);
      this.onAttachView(newView, target);
      this.initView(newView);
      this.didAttachView(newView, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newView;
  };

  ViewRef.prototype.detachView = function <V extends View>(this: ViewRef<unknown, V>): V | null {
    const oldView = this.view;
    if (oldView !== null) {
      this.deactivateLayout();
      (this as Mutable<typeof this>).view = null;
      this.willDetachView(oldView);
      this.onDetachView(oldView);
      this.deinitView(oldView);
      this.didDetachView(oldView);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return oldView;
  };

  ViewRef.prototype.insertView = function <V extends View>(this: ViewRef<unknown, V>, parent?: View | null, newView?: AnyView<V>, target?: View | null, key?: string): V {
    let oldView = this.view;
    if (newView !== void 0 && newView !== null) {
      newView = this.fromAny(newView);
    } else if (oldView === null) {
      newView = this.createView();
    } else {
      newView = oldView;
    }
    if (parent === void 0) {
      parent = null;
    }
    if (this.binds || oldView !== newView || newView.parent === null || parent !== null || key !== void 0) {
      if (parent === null) {
        parent = this.parentView;
      }
      if (target === void 0) {
        target = null;
      }
      if (key === void 0) {
        key = this.viewKey;
      }
      if (parent !== null && (newView.parent !== parent || newView.key !== key)) {
        this.insertChild(parent, newView, target, key);
      }
      oldView = this.view;
      if (oldView !== newView) {
        if (oldView !== null) {
          this.deactivateLayout();
          (this as Mutable<typeof this>).view = null;
          this.willDetachView(oldView);
          this.onDetachView(oldView);
          this.deinitView(oldView);
          this.didDetachView(oldView);
          if (this.binds && parent !== null && oldView.parent === parent) {
            oldView.remove();
          }
        }
        (this as Mutable<typeof this>).view = newView;
        this.willAttachView(newView, target);
        this.onAttachView(newView, target);
        this.initView(newView);
        this.didAttachView(newView, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
    return newView;
  };

  ViewRef.prototype.removeView = function <V extends View>(this: ViewRef<unknown, V>): V | null {
    const view = this.view;
    if (view !== null) {
      view.remove();
    }
    return view;
  };

  ViewRef.prototype.deleteView = function <V extends View>(this: ViewRef<unknown, V>): V | null {
    const view = this.detachView();
    if (view !== null) {
      view.remove();
    }
    return view;
  };

  ViewRef.prototype.bindView = function <V extends View>(this: ViewRef<unknown, V>, view: View, target: View | null): void {
    if (!this.binds || this.view !== null) {
      return;
    }
    const newView = this.detectView(view);
    if (newView === null) {
      return;
    }
    (this as Mutable<typeof this>).view = newView;
    this.willAttachView(newView, target);
    this.onAttachView(newView, target);
    this.initView(newView);
    this.didAttachView(newView, target);
    this.setCoherent(true);
    this.decohereOutlets();
  };

  ViewRef.prototype.unbindView = function <V extends View>(this: ViewRef<unknown, V>, view: View): void {
    if (!this.binds) {
      return;
    }
    const oldView = this.detectView(view);
    if (oldView === null || this.view !== oldView) {
      return;
    }
    this.deactivateLayout();
    (this as Mutable<typeof this>).view = null;
    this.willDetachView(oldView);
    this.onDetachView(oldView);
    this.deinitView(oldView);
    this.didDetachView(oldView);
    this.setCoherent(true);
    this.decohereOutlets();
  };

  ViewRef.prototype.detectView = function <V extends View>(this: ViewRef<unknown, V>, view: View): V | null {
    const viewKey = this.viewKey;
    if (viewKey !== void 0 && viewKey === view.key) {
      return view as V;
    }
    return null;
  };

  ViewRef.prototype.decohereOutlets = function (this: ViewRef): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ViewRef.prototype.decohereOutlet = function (this: ViewRef, outlet: ViewRef): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ViewRef.prototype.recohere = function (this: ViewRef, t: number): void {
    let inlet: ViewRef | null;
    if ((this.flags & Fastener.DerivedFlag) === 0 || (inlet = this.inlet) === null) {
      return;
    }
    this.setView(inlet.view);
  };

  ViewRef.prototype.constraint = function (this: ViewRef<ConstraintScope & ConstraintContext, View>, lhs: AnyConstraintExpression, relation: ConstraintRelation, rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint {
    lhs = ConstraintExpression.fromAny(lhs);
    rhs = ConstraintExpression.fromAny(rhs);
    const expression = rhs !== void 0 ? lhs.minus(rhs) : lhs;
    if (strength === void 0) {
      strength = ConstraintStrength.Required;
    } else {
      strength = ConstraintStrength.fromAny(strength);
    }
    const constraint = new Constraint(this.owner, expression, relation, strength);
    this.addConstraint(constraint);
    return constraint;
  };

  ViewRef.prototype.hasConstraint = function (this: ViewRef, constraint: Constraint): boolean {
    const constraints = this.constraints;
    return constraints !== null && constraints.has(constraint);
  };

  ViewRef.prototype.addConstraint = function (this: ViewRef, constraint: Constraint): void {
    let constraints = this.constraints as Set<Constraint> | null;
    if (constraints === null) {
      constraints = new Set<Constraint>();
      (this as Mutable<typeof this>).constraints = constraints;
    } else if (constraints.has(constraint)) {
      return;
    }
    constraints.add(constraint);
    this.activateConstraint(constraint);
  };

  ViewRef.prototype.removeConstraint = function (this: ViewRef, constraint: Constraint): void {
    const constraints = this.constraints as Set<Constraint> | null;
    if (constraints === null || !constraints.has(constraint)) {
      return;
    }
    this.deactivateConstraint(constraint);
    constraints.delete(constraint);
  };

  ViewRef.prototype.activateConstraint = function (this: ViewRef<ConstraintContext, View>, constraint: Constraint): void {
    this.owner.activateConstraint(constraint);
  };

  ViewRef.prototype.deactivateConstraint = function (this: ViewRef<ConstraintContext, View>, constraint: Constraint): void {
    this.owner.deactivateConstraint(constraint);
  };

  ViewRef.prototype.constraintVariable = function (this: ViewRef, name: string, value?: number, strength?: AnyConstraintStrength): ConstraintProperty<unknown, number> {
    if (value === void 0) {
      value = 0;
    }
    if (strength !== void 0) {
      strength = ConstraintStrength.fromAny(strength);
    } else {
      strength = ConstraintStrength.Strong;
    }
    const property = ConstraintProperty.create(this) as ConstraintProperty<unknown, number>;
    Object.defineProperty(property, "name", {
      value: name,
      enumerable: true,
      configurable: true,
    });
    if (value !== void 0) {
      property.setValue(value);
    }
    property.setStrength(strength);
    property.mount();
    return property;
  };

  ViewRef.prototype.hasConstraintVariable = function (this: ViewRef, constraintVariable: ConstraintVariable): boolean {
    const constraintVariables = this.constraintVariables;
    return constraintVariables !== null && constraintVariables.has(constraintVariable);
  };

  ViewRef.prototype.addConstraintVariable = function (this: ViewRef, constraintVariable: ConstraintVariable): void {
    let constraintVariables = this.constraintVariables as Set<ConstraintVariable> | null;
    if (constraintVariables === null) {
      constraintVariables = new Set<ConstraintVariable>();
      (this as Mutable<typeof this>).constraintVariables = constraintVariables;
    } else if (constraintVariables.has(constraintVariable)) {
      return;
    }
    constraintVariables.add(constraintVariable);
    this.activateConstraintVariable(constraintVariable);
  };

  ViewRef.prototype.removeConstraintVariable = function (this: ViewRef, constraintVariable: ConstraintVariable): void {
    const constraintVariables = this.constraintVariables as Set<ConstraintVariable> | null;
    if (constraintVariables === null || !constraintVariables.has(constraintVariable)) {
      return;
    }
    this.deactivateConstraintVariable(constraintVariable);
    constraintVariables.delete(constraintVariable);
  };

  ViewRef.prototype.activateConstraintVariable = function (this: ViewRef<ConstraintContext, View>, constraintVariable: ConstraintVariable): void {
    this.owner.activateConstraintVariable(constraintVariable);
  };

  ViewRef.prototype.deactivateConstraintVariable = function (this: ViewRef<ConstraintContext, View>, constraintVariable: ConstraintVariable): void {
    this.owner.deactivateConstraintVariable(constraintVariable);
  };

  ViewRef.prototype.setConstraintVariable = function (this: ViewRef<ConstraintContext, View>, constraintVariable: ConstraintVariable, state: number): void {
    this.owner.setConstraintVariable(constraintVariable, state);
  };

  ViewRef.prototype.activateLayout = function (this: ViewRef<ConstraintContext, View>): void {
    const constraintVariables = this.constraintVariables;
    if (constraintVariables !== null) {
      for (const constraintVariable of constraintVariables) {
        this.owner.activateConstraintVariable(constraintVariable);
      }
    }
    const constraints = this.constraints;
    if (constraints !== null) {
      for (const constraint of constraints) {
        this.owner.activateConstraint(constraint);
      }
    }
  };

  ViewRef.prototype.deactivateLayout = function (this: ViewRef<ConstraintContext, View>): void {
    const constraints = this.constraints;
    if (constraints !== null) {
      for (const constraint of constraints) {
        this.owner.deactivateConstraint(constraint);
      }
    }
    const constraintVariables = this.constraintVariables;
    if (constraintVariables !== null) {
      for (const constraintVariable of constraintVariables) {
        this.owner.deactivateConstraintVariable(constraintVariable);
      }
    }
  };

  ViewRef.prototype.onMount = function (this: ViewRef): void {
    _super.prototype.onMount.call(this);
    this.activateLayout();
  };

  ViewRef.prototype.onUnmount = function (this: ViewRef): void {
    this.deactivateLayout();
    _super.prototype.onUnmount.call(this);
  };

  ViewRef.tryView = function <O, K extends keyof O, F extends O[K]>(owner: O, fastenerName: K): F extends ViewRef<any, infer V> ? V | null : null {
    const viewRef = FastenerContext.tryFastener(owner, fastenerName) as ViewRef | null;
    if (viewRef !== null) {
      return viewRef.view as any;
    }
    return null as any;
  };

  ViewRef.construct = function <F extends ViewRef<any, any>>(fastener: F | null, owner: F extends ViewRef<infer O, any> ? O : never): F {
    if (fastener === null) {
      fastener = function (view?: F extends ViewRef<any, infer V> ? AnyView<V> : never, target?: View | null, key?: string): F extends ViewRef<infer O, infer V> ? V | O | null : never {
        if (view === void 0) {
          return fastener!.view;
        } else {
          fastener!.setView(view, target, key);
          return fastener!.owner;
        }
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).constraints = null;
    (fastener as Mutable<typeof fastener>).constraintVariables = null;
    (fastener as Mutable<typeof fastener>).view = null;
    return fastener;
  };

  ViewRef.refine = function (fastenerClass: ViewRefClass<any>): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "viewKey")) {
      const viewKey = fastenerPrototype.viewKey as string | boolean | undefined;
      if (viewKey === true) {
        Object.defineProperty(fastenerPrototype, "viewKey", {
          value: fastenerClass.name,
          enumerable: true,
          configurable: true,
        });
      } else if (viewKey === false) {
        Object.defineProperty(fastenerPrototype, "viewKey", {
          value: void 0,
          enumerable: true,
          configurable: true,
        });
      }
    }
  };

  return ViewRef;
})(ViewRelation);
