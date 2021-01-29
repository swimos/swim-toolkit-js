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

export type ViewBindingMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewBinding<any, infer S, any>} ? S : unknown;

export type ViewBindingMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewBinding<any, infer T, infer U>} ? T | U : unknown;

export interface ViewBindingInit<S extends View, U = never> {
  extends?: ViewBindingClass;
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

export type ViewBindingDescriptor<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ViewBindingInit<S, U> & ThisType<ViewBinding<V, S, U> & I> & I;

export type ViewBindingDescriptorExtends<V extends View, S extends View, U = never, I = ViewObserverType<S>> = {extends: ViewBindingClass | undefined} & ViewBindingDescriptor<V, S, U, I>;

export type ViewBindingDescriptorFromAny<V extends View, S extends View, U = never, I = ViewObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ViewBindingDescriptor<V, S, U, I>;

export interface ViewBindingConstructor<V extends View, S extends View, U = never, I = ViewObserverType<S>> {
  new(owner: V, bindingName: string | undefined): ViewBinding<V, S, U> & I;
  prototype: ViewBinding<any, any> & I;
}

export interface ViewBindingClass extends Function {
  readonly prototype: ViewBinding<any, any>;
}

export interface ViewBinding<V extends View, S extends View, U = never> extends ConstraintScope {
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

export const ViewBinding = function <V extends View, S extends View, U>(
    this: ViewBinding<V, S, U> | typeof ViewBinding,
    owner: V | ViewBindingDescriptor<V, S, U>,
    bindingName?: string,
  ): ViewBinding<V, S, U> | PropertyDecorator {
  if (this instanceof ViewBinding) { // constructor
    return ViewBindingConstructor.call(this as unknown as ViewBinding<View, View, unknown>, owner as V, bindingName);
  } else { // decorator factory
    return ViewBindingDecoratorFactory(owner as ViewBindingDescriptor<V, S, U>);
  }
} as {
  /** @hidden */
  new<V extends View, S extends View, U = never>(owner: V, bindingName: string | undefined): ViewBinding<V, S, U>;

  <V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewBindingDescriptorExtends<V, S, U, I>): PropertyDecorator;
  <V extends View, S extends View = View, U = never>(descriptor: ViewBindingDescriptor<V, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ViewBinding<any, any>;

  define<V extends View, S extends View = View, U = never, I = ViewObserverType<S>>(descriptor: ViewBindingDescriptorExtends<V, S, U, I>): ViewBindingConstructor<V, S, U, I>;
  define<V extends View, S extends View = View, U = never>(descriptor: ViewBindingDescriptor<V, S, U>): ViewBindingConstructor<V, S, U>;
};
__extends(ViewBinding, Object);

function ViewBindingConstructor<V extends View, S extends View, U>(this: ViewBinding<V, S, U>, owner: V, bindingName: string | undefined): ViewBinding<V, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
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

function ViewBindingDecoratorFactory<V extends View, S extends View, U>(descriptor: ViewBindingDescriptor<V, S, U>): PropertyDecorator {
  return View.decorateViewBinding.bind(View, ViewBinding.define(descriptor as ViewBindingDescriptor<View, View>));
}

ViewBinding.prototype.getView = function <S extends View>(this: ViewBinding<View, S>): S {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ViewBinding.prototype.setView = function <S extends View, U>(this: ViewBinding<View, S, U>, view: S | U | null): void {
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

ViewBinding.prototype.doSetView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null): void {
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

ViewBinding.prototype.willSetView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewBinding.prototype.onSetView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewBinding.prototype.didSetView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewBinding.prototype.willSetOwnView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewBinding.prototype.onSetOwnView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<S>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<S>);
    }
  }
};

ViewBinding.prototype.didSetOwnView = function <S extends View>(this: ViewBinding<View, S>, newView: S | null, oldView: S | null): void {
  // hook
};

