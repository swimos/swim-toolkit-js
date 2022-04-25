// Copyright 2015-2022 Swim.inc
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

import type {Proto, Observes} from "@swim/util";
import {FastenerDescriptor, FastenerClass, Fastener} from "@swim/component";
import {AnyModel, ModelFactory, Model} from "./Model";
import {Trait} from "../"; // forward import

/** @public */
export type ModelRelationModel<F extends ModelRelation<any, any>> =
  F extends {modelType?: ModelFactory<infer M>} ? M : never;

/** @public */
export interface ModelRelationDescriptor<M extends Model = Model> extends FastenerDescriptor {
  extends?: Proto<ModelRelation<any, any>> | string | boolean | null;
  modelType?: ModelFactory<M>;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export type ModelRelationTemplate<F extends ModelRelation<any, any>> =
  ThisType<F> &
  ModelRelationDescriptor<ModelRelationModel<F>> &
  Partial<Omit<F, keyof ModelRelationDescriptor>>;

/** @public */
export interface ModelRelationClass<F extends ModelRelation<any, any> = ModelRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(template: ModelRelationDescriptor<any>): ModelRelationClass<F>;

  /** @override */
  refine(fastenerClass: ModelRelationClass<any>): void;

  /** @override */
  extend<F2 extends F>(className: string, template: ModelRelationTemplate<F2>): ModelRelationClass<F2>;
  extend<F2 extends F>(className: string, template: ModelRelationTemplate<F2>): ModelRelationClass<F2>;

  /** @override */
  define<F2 extends F>(className: string, template: ModelRelationTemplate<F2>): ModelRelationClass<F2>;
  define<F2 extends F>(className: string, template: ModelRelationTemplate<F2>): ModelRelationClass<F2>;

  /** @override */
  <F2 extends F>(template: ModelRelationTemplate<F2>): PropertyDecorator;
}

/** @public */
export interface ModelRelation<O = unknown, M extends Model = Model> extends Fastener<O> {
  /** @override */
  get fastenerType(): Proto<ModelRelation<any, any>>;

  /** @internal */
  readonly modelType?: ModelFactory<M>; // optional prototype property

  /** @protected */
  initModel(model: M): void;

  /** @protected */
  willAttachModel(model: M, target: Model | null): void;

  /** @protected */
  onAttachModel(model: M, target: Model | null): void;

  /** @protected */
  didAttachModel(model: M, target: Model | null): void;

  /** @protected */
  deinitModel(model: M): void;

  /** @protected */
  willDetachModel(model: M): void;

  /** @protected */
  onDetachModel(model: M): void;

  /** @protected */
  didDetachModel(model: M): void;

  /** @internal @protected */
  get parentModel(): Model | null;

  /** @internal @protected */
  insertChild(parent: Model, child: M, target: Model | null, key: string | undefined): void;

  /** @internal */
  bindModel(model: Model, target: Model | null): void;

  /** @internal */
  unbindModel(model: Model): void;

  detectModel(model: Model): M | null;

  createModel(): M;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  fromAny(value: AnyModel<M>): M;
}

/** @public */
export const ModelRelation = (function (_super: typeof Fastener) {
  const ModelRelation = _super.extend("ModelRelation", {
    lazy: false,
    static: true,
  }) as ModelRelationClass;

  Object.defineProperty(ModelRelation.prototype, "fastenerType", {
    value: ModelRelation,
    configurable: true,
  });

  ModelRelation.prototype.initModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M): void {
    // hook
  };

  ModelRelation.prototype.willAttachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M, target: Model | null): void {
    // hook
  };

  ModelRelation.prototype.onAttachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M, target: Model | null): void {
    if (this.observes === true) {
      model.observe(this as Observes<M>);
    }
  };

  ModelRelation.prototype.didAttachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M, target: Model | null): void {
    // hook
  };

  ModelRelation.prototype.deinitModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M): void {
    // hook
  };

  ModelRelation.prototype.willDetachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M): void {
    // hook
  };

  ModelRelation.prototype.onDetachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M): void {
    if (this.observes === true) {
      model.unobserve(this as Observes<M>);
    }
  };

  ModelRelation.prototype.didDetachModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: M): void {
    // hook
  };

  Object.defineProperty(ModelRelation.prototype, "parentModel", {
    get(this: ModelRelation): Model | null {
      const owner = this.owner;
      if (owner instanceof Model) {
        return owner;
      } else if (owner instanceof Trait) {
        return owner.model;
      } else {
        return null;
      }
    },
    configurable: true,
  });

  ModelRelation.prototype.insertChild = function <M extends Model>(this: ModelRelation<unknown, M>, parent: Model, child: M, target: Model | null, key: string | undefined): void {
    parent.insertChild(child, target, key);
  };

  ModelRelation.prototype.bindModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: Model, target: Model | null): void {
    // hook
  };

  ModelRelation.prototype.unbindModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: Model): void {
    // hook
  };

  ModelRelation.prototype.detectModel = function <M extends Model>(this: ModelRelation<unknown, M>, model: Model): M | null {
    return null;
  };

  ModelRelation.prototype.createModel = function <M extends Model>(this: ModelRelation<unknown, M>): M {
    let model: M | undefined;
    const modelType = this.modelType;
    if (modelType !== void 0) {
      model = modelType.create();
    }
    if (model === void 0 || model === null) {
      let message = "Unable to create ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "model";
      throw new Error(message);
    }
    return model;
  };

  ModelRelation.prototype.fromAny = function <M extends Model>(this: ModelRelation<unknown, M>, value: AnyModel<M>): M {
    const modelType = this.modelType;
    if (modelType !== void 0) {
      return modelType.fromAny(value);
    } else {
      return Model.fromAny(value) as M;
    }
  };

  return ModelRelation;
})(Fastener);
