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
import {TraitObserverType} from "../TraitObserver";

export type ModelTraitMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer S, any>} ? S : unknown;

export type ModelTraitMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelTrait<any, infer T, infer U>} ? T | U : unknown;

export interface ModelTraitInit<S extends Trait, U = S> {
  extends?: ModelTraitPrototype;
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

export type ModelTraitDescriptorInit<M extends Model, S extends Trait, U = S, I = TraitObserverType<S>> = ModelTraitInit<S, U> & ThisType<ModelTrait<M, S, U> & I> & I;

export type ModelTraitDescriptorExtends<M extends Model, S extends Trait, U = S, I = TraitObserverType<S>> = {extends: ModelTraitPrototype | undefined} & ModelTraitDescriptorInit<M, S, U, I>;

export type ModelTraitDescriptorFromAny<M extends Model, S extends Trait, U = S, I = TraitObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ModelTraitDescriptorInit<M, S, U, I>;

export type ModelTraitDescriptor<M extends Model, S extends Trait, U = S, I = TraitObserverType<S>> =
  U extends S ? ModelTraitDescriptorInit<M, S, U, I> :
  ModelTraitDescriptorFromAny<M, S, U, I>;

export interface ModelTraitPrototype extends Function {
  readonly prototype: ModelTrait<any, any>;
}

export interface ModelTraitConstructor<M extends Model, S extends Trait, U = S, I = TraitObserverType<S>> {
  new(owner: M, bindingName: string | undefined): ModelTrait<M, S, U> & I;
  prototype: ModelTrait<any, any, any> & I;
}

export declare abstract class ModelTrait<M extends Model, S extends Trait, U = S> {
  /** @hidden */
  _owner: M;
  /** @hidden */
  _trait: S | null;

  constructor(owner: M, bindingName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  sibling?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): M;

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

  static define<M extends Model, S extends Trait = Trait, U = S, I = TraitObserverType<S>>(descriptor: ModelTraitDescriptorExtends<M, S, U, I>): ModelTraitConstructor<M, S, U>;
  static define<M extends Model, S extends Trait = Trait, U = S>(descriptor: ModelTraitDescriptor<M, S, U>): ModelTraitConstructor<M, S, U>;
}

export interface ModelTrait<M extends Model, S extends Trait, U = S> {
  (): S | null;
  (trait: S | U | null): M;
}

export function ModelTrait<M extends Model, S extends Trait = Trait, U = S, I = TraitObserverType<S>>(descriptor: ModelTraitDescriptorExtends<M, S, U, I>): PropertyDecorator;
export function ModelTrait<M extends Model, S extends Trait = Trait, U = S>(descriptor: ModelTraitDescriptor<M, S, U>): PropertyDecorator;

export function ModelTrait<M extends Model, S extends Trait, U>(
    this: ModelTrait<M, S> | typeof ModelTrait,
    owner: M | ModelTraitDescriptor<M, S, U>,
    bindingName?: string,
  ): ModelTrait<M, S> | PropertyDecorator {
  if (this instanceof ModelTrait) { // constructor
    return ModelTraitConstructor.call(this, owner as M, bindingName);
  } else { // decorator factory
    return ModelTraitDecoratorFactory(owner as ModelTraitDescriptor<M, S, U>);
  }
}
__extends(ModelTrait, Object);

function ModelTraitConstructor<M extends Model, S extends Trait, U>(this: ModelTrait<M, S, U>, owner: M, bindingName: string | undefined): ModelTrait<M, S, U> {
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

function ModelTraitDecoratorFactory<M extends Model, S extends Trait, U>(descriptor: ModelTraitDescriptor<M, S, U>): PropertyDecorator {
  return Model.decorateModelTrait.bind(Model, ModelTrait.define(descriptor));
}

Object.defineProperty(ModelTrait.prototype, "owner", {
  get: function <M extends Model>(this: ModelTrait<M, Trait>): M {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ModelTrait.prototype, "trait", {
  get: function <S extends Trait>(this: ModelTrait<Model, S>): S | null {
    return this._trait;
  },
  enumerable: true,
  configurable: true,
});

ModelTrait.prototype.getTrait = function <S extends Trait>(this: ModelTrait<Model, S>): S {
  const trait = this.trait;
  if (trait === null) {
    throw new TypeError("null " + this.name + " trait");
  }
  return trait;
};

ModelTrait.prototype.setTrait = function <S extends Trait, U>(this: ModelTrait<Model, S, U>,
                                                              trait: S | U | null): void {
  if (trait !== null) {
    trait = this.fromAny(trait);
  }
  if (this.sibling === true) {
    if (trait === null) {
      this._owner.setTrait(this.name, null);
    } else if ((trait as S).model !== this._owner || (trait as S).key !== this.name) {
      this.insertTrait(this._owner, trait as S, this.name);
    }
  } else {
    this.doSetTrait(trait as S | null);
  }
};

ModelTrait.prototype.doSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
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

ModelTrait.prototype.willSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                               newTrait: S | null,
                                                               oldTrait: S | null): void {
  // hook
};

ModelTrait.prototype.onSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                             newTrait: S | null,
                                                             oldTrait: S | null): void {
  // hook
};

ModelTrait.prototype.didSetTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                              newTrait: S | null,
                                                              oldTrait: S | null): void {
  // hook
};

ModelTrait.prototype.willSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                                  newTrait: S | null,
                                                                  oldTrait: S | null): void {
  // hook
};

ModelTrait.prototype.onSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
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

ModelTrait.prototype.didSetOwnTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                                 newTrait: S | null,
                                                                 oldTrait: S | null): void {
  // hook
};

ModelTrait.prototype.mount = function <S extends Trait>(this: ModelTrait<Model, S>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.addTraitObserver(this as TraitObserverType<S>);
  }
};

ModelTrait.prototype.unmount = function <S extends Trait>(this: ModelTrait<Model, S>): void {
  const trait = this._trait;
  if (trait !== null && this.observe === true) {
    trait.removeTraitObserver(this as TraitObserverType<S>);
  }
};

ModelTrait.prototype.insert = function <S extends Trait>(this: ModelTrait<Model, S>,
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
      model = this._owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (trait.model !== model || trait.key !== key) {
      this.insertTrait(this._owner, trait, key);
    }
    if (this._trait === null) {
      this.doSetTrait(trait);
    }
  }
  return trait;
};

ModelTrait.prototype.remove = function <S extends Trait>(this: ModelTrait<Model, S>): S | null {
  const trait = this._trait;
  if (trait !== null) {
    trait.remove();
  }
  return trait;
};

ModelTrait.prototype.createTrait = function <S extends Trait, U>(this: ModelTrait<Model, S, U>): S | U | null {
  return null;
};

ModelTrait.prototype.insertTrait = function <S extends Trait>(this: ModelTrait<Model, S>,
                                                              model: Model, trait: S,
                                                              key: string | undefined): void {
  if (key !== void 0) {
    model.setTrait(key, trait);
  } else {
    model.appendTrait(trait);
  }
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

  const _constructor = function ModelTraitAccessor(this: ModelTrait<M, S>, owner: M, bindingName: string | undefined): ModelTrait<M, S, U> {
    let _this: ModelTrait<M, S, U> = function accessor(trait?: S | U | null): S | null | M {
      if (trait === void 0) {
        return _this._trait;
      } else {
        _this.setTrait(trait);
        return _this._owner;
      }
    } as ModelTrait<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as ModelTraitConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelTrait<M, S, U> & I;
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
