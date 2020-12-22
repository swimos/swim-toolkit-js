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
import {Model, Trait, TraitObserverType} from "@swim/model";
import {Component} from "../Component";

export type ComponentTraitMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentTrait<any, infer R, any>} ? R : unknown;

export type ComponentTraitMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ComponentTrait<any, infer R, infer U>} ? R | U : unknown;

export interface ComponentTraitInit<R extends Trait, U = R> {
  extends?: ComponentTraitPrototype;
  observe?: boolean;
  type?: unknown;

  willSetTrait?(newTrait: R | null, oldTrait: R | null): void;
  onSetTrait?(newTrait: R | null, oldTrait: R | null): void;
  didSetTrait?(newTrait: R | null, oldTrait: R | null): void;
  createTrait?(): R | U | null;
  insertTrait?(model: Model, trait: R, key: string | undefined): void;
  fromAny?(value: R | U): R | null;
}

export type ComponentTraitDescriptorInit<C extends Component, R extends Trait, U = R, I = TraitObserverType<R>> = ComponentTraitInit<R, U> & ThisType<ComponentTrait<C, R, U> & I> & I;

export type ComponentTraitDescriptorExtends<C extends Component, R extends Trait, U = R, I = TraitObserverType<R>> = {extends: ComponentTraitPrototype | undefined} & ComponentTraitDescriptorInit<C, R, U, I>;

export type ComponentTraitDescriptorFromAny<C extends Component, R extends Trait, U = R, I = TraitObserverType<R>> = ({type: FromAny<R, U>} | {fromAny(value: R | U): R | null}) & ComponentTraitDescriptorInit<C, R, U, I>;

export type ComponentTraitDescriptor<C extends Component, R extends Trait, U = R, I = TraitObserverType<R>> =
  U extends R ? ComponentTraitDescriptorInit<C, R, U, I> :
  ComponentTraitDescriptorFromAny<C, R, U, I>;

export interface ComponentTraitPrototype extends Function {
  readonly prototype: ComponentTrait<any, any>;
}

export interface ComponentTraitConstructor<C extends Component, R extends Trait, U = R, I = TraitObserverType<R>> {
  new(owner: C, traitName: string | undefined): ComponentTrait<C, R, U> & I;
  prototype: ComponentTrait<any, any, any> & I;
}

export declare abstract class ComponentTrait<C extends Component, R extends Trait, U = R> {
  /** @hidden */
  _owner: C;
  /** @hidden */
  _trait: R | null;
  /** @hidden */
  _auto: boolean;

  constructor(owner: C, traitName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): C;

  get trait(): R | null;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getTrait(): R;

  setTrait(newTrait: R | U | null): void;

  /** @hidden */
  willSetTrait(newTrait: R | null, oldTrait: R | null): void;

  /** @hidden */
  onSetTrait(newTrait: R | null, oldTrait: R | null): void;

  /** @hidden */
  didSetTrait(newTrait: R | null, oldTrait: R | null): void;

  setAutoTrait(trait: R | U | null): void;

  /** @hidden */
  setOwnTrait(trait: R | U | null): void;

  /** @hidden */
  willSetOwnTrait(newTrait: R | null, oldTrait: R | null): void;

  /** @hidden */
  onSetOwnTrait(newTrait: R | null, oldTrait: R | null): void;

