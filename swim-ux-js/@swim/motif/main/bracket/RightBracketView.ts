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

import {PathContext} from "@swim/render";
import {ViewNodeType, SvgView} from "@swim/view";
import {BracketView} from "./BracketView";

export class RightBracketView extends BracketView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("right-bracket");
    this.position.setAutoState("absolute");
    this.right.setAutoState(0);
    this.top.setAutoState(0);
    this.bottom.setAutoState(0);
  }

  protected initIcon(icon: SvgView): void {
    icon.setStyle("position", "absolute");
    icon.setStyle("top", "0");
    icon.setStyle("bottom", "0");
    super.initIcon(icon);
  }

  protected resizeBracket(): void {
    const armLength = this.armLength.getValue();
    const armOuterRadius = this.armRadius.getValue();
    const tipInnerRadius = this.tipRadius.getValue();
    const thickness = this.thickness.getValue();

    const bounds = this._node.getBoundingClientRect();
    const height = bounds.height;
    const center = height / 2;
    const width = armLength + armOuterRadius + tipInnerRadius;
    this.width.setAutoState(width);

    const icon = this.icon;
    icon.width.setAutoState(width);
    icon.height.setAutoState(height);
    icon.viewBox.setAutoState("0 0 " + width + " " + height);
    icon.setStyle("right", -tipInnerRadius + "px");

    const context = new PathContext();
    const halfThickness = thickness / 2;
    const armInnerRadius = Math.max(0, armOuterRadius - thickness);
    const armBase = armLength;
    const armOuter = armBase + armOuterRadius;
    const armInner = armBase + armInnerRadius;
    const tipOuterRadius = tipInnerRadius + thickness;
    const tipTop = center - halfThickness;
    const tipBottom = center + halfThickness;
    // Draw outer top arm.
    context.moveTo(0, 0);
    if (armLength !== 0) {
      context.lineTo(armBase, 0);
    }
    context.arcTo(armOuter, 0, armOuter, armOuterRadius, armOuterRadius);
    context.lineTo(armOuter, tipTop - tipInnerRadius);
    // Draw outer tip.
    context.arcTo(armOuter, tipTop, width, tipTop, tipInnerRadius);
    context.lineTo(width, tipBottom);
    context.arcTo(armOuter, tipBottom, armOuter, tipBottom + tipInnerRadius, tipInnerRadius);
    // Draw outer bottom arm.
    context.lineTo(armOuter, height - armOuterRadius);
    context.arcTo(armOuter, height, armBase, height, armOuterRadius);
    if (armLength !== 0) {
      context.lineTo(0, height);
    }
    // Draw inner bottom arm.
    context.lineTo(0, height - thickness);
    if (armLength !== 0) {
      context.lineTo(armBase, height - thickness);
    }
    context.arcTo(armInner, height - thickness, armInner, height - thickness - armInnerRadius, armInnerRadius);
    context.lineTo(armInner, center + tipInnerRadius);
    // Draw inner tip.
    const theta = Math.asin((tipInnerRadius + halfThickness) / tipOuterRadius);
    context.arc(armInner + tipOuterRadius, tipTop + tipOuterRadius, tipOuterRadius, -Math.PI, -Math.PI + theta, false);
    context.arc(armInner + tipOuterRadius, tipBottom - tipOuterRadius, tipOuterRadius, -Math.PI - theta, -Math.PI, false);
    // Draw inner top arm.
    context.lineTo(armInner, thickness + armInnerRadius);
    context.arcTo(armInner, thickness, armBase, thickness, armInnerRadius);
    if (armLength !== 0) {
      context.lineTo(0, thickness);
    }
    context.closePath();
    this.path.d.setAutoState(context.toString());
  }
}
