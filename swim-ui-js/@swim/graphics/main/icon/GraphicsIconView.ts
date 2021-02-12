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
import {AnyColor, Color} from "@swim/color";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, View, ViewAnimator} from "@swim/view";
import type {Graphics} from "../graphics/Graphics";
import type {GraphicsViewInit, GraphicsView} from "../graphics/GraphicsView";
import type {GraphicsViewController} from "../graphics/GraphicsViewController";
import {LayerView} from "../layer/LayerView";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";
import {IconViewInit, IconView} from "./IconView";
import {IconViewAnimator} from "./IconViewAnimator";

export interface GraphicsIconViewInit extends GraphicsViewInit, IconViewInit {
  viewController?: GraphicsViewController;
}

export class GraphicsIconView extends LayerView implements IconView {
  initView(init: GraphicsIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
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

  protected onRender(viewContext: ViewContextType<this>): void {
    super.onRender(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.isHidden() && !this.isCulled()) {
      const context = renderer.context;
      context.save();
      this.renderIcon(renderer, this.viewBounds);
      context.restore();
    }
  }

  protected renderIcon(renderer: CanvasRenderer, frame: BoxR2): void {
    const graphics = this.graphics.value;
    if (graphics !== void 0) {
      const context = renderer.context;
      context.beginPath();
      graphics.render(renderer, frame);
    }
  }

  get viewBounds(): BoxR2 {
    const viewFrame = this.viewFrame;
    const viewWidth = viewFrame.width;
    const viewHeight = viewFrame.height;
    const viewSize = Math.min(viewWidth, viewHeight);
    let iconWidth: Length | number | undefined = this.iconWidth.value;
    iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
    let iconHeight: Length | number | undefined = this.iconHeight.value;
    iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
    const x = viewFrame.x + (viewWidth - iconWidth) * this.xAlign.getValueOr(0.5);
    const y = viewFrame.y + (viewHeight - iconHeight) * this.yAlign.getValueOr(0.5);
    return new BoxR2(x, y, x + iconWidth, y + iconHeight);
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    let hit = super.doHitTest(x, y, viewContext);
    if (hit === null) {
      const renderer = viewContext.renderer;
      if (renderer instanceof CanvasRenderer) {
        const context = renderer.context;
        context.save();
        hit = this.hitTestIcon(x, y, renderer, this.viewBounds);
        context.restore();
      }
    }
    return hit;
  }

  protected hitTestIcon(x: number, y: number, renderer: CanvasRenderer, frame: BoxR2): GraphicsView | null {
    // TODO: icon hit test mode
    if (this.hitBounds.contains(x, y)) {
      return this;
    }
    //const graphics = this.graphics.value;
    //if (graphics !== void 0) {
    //  const context = renderer.context;
    //  graphics.render(renderer, frame);
    //  if (context.isPointInPath(x * renderer.pixelRatio, y * renderer.pixelRatio)) {
    //    return this;
    //  }
    //}
    return null;
  }

  static create(): GraphicsIconView {
    return new GraphicsIconView();
  }
}
