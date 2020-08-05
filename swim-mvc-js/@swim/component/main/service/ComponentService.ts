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
import {ObjectComponentService} from "./ObjectComponentService";
import {ExecuteManagerService} from "./ExecuteManagerService";

export type ComponentServiceType<C, K extends keyof C> =
  C extends {[P in K]: ComponentService<any, infer T>} ? T : unknown;

export type ComponentServiceInit<C extends Component, T> =
  (this: ComponentService<C, T>) => T | undefined;

export type ComponentServiceTypeConstructor = typeof Object
                                            | typeof ExecuteManager
                                            | {new (...args: any): any}
                                            | any;

export type ComponentServiceDescriptorType<C extends Component, TC extends ComponentServiceTypeConstructor> =
  TC extends typeof ExecuteManager ? ComponentServiceDescriptor<C, ExecuteManager> :
  TC extends typeof Object ? ComponentServiceDescriptor<C, Object> :
  TC extends new (...args: any) => any ? ComponentServiceDescriptor<C, InstanceType<TC>> :
  ComponentServiceDescriptor<C, any>;

export interface ComponentServiceDescriptor<C extends Component, T> {
  init?: ComponentServiceInit<C, T>;
  value?: T;
  inherit?: string | boolean;
  /** @hidden */
  serviceType?: ComponentServiceConstructor<T>;
}

export interface ComponentServiceConstructor<T> {
  new<C extends Component>(component: C, serviceName: string, descriptor?: ComponentServiceDescriptor<C, T>): ComponentService<C, T>;
}

export interface ComponentServiceClass {
  new<C extends Component, T>(component: C, serviceName: string, descriptor?: ComponentServiceDescriptor<C, T>): ComponentService<C, T>;

  <C extends Component, TC extends ComponentServiceTypeConstructor>(
      valueType: TC, descriptor?: ComponentServiceDescriptorType<C, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Object: typeof ObjectComponentService; // defined by ObjectComponentService
  /** @hidden */
  Execute: typeof ExecuteManagerService; // defined by ExecuteManagerService
}

export interface ComponentService<C extends Component, T> {
  (): T | undefined;

  /** @hidden */
  _component: C;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ComponentService<Component, T>;
  /** @hidden */
  _state: T | undefined;

  readonly component: C;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superService: ComponentService<Component, T> | null;

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

export const ComponentService: ComponentServiceClass = (function (_super: typeof Object): ComponentServiceClass {
  function ComponentServiceDecoratorFactory<C extends Component, TC extends ComponentServiceTypeConstructor>(
      valueType: TC, descriptor?: ComponentServiceDescriptorType<C, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ComponentServiceDescriptorType<C, TC>;
    }
    let serviceType = descriptor.serviceType;
    if (serviceType === void 0) {
      if (valueType === ExecuteManager) {
        serviceType = ComponentService.Execute;
      } else {
        serviceType = ComponentService.Object;
      }
      descriptor.serviceType = serviceType;
    }
    return Component.decorateComponentService.bind(void 0, serviceType, descriptor);
  }

  function ComponentServiceConstructor<C extends Component, T>(
      this: ComponentService<C, T>, component: C, serviceName: string,
      descriptor?: ComponentServiceDescriptor<C, T>): ComponentService<C, T> {
    this._component = component;
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

  const ComponentService: ComponentServiceClass = function <C extends Component, T>(
      this: ComponentService<C, T> | ComponentServiceClass,
      component?: C | ComponentServiceTypeConstructor,
      serviceName?: string | ComponentServiceDescriptor<C, T>,
      descriptor?: ComponentServiceDescriptor<C, T>): ComponentService<C, T> | PropertyDecorator | void {
    if (this instanceof ComponentService) { // constructor
      return ComponentServiceConstructor.call(this, component as C, serviceName as string, descriptor);
    } else { // decorator factory
      const valueType = component as ComponentServiceTypeConstructor;
      descriptor = serviceName as ComponentServiceDescriptor<C, T> | undefined;
      return ComponentServiceDecoratorFactory(valueType, descriptor);
    }
  } as ComponentServiceClass;
  __extends(ComponentService, _super);

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

  return ComponentService;
}(Object));
Component.Service = ComponentService;
