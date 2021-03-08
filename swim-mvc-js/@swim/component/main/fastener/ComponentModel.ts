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
import {FromAny} from "@swim/util";
import {Model, ModelObserverType} from "@swim/model";
import {Component} from "../Component";

export type ComponentModelMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentModel<any, infer M, any>} ? M : unknown;

export type ComponentModelMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ComponentModel<any, infer M, infer U>} ? M | U : unknown;

export interface ComponentModelInit<M extends Model, U = never> {
  extends?: ComponentModelClass;
  observe?: boolean;
  type?: unknown;

  willSetModel?(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;
  onSetModel?(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;
  didSetModel?(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;

  createModel?(): M | U | null;
  insertModel?(parentModel: Model, childModel: M, targetModel: Model | null, key: string | undefined): void;
  fromAny?(value: M | U): M | null;
}

export type ComponentModelDescriptor<C extends Component, M extends Model, U = never, I = {}> = ComponentModelInit<M, U> & ThisType<ComponentModel<C, M, U> & I> & I;

export interface ComponentModelConstructor<C extends Component, M extends Model, U = never, I = {}> {
  new(owner: C, modelName: string | undefined): ComponentModel<C, M, U> & I;
  prototype: ComponentModel<any, any> & I;
}

export interface ComponentModelClass extends Function {
  readonly prototype: ComponentModel<any, any>;
}

export interface ComponentModel<C extends Component, M extends Model, U = never> {
  (): M | null;
  (model: M | U | null, targetModel?: Model | null): C;

  readonly name: string;

  readonly owner: C;

  readonly model: M | null;

  getModel(): M;

  setModel(newModel: M | U | null, targetModel?: Model | null): M | null;

  /** @hidden */
  attachModel(newModel: M): void;

  /** @hidden */
  detachModel(oldModel: M): void;

  /** @hidden */
  willSetModel(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;

  /** @hidden */
  onSetModel(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;

  /** @hidden */
  didSetModel(newModel: M | null, oldModel: M | null, targetModel: Model | null): void;

  injectModel(parentModel: Model, childModel?: M | U | null, targetModel?: Model | null, key?: string | null): M | null;

  createModel(): M | U | null;

  /** @hidden */
  insertModel(parentModel: Model, childModel: M, targetMoel: Model | null, key: string | undefined): void;

  removeModel(): M | null;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: unknown;

  fromAny(value: M | U): M | null;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;
}

export const ComponentModel = function <C extends Component, M extends Model, U>(
    this: ComponentModel<C, M, U> | typeof ComponentModel,
    owner: C | ComponentModelDescriptor<C, M, U>,
    modelName?: string,
  ): ComponentModel<C, M, U> | PropertyDecorator {
  if (this instanceof ComponentModel) { // constructor
    return ComponentModelConstructor.call(this as unknown as ComponentModel<Component, Model, unknown>, owner as C, modelName);
  } else { // decorator factory
    return ComponentModelDecoratorFactory(owner as ComponentModelDescriptor<C, M, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, M extends Model, U = never>(owner: C, modelName: string | undefined): ComponentModel<C, M, U>;

  <C extends Component, M extends Model = Model, U = never, I = ModelObserverType<M>>(descriptor: {extends: ComponentModelClass | undefined} & ComponentModelDescriptor<C, M, U, I>): PropertyDecorator;
  <C extends Component, M extends Model = Model, U = never>(descriptor: {observe: boolean} & ComponentModelDescriptor<C, M, U, ModelObserverType<M>>): PropertyDecorator;
  <C extends Component, M extends Model = Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentModel<any, any>;

  define<C extends Component, M extends Model = Model, U = never, I = ModelObserverType<M>>(descriptor: {extends: ComponentModelClass | undefined} & ComponentModelDescriptor<C, M, U, I>): ComponentModelConstructor<C, M, U, I>;
  define<C extends Component, M extends Model = Model, U = never>(descriptor: {observe: boolean} & ComponentModelDescriptor<C, M, U, ModelObserverType<M>>): ComponentModelConstructor<C, M, U>;
  define<C extends Component, M extends Model = Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): ComponentModelConstructor<C, M, U>;
};
__extends(ComponentModel, Object);

function ComponentModelConstructor<C extends Component, M extends Model, U>(this: ComponentModel<C, M, U>, owner: C, modelName: string | undefined): ComponentModel<C, M, U> {
  if (modelName !== void 0) {
    Object.defineProperty(this, "name", {
      value: modelName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(this, "model", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentModelDecoratorFactory<C extends Component, M extends Model, U = never>(descriptor: ComponentModelDescriptor<C, M, U>): PropertyDecorator {
  return Component.decorateComponentModel.bind(Component, ComponentModel.define(descriptor as ComponentModelDescriptor<Component, Model>));
}

ComponentModel.prototype.getModel = function <M extends Model>(this: ComponentModel<Component, M>): M {
  const model = this.model;
  if (model === null) {
    throw new TypeError("null " + this.name + " model");
  }
  return model;
};

ComponentModel.prototype.setModel = function <M extends Model>(this: ComponentModel<Component, M>, newModel: M | null, targetModel?: Model | null): M | null {
  const oldModel = this.model;
  if (newModel !== null) {
    newModel = this.fromAny(newModel);
  }
  if (oldModel !== newModel) {
    if (targetModel === void 0) {
      targetModel = null;
    }
    this.willSetModel(newModel, oldModel, targetModel);
    if (oldModel !== null) {
      this.detachModel(oldModel);
    }
    Object.defineProperty(this, "model", {
      value: newModel,
      enumerable: true,
      configurable: true,
    });
    if (newModel !== null) {
      this.attachModel(newModel);
    }
    this.onSetModel(newModel, oldModel, targetModel);
    this.didSetModel(newModel, oldModel, targetModel);
  }
  return oldModel;
};

ComponentModel.prototype.attachModel = function <M extends Model>(this: ComponentModel<Component, M>, newModel: M): void {
  if (this.observe === true && this.owner.isMounted()) {
    newModel.addModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.prototype.detachModel = function <M extends Model>(this: ComponentModel<Component, M>, oldModel: M): void {
  if (this.observe === true && this.owner.isMounted()) {
    oldModel.removeModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.prototype.willSetModel = function <M extends Model>(this: ComponentModel<Component, M>, newModel: M | null, oldModel: M | null, targetModel: Model | null): void {
  // hook
};

ComponentModel.prototype.onSetModel = function <M extends Model>(this: ComponentModel<Component, M>, newModel: M | null, oldModel: M | null, targetModel: Model | null): void {
  // hook
};

ComponentModel.prototype.didSetModel = function <M extends Model>(this: ComponentModel<Component, M>, newModel: M | null, oldModel: M | null, targetModel: Model | null): void {
  // hook
};

ComponentModel.prototype.injectModel = function <M extends Model>(this: ComponentModel<Component, M>, parentModel: Model, childModel?: M | null, targetModel?: Model | null, key?: string | null): M | null {
  if (targetModel === void 0) {
    targetModel = null;
  }
  if (childModel === void 0 || childModel === null) {
    childModel = this.model;
    if (childModel === null) {
      childModel = this.createModel();
    }
  } else {
    childModel = this.fromAny(childModel);
    if (childModel !== null) {
      this.setModel(childModel, targetModel);
    }
  }
  if (childModel !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (childModel.parentModel !== parentModel || childModel.key !== key) {
      this.insertModel(parentModel, childModel, targetModel, key);
    }
    if (this.model === null) {
      this.setModel(childModel, targetModel);
    }
  }
  return childModel;
};

ComponentModel.prototype.createModel = function <M extends Model, U>(this: ComponentModel<Component, M, U>): M | U | null {
  return null;
};

ComponentModel.prototype.insertModel = function <M extends Model>(this: ComponentModel<Component, M>, parentModel: Model, childModel: M, targetModel: Model | null, key: string | undefined): void {
  parentModel.insertChildModel(childModel, targetModel, key);
};

ComponentModel.prototype.removeModel = function <M extends Model>(this: ComponentModel<Component, M>): M | null {
  const childModel = this.model;
  if (childModel !== null) {
    childModel.remove();
  }
  return childModel;
};

ComponentModel.prototype.fromAny = function <M extends Model, U>(this: ComponentModel<Component, M, U>, value: M | U): M | null {
  const type = this.type;
  if (FromAny.is<M, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof Model) {
    return value;
  }
  return null;
};

ComponentModel.prototype.mount = function <M extends Model>(this: ComponentModel<Component, M>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.addModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.prototype.unmount = function <M extends Model>(this: ComponentModel<Component, M>): void {
  const model = this.model;
  if (model !== null && this.observe === true) {
    model.removeModelObserver(this as ModelObserverType<M>);
  }
};

ComponentModel.define = function <C extends Component, M extends Model, U, I>(descriptor: ComponentModelDescriptor<C, M, U, I>): ComponentModelConstructor<C, M, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentModel;
  }

  const _constructor = function DecoratedComponentModel(this: ComponentModel<C, M, U>, owner: C, modelName: string | undefined): ComponentModel<C, M, U> {
    let _this: ComponentModel<C, M, U> = function ComponentModelAccessor(model?: M | null, targetModel?: Model | null): M | null | C {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model, targetModel);
        return _this.owner;
      }
    } as ComponentModel<C, M, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, modelName) || _this;
    return _this;
  } as unknown as ComponentModelConstructor<C, M, U, I>;

  const _prototype = descriptor as unknown as ComponentModel<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  return _constructor;
};
