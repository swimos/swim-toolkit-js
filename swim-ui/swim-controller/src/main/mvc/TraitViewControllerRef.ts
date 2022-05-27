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
import type {TraitFactory, Trait} from "@swim/model";
import type {AnyView, ViewFactory, View} from "@swim/view";
import type {Controller} from "../controller/Controller";
import {
  ControllerRefRefinement,
  ControllerRefTemplate,
  ControllerRefClass,
  ControllerRef,
} from "../controller/ControllerRef";
import type {TraitViewRef} from "./TraitViewRef";

/** @public */
export interface TraitViewControllerRefRefinement extends ControllerRefRefinement {
  trait?: Trait;
  view?: View;
}

/** @public */
export type TraitViewControllerRefTrait<R extends TraitViewControllerRefRefinement | TraitViewControllerRef<any, any, any, any>, D = Trait> =
  R extends {trait: infer T} ? T :
  R extends {extends: infer E} ? TraitViewControllerRefTrait<E, D> :
  R extends TraitViewControllerRef<any, infer T, any, any> ? T :
  D;

/** @public */
export type TraitViewControllerRefView<R extends TraitViewControllerRefRefinement | TraitViewControllerRef<any, any, any, any>, D = View> =
  R extends {view: infer V} ? V :
  R extends {extends: infer E} ? TraitViewControllerRefView<E, D> :
  R extends TraitViewControllerRef<any, any, infer V, any> ? V :
  D;

/** @public */
export type TraitViewControllerRefController<R extends TraitViewControllerRefRefinement | TraitViewControllerRef<any, any, any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? TraitViewControllerRefController<E, D> :
  R extends TraitViewControllerRef<any, any, any, infer C> ? C :
  D;

/** @public */
export interface TraitViewControllerRefTemplate<T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerRefTemplate<C> {
  extends?: Proto<TraitViewControllerRef<any, any, any, any>> | string | boolean | null;
  traitType?: TraitFactory<T>;
  traitKey?: string | boolean;
  viewType?: ViewFactory<V>;
  viewKey?: string | boolean;
}

/** @public */
export interface TraitViewControllerRefClass<F extends TraitViewControllerRef<any, any, any, any> = TraitViewControllerRef<any, any, any, any>> extends ControllerRefClass<F> {
  /** @override */
  specialize(className: string, template: TraitViewControllerRefTemplate): TraitViewControllerRefClass;

  /** @override */
  refine(fastenerClass: TraitViewControllerRefClass): void;

  /** @override */
  extend(className: string, template: TraitViewControllerRefTemplate): TraitViewControllerRefClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(className: string, template: ThisType<TraitViewControllerRef<O, T, V, C>> & TraitViewControllerRefTemplate<T, V, C> & Partial<Omit<TraitViewControllerRef<O, T, V, C>, keyof TraitViewControllerRefTemplate>>): TraitViewControllerRefClass<F>;

  /** @override */
  <O, T extends Trait = Trait, V extends View = View, C extends Controller = Controller>(template: ThisType<TraitViewControllerRef<O, T, V, C>> & TraitViewControllerRefTemplate<T, V, C> & Partial<Omit<TraitViewControllerRef<O, T, V, C>, keyof TraitViewControllerRefTemplate>>): PropertyDecorator;
}

/** @public */
export type TraitViewControllerRefDef<O, R extends TraitViewControllerRefRefinement> =
  TraitViewControllerRef<O, TraitViewControllerRefTrait<R>, TraitViewControllerRefView<R>, TraitViewControllerRefController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer D} ? D : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitViewControllerRefController<R> : B> : {});

/** @public */
export function TraitViewControllerRefDef<F extends TraitViewControllerRef<any, any, any, any>>(
  template: F extends TraitViewControllerRefDef<infer O, infer R>
          ? ThisType<TraitViewControllerRefDef<O, R>>
          & TraitViewControllerRefTemplate<TraitViewControllerRefTrait<R>, TraitViewControllerRefView<R>, TraitViewControllerRefController<R>>
          & Partial<Omit<TraitViewControllerRef<O, TraitViewControllerRefTrait<R>, TraitViewControllerRefView<R>, TraitViewControllerRefController<R>>, keyof TraitViewControllerRefTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitViewControllerRefTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer D} ? Partial<D> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitViewControllerRefController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitViewControllerRef(template);
}

/** @public */
export interface TraitViewControllerRef<O = unknown, T extends Trait = Trait, V extends View = View, C extends Controller = Controller> extends ControllerRef<O, C> {
  /** @override */
  get fastenerType(): Proto<TraitViewControllerRef<any, any, any, any>>;

  /** @internal */
  getTraitViewRef(controller: C): TraitViewRef<unknown, T, V>;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @internal */
  readonly traitKey?: string; // optional prototype property

  get trait(): T | null;

  getTrait(): T;

  setTrait(trait: T | null, targetTrait?: Trait | null, key?: string): T | null;

  removeTrait(trait: T | null): C | null;

  deleteTrait(trait: T | null): C | null;

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

  createTrait(): T;

  /** @override */
  createController(trait?: T): C;
}

/** @public */
export const TraitViewControllerRef = (function (_super: typeof ControllerRef) {
  const TraitViewControllerRef = _super.extend("TraitViewControllerRef", {}) as TraitViewControllerRefClass;

  Object.defineProperty(TraitViewControllerRef.prototype, "fastenerType", {
    value: TraitViewControllerRef,
    configurable: true,
  });

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
    configurable: true,
  });

  TraitViewControllerRef.prototype.getTrait = function <T extends Trait>(this: TraitViewControllerRef<unknown, T, View, Controller>): T {
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

  TraitViewControllerRef.prototype.setTrait = function <T extends Trait>(this: TraitViewControllerRef<unknown, T, View, Controller>, newTrait: T | null, targetTrait?: Trait | null, key?: string): T | null {
    let controller = this.controller;
    if (newTrait !== null) {
      if (controller === null) {
        controller = this.createController(newTrait);
      }
      const traitViewRef = this.getTraitViewRef(controller);
      const traitKey = key !== void 0 ? key : this.traitKey;
      const oldTrait = traitViewRef.setTrait(newTrait, targetTrait, traitKey);
      this.setController(controller);
      if (traitViewRef.view === null) {
        traitViewRef.insertView(this.parentView, null, null, this.viewKey);
      }
      return oldTrait;
    } else if (controller !== null) {
      const traitViewRef = this.getTraitViewRef(controller);
      return traitViewRef.setTrait(null);
    }
    return null;
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
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "trait";
      throw new Error(message);
    }
    return trait;
  };

  Object.defineProperty(TraitViewControllerRef.prototype, "parentView", {
    value: null,
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
    configurable: true,
  });

  TraitViewControllerRef.prototype.getView = function <V extends View>(this: TraitViewControllerRef<unknown, Trait, V, Controller>): V {
    const view = this.view;
    if (view === null) {
      let message = view + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
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
    configurable: true,
  });

  TraitViewControllerRef.refine = function (fastenerClass: TraitViewControllerRefClass): void {
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
