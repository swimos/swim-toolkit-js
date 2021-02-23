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

export type TraitFastenerMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitFastener<any, infer S, any>} ? S : unknown;

export type TraitFastenerMemberInit<R, K extends keyof R> =
  R extends {[P in K]: TraitFastener<any, infer T, infer U>} ? T | U : unknown;

export interface TraitFastenerInit<S extends Trait, U = never> {
  extends?: TraitFastenerClass;
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

export type TraitFastenerDescriptor<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = TraitFastenerInit<S, U> & ThisType<TraitFastener<R, S, U> & I> & I;

export type TraitFastenerDescriptorExtends<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = {extends: TraitFastenerClass | undefined} & TraitFastenerDescriptor<R, S, U, I>;

export type TraitFastenerDescriptorFromAny<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & TraitFastenerDescriptor<R, S, U, I>;

export interface TraitFastenerConstructor<R extends Trait, S extends Trait, U = never, I = TraitObserverType<S>> {
  new(owner: R, fastenerName: string | undefined): TraitFastener<R, S, U> & I;
  prototype: TraitFastener<any, any> & I;
}

export interface TraitFastenerClass extends Function {
  readonly prototype: TraitFastener<any, any>;
}

export interface TraitFastener<R extends Trait, S extends Trait, U = never> {
  (): S | null;
  (trait: S | U | null): R;

  readonly name: string;

  readonly owner: R;

  readonly trait: S | null;

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

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  sibling?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;
}

export const TraitFastener = function <R extends Trait, S extends Trait, U>(
    this: TraitFastener<R, S, U> | typeof TraitFastener,
    owner: R | TraitFastenerDescriptor<R, S, U>,
    fastenerName?: string,
  ): TraitFastener<R, S, U> | PropertyDecorator {
  if (this instanceof TraitFastener) { // constructor
    return TraitFastenerConstructor.call(this as unknown as TraitFastener<Trait, Trait, unknown>, owner as R, fastenerName);
  } else { // decorator factory
    return TraitFastenerDecoratorFactory(owner as TraitFastenerDescriptor<R, S, U>);
  }
} as {
  /** @hidden */
  new<R extends Trait, S extends Trait, U = never>(owner: R, fastenerName: string | undefined): TraitFastener<R, S, U>;

  <R extends Trait, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: TraitFastenerDescriptorExtends<R, S, U, I>): PropertyDecorator;
  <R extends Trait, S extends Trait = Trait, U = never>(descriptor: TraitFastenerDescriptor<R, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: TraitFastener<any, any>;

  define<R extends Trait, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: TraitFastenerDescriptorExtends<R, S, U, I>): TraitFastenerConstructor<R, S, U>;
  define<R extends Trait, S extends Trait = Trait, U = never>(descriptor: TraitFastenerDescriptor<R, S, U>): TraitFastenerConstructor<R, S, U>;
};
__extends(TraitFastener, Object);

