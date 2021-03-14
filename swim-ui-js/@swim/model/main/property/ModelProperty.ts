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
import {StringModelProperty} from "../"; // forward import
import {BooleanModelProperty} from "../"; // forward import
import {NumberModelProperty} from "../"; // forward import
import type {TraitProperty} from "./TraitProperty";

export type ModelPropertyMemberType<M, K extends keyof M> =
  M extends {[P in K]: ModelProperty<any, infer T, any>} ? T : unknown;

export type ModelPropertyMemberInit<M, K extends keyof M> =
  M extends {[P in K]: ModelProperty<any, infer T, infer U>} ? T | U : unknown;

export type ModelPropertyFlags = number;

export interface ModelPropertyInit<T, U = never> {
  extends?: ModelPropertyClass;
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

export type ModelPropertyDescriptor<M extends Model, T, U = never, I = {}> = ModelPropertyInit<T, U> & ThisType<ModelProperty<M, T, U> & I> & Partial<I>;

export type ModelPropertyDescriptorExtends<M extends Model, T, U = never, I = {}> = {extends: ModelPropertyClass | undefined} & ModelPropertyDescriptor<M, T, U, I>;

export type ModelPropertyDescriptorFromAny<M extends Model, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ModelPropertyDescriptor<M, T, U, I>;

export interface ModelPropertyConstructor<M extends Model, T, U = never, I = {}> {
  new(owner: M, propertyName: string | undefined): ModelProperty<M, T, U> & I;
  prototype: ModelProperty<any, any> & I;
}

export interface ModelPropertyClass extends Function {
  readonly prototype: ModelProperty<any, any>;
}

export interface ModelProperty<M extends Model, T, U = never> {
  (): T;
  (state: T | U): M;

  readonly name: string;

  readonly owner: M;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  propertyFlags: ModelPropertyFlags;

  /** @hidden */
  setPropertyFlags(propertyFlags: ModelPropertyFlags): void;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superProperty: ModelProperty<Model, T> | null;

  /** @hidden */
  bindSuperProperty(): void;

  /** @hidden */
  unbindSuperProperty(): void;

  /** @hidden */
  readonly subProperties: ModelProperty<Model, T>[] | null;

  /** @hidden */
  addSubProperty(subProperty: ModelProperty<Model, T>): void;

  /** @hidden */
  removeSubProperty(subProperty: ModelProperty<Model, T>): void;

  /** @hidden */
  readonly traitProperties: ReadonlyArray<TraitProperty<Trait, T>>;

  /** @hidden */
  addTraitProperty(traitProperty: TraitProperty<Trait, T>): void;

  /** @hidden */
  removeTraitProperty(traitProperty: TraitProperty<Trait, T>): void;

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
  updateSubProperties(newState: T, oldState: T): void;

  /** @hidden */
  updateTraitPropertys(newState: T, oldState: T): void;

  /** @hidden */
  mutate(): void;

