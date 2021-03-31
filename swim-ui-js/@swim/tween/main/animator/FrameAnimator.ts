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

import {Animator} from "./Animator";

export abstract class FrameAnimator extends Animator {
  /** @hidden */
  _animationFrame: number;
  /** @hidden */
  _enabled: boolean;

  constructor() {
    super();
    this._animationFrame = 0;
    this._enabled = true;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  setEnabled(enabled: boolean): void {
    if (enabled && !this._enabled) {
      this._enabled = true;
      this.didSetEnabled(true);
    } else if (!enabled && this._enabled) {
      this._enabled = false;
      this.didSetEnabled(false);
    }
  }

  protected didSetEnabled(enabled: boolean): void {
    if (enabled) {
      this.animate();
    } else {
      this.cancel();
    }
  }

  animate(animator: Animator = this): void {
    if (this._animationFrame === 0 && this._enabled) {
      if (!this.hasOwnProperty("onAnimationFrame")) {
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
      }
      this._animationFrame = requestAnimationFrame(this.onAnimationFrame);
    }
  }

  cancel(): void {
    if (this._animationFrame !== 0) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = 0;
    }
  }

  protected onAnimationFrame(timestamp: number): void {
    this._animationFrame = 0;
    this.onAnimate(timestamp);
  }
}
