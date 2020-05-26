// Copyright 2015-2020 SWIM.AI inc.
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

import {View, ViewObserver} from "@swim/view";
import {GestureInputType} from "./Gesture";
import {PositionGestureDelegate} from "./PositionGestureDelegate";

export class PositionGestureInput {
  readonly inputId: string;
  readonly inputType: GestureInputType;
  readonly isPrimary: boolean;

  button: number;
  buttons: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;

  x0: number;
  y0: number;
  t0: number;
  dx: number;
  dy: number;
  dt: number;
  x: number;
  y: number;
  t: number;

  width: number;
  height: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  pressure: number;
  tangentialPressure: number;

  hovering: boolean;
  pressing: boolean;
  defaultPrevented: boolean;
  holdTimer: number;
  holdDelay: number;
  detail?: unknown;

  constructor(inputId: string, inputType: GestureInputType, isPrimary: boolean,
              x: number, y: number, t: number) {
    this.inputId = inputId;
    this.inputType = inputType;
    this.isPrimary = isPrimary;

    this.button = 0;
    this.buttons = 0;
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;

    this.x0 = x;
    this.y0 = y;
    this.t0 = t;
    this.dx = 0;
    this.dy = 0;
    this.dt = 0;
    this.x = x;
    this.y = y;
    this.t = t;

    this.width = 0;
    this.height = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.twist = 0;
    this.pressure = 0;
    this.tangentialPressure = 0;

    this.hovering = false;
    this.pressing = false;
    this.defaultPrevented = false;
    this.holdTimer = 0;
    this.holdDelay = 400;
  }

  isRunaway(): boolean {
    return this.inputType !== "mouse" && this.dt < 100
        && this.dx * this.dx + this.dy * this.dy > 10 * 10;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  setHoldTimer(f: () => void): void {
    if (this.holdDelay !== 0) {
      this.clearHoldTimer();
      this.holdTimer = setTimeout(f, this.holdDelay) as any;
    }
  }

  clearHoldTimer(): void {
    if (this.holdTimer !== 0) {
      clearTimeout(this.holdTimer);
      this.holdTimer = 0;
    }
  }
}

export class AbstractPositionGesture<V extends View = View> implements ViewObserver<V> {
  /** @hidden */
  readonly _view: V;
  /** @hidden */
  _delegate: PositionGestureDelegate | null;
  /** @hidden */
  _inputs: {[inputId: string]: PositionGestureInput | undefined};
  /** @hidden */
  _inputCount: number;
  /** @hidden */
  _hoverCount: number;
  /** @hidden */
  _pressCount: number;

  constructor(view: V, delegate: PositionGestureDelegate | null = null) {
    this._view = view;
    this._delegate = delegate;
    this._inputs = {};
    this._inputCount = 0;
    this._hoverCount = 0;
    this._pressCount = 0;
    this.initView(view);
  }

  protected initView(view: V): void {
    if (view.isMounted()) {
      this.attachEvents(view);
    }
  }

  get view(): V {
    return this._view;
  }

  get delegate(): PositionGestureDelegate | null {
    return this._delegate;
  }

  setDelegate(delegate: PositionGestureDelegate | null): void {
    this._delegate = delegate;
  }

  viewDidMount(view: V): void {
    this.attachEvents(view);
  }

  viewWillUnmount(view: V): void {
    this._inputs = {};
    this._inputCount = 0;
    this._hoverCount = 0;
    this._pressCount = 0;
    this.detachEvents(view);
  }

  protected attachEvents(view: V): void {
    this.attachHoverEvents(view);
  }

  protected detachEvents(view: V): void {
    this.detachHoverEvents(view);
    this.detachPressEvents(view);
  }

  protected attachHoverEvents(view: V): void {
    // hook
  }

  protected detachHoverEvents(view: V): void {
    // hook
  }

  protected attachPressEvents(view: V): void {
    // hook
  }

  protected detachPressEvents(view: V): void {
    // hook
  }

  get inputs(): {readonly [inputId: string]: PositionGestureInput | undefined} {
    return this._inputs;
  }

