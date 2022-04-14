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
import {FastenerRefinement, FastenerTemplate, FastenerClass, Fastener} from "@swim/component";
import {AnyController, ControllerFactory, Controller} from "./Controller";

/** @public */
export interface ControllerRelationRefinement extends FastenerRefinement {
  controller?: Controller;
  observes?: unknown;
}

/** @public */
export type ControllerRelationController<R extends ControllerRelationRefinement | ControllerRelation<any, any>, D = Controller> =
  R extends {controller: infer C} ? C :
  R extends {extends: infer E} ? ControllerRelationController<E, D> :
  R extends ControllerRelation<any, infer C> ? C :
  D;

/** @public */
export interface ControllerRelationTemplate<C extends Controller = Controller> extends FastenerTemplate {
  extends?: Proto<ControllerRelation<any, any>> | string | boolean | null;
  controllerType?: ControllerFactory<C>;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export interface ControllerRelationClass<F extends ControllerRelation<any, any> = ControllerRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(className: string, template: ControllerRelationTemplate): ControllerRelationClass;

  /** @override */
  refine(fastenerClass: ControllerRelationClass): void;

  /** @override */
  extend(className: string, template: ControllerRelationTemplate): ControllerRelationClass<F>;

  /** @override */
  specify<O, C extends Controller = Controller>(className: string, template: ThisType<ControllerRelation<O, C>> & ControllerRelationTemplate<C> & Partial<Omit<ControllerRelation<O, C>, keyof ControllerRelationTemplate>>): ControllerRelationClass<F>;

  /** @override */
  <O, C extends Controller = Controller>(template: ThisType<ControllerRelation<O, C>> & ControllerRelationTemplate<C> & Partial<Omit<ControllerRelation<O, C>, keyof ControllerRelationTemplate>>): PropertyDecorator;
}

/** @public */
export type ControllerRelationDef<O, R extends ControllerRelationRefinement = {}> =
  ControllerRelation<O, ControllerRelationController<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ControllerRelationController<R> : B> : {});

/** @public */
export function ControllerRelationDef<F extends ControllerRelation<any, any>>(
  template: F extends ControllerRelationDef<infer O, infer R>
          ? ThisType<ControllerRelationDef<O, R>>
          & ControllerRelationTemplate<ControllerRelationController<R>>
          & Partial<Omit<ControllerRelation<O, ControllerRelationController<R>>, keyof ControllerRelationTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ControllerRelationTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ControllerRelationController<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ControllerRelation(template);
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
      controller.observe(this as ObserverType<C>);
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
      controller.unobserve(this as ObserverType<C>);
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
