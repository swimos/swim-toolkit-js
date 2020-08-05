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
import {AnyViewScope} from "./AnyViewScope";
import {ObjectViewScope} from "./ObjectViewScope";
import {StringViewScope} from "./StringViewScope";
import {BooleanViewScope} from "./BooleanViewScope";
import {NumberViewScope} from "./NumberViewScope";

export type ViewScopeType<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, infer T, any>} ? T : unknown;

export type ViewScopeInitType<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, any, infer U>} ? U : unknown;

export type ViewScopeInit<V extends View, T, U = T> =
  (this: ViewScope<V, T, U>) => T | U | undefined;

export type ViewScopeFromAny<V extends View, T, U = T> =
  (this: ViewScope<V, T, U>, value: T | U) => T | undefined;

export type ViewScopeTypeConstructor = FromAny<any>
                                     | typeof Object
                                     | typeof String
                                     | typeof Boolean
                                     | typeof Number
                                     | {new (...args: any): any}
                                     | any;

export type ViewScopeDescriptorType<V extends View, TC extends ViewScopeTypeConstructor> =
  TC extends typeof Number ? ViewScopeDescriptor<V, number | null, number | string | null> :
  TC extends typeof Boolean ? ViewScopeDescriptor<V, boolean | null, boolean | string | null> :
  TC extends typeof String ? ViewScopeDescriptor<V, string | null> :
  TC extends typeof Object ? ViewScopeDescriptor<V, Object> :
  TC extends FromAny<any> ? ViewScopeDescriptor<V, any> :
  TC extends new (...args: any) => any ? ViewScopeDescriptor<V, InstanceType<TC>, any> :
  ViewScopeDescriptor<V, any>;

export interface ViewScopeDescriptor<V extends View, T, U = T> {
  init?: ViewScopeInit<V, T, U>;
  value?: T | U;
  inherit?: string | boolean;
  updateFlags?: ViewFlags;
  fromAny?: ViewScopeFromAny<V, T, U>;
  /** @hidden */
  scopeType?: ViewScopeConstructor<T, U>;
}

export interface ViewScopeConstructor<T, U = T> {
  new<V extends View>(view: V, scopeName: string, descriptor?: ViewScopeDescriptor<V, T, U>): ViewScope<V, T, U>;
}

export interface ViewScopeClass {
  new<V extends View, T, U>(view: V, scopeName: string, descriptor?: ViewScopeDescriptor<V, T, U>): ViewScope<V, T, U>;

  <V extends View, TC extends ViewScopeTypeConstructor>(
      valueType: TC, descriptor?: ViewScopeDescriptorType<V, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Any: typeof AnyViewScope; // defined by AnyViewScope
  /** @hidden */
  Object: typeof ObjectViewScope; // defined by ObjectViewScope
  /** @hidden */
  String: typeof StringViewScope; // defined by StringViewScope
  /** @hidden */
  Boolean: typeof BooleanViewScope; // defined by BooleanViewScope
  /** @hidden */
  Number: typeof NumberViewScope; // defined by NumberViewScope
}

export interface ViewScope<V extends View, T, U = T> {
  (): T | undefined;
  (state: T | U | undefined): V;

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

  updateFlags?: ViewFlags;

  readonly view: V;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superScope: ViewScope<View, T, U> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ViewScope<View, T, U>): void;

  /** @hidden */
  removeSubScope(subScope: ViewScope<View, T, U>): void;

  readonly superState: T | undefined;

  readonly ownState: T | undefined;

  readonly state: T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getState(): T;

  getStateOr<V>(elseState: V): T | V;

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

  /** @hidden */
  cascadeUpdate(newState: T | undefined, oldState: T | undefined): void;

  mount(): void;

  unmount(): void;

  fromAny(value: T | U): T | undefined;
}

export const ViewScope: ViewScopeClass = (function (_super: typeof Object): ViewScopeClass {
  function ViewScopeDecoratorFactory<V extends View, TC extends ViewScopeTypeConstructor>(
      valueType: TC, descriptor?: ViewScopeDescriptorType<V, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ViewScopeDescriptorType<V, TC>;
    }
    let scopeType = descriptor.scopeType;
    if (scopeType === void 0) {
      if (valueType === String) {
        scopeType = ViewScope.String;
      } else if (valueType === Boolean) {
        scopeType = ViewScope.Boolean;
      } else if (valueType === Number) {
        scopeType = ViewScope.Number;
      } else if (FromAny.is(valueType)) {
        scopeType = ViewScope.Any.bind(void 0, valueType);
      } else {
        scopeType = ViewScope.Object;
      }
      descriptor.scopeType = scopeType;
    }
    return View.decorateViewScope.bind(void 0, scopeType, descriptor);
  }

  function ViewScopeConstructor<V extends View, T, U = T>(
      this: ViewScope<V, T, U>, view: V, scopeName: string,
      descriptor?: ViewScopeDescriptor<V, T, U>): ViewScope<V, T, U> {
    this._view = view;
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
    if (descriptor !== void 0) {
      if (typeof descriptor.inherit === "string") {
        this._inherit = descriptor.inherit;
      } else if (descriptor.inherit === true) {
        this._inherit = scopeName;
      }
      if (descriptor.fromAny !== void 0) {
        this.fromAny = descriptor.fromAny;
      }
      if (descriptor.updateFlags !== void 0) {
        this.updateFlags = descriptor.updateFlags;
      }
    }
    this._auto = true;
    let value: T | U | undefined;
    if (descriptor !== void 0) {
      if (descriptor.init !== void 0) {
        value = descriptor.init.call(this);
      } else {
        value = descriptor.value;
      }
    }
    if (value !== void 0) {
      value = this.fromAny(value);
    }
    this._state = value as T | undefined;
    return this;
  }

  const ViewScope: ViewScopeClass = function <V extends View, T, U>(
      this: ViewScope<V, T, U> | ViewScopeClass,
      view?: V | ViewScopeTypeConstructor,
      scopeName?: string | ViewScopeDescriptor<V, T, U>,
      descriptor?: ViewScopeDescriptor<V, T, U>): ViewScope<V, T> | PropertyDecorator | void {
    if (this instanceof ViewScope) { // constructor
      return ViewScopeConstructor.call(this, view as V, scopeName as string, descriptor);
    } else { // decorator factory
      const valueType = view as ViewScopeTypeConstructor;
      descriptor = scopeName as ViewScopeDescriptor<V, T, U> | undefined;
      return ViewScopeDecoratorFactory(valueType, descriptor);
    }
  } as ViewScopeClass;
  __extends(ViewScope, _super);

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

  ViewScope.prototype.getStateOr = function <T, U, V>(this: ViewScope<View, T, U>,
                                                      elseState: V): T | V {
    let state: T | V | undefined = this.state;
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

  ViewScope.prototype.fromAny = function <T, U>(this: ViewScope<View, T, U>,
                                                value: T | U): T | undefined {
    throw new Error(); // abstract
  };

  return ViewScope;
}(Object));
View.Scope = ViewScope;
