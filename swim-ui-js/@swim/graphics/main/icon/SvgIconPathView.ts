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

import {AnyLength, Length, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import {SvgViewInit, SvgView, SvgViewController} from "@swim/dom";
import type {Graphics} from "../graphics/Graphics";
import {PathContext} from "../path/PathContext";
import {PathRenderer} from "../path/PathRenderer";
import {Icon} from "./Icon";
import {IconViewInit, IconView} from "./IconView";

export interface SvgIconPathViewInit extends SvgViewInit, IconViewInit {
  viewController?: SvgViewController;
}

export class SvgIconPathView extends SvgView implements IconView {
  initView(init: SvgIconPathViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  @ViewAnimator({type: Number, inherit: true})
  declare xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, inherit: true})
  declare yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, inherit: true, updateFlags: View.NeedsAnimate})
  declare iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Object, inherit: true, updateFlags: View.NeedsAnimate})
  declare graphics: ViewAnimator<this, Graphics | undefined>;

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    this.animateIcon();
  }

  protected animateIcon(): void {
    if (this.iconColor.isUpdated()) {
      this.fill.setAutoState(this.iconColor.takeValue());
    }
    if (this.graphics.isUpdated()) {
      this.renderIcon(this.graphics.takeValue());
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.renderIcon(this.graphics.takeValue());
  }

  protected renderIcon(graphics: Graphics | undefined): void {
    let path = "";
    if (graphics !== void 0) {
      const frame = this.iconBounds;
      if (frame.isDefined() && frame.width > 0 && frame.height > 0) {
        if (graphics instanceof Icon) {
          path = graphics.toPath(frame).toPathString({precision: 3});
        } else {
          const context = new PathContext();
          const renderer = new PathRenderer(context);
          graphics.render(renderer, frame);
          path = context.toString();
        }
      }
    }
    this.d.setAutoState(path);
    this.setViewFlags(this.viewFlags & ~View.NeedsLayout);
  }

  get iconBounds(): BoxR2 {
    const viewportElement = this.node.viewportElement;
    if (viewportElement instanceof SVGSVGElement) {
      const viewBox = viewportElement.viewBox.animVal;
      const viewWidth = viewBox.width;
      const viewHeight = viewBox.height;
      const viewSize = Math.min(viewWidth, viewHeight);
      let iconWidth: Length | number | undefined = this.iconWidth.value;
      iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
      let iconHeight: Length | number | undefined = this.iconHeight.value;
      iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
      const x = viewBox.x + (viewWidth - iconWidth) * this.xAlign.getValueOr(0.5);
      const y = viewBox.y + (viewHeight - iconHeight) * this.yAlign.getValueOr(0.5);
      return new BoxR2(x, y, x + iconWidth, y + iconHeight);
    } else {
      return BoxR2.undefined();
    }
  }

  /** @hidden */
  static readonly tag: string = "path";
}
