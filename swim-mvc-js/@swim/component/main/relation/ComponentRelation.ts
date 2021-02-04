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

export type ComponentRelationMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentRelation<any, infer S, any>} ? S : unknown;

export type ComponentRelationMemberInit<C, K extends keyof C> =
  C extends {[P in K]: ComponentRelation<any, infer T, infer U>} ? T | U : unknown;

export interface ComponentRelationInit<S extends Component, U = never> {
  extends?: ComponentRelationClass;
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

export type ComponentRelationDescriptor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ComponentRelationInit<S, U> & ThisType<ComponentRelation<C, S, U> & I> & I;

export type ComponentRelationDescriptorExtends<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = {extends: ComponentRelationClass | undefined} & ComponentRelationDescriptor<C, S, U, I>;

export type ComponentRelationDescriptorFromAny<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ComponentRelationDescriptor<C, S, U, I>;

export interface ComponentRelationConstructor<C extends Component, S extends Component, U = never, I = ComponentObserverType<S>> {
  new(owner: C, relationName: string | undefined): ComponentRelation<C, S, U> & I;
  prototype: ComponentRelation<any, any> & I;
}

export interface ComponentRelationClass extends Function {
  readonly prototype: ComponentRelation<any, any>;
}

export interface ComponentRelation<C extends Component, S extends Component, U = never> {
  (): S | null;
  (component: S | U | null): C;

  readonly name: string;

  readonly owner: C;

  readonly component: S | null;

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

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;
}

export const ComponentRelation = function <C extends Component, S extends Component, U>(
    this: ComponentRelation<C, S, U> | typeof ComponentRelation,
    owner: C | ComponentRelationDescriptor<C, S, U>,
    relationName?: string,
  ): ComponentRelation<C, S, U> | PropertyDecorator {
  if (this instanceof ComponentRelation) { // constructor
    return ComponentRelationConstructor.call(this as unknown as ComponentRelation<Component, Component, unknown>, owner as C, relationName);
  } else { // decorator factory
    return ComponentRelationDecoratorFactory(owner as ComponentRelationDescriptor<C, S, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, S extends Component, U = never>(owner: C, relationName: string | undefined): ComponentRelation<C, S, U>;

  <C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentRelationDescriptorExtends<C, S, U, I>): PropertyDecorator;
  <C extends Component, S extends Component = Component, U = never>(descriptor: ComponentRelationDescriptor<C, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentRelation<any, any>;

  define<C extends Component, S extends Component = Component, U = never, I = ComponentObserverType<S>>(descriptor: ComponentRelationDescriptorExtends<C, S, U, I>): ComponentRelationConstructor<C, S, U, I>;
  define<C extends Component, S extends Component = Component, U = never>(descriptor: ComponentRelationDescriptor<C, S, U>): ComponentRelationConstructor<C, S, U>;
};
__extends(ComponentRelation, Object);

function ComponentRelationConstructor<C extends Component, S extends Component, U>(this: ComponentRelation<C, S, U>, owner: C, relationName: string | undefined): ComponentRelation<C, S, U> {
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
  Object.defineProperty(this, "component", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentRelationDecoratorFactory<C extends Component, S extends Component, U>(descriptor: ComponentRelationDescriptor<C, S, U>): PropertyDecorator {
  return Component.decorateComponentRelation.bind(Component, ComponentRelation.define(descriptor as ComponentRelationDescriptor<Component, Component>));
}

ComponentRelation.prototype.getComponent = function <S extends Component>(this: ComponentRelation<Component, S>): S {
  const component = this.component;
  if (component === null) {
    throw new TypeError("null " + this.name + " component");
  }
  return component;
};

ComponentRelation.prototype.setComponent = function <S extends Component, U>(this: ComponentRelation<Component, S, U>, component: S | U | null): void {
  if (component !== null) {
    component = this.fromAny(component);
  }
  if (this.child === true) {
    if (component === null) {
      this.owner.setChildComponent(this.name, null);
    } else if ((component as S).parentComponent !== this.owner || (component as S).key !== this.name) {
      this.insertComponent(this.owner, component as S, this.name);
    }
  } else {
    this.doSetComponent(component as S | null);
  }
};

ComponentRelation.prototype.doSetComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null): void {
  const oldComponent = this.component;
  if (oldComponent !== newComponent) {
    this.willSetOwnComponent(newComponent, oldComponent);
    this.willSetComponent(newComponent, oldComponent);
    Object.defineProperty(this, "component", {
      value: newComponent,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnComponent(newComponent, oldComponent);
    this.onSetComponent(newComponent, oldComponent);
    this.didSetComponent(newComponent, oldComponent);
    this.didSetOwnComponent(newComponent, oldComponent);
  }
};

ComponentRelation.prototype.willSetComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  // hook
};

ComponentRelation.prototype.onSetComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  // hook
};

ComponentRelation.prototype.didSetComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  // hook
};

ComponentRelation.prototype.willSetOwnComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  // hook
};

ComponentRelation.prototype.onSetOwnComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldComponent !== null) {
      oldComponent.removeComponentObserver(this as ComponentObserverType<S>);
    }
    if (newComponent !== null) {
      newComponent.addComponentObserver(this as ComponentObserverType<S>);
    }
  }
};

