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
import {Values, FromAny} from "@swim/util";
import {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewFlags, View} from "../View";
import type {StringViewScope} from "./StringViewScope";
import type {BooleanViewScope} from "./BooleanViewScope";
import type {NumberViewScope} from "./NumberViewScope";

export type ViewScopeMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, infer T, any>} ? T : unknown;

export type ViewScopeMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewScope<any, infer T, infer U>} ? T | U : unknown;

export type ViewScopeFlags = number;

export interface ViewScopeInit<T, U = never> {
  extends?: ViewScopeClass;
  type?: unknown;
  state?: T | U;
  inherit?: string | boolean;

  updateFlags?: ViewFlags;
  willUpdate?(newState: T, oldState: T): void;
  onUpdate?(newState: T, oldState: T): void;
  didUpdate?(newState: T, oldState: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type ViewScopeDescriptor<V extends View, T, U = never, I = {}> = ViewScopeInit<T, U> & ThisType<ViewScope<V, T, U> & I> & I;

export type ViewScopeDescriptorExtends<V extends View, T, U = never, I = {}> = {extends: ViewScopeClass | undefined} & ViewScopeDescriptor<V, T, U, I>;

export type ViewScopeDescriptorFromAny<V extends View, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ViewScopeDescriptor<V, T, U, I>;

export interface ViewScopeConstructor<V extends View, T, U = never, I = {}> {
  new(owner: V, scopeName: string | undefined): ViewScope<V, T, U> & I;
  prototype: ViewScope<any, any, any> & I;
}

export interface ViewScopeClass extends Function {
  readonly prototype: ViewScope<any, any, any>;
}

export declare abstract class ViewScope<V extends View, T, U = never> {
  /** @hidden */
  _owner: V;
  /** @hidden */
  _inherit: string | boolean;
  /** @hidden */
  _scopeFlags: ViewScopeFlags;
  /** @hidden */
  _superScope?: ViewScope<View, T>;
  /** @hidden */
  _subScopes?: ViewScope<View, T>[];
  /** @hidden */
  _state: T;

  constructor(owner: V, scopeName: string | undefined);

  get name(): string;

  get owner(): V;

  get inherit(): string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  updateFlags?: ViewFlags;

  /** @hidden */
  get superName(): string | undefined;

  get superScope(): ViewScope<View, T> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ViewScope<View, T>): void;

  /** @hidden */
  removeSubScope(subScope: ViewScope<View, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

  isChanging(): boolean;

  get state(): T;

  get ownState(): T | undefined;

  get superState(): T | undefined;

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

  /** @hidden */
  onChange(): void;

  /** @hidden */
  updateInherited(): void;

  update(newState: T, oldState: T): void;

  willUpdate(newState: T, oldState: T): void;

  onUpdate(newState: T, oldState: T): void;

  didUpdate(newState: T, oldState: T): void;

  /** @hidden */
  updateSubScopes(newState: T, oldState: T): void;

  /** @hidden */
  onIdle(): void;

  /** @hidden */
  change(): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;

  /** @hidden */
  static getClass(type: unknown): ViewScopeClass | null;

  static define<V extends View, T, U = never, I = {}>(descriptor: ViewScopeDescriptorExtends<V, T, U, I>): ViewScopeConstructor<V, T, U, I>;
  static define<V extends View, T, U = never>(descriptor: ViewScopeDescriptor<V, T, U>): ViewScopeConstructor<V, T, U>;

  /** @hidden */
  static UpdatedFlag: ViewScopeFlags;
  /** @hidden */
  static ChangingFlag: ViewScopeFlags;
  /** @hidden */
  static OverrideFlag: ViewScopeFlags;
  /** @hidden */
  static InheritedFlag: ViewScopeFlags;

  // Forward type declarations
  /** @hidden */
  static String: typeof StringViewScope; // defined by StringViewScope
  /** @hidden */
  static Boolean: typeof BooleanViewScope; // defined by BooleanViewScope
  /** @hidden */
  static Number: typeof NumberViewScope; // defined by NumberViewScope
}

export interface ViewScope<V extends View, T, U = never> {
  (): T;
  (state: T | U): V;
}

export function ViewScope<V extends View, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
export function ViewScope<V extends View, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
export function ViewScope<V extends View, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
export function ViewScope<V extends View, T, U = never>(descriptor: ViewScopeDescriptorFromAny<V, T, U>): PropertyDecorator;
export function ViewScope<V extends View, T, U = never, I = {}>(descriptor: ViewScopeDescriptorExtends<V, T, U, I>): PropertyDecorator;
export function ViewScope<V extends View, T, U = never>(descriptor: ViewScopeDescriptor<V, T, U>): PropertyDecorator;

export function ViewScope<V extends View, T, U>(
    this: ViewScope<V, T, U> | typeof ViewScope,
    owner: V | ViewScopeDescriptor<V, T, U>,
    scopeName?: string,
  ): ViewScope<V, T, U> | PropertyDecorator {
  if (this instanceof ViewScope) { // constructor
    return ViewScopeConstructor.call(this as ViewScope<View, unknown, unknown>, owner as V, scopeName);
  } else { // decorator factory
    return ViewScopeDecoratorFactory(owner as ViewScopeDescriptor<V, T, U>);
  }
}
__extends(ViewScope, Object);
View.Scope = ViewScope;

function ViewScopeConstructor<V extends View, T, U>(this: ViewScope<V, T, U>, owner: V, scopeName: string | undefined): ViewScope<V, T, U> {
  if (scopeName !== void 0) {
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._scopeFlags = ViewScope.UpdatedFlag;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      this._state = this.fromAny(initState);
    }
  } else if (this._inherit !== false) {
    this._scopeFlags |= ViewScope.InheritedFlag;
  }
  return this;
}

function ViewScopeDecoratorFactory<V extends View, T, U>(descriptor: ViewScopeDescriptor<V, T, U>): PropertyDecorator {
  return View.decorateViewScope.bind(View, ViewScope.define(descriptor as ViewScopeDescriptor<View, unknown>));
}

Object.defineProperty(ViewScope.prototype, "owner", {
  get: function <V extends View>(this: ViewScope<V, unknown>): V {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "inherit", {
  get: function (this: ViewScope<View, unknown>): string | boolean {
    return this._inherit;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.setInherit = function (this: ViewScope<View, unknown>,
                                           inherit: string | boolean): void {
  if (this._inherit !== inherit) {
    this.unbindSuperScope();
    if (inherit !== false) {
      this._inherit = inherit;
      this.bindSuperScope();
      if ((this._scopeFlags & ViewScope.OverrideFlag) === 0) {
        this._scopeFlags |= ViewScope.UpdatedFlag | ViewScope.InheritedFlag;
        this.change();
      }
    } else if (this._inherit !== false) {
      this._inherit = false;
      this._scopeFlags &= ~ViewScope.InheritedFlag;
    }
  }
};

ViewScope.prototype.isInherited = function (this: ViewScope<View, unknown>): boolean {
  return (this._scopeFlags & ViewScope.InheritedFlag) !== 0;
};

ViewScope.prototype.setInherited = function (this: ViewScope<View, unknown>,
                                             inherited: boolean): void {
  if (inherited && (this._scopeFlags & ViewScope.InheritedFlag) === 0) {
    this._scopeFlags |= ViewScope.InheritedFlag;
    this.change();
  } else if (!inherited && (this._scopeFlags & ViewScope.InheritedFlag) !== 0) {
    this._scopeFlags &= ~ViewScope.InheritedFlag;
    this.change();
  }
};

Object.defineProperty(ViewScope.prototype, "superName", {
  get: function (this: ViewScope<View, unknown>): string | undefined {
    const inherit = this._inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "superScope", {
  get: function (this: ViewScope<View, unknown>): ViewScope<View, unknown> | null {
    let superScope: ViewScope<View, unknown> | null | undefined = this._superScope;
    if (superScope === void 0) {
      superScope = null;
      let view = this._owner;
      if (!view.isMounted()) {
        const superName = this.superName;
        if (superName !== void 0) {
          do {
            const parentView = view.parentView;
            if (parentView !== null) {
              view = parentView;
              const scope = view.getLazyViewScope(superName);
              if (scope !== null) {
                superScope = scope;
              } else {
                continue;
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
  let view = this._owner;
  if (view.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const superScope = view.getLazyViewScope(superName);
          if (superScope !== null) {
            this._superScope = superScope;
            superScope.addSubScope(this);
            if (this.isInherited()) {
              this._state = superScope._state;
              this._scopeFlags |= ViewScope.UpdatedFlag;
              this.change();
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

ViewScope.prototype.unbindSuperScope = function (this: ViewScope<View, unknown>): void {
  const superScope = this._superScope;
  if (superScope !== void 0) {
    superScope.removeSubScope(this);
    this._superScope = void 0;
  }
};

ViewScope.prototype.addSubScope = function <T>(this: ViewScope<View, T>,
                                               subScope: ViewScope<View, T>): void {
  let subScopes = this._subScopes;
  if (subScopes === void 0) {
    subScopes = [];
    this._subScopes = subScopes;
  }
  subScopes.push(subScope);
};

ViewScope.prototype.removeSubScope = function <T>(this: ViewScope<View, T>,
                                                  subScope: ViewScope<View, T>): void {
  const subScopes = this._subScopes;
  if (subScopes !== void 0) {
    const index = subScopes.indexOf(subScope);
    if (index >= 0) {
      subScopes.splice(index, 1);
    }
  }
};

ViewScope.prototype.isAuto = function (this: ViewScope<View, unknown>): boolean {
  return (this._scopeFlags & ViewScope.OverrideFlag) === 0;
};

ViewScope.prototype.setAuto = function (this: ViewScope<View, unknown>,
                                        auto: boolean): void {
  if (auto && (this._scopeFlags & ViewScope.OverrideFlag) !== 0) {
    this._scopeFlags &= ~ViewScope.OverrideFlag;
  } else if (!auto && (this._scopeFlags & ViewScope.OverrideFlag) === 0) {
    this._scopeFlags |= ViewScope.OverrideFlag;
  }
};

ViewScope.prototype.isUpdated = function (this: ViewScope<View, unknown>): boolean {
  return (this._scopeFlags & ViewScope.UpdatedFlag) !== 0;
};

ViewScope.prototype.isChanging = function (this: ViewScope<View, unknown>): boolean {
  return (this._scopeFlags & ViewScope.ChangingFlag) !== 0;
};

Object.defineProperty(ViewScope.prototype, "state", {
  get: function <T>(this: ViewScope<View, T>): T {
    return this._state;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "ownState", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewScope.prototype, "superState", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    const superScope = this.superScope;
    return superScope !== null ? superScope.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.getState = function <T, U>(this: ViewScope<View, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ViewScope.prototype.getStateOr = function <T, U, E>(this: ViewScope<View, T, U>,
                                                    elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ViewScope.prototype.setState = function <T, U>(this: ViewScope<View, T, U>,
                                               state: T | U): void {
  this._scopeFlags |= ViewScope.OverrideFlag;
  this.setOwnState(state);
};

ViewScope.prototype.willSetState = function <T>(this: ViewScope<View, T>,
                                                newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.onSetState = function <T>(this: ViewScope<View, T>,
                                              newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.didSetState = function <T>(this: ViewScope<View, T>,
                                               newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.setAutoState = function <T, U>(this: ViewScope<View, T, U>,
                                                   state: T | U): void {
  if ((this._scopeFlags & ViewScope.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ViewScope.prototype.setOwnState = function <T, U>(this: ViewScope<View, T, U>,
                                                  newState: T | U): void {
  const oldState = this._state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  this._scopeFlags &= ~ViewScope.InheritedFlag;
  if (!Values.equal(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    this._state = newState as T;
    this._scopeFlags |= ViewScope.ChangingFlag | ViewScope.UpdatedFlag;
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubScopes(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ViewScope.prototype.setBaseState = function <T, U>(this: ViewScope<View, T, U>,
                                                   state: T | U): void {
  let superScope: ViewScope<View, T> | null | undefined;
  if (this.isInherited() && (superScope = this.superScope, superScope !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superScope.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

ViewScope.prototype.onChange = function (this: ViewScope<View, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  } else {
    this.onIdle();
  }
};

ViewScope.prototype.updateInherited = function <T>(this: ViewScope<View, T>): void {
  const superScope = this._superScope;
  if (superScope !== void 0 && this.isChanging()) {
    this.update(superScope.state, this.state);
  } else {
    this.onIdle();
  }
};

ViewScope.prototype.update = function <T>(this: ViewScope<View, T>,
                                          newState: T, oldState: T): void {
  if (!Values.equal(oldState, newState)) {
    this.willUpdate(newState, oldState);
    this._state = newState;
    this._scopeFlags |= ViewScope.ChangingFlag | ViewScope.UpdatedFlag;
    this.onUpdate(newState, oldState);
    this.updateSubScopes(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ViewScope.prototype.willUpdate = function <T>(this: ViewScope<View, T>,
                                              newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.onUpdate = function <T>(this: ViewScope<View, T>,
                                            newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this._owner.requireUpdate(updateFlags);
  }
};

ViewScope.prototype.didUpdate = function <T>(this: ViewScope<View, T>,
                                             newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.updateSubScopes = function <T>(this: ViewScope<View, T>,
                                                   newState: T, oldState: T): void {
  const subScopes = this._subScopes;
  if (subScopes !== void 0) {
    for (let i = 0, n = subScopes.length; i < n; i += 1) {
      const subScope = subScopes[i]!;
      if (subScope.isInherited()) {
        subScope.change();
      }
    }
  }
};

ViewScope.prototype.onIdle = function (this: ViewScope<View, unknown>): void {
  if ((this._scopeFlags & ViewScope.UpdatedFlag) !== 0) {
    this._scopeFlags &= ~ViewScope.UpdatedFlag;
  } else {
    this._scopeFlags &= ~ViewScope.ChangingFlag;
  }
};

ViewScope.prototype.change = function (this: ViewScope<View, unknown>): void {
  this._scopeFlags |= ViewScope.ChangingFlag;
  this._owner.requireUpdate(View.NeedsChange);
};

ViewScope.prototype.mount = function (this: ViewScope<View, unknown>): void {
  this.bindSuperScope();
};

ViewScope.prototype.unmount = function (this: ViewScope<View, unknown>): void {
  this.unbindSuperScope();
};

ViewScope.prototype.fromAny = function <T, U>(this: ViewScope<View, T, U>, value: T | U): T {
  return value as T;
};

ViewScope.getClass = function (type: unknown): ViewScopeClass | null {
  if (type === String) {
    return ViewScope.String;
  } else if (type === Boolean) {
    return ViewScope.Boolean;
  } else if (type === Number) {
    return ViewScope.Number;
  }
  return null;
};

ViewScope.define = function <V extends View, T, U, I>(descriptor: ViewScopeDescriptor<V, T, U, I>): ViewScopeConstructor<V, T, U, I> {
  let _super: ViewScopeClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ViewScope.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ViewScope;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function ViewScopeAccessor(this: ViewScope<V, T, U>, owner: V, scopeName: string | undefined): ViewScope<V, T, U> {
    let _this: ViewScope<V, T, U> = function accessor(state?: T | U): T | V {
      if (arguments.length === 0) {
        return _this._state;
      } else {
        _this.setState(state!);
        return _this._owner;
      }
    } as ViewScope<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, scopeName) || _this;
    return _this;
  } as unknown as ViewScopeConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as ViewScope<V, T, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (state !== void 0 && initState === void 0) {
    _prototype.initState = function (): T | U {
      return state;
    };
  }
  _prototype._inherit = inherit !== void 0 ? inherit : false;

  return _constructor;
};

ViewScope.UpdatedFlag = 1 << 0;
ViewScope.ChangingFlag = 1 << 1;
ViewScope.OverrideFlag = 1 << 2;
ViewScope.InheritedFlag = 1 << 3;

ViewScope({extends: void 0, type: MoodVector, inherit: true})(View.prototype, "mood");
ViewScope({extends: void 0, type: ThemeMatrix, inherit: true})(View.prototype, "theme");
