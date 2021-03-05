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
import {Model} from "../Model";
import type {Trait} from "../Trait";
import type {TraitObserverType} from "../TraitObserver";

export type ModelTraitMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer S, any>} ? S : unknown;

export type ModelTraitMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer T, infer U>} ? T | U : unknown;

export interface ModelTraitInit<S extends Trait, U = never> {
  extends?: ModelTraitClass;
  observe?: boolean;
  sibling?: boolean;
  type?: unknown;

  willSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;
  onSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;
  didSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;
  createTrait?(): S | U | null;
  insertTrait?(model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ModelTraitDescriptor<M extends Model, S extends Trait, U = never, I = TraitObserverType<S>> = ModelTraitInit<S, U> & ThisType<ModelTrait<M, S, U> & I> & I;

export type ModelTraitDescriptorExtends<M extends Model, S extends Trait, U = never, I = TraitObserverType<S>> = {extends: ModelTraitClass | undefined} & ModelTraitDescriptor<M, S, U, I>;

export type ModelTraitDescriptorFromAny<M extends Model, S extends Trait, U = never, I = TraitObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ModelTraitDescriptor<M, S, U, I>;

export interface ModelTraitConstructor<M extends Model, S extends Trait, U = never, I = TraitObserverType<S>> {
  new(owner: M, fastenerName: string | undefined): ModelTrait<M, S, U> & I;
  prototype: ModelTrait<any, any> & I;
}

export interface ModelTraitClass extends Function {
  readonly prototype: ModelTrait<any, any>;
}

export interface ModelTrait<M extends Model, S extends Trait, U = never> {
  (): S | null;
  (trait: S | U | null, targetTrait?: Trait | null): M;

  readonly name: string;

  readonly owner: M;

  readonly trait: S | null;

  getTrait(): S;

  setTrait(newTrait: S | U | null, targetTrait?: Trait | null): S | null;

  /** @hidden */
  doSetTrait(newTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  willSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  onSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  didSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  willSetOwnTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  onSetOwnTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  didSetOwnTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(model?: Model | null, trait?: S | U | null, targetTrait?: Trait | null, key?: string | null): S | null;

  remove(): S | null;

  createTrait(): S | U | null;

  /** @hidden */
  insertTrait(model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  sibling?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;
}

export const ModelTrait = function <M extends Model, S extends Trait, U>(
    this: ModelTrait<M, S, U> | typeof ModelTrait,
    owner: M | ModelTraitDescriptor<M, S, U>,
    fastenerName?: string,
  ): ModelTrait<M, S, U> | PropertyDecorator {
  if (this instanceof ModelTrait) { // constructor
    return ModelTraitConstructor.call(this as unknown as ModelTrait<Model, Trait, unknown>, owner as M, fastenerName);
  } else { // decorator factory
    return ModelTraitDecoratorFactory(owner as ModelTraitDescriptor<M, S, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, S extends Trait, U = never>(owner: M, fastenerName: string | undefined): ModelTrait<M, S, U>;

  <M extends Model, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: ModelTraitDescriptorExtends<M, S, U, I>): PropertyDecorator;
  <M extends Model, S extends Trait = Trait, U = never>(descriptor: ModelTraitDescriptor<M, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelTrait<any, any>;

  define<M extends Model, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: ModelTraitDescriptorExtends<M, S, U, I>): ModelTraitConstructor<M, S, U>;
  define<M extends Model, S extends Trait = Trait, U = never>(descriptor: ModelTraitDescriptor<M, S, U>): ModelTraitConstructor<M, S, U>;
};
__extends(ModelTrait, Object);

function ModelTraitConstructor<M extends Model, S extends Trait, U>(this: ModelTrait<M, S, U>, owner: M, fastenerName: string | undefined): ModelTrait<M, S, U> {
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

function ModelTraitDecoratorFactory<M extends Model, S extends Trait, U>(descriptor: ModelTraitDescriptor<M, S, U>): PropertyDecorator {
  return Model.decorateModelTrait.bind(Model, ModelTrait.define(descriptor as ModelTraitDescriptor<Model, Trait>));
}

ModelTrait.prototype.getTrait = function <S extends Trait>(this: ModelTrait<Model, S>): S {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

ModelTrait.prototype.setTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, targetTrait?: Trait | null): S | null {
  const oldTrait = this.trait;
  if (newTrait !== null) {
    newTrait = this.fromAny(newTrait);
  }
  if (targetTrait === void 0) {
    targetTrait = null;
  }
  if (this.sibling === true) {
    if (newTrait === null) {
      this.owner.setTrait(this.name, null);
    } else if (newTrait.model !== this.owner || newTrait.key !== this.name) {
      this.insertTrait(this.owner, newTrait, targetTrait, this.name);
    }
  } else {
    this.doSetTrait(newTrait, targetTrait);
  }
  return oldTrait;
};

ModelTrait.prototype.doSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, targetTrait: Trait | null): void {
  const oldTrait = this.trait;
  if (oldTrait !== newTrait) {
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
};

ModelTrait.prototype.willSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  // hook
};

ModelTrait.prototype.onSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  // hook
};

ModelTrait.prototype.didSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  // hook
};

ModelTrait.prototype.willSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  // hook
};

ModelTrait.prototype.onSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldTrait !== null) {
      oldTrait.removeTraitObserver(this as TraitObserverType<S>);
    }
    if (newTrait !== null) {
      newTrait.addTraitObserver(this as TraitObserverType<S>);
    }
  }
};

