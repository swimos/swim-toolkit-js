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
import type {ModelObserverType} from "../ModelObserver";

export type TraitModelMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitModel<any, infer S, any>} ? S : unknown;

export type TraitModelMemberInit<R, K extends keyof R> =
  R extends {[P in K]: TraitModel<any, infer T, infer U>} ? T | U : unknown;

export interface TraitModelInit<S extends Model, U = never> {
  extends?: TraitModelClass;
  observe?: boolean;
  child?: boolean;
  type?: unknown;

  willSetModel?(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;
  onSetModel?(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;
  didSetModel?(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;

  createModel?(): S | U | null;
  insertModel?(parentModel: Model, childModel: S, targetModel: Model | null, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type TraitModelDescriptor<R extends Trait, S extends Model, U = never, I = {}> = TraitModelInit<S, U> & ThisType<TraitModel<R, S, U> & I> & I;

export interface TraitModelConstructor<R extends Trait, S extends Model, U = never, I = {}> {
  new(owner: R, fastenerName: string | undefined): TraitModel<R, S, U> & I;
  prototype: TraitModel<any, any> & I;
}

export interface TraitModelClass extends Function {
  readonly prototype: TraitModel<any, any>;
}

export interface TraitModel<R extends Trait, S extends Model, U = never> {
  (): S | null;
  (model: S | U | null, targetModel?: Model | null): R;

  readonly name: string;

  readonly owner: R;

  readonly model: S | null;

  getModel(): S;

  setModel(newModel: S | U | null, targetModel?: Model | null): S | null;

  /** @hidden */
  doSetModel(newModel: S | null, targetModel: Model | null): void;

  /** @hidden */
  attachModel(newModel: S): void;

  /** @hidden */
  detachModel(oldModel: S): void;

  /** @hidden */
  willSetModel(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;

  /** @hidden */
  onSetModel(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;

  /** @hidden */
  didSetModel(newModel: S | null, oldModel: S | null, targetModel: Model | null): void;

  injectModel(parentModel?: Model | null, childModel?: S | U | null, targetModel?: Model | null, key?: string | null): S | null;

  createModel(): S | U | null;

  /** @hidden */
  insertModel(parentModel: Model, childModel: S, targetModel: Model | null, key: string | undefined): void;

  removeModel(): S | null;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;
}

export const TraitModel = function TraitModel<R extends Trait, S extends Model, U>(
    this: TraitModel<R, S, U> | typeof TraitModel,
    owner: R | TraitModelDescriptor<R, S, U>,
    fastenerName?: string,
  ): TraitModel<R, S, U> | PropertyDecorator {
  if (this instanceof TraitModel) { // constructor
    return TraitModelConstructor.call(this as unknown as TraitModel<Trait, Model, unknown>, owner as R, fastenerName);
  } else { // decorator factory
    return TraitModelDecoratorFactory(owner as TraitModelDescriptor<R, S, U>);
  }
} as {
  /** @hidden */
  new<R extends Trait, S extends Model, U = never>(owner: R, fastenerName: string | undefined): TraitModel<R, S, U>;

  <R extends Trait, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: {extends: TraitModelClass | undefined} & TraitModelDescriptor<R, S, U, I>): PropertyDecorator;
  <R extends Trait, S extends Model = Model, U = never>(descriptor: {observe: boolean} & TraitModelDescriptor<R, S, U, ModelObserverType<S>>): PropertyDecorator;
  <R extends Trait, S extends Model = Model, U = never>(descriptor: TraitModelDescriptor<R, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: TraitModel<any, any>;

  define<R extends Trait, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: {extends: TraitModelClass | undefined} & TraitModelDescriptor<R, S, U, I>): TraitModelConstructor<R, S, U>;
  define<R extends Trait, S extends Model = Model, U = never>(descriptor: {observe: boolean} & TraitModelDescriptor<R, S, U, ModelObserverType<S>>): TraitModelConstructor<R, S, U>;
  define<R extends Trait, S extends Model = Model, U = never>(descriptor: TraitModelDescriptor<R, S, U>): TraitModelConstructor<R, S, U>;
};
__extends(TraitModel, Object);

function TraitModelConstructor<R extends Trait, S extends Model, U>(this: TraitModel<R, S, U>, owner: R, fastenerName: string | undefined): TraitModel<R, S, U> {
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
  Object.defineProperty(this, "model", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function TraitModelDecoratorFactory<R extends Trait, S extends Model, U>(descriptor: TraitModelDescriptor<R, S, U>): PropertyDecorator {
  return Trait.decorateTraitModel.bind(Trait, TraitModel.define(descriptor as TraitModelDescriptor<Trait, Model>));
}

TraitModel.prototype.getModel = function <S extends Model>(this: TraitModel<Trait, S>): S {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

TraitModel.prototype.setModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S | null, targetModel?: Model | null): S | null {
  const oldModel = this.model;
  if (newModel !== null) {
    newModel = this.fromAny(newModel);
  }
  if (targetModel === void 0) {
    targetModel = null;
  }
  let ownModel: Model | null | undefined;
  if (this.child === true && (ownModel = this.owner.model, ownModel !== null)) {
    if (newModel === null) {
      ownModel.setChildModel(this.name, null);
    } else if (newModel.parentModel !== ownModel || newModel.key !== this.name) {
      this.insertModel(ownModel, newModel, targetModel, this.name);
    }
  } else {
    this.doSetModel(newModel, targetModel);
  }
  return oldModel;
};

TraitModel.prototype.doSetModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S | null, targetModel: Model | null): void {
  const oldModel = this.model;
  if (oldModel !== newModel) {
    this.willSetModel(newModel, oldModel, targetModel);
    if (oldModel !== null) {
      this.detachModel(oldModel);
    }
    Object.defineProperty(this, "model", {
      value: newModel,
      enumerable: true,
      configurable: true,
    });
    if (newModel !== null) {
      this.attachModel(newModel);
    }
    this.onSetModel(newModel, oldModel, targetModel);
    this.didSetModel(newModel, oldModel, targetModel);
  }
};

TraitModel.prototype.attachModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S): void {
  if (this.observe === true && this.owner.isMounted()) {
    newModel.addModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.prototype.detachModel = function <S extends Model>(this: TraitModel<Trait, S>, oldModel: S): void {
  if (this.observe === true && this.owner.isMounted()) {
    oldModel.removeModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.prototype.willSetModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S | null, oldModel: S | null, targetModel: Model | null): void {
  // hook
};

TraitModel.prototype.onSetModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S | null, oldModel: S | null, targetModel: Model | null): void {
  // hook
};

TraitModel.prototype.didSetModel = function <S extends Model>(this: TraitModel<Trait, S>, newModel: S | null, oldModel: S | null, targetModel: Model | null): void {
  // hook
};

TraitModel.prototype.injectModel = function <S extends Model>(this: TraitModel<Trait, S>, parentModel?: Model | null, childModel?: S | null, targetModel?: Model | null, key?: string | null): S | null {
  if (targetModel === void 0) {
    targetModel = null;
  }
  if (childModel === void 0 || childModel === null) {
    childModel = this.model;
    if (childModel === null) {
      childModel = this.createModel();
    }
  } else {
    childModel = this.fromAny(childModel);
    if (childModel !== null) {
      this.doSetModel(childModel, targetModel);
    }
  }
  if (childModel !== null) {
    if (parentModel === void 0 || parentModel === null) {
      parentModel = this.owner.model;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (parentModel !== null && (childModel.parentModel !== parentModel || childModel.key !== key)) {
      this.insertModel(parentModel, childModel, targetModel, key);
    }
    if (this.model === null) {
      this.doSetModel(childModel, targetModel);
    }
  }
  return childModel;
};

TraitModel.prototype.createModel = function <S extends Model, U>(this: TraitModel<Trait, S, U>): S | U | null {
  return null;
};

TraitModel.prototype.insertModel = function <S extends Model>(this: TraitModel<Trait, S>, parentModel: Model, childModel: S, targetModel: Model | null, key: string | undefined): void {
  parentModel.insertChildModel(childModel, targetModel, key);
};

TraitModel.prototype.removeModel = function <S extends Model>(this: TraitModel<Trait, S>): S | null {
  const childModel = this.model;
  if (childModel !== null) {
    childModel.remove();
  }
  return childModel;
};

TraitModel.prototype.fromAny = function <S extends Model, U>(this: TraitModel<Trait, S, U>, value: S | U): S | null {
  const type = this.type;
  if (FromAny.is<S, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof Model) {
    return value;
  }
  return null;
};

TraitModel.prototype.mount = function <S extends Model>(this: TraitModel<Trait, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.prototype.unmount = function <S extends Model>(this: TraitModel<Trait, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.define = function <R extends Trait, S extends Model, U, I>(descriptor: TraitModelDescriptor<R, S, U, I>): TraitModelConstructor<R, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = TraitModel;
  }

  const _constructor = function DecoratedTraitModel(this: TraitModel<R, S>, owner: R, fastenerName: string | undefined): TraitModel<R, S, U> {
    let _this: TraitModel<R, S, U> = function TraitModelAccessor(model?: S | U | null, targetModel?: Model | null): S | null | R {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model, targetModel);
        return _this.owner;
      }
    } as TraitModel<R, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as TraitModelConstructor<R, S, U, I>;

  const _prototype = descriptor as unknown as TraitModel<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.child === void 0) {
    _prototype.child = true;
  }

  return _constructor;
};
