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
  AnyConstraintExpression,
  ConstraintExpression,
  ConstraintVariable,
  ConstraintBinding,
  ConstraintRelation,
  AnyConstraintStrength,
  ConstraintStrength,
  Constraint,
  ConstraintScope,
} from "@swim/constraint";
import {ViewFactory, View} from "../View";
import type {ViewObserverType} from "../ViewObserver";

export type ViewFastenerMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewFastener<any, infer S, any>} ? S : unknown;

export type ViewFastenerMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewFastener<any, infer T, infer U>} ? T | U : unknown;

export interface ViewFastenerInit<S extends View, U = never> {
  extends?: ViewFastenerClass;
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

export type ViewFastenerDescriptor<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ViewFastenerInit<S, U> & ThisType<ViewFastener<V, S, U> & I> & I;

export type ViewFastenerDescriptorExtends<V extends View, S extends View, U = never, I = ViewObserverType<S>> = {extends: ViewFastenerClass | undefined} & ViewFastenerDescriptor<V, S, U, I>;

export type ViewFastenerDescriptorFromAny<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ViewFastenerDescriptor<V, S, U, I>;

export interface ViewFastenerConstructor<V extends View, S extends View, U = never, I = ViewObserverType<S>> {
  new(owner: V, fastenerName: string | undefined): ViewFastener<V, S, U> & I;
  prototype: ViewFastener<any, any> & I;
}

export interface ViewFastenerClass extends Function {
  readonly prototype: ViewFastener<any, any>;
}

export interface ViewFastener<V extends View, S extends View, U = never> extends ConstraintScope {
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

  constraint(lhs: AnyConstraintExpression, relation: ConstraintRelation,
             rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint;

  readonly constraints: ReadonlyArray<Constraint>;

  hasConstraint(constraint: Constraint): boolean;

  addConstraint(constraint: Constraint): void;

  removeConstraint(constraint: Constraint): void;

  /** @hidden */
  activateConstraint(constraint: Constraint): void;

  /** @hidden */
  deactivateConstraint(constraint: Constraint): void;

  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstraintBinding;

  readonly constraintVariables: ReadonlyArray<ConstraintVariable>;

  hasConstraintVariable(variable: ConstraintVariable): boolean;

  addConstraintVariable(variable: ConstraintVariable): void;

  removeConstraintVariable(variable: ConstraintVariable): void;

  /** @hidden */
  activateConstraintVariable(constraintVariable: ConstraintVariable): void;

  /** @hidden */
  deactivateConstraintVariable(constraintVariable: ConstraintVariable): void;

  /** @hidden */
  setConstraintVariable(constraintVariable: ConstraintVariable, state: number): void;

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

export const ViewFastener = function <V extends View, S extends View, U>(
    this: ViewFastener<V, S, U> | typeof ViewFastener,
    owner: V | ViewFastenerDescriptor<V, S, U>,
    fastenerName?: string,
  ): ViewFastener<V, S, U> | PropertyDecorator {
  if (this instanceof ViewFastener) { // constructor
    return ViewFastenerConstructor.call(this as unknown as ViewFastener<View, View, unknown>, owner as V, fastenerName);
  } else { // decorator factory
    return ViewFastenerDecoratorFactory(owner as ViewFastenerDescriptor<V, S, U>);
  }
} as {
  /** @hidden */
  new<V extends View, S extends View, U = never>(owner: V, fastenerName: string | undefined): ViewFastener<V, S, U>;

  <V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewFastenerDescriptorExtends<V, S, U, I>): PropertyDecorator;
  <V extends View, S extends View = View, U = never>(descriptor: ViewFastenerDescriptor<V, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ViewFastener<any, any>;

  define<V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewFastenerDescriptorExtends<V, S, U, I>): ViewFastenerConstructor<V, S, U, I>;
  define<V extends View, S extends View = View, U = never>(descriptor: ViewFastenerDescriptor<V, S, U>): ViewFastenerConstructor<V, S, U>;
};
__extends(ViewFastener, Object);

function ViewFastenerConstructor<V extends View, S extends View, U>(this: ViewFastener<V, S, U>, owner: V, fastenerName: string | undefined): ViewFastener<V, S, U> {
  if (fastenerName !== void 0) {
    Object.defineProperty(this, "name", {
      value: fastenerName,
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

function ViewFastenerDecoratorFactory<V extends View, S extends View, U>(descriptor: ViewFastenerDescriptor<V, S, U>): PropertyDecorator {
  return View.decorateViewFastener.bind(View, ViewFastener.define(descriptor as ViewFastenerDescriptor<View, View>));
}

ViewFastener.prototype.getView = function <S extends View>(this: ViewFastener<View, S>): S {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ViewFastener.prototype.setView = function <S extends View, U>(this: ViewFastener<View, S, U>, view: S | U | null): void {
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

ViewFastener.prototype.doSetView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null): void {
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

ViewFastener.prototype.willSetView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewFastener.prototype.onSetView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewFastener.prototype.didSetView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewFastener.prototype.willSetOwnView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewFastener.prototype.onSetOwnView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<S>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<S>);
    }
  }
};

ViewFastener.prototype.didSetOwnView = function <S extends View>(this: ViewFastener<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewFastener.prototype.constraint = function (this: ViewFastener<View, View>, lhs: AnyConstraintExpression, relation: ConstraintRelation,
                                              rhs?: AnyConstraintExpression, strength?: AnyConstraintStrength): Constraint {
  lhs = ConstraintExpression.fromAny(lhs);
  if (rhs !== void 0) {
    rhs = ConstraintExpression.fromAny(rhs);
  }
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

ViewFastener.prototype.hasConstraint = function (this: ViewFastener<View, View>, constraint: Constraint): boolean {
  return this.constraints.indexOf(constraint) >= 0;
};

ViewFastener.prototype.addConstraint = function (this: ViewFastener<View, View>, constraint: Constraint): void {
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

ViewFastener.prototype.removeConstraint = function (this: ViewFastener<View, View>, constraint: Constraint): void {
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

ViewFastener.prototype.activateConstraint = function (this: ViewFastener<View, View>, constraint: Constraint): void {
  this.owner.activateConstraint(constraint);
};

ViewFastener.prototype.deactivateConstraint = function (this: ViewFastener<View, View>, constraint: Constraint): void {
  this.owner.deactivateConstraint(constraint);
};

ViewFastener.prototype.constraintVariable = function (this: ViewFastener<View, View>, name: string, value?: number, strength?: AnyConstraintStrength): ConstraintBinding {
  if (value === void 0) {
    value = 0;
  }
  if (strength === void 0) {
    strength = ConstraintStrength.Strong;
  } else {
    strength = ConstraintStrength.fromAny(strength);
  }
  return new ConstraintBinding(this, name, value, strength);
};

ViewFastener.prototype.hasConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable): boolean {
  return this.constraintVariables.indexOf(constraintVariable) >= 0;
};

ViewFastener.prototype.addConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable): void {
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

ViewFastener.prototype.removeConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable): void {
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

ViewFastener.prototype.activateConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable): void {
  this.owner.activateConstraintVariable(constraintVariable);
};

ViewFastener.prototype.deactivateConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable): void {
  this.owner.deactivateConstraintVariable(constraintVariable);
};

ViewFastener.prototype.setConstraintVariable = function (this: ViewFastener<View, View>, constraintVariable: ConstraintVariable, state: number): void {
  this.owner.setConstraintVariable(constraintVariable, state);
};

ViewFastener.prototype.activateLayout = function (this: ViewFastener<View, View>): void {
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.activateConstraintVariable(constraintVariables[i]!);
  }
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.activateConstraint(constraints[i]!);
  }
};

ViewFastener.prototype.deactivateLayout = function (this: ViewFastener<View, View>): void {
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.deactivateConstraint(constraints[i]!);
  }
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.deactivateConstraintVariable(constraintVariables[i]!);
  }
};

ViewFastener.prototype.mount = function (): void {
  this.activateLayout();
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this as ViewObserverType<View>);
  }
};

