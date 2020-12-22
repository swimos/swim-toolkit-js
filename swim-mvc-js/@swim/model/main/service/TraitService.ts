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
import {Trait} from "../Trait";
import {ModelManagerObserverType, ModelManager} from "../manager/ModelManager";
import {
  ModelServiceFlags,
  ModelServiceDescriptorExtends,
  ModelServiceDescriptor,
  ModelServiceConstructor,
  ModelService,
} from "./ModelService";

export type TraitServiceMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitService<any, infer T>} ? T : unknown;

export interface TraitServiceInit<T> {
  extends?: TraitServicePrototype;
  observe?: boolean;
  type?: unknown;
  manager?: T;
  inherit?: string | boolean;

  initManager?(): T;

  /** @hidden */
  modelService?: ModelServiceDescriptorExtends<Model, T> | ModelServiceDescriptor<Model, T>;
  /** @hidden */
  modelServiceConstructor?: ModelServiceConstructor<Model, T>;
  /** @hidden */
  createModelService?(): ModelService<Model, T>;
}

export type TraitServiceDescriptorInit<R extends Trait, T, I = {}> = TraitServiceInit<T> & ThisType<TraitService<R, T> & I> & I;

export type TraitServiceDescriptorExtends<R extends Trait, T, I = {}> = {extends: TraitServicePrototype | undefined} & TraitServiceDescriptorInit<R, T, I>;

export type TraitServiceDescriptor<R extends Trait, T, I = {}> =
  T extends ModelManager ? {type: typeof ModelManager} & TraitServiceDescriptorInit<R, T, ModelManagerObserverType<T> & I> :
  TraitServiceDescriptorInit<R, T, I>;

export interface TraitServicePrototype extends Function {
  readonly prototype: TraitService<any, any>;
}

export interface TraitServiceConstructor<R extends Trait, T, I = {}> {
  new(owner: R, serviceName: string | undefined): TraitService<R, T> & I;
  prototype: TraitService<any, any> & I;
}

export declare abstract class TraitService<R extends Trait, T> {
  /** @hidden */
  _owner: R;
  /** @hidden */
  _modelService: ModelService<Model, T> | null;
  /** @hidden */
  _inherit: string | boolean;
  /** @hidden */
  _serviceFlags: ModelServiceFlags;
  /** @hidden */
  _manager: T;

  constructor(owner: R, serviceName: string | undefined);

  get name(): string;

  get owner(): R;

  get modelService(): ModelService<Model, T> | null;

  /** @hidden */
  modelServiceConstructor?: ModelServiceConstructor<Model, T>;

  /** @hidden */
  createModelService(): ModelService<Model, T>;

  /** @hidden */
  bindModelService(): void;

  /** @hidden */
  unbindModelService(): void;

  get inherit(): string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  get superName(): string | undefined;

  get superService(): ModelService<Model, T> | null;

  get manager(): T;

  get ownManager(): T | undefined;

  get superManager(): T | undefined;

  getManager(): T extends undefined ? never : T;

  getManagerOr<E>(elseManager: E): (T extends undefined ? never : T) | E;

  /** @hidden */
  attach(): void;

  /** @hidden */
  detach(): void;

  /** @hidden */
  initManager?(): T;

  static define<R extends Trait, T, I = {}>(descriptor: TraitServiceDescriptorExtends<R, T, I>): TraitServiceConstructor<R, T, I>;
  static define<R extends Trait, T>(descriptor: TraitServiceDescriptor<R, T>): TraitServiceConstructor<R, T>;
}

export interface TraitService<R extends Trait, T> {
  (): T;
}

export function TraitService<R extends Trait, T, I = {}>(descriptor: TraitServiceDescriptorExtends<R, T, I>): PropertyDecorator;
export function TraitService<R extends Trait, T>(descriptor: TraitServiceDescriptor<R, T>): PropertyDecorator;

export function TraitService<R extends Trait, T>(
    this: TraitService<R, T> | typeof TraitService,
    owner: R | TraitServiceDescriptor<R, T>,
    serviceName?: string,
  ): TraitService<R, T> | PropertyDecorator {
  if (this instanceof TraitService) { // constructor
    return TraitServiceConstructor.call(this, owner as R, serviceName);
  } else { // decorator factory
    return TraitServiceDecoratorFactory(owner as TraitServiceDescriptor<R, T>);
  }
}
__extends(TraitService, Object);
Trait.Service = TraitService;

