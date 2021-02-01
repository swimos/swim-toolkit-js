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
import {StringViewScope} from "../"; // forward import
import {BooleanViewScope} from "../"; // forward import
import {NumberViewScope} from "../"; // forward import

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
  prototype: ViewScope<any, any> & I;
}

export interface ViewScopeClass extends Function {
  readonly prototype: ViewScope<any, any>;
}

export interface ViewScope<V extends View, T, U = never> {
  (): T;
  (state: T | U): V;

  readonly name: string;

  readonly owner: V;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  scopeFlags: ViewScopeFlags;

  /** @hidden */
  setScopeFlags(scopeFlags: ViewScopeFlags): void;

  updateFlags?: ViewFlags;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superScope: ViewScope<View, T> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  readonly subScopes: ViewScope<View, T>[] | null;

  /** @hidden */
  addSubScope(subScope: ViewScope<View, T>): void;

  /** @hidden */
  removeSubScope(subScope: ViewScope<View, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

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
  change(): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;
}

export const ViewScope = function <V extends View, T, U>(
    this: ViewScope<V, T, U> | typeof ViewScope,
    owner: V | ViewScopeDescriptor<V, T, U>,
    scopeName?: string,
  ): ViewScope<V, T, U> | PropertyDecorator {
  if (this instanceof ViewScope) { // constructor
    return ViewScopeConstructor.call(this as ViewScope<View, unknown, unknown>, owner as V, scopeName);
  } else { // decorator factory
    return ViewScopeDecoratorFactory(owner as ViewScopeDescriptor<V, T, U>);
  }
} as {
  /** @hidden */
  new<V extends View, T, U = never>(owner: V, scopeName: string | undefined): ViewScope<V, T, U>;

  <V extends View, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ViewScopeDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewScopeDescriptorFromAny<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never, I = {}>(descriptor: ViewScopeDescriptorExtends<V, T, U, I>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewScopeDescriptor<V, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ViewScope<any, any>;

  /** @hidden */
  getClass(type: unknown): ViewScopeClass | null;

  define<V extends View, T, U = never, I = {}>(descriptor: ViewScopeDescriptorExtends<V, T, U, I>): ViewScopeConstructor<V, T, U, I>;
  define<V extends View, T, U = never>(descriptor: ViewScopeDescriptor<V, T, U>): ViewScopeConstructor<V, T, U>;

  /** @hidden */
  UpdatedFlag: ViewScopeFlags;
  /** @hidden */
  OverrideFlag: ViewScopeFlags;
  /** @hidden */
  InheritedFlag: ViewScopeFlags;
};
__extends(ViewScope, Object);

function ViewScopeConstructor<V extends View, T, U>(this: ViewScope<V, T, U>, owner: V, scopeName: string | undefined): ViewScope<V, T, U> {
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
  let scopeFlags = ViewScope.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      state = this.fromAny(initState);
    }
  } else if (this.inherit !== false) {
    scopeFlags |= ViewScope.InheritedFlag;
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

function ViewScopeDecoratorFactory<V extends View, T, U>(descriptor: ViewScopeDescriptor<V, T, U>): PropertyDecorator {
  return View.decorateViewScope.bind(View, ViewScope.define(descriptor as ViewScopeDescriptor<View, unknown>));
}

ViewScope.prototype.setInherit = function (this: ViewScope<View, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperScope();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperScope();
      if ((this.scopeFlags & ViewScope.OverrideFlag) === 0) {
        this.setScopeFlags(this.scopeFlags | (ViewScope.UpdatedFlag | ViewScope.InheritedFlag));
        this.change();
      }
    } else if (this.inherit !== false) {
      this.setScopeFlags(this.scopeFlags & ~ViewScope.InheritedFlag);
    }
  }
};

ViewScope.prototype.isInherited = function (this: ViewScope<View, unknown>): boolean {
  return (this.scopeFlags & ViewScope.InheritedFlag) !== 0;
};

ViewScope.prototype.setInherited = function (this: ViewScope<View, unknown>, inherited: boolean): void {
  if (inherited && (this.scopeFlags & ViewScope.InheritedFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ViewScope.InheritedFlag);
    this.change();
  } else if (!inherited && (this.scopeFlags & ViewScope.InheritedFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ViewScope.InheritedFlag);
    this.change();
  }
};