  getInput(inputId: string | number): PositionGestureInput | null {
    if (typeof inputId === "number") {
      inputId = "" + inputId;
    }
    const input = this._inputs[inputId];
    return input !== void 0 ? input : null;
  }

  protected startHovering(): void {
    this.willStartHovering();
    this.onStartHovering();
    this.didStartHovering();
  }

  protected willStartHovering(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willStartHovering !== void 0) {
      delegate.willStartHovering();
    }
  }

  protected onStartHovering(): void {
    // hook
  }

  protected didStartHovering(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didStartHovering !== void 0) {
      delegate.didStartHovering();
    }
  }

  protected stopHovering(): void {
    this.willStopHovering();
    this.onStopHovering();
    this.didStopHovering();
  }

  protected willStopHovering(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willStopHovering !== void 0) {
      delegate.willStopHovering();
    }
  }

  protected onStopHovering(): void {
    // hook
  }

  protected didStopHovering(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didStopHovering !== void 0) {
      delegate.didStopHovering();
    }
  }

  protected createInput(inputId: string, inputType: GestureInputType, isPrimary: boolean,
                        x: number, y: number, t: number): PositionGestureInput {
    return new PositionGestureInput(inputId, inputType, isPrimary, x, y, t);
  }

  protected getOrCreateInput(inputId: string | number, inputType: GestureInputType, isPrimary: boolean,
                             x: number, y: number, t: number): PositionGestureInput {
    if (typeof inputId === "number") {
      inputId = "" + inputId;
    }
    let input = this._inputs[inputId];
    if (input === void 0) {
      input = this.createInput(inputId, inputType, isPrimary, x, y, t);
      this._inputs[inputId] = input;
      this._inputCount += 1;
    }
    return input;
  }

  beginHover(input: PositionGestureInput, event: Event | null): void {
    if (!input.hovering) {
      this.willBeginHover(input, event);
      input.hovering = true;
      this._hoverCount += 1;
      this.onBeginHover(input, event);
      this.didBeginHover(input, event);
      if (this._hoverCount === 1) {
        this.startHovering();
      }
    }
  }

  protected willBeginHover(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willBeginHover !== void 0) {
      delegate.willBeginHover(input, event);
    }
  }

  protected onBeginHover(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didBeginHover(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didBeginHover !== void 0) {
      delegate.didBeginHover(input, event);
    }
  }

  endHover(input: PositionGestureInput, event: Event | null): void {
    if (input.hovering) {
      this.willEndHover(input, event);
      input.hovering = false;
      this._hoverCount -= 1;
      this.onEndHover(input, event);
      this.didEndHover(input, event);
      if (this._hoverCount === 0) {
        this.stopHovering();
      }
      if (!input.pressing) {
        delete this._inputs[input.inputId];
        this._inputCount -= 1;
      }
    }
  }

  protected willEndHover(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willEndHover !== void 0) {
      delegate.willEndHover(input, event);
    }
  }

  protected onEndHover(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didEndHover(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didEndHover !== void 0) {
      delegate.didEndHover(input, event);
    }
  }

  protected startPressing(): void {
    this.willStartPressing();
    this.onStartPressing();
    this.didStartPressing();
  }

  protected willStartPressing(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willStartPressing !== void 0) {
      delegate.willStartPressing();
    }
  }

  protected onStartPressing(): void {
    this.attachPressEvents(this._view);
  }

  protected didStartPressing(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didStartPressing !== void 0) {
      delegate.didStartPressing();
    }
  }

  protected stopPressing(): void {
    this.willStopPressing();
    this.onStopPressing();
    this.didStopPressing();
  }

  protected willStopPressing(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willStopPressing !== void 0) {
      delegate.willStopPressing();
    }
  }

  protected onStopPressing(): void {
    this.detachPressEvents(this._view);
  }

  protected didStopPressing(): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didStopPressing !== void 0) {
      delegate.didStopPressing();
    }
  }

  beginPress(input: PositionGestureInput, event: Event | null): void {
    if (!input.pressing) {
      this.willBeginPress(input, event);
      input.t0 = performance.now();
      input.dt = 0;
      input.t = input.t0;
      input.pressing = true;
      this._pressCount += 1;
      this.onBeginPress(input, event);
      input.setHoldTimer(this.holdPress.bind(this, input));
      this.didBeginPress(input, event);
      if (this._pressCount === 1) {
        this.startPressing();
      }
    }
  }

  protected willBeginPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willBeginPress !== void 0) {
      delegate.willBeginPress(input, event);
    }
  }

  protected onBeginPress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didBeginPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didBeginPress !== void 0) {
      delegate.didBeginPress(input, event);
    }
  }

  holdPress(input: PositionGestureInput): void {
    if (input.pressing) {
      this.willHoldPress(input);
      input.t = performance.now();
      input.dt = input.t - input.t0;
      this.onHoldPress(input);
      this.didHoldPress(input);
    }
  }

  protected willHoldPress(input: PositionGestureInput): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willHoldPress !== void 0) {
      delegate.willHoldPress(input);
    }
  }

  protected onHoldPress(input: PositionGestureInput): void {
    // hook
  }

  protected didHoldPress(input: PositionGestureInput): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didHoldPress !== void 0) {
      delegate.didHoldPress(input);
    }
  }

  movePress(input: PositionGestureInput, event: Event | null): void {
    this.willMovePress(input, event);
    this.onMovePress(input, event);
    this.didMovePress(input, event);
  }

  protected willMovePress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willMovePress !== void 0) {
      delegate.willMovePress(input, event);
    }
  }

  protected onMovePress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didMovePress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didMovePress !== void 0) {
      delegate.didMovePress(input, event);
    }
  }

  endPress(input: PositionGestureInput, event: Event | null) {
    if (input.pressing) {
      this.willEndPress(input, event);
      input.pressing = false;
      this._pressCount -= 1;
      this.onEndPress(input, event);
      input.clearHoldTimer();
      this.didEndPress(input, event);
      if (this._pressCount === 0) {
        this.stopPressing();
      }
      if (!input.hovering) {
        delete this._inputs[input.inputId];
        this._inputCount -= 1;
      }
    }
  }

  protected willEndPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willEndPress !== void 0) {
      delegate.willEndPress(input, event);
    }
  }

  protected onEndPress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didEndPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didEndPress !== void 0) {
      delegate.didEndPress(input, event);
    }
  }

  cancelPress(input: PositionGestureInput, event: Event | null): void {
    if (input.pressing) {
      this.willCancelPress(input, event);
      input.pressing = false;
      this._pressCount -= 1;
      this.onCancelPress(input, event);
      input.clearHoldTimer();
      this.didCancelPress(input, event);
      if (this._pressCount === 0) {
        this.stopPressing();
      }
      if (!input.hovering) {
        delete this._inputs[input.inputId];
        this._inputCount -= 1;
      }
    }
  }

  protected willCancelPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willCancelPress !== void 0) {
      delegate.willCancelPress(input, event);
    }
  }

  protected onCancelPress(input: PositionGestureInput, event: Event | null): void {
    // hook
  }

  protected didCancelPress(input: PositionGestureInput, event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didCancelPress !== void 0) {
      delegate.didCancelPress(input, event);
    }
  }

  press(event: Event | null): void {
    this.willPress(event);
    this.onPress(event);
    this.didPress(event);
  }

  protected willPress(event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.willPress !== void 0) {
      delegate.willPress(event);
    }
  }

  protected onPress(event: Event | null): void {
    // hook
  }

  protected didPress(event: Event | null): void {
    const delegate = this._delegate;
    if (delegate !== null && delegate.didPress !== void 0) {
      delegate.didPress(event);
    }
  }
}

