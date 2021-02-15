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
import {Angle, Transform} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewAnimator} from "@swim/view";
import {HtmlView, SvgView} from "@swim/dom";

export class DisclosureButton extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initDisclosureButton();
  }

  protected initDisclosureButton(): void {
    this.addClass("disclosure-button");
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.flexGrow.setAutoState(1);
    this.flexShrink.setAutoState(0);
    this.cursor.setAutoState("pointer");

    const icon = this.append(SvgView, "icon");
    icon.width.setAutoState(24);
    icon.height.setAutoState(24);
    icon.viewBox.setAutoState("0 0 24 24");
    const arrow = icon.append("polygon", "arrow");
    arrow.points.setAutoState("0 4 -6 -2 -4.59 -3.41 0 1.17 4.59 -3.41 6 -2");
    arrow.transform.setAutoState(Transform.translate(12, 12).rotate(Angle.deg(0)));
  }

  get icon(): SvgView {
    return this.getChildView("icon") as SvgView;
  }

  get arrow(): SvgView {
    const icon = this.icon;
    return icon.getChildView("arrow") as SvgView;
  }

  @ViewAnimator({type: Number, inherit: true, updateFlags: View.NeedsAnimate})
  declare disclosurePhase: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  @ViewAnimator({type: Color, inherit: true, updateFlags: View.NeedsAnimate})
  declare collapsedColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Color, inherit: true, updateFlags: View.NeedsAnimate})
  declare expandedColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    this.collapsedColor.setAutoState(theme.dot(Look.color, mood), timing);
    this.expandedColor.setAutoState(theme.dot(Look.accentColor, mood), timing);
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    if (this.disclosurePhase.isUpdated() || this.collapsedColor.isUpdated() || this.expandedColor.isUpdated()) {
      const disclosurePhase = this.disclosurePhase.takeValue()!;
      const collapsedColor = this.collapsedColor.takeValue();
      const expandedColor = this.expandedColor.takeValue();
      if (collapsedColor !== void 0 && expandedColor !== void 0 && this.arrow.fill.isAuto()) {
        const colorInterpolator = collapsedColor.interpolateTo(expandedColor);
        this.arrow.fill.setAutoState(colorInterpolator(disclosurePhase));
      }
      const transform = Transform.translate(12, 12).rotate(Angle.deg(-180 * disclosurePhase));
      this.arrow.transform.setAutoState(transform);
    }
  }

  static readonly uncullFlags: ViewFlags = HtmlView.uncullFlags | View.NeedsAnimate;
}
