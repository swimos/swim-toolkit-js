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
import {Model} from "../Model";
import {Trait} from "../Trait";
import type {TraitObserverType} from "../TraitObserver";

export type ModelTraitMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer S, any>} ? S : unknown;

export type ModelTraitMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer T, infer U>} ? T | U : unknown;

export interface ModelTraitInit<S extends Trait, U = never> {
  extends?: ModelTraitClass;
  key?: string | boolean;
  type?: unknown;
  sibling?: boolean;
  observe?: boolean;

  willSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;
  onSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;
  didSetTrait?(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  createTrait?(): S | U | null;
  insertTrait?(model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ModelTraitDescriptor<M extends Model, S extends Trait, U = never, I = {}> = ModelTraitInit<S, U> & ThisType<ModelTrait<M, S, U> & I> & I;

export interface ModelTraitConstructor<M extends Model, S extends Trait, U = never, I = {}> {
  new(owner: M, key: string | undefined, fastenerName: string | undefined): ModelTrait<M, S, U> & I;
  prototype: Omit<ModelTrait<any, any>, "key"> & {key?: string | boolean} & I;
}

export interface ModelTraitClass extends Function {
  readonly prototype: Omit<ModelTrait<any, any>, "key"> & {key?: string | boolean};
}

export interface ModelTrait<M extends Model, S extends Trait, U = never> {
  (): S | null;
  (trait: S | U | null, targetTrait?: Trait | null): M;

  readonly name: string;

  readonly owner: M;

  readonly key: string | undefined;

  readonly trait: S | null;

  getTrait(): S;

  setTrait(newTrait: S | U | null, targetTrait?: Trait | null): S | null;

  /** @hidden */
  doSetTrait(newTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  attachTrait(newTrait: S): void;

  /** @hidden */
  detachTrait(oldTrait: S): void;

  /** @hidden */
  willSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  onSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  /** @hidden */
  didSetTrait(newTrait: S | null, oldTrait: S | null, targetTrait: Trait | null): void;

  injectTrait(model?: Model | null, trait?: S | U | null, targetTrait?: Trait | null, key?: string | null): S | null;

  createTrait(): S | U | null;

  /** @hidden */
  insertTrait(model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void;

  removeTrait(): S | null;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  sibling?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;
}

export const ModelTrait = function <M extends Model, S extends Trait, U>(
    this: ModelTrait<M, S, U> | typeof ModelTrait,
    owner: M | ModelTraitDescriptor<M, S, U>,
    key?: string,
    fastenerName?: string,
  ): ModelTrait<M, S, U> | PropertyDecorator {
  if (this instanceof ModelTrait) { // constructor
    return ModelTraitConstructor.call(this as unknown as ModelTrait<Model, Trait, unknown>, owner as M, key, fastenerName);
  } else { // decorator factory
    return ModelTraitDecoratorFactory(owner as ModelTraitDescriptor<M, S, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, S extends Trait, U = never>(owner: M, key: string | undefined, fastenerName: string | undefined): ModelTrait<M, S, U>;

  <M extends Model, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: {extends: ModelTraitClass | undefined} & ModelTraitDescriptor<M, S, U, I>): PropertyDecorator;
  <M extends Model, S extends Trait = Trait, U = never>(descriptor: {observe: boolean} & ModelTraitDescriptor<M, S, U, TraitObserverType<S>>): PropertyDecorator;
  <M extends Model, S extends Trait = Trait, U = never>(descriptor: ModelTraitDescriptor<M, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelTrait<any, any>;

  define<M extends Model, S extends Trait = Trait, U = never, I = TraitObserverType<S>>(descriptor: {extends: ModelTraitClass | undefined} & ModelTraitDescriptor<M, S, U, I>): ModelTraitConstructor<M, S, U>;
  define<M extends Model, S extends Trait = Trait, U = never>(descriptor: {observe: boolean} & ModelTraitDescriptor<M, S, U, TraitObserverType<S>>): ModelTraitConstructor<M, S, U>;
  define<M extends Model, S extends Trait = Trait, U = never>(descriptor: ModelTraitDescriptor<M, S, U>): ModelTraitConstructor<M, S, U>;
};
__extends(ModelTrait, Object);

function ModelTraitConstructor<M extends Model, S extends Trait, U>(this: ModelTrait<M, S, U>, owner: M, key: string | undefined, fastenerName: string | undefined): ModelTrait<M, S, U> {
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
  Object.defineProperty(this, "key", {
    value: key,
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
    if (newTrait !== null && (newTrait.model !== this.owner || newTrait.key !== this.key)) {
      this.insertTrait(this.owner, newTrait, targetTrait, this.key);
    } else if (newTrait === null && oldTrait !== null) {
      oldTrait.remove();
    }
  }
  this.doSetTrait(newTrait, targetTrait);
  return oldTrait;
};

ModelTrait.prototype.doSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S | null, targetTrait: Trait | null): void {
  const oldTrait = this.trait;
  if (oldTrait !== newTrait) {
    this.willSetTrait(newTrait, oldTrait, targetTrait);
    if (oldTrait !== null) {
      this.detachTrait(oldTrait);
    }
    Object.defineProperty(this, "trait", {
      value: newTrait,
      enumerable: true,
      configurable: true,
    });
    if (newTrait !== null) {
      this.attachTrait(newTrait);
    }
    this.onSetTrait(newTrait, oldTrait, targetTrait);
    this.didSetTrait(newTrait, oldTrait, targetTrait);
  }
};

ModelTrait.prototype.attachTrait = function <S extends Trait>(this: ModelTrait<Model, S>, newTrait: S): void {
  if (this.observe === true && this.owner.isMounted()) {
    newTrait.addTraitObserver(this as TraitObserverType<S>);
  }
};

ModelTrait.prototype.detachTrait = function <S extends Trait>(this: ModelTrait<Model, S>, oldTrait: S): void {
  if (this.observe === true && this.owner.isMounted()) {
    oldTrait.removeTraitObserver(this as TraitObserverType<S>);
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

ModelTrait.prototype.injectTrait = function <S extends Trait>(this: ModelTrait<Model, S>, model?: Model | null, trait?: S | null, targetTrait?: Trait | null, key?: string | null): S | null {
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
      key = this.key;
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

ModelTrait.prototype.createTrait = function <S extends Trait, U>(this: ModelTrait<Model, S, U>): S | U | null {
  return null;
};

ModelTrait.prototype.insertTrait = function <S extends Trait>(this: ModelTrait<Model, S>, model: Model, trait: S, targetTrait: Trait | null, key: string | undefined): void {
  model.insertTrait(trait, targetTrait, key);
};

ModelTrait.prototype.removeTrait = function <S extends Trait>(this: ModelTrait<Model, S>): S | null {
  const trait = this.trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

ModelTrait.prototype.fromAny = function <S extends Trait, U>(this: ModelTrait<Model, S, U>, value: S | U): S | null {
  const type = this.type;
  if (FromAny.is<S, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof Trait) {
    return value;
  }
  return null;
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

ModelTrait.define = function <M extends Model, S extends Trait, U, I>(descriptor: ModelTraitDescriptor<M, S, U, I>): ModelTraitConstructor<M, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ModelTrait;
  }

  const _constructor = function DecoratedModelTrait(this: ModelTrait<M, S>, owner: M, key: string | undefined, fastenerName: string | undefined): ModelTrait<M, S, U> {
    let _this: ModelTrait<M, S, U> = function ModelTraitAccessor(trait?: S | U | null, targetTrait?: Trait | null): S | null | M {
      if (trait === void 0) {
        return _this.trait;
      } else {
        _this.setTrait(trait, targetTrait);
        return _this.owner;
      }
    } as ModelTrait<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, key, fastenerName) || _this;
    return _this;
  } as unknown as ModelTraitConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelTrait<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.sibling === void 0) {
    _prototype.sibling = true;
  }

  return _constructor;
};
