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
import type {Transition} from "@swim/animation";
import {AnyColor, Color} from "@swim/color";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewAnimator} from "@swim/view";
import type {Graphics} from "../graphics/Graphics";
import type {GraphicsViewInit, GraphicsView} from "../graphics/GraphicsView";
import type {GraphicsViewController} from "../graphics/GraphicsViewController";
import {LayerView} from "../layer/LayerView";
import {CanvasRenderer} from "../canvas/CanvasRenderer";
import {IconViewInit, IconView} from "./IconView";

export interface GraphicsIconViewInit extends GraphicsViewInit, IconViewInit {
  viewController?: GraphicsViewController;
}

export class GraphicsIconView extends LayerView implements IconView {
  initView(init: GraphicsIconViewInit): void {
    super.initView(init);
    IconView.initView(this, init);
  }

  @ViewAnimator({type: Number})
  declare xAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Number})
  declare yAlign: ViewAnimator<this, number | undefined>;

  @ViewAnimator({type: Length})
  declare iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Length})
  declare iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Color})
  declare iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Object})
  declare graphics: ViewAnimator<this, Graphics | undefined>;

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);
    if (this.iconColor.isAuto() && !this.iconColor.isInherited()) {
      this.iconColor.setAutoState(theme.inner(mood, Look.accentColor), transition);
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
      const iconColor = this.iconColor.value;
      if (iconColor !== void 0) {
        context.fillStyle = iconColor.toString();
      }
      graphics.render(renderer, frame);
      if (iconColor !== void 0) {
        context.fill();
      }
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
IconView.Graphics = GraphicsIconView;
