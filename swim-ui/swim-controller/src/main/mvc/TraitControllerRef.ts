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
import type {TraitFactory, Trait, TraitRef} from "@swim/model";
import type {Controller} from "../controller/Controller";
import {
  ControllerRefRefinement,
  ControllerRefTemplate,
  ControllerRefClass,
  ControllerRef,
} from "../controller/ControllerRef";

/** @public */
export interface TraitControllerRefRefinement extends ControllerRefRefinement {
}

/** @public */
export type TraitControllerRefTrait<R extends TraitControllerRefRefinement | TraitControllerRef<any, any, any>, D = Trait> =
  R extends {trait: infer T} ? T :
  R extends {extends: infer E} ? TraitControllerRefTrait<E, D> :
  R extends TraitControllerRef<any, infer T, any> ? T :
  D;

/** @public */
export type TraitControllerRefController<R extends TraitControllerRefRefinement | TraitControllerRef<any, any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? TraitControllerRefController<E, D> :
  R extends TraitControllerRef<any, any, infer C> ? C :
  D;

/** @public */
export interface TraitControllerRefTemplate<T extends Trait = Trait, C extends Controller = Controller> extends ControllerRefTemplate<C> {
  extends?: Proto<TraitControllerRef<any, any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
  traitKey?: string | boolean;
}

/** @public */
export interface TraitControllerRefClass<F extends TraitControllerRef<any, any, any> = TraitControllerRef<any, any, any>> extends ControllerRefClass<F> {
  /** @override */
  specialize(className: string, template: TraitControllerRefTemplate): TraitControllerRefClass;

  /** @override */
  refine(fastenerClass: TraitControllerRefClass): void;

  /** @override */
  extend(className: string, template: TraitControllerRefTemplate): TraitControllerRefClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, template: ThisType<TraitControllerRef<O, T, C>> & TraitControllerRefTemplate<T, C> & Partial<Omit<TraitControllerRef<O, T, C>, keyof TraitControllerRefTemplate>>): TraitControllerRefClass<F>;

  /** @override */
  <O, T extends Trait = Trait, C extends Controller = Controller>(template: ThisType<TraitControllerRef<O, T, C>> & TraitControllerRefTemplate<T, C> & Partial<Omit<TraitControllerRef<O, T, C>, keyof TraitControllerRefTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitControllerRefDef<O, R extends TraitControllerRefRefinement> =
  TraitControllerRef<O, TraitControllerRefTrait<R>, TraitControllerRefController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitControllerRefController<R> : B> : {});

/** @public */
export function TraitControllerRefDef<F extends TraitControllerRef<any, any, any>>(
  template: F extends TraitControllerRefDef<infer O, infer R>
          ? ThisType<TraitControllerRefDef<O, R>>
          & TraitControllerRefTemplate<TraitControllerRefTrait<R>, TraitControllerRefController<R>>
          & Partial<Omit<TraitControllerRef<O, TraitControllerRefTrait<R>, TraitControllerRefController<R>>, keyof TraitControllerRefTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitControllerRefTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitControllerRefController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitControllerRef(template);
}

/** @public */
export interface TraitControllerRef<O = unknown, T extends Trait = Trait, C extends Controller = Controller> extends ControllerRef<O, C> {
  /** @override */
  get fastenerType(): Proto<TraitControllerRef<any, any, any>>;

  /** @internal */
  getTraitRef(controller: C): TraitRef<unknown, T>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @internal */
  readonly traitKey?: string; // optional prototype property

  get trait(): T | null;

  setTrait(trait: T | null, targetTrait?: Trait | null, key?: string): C | null;

  attachTrait(trait?: T, targetTrait?: Trait | null): C;

  /** @protected */
  initTrait(trait: T, controller: C): void;

  /** @protected */
  willAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  /** @protected */
  onAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  /** @protected */
  didAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void;

  detachTrait(trait?: T): C | null;

  /** @protected */
  deinitTrait(trait: T, controller: C): void;

  /** @protected */
  willDetachTrait(trait: T, controller: C): void;

  /** @protected */
  onDetachTrait(trait: T, controller: C): void;

  /** @protected */
  didDetachTrait(trait: T, controller: C): void;

