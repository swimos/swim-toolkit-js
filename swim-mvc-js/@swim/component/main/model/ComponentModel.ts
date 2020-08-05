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
import {Model, ModelObserverType, ModelObserver} from "@swim/model";
import {Component} from "../Component";
import {ComponentModelObserver} from "./ComponentModelObserver";

export type ComponentModelTypeConstructor = typeof Model
                                          | {new (...args: any): any}
                                          | any;

export type ComponentModelDescriptorType<C extends Component, TC extends ComponentModelTypeConstructor> =
  TC extends new (...args: any) => any ? ComponentModelDescriptor<C, InstanceType<TC>> & ThisType<ComponentModel<C, Model>> & ModelObserverType<InstanceType<TC>> :
  ComponentModelDescriptor<C, any> & ThisType<ComponentModel<C, Model>> & ModelObserver;

export interface ComponentModelDescriptor<C extends Component, M extends Model> {
  willSetModel?(newModel: M | null, oldModel: M | null): void;
  onSetModel?(newModel: M | null, oldModel: M | null): void;
  didSetModel?(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  componentModelType?: ComponentModelConstructor<M>;
}

export interface ComponentModelConstructor<M extends Model> {
  new<C extends Component>(component: C, modelName: string, descriptor?: ComponentModelDescriptor<C, M>): ComponentModel<C, M>;
}

export interface ComponentModelClass {
  new<C extends Component, M extends Model>(component: C, modelName: string, descriptor?: ComponentModelDescriptor<C, M>): ComponentModel<C, M>;

  <C extends Component, TC extends ComponentModelTypeConstructor>(
      modelType: TC, descriptor?: ComponentModelDescriptorType<C, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Observer: typeof ComponentModelObserver; // defined by ComponentModelObserver
}

export interface ComponentModel<C extends Component, M extends Model> {
  (): M | null;
  (model: M | null): C;

  /** @hidden */
  _component: C;
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _model: M | null;

  readonly component: C;

  readonly name: string;

  readonly model: M | null;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getModel(): M;

  setModel(newModel: M | null): void;

  /** @hidden */
  willSetModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  onSetModel(newModel: M | null, oldModel: M | null): void;

  /** @hidden */
  didSetModel(newModel: M | null, oldModel: M | null): void;

  setAutoModel(model: M | null): void;

  /** @hidden */
  setOwnModel(model: M | null): void;

  mount(): void;

  unmount(): void;
}

export const ComponentModel: ComponentModelClass = (function (_super: typeof Object): ComponentModelClass {
  function ComponentModelDecoratorFactory<C extends Component, TC extends ComponentModelTypeConstructor>(
      modelType: TC, descriptor?: ComponentModelDescriptorType<C, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ComponentModelDescriptorType<C, TC>;
    }
    let componentModelType = descriptor.componentModelType;
    if (componentModelType === void 0) {
      componentModelType = ComponentModel.Observer;
      descriptor.componentModelType = componentModelType;
    }
    return Component.decorateComponentModel.bind(void 0, modelType, descriptor);
  }

  function ComponentModelConstructor<C extends Component, M extends Model>(
      this: ComponentModel<C, M>, component: C, modelName: string,
      descriptor?: ComponentModelDescriptor<C, M>): ComponentModel<C, M> {
    this._component = component;
    Object.defineProperty(this, "name", {
      value: modelName,
      enumerable: true,
      configurable: true,
    });
    this._auto = true;
    this._model = null;
    return this;
  }

  const ComponentModel: ComponentModelClass = function <C extends Component, M extends Model>(
      this: ComponentModel<C, M> | ComponentModelClass,
      component?: C | ComponentModelTypeConstructor,
      modelName?: string | ComponentModelDescriptor<C, M>,
      descriptor?: ComponentModelDescriptor<C, M>): ComponentModel<C, M> | PropertyDecorator | void {
    if (this instanceof ComponentModel) { // constructor
      return ComponentModelConstructor.call(this, component as C, modelName as string, descriptor);
    } else { // decorator factory
      const modelType = component as ComponentModelTypeConstructor;
      descriptor = modelName as ComponentModelDescriptor<C, M> | undefined;
      return ComponentModelDecoratorFactory(modelType, descriptor);
    }
  } as ComponentModelClass;
  __extends(ComponentModel, _super);

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

  ComponentModel.prototype.setModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                 model: M | null): void {
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

  ComponentModel.prototype.setAutoModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                  model: M | null): void {
    if (this._auto === true) {
      this.setOwnModel(model);
    }
  };

  ComponentModel.prototype.setOwnModel = function <M extends Model>(this: ComponentModel<Component, M>,
                                                                 newModel: M | null): void {
    const oldModel = this._model;
    if (oldModel !== newModel) {
      this.willSetModel(newModel, oldModel);
      this._model = newModel;
      this.onSetModel(newModel, oldModel);
      this.didSetModel(newModel, oldModel);
    }
  };

  ComponentModel.prototype.mount = function (this: ComponentModel<Component, Model>): void {
    // hook
  };

  ComponentModel.prototype.unmount = function (this: ComponentModel<Component, Model>): void {
    // hook
  };

  return ComponentModel;
}(Object));
Component.Model = ComponentModel;
