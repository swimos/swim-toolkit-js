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
import type {FromAny} from "@swim/util";
import type {Model} from "../Model";
import {Trait} from "../Trait";
import type {ModelObserverType} from "../ModelObserver";

export type TraitModelMemberType<R, K extends keyof R> =
  R extends {[P in K]: TraitModel<any, infer S, any>} ? S : unknown;

export type TraitModelMemberInit<R, K extends keyof R> =
  R extends {[P in K]: TraitModel<any, infer T, infer U>} ? T | U : unknown;

export interface TraitModelInit<S extends Model, U = never> {
  extends?: TraitModelClass;
  observe?: boolean;
  child?: boolean;
  type?: unknown;

  willSetModel?(newModel: S | null, oldModel: S | null): void;
  onSetModel?(newModel: S | null, oldModel: S | null): void;
  didSetModel?(newModel: S | null, oldModel: S | null): void;
  createModel?(): S | U | null;
  insertModel?(parentModel: Model, childModel: S, key: string | undefined): void;
  fromAny?(value: S | U): S | null;
}

export type TraitModelDescriptor<R extends Trait, S extends Model, U = never, I = ModelObserverType<S>> = TraitModelInit<S, U> & ThisType<TraitModel<R, S, U> & I> & I;

export type TraitModelDescriptorExtends<R extends Trait, S extends Model, U = never, I = ModelObserverType<S>> = {extends: TraitModelClass | undefined} & TraitModelDescriptor<R, S, U, I>;

export type TraitModelDescriptorFromAny<R extends Trait, S extends Model, U = never, I = ModelObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & TraitModelDescriptor<R, S, U, I>;

export interface TraitModelConstructor<R extends Trait, S extends Model, U = never, I = ModelObserverType<S>> {
  new(owner: R, bindingName: string | undefined): TraitModel<R, S, U> & I;
  prototype: TraitModel<any, any, any> & I;
}

export interface TraitModelClass extends Function {
  readonly prototype: TraitModel<any, any, any>;
}

export declare abstract class TraitModel<R extends Trait, S extends Model, U = never> {
  /** @hidden */
  _owner: R;
  /** @hidden */
  _model: S | null;

  constructor(owner: R, bindingName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  child?: boolean;

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get owner(): R;

  get model(): S | null;

  getModel(): S;

  setModel(model: S | U | null): void;

  /** @hidden */
  doSetModel(newModel: S | null): void;

  /** @hidden */
  willSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  onSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  didSetModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  willSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  onSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  didSetOwnModel(newModel: S | null, oldModel: S | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentModel: Model, key?: string | null): S | null;
  insert(key?: string | null): S | null;

  remove(): S | null;

  createModel(): S | U | null;

  /** @hidden */
  insertModel(parentModel: Model, childModel: S, key: string | undefined): void;

  fromAny(value: S | U): S | null;

  static define<R extends Trait, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: TraitModelDescriptorExtends<R, S, U, I>): TraitModelConstructor<R, S, U>;
  static define<R extends Trait, S extends Model = Model, U = never>(descriptor: TraitModelDescriptor<R, S, U>): TraitModelConstructor<R, S, U>;
}

export interface TraitModel<R extends Trait, S extends Model, U = never> {
  (): S | null;
  (model: S | U | null): R;
}

export function TraitModel<R extends Trait, S extends Model = Model, U = never, I = ModelObserverType<S>>(descriptor: TraitModelDescriptorExtends<R, S, U, I>): PropertyDecorator;
export function TraitModel<R extends Trait, S extends Model = Model, U = never>(descriptor: TraitModelDescriptor<R, S, U>): PropertyDecorator;

export function TraitModel<R extends Trait, S extends Model, U>(
    this: TraitModel<R, S, U> | typeof TraitModel,
    owner: R | TraitModelDescriptor<R, S, U>,
    bindingName?: string,
  ): TraitModel<R, S, U> | PropertyDecorator {
  if (this instanceof TraitModel) { // constructor
    return TraitModelConstructor.call(this as unknown as TraitModel<Trait, Model, unknown>, owner as R, bindingName);
  } else { // decorator factory
    return TraitModelDecoratorFactory(owner as TraitModelDescriptor<R, S, U>);
  }
}
__extends(TraitModel, Object);