ModelTrait.prototype.didSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void {
  // hook
};

ModelTrait.prototype.mount = function <S extends Trait>(this: ModelTrait<Model, S>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<S>);
  }
};

ModelTrait.prototype.unmount = function <S extends Trait>(this: ModelTrait<Model, S>): void {
  const trait = this.trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<S>);
  }
};

ModelTrait.prototype.insert = function <S extends Trait>(this: ModelTrait<Model, S>, model?: Model | null, trait?: S | null, targetTrait?: Trait | null, key?: string | null): S | null {
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
      this.doSetTrait(trait, targetTrait);
    }
  }
  if (trait !== null) {
    if (model === void 0 || model === null) {
      model = this.owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (trait.model !== model || trait.key !== key) {
      this.insertTrait(this.owner, trait, targetTrait, key);
    }
    if (this.trait === null) {
      this.doSetTrait(trait, targetTrait);
    }
  }
  return trait;
};

ModelTrait.prototype.remove = function <S extends Trait>(this: ModelTrait<Model, S>): S | null {
  const trait = this.trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

ModelTrait.prototype.createTrait = function <S extends Trait, U>(this: ModelTrait<Model, S, U>): S | U | null {
  return null;
};

ModelTrait.prototype.insertTrait = function <S extends Trait>(this: ModelTrait<Model, S>, model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void {
  model.insertTrait(trait, targetTrait, key);
};

ModelTrait.prototype.fromAny = function <S extends Trait, U>(this: ModelTrait<Model, S, U>, value: S | U): S | null {
  return value as S | null;
};

ModelTrait.define = function <M extends Model, S extends Trait, U, I>(descriptor: ModelTraitDescriptor<M, S, U, I>): ModelTraitConstructor<M, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ModelTrait;
  }

  const _constructor = function DecoratedModelTrait(this: ModelTrait<M, S>, owner: M, fastenerName: string | undefined): ModelTrait<M, S, U> {
    let _this: ModelTrait<M, S, U> = function ModelTraitAccessor(trait?: S | U | null, targetTrait?: Trait | null): S | null | M {
      if (trait === void 0) {
        return _this.trait;
      } else {
        _this.setTrait(trait, targetTrait);
        return _this.owner;
      }
    } as ModelTrait<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as ModelTraitConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelTrait<any, any> & I;
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
