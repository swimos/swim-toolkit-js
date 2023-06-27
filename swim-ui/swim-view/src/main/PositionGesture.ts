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
import type {View} from "./View";
import type {GestureInputType} from "./Gesture";
import {GestureInput} from "./Gesture";
import type {GestureDescriptor} from "./Gesture";
import type {GestureClass} from "./Gesture";
import {Gesture} from "./Gesture";

/** @public */
export class PositionGestureInput extends GestureInput {
  hovering: boolean;
  pressing: boolean;
  holdTimer: number;
  holdDelay: number;

  constructor(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number) {
    super(inputId, inputType, isPrimary, x, y, t);
    this.hovering = false;
    this.pressing = false;
    this.holdTimer = 0;
    this.holdDelay = 400;
  }

  isRunaway(): boolean {
    const dx = this.x - this.x0;
    const dy = this.y - this.y0;
    const dt = this.t - this.t0;
    return this.inputType !== "mouse" && dt < 100
        && dx * dx + dy * dy > 10 * 10;
  }

  setHoldTimer(f: () => void): void {
    if (this.holdDelay === 0) {
      return;
    }
    this.clearHoldTimer();
    this.holdTimer = setTimeout(f, this.holdDelay) as any;
  }

  clearHoldTimer(): void {
    if (this.holdTimer === 0) {
      return;
    }
    clearTimeout(this.holdTimer);
    this.holdTimer = 0;
  }
}

/** @public */
export interface PositionGestureDescriptor<V extends View = View> extends GestureDescriptor<V> {
  extends?: Proto<PositionGesture<any, any>> | boolean | null;
}

/** @public */
export interface PositionGestureClass<F extends PositionGesture<any, any> = PositionGesture<any, any>> extends GestureClass<F> {
}

/** @public */
export interface PositionGesture<O = unknown, V extends View = View> extends Gesture<O, V> {
  /** @override */
  get descriptorType(): Proto<PositionGestureDescriptor<V>>;

  /** @internal @protected @override */
  attachEvents(view: V): void;

  /** @internal @protected @override */
  detachEvents(view: V): void;

  /** @internal @protected */
  attachHoverEvents(view: V): void;

  /** @internal @protected */
  detachHoverEvents(view: V): void;

  /** @internal @protected */
  attachPressEvents(view: V): void;

  /** @internal @protected */
  detachPressEvents(view: V): void;

  /** @internal @override */
  readonly inputs: {readonly [inputId: string]: PositionGestureInput | undefined};

  /** @override */
  getInput(inputId: string | number): PositionGestureInput | null;

  /** @internal @override */
  createInput(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number): PositionGestureInput;

  /** @internal */
  getOrCreateInput(inputId: string | number, inputType: GestureInputType, isPrimary: boolean,
                   x: number, y: number, t: number): PositionGestureInput;

  /** @internal @override */
  clearInput(input: PositionGestureInput): void;

  /** @internal @override */
  clearInputs(): void;

  /** @internal @override */
  resetInput(input: PositionGestureInput): void;

  readonly hoverCount: number;

  get hovering(): boolean;

  /** @internal */
  startHovering(): void;

  /** @protected */
  willStartHovering(): void;

  /** @protected */
  onStartHovering(): void;

  /** @protected */
  didStartHovering(): void;

  /** @internal */
  stopHovering(): void;

  /** @protected */
  willStopHovering(): void;

  /** @protected */
  onStopHovering(): void;

  /** @protected */
  didStopHovering(): void;

