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
import {FromAny} from "@swim/util";
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
import {ViewObserverType} from "../ViewObserver";

export type ViewBindingMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewBinding<any, infer S, any>} ? S : unknown;

export type ViewBindingMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewBinding<any, infer T, infer U>} ? T | U : unknown;

export interface ViewBindingInit<S extends View, U = S> {
  extends?: ViewBindingPrototype;
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

export type ViewBindingDescriptorInit<V extends View, S extends View, U = S, I = ViewObserverType<S>> = ViewBindingInit<S, U> & ThisType<ViewBinding<V, S, U> & I> & I;

export type ViewBindingDescriptorExtends<V extends View, S extends View, U = S, I = ViewObserverType<S>> = {extends: ViewBindingPrototype | undefined} & ViewBindingDescriptorInit<V, S, U, I>;

export type ViewBindingDescriptorFromAny<V extends View, S extends View, U = S, I = ViewObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ViewBindingDescriptorInit<V, S, U, I>;

export type ViewBindingDescriptor<V extends View, S extends View, U = S, I = ViewObserverType<S>> =
  U extends S ? ViewBindingDescriptorInit<V, S, U, I> :
  ViewBindingDescriptorFromAny<V, S, U, I>;

export interface ViewBindingPrototype extends Function {
  readonly prototype: ViewBinding<any, any>;
}

export interface ViewBindingConstructor<V extends View, S extends View, U = S, I = ViewObserverType<S>> {
  new(owner: V, bindingName: string | undefined): ViewBinding<V, S, U> & I;
  prototype: ViewBinding<any, any, any> & I;
}

export declare abstract class ViewBinding<V extends View, S extends View, U = S> {
  /** @hidden */
  _owner: V;
  /** @hidden */
  _view: S | null;
  /** @hidden */
  _constraints?: Constraint[];
  /** @hidden */
  _constraintVariables?: ConstrainVariable[];

