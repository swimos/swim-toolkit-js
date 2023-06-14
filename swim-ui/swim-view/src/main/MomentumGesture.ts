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
import type {FastenerOwner} from "@swim/component";
import {View} from "./View";
import type {GestureInputType} from "./Gesture";
import {GestureInput} from "./Gesture";
import type {GestureView} from "./Gesture";
import {PositionGestureInput} from "./PositionGesture";
import type {PositionGestureDescriptor} from "./PositionGesture";
import type {PositionGestureClass} from "./PositionGesture";
import {PositionGesture} from "./PositionGesture";

/** @public */
export class MomentumGestureInput extends PositionGestureInput {
  vx: number;
  vy: number;
  ax: number;
  ay: number;

  /** @internal */
  readonly path: {x: number; y: number; t: number;}[];
  coasting: boolean;

  constructor(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number) {
    super(inputId, inputType, isPrimary, x, y, t);
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.path = [];
    this.coasting = false;
  }

  /** @internal */
  updatePosition(hysteresis: number): void {
    const path = this.path;
    const x = this.x;
    const y = this.y;
    const t = this.t;
    path.push({x, y, t});
    while (path.length > 1 && t - path[0]!.t > hysteresis) {
      path.shift();
    }
  }

  /** @internal */
  deriveVelocity(vMax: number): void {
    const p0 = this.path[0]!;
    const p1 = this.path[this.path.length - 1]!;
    if (p1 !== void 0 && p1 !== p0) {
      const dt = p1.t - p0.t;
      let vx: number;
      let vy: number;
      if (dt !== 0) {
        vx = (p1.x - p0.x) / dt;
        vy = (p1.y - p0.y) / dt;
        const v2 = vx * vx + vy * vy;
        const vMax2 = vMax * vMax;
        if (vMax2 < v2) {
          const v = Math.sqrt(v2);
          vx = vx * vMax / v;
          vy = vy * vMax / v;
        }
      } else {
        vx = 0;
        vy = 0;
      }
      this.vx = vx;
      this.vy = vy;
    } else if (p0 !== void 0) {
      this.vx = 0;
      this.vy = 0;
    }
  }

  /** @internal */
  integrateVelocity(t: number): void {
    const dt = t - this.t;
    if (dt !== 0) {
      let vx = this.vx + this.ax * dt;
      let x: number;
      if (vx < 0 === this.vx < 0) {
        x = this.x + this.vx * dt + 0.5 * (this.ax * dt * dt);
      } else {
        x = this.x - (this.vx * this.vx) / (2 * this.ax);
        vx = 0;
        this.ax = 0;
      }

      let vy = this.vy + this.ay * dt;
      let y: number;
      if (vy < 0 === this.vy < 0) {
        y = this.y + this.vy * dt + 0.5 * (this.ay * dt * dt);
      } else {
        y = this.y - (this.vy * this.vy) / (2 * this.ay);
        vy = 0;
        this.ay = 0;
      }

      this.dx = x - this.x;
      this.dy = y - this.y;
      this.dt = dt;
      this.x = x;
      this.y = y;
      this.t = t;
      this.vx = vx;
      this.vy = vy;
    }
  }
}

/** @public */
export type MomentumGestureDecorator<G extends MomentumGesture<any, any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, G>): (this: T, value: G | undefined) => G;
};

/** @public */
export interface MomentumGestureDescriptor<V extends View = View> extends PositionGestureDescriptor<V> {
  extends?: Proto<MomentumGesture<any, any>> | boolean | null;
  hysteresis?: number;
  acceleration?: number;
  velocityMax?: number;
}

/** @public */
export type MomentumGestureTemplate<G extends MomentumGesture<any, any>> =
  ThisType<G> &
  MomentumGestureDescriptor<GestureView<G>> &
  Partial<Omit<G, keyof MomentumGestureDescriptor>>;

/** @public */
export interface MomentumGestureClass<G extends MomentumGesture<any, any> = MomentumGesture<any, any>> extends PositionGestureClass<G> {
  /** @override */
  specialize(template: MomentumGestureDescriptor<any>): MomentumGestureClass<G>;

