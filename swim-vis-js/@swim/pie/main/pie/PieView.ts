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

import {AnyLength, Length, AnyAngle, Angle, AnyPointR2, PointR2, BoxR2} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {AnyFont, Font} from "@swim/style";
import {ViewContextType, View, ViewAnimator, ViewFastener} from "@swim/view";
import {
  GraphicsViewInit,
  GraphicsView,
  GraphicsViewController,
  LayerView,
  TypesetView,
  AnyTextRunView,
  TextRunView,
} from "@swim/graphics";
import {AnySliceView, SliceView} from "../slice/SliceView";
import type {PieViewObserver} from "./PieViewObserver";

export type AnyPieView = PieView | PieViewInit;

export interface PieViewInit extends GraphicsViewInit {
  limit?: number;
  center?: AnyPointR2;
  baseAngle?: AnyAngle;
  innerRadius?: AnyLength;
  outerRadius?: AnyLength;
  padAngle?: AnyAngle;
  padRadius?: AnyLength | null;
  cornerRadius?: AnyLength;
  labelRadius?: AnyLength;
  sliceColor?: AnyColor;
  tickAlign?: number;
  tickRadius?: AnyLength;
  tickLength?: AnyLength;
  tickWidth?: AnyLength;
  tickPadding?: AnyLength;
  tickColor?: AnyColor;
  font?: AnyFont;
  textColor?: AnyColor;
  title?: GraphicsView | string;
  slices?: AnySliceView[];
}

export class PieView extends LayerView {
  constructor() {
    super();
    Object.defineProperty(this, "sliceFasteners", {
      value: [],
      enumerable: true,
    });
  }

  initView(init: PieViewInit): void {
    super.initView(init);
    if (init.limit !== void 0) {
      this.limit(init.limit);
    }
    if (init.center !== void 0) {
      this.center(init.center);
    }
    if (init.baseAngle !== void 0) {
      this.baseAngle(init.baseAngle);
    }
    if (init.innerRadius !== void 0) {
      this.innerRadius(init.innerRadius);
    }
    if (init.outerRadius !== void 0) {
      this.outerRadius(init.outerRadius);
    }
    if (init.padAngle !== void 0) {
      this.padAngle(init.padAngle);
    }
    if (init.padRadius !== void 0) {
      this.padRadius(init.padRadius);
    }
    if (init.cornerRadius !== void 0) {
      this.cornerRadius(init.cornerRadius);
    }
    if (init.labelRadius !== void 0) {
      this.labelRadius(init.labelRadius);
    }
    if (init.sliceColor !== void 0) {
      this.sliceColor(init.sliceColor);
    }
    if (init.tickAlign !== void 0) {
      this.tickAlign(init.tickAlign);
    }
    if (init.tickRadius !== void 0) {
      this.tickRadius(init.tickRadius);
    }
    if (init.tickLength !== void 0) {
      this.tickLength(init.tickLength);
    }
    if (init.tickWidth !== void 0) {
      this.tickWidth(init.tickWidth);
    }
    if (init.tickPadding !== void 0) {
      this.tickPadding(init.tickPadding);
    }
    if (init.tickColor !== void 0) {
      this.tickColor(init.tickColor);
    }
    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
    if (init.title !== void 0) {
      this.title(init.title);
    }
    const slices = init.slices;
    if (slices !== void 0) {
      for (let i = 0, n = slices.length; i < n; i += 1) {
        const slice = slices[i]!;
        this.appendChildView(SliceView.fromAny(slice), slice.key);
      }
    }
  }

  declare readonly viewController: GraphicsViewController & PieViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<PieViewObserver>;

  @ViewAnimator({type: Number, state: 0, updateFlags: View.NeedsLayout})
  declare limit: ViewAnimator<this, number>;

  @ViewAnimator({type: PointR2, state: PointR2.origin(), updateFlags: View.NeedsLayout})
  declare center: ViewAnimator<this, PointR2, AnyPointR2>;

