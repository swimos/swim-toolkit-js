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
import {Equals, FromAny, Arrays} from "@swim/util";
import {ModelFlags, Model} from "../Model";
import type {Trait} from "../Trait";
import {StringModelScope} from "../"; // forward import
import {BooleanModelScope} from "../"; // forward import
import {NumberModelScope} from "../"; // forward import
import type {TraitScope} from "./TraitScope";

export type ModelScopeMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelScope<any, infer T, any>} ? T : unknown;

export type ModelScopeMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelScope<any, infer T, infer U>} ? T | U : unknown;

export type ModelScopeFlags = number;

export interface ModelScopeInit<T, U = never> {
  extends?: ModelScopeClass;
  type?: unknown;
  state?: T | U;
  inherit?: string | boolean;

  updateFlags?: ModelFlags;
  willUpdate?(newState: T, oldState: T): void;
  onUpdate?(newState: T, oldState: T): void;
  didUpdate?(newState: T, oldState: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;
}

export type ModelScopeDescriptor<M extends Model, T, U = never, I = {}> = ModelScopeInit<T, U> & ThisType<ModelScope<M, T, U> & I> & I;

export type ModelScopeDescriptorExtends<M extends Model, T, U = never, I = {}> = {extends: ModelScopeClass | undefined} & ModelScopeDescriptor<M, T, U, I>;

export type ModelScopeDescriptorFromAny<M extends Model, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ModelScopeDescriptor<M, T, U, I>;

export interface ModelScopeConstructor<M extends Model, T, U = never, I = {}> {
  new(owner: M, scopeName: string | undefined): ModelScope<M, T, U> & I;
  prototype: ModelScope<any, any> & I;
}

export interface ModelScopeClass extends Function {
  readonly prototype: ModelScope<any, any>;
}

export interface ModelScope<M extends Model, T, U = never> {
  (): T;
  (state: T | U): M;

  readonly name: string;

  readonly owner: M;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  scopeFlags: ModelScopeFlags;

  /** @hidden */
  setScopeFlags(scopeFlags: ModelScopeFlags): void;

  updateFlags?: ModelFlags;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superScope: ModelScope<Model, T> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  readonly subScopes: ModelScope<Model, T>[] | null;

  /** @hidden */
  addSubScope(subScope: ModelScope<Model, T>): void;

  /** @hidden */
  removeSubScope(subScope: ModelScope<Model, T>): void;

  /** @hidden */
  readonly traitScopes: ReadonlyArray<TraitScope<Trait, T>>;

  /** @hidden */
  addTraitScope(traitScope: TraitScope<Trait, T>): void;

  /** @hidden */
  removeTraitScope(traitScope: TraitScope<Trait, T>): void;

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
  onMutate(): void;

  /** @hidden */
  updateInherited(): void;

  update(newState: T, oldState: T): void;

  willUpdate(newState: T, oldState: T): void;

  onUpdate(newState: T, oldState: T): void;

  didUpdate(newState: T, oldState: T): void;

  /** @hidden */
  updateSubScopes(newState: T, oldState: T): void;

  /** @hidden */
  updateTraitScopes(newState: T, oldState: T): void;

