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
import type {FromAny} from "@swim/util";
import {Component} from "../Component";
import type {ComponentObserverType} from "../ComponentObserver";

export type ComponentBindingMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentBinding<any, infer S, any>} ? S : unknown;

export type ComponentBindingMemberInit<C, K extends keyof C> =
  C extends {[P in K]: ComponentBinding<any, infer T, infer U>} ? T | U : unknown;

export interface ComponentBindingInit<S extends Component, U = never> {
  extends?: ComponentBindingClass;
  observe?: boolean;
  child?: boolean;
  type?: unknown;

  willSetComponent?(newComponent: S | null, oldComponent: S | null): void;
  onSetComponent?(newComponent: S | null, oldComponent: S | null): void;
  didSetComponent?(newComponent: S | null, oldComponent: S | null): void;
  createComponent?(): S | U | null;
  insertComponent?(parentComponent: Component, childComponent: S, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ComponentBindingDescriptor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ComponentBindingInit<S, U> & ThisType<ComponentBinding<C, S, U> & I> & I;

export type ComponentBindingDescriptorExtends<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = {extends: ComponentBindingClass | undefined} & ComponentBindingDescriptor<C, S, U, I>;

export type ComponentBindingDescriptorFromAny<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ComponentBindingDescriptor<C, S, U, I>;

export interface ComponentBindingConstructor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> {
  new(owner: C, bindingName: string | undefined): ComponentBinding<C, S, U> & I;
  prototype: ComponentBinding<any, any, any> & I;
}

export interface ComponentBindingClass extends Function {
  readonly prototype: ComponentBinding<any, any, any>;
}

export declare abstract class ComponentBinding<C extends Component, S extends Component, U = never> {
  /** @hidden */
  _owner: C;
  /** @hidden */
  _component: S | null;

  constructor(owner: C, bindingName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): C;

  get component(): S | null;

  getComponent(): S;

  setComponent(component: S | U | null): void;

  /** @hidden */
  doSetComponent(newComponent: S | null): void;

  /** @hidden */
  willSetComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  onSetComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  didSetComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  willSetOwnComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  onSetOwnComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  didSetOwnComponent(newComponent: S | null, oldComponent: S | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentComponent: Component, key?: string | null): S | null;
  insert(key?: string | null): S | null;

  remove(): S | null;

  createComponent(): S | U | null;

  /** @hidden */
  insertComponent(parentComponent: Component, childComponent: S, key: string | undefined): void;

  fromAny(value: S | U): S | null;

  static define<C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentBindingDescriptorExtends<C, S, U, I>): ComponentBindingConstructor<C, S, U, I>;
  static define<C extends Component, S extends Component = Component, U = never>(descriptor: ComponentBindingDescriptor<C, S, U>): ComponentBindingConstructor<C, S, U>;
}

export interface ComponentBinding<C extends Component, S extends Component, U = never> {
  (): S | null;
  (component: S | U | null): C;
}

export function ComponentBinding<C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentBindingDescriptorExtends<C, S, U, I>): PropertyDecorator;
export function ComponentBinding<C extends Component, S extends Component = Component, U = never>(descriptor: ComponentBindingDescriptor<C, S, U>): PropertyDecorator;

export function ComponentBinding<C extends Component, S extends Component, U>(
    this: ComponentBinding<C, S, U> | typeof ComponentBinding,
    owner: C | ComponentBindingDescriptor<C, S, U>,
    bindingName?: string,
  ): ComponentBinding<C, S, U> | PropertyDecorator {
  if (this instanceof ComponentBinding) { // constructor
    return ComponentBindingConstructor.call(this as unknown as ComponentBinding<Component, Component, unknown>, owner as C, bindingName);
  } else { // decorator factory
    return ComponentBindingDecoratorFactory(owner as ComponentBindingDescriptor<C, S, U>);
  }
}
__extends(ComponentBinding, Object);
Component.Binding = ComponentBinding;

function ComponentBindingConstructor<C extends Component, S extends Component, U>(this: ComponentBinding<C, S, U>, owner: C, bindingName: string | undefined): ComponentBinding<C, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._component = null;
  return this;
}

function ComponentBindingDecoratorFactory<C extends Component, S extends Component, U>(descriptor: ComponentBindingDescriptor<C, S, U>): PropertyDecorator {
  return Component.decorateComponentBinding.bind(Component, ComponentBinding.define(descriptor as ComponentBindingDescriptor<Component, Component>));
}