  /** @override */
  refine(gestureClass: MomentumGestureClass<any>): void;

  /** @override */
  extend<G2 extends G>(className: string | symbol, template: MomentumGestureTemplate<G2>): MomentumGestureClass<G2>;
  extend<G2 extends G>(className: string | symbol, template: MomentumGestureTemplate<G2>): MomentumGestureClass<G2>;

  /** @override */
  define<G2 extends G>(className: string | symbol, template: MomentumGestureTemplate<G2>): MomentumGestureClass<G2>;
  define<G2 extends G>(className: string | symbol, template: MomentumGestureTemplate<G2>): MomentumGestureClass<G2>;

  /** @override */
  <G2 extends G>(template: MomentumGestureTemplate<G2>): MomentumGestureDecorator<G2>;

  /** @internal */
  readonly Hysteresis: number;
  /** @internal */
  readonly Acceleration: number;
  /** @internal */
  readonly VelocityMax: number;
}

/** @public */
export interface MomentumGesture<O = unknown, V extends View = View> extends PositionGesture<O, V> {
  /** @internal @override */
  readonly inputs: {readonly [inputId: string]: MomentumGestureInput | undefined};

  /** @override */
  getInput(inputId: string | number): MomentumGestureInput | null;

  /** @internal @override */
  createInput(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number): MomentumGestureInput;

  /** @internal @override */
  getOrCreateInput(inputId: string | number, inputType: GestureInputType, isPrimary: boolean,
                   x: number, y: number, t: number): MomentumGestureInput;

  /** @internal @override */
  clearInput(input: MomentumGestureInput): void;

  /** @internal @override */
  clearInputs(): void;

  /** @internal @override */
  resetInput(input: MomentumGestureInput): void;

  /** @protected */
  initHysteresis(): number;

  /**
   * The time delta for velocity derivation, in milliseconds.
   */
  hysteresis: number;

  /** @protected */
  initAcceleration(): number;

  /**
   * The magnitude of the deceleration on coasting input points in,
   * pixels/millisecond^2. An acceleration of zero disables coasting.
   */
  acceleration: number;

  /** @protected */
  initVelocityMax(): number;

  /**
   * The maximum magnitude of the velocity of coasting input points,
   * in pixels/millisecond.
   */
  velocityMax: number;

  /** @internal */
  viewWillAnimate(view: View): void;

  /** @internal */
  interrupt(event: Event | null): void;

  /** @internal */
  cancel(event: Event | null): void;

  /** @internal */
  startInteracting(): void;

  /** @protected */
  willStartInteracting(): void;

  /** @protected */
  onStartInteracting(): void;

  /** @protected */
  didStartInteracting(): void;

  /** @internal */
  stopInteracting(): void;

  /** @protected */
  willStopInteracting(): void;

  /** @protected */
  onStopInteracting(): void;

  /** @protected */
  didStopInteracting(): void;

  /** @internal @override */
  onStartPressing(): void;

  /** @internal @override */
  onStopPressing(): void;

  /** @internal @override */
  beginPress(input: MomentumGestureInput, event: Event | null): void;

  /** @protected @override */
  onBeginPress(input: MomentumGestureInput, event: Event | null): void;

  /** @protected @override */
  onMovePress(input: MomentumGestureInput, event: Event | null): void;

  /** @protected @override */
  willEndPress(input: MomentumGestureInput, event: Event | null): void;

  /** @protected @override */
  onEndPress(input: MomentumGestureInput, event: Event | null): void;

  /** @protected @override */
  onCancelPress(input: MomentumGestureInput, event: Event | null): void;

  readonly coastCount: number;

  get coasting(): boolean;

  /** @internal */
  startCoasting(): void;

  /** @protected */
  willStartCoasting(): void;

  /** @protected */
  onStartCoasting(): void;

  /** @protected */
  didStartCoasting(): void;

  /** @internal */
  stopCoasting(): void;

  /** @protected */
  willStopCoasting(): void;

  /** @protected */
  onStopCoasting(): void;

  /** @protected */
  didStopCoasting(): void;

  /** @internal */
  beginCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @protected */
  willBeginCoast(input: MomentumGestureInput, event: Event | null): boolean | void;

