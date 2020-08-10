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
import {ObjectComponentScope} from "./ObjectComponentScope";
import {StringComponentScope} from "./StringComponentScope";
import {BooleanComponentScope} from "./BooleanComponentScope";
import {NumberComponentScope} from "./NumberComponentScope";

export type ComponentScopeType<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, infer T, any>} ? T : unknown;

export type ComponentScopeInitType<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, infer T, infer U>} ? T | U : unknown;

export interface ComponentScopeInit<C extends Component, T, U = T> {
  type?: unknown;

  init?(): T | U | undefined;
  value?: T | U;
  inherit?: string | boolean;

  updateFlags?: ComponentFlags;
  fromAny?(value: T | U): T | undefined;

  extends?: ComponentScopePrototype<T, U>;
}

export type ComponentScopeDescriptor<C extends Component, T, U = T, I = {}> = ComponentScopeInit<C, T, U> & ThisType<ComponentScope<C, T, U> & I> & I;

export type ComponentScopePrototype<T, U = T> = Function & { prototype: ComponentScope<Component, T, U> };

export type ComponentScopeConstructor<T, U = T> = new <C extends Component>(component: C, scopeName: string | undefined) => ComponentScope<C, T, U>;

export declare abstract class ComponentScope<C extends Component, T, U = T> {
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

  constructor(component: C, scopeName: string | undefined);

  get name(): string;

  get component(): C;

  get inherit(): string | undefined;

  setInherit(inherit: string | undefined): void;

  get superScope(): ComponentScope<Component, T, U> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ComponentScope<Component, T, U>): void;

  /** @hidden */
  removeSubScope(subScope: ComponentScope<Component, T, U>): void;

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

  updateFlags?: ComponentFlags;

  /** @hidden */
  cascadeUpdate(newState: T | undefined, oldState: T | undefined): void;

  mount(): void;

  unmount(): void;

  abstract fromAny(value: T | U): T | undefined;

  /** @hidden */
  static constructorForType(type: unknown): ComponentScopePrototype<unknown> | null;

  // Forward type declarations
  /** @hidden */
  static Object: typeof ObjectComponentScope; // defined by ObjectComponentScope
  /** @hidden */
  static String: typeof StringComponentScope; // defined by StringComponentScope
  /** @hidden */
  static Boolean: typeof BooleanComponentScope; // defined by BooleanComponentScope
  /** @hidden */
  static Number: typeof NumberComponentScope; // defined by NumberComponentScope
}

export interface ComponentScope<C extends Component, T, U = T> {
  (): T | undefined;
  (value: T | U | undefined): C;
}

export function ComponentScope<C extends Component, T, U = T, I = {}>(descriptor: {extends: ComponentScopePrototype<T, U>} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;
export function ComponentScope<C extends Component, T extends Object = object, U extends Object = T, I = {}>(descriptor: {type: typeof Object} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;
export function ComponentScope<C extends Component, T extends string = string, U extends string = T, I = {}>(descriptor: {type: typeof String} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;
export function ComponentScope<C extends Component, T extends boolean = boolean, U extends boolean | string = T | string, I = {}>(descriptor: {type: typeof Boolean} & ComponentScopeDescriptor<C, T, U, I> ): PropertyDecorator;
export function ComponentScope<C extends Component, T extends number = number, U extends number | string = T | string, I = {}>(descriptor: {type: typeof Number} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;
export function ComponentScope<C extends Component, T, U = T, I = {}>(descriptor: {type: FromAny<T, U>} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;
export function ComponentScope<C extends Component, T, U = T, I = {}>(descriptor: {type: Function & { prototype: T }} & ComponentScopeDescriptor<C, T, U, I>): PropertyDecorator;

export function ComponentScope<C extends Component, T, U>(
    this: ComponentScope<C, T, U> | typeof ComponentScope,
    component: C | ComponentScopeInit<C, T, U>,
    scopeName?: string,
  ): ComponentScope<C, T, U> | PropertyDecorator {
  if (this instanceof ComponentScope) { // constructor
    return ComponentScopeConstructor.call(this, component as C, scopeName);
  } else { // decorator factory
    return ComponentScopeDecoratorFactory(component as ComponentScopeInit<C, T, U>);
  }
}
__extends(ComponentScope, Object);
Component.Scope = ComponentScope;

function ComponentScopeConstructor<C extends Component, T, U>(this: ComponentScope<C, T, U>, component: C, scopeName: string | undefined): ComponentScope<C, T, U> {
  if (scopeName !== void 0) {
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
  }
  this._component = component;
  this._auto = true;
  return this;
}

function ComponentScopeDecoratorFactory<C extends Component, T, U = T>(descriptor: ComponentScopeInit<C, T, U>): PropertyDecorator {
  const type = descriptor.type;
  const init = descriptor.init;
  const value = descriptor.value;
  const inherit = descriptor.inherit;
  delete descriptor.type;
  delete descriptor.init;
  delete descriptor.value;
  delete descriptor.inherit;

  let BaseComponentScope = descriptor.extends;
  delete descriptor.extends;
  if (BaseComponentScope === void 0) {
    BaseComponentScope = ComponentScope.constructorForType(type) as ComponentScopePrototype<T, U>;
  }
  if (BaseComponentScope === null) {
    if (FromAny.is<T, U>(type)) {
      BaseComponentScope = ComponentScope;
      if (!("fromAny" in descriptor)) {
        descriptor.fromAny = type.fromAny;
      }
    } else {
      BaseComponentScope = ComponentScope.Object;
    }
  }

  function DecoratedComponentScope(this: ComponentScope<C, T, U>, component: C, scopeName: string | undefined): ComponentScope<C, T, U> {
    let _this: ComponentScope<C, T, U> = function accessor(state?: T | U): T | undefined | C {
      if (arguments.length === 0) {
        return _this._state;
      } else {
        _this.setState(state);
        return _this._component;
      }
    } as ComponentScope<C, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseComponentScope!.call(_this, component, scopeName) || _this;
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
    Object.setPrototypeOf(DecoratedComponentScope, BaseComponentScope);
    DecoratedComponentScope.prototype = descriptor as ComponentScope<C, T, U>;
    DecoratedComponentScope.prototype.constructor = DecoratedComponentScope;
    Object.setPrototypeOf(DecoratedComponentScope.prototype, BaseComponentScope.prototype);
  } else {
    __extends(DecoratedComponentScope, BaseComponentScope);
  }

  return Component.decorateComponentScope.bind(void 0, DecoratedComponentScope);
}

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
};

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

ComponentScope.prototype.getStateOr = function <T, U, E>(this: ComponentScope<Component, T, U>,
                                                         elseState: E): T | E {
  let state: T | E | undefined = this.state;
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
};

ComponentScope.prototype.didSetState = function <T, U>(this: ComponentScope<Component, T, U>,
                                                       newState: T | undefined,
                                                       oldState: T | undefined): void {
  // hook
};

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

ComponentScope.constructorForType = function (type: unknown): ComponentScopePrototype<unknown> | null {
  if (type === String) {
    return ComponentScope.String;
  } else if (type === Boolean) {
    return ComponentScope.Boolean;
  } else if (type === Number) {
    return ComponentScope.Number;
  }
  return null;
};