  /** @internal */
  beginHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willBeginHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onBeginHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didBeginHover(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  endHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willEndHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onEndHover(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didEndHover(input: PositionGestureInput, event: Event | null): void;

  readonly pressCount: number;

  get pressing(): boolean

  /** @internal */
  startPressing(): void;

  /** @protected */
  willStartPressing(): void;

  /** @protected */
  onStartPressing(): void;

  /** @protected */
  didStartPressing(): void;

  /** @internal */
  stopPressing(): void;

  /** @protected */
  willStopPressing(): void;

  /** @protected */
  onStopPressing(): void;

  /** @protected */
  didStopPressing(): void;

  /** @internal */
  beginPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willBeginPress(input: PositionGestureInput, event: Event | null): boolean | void;

  /** @protected */
  onBeginPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didBeginPress(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  movePress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willMovePress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onMovePress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didMovePress(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  endPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willEndPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onEndPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didEndPress(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  cancelPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willCancelPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onCancelPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didCancelPress(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  press(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  willPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  onPress(input: PositionGestureInput, event: Event | null): void;

  /** @protected */
  didPress(input: PositionGestureInput, event: Event | null): void;

  /** @internal */
  longPress(input: PositionGestureInput): void;

  /** @protected */
  willLongPress(input: PositionGestureInput): void;

  /** @protected */
  onLongPress(input: PositionGestureInput): void;

  /** @protected */
  didLongPress(input: PositionGestureInput): void;
}

/** @public */
export const PositionGesture = (function (_super: typeof Gesture) {
  const PositionGesture = _super.extend("PositionGesture", {}) as PositionGestureClass;

  PositionGesture.prototype.attachEvents = function (this: PositionGesture, view: View): void {
    _super.prototype.attachEvents.call(this, view);
    this.attachHoverEvents(view);
  };

  PositionGesture.prototype.detachEvents = function (this: PositionGesture, view: View): void {
    this.detachPressEvents(view);
    this.detachHoverEvents(view);
    _super.prototype.detachEvents.call(this, view);
  };

  PositionGesture.prototype.attachHoverEvents = function (this: PositionGesture, view: View): void {
    // hook
  };

  PositionGesture.prototype.detachHoverEvents = function (this: PositionGesture, view: View): void {
    // hook
  };

  PositionGesture.prototype.attachPressEvents = function (this: PositionGesture, view: View): void {
    // hook
  };

  PositionGesture.prototype.detachPressEvents = function (this: PositionGesture, view: View): void {
    // hook
  };

  PositionGesture.prototype.createInput = function (this: PositionGesture, inputId: string, inputType: GestureInputType, isPrimary: boolean,
                                                    x: number, y: number, t: number): PositionGestureInput {
    return new PositionGestureInput(inputId, inputType, isPrimary, x, y, t);
  };

  PositionGesture.prototype.clearInput = function (this: PositionGesture, input: PositionGestureInput): void {
    if (!input.hovering && !input.pressing) {
      _super.prototype.clearInput.call(this, input);
    }
  };

  PositionGesture.prototype.clearInputs = function (this: PositionGesture): void {
    _super.prototype.clearInputs.call(this);
    (this as Mutable<typeof this>).hoverCount = 0;
    (this as Mutable<typeof this>).pressCount = 0;
  };

  PositionGesture.prototype.resetInput = function (this: PositionGesture, input: PositionGestureInput): void {
    if (input.pressing) {
      this.cancelPress(input, null);
    }
    if (input.hovering) {
      this.endHover(input, null);
    }
    _super.prototype.resetInput.call(this, input);
  };

  Object.defineProperty(PositionGesture.prototype, "hovering", {
    get(this: PositionGesture): boolean {
      return this.hoverCount !== 0;
    },
    configurable: true,
  });

  PositionGesture.prototype.startHovering = function (this: PositionGesture): void {
    this.willStartHovering();
    this.onStartHovering();
    this.didStartHovering();
  };

  PositionGesture.prototype.willStartHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.onStartHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.didStartHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.stopHovering = function (this: PositionGesture): void {
    this.willStopHovering();
    this.onStopHovering();
    this.didStopHovering();
  };

  PositionGesture.prototype.willStopHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.onStopHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.didStopHovering = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.beginHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    if (input.hovering) {
      return;
    }
    this.willBeginHover(input, event);
    input.hovering = true;
    (this as Mutable<typeof this>).hoverCount += 1;
    this.onBeginHover(input, event);
    this.didBeginHover(input, event);
    if (this.hoverCount === 1) {
      this.startHovering();
    }
  };

  PositionGesture.prototype.willBeginHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onBeginHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didBeginHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.endHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    if (!input.hovering) {
      return;
    }
    this.willEndHover(input, event);
    input.hovering = false;
    (this as Mutable<typeof this>).hoverCount -= 1;
    this.onEndHover(input, event);
    this.didEndHover(input, event);
    if (this.hoverCount === 0) {
      this.stopHovering();
    }
    this.clearInput(input);
  };

  PositionGesture.prototype.willEndHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onEndHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didEndHover = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  Object.defineProperty(PositionGesture.prototype, "pressing", {
    get(this: PositionGesture): boolean {
      return this.pressCount !== 0;
    },
    configurable: true,
  });

  PositionGesture.prototype.startPressing = function (this: PositionGesture): void {
    this.willStartPressing();
    this.onStartPressing();
    this.didStartPressing();
  };

  PositionGesture.prototype.willStartPressing = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.onStartPressing = function (this: PositionGesture): void {
    this.attachPressEvents(this.view!);
  };

  PositionGesture.prototype.didStartPressing = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.stopPressing = function (this: PositionGesture): void {
    this.willStopPressing();
    this.onStopPressing();
    this.didStopPressing();
  };

  PositionGesture.prototype.willStopPressing = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.onStopPressing = function (this: PositionGesture): void {
    this.detachPressEvents(this.view!);
  };

  PositionGesture.prototype.didStopPressing = function (this: PositionGesture): void {
    // hook
  };

  PositionGesture.prototype.beginPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    if (input.pressing) {
      return;
    }
    let allowPress = this.willBeginPress(input, event);
    if (allowPress === void 0) {
      allowPress = true;
    }
    if (!allowPress) {
      return;
    }
    input.pressing = true;
    input.defaultPrevented = false;
    (this as Mutable<typeof this>).pressCount += 1;
    this.onBeginPress(input, event);
    input.setHoldTimer(this.longPress.bind(this, input));
    this.didBeginPress(input, event);
    if (this.pressCount === 1) {
      this.startPressing();
    }
  };

  PositionGesture.prototype.willBeginPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): boolean | void {
    // hook
  };

  PositionGesture.prototype.onBeginPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    input.x0 = input.x;
    input.y0 = input.y;
    input.t0 = input.t;
    input.dx = 0;
    input.dy = 0;
    input.dt = 0;
  };

  PositionGesture.prototype.didBeginPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.movePress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    if (!input.pressing) {
      return;
    }
    this.willMovePress(input, event);
    this.onMovePress(input, event);
    this.didMovePress(input, event);
  };

  PositionGesture.prototype.willMovePress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onMovePress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didMovePress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.endPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    input.clearHoldTimer();
    if (!input.pressing) {
      return;
    }
    this.willEndPress(input, event);
    input.pressing = false;
    (this as Mutable<typeof this>).pressCount -= 1;
    this.onEndPress(input, event);
    this.didEndPress(input, event);
    if (this.pressCount === 0) {
      this.stopPressing();
    }
    this.clearInput(input);
  };

  PositionGesture.prototype.willEndPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onEndPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didEndPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.cancelPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    input.clearHoldTimer();
    if (!input.pressing) {
      return;
    }
    this.willCancelPress(input, event);
    input.pressing = false;
    (this as Mutable<typeof this>).pressCount -= 1;
    this.onCancelPress(input, event);
    this.didCancelPress(input, event);
    if (this.pressCount === 0) {
      this.stopPressing();
    }
    this.clearInput(input);
  };