  /** @protected */
  onBeginCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @protected */
  didBeginCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @internal */
  endCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @protected */
  willEndCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @protected */
  onEndCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @protected */
  didEndCoast(input: MomentumGestureInput, event: Event | null): void;

  /** @internal */
  doCoast(t: number): void;

  /** @protected */
  willCoast(): void;

  /** @protected */
  onCoast(): void;

  /** @protected */
  didCoast(): void;

  /** @internal */
  integrate(t: number): void;
}

/** @public */
export const MomentumGesture = (function (_super: typeof PositionGesture) {
  const MomentumGesture = _super.extend("MomentumGesture", {
    observes: true,
  }) as MomentumGestureClass;

  MomentumGesture.prototype.createInput = function (this: MomentumGesture, inputId: string, inputType: GestureInputType, isPrimary: boolean,
                                                    x: number, y: number, t: number): MomentumGestureInput {
    return new MomentumGestureInput(inputId, inputType, isPrimary, x, y, t);
  };

  MomentumGesture.prototype.clearInput = function (this: MomentumGesture, input: MomentumGestureInput): void {
    if (!input.coasting) {
      _super.prototype.clearInput.call(this, input);
    }
  };

  MomentumGesture.prototype.clearInputs = function (this: MomentumGesture): void {
    _super.prototype.clearInputs.call(this);
    (this as Mutable<typeof this>).coastCount = 0;
  };

  MomentumGesture.prototype.resetInput = function (this: MomentumGesture, input: MomentumGestureInput): void {
    if (input.coasting) {
      this.endCoast(input, null);
    }
    _super.prototype.resetInput.call(this, input);
  };

  MomentumGesture.prototype.initHysteresis = function (this: MomentumGesture): number {
    let hysteresis = (Object.getPrototypeOf(this) as MomentumGesture).hysteresis as number | undefined;
    if (hysteresis === void 0) {
      hysteresis = MomentumGesture.Hysteresis;
    }
    return hysteresis;
  };

  MomentumGesture.prototype.initAcceleration = function (this: MomentumGesture): number {
    let acceleration = (Object.getPrototypeOf(this) as MomentumGesture).acceleration as number | undefined;
    if (acceleration === void 0) {
      acceleration = MomentumGesture.Acceleration;
    }
    return acceleration;
  };

  MomentumGesture.prototype.initVelocityMax = function (this: MomentumGesture): number {
    let velocityMax = (Object.getPrototypeOf(this) as MomentumGesture).velocityMax as number | undefined;
    if (velocityMax === void 0) {
      velocityMax = MomentumGesture.VelocityMax;
    }
    return velocityMax;
  };

  MomentumGesture.prototype.viewWillAnimate = function (this: MomentumGesture, view: View): void {
    this.doCoast(view.updateTime);
  };

  MomentumGesture.prototype.interrupt = function (this: MomentumGesture, event: Event | null): void {
    const inputs = this.inputs;
    for (const inputId in inputs) {
      const input = inputs[inputId]!;
      this.endCoast(input, event);
    }
  };

  MomentumGesture.prototype.cancel = function (this: MomentumGesture, event: Event | null): void {
    const inputs = this.inputs;
    for (const inputId in inputs) {
      const input = inputs[inputId]!;
      this.endPress(input, event);
      this.endCoast(input, event);
    }
  };

  MomentumGesture.prototype.startInteracting = function (this: MomentumGesture): void {
    this.willStartInteracting();
    this.onStartInteracting();
    this.didStartInteracting();
  };

  MomentumGesture.prototype.willStartInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onStartInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.didStartInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.stopInteracting = function (this: MomentumGesture): void {
    this.willStopInteracting();
    this.onStopInteracting();
    this.didStopInteracting();
  };

  MomentumGesture.prototype.willStopInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onStopInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.didStopInteracting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onStartPressing = function (this: MomentumGesture): void {
    _super.prototype.onStartPressing.call(this);
    if (this.coastCount === 0) {
      this.startInteracting();
    }
  };

  MomentumGesture.prototype.onStopPressing = function (this: MomentumGesture): void {
    _super.prototype.onStopPressing.call(this);
    if (this.coastCount === 0) {
      this.stopInteracting();
    }
  };

  MomentumGesture.prototype.beginPress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.beginPress.call(this, input, event);
    this.interrupt(event);
  };

  MomentumGesture.prototype.onBeginPress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.onBeginPress.call(this, input, event);
    input.updatePosition(this.hysteresis);
    input.deriveVelocity(this.velocityMax);
  };

  MomentumGesture.prototype.onMovePress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.onMovePress.call(this, input, event);
    input.updatePosition(this.hysteresis);
    input.deriveVelocity(this.velocityMax);
  };

  MomentumGesture.prototype.willEndPress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.willEndPress.call(this, input, event);
    this.beginCoast(input, event);
  };

  MomentumGesture.prototype.onEndPress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.onEndPress.call(this, input, event);
    input.updatePosition(this.hysteresis);
    input.deriveVelocity(this.velocityMax);
  };

  MomentumGesture.prototype.onCancelPress = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    _super.prototype.onCancelPress.call(this, input, event);
    input.updatePosition(this.hysteresis);
    input.deriveVelocity(this.velocityMax);
  };

  Object.defineProperty(MomentumGesture.prototype, "coasting", {
    get(this: MomentumGesture): boolean {
      return this.coastCount !== 0;
    },
    configurable: true,
  });

  MomentumGesture.prototype.startCoasting = function (this: MomentumGesture): void {
    this.willStartCoasting();
    this.onStartCoasting();
    this.didStartCoasting();
  };

  MomentumGesture.prototype.willStartCoasting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onStartCoasting = function (this: MomentumGesture): void {
    if (this.pressCount === 0) {
      this.startInteracting();
    }
    if (this.view !== null) {
      this.view.requireUpdate(View.NeedsAnimate);
    }
  };

  MomentumGesture.prototype.didStartCoasting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.stopCoasting = function (this: MomentumGesture): void {
    this.willStopCoasting();
    this.onStopCoasting();
    this.didStopCoasting();
  };

  MomentumGesture.prototype.willStopCoasting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onStopCoasting = function (this: MomentumGesture): void {
    if (this.pressCount === 0) {
      this.stopInteracting();
    }
  };

  MomentumGesture.prototype.didStopCoasting = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.beginCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    if (!input.coasting && (input.vx !== 0 || input.vy !== 0)) {
      const angle = Math.atan2(Math.abs(input.vy), Math.abs(input.vx));
      const a = this.acceleration;
      const ax = (input.vx < 0 ? a : input.vx > 0 ? -a : 0) * Math.cos(angle);
      const ay = (input.vy < 0 ? a : input.vy > 0 ? -a : 0) * Math.sin(angle);
      if (ax !== 0 || ay !== 0) {
        input.ax = ax;
        input.ay = ay;
        let allowCoast = this.willBeginCoast(input, event);
        if (allowCoast === void 0) {
          allowCoast = true;
        }
        if (allowCoast) {
          input.coasting = true;
          (this as Mutable<typeof this>).coastCount += 1;
          this.onBeginCoast(input, event);
          this.didBeginCoast(input, event);
          if (this.coastCount === 1) {
            this.startCoasting();
          }
        }
      }
    }
  };

  MomentumGesture.prototype.willBeginCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): boolean | void {
    // hook
  };

  MomentumGesture.prototype.onBeginCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    input.x0 = input.x;
    input.y0 = input.y;
    input.t0 = input.t;
    input.dx = 0;
    input.dy = 0;
    input.dt = 0;
  };

  MomentumGesture.prototype.didBeginCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    // hook
  };

  MomentumGesture.prototype.endCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    if (input.coasting) {
      this.willEndCoast(input, event);
      input.coasting = false;
      (this as Mutable<typeof this>).coastCount -= 1;
      this.onEndCoast(input, event);
      this.didEndCoast(input, event);
      if (this.coastCount === 0) {
        this.stopCoasting();
      }
      this.clearInput(input);
    }
  };

  MomentumGesture.prototype.willEndCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    // hook
  };

  MomentumGesture.prototype.onEndCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    // hook
  };

  MomentumGesture.prototype.didEndCoast = function (this: MomentumGesture, input: MomentumGestureInput, event: Event | null): void {
    // hook
  };

  MomentumGesture.prototype.doCoast = function (this: MomentumGesture, t: number): void {
    if (this.coastCount !== 0) {
      this.willCoast();
      this.integrate(t);
      this.onCoast();
      const inputs = this.inputs;
      for (const inputId in inputs) {
        const input = inputs[inputId]!;
        if (input.coasting && input.ax === 0 && input.ay === 0) {
          this.endCoast(input, null);
        }
      }
      this.didCoast();
      if (this.coastCount !== 0 && this.view !== null) {
        this.view.requireUpdate(View.NeedsAnimate);
      }
    }
  };

  MomentumGesture.prototype.willCoast = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.onCoast = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.didCoast = function (this: MomentumGesture): void {
    // hook
  };

  MomentumGesture.prototype.integrate = function (this: MomentumGesture, t: number): void {
    const inputs = this.inputs;
    for (const inputId in inputs) {
      const input = inputs[inputId]!;
      if (input.coasting) {
        input.integrateVelocity(t);
      }
    }
  };

  MomentumGesture.construct = function <G extends MomentumGesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    (gesture as Mutable<typeof gesture>).coastCount = 0;
    gesture.hysteresis = gesture.initHysteresis();
    gesture.acceleration = gesture.initAcceleration();
    gesture.velocityMax = gesture.initVelocityMax();
    return gesture;
  };

  MomentumGesture.specialize = function (template: MomentumGestureDescriptor<any>): MomentumGestureClass {
    let superClass = template.extends as MomentumGestureClass | null | undefined;
    if (superClass === void 0 || superClass === null) {
      const method = template.method;
      if (method === "pointer") {
        superClass = PointerMomentumGesture;
      } else if (method === "touch") {
        superClass = TouchMomentumGesture;
      } else if (method === "mouse") {
        superClass = MouseMomentumGesture;
      } else if (typeof PointerEvent !== "undefined") {
        superClass = PointerMomentumGesture;
      } else if (typeof TouchEvent !== "undefined") {
        superClass = TouchMomentumGesture;
      } else {
        superClass = MouseMomentumGesture;
      }
    }
    return superClass;
  };

  (MomentumGesture as Mutable<typeof MomentumGesture>).Hysteresis = 67;
  (MomentumGesture as Mutable<typeof MomentumGesture>).Acceleration = 0.00175;
  (MomentumGesture as Mutable<typeof MomentumGesture>).VelocityMax = 1.75;

  return MomentumGesture;
})(PositionGesture);

