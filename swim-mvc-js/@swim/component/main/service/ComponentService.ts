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
import {ExecuteManager} from "../execute/ExecuteManager";
import {ExecuteManagerService} from "./ExecuteManagerService";

export type ComponentServiceType<C, K extends keyof C> =
  C extends {[P in K]: ComponentService<any, infer T>} ? T : unknown;

export interface ComponentServiceInit<C extends Component, T> {
  type?: unknown;

  init?(): T | undefined;
  value?: T;
  inherit?: string | boolean;

  extends?: ComponentServicePrototype<T>;
}

export type ComponentServiceDescriptor<C extends Component, T, I = {}> = ComponentServiceInit<C, T> & ThisType<ComponentService<C, T> & I> & I;

export type ComponentServicePrototype<T> = Function & { prototype: ComponentService<Component, T> };

export type ComponentServiceConstructor<T> = new <C extends Component>(component: C, serviceName: string | undefined) => ComponentService<C, T>;

export declare abstract class ComponentService<C extends Component, T> {
  /** @hidden */
  _component: C;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ComponentService<Component, T>;
  /** @hidden */
  _state: T | undefined;

  constructor(component: C, serviceName: string | undefined);

  get name(): string;

  get component(): C;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superService(): ComponentService<Component, T> | null;

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
  static constructorForType(type: unknown): ComponentServicePrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Execute: typeof ExecuteManagerService; // defined by ExecuteManagerService
}

export interface ComponentService<C extends Component, T> {
  (): T | undefined;
}

export function ComponentService<C extends Component, T, I = {}>(descriptor: {extends: ComponentServicePrototype<T>} & ComponentServiceDescriptor<C, T, I>): PropertyDecorator;
export function ComponentService<C extends Component, T extends Object = object, I = {}>(descriptor: {type: typeof Object} & ComponentServiceDescriptor<C, T, I>): PropertyDecorator;
export function ComponentService<C extends Component, T extends ExecuteManager = ExecuteManager, I = {}>(descriptor: {type: typeof ExecuteManager} & ComponentServiceDescriptor<C, T, I>): PropertyDecorator;
export function ComponentService<C extends Component, T, I = {}>(descriptor: {type: Function & { prototype: T }} & ComponentServiceDescriptor<C, T, I>): PropertyDecorator;

export function ComponentService<C extends Component, T>(
    this: ComponentService<C, T> | typeof ComponentService,
    component: C | ComponentServiceInit<C, T>,
    serviceName?: string,
  ): ComponentService<C, T> | PropertyDecorator {
  if (this instanceof ComponentService) { // constructor
    return ComponentServiceConstructor.call(this, component as C, serviceName);
  } else { // decorator factory
    return ComponentServiceDecoratorFactory(component as ComponentServiceInit<C, T>);
  }
};
__extends(ComponentService, Object);
Component.Service = ComponentService;

function ComponentServiceConstructor<C extends Component, T>(this: ComponentService<C, T>, component: C, serviceName: string | undefined): ComponentService<C, T> {
  if (serviceName !== void 0) {
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
  }
  this._component = component;
  return this;
}

function ComponentServiceDecoratorFactory<C extends Component, T>(descriptor: ComponentServiceInit<C, T>): PropertyDecorator {
  const type = descriptor.type;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseComponentService = descriptor.extends;
  delete descriptor.extends;
  if (BaseComponentService === void 0) {
    BaseComponentService = ComponentService.constructorForType(type) as ComponentServicePrototype<T>;
  }
  if (BaseComponentService === null) {
    BaseComponentService = ComponentService;
  }

  function DecoratedComponentService(this: ComponentService<C, T>, component: C, serviceName: string | undefined): ComponentService<C, T> {
    let _this: ComponentService<C, T> = function accessor(): T | undefined {
      return _this._state;
    } as ComponentService<C, T>;
    Object.setPrototypeOf(_this, this);
    _this = BaseComponentService!.call(_this, component, serviceName) || _this;
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
    Object.setPrototypeOf(DecoratedComponentService, BaseComponentService);
    DecoratedComponentService.prototype = descriptor as ComponentService<C, T>;
    DecoratedComponentService.prototype.constructor = DecoratedComponentService;
    Object.setPrototypeOf(DecoratedComponentService.prototype, BaseComponentService.prototype);
  } else {
    __extends(DecoratedComponentService, BaseComponentService);
  }

  return Component.decorateComponentService.bind(void 0, DecoratedComponentService);
}

Object.defineProperty(ComponentService.prototype, "component", {
  get: function <C extends Component>(this: ComponentService<C, unknown>): C {
    return this._component;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "inherit", {
  get: function (this: ComponentService<Component, unknown>): string | undefined {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

ComponentService.prototype.setInherit = function (this: ComponentService<Component, unknown>,
                                              inherit: string | undefined): void {
  this.unbindSuperService();
  if (inherit !== void 0) {
    this._inherit = inherit;
    this.bindSuperService();
  } else if (this._inherit !== void 0) {
    this._inherit = void 0;
  }
};

Object.defineProperty(ComponentService.prototype, "superService", {
  get: function <T>(this: ComponentService<Component, T>): ComponentService<Component, T> | null {
    let superService: ComponentService<Component, T> | null | undefined = this._superService;
    if (superService === void 0) {
      superService = null;
      let component = this._component;
      if (!component.isMounted()) {
        const inherit = this._inherit;
        if (inherit !== void 0) {
          do {
            const parentComponent = component.parentComponent;
            if (parentComponent !== null) {
              component = parentComponent;
              const service = component.getComponentService(inherit);
              if (service === null) {
                continue;
              } else {
                superService = service as ComponentService<Component, T>;
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
  let component = this._component;
  if (component.isMounted()) {
    const inherit = this._inherit;
    if (inherit !== void 0) {
      do {
        const parentComponent = component.parentComponent;
        if (parentComponent !== null) {
          component = parentComponent;
          const service = component.getComponentService(inherit);
          if (service === null) {
            continue;
          } else {
            this._superService = service;
          }
        } else if (component !== this._component) {
          const service = component.getLazyComponentService(inherit);
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

ComponentService.prototype.unbindSuperService = function (this: ComponentService<Component, unknown>): void {
  const superService = this._superService;
  if (superService !== void 0) {
    this._superService = void 0;
  }
};

Object.defineProperty(ComponentService.prototype, "superState", {
  get: function <T>(this: ComponentService<Component, T>): T | undefined {
    const superService = this.superService;
    return superService !== null ? superService.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "ownState", {
  get: function <T>(this: ComponentService<Component, T>): T | undefined {
    return this._state;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentService.prototype, "state", {
  get: function <T>(this: ComponentService<Component, T>): T | undefined {
    const state = this._state;
    return state !== void 0 ? state : this.superState;
  },
  enumerable: true,
  configurable: true,
});

ComponentService.prototype.mount = function (this: ComponentService<Component, unknown>): void {
  this.bindSuperService();
};

ComponentService.prototype.unmount = function (this: ComponentService<Component, unknown>): void {
  this.unbindSuperService();
};

ComponentService.prototype.init = function <T>(this: ComponentService<Component, T>): T | undefined {
  return void 0;
};

ComponentService.constructorForType = function (type: unknown): ComponentServicePrototype<unknown> | null {
  if (type === ExecuteManager) {
    return ComponentService.Execute;
  }
  return null;
}
