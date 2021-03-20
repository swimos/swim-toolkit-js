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

import {AnyTiming, Timing} from "@swim/mapping";
import {AnyLength, Length} from "@swim/math";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {StyleAnimator, StyleAnimatorConstraint, HtmlView} from "@swim/dom";

export type ButtonGlowState = "ready" | "glowing" | "pulsing" | "fading";

export class ButtonGlow extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "glowState", {
      value: "ready",
      enumerable: true,
      configurable: true,
    });
    this.glowTimer = 0;
    this.initGlow();
  }

  protected initGlow(): void {
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

  declare readonly glowState: ButtonGlowState;

  /** @hidden */
  glowTimer: number;

  @StyleAnimatorConstraint<ButtonGlow, Length | null, AnyLength | null>({
    propertyNames: "left",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      return node instanceof HTMLElement ? Length.px(node.offsetLeft) : null;
    },
    onEnd(left: Length | null): void {
      this.owner.didGlow();
    },
  })
  declare left: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  @StyleAnimator<ButtonGlow, number | undefined>({
    propertyNames: "opacity",
    type: Number,
    onEnd(opacity: number | undefined): void {
      if (this.owner.glowState === "pulsing" && opacity === 0) {
        this.owner.didPulse();
      } else if (this.owner.glowState === "fading" && opacity === 0) {
        this.owner.didFade();
      }
    },
  })
  declare opacity: StyleAnimator<this, number | undefined>;

  protected didMount(): void {
    if (this.backgroundColor.isAuto()) {
      let highlightColor = this.getLookOr(Look.highlightColor, null);
      if (highlightColor !== null) {
        highlightColor = highlightColor.alpha(1);
      }
      this.backgroundColor.setAutoState(highlightColor);
    }
    super.didMount();
  }

  protected onUnmount(): void {
    Object.defineProperty(this, "glowState", {
      value: "ready",
      enumerable: true,
      configurable: true,
    });
    this.cancelGlow();
    this.remove();
    super.onUnmount();
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (this.backgroundColor.isAuto()) {
      let highlightColor = theme.getOr(Look.highlightColor, mood, null);
      if (highlightColor !== null) {
        highlightColor = highlightColor.alpha(1);
      }
      this.backgroundColor.setAutoState(highlightColor);
    }
  }

  glow(clientX: number, clientY: number, timing?: AnyTiming | boolean, delay: number = 0): void {
    if (this.glowState === "ready") {
      this.cancelGlow();
      if (delay !== 0) {
        const glow = this.glow.bind(this, clientX, clientY, timing, 0);
        this.glowTimer = setTimeout(glow, delay) as any;
      } else {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(Look.timing, false);
        } else {
          timing = Timing.fromAny(timing);
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
          if (timing !== false) {
            this.left.setAutoState(cx);
            this.top.setAutoState(cy);
            this.left.setAutoState(cx - r, timing);
            this.top.setAutoState(cy - r, timing);
            this.width.setAutoState(2 * r, timing);
            this.height.setAutoState(2 * r, timing);
          } else {
            this.left.setAutoState(cx - r);
            this.top.setAutoState(cy - r);
            this.width.setAutoState(2 * r);
            this.height.setAutoState(2 * r);
            this.didGlow();
          }
          Object.defineProperty(this, "glowState", {
            value: "glowing",
            enumerable: true,
            configurable: true,
          });
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
    if (this.glowTimer !== 0) {
      clearTimeout(this.glowTimer);
      this.glowTimer = 0;
    }
  }

  pulse(clientX: number, clientY: number, timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    if (this.glowState === "ready") {
      this.glow(clientX, clientY, timing);
    }
    if (this.glowState === "glowing") {
      this.willPulse();
      if (timing !== false) {
        this.opacity.setAutoState(0, timing);
      } else {
        this.opacity.setAutoState(0);
        this.didPulse();
      }
      Object.defineProperty(this, "glowState", {
        value: "pulsing",
        enumerable: true,
        configurable: true,
      });
    }
  }

  protected willPulse(): void {
    // hook
  }

  protected didPulse(): void {
    this.remove();
  }

  fade(clientX: number, clientY: number, timing?: AnyTiming | boolean): void {
    if (this.glowState === "ready") {
      this.cancelGlow();
      this.didFade()
    } else if (this.glowState === "glowing") {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willFade();
      if (timing !== false) {
        this.opacity.setAutoState(0, timing);
      } else {
        this.opacity.setAutoState(0);
        this.didFade();
      }
    }
    Object.defineProperty(this, "glowState", {
      value: "fading",
      enumerable: true,
      configurable: true,
    });
  }

  protected willFade(): void {
    // hook
  }

  protected didFade(): void {
    this.remove();
  }
}