  @ViewAnimator({type: Angle, state: Angle.rad(-Math.PI / 2), updateFlags: View.NeedsLayout})
  declare baseAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Length, state: Length.pct(3)})
  declare innerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.pct(25)})
  declare outerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Angle, state: Angle.deg(2)})
  declare padAngle: ViewAnimator<this, Angle, AnyAngle>;

  @ViewAnimator({type: Length, state: null})
  declare padRadius: ViewAnimator<this, Length | null, AnyLength | null>;

  @ViewAnimator({type: Length, state: Length.zero()})
  declare cornerRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.pct(50)})
  declare labelRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare sliceColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Number, state: 0.5})
  declare tickAlign: ViewAnimator<this, number>;

  @ViewAnimator({type: Length, state: Length.pct(30)})
  declare tickRadius: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.pct(50)})
  declare tickLength: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(1)})
  declare tickWidth: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(2)})
  declare tickPadding: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare tickColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  @ViewAnimator({type: Font, inherit: true})
  declare font: ViewAnimator<this, Font | undefined, AnyFont | undefined>;

  @ViewAnimator({type: Color, inherit: true})
  declare textColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  protected initTitle(titleView: GraphicsView): void {
    if (TypesetView.is(titleView)) {
      titleView.textAlign.setAutoState("center");
      titleView.textBaseline.setAutoState("middle");
      titleView.textOrigin.setAutoState(this.center.state);
    }
  }

  protected willSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.pieViewWillSetTitle !== void 0) {
      viewController.pieViewWillSetTitle(newTitleView, oldTitleView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.pieViewWillSetTitle !== void 0) {
        viewObserver.pieViewWillSetTitle(newTitleView, oldTitleView, this);
      }
    }
  }

  protected onSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    if (newTitleView !== null) {
      this.initTitle(newTitleView);
    }
  }

  protected didSetTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.pieViewDidSetTitle !== void 0) {
        viewObserver.pieViewDidSetTitle(newTitleView, oldTitleView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.pieViewDidSetTitle !== void 0) {
      viewController.pieViewDidSetTitle(newTitleView, oldTitleView, this);
    }
  }

  @ViewFastener<PieView, GraphicsView, AnyTextRunView>({
    key: true,
    type: TextRunView,
    fromAny(value: GraphicsView | AnyTextRunView): GraphicsView {
      if (value instanceof GraphicsView) {
        return value;
      } else if (typeof value === "string" && this.view instanceof TextRunView) {
        this.view.text(value);
        return this.view;
      } else {
        return TextRunView.fromAny(value);
      }
    },
    willSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.willSetTitle(newTitleView, oldTitleView);
    },
    onSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.onSetTitle(newTitleView, oldTitleView);
    },
    didSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.didSetTitle(newTitleView, oldTitleView);
    },
  })
  declare title: ViewFastener<this, GraphicsView, AnyTextRunView>;

  insertSlice(sliceView: AnySliceView, targetView: View | null = null): void {
    sliceView = SliceView.fromAny(sliceView);
    const sliceFasteners = this.sliceFasteners as ViewFastener<this, SliceView>[];
    let targetIndex = sliceFasteners.length;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      if (sliceFastener.view === sliceView) {
        return;
      } else if (sliceFastener.view === targetView) {
        targetIndex = i;
      }
    }
    const sliceFastener = this.createSliceFastener(sliceView);
    sliceFasteners.splice(targetIndex, 0, sliceFastener);
    sliceFastener.setView(sliceView, targetView);
    if (this.isMounted()) {
      sliceFastener.mount();
    }
  }

  removeSlice(sliceView: SliceView): void {
    const sliceFasteners = this.sliceFasteners as ViewFastener<this, SliceView>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      if (sliceFastener.view === sliceView) {
        sliceFastener.setView(null);
        if (this.isMounted()) {
          sliceFastener.unmount();
        }
        sliceFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initSlice(sliceView: SliceView, sliceFastener: ViewFastener<this, SliceView>): void {
    const labelView = sliceView.label.view;
    if (labelView !== null) {
      this.initSliceLabel(labelView, sliceView);
    }
    const legendView = sliceView.legend.view;
    if (legendView !== null) {
      this.initSliceLegend(legendView, sliceView);
    }
  }

  protected willSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null,
                         targetView: View | null, sliceFastener: ViewFastener<this, SliceView>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.pieViewWillSetSlice !== void 0) {
      viewController.pieViewWillSetSlice(newSliceView, oldSliceView, targetView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.pieViewWillSetSlice !== void 0) {
        viewObserver.pieViewWillSetSlice(newSliceView, oldSliceView, targetView, this);
      }
    }
  }

  protected onSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null,
                       targetView: View | null, sliceFastener: ViewFastener<this, SliceView>): void {
    if (newSliceView !== null) {
      this.initSlice(newSliceView, sliceFastener);
    }
  }

  protected didSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null,
                        targetView: View | null, sliceFastener: ViewFastener<this, SliceView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.pieViewDidSetSlice !== void 0) {
        viewObserver.pieViewDidSetSlice(newSliceView, oldSliceView, targetView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.pieViewDidSetSlice !== void 0) {
      viewController.pieViewDidSetSlice(newSliceView, oldSliceView, targetView, this);
    }
  }

  protected onSetSliceValue(value: number, sliceView: SliceView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected initSliceLabel(labelView: GraphicsView, sliceView: SliceView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected initSliceLegend(legendView: GraphicsView, sliceView: SliceView): void {
    this.requireUpdate(View.NeedsLayout);
  }

  /** @hidden */
  static SliceFastener = ViewFastener.define<PieView, SliceView>({
    type: SliceView,
    child: false,
    observe: true,
    willSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, targetView: View | null): void {
      this.owner.willSetSlice(newSliceView, oldSliceView, targetView, this);
    },
    onSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, targetView: View | null): void {
      this.owner.onSetSlice(newSliceView, oldSliceView, targetView, this);
    },
    didSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, targetView: View | null): void {
      this.owner.didSetSlice(newSliceView, oldSliceView, targetView, this);
    },
    sliceViewDidSetValue(newValue: number, oldValue: number, sliceView: SliceView): void {
      this.owner.onSetSliceValue(newValue, sliceView);
    },
    sliceViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceView: SliceView): void {
      if (newLabelView !== null) {
        this.owner.initSliceLabel(newLabelView, sliceView);
      }
    },
    sliceViewDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceView: SliceView): void {
      if (newLegendView !== null) {
        this.owner.initSliceLegend(newLegendView, sliceView);
      }
    },
  });

  protected createSliceFastener(sliceView: SliceView): ViewFastener<this, SliceView> {
    return new PieView.SliceFastener(this, sliceView.key, "slice");
  }

  /** @hidden */
  declare readonly sliceFasteners: ReadonlyArray<ViewFastener<this, SliceView>>;

  /** @hidden */
  protected mountSliceFasteners(): void {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      sliceFastener.mount();
    }
  }

  /** @hidden */
  protected unmountSliceFasteners(): void {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      sliceFastener.unmount();
    }
  }

  protected detectSlice(view: View): SliceView | null {
    return view instanceof SliceView ? view : null;
  }

  protected onInsertSlice(sliceView: SliceView, targetView: View | null): void {
    this.insertSlice(sliceView, targetView);
  }

  protected onRemoveSlice(sliceView: SliceView): void {
    this.removeSlice(sliceView);
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    const sliceView = this.detectSlice(childView);
    if (sliceView !== null) {
      this.onInsertSlice(sliceView, targetView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    const sliceView = this.detectSlice(childView);
    if (sliceView !== null) {
      this.onRemoveSlice(sliceView);
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutPie(this.viewFrame);
  }

  protected layoutPie(frame: BoxR2): void {
    if (this.center.isAuto()) {
      const cx = (frame.xMin + frame.xMax) / 2;
      const cy = (frame.yMin + frame.yMax) / 2;
      this.center.setAutoState(new PointR2(cx, cy));
    }

    const sliceFasteners = this.sliceFasteners;
    const sliceCount = sliceFasteners.length;

    let total = 0;
    for (let i = 0; i < sliceCount; i += 1) {
      const sliceView = sliceFasteners[i]!.view;
      if (sliceView !== null) {
        const value = sliceView.value.getValue();
        if (isFinite(value)) {
          total += value;
        }
      }
    }
    total = Math.max(total, this.limit.getValue());

    let baseAngle = this.baseAngle.getValue().rad();
    for (let i = 0; i < sliceCount; i += 1) {
      const sliceView = sliceFasteners[i]!.view;
      if (sliceView !== null) {
        sliceView.total.setAutoState(total);
        sliceView.phaseAngle.setAutoState(baseAngle);
        const value = sliceView.value.getValue();
        if (isFinite(value)) {
          const delta = total !== 0 ? value / total : 0;
          baseAngle = Angle.rad(baseAngle.value + 2 * Math.PI * delta);
        }
      }
    }

    const titleView = this.title.view;
    if (TypesetView.is(titleView)) {
      titleView.textOrigin.setAutoState(this.center.value);
    }
  }

  /** @hidden */
  protected mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountSliceFasteners();
  }

  /** @hidden */
  protected unmountViewFasteners(): void {
    this.unmountSliceFasteners();
    super.unmountViewFasteners();
  }

  static create(): PieView {
    return new PieView();
  }

  static fromInit(init: PieViewInit): PieView {
    const view = new PieView();
    view.initView(init);
    return view;
  }

  static fromAny(value: AnyPieView): PieView {
    if (value instanceof PieView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
