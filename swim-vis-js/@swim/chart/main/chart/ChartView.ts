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

import {Range, AnyTiming, Timing, Easing, LinearRange} from "@swim/mapping";
import {AnyLength, Length, PointR2, BoxR2} from "@swim/math";
import {AnyFont, Font, AnyColor, Color} from "@swim/style";
import {Look} from "@swim/theme";
import {View, ViewProperty, ViewAnimator, ViewFastener} from "@swim/view";
import type {GraphicsViewController} from "@swim/graphics";
import type {ChartViewObserver} from "./ChartViewObserver";
import {ScaledViewInit, ScaledView} from "../scaled/ScaledView";
import {AnyGraphView, GraphView} from "../graph/GraphView";
import type {AnyAxisView, AxisView} from "../axis/AxisView";
import {TopAxisView} from "../axis/TopAxisView";
import {RightAxisView} from "../axis/RightAxisView";
import {BottomAxisView} from "../axis/BottomAxisView";
import {LeftAxisView} from "../axis/LeftAxisView";

export type AnyChartView<X, Y> = ChartView<X, Y> | ChartViewInit<X, Y>;

export interface ChartViewInit<X, Y> extends ScaledViewInit<X, Y> {
  graph?: AnyGraphView<X, Y>;

  topAxis?: AnyAxisView<X> | true;
  rightAxis?: AnyAxisView<Y> | true;
  bottomAxis?: AnyAxisView<X> | true;
  leftAxis?: AnyAxisView<Y> | true;

  gutterTop?: AnyLength;
  gutterRight?: AnyLength;
  gutterBottom?: AnyLength;
  gutterLeft?: AnyLength;

  borderColor?: AnyColor;
  borderWidth?: number;
  borderSerif?: number;

  tickMarkColor?: AnyColor;
  tickMarkWidth?: number;
  tickMarkLength?: number;
  tickLabelPadding?: number;
  tickTransition?: AnyTiming;

  gridLineColor?: AnyColor;
  gridLineWidth?: number;

  font?: AnyFont;
  textColor?: AnyColor;
}

export class ChartView<X, Y> extends ScaledView<X, Y> {
  override initView(init: ChartViewInit<X, Y>): void {
    super.initView(init);
     if (init.graph !== void 0) {
      this.graph(init.graph);
    }

    if (init.topAxis !== void 0) {
      this.topAxis(init.topAxis);
    }
    if (init.rightAxis !== void 0) {
      this.rightAxis(init.rightAxis);
    }
    if (init.bottomAxis !== void 0) {
      this.bottomAxis(init.bottomAxis);
    }
    if (init.leftAxis !== void 0) {
      this.leftAxis(init.leftAxis);
    }

    if (init.gutterTop !== void 0) {
      this.gutterTop(init.gutterTop);
    }
    if (init.gutterRight !== void 0) {
      this.gutterRight(init.gutterRight);
    }
    if (init.gutterBottom !== void 0) {
      this.gutterBottom(init.gutterBottom);
    }
    if (init.gutterLeft !== void 0) {
      this.gutterLeft(init.gutterLeft);
    }

    if (init.borderColor !== void 0) {
      this.borderColor(init.borderColor);
    }
    if (init.borderWidth !== void 0) {
      this.borderWidth(init.borderWidth);
    }
    if (init.borderSerif !== void 0) {
      this.borderSerif(init.borderSerif);
    }

    if (init.tickMarkColor !== void 0) {
      this.tickMarkColor(init.tickMarkColor);
    }
    if (init.tickMarkWidth !== void 0) {
      this.tickMarkWidth(init.tickMarkWidth);
    }
    if (init.tickMarkLength !== void 0) {
      this.tickMarkLength(init.tickMarkLength);
    }
    if (init.tickLabelPadding !== void 0) {
      this.tickLabelPadding(init.tickLabelPadding);
    }
    if (init.tickTransition !== void 0) {
      this.tickTransition(init.tickTransition);
    }

    if (init.gridLineColor !== void 0) {
      this.gridLineColor(init.gridLineColor);
    }
    if (init.gridLineWidth !== void 0) {
      this.gridLineWidth(init.gridLineWidth);
    }

    if (init.font !== void 0) {
      this.font(init.font);
    }
    if (init.textColor !== void 0) {
      this.textColor(init.textColor);
    }
  }

  override readonly viewController!: GraphicsViewController<ChartView<X, Y>> & ChartViewObserver<X, Y> | null;

  override readonly viewObservers!: ReadonlyArray<ChartViewObserver<X, Y>>;

