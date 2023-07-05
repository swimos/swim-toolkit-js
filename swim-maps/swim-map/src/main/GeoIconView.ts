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

import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import type {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyR2Point} from "@swim/math";
import {R2Point} from "@swim/math";
import {R2Segment} from "@swim/math";
import {R2Box} from "@swim/math";
import type {AnyGeoPoint} from "@swim/geo";
import {GeoPoint} from "@swim/geo";
import {GeoBox} from "@swim/geo";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ThemeAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import type {PositionGestureInput} from "@swim/view";
import {PositionGesture} from "@swim/view";
import type {Sprite} from "@swim/graphics";
import {Graphics} from "@swim/graphics";
import type {GraphicsView} from "@swim/graphics";
import type {AnyIconLayout} from "@swim/graphics";
import {IconLayout} from "@swim/graphics";
import {Icon} from "@swim/graphics";
import {FilledIcon} from "@swim/graphics";
import type {IconView} from "@swim/graphics";
import {IconGraphicsAnimator} from "@swim/graphics";
import {CanvasRenderer} from "@swim/graphics";
import type {AnyHyperlink} from "@swim/controller";
import {Hyperlink} from "@swim/controller";
import type {GeoViewObserver} from "./GeoView";
import {GeoView} from "./GeoView";
import type {GeoRippleOptions} from "./GeoRippleView";
import {GeoRippleView} from "./GeoRippleView";

/** @public */
export interface GeoIconViewObserver<V extends GeoIconView = GeoIconView> extends GeoViewObserver<V> {
  viewDidSetGeoCenter?(geoCenter: GeoPoint | null, view: V): void;

  viewDidSetGraphics?(graphics: Graphics | null, view: V): void;

  viewDidEnter?(view: V): void;

  viewDidLeave?(view: V): void;

  viewDidPress?(input: PositionGestureInput, event: Event | null, view: V): void;

  viewDidLongPress?(input: PositionGestureInput, view: V): void;
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

  declare readonly observerType?: Class<GeoIconViewObserver>;

  /** @internal */
  sprite: Sprite | null;

  @Animator({
    valueType: GeoPoint,
    value: null,
    didSetState(newGeoCenter: GeoPoint | null, oldGeoCenter: GeoPoint | null): void {
      this.owner.projectGeoCenter(newGeoCenter);
    },
    didSetValue(newGeoCenter: GeoPoint | null, oldGeoCenter: GeoPoint | null): void {
      this.owner.setGeoBounds(newGeoCenter !== null ? newGeoCenter.bounds : GeoBox.undefined());
      if (this.mounted) {
        this.owner.projectIcon();
      }
      this.owner.callObservers("viewDidSetGeoCenter", newGeoCenter, this.owner);
    },
  })
  readonly geoCenter!: Animator<this, GeoPoint | null, AnyGeoPoint | null>;

  @Animator({valueType: R2Point, value: R2Point.undefined(), updateFlags: View.NeedsComposite})
  readonly viewCenter!: Animator<this, R2Point | null, AnyR2Point | null>;

  /** @override */
  @Animator({
    valueType: IconLayout,
    value: null,
    updateFlags: View.NeedsProject | View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
  })
  readonly iconLayout!: Animator<this, IconLayout | null, AnyIconLayout | null>;

  /** @override */
  @ThemeAnimator({
    valueType: Color,
    value: null,
    updateFlags: View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
    didSetState(iconColor: Color | null): void {
      const oldGraphics = this.owner.graphics.value;
      if (oldGraphics instanceof FilledIcon) {
        const newGraphics = oldGraphics.withFillColor(iconColor);
        const timing = this.timing !== null ? this.timing : false;
        this.owner.graphics.setState(newGraphics, timing, Affinity.Reflexive);
      }
    },
  })
  get iconColor(): ThemeAnimator<this, Color | null, AnyColor | null> {
    return ThemeAnimator.dummy();
  }