/** @hidden */
export class PointerPositionGesture<V extends View> extends AbstractPositionGesture<V> {
  constructor(view: V, delegate?: PositionGestureDelegate | null) {
    super(view, delegate);
    this.onPointerEnter = this.onPointerEnter.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    this.onPointerLeaveDocument = this.onPointerLeaveDocument.bind(this);
  }

  protected attachHoverEvents(view: V): void {
    view.on("pointerenter", this.onPointerEnter);
    view.on("pointerleave", this.onPointerLeave);
    view.on("pointerdown", this.onPointerDown);
  }

  protected detachHoverEvents(view: V): void {
    view.off("pointerenter", this.onPointerEnter);
    view.off("pointerleave", this.onPointerLeave);
    view.off("pointerdown", this.onPointerDown);
  }

  protected attachPressEvents(view: V): void {
    document.body.addEventListener("pointermove", this.onPointerMove);
    document.body.addEventListener("pointerup", this.onPointerUp);
    document.body.addEventListener("pointercancel", this.onPointerCancel);
    document.body.addEventListener("pointerleave", this.onPointerLeaveDocument);
  }

  protected detachPressEvents(view: V): void {
    document.body.removeEventListener("pointermove", this.onPointerMove);
    document.body.removeEventListener("pointerup", this.onPointerUp);
    document.body.removeEventListener("pointercancel", this.onPointerCancel);
    document.body.removeEventListener("pointerleave", this.onPointerLeaveDocument);
  }

