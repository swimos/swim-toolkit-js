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
import {Objects, FromAny} from "@swim/util";
import {ViewFlags, View} from "../View";
import {ObjectViewScope} from "./ObjectViewScope";
import {StringViewScope} from "./StringViewScope";
import {BooleanViewScope} from "./BooleanViewScope";
import {NumberViewScope} from "./NumberViewScope";

export type ViewScopeType<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, infer T, any>} ? T : unknown;

export type ViewScopeInitType<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, infer T, infer U>} ? T | U : unknown;

export interface ViewScopeInit<V extends View, T, U = T> {
  type?: unknown;

  init?(): T | U | undefined;
  value?: T | U;
  inherit?: string | boolean;

  updateFlags?: ViewFlags;
  fromAny?(value: T | U): T | undefined;

  extends?: ViewScopePrototype<T, U>;
}

export type ViewScopeDescriptor<V extends View, T, U = T, I = {}> = ViewScopeInit<V, T, U> & ThisType<ViewScope<V, T, U> & I> & I;

export type ViewScopePrototype<T, U = T> = Function & { prototype: ViewScope<View, T, U> };

export type ViewScopeConstructor<T, U = T> = new <V extends View>(view: V, scopeName: string | undefined) => ViewScope<V, T, U>;

export declare abstract class ViewScope<V extends View, T, U = T> {
  /** @hidden */
  _view: V;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superScope?: ViewScope<View, T, U>;
  /** @hidden */
  _subScopes?: ViewScope<View, T, U>[];
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _state: T | undefined;

  constructor(view: V, scopeName: string | undefined);

  get name(): string;

  get view(): V;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superScope(): ViewScope<View, T, U> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ViewScope<View, T, U>): void;

  /** @hidden */
  removeSubScope(subScope: ViewScope<View, T, U>): void;

  get superState(): T | undefined;

  get ownState(): T | undefined;

  get state(): T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getState(): T;

  getStateOr<E>(elseState: E): T | E;

  setState(newState: T | U | undefined): void;

  /** @hidden */
  willSetState(newState: T | undefined, oldState: T | undefined): void;

  /** @hidden */
  didSetState(newState: T | undefined, oldState: T | undefined): void;

  setAutoState(state: T | U | undefined): void;

  setOwnState(state: T | U | undefined): void;

  setBaseState(state: T | U | undefined): void;

  update(newState: T | undefined, oldState: T | undefined): void;

  willUpdate(newState: T | undefined, oldState: T | undefined): void;

  onUpdate(newState: T | undefined, oldState: T | undefined): void;

  didUpdate(newState: T | undefined, oldState: T | undefined): void;

  updateFlags?: ViewFlags;

  /** @hidden */
  cascadeUpdate(newState: T | undefined, oldState: T | undefined): void;

  mount(): void;

  unmount(): void;

  abstract fromAny(value: T | U): T | undefined;

  /** @hidden */
  static constructorForType(type: unknown): ViewScopePrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Object: typeof ObjectViewScope; // defined by ObjectViewScope
  /** @hidden */
  static String: typeof StringViewScope; // defined by StringViewScope
  /** @hidden */
  static Boolean: typeof BooleanViewScope; // defined by BooleanViewScope
  /** @hidden */
  static Number: typeof NumberViewScope; // defined by NumberViewScope
}

export interface ViewScope<V extends View, T, U = T> {
  (): T | undefined;
  (value: T | U | undefined): V;
}

