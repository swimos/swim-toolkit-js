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
import {Model} from "./Model";
import {ModelObserverType} from "./ModelObserver";
import {SubmodelObserver} from "./SubmodelObserver";

export type SubmodelType<M, K extends keyof M> =
  M extends {[P in K]: Submodel<any, infer S>} ? S : unknown;

export interface SubmodelInit<M extends Model, S extends Model> {
  type?: unknown;
  observer?: boolean;

  willSetSubmodel?(newSubmodel: S | null, oldSubmodel: S | null): void;
  onSetSubmodel?(newSubmodel: S | null, oldSubmodel: S | null): void;
  didSetSubmodel?(newSubmodel: S | null, oldSubmodel: S | null): void;
  createSubmodel?(): S | null;

  extends?: SubmodelPrototype<S>;
}

export type SubmodelDescriptor<M extends Model, S extends Model, I = ModelObserverType<S>> = SubmodelInit<M, S> & ThisType<Submodel<M, S> & I> & I;

export type SubmodelPrototype<S extends Model> = Function & { prototype: Submodel<Model, S> };

export type SubmodelConstructor<S extends Model> = new <M extends Model>(model: M, submodelName: string | undefined) => Submodel<M, S>;

export declare abstract class Submodel<M extends Model, S extends Model> {
  /** @hidden */
  _model: M;
  /** @hidden */
  _submodel: S | null;

  constructor(model: M, submodelName: string | undefined);

  get name(): string;

  get model(): M;

  get submodel(): S | null;

  getSubmodel(): S;

  setSubmodel(newSubmodel: S | null): void;

  /** @hidden */
  doSetSubmodel(newSubmodel: S | null): void;

  /** @hidden */
  willSetSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  /** @hidden */
  onSetSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  /** @hidden */
  didSetSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  /** @hidden */
  willSetOwnSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  /** @hidden */
  onSetOwnSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  /** @hidden */
  didSetOwnSubmodel(newSubmodel: S | null, oldSubmodel: S | null): void;

  createSubmodel(): S | null;

  mount(): void;

  unmount(): void;

  // Forward type declarations
  /** @hidden */
  static Observer: typeof SubmodelObserver; // defined by SubmodelObserver
}

export interface Submodel<M extends Model, S extends Model> {
  (): S | null;
  (submodel: S | null): M;
}

export function Submodel<M extends Model, S extends Model = Model, I = ModelObserverType<S>>(descriptor: {extends: SubmodelPrototype<S>} & SubmodelDescriptor<M, S, I>): PropertyDecorator;
export function Submodel<M extends Model, S extends Model = Model, I = ModelObserverType<S>>(descriptor: SubmodelDescriptor<M, S, I>): PropertyDecorator;

export function Submodel<M extends Model, S extends Model>(
    this: Submodel<M, S> | typeof Submodel,
    model: M | SubmodelInit<M, S>,
    submodelName?: string,
  ): Submodel<M, S> | PropertyDecorator {
  if (this instanceof Submodel) { // constructor
    return SubmodelConstructor.call(this, model as M, submodelName);
  } else { // decorator factory
    return SubmodelDecoratorFactory(model as SubmodelInit<M, S>);
  }
}
__extends(Submodel, Object);
Model.Submodel = Submodel;

function SubmodelConstructor<M extends Model, S extends Model>(this: Submodel<M, S>, model: M, submodelName: string | undefined): Submodel<M, S> {
  if (submodelName !== void 0) {
    Object.defineProperty(this, "name", {
      value: submodelName,
      enumerable: true,
      configurable: true,
    });
  }
  this._model = model;
  this._submodel = null;
  return this;
}

function SubmodelDecoratorFactory<M extends Model, S extends Model>(descriptor: SubmodelInit<M, S>): PropertyDecorator {
  const observer = descriptor.observer;
  delete descriptor.observer;

  let BaseSubmodel = descriptor.extends;
  delete descriptor.extends;
  if (BaseSubmodel === void 0) {
    if (observer !== false) {
      BaseSubmodel = Submodel.Observer;
    } else {
      BaseSubmodel = Submodel;
    }
  }

  function DecoratedSubmodel(this: Submodel<M, S>, model: M, submodelName: string | undefined): Submodel<M, S> {
    let _this: Submodel<M, S> = function accessor(submodel?: S | null): S | null | M {
      if (submodel === void 0) {
        return _this._submodel;
      } else {
        _this.setSubmodel(submodel);
        return _this._model;
      }
    } as Submodel<M, S>;
    Object.setPrototypeOf(_this, this);
    _this = BaseSubmodel!.call(_this, model, submodelName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedSubmodel, BaseSubmodel);
    DecoratedSubmodel.prototype = descriptor as Submodel<M, S>;
    DecoratedSubmodel.prototype.constructor = DecoratedSubmodel;
    Object.setPrototypeOf(DecoratedSubmodel.prototype, BaseSubmodel.prototype);
  } else {
    __extends(DecoratedSubmodel, BaseSubmodel);
  }

  return Model.decorateSubmodel.bind(void 0, DecoratedSubmodel);
}

Object.defineProperty(Submodel.prototype, "model", {
  get: function <M extends Model>(this: Submodel<M, Model>): M {
    return this._model;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(Submodel.prototype, "submodel", {
  get: function <S extends Model>(this: Submodel<Model, S>): S | null {
    return this._submodel;
  },
  enumerable: true,
  configurable: true,
});

Submodel.prototype.getSubmodel = function <S extends Model>(this: Submodel<Model, S>): S {
  const submodel = this.submodel;
  if (submodel === null) {
    throw new TypeError("null " + this.name + " submodel");
  }
  return submodel;
};

Submodel.prototype.setSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                            newSubmodel: S | null): void {
  this._model.setChildModel(this.name, newSubmodel);
};

Submodel.prototype.doSetSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                              newSubmodel: S | null): void {
  const oldSubmodel = this._submodel;
  if (oldSubmodel !== newSubmodel) {
    this.willSetOwnSubmodel(newSubmodel, oldSubmodel);
    this.willSetSubmodel(newSubmodel, oldSubmodel);
    this._submodel = newSubmodel;
    this.onSetOwnSubmodel(newSubmodel, oldSubmodel);
    this.onSetSubmodel(newSubmodel, oldSubmodel);
    this.didSetSubmodel(newSubmodel, oldSubmodel);
    this.didSetOwnSubmodel(newSubmodel, oldSubmodel);
  }
};

Submodel.prototype.willSetSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                                newSubmodel: S | null,
                                                                oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.onSetSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                              newSubmodel: S | null,
                                                              oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.didSetSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                               newSubmodel: S | null,
                                                               oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.willSetOwnSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                                   newSubmodel: S | null,
                                                                   oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.onSetOwnSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                                 newSubmodel: S | null,
                                                                 oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.didSetOwnSubmodel = function <S extends Model>(this: Submodel<Model, S>,
                                                                 newSubmodel: S | null,
                                                                 oldSubmodel: S | null): void {
  // hook
};

Submodel.prototype.createSubmodel = function <S extends Model>(this: Submodel<Model, S>): S | null {
  return null;
};

Submodel.prototype.mount = function (this: Submodel<Model, Model>): void {
  // hook
};

Submodel.prototype.unmount = function (this: Submodel<Model, Model>): void {
  // hook
};
