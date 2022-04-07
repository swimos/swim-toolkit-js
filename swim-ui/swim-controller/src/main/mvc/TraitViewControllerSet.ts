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
import type {TraitFactory, Trait} from "@swim/model";
import type {ViewFactory, View} from "@swim/view";
import type {Controller} from "../controller/Controller";
import {
  ControllerSetRefinement,
  ControllerSetTemplate,
  ControllerSetClass,
  ControllerSet,
} from "../controller/ControllerSet";
import type {TraitViewRef} from "./TraitViewRef";

/** @public */
export interface TraitViewControllerSetRefinement extends ControllerSetRefinement {
  trait?: Trait;
  view?: View;
}

/** @public */
export type TraitViewControllerSetTrait<R extends TraitViewControllerSetRefinement | TraitViewControllerSet<any, any, any, any>, D = Trait> =
  R extends {trait: infer T} ? T :
  R extends {extends: infer E} ? TraitViewControllerSetTrait<E, D> :
  R extends TraitViewControllerSet<any, infer T, any, any> ? T :
  D;

/** @public */
export type TraitViewControllerSetView<R extends TraitViewControllerSetRefinement | TraitViewControllerSet<any, any, any, any>, D = View> =
  R extends {view: infer V} ? V :
  R extends {extends: infer E} ? TraitViewControllerSetView<E, D> :
  R extends TraitViewControllerSet<any, any, infer V, any> ? V :
  D;

/** @public */
export type TraitViewControllerSetController<R extends TraitViewControllerSetRefinement | TraitViewControllerSet<any, any, any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? TraitViewControllerSetController<E, D> :
  R extends TraitViewControllerSet<any, any, any, infer C> ? C :
  D;

/** @public */
export interface TraitViewControllerSetTemplate<T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerSetTemplate<C> {
  extends?: Proto<TraitViewControllerSet<any, any, any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
  viewType?: ViewFactory<V>;
}

/** @public */
export interface TraitViewControllerSetClass<F extends TraitViewControllerSet<any, any, any, any> = TraitViewControllerSet<any, any, any, any>> extends ControllerSetClass<F> {
  /** @override */
  specialize(className: string, template: TraitViewControllerSetTemplate): TraitViewControllerSetClass;

  /** @override */
  refine(fastenerClass: TraitViewControllerSetClass): void;

  /** @override */
  extend(className: string, template: TraitViewControllerSetTemplate): TraitViewControllerSetClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(className: string, template: ThisType<TraitViewControllerSet<O, T, V, C>> & TraitViewControllerSetTemplate<T, V, C> & Partial<Omit<TraitViewControllerSet<O, T, V, C>, keyof TraitViewControllerSetTemplate>>): TraitViewControllerSetClass<F>;

  /** @override */
  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(template: ThisType<TraitViewControllerSet<O, T, V, C>> & TraitViewControllerSetTemplate<T, V, C> & Partial<Omit<TraitViewControllerSet<O, T, V, C>, keyof TraitViewControllerSetTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitViewControllerSetDef<O, R extends TraitViewControllerSetRefinement> =
  TraitViewControllerSet<O, TraitViewControllerSetTrait<R>, TraitViewControllerSetView<R>, TraitViewControllerSetController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitViewControllerSetController<R> : B> : {});

/** @public */
export function TraitViewControllerSetDef<F extends TraitViewControllerSet<any, any, any, any>>(
  template: F extends TraitViewControllerSetDef<infer O, infer R>
          ? ThisType<TraitViewControllerSetDef<O, R>>
          & TraitViewControllerSetTemplate<TraitViewControllerSetTrait<R>, TraitViewControllerSetView<R>, TraitViewControllerSetController<R>>
          & Partial<Omit<TraitViewControllerSet<O, TraitViewControllerSetTrait<R>, TraitViewControllerSetView<R>, TraitViewControllerSetController<R>>, keyof TraitViewControllerSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitViewControllerSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitViewControllerSetController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitViewControllerSet(template);
}

/** @public */
export interface TraitViewControllerSet<O = unknown, T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerSet<O, C> {
  /** @internal */
  readonly traitControllers: {readonly [traitId: number]: C | undefined};

  /** @internal */
  getTraitViewRef(controller: C): TraitViewRef<unknown, T, V>;

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

  get parentView(): View | null;
}

/** @public */
export const TraitViewControllerSet = (function (_super: typeof ControllerSet) {
  const TraitViewControllerSet = _super.extend("TraitViewControllerSet", {}) as TraitViewControllerSetClass;

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

  Object.defineProperty(TraitViewControllerSet.prototype, "parentView", {
    value: null,
    configurable: true,
  });

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

  TraitViewControllerSet.construct = function <F extends TraitViewControllerSet<any, any, any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).traitControllers = {};
    return fastener;
  };

  return TraitViewControllerSet;
})(ControllerSet);
