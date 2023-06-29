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
import type {TraitFactory} from "@swim/model";
import type {Trait} from "@swim/model";
import type {AnyView} from "@swim/view";
import type {ViewFactory} from "@swim/view";
import type {View} from "@swim/view";
import type {Controller} from "./Controller";
import type {ControllerRefDescriptor} from "./ControllerRef";
import type {ControllerRefClass} from "./ControllerRef";
import {ControllerRef} from "./ControllerRef";
import type {TraitViewRef} from "./TraitViewRef";

/** @public */
export interface TraitViewControllerRefDescriptor<T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerRefDescriptor<C> {
  extends?: Proto<TraitViewControllerRef<any, any, any, any>> | boolean | null;
  traitType?: TraitFactory<T>;
  traitKey?: string | boolean;
  viewType?: ViewFactory<V>;
  viewKey?: string | boolean;
}

/** @public */
export interface TraitViewControllerRefClass<F extends TraitViewControllerRef<any, any, any, any> = TraitViewControllerRef<any, any, any, any>> extends ControllerRefClass<F> {
}

/** @public */
export interface TraitViewControllerRef<O = unknown, T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerRef<O, C> {
  /** @override */
  get descriptorType(): Proto<TraitViewControllerRefDescriptor<T, V, C>>;

  /** @internal */
  getTraitViewRef(controller: C): TraitViewRef<unknown, T, V>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @internal */
  readonly traitKey?: string; // optional prototype property

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

  get parentView(): View | null;

  /** @internal */
  readonly viewType?: ViewFactory<V>; // optional prototype property

  /** @internal */
  readonly viewKey?: string; // optional prototype property

  get view(): V | null;

  getView(): V;

  setView(view: AnyView<V> | null, targetView?: View | null, key?: string): V | null;

  attachView(view?: AnyView<V>, targetView?: View | null): V;

  detachView(): V | null;

  insertView(parentView?: View | null, view?: AnyView<V>, targetView?: View | null, key?: string): V;

  removeView(): V | null;

  deleteView(): V | null;

  /** @override */
  createController(trait?: T): C;
}

/** @public */
export const TraitViewControllerRef = (function (_super: typeof ControllerRef) {
  const TraitViewControllerRef = _super.extend("TraitViewControllerRef", {}) as TraitViewControllerRefClass;

  TraitViewControllerRef.prototype.getTraitViewRef = function <T extends Trait, V extends View, C extends Controller>(controller: C): TraitViewRef<unknown, T, V> {
    throw new Error("abstract");
  };

  Object.defineProperty(TraitViewControllerRef.prototype, "trait", {
    get: function <T extends Trait>(this: TraitViewControllerRef<unknown, T, View, Controller>): T | null {
      const controller = this.controller;
      if (controller !== null) {
        const traitViewRef = this.getTraitViewRef(controller);
        return traitViewRef.trait;
      }
      return null;
    },
    enumerable: true,
    configurable: true,
  });

  TraitViewControllerRef.prototype.getTrait = function <T extends Trait>(this: TraitViewControllerRef<unknown, T, View, Controller>): T {
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
  };

  TraitViewControllerRef.prototype.setTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T | null, targetTrait?: Trait | null, key?: string): C | null {
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
  };

  TraitViewControllerRef.prototype.attachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait?: T | null, targetTrait?: Trait | null): C {
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
  };

  TraitViewControllerRef.prototype.initTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.willAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.onAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.didAttachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, targetTrait: Trait | null, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.detachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait?: T): C | null {
    const controller = this.controller;
    if (controller !== null && this.getTraitViewRef(controller).trait === trait) {
      this.willDetachTrait(trait, controller);
      this.onDetachTrait(trait, controller);
      this.deinitTrait(trait, controller);
      this.didDetachTrait(trait, controller);
      return controller;
    }
    return null;
  };

  TraitViewControllerRef.prototype.deinitTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.willDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.onDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.didDetachTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T, controller: C): void {
    // hook
  };

  TraitViewControllerRef.prototype.insertTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, parent?: Controller | null, trait?: T, targetTrait?: Trait | null, key?: string): C {
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
  };

  TraitViewControllerRef.prototype.removeTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T | null): C | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      if (traitViewRef.trait === trait) {
        controller.remove();
        return controller;
      }
    }
    return null;
  };

  TraitViewControllerRef.prototype.deleteTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>, trait: T | null): C | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      if (traitViewRef.trait === trait) {
        controller.remove();
        this.setController(null);
        return controller;
      }
    }
    return null;
  };

  TraitViewControllerRef.prototype.createTrait = function <T extends Trait, C extends Controller>(this: TraitViewControllerRef<unknown, T, View, C>): T {
    let trait: T | undefined;
    const traitType = this.traitType;
    if (traitType !== void 0) {
      trait = traitType.create();
    }
    if (trait === void 0 || trait === null) {
      let message = "Unable to create ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "trait";
      throw new Error(message);
    }
    return trait;
  };

  Object.defineProperty(TraitViewControllerRef.prototype, "parentView", {
    value: null,
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(TraitViewControllerRef.prototype, "view", {
    get: function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V | null {
      const controller = this.controller;
      if (controller !== null) {
        const traitViewRef = this.getTraitViewRef(controller);
        return traitViewRef.view;
      }
      return null;
    },
    enumerable: true,
    configurable: true,
  });

  TraitViewControllerRef.prototype.getView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V {
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
  };

  TraitViewControllerRef.prototype.setView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>, view: AnyView<V> | null, targetView?: View | null, key?: string): V | null {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    if (key === void 0) {
      key = this.viewKey;
    }
    return traitViewRef.setView(view, targetView, key);
  };

  TraitViewControllerRef.prototype.attachView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>, view?: AnyView<V>, targetView?: View | null): V | null {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    return traitViewRef.attachView(view, targetView);
  };

  TraitViewControllerRef.prototype.detachView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      return traitViewRef.detachView();
    }
    return null;
  };

  TraitViewControllerRef.prototype.insertView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>, parentView?: View | null, view?: AnyView<V>, targetView?: View | null, key?: string): V {
    const controller = this.attachController();
    const traitViewRef = this.getTraitViewRef(controller);
    if (parentView === void 0 || parentView === null) {
      parentView = this.parentView;
    }
    if (key === void 0) {
      key = this.viewKey;
    }
    return traitViewRef.insertView(parentView, view, targetView, key);
  };

  TraitViewControllerRef.prototype.removeView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      return traitViewRef.removeView();
    }
    return null;
  };

  TraitViewControllerRef.prototype.deleteView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V | null {
    const controller = this.controller;
    if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      return traitViewRef.deleteView();
    }
    return null;
  };

  Object.defineProperty(TraitViewControllerRef.prototype, "parentView", {
    get: function (this: TraitViewControllerRef): View | null {
      return null;
    },
    enumerable: true,
    configurable: true,
  });

  TraitViewControllerRef.refine = function (fastenerClass: TraitViewControllerRefClass<any>): void {
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

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "viewKey")) {
      const viewKey = fastenerPrototype.viewKey as string | boolean | undefined;
      if (viewKey === true) {
        Object.defineProperty(fastenerPrototype, "traitKey", {
          value: fastenerClass.name,
          enumerable: true,
          configurable: true,
        });
      } else if (viewKey === false) {
        Object.defineProperty(fastenerPrototype, "viewKey", {
          value: void 0,
          enumerable: true,
          configurable: true,
        });
      }
    }
  };

  return TraitViewControllerRef;
})(ControllerRef);