  @ViewAnimator({type: Length, state: Length.px(20)})
  readonly gutterTop!: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(40)})
  readonly gutterRight!: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(20)})
  readonly gutterBottom!: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(40)})
  readonly gutterLeft!: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: null, look: Look.neutralColor})
  readonly borderColor!: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Number, state: 1})
  readonly borderWidth!: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 6})
  readonly borderSerif!: ViewAnimator<this, number>;

  @ViewAnimator({type: Color, state: null, look: Look.neutralColor})
  readonly tickMarkColor!: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Number, state: 1})
  readonly tickMarkWidth!: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 6})
  readonly tickMarkLength!: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 2})
  readonly tickLabelPadding!: ViewAnimator<this, number>;

  @ViewProperty({
    type: Timing,
    initState(): Timing {
      return Easing.cubicOut.withDuration(250);
    },
  })
  readonly tickTransition!: ViewProperty<this, Timing, AnyTiming>;

  @ViewAnimator({type: Color, state: null, look: Look.subduedColor})
  readonly gridLineColor!: ViewAnimator<this, Color | null, AnyColor | null>;

  @ViewAnimator({type: Number, state: 0})
  readonly gridLineWidth!: ViewAnimator<this, number>;

  @ViewAnimator({type: Font, state: null, inherit: true})
  readonly font!: ViewAnimator<this, Font | null, AnyFont | null>;

  @ViewAnimator({type: Color, state: null, look: Look.mutedColor})
  readonly textColor!: ViewAnimator<this, Color | null, AnyColor | null>;

  override xRange(): Range<number> | null {
    const frame = this.viewFrame;
    const gutterLeft = this.gutterLeft.getValue().pxValue(frame.width);
    const gutterRight = this.gutterRight.getValue().pxValue(frame.width);
    const xRangePadding = this.xRangePadding.state;
    const xRangeMin = xRangePadding[0];
    const xRangeMax = this.viewFrame.width - gutterRight - gutterLeft - xRangePadding[1];
    return LinearRange(xRangeMin, xRangeMax);
  }

  override yRange(): Range<number> | null {
    const frame = this.viewFrame;
    const gutterTop = this.gutterTop.getValue().pxValue(frame.height);
    const gutterBottom = this.gutterBottom.getValue().pxValue(frame.height);
    const yRangePadding = this.yRangePadding.state;
    const yRangeMin = yRangePadding[0];
    const yRangeMax = this.viewFrame.height - gutterBottom - gutterTop - yRangePadding[1];
    return LinearRange(yRangeMin, yRangeMax);
  }

  protected createGraph(): GraphView<X, Y> | null {
    return new GraphView();
  }

  protected initGraph(graphView: GraphView<X, Y>): void {
    // hook
  }

  protected attachGraph(graphView: GraphView<X, Y>): void {
    // hook
  }

  protected detachGraph(graphView: GraphView<X, Y>): void {
    // hook
  }

  protected willSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetGraph !== void 0) {
      viewController.viewWillSetGraph(newGraphView, oldGraphView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetGraph !== void 0) {
        viewObserver.viewWillSetGraph(newGraphView, oldGraphView, this);
      }
    }
  }

  protected onSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    if (oldGraphView !== null) {
      this.detachGraph(oldGraphView);
    }
    if (newGraphView !== null) {
      this.attachGraph(newGraphView);
      this.initGraph(newGraphView);
    }
  }

  protected didSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetGraph !== void 0) {
        viewObserver.viewDidSetGraph(newGraphView, oldGraphView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetGraph !== void 0) {
      viewController.viewDidSetGraph(newGraphView, oldGraphView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, GraphView<X, Y>, AnyGraphView<X, Y>>({
    key: true,
    type: GraphView,
    createView(): GraphView<X, Y> | null {
      return this.owner.createGraph();
    },
    willSetView(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
      this.owner.willSetGraph(newGraphView, oldGraphView);
    },
    onSetView(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
      this.owner.onSetGraph(newGraphView, oldGraphView);
    },
    didSetView(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
      this.owner.didSetGraph(newGraphView, oldGraphView);
    },
  })
  readonly graph!: ViewFastener<this, GraphView<X, Y>, AnyGraphView<X, Y>>;

  protected createTopAxis(): AxisView<X> | null {
    return new TopAxisView();
  }

  protected initTopAxis(topAxisView: AxisView<X>): void {
    // hook
  }

  protected attachTopAxis(topAxisView: AxisView<X>): void {
    // hook
  }

  protected detachTopAxis(topAxisView: AxisView<X>): void {
    // hook
  }

  protected willSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetTopAxis !== void 0) {
      viewController.viewWillSetTopAxis(newTopAxisView, oldTopAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetTopAxis !== void 0) {
        viewObserver.viewWillSetTopAxis(newTopAxisView, oldTopAxisView, this);
      }
    }
  }

  protected onSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    if (oldTopAxisView !== null) {
      this.detachTopAxis(oldTopAxisView);
    }
    if (newTopAxisView !== null) {
      this.attachTopAxis(newTopAxisView);
      this.initTopAxis(newTopAxisView);
    }
  }

  protected didSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetTopAxis !== void 0) {
        viewObserver.viewDidSetTopAxis(newTopAxisView, oldTopAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetTopAxis !== void 0) {
      viewController.viewDidSetTopAxis(newTopAxisView, oldTopAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<X>, AnyAxisView<X> | true>({
    key: true,
    type: TopAxisView,
    createView(): AxisView<X> | null {
      return this.owner.createTopAxis();
    },
    willSetView(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
      this.owner.willSetTopAxis(newTopAxisView, oldTopAxisView);
    },
    onSetView(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
      this.owner.onSetTopAxis(newTopAxisView, oldTopAxisView);
    },
    didSetView(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
      this.owner.didSetTopAxis(newTopAxisView, oldTopAxisView);
    },
  })
  readonly topAxis!: ViewFastener<this, AxisView<X>, AnyAxisView<X> | true>;

  protected createRightAxis(): AxisView<Y> | null {
    return new RightAxisView();
  }

  protected initRightAxis(rightAxisView: AxisView<Y>): void {
    // hook
  }

  protected attachRightAxis(rightAxisView: AxisView<Y>): void {
    // hook
  }

  protected detachRightAxis(rightAxisView: AxisView<Y>): void {
    // hook
  }

  protected willSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetRightAxis !== void 0) {
      viewController.viewWillSetRightAxis(newRightAxisView, oldRightAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetRightAxis !== void 0) {
        viewObserver.viewWillSetRightAxis(newRightAxisView, oldRightAxisView, this);
      }
    }
  }

  protected onSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    if (oldRightAxisView !== null) {
      this.detachRightAxis(oldRightAxisView);
    }
    if (newRightAxisView !== null) {
      this.attachRightAxis(newRightAxisView);
      this.initRightAxis(newRightAxisView);
    }
  }

  protected didSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetRightAxis !== void 0) {
        viewObserver.viewDidSetRightAxis(newRightAxisView, oldRightAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetRightAxis !== void 0) {
      viewController.viewDidSetRightAxis(newRightAxisView, oldRightAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<Y>, AnyAxisView<Y> | true>({
    key: true,
    type: RightAxisView,
    createView(): AxisView<Y> | null {
      return this.owner.createRightAxis();
    },
    willSetView(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
      this.owner.willSetRightAxis(newRightAxisView, oldRightAxisView);
    },
    onSetView(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
      this.owner.onSetRightAxis(newRightAxisView, oldRightAxisView);
    },
    didSetView(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
      this.owner.didSetRightAxis(newRightAxisView, oldRightAxisView);
    },
  })
  readonly rightAxis!: ViewFastener<this, AxisView<Y>, AnyAxisView<Y> | true>;

  protected createBottomAxis(): AxisView<X> | null {
    return new BottomAxisView();
  }

  protected initBottomAxis(bottomAxisView: AxisView<X>): void {
    // hook
  }

  protected attachBottomAxis(bottomAxisView: AxisView<X>): void {
    // hook
  }

  protected detachBottomAxis(bottomAxisView: AxisView<X>): void {
    // hook
  }

  protected willSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetBottomAxis !== void 0) {
      viewController.viewWillSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetBottomAxis !== void 0) {
        viewObserver.viewWillSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
      }
    }
  }

  protected onSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    if (oldBottomAxisView !== null) {
      this.detachBottomAxis(oldBottomAxisView);
    }
    if (newBottomAxisView !== null) {
      this.attachBottomAxis(newBottomAxisView);
      this.initBottomAxis(newBottomAxisView);
    }
  }

  protected didSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetBottomAxis !== void 0) {
        viewObserver.viewDidSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetBottomAxis !== void 0) {
      viewController.viewDidSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<X>, AnyAxisView<X> | true>({
    key: true,
    type: BottomAxisView,
    createView(): AxisView<X> | null {
      return this.owner.createBottomAxis();
    },
    willSetView(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
      this.owner.willSetBottomAxis(newBottomAxisView, oldBottomAxisView);
    },
    onSetView(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
      this.owner.onSetBottomAxis(newBottomAxisView, oldBottomAxisView);
    },
    didSetView(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
      this.owner.didSetBottomAxis(newBottomAxisView, oldBottomAxisView);
    },
  })
  readonly bottomAxis!: ViewFastener<this, AxisView<X>, AnyAxisView<X> | true>;

  protected createLeftAxis(): AxisView<Y> | null {
    return new LeftAxisView();
  }

  protected initLeftAxis(leftAxisView: AxisView<Y>): void {
    // hook
  }

  protected attachLeftAxis(leftAxisView: AxisView<Y>): void {
    // hook
  }

  protected detachLeftAxis(leftAxisView: AxisView<Y>): void {
    // hook
  }

  protected willSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetLeftAxis !== void 0) {
      viewController.viewWillSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetLeftAxis !== void 0) {
        viewObserver.viewWillSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
      }
    }
  }

  protected onSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    if (oldLeftAxisView !== null) {
      this.detachLeftAxis(oldLeftAxisView);
    }
    if (newLeftAxisView !== null) {
      this.attachLeftAxis(newLeftAxisView);
      this.initLeftAxis(newLeftAxisView);
    }
  }

  protected didSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetLeftAxis !== void 0) {
        viewObserver.viewDidSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetLeftAxis !== void 0) {
      viewController.viewDidSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<Y>, AnyAxisView<Y> | true>({
    key: true,
    type: LeftAxisView,
    createView(): AxisView<Y> | null {
      return this.owner.createLeftAxis();
    },
    willSetView(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
      this.owner.willSetLeftAxis(newLeftAxisView, oldLeftAxisView);
    },
    onSetView(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
      this.owner.onSetLeftAxis(newLeftAxisView, oldLeftAxisView);
    },
    didSetView(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
      this.owner.didSetLeftAxis(newLeftAxisView, oldLeftAxisView);
    },
  })
  readonly leftAxis!: ViewFastener<this, AxisView<Y>, AnyAxisView<Y> | true>;

  protected detectGraphView(view: View): GraphView<X, Y> | null {
    return view instanceof GraphView ? view : null;
  }

  protected detectTopAxisView(view: View): TopAxisView<X> | null {
    return view instanceof TopAxisView ? view : null;
  }

  protected detectRightAxisView(view: View): RightAxisView<Y> | null {
    return view instanceof RightAxisView ? view : null;
  }

  protected detectBottomAxisView(view: View): BottomAxisView<X> | null {
    return view instanceof BottomAxisView ? view : null;
  }

  protected detectLeftAxisView(view: View): LeftAxisView<Y> | null {
    return view instanceof LeftAxisView ? view : null;
  }

  protected override onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    if (this.graph.view === null) {
      const graphView = this.detectGraphView(childView);
      if (graphView !== null) {
        this.graph.setView(graphView, targetView);
      }
    }
    if (this.topAxis.view === null) {
      const topAxisView = this.detectTopAxisView(childView);
      if (topAxisView !== null) {
        this.topAxis.setView(topAxisView, targetView);
      }
    }
    if (this.rightAxis.view === null) {
      const rightAxisView = this.detectRightAxisView(childView);
      if (rightAxisView !== null) {
        this.rightAxis.setView(rightAxisView, targetView);
      }
    }
    if (this.bottomAxis.view === null) {
      const bottomAxisView = this.detectBottomAxisView(childView);
      if (bottomAxisView !== null) {
        this.bottomAxis.setView(bottomAxisView, targetView);
      }
    }
    if (this.leftAxis.view === null) {
      const leftAxisView = this.detectLeftAxisView(childView);
      if (leftAxisView !== null) {
        this.leftAxis.setView(leftAxisView, targetView);
      }
    }
  }

  protected override onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    if (this.graph.view === null) {
      const graphView = this.detectGraphView(childView);
      if (graphView !== null && this.graph.view === graphView) {
        this.graph.setView(null);
      }
    }
    if (this.topAxis.view === null) {
      const topAxisView = this.detectTopAxisView(childView);
      if (topAxisView !== null && this.topAxis.view === topAxisView) {
        this.topAxis.setView(null);
      }
    }
    if (this.rightAxis.view === null) {
      const rightAxisView = this.detectRightAxisView(childView);
      if (rightAxisView !== null && this.rightAxis.view === rightAxisView) {
        this.rightAxis.setView(null);
      }
    }
    if (this.bottomAxis.view === null) {
      const bottomAxisView = this.detectBottomAxisView(childView);
      if (bottomAxisView !== null && this.bottomAxis.view === bottomAxisView) {
        this.bottomAxis.setView(null);
      }
    }
    if (this.leftAxis.view === null) {
      const leftAxisView = this.detectLeftAxisView(childView);
      if (leftAxisView !== null && this.leftAxis.view === leftAxisView) {
        this.leftAxis.setView(null);
      }
    }
  }

  protected override updateScales(): void {
    this.layoutChart(this.viewFrame);
    super.updateScales();
  }

  protected layoutChart(frame: BoxR2): void {
    const gutterTop = this.gutterTop.getValue().pxValue(frame.height);
    const gutterRight = this.gutterRight.getValue().pxValue(frame.width);
    const gutterBottom = this.gutterBottom.getValue().pxValue(frame.height);
    const gutterLeft = this.gutterLeft.getValue().pxValue(frame.width);

    const graphTop = frame.yMin + gutterTop;
    const graphRight = frame.xMax - gutterRight;
    const graphBottom = frame.yMax - gutterBottom;
    const graphLeft = frame.xMin + gutterLeft;

    const topAxisView = this.topAxis.view;
    if (topAxisView !== null) {
      const topFrame = topAxisView.viewFrame;
      if (topFrame.xMin !== graphLeft || topFrame.yMin !== frame.yMin ||
          topFrame.xMax !== graphRight || topFrame.yMax !== graphBottom) {
        topAxisView.setViewFrame(new BoxR2(graphLeft, frame.yMin, graphRight, graphBottom));
        topAxisView.origin.setState(new PointR2(graphLeft, graphTop), View.Intrinsic);
        topAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const rightAxisView = this.rightAxis.view;
    if (rightAxisView !== null) {
      const rightFrame = rightAxisView.viewFrame;
      if (rightFrame.xMin !== graphLeft || rightFrame.yMin !== graphTop ||
          rightFrame.xMax !== frame.xMax || rightFrame.yMax !== graphBottom) {
        rightAxisView.setViewFrame(new BoxR2(graphLeft, graphTop, frame.xMax, graphBottom));
        rightAxisView.origin.setState(new PointR2(Math.max(graphLeft, graphRight), graphBottom), View.Intrinsic);
        rightAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const bottomAxisView = this.bottomAxis.view;
    if (bottomAxisView !== null) {
      const bottomFrame = bottomAxisView.viewFrame;
      if (bottomFrame.xMin !== graphLeft || bottomFrame.yMin !== graphTop ||
          bottomFrame.xMax !== graphRight || bottomFrame.yMax !== frame.yMax) {
        bottomAxisView.setViewFrame(new BoxR2(graphLeft, graphTop, graphRight, frame.yMax));
        bottomAxisView.origin.setState(new PointR2(graphLeft, Math.max(graphTop, graphBottom)), View.Intrinsic);
        bottomAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const leftAxisView = this.leftAxis.view;
    if (leftAxisView !== null) {
      const leftFrame = leftAxisView.viewFrame;
      if (leftFrame.xMin !== frame.xMin || leftFrame.yMin !== graphTop ||
          leftFrame.xMax !== graphRight || leftFrame.yMax !== graphBottom) {
        leftAxisView.setViewFrame(new BoxR2(frame.xMin, graphTop, graphRight, graphBottom));
        leftAxisView.origin.setState(new PointR2(graphLeft, graphBottom), View.Intrinsic);
        leftAxisView.requireUpdate(View.NeedsLayout);
      }
    }

    const graphView = this.graph.view;
    if (graphView !== null) {
      const graphFrame = graphView.viewFrame;
      if (graphFrame.xMin !== graphLeft || graphFrame.yMin !== graphTop ||
          graphFrame.xMax !== graphRight || graphFrame.yMax !== graphBottom) {
        graphView.setViewFrame(new BoxR2(graphLeft, graphTop, graphRight, graphBottom));
        graphView.requireUpdate(View.NeedsLayout);
      }
    }
  }

  static override create<X, Y>(): ChartView<X, Y> {
    return new ChartView<X, Y>();
  }

  static fromInit<X, Y>(init: ChartViewInit<X, Y>): ChartView<X, Y> {
    const view = new ChartView<X, Y>();
    view.initView(init);
    return view;
  }

  static fromAny<X, Y>(value: AnyChartView<X, Y>): ChartView<X, Y> {
    if (value instanceof ChartView) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
