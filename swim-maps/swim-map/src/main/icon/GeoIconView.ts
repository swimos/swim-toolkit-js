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

import type {Mutable, Class, Timing} from "@swim/util";
import {Affinity, AnimatorDef} from "@swim/component";
import {AnyLength, Length, AnyR2Point, R2Point, R2Segment, R2Box} from "@swim/math";
import {AnyGeoPoint, GeoPoint, GeoBox} from "@swim/geo";
import {AnyColor, Color} from "@swim/style";
import {MoodVector, ThemeMatrix, ThemeAnimatorDef} from "@swim/theme";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import {
  Sprite,
  Graphics,
  GraphicsView,
  Icon,
  FilledIcon,
  IconViewInit,
  IconView,
  IconGraphicsAnimator,
  CanvasRenderer,
} from "@swim/graphics";
import {GeoViewInit, GeoView} from "../geo/GeoView";
import {GeoRippleOptions, GeoRippleView} from "../effect/GeoRippleView";
import type {GeoIconViewObserver} from "./GeoIconViewObserver";

/** @public */
export type AnyGeoIconView = GeoIconView | GeoIconViewInit;

/** @public */
export interface GeoIconViewInit extends GeoViewInit, IconViewInit {
  geoCenter?: AnyGeoPoint;
  viewCenter?: AnyR2Point;
}

