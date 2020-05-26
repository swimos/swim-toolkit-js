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

import {Ease, Transition} from "@swim/transition";
import {HtmlView} from "@swim/view";
import {PositionGestureInput, PositionGesture, PositionGestureDelegate} from "@swim/gesture";
import {IlluminationView} from "./IlluminationView";

export class TactileView extends HtmlView implements PositionGestureDelegate {
  /** @hidden */
  _gesture: PositionGesture<TactileView>;

  constructor(node: HTMLElement) {
    super(node);
    this._gesture = new PositionGesture(this, this);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("tactile");
  }

  get tactileTransition(): Transition<any> | null {
    return Transition.duration<any>(250, Ease.cubicOut);
  }

  protected didMount(): void {
    this._gesture.viewDidMount(this);
    super.didMount();
  }

  protected willUnmount(): void {
    super.willUnmount();
    this._gesture.viewWillUnmount(this);
  }

  didBeginPress(input: PositionGestureInput, event: Event | null): void {
    if (input.detail === void 0) {
      const delay = input.inputType === "mouse" ? 0 : 100;
      const illuminationView = this.prepend(IlluminationView);
      illuminationView.illuminate(input.x, input.y, 0.1, this.tactileTransition, delay);
      input.detail = illuminationView;
    }
  }

  didMovePress(input: PositionGestureInput, event: Event | null): void {
    if (input.isRunaway()) {
      this._gesture.cancelPress(input, event);
    } else if (!this.clientBounds.contains(input.x, input.y)) {
      input.preventDefault();
      this._gesture.beginHover(input, event);
      if (input.detail instanceof IlluminationView) {
        input.detail.dissipate(input.x, input.y, this.tactileTransition);
        input.detail = void 0;
      }
    }
  }

  didEndPress(input: PositionGestureInput, event: Event | null): void {
    if (input.detail instanceof IlluminationView) {
      if (this.clientBounds.contains(input.x, input.y)) {
        input.detail.stimulate(input.x, input.y, 0.1, this.tactileTransition);
      } else {
        input.detail.dissipate(input.x, input.y, this.tactileTransition);
        input.detail = void 0;
      }
    }
  }

  didCancelPress(input: PositionGestureInput, event: Event | null): void {
    if (input.detail instanceof IlluminationView) {
      input.detail.dissipate(input.x, input.y, this.tactileTransition);
      input.detail = void 0;
    }
  }
}