function TraitModelConstructor<R extends Trait, S extends Model, U>(this: TraitModel<R, S, U>, owner: R, bindingName: string | undefined): TraitModel<R, S, U> {
  if (bindingName !== void 0) {
    Object.defineProperty(this, "name", {
      value: bindingName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._model = null;
  return this;
}

function TraitModelDecoratorFactory<R extends Trait, S extends Model, U>(descriptor: TraitModelDescriptor<R, S, U>): PropertyDecorator {
  return Trait.decorateTraitModel.bind(Trait, TraitModel.define(descriptor as TraitModelDescriptor<Trait, Model>));
}

Object.defineProperty(TraitModel.prototype, "owner", {
  get: function <R extends Trait>(this: TraitModel<R, Model>): R {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(TraitModel.prototype, "model", {
  get: function <S extends Model>(this: TraitModel<Trait, S>): S | null {
    return this._model;
  },
  enumerable: true,
  configurable: true,
});

TraitModel.prototype.getModel = function <S extends Model>(this: TraitModel<Trait, S>): S {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

TraitModel.prototype.setModel = function <S extends Model, U>(this: TraitModel<Trait, S, U>,
                                                              model: S | U | null): void {
  if (model !== null) {
    model = this.fromAny(model);
  }
  let ownModel: Model | null | undefined;
  if (this.child === true && (ownModel = this._owner.model, ownModel !== null)) {
    if (model === null) {
      ownModel.setChildModel(this.name, null);
    } else if ((model as S).parentModel !== ownModel || (model as S).key !== this.name) {
      this.insertModel(ownModel, model as S, this.name);
    }
  } else {
    this.doSetModel(model as S | null);
  }
};

TraitModel.prototype.doSetModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                             newModel: S | null): void {
  const oldModel = this._model;
  if (oldModel !== newModel) {
    this.willSetOwnModel(newModel, oldModel);
    this.willSetModel(newModel, oldModel);
    this._model = newModel;
    this.onSetOwnModel(newModel, oldModel);
    this.onSetModel(newModel, oldModel);
    this.didSetModel(newModel, oldModel);
    this.didSetOwnModel(newModel, oldModel);
  }
};

TraitModel.prototype.willSetModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                               newModel: S | null,
                                                               oldModel: S | null): void {
  // hook
};

TraitModel.prototype.onSetModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                             newModel: S | null,
                                                             oldModel: S | null): void {
  // hook
};

TraitModel.prototype.didSetModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                              newModel: S | null,
                                                              oldModel: S | null): void {
  // hook
};

TraitModel.prototype.willSetOwnModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                                  newModel: S | null,
                                                                  oldModel: S | null): void {
  // hook
};

TraitModel.prototype.onSetOwnModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                                newModel: S | null,
                                                                oldModel: S | null): void {
  if (this.observe === true && this._owner.isMounted()) {
    if (oldModel !== null) {
      oldModel.removeModelObserver(this as ModelObserverType<S>);
    }
    if (newModel !== null) {
      newModel.addModelObserver(this as ModelObserverType<S>);
    }
  }
};

TraitModel.prototype.didSetOwnModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                                 newModel: S | null,
                                                                 oldModel: S | null): void {
  // hook
};

TraitModel.prototype.mount = function <S extends Model>(this: TraitModel<Trait, S>): void {
  const model = this._model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.prototype.unmount = function <S extends Model>(this: TraitModel<Trait, S>): void {
  const model = this._model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<S>);
  }
};

TraitModel.prototype.insert = function <S extends Model>(this: TraitModel<Trait, S>,
                                                         parentModel?: Model | string | null,
                                                         key?: string | null): S | null {
  let model = this._model;
  if (model === null) {
    model = this.createModel();
  }
  if (model !== null) {
    if (typeof parentModel === "string" || parentModel === null) {
      key = parentModel;
      parentModel = void 0;
    }
    if (parentModel === void 0) {
      parentModel = this._owner.model;
    }
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (parentModel !== null && (model.parentModel !== parentModel || model.key !== key)) {
      this.insertModel(parentModel, model, key);
    }
    if (this._model === null) {
      this.doSetModel(model);
    }
  }
  return model;
};

TraitModel.prototype.remove = function <S extends Model>(this: TraitModel<Trait, S>): S | null {
  const model = this._model;
  if (model !== null) {
    model.remove();
  }
  return model;
};

TraitModel.prototype.createModel = function <S extends Model, U>(this: TraitModel<Trait, S, U>): S | U | null {
  return null;
};

TraitModel.prototype.insertModel = function <S extends Model>(this: TraitModel<Trait, S>,
                                                              parentModel: Model, childModel: S,
                                                              key: string | undefined): void {
  if (key !== void 0) {
    parentModel.setChildModel(key, childModel);
  } else {
    parentModel.appendChildModel(childModel);
  }
};

TraitModel.prototype.fromAny = function <S extends Model, U>(this: TraitModel<Trait, S, U>, value: S | U): S | null {
  return value as S | null;
};

TraitModel.define = function <R extends Trait, S extends Model, U, I>(descriptor: TraitModelDescriptor<R, S, U, I>): TraitModelConstructor<R, S, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = TraitModel;
  }

  const _constructor = function TraitModelAccessor(this: TraitModel<R, S>, owner: R, bindingName: string | undefined): TraitModel<R, S, U> {
    let _this: TraitModel<R, S, U> = function accessor(model?: S | U | null): S | null | R {
      if (model === void 0) {
        return _this._model;
      } else {
        _this.setModel(model);
        return _this._owner;
      }
    } as TraitModel<R, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, bindingName) || _this;
    return _this;
  } as unknown as TraitModelConstructor<R, S, U, I>;

  const _prototype = descriptor as unknown as TraitModel<R, S, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }
  if (_prototype.child === void 0) {
    _prototype.child = true;
  }

  return _constructor;
};
