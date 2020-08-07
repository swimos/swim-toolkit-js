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
import {RefreshManagerService} from "./RefreshManagerService";

export type ModelServiceType<M, K extends keyof M> =
  M extends {[P in K]: ModelService<any, infer T>} ? T : unknown;

export interface ModelServiceInit<M extends Model, T> {
  type?: unknown;

  init?(): T | undefined;
  value?: T;
  inherit?: string | boolean;

  extends?: ModelServicePrototype<T>;
}

export type ModelServiceDescriptor<M extends Model, T, I = {}> = ModelServiceInit<M, T> & ThisType<ModelService<M, T> & I> & I;

export type ModelServicePrototype<T> = Function & { prototype: ModelService<Model, T> };

export type ModelServiceConstructor<T> = new <M extends Model>(model: M, serviceName: string | undefined) => ModelService<M, T>;

export declare abstract class ModelService<M extends Model, T> {
  /** @hidden */
  _model: M;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ModelService<Model, T>;
  /** @hidden */
  _state: T | undefined;

  constructor(model: M, serviceName: string | undefined);

  get name(): string;

  get model(): M;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superService(): ModelService<Model, T> | null;

  /** @hidden */
  bindSuperService(): void;

  /** @hidden */
  unbindSuperService(): void;

  get superState(): T | undefined;

  get ownState(): T | undefined;

  get state(): T | undefined;

  mount(): void;

  unmount(): void;

  init(): T | undefined;

  /** @hidden */
  static constructorForType(type: unknown): ModelServicePrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Refresh: typeof RefreshManagerService; // defined by RefreshManagerService
}

export interface ModelService<M extends Model, T> {
  (): T | undefined;
}

export function ModelService<M extends Model, T, I = {}>(descriptor: {extends: ModelServicePrototype<T>} & ModelServiceDescriptor<M, T, I>): PropertyDecorator;
export function ModelService<M extends Model, T = object, I = {}>(descriptor: {type: typeof Object} & ModelServiceDescriptor<M, T, I>): PropertyDecorator;
export function ModelService<M extends Model, T = RefreshManager, I = {}>(descriptor: {type: typeof RefreshManager} & ModelServiceDescriptor<M, T, I>): PropertyDecorator;
export function ModelService<M extends Model, T, I = {}>(descriptor: {type: Function & { prototype: T }} & ModelServiceDescriptor<M, T, I>): PropertyDecorator;

export function ModelService<M extends Model, T>(
    this: ModelService<M, T> | typeof ModelService,
    model: M | ModelServiceInit<M, T>,
    serviceName?: string,
  ): ModelService<M, T> | PropertyDecorator {
  if (this instanceof ModelService) { // constructor
    return ModelServiceConstructor.call(this, model as M, serviceName);
  } else { // decorator factory
    return ModelServiceDecoratorFactory(model as ModelServiceInit<M, T>);
  }
};
__extends(ModelService, Object);
Model.Service = ModelService;

function ModelServiceConstructor<M extends Model, T>(this: ModelService<M, T>, model: M, serviceName: string | undefined): ModelService<M, T> {
  if (serviceName !== void 0) {
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
  }
  this._model = model;
  return this;
}

function ModelServiceDecoratorFactory<M extends Model, T>(descriptor: ModelServiceInit<M, T>): PropertyDecorator {
  const type = descriptor.type;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseModelService = descriptor.extends;
  delete descriptor.extends;
  if (BaseModelService === void 0) {
    BaseModelService = ModelService.constructorForType(type) as ModelServicePrototype<T>;
  }
  if (BaseModelService === null) {
    BaseModelService = ModelService;
  }

  function DecoratedModelService(this: ModelService<M, T>, model: M, serviceName: string | undefined): ModelService<M, T> {
    let _this: ModelService<M, T> = function accessor(): T | undefined {
      return _this._state;
    } as ModelService<M, T>;
    Object.setPrototypeOf(_this, this);
    _this = BaseModelService!.call(_this, model, serviceName) || _this;
    if (typeof inherit === "string") {
      _this._inherit = inherit;
    } else if (inherit !== false) {
      _this._inherit = serviceName;
    }
    if (value !== void 0) {
      _this._state = value;
    }
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedModelService, BaseModelService);
    DecoratedModelService.prototype = descriptor as ModelService<M, T>;
    DecoratedModelService.prototype.constructor = DecoratedModelService;
    Object.setPrototypeOf(DecoratedModelService.prototype, BaseModelService.prototype);
  } else {
    __extends(DecoratedModelService, BaseModelService);
  }

  return Model.decorateModelService.bind(void 0, DecoratedModelService);
}

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

ModelService.constructorForType = function (type: unknown): ModelServicePrototype<unknown> | null {
  if (type === RefreshManager) {
    return ModelService.Refresh;
  }
  return null;
}
