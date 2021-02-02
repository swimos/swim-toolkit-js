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

import {__extends} from "tslib";
import {FromAny, Arrays} from "@swim/util";
import {
  Constrain,
  ConstrainVariable,
  ConstrainBinding,
  ConstraintRelation,
  AnyConstraintStrength,
  ConstraintStrength,
  Constraint,
  ConstraintScope,
} from "@swim/constraint";
import {ViewFactory, View} from "../View";
import type {ViewObserverType} from "../ViewObserver";

export type ViewRelationMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewRelation<any, infer S, any>} ? S : unknown;

export type ViewRelationMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewRelation<any, infer T, infer U>} ? T | U : unknown;

export interface ViewRelationInit<S extends View, U = never> {
  extends?: ViewRelationClass;
  observe?: boolean;
  child?: boolean;
  type?: ViewFactory<S, U>;

  willSetView?(newView: S | null, oldView: S | null): void;
  onSetView?(newView: S | null, oldView: S | null): void;
  didSetView?(newView: S | null, oldView: S | null): void;
  createView?(): S | U | null;
  insertView?(parentView: View, childView: S, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ViewRelationDescriptor<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ViewRelationInit<S, U> & ThisType<ViewRelation<V, S, U> & I> & I;

export type ViewRelationDescriptorExtends<V extends View, S extends View, U = never, I = ViewObserverType<S>> = {extends: ViewRelationClass | undefined} & ViewRelationDescriptor<V, S, U, I>;

export type ViewRelationDescriptorFromAny<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ViewRelationDescriptor<V, S, U, I>;

export interface ViewRelationConstructor<V extends View, S extends View, U = never, I = ViewObserverType<S>> {
  new(owner: V, relationName: string | undefined): ViewRelation<V, S, U> & I;
  prototype: ViewRelation<any, any> & I;
}

export interface ViewRelationClass extends Function {
  readonly prototype: ViewRelation<any, any>;
}

export interface ViewRelation<V extends View, S extends View, U = never> extends ConstraintScope {
  (): S | null;
  (view: S | U | null): V;

  readonly name: string;

  readonly owner: V;

  readonly view: S | null;

  getView(): S;

  setView(view: S | U | null): void;

  /** @hidden */
  doSetView(newView: S | null): void;

  /** @hidden */
  willSetView(newView: S | null, oldView: S | null): void;

  /** @hidden */
  onSetView(newView: S | null, oldView: S | null): void;

  /** @hidden */
  didSetView(newView: S | null, oldView: S | null): void;

  /** @hidden */
  willSetOwnView(newView: S | null, oldView: S | null): void;

  /** @hidden */
  onSetOwnView(newView: S | null, oldView: S | null): void;

  /** @hidden */
  didSetOwnView(newView: S | null, oldView: S | null): void;

  constraint(lhs: Constrain | number, relation: ConstraintRelation,
             rhs?: Constrain | number, strength?: AnyConstraintStrength): Constraint;

  readonly constraints: ReadonlyArray<Constraint>;

  hasConstraint(constraint: Constraint): boolean;

  addConstraint(constraint: Constraint): void;

  removeConstraint(constraint: Constraint): void;

  /** @hidden */
  activateConstraint(constraint: Constraint): void;

  /** @hidden */
  deactivateConstraint(constraint: Constraint): void;

  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstrainVariable;

  readonly constraintVariables: ReadonlyArray<ConstrainVariable>;

  hasConstraintVariable(variable: ConstrainVariable): boolean;

  addConstraintVariable(variable: ConstrainVariable): void;

  removeConstraintVariable(variable: ConstrainVariable): void;

  /** @hidden */
  activateConstraintVariable(constraintVariable: ConstrainVariable): void;

  /** @hidden */
  deactivateConstraintVariable(constraintVariable: ConstrainVariable): void;

  /** @hidden */
  setConstraintVariable(constraintVariable: ConstrainVariable, state: number): void;

  /** @hidden */
  activateLayout(): void;

  /** @hidden */
  deactivateLayout(): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentView: View, key?: string | null): S | null;
  insert(key?: string | null): S | null;

  remove(): S | null;

  createView(): S | U | null;

  /** @hidden */
  insertView(parentView: View, childView: S, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: ViewFactory<S>;

  fromAny(value: S | U): S | null;
}

export const ViewRelation = function <V extends View, S extends View, U>(
    this: ViewRelation<V, S, U> | typeof ViewRelation,
    owner: V | ViewRelationDescriptor<V, S, U>,
    relationName?: string,
  ): ViewRelation<V, S, U> | PropertyDecorator {
  if (this instanceof ViewRelation) { // constructor
    return ViewRelationConstructor.call(this as unknown as ViewRelation<View, View, unknown>, owner as V, relationName);
  } else { // decorator factory
    return ViewRelationDecoratorFactory(owner as ViewRelationDescriptor<V, S, U>);
  }
} as {
  /** @hidden */
  new<V extends View, S extends View, U = never>(owner: V, relationName: string | undefined): ViewRelation<V, S, U>;

  <V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewRelationDescriptorExtends<V, S, U, I>): PropertyDecorator;
  <V extends View, S extends View = View, U = never>(descriptor: ViewRelationDescriptor<V, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ViewRelation<any, any>;

  define<V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewRelationDescriptorExtends<V, S, U, I>): ViewRelationConstructor<V, S, U, I>;
  define<V extends View, S extends View = View, U = never>(descriptor: ViewRelationDescriptor<V, S, U>): ViewRelationConstructor<V, S, U>;
};
__extends(ViewRelation, Object);

function ViewRelationConstructor<V extends View, S extends View, U>(this: ViewRelation<V, S, U>, owner: V, relationName: string | undefined): ViewRelation<V, S, U> {
  if (relationName !== void 0) {
    Object.defineProperty(this, "name", {
      value: relationName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(this, "view", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "constraints", {
    value: Arrays.empty,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "constraintVariables", {
    value: Arrays.empty,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ViewRelationDecoratorFactory<V extends View, S extends View, U>(descriptor: ViewRelationDescriptor<V, S, U>): PropertyDecorator {
  return View.decorateViewRelation.bind(View, ViewRelation.define(descriptor as ViewRelationDescriptor<View, View>));
}

ViewRelation.prototype.getView = function <S extends View>(this: ViewRelation<View, S>): S {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ViewRelation.prototype.setView = function <S extends View, U>(this: ViewRelation<View, S, U>, view: S | U | null): void {
  if (view !== null) {
    view = this.fromAny(view);
  }
  if (this.child === true) {
    if (view === null) {
      this.owner.setChildView(this.name, null);
    } else if ((view as S).parentView !== this.owner || (view as S).key !== this.name) {
      this.insertView(this.owner, view as S, this.name);
    }
  } else {
    this.doSetView(view as S | null);
  }
};

ViewRelation.prototype.doSetView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null): void {
  const oldView = this.view;
  if (oldView !== newView) {
    this.deactivateLayout();
    this.willSetOwnView(newView, oldView);
    this.willSetView(newView, oldView);
    Object.defineProperty(this, "view", {
      value: newView,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnView(newView, oldView);
    this.onSetView(newView, oldView);
    this.didSetView(newView, oldView);
    this.didSetOwnView(newView, oldView);
  }
};

ViewRelation.prototype.willSetView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewRelation.prototype.onSetView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewRelation.prototype.didSetView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewRelation.prototype.willSetOwnView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewRelation.prototype.onSetOwnView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<S>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<S>);
    }
  }
};

ViewRelation.prototype.didSetOwnView = function <S extends View>(this: ViewRelation<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewRelation.prototype.constraint = function (this: ViewRelation<View, View>, lhs: Constrain | number, relation: ConstraintRelation,
                                              rhs?: Constrain | number, strength?: AnyConstraintStrength): Constraint {
  if (typeof lhs === "number") {
    lhs = Constrain.constant(lhs);
  }
  if (typeof rhs === "number") {
    rhs = Constrain.constant(rhs);
  }
  const constrain = rhs !== void 0 ? lhs.minus(rhs) : lhs;
  if (strength === void 0) {
    strength = ConstraintStrength.Required;
  } else {
    strength = ConstraintStrength.fromAny(strength);
  }
  return new Constraint(this.owner, constrain, relation, strength);
};

ViewRelation.prototype.hasConstraint = function (constraint: Constraint): boolean {
  return this.constraints.indexOf(constraint) >= 0;
};

ViewRelation.prototype.addConstraint = function (constraint: Constraint): void {
  const oldConstraints = this.constraints;
  const newConstraints = Arrays.inserted(constraint, oldConstraints);
  if (oldConstraints !== newConstraints) {
    Object.defineProperty(this, "constraints", {
      value: newConstraints,
      enumerable: true,
      configurable: true,
    });
    this.activateConstraint(constraint);
  }
};

ViewRelation.prototype.removeConstraint = function (constraint: Constraint): void {
  const oldConstraints = this.constraints;
  const newConstraints = Arrays.removed(constraint, oldConstraints);
  if (oldConstraints !== newConstraints) {
    this.deactivateConstraint(constraint);
    Object.defineProperty(this, "constraints", {
      value: newConstraints,
      enumerable: true,
      configurable: true,
    });
  }
};

ViewRelation.prototype.activateConstraint = function (this: ViewRelation<View, View>, constraint: Constraint): void {
  this.owner.activateConstraint(constraint);
};

ViewRelation.prototype.deactivateConstraint = function (this: ViewRelation<View, View>, constraint: Constraint): void {
  this.owner.deactivateConstraint(constraint);
};

ViewRelation.prototype.constraintVariable = function (name: string, value?: number, strength?: AnyConstraintStrength): ConstrainVariable {
  if (value === void 0) {
    value = 0;
  }
  if (strength === void 0) {
    strength = ConstraintStrength.Strong;
  } else {
    strength = ConstraintStrength.fromAny(strength);
  }
  return new ConstrainBinding(this, name, value, strength);
};

ViewRelation.prototype.hasConstraintVariable = function (constraintVariable: ConstrainVariable): boolean {
  return this.constraintVariables.indexOf(constraintVariable) >= 0;
};

ViewRelation.prototype.addConstraintVariable = function (constraintVariable: ConstrainVariable): void {
  const oldConstraintVariables = this.constraintVariables;
  const newConstraintVariables = Arrays.inserted(constraintVariable, oldConstraintVariables);
  if (oldConstraintVariables !== newConstraintVariables) {
    Object.defineProperty(this, "constraintVariables", {
      value: newConstraintVariables,
      enumerable: true,
      configurable: true,
    });
    this.activateConstraintVariable(constraintVariable);
  }
};

ViewRelation.prototype.removeConstraintVariable = function (constraintVariable: ConstrainVariable): void {
  const oldConstraintVariables = this.constraintVariables;
  const newConstraintVariables = Arrays.removed(constraintVariable, oldConstraintVariables);
  if (oldConstraintVariables !== newConstraintVariables) {
    this.deactivateConstraintVariable(constraintVariable);
    Object.defineProperty(this, "constraintVariables", {
      value: newConstraintVariables,
      enumerable: true,
      configurable: true,
    });
  }
};

ViewRelation.prototype.activateConstraintVariable = function (this: ViewRelation<View, View>, constraintVariable: ConstrainVariable): void {
  this.owner.activateConstraintVariable(constraintVariable);
};

ViewRelation.prototype.deactivateConstraintVariable = function (this: ViewRelation<View, View>, constraintVariable: ConstrainVariable): void {
  this.owner.deactivateConstraintVariable(constraintVariable);
};

ViewRelation.prototype.setConstraintVariable = function (this: ViewRelation<View, View>, constraintVariable: ConstrainVariable, state: number): void {
  this.owner.setConstraintVariable(constraintVariable, state);
};

ViewRelation.prototype.activateLayout = function (this: ViewRelation<View, View>): void {
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.activateConstraintVariable(constraintVariables[i]!);
  }
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.activateConstraint(constraints[i]!);
  }
};

ViewRelation.prototype.deactivateLayout = function (this: ViewRelation<View, View>): void {
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.deactivateConstraint(constraints[i]!);
  }
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.deactivateConstraintVariable(constraintVariables[i]!);
  }
};

ViewRelation.prototype.mount = function (): void {
  this.activateLayout();
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this as ViewObserverType<View>);
  }
};

ViewRelation.prototype.unmount = function (): void {
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this as ViewObserverType<View>);
  }
  this.deactivateLayout();
};