/** @public */
export class GeoIconView extends GeoView implements IconView {
  constructor() {
    super();
    this.sprite = null;
    Object.defineProperty(this, "viewBounds", {
      value: R2Box.undefined(),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  override readonly observerType?: Class<GeoIconViewObserver>;

  /** @internal */
  sprite: Sprite | null;

  @AnimatorDef<GeoIconView["geoCenter"]>({
    valueType: GeoPoint,
    value: null,
    didSetState(newGeoCenter: GeoPoint | null, oldGeoCenter: GeoPoint | null): void {
      this.owner.projectGeoCenter(newGeoCenter);
    },
    didSetValue(newGeoCenter: GeoPoint | null, oldGeoCenter: GeoPoint | null): void {
      this.owner.setGeoBounds(newGeoCenter !== null ? newGeoCenter.bounds : GeoBox.undefined());
      if (this.mounted) {
        this.owner.projectIcon(this.owner.viewContext);
      }
      this.owner.callObservers("viewDidSetGeoCenter", newGeoCenter, this.owner);
    },
  })
  readonly geoCenter!: AnimatorDef<this, {value: GeoPoint | null, valueInit: AnyGeoPoint | null}>;

  @AnimatorDef({valueType: R2Point, value: R2Point.undefined(), updateFlags: View.NeedsComposite})
  readonly viewCenter!: AnimatorDef<this, {value: R2Point | null, valueInit: AnyR2Point | null}>;

  @AnimatorDef<GeoIconView["xAlign"]>({
    valueType: Number,
    value: 0.5,
    updateFlags: View.NeedsProject | View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
  })
  readonly xAlign!: AnimatorDef<this, {value: number}>;

  @AnimatorDef<GeoIconView["yAlign"]>({
    valueType: Number,
    value: 0.5,
    updateFlags: View.NeedsProject | View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
  })
  readonly yAlign!: AnimatorDef<this, {value: number}>;

  @ThemeAnimatorDef<GeoIconView["iconWidth"]>({
    valueType: Length,
    value: null,
    updateFlags: View.NeedsProject | View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
  })
  readonly iconWidth!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef<GeoIconView["iconHeight"]>({
    valueType: Length,
    value: null,
    updateFlags: View.NeedsProject | View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
  })
  readonly iconHeight!: ThemeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeAnimatorDef<GeoIconView["iconColor"]>({
    valueType: Color,
    value: null,
    updateFlags: View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
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
  readonly iconColor!: ThemeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @ThemeAnimatorDef<GeoIconView["graphics"]>({
    extends: IconGraphicsAnimator,
    valueType: Graphics,
    value: null,
    updateFlags: View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
    didSetValue(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
      this.owner.callObservers("viewDidSetGraphics", newGraphics, this.owner);
    },
  })
  readonly graphics!: ThemeAnimatorDef<this, {value: Graphics | null}>;

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

  protected override onProject(viewContext: ViewContextType<this>): void {
    super.onProject(viewContext);
    this.projectIcon(viewContext);
  }

  protected projectGeoCenter(geoCenter: GeoPoint | null): void {
    if (this.mounted) {
      const viewContext = this.viewContext as ViewContextType<this>;
      const viewCenter = geoCenter !== null && geoCenter.isDefined()
                       ? viewContext.geoViewport.project(geoCenter)
                       : null;
      this.viewCenter.setInterpolatedValue(this.viewCenter.value, viewCenter);
      this.projectIcon(viewContext);
    }
  }

  protected projectIcon(viewContext: ViewContextType<this>): void {
    if (Affinity.Intrinsic >= (this.viewCenter.flags & Affinity.Mask)) { // this.viewCenter.hasAffinity(Affinity.Intrinsic)
      const geoCenter = this.geoCenter.value;
      const viewCenter = geoCenter !== null && geoCenter.isDefined()
                       ? viewContext.geoViewport.project(geoCenter)
                       : null;
      (this.viewCenter as Mutable<typeof this.viewCenter>).value = viewCenter; // this.viewCenter.setValue(viewCenter, Affinity.Intrinsic)
    }
    const viewFrame = viewContext.viewFrame;
    (this as Mutable<GeoIconView>).viewBounds = this.deriveViewBounds(viewFrame);
    const p0 = this.viewCenter.value;
    const p1 = this.viewCenter.state;
    if (p0 !== null && p1 !== null && (
        viewFrame.intersectsBox(this.viewBounds) ||
        viewFrame.intersectsSegment(new R2Segment(p0.x, p0.y, p1.x, p1.y)))) {
      this.setCulled(false);
    } else {
      this.setCulled(true);
    }
  }

  protected override onRasterize(viewContext: ViewContextType<this>): void {
    super.onRasterize(viewContext);
    if (!this.hidden && !this.culled) {
      this.rasterizeIcon(this.viewBounds);
    }
  }

  protected rasterizeIcon(frame: R2Box): void {
    let sprite = this.sprite;
    const graphics = this.graphics.value;
    if (graphics !== null && frame.isDefined()) {
      const width = frame.width;
      const height = frame.height;
      if (sprite !== null && (sprite.width < width || sprite.height < height ||
                             (width < sprite.width / 2 && height < sprite.height / 2))) {
        this.sprite = null;
        sprite.release();
        sprite = null;
      }
      if (sprite === null) {
        sprite = this.spriteProvider.service!.acquireSprite(width, height);
        this.sprite = sprite;
      }

      const renderer = sprite.getRenderer();
      const context = renderer.context;
      context.clearRect(0, 0, sprite.width, sprite.height);

      context.beginPath();
      graphics.render(renderer, new R2Box(0, 0, width, height));
    } else if (sprite !== null) {
      this.sprite = null;
      sprite.release();
    }
  }

  protected override onComposite(viewContext: ViewContextType<this>): void {
    super.onComposite(viewContext);
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer && !this.hidden && !this.culled) {
      this.compositeIcon(renderer, this.viewBounds);
    }
  }

  protected compositeIcon(renderer: CanvasRenderer, frame: R2Box): void {
    const sprite = this.sprite;
    if (sprite !== null) {
      sprite.draw(renderer.context, frame);
    }
  }

  protected override renderGeoBounds(viewContext: ViewContextType<this>, outlineColor: Color, outlineWidth: number): void {
    // nop
  }

  protected override updateGeoBounds(): void {
    // nop
  }

  override readonly viewBounds!: R2Box;

  override deriveViewBounds(viewFrame?: R2Box): R2Box {
    const viewCenter = this.viewCenter.value;
    if (viewCenter !== null && viewCenter.isDefined()) {
      if (viewFrame === void 0) {
        viewFrame = this.viewContext.viewFrame;
      }
      const viewSize = Math.min(viewFrame.width, viewFrame.height);
      let iconWidth: Length | number | null = this.iconWidth.value;
      iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
      let iconHeight: Length | number | null = this.iconHeight.value;
      iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
      const x = viewCenter.x - iconWidth * this.xAlign.value;
      const y = viewCenter.y - iconHeight * this.yAlign.value;
      return new R2Box(x, y, x + iconWidth, y + iconHeight);
    } else {
      return R2Box.undefined();
    }
  }

  override get popoverFrame(): R2Box {
    const viewCenter = this.viewCenter.value;
    if (viewCenter !== null && viewCenter.isDefined()) {
      const viewFrame = this.viewContext.viewFrame;
      const viewSize = Math.min(viewFrame.width, viewFrame.height);
      const inversePageTransform = this.pageTransform.inverse();
      const px = inversePageTransform.transformX(viewCenter.x, viewCenter.y);
      const py = inversePageTransform.transformY(viewCenter.x, viewCenter.y);
      let iconWidth: Length | number | null = this.iconWidth.value;
      iconWidth = iconWidth instanceof Length ? iconWidth.pxValue(viewSize) : viewSize;
      let iconHeight: Length | number | null = this.iconHeight.value;
      iconHeight = iconHeight instanceof Length ? iconHeight.pxValue(viewSize) : viewSize;
      const x = px - iconWidth * this.xAlign.getValue();
      const y = py - iconHeight * this.yAlign.getValue();
      return new R2Box(x, y, x + iconWidth, y + iconHeight);
    } else {
      return this.pageBounds;
    }
  }

  protected override hitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    const renderer = viewContext.renderer;
    if (renderer instanceof CanvasRenderer) {
      return this.hitTestIcon(x, y, renderer, this.viewBounds);
    }
    return null;
  }

  protected hitTestIcon(x: number, y: number, renderer: CanvasRenderer, frame: R2Box): GraphicsView | null {
    // TODO: icon hit test mode
    if (this.hitBounds.contains(x, y)) {
      return this;
    }
    //const graphics = this.graphics.value;
    //if (graphics !== null) {
    //  const context = renderer.context;
    //  context.beginPath();
    //  graphics.render(renderer, frame);
    //  if (context.isPointInPath(x * renderer.pixelRatio, y * renderer.pixelRatio)) {
    //    return this;
    //  }
    //}
    return null;
  }

  ripple(options?: GeoRippleOptions): GeoRippleView | null {
    return GeoRippleView.ripple(this, options);
  }

  protected override onUnmount(): void {
    super.onUnmount();
    const sprite = this.sprite;
    if (sprite !== null) {
      this.sprite = null;
      sprite.release();
    }
  }

  override init(init: GeoIconViewInit): void {
    super.init(init);
    IconView.init(this, init);
    if (init.geoCenter !== void 0) {
      this.geoCenter(init.geoCenter);
    }
    if (init.viewCenter !== void 0) {
      this.viewCenter(init.viewCenter);
    }
  }

  static override readonly MountFlags: ViewFlags = GeoView.MountFlags | View.NeedsRasterize;
  static override readonly UncullFlags: ViewFlags = GeoView.UncullFlags | View.NeedsRasterize;
}
