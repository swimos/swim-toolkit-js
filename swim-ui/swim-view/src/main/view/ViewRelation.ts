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
import {AnyView, ViewFactory, View} from "./View";

/** @public */
export interface ViewRelationRefinement extends FastenerRefinement {
  view?: View;
}

/** @public */
export type ViewRelationView<R extends ViewRelationRefinement | ViewRelation<any, any>, D = View> =
  R extends {view: infer V} ? V :
  R extends {extends: infer E} ? ViewRelationView<E, D> :
  R extends ViewRelation<any, infer V> ? V :
  D;

/** @public */
export interface ViewRelationTemplate<V extends View = View> extends FastenerTemplate {
  extends?: Proto<ViewRelation<any, any>> | string | boolean | null;
  viewType?: ViewFactory<V>;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export interface ViewRelationClass<F extends ViewRelation<any, any> = ViewRelation<any, any>> extends FastenerClass<F> {
  /** @override */
  specialize(className: string, template: ViewRelationTemplate): ViewRelationClass;

  /** @override */
  refine(fastenerClass: ViewRelationClass): void;

  /** @override */
  extend(className: string, template: ViewRelationTemplate): ViewRelationClass<F>;

  /** @override */
  specify<O, V extends View = View>(className: string, template: ThisType<ViewRelation<O, V>> & ViewRelationTemplate<V> & Partial<Omit<ViewRelation<O, V>, keyof ViewRelationTemplate>>): ViewRelationClass<F>;

  /** @override */
  <O, V extends View = View>(template: ThisType<ViewRelation<O, V>> & ViewRelationTemplate<V> & Partial<Omit<ViewRelation<O, V>, keyof ViewRelationTemplate>>): PropertyDecorator;
}

/** @public */
export type ViewRelationDef<O, R extends ViewRelationRefinement> =
  ViewRelation<O, ViewRelationView<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ViewRelationView<R> : B> : {});

/** @public */
export function ViewRelationDef<F extends ViewRelation<any, any>>(
  template: F extends ViewRelationDef<infer O, infer R>
          ? ThisType<ViewRelationDef<O, R>>
          & ViewRelationTemplate<ViewRelationView<R>>
          & Partial<Omit<ViewRelation<O, ViewRelationView<R>>, keyof ViewRelationTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ViewRelationTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ViewRelationView<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ViewRelation(template);
}

/** @public */
export interface ViewRelation<O = unknown, V extends View = View> extends Fastener<O> {
  /** @override */
  get fastenerType(): Proto<ViewRelation<any, any>>;

  /** @internal */
  readonly viewType?: ViewFactory<V>; // optional prototype property

  /** @protected */
  initView(view: V): void;

  /** @protected */
  willAttachView(view: V, target: View | null): void;

  /** @protected */
  onAttachView(view: V, target: View | null): void;

  /** @protected */
  didAttachView(view: V, target: View | null): void;

  /** @protected */
  deinitView(view: V): void;

  /** @protected */
  willDetachView(view: V): void;

  /** @protected */
  onDetachView(view: V): void;

  /** @protected */
  didDetachView(view: V): void;

  /** @internal @protected */
  get parentView(): View | null;

  /** @internal @protected */
  insertChild(parent: View, child: V, target: View | null, key: string | undefined): void;

  /** @internal */
  bindView(view: View, target: View | null): void;

  /** @internal */
  unbindView(view: View): void;

  detectView(view: View): V | null;

  createView(): V;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  fromAny(value: AnyView<V>): V;
}

/** @public */
export const ViewRelation = (function (_super: typeof Fastener) {
  const ViewRelation = _super.extend("ViewRelation", {
    lazy: false,
    static: true,
  }) as ViewRelationClass;

  Object.defineProperty(ViewRelation.prototype, "fastenerType", {
    value: ViewRelation,
    configurable: true,
  });

  ViewRelation.prototype.initView = function <V extends View>(this: ViewRelation<unknown, V>, view: V): void {
    // hook
  };

  ViewRelation.prototype.willAttachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V, target: View | null): void {
    // hook
  };

  ViewRelation.prototype.onAttachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V, target: View | null): void {
    if (this.observes === true) {
      view.observe(this as ObserverType<V>);
    }
  };

  ViewRelation.prototype.didAttachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V, target: View | null): void {
    // hook
  };

  ViewRelation.prototype.deinitView = function <V extends View>(this: ViewRelation<unknown, V>, view: V): void {
    // hook
  };

  ViewRelation.prototype.willDetachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V): void {
    // hook
  };

  ViewRelation.prototype.onDetachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V): void {
    if (this.observes === true) {
      view.unobserve(this as ObserverType<V>);
    }
  };

  ViewRelation.prototype.didDetachView = function <V extends View>(this: ViewRelation<unknown, V>, view: V): void {
    // hook
  };

  Object.defineProperty(ViewRelation.prototype, "parentView", {
    get(this: ViewRelation): View | null {
      const owner = this.owner;
      return owner instanceof View ? owner : null;
    },
    configurable: true,
  });

  ViewRelation.prototype.insertChild = function <V extends View>(this: ViewRelation<unknown, V>, parent: View, child: V, target: View | null, key: string | undefined): void {
    parent.insertChild(child, target, key);
  };

  ViewRelation.prototype.bindView = function <V extends View>(this: ViewRelation<unknown, V>, view: View, target: View | null): void {
    // hook
  };

  ViewRelation.prototype.unbindView = function <V extends View>(this: ViewRelation<unknown, V>, view: View): void {
    // hook
  };

  ViewRelation.prototype.detectView = function <V extends View>(this: ViewRelation<unknown, V>, view: View): V | null {
    return null;
  };

  ViewRelation.prototype.createView = function <V extends View>(this: ViewRelation<unknown, V>): V {
    let view: V | undefined;
    const viewType = this.viewType;
    if (viewType !== void 0) {
      view = viewType.create();
    }
    if (view === void 0 || view === null) {
      let message = "Unable to create ";
      if (this.name.length !== 0) {
        message += this.name + " ";
      }
      message += "view";
      throw new Error(message);
    }
    return view;
  };

  ViewRelation.prototype.fromAny = function <V extends View>(this: ViewRelation<unknown, V>, value: AnyView<V>): V {
    const viewType = this.viewType;
    if (viewType !== void 0) {
      return viewType.fromAny(value);
    } else {
      return View.fromAny(value) as V;
    }
  };

  return ViewRelation;
})(Fastener);
