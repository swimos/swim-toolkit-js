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
import {Component} from "./Component";
import {ComponentObserverType} from "./ComponentObserver";
import {SubcomponentObserver} from "./SubcomponentObserver";

export type SubcomponentType<C, K extends keyof C> =
  C extends {[P in K]: Subcomponent<any, infer S>} ? S : unknown;

export interface SubcomponentInit<C extends Component, S extends Component> {
  type?: unknown;
  observer?: boolean;

  willSetSubcomponent?(newSubcomponent: S | null, oldSubcomponent: S | null): void;
  onSetSubcomponent?(newSubcomponent: S | null, oldSubcomponent: S | null): void;
  didSetSubcomponent?(newSubcomponent: S | null, oldSubcomponent: S | null): void;
  createSubcomponent?(): S | null;

  extends?: SubcomponentPrototype<S>;
}

export type SubcomponentDescriptor<C extends Component, S extends Component, I = ComponentObserverType<S>> = SubcomponentInit<C, S> & ThisType<Subcomponent<C, S> & I> & I;

export type SubcomponentPrototype<S extends Component> = Function & { prototype: Subcomponent<Component, S> };

export type SubcomponentConstructor<S extends Component> = new <C extends Component>(component: C, subcomponentName: string | undefined) => Subcomponent<C, S>;

export declare abstract class Subcomponent<C extends Component, S extends Component> {
  /** @hidden */
  _component: C;
  /** @hidden */
  _subcomponent: S | null;

  constructor(component: C, subcomponentName: string | undefined);

  get name(): string;

  get component(): C;

  get subcomponent(): S | null;

  getSubcomponent(): S;

  setSubcomponent(newSubcomponent: S | null): void;

  /** @hidden */
  doSetSubcomponent(newSubcomponent: S | null): void;

  /** @hidden */
  willSetSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  /** @hidden */
  onSetSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  /** @hidden */
  didSetSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  /** @hidden */
  willSetOwnSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  /** @hidden */
  onSetOwnSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  /** @hidden */
  didSetOwnSubcomponent(newSubcomponent: S | null, oldSubcomponent: S | null): void;

  createSubcomponent(): S | null;

  mount(): void;

  unmount(): void;

  // Forward type declarations
  /** @hidden */
  static Observer: typeof SubcomponentObserver; // defined by SubcomponentObserver
}

export interface Subcomponent<C extends Component, S extends Component> {
  (): S | null;
  (subcomponent: S | null): C;
}

export function Subcomponent<C extends Component, S extends Component = Component, I = ComponentObserverType<S>>(descriptor: {extends: SubcomponentPrototype<S>} & SubcomponentDescriptor<C, S, I>): PropertyDecorator;
export function Subcomponent<C extends Component, S extends Component = Component, I = ComponentObserverType<S>>(descriptor: SubcomponentDescriptor<C, S, I>): PropertyDecorator;

export function Subcomponent<C extends Component, S extends Component>(
    this: Subcomponent<C, S> | typeof Subcomponent,
    component: C | SubcomponentInit<C, S>,
    subcomponentName?: string,
  ): Subcomponent<C, S> | PropertyDecorator {
  if (this instanceof Subcomponent) { // constructor
    return SubcomponentConstructor.call(this, component as C, subcomponentName);
  } else { // decorator factory
    return SubcomponentDecoratorFactory(component as SubcomponentInit<C, S>);
  }
}
__extends(Subcomponent, Object);
Component.Subcomponent = Subcomponent;

function SubcomponentConstructor<C extends Component, S extends Component>(this: Subcomponent<C, S>, component: C, subcomponentName: string | undefined): Subcomponent<C, S> {
  if (subcomponentName !== void 0) {
    Object.defineProperty(this, "name", {
      value: subcomponentName,
      enumerable: true,
      configurable: true,
    });
  }
  this._component = component;
  this._subcomponent = null;
  return this;
}

