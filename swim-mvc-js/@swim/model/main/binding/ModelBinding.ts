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

export type ModelBindingMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelBinding<any, infer S, any>} ? S : unknown;

export type ModelBindingMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelBinding<any, infer T, infer U>} ? T | U : unknown;

export interface ModelBindingInit<S extends Model, U = never> {
  extends?: ModelBindingClass;
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

export type ModelBindingDescriptor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ModelBindingInit<S, U> & ThisType<ModelBinding<M, S, U> & I> & I;

export type ModelBindingDescriptorExtends<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = {extends: ModelBindingClass | undefined} & ModelBindingDescriptor<M, S, U, I>;

export type ModelBindingDescriptorFromAny<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & ModelBindingDescriptor<M, S, U, I>;

export interface ModelBindingConstructor<M extends Model, S extends Model, U = never, I = ModelObserverType<S>> {
  new(owner: M, bindingName: string | undefined): ModelBinding<M, S, U> & I;
  prototype: ModelBinding<any, any> & I;
}

export interface ModelBindingClass extends Function {
  readonly prototype: ModelBinding<any, any>;
}

export interface ModelBinding<M extends Model, S extends Model, U = never> {
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

export const ModelBinding = function <M extends Model, S extends Model, U>(
    this: ModelBinding<M, S, U> | typeof ModelBinding,
    owner: M | ModelBindingDescriptor<M, S, U>,
    bindingName?: string,
  ): ModelBinding<M, S, U> | PropertyDecorator {
  if (this instanceof ModelBinding) { // constructor
    return ModelBindingConstructor.call(this as unknown as ModelBinding<Model, Model, unknown>, owner as M, bindingName);
  } else { // decorator factory
    return ModelBindingDecoratorFactory(owner as ModelBindingDescriptor<M, S, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, S extends Model, U = never>(owner: M, bindingName: string | undefined): ModelBinding<M, S, U>;

  <M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelBindingDescriptorExtends<M, S, U, I>): PropertyDecorator;
  <M extends Model, S extends Model = Model, U = never>(descriptor: ModelBindingDescriptor<M, S, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelBinding<any, any>;

  define<M extends Model, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: ModelBindingDescriptorExtends<M, S, U, I>): ModelBindingConstructor<M, S, U>;
  define<M extends Model, S extends Model = Model, U = never>(descriptor: ModelBindingDescriptor<M, S, U>): ModelBindingConstructor<M, S, U>;
};
__extends(ModelBinding, Object);

function ModelBindingConstructor<M extends Model, S extends Model, U>(this: ModelBinding<M, S, U>, owner: M, bindingName: string | undefined): ModelBinding<M, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
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

function ModelBindingDecoratorFactory<M extends Model, S extends Model, U>(descriptor: ModelBindingDescriptor<M, S, U>): PropertyDecorator {
  return Model.decorateModelBinding.bind(Model, ModelBinding.define(descriptor as ModelBindingDescriptor<Model, Model>));
}

ModelBinding.prototype.getModel = function <S extends Model>(this: ModelBinding<Model, S>): S {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

ModelBinding.prototype.setModel = function <S extends Model, U>(this: ModelBinding<Model, S, U>, model: S | U | null): void {
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

ModelBinding.prototype.doSetModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null): void {
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

ModelBinding.prototype.willSetModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelBinding.prototype.onSetModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelBinding.prototype.didSetModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelBinding.prototype.willSetOwnModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelBinding.prototype.onSetOwnModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  if (this.observe === true && this.owner.isMounted()) {
    if (oldModel !== null) {
      oldModel.removeModelObserver(this as ModelObserverType<S>);
    }
    if (newModel !== null) {
      newModel.addModelObserver(this as ModelObserverType<S>);
    }
  }
};

ModelBinding.prototype.didSetOwnModel = function <S extends Model>(this: ModelBinding<Model, S>, newModel: S | null, oldModel: S | null): void {
  // hook
};

ModelBinding.prototype.mount = function <S extends Model>(this: ModelBinding<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<S>);
  }
};

ModelBinding.prototype.unmount = function <S extends Model>(this: ModelBinding<Model, S>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<S>);
  }
};

ModelBinding.prototype.insert = function <S extends Model>(this: ModelBinding<Model, S>, parentModel?: Model | string | null, key?: string | null): S | null {
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

ModelBinding.prototype.remove = function <S extends Model>(this: ModelBinding<Model, S>): S | null {
  const model = this.model;
  if (model !== null) {
    model.remove();
  }
  return model;
};

ModelBinding.prototype.createModel = function <S extends Model, U>(this: ModelBinding<Model, S, U>): S | U | null {
  return null;
};

ModelBinding.prototype.insertModel = function <S extends Model>(this: ModelBinding<Model, S>, parentModel: Model, childModel: S, key: string | undefined): void {
  if (key !== void 0) {
    parentModel.setChildModel(key, childModel);
  } else {
    parentModel.appendChildModel(childModel);
  }
};

ModelBinding.prototype.fromAny = function <S extends Model, U>(this: ModelBinding<Model, S, U>, value: S | U): S | null {
  return value as S | null;
};

ModelBinding.define = function <M extends Model, S extends Model, U, I>(descriptor: ModelBindingDescriptor<M, S, U, I>): ModelBindingConstructor<M, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ModelBinding;
  }

  const _constructor = function DecoratedModelBinding(this: ModelBinding<M, S>, owner: M, bindingName: string | undefined): ModelBinding<M, S, U> {
    let _this: ModelBinding<M, S, U> = function ModelBindingAccessor(model?: S | U | null): S | null | M {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model);
        return _this.owner;
      }
    } as ModelBinding<M, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as ModelBindingConstructor<M, S, U, I>;

  const _prototype = descriptor as unknown as ModelBinding<any, any> & I;
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
