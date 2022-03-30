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
import type {TraitClass, Trait} from "@swim/model";
import type {View} from "@swim/view";
import type {Controller} from "../controller/Controller";
import {ControllerSetInit, ControllerSetClass, ControllerSet} from "../controller/ControllerSet";
import type {TraitViewRef} from "./TraitViewRef";

/** @internal */
export type TraitViewControllerSetType<F extends TraitViewControllerSet<any, any, any, any>> =
  F extends TraitViewControllerSet<any, any, any, infer C> ? C : never;

/** @public */
export interface TraitViewControllerSetInit<T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerSetInit<C> {
  extends?: {prototype: TraitViewControllerSet<any, any, any, any>} | string | boolean | null;
  traitType?: TraitClass<T>;
  traitKey?: string | boolean;
  parentView?: View | null;

  getTraitViewRef?(controller: C): TraitViewRef<any, T, V>;

  initTrait?(trait: T, controller: C): void;
  willAttachTrait?(trait: T, targetTrait: Trait | null, controller: C): void;
  didAttachTrait?(trait: T, targetTrait: Trait | null, controller: C): void;

  deinitTrait?(trait: T, controller: C): void;
  willDetachTrait?(trait: T, controller: C): void;
  didDetachTrait?(trait: T, controller: C): void;

  createTrait?(): T;
  createController?(trait?: T): C;
}

/** @public */
export type TraitViewControllerSetDescriptor<O = unknown, T extends Trait = Trait, V extends View = View, C extends Controller = Controller, I = {}> = ThisType<TraitViewControllerSet<O, T, V, C> & I> & TraitViewControllerSetInit<T, V, C> & Partial<I>;

/** @public */
export interface TraitViewControllerSetClass<F extends TraitViewControllerSet<any, any, any, any> = TraitViewControllerSet<any, any, any, any>> extends ControllerSetClass<F> {
}

/** @public */
export interface TraitViewControllerSetFactory<F extends TraitViewControllerSet<any, any, any, any> = TraitViewControllerSet<any, any, any, any>> extends TraitViewControllerSetClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): TraitViewControllerSetFactory<F> & I;

  define<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(className: string, descriptor: TraitViewControllerSetDescriptor<O, T, V, C>): TraitViewControllerSetFactory<TraitViewControllerSet<any, T, V, C>>;
  define<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(className: string, descriptor: {observes: boolean} & TraitViewControllerSetDescriptor<O, T, V, C, ObserverType<C>>): TraitViewControllerSetFactory<TraitViewControllerSet<any, T, V, C>>;
  define<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown} & TraitViewControllerSetDescriptor<O, T, V, C, I>): TraitViewControllerSetFactory<TraitViewControllerSet<any, T, V, C> & I>;
  define<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & TraitViewControllerSetDescriptor<O, T, V, C, I & ObserverType<C>>): TraitViewControllerSetFactory<TraitViewControllerSet<any, T, V, C> & I>;

  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(descriptor: TraitViewControllerSetDescriptor<O, T, V, C>): PropertyDecorator;
  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(descriptor: {observes: boolean} & TraitViewControllerSetDescriptor<O, T, V, C, ObserverType<C>>): PropertyDecorator;
  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown} & TraitViewControllerSetDescriptor<O, T, V, C, I>): PropertyDecorator;
  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown; observes: boolean} & TraitViewControllerSetDescriptor<O, T, V, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface TraitViewControllerSet<O = unknown, T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerSet<O, C> {
  /** @internal */
  readonly traitControllers: {readonly [traitId: number]: C | undefined};

  /** @internal */
  getTraitViewRef(controller: C): TraitViewRef<unknown, T, V>;

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

  /** @internal @protected */
  get traitType(): TraitClass<T> | undefined; // optional prototype property

  /** @internal */
  get traitKey(): string | undefined; // optional prototype field

  /** @internal @protected */
  get parentView(): View | null; // optional prototype property
}

