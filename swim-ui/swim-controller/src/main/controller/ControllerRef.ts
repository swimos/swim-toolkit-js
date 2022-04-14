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

import type {Mutable, Proto, ObserverType} from "@swim/util";
import {Affinity, FastenerOwner, Fastener} from "@swim/component";
import type {AnyController, Controller} from "./Controller";
import {
  ControllerRelationRefinement,
  ControllerRelationTemplate,
  ControllerRelationClass,
  ControllerRelation,
} from "./ControllerRelation";

/** @public */
export interface ControllerRefRefinement extends ControllerRelationRefinement {
}

/** @public */
export type ControllerRefController<R extends ControllerRefRefinement | ControllerRef<any, any>, D = Controller> =
  R extends {controller: infer C | null} ? C :
  R extends {extends: infer E} ? ControllerRefController<E, D> :
  R extends ControllerRef<any, infer C> ? C :
  D;

/** @public */
export interface ControllerRefTemplate<C extends Controller = Controller> extends ControllerRelationTemplate<C> {
  extends?: Proto<ControllerRef<any, any>> | string | boolean | null;
  controllerKey?: string | boolean;
}

/** @public */
export interface ControllerRefClass<F extends ControllerRef<any, any> = ControllerRef<any, any>> extends ControllerRelationClass<F> {
  /** @override */
  specialize(className: string, template: ControllerRefTemplate): ControllerRefClass;

  /** @override */
  refine(fastenerClass: ControllerRefClass): void;

  /** @override */
  extend(className: string, template: ControllerRefTemplate): ControllerRefClass<F>;

  /** @override */
  specify<O, C extends Controller = Controller>(className: string, template: ThisType<ControllerRef<O, C>> & ControllerRefTemplate<C> & Partial<Omit<ControllerRef<O, C>, keyof ControllerRefTemplate>>): ControllerRefClass<F>;

  /** @override */
  <O, C extends Controller = Controller>(template: ThisType<ControllerRef<O, C>> & ControllerRefTemplate<C> & Partial<Omit<ControllerRef<O, C>, keyof ControllerRefTemplate>>): PropertyDecorator;
}

/** @public */
export type ControllerRefDef<O, R extends ControllerRefRefinement = {}> =
  ControllerRef<O, ControllerRefController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ControllerRefController<R> : B> : {});

/** @public */
export function ControllerRefDef<F extends ControllerRef<any, any>>(
  template: F extends ControllerRefDef<infer O, infer R>
          ? ThisType<ControllerRefDef<O, R>>
          & ControllerRefTemplate<ControllerRefController<R>>
          & Partial<Omit<ControllerRef<O, ControllerRefController<R>>, keyof ControllerRefTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ControllerRefTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ControllerRefController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ControllerRef(template);
}

/** @public */
export interface ControllerRef<O = unknown, C extends Controller = Controller> extends ControllerRelation<O, C> {
  (): C | null;
  (controller: AnyController<C> | null, target?: Controller | null, key?: string): O;

  /** @override */
  get fastenerType(): Proto<ControllerRef<any, any>>;