ComponentRelation.prototype.didSetOwnComponent = function <S extends Component>(this: ComponentRelation<Component, S>, newComponent: S | null, oldComponent: S | null): void {
  // hook
};

ComponentRelation.prototype.mount = function <S extends Component>(this: ComponentRelation<Component, S>): void {
  const component = this.component;
  if (component !== null && this.observe === true) {
    component.addComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentRelation.prototype.unmount = function <S extends Component>(this: ComponentRelation<Component, S>): void {
  const component = this.component;
  if (component !== null && this.observe === true) {
    component.removeComponentObserver(this as ComponentObserverType<S>);
  }
};

ComponentRelation.prototype.insert = function <S extends Component>(this: ComponentRelation<Component, S>, parentComponent?: Component | string | null, key?: string | null): S | null {
  let component = this.component;
  if (component === null) {
    component = this.createComponent();
  }
  if (component !== null) {
    if (typeof parentComponent === "string" || parentComponent === null) {
      key = parentComponent;
      parentComponent = void 0;
    }
    if (parentComponent === void 0) {
      parentComponent = this.owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (component.parentComponent !== parentComponent || component.key !== key) {
      this.insertComponent(parentComponent, component, key);
    }
    if (this.component === null) {
      this.doSetComponent(component);
    }
  }
  return component
};

ComponentRelation.prototype.remove = function <S extends Component>(this: ComponentRelation<Component, S>): S | null {
  const component = this.component;
  if (component !== null) {
    component.remove();
  }
  return component;
};

ComponentRelation.prototype.createComponent = function <S extends Component, U>(this: ComponentRelation<Component, S, U>): S | U | null {
  return null;
};

ComponentRelation.prototype.insertComponent = function <S extends Component>(this: ComponentRelation<Component, S>, parentComponent: Component, childComponent: S, key: string | undefined): void {
  if (key !== void 0) {
    parentComponent.setChildComponent(key, childComponent);
  } else {
    parentComponent.appendChildComponent(childComponent);
  }
};

ComponentRelation.prototype.fromAny = function <S extends Component, U>(this: ComponentRelation<Component, S, U>, value: S | U): S | null {
  return value as S | null;
};

ComponentRelation.define = function <C extends Component, S extends Component, U, I>(descriptor: ComponentRelationDescriptor<C, S, U, I>): ComponentRelationConstructor<C, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentRelation;
  }

  const _constructor = function DecoratedComponentRelation(this: ComponentRelation<C, S>, owner: C, relationName: string | undefined): ComponentRelation<C, S, U> {
    let _this: ComponentRelation<C, S, U> = function ComponentRelationAccessor(component?: S | U | null): S | null | C {
      if (component === void 0) {
        return _this.component;
      } else {
        _this.setComponent(component);
        return _this.owner;
      }
    } as ComponentRelation<C, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, relationName) || _this;
    return _this;
  } as unknown as ComponentRelationConstructor<C, S, U, I>;

  const _prototype = descriptor as unknown as ComponentRelation<any, any> & I;
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