  /** @hidden */
  didSetOwnTrait(newTrait: R | null, oldTrait: R | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(model: Model, key?: string | null): R | null;

  remove(): R | null;

  createTrait(): R | U | null;

  /** @hidden */
  insertTrait(model: Model, trait: R, key: string | undefined): void;

  fromAny(value: R | U): R | null;

  static define<C extends Component, R extends Trait = Trait, U = R, I = TraitObserverType<R>>(descriptor: ComponentTraitDescriptorExtends<C, R, U, I>): ComponentTraitConstructor<C, R, U, I>;
  static define<C extends Component, R extends Trait = Trait, U = R>(descriptor: ComponentTraitDescriptor<C, R, U>): ComponentTraitConstructor<C, R, U>;
}

export interface ComponentTrait<C extends Component, R extends Trait, U = R> {
  (): R | null;
  (trait: R | U | null): C;
}

export function ComponentTrait<C extends Component, R extends Trait = Trait, U = R, I = TraitObserverType<R>>(descriptor: ComponentTraitDescriptorExtends<C, R, U, I>): PropertyDecorator;
export function ComponentTrait<C extends Component, R extends Trait = Trait, U = R>(descriptor: ComponentTraitDescriptor<C, R, U>): PropertyDecorator;

export function ComponentTrait<C extends Component, R extends Trait, U = R>(
    this: ComponentTrait<C, R, U> | typeof ComponentTrait,
    owner: C | ComponentTraitDescriptor<C, R, U>,
    traitName?: string,
  ): ComponentTrait<C, R, U> | PropertyDecorator {
  if (this instanceof ComponentTrait) { // constructor
    return ComponentTraitConstructor.call(this, owner as C, traitName);
  } else { // decorator factory
    return ComponentTraitDecoratorFactory(owner as ComponentTraitDescriptor<C, R, U>);
  }
}
__extends(ComponentTrait, Object);
Component.Trait = ComponentTrait;

function ComponentTraitConstructor<C extends Component, R extends Trait, U = R>(this: ComponentTrait<C, R, U>, owner: C, traitName: string | undefined): ComponentTrait<C, R, U> {
  if (traitName !== void 0) {
    Object.defineProperty(this, "name", {
      value: traitName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._trait = null;
  this._auto = true;
  return this;
}

function ComponentTraitDecoratorFactory<C extends Component, R extends Trait, U = R>(descriptor: ComponentTraitDescriptor<C, R, U>): PropertyDecorator {
  return Component.decorateComponentTrait.bind(Component, ComponentTrait.define(descriptor));
}

Object.defineProperty(ComponentTrait.prototype, "owner", {
  get: function <C extends Component>(this: ComponentTrait<C, Trait>): C {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentTrait.prototype, "trait", {
  get: function <R extends Trait>(this: ComponentTrait<Component, R>): R | null {
    return this._trait;
  },
  enumerable: true,
  configurable: true,
});

ComponentTrait.prototype.isAuto = function (this: ComponentTrait<Component, Trait>): boolean {
  return this._auto;
};

ComponentTrait.prototype.setAuto = function (this: ComponentTrait<Component, Trait>,
                                             auto: boolean): void {
  this._auto = auto;
};

ComponentTrait.prototype.getTrait = function <R extends Trait>(this: ComponentTrait<Component, R>): R {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

ComponentTrait.prototype.setTrait = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>,
                                                                  trait: R | U | null): void {
  this._auto = false;
  this.setOwnTrait(trait);
};

ComponentTrait.prototype.willSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                   newTrait: R | null,
                                                                   oldTrait: R | null): void {
  // hook
};

ComponentTrait.prototype.onSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                 newTrait: R | null,
                                                                 oldTrait: R | null): void {
  // hook
};

ComponentTrait.prototype.didSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                  newTrait: R | null,
                                                                  oldTrait: R | null): void {
  // hook
};

ComponentTrait.prototype.setAutoTrait = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>,
                                                                      trait: R | U | null): void {
  if (this._auto === true) {
    this.setOwnTrait(trait);
  }
};

ComponentTrait.prototype.setOwnTrait = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>,
                                                                     newTrait: R | U | null): void {
  const oldTrait = this._trait;
  if (newTrait !== null) {
    newTrait = this.fromAny(newTrait);
  }
  if (oldTrait !== newTrait) {
    this.willSetOwnTrait(newTrait as R | null, oldTrait);
    this.willSetTrait(newTrait as R | null, oldTrait);
    this._trait = newTrait as R | null;
    this.onSetOwnTrait(newTrait as R | null, oldTrait);
    this.onSetTrait(newTrait as R | null, oldTrait);
    this.didSetTrait(newTrait as R | null, oldTrait);
    this.didSetOwnTrait(newTrait as R | null, oldTrait);
  }
};

ComponentTrait.prototype.willSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                      newTrait: R | null,
                                                                      oldTrait: R | null): void {
  this._owner.willSetComponentTrait(this, newTrait, oldTrait);
};

ComponentTrait.prototype.onSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                    newTrait: R | null,
                                                                    oldTrait: R | null): void {
  this._owner.onSetComponentTrait(this, newTrait, oldTrait);
  if (this.observe === true && this._owner.isMounted()) {
    if (oldTrait !== null) {
      oldTrait.removeTraitObserver(this as TraitObserverType<R>);
    }
    if (newTrait !== null) {
      newTrait.addTraitObserver(this as TraitObserverType<R>);
    }
  }
};

ComponentTrait.prototype.didSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                     newTrait: R | null,
                                                                     oldTrait: R | null): void {
  this._owner.didSetComponentTrait(this, newTrait, oldTrait);
};

ComponentTrait.prototype.mount = function <R extends Trait>(this: ComponentTrait<Component, R>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<R>);
  }
};

ComponentTrait.prototype.unmount = function <R extends Trait>(this: ComponentTrait<Component, R>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<R>);
  }
};

ComponentTrait.prototype.insert = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                             model: Model, key?: string | null): R | null {
  let trait = this._trait;
  if (trait === null) {
    trait = this.createTrait();
  }
  if (trait !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (trait.model !== model || trait.key !== key) {
      this.insertTrait(model, trait, key);
    }
    if (this._trait === null) {
      this.setTrait(trait);
    }
  }
  return trait;
};

ComponentTrait.prototype.remove = function <R extends Trait>(this: ComponentTrait<Component, R>): R | null {
  const trait = this._trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

ComponentTrait.prototype.createTrait = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>): R | U | null {
  return null;
};

ComponentTrait.prototype.insertTrait = function <R extends Trait>(this: ComponentTrait<Component, R>,
                                                                  model: Model, trait: R,
                                                                  key: string | undefined): void {
  if (key !== void 0) {
    model.setTrait(key, trait);
  } else {
    model.appendTrait(trait);
  }
};

ComponentTrait.prototype.fromAny = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>,
                                                                 value: R | U): R | null {
  return value as R | null;
};

ComponentTrait.define = function <C extends Component, R extends Trait, U, I>(descriptor: ComponentTraitDescriptor<C, R, U, I>): ComponentTraitConstructor<C, R, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentTrait;
  }

  const _constructor = function ComponentTraitAccessor(this: ComponentTrait<C, R, U>, owner: C, traitName: string | undefined): ComponentTrait<C, R, U> {
    let _this: ComponentTrait<C, R, U> = function accessor(trait?: R | null): R | null | C {
      if (trait === void 0) {
        return _this._trait;
      } else {
        _this.setTrait(trait);
        return _this._owner;
      }
    } as ComponentTrait<C, R, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, traitName) || _this;
    return _this;
  } as unknown as ComponentTraitConstructor<C, R, U, I>;

  const _prototype = descriptor as unknown as ComponentTrait<C, R, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }

  return _constructor;
};
