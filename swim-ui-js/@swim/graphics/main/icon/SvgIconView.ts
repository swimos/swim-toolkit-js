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
import {ViewFlags, View, ViewAnimator} from "@swim/view";
import {SvgViewInit, SvgView, SvgViewController} from "@swim/dom";
import {Graphics} from "../graphics/Graphics";
import {IconViewInit, IconView} from "./IconView";
import {SvgIconPathView} from "./SvgIconPathView";

export interface SvgIconViewInit extends SvgViewInit, IconViewInit {
  viewController?: SvgViewController;
}

export class SvgIconView extends SvgView implements IconView {
  constructor(node: SVGElement) {
    super(node);
    this.initChildViews();
  }

  initView(init: SvgIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  protected initChildViews(): void {
    const pathView = this.createPathView();
    if (pathView !== null) {
      this.setChildView("path", pathView);
    }
  }

  protected createPathView(): SvgIconPathView | null {
    return SvgIconPathView.create();
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

  get pathView(): SvgIconPathView | null {
    const pathView = this.getChildView("path");
    return pathView instanceof SvgIconPathView ? pathView : null;
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "path" && childView instanceof SvgIconPathView) {
      this.onInsertPath(childView);
    }
  }

  protected onInsertPath(pathView: SvgIconPathView): void {
    // hook
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    if (this.iconColor.isAuto() && !this.iconColor.isInherited()) {
      this.iconColor.setAutoState(theme.inner(mood, Look.accentColor), transition);
    }
  }

  static readonly mountFlags: ViewFlags = SvgView.mountFlags | View.NeedsAnimate;
}
IconView.Svg = SvgIconView;