  /** @override */
  @ThemeAnimator({
    extends: IconGraphicsAnimator,
    valueType: Graphics,
    value: null,
    updateFlags: View.NeedsRender | View.NeedsRasterize | View.NeedsComposite,
    didSetValue(newGraphics: Graphics | null, oldGraphics: Graphics | null): void {
      this.owner.callObservers("viewDidSetGraphics", newGraphics, this.owner);
    },
  })
  readonly graphics!: ThemeAnimator<this, Graphics | null>;

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (this.graphics.derived) {
      return;
    }
    const oldGraphics = this.graphics.value;
    if (!(oldGraphics instanceof Icon)) {
      return;
    }
    const newGraphics = oldGraphics.withTheme(theme, mood);
    this.graphics.setState(newGraphics, oldGraphics.isThemed() ? timing : false, Affinity.Reflexive);
  }

  protected override onProject(): void {
    super.onProject();
    this.projectIcon();
  }

  protected projectGeoCenter(geoCenter: GeoPoint | null): void {
    const geoViewport = this.geoViewport.value;
    if (!this.mounted || geoViewport === null) {
      return;
    }
    const viewCenter = geoCenter !== null && geoCenter.isDefined()
                     ? geoViewport.project(geoCenter)
                     : null;
    this.viewCenter.setInterpolatedValue(this.viewCenter.value, viewCenter);
    this.projectIcon();
  }

  protected projectIcon(): void {
    const geoViewport = this.geoViewport.value;
    if (geoViewport === null) {
      return;
    }
    if (Affinity.Intrinsic >= (this.viewCenter.flags & Affinity.Mask)) { // this.viewCenter.hasAffinity(Affinity.Intrinsic)
      const geoCenter = this.geoCenter.value;
      const viewCenter = geoCenter !== null && geoCenter.isDefined()
                       ? geoViewport.project(geoCenter)
                       : null;
      (this.viewCenter as Mutable<typeof this.viewCenter>).value = viewCenter; // this.viewCenter.setValue(viewCenter, Affinity.Intrinsic)
    }
    const viewFrame = this.viewFrame;
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

  protected override onRasterize(): void {
    super.onRasterize();
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
        sprite = this.sprites.getService().acquireSprite(width, height);
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

  protected override onComposite(): void {
    super.onComposite();
    const renderer = this.renderer.value;
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

  protected override renderGeoBounds(outlineColor: Color, outlineWidth: number): void {
    // nop
  }

  @Property({valueType: Hyperlink, value: null})
  get hyperlink(): Property<this, Hyperlink | null, AnyHyperlink | null> {
    return Property.dummy();
  }

  @PositionGesture({
    bindsOwner: true,
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      const dx = input.x - input.x0;
      const dy = input.y - input.y0;
      if (dx * dx + dy * dy > 4 * 4) {
        this.cancelPress(input, event);
      }
    },
    didStartHovering(): void {
      this.owner.callObservers("viewDidEnter", this.owner);
    },
    didStopHovering(): void {
      this.owner.callObservers("viewDidLeave", this.owner);
    },
    didPress(input: PositionGestureInput, event: Event | null): void {
      if (input.defaultPrevented) {
        return;
      }
      this.owner.didPress(input, event);
    },
    didLongPress(input: PositionGestureInput): void {
      if (input.defaultPrevented) {
        return;
      }
      this.owner.didLongPress(input);
    },
  })
  readonly gesture!: PositionGesture<this, GeoIconView>;

  didPress(input: PositionGestureInput, event: Event | null): void {
    if (input.defaultPrevented) {
      return;
    }
    this.callObservers("viewDidPress", input, event, this);
    const hyperlink = this.hyperlink.value;
    if (hyperlink !== null && !input.defaultPrevented) {
      input.preventDefault();
      hyperlink.activate(event);
    }
  }

  didLongPress(input: PositionGestureInput): void {
    if (input.defaultPrevented) {
      return;
    }
    this.callObservers("viewDidLongPress", input, this);
  }

  protected override updateGeoBounds(): void {
    // nop
  }

  override readonly viewBounds!: R2Box;

  override deriveViewBounds(viewFrame?: R2Box): R2Box {
    const viewCenter = this.viewCenter.value;
    if (viewCenter === null || !viewCenter.isDefined()) {
      return R2Box.undefined();
    } else if (viewFrame === void 0) {
      viewFrame = this.viewFrame;
    }
    const viewSize = Math.min(viewFrame.width, viewFrame.height);
    const iconLayout = this.iconLayout.value;
    const iconWidth = iconLayout !== null ? iconLayout.width.pxValue(viewSize) : viewSize;
    const iconHeight = iconLayout !== null ? iconLayout.height.pxValue(viewSize) : viewSize;
    const xAlign = iconLayout !== null ? iconLayout.xAlign : 0.5;
    const yAlign = iconLayout !== null ? iconLayout.yAlign : 0.5;
    const x = viewCenter.x - iconWidth * xAlign;
    const y = viewCenter.y - iconHeight * yAlign;
    return new R2Box(x, y, x + iconWidth, y + iconHeight);
  }

  override get popoverFrame(): R2Box {
    const viewCenter = this.viewCenter.value;
    if (viewCenter === null || !viewCenter.isDefined()) {
      return this.pageBounds;
    }
    const viewFrame = this.viewFrame;
    const viewSize = Math.min(viewFrame.width, viewFrame.height);
    const iconLayout = this.iconLayout.value;
    const iconWidth = iconLayout !== null ? iconLayout.width.pxValue(viewSize) : viewSize;
    const iconHeight = iconLayout !== null ? iconLayout.height.pxValue(viewSize) : viewSize;
    const xAlign = iconLayout !== null ? iconLayout.xAlign : 0.5;
    const yAlign = iconLayout !== null ? iconLayout.yAlign : 0.5;
    const inversePageTransform = this.pageTransform.inverse();
    const px = inversePageTransform.transformX(viewCenter.x, viewCenter.y);
    const py = inversePageTransform.transformY(viewCenter.x, viewCenter.y);
    const x = px - iconWidth * xAlign;
    const y = py - iconHeight * yAlign;
    return new R2Box(x, y, x + iconWidth, y + iconHeight);
  }

  protected override hitTest(x: number, y: number): GraphicsView | null {
    const renderer = this.renderer.value;
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
    //if (graphics === null) {
    //  return null;
    //}
    //const context = renderer.context;
    //context.beginPath();
    //graphics.render(renderer, frame);
    //if (context.isPointInPath(x * renderer.pixelRatio, y * renderer.pixelRatio)) {
    //  return this;
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

  static override readonly MountFlags: ViewFlags = GeoView.MountFlags | View.NeedsRasterize;
  static override readonly UncullFlags: ViewFlags = GeoView.UncullFlags | View.NeedsRasterize;
}
