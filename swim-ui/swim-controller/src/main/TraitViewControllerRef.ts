// Copyright 2015-2023 Swim.inc
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

import type {Proto} from "@swim/util";
import type {LikeType} from "@swim/util";
import type {FastenerClass} from "@swim/component";
import type {Fastener} from "@swim/component";
import type {TraitFactory} from "@swim/model";
import type {Trait} from "@swim/model";
import type {ViewFactory} from "@swim/view";
import type {View} from "@swim/view";
import type {Controller} from "./Controller";
import type {ControllerRefDescriptor} from "./ControllerRef";
import type {ControllerRefClass} from "./ControllerRef";
import {ControllerRef} from "./ControllerRef";
import type {TraitViewRef} from "./TraitViewRef";

/** @public */
export interface TraitViewControllerRefDescriptor<R, T extends Trait, V extends View, C extends Controller> extends ControllerRefDescriptor<R, C> {
  extends?: Proto<TraitViewControllerRef<any, any, any, any>> | boolean | null;
  traitKey?: string | boolean;
  viewKey?: string | boolean;
}

/** @public */
export interface TraitViewControllerRefClass<F extends TraitViewControllerRef<any, any, any, any> = TraitViewControllerRef<any, any, any, any>> extends ControllerRefClass<F> {
}

/** @public */
export interface TraitViewControllerRef<R = any, T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerRef<R, C> {
  /** @override */
  get descriptorType(): Proto<TraitViewControllerRefDescriptor<R, T, V, C>>;

  getTraitViewRef(controller: C): TraitViewRef<any, T, V>;

  get traitType(): TraitFactory<T> | null;

  get traitKey(): string | undefined;

  get trait(): T | null;

  getTrait(): T;

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

  insertTrait(parent?: Controller | null, trait?: T, targetTrait?: Trait | null, key?: string): C;

  removeTrait(trait: T | null): C | null;

  deleteTrait(trait: T | null): C | null;

  createTrait(): T;

  get viewType(): ViewFactory<V> | null;

  get viewKey(): string | undefined;

  get view(): V | null;

  getView(): V;

  setView(view: V | LikeType<V> | null, targetView?: View | null, key?: string): V | null;

  attachView(view?: V | LikeType<V>, targetView?: View | null): V;

  detachView(): V | null;

  get parentView(): View | null;

  insertView(parentView?: View | null, view?: V | LikeType<V>, targetView?: View | null, key?: string): V;

  removeView(): V | null;

  deleteView(): V | null;

  /** @override */
  createController(trait?: T): C;
}

