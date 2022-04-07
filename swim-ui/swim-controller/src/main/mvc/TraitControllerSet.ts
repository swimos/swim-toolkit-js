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

import type {Mutable, Proto, ObserverType, ConsumerType} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import type {TraitFactory, Trait, TraitRef} from "@swim/model";
import type {Controller} from "../controller/Controller";
import {
  ControllerSetRefinement,
  ControllerSetTemplate,
  ControllerSetClass,
  ControllerSet,
} from "../controller/ControllerSet";

/** @public */
export interface TraitControllerSetRefinement extends ControllerSetRefinement {
}

/** @public */
export type TraitControllerSetTrait<R extends TraitControllerSetRefinement | TraitControllerSet<any, any, any>, D = Trait> =
  R extends {trait: infer T} ? T :
  R extends {extends: infer E} ? TraitControllerSetTrait<E, D> :
  R extends TraitControllerSet<any, infer T, any> ? T :
  D;

/** @public */
export type TraitControllerSetController<R extends TraitControllerSetRefinement | TraitControllerSet<any, any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? TraitControllerSetController<E, D> :
  R extends TraitControllerSet<any, any, infer C> ? C :
  D;

/** @public */
export interface TraitControllerSetTemplate<T extends Trait = Trait, C extends Controller = Controller> extends ControllerSetTemplate<C> {
  extends?: Proto<TraitControllerSet<any, any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
}

/** @public */
export interface TraitControllerSetClass<F extends TraitControllerSet<any, any, any> = TraitControllerSet<any, any, any>> extends ControllerSetClass<F> {
  /** @override */
  specialize(className: string, template: TraitControllerSetTemplate): TraitControllerSetClass;

  /** @override */
  refine(fastenerClass: TraitControllerSetClass): void;

  /** @override */
  extend(className: string, template: TraitControllerSetTemplate): TraitControllerSetClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, template: ThisType<TraitControllerSet<O, T, C>> & TraitControllerSetTemplate<T, C> & Partial<Omit<TraitControllerSet<O, T, C>, keyof TraitControllerSetTemplate>>): TraitControllerSetClass<F>;

  /** @override */
  <O, T extends Trait = Trait, C extends Controller = Controller>(template: ThisType<TraitControllerSet<O, T, C>> & TraitControllerSetTemplate<T, C> & Partial<Omit<TraitControllerSet<O, T, C>, keyof TraitControllerSetTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitControllerSetDef<O, R extends TraitControllerSetRefinement> =
  TraitControllerSet<O, TraitControllerSetTrait<R>, TraitControllerSetController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitControllerSetController<R> : B> : {});

/** @public */
export function TraitControllerSetDef<F extends TraitControllerSet<any, any, any>>(
  template: F extends TraitControllerSetDef<infer O, infer R>
          ? ThisType<TraitControllerSetDef<O, R>>
          & TraitControllerSetTemplate<TraitControllerSetTrait<R>, TraitControllerSetController<R>>
          & Partial<Omit<TraitControllerSet<O, TraitControllerSetTrait<R>, TraitControllerSetController<R>>, keyof TraitControllerSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitControllerSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitControllerSetController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitControllerSet(template);
}

/** @public */
export interface TraitControllerSet<O = unknown, T extends Trait = Trait, C extends Controller = Controller> extends ControllerSet<O, C> {
  /** @internal */
  readonly traitControllers: {readonly [traitId: number]: C | undefined};

  /** @internal */
  getTraitRef(controller: C): TraitRef<unknown, T>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  hasTrait(trait: Trait): boolean;

  addTrait(trait: T, targetTrait?: Trait | null, key?: string): C;

  addTraits(traits: {readonly [traitId: number]: T | undefined}, targetTrait?: Trait | null): void;

  attachTrait(trait: T, targetTrait?: Trait | null, controller?: C): C;

  /** @protected */
  initTrait(trait: T, controller: C): void;

  /** @protected */
  willAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  /** @protected */
  onAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  /** @protected */
  didAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  attachTraits(traits: {readonly [traitId: number]: T | undefined}, targetTrait?: Trait | null): void;

  detachTrait(trait: T): C | null;

  /** @protected */
  deinitTrait(trait: T, controller: C): void;

  /** @protected */
  willDetachTrait(trait: T, controller: C): void;

  /** @protected */
  onDetachTrait(trait: T, controller: C): void;

  /** @protected */
  didDetachTrait(trait: T, controller: C): void;

  detachTraits(traits: {readonly [traitId: number]: T | undefined}): void;

  removeTrait(trait: T): C | null;

  removeTraits(traits: {readonly [traitId: number]: T | undefined}): void;

  deleteTrait(trait: T): C | null;

  deleteTraits(traits: {readonly [traitId: number]: T | undefined}): void;

  consumeTraits(consumer: ConsumerType<T>): void;

  unconsumeTraits(consumer: ConsumerType<T>): void;

  createTrait(): T;

  /** @protected @override */
  onAttachController(controller: C, targetController: Controller | null): void;

  /** @protected @override */
  onDetachController(controller: C): void;

  /** @override */
  createController(trait?: T): C;
}

