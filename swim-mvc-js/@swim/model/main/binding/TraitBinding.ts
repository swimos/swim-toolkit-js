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
import type {Model} from "../Model";
import {Trait} from "../Trait";
import type {TraitObserverType} from "../TraitObserver";

export type TraitBindingMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitBinding<any, infer S, any>} ? S : unknown;

export type TraitBindingMemberInit<R, K extends keyof R> =
  R extends {[P in K]: TraitBinding<any, infer T, infer U>} ? T | U : unknown;

export interface TraitBindingInit<S extends Trait, U = never> {
  extends?: TraitBindingClass;
  observe?: boolean;
  sibling?: boolean;
  type?: unknown;

  willSetTrait?(newTrait: S | null, oldTrait: S | null): void;
  onSetTrait?(newTrait: S | null, oldTrait: S | null): void;
  didSetTrait?(newTrait: S | null, oldTrait: S | null): void;
  createTrait?(): S | U | null;
  insertTrait?(model: Model, trait: S, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type TraitBindingDescriptor<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = TraitBindingInit<S, U> & ThisType<TraitBinding<R, S, U> & I> & I;

export type TraitBindingDescriptorExtends<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = {extends: TraitBindingClass | undefined} & TraitBindingDescriptor<R, S, U, I>;

export type TraitBindingDescriptorFromAny<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & TraitBindingDescriptor<R, S, U, I>;

export interface TraitBindingConstructor<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> {
  new(owner: R, bindingName: string | undefined): TraitBinding<R, S, U> & I;
  prototype: TraitBinding<any, any, any> & I;
}

export interface TraitBindingClass extends Function {
  readonly prototype: TraitBinding<any, any, any>;
}

export declare abstract class TraitBinding<R extends Trait, S extends Trait, U = never> {
  /** @hidden */
  _owner: R;
  /** @hidden */
  _trait: S | null;

  constructor(owner: R, bindingName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  sibling?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): R;

  get trait(): S | null;

  getTrait(): S;

  setTrait(trait: S | U | null): void;

  /** @hidden */
  doSetTrait(newTrait: S | null): void;

  /** @hidden */
  willSetTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  onSetTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  didSetTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  willSetOwnTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  onSetOwnTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  didSetOwnTrait(newTrait: S | null, oldTrait: S | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(model: Model, key?: string | null): S | null;
  insert(key?: string | null): S | null;

  remove(): S | null;

  createTrait(): S | U | null;

  /** @hidden */
  insertTrait(model: Model, trait: S, key: string | undefined): void;

  fromAny(value: S | U): S | null;

  static define<R extends Trait, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: TraitBindingDescriptorExtends<R, S, U, I>): TraitBindingConstructor<R, S, U>;
  static define<R extends Trait, S extends Trait = Trait, U = never>(descriptor: TraitBindingDescriptor<R, S, U>): TraitBindingConstructor<R, S, U>;
}

export interface TraitBinding<R extends Trait, S extends Trait, U = never> {
  (): S | null;
  (trait: S | U | null): R;
}

export function TraitBinding<R extends Trait, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: TraitBindingDescriptorExtends<R, S, U, I>): PropertyDecorator;
export function TraitBinding<R extends Trait, S extends Trait = Trait, U = never>(descriptor: TraitBindingDescriptor<R, S, U>): PropertyDecorator;

export function TraitBinding<R extends Trait, S extends Trait, U>(
    this: TraitBinding<R, S, U> | typeof TraitBinding,
    owner: R | TraitBindingDescriptor<R, S, U>,
    bindingName?: string,
  ): TraitBinding<R, S, U> | PropertyDecorator {
  if (this instanceof TraitBinding) { // constructor
    return TraitBindingConstructor.call(this as unknown as TraitBinding<Trait, Trait, unknown>, owner as R, bindingName);
  } else { // decorator factory
    return TraitBindingDecoratorFactory(owner as TraitBindingDescriptor<R, S, U>);
  }
}
__extends(TraitBinding, Object);
Trait.Binding = TraitBinding;

function TraitBindingConstructor<R extends Trait, S extends Trait, U>(this: TraitBinding<R, S, U>, owner: R, bindingName: string | undefined): TraitBinding<R, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._trait = null;
  return this;
}

function TraitBindingDecoratorFactory<R extends Trait, S extends Trait, U>(descriptor: TraitBindingDescriptor<R, S, U>): PropertyDecorator {
  return Trait.decorateTraitBinding.bind(Trait, TraitBinding.define(descriptor as TraitBindingDescriptor<Trait, Trait>));
}

