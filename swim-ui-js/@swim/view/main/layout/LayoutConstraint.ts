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
import {ConstrainVariable, AnyConstraintStrength, ConstraintStrength} from "@swim/constraint";
import {View} from "../View";

export interface LayoutConstraintInit {
  extends?: LayoutConstraintClass;
  value?: number;
  strength?: AnyConstraintStrength;
  constrained?: boolean;

  getState?(oldState: number): number;
  setValue?(newValue: number): void;
  initValue?(): number;
}

export type LayoutConstraintDescriptor<V extends View, I = {}> = LayoutConstraintInit & ThisType<LayoutConstraint<V> & I> & I;

export type LayoutConstraintDescriptorExtends<V extends View, I = {}> = {extends: LayoutConstraintClass | undefined} & LayoutConstraintDescriptor<V, I>;

export interface LayoutConstraintConstructor<V extends View, I = {}> {
  new(owner: V, constraintName: string | undefined): LayoutConstraint<V> & I;
  prototype: LayoutConstraint<any> & I;
}

export interface LayoutConstraintClass extends Function {
  readonly prototype: LayoutConstraint<any>;
}

export interface LayoutConstraint<V extends View> extends ConstrainVariable {
  (): number;
  (state: number): V;

  readonly name: string;

  readonly owner: V;

  readonly value: number;

  updateValue(value: number): void;

  readonly state: number;

  setState(newState: number): void;

  updateState(): void;

  readonly strength: ConstraintStrength;

  setStrength(newStrength: AnyConstraintStrength): void;

  readonly constrained: boolean;

  setConstrained(constrained: boolean): void;

  /** @hidden */
  getState?(oldState: number): number;

  /** @hidden */
  setValue?(newValue: number): void;

  /** @hidden */
  initValue(): number;
}

export const LayoutConstraint = function <V extends View>(
    this: LayoutConstraint<V> | typeof LayoutConstraint,
    owner: V | LayoutConstraintDescriptor<V>,
    constraintName?: string,
  ): LayoutConstraint<V> | PropertyDecorator {
  if (this instanceof LayoutConstraint) { // constructor
    return LayoutConstraintConstructor.call(this, owner as V, constraintName);
  } else { // decorator factory
    return LayoutConstraintDecoratorFactory(owner as LayoutConstraintDescriptor<V>);
  }
} as {
  /** @hidden */
  new<V extends View>(owner: V, constraintName: string | undefined): LayoutConstraint<V>

  <V extends View, I = {}>(descriptor: LayoutConstraintDescriptorExtends<V, I>): PropertyDecorator;
  <V extends View>(descriptor: LayoutConstraintDescriptor<V>): PropertyDecorator;

  /** @hidden */
  prototype: LayoutConstraint<any>;

  define<V extends View, I = {}>(descriptor: LayoutConstraintDescriptorExtends<V, I>): LayoutConstraintConstructor<V, I>;
  define<V extends View>(descriptor: LayoutConstraintDescriptor<V>): LayoutConstraintConstructor<V>;
};
__extends(LayoutConstraint, ConstrainVariable);

function LayoutConstraintConstructor<V extends View>(this: LayoutConstraint<V>, owner: V, constraintName: string | undefined): LayoutConstraint<V> {
  const _this: LayoutConstraint<V> = (ConstrainVariable as Function).call(this) || this;
  if (constraintName !== void 0) {
    Object.defineProperty(_this, "name", {
      value: constraintName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(_this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(_this, "value", {
    value: _this.initValue(),
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "state", {
    value: NaN,
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "strength", {
    value: _this.strength ?? ConstraintStrength.Strong, // seed from prototype
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(_this, "constrained", {
    value: _this.constrained ?? false, // seed from prototype
    enumerable: true,
    configurable: true,
  });
  return _this;
}

function LayoutConstraintDecoratorFactory<V extends View>(descriptor: LayoutConstraintDescriptor<V>): PropertyDecorator {
  return View.decorateLayoutConstraint.bind(View, LayoutConstraint.define<View>(descriptor));
}

LayoutConstraint.prototype.updateValue = function (newValue: number): void {
  const oldValue = this.value;
  if (oldValue !== newValue) {
    Object.defineProperty(this, "value", {
      value: newValue,
      enumerable: true,
      configurable: true,
    });
    if (this.constrained && this.setValue !== void 0) {
      this.setValue(newValue);
    }
  }
};

LayoutConstraint.prototype.setState = function (newState: number): void {
  const oldState = this.state;
  if (isFinite(oldState) && !isFinite(newState)) {
    this.owner.removeConstraintVariable(this);
  }
  Object.defineProperty(this, "state", {
    value: newState,
    enumerable: true,
    configurable: true,
  });
  if (isFinite(newState)) {
    if (!isFinite(oldState)) {
      this.owner.addConstraintVariable(this);
    } else {
      this.owner.setConstraintVariable(this, newState);
    }
  }
};

LayoutConstraint.prototype.updateState = function (): void {
  if (!this.constrained && this.getState !== void 0) {
    const oldState = this.state;
    const newState = this.getState(oldState);
    this.setState(newState);
  }
};

LayoutConstraint.prototype.setStrength = function (newStrength: AnyConstraintStrength): void {
  const state = this.state;
  const oldStrength = this.strength;
  newStrength = ConstraintStrength.fromAny(newStrength);
  if (isFinite(state) && oldStrength !== newStrength) {
    this.owner.removeConstraintVariable(this);
  }
  Object.defineProperty(this, "strength", {
    value: newStrength,
    enumerable: true,
    configurable: true,
  });
  if (isFinite(state) && oldStrength !== newStrength) {
    this.owner.addConstraintVariable(this);
  }
};

LayoutConstraint.prototype.setConstrained = function (constrained: boolean): void {
  Object.defineProperty(this, "constrained", {
    value: constrained,
    enumerable: true,
    configurable: true,
  });
};

LayoutConstraint.prototype.initValue = function (): number {
  return NaN;
};

LayoutConstraint.define = function <V extends View, I>(descriptor: LayoutConstraintDescriptor<V, I>): LayoutConstraintConstructor<V, I> {
  let _super = descriptor.extends;
  const value = descriptor.value;
  const strength = descriptor.strength;
  const constrained = descriptor.constrained;
  const initValue = descriptor.initValue;
  delete descriptor.extends;
  delete descriptor.value;
  delete descriptor.strength;
  delete descriptor.constrained;

  if (_super === void 0) {
    _super = LayoutConstraint;
  }

  const _constructor = function DecoratedLayoutConstraint(this: LayoutConstraint<V>, owner: V, constraintName: string | undefined): LayoutConstraint<V> {
    let _this: LayoutConstraint<V> = function LayoutConstraintAccessor(state?: number): number | V {
      if (state === void 0) {
        return _this.state;
      } else {
        _this.setConstrained(true);
        _this.setState(state);
        return _this.owner;
      }
    } as LayoutConstraint<V>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, constraintName) || _this;
    return _this;
  } as unknown as LayoutConstraintConstructor<V, I>;

  const _prototype = descriptor as unknown as LayoutConstraint<any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (value !== void 0 && initValue === void 0) {
    _prototype.initValue = function (): number {
      return value;
    };
  }
  if (strength !== void 0) {
    Object.defineProperty(_prototype, "strength", {
      value: ConstraintStrength.fromAny(strength),
      enumerable: true,
      configurable: true,
    });
  }
  if (constrained !== void 0) {
    Object.defineProperty(_prototype, "constrained", {
      value: constrained,
      enumerable: true,
      configurable: true,
    });
  }

  return _constructor;
}