  constructor(owner: V, bindingName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: ViewFactory<S>;

  get name(): string;

  get owner(): V;

  get view(): S | null;

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

  get constraints(): ReadonlyArray<Constraint>;

  hasConstraint(constraint: Constraint): boolean;

  addConstraint(constraint: Constraint): void;

  removeConstraint(constraint: Constraint): void;

  /** @hidden */
  activateConstraint(constraint: Constraint): void;

  /** @hidden */
  deactivateConstraint(constraint: Constraint): void;

  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstrainVariable;

  get constraintVariables(): ReadonlyArray<ConstrainVariable>;

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

  fromAny(value: S | U): S | null;

  static define<V extends View, S extends View = View, U = S, I = ViewObserverType<S>>(descriptor: ViewBindingDescriptorExtends<V, S, U, I>): ViewBindingConstructor<V, S, U, I>;
  static define<V extends View, S extends View = View, U = S>(descriptor: ViewBindingDescriptor<V, S, U>): ViewBindingConstructor<V, S, U>;
}

export interface ViewBinding<V extends View, S extends View, U = S> extends ConstraintScope {
  (): S | null;
  (view: S | U | null): V;
}

export function ViewBinding<V extends View, S extends View = View, U = S, I = ViewObserverType<S>>(descriptor: ViewBindingDescriptorExtends<V, S, U, I>): PropertyDecorator;
export function ViewBinding<V extends View, S extends View = View, U = S>(descriptor: ViewBindingDescriptor<V, S, U>): PropertyDecorator;

export function ViewBinding<V extends View, S extends View, U>(
    this: ViewBinding<V, S> | typeof ViewBinding,
    owner: V | ViewBindingDescriptor<V, S, U>,
    bindingName?: string,
  ): ViewBinding<V, S> | PropertyDecorator {
  if (this instanceof ViewBinding) { // constructor
    return ViewBindingConstructor.call(this, owner as V, bindingName);
  } else { // decorator factory
    return ViewBindingDecoratorFactory(owner as ViewBindingDescriptor<V, S, U>);
  }
}
__extends(ViewBinding, Object);
View.Binding = ViewBinding;

function ViewBindingConstructor<V extends View, S extends View, U>(this: ViewBinding<V, S, U>, owner: V, bindingName: string | undefined): ViewBinding<V, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._view = null;
  return this;
}

function ViewBindingDecoratorFactory<V extends View, S extends View, U>(descriptor: ViewBindingDescriptor<V, S, U>): PropertyDecorator {
  return View.decorateViewBinding.bind(View, ViewBinding.define(descriptor));
}

Object.defineProperty(ViewBinding.prototype, "owner", {
  get: function <V extends View>(this: ViewBinding<V, View>): V {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewBinding.prototype, "view", {
  get: function <S extends View>(this: ViewBinding<View, S>): S | null {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

ViewBinding.prototype.getView = function <S extends View>(this: ViewBinding<View, S>): S {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ViewBinding.prototype.setView = function <S extends View, U>(this: ViewBinding<View, S, U>,
                                                             view: S | U | null): void {
  if (view !== null) {
    view = this.fromAny(view);
  }
  if (this.child === true) {
    if (view === null) {
      this._owner.setChildView(this.name, null);
    } else if ((view as S).parentView !== this._owner || (view as S).key !== this.name) {
      this.insertView(this._owner, view as S, this.name);
    }
  } else {
    this.doSetView(view as S | null);
  }
};

ViewBinding.prototype.doSetView = function <S extends View>(this: ViewBinding<View, S>,
                                                            newView: S | null): void {
  const oldView = this._view;
  if (oldView !== newView) {
    this.deactivateLayout();
    this.willSetOwnView(newView, oldView);
    this.willSetView(newView, oldView);
    this._view = newView;
    this.onSetOwnView(newView, oldView);
    this.onSetView(newView, oldView);
    this.didSetView(newView, oldView);
    this.didSetOwnView(newView, oldView);
  }
};

ViewBinding.prototype.willSetView = function <S extends View>(this: ViewBinding<View, S>,
                                                              newView: S | null,
                                                              oldView: S | null): void {
  // hook
};

ViewBinding.prototype.onSetView = function <S extends View>(this: ViewBinding<View, S>,
                                                            newView: S | null,
                                                            oldView: S | null): void {
  // hook
};

ViewBinding.prototype.didSetView = function <S extends View>(this: ViewBinding<View, S>,
                                                             newView: S | null,
                                                             oldView: S | null): void {
  // hook
};

ViewBinding.prototype.willSetOwnView = function <S extends View>(this: ViewBinding<View, S>,
                                                                 newView: S | null,
                                                                 oldView: S | null): void {
  // hook
};

ViewBinding.prototype.onSetOwnView = function <S extends View>(this: ViewBinding<View, S>,
                                                               newView: S | null,
                                                               oldView: S | null): void {
  if (this.observe === true && this._owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<S>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<S>);
    }
  }
};

ViewBinding.prototype.didSetOwnView = function <S extends View>(this: ViewBinding<View, S>,
                                                                newView: S | null,
                                                                oldView: S | null): void {
  // hook
};

ViewBinding.prototype.constraint = function (this: ViewBinding<View, View>, lhs: Constrain | number, relation: ConstraintRelation,
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
  return new Constraint(this._owner, constrain, relation, strength);
};

Object.defineProperty(ViewBinding.prototype, "constraints", {
  get: function (this: ViewBinding<View, View>): ReadonlyArray<Constraint> {
    let constraints = this._constraints;
    if (constraints === void 0) {
      constraints = [];
      this._constraints = constraints;
    }
    return constraints;
  },
  enumerable: true,
  configurable: true,
});

ViewBinding.prototype.hasConstraint = function (this: ViewBinding<View, View>,
                                                constraint: Constraint): boolean {
  const constraints = this._constraints;
  return constraints !== void 0 && constraints.indexOf(constraint) >= 0;
};

ViewBinding.prototype.addConstraint = function (this: ViewBinding<View, View>,
                                                constraint: Constraint): void {
  let constraints = this._constraints;
  if (constraints === void 0) {
    constraints = [];
    this._constraints = constraints;
  }
  if (constraints.indexOf(constraint) < 0) {
    constraints.push(constraint);
    this.activateConstraint(constraint);
  }
};

ViewBinding.prototype.removeConstraint = function (this: ViewBinding<View, View>,
                                                   constraint: Constraint): void {
  const constraints = this._constraints;
  if (constraints !== void 0) {
    const index = constraints.indexOf(constraint);
    if (index >= 0) {
      constraints.splice(index, 1);
      this.deactivateConstraint(constraint);
    }
  }
};

ViewBinding.prototype.activateConstraint = function (this: ViewBinding<View, View>,
                                                     constraint: Constraint): void {
  this._owner.activateConstraint(constraint);
};

ViewBinding.prototype.deactivateConstraint = function (this: ViewBinding<View, View>,
                                                       constraint: Constraint): void {
  this._owner.deactivateConstraint(constraint);
};

ViewBinding.prototype.constraintVariable = function (this: ViewBinding<View, View>, name: string, value?: number,
                                                     strength?: AnyConstraintStrength): ConstrainVariable {
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

Object.defineProperty(ViewBinding.prototype, "constraintVariables", {
  get: function (this: ViewBinding<View, View>): ReadonlyArray<ConstrainVariable> {
    let constraintVariables = this._constraintVariables;
    if (constraintVariables === void 0) {
      constraintVariables = [];
      this._constraintVariables = constraintVariables;
    }
    return constraintVariables;
  },
  enumerable: true,
  configurable: true,
});

ViewBinding.prototype.hasConstraintVariable = function (this: ViewBinding<View, View>,
                                                        constraintVariable: ConstrainVariable): boolean {
  const constraintVariables = this._constraintVariables;
  return constraintVariables !== void 0 && constraintVariables.indexOf(constraintVariable) >= 0;
};

ViewBinding.prototype.addConstraintVariable = function (this: ViewBinding<View, View>,
                                                        constraintVariable: ConstrainVariable): void {
  let constraintVariables = this._constraintVariables;
  if (constraintVariables === void 0) {
    constraintVariables = [];
    this._constraintVariables = constraintVariables;
  }
  if (constraintVariables.indexOf(constraintVariable) < 0) {
    constraintVariables.push(constraintVariable);
    this.activateConstraintVariable(constraintVariable);
  }
};

ViewBinding.prototype.removeConstraintVariable = function (this: ViewBinding<View, View>,
                                                           constraintVariable: ConstrainVariable): void {
  const constraintVariables = this._constraintVariables;
  if (constraintVariables !== void 0) {
    const index = constraintVariables.indexOf(constraintVariable);
    if (index >= 0) {
      this.deactivateConstraintVariable(constraintVariable);
      constraintVariables.splice(index, 1);
    }
  }
};

ViewBinding.prototype.activateConstraintVariable = function (this: ViewBinding<View, View>,
                                                             constraintVariable: ConstrainVariable): void {
  this._owner.activateConstraintVariable(constraintVariable);
};

ViewBinding.prototype.deactivateConstraintVariable = function (this: ViewBinding<View, View>,
                                                               constraintVariable: ConstrainVariable): void {
  this._owner.deactivateConstraintVariable(constraintVariable);
};

ViewBinding.prototype.setConstraintVariable = function (this: ViewBinding<View, View>,
                                                        constraintVariable: ConstrainVariable, state: number): void {
  this._owner.setConstraintVariable(constraintVariable, state);
};

ViewBinding.prototype.activateLayout = function (this: ViewBinding<View, View>): void {
  const constraints = this._constraints;
  const constraintVariables = this._constraintVariables;
  if (constraints !== void 0 || constraintVariables !== void 0) {
    if (constraintVariables !== void 0) {
      for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
        this._owner.activateConstraintVariable(constraintVariables[i]);
      }
    }
    if (constraints !== void 0) {
      for (let i = 0, n = constraints.length; i < n; i += 1) {
        this._owner.activateConstraint(constraints[i]);
      }
    }
  }
};

ViewBinding.prototype.deactivateLayout = function (this: ViewBinding<View, View>): void {
  const constraints = this._constraints;
  const constraintVariables = this._constraintVariables;
  if (constraints !== void 0 || constraintVariables !== void 0) {
    if (constraints !== void 0) {
      for (let i = 0, n = constraints.length; i < n; i += 1) {
        this._owner.deactivateConstraint(constraints[i]);
      }
    }
    if (constraintVariables !== void 0) {
      for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
        this._owner.deactivateConstraintVariable(constraintVariables[i]);
      }
    }
  }
};

ViewBinding.prototype.mount = function <S extends View>(this: ViewBinding<View, S>): void {
  this.activateLayout();
  const view = this._view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this as ViewObserverType<S>);
  }
};

ViewBinding.prototype.unmount = function <S extends View>(this: ViewBinding<View, S>): void {
  const view = this._view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this as ViewObserverType<S>);
  }
  this.deactivateLayout();
};

