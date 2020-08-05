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
import {ComponentFlags, Component} from "../Component";
import {AnyComponentScope} from "./AnyComponentScope";
import {ObjectComponentScope} from "./ObjectComponentScope";
import {StringComponentScope} from "./StringComponentScope";
import {BooleanComponentScope} from "./BooleanComponentScope";
import {NumberComponentScope} from "./NumberComponentScope";

export type ComponentScopeType<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, infer T, any>} ? T : unknown;

export type ComponentScopeInitType<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, any, infer U>} ? U : unknown;

export type ComponentScopeInit<C extends Component, T, U = T> =
  (this: ComponentScope<C, T, U>) => T | U | undefined;

export type ComponentScopeFromAny<C extends Component, T, U = T> =
  (this: ComponentScope<C, T, U>, value: T | U) => T | undefined;

export type ComponentScopeTypeConstructor = FromAny<any>
                                          | typeof Object
                                          | typeof String
                                          | typeof Boolean
                                          | typeof Number
                                          | {new (...args: any): any}
                                          | any;

export type ComponentScopeDescriptorType<C extends Component, TC extends ComponentScopeTypeConstructor> =
  TC extends typeof Number ? ComponentScopeDescriptor<C, number | null, number | string | null> :
  TC extends typeof Boolean ? ComponentScopeDescriptor<C, boolean | null, boolean | string | null> :
  TC extends typeof String ? ComponentScopeDescriptor<C, string | null> :
  TC extends typeof Object ? ComponentScopeDescriptor<C, Object> :
  TC extends FromAny<any> ? ComponentScopeDescriptor<C, any> :
  TC extends new (...args: any) => any ? ComponentScopeDescriptor<C, InstanceType<TC>, any> :
  ComponentScopeDescriptor<C, any>;

export interface ComponentScopeDescriptor<C extends Component, T, U = T> {
  init?: ComponentScopeInit<C, T, U>;
  value?: T | U;
  inherit?: string | boolean;
  updateFlags?: ComponentFlags;
  fromAny?: ComponentScopeFromAny<C, T, U>;
  /** @hidden */
  scopeType?: ComponentScopeConstructor<T, U>;
}

export interface ComponentScopeConstructor<T, U = T> {
  new<C extends Component>(component: C, scopeName: string, descriptor?: ComponentScopeDescriptor<C, T, U>): ComponentScope<C, T, U>;
}

export interface ComponentScopeClass {
  new<C extends Component, T, U>(component: C, scopeName: string, descriptor?: ComponentScopeDescriptor<C, T, U>): ComponentScope<C, T, U>;

  <C extends Component, TC extends ComponentScopeTypeConstructor>(
      valueType: TC, descriptor?: ComponentScopeDescriptorType<C, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Any: typeof AnyComponentScope; // defined by AnyComponentScope
  /** @hidden */
  Object: typeof ObjectComponentScope; // defined by ObjectComponentScope
  /** @hidden */
  String: typeof StringComponentScope; // defined by StringComponentScope
  /** @hidden */
  Boolean: typeof BooleanComponentScope; // defined by BooleanComponentScope
  /** @hidden */
  Number: typeof NumberComponentScope; // defined by NumberComponentScope
}

export interface ComponentScope<C extends Component, T, U = T> {
  (): T | undefined;
  (state: T | U | undefined): C;

  /** @hidden */
  _component: C;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superScope?: ComponentScope<Component, T, U>;
  /** @hidden */
  _subScopes?: ComponentScope<Component, T, U>[];
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _state: T | undefined;

  updateFlags?: ComponentFlags;

  readonly component: C;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superScope: ComponentScope<Component, T, U> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ComponentScope<Component, T, U>): void;

  /** @hidden */
  removeSubScope(subScope: ComponentScope<Component, T, U>): void;

  readonly superState: T | undefined;

  readonly ownState: T | undefined;

  readonly state: T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getState(): T;

