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

import type {Timing} from "@swim/mapping";
import {AnyLength, Length, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/style";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import {SvgViewInit, SvgView, SvgViewController} from "@swim/dom";
import type {Graphics} from "../graphics/Graphics";
import {SvgContext} from "../svg/SvgContext";
import {SvgRenderer} from "../svg/SvgRenderer";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";
import {IconViewInit, IconView} from "./IconView";
import {IconViewAnimator} from "./IconViewAnimator";

export interface SvgIconViewInit extends SvgViewInit, IconViewInit {
  viewController?: SvgViewController;
}

export class SvgIconView extends SvgView implements IconView {
  constructor(node: SVGElement) {
    super(node);
  }

  initView(init: SvgIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  @ViewAnimator({type: Number, state: 0.5, updateFlags: View.NeedsLayout})
  declare xAlign: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 0.5, updateFlags: View.NeedsLayout})
  declare yAlign: ViewAnimator<this, number>;

  @ViewAnimator({type: Length, state: null, updateFlags: View.NeedsLayout})
  declare iconWidth: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Length, state: null, updateFlags: View.NeedsLayout})
  declare iconHeight: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Color, state: null, updateFlags: View.NeedsLayout})
  declare iconColor: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({extends: IconViewAnimator, type: Object, state: null, updateFlags: View.NeedsLayout})
  declare graphics: ViewAnimator<this, Graphics | null>;

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (!this.graphics.isInherited()) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setOwnState(newGraphics, oldGraphics.isThemed() ? timing : false);
      }
    }
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.requireUpdate(View.NeedsLayout);
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    const iconColor = this.iconColor.takeUpdatedValue();
    if (iconColor !== void 0 && iconColor !== null) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof FilledIcon) {
        const newGraphics = oldGraphics.withFillColor(iconColor);
        this.graphics.setOwnState(newGraphics);
      }
    }
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.NeedsLayout) === 0) {
      displayFlags &= ~View.NeedsLayout;
    }
    return displayFlags;
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.renderIcon();
  }

  protected renderIcon(): void {
    const context = new SvgContext(this);
    context.setPrecision(3);
    context.beginSvg();
    const graphics = this.graphics.takeValue();
    if (graphics !== null) {
      const frame = this.iconBounds;
      if (frame.isDefined() && frame.width > 0 && frame.height > 0) {
        context.beginPath();
        const renderer = new SvgRenderer(context, this.theme.state, this.mood.state);
        graphics.render(renderer, frame);
      }
    }
    context.finalizeSvg();
  }

  get iconBounds(): BoxR2 {
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
      return new BoxR2(x, y, x + iconWidth, y + iconHeight);
    } else {
      return BoxR2.undefined();
    }
  }

  static readonly mountFlags: ViewFlags = SvgView.mountFlags | View.NeedsAnimate;
}
