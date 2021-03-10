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
import {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewFlags, View} from "../View";
import {StringViewProperty} from "../"; // forward import
import {BooleanViewProperty} from "../"; // forward import
import {NumberViewProperty} from "../"; // forward import

export type ViewPropertyMemberType<V, K extends keyof V> =
  V extends {[P in K]: ViewProperty<any, infer T, any>} ? T : unknown;

export type ViewPropertyMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ViewProperty<any, infer T, infer U>} ? T | U : unknown;

export type ViewPropertyFlags = number;

export interface ViewPropertyInit<T, U = never> {
  extends?: ViewPropertyClass;
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

export type ViewPropertyDescriptor<V extends View, T, U = never, I = {}> = ViewPropertyInit<T, U> & ThisType<ViewProperty<V, T, U> & I> & Partial<I>;

export type ViewPropertyDescriptorExtends<V extends View, T, U = never, I = {}> = {extends: ViewPropertyClass | undefined} & ViewPropertyDescriptor<V, T, U, I>;

export type ViewPropertyDescriptorFromAny<V extends View, T, U = never, I = {}> = ({type: FromAny<T, U>} | {fromAny(value: T | U): T}) & ViewPropertyDescriptor<V, T, U, I>;

export interface ViewPropertyConstructor<V extends View, T, U = never, I = {}> {
  new(owner: V, propertyName: string | undefined): ViewProperty<V, T, U> & I;
  prototype: ViewProperty<any, any> & I;
}

export interface ViewPropertyClass extends Function {
  readonly prototype: ViewProperty<any, any>;
}

export interface ViewProperty<V extends View, T, U = never> {
  (): T;
  (state: T | U): V;

  readonly name: string;

  readonly owner: V;

  readonly inherit: string | boolean;

  setInherit(inherit: string | boolean): void;

  isInherited(): boolean;

  setInherited(inherited: boolean): void;

  /** @hidden */
  propertyFlags: ViewPropertyFlags;

  /** @hidden */
  setPropertyFlags(propertyFlags: ViewPropertyFlags): void;

  /** @hidden */
  readonly superName: string | undefined;

  readonly superProperty: ViewProperty<View, T> | null;

  /** @hidden */
  bindSuperProperty(): void;

  /** @hidden */
  unbindSuperProperty(): void;

  /** @hidden */
  readonly subProperties: ViewProperty<View, T>[] | null;

  /** @hidden */
  addSubProperty(subProperty: ViewProperty<View, T>): void;

  /** @hidden */
  removeSubProperty(subProperty: ViewProperty<View, T>): void;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  isUpdated(): boolean;

  readonly state: T;

  readonly ownState: T | undefined;

  readonly superState: T | undefined;

  getState(): T extends undefined ? never : T;

  getStateOr<E>(elseState: E): (T extends undefined ? never : T) | E;

  setState(state: T | U): void;

  willSetState(newState: T, oldState: T): void;

  onSetState(newState: T, oldState: T): void;

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
  updateSubProperties(newState: T, oldState: T): void;

  /** @hidden */
  change(): void;

  updateFlags?: ViewFlags;

  fromAny(value: T | U): T;

  /** @hidden */
  initState?(): T | U;

  isMounted(): boolean;

  /** @hidden */
  mount(): void;

  /** @hidden */
  willMount(): void;

  /** @hidden */
  onMount(): void;

  /** @hidden */
  didMount(): void;

  /** @hidden */
  unmount(): void;

  /** @hidden */
  willUnmount(): void;

  /** @hidden */
  onUnmount(): void;

  /** @hidden */
  didUnmount(): void;