Object.defineProperty(ComponentBinding.prototype, "owner", {
  get: function <C extends Component>(this: ComponentBinding<C, Component>): C {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentBinding.prototype, "component", {
  get: function <S extends Component>(this: ComponentBinding<Component, S>): S | null {
    return this._component;
  },
  enumerable: true,
  configurable: true,
});

ComponentBinding.prototype.getComponent = function <S extends Component>(this: ComponentBinding<Component, S>): S {
  const component = this.component;
  if (component === null) {
    throw new TypeError("null " + this.name + " component");
  }
  return component;
};

ComponentBinding.prototype.setComponent = function <S extends Component, U>(this: ComponentBinding<Component, S, U>,
                                                                            component: S | U | null): void {
  if (component !== null) {
    component = this.fromAny(component);
  }
  if (this.child === true) {
    if (component === null) {
      this._owner.setChildComponent(this.name, null);
    } else if ((component as S).parentComponent !== this._owner || (component as S).key !== this.name) {
      this.insertComponent(this._owner, component as S, this.name);
    }
  } else {
    this.doSetComponent(component as S | null);
  }
};

ComponentBinding.prototype.doSetComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                           newComponent: S | null): void {
  const oldComponent = this._component;
  if (oldComponent !== newComponent) {
    this.willSetOwnComponent(newComponent, oldComponent);
    this.willSetComponent(newComponent, oldComponent);
    this._component = newComponent;
    this.onSetOwnComponent(newComponent, oldComponent);
    this.onSetComponent(newComponent, oldComponent);
    this.didSetComponent(newComponent, oldComponent);
    this.didSetOwnComponent(newComponent, oldComponent);
  }
};

ComponentBinding.prototype.willSetComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                             newComponent: S | null,
                                                                             oldComponent: S | null): void {
  // hook
};

ComponentBinding.prototype.onSetComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                           newComponent: S | null,
                                                                           oldComponent: S | null): void {
  // hook
};

ComponentBinding.prototype.didSetComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                            newComponent: S | null,
                                                                            oldComponent: S | null): void {
  // hook
};

ComponentBinding.prototype.willSetOwnComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                                newComponent: S | null,
                                                                                oldComponent: S | null): void {
  // hook
};

ComponentBinding.prototype.onSetOwnComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                              newComponent: S | null,
                                                                              oldComponent: S | null): void {
  if (this.observe === true && this._owner.isMounted()) {
    if (oldComponent !== null) {
      oldComponent.removeComponentObserver(this as ComponentObserverType<S>);
    }
    if (newComponent !== null) {
      newComponent.addComponentObserver(this as ComponentObserverType<S>);
    }
  }
};

ComponentBinding.prototype.didSetOwnComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                               newComponent: S | null,
                                                                               oldComponent: S | null): void {
  // hook
};

ComponentBinding.prototype.mount = function <S extends Component>(this: ComponentBinding<Component, S>): void {
  const component = this._component;
  if (component !== null && this.observe === true) {
    component.addComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentBinding.prototype.unmount = function <S extends Component>(this: ComponentBinding<Component, S>): void {
  const component = this._component;
  if (component !== null && this.observe === true) {
    component.removeComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentBinding.prototype.insert = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                   parentComponent?: Component | string | null,
                                                                   key?: string | null): S | null {
  let component = this._component;
  if (component === null) {
    component = this.createComponent();
  }
  if (component !== null) {
    if (typeof parentComponent === "string" || parentComponent === null) {
      key = parentComponent;
      parentComponent = void 0;
    }
    if (parentComponent === void 0) {
      parentComponent = this._owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (component.parentComponent !== parentComponent || component.key !== key) {
      this.insertComponent(parentComponent, component, key);
    }
    if (this._component === null) {
      this.doSetComponent(component);
    }
  }
  return component
};

ComponentBinding.prototype.remove = function <S extends Component>(this: ComponentBinding<Component, S>): S | null {
  const component = this._component;
  if (component !== null) {
    component.remove();
  }
  return component;
};

ComponentBinding.prototype.createComponent = function <S extends Component, U>(this: ComponentBinding<Component, S, U>): S | U | null {
  return null;
};

ComponentBinding.prototype.insertComponent = function <S extends Component>(this: ComponentBinding<Component, S>,
                                                                            parentComponent: Component, childComponent: S,
                                                                            key: string | undefined): void {
  if (key !== void 0) {
    parentComponent.setChildComponent(key, childComponent);
  } else {
    parentComponent.appendChildComponent(childComponent);
  }
};

ComponentBinding.prototype.fromAny = function <S extends Component, U>(this: ComponentBinding<Component, S, U>, value: S | U): S | null {
  return value as S | null;
};

ComponentBinding.define = function <C extends Component, S extends Component, U, I>(descriptor: ComponentBindingDescriptor<C, S, U, I>): ComponentBindingConstructor<C, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentBinding;
  }

  const _constructor = function ComponentBindingAccessor(this: ComponentBinding<C, S>, owner: C, bindingName: string | undefined): ComponentBinding<C, S, U> {
    let _this: ComponentBinding<C, S, U> = function accessor(component?: S | U | null): S | null | C {
      if (component === void 0) {
        return _this._component;
      } else {
        _this.setComponent(component);
        return _this._owner;
      }
    } as ComponentBinding<C, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as ComponentBindingConstructor<C, S, U, I>;

  const _prototype = descriptor as unknown as ComponentBinding<C, S, U> & I;
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
