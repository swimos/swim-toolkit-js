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
import type {Model, Trait, TraitObserverType} from "@swim/model";
import {Component} from "../Component";

export type ComponentTraitMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentTrait<any, infer R, any>} ? R : unknown;

export type ComponentTraitMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ComponentTrait<any, infer R, infer U>} ? R | U : unknown;

export interface ComponentTraitInit<R extends Trait, U = never> {
  extends?: ComponentTraitClass;
  observe?: boolean;
  type?: unknown;

  willSetTrait?(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;
  onSetTrait?(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;
  didSetTrait?(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;
  createTrait?(): R | U | null;
  insertTrait?(model: Model, trait: R, targetTrait: Trait | null, key: string | undefined): void;
  fromAny?(value: R | U): R | null;
}

export type ComponentTraitDescriptor<C extends Component, R extends Trait, U = never, I = TraitObserverType<R>> = ComponentTraitInit<R, U> & ThisType<ComponentTrait<C, R, U> & I> & I;

export type ComponentTraitDescriptorExtends<C extends Component, R extends Trait, U = never, I = TraitObserverType<R>> = {extends: ComponentTraitClass | undefined} & ComponentTraitDescriptor<C, R, U, I>;

export type ComponentTraitDescriptorFromAny<C extends Component, R extends Trait, U = never, I = TraitObserverType<R>> = ({type: FromAny<R, U>} | {fromAny(value: R | U): R | null}) & ComponentTraitDescriptor<C, R, U, I>;

export interface ComponentTraitConstructor<C extends Component, R extends Trait, U = never, I = TraitObserverType<R>> {
  new(owner: C, traitName: string | undefined): ComponentTrait<C, R, U> & I;
  prototype: ComponentTrait<any, any> & I;
}

export interface ComponentTraitClass extends Function {
  readonly prototype: ComponentTrait<any, any>;
}

export interface ComponentTrait<C extends Component, R extends Trait, U = never> {
  (): R | null;
  (trait: R | U | null, targetTrait?: Trait | null): C;

  readonly name: string;

  readonly owner: C;

  readonly trait: R | null;

  getTrait(): R;

  setTrait(newTrait: R | U | null, targetTrait?: Trait | null): R | null;

  /** @hidden */
  willSetTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  onSetTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  didSetTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  willSetOwnTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  onSetOwnTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  didSetOwnTrait(newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(model: Model, trait?: R | U | null, targetTrait?: Trait | null, key?: string | null): R | null;

  remove(): R | null;

  createTrait(): R | U | null;

  /** @hidden */
  insertTrait(model: Model, trait: R, targetTrait: Trait | null, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: R | U): R | null;
}

export const ComponentTrait = function <C extends Component, R extends Trait, U>(
    this: ComponentTrait<C, R, U> | typeof ComponentTrait,
    owner: C | ComponentTraitDescriptor<C, R, U>,
    traitName?: string,
  ): ComponentTrait<C, R, U> | PropertyDecorator {
  if (this instanceof ComponentTrait) { // constructor
    return ComponentTraitConstructor.call(this as unknown as ComponentTrait<Component, Trait, unknown>, owner as C, traitName);
  } else { // decorator factory
    return ComponentTraitDecoratorFactory(owner as ComponentTraitDescriptor<C, R, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, R extends Trait, U = never>(owner: C, traitName: string | undefined): ComponentTrait<C, R, U>;

  <C extends Component, R extends Trait = Trait, U = never, I = TraitObserverType<R>>(descriptor: ComponentTraitDescriptorExtends<C, R, U, I>): PropertyDecorator;
  <C extends Component, R extends Trait = Trait, U = never>(descriptor: ComponentTraitDescriptor<C, R, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentTrait<any, any>;

  define<C extends Component, R extends Trait = Trait, U = never, I = TraitObserverType<R>>(descriptor: ComponentTraitDescriptorExtends<C, R, U, I>): ComponentTraitConstructor<C, R, U, I>;
  define<C extends Component, R extends Trait = Trait, U = never>(descriptor: ComponentTraitDescriptor<C, R, U>): ComponentTraitConstructor<C, R, U>;
};
__extends(ComponentTrait, Object);

function ComponentTraitConstructor<C extends Component, R extends Trait, U>(this: ComponentTrait<C, R, U>, owner: C, traitName: string | undefined): ComponentTrait<C, R, U> {
  if (traitName !== void 0) {
    Object.defineProperty(this, "name", {
      value: traitName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(this, "trait", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentTraitDecoratorFactory<C extends Component, R extends Trait, U>(descriptor: ComponentTraitDescriptor<C, R, U>): PropertyDecorator {
  return Component.decorateComponentTrait.bind(Component, ComponentTrait.define(descriptor as ComponentTraitDescriptor<Component, Trait>));
}

ComponentTrait.prototype.getTrait = function <R extends Trait>(this: ComponentTrait<Component, R>): R {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

ComponentTrait.prototype.setTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, targetTrait?: Trait | null): R | null {
  const oldTrait = this.trait;
  if (newTrait !== null) {
    newTrait = this.fromAny(newTrait);
  }
  if (oldTrait !== newTrait) {
    if (targetTrait === void 0) {
      targetTrait = null;
    }
    this.willSetOwnTrait(newTrait, oldTrait, targetTrait);
    this.willSetTrait(newTrait, oldTrait, targetTrait);
    Object.defineProperty(this, "trait", {
      value: newTrait,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnTrait(newTrait, oldTrait, targetTrait);
    this.onSetTrait(newTrait, oldTrait, targetTrait);
    this.didSetTrait(newTrait, oldTrait, targetTrait);
    this.didSetOwnTrait(newTrait, oldTrait, targetTrait);
  }
  return oldTrait;
};

ComponentTrait.prototype.willSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  // hook
};

ComponentTrait.prototype.onSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  // hook
};

ComponentTrait.prototype.didSetTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  // hook
};

ComponentTrait.prototype.willSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  this.owner.willSetComponentTrait(this, newTrait, oldTrait, targetTrait);
};

ComponentTrait.prototype.onSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  this.owner.onSetComponentTrait(this, newTrait, oldTrait, targetTrait);
  if (this.observe === true && this.owner.isMounted()) {
    if (oldTrait !== null) {
      oldTrait.removeTraitObserver(this as TraitObserverType<R>);
    }
    if (newTrait !== null) {
      newTrait.addTraitObserver(this as TraitObserverType<R>);
    }
  }
};

ComponentTrait.prototype.didSetOwnTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, newTrait: R | null, oldTrait: R | null, targetTrait: Trait | null): void {
  this.owner.didSetComponentTrait(this, newTrait, oldTrait, targetTrait);
};

ComponentTrait.prototype.mount = function <R extends Trait>(this: ComponentTrait<Component, R>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<R>);
  }
};

ComponentTrait.prototype.unmount = function <R extends Trait>(this: ComponentTrait<Component, R>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<R>);
  }
};

ComponentTrait.prototype.insert = function <R extends Trait>(this: ComponentTrait<Component, R>, model: Model, trait?: R | null, targetTrait?: Trait | null, key?: string | null): R | null {
  if (targetTrait === void 0) {
    targetTrait = null;
  }
  if (trait === void 0 || trait === null) {
    trait = this.trait;
    if (trait === null) {
      trait = this.createTrait();
    }
  } else {
    trait = this.fromAny(trait);
    if (trait !== null) {
      this.setTrait(trait, targetTrait);
    }
  }
  if (trait !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (trait.model !== model || trait.key !== key) {
      this.insertTrait(model, trait, targetTrait, key);
    }
    if (this.trait === null) {
      this.setTrait(trait, targetTrait);
    }
  }
  return trait;
};

ComponentTrait.prototype.remove = function <R extends Trait>(this: ComponentTrait<Component, R>): R | null {
  const trait = this.trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

ComponentTrait.prototype.createTrait = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>): R | U | null {
  return null;
};

ComponentTrait.prototype.insertTrait = function <R extends Trait>(this: ComponentTrait<Component, R>, model: Model, trait: R, targetTrait: Trait | null, key: string | undefined): void {
  model.insertTrait(trait, targetTrait, key);
};

ComponentTrait.prototype.fromAny = function <R extends Trait, U>(this: ComponentTrait<Component, R, U>, value: R | U): R | null {
  return value as R | null;
};

ComponentTrait.define = function <C extends Component, R extends Trait, U, I>(descriptor: ComponentTraitDescriptor<C, R, U, I>): ComponentTraitConstructor<C, R, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentTrait;
  }

  const _constructor = function DecoratedComponentTrait(this: ComponentTrait<C, R, U>, owner: C, traitName: string | undefined): ComponentTrait<C, R, U> {
    let _this: ComponentTrait<C, R, U> = function ComponentTraitAccessor(trait?: R | null, targetTrait?: Trait | null): R | null | C {
      if (trait === void 0) {
        return _this.trait;
      } else {
        _this.setTrait(trait, targetTrait);
        return _this.owner;
      }
    } as ComponentTrait<C, R, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, traitName) || _this;
    return _this;
  } as unknown as ComponentTraitConstructor<C, R, U, I>;

  const _prototype = descriptor as unknown as ComponentTrait<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }

  return _constructor;
};
