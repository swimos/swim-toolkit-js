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
import type {FastenerOwner} from "@swim/component";
import type {TraitClass, Trait, TraitRef} from "@swim/model";
import type {Controller} from "../controller/Controller";
import {ControllerRefInit, ControllerRefClass, ControllerRef} from "../controller/ControllerRef";

/** @internal */
export type TraitControllerRefType<F extends TraitControllerRef<any, any, any>> =
  F extends TraitControllerRef<any, any, infer C> ? C : never;

/** @public */
export interface TraitControllerRefInit<T extends Trait, C extends Controller = Controller> extends ControllerRefInit<C> {
  extends?: {prototype: TraitControllerRef<any, any, any>} | string | boolean | null;
  traitType?: TraitClass<T>;
  traitKey?: string | boolean;

  getTraitRef?(controller: C): TraitRef<any, T>;

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
export type TraitControllerRefDescriptor<O = unknown, T extends Trait = Trait, C extends Controller = Controller, I = {}> = ThisType<TraitControllerRef<O, T, C> & I> & TraitControllerRefInit<T, C> & Partial<I>;

/** @public */
export interface TraitControllerRefClass<F extends TraitControllerRef<any, any, any> = TraitControllerRef<any, any, any>> extends ControllerRefClass<F> {
}

/** @public */
export interface TraitControllerRefFactory<F extends TraitControllerRef<any, any, any> = TraitControllerRef<any, any, any>> extends TraitControllerRefClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): TraitControllerRefFactory<F> & I;

  define<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, descriptor: TraitControllerRefDescriptor<O, T, C>): TraitControllerRefFactory<TraitControllerRef<any, T, C>>;
  define<O, T extends Trait = Trait, C extends Controller = Controller>(className: string, descriptor: {observes: boolean} & TraitControllerRefDescriptor<O, T, C, ObserverType<C>>): TraitControllerRefFactory<TraitControllerRef<any, T, C>>;
  define<O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown} & TraitControllerRefDescriptor<O, T, C, I>): TraitControllerRefFactory<TraitControllerRef<any, T, C> & I>;
  define<O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & TraitControllerRefDescriptor<O, T, C, I & ObserverType<C>>): TraitControllerRefFactory<TraitControllerRef<any, T, C> & I>;

  <O, T extends Trait = Trait, C extends Controller = Controller>(descriptor: TraitControllerRefDescriptor<O, T, C>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller>(descriptor: {observes: boolean} & TraitControllerRefDescriptor<O, T, C, ObserverType<C>>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown} & TraitControllerRefDescriptor<O, T, C, I>): PropertyDecorator;
  <O, T extends Trait = Trait, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown; observes: boolean} & TraitControllerRefDescriptor<O, T, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface TraitControllerRef<O = unknown, T extends Trait = Trait, C extends Controller = Controller> extends ControllerRef<O, C> {
  /** @override */
  get fastenerType(): Proto<TraitControllerRef<any, any, any>>;

  /** @internal */
  getTraitRef(controller: C): TraitRef<unknown, T>;

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

  /** @internal @protected */
  get traitType(): TraitClass<T> | undefined; // optional prototype property

  /** @internal */
  get traitKey(): string | undefined; // optional prototype field
}

/** @public */
export const TraitControllerRef = (function (_super: typeof ControllerRef) {
  const TraitControllerRef: TraitControllerRefFactory = _super.extend("TraitControllerRef");

  Object.defineProperty(TraitControllerRef.prototype, "fastenerType", {
    get: function (this: TraitControllerRef): Proto<TraitControllerRef<any, any, any>> {
      return TraitControllerRef;
    },
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

  TraitControllerRef.construct = function <F extends TraitControllerRef<any, any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    return fastener;
  };

  TraitControllerRef.define = function <O, T extends Trait, C extends Controller>(className: string, descriptor: TraitControllerRefDescriptor<O, T, C>): TraitControllerRefFactory<TraitControllerRef<any, T, C>> {
    let superClass = descriptor.extends as TraitControllerRefFactory | null | undefined;
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

    fastenerClass.construct = function (fastenerClass: {prototype: TraitControllerRef<any, any, any>}, fastener: TraitControllerRef<O, T, C> | null, owner: O): TraitControllerRef<O, T, C> {
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

  return TraitControllerRef;
})(ControllerRef);
