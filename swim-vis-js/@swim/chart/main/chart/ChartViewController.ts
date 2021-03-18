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

import {ScaledViewController} from "../scaled/ScaledViewController";
import type {GraphView} from "../graph/GraphView";
import type {AxisView} from "../axis/AxisView";
import type {ChartView} from "./ChartView";
import type {ChartViewObserver} from "./ChartViewObserver";

export class ChartViewController<X = unknown, Y = unknown, V extends ChartView<X, Y> = ChartView<X, Y>> extends ScaledViewController<X, Y, V> implements ChartViewObserver<X, Y, V> {
  get graphView(): GraphView<X, Y> | null {
    const view = this.view;
    return view !== null ? view.graph.view : null;
  }

  get topAxisView(): AxisView<X> | null {
    const view = this.view;
    return view !== null ? view.topAxis.view : null;
  }

  get rightAxisView(): AxisView<Y> | null {
    const view = this.view;
    return view !== null ? view.rightAxis.view : null;
  }

  get bottomAxisView(): AxisView<X> | null {
    const view = this.view;
    return view !== null ? view.bottomAxis.view : null;
  }

  get leftAxisView(): AxisView<Y> | null {
    const view = this.view;
    return view !== null ? view.leftAxis.view : null;
  }

  chartViewWillSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null, view: V): void {
    // hook
  }

  chartViewDidSetGraph(newGraphView: GraphView<X, Y> | null, oldGraphView: GraphView<X, Y> | null, view: V): void {
    // hook
  }

  chartViewWillSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null, view: V): void {
    // hook
  }

  chartViewDidSetTopAxis(newTopAxisView: AxisView<X> | null, oldTopAxisView: AxisView<X> | null, view: V): void {
    // hook
  }

  chartViewWillSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null, view: V): void {
    // hook
  }

  chartViewDidSetRightAxis(newRightAxisView: AxisView<Y> | null, oldRightAxisView: AxisView<Y> | null, view: V): void {
    // hook
  }

  chartViewWillSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null, view: V): void {
    // hook
  }

  chartViewDidSetBottomAxis(newBottomAxisView: AxisView<X> | null, oldBottomAxisView: AxisView<X> | null, view: V): void {
    // hook
  }

  chartViewWillSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null, view: V): void {
    // hook
  }

  chartViewDidSetLeftAxis(newLeftAxisView: AxisView<Y> | null, oldLeftAxisView: AxisView<Y> | null, view: V): void {
    // hook
  }
}
