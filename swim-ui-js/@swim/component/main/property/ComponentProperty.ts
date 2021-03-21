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
import {StringComponentProperty} from "../"; // forward import
import {BooleanComponentProperty} from "../"; // forward import
import {NumberComponentProperty} from "../"; // forward import

export type ComponentPropertyMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentProperty<any, infer T, any>} ? T : unknown;

export type ComponentPropertyMemberInit<C, K extends keyof C> =
  C extends {[P in K]: ComponentProperty<any, infer T, infer U>} ? T | U : unknown;

export type ComponentPropertyFlags = number;

export interface ComponentPropertyInit<T, U = never> {
  extends?: ComponentPropertyClass;
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

export type ComponentPropertyDescriptor<C extends Component, T, U = never, I = {}> = ComponentPropertyInit<T, U> & ThisType<ComponentProperty<C, T, U> & I> & Partial<I>;

export type ComponentPropertyDescriptorExtends<C extends Component, T, U = never, I = {}> = {extends: ComponentPropertyClass | undefined} & ComponentPropertyDescriptor<C, T, U, I>;

export type ComponentPropertyDescriptorFromAny<C extends Component, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ComponentPropertyDescriptor<C, T, U, I>;

export interface ComponentPropertyConstructor<C extends Component, T, U = never, I = {}> {
  new(owner: C, propertyName: string | undefined): ComponentProperty<C, T, U> & I;
  prototype: ComponentProperty<any, any> & I;
}

export interface ComponentPropertyClass extends Function {
  readonly prototype: ComponentProperty<any, any>;
}

export interface ComponentProperty<C extends Component, T, U = never> {
  (): T;
  (state: T | U): C;

  readonly name: string;

  readonly owner: C;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  propertyFlags: ComponentPropertyFlags;

  /** @hidden */
  setPropertyFlags(propertyFlags: ComponentPropertyFlags): void;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superProperty: ComponentProperty<Component, T> | null;

  /** @hidden */
  bindSuperProperty(): void;

  /** @hidden */
  unbindSuperProperty(): void;

  /** @hidden */
  readonly subProperties: ComponentProperty<Component, T>[] | null;

  /** @hidden */
  addSubProperty(subProperty: ComponentProperty<Component, T>): void;