function TraitFastenerConstructor<R extends Trait, S extends Trait, U>(this: TraitFastener<R, S, U>, owner: R, fastenerName: string | undefined): TraitFastener<R, S, U> {
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
  Object.defineProperty(this, "trait", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function TraitFastenerDecoratorFactory<R extends Trait, S extends Trait, U>(descriptor: TraitFastenerDescriptor<R, S, U>): PropertyDecorator {
  return Trait.decorateTraitFastener.bind(Trait, TraitFastener.define(descriptor as TraitFastenerDescriptor<Trait, Trait>));
}

TraitFastener.prototype.getTrait = function <S extends Trait>(this: TraitFastener<Trait, S>): S {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

TraitFastener.prototype.setTrait = function <S extends Trait, U>(this: TraitFastener<Trait, S, U>, trait: S | U | null): void {
  if (trait !== null) {
    trait = this.fromAny(trait);
  }
  let model: Model | null | undefined;
  if (this.sibling === true && (model = this.owner.model, model !== null)) {
    if (trait === null) {
      model.setTrait(this.name, null);
    } else if ((trait as S).model !== model || (trait as S).key !== this.name) {
      this.insertTrait(model, trait as S, this.name);
    }
  } else {
    this.doSetTrait(trait as S | null);
  }
};

TraitFastener.prototype.doSetTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null): void {
  const oldTrait = this.trait;
  if (oldTrait !== newTrait) {
    this.willSetOwnTrait(newTrait, oldTrait);
    this.willSetTrait(newTrait, oldTrait);
    Object.defineProperty(this, "trait", {
      value: newTrait,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnTrait(newTrait, oldTrait);
    this.onSetTrait(newTrait, oldTrait);
    this.didSetTrait(newTrait, oldTrait);
    this.didSetOwnTrait(newTrait, oldTrait);
  }
};

TraitFastener.prototype.willSetTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  // hook
};

TraitFastener.prototype.onSetTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  // hook
};

TraitFastener.prototype.didSetTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  // hook
};

TraitFastener.prototype.willSetOwnTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  // hook
};

TraitFastener.prototype.onSetOwnTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldTrait !== null) {
      oldTrait.removeTraitObserver(this as TraitObserverType<S>);
    }
    if (newTrait !== null) {
      newTrait.addTraitObserver(this as TraitObserverType<S>);
    }
  }
};

TraitFastener.prototype.didSetOwnTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, newTrait: S | null, oldTrait: S | null): void {
  // hook
};

TraitFastener.prototype.mount = function <S extends Trait>(this: TraitFastener<Trait, S>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<S>);
  }
};

TraitFastener.prototype.unmount = function <S extends Trait>(this: TraitFastener<Trait, S>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<S>);
  }
};

TraitFastener.prototype.insert = function <S extends Trait>(this: TraitFastener<Trait, S>, model?: Model | string | null, key?: string | null): S | null {
  let trait = this.trait;
  if (trait === null) {
    trait = this.createTrait();
  }
  if (trait !== null) {
    if (typeof model === "string" || model === null) {
      key = model;
      model = void 0;
    }
    if (model === void 0) {
      model = this.owner.model;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (model !== null && (trait.model !== model || trait.key !== key)) {
      this.insertTrait(model, trait, key);
    }
    if (this.trait === null) {
      this.doSetTrait(trait);
    }
  }
  return trait;
};

TraitFastener.prototype.remove = function <S extends Trait>(this: TraitFastener<Trait, S>): S | null {
  const trait = this.trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

TraitFastener.prototype.createTrait = function <S extends Trait, U>(this: TraitFastener<Trait, S, U>): S | U | null {
  return null;
};

TraitFastener.prototype.insertTrait = function <S extends Trait>(this: TraitFastener<Trait, S>, model: Model, trait: S, key: string | undefined): void {
  if (key !== void 0) {
    model.setTrait(key, trait);
  } else {
    model.appendTrait(trait);
  }
};

TraitFastener.prototype.fromAny = function <S extends Trait, U>(this: TraitFastener<Trait, S, U>, value: S | U): S | null {
  return value as S | null;
};

TraitFastener.define = function <R extends Trait, S extends Trait, U, I>(descriptor: TraitFastenerDescriptor<R, S, U, I>): TraitFastenerConstructor<R, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = TraitFastener;
  }

  const _constructor = function DecoratedTraitFastener(this: TraitFastener<R, S>, owner: R, fastenerName: string | undefined): TraitFastener<R, S, U> {
    let _this: TraitFastener<R, S, U> = function TraitFastenerAccessor(trait?: S | U | null): S | null | R {
      if (trait === void 0) {
        return _this.trait;
      } else {
        _this.setTrait(trait);
        return _this.owner;
      }
    } as TraitFastener<R, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as TraitFastenerConstructor<R, S, U, I>;

  const _prototype = descriptor as unknown as TraitFastener<any, any> & I;
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