function SubcomponentDecoratorFactory<C extends Component, S extends Component>(descriptor: SubcomponentInit<C, S>): PropertyDecorator {
  const observer = descriptor.observer;
  delete descriptor.observer;

  let BaseSubcomponent = descriptor.extends;
  delete descriptor.extends;
  if (BaseSubcomponent === void 0) {
    if (observer !== false) {
      BaseSubcomponent = Subcomponent.Observer;
    } else {
      BaseSubcomponent = Subcomponent;
    }
  }

  function DecoratedSubcomponent(this: Subcomponent<C, S>, component: C, subcomponentName: string | undefined): Subcomponent<C, S> {
    let _this: Subcomponent<C, S> = function accessor(subcomponent?: S | null): S | null | C {
      if (subcomponent === void 0) {
        return _this._subcomponent;
      } else {
        _this.setSubcomponent(subcomponent);
        return _this._component;
      }
    } as Subcomponent<C, S>;
    Object.setPrototypeOf(_this, this);
    _this = BaseSubcomponent!.call(_this, component, subcomponentName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedSubcomponent, BaseSubcomponent);
    DecoratedSubcomponent.prototype = descriptor as Subcomponent<C, S>;
    DecoratedSubcomponent.prototype.constructor = DecoratedSubcomponent;
    Object.setPrototypeOf(DecoratedSubcomponent.prototype, BaseSubcomponent.prototype);
  } else {
    __extends(DecoratedSubcomponent, BaseSubcomponent);
  }

  return Component.decorateSubcomponent.bind(void 0, DecoratedSubcomponent);
}

Object.defineProperty(Subcomponent.prototype, "component", {
  get: function <C extends Component>(this: Subcomponent<C, Component>): C {
    return this._component;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(Subcomponent.prototype, "subcomponent", {
  get: function <S extends Component>(this: Subcomponent<Component, S>): S | null {
    return this._subcomponent;
  },
  enumerable: true,
  configurable: true,
});

Subcomponent.prototype.getSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>): S {
  const subcomponent = this.subcomponent;
  if (subcomponent === null) {
    throw new TypeError("null " + this.name + " subcomponent");
  }
  return subcomponent;
};

Subcomponent.prototype.setSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                        newSubcomponent: S | null): void {
  this._component.setChildComponent(this.name, newSubcomponent);
};

Subcomponent.prototype.doSetSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                          newSubcomponent: S | null): void {
  const oldSubcomponent = this._subcomponent;
  if (oldSubcomponent !== newSubcomponent) {
    this.willSetOwnSubcomponent(newSubcomponent, oldSubcomponent);
    this.willSetSubcomponent(newSubcomponent, oldSubcomponent);
    this._subcomponent = newSubcomponent;
    this.onSetOwnSubcomponent(newSubcomponent, oldSubcomponent);
    this.onSetSubcomponent(newSubcomponent, oldSubcomponent);
    this.didSetSubcomponent(newSubcomponent, oldSubcomponent);
    this.didSetOwnSubcomponent(newSubcomponent, oldSubcomponent);
  }
};

Subcomponent.prototype.willSetSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                            newSubcomponent: S | null,
                                                                            oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.onSetSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                          newSubcomponent: S | null,
                                                                          oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.didSetSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                           newSubcomponent: S | null,
                                                                           oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.willSetOwnSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                               newSubcomponent: S | null,
                                                                               oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.onSetOwnSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                             newSubcomponent: S | null,
                                                                             oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.didSetOwnSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>,
                                                                              newSubcomponent: S | null,
                                                                              oldSubcomponent: S | null): void {
  // hook
};

Subcomponent.prototype.createSubcomponent = function <S extends Component>(this: Subcomponent<Component, S>): S | null {
  return null;
};

Subcomponent.prototype.mount = function (this: Subcomponent<Component, Component>): void {
  // hook
};

Subcomponent.prototype.unmount = function (this: Subcomponent<Component, Component>): void {
  // hook
};