/** @public */
export const TraitViewControllerSet = (function (_super: typeof ControllerSet) {
  const TraitViewControllerSet: TraitViewControllerSetFactory = _super.extend("TraitViewControllerSet");

  TraitViewControllerSet.prototype.getTraitViewRef = function <T extends Trait, V extends View, C extends Controller>(controller: C): TraitViewRef<unknown, T, V> {
    throw new Error("missing implementation");
  };

  TraitViewControllerSet.prototype.hasTrait = function (this: TraitViewControllerSet, trait: Trait): boolean {
    return this.traitControllers[trait.uid] !== void 0;
  };

  TraitViewControllerSet.prototype.addTrait = function <T extends Trait, V extends View, C extends Controller>(this: TraitViewControllerSet<unknown, T, V, C>, trait: T, targetTrait?: Trait | null, key?: string): C {
    const traitControllers = this.traitControllers as {[traitId: number]: C | undefined};
    let controller = traitControllers[trait.uid];
    if (controller === void 0) {
      controller = this.createController(trait);
      const traitViewRef = this.getTraitViewRef(controller);
      traitViewRef.setTrait(trait, targetTrait, key);
      const targetController = targetTrait !== void 0 && targetTrait !== null ? traitControllers[targetTrait.uid] : void 0;
      this.addController(controller, targetController, key);
      if (traitViewRef.view === null) {
        const view = traitViewRef.createView();
        const targetView = targetController !== void 0 ? this.getTraitViewRef(targetController).view : null;
        traitViewRef.insertView(this.parentView, view, targetView, key);
      }
    }
    return controller;
  };

  TraitViewControllerSet.prototype.addTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.addTrait(newTraits[traitId]!, target);
    }
  };

  TraitViewControllerSet.prototype.attachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T, targetTrait?: Trait | null, controller?: C): C {
    const traitControllers = this.traitControllers as {[traitId: number]: C | undefined};
    if (controller === void 0) {
      controller = traitControllers[trait.uid];
    }
    if (controller === void 0) {
      controller = this.createController();
      const traitViewRef = this.getTraitViewRef(controller);
      traitViewRef.setTrait(trait, targetTrait);
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

  TraitViewControllerSet.prototype.initTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerSet.prototype.willAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T, targetTrait: Trait | null): void {
    // hook
  };

  TraitViewControllerSet.prototype.onAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T, targetTrait: Trait | null): void {
    // hook
  };

  TraitViewControllerSet.prototype.didAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T, targetTrait: Trait | null): void {
    // hook
  };

  TraitViewControllerSet.prototype.attachTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.attachTrait(newTraits[traitId]!, target);
    }
  };

  TraitViewControllerSet.prototype.detachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T): C | null {
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

  TraitViewControllerSet.prototype.deinitTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerSet.prototype.willDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T): void {
    // hook
  };

  TraitViewControllerSet.prototype.onDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T): void {
    // hook
  };

  TraitViewControllerSet.prototype.didDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, trait: T): void {
    // hook
  };

  TraitViewControllerSet.prototype.detachTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.detachTrait(traits[traitId]!);
    }
  };

  TraitViewControllerSet.prototype.removeTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T): C | null {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const traitViewRef = this.getTraitViewRef(controller);
      if (traitViewRef.trait === trait) {
        this.removeController(controller);
        return controller;
      }
    }
    return null;
  };

  TraitViewControllerSet.prototype.removeTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.removeTrait(traits[traitId]!);
    }
  };

  TraitViewControllerSet.prototype.deleteTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, trait: T): C | null {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const traitViewRef = this.getTraitViewRef(controller);
      if (traitViewRef.trait === trait) {
        this.deleteController(controller);
        return controller;
      }
    }
    return null;
  };

  TraitViewControllerSet.prototype.deleteTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, traits: {readonly [traitId: number]: T | undefined}): void {
    for (const traitId in traits) {
      this.deleteTrait(traits[traitId]!);
    }
  };

  TraitViewControllerSet.prototype.consumeTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, consumer: ConsumerType<T>): void {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const trait = this.getTraitViewRef(controller).trait;
      if (trait !== null) {
        trait.consume(consumer);
      }
    }
  };

  TraitViewControllerSet.prototype.unconsumeTraits = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, consumer: ConsumerType<T>): void {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      const controller = controllers[controllerId]!;
      const trait = this.getTraitViewRef(controller).trait;
      if (trait !== null) {
        trait.unconsume(consumer);
      }
    }
  };

  TraitViewControllerSet.prototype.createTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>): T {
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

  TraitViewControllerSet.prototype.onAttachController = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C, targetController: Controller | null): void {
    const trait = this.getTraitViewRef(controller).trait;
    if (trait !== null) {
      const targetTrait = targetController !== null && this.hasController(targetController) ? this.getTraitViewRef(targetController as C).trait : null;
      this.attachTrait(trait, targetTrait, controller);
    }
    ControllerSet.prototype.onAttachController.call(this, controller, targetController);
  };

  TraitViewControllerSet.prototype.onDetachController = function <T extends Trait, C extends Controller>(this: TraitViewControllerSet<unknown, T, View, C>, controller: C): void {
    ControllerSet.prototype.onDetachController.call(this, controller);
    const trait = this.getTraitViewRef(controller).trait;
    if (trait !== null) {
      this.detachTrait(trait);
    }
  };

  Object.defineProperty(TraitViewControllerSet.prototype, "parentView", {
    get: function (this: TraitViewControllerSet): View | null {
      return null;
    },
    configurable: true,
  });

  TraitViewControllerSet.construct = function <F extends TraitViewControllerSet<any, any, any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).traitControllers = {};
    return fastener;
  };

  TraitViewControllerSet.define = function <O, T extends Trait, V extends View, C extends Controller>(className: string, descriptor: TraitViewControllerSetDescriptor<O, T, V, C>): TraitViewControllerSetFactory<TraitViewControllerSet<any, T, V, C>> {
    let superClass = descriptor.extends as TraitViewControllerSetFactory | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    const sorted = descriptor.sorted;
    delete descriptor.extends;
    delete descriptor.implements;
    delete descriptor.affinity;
    delete descriptor.inherits;
    delete descriptor.sorted;

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

    fastenerClass.construct = function (fastenerClass: {prototype: TraitViewControllerSet<any, any, any, any>}, fastener: TraitViewControllerSet<O, T, V, C> | null, owner: O): TraitViewControllerSet<O, T, V, C> {
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

  return TraitViewControllerSet;
})(ControllerSet);