  /** @internal @override */
  getSuper(): ControllerRef<unknown, C> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  willDerive(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  onDerive(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  didDerive(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  willUnderive(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  onUnderive(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  didUnderive(inlet: ControllerRef<unknown, C>): void;

  /** @override */
  readonly inlet: ControllerRef<unknown, C> | null;

  /** @protected @override */
  willBindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  onBindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  didBindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ControllerRef<unknown, C>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<ControllerRef<unknown, C>> | null;

  /** @internal @override */
  attachOutlet(outlet: ControllerRef<unknown, C>): void;

  /** @internal @override */
  detachOutlet(outlet: ControllerRef<unknown, C>): void;

  get inletController(): C | null;

  getInletController(): C;

  /** @internal */
  readonly controllerKey?: string; // optional prototype property

  readonly controller: C | null;

  getController(): C;

  setController(controller: AnyController<C> | null, target?: Controller | null, key?: string): C | null;

  attachController(controller?: AnyController<C>, target?: Controller | null): C;

  detachController(): C | null;

  insertController(parent?: Controller, controller?: AnyController<C>, target?: Controller | null, key?: string): C;

  removeController(): C | null;

  deleteController(): C | null;

  /** @internal @override */
  bindController(controller: Controller, target: Controller | null): void;

  /** @internal @override */
  unbindController(controller: Controller): void;

  /** @override */
  detectController(controller: Controller): C | null;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ControllerRef<unknown, C>): void;

  /** @override */
  recohere(t: number): void;
}

/** @public */
export const ControllerRef = (function (_super: typeof ControllerRelation) {
  const ControllerRef = _super.extend("ControllerRef", {}) as ControllerRefClass;

  Object.defineProperty(ControllerRef.prototype, "fastenerType", {
    value: ControllerRef,
    configurable: true,
  });

  ControllerRef.prototype.onDerive = function (this: ControllerRef, inlet: ControllerRef): void {
    const inletController = inlet.controller;
    if (inletController !== null) {
      this.attachController(inletController);
    } else {
      this.detachController();
    }
  };

  ControllerRef.prototype.onBindInlet = function <C extends Controller>(this: ControllerRef<unknown, C>, inlet: ControllerRef<unknown, C>): void {
    (this as Mutable<typeof this>).inlet = inlet;
    _super.prototype.onBindInlet.call(this, inlet);
  };

  ControllerRef.prototype.onUnbindInlet = function <C extends Controller>(this: ControllerRef<unknown, C>, inlet: ControllerRef<unknown, C>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    (this as Mutable<typeof this>).inlet = null;
  };

  ControllerRef.prototype.attachOutlet = function <C extends Controller>(this: ControllerRef<unknown, C>, outlet: ControllerRef<unknown, C>): void {
    let outlets = this.outlets as ControllerRef<unknown, C>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  ControllerRef.prototype.detachOutlet = function <C extends Controller>(this: ControllerRef<unknown, C>, outlet: ControllerRef<unknown, C>): void {
    const outlets = this.outlets as ControllerRef<unknown, C>[] | null;
    if (outlets !== null) {
      const index = outlets.indexOf(outlet);
      if (index >= 0) {
        outlets.splice(index, 1);
      }
    }
  };

  Object.defineProperty(ControllerRef.prototype, "inletController", {
    get: function <C extends Controller>(this: ControllerRef<unknown, C>): C | null {
      const inlet = this.inlet;
      return inlet !== null ? inlet.controller : null;
    },
    configurable: true,
  });

  ControllerRef.prototype.getInletController = function <C extends Controller>(this: ControllerRef<unknown, C>): C {
    const inletController = this.inletController;
    if (inletController === void 0 || inletController === null) {
      let message = inletController + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "inlet controller";
      throw new TypeError(message);
    }
    return inletController;
  };

  ControllerRef.prototype.getController = function <C extends Controller>(this: ControllerRef<unknown, C>): C {
    const controller = this.controller;
    if (controller === null) {
      let message = controller + " ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "controller";
      throw new TypeError(message);
    }
    return controller;
  };

  ControllerRef.prototype.setController = function <C extends Controller>(this: ControllerRef<unknown, C>, newController: C  | null, target?: Controller | null, key?: string): C | null {
    if (newController !== null) {
      newController = this.fromAny(newController);
    }
    let oldController = this.controller;
    if (oldController !== newController) {
      if (target === void 0) {
        target = null;
      }
      let parent: Controller | null;
      if (this.binds && (parent = this.parentController, parent !== null)) {
        if (oldController !== null && oldController.parent === parent) {
          if (target === null) {
            target = oldController.nextSibling;
          }
          oldController.remove();
        }
        if (newController !== null) {
          if (key === void 0) {
            key = this.controllerKey;
          }
          this.insertChild(parent, newController, target, key);
        }
        oldController = this.controller;
      }
      if (oldController !== newController) {
        if (oldController !== null) {
          (this as Mutable<typeof this>).controller = null;
          this.willDetachController(oldController);
          this.onDetachController(oldController);
          this.deinitController(oldController);
          this.didDetachController(oldController);
        }
        if (newController !== null) {
          (this as Mutable<typeof this>).controller = newController;
          this.willAttachController(newController, target);
          this.onAttachController(newController, target);
          this.initController(newController);
          this.didAttachController(newController, target);
        }
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
    return oldController;
  };

  ControllerRef.prototype.attachController = function <C extends Controller>(this: ControllerRef<unknown, C>, newController?: AnyController<C>, target?: Controller | null): C {
    const oldController = this.controller;
    if (newController !== void 0 && newController !== null) {
      newController = this.fromAny(newController);
    } else if (oldController === null) {
      newController = this.createController();
    } else {
      newController = oldController;
    }
    if (oldController !== newController) {
      if (target === void 0) {
        target = null;
      }
      if (oldController !== null) {
        (this as Mutable<typeof this>).controller = null;
        this.willDetachController(oldController);
        this.onDetachController(oldController);
        this.deinitController(oldController);
        this.didDetachController(oldController);
      }
      (this as Mutable<typeof this>).controller = newController;
      this.willAttachController(newController, target);
      this.onAttachController(newController, target);
      this.initController(newController);
      this.didAttachController(newController, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newController;
  };

  ControllerRef.prototype.detachController = function <C extends Controller>(this: ControllerRef<unknown, C>): C | null {
    const oldController = this.controller;
    if (oldController !== null) {
      (this as Mutable<typeof this>).controller = null;
      this.willDetachController(oldController);
      this.onDetachController(oldController);
      this.deinitController(oldController);
      this.didDetachController(oldController);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return oldController;
  };

  ControllerRef.prototype.insertController = function <C extends Controller>(this: ControllerRef<unknown, C>, parent?: Controller | null, newController?: AnyController<C>, target?: Controller | null, key?: string): C {
    if (newController !== void 0 && newController !== null) {
      newController = this.fromAny(newController);
    } else {
      const oldController = this.controller;
      if (oldController === null) {
        newController = this.createController();
      } else {
        newController = oldController;
      }
    }
    if (parent === void 0 || parent === null) {
      parent = this.parentController;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.controllerKey;
    }
    if (parent !== null && (newController.parent !== parent || newController.key !== key)) {
      this.insertChild(parent, newController, target, key);
    }
    const oldController = this.controller;
    if (oldController !== newController) {
      if (oldController !== null) {
        (this as Mutable<typeof this>).controller = null;
        this.willDetachController(oldController);
        this.onDetachController(oldController);
        this.deinitController(oldController);
        this.didDetachController(oldController);
        oldController.remove();
      }
      (this as Mutable<typeof this>).controller = newController;
      this.willAttachController(newController, target);
      this.onAttachController(newController, target);
      this.initController(newController);
      this.didAttachController(newController, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newController;
  };

  ControllerRef.prototype.removeController = function <C extends Controller>(this: ControllerRef<unknown, C>): C | null {
    const controller = this.controller;
    if (controller !== null) {
      controller.remove();
    }
    return controller;
  };

  ControllerRef.prototype.deleteController = function <C extends Controller>(this: ControllerRef<unknown, C>): C | null {
    const controller = this.detachController();
    if (controller !== null) {
      controller.remove();
    }
    return controller;
  };

  ControllerRef.prototype.bindController = function <C extends Controller>(this: ControllerRef<unknown, C>, controller: Controller, target: Controller | null): void {
    if (this.binds && this.controller === null) {
      const newController = this.detectController(controller);
      if (newController !== null) {
        (this as Mutable<typeof this>).controller = newController;
        this.willAttachController(newController, target);
        this.onAttachController(newController, target);
        this.initController(newController);
        this.didAttachController(newController, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ControllerRef.prototype.unbindController = function <C extends Controller>(this: ControllerRef<unknown, C>, controller: Controller): void {
    if (this.binds) {
      const oldController = this.detectController(controller);
      if (oldController !== null && this.controller === oldController) {
        (this as Mutable<typeof this>).controller = null;
        this.willDetachController(oldController);
        this.onDetachController(oldController);
        this.deinitController(oldController);
        this.didDetachController(oldController);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ControllerRef.prototype.detectController = function <C extends Controller>(this: ControllerRef<unknown, C>, controller: Controller): C | null {
    const key = this.controllerKey
    if (key !== void 0 && key === controller.key) {
      return controller as C;
    }
    return null;
  };

  ControllerRef.prototype.decohereOutlets = function (this: ControllerRef): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ControllerRef.prototype.decohereOutlet = function (this: ControllerRef, outlet: ControllerRef): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ControllerRef.prototype.recohere = function (this: ControllerRef, t: number): void {
    if ((this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null) {
        this.setController(inlet.controller);
      }
    }
  };

  ControllerRef.construct = function <F extends ControllerRef<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (controller?: AnyController<ControllerRefController<F>> | null, target?: Controller | null, key?: string): ControllerRefController<F> | null | FastenerOwner<F> {
        if (controller === void 0) {
          return fastener!.controller;
        } else {
          fastener!.setController(controller, target, key);
          return fastener!.owner;
        }
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    Object.defineProperty(fastener, "inlet", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).controller = null;
    return fastener;
  };

  ControllerRef.refine = function (fastenerClass: ControllerRefClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "controllerKey")) {
      const controllerKey = fastenerPrototype.controllerKey as string | boolean | undefined;
      if (controllerKey === true) {
        Object.defineProperty(fastenerPrototype, "controllerKey", {
          value: fastenerClass.name,
          enumerable: true,
          configurable: true,
        });
      } else if (controllerKey === false) {
        Object.defineProperty(fastenerPrototype, "controllerKey", {
          value: void 0,
          enumerable: true,
          configurable: true,
        });
      }
    }
  };

  return ControllerRef;
})(ControllerRelation);