  PositionGesture.prototype.willCancelPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onCancelPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didCancelPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.press = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    this.willPress(input, event);
    this.onPress(input, event);
    this.didPress(input, event);
  };

  PositionGesture.prototype.willPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.onPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.didPress = function (this: PositionGesture, input: PositionGestureInput, event: Event | null): void {
    // hook
  };

  PositionGesture.prototype.longPress = function (this: PositionGesture, input: PositionGestureInput): void {
    input.clearHoldTimer();
    const dt = performance.now() - input.t0;
    if (dt >= 1.5 * input.holdDelay || !input.pressing) {
      return;
    }
    this.willLongPress(input);
    this.onLongPress(input);
    this.didLongPress(input);
  };

  PositionGesture.prototype.willLongPress = function (this: PositionGesture, input: PositionGestureInput): void {
    // hook
  };

  PositionGesture.prototype.onLongPress = function (this: PositionGesture, input: PositionGestureInput): void {
    const t = performance.now();
    input.dt = t - input.t;
    input.t = t;
  };

  PositionGesture.prototype.didLongPress = function (this: PositionGesture, input: PositionGestureInput): void {
    // hook
  };

  PositionGesture.construct = function <G extends PositionGesture<any, any>>(gesture: G | null, owner: G extends PositionGesture<infer O, any> ? O : never): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    (gesture as Mutable<typeof gesture>).hoverCount = 0;
    (gesture as Mutable<typeof gesture>).pressCount = 0;
    return gesture;
  };

  PositionGesture.specialize = function (template: PositionGestureDescriptor<any>): PositionGestureClass {
    let superClass = template.extends as PositionGestureClass | null | undefined;
    if (superClass === void 0 || superClass === null) {
      const method = template.method;
      if (method === "pointer") {
        superClass = PointerPositionGesture;
      } else if (method === "touch") {
        superClass = TouchPositionGesture;
      } else if (method === "mouse") {
        superClass = MousePositionGesture;
      } else if (typeof PointerEvent !== "undefined") {
        superClass = PointerPositionGesture;
      } else if (typeof TouchEvent !== "undefined") {
        superClass = TouchPositionGesture;
      } else {
        superClass = MousePositionGesture;
      }
    }
    return superClass;
  };

  return PositionGesture;
})(Gesture);

