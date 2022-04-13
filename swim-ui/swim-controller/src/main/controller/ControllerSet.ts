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
import {Affinity, FastenerOwner, FastenerFlags, Fastener} from "@swim/component";
import type {AnyController, Controller} from "./Controller";
import {
  ControllerRelationRefinement,
  ControllerRelationTemplate,
  ControllerRelationClass,
  ControllerRelation,
} from "./ControllerRelation";

/** @public */
export interface ControllerSetRefinement extends ControllerRelationRefinement {
}

/** @public */
export type ControllerSetController<R extends ControllerSetRefinement | ControllerSet<any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? ControllerSetController<E, D> :
  R extends ControllerSet<any, infer C> ? C :
  D;

/** @public */
export interface ControllerSetTemplate<C extends Controller = Controller> extends ControllerRelationTemplate<C> {
  extends?: Proto<ControllerSet<any, any>> | string | boolean | null;
  sorted?: boolean;
}

/** @public */
export interface ControllerSetClass<F extends ControllerSet<any, any> = ControllerSet<any, any>> extends ControllerRelationClass<F> {
  /** @override */
  specialize(className: string, template: ControllerSetTemplate): ControllerSetClass;

  /** @override */
  refine(fastenerClass: ControllerSetClass): void;

  /** @override */
  extend(className: string, template: ControllerSetTemplate): ControllerSetClass<F>;

  /** @override */
  specify<O, C extends Controller = Controller>(className: string, template: ThisType<ControllerSet<O, C>> & ControllerSetTemplate<C> & Partial<Omit<ControllerSet<O, C>, keyof ControllerSetTemplate>>): ControllerSetClass<F>;

  /** @override */
  <O, C extends Controller = Controller>(template: ThisType<ControllerSet<O, C>> & ControllerSetTemplate<C> & Partial<Omit<ControllerSet<O, C>, keyof ControllerSetTemplate>>): PropertyDecorator;

  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type ControllerSetDef<O, R extends ControllerSetRefinement> =
  ControllerSet<O, ControllerSetController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ControllerSetController<R> : B> : {});

/** @public */
export function ControllerSetDef<F extends ControllerSet<any, any>>(
  template: F extends ControllerSetDef<infer O, infer R>
          ? ThisType<ControllerSetDef<O, R>>
          & ControllerSetTemplate<ControllerSetController<R>>
          & Partial<Omit<ControllerSet<O, ControllerSetController<R>>, keyof ControllerSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ControllerSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ControllerSetController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ControllerSet(template);
}

/** @public */
export interface ControllerSet<O = unknown, C extends Controller = Controller> extends ControllerRelation<O, C> {
  (controller: AnyController<C>): O;

  /** @override */
  get fastenerType(): Proto<ControllerSet<any, any>>;

