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

import type {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import {R2Box} from "@swim/math";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import type {SvgViewInit} from "@swim/dom";
import {SvgView} from "@swim/dom";
import {Graphics} from "../graphics/Graphics";
import {SvgContext} from "../svg/SvgContext";
import {SvgRenderer} from "../svg/SvgRenderer";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";
import type {IconViewInit} from "./IconView";
import {IconView} from "./IconView";
import {IconGraphicsAnimator} from "./IconGraphicsAnimator";

/** @public */
export interface SvgIconViewInit extends SvgViewInit, IconViewInit {
}

/** @public */
export class SvgIconView extends SvgView implements IconView {
  constructor(node: SVGElement) {
    super(node);
  }

  @Animator({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly xAlign!: Animator<this, number>;

  @Animator({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly yAlign!: Animator<this, number>;

  @ThemeAnimator({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ThemeAnimator({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconHeight!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    updateFlags: View.NeedsLayout,
    didSetState(iconColor: Color | null): void {
      if (iconColor !== null) {
        const oldGraphics = this.owner.graphics.value;
        if (oldGraphics instanceof FilledIcon) {
          const newGraphics = oldGraphics.withFillColor(iconColor);
          const timing = this.timing !== null ? this.timing : false;
          this.owner.graphics.setState(newGraphics, timing, Affinity.Reflexive);
        }
      }
    },
  })
  readonly iconColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    extends: IconGraphicsAnimator,
    valueType: Graphics,
    value: null,
    updateFlags: View.NeedsLayout,
  })
  readonly graphics!: ThemeAnimator<this, Graphics | null>;

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (!this.graphics.derived) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setState(newGraphics, oldGraphics.isThemed() ? timing : false, Affinity.Reflexive);
      }
    }
  }

  protected override onResize(): void {
    super.onResize();
    this.requireUpdate(View.NeedsLayout);
  }

  protected override needsDisplay(displayFlags: ViewFlags): ViewFlags {
    if ((this.flags & View.NeedsLayout) === 0) {
      displayFlags &= ~View.NeedsLayout;
    }
    return displayFlags;
  }

  protected override onLayout(): void {
    super.onLayout();
    this.renderIcon();
  }

  protected renderIcon(): void {
    const context = new SvgContext(this);
    context.setPrecision(3);
    context.beginSvg();
    const graphics = this.graphics.value;
    if (graphics !== null) {
      const frame = this.iconBounds;
      if (frame.isDefined() && frame.width > 0 && frame.height > 0) {
        context.beginPath();
        const renderer = new SvgRenderer(context);
        graphics.render(renderer, frame);
      }
    }
    context.finalizeSvg();
  }

  get iconBounds(): R2Box {
    let viewportElement = this.node.viewportElement;
    if (viewportElement === null) {
      viewportElement = this.node;
    }
    if (viewportElement instanceof SVGSVGElement) {
      const viewBox = viewportElement.viewBox.animVal;
      const viewWidth = viewBox.width;
      const viewHeight = viewBox.height;
      const viewSize = Math.min(viewWidth, viewHeight);
      let iconWidth: Length | number | null = this.iconWidth.value;
      iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
      let iconHeight: Length | number | null = this.iconHeight.value;
      iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
      const x = viewBox.x + (viewWidth - iconWidth) * this.xAlign.getValue();
      const y = viewBox.y + (viewHeight - iconHeight) * this.yAlign.getValue();
      return new R2Box(x, y, x + iconWidth, y + iconHeight);
    } else {
      return R2Box.undefined();
    }
  }

  override init(init: SvgIconViewInit): void {
    super.init(init);
    IconView.init(this, init);
  }

  static override readonly MountFlags: ViewFlags = SvgView.MountFlags | View.NeedsAnimate;
}
