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
import {Model} from "../Model";
import {RefreshManager} from "../refresh/RefreshManager";
import {ObjectModelService} from "./ObjectModelService";
import {RefreshManagerService} from "./RefreshManagerService";

export type ModelServiceType<M, K extends keyof M> =
  M extends {[P in K]: ModelService<any, infer T>} ? T : unknown;

export type ModelServiceInit<M extends Model, T> =
  (this: ModelService<M, T>) => T | undefined;

export type ModelServiceTypeConstructor = typeof Object
                                        | typeof RefreshManager
                                        | {new (...args: any): any}
                                        | any;

export type ModelServiceDescriptorType<M extends Model, TC extends ModelServiceTypeConstructor> =
  TC extends typeof RefreshManager ? ModelServiceDescriptor<M, RefreshManager> :
  TC extends typeof Object ? ModelServiceDescriptor<M, Object> :
  TC extends new (...args: any) => any ? ModelServiceDescriptor<M, InstanceType<TC>> :
  ModelServiceDescriptor<M, any>;

export interface ModelServiceDescriptor<M extends Model, T> {
  init?: ModelServiceInit<M, T>;
  value?: T;
  inherit?: string | boolean;
  /** @hidden */
  serviceType?: ModelServiceConstructor<T>;
}

export interface ModelServiceConstructor<T> {
  new<M extends Model>(model: M, serviceName: string, descriptor?: ModelServiceDescriptor<M, T>): ModelService<M, T>;
}

export interface ModelServiceClass {
  new<M extends Model, T>(model: M, serviceName: string, value?: T, inherit?: string): ModelService<M, T>;

  <M extends Model, TC extends ModelServiceTypeConstructor>(
      valueType: TC, descriptor?: ModelServiceDescriptorType<M, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Object: typeof ObjectModelService; // defined by ObjectModelService
  /** @hidden */
  Refresh: typeof RefreshManagerService; // defined by RefreshManagerService
}

export interface ModelService<M extends Model, T> {
  (): T | undefined;

  /** @hidden */
  _model: M;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ModelService<Model, T>;
  /** @hidden */
  _state: T | undefined;

  readonly model: M;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superService: ModelService<Model, T> | null;

  /** @hidden */
  bindSuperService(): void;

  /** @hidden */
  unbindSuperService(): void;

  readonly superState: T | undefined;

  readonly ownState: T | undefined;

  readonly state: T | undefined;

  mount(): void;

  unmount(): void;