  removeTrait(trait: T | null): C | null;

  deleteTrait(trait: T | null): C | null;

  createTrait(): T;

  /** @protected @override */
  onAttachController(controller: C, targetController: Controller | null): void;

  /** @protected @override */
  onDetachController(controller: C): void;

  createController(trait?: T): C;
}

/** @public */
export const TraitControllerRef = (function (_super: typeof ControllerRef) {
  const TraitControllerRef = _super.extend("TraitControllerRef", {}) as TraitControllerRefClass;

  Object.defineProperty(TraitControllerRef.prototype, "fastenerType", {
    value: TraitControllerRef,
    configurable: true,
  });

  TraitControllerRef.prototype.getTraitRef = function <T extends Trait, C extends Controller>(controller: C): TraitRef<unknown, T> {
    throw new Error("abstract");
  };

  Object.defineProperty(TraitControllerRef.prototype, "trait", {
    get: function <T extends Trait>(this: TraitControllerRef<unknown, T, Controller>): T | null {
      const controller = this.controller;
      if (controller !== null) {
        const traitRef = this.getTraitRef(controller);
        return traitRef.trait;
      }
      return null;
    },
    configurable: true,
  });

  TraitControllerRef.prototype.setTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T | null, targetTrait?: Trait | null, key?: string): C | null {
    let controller = this.controller;
    if (trait !== null) {
      if (controller === null) {
        controller = this.createController(trait);
      }
      const traitRef = this.getTraitRef(controller);
      traitRef.setTrait(trait, targetTrait, this.traitKey);
      this.setController(controller, null, key);
    } else if (controller !== null) {
      const traitRef = this.getTraitRef(controller);
      traitRef.setTrait(null);
    }
    return controller;
  };

  TraitControllerRef.prototype.attachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait?: T | null, targetTrait?: Trait | null): C {
    if (trait === void 0 || trait === null) {
      trait = this.createTrait();
    }
    let controller = this.controller;
    if (controller === null) {
      controller = this.createController(trait);
    }
    const traitRef = this.getTraitRef(controller);
    traitRef.setTrait(trait, targetTrait, this.traitKey);
    this.attachController(controller, null);
    return controller;
  };

  TraitControllerRef.prototype.initTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.willAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.onAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.didAttachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.detachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait?: T): C | null {
    const controller = this.controller;
    if (controller !== null && this.getTraitRef(controller).trait === trait) {
      this.willDetachTrait(trait, controller);
      this.onDetachTrait(trait, controller);
      this.deinitTrait(trait, controller);
      this.didDetachTrait(trait, controller);
      return controller;
    }
    return null;
  };

  TraitControllerRef.prototype.deinitTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.willDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.onDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.didDetachTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T, controller: C): void {
    // hook
  };

  TraitControllerRef.prototype.removeTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T | null): C | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitRef = this.getTraitRef(controller);
      if (traitRef.trait === trait) {
        controller.remove();
        return controller;
      }
    }
    return null;
  };

  TraitControllerRef.prototype.deleteTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, trait: T | null): C | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitRef = this.getTraitRef(controller);
      if (traitRef.trait === trait) {
        controller.remove();
        this.setController(null);
        return controller;
      }
    }
    return null;
  };

  TraitControllerRef.prototype.onAttachController = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, controller: C, targetController: Controller | null): void {
    const trait = this.getTraitRef(controller).trait;
    if (trait !== null) {
      const targetTrait = targetController !== null ? this.getTraitRef(targetController as C).trait : null;
      this.attachTrait(trait, targetTrait);
    }
    ControllerRef.prototype.onAttachController.call(this, controller, targetController);
  };

  TraitControllerRef.prototype.onDetachController = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>, controller: C): void {
    ControllerRef.prototype.onDetachController.call(this, controller);
    const trait = this.getTraitRef(controller).trait;
    if (trait !== null) {
      this.detachTrait(trait);
    }
  };

  TraitControllerRef.prototype.createTrait = function <T extends Trait, C extends Controller>(this: TraitControllerRef<unknown, T, C>): T {
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

  TraitControllerRef.refine = function (fastenerClass: TraitControllerRefClass): void {
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

  return TraitControllerRef;
})(ControllerRef);
