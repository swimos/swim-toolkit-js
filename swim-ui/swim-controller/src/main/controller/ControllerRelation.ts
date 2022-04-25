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

import type {Proto, Observes} from "@swim/util";
import {FastenerDescriptor, FastenerClass, Fastener} from "@swim/component";
import {AnyController, ControllerFactory, Controller} from "./Controller";

/** @public */
export type ControllerRelationController<F extends ControllerRelation<any, any>> =
  F extends {controllerType?: ControllerFactory<infer C>} ? C : never;

/** @public */
export interface ControllerRelationDescriptor<C extends Controller = Controller> extends FastenerDescriptor {
  extends?: Proto<ControllerRelation<any, any>> | string | boolean | null;
  controllerType?: ControllerFactory<C>;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export type ControllerRelationTemplate<F extends ControllerRelation<any, any>> =
  ThisType<F> &
  ControllerRelationDescriptor<ControllerRelationController<F>> &
  Partial<Omit<F, keyof ControllerRelationDescriptor>>;

/** @public */
export interface ControllerRelationClass<F extends ControllerRelation<any, any> = ControllerRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(template: ControllerRelationDescriptor<any>): ControllerRelationClass<F>;

  /** @override */
  refine(fastenerClass: ControllerRelationClass<any>): void;

  /** @override */
  extend<F2 extends F>(className: string, template: ControllerRelationTemplate<F2>): ControllerRelationClass<F2>;
  extend<F2 extends F>(className: string, template: ControllerRelationTemplate<F2>): ControllerRelationClass<F2>;

  /** @override */
  define<F2 extends F>(className: string, template: ControllerRelationTemplate<F2>): ControllerRelationClass<F2>;
  define<F2 extends F>(className: string, template: ControllerRelationTemplate<F2>): ControllerRelationClass<F2>;

  /** @override */
  <F2 extends F>(template: ControllerRelationTemplate<F2>): PropertyDecorator;
}

/** @public */
export interface ControllerRelation<O = unknown, C extends Controller = Controller> extends Fastener<O> {
  /** @override */
  get fastenerType(): Proto<ControllerRelation<any, any>>;

  /** @internal */
  readonly controllerType?: ControllerFactory<C>; // optional prototype property

  /** @protected */
  initController(controller: C): void;

  /** @protected */
  willAttachController(controller: C, target: Controller | null): void;

  /** @protected */
  onAttachController(controller: C, target: Controller | null): void;

  /** @protected */
  didAttachController(controller: C, target: Controller | null): void;

  /** @protected */
  deinitController(controller: C): void;

  /** @protected */
  willDetachController(controller: C): void;

  /** @protected */
  onDetachController(controller: C): void;

  /** @protected */
  didDetachController(controller: C): void;

  /** @internal @protected */
  get parentController(): Controller | null;

  /** @internal @protected */
  insertChild(parent: Controller, child: C, target: Controller | null, key: string | undefined): void;

  /** @internal */
  bindController(controller: Controller, target: Controller | null): void;

  /** @internal */
  unbindController(controller: Controller): void;

  detectController(controller: Controller): C | null;

  createController(): C;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  fromAny(value: AnyController<C>): C;
}

/** @public */
export const ControllerRelation = (function (_super: typeof Fastener) {
  const ControllerRelation = _super.extend("ControllerRelation", {
    lazy: false,
    static: true,
  }) as ControllerRelationClass;

  Object.defineProperty(ControllerRelation.prototype, "fastenerType", {
    value: ControllerRelation,
    configurable: true,
  });

  ControllerRelation.prototype.initController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C): void {
    // hook
  };

  ControllerRelation.prototype.willAttachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C, target: Controller | null): void {
    // hook
  };

  ControllerRelation.prototype.onAttachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C, target: Controller | null): void {
    if (this.observes === true) {
      controller.observe(this as Observes<C>);
    }
  };

  ControllerRelation.prototype.didAttachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C, target: Controller | null): void {
    // hook
  };

  ControllerRelation.prototype.deinitController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C): void {
    // hook
  };

  ControllerRelation.prototype.willDetachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C): void {
    // hook
  };

  ControllerRelation.prototype.onDetachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C): void {
    if (this.observes === true) {
      controller.unobserve(this as Observes<C>);
    }
  };

  ControllerRelation.prototype.didDetachController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: C): void {
    // hook
  };

  Object.defineProperty(ControllerRelation.prototype, "parentController", {
    get(this: ControllerRelation): Controller | null {
      const owner = this.owner;
      return owner instanceof Controller ? owner : null;
    },
    configurable: true,
  });

  ControllerRelation.prototype.insertChild = function <C extends Controller>(this: ControllerRelation<unknown, C>, parent: Controller, child: C, target: Controller | null, key: string | undefined): void {
    parent.insertChild(child, target, key);
  };

  ControllerRelation.prototype.bindController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: Controller, target: Controller | null): void {
    // hook
  };

  ControllerRelation.prototype.unbindController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: Controller): void {
    // hook
  };

  ControllerRelation.prototype.detectController = function <C extends Controller>(this: ControllerRelation<unknown, C>, controller: Controller): C | null {
    return null;
  };

  ControllerRelation.prototype.createController = function <C extends Controller>(this: ControllerRelation<unknown, C>): C {
    let controller: C | undefined;
    const controllerType = this.controllerType;
    if (controllerType !== void 0) {
      controller = controllerType.create();
    }
    if (controller === void 0 || controller === null) {
      let message = "Unable to create ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "controller";
      throw new Error(message);
    }
    return controller;
  };

  ControllerRelation.prototype.fromAny = function <C extends Controller>(this: ControllerRelation<unknown, C>, value: AnyController<C>): C {
    const controllerType = this.controllerType;
    if (controllerType !== void 0) {
      return controllerType.fromAny(value);
    } else {
      return Controller.fromAny(value) as C;
    }
  };

  return ControllerRelation;
})(Fastener);
