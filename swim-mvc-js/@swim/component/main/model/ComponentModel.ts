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
import type {Model, ModelObserverType} from "@swim/model";
import {Component} from "../Component";

export type ComponentModelMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentModel<any, infer M, any>} ? M : unknown;

export type ComponentModelMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ComponentModel<any, infer M, infer U>} ? M | U : unknown;

export interface ComponentModelInit<M extends Model, U = never> {
  extends?: ComponentModelClass;
  observe?: boolean;
  type?: unknown;

  willSetModel?(newModel: M | null, oldModel: M | null): void;
  onSetModel?(newModel: M | null, oldModel: M | null): void;
  didSetModel?(newModel: M | null, oldModel: M | null): void;
  createModel?(): M | U | null;
  insertModel?(parentModel: Model, childModel: M, key: string | undefined): void;
  fromAny?(value: M | U): M | null;
}

export type ComponentModelDescriptor<C extends Component, M extends Model, U = never, I = ModelObserverType<M>> = ComponentModelInit<M, U> & ThisType<ComponentModel<C, M, U> & I> & I;

export type ComponentModelDescriptorExtends<C extends Component, M extends Model, U = never, I = ModelObserverType<M>> = {extends: ComponentModelClass | undefined} & ComponentModelDescriptor<C, M, U, I>;

export type ComponentModelDescriptorFromAny<C extends Component, M extends Model, U = never, I = ModelObserverType<M>> = ({type: FromAny<M, U>} | {fromAny(value: M | U): M | null}) & ComponentModelDescriptor<C, M, U, I>;

export interface ComponentModelConstructor<C extends Component, M extends Model, U = never, I = ModelObserverType<M>> {
  new(owner: C, modelName: string | undefined): ComponentModel<C, M, U> & I;
  prototype: ComponentModel<any, any, any> & I;
}

export interface ComponentModelClass extends Function {
  readonly prototype: ComponentModel<any, any, any>;
}

export declare abstract class ComponentModel<C extends Component, M extends Model, U = never> {
  /** @hidden */
  _owner: C;
  /** @hidden */
  _model: M | null;
  /** @hidden */
  _auto: boolean;

  constructor(owner: C, modelName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): C;

  get model(): M | null;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getModel(): M;

  setModel(newModel: M | U | null): void;

  /** @hidden */
  willSetModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  onSetModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  didSetModel(newModel: M | null, oldModel: M | null): void;

  setAutoModel(model: M | U | null): void;

  /** @hidden */
  setOwnModel(model: M | U | null): void;

  /** @hidden */
  willSetOwnModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  onSetOwnModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  didSetOwnModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentModel: Model, key?: string | null): M | null;

  remove(): M | null;

  createModel(): M | U | null;

  /** @hidden */
  insertModel(parentModel: Model, childModel: M, key: string | undefined): void;

  fromAny(value: M | U): M | null;

  static define<C extends Component, M extends Model = Model, U = never, I = ModelObserverType<M>>(descriptor: ComponentModelDescriptorExtends<C, M, U, I>): ComponentModelConstructor<C, M, U, I>;
  static define<C extends Component, M extends Model = Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): ComponentModelConstructor<C, M, U>;
}

export interface ComponentModel<C extends Component, M extends Model, U = never> {
  (): M | null;
  (model: M | U | null): C;
}

export function ComponentModel<C extends Component, M extends Model = Model, U = never, I = ModelObserverType<M>>(descriptor: ComponentModelDescriptorExtends<C, M, U, I>): PropertyDecorator;
export function ComponentModel<C extends Component, M extends Model = Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): PropertyDecorator;

export function ComponentModel<C extends Component, M extends Model, U>(
    this: ComponentModel<C, M, U> | typeof ComponentModel,
    owner: C | ComponentModelDescriptor<C, M, U>,
    modelName?: string,
  ): ComponentModel<C, M, U> | PropertyDecorator {
  if (this instanceof ComponentModel) { // constructor
    return ComponentModelConstructor.call(this as unknown as ComponentModel<Component, Model, unknown>, owner as C, modelName);
  } else { // decorator factory
    return ComponentModelDecoratorFactory(owner as ComponentModelDescriptor<C, M, U>);
  }
}
__extends(ComponentModel, Object);
Component.Model = ComponentModel;

