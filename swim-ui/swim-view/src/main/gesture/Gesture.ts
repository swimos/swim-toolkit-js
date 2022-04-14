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
import {
  FastenerOwner,
  FastenerRefinement,
  FastenerTemplate,
  FastenerClass,
  Fastener,
} from "@swim/component";
import {GestureInputType, GestureInput} from "./GestureInput";
import {View} from "../"; // forward import

/** @public */
export type GestureMethod = "auto" | "pointer" | "touch" | "mouse";

/** @public */
export interface GestureRefinement extends FastenerRefinement {
  view?: View;
}

/** @public */
export type GestureView<R extends GestureRefinement | Gesture<any, any>, D = View> =
  R extends {view: infer V | null} ? V :
  R extends {extends: infer E} ? GestureView<E, D> :
  R extends Gesture<any, infer V> ? V :
  D;

/** @public */
export interface GestureTemplate<V extends View = View> extends FastenerTemplate {
  extends?: Proto<Gesture<any, any>> | string | boolean | null;
  method?: GestureMethod;
  viewKey?: string | boolean;
  bindsOwner?: boolean;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export interface GestureClass<G extends Gesture<any, any> = Gesture<any, any>> extends FastenerClass<G> {
  /** @override */
  specialize(className: string, template: GestureTemplate): GestureClass;

  /** @override */
  refine(gestureClass: GestureClass): void;

  /** @override */
  extend(className: string, template: GestureTemplate): GestureClass<G>;

  /** @override */
  specify<O, V extends View = View>(className: string, template: ThisType<Gesture<O, V>> & GestureTemplate & Partial<Omit<Gesture<O, V>, keyof GestureTemplate>>): GestureClass<G>;

  /** @override */
  <O, V extends View = View>(template: ThisType<Gesture<O, V>> & GestureTemplate & Partial<Omit<Gesture<O, V>, keyof GestureTemplate>>): PropertyDecorator;
}

/** @public */
export type GestureDef<O, R extends GestureRefinement = {}> =
  Gesture<O, GestureView<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? GestureView<R> : B> : {});

/** @public */
export function GestureDef<F extends Gesture<any, any>>(
  template: F extends GestureDef<infer O, infer R>
          ? ThisType<GestureDef<O, R>>
          & GestureTemplate<GestureView<R>>
          & Partial<Omit<Gesture<O, GestureView<R>>, keyof GestureTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof GestureTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? ObserverType<B extends boolean ? GestureView<R> : B> : {})
          : never
): PropertyDecorator {
  return Gesture(template);
}

/** @public */
export interface Gesture<O = unknown, V extends View = View> extends Fastener<O> {
  (): V | null;
  (view: V | null, targetView?: View | null): O;

  /** @override */
  get fastenerType(): Proto<Gesture<any, any>>;

  /** @internal */
  readonly bindsOwner?: boolean; // optional prototype property

  /** @internal */
  readonly viewKey?: string; // optional prototype property

  readonly view: V | null;

  getView(): V;

  setView(newView: V | null, targetView?: View | null): V | null;

  /** @protected */
  willAttachView(view: V, target: View | null): void;

  /** @protected */
  onAttachView(view: V, target: View | null): void;

  /** @protected */
  didAttachView(view: V, target: View | null): void;

  /** @protected */
  willDetachView(view: V): void;

  /** @protected */
  onDetachView(view: V): void;

  /** @protected */
  didDetachView(view: V): void;

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @protected */
  attachEvents(view: V): void;

  /** @internal @protected */
  detachEvents(view: V): void;

  /** @internal */
  readonly inputs: {readonly [inputId: string]: GestureInput | undefined};

  readonly inputCount: number;

  getInput(inputId: string | number): GestureInput | null;

  /** @internal */
  createInput(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number): GestureInput;

  /** @internal */
  getOrCreateInput(inputId: string | number, inputType: GestureInputType, isPrimary: boolean,
                   x: number, y: number, t: number): GestureInput;

  /** @internal */
  clearInput(input: GestureInput): void;

  /** @internal */
  clearInputs(): void;

  /** @internal */
  resetInput(input: GestureInput): void;

  /** @internal */
  resetInputs(): void;

  /** @internal */
  bindView(view: View, target?: View | null): void;

  /** @internal */
  unbindView(view: View): void;

  detectView(view: View): V | null;

  /** @internal */
  viewWillUnmount(view: V): void;

  /** @protected @override */
  onMount(): void;
}

