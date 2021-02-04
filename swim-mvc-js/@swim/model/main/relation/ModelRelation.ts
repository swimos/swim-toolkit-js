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
import type {ModelObserverType} from "../ModelObserver";

export type ModelRelationMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelRelation<any, infer S, any>} ? S : unknown;

export type ModelRelationMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelRelation<any, infer T, infer U>} ? T | U : unknown;

export interface ModelRelationInit<S extends Model, U = never> {
  extends?: ModelRelationClass;
  observe?: boolean;
  child?: boolean;
  type?: unknown;

  willSetModel?(newModel: S | null, oldModel: S | null): void;
  onSetModel?(newModel: S | null, oldModel: S | null): void;
  didSetModel?(newModel: S | null, oldModel: S | null): void;
  createModel?(): S | U | null;
  insertModel?(parentModel: Model, childModel: S, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type ModelRelationDescriptor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ModelRelationInit<S, U> & ThisType<ModelRelation<M, S, U> & I> & I;

export type ModelRelationDescriptorExtends<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = {extends: ModelRelationClass | undefined} & ModelRelationDescriptor<M, S, U, I>;

export type ModelRelationDescriptorFromAny<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ModelRelationDescriptor<M, S, U, I>;

export interface ModelRelationConstructor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> {
  new(owner: M, relationName: string | undefined): ModelRelation<M, S, U> & I;
  prototype: ModelRelation<any, any> & I;
}

export interface ModelRelationClass extends Function {
  readonly prototype: ModelRelation<any, any>;
}

export interface ModelRelation<M extends Model, S extends Model, U = never> {
  (): S | null;
  (model: S | U | null): M;

  readonly name: string;

  readonly owner: M;

  readonly model: S | null;

  getModel(): S;

  setModel(model: S | U | null): void;

  /** @hidden */
  doSetModel(newModel: S | null): void;

  /** @hidden */
  willSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  onSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  didSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  willSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  onSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  didSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentModel: Model, key?: string | null): S | null;
  insert(key?: string | null): S | null;

  remove(): S | null;

  createModel(): S | U | null;

  /** @hidden */
  insertModel(parentModel: Model, childModel: S, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: S | U): S | null;
}

export const ModelRelation = function <M extends Model, S extends Model, U>(
    this: ModelRelation<M, S, U> | typeof ModelRelation,
    owner: M | ModelRelationDescriptor<M, S, U>,
    relationName?: string,
  ): ModelRelation<M, S, U> | PropertyDecorator {
  if (this instanceof ModelRelation) { // constructor
    return ModelRelationConstructor.call(this as unknown as ModelRelation<Model, Model, unknown>, owner as M, relationName);
  } else { // decorator factory
    return ModelRelationDecoratorFactory(owner as ModelRelationDescriptor<M, S, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, S extends Model, U = never>(owner: M, relationName: string | undefined): ModelRelation<M, S, U>;

  <M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelRelationDescriptorExtends<M, S, U, I>): PropertyDecorator;
  <M extends Model, S extends Model = Model, U = never>(descriptor: ModelRelationDescriptor<M, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelRelation<any, any>;

  define<M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelRelationDescriptorExtends<M, S, U, I>): ModelRelationConstructor<M, S, U>;
  define<M extends Model, S extends Model = Model, U = never>(descriptor: ModelRelationDescriptor<M, S, U>): ModelRelationConstructor<M, S, U>;
};
__extends(ModelRelation, Object);

function ModelRelationConstructor<M extends Model, S extends Model, U>(this: ModelRelation<M, S, U>, owner: M, relationName: string | undefined): ModelRelation<M, S, U> {
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
  Object.defineProperty(this, "model", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ModelRelationDecoratorFactory<M extends Model, S extends Model, U>(descriptor: ModelRelationDescriptor<M, S, U>): PropertyDecorator {
  return Model.decorateModelRelation.bind(Model, ModelRelation.define(descriptor as ModelRelationDescriptor<Model, Model>));
}

ModelRelation.prototype.getModel = function <S extends Model>(this: ModelRelation<Model, S>): S {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

ModelRelation.prototype.setModel = function <S extends Model, U>(this: ModelRelation<Model, S, U>, model: S | U | null): void {
  if (model !== null) {
    model = this.fromAny(model);
  }
  if (this.child === true) {
    if (model === null) {
      this.owner.setChildModel(this.name, null);
    } else if ((model as S).parentModel !== this.owner || (model as S).key !== this.name) {
      this.insertModel(this.owner, model as S, this.name);
    }
  } else {
    this.doSetModel(model as S | null);
  }
};

ModelRelation.prototype.doSetModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null): void {
  const oldModel = this.model;
  if (oldModel !== newModel) {
    this.willSetOwnModel(newModel, oldModel);
    this.willSetModel(newModel, oldModel);
    Object.defineProperty(this, "model", {
      value: newModel,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnModel(newModel, oldModel);
    this.onSetModel(newModel, oldModel);
    this.didSetModel(newModel, oldModel);
    this.didSetOwnModel(newModel, oldModel);
  }
};

ModelRelation.prototype.willSetModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelRelation.prototype.onSetModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelRelation.prototype.didSetModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelRelation.prototype.willSetOwnModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelRelation.prototype.onSetOwnModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldModel !== null) {
      oldModel.removeModelObserver(this as ModelObserverType<S>);
    }
    if (newModel !== null) {
      newModel.addModelObserver(this as ModelObserverType<S>);
    }
  }
};

ModelRelation.prototype.didSetOwnModel = function <S extends Model>(this: ModelRelation<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelRelation.prototype.mount = function <S extends Model>(this: ModelRelation<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<S>);
  }
};

ModelRelation.prototype.unmount = function <S extends Model>(this: ModelRelation<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<S>);
  }
};