/** @internal */
export interface PointerPositionGesture<O = unknown, V extends View = View> extends PositionGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: PositionGestureInput, event: PointerEvent): void;

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
export const PointerPositionGesture = (function (_super: typeof PositionGesture) {
  const PointerPositionGesture = _super.extend("PointerPositionGesture", {}) as PositionGestureClass<PointerPositionGesture<any, any>>;

  PointerPositionGesture.prototype.attachHoverEvents = function (this: PointerPositionGesture, view: View): void {
    view.addEventListener("pointerenter", this.onPointerEnter as EventListener);
    view.addEventListener("pointerleave", this.onPointerLeave as EventListener);
    view.addEventListener("pointerdown", this.onPointerDown as EventListener);
  };

  PointerPositionGesture.prototype.detachHoverEvents = function (this: PointerPositionGesture, view: View): void {
    view.removeEventListener("pointerenter", this.onPointerEnter as EventListener);
    view.removeEventListener("pointerleave", this.onPointerLeave as EventListener);
    view.removeEventListener("pointerdown", this.onPointerDown as EventListener);
  };

  PointerPositionGesture.prototype.attachPressEvents = function (this: PointerPositionGesture, view: View): void {
    document.body.addEventListener("pointermove", this.onPointerMove);
    document.body.addEventListener("pointerup", this.onPointerUp);
    document.body.addEventListener("pointercancel", this.onPointerCancel);
    document.body.addEventListener("pointerleave", this.onPointerLeaveDocument);
  };

  PointerPositionGesture.prototype.detachPressEvents = function (this: PointerPositionGesture, view: View): void {
    document.body.removeEventListener("pointermove", this.onPointerMove);
    document.body.removeEventListener("pointerup", this.onPointerUp);
    document.body.removeEventListener("pointercancel", this.onPointerCancel);
    document.body.removeEventListener("pointerleave", this.onPointerLeaveDocument);
  };

  PointerPositionGesture.prototype.updateInput = function (this: PointerPositionGesture, input: PositionGestureInput, event: PointerEvent): void {
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

  PointerPositionGesture.prototype.onPointerEnter = function (this: PointerPositionGesture, event: PointerEvent): void {
    if (event.pointerType === "mouse" && event.buttons === 0) {
      const input = this.getOrCreateInput(event.pointerId, GestureInput.pointerInputType(event.pointerType),
                                          event.isPrimary, event.clientX, event.clientY, event.timeStamp);
      this.updateInput(input, event);
      if (!input.hovering) {
        this.beginHover(input, event);
      }
    }
  };

  PointerPositionGesture.prototype.onPointerLeave = function (this: PointerPositionGesture, event: PointerEvent): void {
    if (event.pointerType === "mouse") {
      const input = this.getInput(event.pointerId);
      if (input !== null) {
        this.updateInput(input, event);
        this.endHover(input, event);
      }
    }
  };

  PointerPositionGesture.prototype.onPointerDown = function (this: PointerPositionGesture, event: PointerEvent): void {
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

  PointerPositionGesture.prototype.onPointerMove = function (this: PointerPositionGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  };

  PointerPositionGesture.prototype.onPointerUp = function (this: PointerPositionGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(input, event);
      }
    }
  };

  PointerPositionGesture.prototype.onPointerCancel = function (this: PointerPositionGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
    }
  };

  PointerPositionGesture.prototype.onPointerLeaveDocument = function (this: PointerPositionGesture, event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  };

  PointerPositionGesture.construct = function <G extends PointerPositionGesture<any, any>>(gesture: G | null, owner: G extends PositionGesture<infer O, any> ? O : never): G {
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

  return PointerPositionGesture;
})(PositionGesture);

