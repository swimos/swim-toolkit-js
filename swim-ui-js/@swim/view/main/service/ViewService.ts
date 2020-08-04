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
import {View} from "../View";
import {DisplayManager} from "../display/DisplayManager";
import {LayoutManager} from "../layout/LayoutManager";
import {ViewportManager} from "../viewport/ViewportManager";
import {HistoryManager} from "../history/HistoryManager";
import {ModalManager} from "../modal/ModalManager";
import {ObjectViewService} from "./ObjectViewService";
import {DisplayManagerService} from "./DisplayManagerService";
import {LayoutManagerService} from "./LayoutManagerService";
import {ViewportManagerService} from "./ViewportManagerService";
import {HistoryManagerService} from "./HistoryManagerService";
import {ModalManagerService} from "./ModalManagerService";

export type ViewServiceType<V, K extends keyof V> =
  V extends {[P in K]: ViewService<any, infer T>} ? T : unknown;

export type ViewServiceInit<V extends View, T> =
  (this: ViewService<V, T>) => T | undefined;

export type ViewServiceTypeConstructor = typeof Object
                                       | typeof DisplayManager
                                       | typeof LayoutManager
                                       | typeof ViewportManager
                                       | typeof HistoryManager
                                       | typeof ModalManager
                                       | {new (...args: any): any}
                                       | any;

export type ViewServiceDescriptorType<V extends View, TC extends ViewServiceTypeConstructor> =
  TC extends typeof DisplayManager ? ViewServiceDescriptor<V, DisplayManager> :
  TC extends typeof LayoutManager ? ViewServiceDescriptor<V, LayoutManager> :
  TC extends typeof ViewportManager ? ViewServiceDescriptor<V, ViewportManager> :
  TC extends typeof HistoryManager ? ViewServiceDescriptor<V, HistoryManager> :
  TC extends typeof ModalManager ? ViewServiceDescriptor<V, ModalManager> :
  TC extends typeof Object ? ViewServiceDescriptor<V, Object> :
  TC extends new (...args: any) => any ? ViewServiceDescriptor<V, InstanceType<TC>> :
  ViewServiceDescriptor<V, any>;

export interface ViewServiceDescriptor<V extends View, T> {
  init?: ViewServiceInit<V, T>;
  value?: T;
  inherit?: string | boolean;
  /** @hidden */
  serviceType?: ViewServiceConstructor<T>;
}

export interface ViewServiceConstructor<T> {
  new<V extends View>(view: V, serviceName: string, descriptor?: ViewServiceDescriptor<V, T>): ViewService<V, T>;
}

export interface ViewServiceClass {
  new<V extends View, T>(view: V, serviceName: string, value?: T, inherit?: string): ViewService<V, T>;

  <V extends View, TC extends ViewServiceTypeConstructor>(
      valueType: TC, descriptor?: ViewServiceDescriptorType<V, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Object: typeof ObjectViewService; // defined by ObjectViewService
  /** @hidden */
  Display: typeof DisplayManagerService; // defined by DisplayManagerService
  /** @hidden */
  Layout: typeof LayoutManagerService; // defined by LayoutManagerService
  /** @hidden */
  Viewport: typeof ViewportManagerService; // defined by ViewportManagerService
  /** @hidden */
  History: typeof HistoryManagerService; // defined by HistoryManagerService
  /** @hidden */
  Modal: typeof ModalManagerService; // defined by ModalManagerService
}

export interface ViewService<V extends View, T> {
  (): T | undefined;

  /** @hidden */
  _view: V;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ViewService<View, T>;
  /** @hidden */
  _state: T | undefined;