Object.defineProperty(TraitBinding.prototype, "owner", {
  get: function <R extends Trait>(this: TraitBinding<R, Trait>): R {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitBinding.prototype, "trait", {
  get: function <S extends Trait>(this: TraitBinding<Trait, S>): S | null {
    return this._trait;
  },
  enumerable: true,
  configurable: true,
});

TraitBinding.prototype.getTrait = function <S extends Trait>(this: TraitBinding<Trait, S>): S {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

TraitBinding.prototype.setTrait = function <S extends Trait, U>(this: TraitBinding<Trait, S, U>,
                                                                trait: S | U | null): void {
  if (trait !== null) {
    trait = this.fromAny(trait);
  }
  let model: Model | null | undefined;
  if (this.sibling === true && (model = this._owner.model, model !== null)) {
    if (trait === null) {
      model.setTrait(this.name, null);
    } else if ((trait as S).model !== model || (trait as S).key !== this.name) {
      this.insertTrait(model, trait as S, this.name);
    }
  } else {
    this.doSetTrait(trait as S | null);
  }
};

TraitBinding.prototype.doSetTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                               newTrait: S | null): void {
  const oldTrait = this._trait;
  if (oldTrait !== newTrait) {
    this.willSetOwnTrait(newTrait, oldTrait);
    this.willSetTrait(newTrait, oldTrait);
    this._trait = newTrait;
    this.onSetOwnTrait(newTrait, oldTrait);
    this.onSetTrait(newTrait, oldTrait);
    this.didSetTrait(newTrait, oldTrait);
    this.didSetOwnTrait(newTrait, oldTrait);
  }
};

TraitBinding.prototype.willSetTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                 newTrait: S | null,
                                                                 oldTrait: S | null): void {
  // hook
};

TraitBinding.prototype.onSetTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                               newTrait: S | null,
                                                               oldTrait: S | null): void {
  // hook
};

TraitBinding.prototype.didSetTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                newTrait: S | null,
                                                                oldTrait: S | null): void {
  // hook
};

TraitBinding.prototype.willSetOwnTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                    newTrait: S | null,
                                                                    oldTrait: S | null): void {
  // hook
};

TraitBinding.prototype.onSetOwnTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                  newTrait: S | null,
                                                                  oldTrait: S | null): void {
  if (this.observe === true && this._owner.isMounted()) {
    if (oldTrait !== null) {
      oldTrait.removeTraitObserver(this as TraitObserverType<S>);
    }
    if (newTrait !== null) {
      newTrait.addTraitObserver(this as TraitObserverType<S>);
    }
  }
};

TraitBinding.prototype.didSetOwnTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                   newTrait: S | null,
                                                                   oldTrait: S | null): void {
  // hook
};

TraitBinding.prototype.mount = function <S extends Trait>(this: TraitBinding<Trait, S>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<S>);
  }
};

TraitBinding.prototype.unmount = function <S extends Trait>(this: TraitBinding<Trait, S>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<S>);
  }
};

TraitBinding.prototype.insert = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                           model?: Model | string | null,
                                                           key?: string | null): S | null {
  let trait = this._trait;
  if (trait === null) {
    trait = this.createTrait();
  }
  if (trait !== null) {
    if (typeof model === "string" || model === null) {
      key = model;
      model = void 0;
    }
    if (model === void 0) {
      model = this._owner.model;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (model !== null && (trait.model !== model || trait.key !== key)) {
      this.insertTrait(model, trait, key);
    }
    if (this._trait === null) {
      this.doSetTrait(trait);
    }
  }
  return trait;
};

TraitBinding.prototype.remove = function <S extends Trait>(this: TraitBinding<Trait, S>): S | null {
  const trait = this._trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

TraitBinding.prototype.createTrait = function <S extends Trait, U>(this: TraitBinding<Trait, S, U>): S | U | null {
  return null;
};

TraitBinding.prototype.insertTrait = function <S extends Trait>(this: TraitBinding<Trait, S>,
                                                                model: Model, trait: S,
                                                                key: string | undefined): void {
  if (key !== void 0) {
    model.setTrait(key, trait);
  } else {
    model.appendTrait(trait);
  }
};

TraitBinding.prototype.fromAny = function <S extends Trait, U>(this: TraitBinding<Trait, S, U>, value: S | U): S | null {
  return value as S | null;
};

TraitBinding.define = function <R extends Trait, S extends Trait, U, I>(descriptor: TraitBindingDescriptor<R, S, U, I>): TraitBindingConstructor<R, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = TraitBinding;
  }

  const _constructor = function TraitBindingAccessor(this: TraitBinding<R, S>, owner: R, bindingName: string | undefined): TraitBinding<R, S, U> {
    let _this: TraitBinding<R, S, U> = function accessor(trait?: S | U | null): S | null | R {
      if (trait === void 0) {
        return _this._trait;
      } else {
        _this.setTrait(trait);
        return _this._owner;
      }
    } as TraitBinding<R, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as TraitBindingConstructor<R, S, U, I>;

  const _prototype = descriptor as unknown as TraitBinding<R, S, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }
  if (_prototype.sibling === void 0) {
    _prototype.sibling = true;
  }

  return _constructor;
};