  init(): T | undefined;
}

export const ModelService: ModelServiceClass = (function (_super: typeof Object): ModelServiceClass {
  function ModelServiceDecoratorFactory<M extends Model, TC extends ModelServiceTypeConstructor>(
      valueType: TC, descriptor?: ModelServiceDescriptorType<M, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ModelServiceDescriptorType<M, TC>;
    }
    let serviceType = descriptor.serviceType;
    if (serviceType === void 0) {
      if (valueType === RefreshManager) {
        serviceType = ModelService.Refresh;
      } else {
        serviceType = ModelService.Object;
      }
      descriptor.serviceType = serviceType;
    }
    return Model.decorateModelService.bind(void 0, serviceType, descriptor);
  }

  function ModelServiceConstructor<M extends Model, T>(
      this: ModelService<M, T>, model: M, serviceName: string,
      descriptor?: ModelServiceDescriptor<M, T>): ModelService<M, T> {
    this._model = model;
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
    if (descriptor !== void 0) {
      if (typeof descriptor.inherit === "string") {
        this._inherit = descriptor.inherit;
      } else if (descriptor.inherit !== false) {
        this._inherit = serviceName;
      }
      if (descriptor.value !== void 0) {
        this._state = descriptor.value;
      }
    } else {
      this._inherit = serviceName;
    }
    return this;
  }

  const ModelService: ModelServiceClass = function <M extends Model, T>(
      this: ModelService<M, T> | ModelServiceClass,
      model?: M | ModelServiceTypeConstructor,
      serviceName?: string | ModelServiceDescriptor<M, T>,
      descriptor?: ModelServiceDescriptor<M, T>): ModelService<M, T> | PropertyDecorator | void {
    if (this instanceof ModelService) { // constructor
      return ModelServiceConstructor.call(this, model as M, serviceName as string, descriptor);
    } else { // decorator factory
      const valueType = model as ModelServiceTypeConstructor;
      descriptor = serviceName as ModelServiceDescriptor<M, T> | undefined;
      return ModelServiceDecoratorFactory(valueType, descriptor);
    }
  } as ModelServiceClass;
  __extends(ModelService, _super);

  Object.defineProperty(ModelService.prototype, "model", {
    get: function <M extends Model>(this: ModelService<M, unknown>): M {
      return this._model;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelService.prototype, "inherit", {
    get: function (this: ModelService<Model, unknown>): string | undefined {
      return this._inherit;
    },
    enumerable: true,
    configurable: true,
  });

  ModelService.prototype.setInherit = function (this: ModelService<Model, unknown>,
                                                inherit: string | undefined): void {
    this.unbindSuperService();
    if (inherit !== void 0) {
      this._inherit = inherit;
      this.bindSuperService();
    } else if (this._inherit !== void 0) {
      this._inherit = void 0;
    }
  };

  Object.defineProperty(ModelService.prototype, "superService", {
    get: function <T>(this: ModelService<Model, T>): ModelService<Model, T> | null {
      let superService: ModelService<Model, T> | null | undefined = this._superService;
      if (superService === void 0) {
        superService = null;
        let model = this._model;
        if (!model.isMounted()) {
          const inherit = this._inherit;
          if (inherit !== void 0) {
            do {
              const parentModel = model.parentModel;
              if (parentModel !== null) {
                model = parentModel;
                const service = model.getModelService(inherit);
                if (service === null) {
                  continue;
                } else {
                  superService = service as ModelService<Model, T>;
                }
              }
              break;
            } while (true);
          }
        }
      }
      return superService;
    },
    enumerable: true,
    configurable: true,
  });

  ModelService.prototype.bindSuperService = function (this: ModelService<Model, unknown>): void {
    let model = this._model;
    if (model.isMounted()) {
      const inherit = this._inherit;
      if (inherit !== void 0) {
        do {
          const parentModel = model.parentModel;
          if (parentModel !== null) {
            model = parentModel;
            const service = model.getModelService(inherit);
            if (service === null) {
              continue;
            } else {
              this._superService = service;
            }
          } else if (model !== this._model) {
            const service = model.getLazyModelService(inherit);
            if (service !== null) {
              this._superService = service;
            }
          }
          break;
        } while (true);
      }
      if (this._state === void 0 && this._superService === void 0) {
        this._state = this.init();
      }
    }
  };

  ModelService.prototype.unbindSuperService = function (this: ModelService<Model, unknown>): void {
    const superService = this._superService;
    if (superService !== void 0) {
      this._superService = void 0;
    }
  };

  Object.defineProperty(ModelService.prototype, "superState", {
    get: function <T>(this: ModelService<Model, T>): T | undefined {
      const superService = this.superService;
      return superService !== null ? superService.state : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelService.prototype, "ownState", {
    get: function <T>(this: ModelService<Model, T>): T | undefined {
      return this._state;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelService.prototype, "state", {
    get: function <T>(this: ModelService<Model, T>): T | undefined {
      const state = this._state;
      return state !== void 0 ? state : this.superState;
    },
    enumerable: true,
    configurable: true,
  });

  ModelService.prototype.mount = function (this: ModelService<Model, unknown>): void {
    this.bindSuperService();
  };

  ModelService.prototype.unmount = function (this: ModelService<Model, unknown>): void {
    this.unbindSuperService();
  };

  ModelService.prototype.init = function <T>(this: ModelService<Model, T>): T | undefined {
    return void 0;
  };

  return ModelService;
}(Object));
Model.Service = ModelService;
