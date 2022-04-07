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
import {AnyTrait, TraitFactory, Trait} from "./Trait";
import type {Model} from "../model/Model";
import {
  ModelRefRefinement,
  ModelRefTemplate,
  ModelRefClass,
  ModelRef,
} from "../model/ModelRef";

/** @public */
export interface TraitModelRefRefinement extends ModelRefRefinement {
  trait?: unknown;
  observesTrait?: unknown;
}

/** @public */
export type TraitModelRefTrait<R extends TraitModelRefRefinement | TraitModelRef<any, any, any>, D = Trait> =
  R extends {trait: infer T} ? T :
  R extends {extends: infer E} ? TraitModelRefTrait<E, D> :
  R extends TraitModelRef<any, infer T, any> ? T :
  D;

/** @public */
export type TraitModelRefModel<R extends TraitModelRefRefinement | TraitModelRef<any, any, any>, D = Model> =
  R extends {model: infer M} ? M :
  R extends {extends: infer E} ? TraitModelRefModel<E, D> :
  R extends TraitModelRef<any, any, infer M> ? M :
  D;

/** @public */
export interface TraitModelRefTemplate<T extends Trait = Trait, M extends Model = Model> extends ModelRefTemplate<M> {
  extends?: Proto<TraitModelRef<any, any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
  traitKey?: string | boolean;
  observesTrait?: boolean;
}

/** @public */
export interface TraitModelRefClass<F extends TraitModelRef<any, any, any> = TraitModelRef<any, any, any>> extends ModelRefClass<F> {
  /** @override */
  specialize(className: string, template: TraitModelRefTemplate): TraitModelRefClass;

  /** @override */
  refine(fastenerClass: TraitModelRefClass): void;

  /** @override */
  extend(className: string, template: TraitModelRefTemplate): TraitModelRefClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait, M extends Model = Model>(className: string, template: ThisType<TraitModelRef<O, T, M>> & TraitModelRefTemplate<T, M> & Partial<Omit<TraitModelRef<O, T, M>, keyof TraitModelRefTemplate>>): TraitModelRefClass<F>;

  /** @override */
  <O, T extends Trait = Trait, M extends Model = Model>(template: ThisType<TraitModelRef<O, T, M>> & TraitModelRefTemplate<T, M> & Partial<Omit<TraitModelRef<O, T, M>, keyof TraitModelRefTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitModelRefDef<O, R extends TraitModelRefRefinement> =
  TraitModelRef<O, TraitModelRefTrait<R>, TraitModelRefModel<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitModelRefModel<R> : B> : {}) &
  (R extends {observesTrait: infer B} ? ObserverType<B extends boolean ? TraitModelRefTrait<R> : B> : {});

/** @public */
export function TraitModelRefDef<F extends TraitModelRef<any, any, any>>(
  template: F extends TraitModelRefDef<infer O, infer R>
          ? ThisType<TraitModelRefDef<O, R>>
          & TraitModelRefTemplate<TraitModelRefTrait<R>, TraitModelRefModel<R>>
          & Partial<Omit<TraitModelRef<O, TraitModelRefTrait<R>, TraitModelRefModel<R>>, keyof TraitModelRefTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitModelRefTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitModelRefModel<R> : B> & {observes: boolean}) : {})
          & (R extends {observesTrait: infer B} ? (ObserverType<B extends boolean ? TraitModelRefTrait<R> : B> & {observesTrait: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitModelRef(template);
}

/** @public */
export interface TraitModelRef<O = unknown, T extends Trait = Trait, M extends Model = Model> extends ModelRef<O, M> {
  /** @override */
  get fastenerType(): Proto<TraitModelRef<any, any, any>>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @internal */
  readonly traitKey?: string; // optional prototype property

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

  /** @internal */
  readonly observesTrait?: boolean; // optional prototype property

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
}

/** @public */
export const TraitModelRef = (function (_super: typeof ModelRef) {
  const TraitModelRef = _super.extend("TraitModelRef", {}) as TraitModelRefClass;

  Object.defineProperty(TraitModelRef.prototype, "fastenerType", {
    value: TraitModelRef,
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

  TraitModelRef.construct = function <F extends TraitModelRef<any, any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).trait = null;
    return fastener;
  };

  TraitModelRef.refine = function (fastenerClass: TraitModelRefClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "traitKey")) {
      const traitKey = fastenerPrototype.traitKey as string | boolean | undefined;
      if (traitKey === true) {
        Object.defineProperty(fastenerPrototype, "traitKey", {
          value: fastenerClass.name,
          enumerable: true,
          configurable: true,
        });
      } else if (traitKey === false) {
        Object.defineProperty(fastenerPrototype, "traitKey", {
          value: void 0,
          enumerable: true,
          configurable: true,
        });
      }
    }
  };

  return TraitModelRef;
})(ModelRef);