function ComponentModelConstructor<C extends Component, M extends Model, U>(this: ComponentModel<C, M, U>, owner: C, modelName: string | undefined): ComponentModel<C, M, U> {
  if (modelName !== void 0) {
    Object.defineProperty(this, "name", {
      value: modelName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._model = null;
  this._auto = true;
  return this;
}

function ComponentModelDecoratorFactory<C extends Component, M extends Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): PropertyDecorator {
  return Component.decorateComponentModel.bind(Component, ComponentModel.define(descriptor as ComponentModelDescriptor<Component, Model>));
}

Object.defineProperty(ComponentModel.prototype, "owner", {
  get: function <C extends Component>(this: ComponentModel<C, Model>): C {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentModel.prototype, "model", {
  get: function <M extends Model>(this: ComponentModel<Component, M>): M | null {
    return this._model;
  },
  enumerable: true,
  configurable: true,
});

ComponentModel.prototype.isAuto = function (this: ComponentModel<Component, Model>): boolean {
  return this._auto;
};

ComponentModel.prototype.setAuto = function (this: ComponentModel<Component, Model>,
                                             auto: boolean): void {
  this._auto = auto;
};

ComponentModel.prototype.getModel = function <M extends Model>(this: ComponentModel<Component, M>): M {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

ComponentModel.prototype.setModel = function <M extends Model, U>(this: ComponentModel<Component, M, U>,
                                                                  model: M | U | null): void {
  this._auto = false;
  this.setOwnModel(model);
};

ComponentModel.prototype.willSetModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                   newModel: M | null,
                                                                   oldModel: M | null): void {
  // hook
};

ComponentModel.prototype.onSetModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                 newModel: M | null,
                                                                 oldModel: M | null): void {
  // hook
};

ComponentModel.prototype.didSetModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                  newModel: M | null,
                                                                  oldModel: M | null): void {
  // hook
};

ComponentModel.prototype.setAutoModel = function <M extends Model, U>(this: ComponentModel<Component, M, U>,
                                                                      model: M | U | null): void {
  if (this._auto === true) {
    this.setOwnModel(model);
  }
};

ComponentModel.prototype.setOwnModel = function <M extends Model, U>(this: ComponentModel<Component, M, U>,
                                                                     newModel: M | U | null): void {
  const oldModel = this._model;
  if (newModel !== null) {
    newModel = this.fromAny(newModel);
  }
  if (oldModel !== newModel) {
    this.willSetOwnModel(newModel as M | null, oldModel);
    this.willSetModel(newModel as M | null, oldModel);
    this._model = newModel as M | null;
    this.onSetOwnModel(newModel as M | null, oldModel);
    this.onSetModel(newModel as M | null, oldModel);
    this.didSetModel(newModel as M | null, oldModel);
    this.didSetOwnModel(newModel as M | null, oldModel);
  }
};

ComponentModel.prototype.willSetOwnModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                      newModel: M | null,
                                                                      oldModel: M | null): void {
  this._owner.willSetComponentModel(this, newModel, oldModel);
};

ComponentModel.prototype.onSetOwnModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                    newModel: M | null,
                                                                    oldModel: M | null): void {
  this._owner.onSetComponentModel(this, newModel, oldModel);
  if (this.observe === true && this._owner.isMounted()) {
    if (oldModel !== null) {
      oldModel.removeModelObserver(this as ModelObserverType<M>);
    }
    if (newModel !== null) {
      newModel.addModelObserver(this as ModelObserverType<M>);
    }
  }
};

ComponentModel.prototype.didSetOwnModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                     newModel: M | null,
                                                                     oldModel: M | null): void {
  this._owner.didSetComponentModel(this, newModel, oldModel);
};

ComponentModel.prototype.mount = function <M extends Model>(this: ComponentModel<Component, M>): void {
  const model = this._model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.prototype.unmount = function <M extends Model>(this: ComponentModel<Component, M>): void {
  const model = this._model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.prototype.insert = function <M extends Model>(this: ComponentModel<Component, M>,
                                                             parentModel: Model,
                                                             key?: string | null): M | null {
  let model = this._model;
  if (model === null) {
    model = this.createModel();
  }
  if (model !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (model.parentModel !== parentModel || model.key !== key) {
      this.insertModel(parentModel, model, key);
    }
    if (this._model === null) {
      this.setModel(model);
    }
  }
  return model;
};

ComponentModel.prototype.remove = function <M extends Model>(this: ComponentModel<Component, M>): M | null {
  const model = this._model;
  if (model !== null) {
    model.remove();
  }
  return model;
};

ComponentModel.prototype.createModel = function <M extends Model, U>(this: ComponentModel<Component, M, U>): M | U | null {
  return null;
};

ComponentModel.prototype.insertModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                  parentModel: Model, childModel: M,
                                                                  key: string | undefined): void {
  if (key !== void 0) {
    parentModel.setChildModel(key, childModel);
  } else {
    parentModel.appendChildModel(childModel);
  }
};

ComponentModel.prototype.fromAny = function <M extends Model, U>(this: ComponentModel<Component, M, U>,
                                                                 value: M | U): M | null {
  return value as M | null;
};

ComponentModel.define = function <C extends Component, M extends Model, U, I>(descriptor: ComponentModelDescriptor<C, M, U, I>): ComponentModelConstructor<C, M, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentModel;
  }

  const _constructor = function ComponentModelAccessor(this: ComponentModel<C, M, U>, owner: C, modelName: string | undefined): ComponentModel<C, M, U> {
    let _this: ComponentModel<C, M, U> = function accessor(model?: M | null): M | null | C {
      if (model === void 0) {
        return _this._model;
      } else {
        _this.setModel(model);
        return _this._owner;
      }
    } as ComponentModel<C, M, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, modelName) || _this;
    return _this;
  } as unknown as ComponentModelConstructor<C, M, U, I>;

  const _prototype = descriptor as unknown as ComponentModel<C, M, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }

  return _constructor;
};