function TraitServiceConstructor<R extends Trait, T>(this: TraitService<R, T>, owner: R, serviceName: string | undefined): TraitService<R, T> {
  if (serviceName !== void 0) {
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._modelService = null;
  this._serviceFlags = 0;
  if (this._inherit !== false) {
    this._serviceFlags |= ModelService.InheritedFlag;
  }
  return this;
}

function TraitServiceDecoratorFactory<R extends Trait, T>(descriptor: TraitServiceDescriptor<R, T>): PropertyDecorator {
  return Trait.decorateTraitService.bind(Trait, TraitService.define(descriptor));
}

Object.defineProperty(TraitService.prototype, "owner", {
  get: function <R extends Trait>(this: TraitService<R, unknown>): R {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitService.prototype, "modelService", {
  get: function (this: TraitService<Trait, unknown>): ModelService<Model, unknown> | null {
    return this._modelService;
  },
  enumerable: true,
  configurable: true,
});

TraitService.prototype.createModelService = function <T>(this: TraitService<Trait, T>): ModelService<Model, T> {
  const modelServiceConstructor = this.modelServiceConstructor;
  if (modelServiceConstructor !== void 0) {
    const model = this._owner.model;
    if (model !== null) {
      const modelService = new modelServiceConstructor(model, this.name);
      modelService._inherit = this._inherit;
      modelService._serviceFlags = this._serviceFlags;
      return modelService;
    } else {
      throw new Error("no model");
    }
  } else {
    throw new Error("no model service constructor");
  }
};

TraitService.prototype.bindModelService = function (this: TraitService<Trait, unknown>): void {
  const model = this._owner.model;
  if (model !== null) {
    let modelService = model.getLazyModelService(this.name);
    if (modelService === null) {
      modelService = this.createModelService();
      model.setModelService(this.name, modelService);
    }
    this._modelService = modelService;
    modelService.addTraitService(this);
    this._inherit = modelService._inherit;
    this._serviceFlags = modelService._serviceFlags;
    this._manager = modelService._manager;
  }
};

TraitService.prototype.unbindModelService = function (this: TraitService<Trait, unknown>): void {
  const modelService = this._modelService;
  if (modelService !== null) {
    modelService.removeTraitService(this);
    this._modelService = null;
  }
};

Object.defineProperty(TraitService.prototype, "inherit", {
  get: function (this: TraitService<Trait, unknown>): string | boolean {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

TraitService.prototype.setInherit = function (this: TraitService<Trait, unknown>,
                                              inherit: string | boolean): void {
  const modelService = this._modelService;
  if (modelService !== null) {
    modelService.setInherit(inherit);
  } else {
    this._inherit = inherit;
  }
};

TraitService.prototype.isInherited = function (this: TraitService<Trait, unknown>): boolean {
  return (this._serviceFlags & ModelService.InheritedFlag) !== 0;
};

TraitService.prototype.setInherited = function (this: TraitService<Trait, unknown>,
                                                inherited: boolean): void {
  const modelService = this._modelService;
  if (modelService !== null) {
    modelService.setInherited(inherited);
  } else if (inherited && (this._serviceFlags & ModelService.InheritedFlag) === 0) {
    this._serviceFlags |= ModelService.InheritedFlag;
  } else if (!inherited && (this._serviceFlags & ModelService.InheritedFlag) !== 0) {
    this._serviceFlags &= ~ModelService.InheritedFlag;
  }
};

Object.defineProperty(TraitService.prototype, "superName", {
  get: function (this: TraitService<Trait, unknown>): string | undefined {
    const modelService = this._modelService;
    return modelService !== null ? modelService.superName : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitService.prototype, "superService", {
  get: function (this: TraitService<Trait, unknown>): ModelService<Model, unknown> | null {
    const modelService = this._modelService;
    return modelService !== null ? modelService.superService : null;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitService.prototype, "manager", {
  get: function <T>(this: TraitService<Trait, T>): T {
    return this._manager;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitService.prototype, "ownManager", {
  get: function <T>(this: TraitService<Trait, T>): T | undefined {
    return !this.isInherited() ? this.manager : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitService.prototype, "superManager", {
  get: function <T>(this: TraitService<Trait, T>): T | undefined {
    const modelService = this._modelService;
    return modelService !== null ? modelService.superManager : void 0;
  },
  enumerable: true,
  configurable: true,
});

TraitService.prototype.getManager = function <T>(this: TraitService<Trait, T>): T extends undefined ? never : T {
  const manager = this.manager;
  if (manager === void 0) {
    throw new TypeError("undefined " + this.name + " manager");
  }
  return manager as T extends undefined ? never : T;
};

TraitService.prototype.getManagerOr = function <T, E>(this: TraitService<Trait, T>,
                                                      elseManager: E): (T extends undefined ? never : T) | E {
  let manager: T | E | undefined = this.manager;
  if (manager === void 0) {
    manager = elseManager;
  }
  return manager as (T extends undefined ? never : T) | E;
};

TraitService.prototype.attach = function (this: TraitService<Trait, unknown>): void {
  this.bindModelService();
};

TraitService.prototype.detach = function (this: TraitService<Trait, unknown>): void {
  this.unbindModelService();
};

TraitService.define = function <R extends Trait, T, I>(descriptor: TraitServiceDescriptor<R, T, I>): TraitServiceConstructor<R, T, I> {
  let _super: TraitServicePrototype | null | undefined = descriptor.extends;
  const type = descriptor.type;
  const manager = descriptor.manager;
  const inherit = descriptor.inherit;
  let initManager = descriptor.initManager;
  let modelService = descriptor.modelService;
  delete descriptor.extends;
  delete descriptor.manager;
  delete descriptor.inherit;
  delete descriptor.modelService;

  if (_super === void 0) {
    _super = TraitService;
  }

  const _constructor = function TraitServiceAccessor(this: TraitService<R, T>, owner: R, serviceName: string | undefined): TraitService<R, T> {
    let _this: TraitService<R, T> = function accessor(): T | undefined {
      return _this._manager;
    } as TraitService<R, T>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, serviceName) || _this;
    return _this;
  } as unknown as TraitServiceConstructor<R, T, I>;

  const _prototype = descriptor as unknown as TraitService<R, T> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (manager !== void 0 && initManager === void 0) {
    initManager = function (): T {
      return manager;
    };
    _prototype.initManager = initManager;
  }
  _prototype._inherit = inherit !== void 0 ? inherit : true;
  if (_prototype.modelServiceConstructor === void 0) {
    if (modelService === void 0) {
      modelService = {
        extends: void 0,
        type,
        manager,
        inherit,
      };
      if (initManager !== void 0) {
        modelService.initManager = initManager;
      }
    }
    _prototype.modelServiceConstructor = ModelService.define(modelService as ModelServiceDescriptor<Model, T>);
  }

  return _constructor;
}
