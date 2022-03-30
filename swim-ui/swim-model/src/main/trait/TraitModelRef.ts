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

import type {Mutable, Class, Proto, ObserverType} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import {AnyTrait, TraitClass, Trait} from "./Trait";
import type {Model} from "../model/Model";
import {ModelRefInit, ModelRefClass, ModelRef} from "../model/ModelRef";

/** @internal */
export type TraitModelRefType<F extends TraitModelRef<any, any, any>> =
  F extends TraitModelRef<any, any, infer M> ? M : never;

/** @public */
export interface TraitModelRefInit<T extends Trait, M extends Model = Model> extends ModelRefInit<M> {
  extends?: {prototype: TraitModelRef<any, any, any>} | string | boolean | null;
  traitType?: TraitClass<T>;
  traitKey?: string | boolean;
  observesTrait?: boolean;

  initTrait?(trait: T, model: M | null): void;
  willAttachTrait?(trait: T, targetTrait: Trait | null, model: M | null): void;
  didAttachTrait?(trait: T, targetTrait: Trait | null, model: M | null): void;

  deinitTrait?(trait: T, model: M | null): void;
  willDetachTrait?(trait: T, model: M | null): void;
  didDetachTrait?(trait: T, model: M | null): void;

  createTrait?(): T;
  fromAnyTrait?(value: AnyTrait<T>): T;

  detectModelTrait?(model: Model): T | null;
  insertModelTrait?(model: Model, trait: T | null, targetTrait?: Trait | null, key?: string): void;

  createModel?(trait?: T): M;
}

/** @public */
export type TraitModelRefDescriptor<O = unknown, T extends Trait = Trait, M extends Model = Model, I = {}> = ThisType<TraitModelRef<O, T, M> & I> & TraitModelRefInit<T, M> & Partial<I>;

/** @public */
export interface TraitModelRefClass<F extends TraitModelRef<any, any, any> = TraitModelRef<any, any, any>> extends ModelRefClass<F> {
}