  toString(): string;
}

export const ViewProperty = function <V extends View, T, U>(
    this: ViewProperty<V, T, U> | typeof ViewProperty,
    owner: V | ViewPropertyDescriptor<V, T, U>,
    propertyName?: string,
  ): ViewProperty<V, T, U> | PropertyDecorator {
  if (this instanceof ViewProperty) { // constructor
    return ViewPropertyConstructor.call(this as ViewProperty<View, unknown, unknown>, owner as V, propertyName);
  } else { // decorator factory
    return ViewPropertyDecoratorFactory(owner as ViewPropertyDescriptor<V, T, U>);
  }
} as {
  /** @hidden */
  new<V extends View, T, U = never>(owner: V, propertyName: string | undefined): ViewProperty<V, T, U>;

  <V extends View, T extends string | undefined = string | undefined, U extends string | undefined = string | undefined>(descriptor: {type: typeof String} & ViewPropertyDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends boolean | undefined = boolean | undefined, U extends boolean | string | undefined = boolean | string | undefined>(descriptor: {type: typeof Boolean} & ViewPropertyDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T extends number | undefined = number | undefined, U extends number | string | undefined = number | string | undefined>(descriptor: {type: typeof Number} & ViewPropertyDescriptor<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewPropertyDescriptorFromAny<V, T, U>): PropertyDecorator;
  <V extends View, T, U = never, I = {}>(descriptor: ViewPropertyDescriptorExtends<V, T, U, I>): PropertyDecorator;
  <V extends View, T, U = never>(descriptor: ViewPropertyDescriptor<V, T, U>): PropertyDecorator;

  /** @hidden */
  prototype: ViewProperty<any, any>;

  /** @hidden */
  getClass(type: unknown): ViewPropertyClass | null;

  define<V extends View, T, U = never, I = {}>(descriptor: ViewPropertyDescriptorExtends<V, T, U, I>): ViewPropertyConstructor<V, T, U, I>;
  define<V extends View, T, U = never>(descriptor: ViewPropertyDescriptor<V, T, U>): ViewPropertyConstructor<V, T, U>;

  /** @hidden */
  MountedFlag: ViewPropertyFlags;
  /** @hidden */
  UpdatedFlag: ViewPropertyFlags;
  /** @hidden */
  OverrideFlag: ViewPropertyFlags;
  /** @hidden */
  InheritedFlag: ViewPropertyFlags;
  /** @hidden */
  ConstrainedFlag: ViewPropertyFlags;
  /** @hidden */
  ConstrainingFlag: ViewPropertyFlags;
};
__extends(ViewProperty, Object);

function ViewPropertyConstructor<V extends View, T, U>(this: ViewProperty<V, T, U>, owner: V, propertyName: string | undefined): ViewProperty<V, T, U> {
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
  let propertyFlags = ViewProperty.UpdatedFlag;
  let state: T | undefined;
  if (this.initState !== void 0) {
    const initState = this.initState();
    if (initState !== void 0) {
      state = this.fromAny(initState);
    }
  } else if (this.inherit !== false) {
    propertyFlags |= ViewProperty.InheritedFlag;
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

function ViewPropertyDecoratorFactory<V extends View, T, U>(descriptor: ViewPropertyDescriptor<V, T, U>): PropertyDecorator {
  return View.decorateViewProperty.bind(View, ViewProperty.define(descriptor as ViewPropertyDescriptor<View, unknown>));
}

ViewProperty.prototype.setInherit = function (this: ViewProperty<View, unknown>, inherit: string | boolean): void {
  if (this.inherit !== inherit) {
    this.unbindSuperProperty();
    Object.defineProperty(this, "inherit", {
      value: inherit,
      enumerable: true,
      configurable: true,
    });
    if (inherit !== false) {
      this.bindSuperProperty();
      if ((this.propertyFlags & ViewProperty.OverrideFlag) === 0) {
        this.setPropertyFlags(this.propertyFlags | (ViewProperty.UpdatedFlag | ViewProperty.InheritedFlag));
        this.change();
      }
    } else if (this.inherit !== false) {
      this.setPropertyFlags(this.propertyFlags & ~ViewProperty.InheritedFlag);
    }
  }
};

ViewProperty.prototype.isInherited = function (this: ViewProperty<View, unknown>): boolean {
  return (this.propertyFlags & ViewProperty.InheritedFlag) !== 0;
};

ViewProperty.prototype.setInherited = function (this: ViewProperty<View, unknown>, inherited: boolean): void {
  if (inherited && (this.propertyFlags & ViewProperty.InheritedFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ViewProperty.InheritedFlag);
    this.change();
  } else if (!inherited && (this.propertyFlags & ViewProperty.InheritedFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ViewProperty.InheritedFlag);
    this.change();
  }
};

ViewProperty.prototype.setPropertyFlags = function (this: ViewProperty<View, unknown>, propertyFlags: ViewPropertyFlags): void {
  Object.defineProperty(this, "propertyFlags", {
    value: propertyFlags,
    enumerable: true,
    configurable: true,
  });
};

Object.defineProperty(ViewProperty.prototype, "superName", {
  get: function (this: ViewProperty<View, unknown>): string | undefined {
    const inherit = this.inherit;
    return typeof inherit === "string" ? inherit : inherit === true ? this.name : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewProperty.prototype.bindSuperProperty = function (this: ViewProperty<View, unknown>): void {
  if (this.isMounted()) {
    const superName = this.superName;
    if (superName !== void 0) {
      let view = this.owner;
      do {
        const parentView = view.parentView;
        if (parentView !== null) {
          view = parentView;
          const superProperty = view.getLazyViewProperty(superName);
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
              this.setPropertyFlags(this.propertyFlags | ViewProperty.UpdatedFlag);
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

ViewProperty.prototype.unbindSuperProperty = function (this: ViewProperty<View, unknown>): void {
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

ViewProperty.prototype.addSubProperty = function <T>(this: ViewProperty<View, T>, subProperty: ViewProperty<View, T>): void {
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

ViewProperty.prototype.removeSubProperty = function <T>(this: ViewProperty<View, T>, subProperty: ViewProperty<View, T>): void {
  const subProperties = this.subProperties;
  if (subProperties !== null) {
    const index = subProperties.indexOf(subProperty);
    if (index >= 0) {
      subProperties.splice(index, 1);
    }
  }
};

ViewProperty.prototype.isAuto = function (this: ViewProperty<View, unknown>): boolean {
  return (this.propertyFlags & ViewProperty.OverrideFlag) === 0;
};

ViewProperty.prototype.setAuto = function (this: ViewProperty<View, unknown>, auto: boolean): void {
  if (auto && (this.propertyFlags & ViewProperty.OverrideFlag) !== 0) {
    this.setPropertyFlags(this.propertyFlags & ~ViewProperty.OverrideFlag);
  } else if (!auto && (this.propertyFlags & ViewProperty.OverrideFlag) === 0) {
    this.setPropertyFlags(this.propertyFlags | ViewProperty.OverrideFlag);
  }
};

ViewProperty.prototype.isUpdated = function (this: ViewProperty<View, unknown>): boolean {
  return (this.propertyFlags & ViewProperty.UpdatedFlag) !== 0;
};

Object.defineProperty(ViewProperty.prototype, "ownState", {
  get: function <T>(this: ViewProperty<View, T>): T | undefined {
    return !this.isInherited() ? this.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ViewProperty.prototype, "superState", {
  get: function <T>(this: ViewProperty<View, T>): T | undefined {
    const superProperty = this.superProperty;
    return superProperty !== null ? superProperty.state : void 0;
  },
  enumerable: true,
  configurable: true,
});

ViewProperty.prototype.getState = function <T, U>(this: ViewProperty<View, T, U>): T extends undefined ? never : T {
  const state = this.state;
  if (state === void 0) {
    throw new TypeError("undefined " + this.name + " state");
  }
  return state as T extends undefined ? never : T;
};

ViewProperty.prototype.getStateOr = function <T, U, E>(this: ViewProperty<View, T, U>, elseState: E): (T extends undefined ? never : T) | E {
  let state: T | E | undefined = this.state;
  if (state === void 0) {
    state = elseState;
  }
  return state as (T extends undefined ? never : T) | E;
};

ViewProperty.prototype.setState = function <T, U>(this: ViewProperty<View, T, U>, state: T | U): void {
  this.setPropertyFlags(this.propertyFlags | ViewProperty.OverrideFlag);
  this.setOwnState(state);
};

ViewProperty.prototype.willSetState = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewProperty.prototype.onSetState = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewProperty.prototype.didSetState = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewProperty.prototype.setAutoState = function <T, U>(this: ViewProperty<View, T, U>, state: T | U): void {
  if ((this.propertyFlags & ViewProperty.OverrideFlag) === 0) {
    this.setOwnState(state);
  }
};

ViewProperty.prototype.setOwnState = function <T, U>(this: ViewProperty<View, T, U>, newState: T | U): void {
  const oldState = this.state;
  if (newState !== void 0) {
    newState = this.fromAny(newState);
  }
  this.setPropertyFlags(this.propertyFlags & ~ViewProperty.InheritedFlag);
  if (!Equals(oldState, newState)) {
    this.willSetState(newState as T, oldState);
    this.willUpdate(newState as T, oldState);
    Object.defineProperty(this, "state", {
      value: newState as T,
      enumerable: true,
      configurable: true,
    });
    this.setPropertyFlags(this.propertyFlags | ViewProperty.UpdatedFlag);
    this.onSetState(newState as T, oldState);
    this.onUpdate(newState as T, oldState);
    this.updateSubProperties(newState as T, oldState);
    this.didUpdate(newState as T, oldState);
    this.didSetState(newState as T, oldState);
  }
};

ViewProperty.prototype.setBaseState = function <T, U>(this: ViewProperty<View, T, U>, state: T | U): void {
  let superProperty: ViewProperty<View, T> | null;
  if (this.isInherited() && (superProperty = this.superProperty, superProperty !== null)) {
    if (state !== void 0) {
      state = this.fromAny(state);
    }
    superProperty.setBaseState(state as T);
  } else {
    this.setState(state);
  }
};

Object.defineProperty(ViewProperty.prototype, "updatedState", {
  get: function <T>(this: ViewProperty<View, T>): T | undefined {
    if ((this.propertyFlags & ViewProperty.UpdatedFlag) !== 0) {
      return this.state;
    } else {
      return void 0;
    }
  },
  enumerable: true,
  configurable: true,
});

ViewProperty.prototype.takeUpdatedState = function <T>(this: ViewProperty<View, T>): T | undefined {
  const propertyFlags = this.propertyFlags;
  if ((propertyFlags & ViewProperty.UpdatedFlag) !== 0) {
    this.setPropertyFlags(propertyFlags & ~ViewProperty.UpdatedFlag);
    return this.state;
  } else {
    return void 0;
  }
}

ViewProperty.prototype.takeState = function <T>(this: ViewProperty<View, T>): T {
  this.setPropertyFlags(this.propertyFlags & ~ViewProperty.UpdatedFlag);
  return this.state;
}

ViewProperty.prototype.onChange = function (this: ViewProperty<View, unknown>): void {
  if (this.isInherited()) {
    this.updateInherited();
  }
};

ViewProperty.prototype.updateInherited = function (this: ViewProperty<View, unknown>): void {
  const superProperty = this.superProperty;
  if (superProperty !== null) {
    this.update(superProperty.state, this.state);
  }
};

ViewProperty.prototype.update = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  if (!Equals(oldState, newState)) {
    this.willUpdate(newState, oldState);
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    this.setPropertyFlags(this.propertyFlags | ViewProperty.UpdatedFlag);
    this.onUpdate(newState, oldState);
    this.updateSubProperties(newState, oldState);
    this.didUpdate(newState, oldState);
  }
};

ViewProperty.prototype.willUpdate = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewProperty.prototype.onUpdate = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  const updateFlags = this.updateFlags;
  if (updateFlags !== void 0) {
    this.owner.requireUpdate(updateFlags);
  }
};

ViewProperty.prototype.didUpdate = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  // hook
};

ViewProperty.prototype.updateSubProperties = function <T>(this: ViewProperty<View, T>, newState: T, oldState: T): void {
  const subProperties = this.subProperties;
  for (let i = 0, n = subProperties !== null ? subProperties.length : 0; i < n; i += 1) {
    const subProperty = subProperties![i]!;
    if (subProperty.isInherited()) {
      subProperty.change();
    }
  }
};

ViewProperty.prototype.change = function (this: ViewProperty<View, unknown>): void {
  this.owner.requireUpdate(View.NeedsChange);
};

ViewProperty.prototype.fromAny = function <T, U>(this: ViewProperty<View, T, U>, value: T | U): T {
  return value as T;
};

ViewProperty.prototype.isMounted = function (this: ViewProperty<View, unknown>): boolean {
  return (this.propertyFlags & ViewProperty.MountedFlag) !== 0;
};

ViewProperty.prototype.mount = function (this: ViewProperty<View, unknown>): void {
  if ((this.propertyFlags & ViewProperty.MountedFlag) === 0) {
    this.willMount();
    this.setPropertyFlags(this.propertyFlags | ViewProperty.MountedFlag);
    this.onMount();
    this.didMount();
  }
};

ViewProperty.prototype.willMount = function (this: ViewProperty<View, unknown>): void {
  // hook
};

ViewProperty.prototype.onMount = function (this: ViewProperty<View, unknown>): void {
  this.bindSuperProperty();
};

ViewProperty.prototype.didMount = function (this: ViewProperty<View, unknown>): void {
  // hook
};

ViewProperty.prototype.unmount = function (this: ViewProperty<View, unknown>): void {
  if ((this.propertyFlags & ViewProperty.MountedFlag) !== 0) {
    this.willUnmount();
    this.setPropertyFlags(this.propertyFlags & ~ViewProperty.MountedFlag);
    this.onUnmount();
    this.didUnmount();
  }
};

ViewProperty.prototype.willUnmount = function (this: ViewProperty<View, unknown>): void {
  // hook
};

ViewProperty.prototype.onUnmount = function (this: ViewProperty<View, unknown>): void {
  this.unbindSuperProperty();
};

ViewProperty.prototype.didUnmount = function (this: ViewProperty<View, unknown>): void {
  // hook
};

ViewProperty.prototype.toString = function (this: ViewProperty<View, unknown>): string {
  return this.name;
};

ViewProperty.getClass = function (type: unknown): ViewPropertyClass | null {
  if (type === String) {
    return StringViewProperty;
  } else if (type === Boolean) {
    return BooleanViewProperty;
  } else if (type === Number) {
    return NumberViewProperty;
  }
  return null;
};

ViewProperty.define = function <V extends View, T, U, I>(descriptor: ViewPropertyDescriptor<V, T, U, I>): ViewPropertyConstructor<V, T, U, I> {
  let _super: ViewPropertyClass | null | undefined = descriptor.extends;
  const state = descriptor.state;
  const inherit = descriptor.inherit;
  const initState = descriptor.initState;
  delete descriptor.extends;
  delete descriptor.state;
  delete descriptor.inherit;

  if (_super === void 0) {
    _super = ViewProperty.getClass(descriptor.type);
  }
  if (_super === null) {
    _super = ViewProperty;
    if (descriptor.fromAny === void 0 && FromAny.is<T, U>(descriptor.type)) {
      descriptor.fromAny = descriptor.type.fromAny;
    }
  }

  const _constructor = function DecoratedViewProperty(this: ViewProperty<V, T, U>, owner: V, propertyName: string | undefined): ViewProperty<V, T, U> {
    let _this: ViewProperty<V, T, U> = function ViewPropertyAccessor(state?: T | U): T | V {
      if (arguments.length === 0) {
        return _this.state;
      } else {
        _this.setState(state!);
        return _this.owner;
      }
    } as ViewProperty<V, T, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, propertyName) || _this;
    return _this;
  } as unknown as ViewPropertyConstructor<V, T, U, I>;

  const _prototype = descriptor as unknown as ViewProperty<any, any> & I;
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

ViewProperty.MountedFlag = 1 << 0;
ViewProperty.UpdatedFlag = 1 << 1;
ViewProperty.OverrideFlag = 1 << 2;
ViewProperty.InheritedFlag = 1 << 3;
ViewProperty.ConstrainedFlag = 1 << 4;
ViewProperty.ConstrainingFlag = 1 << 5;

ViewProperty({extends: void 0, type: MoodVector, inherit: true})(View.prototype, "mood");
ViewProperty({extends: void 0, type: ThemeMatrix, inherit: true})(View.prototype, "theme");