/** @internal */
export interface PointerMomentumGesture<O = unknown, V extends View = View> extends MomentumGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: MomentumGestureInput, event: PointerEvent): void;

  /** @internal @protected */
  onPointerEnter(event: PointerEvent): void;

  /** @internal @protected */
  onPointerLeave(event: PointerEvent): void;

  /** @internal @protected */
  onPointerDown(event: PointerEvent): void;

  /** @internal @protected */
  onPointerMove(event: PointerEvent): void;

  /** @internal @protected */
  onPointerUp(event: PointerEvent): void;

  /** @internal @protected */
  onPointerCancel(event: PointerEvent): void;

  /** @internal @protected */
  onPointerLeaveDocument(event: PointerEvent): void;
}

/** @internal */
export const PointerMomentumGesture = (function (_super: typeof MomentumGesture) {
  const PointerMomentumGesture = _super.extend("PointerMomentumGesture", {}) as MomentumGestureClass<PointerMomentumGesture<any, any>>;

  PointerMomentumGesture.prototype.attachHoverEvents = function (this: PointerMomentumGesture, view: View): void {
    view.addEventListener("pointerenter", this.onPointerEnter as EventListener);
    view.addEventListener("pointerleave", this.onPointerLeave as EventListener);
    view.addEventListener("pointerdown", this.onPointerDown as EventListener);
  };

  PointerMomentumGesture.prototype.detachHoverEvents = function (this: PointerMomentumGesture, view: View): void {
    view.removeEventListener("pointerenter", this.onPointerEnter as EventListener);
    view.removeEventListener("pointerleave", this.onPointerLeave as EventListener);
    view.removeEventListener("pointerdown", this.onPointerDown as EventListener);
  };

  PointerMomentumGesture.prototype.attachPressEvents = function (this: PointerMomentumGesture, view: View): void {
    document.body.addEventListener("pointermove", this.onPointerMove);
    document.body.addEventListener("pointerup", this.onPointerUp);
    document.body.addEventListener("pointercancel", this.onPointerCancel);
    document.body.addEventListener("pointerleave", this.onPointerLeaveDocument);
  };

  PointerMomentumGesture.prototype.detachPressEvents = function (this: PointerMomentumGesture, view: View): void {
    document.body.removeEventListener("pointermove", this.onPointerMove);
    document.body.removeEventListener("pointerup", this.onPointerUp);
    document.body.removeEventListener("pointercancel", this.onPointerCancel);
    document.body.removeEventListener("pointerleave", this.onPointerLeaveDocument);
  };

  PointerMomentumGesture.prototype.updateInput = function (this: PointerMomentumGesture, input: MomentumGestureInput, event: PointerEvent): void {
    input.target = event.target;
    input.button = event.button;
    input.buttons = event.buttons;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.dx = event.clientX - input.x;
    input.dy = event.clientY - input.y;
    input.dt = event.timeStamp - input.t;
    input.x = event.clientX;
    input.y = event.clientY;
    input.t = event.timeStamp;

    input.width = event.width;
    input.height = event.height;
    input.tiltX = event.tiltX;
    input.tiltY = event.tiltY;
    input.twist = event.twist;
    input.pressure = event.pressure;
    input.tangentialPressure = event.tangentialPressure;
  };

  PointerMomentumGesture.prototype.onPointerEnter = function (this: PointerMomentumGesture, event: PointerEvent): void {
    if (event.pointerType === "mouse" && event.buttons === 0) {
      const input = this.getOrCreateInput(event.pointerId, GestureInput.pointerInputType(event.pointerType),
                                          event.isPrimary, event.clientX, event.clientY, event.timeStamp);
      this.updateInput(input, event);
      if (!input.hovering) {
        this.beginHover(input, event);
      }
    }
  };

  PointerMomentumGesture.prototype.onPointerLeave = function (this: PointerMomentumGesture, event: PointerEvent): void {
    if (event.pointerType === "mouse") {
      const input = this.getInput(event.pointerId);
      if (input !== null) {
        this.updateInput(input, event);
        this.endHover(input, event);
      }
    }
  };

  PointerMomentumGesture.prototype.onPointerDown = function (this: PointerMomentumGesture, event: PointerEvent): void {
    const input = this.getOrCreateInput(event.pointerId, GestureInput.pointerInputType(event.pointerType),
                                        event.isPrimary, event.clientX, event.clientY, event.timeStamp);
    this.updateInput(input, event);
    if (!input.pressing) {
      this.beginPress(input, event);
    }
    if (event.pointerType === "mouse" && event.button !== 0) {
      this.cancelPress(input, event);
    }
  };

  PointerMomentumGesture.prototype.onPointerMove = function (this: PointerMomentumGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  };

  PointerMomentumGesture.prototype.onPointerUp = function (this: PointerMomentumGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(input, event);
      }
    }
  };

  PointerMomentumGesture.prototype.onPointerCancel = function (this: PointerMomentumGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
    }
  };

  PointerMomentumGesture.prototype.onPointerLeaveDocument = function (this: PointerMomentumGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  };

  PointerMomentumGesture.construct = function <G extends PointerMomentumGesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onPointerEnter = gesture.onPointerEnter.bind(gesture);
    gesture.onPointerLeave = gesture.onPointerLeave.bind(gesture);
    gesture.onPointerDown = gesture.onPointerDown.bind(gesture);
    gesture.onPointerMove = gesture.onPointerMove.bind(gesture);
    gesture.onPointerUp = gesture.onPointerUp.bind(gesture);
    gesture.onPointerCancel = gesture.onPointerCancel.bind(gesture);
    gesture.onPointerLeaveDocument = gesture.onPointerLeaveDocument.bind(gesture);
    return gesture;
  };

  return PointerMomentumGesture;
})(MomentumGesture);