/** @public */
export interface TraitModelRefFactory<F extends TraitModelRef<any, any, any> = TraitModelRef<any, any, any>> extends TraitModelRefClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): TraitModelRefFactory<F> & I;

  define<O, T extends Trait = Trait, M extends Model = Model>(className: string, descriptor: TraitModelRefDescriptor<O, T, M>): TraitModelRefFactory<TraitModelRef<any, T, M>>;
  define<O, T extends Trait = Trait, M extends Model = Model>(className: string, descriptor: {observes: boolean, observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<M | T>>): TraitModelRefFactory<TraitModelRef<any, T, M>>;
  define<O, T extends Trait = Trait, M extends Model = Model>(className: string, descriptor: {observes: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<M>>): TraitModelRefFactory<TraitModelRef<any, T, M>>;
  define<O, T extends Trait = Trait, M extends Model = Model>(className: string, descriptor: {observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<T>>): TraitModelRefFactory<TraitModelRef<any, T, M>>;
  define<O, T extends Trait = Trait, M extends Model = Model, I = {}>(className: string, descriptor: {implements: unknown} & TraitModelRefDescriptor<O, T, M, I>): TraitModelRefFactory<TraitModelRef<any, T, M> & I>;
  define<O, T extends Trait = Trait, M extends Model = Model, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & TraitModelRefDescriptor<O, T, M, I & ObserverType<M>>): TraitModelRefFactory<TraitModelRef<any, T, M> & I>;
  define<O, T extends Trait = Trait, M extends Model = Model, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean; observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, I & ObserverType<M | T>>): TraitModelRefFactory<TraitModelRef<any, T, M> & I>;

  <O, T extends Trait = Trait, M extends Model = Model>(descriptor: TraitModelRefDescriptor<O, T, M>): PropertyDecorator;
  <O, T extends Trait = Trait, M extends Model = Model>(descriptor: {observes: boolean, observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<M | T>>): PropertyDecorator;
  <O, T extends Trait = Trait, M extends Model = Model>(descriptor: {observes: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<M>>): PropertyDecorator;
  <O, T extends Trait = Trait, M extends Model = Model>(descriptor: {observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, ObserverType<T>>): PropertyDecorator;
  <O, T extends Trait = Trait, M extends Model = Model, I = {}>(descriptor: {implements: unknown} & TraitModelRefDescriptor<O, T, M, I>): PropertyDecorator;
  <O, T extends Trait = Trait, M extends Model = Model, I = {}>(descriptor: {implements: unknown; observes: boolean; observesTrait: boolean} & TraitModelRefDescriptor<O, T, M, I & ObserverType<M | T>>): PropertyDecorator;
}

/** @public */
export interface TraitModelRef<O = unknown, T extends Trait = Trait, M extends Model = Model> extends ModelRef<O, M> {
  /** @override */
  get fastenerType(): Proto<TraitModelRef<any, any, any>>;

  readonly trait: T | null;

  getTrait(): T;

  setTrait(trait: AnyTrait<T> | null, targetTrait?: Trait | null, traitKey?: string): T | null;

  attachTrait(trait?: AnyTrait<T>, targetTrait?: Trait | null): T;

  /** @protected */
  initTrait(trait: T, model: M | null): void;

  /** @protected */
  willAttachTrait(trait: T, targetTrait: Trait | null, model: M | null): void;

  /** @protected */
  onAttachTrait(trait: T, targetTrait: Trait | null, model: M | null): void;

  /** @protected */
  didAttachTrait(trait: T, targetTrait: Trait | null, model: M | null): void;

  detachTrait(): T | null;

  /** @protected */
  deinitTrait(trait: T, model: M | null): void;

  /** @protected */
  willDetachTrait(trait: T, model: M | null): void;

  /** @protected */
  onDetachTrait(trait: T, model: M | null): void;

  /** @protected */
  didDetachTrait(trait: T, model: M | null): void;

  insertTrait(model?: M | null, trait?: AnyTrait<T>, targetTrait?: Trait | null, traitKey?: string): T;

  removeTrait(): T | null;

  deleteTrait(): T | null;

  createTrait(): T;

  /** @internal @protected */
  fromAnyTrait(value: AnyTrait<T>): T;

  /** @internal */
  detectModelTrait(model: Model): T | null;

  /** @internal */
  insertModelTrait(model: Model, trait: T | null, targetTrait?: Trait | null, traitKey?: string): void;

  /** @protected @override */
  onAttachModel(model: M, targetModel: Model | null): void;

  /** @protected @override */
  onDetachModel(model: M): void;

  /** @override */
  createModel(trait?: T): M;

  /** @internal @protected */
  get traitType(): TraitClass<T> | undefined; // optional prototype property

  /** @internal */
  get traitKey(): string | undefined; // optional prototype field

  /** @internal @protected */
  get observesTrait(): boolean | undefined; // optional prototype property
}

/** @public */
export const TraitModelRef = (function (_super: typeof ModelRef) {
  const TraitModelRef: TraitModelRefFactory = _super.extend("TraitModelRef");

  Object.defineProperty(TraitModelRef.prototype, "fastenerType", {
    get: function (this: TraitModelRef): Proto<TraitModelRef<any, any, any>> {
      return TraitModelRef;
    },
    configurable: true,
  });

  TraitModelRef.prototype.getTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>): T {
    const trait = this.trait;
    if (trait === null) {
      let message = trait + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "trait";
      throw new TypeError(message);
    }
    return trait;
  };

  TraitModelRef.prototype.setTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, newTrait: AnyTrait<T> | null, targetTrait?: Trait | null, traitKey?: string): T | null {
    if (newTrait !== null) {
      newTrait = this.fromAnyTrait(newTrait);
    }
    let oldTrait = this.trait;
    if (oldTrait !== newTrait) {
      if (targetTrait === void 0) {
        targetTrait = null;
      }
      let model = this.model;
      if (model === null && newTrait !== null) {
        model = this.createModel(newTrait);
        const targetModel = targetTrait !== null ? targetTrait.model : null;
        this.attachModel(model, targetModel);
      }
      if (model !== null) {
        if (oldTrait !== null && oldTrait.model === model) {
          if (targetTrait === null) {
            targetTrait = oldTrait.nextTrait;
          }
          oldTrait.remove();
        }
        if (newTrait !== null) {
          if (traitKey === void 0) {
            traitKey = this.traitKey;
          }
          this.insertModelTrait(model, newTrait, targetTrait, traitKey);
        }
        oldTrait = this.trait;
      }
      if (oldTrait !== newTrait) {
        if (oldTrait !== null) {
          (this as Mutable<typeof this>).trait = null;
          this.willDetachTrait(oldTrait, model);
          this.onDetachTrait(oldTrait, model);
          this.deinitTrait(oldTrait, model);
          this.didDetachTrait(oldTrait, model);
        }
        if (newTrait !== null) {
          (this as Mutable<typeof this>).trait = newTrait;
          this.willAttachTrait(newTrait, targetTrait, model);
          this.onAttachTrait(newTrait, targetTrait, model);
          this.initTrait(newTrait, model);
          this.didAttachTrait(newTrait, targetTrait, model);
        }
      }
    }
    return oldTrait;
  };

  TraitModelRef.prototype.attachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, newTrait?: AnyTrait<T>, targetTrait?: Trait | null): T {
    let oldTrait = this.trait;
    if (newTrait !== void 0 && newTrait !== null) {
      newTrait = this.fromAnyTrait(newTrait);
    } else if (oldTrait === null) {
      newTrait = this.createTrait();
    } else {
      newTrait = oldTrait;
    }
    if (targetTrait === void 0) {
      targetTrait = null;
    }
    let model = this.model;
    if (model === null) {
      model = this.createModel(newTrait);
      const targetModel = targetTrait !== null ? targetTrait.model : null;
      this.attachModel(model, targetModel);
      oldTrait = this.trait;
    }
    if (oldTrait !== newTrait) {
      if (oldTrait !== null) {
        (this as Mutable<typeof this>).trait = null;
        this.willDetachTrait(oldTrait, model);
        this.onDetachTrait(oldTrait, model);
        this.deinitTrait(oldTrait, model);
        this.didDetachTrait(oldTrait, model);
      }
      (this as Mutable<typeof this>).trait = newTrait;
      this.willAttachTrait(newTrait, targetTrait, model);
      this.onAttachTrait(newTrait, targetTrait, model);
      this.initTrait(newTrait, model);
      this.didAttachTrait(newTrait, targetTrait, model);
    }
    return newTrait;
  };

  TraitModelRef.prototype.initTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, model: M): void {
    // hook
  };

  TraitModelRef.prototype.willAttachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, targetTrait: Trait | null, model: M): void {
    // hook
  };

  TraitModelRef.prototype.onAttachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, targetTrait: Trait | null, model: M): void {
    if (this.observesTrait === true) {
      trait.observe(this as ObserverType<T>);
    }
  };

  TraitModelRef.prototype.didAttachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, targetTrait: Trait | null, model: M): void {
    // hook
  };

  TraitModelRef.prototype.detachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>): T | null {
    const oldTrait = this.trait;
    if (oldTrait !== null) {
      const model = this.model;
      (this as Mutable<typeof this>).trait = null;
      this.willDetachTrait(oldTrait, model);
      this.onDetachTrait(oldTrait, model);
      this.deinitTrait(oldTrait, model);
      this.didDetachTrait(oldTrait, model);
    }
    return oldTrait;
  };

  TraitModelRef.prototype.deinitTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, model: M): void {
    // hook
  };

  TraitModelRef.prototype.willDetachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, model: M): void {
    // hook
  };

  TraitModelRef.prototype.onDetachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, model: M): void {
    if (this.observesTrait === true) {
      trait.unobserve(this as ObserverType<T>);
    }
  };

  TraitModelRef.prototype.didDetachTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait: T, model: M): void {
    // hook
  };

  TraitModelRef.prototype.insertTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, model?: M | null, newTrait?: AnyTrait<T>, targetTrait?: Trait | null, traitKey?: string): T {
    if (newTrait !== void 0 && newTrait !== null) {
      newTrait = this.fromAnyTrait(newTrait);
    } else {
      const oldTrait = this.trait;
      if (oldTrait === null) {
        newTrait = this.createTrait();
      } else {
        newTrait = oldTrait;
      }
    }
    if (targetTrait === void 0) {
      targetTrait = null;
    }
    if (traitKey === void 0) {
      traitKey = this.traitKey;
    }
    if (model === void 0 || model === null) {
      model = this.createModel(newTrait);
      const targetModel = targetTrait !== null ? targetTrait.model : null;
      this.attachModel(model, targetModel);
    }
    if (model !== null && (newTrait.model !== model || newTrait.key !== traitKey)) {
      this.insertModelTrait(model, newTrait, targetTrait, traitKey);
    }
    const oldTrait = this.trait;
    if (oldTrait !== newTrait) {
      if (oldTrait !== null) {
        (this as Mutable<typeof this>).trait = null;
        this.willDetachTrait(oldTrait, model);
        this.onDetachTrait(oldTrait, model);
        this.deinitTrait(oldTrait, model);
        this.didDetachTrait(oldTrait, model);
        oldTrait.remove();
      }
      (this as Mutable<typeof this>).trait = newTrait;
      this.willAttachTrait(newTrait, targetTrait, model);
      this.onAttachTrait(newTrait, targetTrait, model);
      this.initTrait(newTrait, model);
      this.didAttachTrait(newTrait, targetTrait, model);
    }
    return newTrait;
  };

  TraitModelRef.prototype.removeTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>): T | null {
    const trait = this.trait;
    if (trait !== null) {
      trait.remove();
    }
    return trait;
  };

  TraitModelRef.prototype.deleteTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>): T | null {
    const trait = this.detachTrait();
    if (trait !== null) {
      trait.remove();
    }
    return trait;
  };

  TraitModelRef.prototype.createTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>): T {
    let trait: T | undefined;
    const traitType = this.traitType;
    if (traitType !== void 0) {
      trait = traitType.create();
    }
    if (trait === void 0 || trait === null) {
      let message = "Unable to create ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "trait";
      throw new Error(message);
    }
    return trait;
  };

  TraitModelRef.prototype.fromAnyTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, value: AnyTrait<T>): T {
    const traitType = this.traitType;
    if (traitType !== void 0) {
      return traitType.fromAny(value);
    } else {
      return Trait.fromAny(value) as T;
    }
  };

  TraitModelRef.prototype.detectModelTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, model: Model): T | null {
    return model.findTrait(this.traitKey, this.traitType as unknown as Class<T>);
  };

  TraitModelRef.prototype.insertModelTrait = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, model: Model, trait: T, targetTrait?: Trait | null, key?: string): void {
    if (targetTrait === void 0) {
      targetTrait = null;
    }
    model.insertTrait(trait, targetTrait, key);
  };

  TraitModelRef.prototype.onAttachModel = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, model: M, targetModel: Model | null): void {
    const trait = this.detectModelTrait(model);
    if (trait !== null) {
      const targetTrait = targetModel !== null ? this.detectModelTrait(targetModel) : null;
      this.attachTrait(trait, targetTrait);
    }
    ModelRef.prototype.onAttachModel.call(this, model, targetModel);
  };

  TraitModelRef.prototype.onDetachModel = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, model: M): void {
    ModelRef.prototype.onDetachModel.call(this, model);
    this.detachTrait();
  };

  TraitModelRef.prototype.createModel = function <T extends Trait, M extends Model>(this: TraitModelRef<unknown, T, M>, trait?: T): M {
    const model = _super.prototype.createModel.call(this) as M;
    if (trait === void 0) {
      trait = this.createTrait();
    }
    this.insertModelTrait(model, trait, null, this.traitKey);
    return model;
  };

  TraitModelRef.construct = function <F extends TraitModelRef<any, any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).trait = null;
    return fastener;
  };

  TraitModelRef.define = function <O, T extends Trait, M extends Model>(className: string, descriptor: TraitModelRefDescriptor<O, T, M>): TraitModelRefFactory<TraitModelRef<any, T, M>> {
    let superClass = descriptor.extends as TraitModelRefFactory | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    delete descriptor.extends;
    delete descriptor.implements;
    delete descriptor.affinity;
    delete descriptor.inherits;

    if (descriptor.key === true) {
      Object.defineProperty(descriptor, "key", {
        value: className,
        configurable: true,
      });
    } else if (descriptor.key === false) {
      Object.defineProperty(descriptor, "key", {
        value: void 0,
        configurable: true,
      });
    }

    if (descriptor.traitKey === true) {
      Object.defineProperty(descriptor, "traitKey", {
        value: className,
        configurable: true,
      });
    } else if (descriptor.traitKey === false) {
      Object.defineProperty(descriptor, "traitKey", {
        value: void 0,
        configurable: true,
      });
    }

    if (superClass === void 0 || superClass === null) {
      superClass = this;
    }

    const fastenerClass = superClass.extend(className, descriptor);

    fastenerClass.construct = function (fastenerClass: {prototype: TraitModelRef<any, any, any>}, fastener: TraitModelRef<O, T, M> | null, owner: O): TraitModelRef<O, T, M> {
      fastener = superClass!.construct(fastenerClass, fastener, owner);
      if (affinity !== void 0) {
        fastener.initAffinity(affinity);
      }
      if (inherits !== void 0) {
        fastener.initInherits(inherits);
      }
      return fastener;
    };

    return fastenerClass;
  };

  return TraitModelRef;
})(ModelRef);
