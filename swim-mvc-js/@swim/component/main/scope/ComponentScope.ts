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
import {Equals, FromAny} from "@swim/util";
import {ComponentFlags, Component} from "../Component";
import {StringComponentScope} from "../"; // forward import
import {BooleanComponentScope} from "../"; // forward import
import {NumberComponentScope} from "../"; // forward import

export type ComponentScopeMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, infer T, any>} ? T : unknown;

export type ComponentScopeMemberInit<C, K extends keyof C> =
  C extends {[P in K]: ComponentScope<any, infer T, infer U>} ? T | U : unknown;

export type ComponentScopeFlags = number;

export interface ComponentScopeInit<T, U = never> {
  extends?: ComponentScopeClass;
  type?: unknown;
  state?: T | U;
  inherit?: string | boolean;

  updateFlags?: ComponentFlags;
  willUpdate?(newState: T, oldState: T): void;
  onUpdate?(newState: T, oldState: T): void;
  didUpdate?(newState: T, oldState: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type ComponentScopeDescriptor<C extends Component, T, U = never, I = {}> = ComponentScopeInit<T, U> & ThisType<ComponentScope<C, T, U> & I> & I;

export type ComponentScopeDescriptorExtends<C extends Component, T, U = never, I = {}> = {extends: ComponentScopeClass | undefined} & ComponentScopeDescriptor<C, T, U, I>;

export type ComponentScopeDescriptorFromAny<C extends Component, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ComponentScopeDescriptor<C, T, U, I>;

export interface ComponentScopeConstructor<C extends Component, T, U = never, I = {}> {
  new(owner: C, scopeName: string | undefined): ComponentScope<C, T, U> & I;
  prototype: ComponentScope<any, any> & I;
}

export interface ComponentScopeClass extends Function {
  readonly prototype: ComponentScope<any, any>;
}

export interface ComponentScope<C extends Component, T, U = never> {
  (): T;
  (state: T | U): C;

  readonly name: string;

  readonly owner: C;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  scopeFlags: ComponentScopeFlags;

  /** @hidden */
  setScopeFlags(scopeFlags: ComponentScopeFlags): void;

  updateFlags?: ComponentFlags;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superScope: ComponentScope<Component, T> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  readonly subScopes: ComponentScope<Component, T>[] | null;

  /** @hidden */
  addSubScope(subScope: ComponentScope<Component, T>): void;

  /** @hidden */
  removeSubScope(subScope: ComponentScope<Component, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

  isRevising(): boolean;

  readonly state: T;

  readonly ownState: T | undefined;

  readonly superState: T | undefined;

  getState(): T extends undefined ? never : T;

  getStateOr<E>(elseState: E): (T extends undefined ? never : T) | E;

  setState(state: T | U): void;

  /** @hidden */
  willSetState(newState: T, oldState: T): void;

  /** @hidden */
  onSetState(newState: T, oldState: T): void;

  /** @hidden */
  didSetState(newState: T, oldState: T): void;

  setAutoState(state: T | U): void;

  setOwnState(state: T | U): void;

  setBaseState(state: T | U): void;

  readonly updatedState: T | undefined;

  takeUpdatedState(): T | undefined;

  takeState(): T;

  /** @hidden */
  onRevise(): void;

  /** @hidden */
  updateInherited(): void;

  update(newState: T, oldState: T): void;

  willUpdate(newState: T, oldState: T): void;

  onUpdate(newState: T, oldState: T): void;

  didUpdate(newState: T, oldState: T): void;

  /** @hidden */
  updateSubScopes(newState: T, oldState: T): void;

  /** @hidden */
  revise(): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;
}

export const ComponentScope = function <C extends Component, T, U>(
    this: ComponentScope<C, T, U> | typeof ComponentScope,
    owner: C | ComponentScopeDescriptor<C, T, U>,
    scopeName?: string,
  ): ComponentScope<C, T, U> | PropertyDecorator {
  if (this instanceof ComponentScope) { // constructor
    return ComponentScopeConstructor.call(this as ComponentScope<Component, unknown, unknown>, owner as C, scopeName);
  } else { // decorator factory
    return ComponentScopeDecoratorFactory(owner as ComponentScopeDescriptor<C, T, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, T, U = never>(owner: C, scopeName: string | undefined): ComponentScope<C, T, U>;

  <C extends Component, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ComponentScopeDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ComponentScopeDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ComponentScopeDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T, U = never>(descriptor: ComponentScopeDescriptorFromAny<C, T, U>): PropertyDecorator;
  <C extends Component, T, U = never, I = {}>(descriptor: ComponentScopeDescriptorExtends<C, T, U, I>): PropertyDecorator;
  <C extends Component, T, U = never>(descriptor: ComponentScopeDescriptor<C, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentScope<any, any>;

  /** @hidden */
  getConstructor(type: unknown): ComponentScopeClass | null;

  define<C extends Component, T, U = never, I = {}>(descriptor: ComponentScopeDescriptorExtends<C, T, U, I>): ComponentScopeConstructor<C, T, U, I>;
  define<C extends Component, T, U = never>(descriptor: ComponentScopeDescriptor<C, T, U>): ComponentScopeConstructor<C, T, U>;

  /** @hidden */
  UpdatedFlag: ComponentScopeFlags;
  /** @hidden */
  OverrideFlag: ComponentScopeFlags;
  /** @hidden */
  InheritedFlag: ComponentScopeFlags;
};
__extends(ComponentScope, Object);

function ComponentScopeConstructor<C extends Component, T, U>(this: ComponentScope<C, T, U>, owner: C, scopeName: string | undefined): ComponentScope<C, T, U> {
  if (scopeName !== void 0) {
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(this, "inherit", {
    value: this.inherit ?? false, // seed from prototype
    enumerable: true,
    configurable: true,
  });
  let scopeFlags = ComponentScope.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      state = this.fromAny(initState);
    }
  } else if (this.inherit !== false) {
    scopeFlags |= ComponentScope.InheritedFlag;
  }
  Object.defineProperty(this, "scopeFlags", {
    value: scopeFlags,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "superScope", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "subScopes", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "state", {
    value: state,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentScopeDecoratorFactory<C extends Component, T, U>(descriptor: ComponentScopeDescriptor<C, T, U>): PropertyDecorator {
  return Component.decorateComponentScope.bind(Component, ComponentScope.define(descriptor as ComponentScopeDescriptor<Component, unknown>));
}

ComponentScope.prototype.setInherit = function (this: ComponentScope<Component, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperScope();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperScope();
      if ((this.scopeFlags & ComponentScope.OverrideFlag) === 0) {
        this.setScopeFlags(this.scopeFlags | (ComponentScope.UpdatedFlag | ComponentScope.InheritedFlag));
        this.revise();
      }
    } else if (this.inherit !== false) {
      this.setScopeFlags(this.scopeFlags & ~ComponentScope.InheritedFlag);
    }
  }
};

ComponentScope.prototype.isInherited = function (this: ComponentScope<Component, unknown>): boolean {
  return (this.scopeFlags & ComponentScope.InheritedFlag) !== 0;
};

ComponentScope.prototype.setInherited = function (this: ComponentScope<Component, unknown>,
                                                  inherited: boolean): void {
  if (inherited && (this.scopeFlags & ComponentScope.InheritedFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ComponentScope.InheritedFlag);
    this.revise();
  } else if (!inherited && (this.scopeFlags & ComponentScope.InheritedFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ComponentScope.InheritedFlag);
    this.revise();
  }
};

ComponentScope.prototype.setScopeFlags = function (this: ComponentScope<Component, unknown>, scopeFlags: ComponentScopeFlags): void {
  Object.defineProperty(this, "scopeFlags", {
    value: scopeFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ComponentScope.prototype, "superName", {
  get: function (this: ComponentScope<Component, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ComponentScope.prototype.bindSuperScope = function (this: ComponentScope<Component, unknown>): void {
  let component = this.owner;
  if (component.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentComponent = component.parentComponent;
        if (parentComponent !== null) {
          component = parentComponent;
          const superScope = component.getLazyComponentScope(superName);
          if (superScope !== null) {
            Object.defineProperty(this, "superScope", {
              value: superScope,
              enumerable: true,
              configurable: true,
            });
            superScope.addSubScope(this);
            if (this.isInherited()) {
              Object.defineProperty(this, "state", {
                value: superScope.state,
                enumerable: true,
                configurable: true,
              });
              this.setScopeFlags(this.scopeFlags | ComponentScope.UpdatedFlag);
              this.revise();
            }
          } else {
            continue;
          }
        }
        break;
      } while (true);
    }
  }
};

ComponentScope.prototype.unbindSuperScope = function (this: ComponentScope<Component, unknown>): void {
  const superScope = this.superScope;
  if (superScope !== null) {
    superScope.removeSubScope(this);
    Object.defineProperty(this, "superScope", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }
};

ComponentScope.prototype.addSubScope = function <T>(this: ComponentScope<Component, T>, subScope: ComponentScope<Component, T>): void {
  let subScopes = this.subScopes;
  if (subScopes === null) {
    subScopes = [];
    Object.defineProperty(this, "subScopes", {
      value: subScopes,
      enumerable: true,
      configurable: true,
    });
  }
  subScopes.push(subScope);
};

ComponentScope.prototype.removeSubScope = function <T>(this: ComponentScope<Component, T>, subScope: ComponentScope<Component, T>): void {
  const subScopes = this.subScopes;
  if (subScopes !== null) {
    const index = subScopes.indexOf(subScope);
    if (index >= 0) {
      subScopes.splice(index, 1);
    }
  }
};

ComponentScope.prototype.isAuto = function (this: ComponentScope<Component, unknown>): boolean {
  return (this.scopeFlags & ComponentScope.OverrideFlag) === 0;
};

ComponentScope.prototype.setAuto = function (this: ComponentScope<Component, unknown>,
                                             auto: boolean): void {
  if (auto && (this.scopeFlags & ComponentScope.OverrideFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ComponentScope.OverrideFlag);
  } else if (!auto && (this.scopeFlags & ComponentScope.OverrideFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ComponentScope.OverrideFlag);
  }
};

ComponentScope.prototype.isUpdated = function (this: ComponentScope<Component, unknown>): boolean {
  return (this.scopeFlags & ComponentScope.UpdatedFlag) !== 0;
};

Object.defineProperty(ComponentScope.prototype, "ownState", {
  get: function <T>(this: ComponentScope<Component, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentScope.prototype, "superState", {
  get: function <T>(this: ComponentScope<Component, T>): T | undefined {
    const superScope = this.superScope;
    return superScope !== null ? superScope.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ComponentScope.prototype.getState = function <T, U>(this: ComponentScope<Component, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ComponentScope.prototype.getStateOr = function <T, U, E>(this: ComponentScope<Component, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ComponentScope.prototype.setState = function <T, U>(this: ComponentScope<Component, T, U>, state: T | U): void {
  this.setScopeFlags(this.scopeFlags | ComponentScope.OverrideFlag);
  this.setOwnState(state);
};

ComponentScope.prototype.willSetState = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentScope.prototype.onSetState = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentScope.prototype.didSetState = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentScope.prototype.setAutoState = function <T, U>(this: ComponentScope<Component, T, U>, state: T | U): void {
  if ((this.scopeFlags & ComponentScope.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ComponentScope.prototype.setOwnState = function <T, U>(this: ComponentScope<Component, T, U>, newState: T | U): void {
  const oldState = this.state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  this.setScopeFlags(this.scopeFlags & ~ComponentScope.InheritedFlag);
  if (!Equals(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    Object.defineProperty(this, "state", {
      value: newState as T,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ComponentScope.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubScopes(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ComponentScope.prototype.setBaseState = function <T, U>(this: ComponentScope<Component, T, U>, state: T | U): void {
  let superScope: ComponentScope<Component, T> | null | undefined;
  if (this.isInherited() && (superScope = this.superScope, superScope !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superScope.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ComponentScope.prototype, "updatedState", {
  get: function <T>(this: ComponentScope<Component, T>): T | undefined {
    if ((this.scopeFlags & ComponentScope.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ComponentScope.prototype.takeUpdatedState = function <T>(this: ComponentScope<Component, T>): T | undefined {
  const scopeFlags = this.scopeFlags;
  if ((scopeFlags & ComponentScope.UpdatedFlag) !== 0) {
    this.setScopeFlags(scopeFlags & ~ComponentScope.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ComponentScope.prototype.takeState = function <T>(this: ComponentScope<Component, T>): T {
  this.setScopeFlags(this.scopeFlags & ~ComponentScope.UpdatedFlag);
  return this.state;
}

ComponentScope.prototype.onRevise = function (this: ComponentScope<Component, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ComponentScope.prototype.updateInherited = function <T>(this: ComponentScope<Component, T>): void {
  const superScope = this.superScope;
  if (superScope !== null) {
    this.update(superScope.state, this.state);
  }
};

ComponentScope.prototype.update = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ComponentScope.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubScopes(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ComponentScope.prototype.willUpdate = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentScope.prototype.onUpdate = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ComponentScope.prototype.didUpdate = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentScope.prototype.updateSubScopes = function <T>(this: ComponentScope<Component, T>, newState: T, oldState: T): void {
  const subScopes = this.subScopes;
  for (let i = 0, n = subScopes !== null ? subScopes.length : 0; i < n; i += 1) {
    const subScope = subScopes![i]!;
    if (subScope.isInherited()) {
      subScope.revise();
    }
  }
};

ComponentScope.prototype.revise = function (this: ComponentScope<Component, unknown>): void {
  this.owner.requireUpdate(Component.NeedsRevise);
};

ComponentScope.prototype.mount = function (this: ComponentScope<Component, unknown>): void {
  this.bindSuperScope();
};

ComponentScope.prototype.unmount = function (this: ComponentScope<Component, unknown>): void {
  this.unbindSuperScope();
};

ComponentScope.prototype.fromAny = function <T, U>(this: ComponentScope<Component, T, U>, value: T | U): T {
  return value as T;
};

ComponentScope.getConstructor = function (type: unknown): ComponentScopeClass | null {
  if (type === String) {
    return StringComponentScope;
  } else if (type === Boolean) {
    return BooleanComponentScope;
  } else if (type === Number) {
    return NumberComponentScope;
  }
  return null;
};

ComponentScope.define = function <C extends Component, T, U, I>(descriptor: ComponentScopeDescriptor<C, T, U, I>): ComponentScopeConstructor<C, T, U, I> {
  let _super: ComponentScopeClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ComponentScope.getConstructor(descriptor.type);
  }
  if (_super === null) {
    _super = ComponentScope;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedComponentScope(this: ComponentScope<C, T, U>, owner: C, scopeName: string | undefined): ComponentScope<C, T, U> {
    let _this: ComponentScope<C, T, U> = function ComponentScopeAccessor(state?: T | U): T | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ComponentScope<C, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, scopeName) || _this;
    return _this;
  } as unknown as ComponentScopeConstructor<C, T, U, I>;

  const _prototype = descriptor as unknown as ComponentScope<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (state !== void 0 && initState === void 0) {
    _prototype.initState = function (): T | U {
      return state;
    };
  }
  Object.defineProperty(_prototype, "inherit", {
    value: inherit ?? false,
    enumerable: true,
    configurable: true,
  });

  return _constructor;
};

ComponentScope.UpdatedFlag = 1 << 0;
ComponentScope.OverrideFlag = 1 << 1;
ComponentScope.InheritedFlag = 1 << 2;