  getStateOr<C>(elseState: C): T | C;

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

export const ComponentScope: ComponentScopeClass = (function (_super: typeof Object): ComponentScopeClass {
  function ComponentScopeDecoratorFactory<C extends Component, TC extends ComponentScopeTypeConstructor>(
      valueType: TC, descriptor?: ComponentScopeDescriptorType<C, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ComponentScopeDescriptorType<C, TC>;
    }
    let scopeType = descriptor.scopeType;
    if (scopeType === void 0) {
      if (valueType === String) {
        scopeType = ComponentScope.String;
      } else if (valueType === Boolean) {
        scopeType = ComponentScope.Boolean;
      } else if (valueType === Number) {
        scopeType = ComponentScope.Number;
      } else if (FromAny.is(valueType)) {
        scopeType = ComponentScope.Any.bind(void 0, valueType);
      } else {
        scopeType = ComponentScope.Object;
      }
      descriptor.scopeType = scopeType;
    }
    return Component.decorateComponentScope.bind(void 0, scopeType, descriptor);
  }

  function ComponentScopeConstructor<C extends Component, T, U = T>(
      this: ComponentScope<C, T, U>, component: C, scopeName: string,
      descriptor?: ComponentScopeDescriptor<C, T, U>): ComponentScope<C, T, U> {
    this._component = component;
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

  const ComponentScope: ComponentScopeClass = function <C extends Component, T, U>(
      this: ComponentScope<C, T, U> | ComponentScopeClass,
      component?: C | ComponentScopeTypeConstructor,
      scopeName?: string | ComponentScopeDescriptor<C, T, U>,
      descriptor?: ComponentScopeDescriptor<C, T, U>): ComponentScope<C, T> | PropertyDecorator | void {
    if (this instanceof ComponentScope) { // constructor
      return ComponentScopeConstructor.call(this, component as C, scopeName as string, descriptor);
    } else { // decorator factory
      const valueType = component as ComponentScopeTypeConstructor;
      descriptor = scopeName as ComponentScopeDescriptor<C, T, U> | undefined;
      return ComponentScopeDecoratorFactory(valueType, descriptor);
    }
  } as ComponentScopeClass;
  __extends(ComponentScope, _super);

  Object.defineProperty(ComponentScope.prototype, "component", {
    get: function <C extends Component>(this: ComponentScope<C, unknown>): C {
      return this._component;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ComponentScope.prototype, "inherit", {
    get: function (this: ComponentScope<Component, unknown>): string | undefined {
      return this._inherit;
    },
    enumerable: true,
    configurable: true,
  });

  ComponentScope.prototype.setInherit = function (this: ComponentScope<Component, unknown>,
                                                  inherit: string | undefined): void {
    this.unbindSuperScope();
    if (inherit !== void 0) {
      this._inherit = inherit;
      this.bindSuperScope();
    } else if (this._inherit !== void 0) {
      this._inherit = void 0;
    }
  };

  Object.defineProperty(ComponentScope.prototype, "superScope", {
    get: function <T, U>(this: ComponentScope<Component, T, U>): ComponentScope<Component, T, U> | null {
      let superScope: ComponentScope<Component, T, U> | null | undefined = this._superScope;
      if (superScope === void 0) {
        superScope = null;
        let component = this._component;
        if (!component.isMounted()) {
          const inherit = this._inherit;
          if (inherit !== void 0) {
            do {
              const parentComponent = component.parentComponent;
              if (parentComponent !== null) {
                component = parentComponent;
                const scope = component.getLazyComponentScope(inherit);
                if (scope === null) {
                  continue;
                } else {
                  superScope = scope as ComponentScope<Component, T, U>;
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

  ComponentScope.prototype.bindSuperScope = function (this: ComponentScope<Component, unknown>): void {
    let component = this._component;
    if (component.isMounted()) {
      const inherit = this._inherit;
      if (inherit !== void 0) {
        do {
          const parentComponent = component.parentComponent;
          if (parentComponent !== null) {
            component = parentComponent;
            const scope = component.getLazyComponentScope(inherit);
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

  ComponentScope.prototype.unbindSuperScope = function (this: ComponentScope<Component, unknown>): void {
    const superScope = this._superScope;
    if (superScope !== void 0) {
      superScope.removeSubScope(this);
      this._superScope = void 0;
    }
  };

  ComponentScope.prototype.addSubScope = function <T, U>(this: ComponentScope<Component, T, U>,
                                                         subScope: ComponentScope<Component, T, U>): void {
    let subScopes = this._subScopes;
    if (subScopes === void 0) {
      subScopes = [];
      this._subScopes = subScopes;
    }
    subScopes.push(subScope);
  }

  ComponentScope.prototype.removeSubScope = function <T, U>(this: ComponentScope<Component, T, U>,
                                                            subScope: ComponentScope<Component, T, U>): void {
    const subScopes = this._subScopes;
    if (subScopes !== void 0) {
      const index = subScopes.indexOf(subScope);
      if (index >= 0) {
        subScopes.splice(index, 1);
      }
    }
  };

  Object.defineProperty(ComponentScope.prototype, "superState", {
    get: function <T>(this: ComponentScope<Component, T>): T | undefined {
      const superScope = this.superScope;
      return superScope !== null ? superScope.state : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ComponentScope.prototype, "ownState", {
    get: function <T>(this: ComponentScope<Component, T>): T | undefined {
      return this._state;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ComponentScope.prototype, "state", {
    get: function <T>(this: ComponentScope<Component, T>): T | undefined {
      const state = this._state;
      return state !== void 0 ? state : this.superState;
    },
    enumerable: true,
    configurable: true,
  });

  ComponentScope.prototype.isAuto = function (this: ComponentScope<Component, unknown>): boolean {
    return this._auto;
  };

  ComponentScope.prototype.setAuto = function (this: ComponentScope<Component, unknown>,
                                               auto: boolean): void {
    if (this._auto !== auto) {
      this._auto = auto;
      this._component.componentScopeDidSetAuto(this, auto);
    }
  };

  ComponentScope.prototype.getState = function <T, U>(this: ComponentScope<Component, T, U>): T {
    const state = this.state;
    if (state === void 0) {
      throw new TypeError("undefined " + this.name + " state");
    }
    return state;
  };

  ComponentScope.prototype.getStateOr = function <T, U, C>(this: ComponentScope<Component, T, U>,
                                                           elseState: C): T | C {
    let state: T | C | undefined = this.state;
    if (state === void 0) {
      state = elseState;
    }
    return state;
  };

  ComponentScope.prototype.setState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                     state: T | U | undefined): void {
    this._auto = false;
    this.setOwnState(state);
  };

  ComponentScope.prototype.willSetState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                          newState: T | undefined,
                                                          oldState: T | undefined): void {
    // hook
  }

  ComponentScope.prototype.didSetState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                         newState: T | undefined,
                                                         oldState: T | undefined): void {
    // hook
  }

  ComponentScope.prototype.setAutoState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                         state: T | U | undefined): void {
    if (this._auto === true) {
      this.setOwnState(state);
    }
  };

  ComponentScope.prototype.setOwnState = function <T, U>(this: ComponentScope<Component, T, U>,
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

  ComponentScope.prototype.setBaseState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                          state: T | U | undefined): void {
    let superScope: ComponentScope<Component, T, U> | null | undefined;
    if (this._state === void 0 && (superScope = this.superScope, superScope !== null)) {
      superScope.setBaseState(state);
    } else {
      this.setState(state);
    }
  };

  ComponentScope.prototype.update = function <T, U>(this: ComponentScope<Component, T, U>,
                                                    newState: T | undefined,
                                                    oldState: T | undefined): void {
    this.willUpdate(newState, oldState);
    this._state = newState;
    this.onUpdate(newState, oldState);
    this.cascadeUpdate(newState, oldState);
    this.didUpdate(newState, oldState);
  };

  ComponentScope.prototype.willUpdate = function <T, U>(this: ComponentScope<Component, T, U>,
                                                        newState: T | undefined,
                                                        oldState: T | undefined): void {
    // hook
  };

  ComponentScope.prototype.onUpdate = function <T, U>(this: ComponentScope<Component, T, U>,
                                                      newState: T | undefined,
                                                      oldState: T | undefined): void {
    const updateFlags = this.updateFlags;
    if (updateFlags !== void 0) {
      this._component.requireUpdate(updateFlags);
    }
  };

  ComponentScope.prototype.didUpdate = function <T, U>(this: ComponentScope<Component, T, U>,
                                                       newState: T | undefined,
                                                       oldState: T | undefined): void {
    this._component.componentScopeDidSetState(this, newState, oldState);
  };

  ComponentScope.prototype.cascadeUpdate = function <T, U>(this: ComponentScope<Component, T, U>,
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

  ComponentScope.prototype.mount = function (this: ComponentScope<Component, unknown>): void {
    this.bindSuperScope();
  };

  ComponentScope.prototype.unmount = function (this: ComponentScope<Component, unknown>): void {
    this.unbindSuperScope();
  };

  ComponentScope.prototype.fromAny = function <T, U>(this: ComponentScope<Component, T, U>,
                                                     value: T | U): T | undefined {
    throw new Error(); // abstract
  };

  return ComponentScope;
}(Object));
Component.Scope = ComponentScope;