/** @public */
export const TraitControllerSet = (function (_super: typeof ControllerSet) {
  const TraitControllerSet = _super.extend("TraitControllerSet", {}) as TraitControllerSetClass;

  TraitControllerSet.prototype.getTraitRef = function <T extends Trait, C extends Controller>(controller: C): TraitRef<unknown, T> {
    throw new Error("missing implementation");
  };

  TraitControllerSet.prototype.hasTrait = function (this: TraitControllerSet, trait: Trait): boolean {
    return this.traitControllers[trait.uid] !== void 0;
  };

  TraitControllerSet.prototype.addTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, targetTrait?: Trait | null, key?: string): C {
    const traitControllers = this.traitControllers as {[traitId: number]: C | undefined};
    let controller = traitControllers[trait.uid];
    if (controller === void 0) {
      controller = this.createController(trait);
      const traitRef = this.getTraitRef(controller);
      traitRef.setTrait(trait, targetTrait, key);
      const targetController = targetTrait !== void 0 && targetTrait !== null ? traitControllers[targetTrait.uid] : void 0;
      this.addController(controller, targetController, key);
    }
    return controller;
  };

  TraitControllerSet.prototype.addTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.addTrait(newTraits[traitId]!, target);
    }
  };

  TraitControllerSet.prototype.attachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, targetTrait?: Trait | null, controller?: C): C {
    const traitControllers = this.traitControllers as {[traitId: number]: C | undefined};
    if (controller === void 0) {
      controller = traitControllers[trait.uid];
    }
    if (controller === void 0) {
      controller = this.createController();
      const traitRef = this.getTraitRef(controller);
      traitRef.setTrait(trait, targetTrait);
      const targetController = targetTrait !== void 0 && targetTrait !== null ? traitControllers[targetTrait.uid] : void 0;
      this.attachController(controller, targetController);
    }
    if (traitControllers[trait.uid] === void 0) {
      if (targetTrait === void 0) {
        targetTrait = null;
      }
      traitControllers[trait.uid] = controller;
      this.willAttachTrait(trait, targetTrait, controller);
      this.onAttachTrait(trait, targetTrait, controller);
      this.initTrait(trait, controller);
      this.didAttachTrait(trait, targetTrait, controller);
    }
    return controller;
  };

  TraitControllerSet.prototype.initTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.willAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.onAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.didAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.attachTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.attachTrait(newTraits[traitId]!, target);
    }
  };

  TraitControllerSet.prototype.detachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T): C | null {
    const traitControllers = this.traitControllers as {[traitId: number]: C | undefined};
    const controller = traitControllers[trait.uid];
    if (controller !== void 0) {
      delete traitControllers[trait.uid];
      this.willDetachTrait(trait, controller);
      this.onDetachTrait(trait, controller);
      this.deinitTrait(trait, controller);
      this.didDetachTrait(trait, controller);
      return controller;
    }
    return null;
  };

  TraitControllerSet.prototype.deinitTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.willDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.onDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.didDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerSet.prototype.detachTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.detachTrait(traits[traitId]!);
    }
  };

  TraitControllerSet.prototype.removeTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T): C | null {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const traitRef = this.getTraitRef(controller);
      if (traitRef.trait === trait) {
        this.removeController(controller);
        return controller;
      }
    }
    return null;
  };

  TraitControllerSet.prototype.removeTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.removeTrait(traits[traitId]!);
    }
  };

  TraitControllerSet.prototype.deleteTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, trait: T): C | null {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const traitRef = this.getTraitRef(controller);
      if (traitRef.trait === trait) {
        this.deleteController(controller);
        return controller;
      }
    }
    return null;
  };

  TraitControllerSet.prototype.deleteTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.deleteTrait(traits[traitId]!);
    }
  };

  TraitControllerSet.prototype.consumeTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, consumer: ConsumerType<T>): void {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const trait = this.getTraitRef(controller).trait;
      if (trait !== null) {
        trait.consume(consumer);
      }
    }
  };

  TraitControllerSet.prototype.unconsumeTraits = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, consumer: ConsumerType<T>): void {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const trait = this.getTraitRef(controller).trait;
      if (trait !== null) {
        trait.unconsume(consumer);
      }
    }
  };

  TraitControllerSet.prototype.createTrait = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>): T {
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

  TraitControllerSet.prototype.onAttachController = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, controller: C, targetController: Controller | null): void {
    const trait = this.getTraitRef(controller).trait;
    if (trait !== null) {
      const targetTrait = targetController !== null && this.hasController(targetController) ? this.getTraitRef(targetController as C).trait : null;
      this.attachTrait(trait, targetTrait, controller);
    }
    ControllerSet.prototype.onAttachController.call(this, controller, targetController);
  };

  TraitControllerSet.prototype.onDetachController = function <T extends Trait, C extends Controller>(this: TraitControllerSet<unknown, T, C>, controller: C): void {
    ControllerSet.prototype.onDetachController.call(this, controller);
    const trait = this.getTraitRef(controller).trait;
    if (trait !== null) {
      this.detachTrait(trait);
    }
  };

  TraitControllerSet.construct = function <F extends TraitControllerSet<any, any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).traitControllers = {};
    return fastener;
  };

  return TraitControllerSet;
})(ControllerSet);
