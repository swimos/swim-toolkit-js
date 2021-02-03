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
import {ModelFlags, Model} from "../Model";
import {Trait} from "../Trait";
import {
  ModelScopeFlags,
  ModelScopeDescriptorExtends,
  ModelScopeDescriptor,
  ModelScopeConstructor,
  ModelScope,
} from "./ModelScope";
import {StringTraitScope} from "../"; // forward import
import {BooleanTraitScope} from "../"; // forward import
import {NumberTraitScope} from "../"; // forward import

export type TraitScopeMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitScope<any, infer T, any>} ? T : unknown;

export type TraitScopeMemberInit<R, K extends keyof R> =
  R extends {[P in K]: TraitScope<any, infer T, infer U>} ? T | U : unknown;

export interface TraitScopeInit<T, U = never> {
  extends?: TraitScopeClass;
  type?: unknown;
  state?: T | U;
  inherit?: string | boolean;

  updateFlags?: ModelFlags;
  willUpdate?(newState: T, oldState: T): void;
  onUpdate?(newState: T, oldState: T): void;
  didUpdate?(newState: T, oldState: T): void;
  fromAny?(value: T | U): T;
  initState?(): T | U;

  /** @hidden */
  modelScope?: ModelScopeDescriptorExtends<Model, T> | ModelScopeDescriptor<Model, T>;
  /** @hidden */
  modelScopeConstructor?: ModelScopeConstructor<Model, T>;
  /** @hidden */
  createModelScope?(): ModelScope<Model, T>;
}

export type TraitScopeDescriptor<R extends Trait, T, U = never, I = {}> = TraitScopeInit<T, U> & ThisType<TraitScope<R, T, U> & I> & I;

export type TraitScopeDescriptorExtends<R extends Trait, T, U = never, I = {}> = {extends: TraitScopeClass | undefined} & TraitScopeDescriptor<R, T, U, I>;

export type TraitScopeDescriptorFromAny<R extends Trait, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & TraitScopeDescriptor<R, T, U, I>;

export interface TraitScopeConstructor<R extends Trait, T, U = never, I = {}> {
  new(owner: R, scopeName: string | undefined): TraitScope<R, T, U> & I;
  prototype: TraitScope<any, any> & I;
}

export interface TraitScopeClass extends Function {
  readonly prototype: TraitScope<any, any>;
}

export interface TraitScope<R extends Trait, T, U = never> {
  (): T;
  (state: T | U): R;

  readonly name: string;

  readonly owner: R;

  readonly modelScope: ModelScope<Model, T> | null;

  /** @hidden */
  modelScopeConstructor?: ModelScopeConstructor<Model, T>;

  /** @hidden */
  createModelScope(): ModelScope<Model, T>;

  /** @hidden */
  bindModelScope(): void;

  /** @hidden */
  unbindModelScope(): void;

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

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

  isMutating(): boolean;

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
  mutate(): void;

  /** @hidden */
  attach(): void;

  /** @hidden */
  detach(): void;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;
}

export const TraitScope = function <R extends Trait, T, U>(
    this: TraitScope<R, T, U> | typeof TraitScope,
    owner: R | TraitScopeDescriptor<R, T, U>,
    scopeName?: string,
  ): TraitScope<R, T, U> | PropertyDecorator {
  if (this instanceof TraitScope) { // constructor
    return TraitScopeConstructor.call(this as TraitScope<Trait, unknown, unknown>, owner as R, scopeName);
  } else { // decorator factory
    return TraitScopeDecoratorFactory(owner as TraitScopeDescriptor<R, T, U>);
  }
} as {
  /** @hidden */
  new<R extends Trait, T, U = never>(owner: R, scopeName: string | undefined): TraitScope<R, T, U>;

  <R extends Trait, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & TraitScopeDescriptor<R, T, U>): PropertyDecorator;
  <R extends Trait, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & TraitScopeDescriptor<R, T, U>): PropertyDecorator;
  <R extends Trait, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & TraitScopeDescriptor<R, T, U>): PropertyDecorator;
  <R extends Trait, T, U = never>(descriptor: TraitScopeDescriptorFromAny<R, T, U>): PropertyDecorator;
  <R extends Trait, T, U = never, I = {}>(descriptor: TraitScopeDescriptorExtends<R, T, U, I>): PropertyDecorator;
  <R extends Trait, T, U = never>(descriptor: TraitScopeDescriptor<R, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: TraitScope<any, any>;

  /** @hidden */
  getClass(type: unknown): TraitScopeClass | null;

  define<R extends Trait, T, U = never, I = {}>(descriptor: TraitScopeDescriptorExtends<R, T, U, I>): TraitScopeConstructor<R, T, U, I>;
  define<R extends Trait, T, U = never>(descriptor: TraitScopeDescriptor<R, T, U>): TraitScopeConstructor<R, T, U>;
}
__extends(TraitScope, Object);