  /** @internal @override */
  getSuper(): ControllerSet<unknown, C> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willDerive(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onDerive(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didDerive(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willUnderive(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onUnderive(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didUnderive(inlet: ControllerSet<unknown, C>): void;

  /** @override */
  readonly inlet: ControllerSet<unknown, C> | null;

  /** @protected @override */
  willBindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onBindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didBindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ControllerSet<unknown, C>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<ControllerSet<unknown, C>> | null;

  /** @internal @override */
  attachOutlet(outlet: ControllerSet<unknown, C>): void;

  /** @internal @override */
  detachOutlet(outlet: ControllerSet<unknown, C>): void;

  /** @internal */
  readonly controllers: {readonly [controllerId: number]: C | undefined};

  readonly controllerCount: number;

  hasController(controller: Controller): boolean;

  addController(controller?: AnyController<C>, target?: Controller | null, key?: string): C;

  addControllers(controllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void;

  setControllers(controllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void;

  attachController(controller?: AnyController<C>, target?: Controller | null): C;

  attachControllers(controllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void;

  detachController(controller: C): C | null;

  detachControllers(controllers?: {readonly [controllerId: number]: C | undefined}): void;

  insertController(parent?: Controller | null, controller?: AnyController<C>, target?: Controller | null, key?: string): C;

  insertControllers(parent: Controller | null, controllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void;

  removeController(controller: C): C | null;

  removeControllers(controllers?: {readonly [controllerId: number]: C | undefined}): void;

  deleteController(controller: C): C | null;

  deleteControllers(controllers?: {readonly [controllerId: number]: C | undefined}): void;

  /** @internal @override */
  bindController(controller: Controller, target: Controller | null): void;

  /** @internal @override */
  unbindController(controller: Controller): void;

  /** @override */
  detectController(controller: Controller): C | null;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ControllerSet<unknown, C>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  controllerKey(controller: C): string | undefined;

  /** @internal */
  initSorted(sorted: boolean): void;

  get sorted(): boolean;

  sort(sorted?: boolean): this;

  /** @protected */
  willSort(parent: Controller | null): void;

  /** @protected */
  onSort(parent: Controller | null): void;

  /** @protected */
  didSort(parent: Controller | null): void;

  /** @internal @protected */
  sortChildren(parent: Controller): void;

  /** @internal */
  compareChildren(a: Controller, b: Controller): number;

  /** @internal @protected */
  compare(a: C, b: C): number;
}

/** @public */
export const ControllerSet = (function (_super: typeof ControllerRelation) {
  const ControllerSet = _super.extend("ControllerSet", {}) as ControllerSetClass;

  Object.defineProperty(ControllerSet.prototype, "fastenerType", {
    value: ControllerSet,
    configurable: true,
  });

  ControllerSet.prototype.onDerive = function (this: ControllerSet, inlet: ControllerSet): void {
    this.setControllers(inlet.controllers);
  };

  ControllerSet.prototype.onBindInlet = function <C extends Controller>(this: ControllerSet<unknown, C>, inlet: ControllerSet<unknown, C>): void {
    (this as Mutable<typeof this>).inlet = inlet;
    _super.prototype.onBindInlet.call(this, inlet);
  };

  ControllerSet.prototype.onUnbindInlet = function <C extends Controller>(this: ControllerSet<unknown, C>, inlet: ControllerSet<unknown, C>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    (this as Mutable<typeof this>).inlet = null;
  };

  ControllerSet.prototype.attachOutlet = function <C extends Controller>(this: ControllerSet<unknown, C>, outlet: ControllerSet<unknown, C>): void {
    let outlets = this.outlets as ControllerSet<unknown, C>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  ControllerSet.prototype.detachOutlet = function <C extends Controller>(this: ControllerSet<unknown, C>, outlet: ControllerSet<unknown, C>): void {
    const outlets = this.outlets as ControllerSet<unknown, C>[] | null;
    if (outlets !== null) {
      const index = outlets.indexOf(outlet);
      if (index >= 0) {
        outlets.splice(index, 1);
      }
    }
  };

  ControllerSet.prototype.hasController = function (this: ControllerSet, controller: Controller): boolean {
    return this.controllers[controller.uid] !== void 0;
  };

  ControllerSet.prototype.addController = function <C extends Controller>(this: ControllerSet<unknown, C>, newController?: AnyController<C>, target?: Controller | null, key?: string): C {
    if (newController !== void 0 && newController !== null) {
      newController = this.fromAny(newController);
    } else {
      newController = this.createController();
    }
    if (target === void 0) {
      target = null;
    }
    let parent: Controller | null;
    if (this.binds && (parent = this.parentController, parent !== null)) {
      if (key === void 0) {
        key = this.controllerKey(newController);
      }
      this.insertChild(parent, newController, target, key);
    }
    const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
    if (controllers[newController.uid] === void 0) {
      controllers[newController.uid] = newController;
      (this as Mutable<typeof this>).controllerCount += 1;
      this.willAttachController(newController, target);
      this.onAttachController(newController, target);
      this.initController(newController);
      this.didAttachController(newController, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newController;
  };

  ControllerSet.prototype.addControllers = function <C extends Controller>(this: ControllerSet, newControllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void {
    for (const controllerId in newControllers) {
      this.addController(newControllers[controllerId]!, target);
    }
  };

  ControllerSet.prototype.setControllers = function <C extends Controller>(this: ControllerSet, newControllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void {
    const controllers = this.controllers;
    for (const controllerId in controllers) {
      if (newControllers[controllerId] === void 0) {
        this.detachController(controllers[controllerId]!);
      }
    }
    for (const controllerId in newControllers) {
      if (controllers[controllerId] === void 0) {
        this.attachController(newControllers[controllerId]!, target);
      }
    }
  };

  ControllerSet.prototype.attachController = function <C extends Controller>(this: ControllerSet<unknown, C>, newController?: AnyController<C>, target?: Controller | null): C {
    if (newController !== void 0 && newController !== null) {
      newController = this.fromAny(newController);
    } else {
      newController = this.createController();
    }
    const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
    if (controllers[newController.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      controllers[newController.uid] = newController;
      (this as Mutable<typeof this>).controllerCount += 1;
      this.willAttachController(newController, target);
      this.onAttachController(newController, target);
      this.initController(newController);
      this.didAttachController(newController, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newController;
  };

  ControllerSet.prototype.attachControllers = function <C extends Controller>(this: ControllerSet, newControllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void {
    for (const controllerId in newControllers) {
      this.attachController(newControllers[controllerId]!, target);
    }
  };

  ControllerSet.prototype.detachController = function <C extends Controller>(this: ControllerSet<unknown, C>, oldController: C): C | null {
    const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
    if (controllers[oldController.uid] !== void 0) {
      (this as Mutable<typeof this>).controllerCount -= 1;
      delete controllers[oldController.uid];
      this.willDetachController(oldController);
      this.onDetachController(oldController);
      this.deinitController(oldController);
      this.didDetachController(oldController);
      this.setCoherent(true);
      this.decohereOutlets();
      return oldController;
    }
    return null;
  };

  ControllerSet.prototype.detachControllers = function <C extends Controller>(this: ControllerSet<unknown, C>, controllers?: {readonly [controllerId: number]: C | undefined}): void {
    if (controllers === void 0) {
      controllers = this.controllers;
    }
    for (const controllerId in controllers) {
      this.detachController(controllers[controllerId]!);
    }
  };

  ControllerSet.prototype.insertController = function <C extends Controller>(this: ControllerSet<unknown, C>, parent?: Controller | null, newController?: AnyController<C>, target?: Controller | null, key?: string): C {
    if (newController !== void 0 && newController !== null) {
      newController = this.fromAny(newController);
    } else {
      newController = this.createController();
    }
    if (parent === void 0 || parent === null) {
      parent = this.parentController;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.controllerKey(newController);
    }
    if (parent !== null && (newController.parent !== parent || newController.key !== key)) {
      this.insertChild(parent, newController, target, key);
    }
    const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
    if (controllers[newController.uid] === void 0) {
      controllers[newController.uid] = newController;
      (this as Mutable<typeof this>).controllerCount += 1;
      this.willAttachController(newController, target);
      this.onAttachController(newController, target);
      this.initController(newController);
      this.didAttachController(newController, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newController;
  };

  ControllerSet.prototype.insertControllers = function <C extends Controller>(this: ControllerSet, parent: Controller | null, newControllers: {readonly [controllerId: number]: C | undefined}, target?: Controller | null): void {
    for (const controllerId in newControllers) {
      this.insertController(parent, newControllers[controllerId]!, target);
    }
  };

  ControllerSet.prototype.removeController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: C): C | null {
    if (this.hasController(controller)) {
      controller.remove();
      return controller;
    }
    return null;
  };

  ControllerSet.prototype.removeControllers = function <C extends Controller>(this: ControllerSet<unknown, C>, controllers?: {readonly [controllerId: number]: C | undefined}): void {
    if (controllers === void 0) {
      controllers = this.controllers;
    }
    for (const controllerId in controllers) {
      this.removeController(controllers[controllerId]!);
    }
  };

  ControllerSet.prototype.deleteController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: C): C | null {
    const oldController = this.detachController(controller);
    if (oldController !== null) {
      oldController.remove();
    }
    return oldController;
  };

  ControllerSet.prototype.deleteControllers = function <C extends Controller>(this: ControllerSet<unknown, C>, controllers?: {readonly [controllerId: number]: C | undefined}): void {
    if (controllers === void 0) {
      controllers = this.controllers;
    }
    for (const controllerId in controllers) {
      this.deleteController(controllers[controllerId]!);
    }
  };

  ControllerSet.prototype.bindController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: Controller, target: Controller | null): void {
    if (this.binds) {
      const newController = this.detectController(controller);
      const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
      if (newController !== null && controllers[newController.uid] === void 0) {
        controllers[newController.uid] = newController;
        (this as Mutable<typeof this>).controllerCount += 1;
        this.willAttachController(newController, target);
        this.onAttachController(newController, target);
        this.initController(newController);
        this.didAttachController(newController, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ControllerSet.prototype.unbindController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: Controller): void {
    if (this.binds) {
      const oldController = this.detectController(controller);
      const controllers = this.controllers as {[comtrollerId: number]: C | undefined};
      if (oldController !== null && controllers[oldController.uid] !== void 0) {
        (this as Mutable<typeof this>).controllerCount -= 1;
        delete controllers[oldController.uid];
        this.willDetachController(oldController);
        this.onDetachController(oldController);
        this.deinitController(oldController);
        this.didDetachController(oldController);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ControllerSet.prototype.detectController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: Controller): C | null {
    if (typeof this.controllerType === "function" && controller instanceof this.controllerType) {
      return controller as C;
    }
    return null;
  };

  ControllerSet.prototype.decohereOutlets = function (this: ControllerSet): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ControllerSet.prototype.decohereOutlet = function (this: ControllerSet, outlet: ControllerSet): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ControllerSet.prototype.recohere = function (this: ControllerSet, t: number): void {
    if ((this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null) {
        this.setControllers(inlet.controllers);
      }
    }
  };

  ControllerSet.prototype.controllerKey = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: C): string | undefined {
    return void 0;
  };

  ControllerSet.prototype.initSorted = function (this: ControllerSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ControllerSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ControllerSet.SortedFlag;
    }
  };

  Object.defineProperty(ControllerSet.prototype, "sorted", {
    get(this: ControllerSet): boolean {
      return (this.flags & ControllerSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  ControllerSet.prototype.sort = function (this: ControllerSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    const flags = this.flags;
    if (sorted && (flags & ControllerSet.SortedFlag) === 0) {
      const parent = this.parentController;
      this.willSort(parent);
      this.setFlags(flags | ControllerSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else if (!sorted && (flags & ControllerSet.SortedFlag) !== 0) {
      this.setFlags(flags & ~ControllerSet.SortedFlag);
    }
    return this;
  };

  ControllerSet.prototype.willSort = function (this: ControllerSet, parent: Controller | null): void {
    // hook
  };

  ControllerSet.prototype.onSort = function (this: ControllerSet, parent: Controller | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  ControllerSet.prototype.didSort = function (this: ControllerSet, parent: Controller | null): void {
    // hook
  };

  ControllerSet.prototype.sortChildren = function <C extends Controller>(this: ControllerSet<unknown, C>, parent: Controller): void {
    parent.sortChildren(this.compareChildren.bind(this));
  };

  ControllerSet.prototype.compareChildren = function <C extends Controller>(this: ControllerSet<unknown, C>, a: Controller, b: Controller): number {
    const controllers = this.controllers;
    const x = controllers[a.uid];
    const y = controllers[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  ControllerSet.prototype.compare = function <C extends Controller>(this: ControllerSet<unknown, C>, a: C, b: C): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  ControllerSet.construct = function <F extends ControllerSet<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newController: AnyController<ControllerSetController<F>>): FastenerOwner<F> {
        fastener!.addController(newController);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initSorted((flagsInit & ControllerSet.SortedFlag) !== 0);
    }
    Object.defineProperty(fastener, "inlet", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).controllers = {};
    (fastener as Mutable<typeof fastener>).controllerCount = 0;
    return fastener;
  };

  ControllerSet.refine = function (fastenerClass: ControllerSetClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "sorted")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.sorted) {
        flagsInit |= ControllerSet.SortedFlag;
      } else {
        flagsInit &= ~ControllerSet.SortedFlag;
      }
      delete (fastenerPrototype as ControllerSetTemplate).sorted;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        configurable: true,
      });
    }
  };

  (ControllerSet as Mutable<typeof ControllerSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ControllerSet as Mutable<typeof ControllerSet>).FlagShift = _super.FlagShift + 1;
  (ControllerSet as Mutable<typeof ControllerSet>).FlagMask = (1 << ControllerSet.FlagShift) - 1;

  return ControllerSet;
})(ControllerRelation);