ViewBinding.prototype.insert = function <S extends View>(this: ViewBinding<View, S>,
                                                         parentView?: View | string | null,
                                                         key?: string | null): S | null {
  let view = this._view;
  if (view === null) {
    view = this.createView();
  }
  if (view !== null) {
    if (typeof parentView === "string" || parentView === null) {
      key = parentView;
      parentView = void 0;
    }
    if (parentView === void 0) {
      parentView = this._owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (view.parentView !== parentView || view.key !== key) {
      this.insertView(parentView, view, key);
    }
    if (this._view === null) {
      this.doSetView(view);
    }
  }
  return view;
};

ViewBinding.prototype.remove = function <S extends View>(this: ViewBinding<View, S>): S | null {
  const view = this._view;
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

ViewBinding.prototype.insertView = function <S extends View>(this: ViewBinding<View, S>,
                                                             parentView: View, childView: S,
                                                             key: string | undefined): void {
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

  const _constructor = function ViewBindingAccessor(this: ViewBinding<V, S>, owner: V, bindingName: string | undefined): ViewBinding<V, S, U> {
    let _this: ViewBinding<V, S, U> = function accessor(view?: S | U | null): S | null | V {
      if (view === void 0) {
        return _this._view;
      } else {
        _this.setView(view);
        return _this._owner;
      }
    } as ViewBinding<V, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as ViewBindingConstructor<V, S, U, I>;

  const _prototype = descriptor as unknown as ViewBinding<V, S, U> & I;
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