ModelRelation.prototype.insert = function <S extends Model>(this: ModelRelation<Model, S>, parentModel?: Model | string | null, key?: string | null): S | null {
  let model = this.model;
  if (model === null) {
    model = this.createModel();
  }
  if (model !== null) {
    if (typeof parentModel === "string" || parentModel === null) {
      key = parentModel;
      parentModel = void 0;
    }
    if (parentModel === void 0) {
      parentModel = this.owner;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (model.parentModel !== parentModel || model.key !== key) {
      this.insertModel(parentModel, model, key);
    }
    if (this.model === null) {
      this.doSetModel(model);
    }
  }
  return model;
};

ModelRelation.prototype.remove = function <S extends Model>(this: ModelRelation<Model, S>): S | null {
  const model = this.model;
  if (model !== null) {
    model.remove();
  }
  return model;
};

ModelRelation.prototype.createModel = function <S extends Model, U>(this: ModelRelation<Model, S, U>): S | U | null {
  return null;
};

ModelRelation.prototype.insertModel = function <S extends Model>(this: ModelRelation<Model, S>, parentModel: Model, childModel: S, key: string | undefined): void {
  if (key !== void 0) {
    parentModel.setChildModel(key, childModel);
  } else {
    parentModel.appendChildModel(childModel);
  }
};

ModelRelation.prototype.fromAny = function <S extends Model, U>(this: ModelRelation<Model, S, U>, value: S | U): S | null {
  return value as S | null;
};

ModelRelation.define = function <M extends Model, S extends Model, U, I>(descriptor: ModelRelationDescriptor<M, S, U, I>): ModelRelationConstructor<M, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ModelRelation;
  }

  const _constructor = function DecoratedModelRelation(this: ModelRelation<M, S>, owner: M, relationName: string | undefined): ModelRelation<M, S, U> {
    let _this: ModelRelation<M, S, U> = function ModelRelationAccessor(model?: S | U | null): S | null | M {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model);
        return _this.owner;
      }
    } as ModelRelation<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, relationName) || _this;
    return _this;
  } as unknown as ModelRelationConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelRelation<any, any> & I;
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