ViewScope.prototype.setScopeFlags = function (this: ViewScope<View, unknown>, scopeFlags: ViewScopeFlags): void {
  Object.defineProperty(this, "scopeFlags", {
    value: scopeFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ViewScope.prototype, "superName", {
  get: function (this: ViewScope<View, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.bindSuperScope = function (this: ViewScope<View, unknown>): void {
  let view = this.owner;
  if (view.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const superScope = view.getLazyViewScope(superName);
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
              this.setScopeFlags(this.scopeFlags | ViewScope.UpdatedFlag);
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

ViewScope.prototype.addSubScope = function <T>(this: ViewScope<View, T>, subScope: ViewScope<View, T>): void {
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

ViewScope.prototype.removeSubScope = function <T>(this: ViewScope<View, T>, subScope: ViewScope<View, T>): void {
  const subScopes = this.subScopes;
  if (subScopes !== null) {
    const index = subScopes.indexOf(subScope);
    if (index >= 0) {
      subScopes.splice(index, 1);
    }
  }
};

ViewScope.prototype.isAuto = function (this: ViewScope<View, unknown>): boolean {
  return (this.scopeFlags & ViewScope.OverrideFlag) === 0;
};

ViewScope.prototype.setAuto = function (this: ViewScope<View, unknown>, auto: boolean): void {
  if (auto && (this.scopeFlags & ViewScope.OverrideFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ViewScope.OverrideFlag);
  } else if (!auto && (this.scopeFlags & ViewScope.OverrideFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ViewScope.OverrideFlag);
  }
};

ViewScope.prototype.isUpdated = function (this: ViewScope<View, unknown>): boolean {
  return (this.scopeFlags & ViewScope.UpdatedFlag) !== 0;
};

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

ViewScope.prototype.getStateOr = function <T, U, E>(this: ViewScope<View, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ViewScope.prototype.setState = function <T, U>(this: ViewScope<View, T, U>, state: T | U): void {
  this.setScopeFlags(this.scopeFlags | ViewScope.OverrideFlag);
  this.setOwnState(state);
};

ViewScope.prototype.willSetState = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.onSetState = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.didSetState = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.setAutoState = function <T, U>(this: ViewScope<View, T, U>, state: T | U): void {
  if ((this.scopeFlags & ViewScope.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ViewScope.prototype.setOwnState = function <T, U>(this: ViewScope<View, T, U>, newState: T | U): void {
  const oldState = this.state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  this.setScopeFlags(this.scopeFlags & ~ViewScope.InheritedFlag);
  if (!Values.equal(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    Object.defineProperty(this, "state", {
      value: newState as T,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ViewScope.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubScopes(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ViewScope.prototype.setBaseState = function <T, U>(this: ViewScope<View, T, U>, state: T | U): void {
  let superScope: ViewScope<View, T> | null;
  if (this.isInherited() && (superScope = this.superScope, superScope !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superScope.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ViewScope.prototype, "updatedState", {
  get: function <T>(this: ViewScope<View, T>): T | undefined {
    if ((this.scopeFlags & ViewScope.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ViewScope.prototype.takeUpdatedState = function <T>(this: ViewScope<View, T>): T | undefined {
  const scopeFlags = this.scopeFlags;
  if ((scopeFlags & ViewScope.UpdatedFlag) !== 0) {
    this.setScopeFlags(scopeFlags & ~ViewScope.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ViewScope.prototype.takeState = function <T>(this: ViewScope<View, T>): T {
  this.setScopeFlags(this.scopeFlags & ~ViewScope.UpdatedFlag);
  return this.state;
}

ViewScope.prototype.onChange = function (this: ViewScope<View, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ViewScope.prototype.updateInherited = function (this: ViewScope<View, unknown>): void {
  const superScope = this.superScope;
  if (superScope !== null) {
    this.update(superScope.state, this.state);
  }
};

ViewScope.prototype.update = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  if (!Values.equal(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ViewScope.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubScopes(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ViewScope.prototype.willUpdate = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.onUpdate = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ViewScope.prototype.didUpdate = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewScope.prototype.updateSubScopes = function <T>(this: ViewScope<View, T>, newState: T, oldState: T): void {
  const subScopes = this.subScopes;
  if (subScopes !== null) {
    for (let i = 0, n = subScopes.length; i < n; i += 1) {
      const subScope = subScopes[i]!;
      if (subScope.isInherited()) {
        subScope.change();
      }
    }
  }
};

ViewScope.prototype.change = function (this: ViewScope<View, unknown>): void {
  this.owner.requireUpdate(View.NeedsChange);
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
    return StringViewScope;
  } else if (type === Boolean) {
    return BooleanViewScope;
  } else if (type === Number) {
    return NumberViewScope;
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

  const _constructor = function DecoratedViewScope(this: ViewScope<V, T, U>, owner: V, scopeName: string | undefined): ViewScope<V, T, U> {
    let _this: ViewScope<V, T, U> = function ViewScopeAccessor(state?: T | U): T | V {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ViewScope<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, scopeName) || _this;
    return _this;
  } as unknown as ViewScopeConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as ViewScope<any, any> & I;
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

ViewScope.UpdatedFlag = 1 << 0;
ViewScope.OverrideFlag = 1 << 1;
ViewScope.InheritedFlag = 1 << 2;

ViewScope({extends: void 0, type: MoodVector, inherit: true})(View.prototype, "mood");
ViewScope({extends: void 0, type: ThemeMatrix, inherit: true})(View.prototype, "theme");
