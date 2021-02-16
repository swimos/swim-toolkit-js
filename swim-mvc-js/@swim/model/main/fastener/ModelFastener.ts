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

export type ModelFastenerMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelFastener<any, infer S, any>} ? S : unknown;

export type ModelFastenerMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelFastener<any, infer T, infer U>} ? T | U : unknown;

export interface ModelFastenerInit<S extends Model, U = never> {
  extends?: ModelFastenerClass;
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

export type ModelFastenerDescriptor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ModelFastenerInit<S, U> & ThisType<ModelFastener<M, S, U> & I> & I;

export type ModelFastenerDescriptorExtends<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = {extends: ModelFastenerClass | undefined} & ModelFastenerDescriptor<M, S, U, I>;

export type ModelFastenerDescriptorFromAny<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ModelFastenerDescriptor<M, S, U, I>;

export interface ModelFastenerConstructor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> {
  new(owner: M, fastenerName: string | undefined): ModelFastener<M, S, U> & I;
  prototype: ModelFastener<any, any> & I;
}

export interface ModelFastenerClass extends Function {
  readonly prototype: ModelFastener<any, any>;
}

export interface ModelFastener<M extends Model, S extends Model, U = never> {
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

export const ModelFastener = function <M extends Model, S extends Model, U>(
    this: ModelFastener<M, S, U> | typeof ModelFastener,
    owner: M | ModelFastenerDescriptor<M, S, U>,
    fastenerName?: string,
  ): ModelFastener<M, S, U> | PropertyDecorator {
  if (this instanceof ModelFastener) { // constructor
    return ModelFastenerConstructor.call(this as unknown as ModelFastener<Model, Model, unknown>, owner as M, fastenerName);
  } else { // decorator factory
    return ModelFastenerDecoratorFactory(owner as ModelFastenerDescriptor<M, S, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, S extends Model, U = never>(owner: M, fastenerName: string | undefined): ModelFastener<M, S, U>;

  <M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelFastenerDescriptorExtends<M, S, U, I>): PropertyDecorator;
  <M extends Model, S extends Model = Model, U = never>(descriptor: ModelFastenerDescriptor<M, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelFastener<any, any>;

  define<M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelFastenerDescriptorExtends<M, S, U, I>): ModelFastenerConstructor<M, S, U>;
  define<M extends Model, S extends Model = Model, U = never>(descriptor: ModelFastenerDescriptor<M, S, U>): ModelFastenerConstructor<M, S, U>;
};
__extends(ModelFastener, Object);

function ModelFastenerConstructor<M extends Model, S extends Model, U>(this: ModelFastener<M, S, U>, owner: M, fastenerName: string | undefined): ModelFastener<M, S, U> {
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

function ModelFastenerDecoratorFactory<M extends Model, S extends Model, U>(descriptor: ModelFastenerDescriptor<M, S, U>): PropertyDecorator {
  return Model.decorateModelFastener.bind(Model, ModelFastener.define(descriptor as ModelFastenerDescriptor<Model, Model>));
}

ModelFastener.prototype.getModel = function <S extends Model>(this: ModelFastener<Model, S>): S {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

ModelFastener.prototype.setModel = function <S extends Model, U>(this: ModelFastener<Model, S, U>, model: S | U | null): void {
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

ModelFastener.prototype.doSetModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null): void {
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

ModelFastener.prototype.willSetModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelFastener.prototype.onSetModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelFastener.prototype.didSetModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelFastener.prototype.willSetOwnModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelFastener.prototype.onSetOwnModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldModel !== null) {
      oldModel.removeModelObserver(this as ModelObserverType<S>);
    }
    if (newModel !== null) {
      newModel.addModelObserver(this as ModelObserverType<S>);
    }
  }
};

ModelFastener.prototype.didSetOwnModel = function <S extends Model>(this: ModelFastener<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelFastener.prototype.mount = function <S extends Model>(this: ModelFastener<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<S>);
  }
};

ModelFastener.prototype.unmount = function <S extends Model>(this: ModelFastener<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<S>);
  }
};

ModelFastener.prototype.insert = function <S extends Model>(this: ModelFastener<Model, S>, parentModel?: Model | string | null, key?: string | null): S | null {
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

ModelFastener.prototype.remove = function <S extends Model>(this: ModelFastener<Model, S>): S | null {
  const model = this.model;
  if (model !== null) {
    model.remove();
  }
  return model;
};

ModelFastener.prototype.createModel = function <S extends Model, U>(this: ModelFastener<Model, S, U>): S | U | null {
  return null;
};

ModelFastener.prototype.insertModel = function <S extends Model>(this: ModelFastener<Model, S>, parentModel: Model, childModel: S, key: string | undefined): void {
  if (key !== void 0) {
    parentModel.setChildModel(key, childModel);
  } else {
    parentModel.appendChildModel(childModel);
  }
};

ModelFastener.prototype.fromAny = function <S extends Model, U>(this: ModelFastener<Model, S, U>, value: S | U): S | null {
  return value as S | null;
};

ModelFastener.define = function <M extends Model, S extends Model, U, I>(descriptor: ModelFastenerDescriptor<M, S, U, I>): ModelFastenerConstructor<M, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ModelFastener;
  }

  const _constructor = function DecoratedModelFastener(this: ModelFastener<M, S>, owner: M, fastenerName: string | undefined): ModelFastener<M, S, U> {
    let _this: ModelFastener<M, S, U> = function ModelFastenerAccessor(model?: S | U | null): S | null | M {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model);
        return _this.owner;
      }
    } as ModelFastener<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, fastenerName) || _this;
    return _this;
  } as unknown as ModelFastenerConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelFastener<any, any> & I;
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
