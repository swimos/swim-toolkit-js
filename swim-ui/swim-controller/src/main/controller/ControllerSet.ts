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
import {ControllerRelationInit, ControllerRelationClass, ControllerRelation} from "./ControllerRelation";

/** @internal */
export type ControllerSetType<F extends ControllerSet<any, any>> =
  F extends ControllerSet<any, infer C> ? C : never;

/** @public */
export interface ControllerSetInit<C extends Controller = Controller> extends ControllerRelationInit<C> {
  extends?: {prototype: ControllerSet<any, any>} | string | boolean | null;
  key?(controller: C): string | undefined;
  compare?(a: C, b: C): number;

  sorted?: boolean;
  willSort?(parent: Controller | null): void;
  didSort?(parent: Controller | null): void;
  sortChildren?(parent: Controller): void;
  compareChildren?(a: Controller, b: Controller): number;

  willInherit?(superFastener: ControllerSet<unknown, C>): void;
  didInherit?(superFastener: ControllerSet<unknown, C>): void;
  willUninherit?(superFastener: ControllerSet<unknown, C>): void;
  didUninherit?(superFastener: ControllerSet<unknown, C>): void;

  willBindSuperFastener?(superFastener: ControllerSet<unknown, C>): void;
  didBindSuperFastener?(superFastener: ControllerSet<unknown, C>): void;
  willUnbindSuperFastener?(superFastener: ControllerSet<unknown, C>): void;
  didUnbindSuperFastener?(superFastener: ControllerSet<unknown, C>): void;
}

/** @public */
export type ControllerSetDescriptor<O = unknown, C extends Controller = Controller, I = {}> = ThisType<ControllerSet<O, C> & I> & ControllerSetInit<C> & Partial<I>;

