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

import {AnyColor, Color} from "@swim/color";
import {ViewContext, ViewAnimator, ViewNodeType, SvgView, HtmlView} from "@swim/view";

export abstract class HandlebarView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initHandlebar();
    this.iconColor.onUpdate = this.onUpdateIconColor.bind(this);
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("handlebar");
    this.pointerEvents.setAutoState("none");
  }

  protected initHandlebar(): void {
    const icon = this.append("svg", "icon");
    this.initIcon(icon);
  }

  protected initIcon(icon: SvgView): void {
    const path = icon.append("path", "path");
    this.initPath(path);
  }

  protected initPath(path: SvgView): void {
    path.stroke.setAutoState("none");
  }

  get icon(): SvgView {
    return this.getChildView("icon") as SvgView;
  }

  get path(): SvgView {
    const icon = this.icon;
    return icon.getChildView("path") as SvgView;
  }

  @ViewAnimator(Number, {value: 2})
  armLength: ViewAnimator<this, number>;

  @ViewAnimator(Number, {value: 8})
  armRadius: ViewAnimator<this, number>;

  @ViewAnimator(Number, {value: 3})
  tipRadius: ViewAnimator<this, number>;

  @ViewAnimator(Number, {value: 2})
  thickness: ViewAnimator<this, number>;

  @ViewAnimator(Color)
  iconColor: ViewAnimator<this, Color, AnyColor>;

  protected onUpdateIconColor(iconColor: Color | undefined): void {
    this.path.fill.setAutoState(iconColor);
  }

  protected onResize(viewContext: ViewContext): void {
    super.onResize(viewContext);
    this.resizeHandlebar();
  }

  protected abstract resizeHandlebar(): void;
}