export function ViewScope<V extends View, T, U = T, I = {}>(descriptor: {extends: ViewScopePrototype<T, U>} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T extends Object = object, U extends Object = T, I = {}>(descriptor: {type: typeof Object} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T extends string = string, U extends string = T, I = {}>(descriptor: {type: typeof String} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T extends boolean = boolean, U extends boolean | string = T | string, I = {}>(descriptor: {type: typeof Boolean} & ViewScopeDescriptor<V, T, U, I> ): PropertyDecorator;
export function ViewScope<V extends View, T extends number = number, U extends number | string = T | string, I = {}>(descriptor: {type: typeof Number} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T, U = T, I = {}>(descriptor: {type: FromAny<T, U>} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T, U = T, I = {}>(descriptor: {type: Function & { prototype: T }} & ViewScopeDescriptor<V, T, U, I>): PropertyDecorator;

export function ViewScope<V extends View, T, U>(
    this: ViewScope<V, T, U> | typeof ViewScope,
    view: V | ViewScopeInit<V, T, U>,
    scopeName?: string,
  ): ViewScope<V, T, U> | PropertyDecorator {
  if (this instanceof ViewScope) { // constructor
    return ViewScopeConstructor.call(this, view as V, scopeName);
  } else { // decorator factory
    return ViewScopeDecoratorFactory(view as ViewScopeInit<V, T, U>);
  }
};
__extends(ViewScope, Object);
View.Scope = ViewScope;

function ViewScopeConstructor<V extends View, T, U>(this: ViewScope<V, T, U>, view: V, scopeName: string | undefined): ViewScope<V, T, U> {
  if (scopeName !== void 0) {
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
  }
  this._view = view;
  this._auto = true;
  return this;
}

function ViewScopeDecoratorFactory<V extends View, T, U = T>(descriptor: ViewScopeInit<V, T, U>): PropertyDecorator {
  const type = descriptor.type;
  const init = descriptor.init;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.init;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseViewScope = descriptor.extends;
  delete descriptor.extends;
  if (BaseViewScope === void 0) {
    BaseViewScope = ViewScope.constructorForType(type) as ViewScopePrototype<T, U>;
  }
  if (BaseViewScope === null) {
    if (FromAny.is<T, U>(type)) {
      BaseViewScope = ViewScope;
      if (!("fromAny" in descriptor)) {
        descriptor.fromAny = type.fromAny;
      }
    } else {
      BaseViewScope = ViewScope.Object;
    }
  }

  function DecoratedViewScope(this: ViewScope<V, T, U>, view: V, scopeName: string | undefined): ViewScope<V, T, U> {
    let _this: ViewScope<V, T, U> = function accessor(state?: T | U): T | undefined | V {
      if (arguments.length === 0) {
        return _this._state;
      } else {
        _this.setState(state);
        return _this._view;
      }
    } as ViewScope<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseViewScope!.call(_this, view, scopeName) || _this;
    if (typeof inherit === "string") {
      _this._inherit = inherit;
    } else if (inherit === true && scopeName !== void 0) {
      _this._inherit = scopeName;
    }
    let initValue: T | undefined;
    if (init !== void 0) {
      const lazyValue = init.call(_this);
      if (lazyValue !== void 0) {
        initValue = _this.fromAny(lazyValue);
      }
    } else if (value !== void 0) {
      initValue = _this.fromAny(value);
    }
    if (initValue !== void 0) {
      _this._state = initValue;
    }
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedViewScope, BaseViewScope);
    DecoratedViewScope.prototype = descriptor as ViewScope<V, T, U>;
    DecoratedViewScope.prototype.constructor = DecoratedViewScope;
    Object.setPrototypeOf(DecoratedViewScope.prototype, BaseViewScope.prototype);
  } else {
    __extends(DecoratedViewScope, BaseViewScope);
  }

  return View.decorateViewScope.bind(void 0, DecoratedViewScope);
}

Object.defineProperty(ViewScope.prototype, "view", {
  get: function <V extends View>(this: ViewScope<V, unknown>): V {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "inherit", {
  get: function (this: ViewScope<View, unknown>): string | undefined {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.setInherit = function (this: ViewScope<View, unknown>,
                                           inherit: string | undefined): void {
  this.unbindSuperScope();
  if (inherit !== void 0) {
    this._inherit = inherit;
    this.bindSuperScope();
  } else if (this._inherit !== void 0) {
    this._inherit = void 0;
  }
};

Object.defineProperty(ViewScope.prototype, "superScope", {
  get: function <T, U>(this: ViewScope<View, T, U>): ViewScope<View, T, U> | null {
    let superScope: ViewScope<View, T, U> | null | undefined = this._superScope;
    if (superScope === void 0) {
      superScope = null;
      let view = this._view;
      if (!view.isMounted()) {
        const inherit = this._inherit;
        if (inherit !== void 0) {
          do {
            const parentView = view.parentView;
            if (parentView !== null) {
              view = parentView;
              const scope = view.getLazyViewScope(inherit);
              if (scope === null) {
                continue;
              } else {
                superScope = scope as ViewScope<View, T, U>;
              }
            }
            break;
          } while (true);
        }
      }
    }
    return superScope;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.bindSuperScope = function (this: ViewScope<View, unknown>): void {
  let view = this._view;
  if (view.isMounted()) {
    const inherit = this._inherit;
    if (inherit !== void 0) {
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const scope = view.getLazyViewScope(inherit);
          if (scope === null) {
            continue;
          } else {
            this._superScope = scope;
            scope.addSubScope(this);
          }
        }
        break;
      } while (true);
    }
  }
};

ViewScope.prototype.unbindSuperScope = function (this: ViewScope<View, unknown>): void {
  const superScope = this._superScope;
  if (superScope !== void 0) {
    superScope.removeSubScope(this);
    this._superScope = void 0;
  }
};

ViewScope.prototype.addSubScope = function <T, U>(this: ViewScope<View, T, U>,
                                                  subScope: ViewScope<View, T, U>): void {
  let subScopes = this._subScopes;
  if (subScopes === void 0) {
    subScopes = [];
    this._subScopes = subScopes;
  }
  subScopes.push(subScope);
}

ViewScope.prototype.removeSubScope = function <T, U>(this: ViewScope<View, T, U>,
                                                     subScope: ViewScope<View, T, U>): void {
  const subScopes = this._subScopes;
  if (subScopes !== void 0) {
    const index = subScopes.indexOf(subScope);
    if (index >= 0) {
      subScopes.splice(index, 1);
    }
  }
};

Object.defineProperty(ViewScope.prototype, "superState", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    const superScope = this.superScope;
    return superScope !== null ? superScope.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "ownState", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    return this._state;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "state", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    const state = this._state;
    return state !== void 0 ? state : this.superState;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.isAuto = function (this: ViewScope<View, unknown>): boolean {
  return this._auto;
};

ViewScope.prototype.setAuto = function (this: ViewScope<View, unknown>,
                                        auto: boolean): void {
  if (this._auto !== auto) {
    this._auto = auto;
    this._view.viewScopeDidSetAuto(this, auto);
  }
};

ViewScope.prototype.getState = function <T, U>(this: ViewScope<View, T, U>): T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state;
};

ViewScope.prototype.getStateOr = function <T, U, E>(this: ViewScope<View, T, U>,
                                                    elseState: E): T | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state;
};

ViewScope.prototype.setState = function <T, U>(this: ViewScope<View, T, U>,
                                               state: T | U | undefined): void {
  this._auto = false;
  this.setOwnState(state);
};

ViewScope.prototype.willSetState = function <T, U>(this: ViewScope<View, T, U>,
                                                   newState: T | undefined,
                                                   oldState: T | undefined): void {
  // hook
}

ViewScope.prototype.didSetState = function <T, U>(this: ViewScope<View, T, U>,
                                                  newState: T | undefined,
                                                  oldState: T | undefined): void {
  // hook
}

ViewScope.prototype.setAutoState = function <T, U>(this: ViewScope<View, T, U>,
                                                   state: T | U | undefined): void {
  if (this._auto === true) {
    this.setOwnState(state);
  }
};

ViewScope.prototype.setOwnState = function <T, U>(this: ViewScope<View, T, U>,
                                                  newState: T | U | undefined): void {
  const oldState = this._state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  if (!Objects.equal(oldState, newState)) {
    this.willSetState(newState as T | undefined, oldState);
    this.willUpdate(newState as T | undefined, oldState);
    this._state = newState as T | undefined;
    this.onUpdate(newState as T | undefined, oldState);
    this.cascadeUpdate(newState as T | undefined, oldState);
    this.didUpdate(newState as T | undefined, oldState);
    this.didSetState(newState as T | undefined, oldState);
  }
};

ViewScope.prototype.setBaseState = function <T, U>(this: ViewScope<View, T, U>,
                                                   state: T | U | undefined): void {
  let superScope: ViewScope<View, T, U> | null | undefined;
  if (this._state === void 0 && (superScope = this.superScope, superScope !== null)) {
    superScope.setBaseState(state);
  } else {
    this.setState(state);
  }
};

ViewScope.prototype.update = function <T, U>(this: ViewScope<View, T, U>,
                                             newState: T | undefined,
                                             oldState: T | undefined): void {
  this.willUpdate(newState, oldState);
  this._state = newState;
  this.onUpdate(newState, oldState);
  this.cascadeUpdate(newState, oldState);
  this.didUpdate(newState, oldState);
};

ViewScope.prototype.willUpdate = function <T, U>(this: ViewScope<View, T, U>,
                                                 newState: T | undefined,
                                                 oldState: T | undefined): void {
  // hook
};

ViewScope.prototype.onUpdate = function <T, U>(this: ViewScope<View, T, U>,
                                               newState: T | undefined,
                                               oldState: T | undefined): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._view.requireUpdate(updateFlags);
  }
};

ViewScope.prototype.didUpdate = function <T, U>(this: ViewScope<View, T, U>,
                                                newState: T | undefined,
                                                oldState: T | undefined): void {
  this._view.viewScopeDidSetState(this, newState, oldState);
};

ViewScope.prototype.cascadeUpdate = function <T, U>(this: ViewScope<View, T, U>,
                                                    newState: T | undefined,
                                                    oldState: T | undefined): void {
  const subScopes = this._subScopes;
  if (subScopes !== void 0) {
    for (let i = 0, n = subScopes.length; i < n; i += 1) {
      const subScope = subScopes[i];
      if (subScope._state === void 0) {
        subScope.willUpdate(newState, oldState);
        subScope.onUpdate(newState, oldState);
        subScope.cascadeUpdate(newState, oldState);
        subScope.didUpdate(newState, oldState);
      }
    }
  }
};

ViewScope.prototype.mount = function (this: ViewScope<View, unknown>): void {
  this.bindSuperScope();
};

ViewScope.prototype.unmount = function (this: ViewScope<View, unknown>): void {
  this.unbindSuperScope();
};

ViewScope.constructorForType = function (type: unknown): ViewScopePrototype<unknown> | null {
  if (type === String) {
    return ViewScope.String;
  } else if (type === Boolean) {
    return ViewScope.Boolean;
  } else if (type === Number) {
    return ViewScope.Number;
  }
  return null;
}