ViewFastener.prototype.unmount = function (): void {
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this as ViewObserverType<View>);
  }
  this.deactivateLayout();
};

ViewFastener.prototype.insert = function <S extends View>(this: ViewFastener<View, S>, parentView?: View | string | null, key?: string | null): S | null {
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

ViewFastener.prototype.remove = function <S extends View>(this: ViewFastener<View, S>): S | null {
  const view = this.view;
  if (view !== null) {
    view.remove();
  }
  return view;
};

ViewFastener.prototype.createView = function <S extends View, U>(this: ViewFastener<View, S, U>): S | U | null {
  const type = this.type;
  if (type !== void 0) {
    return type.create();
  }
  return null;
};

ViewFastener.prototype.insertView = function <S extends View>(this: ViewFastener<View, S>, parentView: View, childView: S, key: string | undefined): void {
  if (key !== void 0) {
    parentView.setChildView(key, childView);
  } else {
    parentView.appendChildView(childView);
  }
};

ViewFastener.prototype.fromAny = function <S extends View, U>(this: ViewFastener<View, S, U>, value: S | U): S | null {
  const type = this.type;
  if (FromAny.is<S, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof View) {
    return value;
  }
  return null;
};

ViewFastener.define = function <V extends View, S extends View, U, I>(descriptor: ViewFastenerDescriptor<V, S, U, I>): ViewFastenerConstructor<V, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ViewFastener;
  }

  const _constructor = function DecoratedViewFastener(this: ViewFastener<V, S>, owner: V, fastenerName: string | undefined): ViewFastener<V, S, U> {
    let _this: ViewFastener<V, S, U> = function ViewFastenerAccessor(view?: S | U | null): S | null | V {
      if (view === void 0) {
        return _this.view;
      } else {
        _this.setView(view);
        return _this.owner;
      }
    } as ViewFastener<V, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as ViewFastenerConstructor<V, S, U, I>;

  const _prototype = descriptor as unknown as ViewFastener<any, any> & I;
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