/** @internal */
export interface TouchMomentumGesture<O = unknown, V extends View = View> extends MomentumGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: MomentumGestureInput, event: TouchEvent, touch: Touch): void;

  /** @internal @protected */
  onTouchStart(event: TouchEvent): void;

  /** @internal @protected */
  onTouchMove(event: TouchEvent): void;

  /** @internal @protected */
  onTouchEnd(event: TouchEvent): void;

  /** @internal @protected */
  onTouchCancel(event: TouchEvent): void;
}

/** @internal */
export const TouchMomentumGesture = (function (_super: typeof MomentumGesture) {
  const TouchMomentumGesture = _super.extend("TouchMomentumGesture", {}) as MomentumGestureClass<TouchMomentumGesture<any, any>>;

  TouchMomentumGesture.prototype.attachHoverEvents = function (this: TouchMomentumGesture, view: View): void {
    view.addEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchMomentumGesture.prototype.detachHoverEvents = function (this: TouchMomentumGesture, view: View): void {
    view.removeEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchMomentumGesture.prototype.attachPressEvents = function (this: TouchMomentumGesture, view: View): void {
    view.addEventListener("touchmove", this.onTouchMove as EventListener);
    view.addEventListener("touchend", this.onTouchEnd as EventListener);
    view.addEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchMomentumGesture.prototype.detachPressEvents = function (this: TouchMomentumGesture, view: View): void {
    view.removeEventListener("touchmove", this.onTouchMove as EventListener);
    view.removeEventListener("touchend", this.onTouchEnd as EventListener);
    view.removeEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchMomentumGesture.prototype.updateInput = function (this: TouchMomentumGesture, input: MomentumGestureInput, event: TouchEvent, touch: Touch): void {
    input.target = touch.target;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.dx = touch.clientX - input.x;
    input.dy = touch.clientY - input.y;
    input.dt = event.timeStamp - input.t;
    input.x = touch.clientX;
    input.y = touch.clientY;
    input.t = event.timeStamp;
  };

  TouchMomentumGesture.prototype.onTouchStart = function (this: TouchMomentumGesture, event: TouchEvent): void {
    const touches = event.targetTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getOrCreateInput(touch.identifier, "touch", false, touch.clientX, touch.clientY, event.timeStamp);
      this.updateInput(input, event, touch);
      if (!input.pressing) {
        this.beginPress(input, event);
      }
    }
  };

  TouchMomentumGesture.prototype.onTouchMove = function (this: TouchMomentumGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.movePress(input, event);
      }
    }
  };

  TouchMomentumGesture.prototype.onTouchEnd = function (this: TouchMomentumGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.endPress(input, event);
        if (!input.defaultPrevented) {
          this.press(input, event);
        }
        this.endHover(input, event);
      }
    }
  };

  TouchMomentumGesture.prototype.onTouchCancel = function (this: TouchMomentumGesture, event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i]!;
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.cancelPress(input, event);
        this.endHover(input, event);
      }
    }
  };

  TouchMomentumGesture.construct = function <G extends TouchMomentumGesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onTouchStart = gesture.onTouchStart.bind(gesture);
    gesture.onTouchMove = gesture.onTouchMove.bind(gesture);
    gesture.onTouchEnd = gesture.onTouchEnd.bind(gesture);
    gesture.onTouchCancel = gesture.onTouchCancel.bind(gesture);
    return gesture;
  };

  return TouchMomentumGesture;
})(MomentumGesture);