ViewRelation.prototype.insert = function <S extends View>(this: ViewRelation<View, S>, parentView?: View | string | null, key?: string | null): S | null {
  let view = this.view;
  if (view === null) {
    view = this.createView();
  }
  if (view !== null) {
    if (typeof parentView === "string" || parentView === null) {
      key = parentView;
      parentView = void 0;
    }
    if (parentView === void 0) {
      parentView = this.owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (view.parentView !== parentView || view.key !== key) {
      this.insertView(parentView, view, key);
    }
    if (this.view === null) {
      this.doSetView(view);
    }
  }
  return view;
};

ViewRelation.prototype.remove = function <S extends View>(this: ViewRelation<View, S>): S | null {
  const view = this.view;
  if (view !== null) {
    view.remove();
  }
  return view;
};

ViewRelation.prototype.createView = function <S extends View, U>(this: ViewRelation<View, S, U>): S | U | null {
  const type = this.type;
  if (type !== void 0) {
    return type.create();
  }
  return null;
};

ViewRelation.prototype.insertView = function <S extends View>(this: ViewRelation<View, S>, parentView: View, childView: S, key: string | undefined): void {
  if (key !== void 0) {
    parentView.setChildView(key, childView);
  } else {
    parentView.appendChildView(childView);
  }
};

ViewRelation.prototype.fromAny = function <S extends View, U>(this: ViewRelation<View, S, U>, value: S | U): S | null {
  const type = this.type;
  if (FromAny.is<S, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof View) {
    return value;
  }
  return null;
};

ViewRelation.define = function <V extends View, S extends View, U, I>(descriptor: ViewRelationDescriptor<V, S, U, I>): ViewRelationConstructor<V, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ViewRelation;
  }

  const _constructor = function DecoratedViewRelation(this: ViewRelation<V, S>, owner: V, relationName: string | undefined): ViewRelation<V, S, U> {
    let _this: ViewRelation<V, S, U> = function ViewRelationAccessor(view?: S | U | null): S | null | V {
      if (view === void 0) {
        return _this.view;
      } else {
        _this.setView(view);
        return _this.owner;
      }
    } as ViewRelation<V, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, relationName) || _this;
    return _this;
  } as unknown as ViewRelationConstructor<V, S, U, I>;

  const _prototype = descriptor as unknown as ViewRelation<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }
  if (_prototype.child === void 0) {
    _prototype.child = true;
  }

  return _constructor;
};