/** @public */
export interface ControllerSetClass<F extends ControllerSet<any, any> = ControllerSet<any, any>> extends ControllerRelationClass<F> {
  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface ControllerSetFactory<F extends ControllerSet<any, any> = ControllerSet<any, any>> extends ControllerSetClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): ControllerSetFactory<F> & I;

  define<O, C extends Controller = Controller>(className: string, descriptor: ControllerSetDescriptor<O, C>): ControllerSetFactory<ControllerSet<any, C>>;
  define<O, C extends Controller = Controller>(className: string, descriptor: {observes: boolean} & ControllerSetDescriptor<O, C, ObserverType<C>>): ControllerSetFactory<ControllerSet<any, C>>;
  define<O, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown} & ControllerSetDescriptor<O, C, I>): ControllerSetFactory<ControllerSet<any, C> & I>;
  define<O, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & ControllerSetDescriptor<O, C, I & ObserverType<C>>): ControllerSetFactory<ControllerSet<any, C> & I>;

  <O, C extends Controller = Controller>(descriptor: ControllerSetDescriptor<O, C>): PropertyDecorator;
  <O, C extends Controller = Controller>(descriptor: {observes: boolean} & ControllerSetDescriptor<O, C, ObserverType<C>>): PropertyDecorator;
  <O, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown} & ControllerSetDescriptor<O, C, I>): PropertyDecorator;
  <O, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown; observes: boolean} & ControllerSetDescriptor<O, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface ControllerSet<O = unknown, C extends Controller = Controller> extends ControllerRelation<O, C> {
  (controller: AnyController<C>): O;

  /** @override */
  get fastenerType(): Proto<ControllerSet<any, any>>;

  /** @internal @override */
  setInherited(inherited: boolean, superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willInherit(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onInherit(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didInherit(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willUninherit(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onUninherit(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didUninherit(superFastener: ControllerSet<unknown, C>): void;

  /** @override */
  readonly superFastener: ControllerSet<unknown, C> | null;

  /** @internal @override */
  getSuperFastener(): ControllerSet<unknown, C> | null;

  /** @protected @override */
  willBindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onBindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didBindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  willUnbindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  onUnbindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @protected @override */
  didUnbindSuperFastener(superFastener: ControllerSet<unknown, C>): void;

  /** @internal */
  readonly subFasteners: ReadonlyArray<ControllerSet<unknown, C>> | null;

  /** @internal @override */
  attachSubFastener(subFastener: ControllerSet<unknown, C>): void;

  /** @internal @override */
  detachSubFastener(subFastener: ControllerSet<unknown, C>): void;

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
  decohereSubFasteners(): void;

  /** @internal @protected */
  decohereSubFastener(subFastener: ControllerSet<unknown, C>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  key(controller: C): string | undefined;

  get sorted(): boolean;

  /** @internal */
  initSorted(sorted: boolean): void;

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
  const ControllerSet: ControllerSetFactory = _super.extend("ControllerSet");

  Object.defineProperty(ControllerSet.prototype, "fastenerType", {
    get: function (this: ControllerSet): Proto<ControllerSet<any, any>> {
      return ControllerSet;
    },
    configurable: true,
  });

  ControllerSet.prototype.onInherit = function (this: ControllerSet, superFastener: ControllerSet): void {
    this.setControllers(superFastener.controllers);
  };

  ControllerSet.prototype.onBindSuperFastener = function <C extends Controller>(this: ControllerSet<unknown, C>, superFastener: ControllerSet<unknown, C>): void {
    (this as Mutable<typeof this>).superFastener = superFastener;
    _super.prototype.onBindSuperFastener.call(this, superFastener);
  };

  ControllerSet.prototype.onUnbindSuperFastener = function <C extends Controller>(this: ControllerSet<unknown, C>, superFastener: ControllerSet<unknown, C>): void {
    _super.prototype.onUnbindSuperFastener.call(this, superFastener);
    (this as Mutable<typeof this>).superFastener = null;
  };

  ControllerSet.prototype.attachSubFastener = function <C extends Controller>(this: ControllerSet<unknown, C>, subFastener: ControllerSet<unknown, C>): void {
    let subFasteners = this.subFasteners as ControllerSet<unknown, C>[] | null;
    if (subFasteners === null) {
      subFasteners = [];
      (this as Mutable<typeof this>).subFasteners = subFasteners;
    }
    subFasteners.push(subFastener);
  };

  ControllerSet.prototype.detachSubFastener = function <C extends Controller>(this: ControllerSet<unknown, C>, subFastener: ControllerSet<unknown, C>): void {
    const subFasteners = this.subFasteners as ControllerSet<unknown, C>[] | null;
    if (subFasteners !== null) {
      const index = subFasteners.indexOf(subFastener);
      if (index >= 0) {
        subFasteners.splice(index, 1);
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
        key = this.key(newController);
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
      this.decohereSubFasteners();
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
      this.decohereSubFasteners();
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
      this.decohereSubFasteners();
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
      key = this.key(newController);
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
      this.decohereSubFasteners();
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
        this.decohereSubFasteners();
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
        this.decohereSubFasteners();
      }
    }
  };

  ControllerSet.prototype.detectController = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: Controller): C | null {
    if (typeof this.type === "function" && controller instanceof this.type) {
      return controller as C;
    }
    return null;
  };

  ControllerSet.prototype.decohereSubFasteners = function (this: ControllerSet): void {
    const subFasteners = this.subFasteners;
    for (let i = 0, n = subFasteners !== null ? subFasteners.length : 0; i < n; i += 1) {
      this.decohereSubFastener(subFasteners![i]!);
    }
  };

  ControllerSet.prototype.decohereSubFastener = function (this: ControllerSet, subFastener: ControllerSet): void {
    if ((subFastener.flags & Fastener.InheritedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (subFastener.flags & Affinity.Mask)) {
      subFastener.setInherited(true, this);
    } else if ((subFastener.flags & Fastener.InheritedFlag) !== 0 && (subFastener.flags & Fastener.DecoherentFlag) === 0) {
      subFastener.setCoherent(false);
      subFastener.decohere();
    }
  };

  ControllerSet.prototype.recohere = function (this: ControllerSet, t: number): void {
    if ((this.flags & Fastener.InheritedFlag) !== 0) {
      const superFastener = this.superFastener;
      if (superFastener !== null) {
        this.setControllers(superFastener.controllers);
      }
    }
  };

  ControllerSet.prototype.key = function <C extends Controller>(this: ControllerSet<unknown, C>, controller: C): string | undefined {
    return void 0;
  };

  Object.defineProperty(ControllerSet.prototype, "sorted", {
    get(this: ControllerSet): boolean {
      return (this.flags & ControllerSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  ControllerSet.prototype.initSorted = function (this: ControllerSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ControllerSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ControllerSet.SortedFlag;
    }
  };

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

  ControllerSet.construct = function <F extends ControllerSet<any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newController: AnyController<ControllerSetType<F>>): FastenerOwner<F> {
        fastener!.addController(newController);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, fastenerClass.prototype);
    }
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    Object.defineProperty(fastener, "superFastener", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).subFasteners = null;
    (fastener as Mutable<typeof fastener>).controllers = {};
    (fastener as Mutable<typeof fastener>).controllerCount = 0;
    return fastener;
  };

  ControllerSet.define = function <O, C extends Controller>(className: string, descriptor: ControllerSetDescriptor<O, C>): ControllerSetFactory<ControllerSet<any, C>> {
    let superClass = descriptor.extends as ControllerSetFactory | null | undefined;
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

    fastenerClass.construct = function (fastenerClass: {prototype: ControllerSet<any, any>}, fastener: ControllerSet<O, C> | null, owner: O): ControllerSet<O, C> {
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

  (ControllerSet as Mutable<typeof ControllerSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ControllerSet as Mutable<typeof ControllerSet>).FlagShift = _super.FlagShift + 1;
  (ControllerSet as Mutable<typeof ControllerSet>).FlagMask = (1 << ControllerSet.FlagShift) - 1;

  return ControllerSet;
})(ControllerRelation);
