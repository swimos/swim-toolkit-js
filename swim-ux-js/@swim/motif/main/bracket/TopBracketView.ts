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

export class TopBracketView extends BracketView {
  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("top-bracket");
    this.position.setAutoState("absolute");
    this.top.setAutoState(0);
    this.left.setAutoState(0);
    this.right.setAutoState(0);
  }

  protected initIcon(icon: SvgView): void {
    icon.setStyle("position", "absolute");
    icon.setStyle("left", "0");
    icon.setStyle("right", "0");
    super.initIcon(icon);
  }

  protected resizeBracket(): void {
    const armLength = this.armLength.getValue();
    const armOuterRadius = this.armRadius.getValue();
    const tipInnerRadius = this.tipRadius.getValue();
    const thickness = this.thickness.getValue();

    const bounds = this._node.getBoundingClientRect();
    const width = bounds.width;
    const center = width / 2;
    const height = armLength + armOuterRadius + tipInnerRadius;
    this.height.setAutoState(height);

    const icon = this.icon;
    icon.width.setAutoState(width);
    icon.height.setAutoState(height);
    icon.viewBox.setAutoState("0 0 " + width + " " + height);
    icon.setStyle("top", -tipInnerRadius + "px");

    const context = new PathContext();
    const halfThickness = thickness / 2;
    const armInnerRadius = Math.max(0, armOuterRadius - thickness);
    const armBase = height - armLength;
    const armOuter = armBase - armOuterRadius;
    const armInner = armBase - armInnerRadius;
    const tipOuterRadius = tipInnerRadius + thickness;
    const tipLeft = center - halfThickness;
    const tipRight = center + halfThickness;
    // Draw outer left arm.
    context.moveTo(0, height);
    if (armLength !== 0) {
      context.lineTo(0, armBase);
    }
    context.arcTo(0, armOuter, armOuterRadius, armOuter, armOuterRadius);
    context.lineTo(tipLeft - tipInnerRadius, armOuter);
    // Draw outer tip.
    context.arcTo(tipLeft, armOuter, tipLeft, 0, tipInnerRadius);
    context.lineTo(tipRight, 0);
    context.arcTo(tipRight, armOuter, tipRight + tipInnerRadius, armOuter, tipInnerRadius);
    // Draw outer right arm.
    context.lineTo(width - armOuterRadius, armOuter);
    context.arcTo(width, armOuter, width, armBase, armOuterRadius);
    if (armLength !== 0) {
      context.lineTo(width, height);
    }
    // Draw inner right arm.
    context.lineTo(width - thickness, height);
    if (armLength !== 0) {
      context.lineTo(width - thickness, armBase);
    }
    context.arcTo(width - thickness, armInner, width - thickness - armInnerRadius, armInner, armInnerRadius);
    context.lineTo(center + tipInnerRadius, armInner);
    // Draw inner tip.
    const theta = Math.asin((tipInnerRadius + halfThickness) / tipOuterRadius);
    context.arc(tipLeft + tipOuterRadius, armInner - tipOuterRadius, tipOuterRadius, Math.PI / 2, Math.PI / 2 + theta, false);
    context.arc(tipRight - tipOuterRadius, armInner - tipOuterRadius, tipOuterRadius, Math.PI / 2 - theta, Math.PI / 2, false);
    // Draw inner left arm.
    context.lineTo(thickness + armInnerRadius, armInner);
    context.arcTo(thickness, armInner, thickness, armBase, armInnerRadius);
    if (armLength !== 0) {
      context.lineTo(thickness, height);
    }
    context.closePath();
    this.path.d.setAutoState(context.toString());
  }
}