  updateFlags?: ModelFlags;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;
}

export const ModelProperty = function <M extends Model, T, U>(
    this: ModelProperty<M, T, U> | typeof ModelProperty,
    owner: M | ModelPropertyDescriptor<M, T, U>,
    propertyName?: string,
  ): ModelProperty<M, T, U> | PropertyDecorator {
  if (this instanceof ModelProperty) { // constructor
    return ModelPropertyConstructor.call(this as ModelProperty<Model, unknown, unknown>, owner as M, propertyName);
  } else { // decorator factory
    return ModelPropertyDecoratorFactory(owner as ModelPropertyDescriptor<M, T, U>);
  }
} as {
  /** @hidden */
  new<M extends Model, T, U = never>(owner: M, propertyName: string | undefined): ModelProperty<M, T, U>;

  <M extends Model, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ModelPropertyDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ModelPropertyDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ModelPropertyDescriptor<M, T, U>): PropertyDecorator;
  <M extends Model, T, U = never>(descriptor: ModelPropertyDescriptorFromAny<M, T, U>): PropertyDecorator;
  <M extends Model, T, U = never, I = {}>(descriptor: ModelPropertyDescriptorExtends<M, T, U, I>): PropertyDecorator;
  <M extends Model, T, U = never>(descriptor: ModelPropertyDescriptor<M, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ModelProperty<any, any>;

  /** @hidden */
  getClass(type: unknown): ModelPropertyClass | null;

  define<M extends Model, T, U = never, I = {}>(descriptor: ModelPropertyDescriptorExtends<M, T, U, I>): ModelPropertyConstructor<M, T, U, I>;
  define<M extends Model, T, U = never>(descriptor: ModelPropertyDescriptor<M, T, U>): ModelPropertyConstructor<M, T, U>;

  /** @hidden */
  UpdatedFlag: ModelPropertyFlags;
  /** @hidden */
  OverrideFlag: ModelPropertyFlags;
  /** @hidden */
  InheritedFlag: ModelPropertyFlags;
};
__extends(ModelProperty, Object);

function ModelPropertyConstructor<M extends Model, T, U>(this: ModelProperty<M, T, U>, owner: M, propertyName: string | undefined): ModelProperty<M, T, U> {
  if (propertyName !== void 0) {
    Object.defineProperty(this, "name", {
      value: propertyName,
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
  let propertyFlags = ModelProperty.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      state = this.fromAny(initState);
    }
  } else if (this.inherit !== false) {
    propertyFlags |= ModelProperty.InheritedFlag;
  }
  Object.defineProperty(this, "propertyFlags", {
    value: propertyFlags,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "superProperty", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "subProperties", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(this, "traitProperties", {
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

function ModelPropertyDecoratorFactory<M extends Model, T, U>(descriptor: ModelPropertyDescriptor<M, T, U>): PropertyDecorator {
  return Model.decorateModelProperty.bind(Model, ModelProperty.define(descriptor as ModelPropertyDescriptor<Model, unknown>));
}

ModelProperty.prototype.setInherit = function (this: ModelProperty<Model, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperProperty();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperProperty();
      if ((this.propertyFlags & ModelProperty.OverrideFlag) === 0) {
        this.setPropertyFlags(this.propertyFlags | (ModelProperty.UpdatedFlag | ModelProperty.InheritedFlag));
        this.owner.requireUpdate(Model.NeedsMutate);
      }
      const traitProperties = this.traitProperties;
      for (let i = 0, n = traitProperties.length; i < n; i += 1) {
        const traitProperty = traitProperties[i]!;
        Object.defineProperty(traitProperty, "inherit", {
          value: inherit,
          enumerable: true,
          configurable: true,
        });
        if ((traitProperty.propertyFlags & ModelProperty.OverrideFlag) === 0) {
          traitProperty.setPropertyFlags(traitProperty.propertyFlags | (ModelProperty.UpdatedFlag | ModelProperty.InheritedFlag));
          traitProperty.mutate();
        }
      }
    } else if (this.inherit !== false) {
      this.setPropertyFlags(this.propertyFlags & ~ModelProperty.InheritedFlag);
      const traitProperties = this.traitProperties;
      for (let i = 0, n = traitProperties.length; i < n; i += 1) {
        const traitProperty = traitProperties[i]!;
        Object.defineProperty(traitProperty, "inherit", {
          value: false,
          enumerable: true,
          configurable: true,
        });
        traitProperty.setPropertyFlags(traitProperty.propertyFlags & ~ModelProperty.InheritedFlag);
      }
    }
  }
};

ModelProperty.prototype.isInherited = function (this: ModelProperty<Model, unknown>): boolean {
  return (this.propertyFlags & ModelProperty.InheritedFlag) !== 0;
};

ModelProperty.prototype.setInherited = function (this: ModelProperty<Model, unknown>, inherited: boolean): void {
  if (inherited && (this.propertyFlags & ModelProperty.InheritedFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ModelProperty.InheritedFlag);
    this.owner.requireUpdate(Model.NeedsMutate);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags | ModelProperty.InheritedFlag);
      traitProperty.mutate();
    }
  } else if (!inherited && (this.propertyFlags & ModelProperty.InheritedFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ModelProperty.InheritedFlag);
    this.owner.requireUpdate(Model.NeedsMutate);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags & ~ModelProperty.InheritedFlag);
      traitProperty.mutate();
    }
  }
};

ModelProperty.prototype.setPropertyFlags = function (this: ModelProperty<Model, unknown>, propertyFlags: ModelPropertyFlags): void {
  Object.defineProperty(this, "propertyFlags", {
    value: propertyFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ModelProperty.prototype, "superName", {
  get: function (this: ModelProperty<Model, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ModelProperty.prototype.bindSuperProperty = function (this: ModelProperty<Model, unknown>): void {
  let model = this.owner;
  if (model.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentModel = model.parentModel;
        if (parentModel !== null) {
          model = parentModel;
          const superProperty = model.getLazyModelProperty(superName);
          if (superProperty !== null) {
            Object.defineProperty(this, "superProperty", {
              value: superProperty,
              enumerable: true,
              configurable: true,
            });
            superProperty.addSubProperty(this);
            if (this.isInherited()) {
              Object.defineProperty(this, "state", {
                value: superProperty.state,
                enumerable: true,
                configurable: true,
              });
              this.setPropertyFlags(this.propertyFlags | ModelProperty.UpdatedFlag);
              this.owner.requireUpdate(Model.NeedsMutate);
              const traitProperties = this.traitProperties;
              for (let i = 0, n = traitProperties.length; i < n; i += 1) {
                const traitProperty = traitProperties[i]!;
                traitProperty.setPropertyFlags(traitProperty.propertyFlags | ModelProperty.UpdatedFlag);
                traitProperty.mutate();
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

ModelProperty.prototype.unbindSuperProperty = function (this: ModelProperty<Model, unknown>): void {
  const superProperty = this.superProperty;
  if (superProperty !== null) {
    superProperty.removeSubProperty(this);
    Object.defineProperty(this, "superProperty", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }
};

ModelProperty.prototype.addSubProperty = function <T>(this: ModelProperty<Model, T>, subProperty: ModelProperty<Model, T>): void {
  let subProperties = this.subProperties;
  if (subProperties === null) {
    subProperties = [];
    Object.defineProperty(this, "subProperties", {
      value: subProperties,
      enumerable: true,
      configurable: true,
    });
  }
  subProperties.push(subProperty);
};

ModelProperty.prototype.removeSubProperty = function <T>(this: ModelProperty<Model, T>, subProperty: ModelProperty<Model, T>): void {
  const subProperties = this.subProperties;
  if (subProperties !== null) {
    const index = subProperties.indexOf(subProperty);
    if (index >= 0) {
      subProperties.splice(index, 1);
    }
  }
};

ModelProperty.prototype.addTraitProperty = function <T>(this: ModelProperty<Model, T>, traitProperty: TraitProperty<Trait, T>): void {
  Object.defineProperty(this, "traitProperties", {
    value: Arrays.inserted(traitProperty, this.traitProperties),
    enumerable: true,
    configurable: true,
  });
};

ModelProperty.prototype.removeTraitProperty = function <T>(this: ModelProperty<Model, T>, traitProperty: TraitProperty<Trait, T>): void {
  Object.defineProperty(this, "traitProperties", {
    value: Arrays.removed(traitProperty, this.traitProperties),
    enumerable: true,
    configurable: true,
  });
};

ModelProperty.prototype.isAuto = function (this: ModelProperty<Model, unknown>): boolean {
  return (this.propertyFlags & ModelProperty.OverrideFlag) === 0;
};

ModelProperty.prototype.setAuto = function (this: ModelProperty<Model, unknown>, auto: boolean): void {
  if (auto && (this.propertyFlags & ModelProperty.OverrideFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ModelProperty.OverrideFlag);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags & ~ModelProperty.OverrideFlag);
    }
  } else if (!auto && (this.propertyFlags & ModelProperty.OverrideFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ModelProperty.OverrideFlag);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags | ModelProperty.OverrideFlag);
    }
  }
};

ModelProperty.prototype.isUpdated = function (this: ModelProperty<Model, unknown>): boolean {
  return (this.propertyFlags & ModelProperty.UpdatedFlag) !== 0;
};

Object.defineProperty(ModelProperty.prototype, "ownState", {
  get: function <T>(this: ModelProperty<Model, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ModelProperty.prototype, "superState", {
  get: function <T>(this: ModelProperty<Model, T>): T | undefined {
    const superProperty = this.superProperty;
    return superProperty !== null ? superProperty.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ModelProperty.prototype.getState = function <T, U>(this: ModelProperty<Model, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ModelProperty.prototype.getStateOr = function <T, U, E>(this: ModelProperty<Model, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ModelProperty.prototype.setState = function <T, U>(this: ModelProperty<Model, T, U>, state: T | U): void {
  if ((this.propertyFlags & ModelProperty.OverrideFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ModelProperty.OverrideFlag);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags | ModelProperty.OverrideFlag);
    }
  }
  this.setOwnState(state);
};

ModelProperty.prototype.willSetState = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelProperty.prototype.onSetState = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelProperty.prototype.didSetState = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelProperty.prototype.setAutoState = function <T, U>(this: ModelProperty<Model, T, U>, state: T | U): void {
  if ((this.propertyFlags & ModelProperty.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ModelProperty.prototype.setOwnState = function <T, U>(this: ModelProperty<Model, T, U>, newState: T | U): void {
  const oldState = this.state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  if ((this.propertyFlags & ModelProperty.InheritedFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ModelProperty.InheritedFlag);
    const traitProperties = this.traitProperties;
    for (let i = 0, n = traitProperties.length; i < n; i += 1) {
      const traitProperty = traitProperties[i]!;
      traitProperty.setPropertyFlags(traitProperty.propertyFlags & ~ModelProperty.InheritedFlag);
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
    this.setPropertyFlags(this.propertyFlags | ModelProperty.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubProperties(newState as T, oldState);
    this.updateTraitPropertys(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ModelProperty.prototype.setBaseState = function <T, U>(this: ModelProperty<Model, T, U>, state: T | U): void {
  let superProperty: ModelProperty<Model, T> | null | undefined;
  if (this.isInherited() && (superProperty = this.superProperty, superProperty !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superProperty.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ModelProperty.prototype, "updatedState", {
  get: function <T>(this: ModelProperty<Model, T>): T | undefined {
    if ((this.propertyFlags & ModelProperty.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ModelProperty.prototype.takeUpdatedState = function <T>(this: ModelProperty<Model, T>): T | undefined {
  const propertyFlags = this.propertyFlags;
  if ((propertyFlags & ModelProperty.UpdatedFlag) !== 0) {
    this.setPropertyFlags(propertyFlags & ~ModelProperty.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ModelProperty.prototype.takeState = function <T>(this: ModelProperty<Model, T>): T {
  this.setPropertyFlags(this.propertyFlags & ~ModelProperty.UpdatedFlag);
  return this.state;
}

ModelProperty.prototype.onMutate = function (this: ModelProperty<Model, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ModelProperty.prototype.updateInherited = function <T>(this: ModelProperty<Model, T>): void {
  const superProperty = this.superProperty;
  if (superProperty !== null) {
    this.update(superProperty.state, this.state);
  }
};

ModelProperty.prototype.update = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setPropertyFlags(this.propertyFlags | ModelProperty.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubProperties(newState, oldState);
    this.updateTraitPropertys(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ModelProperty.prototype.willUpdate = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelProperty.prototype.onUpdate = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ModelProperty.prototype.didUpdate = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  // hook
};

ModelProperty.prototype.updateSubProperties = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  const subProperties = this.subProperties;
  for (let i = 0, n = subProperties !== null ? subProperties.length : 0; i < n; i += 1) {
    const subProperty = subProperties![i]!;
    if (subProperty.isInherited()) {
      subProperty.mutate();
    }
  }
};

ModelProperty.prototype.updateTraitPropertys = function <T>(this: ModelProperty<Model, T>, newState: T, oldState: T): void {
  const traitProperties = this.traitProperties;
  for (let i = 0, n = traitProperties.length; i < n; i += 1) {
    const traitProperty = traitProperties[i]!;
    traitProperty.mutate();
  }
};

ModelProperty.prototype.mutate = function (this: ModelProperty<Model, unknown>): void {
  this.owner.requireUpdate(Model.NeedsMutate);
};

ModelProperty.prototype.fromAny = function <T, U>(this: ModelProperty<Model, T, U>, value: T | U): T {
  return value as T;
};

ModelProperty.prototype.mount = function (this: ModelProperty<Model, unknown>): void {
  this.bindSuperProperty();
};

ModelProperty.prototype.unmount = function (this: ModelProperty<Model, unknown>): void {
  this.unbindSuperProperty();
};

ModelProperty.getClass = function (type: unknown): ModelPropertyClass | null {
  if (type === String) {
    return StringModelProperty;
  } else if (type === Boolean) {
    return BooleanModelProperty;
  } else if (type === Number) {
    return NumberModelProperty;
  }
  return null;
};

ModelProperty.define = function <M extends Model, T, U, I>(descriptor: ModelPropertyDescriptor<M, T, U, I>): ModelPropertyConstructor<M, T, U, I> {
  let _super: ModelPropertyClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ModelProperty.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ModelProperty;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedModelProperty(this: ModelProperty<M, T, U>, owner: M, propertyName: string | undefined): ModelProperty<M, T, U> {
    let _this: ModelProperty<M, T, U> = function ModelPropertyAccessor(state?: T | U): T | M {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ModelProperty<M, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, propertyName) || _this;
    return _this;
  } as unknown as ModelPropertyConstructor<M, T, U, I>;

  const _prototype = descriptor as unknown as ModelProperty<any, any> & I;
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

ModelProperty.UpdatedFlag = 1 << 0;
ModelProperty.OverrideFlag = 1 << 1;
ModelProperty.InheritedFlag = 1 << 2;
