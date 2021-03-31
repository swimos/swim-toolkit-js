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

import {Transition} from "../transition/Transition";
import {TweenAnimator} from "./TweenAnimator";

export abstract class TweenFrameAnimator<T> extends TweenAnimator<T> {
  /** @hidden */
  _animationFrame: number;

  constructor(value: T, transition: Transition<T> | null) {
    super(value, transition);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this._animationFrame = 0;
  }

  animate(): void {
    if (this._animationFrame === 0 && (this._animatorFlags & TweenAnimator.DisabledFlag) === 0) {
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
