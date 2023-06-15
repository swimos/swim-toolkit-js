// Copyright 2015-2023 Swim.inc
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

import type {Class} from "@swim/util";
import type {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import {Graphics} from "@swim/graphics";
import {Icon} from "@swim/graphics";
import {FilledIcon} from "@swim/graphics";
import {IconGraphicsAnimator} from "@swim/graphics";
import {SvgIconView} from "@swim/graphics";
import type {ColViewObserver} from "./ColView";
import {ColView} from "./ColView";

/** @public */
export interface IconColViewObserver<V extends IconColView = IconColView> extends ColViewObserver<V> {
  viewDidSetGraphics?(graphics: Graphics | null, view: V): void;
}

/** @public */
export class IconColView extends ColView {
  protected override initCol(): void {
    super.initCol();
    this.addClass("col-icon");
  }

  override readonly observerType?: Class<IconColViewObserver>;

  @Animator({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly xAlign!: Animator<this, number>;

  @Animator({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly yAlign!: Animator<this, number>;

  @ThemeAnimator({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ThemeAnimator({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconHeight!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    updateFlags: View.NeedsLayout,
    didSetState(iconColor: Color | null): void {
      if (iconColor !== null) {
        const oldGraphics = this.owner.graphics.value;
        if (oldGraphics instanceof FilledIcon) {
          const newGraphics = oldGraphics.withFillColor(iconColor);
          const timing = this.timing !== null ? this.timing : false;
          this.owner.graphics.setState(newGraphics, timing, Affinity.Reflexive);
        }
      }
    },
  })
  readonly iconColor!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    extends: IconGraphicsAnimator,
    valueType: Graphics,
    value: null,
    updateFlags: View.NeedsLayout,
    didSetValue(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
      this.owner.callObservers("viewDidSetGraphics", newGraphics, this.owner);
    },
  })
  readonly graphics!: ThemeAnimator<this, Graphics | null>;

  @ViewRef({
    viewType: SvgIconView,
    viewKey: true,
    binds: true,
    init(): void {
      this.insertView();
    },
    initView(svgView: SvgIconView): void {
      svgView.setStyle("position", "absolute");
      svgView.xAlign.setInherits(true);
      svgView.yAlign.setInherits(true);
      svgView.iconWidth.setInherits(true);
      svgView.iconHeight.setInherits(true);
      svgView.iconColor.setInherits(true);
      svgView.graphics.setInherits(true);
    },
  })
  readonly svg!: ViewRef<this, SvgIconView>;

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (!this.graphics.derived) {
      const oldGraphics = this.graphics.value;
      if (oldGraphics instanceof Icon) {
        const newGraphics = oldGraphics.withTheme(theme, mood);
        this.graphics.setState(newGraphics, oldGraphics.isThemed() ? timing : false, Affinity.Reflexive);
      }
    }
  }

  protected override onResize(): void {
    super.onResize();
    this.requireUpdate(View.NeedsLayout);
  }

  protected override needsDisplay(displayFlags: ViewFlags): ViewFlags {
    if ((this.flags & View.NeedsLayout) === 0) {
      displayFlags &= ~View.NeedsLayout;
    }
    return displayFlags;
  }

  protected override onLayout(): void {
    super.onLayout();
    this.layoutIcon();
  }

  protected layoutIcon(): void {
    const svgView = this.svg.view;
    if (svgView !== null && (svgView.width.hasAffinity(Affinity.Intrinsic)
                          || svgView.height.hasAffinity(Affinity.Intrinsic)
                          || svgView.viewBox.hasAffinity(Affinity.Intrinsic))) {
      let viewWidth: Length | number | null = this.width.value;
      viewWidth = viewWidth instanceof Length ? viewWidth.pxValue() : this.node.offsetWidth;
      let viewHeight: Length | number | null = this.height.value;
      viewHeight = viewHeight instanceof Length ? viewHeight.pxValue() : this.node.offsetHeight;
      svgView.width.setState(viewWidth, Affinity.Intrinsic);
      svgView.height.setState(viewHeight, Affinity.Intrinsic);
      svgView.viewBox.setState("0 0 " + viewWidth + " " + viewHeight, Affinity.Intrinsic);
    }
  }
}
