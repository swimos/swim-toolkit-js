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

import type {Mutable, ObserverType, ConsumerType} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import type {Trait, TraitRef} from "@swim/model";
import type {Controller} from "../controller/Controller";
import {ControllerSetInit, ControllerSetClass, ControllerSet} from "../controller/ControllerSet";

/** @internal */
export type TraitControllerSetType<F extends TraitControllerSet<any, any, any>> =
  F extends TraitControllerSet<any, any, infer C> ? C : never;

/** @public */
export interface TraitControllerSetInit<T extends Trait = Trait, C extends Controller = Controller> extends ControllerSetInit<C> {
  extends?: {prototype: TraitControllerSet<any, any, any>} | string | boolean | null;
  getTraitRef?(controller: C): TraitRef<any, T>;

  initTrait?(trait: T, controller: C): void;
  willAttachTrait?(trait: T, targetTrait: Trait | null, controller: C): void;
  didAttachTrait?(trait: T, targetTrait: Trait | null, controller: C): void;

  deinitTrait?(trait: T, controller: C): void;
  willDetachTrait?(trait: T, controller: C): void;
  didDetachTrait?(trait: T, controller: C): void;

  createController?(trait?: T): C;
}

/** @public */
export type TraitControllerSetDescriptor<O = unknown, T extends Trait = Trait, C extends Controller = Controller, I = {}> = ThisType<TraitControllerSet<O, T, C> & I> & TraitControllerSetInit<T, C> & Partial<I>;

/** @public */
export interface TraitControllerSetClass<F extends TraitControllerSet<any, any, any> = TraitControllerSet<any, any, any>> extends ControllerSetClass<F> {
}

/** @public */
export interface TraitControllerSetFactory<F extends TraitControllerSet<any, any, any> = TraitControllerSet<any, any, any>> extends TraitControllerSetClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): TraitControllerSetFactory<F> & I;

  define<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, descriptor: TraitControllerSetDescriptor<O, T, C>): TraitControllerSetFactory<TraitControllerSet<any, T, C>>;
  define<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, descriptor: {observes: boolean} & TraitControllerSetDescriptor<O, T, C, ObserverType<C>>): TraitControllerSetFactory<TraitControllerSet<any, T, C>>;
  define<O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown} & TraitControllerSetDescriptor<O, T, C, I>): TraitControllerSetFactory<TraitControllerSet<any, T, C> & I>;
  define<O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & TraitControllerSetDescriptor<O, T, C, I & ObserverType<C>>): TraitControllerSetFactory<TraitControllerSet<any, T, C> & I>;

  <O, T extends Trait = Trait, C extends Controller = Controller>(descriptor: TraitControllerSetDescriptor<O, T, C>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller>(descriptor: {observes: boolean} & TraitControllerSetDescriptor<O, T, C, ObserverType<C>>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown} & TraitControllerSetDescriptor<O, T, C, I>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown; observes: boolean} & TraitControllerSetDescriptor<O, T, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface TraitControllerSet<O = unknown, T extends Trait = Trait, C extends Controller = Controller> extends ControllerSet<O, C> {
  /** @internal */
  readonly traitControllers: {readonly [traitId: number]: C | undefined};

  /** @internal */
  getTraitRef(controller: C): TraitRef<unknown, T>;

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

  /** @protected @override */
  onAttachController(controller: C, targetController: Controller | null): void;

  /** @protected @override */
  onDetachController(controller: C): void;

  /** @override */
  createController(trait?: T): C;
}

/** @public */
export const TraitControllerSet = (function (_super: typeof ControllerSet) {
  const TraitControllerSet: TraitControllerSetFactory = _super.extend("TraitControllerSet");

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

  TraitControllerSet.construct = function <F extends TraitControllerSet<any, any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).traitControllers = {};
    return fastener;
  };

  TraitControllerSet.define = function <O, T extends Trait, C extends Controller>(className: string, descriptor: TraitControllerSetDescriptor<O, T, C>): TraitControllerSetFactory<TraitControllerSet<any, T, C>> {
    let superClass = descriptor.extends as TraitControllerSetFactory | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    const sorted = descriptor.sorted;
    delete descriptor.extends;
    delete descriptor.implements;
    delete descriptor.affinity;
    delete descriptor.inherits;
    delete descriptor.sorted;

    if (superClass === void 0 || superClass === null) {
      superClass = this;
    }

    const fastenerClass = superClass.extend(className, descriptor);

    fastenerClass.construct = function (fastenerClass: {prototype: TraitControllerSet<any, any, any>}, fastener: TraitControllerSet<O, T, C> | null, owner: O): TraitControllerSet<O, T, C> {
      fastener = superClass!.construct(fastenerClass, fastener, owner);
      if (affinity !== void 0) {
        fastener.initAffinity(affinity);
      }
      if (inherits !== void 0) {
        fastener.initInherits(inherits);
      }
      if (sorted !== void 0) {
        fastener.initSorted(sorted);
      }
      return fastener;
    };

    return fastenerClass;
  };

  return TraitControllerSet;
})(ControllerSet);