/** @internal */
export interface TouchPositionGesture<O = unknown, V extends View = View> extends PositionGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: PositionGestureInput, event: TouchEvent, touch: Touch): void;

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
export const TouchPositionGesture = (function (_super: typeof PositionGesture) {
  const TouchPositionGesture = _super.extend("TouchPositionGesture", {}) as PositionGestureClass<TouchPositionGesture<any, any>>;

  TouchPositionGesture.prototype.attachHoverEvents = function (this: TouchPositionGesture, view: View): void {
    view.addEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchPositionGesture.prototype.detachHoverEvents = function (this: TouchPositionGesture, view: View): void {
    view.removeEventListener("touchstart", this.onTouchStart as EventListener);
  };

  TouchPositionGesture.prototype.attachPressEvents = function (this: TouchPositionGesture, view: View): void {
    view.addEventListener("touchmove", this.onTouchMove as EventListener);
    view.addEventListener("touchend", this.onTouchEnd as EventListener);
    view.addEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchPositionGesture.prototype.detachPressEvents = function (this: TouchPositionGesture, view: View): void {
    view.removeEventListener("touchmove", this.onTouchMove as EventListener);
    view.removeEventListener("touchend", this.onTouchEnd as EventListener);
    view.removeEventListener("touchcancel", this.onTouchCancel as EventListener);
  };

  TouchPositionGesture.prototype.updateInput = function (this: TouchPositionGesture, input: PositionGestureInput, event: TouchEvent, touch: Touch): void {
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

  TouchPositionGesture.prototype.onTouchStart = function (this: TouchPositionGesture, event: TouchEvent): void {
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

  TouchPositionGesture.prototype.onTouchMove = function (this: TouchPositionGesture, event: TouchEvent): void {
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

  TouchPositionGesture.prototype.onTouchEnd = function (this: TouchPositionGesture, event: TouchEvent): void {
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

  TouchPositionGesture.prototype.onTouchCancel = function (this: TouchPositionGesture, event: TouchEvent): void {
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

  TouchPositionGesture.construct = function <G extends TouchPositionGesture<any, any>>(gesture: G | null, owner: G extends PositionGesture<infer O, any> ? O : never): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onTouchStart = gesture.onTouchStart.bind(gesture);
    gesture.onTouchMove = gesture.onTouchMove.bind(gesture);
    gesture.onTouchEnd = gesture.onTouchEnd.bind(gesture);
    gesture.onTouchCancel = gesture.onTouchCancel.bind(gesture);
    return gesture;
  };

  return TouchPositionGesture;
})(PositionGesture);

/** @internal */
export interface MousePositionGesture<O = unknown, V extends View = View> extends PositionGesture<O, V> {
  /** @internal @protected @override */
  attachHoverEvents(view: V): void;

  /** @internal @protected @override */
  detachHoverEvents(view: V): void;

  /** @internal @protected @override */
  attachPressEvents(view: V): void;

  /** @internal @protected @override */
  detachPressEvents(view: V): void;

  /** @internal @protected */
  updateInput(input: PositionGestureInput, event: MouseEvent): void;

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
export const MousePositionGesture = (function (_super: typeof PositionGesture) {
  const MousePositionGesture = _super.extend("MousePositionGesture", {}) as PositionGestureClass<MousePositionGesture<any, any>>;

  MousePositionGesture.prototype.attachHoverEvents = function (this: MousePositionGesture, view: View): void {
    view.addEventListener("mouseenter", this.onMouseEnter as EventListener);
    view.addEventListener("mouseleave", this.onMouseLeave as EventListener);
    view.addEventListener("mousedown", this.onMouseDown as EventListener);
  };

  MousePositionGesture.prototype.detachHoverEvents = function (this: MousePositionGesture, view: View): void {
    view.removeEventListener("mouseenter", this.onMouseEnter as EventListener);
    view.removeEventListener("mouseleave", this.onMouseLeave as EventListener);
    view.removeEventListener("mousedown", this.onMouseDown as EventListener);
  };

  MousePositionGesture.prototype.attachPressEvents = function (this: MousePositionGesture, view: View): void {
    document.body.addEventListener("mousemove", this.onMouseMove);
    document.body.addEventListener("mouseup", this.onMouseUp);
    document.body.addEventListener("mouseleave", this.onMouseLeaveDocument);
  };

  MousePositionGesture.prototype.detachPressEvents = function (this: MousePositionGesture, view: View): void {
    document.body.removeEventListener("mousemove", this.onMouseMove);
    document.body.removeEventListener("mouseup", this.onMouseUp);
    document.body.removeEventListener("mouseleave", this.onMouseLeaveDocument);
  };

  MousePositionGesture.prototype.updateInput = function (this: MousePositionGesture, input: PositionGestureInput, event: MouseEvent): void {
    input.target = event.target;
    input.button = event.button;
    input.buttons = event.buttons;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.dx = event.clientX - input.x;
    input.dy = event.clientY - input.y;
    input.dt = event.timeStamp - input.y;
    input.x = event.clientX;
    input.y = event.clientY;
    input.t = event.timeStamp;
  };

  MousePositionGesture.prototype.onMouseEnter = function (this: MousePositionGesture, event: MouseEvent): void {
    if (event.buttons === 0) {
      const input = this.getOrCreateInput("mouse", "mouse", true, event.clientX, event.clientY, event.timeStamp);
      this.updateInput(input, event);
      if (!input.hovering) {
        this.beginHover(input, event);
      }
    }
  };

  MousePositionGesture.prototype.onMouseLeave = function (this: MousePositionGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endHover(input, event);
    }
  };

  MousePositionGesture.prototype.onMouseDown = function (this: MousePositionGesture, event: MouseEvent): void {
    const input = this.getOrCreateInput("mouse", "mouse", true, event.clientX, event.clientY, event.timeStamp);
    this.updateInput(input, event);
    if (!input.pressing) {
      this.beginPress(input, event);
    }
    if (event.button !== 0) {
      this.cancelPress(input, event);
    }
  };

  MousePositionGesture.prototype.onMouseMove = function (this: MousePositionGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  };

  MousePositionGesture.prototype.onMouseUp = function (this: MousePositionGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(input, event);
      }
    }
  };

  MousePositionGesture.prototype.onMouseLeaveDocument = function (this: MousePositionGesture, event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  };

  MousePositionGesture.construct = function <G extends MousePositionGesture<any, any>>(gesture: G | null, owner: G extends PositionGesture<infer O, any> ? O : never): G {
    gesture = _super.construct.call(this, gesture, owner) as G;
    gesture.onMouseEnter = gesture.onMouseEnter.bind(gesture);
    gesture.onMouseLeave = gesture.onMouseLeave.bind(gesture);
    gesture.onMouseDown = gesture.onMouseDown.bind(gesture);
    gesture.onMouseMove = gesture.onMouseMove.bind(gesture);
    gesture.onMouseUp = gesture.onMouseUp.bind(gesture);
    gesture.onMouseLeaveDocument = gesture.onMouseLeaveDocument.bind(gesture);
    return gesture;
  };

  return MousePositionGesture;
})(PositionGesture);