ViewBinding.prototype.constraint = function (lhs: Constrain | number, relation: ConstraintRelation,
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

ViewBinding.prototype.hasConstraint = function (constraint: Constraint): boolean {
  return this.constraints.indexOf(constraint) >= 0;
};

ViewBinding.prototype.addConstraint = function (constraint: Constraint): void {
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

ViewBinding.prototype.removeConstraint = function (constraint: Constraint): void {
  const oldConstraints = this.constraints;
  const newConstraints = Arrays.removed(constraint, oldConstraints);
  if (oldConstraints !== newConstraints) {
    Object.defineProperty(this, "constraints", {
      value: newConstraints,
      enumerable: true,
      configurable: true,
    });
    this.deactivateConstraint(constraint);
  }
};

ViewBinding.prototype.activateConstraint = function (constraint: Constraint): void {
  this.owner.activateConstraint(constraint);
};

ViewBinding.prototype.deactivateConstraint = function (constraint: Constraint): void {
  this.owner.deactivateConstraint(constraint);
};

ViewBinding.prototype.constraintVariable = function (name: string, value?: number, strength?: AnyConstraintStrength): ConstrainVariable {
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

ViewBinding.prototype.hasConstraintVariable = function (constraintVariable: ConstrainVariable): boolean {
  return this.constraintVariables.indexOf(constraintVariable) >= 0;
};

ViewBinding.prototype.addConstraintVariable = function (constraintVariable: ConstrainVariable): void {
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

ViewBinding.prototype.removeConstraintVariable = function (constraintVariable: ConstrainVariable): void {
  const oldConstraintVariables = this.constraintVariables;
  const newConstraintVariables = Arrays.removed(constraintVariable, oldConstraintVariables);
  if (oldConstraintVariables !== newConstraintVariables) {
    Object.defineProperty(this, "constraintVariables", {
      value: newConstraintVariables,
      enumerable: true,
      configurable: true,
    });
    this.deactivateConstraintVariable(constraintVariable);
  }
};

ViewBinding.prototype.activateConstraintVariable = function (constraintVariable: ConstrainVariable): void {
  this.owner.activateConstraintVariable(constraintVariable);
};

ViewBinding.prototype.deactivateConstraintVariable = function (constraintVariable: ConstrainVariable): void {
  this.owner.deactivateConstraintVariable(constraintVariable);
};

ViewBinding.prototype.setConstraintVariable = function (constraintVariable: ConstrainVariable, state: number): void {
  this.owner.setConstraintVariable(constraintVariable, state);
};

ViewBinding.prototype.activateLayout = function (this: ViewBinding<View, View>): void {
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.activateConstraintVariable(constraintVariables[i]!);
  }
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.activateConstraint(constraints[i]!);
  }
};

ViewBinding.prototype.deactivateLayout = function (this: ViewBinding<View, View>): void {
  const constraints = this.constraints;
  for (let i = 0, n = constraints.length; i < n; i += 1) {
    this.owner.deactivateConstraint(constraints[i]!);
  }
  const constraintVariables = this.constraintVariables;
  for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
    this.owner.deactivateConstraintVariable(constraintVariables[i]!);
  }
};

ViewBinding.prototype.mount = function (): void {
  this.activateLayout();
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this);
  }
};

ViewBinding.prototype.unmount = function (): void {
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this);
  }
  this.deactivateLayout();
};

ViewBinding.prototype.insert = function <S extends View>(this: ViewBinding<View, S>, parentView?: View | string | null, key?: string | null): S | null {
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

ViewBinding.prototype.remove = function <S extends View>(this: ViewBinding<View, S>): S | null {
  const view = this.view;
  if (view !== null) {
    view.remove();
  }
  return view;
};

ViewBinding.prototype.createView = function <S extends View, U>(this: ViewBinding<View, S, U>): S | U | null {
  const type = this.type;
  if (type !== void 0) {
    return type.create();
  }
  return null;
};

ViewBinding.prototype.insertView = function <S extends View>(this: ViewBinding<View, S>, parentView: View, childView: S, key: string | undefined): void {
  if (key !== void 0) {
    parentView.setChildView(key, childView);
  } else {
    parentView.appendChildView(childView);
  }
};

ViewBinding.prototype.fromAny = function <S extends View, U>(this: ViewBinding<View, S, U>, value: S | U): S | null {
  const type = this.type;
  if (FromAny.is<S, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof View) {
    return value;
  }
  return null;
};

ViewBinding.define = function <V extends View, S extends View, U, I>(descriptor: ViewBindingDescriptor<V, S, U, I>): ViewBindingConstructor<V, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ViewBinding;
  }

  const _constructor = function DecoratedViewBinding(this: ViewBinding<V, S>, owner: V, bindingName: string | undefined): ViewBinding<V, S, U> {
    let _this: ViewBinding<V, S, U> = function ViewBindingAccessor(view?: S | U | null): S | null | V {
      if (view === void 0) {
        return _this.view;
      } else {
        _this.setView(view);
        return _this.owner;
      }
    } as ViewBinding<V, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as ViewBindingConstructor<V, S, U, I>;

  const _prototype = descriptor as unknown as ViewBinding<any, any> & I;
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