  protected updateInput(input: PositionGestureInput, event: PointerEvent): void {
    input.button = event.button;
    input.buttons = event.buttons;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.x = event.clientX;
    input.y = event.clientY;
    input.t = performance.now();
    input.dx = input.x - input.x0;
    input.dy = input.y - input.y0;
    input.dt = input.t - input.t0;

    input.width = event.width;
    input.height = event.height;
    input.tiltX = event.tiltX;
    input.tiltY = event.tiltY;
    input.twist = event.twist;
    input.pressure = event.pressure;
    input.tangentialPressure = event.tangentialPressure;
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === "mouse" && event.buttons === 0) {
      const input = this.getOrCreateInput(event.pointerId, PointerPositionGesture.inputType(event.pointerType),
                                          event.isPrimary, event.clientX, event.clientY, performance.now());
      this.updateInput(input, event);
      this.beginHover(input, event);
    }
  }

  protected onPointerLeave(event: PointerEvent): void {
    if (event.pointerType === "mouse") {
      const input = this.getInput(event.pointerId);
      if (input !== null) {
        this.updateInput(input, event);
        this.endHover(input, event);
      }
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    const input = this.getOrCreateInput(event.pointerId, PointerPositionGesture.inputType(event.pointerType),
                                        event.isPrimary, event.clientX, event.clientY, performance.now());
    this.updateInput(input, event);
    this.beginPress(input, event);
    if (event.pointerType === "mouse" && event.button !== 0) {
      this.cancelPress(input, event);
    }
  }

  protected onPointerMove(event: PointerEvent): void {
    event.preventDefault();
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  }

  protected onPointerUp(event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(event);
      }
      this.endHover(input, event);
    }
  }

  protected onPointerCancel(event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  }

  protected onPointerLeaveDocument(event: PointerEvent): void {
    const input = this.getInput(event.pointerId);
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  }

  /** @hidden */
  static inputType(inputType: string): GestureInputType {
    if (inputType === "mouse" || inputType === "touch" || inputType === "pen") {
      return inputType;
    } else {
      return "unknown";
    }
  }
}

export class TouchPositionGesture<V extends View> extends AbstractPositionGesture<V> {
  constructor(view: V, delegate?: PositionGestureDelegate | null) {
    super(view, delegate);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
  }

  protected attachHoverEvents(view: V): void {
    view.on("touchstart", this.onTouchStart);
  }

  protected detachHoverEvents(view: V): void {
    view.off("touchstart", this.onTouchStart);
  }

  protected attachPressEvents(view: V): void {
    view.on("touchmove", this.onTouchMove);
    view.on("touchend", this.onTouchEnd);
    view.on("touchcancel", this.onTouchCancel);
  }

  protected detachPressEvents(view: V): void {
    view.off("touchmove", this.onTouchMove);
    view.off("touchend", this.onTouchEnd);
    view.off("touchcancel", this.onTouchCancel);
  }

  protected updateInput(input: PositionGestureInput, event: TouchEvent, touch: Touch): void {
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.x = touch.clientX;
    input.y = touch.clientY;
    input.t = performance.now();
    input.dx = input.x - input.x0;
    input.dy = input.y - input.y0;
    input.dt = input.t - input.t0;
  }

