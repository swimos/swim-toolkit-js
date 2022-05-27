// Copyright 2015-2022 Swim.inc
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

import type {Class, Timing} from "@swim/util";
import {Affinity, AnimatorDef} from "@swim/component";
import {AnyLength, Length} from "@swim/math";
import {AnyColor, Color} from "@swim/style";
import {MoodVector, ThemeMatrix, ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import {Graphics, Icon, FilledIcon, IconGraphicsAnimator, SvgIconView} from "@swim/graphics";
import {CellView} from "./CellView";
import type {IconCellViewObserver} from "./IconCellViewObserver";

/** @public */
export class IconCellView extends CellView {
  constructor(node: HTMLElement) {
    super(node);
    this.initSvg();
  }

  protected override initCell(): void {
    super.initCell();
    this.addClass("cell-icon");
  }

  override readonly observerType?: Class<IconCellViewObserver>;

  protected initSvg(): void {
    const svgView = this.createSvgView();
    if (svgView !== null) {
      this.setChild("svg", svgView);
    }
  }

  protected createSvgView(): SvgIconView | null {
    return SvgIconView.create();
  }

  get svgView(): SvgIconView | null {
    const svgView = this.getChild("svg");
    return svgView instanceof SvgIconView ? svgView : null;
  }

  @AnimatorDef({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly xAlign!: AnimatorDef<this, {value: number}>;

  @AnimatorDef({valueType: Number, value: 0.5, updateFlags: View.NeedsLayout})
  readonly yAlign!: AnimatorDef<this, {value: number}>;

  @ThemeAnimatorDef({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconWidth!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef({valueType: Length, value: null, updateFlags: View.NeedsLayout})
  readonly iconHeight!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef<IconCellView["iconColor"]>({
    valueType: Color,
    value: null,
    updateFlags: View.NeedsLayout,
    didSetValue(newIconColor: Color | null, oldIconColor: Color | null): void {
      if (newIconColor !== null) {
        const oldGraphics = this.owner.graphics.value;
        if (oldGraphics instanceof FilledIcon) {
          const newGraphics = oldGraphics.withFillColor(newIconColor);
          this.owner.graphics.setState(newGraphics, Affinity.Reflexive);
        }
      }
    },
  })
  readonly iconColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef<IconCellView["graphics"]>({
    extends: IconGraphicsAnimator,
    valueType: Graphics,
    value: null,
    updateFlags: View.NeedsLayout,
    didSetValue(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
      this.owner.callObservers("viewDidSetGraphics", newGraphics, this.owner);
    },
  })
  readonly graphics!: ThemeAnimatorDef<this, {value: Graphics | null}>;

  protected override onInsertChild(child: View, target: View | null): void {
    super.onInsertChild(child, target);
    if (child.key === "svg" && child instanceof SvgIconView) {
      this.onInsertSvg(child);
    }
  }

  protected onInsertSvg(svgView: SvgIconView): void {
    svgView.xAlign.setInherits(true);
    svgView.yAlign.setInherits(true);
    svgView.iconWidth.setInherits(true);
    svgView.iconHeight.setInherits(true);
    svgView.iconColor.setInherits(true);
    svgView.graphics.setInherits(true);
    svgView.setStyle("position", "absolute");
  }

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

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.requireUpdate(View.NeedsLayout);
  }

  protected override needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.flags & View.NeedsLayout) === 0) {
      displayFlags &= ~View.NeedsLayout;
    }
    return displayFlags;
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutIcon();
  }

  protected layoutIcon(): void {
    const svgView = this.svgView;
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
