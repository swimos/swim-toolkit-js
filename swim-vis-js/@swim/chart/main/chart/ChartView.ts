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
import {AnyColor, Color} from "@swim/style";
import {View, ViewProperty, ViewAnimator, ViewFastener} from "@swim/view";
import type {ChartViewObserver} from "./ChartViewObserver";
import type {ChartViewController} from "./ChartViewController";
import {ScaledViewInit, ScaledView} from "../scaled/ScaledView";
import {AnyGraphView, GraphView} from "../graph/GraphView";
import type {AnyAxisView, AxisView} from "../axis/AxisView";
import {TopAxisView} from "../axis/TopAxisView";
import {RightAxisView} from "../axis/RightAxisView";
import {BottomAxisView} from "../axis/BottomAxisView";
import {LeftAxisView} from "../axis/LeftAxisView";

export type AnyChartView<X = unknown, Y = unknown> = ChartView<X, Y> | ChartViewInit<X, Y>;

export interface ChartViewInit<X = unknown, Y = unknown> extends ScaledViewInit<X, Y> {
  viewController?: ChartViewController<X, Y>;
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
}

export class ChartView<X = unknown, Y = unknown> extends ScaledView<X, Y> {
  initView(init: ChartViewInit<X, Y>): void {
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
  }

  declare readonly viewController: ChartViewController<X, Y> | null;

  declare readonly viewObservers: ReadonlyArray<ChartViewObserver<X, Y>>;