  protected onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touches = event.targetTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      const input = this.getOrCreateInput(touch.identifier, "touch", false,
                                          touch.clientX, touch.clientY, performance.now());
      this.updateInput(input, event, touch);
      this.beginPress(input, event);
    }
  }

  protected onTouchMove(event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.movePress(input, event);
      }
    }
  }

  protected onTouchEnd(event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.endPress(input, event);
        if (!input.defaultPrevented) {
          this.press(event);
        }
        this.endHover(input, event);
      }
    }
  }

  protected onTouchCancel(event: TouchEvent): void {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      const input = this.getInput(touch.identifier);
      if (input !== null) {
        this.updateInput(input, event, touch);
        this.cancelPress(input, event);
        this.endHover(input, event);
      }
    }
  }
}

export class MousePositionGesture<V extends View> extends AbstractPositionGesture<V> {
  constructor(view: V, delegate?: PositionGestureDelegate | null) {
    super(view, delegate);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeaveDocument = this.onMouseLeaveDocument.bind(this);
  }

  protected attachHoverEvents(view: V): void {
    view.on("mouseenter", this.onMouseEnter);
    view.on("mouseleave", this.onMouseLeave);
    view.on("mousedown", this.onMouseDown);
  }

  protected detachHoverEvents(view: V): void {
    view.off("mouseenter", this.onMouseEnter);
    view.off("mouseleave", this.onMouseLeave);
    view.off("mousedown", this.onMouseDown);
  }

  protected attachPressEvents(view: V): void {
    document.body.addEventListener("mousemove", this.onMouseMove);
    document.body.addEventListener("mouseup", this.onMouseUp);
    document.body.addEventListener("mouseleave", this.onMouseLeaveDocument);
  }

  protected detachPressEvents(view: V): void {
    document.body.removeEventListener("mousemove", this.onMouseMove);
    document.body.removeEventListener("mouseup", this.onMouseUp);
    document.body.removeEventListener("mouseleave", this.onMouseLeaveDocument);
  }

  protected updateInput(input: PositionGestureInput, event: MouseEvent): void {
    input.button = event.button;
    input.buttons = event.buttons;
    input.altKey = event.altKey;
    input.ctrlKey = event.ctrlKey;
    input.metaKey = event.metaKey;
    input.shiftKey = event.shiftKey;

    input.x = event.clientX;
    input.y = event.clientY;
    input.t = performance.now();
    input.dx = input.x - input.x0;
    input.dy = input.y - input.y0;
    input.dt = input.t - input.t0;
  }

  protected onMouseEnter(event: MouseEvent): void {
    if (event.buttons === 0) {
      const input = this.getOrCreateInput("mouse", "mouse", true,
                                          event.clientX, event.clientY, performance.now());
      this.updateInput(input, event);
      this.beginHover(input, event);
    }
  }

  protected onMouseLeave(event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endHover(input, event);
    }
  }

  protected onMouseDown(event: MouseEvent): void {
    const input = this.getOrCreateInput("mouse", "mouse", true,
                                        event.clientX, event.clientY, performance.now());
    this.updateInput(input, event);
    this.beginPress(input, event);
    if (event.button !== 0) {
      this.cancelPress(input, event);
    }
  }

  protected onMouseMove(event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.movePress(input, event);
    }
  }

  protected onMouseUp(event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.endPress(input, event);
      if (!input.defaultPrevented && event.button === 0) {
        this.press(event);
      }
      this.endHover(input, event);
    }
  }

  protected onMouseLeaveDocument(event: MouseEvent): void {
    const input = this.getInput("mouse");
    if (input !== null) {
      this.updateInput(input, event);
      this.cancelPress(input, event);
      this.endHover(input, event);
    }
  }
}

type PositionGesture<V extends View> = AbstractPositionGesture<V>;
const PositionGesture: typeof AbstractPositionGesture =
    typeof PointerEvent !== "undefined" ? PointerPositionGesture :
    typeof TouchEvent !== "undefined" ? TouchPositionGesture :
    MousePositionGesture;
export {PositionGesture};