/** @public */
export const Gesture = (function (_super: typeof Fastener) {
  const Gesture = _super.extend("Gesture", {
    lazy: false,
    static: true,
  }) as GestureClass;

  Object.defineProperty(Gesture.prototype, "fastenerType", {
    value: Gesture,
    configurable: true,
  });

  Gesture.prototype.getView = function <V extends View>(this: Gesture<unknown, V>): V {
    const view = this.view;
    if (view === null) {
      throw new TypeError("null " + this.name + " view");
    }
    return view;
  };

  Gesture.prototype.setView = function <V extends View>(this: Gesture<unknown, V>, newView: V | null, target?: View | null): V | null {
    const oldView = this.view;
    if (oldView !== newView) {
      if (oldView !== null) {
        this.willDetachView(oldView);
        (this as Mutable<typeof this>).view = null;
        this.onDetachView(oldView);
        this.didDetachView(oldView);
      }
      if (newView !== null) {
        if (target === void 0) {
          target = null;
        }
        this.willAttachView(newView, target);
        (this as Mutable<typeof this>).view = newView;
        this.onAttachView(newView, target);
        this.didAttachView(newView, target);
      }
    }
    return oldView;
  };

  Gesture.prototype.willAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V, target: View | null): void {
    // hook
  };

  Gesture.prototype.onAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V, target: View | null): void {
    this.attachEvents(view);
    if (this.observes === true) {
      view.observe(this as ObserverType<V>);
    }
  };

  Gesture.prototype.didAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V, target: View | null): void {
    // hook
  };

  Gesture.prototype.willDetachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.onDetachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    this.clearInputs();
    if (this.observes === true) {
      view.unobserve(this as ObserverType<V>);
    }
    this.detachEvents(view);
  };

  Gesture.prototype.didDetachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.attachEvents = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.detachEvents = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.getInput = function (this: Gesture, inputId: string | number): GestureInput | null {
    if (typeof inputId === "number") {
      inputId = "" + inputId;
    }
    const input = this.inputs[inputId];
    return input !== void 0 ? input : null;
  };

  Gesture.prototype.createInput = function (this: Gesture, inputId: string, inputType: GestureInputType, isPrimary: boolean,
                                            x: number, y: number, t: number): GestureInput {
    return new GestureInput(inputId, inputType, isPrimary, x, y, t);
  };

  Gesture.prototype.getOrCreateInput = function (this: Gesture, inputId: string | number, inputType: GestureInputType, isPrimary: boolean,
                                                 x: number, y: number, t: number): GestureInput {
    if (typeof inputId === "number") {
      inputId = "" + inputId;
    }
    const inputs = this.inputs as {[inputId: string]: GestureInput | undefined};
    let input = inputs[inputId];
    if (input === void 0) {
      input = this.createInput(inputId, inputType, isPrimary, x, y, t);
      inputs[inputId] = input;
      (this as Mutable<typeof this>).inputCount += 1;
    }
    return input;
  };

  Gesture.prototype.clearInput = function (this: Gesture, input: GestureInput): void {
    const inputs = this.inputs as {[inputId: string]: GestureInput | undefined};
    delete inputs[input.inputId];
    (this as Mutable<typeof this>).inputCount -= 1;
  };

  Gesture.prototype.clearInputs = function (this: Gesture): void {
    (this as Mutable<typeof this>).inputs = {};
    (this as Mutable<typeof this>).inputCount = 0;
  };

  Gesture.prototype.resetInput = function (this: Gesture, input: GestureInput): void {
    this.clearInput(input);
  };

  Gesture.prototype.resetInputs = function (this: Gesture): void {
    const inputs = this.inputs as {[inputId: string]: GestureInput | undefined};
    for (const inputId in inputs) {
      const input = inputs[inputId]!;
      this.resetInput(input);
    }
  };

  Gesture.prototype.bindView = function <V extends View>(this: Gesture<unknown, V>, view: View, target?: View | null): void {
    if (this.binds && this.view === null) {
      const newView = this.detectView(view);
      if (newView !== null) {
        this.setView(newView, target);
      }
    }
  };

  Gesture.prototype.unbindView = function <V extends View>(this: Gesture<unknown, V>, view: View): void {
    if (this.binds && this.view === view) {
      this.setView(null);
    }
  };

  Gesture.prototype.detectView = function <V extends View>(this: Gesture<unknown, V>, view: View): V | null {
    if (this.viewKey !== void 0 && this.viewKey === view.key) {
      return view as V;
    }
    return null;
  };

  Gesture.prototype.viewWillUnmount = function (this: Gesture, view: View): void {
    this.clearInputs();
  };

  Gesture.prototype.onMount = function (this: Gesture): void {
    _super.prototype.onMount.call(this);
    if (this.bindsOwner === true && this.owner instanceof View) {
      this.setView(this.owner);
    }
  };

  Gesture.construct = function <G extends Gesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    if (gesture === null) {
      gesture = function (view?: GestureView<G> | null, targetView?: View | null): GestureView<G> | null | FastenerOwner<G> {
        if (view === void 0) {
          return gesture!.view;
        } else {
          gesture!.setView(view, targetView);
          return gesture!.owner;
        }
      } as G;
      delete (gesture as Partial<Mutable<G>>).name; // don't clobber prototype name
      Object.setPrototypeOf(gesture, this.prototype);
    }
    gesture = _super.construct.call(this, gesture, owner) as G;
    (gesture as Mutable<typeof gesture>).view = null;
    (gesture as Mutable<typeof gesture>).inputs = {};
    (gesture as Mutable<typeof gesture>).inputCount = 0;
    return gesture;
  };

  Gesture.refine = function (fastenerClass: GestureClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "viewKey")) {
      const viewKey = fastenerPrototype.viewKey as string | boolean | undefined;
      if (viewKey === true) {
        Object.defineProperty(fastenerPrototype, "viewKey", {
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

  return Gesture;
})(Fastener);