  /** @hidden */
  mutate(): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;
}

export const ModelScope = function <M extends Model, T, U>(
    this: ModelScope<M, T, U> | typeof ModelScope,
    owner: M | ModelScopeDescriptor<M, T, U>,
    scopeName?: string,
  ): ModelScope<M, T, U> | PropertyDecorator {
  if (this instanceof ModelScope) { // constructor
    return ModelScopeConstructor.call(this as ModelScope<Model, unknown, unknown>, owner as M, scopeName);
  } else { // decorator factory
    return ModelScopeDecoratorFactory(owner as ModelScopeDescriptor<M, T, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, T, U = never>(owner: M, scopeName: string | undefined): ModelScope<M, T, U>;

  <M extends Model, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ModelScopeDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ModelScopeDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ModelScopeDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T, U = never>(descriptor: ModelScopeDescriptorFromAny<M, T, U>): PropertyDecorator;
  <M extends Model, T, U = never, I = {}>(descriptor: ModelScopeDescriptorExtends<M, T, U, I>): PropertyDecorator;
  <M extends Model, T, U = never>(descriptor: ModelScopeDescriptor<M, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelScope<any, any>;

  /** @hidden */
  getClass(type: unknown): ModelScopeClass | null;

  define<M extends Model, T, U = never, I = {}>(descriptor: ModelScopeDescriptorExtends<M, T, U, I>): ModelScopeConstructor<M, T, U, I>;
  define<M extends Model, T, U = never>(descriptor: ModelScopeDescriptor<M, T, U>): ModelScopeConstructor<M, T, U>;

  /** @hidden */
  UpdatedFlag: ModelScopeFlags;
  /** @hidden */
  OverrideFlag: ModelScopeFlags;
  /** @hidden */
  InheritedFlag: ModelScopeFlags;
};
__extends(ModelScope, Object);

function ModelScopeConstructor<M extends Model, T, U>(this: ModelScope<M, T, U>, owner: M, scopeName: string | undefined): ModelScope<M, T, U> {
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
  let scopeFlags = ModelScope.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      state = this.fromAny(initState);
    }
  } else if (this.inherit !== false) {
    scopeFlags |= ModelScope.InheritedFlag;
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
  Object.defineProperty(this, "traitScopes", {
    value: Arrays.empty,
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

function ModelScopeDecoratorFactory<M extends Model, T, U>(descriptor: ModelScopeDescriptor<M, T, U>): PropertyDecorator {
  return Model.decorateModelScope.bind(Model, ModelScope.define(descriptor as ModelScopeDescriptor<Model, unknown>));
}

ModelScope.prototype.setInherit = function (this: ModelScope<Model, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperScope();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperScope();
      if ((this.scopeFlags & ModelScope.OverrideFlag) === 0) {
        this.setScopeFlags(this.scopeFlags | (ModelScope.UpdatedFlag | ModelScope.InheritedFlag));
        this.owner.requireUpdate(Model.NeedsMutate);
      }
      const traitScopes = this.traitScopes;
      for (let i = 0, n = traitScopes.length; i < n; i += 1) {
        const traitScope = traitScopes[i]!;
        Object.defineProperty(traitScope, "inherit", {
          value: inherit,
          enumerable: true,
          configurable: true,
        });
        if ((traitScope.scopeFlags & ModelScope.OverrideFlag) === 0) {
          traitScope.setScopeFlags(traitScope.scopeFlags | (ModelScope.UpdatedFlag | ModelScope.InheritedFlag));
          traitScope.mutate();
        }
      }
    } else if (this.inherit !== false) {
      this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
      const traitScopes = this.traitScopes;
      for (let i = 0, n = traitScopes.length; i < n; i += 1) {
        const traitScope = traitScopes[i]!;
        Object.defineProperty(traitScope, "inherit", {
          value: false,
          enumerable: true,
          configurable: true,
        });
        traitScope.setScopeFlags(traitScope.scopeFlags & ~ModelScope.InheritedFlag);
      }
    }
  }
};

ModelScope.prototype.isInherited = function (this: ModelScope<Model, unknown>): boolean {
  return (this.scopeFlags & ModelScope.InheritedFlag) !== 0;
};

ModelScope.prototype.setInherited = function (this: ModelScope<Model, unknown>, inherited: boolean): void {
  if (inherited && (this.scopeFlags & ModelScope.InheritedFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ModelScope.InheritedFlag);
    this.owner.requireUpdate(Model.NeedsMutate);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags | ModelScope.InheritedFlag);
      traitScope.mutate();
    }
  } else if (!inherited && (this.scopeFlags & ModelScope.InheritedFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
    this.owner.requireUpdate(Model.NeedsMutate);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags & ~ModelScope.InheritedFlag);
      traitScope.mutate();
    }
  }
};

ModelScope.prototype.setScopeFlags = function (this: ModelScope<Model, unknown>, scopeFlags: ModelScopeFlags): void {
  Object.defineProperty(this, "scopeFlags", {
    value: scopeFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ModelScope.prototype, "superName", {
  get: function (this: ModelScope<Model, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ModelScope.prototype.bindSuperScope = function (this: ModelScope<Model, unknown>): void {
  let model = this.owner;
  if (model.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentModel = model.parentModel;
        if (parentModel !== null) {
          model = parentModel;
          const superScope = model.getLazyModelScope(superName);
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
              this.setScopeFlags(this.scopeFlags | ModelScope.UpdatedFlag);
              this.owner.requireUpdate(Model.NeedsMutate);
              const traitScopes = this.traitScopes;
              for (let i = 0, n = traitScopes.length; i < n; i += 1) {
                const traitScope = traitScopes[i]!;
                traitScope.setScopeFlags(traitScope.scopeFlags | ModelScope.UpdatedFlag);
                traitScope.mutate();
              }
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

ModelScope.prototype.unbindSuperScope = function (this: ModelScope<Model, unknown>): void {
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

ModelScope.prototype.addSubScope = function <T>(this: ModelScope<Model, T>, subScope: ModelScope<Model, T>): void {
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

ModelScope.prototype.removeSubScope = function <T>(this: ModelScope<Model, T>, subScope: ModelScope<Model, T>): void {
  const subScopes = this.subScopes;
  if (subScopes !== null) {
    const index = subScopes.indexOf(subScope);
    if (index >= 0) {
      subScopes.splice(index, 1);
    }
  }
};

ModelScope.prototype.addTraitScope = function <T>(this: ModelScope<Model, T>, traitScope: TraitScope<Trait, T>): void {
  Object.defineProperty(this, "traitScopes", {
    value: Arrays.inserted(traitScope, this.traitScopes),
    enumerable: true,
    configurable: true,
  });
};

ModelScope.prototype.removeTraitScope = function <T>(this: ModelScope<Model, T>, traitScope: TraitScope<Trait, T>): void {
  Object.defineProperty(this, "traitScopes", {
    value: Arrays.removed(traitScope, this.traitScopes),
    enumerable: true,
    configurable: true,
  });
};

ModelScope.prototype.isAuto = function (this: ModelScope<Model, unknown>): boolean {
  return (this.scopeFlags & ModelScope.OverrideFlag) === 0;
};

ModelScope.prototype.setAuto = function (this: ModelScope<Model, unknown>, auto: boolean): void {
  if (auto && (this.scopeFlags & ModelScope.OverrideFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ModelScope.OverrideFlag);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags & ~ModelScope.OverrideFlag);
    }
  } else if (!auto && (this.scopeFlags & ModelScope.OverrideFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ModelScope.OverrideFlag);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags | ModelScope.OverrideFlag);
    }
  }
};

ModelScope.prototype.isUpdated = function (this: ModelScope<Model, unknown>): boolean {
  return (this.scopeFlags & ModelScope.UpdatedFlag) !== 0;
};

Object.defineProperty(ModelScope.prototype, "ownState", {
  get: function <T>(this: ModelScope<Model, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ModelScope.prototype, "superState", {
  get: function <T>(this: ModelScope<Model, T>): T | undefined {
    const superScope = this.superScope;
    return superScope !== null ? superScope.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ModelScope.prototype.getState = function <T, U>(this: ModelScope<Model, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ModelScope.prototype.getStateOr = function <T, U, E>(this: ModelScope<Model, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ModelScope.prototype.setState = function <T, U>(this: ModelScope<Model, T, U>, state: T | U): void {
  if ((this.scopeFlags & ModelScope.OverrideFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ModelScope.OverrideFlag);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags | ModelScope.OverrideFlag);
    }
  }
  this.setOwnState(state);
};

ModelScope.prototype.willSetState = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelScope.prototype.onSetState = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelScope.prototype.didSetState = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelScope.prototype.setAutoState = function <T, U>(this: ModelScope<Model, T, U>, state: T | U): void {
  if ((this.scopeFlags & ModelScope.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ModelScope.prototype.setOwnState = function <T, U>(this: ModelScope<Model, T, U>, newState: T | U): void {
  const oldState = this.state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  if ((this.scopeFlags & ModelScope.InheritedFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
    const traitScopes = this.traitScopes;
    for (let i = 0, n = traitScopes.length; i < n; i += 1) {
      const traitScope = traitScopes[i]!;
      traitScope.setScopeFlags(traitScope.scopeFlags & ~ModelScope.InheritedFlag);
    }
  }
  if (!Equals(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    Object.defineProperty(this, "state", {
      value: newState as T,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ModelScope.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubScopes(newState as T, oldState);
    this.updateTraitScopes(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ModelScope.prototype.setBaseState = function <T, U>(this: ModelScope<Model, T, U>, state: T | U): void {
  let superScope: ModelScope<Model, T> | null | undefined;
  if (this.isInherited() && (superScope = this.superScope, superScope !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superScope.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ModelScope.prototype, "updatedState", {
  get: function <T>(this: ModelScope<Model, T>): T | undefined {
    if ((this.scopeFlags & ModelScope.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ModelScope.prototype.takeUpdatedState = function <T>(this: ModelScope<Model, T>): T | undefined {
  const scopeFlags = this.scopeFlags;
  if ((scopeFlags & ModelScope.UpdatedFlag) !== 0) {
    this.setScopeFlags(scopeFlags & ~ModelScope.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ModelScope.prototype.takeState = function <T>(this: ModelScope<Model, T>): T {
  this.setScopeFlags(this.scopeFlags & ~ModelScope.UpdatedFlag);
  return this.state;
}

ModelScope.prototype.onMutate = function (this: ModelScope<Model, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ModelScope.prototype.updateInherited = function <T>(this: ModelScope<Model, T>): void {
  const superScope = this.superScope;
  if (superScope !== null) {
    this.update(superScope.state, this.state);
  }
};

ModelScope.prototype.update = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ModelScope.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubScopes(newState, oldState);
    this.updateTraitScopes(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ModelScope.prototype.willUpdate = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelScope.prototype.onUpdate = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ModelScope.prototype.didUpdate = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelScope.prototype.updateSubScopes = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  const subScopes = this.subScopes;
  for (let i = 0, n = subScopes !== null ? subScopes.length : 0; i < n; i += 1) {
    const subScope = subScopes![i]!;
    if (subScope.isInherited()) {
      subScope.mutate();
    }
  }
};

ModelScope.prototype.updateTraitScopes = function <T>(this: ModelScope<Model, T>, newState: T, oldState: T): void {
  const traitScopes = this.traitScopes;
  for (let i = 0, n = traitScopes.length; i < n; i += 1) {
    const traitScope = traitScopes[i]!;
    traitScope.mutate();
  }
};

ModelScope.prototype.mutate = function (this: ModelScope<Model, unknown>): void {
  this.owner.requireUpdate(Model.NeedsMutate);
};

ModelScope.prototype.mount = function (this: ModelScope<Model, unknown>): void {
  this.bindSuperScope();
};

ModelScope.prototype.unmount = function (this: ModelScope<Model, unknown>): void {
  this.unbindSuperScope();
};

ModelScope.prototype.fromAny = function <T, U>(this: ModelScope<Model, T, U>, value: T | U): T {
  return value as T;
};

ModelScope.getClass = function (type: unknown): ModelScopeClass | null {
  if (type === String) {
    return StringModelScope;
  } else if (type === Boolean) {
    return BooleanModelScope;
  } else if (type === Number) {
    return NumberModelScope;
  }
  return null;
};

ModelScope.define = function <M extends Model, T, U, I>(descriptor: ModelScopeDescriptor<M, T, U, I>): ModelScopeConstructor<M, T, U, I> {
  let _super: ModelScopeClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ModelScope.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ModelScope;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedModelScope(this: ModelScope<M, T, U>, owner: M, scopeName: string | undefined): ModelScope<M, T, U> {
    let _this: ModelScope<M, T, U> = function ModelScopeAccessor(state?: T | U): T | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ModelScope<M, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, scopeName) || _this;
    return _this;
  } as unknown as ModelScopeConstructor<M, T, U, I>;

  const _prototype = descriptor as unknown as ModelScope<any, any> & I;
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

ModelScope.UpdatedFlag = 1 << 0;
ModelScope.OverrideFlag = 1 << 1;
ModelScope.InheritedFlag = 1 << 2;
