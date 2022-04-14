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

import type {Proto, ObserverType} from "@swim/util";
import {FastenerRefinement, FastenerTemplate, FastenerClass, Fastener} from "@swim/component";
import {Model} from "../model/Model";
import {AnyTrait, TraitFactory, Trait} from "./Trait";

/** @public */
export interface TraitRelationRefinement extends FastenerRefinement {
  trait?: Trait;
  observes?: unknown;
}

/** @public */
export type TraitRelationTrait<R extends TraitRelationRefinement | TraitRelation<any, any>, D = Trait> =
  R extends {trait: infer T | null} ? T :
  R extends {extends: infer E} ? TraitRelationTrait<E, D> :
  R extends TraitRelation<any, infer T> ? T :
  D;

/** @public */
export interface TraitRelationTemplate<T extends Trait = Trait> extends FastenerTemplate {
  extends?: Proto<TraitRelation<any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export interface TraitRelationClass<F extends TraitRelation<any, any> = TraitRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(className: string, template: TraitRelationTemplate): TraitRelationClass;

  /** @override */
  refine(fastenerClass: TraitRelationClass): void;

  /** @override */
  extend(className: string, template: TraitRelationTemplate): TraitRelationClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait>(className: string, template: ThisType<TraitRelation<O, T>> & TraitRelationTemplate<T> & Partial<Omit<TraitRelation<O, T>, keyof TraitRelationTemplate>>): TraitRelationClass<F>;

  /** @override */
  <O, T extends Trait = Trait>(template: ThisType<TraitRelation<O, T>> & TraitRelationTemplate<T> & Partial<Omit<TraitRelation<O, T>, keyof TraitRelationTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitRelationDef<O, R extends TraitRelationRefinement = {}> =
  TraitRelation<O, TraitRelationTrait<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitRelationTrait<R> : B> : {});

/** @public */
export function TraitRelationDef<F extends TraitRelation<any, any>>(
  template: F extends TraitRelationDef<infer O, infer R>
          ? ThisType<TraitRelationDef<O, R>>
          & TraitRelationTemplate<TraitRelationTrait<R>>
          & Partial<Omit<TraitRelation<O, TraitRelationTrait<R>>, keyof TraitRelationTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitRelationTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitRelationTrait<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitRelation(template);
}

/** @public */
export interface TraitRelation<O = unknown, T extends Trait = Trait> extends Fastener<O> {
  /** @override */
  get fastenerType(): Proto<TraitRelation<any, any>>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @protected */
  initTrait(trait: T): void;

  /** @protected */
  willAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  onAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  didAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  deinitTrait(trait: T): void;

  /** @protected */
  willDetachTrait(trait: T): void;

  /** @protected */
  onDetachTrait(trait: T): void;

  /** @protected */
  didDetachTrait(trait: T): void;

  /** @internal @protected */
  get parentModel(): Model | null;

  /** @internal @protected */
  insertChild(model: Model, trait: T, target: Trait | null, key: string | undefined): void;

  /** @internal */
  bindModel(model: Model, targetModel: Model | null): void;

  /** @internal */
  unbindModel(model: Model): void;

  detectModel(model: Model): T | null;

  /** @internal */
  bindTrait(trait: Trait, target: Trait | null): void;

  /** @internal */
  unbindTrait(trait: Trait): void;

  detectTrait(trait: Trait): T | null;

  createTrait(): T;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  fromAny(value: AnyTrait<T>): T;
}

/** @public */
export const TraitRelation = (function (_super: typeof Fastener) {
  const TraitRelation = _super.extend("TraitRelation", {
    lazy: false,
    static: true,
  }) as TraitRelationClass;

  Object.defineProperty(TraitRelation.prototype, "fastenerType", {
    value: TraitRelation,
    configurable: true,
  });

  TraitRelation.prototype.initTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.willAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.onAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    if (this.observes === true) {
      trait.observe(this as ObserverType<T>);
    }
  };

  TraitRelation.prototype.didAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.deinitTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.willDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.onDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    if (this.observes === true) {
      trait.unobserve(this as ObserverType<T>);
    }
  };

  TraitRelation.prototype.didDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  Object.defineProperty(TraitRelation.prototype, "parentModel", {
    get(this: TraitRelation): Model | null {
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

  TraitRelation.prototype.insertChild = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model, trait: T, target: Trait | null, key: string | undefined): void {
    model.insertTrait(trait, target, key);
  };

  TraitRelation.prototype.bindModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model, targetModel: Model | null): void {
    // hook
  };

  TraitRelation.prototype.unbindModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model): void {
    // hook
  };

  TraitRelation.prototype.detectModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model): T | null {
    return null;
  };

  TraitRelation.prototype.bindTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.unbindTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait): void {
    // hook
  };

  TraitRelation.prototype.detectTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait): T | null {
    return null;
  };

  TraitRelation.prototype.createTrait = function <T extends Trait>(this: TraitRelation<unknown, T>): T {
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

  TraitRelation.prototype.fromAny = function <T extends Trait>(this: TraitRelation<unknown, T>, value: AnyTrait<T>): T {
    const traitType = this.traitType;
    if (traitType !== void 0) {
      return traitType.fromAny(value);
    } else {
      return Trait.fromAny(value) as T;
    }
  };

  return TraitRelation;
})(Fastener);
