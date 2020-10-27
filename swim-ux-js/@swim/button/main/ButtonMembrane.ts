// Copyright 2015-2020 Swim inc.
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

import {ViewNodeType} from "@swim/dom";
import {PositionGestureInput, PositionGesture, PositionGestureDelegate} from "@swim/gesture";
import {ThemedHtmlViewInit, ThemedHtmlView} from "@swim/theme";
import {ButtonGlow} from "./ButtonGlow";

export interface ButtonMembraneInit extends ThemedHtmlViewInit {
}

export class ButtonMembrane extends ThemedHtmlView implements PositionGestureDelegate {
  /** @hidden */
  _gesture: PositionGesture<ButtonMembrane>;

  constructor(node: HTMLElement) {
    super(node);
    this._gesture = this.createGesture();
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("membrane");
  }

  initView(init: ButtonMembraneInit): void {
    super.initView(init);
  }

  protected createGesture(): PositionGesture<ButtonMembrane> {
    return new PositionGesture(this, this);
  }

  get glows(): boolean {
    return true;
  }

  setGlows(glows: boolean): void {
    if (this.glows !== glows) {
      Object.defineProperty(this, "glows", {
        value: glows,
        configurable: true,
        enumerable: true,
      });
    }
  }

  didBeginPress(input: PositionGestureInput, event: Event | null): void {
    if (this.glows) {
      this.glow(input);
    }
  }

  protected glow(input: PositionGestureInput): void {
    if (input.detail instanceof ButtonGlow) {
      input.detail.fade(input.x, input.y);
      input.detail = void 0;
    }
    if (input.detail === void 0) {
      const delay = input.inputType === "mouse" ? 0 : 100;
      input.detail = this.prepend(ButtonGlow);
      (input.detail as ButtonGlow).glow(input.x, input.y, void 0, delay);
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    if (input.isRunaway()) {
      this._gesture.cancelPress(input, event);
    } else if (!this.clientBounds.contains(input.x, input.y)) {
      this._gesture.beginHover(input, event);
      if (input.detail instanceof ButtonGlow) {
        input.detail.fade(input.x, input.y);
        input.detail = void 0;
      }
    }
  }

  didEndPress(input: PositionGestureInput, event: Event | null): void {
    if (!this.clientBounds.contains(input.x, input.y)) {
      this._gesture.endHover(input, event);
      if (input.detail instanceof ButtonGlow) {
        input.detail.fade(input.x, input.y);
        input.detail = void 0;
      }
    } else if (input.detail instanceof ButtonGlow) {
      input.detail.pulse(input.x, input.y);
    }
  }

  didCancelPress(input: PositionGestureInput, event: Event | null): void {
    if (!this.clientBounds.contains(input.x, input.y)) {
      this._gesture.endHover(input, event);
    }
    if (input.detail instanceof ButtonGlow) {
      input.detail.fade(input.x, input.y);
      input.detail = void 0;
    }
  }
}
