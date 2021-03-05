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

export type ComponentFastenerMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentFastener<any, infer S, any>} ? S : unknown;

export type ComponentFastenerMemberInit<C, K extends keyof C> =
  C extends {[P in K]: ComponentFastener<any, infer T, infer U>} ? T | U : unknown;

export interface ComponentFastenerInit<S extends Component, U = never> {
  extends?: ComponentFastenerClass;
  observe?: boolean;
  child?: boolean;
  type?: unknown;

  willSetComponent?(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;
  onSetComponent?(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;
  didSetComponent?(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;
  createComponent?(): S | U | null;
  insertComponent?(parentComponent: Component, childComponent: S, targetComponent: Component | null, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ComponentFastenerDescriptor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ComponentFastenerInit<S, U> & ThisType<ComponentFastener<C, S, U> & I> & I;

export type ComponentFastenerDescriptorExtends<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = {extends: ComponentFastenerClass | undefined} & ComponentFastenerDescriptor<C, S, U, I>;

export type ComponentFastenerDescriptorFromAny<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ComponentFastenerDescriptor<C, S, U, I>;

export interface ComponentFastenerConstructor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> {
  new(owner: C, fastenerName: string | undefined): ComponentFastener<C, S, U> & I;
  prototype: ComponentFastener<any, any> & I;
}

export interface ComponentFastenerClass extends Function {
  readonly prototype: ComponentFastener<any, any>;
}

export interface ComponentFastener<C extends Component, S extends Component, U = never> {
  (): S | null;
  (component: S | U | null, targetComponent?: Component | null): C;

  readonly name: string;

  readonly owner: C;

  readonly component: S | null;

  getComponent(): S;

  setComponent(newComponent: S | U | null, targetComponent?: Component | null): S | null;

  /** @hidden */
  doSetComponent(newComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  willSetComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  onSetComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  didSetComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  willSetOwnComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  onSetOwnComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  didSetOwnComponent(newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentComponent?: Component | null, childComponent?: S | U | null, targetComponent?: Component | null, key?: string | null): S | null;

  remove(): S | null;

  createComponent(): S | U | null;

  /** @hidden */
  insertComponent(parentComponent: Component, childComponent: S, targetComponent: Component | null, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;
}

export const ComponentFastener = function <C extends Component, S extends Component, U>(
    this: ComponentFastener<C, S, U> | typeof ComponentFastener,
    owner: C | ComponentFastenerDescriptor<C, S, U>,
    fastenerName?: string,
  ): ComponentFastener<C, S, U> | PropertyDecorator {
  if (this instanceof ComponentFastener) { // constructor
    return ComponentFastenerConstructor.call(this as unknown as ComponentFastener<Component, Component, unknown>, owner as C, fastenerName);
  } else { // decorator factory
    return ComponentFastenerDecoratorFactory(owner as ComponentFastenerDescriptor<C, S, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, S extends Component, U = never>(owner: C, fastenerName: string | undefined): ComponentFastener<C, S, U>;

  <C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentFastenerDescriptorExtends<C, S, U, I>): PropertyDecorator;
  <C extends Component, S extends Component = Component, U = never>(descriptor: ComponentFastenerDescriptor<C, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentFastener<any, any>;

  define<C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentFastenerDescriptorExtends<C, S, U, I>): ComponentFastenerConstructor<C, S, U, I>;
  define<C extends Component, S extends Component = Component, U = never>(descriptor: ComponentFastenerDescriptor<C, S, U>): ComponentFastenerConstructor<C, S, U>;
};
__extends(ComponentFastener, Object);

function ComponentFastenerConstructor<C extends Component, S extends Component, U>(this: ComponentFastener<C, S, U>, owner: C, fastenerName: string | undefined): ComponentFastener<C, S, U> {
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
  Object.defineProperty(this, "component", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentFastenerDecoratorFactory<C extends Component, S extends Component, U>(descriptor: ComponentFastenerDescriptor<C, S, U>): PropertyDecorator {
  return Component.decorateComponentFastener.bind(Component, ComponentFastener.define(descriptor as ComponentFastenerDescriptor<Component, Component>));
}

ComponentFastener.prototype.getComponent = function <S extends Component>(this: ComponentFastener<Component, S>): S {
  const component = this.component;
  if (component === null) {
    throw new TypeError("null " + this.name + " component");
  }
  return component;
};

ComponentFastener.prototype.setComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, targetComponent?: Component | null): S | null {
  const oldComponent = this.component;
  if (newComponent !== null) {
    newComponent = this.fromAny(newComponent);
  }
  if (targetComponent === void 0) {
    targetComponent = null;
  }
  if (this.child === true) {
    if (newComponent === null) {
      this.owner.setChildComponent(this.name, null);
    } else if (newComponent.parentComponent !== this.owner || newComponent.key !== this.name) {
      this.insertComponent(this.owner, newComponent, targetComponent, this.name);
    }
  } else {
    this.doSetComponent(newComponent, targetComponent);
  }
  return oldComponent;
};

ComponentFastener.prototype.doSetComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, targetComponent: Component | null): void {
  const oldComponent = this.component;
  if (oldComponent !== newComponent) {
    this.willSetOwnComponent(newComponent, oldComponent, targetComponent);
    this.willSetComponent(newComponent, oldComponent, targetComponent);
    Object.defineProperty(this, "component", {
      value: newComponent,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnComponent(newComponent, oldComponent, targetComponent);
    this.onSetComponent(newComponent, oldComponent, targetComponent);
    this.didSetComponent(newComponent, oldComponent, targetComponent);
    this.didSetOwnComponent(newComponent, oldComponent, targetComponent);
  }
};

ComponentFastener.prototype.willSetComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  // hook
};

ComponentFastener.prototype.onSetComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  // hook
};

ComponentFastener.prototype.didSetComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  // hook
};

ComponentFastener.prototype.willSetOwnComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  // hook
};

ComponentFastener.prototype.onSetOwnComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldComponent !== null) {
      oldComponent.removeComponentObserver(this as ComponentObserverType<S>);
    }
    if (newComponent !== null) {
      newComponent.addComponentObserver(this as ComponentObserverType<S>);
    }
  }
};

ComponentFastener.prototype.didSetOwnComponent = function <S extends Component>(this: ComponentFastener<Component, S>, newComponent: S | null, oldComponent: S | null, targetComponent: Component | null): void {
  // hook
};

ComponentFastener.prototype.mount = function <S extends Component>(this: ComponentFastener<Component, S>): void {
  const component = this.component;
  if (component !== null && this.observe === true) {
    component.addComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentFastener.prototype.unmount = function <S extends Component>(this: ComponentFastener<Component, S>): void {
  const component = this.component;
  if (component !== null && this.observe === true) {
    component.removeComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentFastener.prototype.insert = function <S extends Component>(this: ComponentFastener<Component, S>, parentComponent?: Component | null, childComponent?: S | null, targetComponent?: Component | null, key?: string | null): S | null {
  if (targetComponent === void 0) {
    targetComponent = null;
  }
  if (childComponent === void 0 || childComponent === null) {
    childComponent = this.component;
    if (childComponent === null) {
      childComponent = this.createComponent();
    }
  } else {
    childComponent = this.fromAny(childComponent);
    if (childComponent !== null) {
      this.doSetComponent(childComponent, targetComponent);
    }
  }
  if (childComponent !== null) {
    if (parentComponent === void 0 || parentComponent === null) {
      parentComponent = this.owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (childComponent.parentComponent !== parentComponent || childComponent.key !== key) {
      this.insertComponent(parentComponent, childComponent, targetComponent, key);
    }
    if (this.component === null) {
      this.doSetComponent(childComponent, targetComponent);
    }
  }
  return childComponent
};

ComponentFastener.prototype.remove = function <S extends Component>(this: ComponentFastener<Component, S>): S | null {
  const childComponent = this.component;
  if (childComponent !== null) {
    childComponent.remove();
  }
  return childComponent;
};

ComponentFastener.prototype.createComponent = function <S extends Component, U>(this: ComponentFastener<Component, S, U>): S | U | null {
  return null;
};

ComponentFastener.prototype.insertComponent = function <S extends Component>(this: ComponentFastener<Component, S>, parentComponent: Component, childComponent: S, targetComponent: Component | null, key: string | undefined): void {
  parentComponent.insertChildComponent(childComponent, targetComponent, key);
};

ComponentFastener.prototype.fromAny = function <S extends Component, U>(this: ComponentFastener<Component, S, U>, value: S | U): S | null {
  return value as S | null;
};

ComponentFastener.define = function <C extends Component, S extends Component, U, I>(descriptor: ComponentFastenerDescriptor<C, S, U, I>): ComponentFastenerConstructor<C, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentFastener;
  }

  const _constructor = function DecoratedComponentFastener(this: ComponentFastener<C, S>, owner: C, fastenerName: string | undefined): ComponentFastener<C, S, U> {
    let _this: ComponentFastener<C, S, U> = function ComponentFastenerAccessor(component?: S | U | null, targetComponent?: Component | null): S | null | C {
      if (component === void 0) {
        return _this.component;
      } else {
        _this.setComponent(component, targetComponent);
        return _this.owner;
      }
    } as ComponentFastener<C, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as ComponentFastenerConstructor<C, S, U, I>;

  const _prototype = descriptor as unknown as ComponentFastener<any, any> & I;
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
