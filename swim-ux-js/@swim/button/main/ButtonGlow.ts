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

import {AnyLength, Length} from "@swim/math";
import {Tween, Transition} from "@swim/animation";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {StyleAnimator, HtmlView} from "@swim/dom";

export type ButtonGlowState = "ready" | "glowing" | "pulsing" | "fading";

export class ButtonGlow extends HtmlView {
  /** @hidden */
  _glowState: ButtonGlowState;
  /** @hidden */
  _glowTimer: number;

  constructor(node: HTMLElement) {
    super(node);
    this._glowState = "ready";
    this._glowTimer = 0;
    this.initNode(node);
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("button-glow");
    this.position.setAutoState("absolute");
    this.width.setAutoState(Length.zero());
    this.height.setAutoState(Length.zero());
    this.borderTopLeftRadius.setAutoState(Length.pct(50));
    this.borderTopRightRadius.setAutoState(Length.pct(50));
    this.borderBottomLeftRadius.setAutoState(Length.pct(50));
    this.borderBottomRightRadius.setAutoState(Length.pct(50));
    this.pointerEvents.setAutoState("none");
  }

  get glowState(): ButtonGlowState {
    return this._glowState;
  }

  @StyleAnimator<ButtonGlow, Length | "auto", AnyLength | "auto">({
    propertyNames: "left",
    type: [Length, String],
    onEnd(left: Length | "auto"): void {
      this.owner.didGlow();
    }
  })
  declare left: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator<ButtonGlow, number, number | string>({
    propertyNames: "opacity",
    type: Number,
    onEnd(opacity: number): void {
      if (this.owner._glowState === "pulsing" && opacity === 0) {
        this.owner.didPulse();
      } else if (this.owner._glowState === "fading" && opacity === 0) {
        this.owner.didFade();
      }
    },
  })
  declare opacity: StyleAnimator<this, number, number | string>;

  protected didMount(): void {
    if (this.backgroundColor.isAuto()) {
      let highlightColor = this.getLook(Look.highlightColor);
      if (highlightColor !== void 0) {
        highlightColor = highlightColor.alpha(1);
      }
      this.backgroundColor.setAutoState(highlightColor);
    }
    super.didMount();
  }

  protected onUnmount(): void {
    this._glowState = "ready";
    this.cancelGlow();
    this.remove();
    super.onUnmount();
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    if (this.backgroundColor.isAuto()) {
      let highlightColor = theme.inner(mood, Look.highlightColor);
      if (highlightColor !== void 0) {
        highlightColor = highlightColor.alpha(1);
      }
      this.backgroundColor.setAutoState(highlightColor);
    }
  }

  glow(clientX: number, clientY: number, tween?: Tween<any> | undefined, delay: number = 0): void {
    if (this._glowState === "ready") {
      this.cancelGlow();
      if (delay !== 0) {
        const glow = this.glow.bind(this, clientX, clientY, tween, 0);
        this._glowTimer = setTimeout(glow, delay) as any;
      } else {
        if (tween === void 0 || tween === true) {
          tween = this.getLookOr(Look.transition, null);
        } else {
          tween = Transition.forTween(tween);
        }
        this.willGlow();
        const offsetParent = this.node.offsetParent;
        if (offsetParent !== null) {
          const clientBounds = offsetParent.getBoundingClientRect();
          const cx = clientX - clientBounds.left;
          const cy = clientY - clientBounds.top;
          const rx = Math.max(cx, clientBounds.width - cx);
          const ry = Math.max(cy, clientBounds.height - cy);
          const r = Math.sqrt(rx * rx + ry * ry);
          const highlightColor = this.getLook(Look.highlightColor);
          const opacity = highlightColor !== void 0 ? highlightColor.alpha() : 0.1;
          this.opacity.setAutoState(opacity);
          if (tween !== null) {
            this.left.setAutoState(cx);
            this.top.setAutoState(cy);
            this.left.setAutoState(cx - r, tween);
            this.top.setAutoState(cy - r, tween);
            this.width.setAutoState(2 * r, tween);
            this.height.setAutoState(2 * r, tween);
          } else {
            this.left.setAutoState(cx - r);
            this.top.setAutoState(cy - r);
            this.width.setAutoState(2 * r);
            this.height.setAutoState(2 * r);
            this.didGlow();
          }
          this._glowState = "glowing";
        }
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

  pulse(clientX: number, clientY: number, tween?: Tween<any> | undefined): void {
    if (tween === void 0 || tween === true) {
      tween = this.getLookOr(Look.transition, null);
    } else {
      tween = Transition.forTween(tween);
    }
    if (this._glowState === "ready") {
      this.glow(clientX, clientY, tween);
    }
    if (this._glowState === "glowing") {
      this.willPulse();
      if (tween !== null) {
        this.opacity.setAutoState(0, tween);
      } else {
        this.opacity.setAutoState(0);
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

  fade(clientX: number, clientY: number, tween?: Tween<any> | undefined): void {
    if (this._glowState === "ready") {
      this.cancelGlow();
      this.didFade()
    } else if (this._glowState === "glowing") {
      if (tween === void 0 || tween === true) {
        tween = this.getLookOr(Look.transition, null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willFade();
      if (tween !== null) {
        this.opacity.setAutoState(0, tween);
      } else {
        this.opacity.setAutoState(0);
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
