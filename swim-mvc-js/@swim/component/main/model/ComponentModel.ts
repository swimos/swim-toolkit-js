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
import {Model, ModelObserverType} from "@swim/model";
import {Component} from "../Component";
import {ComponentModelObserver} from "./ComponentModelObserver";

export type ComponentModelType<C, K extends keyof C> =
  C extends {[P in K]: ComponentModel<any, infer M, any>} ? M : unknown;

export type ComponentModelInitType<V, K extends keyof V> =
  V extends {[P in K]: ComponentModel<any, infer M, infer U>} ? M | U : unknown;

export interface ComponentModelInit<C extends Component, M extends Model, U = M> {
  observer?: boolean;

  willSetModel?(newModel: M | null, oldModel: M | null): void;
  onSetModel?(newModel: M | null, oldModel: M | null): void;
  didSetModel?(newModel: M | null, oldModel: M | null): void;

  fromAny?(value: M | U): M | null;

  extends?: ComponentModelPrototype<M, U>;
}

export type ComponentModelDescriptor<C extends Component, M extends Model, U = M, I = ModelObserverType<M>> = ComponentModelInit<C, M, U> & ThisType<ComponentModel<C, M, U> & I> & I;

export type ComponentModelPrototype<M extends Model, U = M> = Function & { prototype: ComponentModel<Component, M, U> };

export type ComponentModelConstructor<M extends Model, U = M> = new <C extends Component>(component: C, modelName: string | undefined) => ComponentModel<C, M, U>;

export declare abstract class ComponentModel<C extends Component, M extends Model, U = M> {
  /** @hidden */
  _component: C;
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _model: M | null;

  constructor(component: C, modelName: string | undefined);

  get name(): string;

  get component(): C;

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

  mount(): void;

  unmount(): void;

  fromAny(value: M | U): M | null;

  // Forward type declarations
  /** @hidden */
  static Observer: typeof ComponentModelObserver; // defined by ComponentModelObserver
}

export interface ComponentModel<C extends Component, M extends Model, U = M> {
  (): M | null;
  (model: M | U | null): C;
}

export function ComponentModel<C extends Component, M extends Model = Model, U = M, I = ModelObserverType<M>>(descriptor: ComponentModelDescriptor<C, M, U, I>): PropertyDecorator;

export function ComponentModel<C extends Component, M extends Model, U = M>(
    this: ComponentModel<C, M, U> | typeof ComponentModel,
    component: C | ComponentModelInit<C, M, U>,
    modelName?: string,
  ): ComponentModel<C, M, U> | PropertyDecorator {
  if (this instanceof ComponentModel) { // constructor
    return ComponentModelConstructor.call(this, component as C, modelName);
  } else { // decorator factory
    return ComponentModelDecoratorFactory(component as ComponentModelInit<C, M, U>);
  }
};
__extends(ComponentModel, Object);
Component.Model = ComponentModel;

function ComponentModelConstructor<C extends Component, M extends Model, U = M>(this: ComponentModel<C, M, U>, component: C, modelName: string | undefined): ComponentModel<C, M, U> {
  if (modelName !== void 0) {
    Object.defineProperty(this, "name", {
      value: modelName,
      enumerable: true,
      configurable: true,
    });
  }
  this._component = component;
  this._auto = true;
  this._model = null;
  return this;
}

function ComponentModelDecoratorFactory<C extends Component, M extends Model, U = M>(descriptor: ComponentModelInit<C, M, U>): PropertyDecorator {
  const observer = descriptor.observer;
  delete descriptor.observer;

  let BaseComponentModel = descriptor.extends;
  delete descriptor.extends;
  if (BaseComponentModel === void 0) {
    if (observer !== false) {
      BaseComponentModel = ComponentModel.Observer;
    } else {
      BaseComponentModel = ComponentModel;
    }
  }

  function DecoratedComponentModel(this: ComponentModel<C, M, U>, component: C, modelName: string | undefined): ComponentModel<C, M, U> {
    let _this: ComponentModel<C, M, U> = function accessor(model?: M | null): M | null | C {
      if (model === void 0) {
        return _this._model;
      } else {
        _this.setModel(model);
        return _this._component;
      }
    } as ComponentModel<C, M, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseComponentModel!.call(_this, component, modelName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedComponentModel, BaseComponentModel);
    DecoratedComponentModel.prototype = descriptor as ComponentModel<C, M, U>;
    DecoratedComponentModel.prototype.constructor = DecoratedComponentModel;
    Object.setPrototypeOf(DecoratedComponentModel.prototype, BaseComponentModel.prototype);
  } else {
    __extends(DecoratedComponentModel, BaseComponentModel);
  }

  return Component.decorateComponentModel.bind(void 0, DecoratedComponentModel);
}

Object.defineProperty(ComponentModel.prototype, "component", {
  get: function <C extends Component>(this: ComponentModel<C, Model>): C {
    return this._component;
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
  if (this._auto !== auto) {
    this._auto = auto;
    this._component.componentModelDidSetAuto(this, auto);
  }
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
}

ComponentModel.prototype.onSetModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                 newModel: M | null,
                                                                 oldModel: M | null): void {
  // hook
}

ComponentModel.prototype.didSetModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                  newModel: M | null,
                                                                  oldModel: M | null): void {
  this._component.componentModelDidSetModel(this, newModel, oldModel);
}

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
    this.willSetModel(newModel as M | null, oldModel);
    this._model = newModel as M | null;
    this.onSetModel(newModel as M | null, oldModel);
    this.didSetModel(newModel as M | null, oldModel);
  }
};

ComponentModel.prototype.mount = function (this: ComponentModel<Component, Model>): void {
  // hook
};

ComponentModel.prototype.unmount = function (this: ComponentModel<Component, Model>): void {
  // hook
};

ComponentModel.prototype.fromAny = function <M extends Model, U>(this: ComponentModel<Component, M, U>,
                                                                 value: M | U): M | null {
  return value as M | null;
};
