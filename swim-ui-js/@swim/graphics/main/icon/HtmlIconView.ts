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
import {AnyLength, Length} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import {HtmlViewInit, HtmlView, HtmlViewController} from "@swim/dom";
import type {Graphics} from "../graphics/Graphics";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";
import {IconViewInit, IconView} from "./IconView";
import {IconViewAnimator} from "./IconViewAnimator";
import {SvgIconView} from "./SvgIconView";

export interface HtmlIconViewInit extends HtmlViewInit, IconViewInit {
  viewController?: HtmlViewController;
}

export class HtmlIconView extends HtmlView implements IconView {
  constructor(node: HTMLElement) {
    super(node);
    this.initIcon();
  }

  protected initIcon(): void {
    this.position.setAutoState("relative");
    const svgView = this.createSvgView();
    if (svgView !== null) {
      this.setChildView("svg", svgView);
    }
  }

  initView(init: HtmlIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  protected createSvgView(): SvgIconView | null {
    return SvgIconView.create();
  }

  @ViewAnimator({type: Number, updateFlags: View.NeedsLayout})
  declare xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number, updateFlags: View.NeedsLayout})
  declare yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsLayout})
  declare iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length, updateFlags: View.NeedsLayout})
  declare iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color, updateFlags: View.NeedsLayout})
  declare iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({extends: IconViewAnimator, type: Object, updateFlags: View.NeedsLayout})
  declare graphics: ViewAnimator<this, Graphics | undefined>;

  get svgView(): SvgIconView | null {
    const svgView = this.getChildView("svg");
    return svgView instanceof SvgIconView ? svgView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "svg" && childView instanceof SvgIconView) {
      this.onInsertSvg(childView);
    }
  }

  protected onInsertSvg(svgView: SvgIconView): void {
    svgView.xAlign.setInherit(true);
    svgView.yAlign.setInherit(true);
    svgView.iconWidth.setInherit(true);
    svgView.iconHeight.setInherit(true);
    svgView.iconColor.setInherit(true);
    svgView.graphics.setInherit(true);
    svgView.setStyle("position", "absolute");
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (!this.graphics.isInherited()) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setOwnState(newGraphics, oldGraphics.isThemed() ? timing : false);
      }
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    const iconColor = this.iconColor.takeUpdatedValue();
    if (iconColor !== void 0) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof FilledIcon) {
        const newGraphics = oldGraphics.withFillColor(iconColor);
        this.graphics.setOwnState(newGraphics);
      }
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutIcon();
  }

  protected layoutIcon(): void {
    const svgView = this.svgView;
    if (svgView !== null && (svgView.width.isAuto() || svgView.height.isAuto() || svgView.viewBox.isAuto())) {
      let viewWidth: Length | string | number | undefined = this.width.value;
      viewWidth = viewWidth instanceof Length ? viewWidth.pxValue() : this.node.offsetWidth;
      let viewHeight: Length | string | number | undefined = this.height.value;
      viewHeight = viewHeight instanceof Length ? viewHeight.pxValue() : this.node.offsetHeight;
      svgView.width.setAutoState(viewWidth);
      svgView.height.setAutoState(viewHeight);
      svgView.viewBox.setAutoState("0 0 " + viewWidth + " " + viewHeight);
    }
  }
}