/** @public */
export const TraitViewControllerRef = (<R, T extends Trait, V extends View, C extends Controller, F extends TraitViewControllerRef<any, any, any, any>>() => ControllerRef.extend<TraitViewControllerRef<R, T, V, C>, TraitViewControllerRefClass<F>>("TraitViewControllerRef", {
  getTraitViewRef(controller: C): TraitViewRef<any, T, V> {
    throw new Error("missing implementation");
  },

  traitType: null,

  traitKey: void 0,

  get trait(): T | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.trait;
  },

  getTrait(): T {
    const trait = this.trait;
    if (trait === null) {
      let message = trait + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "trait";
      throw new TypeError(message);
    }
    return trait;
  },

  setTrait(trait: T | null, targetTrait?: Trait | null, key?: string): C | null {
    let controller = this.controller;
    if (trait !== null) {
      if (controller === null) {
        controller = this.createController(trait);
      }
      const traitViewRef = this.getTraitViewRef(controller);
      traitViewRef.setTrait(trait, targetTrait, this.traitKey);
      this.setController(controller);
      if (traitViewRef.view === null) {
        traitViewRef.insertView(this.parentView, null, null, this.viewKey);
      }
    } else if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      traitViewRef.setTrait(null);
    }
    return controller;
  },

  attachTrait(trait?: T | null, targetTrait?: Trait | null): C {
    if (trait === void 0 || trait === null) {
      trait = this.createTrait();
    }
    let controller = this.controller;
    if (controller === null) {
      controller = this.createController(trait);
    }
    const traitViewRef = this.getTraitViewRef(controller);
    traitViewRef.setTrait(trait, targetTrait, this.traitKey);
    this.attachController(controller, null);
    return controller;
  },

  initTrait(trait: T, controller: C): void {
    // hook
  },

  willAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  },

  onAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  },

  didAttachTrait(trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  },

  detachTrait(trait?: T): C | null {
    const controller = this.controller;
    if (controller === null || this.getTraitViewRef(controller).trait !== trait) {
      return null;
    }
    this.willDetachTrait(trait, controller);
    this.onDetachTrait(trait, controller);
    this.deinitTrait(trait, controller);
    this.didDetachTrait(trait, controller);
    return controller;
  },

  deinitTrait(trait: T, controller: C): void {
    // hook
  },

  willDetachTrait(trait: T, controller: C): void {
    // hook
  },

  onDetachTrait(trait: T, controller: C): void {
    // hook
  },

  didDetachTrait(trait: T, controller: C): void {
    // hook
  },

  insertTrait(parent?: Controller | null, trait?: T, targetTrait?: Trait | null, key?: string): C {
    if (trait === void 0 || trait === null) {
      trait = this.createTrait();
    }
    let controller = this.controller;
    if (controller === null) {
      controller = this.createController(trait);
    }
    const traitViewRef = this.getTraitViewRef(controller);
    traitViewRef.setTrait(trait, targetTrait, this.traitKey);
    this.insertController(parent, controller);
    return controller;
  },

  removeTrait(trait: T | null): C | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    if (traitViewRef.trait !== trait) {
      return null;
    }
    controller.remove();
    return controller;
  },

  deleteTrait(trait: T | null): C | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    if (traitViewRef.trait !== trait) {
      return null;
    }
    controller.remove();
    this.setController(null);
    return controller;
  },

  createTrait(): T {
    let trait: T | undefined;
    const traitType = this.traitType;
    if (traitType !== null) {
      trait = traitType.create();
    }
    if (trait === void 0 || trait === null) {
      let message = "unable to create ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "trait";
      throw new Error(message);
    }
    return trait;
  },

  viewType: null,

  viewKey: void 0,

  get view(): V | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.view;
  },

  getView(): V {
    const view = this.view;
    if (view === null) {
      let message = view + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "view";
      throw new TypeError(message);
    }
    return view;
  },

  setView(view: V | LikeType<V> | null, targetView?: View | null, key?: string): V | null {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    if (key === void 0) {
      key = this.viewKey;
    }
    return traitViewRef.setView(view, targetView, key);
  },

  attachView(view?: V | LikeType<V>, targetView?: View | null): V {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.attachView(view, targetView);
  },

  detachView(): V | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.detachView();
  },

  get parentView(): View | null {
    return null;
  },

  insertView(parentView?: View | null, view?: V | LikeType<V>, targetView?: View | null, key?: string): V {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    if (parentView === void 0 || parentView === null) {
      parentView = this.parentView;
    }
    if (key === void 0) {
      key = this.viewKey;
    }
    return traitViewRef.insertView(parentView, view, targetView, key);
  },

  removeView(): V | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.removeView();
  },

  deleteView(): V | null {
    const controller = this.controller;
    if (controller === null) {
      return null;
    }
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.deleteView();
  },
},
{
  construct(fastener: F | null, owner: F extends Fastener<infer R, any, any> ? R : never): F {
    fastener = super.construct(fastener, owner) as F;
    return fastener;
  },

  refine(fastenerClass: FastenerClass<TraitViewControllerRef<any, any, any, any>>): void {
    super.refine(fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    const traitKeyDescriptor = Object.getOwnPropertyDescriptor(fastenerPrototype, "traitKey");
    if (traitKeyDescriptor !== void 0 && "value" in traitKeyDescriptor) {
      if (traitKeyDescriptor.value === true) {
        traitKeyDescriptor.value = fastenerClass.name;
        Object.defineProperty(fastenerPrototype, "traitKey", traitKeyDescriptor);
      } else if (traitKeyDescriptor.value === false) {
        traitKeyDescriptor.value = void 0;
        Object.defineProperty(fastenerPrototype, "traitKey", traitKeyDescriptor);
      }
    }

    const viewKeyDescriptor = Object.getOwnPropertyDescriptor(fastenerPrototype, "viewKey");
    if (viewKeyDescriptor !== void 0 && "value" in viewKeyDescriptor) {
      if (viewKeyDescriptor.value === true) {
        viewKeyDescriptor.value = fastenerClass.name;
        Object.defineProperty(fastenerPrototype, "viewKey", viewKeyDescriptor);
      } else if (viewKeyDescriptor.value === false) {
        viewKeyDescriptor.value = void 0;
        Object.defineProperty(fastenerPrototype, "viewKey", viewKeyDescriptor);
      }
    }
  },
}))();