function TraitScopeConstructor<R extends Trait, T, U>(this: TraitScope<R, T, U>, owner: R, scopeName: string | undefined): TraitScope<R, T, U> {
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
  Object.defineProperty(this, "modelScope", {
    value: null,
    enumerable: true,
    configurable: true,
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
  Object.defineProperty(this, "state", {
    value: state,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function TraitScopeDecoratorFactory<R extends Trait, T, U>(descriptor: TraitScopeDescriptor<R, T, U>): PropertyDecorator {
  return Trait.decorateTraitScope.bind(Trait, TraitScope.define(descriptor as TraitScopeDescriptor<Trait, unknown>));
}

TraitScope.prototype.createModelScope = function <T, U>(this: TraitScope<Trait, T, U>): ModelScope<Model, T> {
  const modelScopeConstructor = this.modelScopeConstructor;
  if (modelScopeConstructor !== void 0) {
    const model = this.owner.model;
    if (model !== null) {
      const modelScope = new modelScopeConstructor(model, this.name);
      Object.defineProperty(modelScope, "inherit", {
        value: this.inherit,
        enumerable: true,
        configurable: true,
      });
      modelScope.setScopeFlags(this.scopeFlags);
      Object.defineProperty(modelScope, "state", {
        value: this.state,
        enumerable: true,
        configurable: true,
      });
      return modelScope;
    } else {
      throw new Error("no model");
    }
  } else {
    throw new Error("no model scope constructor");
  }
};

TraitScope.prototype.bindModelScope = function (this: TraitScope<Trait, unknown>): void {
  const model = this.owner.model;
  if (model !== null) {
    let modelScope = model.getLazyModelScope(this.name);
    if (modelScope === null) {
      modelScope = this.createModelScope();
      model.setModelScope(this.name, modelScope);
    }
    Object.defineProperty(this, "modelScope", {
      value: modelScope,
      enumerable: true,
      configurable: true,
    });
    modelScope.addTraitScope(this);
    Object.defineProperty(this, "inherit", {
      value: modelScope.inherit,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(modelScope.scopeFlags);
    Object.defineProperty(this, "state", {
      value: modelScope.state,
      enumerable: true,
      configurable: true,
    });
  }
};

TraitScope.prototype.unbindModelScope = function (this: TraitScope<Trait, unknown>): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    modelScope.removeTraitScope(this);
    Object.defineProperty(this, "modelScope", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }
};

TraitScope.prototype.setInherit = function (this: TraitScope<Trait, unknown>, inherit: string | boolean): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    modelScope.setInherit(inherit);
  } else if (this.inherit !== inherit) {
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      if ((this.scopeFlags & ModelScope.OverrideFlag) === 0) {
        this.setScopeFlags(this.scopeFlags | (ModelScope.UpdatedFlag | ModelScope.InheritedFlag));
        this.mutate();
      }
    } else if (this.inherit !== false) {
      this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
    }
  }
};

TraitScope.prototype.isInherited = function (this: TraitScope<Trait, unknown>): boolean {
  return (this.scopeFlags & ModelScope.InheritedFlag) !== 0;
};

TraitScope.prototype.setInherited = function (this: TraitScope<Trait, unknown>, inherited: boolean): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    modelScope.setInherited(inherited);
  } else if (inherited && (this.scopeFlags & ModelScope.InheritedFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ModelScope.InheritedFlag);
    this.mutate();
  } else if (!inherited && (this.scopeFlags & ModelScope.InheritedFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
    this.mutate();
  }
};

TraitScope.prototype.setScopeFlags = function (this: TraitScope<Trait, unknown>, scopeFlags: ModelScopeFlags): void {
  Object.defineProperty(this, "scopeFlags", {
    value: scopeFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(TraitScope.prototype, "superName", {
  get: function (this: TraitScope<Trait, unknown>): string | undefined {
    const modelScope = this.modelScope;
    return modelScope !== null ? modelScope.superName : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitScope.prototype, "superScope", {
  get: function (this: TraitScope<Trait, unknown>): ModelScope<Model, unknown> | null {
    const modelScope = this.modelScope;
    return modelScope !== null ? modelScope.superScope : null;
  },
  enumerable: true,
  configurable: true,
});

TraitScope.prototype.isAuto = function (this: TraitScope<Trait, unknown>): boolean {
  return (this.scopeFlags & ModelScope.OverrideFlag) === 0;
};

TraitScope.prototype.setAuto = function (this: TraitScope<Trait, unknown>, auto: boolean): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    modelScope.setAuto(auto);
  } else if (auto && (this.scopeFlags & ModelScope.OverrideFlag) !== 0) {
    this.setScopeFlags(this.scopeFlags & ~ModelScope.OverrideFlag);
  } else if (!auto && (this.scopeFlags & ModelScope.OverrideFlag) === 0) {
    this.setScopeFlags(this.scopeFlags | ModelScope.OverrideFlag);
  }
};

TraitScope.prototype.isUpdated = function (this: TraitScope<Trait, unknown>): boolean {
  return (this.scopeFlags & ModelScope.UpdatedFlag) !== 0;
};

Object.defineProperty(TraitScope.prototype, "ownState", {
  get: function <T>(this: TraitScope<Trait, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitScope.prototype, "superState", {
  get: function <T>(this: TraitScope<Trait, T>): T | undefined {
    const modelScope = this.modelScope;
    return modelScope !== null ? modelScope.superState : void 0;
  },
  enumerable: true,
  configurable: true,
});

TraitScope.prototype.getState = function <T, U>(this: TraitScope<Trait, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

TraitScope.prototype.getStateOr = function <T, U, E>(this: TraitScope<Trait, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

TraitScope.prototype.setState = function <T, U>(this: TraitScope<Trait, T, U>, state: T | U): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    modelScope.setState(state as T);
  } else {
    this.setScopeFlags(this.scopeFlags | ModelScope.OverrideFlag);
    this.setOwnState(state);
  }
};

TraitScope.prototype.willSetState = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  // hook
};

TraitScope.prototype.onSetState = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  // hook
};

TraitScope.prototype.didSetState = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  // hook
};

TraitScope.prototype.setAutoState = function <T, U>(this: TraitScope<Trait, T, U>, state: T | U): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    modelScope.setAutoState(state as T);
  } else if ((this.scopeFlags & ModelScope.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

TraitScope.prototype.setOwnState = function <T, U>(this: TraitScope<Trait, T, U>, newState: T | U): void {
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    modelScope.setOwnState(newState as T);
  } else {
    const oldState = this.state;
    this.setScopeFlags(this.scopeFlags & ~ModelScope.InheritedFlag);
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
      this.didUpdate(newState as T, oldState);
      this.didSetState(newState as T, oldState);
    }
  }
};

TraitScope.prototype.setBaseState = function <T, U>(this: TraitScope<Trait, T, U>, state: T | U): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    modelScope.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

TraitScope.prototype.onMutate = function (this: TraitScope<Trait, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

TraitScope.prototype.updateInherited = function <T>(this: TraitScope<Trait, T>): void {
  const modelScope = this.modelScope;
  if (modelScope !== null) {
    this.update(modelScope.state, this.state);
  }
};

TraitScope.prototype.update = function <T>(this: TraitScope<Trait, T>,
                                           newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setScopeFlags(this.scopeFlags | ModelScope.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

TraitScope.prototype.willUpdate = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  // hook
};

TraitScope.prototype.onUpdate = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

TraitScope.prototype.didUpdate = function <T>(this: TraitScope<Trait, T>, newState: T, oldState: T): void {
  // hook
};

TraitScope.prototype.mutate = function (this: TraitScope<Trait, unknown>): void {
  this.owner.requireUpdate(Model.NeedsMutate);
};

TraitScope.prototype.attach = function (this: TraitScope<Trait, unknown>): void {
  this.bindModelScope();
};

TraitScope.prototype.detach = function (this: TraitScope<Trait, unknown>): void {
  this.unbindModelScope();
};

TraitScope.prototype.fromAny = function <T, U>(this: TraitScope<Trait, T, U>, value: T | U): T {
  return value as T;
};

TraitScope.getClass = function (type: unknown): TraitScopeClass | null {
  if (type === String) {
    return StringTraitScope;
  } else if (type === Boolean) {
    return BooleanTraitScope;
  } else if (type === Number) {
    return NumberTraitScope;
  }
  return null;
};

TraitScope.define = function <R extends Trait, T, U, I>(descriptor: TraitScopeDescriptor<R, T, U, I>): TraitScopeConstructor<R, T, U, I> {
  let _super: TraitScopeClass | null | undefined = descriptor.extends;
  const type = descriptor.type;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  let modelScope = descriptor.modelScope;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;
  delete descriptor.modelScope;

  if (_super === void 0) {
    _super = TraitScope.getClass(type);
  }
  if (_super === null) {
    _super = TraitScope;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(type)) {
      descriptor.fromAny = type.fromAny;
    }
  }

  const _constructor = function DecoratedTraitScope(this: TraitScope<R, T, U>, owner: R, scopeName: string | undefined): TraitScope<R, T, U> {
    let _this: TraitScope<R, T, U> = function TraitScopeAccessor(state?: T | U): T | R {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as TraitScope<R, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, scopeName) || _this;
    return _this;
  } as unknown as TraitScopeConstructor<R, T, U, I>;

  const _prototype = descriptor as unknown as TraitScope<any, any> & I;
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
  if (_prototype.modelScopeConstructor === void 0) {
    if (modelScope === void 0) {
      modelScope = {
        extends: void 0,
        type,
        state: state as T,
        inherit
      };
    }
    _prototype.modelScopeConstructor = ModelScope.define(modelScope as ModelScopeDescriptor<Model, T>);
  }

  return _constructor;
};