  readonly view: V;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superService: ViewService<View, T> | null;

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

export const ViewService: ViewServiceClass = (function (_super: typeof Object): ViewServiceClass {
  function ViewServiceDecoratorFactory<V extends View, TC extends ViewServiceTypeConstructor>(
      valueType: TC, descriptor?: ViewServiceDescriptorType<V, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ViewServiceDescriptorType<V, TC>;
    }
    let serviceType = descriptor.serviceType;
    if (serviceType === void 0) {
      if (valueType === DisplayManager) {
        serviceType = ViewService.Display;
      } else if (valueType === LayoutManager) {
        serviceType = ViewService.Layout;
      } else if (valueType === ViewportManager) {
        serviceType = ViewService.Viewport;
      } else if (valueType === HistoryManager) {
        serviceType = ViewService.History;
      } else if (valueType === ModalManager) {
        serviceType = ViewService.Modal;
      } else {
        serviceType = ViewService.Object;
      }
      descriptor.serviceType = serviceType;
    }
    return View.decorateViewService.bind(void 0, serviceType, descriptor);
  }

  function ViewServiceConstructor<V extends View, T>(
      this: ViewService<V, T>, view: V, serviceName: string,
      descriptor?: ViewServiceDescriptor<V, T>): ViewService<V, T> {
    this._view = view;
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

  const ViewService: ViewServiceClass = function <V extends View, T>(
      this: ViewService<V, T> | ViewServiceClass,
      view?: V | ViewServiceTypeConstructor,
      serviceName?: string | ViewServiceDescriptor<V, T>,
      descriptor?: ViewServiceDescriptor<V, T>): ViewService<V, T> | PropertyDecorator | void {
    if (this instanceof ViewService) { // constructor
      return ViewServiceConstructor.call(this, view as V, serviceName as string, descriptor);
    } else { // decorator factory
      const valueType = view as ViewServiceTypeConstructor;
      descriptor = serviceName as ViewServiceDescriptor<V, T> | undefined;
      return ViewServiceDecoratorFactory(valueType, descriptor);
    }
  } as ViewServiceClass;
  __extends(ViewService, _super);

  Object.defineProperty(ViewService.prototype, "view", {
    get: function <V extends View>(this: ViewService<V, unknown>): V {
      return this._view;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ViewService.prototype, "inherit", {
    get: function (this: ViewService<View, unknown>): string | undefined {
      return this._inherit;
    },
    enumerable: true,
    configurable: true,
  });

  ViewService.prototype.setInherit = function (this: ViewService<View, unknown>,
                                               inherit: string | undefined): void {
    this.unbindSuperService();
    if (inherit !== void 0) {
      this._inherit = inherit;
      this.bindSuperService();
    } else if (this._inherit !== void 0) {
      this._inherit = void 0;
    }
  };

  Object.defineProperty(ViewService.prototype, "superService", {
    get: function <T>(this: ViewService<View, T>): ViewService<View, T> | null {
      let superService: ViewService<View, T> | null | undefined = this._superService;
      if (superService === void 0) {
        superService = null;
        let view = this._view;
        if (!view.isMounted()) {
          const inherit = this._inherit;
          if (inherit !== void 0) {
            do {
              const parentView = view.parentView;
              if (parentView !== null) {
                view = parentView;
                const service = view.getViewService(inherit);
                if (service === null) {
                  continue;
                } else {
                  superService = service as ViewService<View, T>;
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

  ViewService.prototype.bindSuperService = function (this: ViewService<View, unknown>): void {
    let view = this._view;
    if (view.isMounted()) {
      const inherit = this._inherit;
      if (inherit !== void 0) {
        do {
          const parentView = view.parentView;
          if (parentView !== null) {
            view = parentView;
            const service = view.getViewService(inherit);
            if (service === null) {
              continue;
            } else {
              this._superService = service;
            }
          } else if (view !== this._view) {
            const service = view.getLazyViewService(inherit);
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

  ViewService.prototype.unbindSuperService = function (this: ViewService<View, unknown>): void {
    const superService = this._superService;
    if (superService !== void 0) {
      this._superService = void 0;
    }
  };

  Object.defineProperty(ViewService.prototype, "superState", {
    get: function <T>(this: ViewService<View, T>): T | undefined {
      const superService = this.superService;
      return superService !== null ? superService.state : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ViewService.prototype, "ownState", {
    get: function <T>(this: ViewService<View, T>): T | undefined {
      return this._state;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ViewService.prototype, "state", {
    get: function <T>(this: ViewService<View, T>): T | undefined {
      const state = this._state;
      return state !== void 0 ? state : this.superState;
    },
    enumerable: true,
    configurable: true,
  });

  ViewService.prototype.mount = function (this: ViewService<View, unknown>): void {
    this.bindSuperService();
  };

  ViewService.prototype.unmount = function (this: ViewService<View, unknown>): void {
    this.unbindSuperService();
  };

  ViewService.prototype.init = function <T>(this: ViewService<View, T>): T | undefined {
    return void 0;
  };

  return ViewService;
}(Object));
View.Service = ViewService;