  @ViewAnimator({type: Length, state: Length.px(20)})
  declare gutterTop: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(40)})
  declare gutterRight: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(20)})
  declare gutterBottom: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Length, state: Length.px(40)})
  declare gutterLeft: ViewAnimator<this, Length, AnyLength>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare borderColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator({type: Number, state: 1})
  declare borderWidth: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 6})
  declare borderSerif: ViewAnimator<this, number>;

  @ViewAnimator({type: Color, state: Color.black()})
  declare tickMarkColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator({type: Number, state: 1})
  declare tickMarkWidth: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 6})
  declare tickMarkLength: ViewAnimator<this, number>;

  @ViewAnimator({type: Number, state: 2})
  declare tickLabelPadding: ViewAnimator<this, number>;

  @ViewProperty({
    type: Timing,
    inherit: true,
    initState(): Timing {
      return Easing.cubicOut.withDuration(250);
    },
  })
  declare tickTransition: ViewProperty<this, Timing, AnyTiming>;

  @ViewAnimator({type: Color, state: Color.transparent()})
  declare gridLineColor: ViewAnimator<this, Color, AnyColor>;

  @ViewAnimator({type: Number, state: 0})
  declare gridLineWidth: ViewAnimator<this, number>;

  xRange(): Range<number> | null {
    const frame = this.viewFrame;
    const gutterLeft = this.gutterLeft.getValue().pxValue(frame.width);
    const gutterRight = this.gutterRight.getValue().pxValue(frame.width);
    const xRangePadding = this.xRangePadding.state;
    const xRangeMin = xRangePadding[0];
    const xRangeMax = this.viewFrame.width - gutterRight - gutterLeft - xRangePadding[1];
    return LinearRange(xRangeMin, xRangeMax);
  }

  yRange(): Range<number> | null {
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

  protected willSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewWillSetGraph !== void 0) {
      viewController.chartViewWillSetGraph(newGraphView, oldGraphView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewWillSetGraph !== void 0) {
        viewObserver.chartViewWillSetGraph(newGraphView, oldGraphView, this);
      }
    }
  }

  protected onSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    if (newGraphView !== null) {
      this.initGraph(newGraphView);
    }
  }

  protected didSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewDidSetGraph !== void 0) {
        viewObserver.chartViewDidSetGraph(newGraphView, oldGraphView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewDidSetGraph !== void 0) {
      viewController.chartViewDidSetGraph(newGraphView, oldGraphView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, GraphView<X, Y>, AnyGraphView<X, Y>>({
    key: true,
    type: GraphView,
    child: true,
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
  declare graph: ViewFastener<this, GraphView<X, Y>, AnyGraphView<X, Y>>;

  protected createTopAxis(): AxisView<X> | null {
    return new TopAxisView();
  }

  protected initTopAxis(topAxisView: AxisView<X>): void {
    // hook
  }

  protected willSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewWillSetTopAxis !== void 0) {
      viewController.chartViewWillSetTopAxis(newTopAxisView, oldTopAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewWillSetTopAxis !== void 0) {
        viewObserver.chartViewWillSetTopAxis(newTopAxisView, oldTopAxisView, this);
      }
    }
  }

  protected onSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    if (newTopAxisView !== null) {
      this.initTopAxis(newTopAxisView);
    }
  }

  protected didSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewDidSetTopAxis !== void 0) {
        viewObserver.chartViewDidSetTopAxis(newTopAxisView, oldTopAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewDidSetTopAxis !== void 0) {
      viewController.chartViewDidSetTopAxis(newTopAxisView, oldTopAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<X>, AnyAxisView<X> | true>({
    key: true,
    type: TopAxisView,
    child: true,
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
  declare topAxis: ViewFastener<this, AxisView<X>, AnyAxisView<X> | true>;

  protected createRightAxis(): AxisView<Y> | null {
    return new RightAxisView();
  }

  protected initRightAxis(rightAxisView: AxisView<Y>): void {
    // hook
  }

  protected willSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewWillSetRightAxis !== void 0) {
      viewController.chartViewWillSetRightAxis(newRightAxisView, oldRightAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewWillSetRightAxis !== void 0) {
        viewObserver.chartViewWillSetRightAxis(newRightAxisView, oldRightAxisView, this);
      }
    }
  }

  protected onSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    if (newRightAxisView !== null) {
      this.initRightAxis(newRightAxisView);
    }
  }

  protected didSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewDidSetRightAxis !== void 0) {
        viewObserver.chartViewDidSetRightAxis(newRightAxisView, oldRightAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewDidSetRightAxis !== void 0) {
      viewController.chartViewDidSetRightAxis(newRightAxisView, oldRightAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<Y>, AnyAxisView<Y> | true>({
    key: true,
    type: RightAxisView,
    child: true,
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
  declare rightAxis: ViewFastener<this, AxisView<Y>, AnyAxisView<Y> | true>;

  protected createBottomAxis(): AxisView<X> | null {
    return new BottomAxisView();
  }

  protected initBottomAxis(bottomAxisView: AxisView<X>): void {
    // hook
  }

  protected willSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewWillSetBottomAxis !== void 0) {
      viewController.chartViewWillSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewWillSetBottomAxis !== void 0) {
        viewObserver.chartViewWillSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
      }
    }
  }

  protected onSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    if (newBottomAxisView !== null) {
      this.initBottomAxis(newBottomAxisView);
    }
  }

  protected didSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewDidSetBottomAxis !== void 0) {
        viewObserver.chartViewDidSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewDidSetBottomAxis !== void 0) {
      viewController.chartViewDidSetBottomAxis(newBottomAxisView, oldBottomAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<X>, AnyAxisView<X> | true>({
    key: true,
    type: BottomAxisView,
    child: true,
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
  declare bottomAxis: ViewFastener<this, AxisView<X>, AnyAxisView<X> | true>;

  protected createLeftAxis(): AxisView<Y> | null {
    return new LeftAxisView();
  }

  protected initLeftAxis(leftAxisView: AxisView<Y>): void {
    // hook
  }

  protected willSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewWillSetLeftAxis !== void 0) {
      viewController.chartViewWillSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewWillSetLeftAxis !== void 0) {
        viewObserver.chartViewWillSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
      }
    }
  }

  protected onSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    if (newLeftAxisView !== null) {
      this.initLeftAxis(newLeftAxisView);
    }
  }

  protected didSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.chartViewDidSetLeftAxis !== void 0) {
        viewObserver.chartViewDidSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.chartViewDidSetLeftAxis !== void 0) {
      viewController.chartViewDidSetLeftAxis(newLeftAxisView, oldLeftAxisView, this);
    }
  }

  @ViewFastener<ChartView<X, Y>, AxisView<Y>, AnyAxisView<Y> | true>({
    key: true,
    type: LeftAxisView,
    child: true,
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
  declare leftAxis: ViewFastener<this, AxisView<Y>, AnyAxisView<Y> | true>;

  protected updateScales(): void {
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
        topAxisView.origin.setAutoState(new PointR2(graphLeft, graphTop));
        topAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const rightAxisView = this.rightAxis.view;
    if (rightAxisView !== null) {
      const rightFrame = rightAxisView.viewFrame;
      if (rightFrame.xMin !== graphLeft || rightFrame.yMin !== graphTop ||
          rightFrame.xMax !== frame.xMax || rightFrame.yMax !== graphBottom) {
        rightAxisView.setViewFrame(new BoxR2(graphLeft, graphTop, frame.xMax, graphBottom));
        rightAxisView.origin.setAutoState(new PointR2(Math.max(graphLeft, graphRight), graphBottom));
        rightAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const bottomAxisView = this.bottomAxis.view;
    if (bottomAxisView !== null) {
      const bottomFrame = bottomAxisView.viewFrame;
      if (bottomFrame.xMin !== graphLeft || bottomFrame.yMin !== graphTop ||
          bottomFrame.xMax !== graphRight || bottomFrame.yMax !== frame.yMax) {
        bottomAxisView.setViewFrame(new BoxR2(graphLeft, graphTop, graphRight, frame.yMax));
        bottomAxisView.origin.setAutoState(new PointR2(graphLeft, Math.max(graphTop, graphBottom)));
        bottomAxisView.requireUpdate(View.NeedsLayout);
      }
    }
    const leftAxisView = this.leftAxis.view;
    if (leftAxisView !== null) {
      const leftFrame = leftAxisView.viewFrame;
      if (leftFrame.xMin !== frame.xMin || leftFrame.yMin !== graphTop ||
          leftFrame.xMax !== graphRight || leftFrame.yMax !== graphBottom) {
        leftAxisView.setViewFrame(new BoxR2(frame.xMin, graphTop, graphRight, graphBottom));
        leftAxisView.origin.setAutoState(new PointR2(graphLeft, graphBottom));
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

  static create<X, Y>(): ChartView<X, Y> {
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
