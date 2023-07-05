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

import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import type {Observes} from "@swim/util";
import type {FastenerDescriptor} from "@swim/component";
import type {FastenerClass} from "@swim/component";
import {Fastener} from "@swim/component";
import {View} from "./View";

/** @public */
export type GestureInputType = "mouse" | "wheel" | "touch" | "pen" | "unknown";

/** @public */
export class GestureInput {
  readonly inputId: string;
  inputType: GestureInputType;
  isPrimary: boolean;

  target: EventTarget | null;
  button: number;
  buttons: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;

  width: number;
  height: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  pressure: number;
  tangentialPressure: number;

  x0: number;
  y0: number;
  t0: number;
  dx: number;
  dy: number;
  dt: number;
  x: number;
  y: number;
  t: number;

  detail: unknown;

  defaultPrevented: boolean;

  constructor(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number) {
    this.inputId = inputId;
    this.inputType = inputType;
    this.isPrimary = isPrimary;

    this.target = null;
    this.button = 0;
    this.buttons = 0;
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;

    this.width = 0;
    this.height = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.twist = 0;
    this.pressure = 0;
    this.tangentialPressure = 0;

    this.x0 = x;
    this.y0 = y;
    this.t0 = t;
    this.dx = 0;
    this.dy = 0;
    this.dt = 0;
    this.x = x;
    this.y = y;
    this.t = t;

    this.detail = void 0;

    this.defaultPrevented = false;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  /** @internal */
  static pointerInputType(inputType: string): GestureInputType {
    if (inputType === "mouse" || inputType === "touch" || inputType === "pen") {
      return inputType;
    }
    return "unknown";
  }
}

/** @public */
export type GestureMethod = "auto" | "pointer" | "touch" | "mouse";

/** @public */
export interface GestureDescriptor<V extends View = View> extends FastenerDescriptor {
  extends?: Proto<Gesture<any, any>> | boolean | null;
  method?: GestureMethod;
  viewKey?: string | boolean;
  bindsOwner?: boolean;
  binds?: boolean;
  observes?: boolean;
}

/** @public */
export interface GestureClass<F extends Gesture<any, any> = Gesture<any, any>> extends FastenerClass<F> {
}

/** @public */
export interface Gesture<O = unknown, V extends View = View> extends Fastener<O> {
  (): V | null;
  (view: V | null): O;

  /** @override */
  get descriptorType(): Proto<GestureDescriptor<V>>;

  /** @override */
  get fastenerType(): Proto<Gesture<any, any>>;

  /** @internal */
  readonly bindsOwner?: boolean; // optional prototype property

  /** @internal */
  readonly viewKey?: string; // optional prototype property

  readonly view: V | null;

  getView(): V;

  setView(newView: V | null): V | null;

  /** @protected */
  willAttachView(view: V): void;

  /** @protected */
  onAttachView(view: V): void;

  /** @protected */
  didAttachView(view: V): void;

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
  bindView(view: View): void;

  /** @internal */
  unbindView(view: View): void;

  detectView(view: View): V | null;

  /** @internal */
  viewWillUnmount(view: V): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const Gesture = (function (_super: typeof Fastener) {
  const Gesture = _super.extend("Gesture", {}) as GestureClass;

  Object.defineProperty(Gesture.prototype, "fastenerType", {
    value: Gesture,
    enumerable: true,
    configurable: true,
  });

  Gesture.prototype.getView = function <V extends View>(this: Gesture<unknown, V>): V {
    const view = this.view;
    if (view === null) {
      throw new TypeError("null " + this.name.toString() + " view");
    }
    return view;
  };

  Gesture.prototype.setView = function <V extends View>(this: Gesture<unknown, V>, newView: V | null): V | null {
    const oldView = this.view;
    if (oldView === newView) {
      return oldView;
    } else if (oldView !== null) {
      (this as Mutable<typeof this>).view = null;
      this.willDetachView(oldView);
      this.onDetachView(oldView);
      this.didDetachView(oldView);
    }
    if (newView !== null) {
      (this as Mutable<typeof this>).view = newView;
      this.willAttachView(newView);
      this.onAttachView(newView);
      this.didAttachView(newView);
    }
    return oldView;
  };

  Gesture.prototype.willAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.onAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    if ((this.flags & Fastener.MountedFlag) === 0) {
      return;
    }
    this.attachEvents(view);
    if (this.observes === true) {
      view.observe(this as Observes<V>);
    }
  };

  Gesture.prototype.didAttachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.willDetachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    // hook
  };

  Gesture.prototype.onDetachView = function <V extends View>(this: Gesture<unknown, V>, view: V): void {
    this.clearInputs();
    if ((this.flags & Fastener.MountedFlag) === 0) {
      return;
    }
    if (this.observes === true) {
      view.unobserve(this as Observes<V>);
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

  Gesture.prototype.bindView = function <V extends View>(this: Gesture<unknown, V>, view: View): void {
    if (!this.binds || this.view !== null) {
      return;
    }
    const newView = this.detectView(view);
    if (newView === null) {
      return;
    }
    this.setView(newView);
  };

  Gesture.prototype.unbindView = function <V extends View>(this: Gesture<unknown, V>, view: View): void {
    if (!this.binds || this.view !== view) {
      return;
    }
    this.setView(null);
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

  Gesture.prototype.onMount = function <V extends View>(this: Gesture<unknown, V>): void {
    _super.prototype.onMount.call(this);
    const view = this.view;
    if (view !== null) {
      this.attachEvents(view);
      if (this.observes === true) {
        view.observe(this as Observes<V>);
      }
    }
  };

  Gesture.prototype.onUnmount = function <V extends View>(this: Gesture<unknown, V>): void {
    _super.prototype.onUnmount.call(this);
    this.clearInputs();
    const view = this.view;
    if (view !== null) {
      if (this.observes === true) {
        view.unobserve(this as Observes<V>);
      }
      this.detachEvents(view);
    }
  };

  Gesture.create = function <G extends Gesture<any, any>>(this: GestureClass<G>, owner: G extends Gesture<infer O, any> ? O : never): G {
    const gesture = _super.create.call(this, owner) as G;
    if (gesture.view === null && gesture.bindsOwner === true && (owner as unknown) instanceof View) {
      gesture.setView(owner);
    }
    return gesture;
  };

  Gesture.construct = function <G extends Gesture<any, any>>(gesture: G | null, owner: G extends Gesture<infer O, any> ? O : never): G {
    if (gesture === null) {
      gesture = function (view?: G extends Gesture<any, infer V> ? V | null : never): G extends Gesture<infer O, infer V> ? V | O | null : never {
        if (view === void 0) {
          return gesture!.view;
        } else {
          gesture!.setView(view);
          return gesture!.owner;
        }
      } as G;
      Object.defineProperty(gesture, "name", {
        value: this.prototype.name,
        enumerable: true,
        configurable: true,
      });
      Object.setPrototypeOf(gesture, this.prototype);
    }
    gesture = _super.construct.call(this, gesture, owner) as G;
    (gesture as Mutable<typeof gesture>).view = null;
    (gesture as Mutable<typeof gesture>).inputs = {};
    (gesture as Mutable<typeof gesture>).inputCount = 0;
    return gesture;
  };

  Gesture.refine = function (fastenerClass: GestureClass<any>): void {
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
