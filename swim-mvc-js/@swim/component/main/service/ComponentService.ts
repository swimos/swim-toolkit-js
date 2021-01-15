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
import {Component} from "../Component";
import {ComponentManager} from "../manager/ComponentManager";
import type {ComponentManagerObserverType} from "../manager/ComponentManagerObserver";
import {ExecuteManager} from "../execute/ExecuteManager";
import {HistoryManager} from "../history/HistoryManager";
import type {ComponentManagerService} from "./ComponentManagerService";
import type {ExecuteService} from "./ExecuteService";
import type {HistoryService} from "./HistoryService";

export type ComponentServiceMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentService<any, infer T>} ? T : unknown;

export type ComponentServiceFlags = number;

export interface ComponentServiceInit<T> {
  extends?: ComponentServiceClass;
  observe?: boolean;
  type?: unknown;
  manager?: T;
  inherit?: string | boolean;

  initManager?(): T;
}

export type ComponentServiceDescriptor<C extends Component, T, I = {}> = ComponentServiceInit<T> & ThisType<ComponentService<C, T> & I> & I;

export type ComponentServiceDescriptorExtends<C extends Component, T, I = {}> = {extends: ComponentServiceClass | undefined} & ComponentServiceDescriptor<C, T, I>;

export interface ComponentServiceConstructor<C extends Component, T, I = {}> {
  new(owner: C, serviceName: string | undefined): ComponentService<C, T> & I;
  prototype: ComponentService<any, any> & I;
}

export interface ComponentServiceClass extends Function {
  readonly prototype: ComponentService<any, any>;
}

export declare abstract class ComponentService<C extends Component, T> {
  /** @hidden */
  _owner: C;
  /** @hidden */
  _inherit: string | boolean;
  /** @hidden */
  _serviceFlags: ComponentServiceFlags;
  /** @hidden */
  _superService?: ComponentService<Component, T>;
  /** @hidden */
  _manager: T;

  constructor(owner: C, serviceName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): C;

  get inherit(): string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  get superName(): string | undefined;

  get superService(): ComponentService<Component, T> | null;

  /** @hidden */
  bindSuperService(): void;

  /** @hidden */
  unbindSuperService(): void;

  get manager(): T;

  get ownManager(): T | undefined;

  get superManager(): T | undefined;

  getManager(): T extends undefined ? never : T;

  getManagerOr<E>(elseManager: E): (T extends undefined ? never : T) | E;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  /** @hidden */
  initManager(): T;

  /** @hidden */
  static getClass(type: unknown): ComponentServiceClass | null;

  static define<C extends Component, T, I = {}>(descriptor: ComponentServiceDescriptorExtends<C, T, I>): ComponentServiceConstructor<C, T, I>;
  static define<C extends Component, T>(descriptor: ComponentServiceDescriptor<C, T>): ComponentServiceConstructor<C, T>;

  /** @hidden */
  static InheritedFlag: ComponentServiceFlags;

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ComponentManagerService; // defined by ComponentManagerService
  /** @hidden */
  static Execute: typeof ExecuteService; // defined by ExecuteService
  /** @hidden */
  static History: typeof HistoryService; // defined by HistoryService
}

export interface ComponentService<C extends Component, T> {
  (): T;
}

export function ComponentService<C extends Component, T extends ExecuteManager = ExecuteManager>(descriptor: {type: typeof ExecuteManager} & ComponentServiceDescriptor<C, T, ComponentManagerObserverType<T>>): PropertyDecorator;
export function ComponentService<C extends Component, T extends HistoryManager = HistoryManager>(descriptor: {type: typeof HistoryManager} & ComponentServiceDescriptor<C, T, ComponentManagerObserverType<T>>): PropertyDecorator;
export function ComponentService<C extends Component, T extends ComponentManager = ComponentManager>(descriptor: {type: typeof ComponentManager} & ComponentServiceDescriptor<C, T, ComponentManagerObserverType<T>>): PropertyDecorator;
export function ComponentService<C extends Component, T, I = {}>(descriptor: ComponentServiceDescriptorExtends<C, T, I>): PropertyDecorator;
export function ComponentService<C extends Component, T>(descriptor: ComponentServiceDescriptor<C, T>): PropertyDecorator;

