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
import {Transition} from "@swim/tween";
import {AnyColor, Color} from "@swim/color";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import {ViewNodeType, HtmlViewInit, HtmlView, HtmlViewController} from "@swim/dom";
import {Graphics} from "../graphics/Graphics";
import {IconViewInit, IconView} from "./IconView";
import {SvgIconPathView} from "./SvgIconPathView";
import {SvgIconView} from "./SvgIconView";

export interface HtmlIconViewInit extends HtmlViewInit, IconViewInit {
  viewController?: HtmlViewController;
}

export class HtmlIconView extends HtmlView implements IconView {
  constructor(node: HTMLElement) {
    super(node);
    this.initChildViews();
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.position.setAutoState("relative");
  }

  initView(init: HtmlIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  protected initChildViews(): void {
    const svgView = this.createSvgView();
    if (svgView !== null) {
      this.setChildView("svg", svgView);
    }
  }

  protected createSvgView(): SvgIconView | null {
    return SvgIconView.create();
  }

  @ViewAnimator({type: Number})
  xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number})
  yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length})
  iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length})
  iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color})
  iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Object})
  graphics: ViewAnimator<this, Graphics | undefined>;

  get svgView(): SvgIconView | null {
    const svgView = this.getChildView("svg");
    return svgView instanceof SvgIconView ? svgView : null;
  }

  get pathView(): SvgIconPathView | null {
    const svgView = this.svgView;
    return svgView !== null ? svgView.pathView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "svg" && childView instanceof SvgIconView) {
      this.onInsertSvg(childView);
    }
  }

  protected onInsertSvg(pathView: SvgIconView): void {
    pathView.xAlign.setInherit(true);
    pathView.yAlign.setInherit(true);
    pathView.iconWidth.setInherit(true);
    pathView.iconHeight.setInherit(true);
    pathView.iconColor.setInherit(true);
    pathView.graphics.setInherit(true);
    pathView.setStyle("position", "absolute");
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    if (this.iconColor.isAuto() && !this.iconColor.isInherited()) {
      this.iconColor.setAutoState(theme.inner(mood, Look.accentColor), transition);
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
      viewWidth = viewWidth instanceof Length ? viewWidth.pxValue() : this._node.offsetWidth;
      let viewHeight: Length | string | number | undefined = this.height.value;
      viewHeight = viewHeight instanceof Length ? viewHeight.pxValue() : this._node.offsetHeight;
      svgView.width.setAutoState(viewWidth);
      svgView.height.setAutoState(viewHeight);
      svgView.viewBox.setAutoState("0 0 " + viewWidth + " " + viewHeight);
    }
  }
}
IconView.Html = HtmlIconView;
