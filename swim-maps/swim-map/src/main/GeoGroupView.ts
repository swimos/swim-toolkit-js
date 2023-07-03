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
import {Affinity} from "@swim/component";
import {Animator} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyR2Point} from "@swim/math";
import {R2Point} from "@swim/math";
import {R2Box} from "@swim/math";
import type {AnyR2Path} from "@swim/math";
import {R2Path} from "@swim/math";
import type {GeoShape} from "@swim/geo";
import type {AnyGeoPoint} from "@swim/geo";
import {GeoPoint} from "@swim/geo";
import {GeoCurve} from "@swim/geo";
import {GeoSpline} from "@swim/geo";
import {GeoPath} from "@swim/geo";
import {GeoBox} from "@swim/geo";
import {GeoGroup} from "@swim/geo";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import {ThemeAnimator} from "@swim/theme";
import {ViewSet} from "@swim/view";
import type {GeoViewInit} from "./GeoView";
import type {GeoViewObserver} from "./GeoView";
import {GeoView} from "./GeoView";
import type {GeoRippleOptions} from "./GeoRippleView";
import {GeoRippleView} from "./GeoRippleView";
import type {GeoPathView} from "./GeoPathView";
import {GeoLineView} from "./GeoLineView";
import {GeoAreaView} from "./GeoAreaView";

/** @public */
export interface GeoGroupViewInit extends GeoViewInit {
  geoGroup?: GeoGroup;
}

/** @public */
export interface GeoGroupViewObserver<V extends GeoGroupView = GeoGroupView> extends GeoViewObserver<V> {
  viewDidSetGeoGroup?(geoGroup: GeoGroup | null, view: V): void;

  viewDidSetFill?(fill: Color | null, view: V): void;

  viewDidSetStroke?(stoke: Color | null, view: V): void;

  viewDidSetStrokeWidth?(strokeWidth: Length | null, view: V): void;
}

/** @public */
export class GeoGroupView extends GeoView {
  constructor() {
    super();
    Object.defineProperty(this, "viewBounds", {
      value: R2Box.undefined(),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly observerType?: Class<GeoGroupViewObserver>;

  @Animator({
    valueType: GeoGroup,
    value: null,
    didSetValue(geoGroup: GeoGroup | null): void {
      if (geoGroup !== null) {
        this.owner.setGeoBounds(geoGroup.bounds);
        this.owner.geoCentroid.setState(geoGroup.bounds.center, Affinity.Intrinsic);
      } else {
        this.owner.setGeoBounds(GeoBox.undefined());
        this.owner.geoCentroid.setState(null, Affinity.Intrinsic);
      }
      this.owner.geoShapes.setGroup(geoGroup);
      if (this.mounted) {
        this.owner.projectGroup();
      }
      this.owner.callObservers("viewDidSetGeoGroup", geoGroup, this.owner);
    },
  })
  readonly geoGroup!: Animator<this, GeoGroup | null>;

  @Animator({valueType: R2Path, value: null})
  readonly viewPath!: Animator<this, R2Path | null, AnyR2Path | null>;

  @Animator({valueType: GeoPoint, value: null})
  readonly geoCentroid!: Animator<this, GeoPoint | null, AnyGeoPoint | null>;

  @Animator({valueType: R2Point, value: null})
  readonly viewCentroid!: Animator<this, R2Point | null, AnyR2Point | null>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    inherits: true,
    didSetValue(fill: Color | null): void {
      this.owner.callObservers("viewDidSetFill", fill, this.owner);
    },
  })
  readonly fill!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    valueType: Color,
    value: null,
    inherits: true,
    didSetValue(stroke: Color | null): void {
      this.owner.callObservers("viewDidSetStroke", stroke, this.owner);
    },
  })
  readonly stroke!: ThemeAnimator<this, Color | null, AnyColor | null>;

  @ThemeAnimator({
    valueType: Length,
    value: null,
    inherits: true,
    didSetValue(strokeWidth: Length | null): void {
      this.owner.callObservers("viewDidSetStrokeWidth", strokeWidth, this.owner);
    },
  })
  readonly strokeWidth!: ThemeAnimator<this, Length | null, AnyLength | null>;

  @ViewSet({
    viewType: GeoView,
    binds: true,
    setGroup(geoGroup: GeoGroup | null): void {
      this.setViews({});
      if (geoGroup === null) {
        return;
      }
      const geoShapes = geoGroup.shapes;
      for (let i = 0; i < geoShapes.length; i += 1) {
        const geoShape = geoShapes[i]!;
        const geoView = this.owner.createGeoShapeView(geoShape);
        if (geoView !== null) {
          this.addView(geoView);
        }
      }
    },
  })
  readonly geoShapes!: ViewSet<this, GeoView> & {
    setGroup(geoGroup: GeoGroup | null): void;
  };

  protected createGeoShapeView(geoShape: GeoShape): GeoView | null {
    if (geoShape instanceof GeoGroup) {
      return this.createGeoGroupView(geoShape);
    } else if (geoShape instanceof GeoPath) {
      return this.createGeoPathView(geoShape);
    } else if (geoShape instanceof GeoSpline) {
      return this.createGeoPathView(GeoPath.of(geoShape));
    } else if (geoShape instanceof GeoCurve) {
      return this.createGeoPathView(GeoPath.open(geoShape));
    }
    return null;
  }

  protected createGeoGroupView(geoGroup: GeoGroup): GeoView | null {
    const groupView = new (this.constructor as typeof GeoGroupView)();
    groupView.geoGroup.setState(geoGroup, Affinity.Intrinsic);
    return groupView;
  }

  protected createGeoPathView(geoPath: GeoPath): GeoView | null {
    let pathView: GeoPathView;
    if (geoPath.isClosed()) {
      pathView = new GeoAreaView();
    } else {
      pathView = new GeoLineView();
    }
    pathView.geoPath.setState(geoPath, Affinity.Intrinsic);
    return pathView;
  }

  protected override onProject(): void {
    super.onProject();
    this.projectGroup();
  }

  protected projectGroup(): void {
    const geoViewport = this.geoViewport.value;
    if (geoViewport === null) {
      return;
    }

    if (this.viewCentroid.hasAffinity(Affinity.Intrinsic)) {
      const geoCentroid = this.geoCentroid.value;
      const viewCentroid = geoCentroid !== null && geoCentroid.isDefined()
                         ? geoViewport.project(geoCentroid)
                         : null;
      this.viewCentroid.setState(viewCentroid, Affinity.Intrinsic);
    }

    (this as Mutable<GeoGroupView>).viewBounds = this.deriveViewBounds();

    this.cullGeoFrame(geoViewport.geoFrame);
  }

  protected override updateGeoBounds(): void {
    // nop
  }

  override get popoverFrame(): R2Box {
    const inversePageTransform = this.pageTransform.inverse();
    const viewCentroid = this.viewCentroid.value;
    if (viewCentroid === null || !viewCentroid.isDefined()) {
      return this.viewBounds.transform(inversePageTransform);
    }
    const px = inversePageTransform.transformX(viewCentroid.x, viewCentroid.y);
    const py = inversePageTransform.transformY(viewCentroid.x, viewCentroid.y);
    return new R2Box(px, py, px, py);
  }

  override readonly viewBounds!: R2Box;

  ripple(options?: GeoRippleOptions): GeoRippleView | null {
    return GeoRippleView.ripple(this, options);
  }

  override init(init: GeoGroupViewInit): void {
    super.init(init);
    if (init.geoGroup !== void 0) {
      this.geoGroup(init.geoGroup);
    }
  }
}