export function ComponentService<C extends Component, T>(
    this: ComponentService<C, T> | typeof ComponentService,
    owner: C | ComponentServiceDescriptor<C, T>,
    serviceName?: string,
  ): ComponentService<C, T> | PropertyDecorator {
  if (this instanceof ComponentService) { // constructor
    return ComponentServiceConstructor.call(this, owner as C, serviceName);
  } else { // decorator factory
    return ComponentServiceDecoratorFactory(owner as ComponentServiceDescriptor<C, T>);
  }
}
__extends(ComponentService, Object);
Component.Service = ComponentService;

function ComponentServiceConstructor<C extends Component, T>(this: ComponentService<C, T>, owner: C, serviceName: string | undefined): ComponentService<C, T> {
  if (serviceName !== void 0) {
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._serviceFlags = 0;
  if (this._inherit !== false) {
    this._serviceFlags |= ComponentService.InheritedFlag;
  }
  return this;
}

function ComponentServiceDecoratorFactory<C extends Component, T>(descriptor: ComponentServiceDescriptor<C, T>): PropertyDecorator {
  return Component.decorateComponentService.bind(Component, ComponentService.define(descriptor as ComponentServiceDescriptor<Component, unknown>));
}

Object.defineProperty(ComponentService.prototype, "owner", {
  get: function <C extends Component>(this: ComponentService<C, unknown>): C {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "inherit", {
  get: function (this: ComponentService<Component, unknown>): string | boolean {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

ComponentService.prototype.setInherit = function (this: ComponentService<Component, unknown>,
                                                  inherit: string | boolean): void {
  if (this._inherit !== inherit) {
    this.unbindSuperService();
    if (inherit !== false) {
      this._inherit = inherit;
      this.bindSuperService();
    } else if (this._inherit !== false) {
      this._inherit = false;
    }
  }
};

ComponentService.prototype.isInherited = function (this: ComponentService<Component, unknown>): boolean {
  return (this._serviceFlags & ComponentService.InheritedFlag) !== 0;
};

ComponentService.prototype.setInherited = function (this: ComponentService<Component, unknown>,
                                                    inherited: boolean): void {
  if (inherited && (this._serviceFlags & ComponentService.InheritedFlag) === 0) {
    this._serviceFlags |= ComponentService.InheritedFlag;
  } else if (!inherited && (this._serviceFlags & ComponentService.InheritedFlag) !== 0) {
    this._serviceFlags &= ~ComponentService.InheritedFlag;
  }
};

Object.defineProperty(ComponentService.prototype, "superName", {
  get: function (this: ComponentService<Component, unknown>): string | undefined {
    const inherit = this._inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "superService", {
  get: function (this: ComponentService<Component, unknown>): ComponentService<Component, unknown> | null {
    let superService: ComponentService<Component, unknown> | null | undefined = this._superService;
    if (superService === void 0) {
      superService = null;
      let component = this._owner;
      if (!component.isMounted()) {
        const superName = this.superName;
        if (superName !== void 0) {
          do {
            const parentComponent = component.parentComponent;
            if (parentComponent !== null) {
              component = parentComponent;
              const service = component.getComponentService(superName);
              if (service !== null) {
                superService = service;
                if (service.isInherited()) {
                  continue;
                }
              } else {
                continue;
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

ComponentService.prototype.bindSuperService = function (this: ComponentService<Component, unknown>): void {
  let component = this._owner;
  if (component.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentComponent = component.parentComponent;
        if (parentComponent !== null) {
          component = parentComponent;
          const service = component.getComponentService(superName);
          if (service !== null) {
            this._superService = service;
            if (service.isInherited()) {
              continue;
            }
          } else {
            continue;
          }
        } else if (component !== this._owner) {
          const service = component.getLazyComponentService(superName);
          if (service !== null) {
            this._superService = service;
          }
        }
        break;
      } while (true);
    }
    if (this._manager === void 0) {
      if (this._superService !== void 0) {
        this._manager = this._superService._manager;
      } else {
        this._manager = this.initManager();
        this._serviceFlags &= ~ComponentService.InheritedFlag;
      }
    }
  }
};

ComponentService.prototype.unbindSuperService = function (this: ComponentService<Component, unknown>): void {
  const superService = this._superService;
  if (superService !== void 0) {
    this._superService = void 0;
  }
};

Object.defineProperty(ComponentService.prototype, "manager", {
  get: function <T>(this: ComponentService<Component, T>): T {
    return this._manager;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "ownManager", {
  get: function <T>(this: ComponentService<Component, T>): T | undefined {
    return !this.isInherited() ? this.manager : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "superManager", {
  get: function <T>(this: ComponentService<Component, T>): T | undefined {
    const superService = this.superService;
    return superService !== null ? superService.manager : void 0;
  },
  enumerable: true,
  configurable: true,
});

ComponentService.prototype.getManager = function <T>(this: ComponentService<Component, T>): T extends undefined ? never : T {
  const manager = this.manager;
  if (manager === void 0) {
    throw new TypeError("undefined " + this.name + " manager");
  }
  return manager as T extends undefined ? never : T;
};

ComponentService.prototype.getManagerOr = function <T, E>(this: ComponentService<Component, T>,
                                                          elseManager: E): (T extends undefined ? never : T) | E {
  let manager: T | E | undefined = this.manager;
  if (manager === void 0) {
    manager = elseManager;
  }
  return manager as (T extends undefined ? never : T) | E;
};

ComponentService.prototype.mount = function (this: ComponentService<Component, unknown>): void {
  this.bindSuperService();
  if (this._manager instanceof ComponentManager && this.observe === true) {
    this._manager.addComponentManagerObserver(this as ComponentManagerObserverType<ComponentManager>);
  }
};

ComponentService.prototype.unmount = function (this: ComponentService<Component, unknown>): void {
  if (this._manager instanceof ComponentManager && this.observe === true) {
    this._manager.removeComponentManagerObserver(this as ComponentManagerObserverType<ComponentManager>);
  }
  this.unbindSuperService();
};

ComponentService.prototype.initManager = function <T>(this: ComponentService<Component, T>): T {
  return void 0 as unknown as T;
};

ComponentService.getClass = function (type: unknown): ComponentServiceClass | null {
  if (type === ExecuteManager) {
    return ComponentService.Execute;
  } else if (type === HistoryManager) {
    return ComponentService.History;
  } else if (type === ComponentManager) {
    return ComponentService.Manager;
  }
  return null;
};

ComponentService.define = function <C extends Component, T, I>(descriptor: ComponentServiceDescriptor<C, T, I>): ComponentServiceConstructor<C, T, I> {
  let _super: ComponentServiceClass | null | undefined = descriptor.extends;
  const manager = descriptor.manager;
  const inherit = descriptor.inherit;
  const initManager = descriptor.initManager;
  delete descriptor.extends;
  delete descriptor.manager;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ComponentService.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ComponentService;
  }

  const _constructor = function ComponentServiceAccessor(this: ComponentService<C, T>, owner: C, serviceName: string | undefined): ComponentService<C, T> {
    let _this: ComponentService<C, T> = function accessor(): T | undefined {
      return _this._manager;
    } as ComponentService<C, T>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, serviceName) || _this;
    return _this;
  } as unknown as ComponentServiceConstructor<C, T, I>;

  const _prototype = descriptor as unknown as ComponentService<C, T> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (manager !== void 0 && initManager === void 0) {
    _prototype.initManager = function (): T {
      return manager;
    };
  }
  _prototype._inherit = inherit !== void 0 ? inherit : true;

  return _constructor;
}

ComponentService.InheritedFlag = 1 << 0;
