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

import {Length} from "@swim/length";
import {Color} from "@swim/color";
import {Tween, Transition} from "@swim/transition";
import {HtmlView} from "@swim/view";

export type GlowState = "ready" | "glowing" | "pulsing" | "fading";

export class GlowView extends HtmlView {
  /** @hidden */
  _glowState: GlowState;
  /** @hidden */
  _glowTimer: number;

  constructor(node: HTMLElement) {
    super(node);
    this._glowState = "ready";
    this._glowTimer = 0;
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("glow")
        .position("absolute")
        .width(Length.zero())
        .height(Length.zero())
        .borderRadius(Length.pct(50))
        .backgroundColor(Color.white())
        .pointerEvents("none");
  }

  get glowState(): GlowState {
    return this._glowState;
  }

  protected onUnmount(): void {
    this._glowState = "ready";
    this.cancelGlow();
    super.onUnmount();
  }

  glow(clientX: number, clientY: number, opacity: number,
       tween: Tween<any> | undefined, delay: number = 0): void {
    if (this._glowState === "ready") {
      tween = Transition.forTween(tween);
      this.cancelGlow();
      if (delay !== 0) {
        const glow = this.glow.bind(this, clientX, clientY, opacity, tween, 0);
        this._glowTimer = setTimeout(glow, delay) as any;
      } else {
        this.willGlow();
        const clientBounds = this._node.offsetParent!.getBoundingClientRect();
        const cx = clientX - clientBounds.left;
        const cy = clientY - clientBounds.top;
        const rx = Math.max(cx, clientBounds.width - cx);
        const ry = Math.max(cy, clientBounds.height - cy);
        const r = Math.sqrt(rx * rx + ry * ry);
        this.opacity(opacity);
        if (tween !== null) {
          this.left(cx)
              .top(cy)
              .left(cx - r, tween.onEnd(this.didGlow.bind(this)))
              .top(cy - r, tween)
              .width(2 * r, tween)
              .height(2 * r, tween);
        } else {
          this.left(cx - r)
              .top(cy - r)
              .width(2 * r)
              .height(2 * r);
          this.didGlow();
        }
        this._glowState = "glowing";
      }
    }
  }

  protected willGlow(): void {
    // hook
  }

  protected didGlow(): void {
    // hook
  }

  cancelGlow(): void {
    if (this._glowTimer !== 0) {
      clearTimeout(this._glowTimer);
      this._glowTimer = 0;
    }
  }

  pulse(clientX: number, clientY: number, opacity: number, tween: Tween<any> | undefined): void {
    tween = Transition.forTween(tween);
    if (this._glowState === "ready") {
      this.glow(clientX, clientY, opacity, tween);
    }
    if (this._glowState === "glowing") {
      this.willPulse();
      if (tween !== null) {
        this.opacity(0, tween.onEnd(this.didPulse.bind(this)));
      } else {
        this.opacity(0);
        this.didPulse();
      }
      this._glowState = "pulsing";
    }
  }

  protected willPulse(): void {
    // hook
  }

  protected didPulse(): void {
    this.remove();
  }

  fade(clientX: number, clientY: number, tween: Tween<any> | undefined): void {
    if (this._glowState === "ready") {
      this.cancelGlow();
      this.didFade()
    } else if (this._glowState === "glowing") {
      tween = Transition.forTween(tween);
      this.willFade();
      if (tween !== null) {
        this.opacity(0, tween.onEnd(this.didFade.bind(this)));
      } else {
        this.opacity(0);
        this.didFade();
      }
    }
    this._glowState = "fading";
  }

  protected willFade(): void {
    // hook
  }

  protected didFade(): void {
    this.remove();
  }
}
