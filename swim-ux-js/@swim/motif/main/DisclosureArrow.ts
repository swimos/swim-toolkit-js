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

import {Angle} from "@swim/angle";
import {AnyColor, Color, ColorInterpolator} from "@swim/color";
import {Transform} from "@swim/transform";
import {
  ViewContext,
  View,
  ViewScope,
  ViewAnimator,
  ViewNodeType,
  SvgView,
  HtmlView,
  HtmlViewController,
} from "@swim/view";
import {Theme} from "@swim/theme";

export class DisclosureArrow extends HtmlView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("disclosure-arrow");
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.flexGrow.setAutoState(1);
    this.flexShrink.setAutoState(0);
    this.cursor.setAutoState("pointer");

    const icon = this.append("svg", "icon");
    icon.width.setAutoState(24);
    icon.height.setAutoState(24);
    icon.viewBox.setAutoState("0 0 24 24");
    const polygon = icon.append("polygon", "polygon");
    polygon.points.setAutoState("0 4 -6 -2 -4.59 -3.41 0 1.17 4.59 -3.41 6 -2");
    polygon.transform.setAutoState(Transform.translate(12, 12).rotate(Angle.deg(-180)));
  }

  get viewController(): HtmlViewController<DisclosureArrow> | null {
    return this._viewController;
  }

  get icon(): SvgView {
    return this.getChildView("icon") as SvgView;
  }

  get polygon(): SvgView {
    const icon = this.icon;
    return icon.getChildView("polygon") as SvgView;
  }

  @ViewScope(Theme, {inherit: true})
  theme: ViewScope<this, Theme>;

  @ViewAnimator(Number, {inherit: true})
  disclosurePhase: ViewAnimator<this, number>; // 0 = collapsed; 1 = expanded

  @ViewAnimator(Color, {value: Color.transparent()})
  collapsedColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator(Color, {value: Color.transparent()})
  expandedColor: ViewAnimator<this, Color, AnyColor>;

  setTheme(theme: Theme): void {
    this.collapsedColor.setAutoState(theme.base.color);
    this.expandedColor.setAutoState(theme.primary.fillColor);
    this.requireUpdate(View.NeedsAnimate);
  }

  protected onMount(): void {
    super.onMount();
    this.requireUpdate(View.NeedsCompute);
  }

  protected onCompute(viewContext: ViewContext): void {
    super.onCompute(viewContext);
    const theme = this.theme.state;
    if (theme !== void 0) {
      this.setTheme(theme);
    }
  }

  protected onAnimate(viewContext: ViewContext): void {
    super.onAnimate(viewContext);
    const disclosurePhase = this.disclosurePhase.getValueOr(0);
    const collapsedColor = this.collapsedColor.getValue();
    const expandedColor = this.expandedColor.getValue();
    const colorInterpolator = ColorInterpolator.between(collapsedColor, expandedColor);
    this.polygon.fill.setAutoState(colorInterpolator.interpolate(disclosurePhase));
    const transform = Transform.translate(12, 12).rotate(Angle.deg(-180 * (1 - disclosurePhase)));
    this.polygon.transform.setAutoState(transform);
  }
}
