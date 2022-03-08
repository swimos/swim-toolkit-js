// Copyright 2015-2021 Swim.inc
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
import type {FastenerOwner, Fastener} from "@swim/component";
import type {AnyController, Controller} from "./Controller";
import {ControllerRelationInit, ControllerRelationClass, ControllerRelation} from "./ControllerRelation";

/** @internal */
export type ControllerRefType<F extends ControllerRef<any, any>> =
  F extends ControllerRef<any, infer C> ? C : never;

/** @public */
export interface ControllerRefInit<C extends Controller = Controller> extends ControllerRelationInit<C> {
  extends?: {prototype: ControllerRef<any, any>} | string | boolean | null;
  key?: string | boolean;
}

/** @public */
export type ControllerRefDescriptor<O = unknown, C extends Controller = Controller, I = {}> = ThisType<ControllerRef<O, C> & I> & ControllerRefInit<C> & Partial<I>;

/** @public */
export interface ControllerRefClass<F extends ControllerRef<any, any> = ControllerRef<any, any>> extends ControllerRelationClass<F> {
}

/** @public */
export interface ControllerRefFactory<F extends ControllerRef<any, any> = ControllerRef<any, any>> extends ControllerRefClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): ControllerRefFactory<F> & I;

  define<O, C extends Controller = Controller>(className: string, descriptor: ControllerRefDescriptor<O, C>): ControllerRefFactory<ControllerRef<any, C>>;
  define<O, C extends Controller = Controller>(className: string, descriptor: {observes: boolean} & ControllerRefDescriptor<O, C, ObserverType<C>>): ControllerRefFactory<ControllerRef<any, C>>;
  define<O, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown} & ControllerRefDescriptor<O, C, I>): ControllerRefFactory<ControllerRef<any, C> & I>;
  define<O, C extends Controller = Controller, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & ControllerRefDescriptor<O, C, I & ObserverType<C>>): ControllerRefFactory<ControllerRef<any, C> & I>;

  <O, C extends Controller = Controller>(descriptor: ControllerRefDescriptor<O, C>): PropertyDecorator;
  <O, C extends Controller = Controller>(descriptor: {observes: boolean} & ControllerRefDescriptor<O, C, ObserverType<C>>): PropertyDecorator;
  <O, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown} & ControllerRefDescriptor<O, C, I>): PropertyDecorator;
  <O, C extends Controller = Controller, I = {}>(descriptor: {implements: unknown; observes: boolean} & ControllerRefDescriptor<O, C, I & ObserverType<C>>): PropertyDecorator;
}

/** @public */
export interface ControllerRef<O = unknown, C extends Controller = Controller> extends ControllerRelation<O, C> {
  (): C | null;
  (controller: AnyController<C> | null, target?: Controller | null, key?: string): O;

  /** @override */
  get fastenerType(): Proto<ControllerRef<any, any>>;

  /** @protected @override */
  onInherit(superFastener: Fastener): void;

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

  /** @internal */
  get key(): string | undefined; // optional prototype field
}

/** @public */
export const ControllerRef = (function (_super: typeof ControllerRelation) {
  const ControllerRef: ControllerRefFactory = _super.extend("ControllerRef");

  Object.defineProperty(ControllerRef.prototype, "fastenerType", {
    get: function (this: ControllerRef): Proto<ControllerRef<any, any>> {
      return ControllerRef;
    },
    configurable: true,
  });

  ControllerRef.prototype.onInherit = function (this: ControllerRef, superFastener: ControllerRef): void {
    this.setController(superFastener.controller);
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
            key = this.key;
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
    if (newController !== oldController) {
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
      key = this.key;
    }
    if (parent !== null && (newController.parent !== parent || newController.key !== key)) {
      this.insertChild(parent, newController, target, key);
    }
    const oldController = this.controller;
    if (newController !== oldController) {
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
      }
    }
  };

  ControllerRef.prototype.detectController = function <C extends Controller>(this: ControllerRef<unknown, C>, controller: Controller): C | null {
    const key = this.key;
    if (key !== void 0 && key === controller.key) {
      return controller as C;
    }
    return null;
  };

  ControllerRef.construct = function <F extends ControllerRef<any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (controller?: AnyController<ControllerRefType<F>> | null, target?: Controller | null, key?: string): ControllerRefType<F> | null | FastenerOwner<F> {
        if (controller === void 0) {
          return fastener!.controller;
        } else {
          fastener!.setController(controller, target, key);
          return fastener!.owner;
        }
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, fastenerClass.prototype);
    }
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).key = void 0;
    (fastener as Mutable<typeof fastener>).controller = null;
    return fastener;
  };

  ControllerRef.define = function <O, C extends Controller>(className: string, descriptor: ControllerRefDescriptor<O, C>): ControllerRefFactory<ControllerRef<any, C>> {
    let superClass = descriptor.extends as ControllerRefFactory | null | undefined;
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

    if (superClass === void 0 || superClass === null) {
      superClass = this;
    }

    const fastenerClass = superClass.extend(className, descriptor);

    fastenerClass.construct = function (fastenerClass: {prototype: ControllerRef<any, any>}, fastener: ControllerRef<O, C> | null, owner: O): ControllerRef<O, C> {
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

  return ControllerRef;
})(ControllerRelation);
