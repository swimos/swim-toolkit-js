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
import {DisplayManagerService} from "./DisplayManagerService";
import {LayoutManagerService} from "./LayoutManagerService";
import {ViewportManagerService} from "./ViewportManagerService";
import {HistoryManagerService} from "./HistoryManagerService";
import {ModalManagerService} from "./ModalManagerService";

export type ViewServiceType<V, K extends keyof V> =
  V extends {[P in K]: ViewService<any, infer T>} ? T : unknown;

export interface ViewServiceInit<V extends View, T> {
  type?: unknown;

  init?(): T | undefined;
  value?: T;
  inherit?: string | boolean;

  extends?: ViewServicePrototype<T>;
}

export type ViewServiceDescriptor<V extends View, T> = ViewServiceInit<V, T> & ThisType<ViewService<V, T>>;

export type ViewServicePrototype<T> = Function & { prototype: ViewService<View, T> };

export type ViewServiceConstructor<T> = new <V extends View>(view: V, serviceName: string | undefined) => ViewService<V, T>;

export declare abstract class ViewService<V extends View, T> {
  /** @hidden */
  _view: V;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superService?: ViewService<View, T>;
  /** @hidden */
  _state: T | undefined;

  constructor(view: V, serviceName: string | undefined);

  get view(): V;

  get name(): string;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superService(): ViewService<View, T> | null;

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
  static constructorForType(type: unknown): ViewServicePrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Display: typeof DisplayManagerService; // defined by DisplayManagerService
  /** @hidden */
  static Layout: typeof LayoutManagerService; // defined by LayoutManagerService
  /** @hidden */
  static Viewport: typeof ViewportManagerService; // defined by ViewportManagerService
  /** @hidden */
  static History: typeof HistoryManagerService; // defined by HistoryManagerService
  /** @hidden */
  static Modal: typeof ModalManagerService; // defined by ModalManagerService
}

export interface ViewService<V extends View, T> {
  (): T | undefined;
}

export function ViewService<V extends View, T>(descriptor: {extends: ViewServicePrototype<T>} & ViewServiceDescriptor<V, T>): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof Object} & ViewServiceDescriptor<V, object>): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof DisplayManager} & ViewServiceDescriptor<V, DisplayManager>): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof LayoutManager} & ViewServiceDescriptor<V, LayoutManager>): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof ViewportManager} & ViewServiceDescriptor<V, ViewportManager> ): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof HistoryManager} & ViewServiceDescriptor<V, HistoryManager>): PropertyDecorator;
export function ViewService<V extends View>(descriptor: {type: typeof ModalManager} & ViewServiceDescriptor<V, ModalManager>): PropertyDecorator;
export function ViewService<V extends View, T>(descriptor: {type: Function & { prototype: T }} & ViewServiceDescriptor<V, T>): PropertyDecorator;

export function ViewService<V extends View, T>(
    this: ViewService<V, T> | typeof ViewService,
    view: V | ViewServiceInit<V, T>,
    serviceName?: string,
  ): ViewService<V, T> | PropertyDecorator {
  if (this instanceof ViewService) { // constructor
    return ViewServiceConstructor.call(this, view as V, serviceName);
  } else { // decorator factory
    return ViewServiceDecoratorFactory(view as ViewServiceInit<V, T>);
  }
};
__extends(ViewService, Object);
View.Service = ViewService;

function ViewServiceConstructor<V extends View, T>(this: ViewService<V, T>, view: V, serviceName: string | undefined): ViewService<V, T> {
  if (serviceName !== void 0) {
    Object.defineProperty(this, "name", {
      value: serviceName,
      enumerable: true,
      configurable: true,
    });
  }
  this._view = view;
  return this;
}

function ViewServiceDecoratorFactory<V extends View, T>(descriptor: ViewServiceInit<V, T>): PropertyDecorator {
  const type = descriptor.type;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseViewService = descriptor.extends;
  delete descriptor.extends;
  if (BaseViewService === void 0) {
    BaseViewService = ViewService.constructorForType(type) as ViewServicePrototype<T>;
  }
  if (BaseViewService === null) {
    BaseViewService = ViewService;
  }

  function DecoratedViewService(this: ViewService<V, T>, view: V, serviceName: string | undefined): ViewService<V, T> {
    let _this: ViewService<V, T> = function accessor(): T | undefined {
      return _this._state;
    } as ViewService<V, T>;
    Object.setPrototypeOf(_this, this);
    _this = BaseViewService!.call(_this, view, serviceName) || _this;
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
    Object.setPrototypeOf(DecoratedViewService, BaseViewService);
    DecoratedViewService.prototype = descriptor as ViewService<V, T>;
    DecoratedViewService.prototype.constructor = DecoratedViewService;
    Object.setPrototypeOf(DecoratedViewService.prototype, BaseViewService.prototype);
  } else {
    __extends(DecoratedViewService, BaseViewService);
  }

  return View.decorateViewService.bind(void 0, DecoratedViewService);
}

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

ViewService.constructorForType = function (type: unknown): ViewServicePrototype<unknown> | null {
  if (type === DisplayManager) {
    return ViewService.Display;
  } else if (type === LayoutManager) {
    return ViewService.Layout;
  } else if (type === ViewportManager) {
    return ViewService.Viewport;
  } else if (type === HistoryManager) {
    return ViewService.History;
  } else if (type === ModalManager) {
    return ViewService.Modal;
  }
  return null;
}