/** @internal */
export interface MouseMomentumGesture<O = unknown, V extends View = View> extends MomentumGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: MomentumGestureInput, event: MouseEvent): void;

  /** @internal @protected */
  onMouseEnter(event: MouseEvent): void;

  /** @internal @protected */
  onMouseLeave(event: MouseEvent): void;

  /** @internal @protected */
  onMouseDown(event: MouseEvent): void;

  /** @internal @protected */
  onMouseMove(event: MouseEvent): void;

  /** @internal @protected */
  onMouseUp(event: MouseEvent): void;

  /** @internal @protected */
  onMouseLeaveDocument(event: MouseEvent): void;
}

/** @internal */
export const MouseMomentumGesture = (function (_super: typeof MomentumGesture) {
  const MouseMomentumGesture = _super.extend("MouseMomentumGesture", {}) as MomentumGestureClass<MouseMomentumGesture<any, any>>;

  MouseMomentumGesture.prototype.attachHoverEvents = function (this: MouseMomentumGesture, view: View): void {
    view.addEventListener("mouseenter", this.onMouseEnter as EventListener);
    view.addEventListener("mouseleave", this.onMouseLeave as EventListener);
    view.addEventListener("mousedown", this.onMouseDown as EventListener);
  };

  MouseMomentumGesture.prototype.detachHoverEvents = function (this: MouseMomentumGesture, view: View): void {
    view.removeEventListener("mouseenter", this.onMouseEnter as EventListener);
    view.removeEventListener("mouseleave", this.onMouseLeave as EventListener);
    view.removeEventListener("mousedown", this.onMouseDown as EventListener);
  };

  MouseMomentumGesture.prototype.attachPressEvents = function (this: MouseMomentumGesture, view: View): void {
    document.body.addEventListener("mousemove", this.onMouseMove);
    document.body.addEventListener("mouseup", this.onMouseUp);
    document.body.addEventListener("mouseleave", this.onMouseLeaveDocument);
  };

  MouseMomentumGesture.prototype.detachPressEvents = function (this: MouseMomentumGesture, view: View): void {
    document.body.removeEventListener("mousemove", this.onMouseMove);
    document.body.removeEventListener("mouseup", this.onMouseUp);
    document.body.removeEventListener("mouseleave", this.onMouseLeaveDocument);
  };

  MouseMomentumGesture.prototype.updateInput = function (this: MouseMomentumGesture, input: MomentumGestureInput, event: MouseEvent): void {
    input.target = event.target;
    input.button = event.button;
    input.buttons = event.buttons;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.dx = event.clientX - input.x;
    input.dy = event.clientY - input.y;
    input.dt = event.timeStamp - input.t;
    input.x = event.clientX;
    input.y = event.clientY;
    input.t = event.timeStamp;
  };

  MouseMomentumGesture.prototype.onMouseEnter = function (this: MouseMomentumGesture, event: MouseEvent): void {
    if (event.buttons === 0) {
      const input = this.getOrCreateInput("mouse", "mouse", true, event.clientX, event.clientY, event.timeStamp);
      this.updateInput(input, event);
      if (!input.hovering) {
        this.beginHover(input, event);
      }
    }
  };

  MouseMomentumGesture.prototype.onMouseLeave = function (this: MouseMomentumGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endHover(input, event);
    }
  };

  MouseMomentumGesture.prototype.onMouseDown = function (this: MouseMomentumGesture, event: MouseEvent): void {
    const input = this.getOrCreateInput("mouse", "mouse", true, event.clientX, event.clientY, event.timeStamp);
    this.updateInput(input, event);
    if (!input.pressing) {
      this.beginPress(input, event);
    }
    if (event.button !== 0) {
      this.cancelPress(input, event);
    }
  };

  MouseMomentumGesture.prototype.onMouseMove = function (this: MouseMomentumGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  };

  MouseMomentumGesture.prototype.onMouseUp = function (this: MouseMomentumGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(input, event);
      }
    }
  };

  MouseMomentumGesture.prototype.onMouseLeaveDocument = function (this: MouseMomentumGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  };

  MouseMomentumGesture.construct = function <G extends MouseMomentumGesture<any, any>>(gesture: G | null, owner: FastenerOwner<G>): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onMouseEnter = gesture.onMouseEnter.bind(gesture);
    gesture.onMouseLeave = gesture.onMouseLeave.bind(gesture);
    gesture.onMouseDown = gesture.onMouseDown.bind(gesture);
    gesture.onMouseMove = gesture.onMouseMove.bind(gesture);
    gesture.onMouseUp = gesture.onMouseUp.bind(gesture);
    gesture.onMouseLeaveDocument = gesture.onMouseLeaveDocument.bind(gesture);
    return gesture;
  };

  return MouseMomentumGesture;
})(MomentumGesture);