  /** @hidden */
  removeSubProperty(subProperty: ComponentProperty<Component, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

  isRevising(): boolean;

  readonly state: T;

  readonly ownState: T | undefined;

  readonly superState: T | undefined;

  getState(): NonNullable<T>;

  getStateOr<E>(elseState: E): NonNullable<T> | E;

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
  updateSubProperties(newState: T, oldState: T): void;

  /** @hidden */
  revise(): void;

  updateFlags?: ComponentFlags;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;
}

export const ComponentProperty = function <C extends Component, T, U>(
    this: ComponentProperty<C, T, U> | typeof ComponentProperty,
    owner: C | ComponentPropertyDescriptor<C, T, U>,
    propertyName?: string,
  ): ComponentProperty<C, T, U> | PropertyDecorator {
  if (this instanceof ComponentProperty) { // constructor
    return ComponentPropertyConstructor.call(this as ComponentProperty<Component, unknown, unknown>, owner as C, propertyName);
  } else { // decorator factory
    return ComponentPropertyDecoratorFactory(owner as ComponentPropertyDescriptor<C, T, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, T, U = never>(owner: C, propertyName: string | undefined): ComponentProperty<C, T, U>;

  <C extends Component, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ComponentPropertyDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ComponentPropertyDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ComponentPropertyDescriptor<C, T, U>): PropertyDecorator;
  <C extends Component, T, U = never>(descriptor: ComponentPropertyDescriptorFromAny<C, T, U>): PropertyDecorator;
  <C extends Component, T, U = never, I = {}>(descriptor: ComponentPropertyDescriptorExtends<C, T, U, I>): PropertyDecorator;
  <C extends Component, T, U = never>(descriptor: ComponentPropertyDescriptor<C, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentProperty<any, any>;

  /** @hidden */
  getConstructor(type: unknown): ComponentPropertyClass | null;

  define<C extends Component, T, U = never, I = {}>(descriptor: ComponentPropertyDescriptorExtends<C, T, U, I>): ComponentPropertyConstructor<C, T, U, I>;
  define<C extends Component, T, U = never>(descriptor: ComponentPropertyDescriptor<C, T, U>): ComponentPropertyConstructor<C, T, U>;

  /** @hidden */
  UpdatedFlag: ComponentPropertyFlags;
  /** @hidden */
  OverrideFlag: ComponentPropertyFlags;
  /** @hidden */
  InheritedFlag: ComponentPropertyFlags;
};
__extends(ComponentProperty, Object);

function ComponentPropertyConstructor<C extends Component, T, U>(this: ComponentProperty<C, T, U>, owner: C, propertyName: string | undefined): ComponentProperty<C, T, U> {
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
  let propertyFlags = ComponentProperty.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    state = this.fromAny(this.initState());
  }
  if (this.inherit !== false) {
    propertyFlags |= ComponentProperty.InheritedFlag;
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
  Object.defineProperty(this, "state", {
    value: state,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentPropertyDecoratorFactory<C extends Component, T, U>(descriptor: ComponentPropertyDescriptor<C, T, U>): PropertyDecorator {
  return Component.decorateComponentProperty.bind(Component, ComponentProperty.define(descriptor as ComponentPropertyDescriptor<Component, unknown>));
}

ComponentProperty.prototype.setInherit = function (this: ComponentProperty<Component, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperProperty();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperProperty();
      if ((this.propertyFlags & ComponentProperty.OverrideFlag) === 0) {
        this.setPropertyFlags(this.propertyFlags | (ComponentProperty.UpdatedFlag | ComponentProperty.InheritedFlag));
        this.revise();
      }
    } else if (this.inherit !== false) {
      this.setPropertyFlags(this.propertyFlags & ~ComponentProperty.InheritedFlag);
    }
  }
};

ComponentProperty.prototype.isInherited = function (this: ComponentProperty<Component, unknown>): boolean {
  return (this.propertyFlags & ComponentProperty.InheritedFlag) !== 0;
};

ComponentProperty.prototype.setInherited = function (this: ComponentProperty<Component, unknown>, inherited: boolean): void {
  if (inherited && (this.propertyFlags & ComponentProperty.InheritedFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ComponentProperty.InheritedFlag);
    this.revise();
  } else if (!inherited && (this.propertyFlags & ComponentProperty.InheritedFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ComponentProperty.InheritedFlag);
    this.revise();
  }
};

ComponentProperty.prototype.setPropertyFlags = function (this: ComponentProperty<Component, unknown>, propertyFlags: ComponentPropertyFlags): void {
  Object.defineProperty(this, "propertyFlags", {
    value: propertyFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ComponentProperty.prototype, "superName", {
  get: function (this: ComponentProperty<Component, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ComponentProperty.prototype.bindSuperProperty = function (this: ComponentProperty<Component, unknown>): void {
  let component = this.owner;
  if (component.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      do {
        const parentComponent = component.parentComponent;
        if (parentComponent !== null) {
          component = parentComponent;
          const superProperty = component.getLazyComponentProperty(superName);
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
              this.setPropertyFlags(this.propertyFlags | ComponentProperty.UpdatedFlag);
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

ComponentProperty.prototype.unbindSuperProperty = function (this: ComponentProperty<Component, unknown>): void {
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

ComponentProperty.prototype.addSubProperty = function <T>(this: ComponentProperty<Component, T>, subProperty: ComponentProperty<Component, T>): void {
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

ComponentProperty.prototype.removeSubProperty = function <T>(this: ComponentProperty<Component, T>, subProperty: ComponentProperty<Component, T>): void {
  const subProperties = this.subProperties;
  if (subProperties !== null) {
    const index = subProperties.indexOf(subProperty);
    if (index >= 0) {
      subProperties.splice(index, 1);
    }
  }
};

ComponentProperty.prototype.isAuto = function (this: ComponentProperty<Component, unknown>): boolean {
  return (this.propertyFlags & ComponentProperty.OverrideFlag) === 0;
};

ComponentProperty.prototype.setAuto = function (this: ComponentProperty<Component, unknown>, auto: boolean): void {
  if (auto && (this.propertyFlags & ComponentProperty.OverrideFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ComponentProperty.OverrideFlag);
  } else if (!auto && (this.propertyFlags & ComponentProperty.OverrideFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ComponentProperty.OverrideFlag);
  }
};

ComponentProperty.prototype.isUpdated = function (this: ComponentProperty<Component, unknown>): boolean {
  return (this.propertyFlags & ComponentProperty.UpdatedFlag) !== 0;
};

Object.defineProperty(ComponentProperty.prototype, "ownState", {
  get: function <T>(this: ComponentProperty<Component, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentProperty.prototype, "superState", {
  get: function <T>(this: ComponentProperty<Component, T>): T | undefined {
    const superProperty = this.superProperty;
    return superProperty !== null ? superProperty.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ComponentProperty.prototype.getState = function <T, U>(this: ComponentProperty<Component, T, U>): NonNullable<T> {
  const state = this.state;
  if (state === void 0 || state === null) {
    throw new TypeError(state + " " + this.name + " state");
  }
  return state as NonNullable<T>;
};

ComponentProperty.prototype.getStateOr = function <T, U, E>(this: ComponentProperty<Component, T, U>, elseState: E): NonNullable<T> | E {
  let state: T | E = this.state;
  if (state === void 0 || state === null) {
    state = elseState;
  }
  return state as NonNullable<T> | E;
};

ComponentProperty.prototype.setState = function <T, U>(this: ComponentProperty<Component, T, U>, state: T | U): void {
  this.setPropertyFlags(this.propertyFlags | ComponentProperty.OverrideFlag);
  this.setOwnState(state);
};

ComponentProperty.prototype.willSetState = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentProperty.prototype.onSetState = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentProperty.prototype.didSetState = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentProperty.prototype.setAutoState = function <T, U>(this: ComponentProperty<Component, T, U>, state: T | U): void {
  if ((this.propertyFlags & ComponentProperty.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ComponentProperty.prototype.setOwnState = function <T, U>(this: ComponentProperty<Component, T, U>, newState: T | U): void {
  const oldState = this.state;
  newState = this.fromAny(newState);
  this.setPropertyFlags(this.propertyFlags & ~ComponentProperty.InheritedFlag);
  if (!Equals(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    Object.defineProperty(this, "state", {
      value: newState as T,
      enumerable: true,
      configurable: true,
    });
    this.setPropertyFlags(this.propertyFlags | ComponentProperty.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubProperties(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ComponentProperty.prototype.setBaseState = function <T, U>(this: ComponentProperty<Component, T, U>, state: T | U): void {
  let superProperty: ComponentProperty<Component, T> | null | undefined;
  if (this.isInherited() && (superProperty = this.superProperty, superProperty !== null)) {
    state = this.fromAny(state);
    superProperty.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ComponentProperty.prototype, "updatedState", {
  get: function <T>(this: ComponentProperty<Component, T>): T | undefined {
    if ((this.propertyFlags & ComponentProperty.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ComponentProperty.prototype.takeUpdatedState = function <T>(this: ComponentProperty<Component, T>): T | undefined {
  const propertyFlags = this.propertyFlags;
  if ((propertyFlags & ComponentProperty.UpdatedFlag) !== 0) {
    this.setPropertyFlags(propertyFlags & ~ComponentProperty.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ComponentProperty.prototype.takeState = function <T>(this: ComponentProperty<Component, T>): T {
  this.setPropertyFlags(this.propertyFlags & ~ComponentProperty.UpdatedFlag);
  return this.state;
}

ComponentProperty.prototype.onRevise = function (this: ComponentProperty<Component, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ComponentProperty.prototype.updateInherited = function <T>(this: ComponentProperty<Component, T>): void {
  const superProperty = this.superProperty;
  if (superProperty !== null) {
    this.update(superProperty.state, this.state);
  }
};

ComponentProperty.prototype.update = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setPropertyFlags(this.propertyFlags | ComponentProperty.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubProperties(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ComponentProperty.prototype.willUpdate = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentProperty.prototype.onUpdate = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ComponentProperty.prototype.didUpdate = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  // hook
};

ComponentProperty.prototype.updateSubProperties = function <T>(this: ComponentProperty<Component, T>, newState: T, oldState: T): void {
  const subProperties = this.subProperties;
  for (let i = 0, n = subProperties !== null ? subProperties.length : 0; i < n; i += 1) {
    const subProperty = subProperties![i]!;
    if (subProperty.isInherited()) {
      subProperty.revise();
    }
  }
};

ComponentProperty.prototype.revise = function (this: ComponentProperty<Component, unknown>): void {
  this.owner.requireUpdate(Component.NeedsRevise);
};

ComponentProperty.prototype.fromAny = function <T, U>(this: ComponentProperty<Component, T, U>, value: T | U): T {
  return value as T;
};

ComponentProperty.prototype.mount = function (this: ComponentProperty<Component, unknown>): void {
  this.bindSuperProperty();
};

ComponentProperty.prototype.unmount = function (this: ComponentProperty<Component, unknown>): void {
  this.unbindSuperProperty();
};

ComponentProperty.getConstructor = function (type: unknown): ComponentPropertyClass | null {
  if (type === String) {
    return StringComponentProperty;
  } else if (type === Boolean) {
    return BooleanComponentProperty;
  } else if (type === Number) {
    return NumberComponentProperty;
  }
  return null;
};

ComponentProperty.define = function <C extends Component, T, U, I>(descriptor: ComponentPropertyDescriptor<C, T, U, I>): ComponentPropertyConstructor<C, T, U, I> {
  let _super: ComponentPropertyClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;

  if (_super === void 0) {
    _super = ComponentProperty.getConstructor(descriptor.type);
  }
  if (_super === null) {
    _super = ComponentProperty;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedComponentProperty(this: ComponentProperty<C, T, U>, owner: C, propertyName: string | undefined): ComponentProperty<C, T, U> {
    let _this: ComponentProperty<C, T, U> = function ComponentPropertyAccessor(state?: T | U): T | C {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ComponentProperty<C, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, propertyName) || _this;
    return _this;
  } as unknown as ComponentPropertyConstructor<C, T, U, I>;

  const _prototype = descriptor as unknown as ComponentProperty<any, any> & I;
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

ComponentProperty.UpdatedFlag = 1 << 0;
ComponentProperty.OverrideFlag = 1 << 1;
ComponentProperty.InheritedFlag = 1 << 2;
