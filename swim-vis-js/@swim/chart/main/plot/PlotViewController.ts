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

import type {Domain ,ContinuousScale} from "@swim/mapping";
import type {View} from "@swim/view";
import {GraphicsViewController} from "@swim/graphics";
import type {DataPointView} from "../data/DataPointView";
import type {PlotType, PlotView} from "./PlotView";
import type {PlotViewObserver} from "./PlotViewObserver";

export class PlotViewController<X = unknown, Y = unknown, V extends PlotView<X, Y> = PlotView<X, Y>> extends GraphicsViewController<V> implements PlotViewObserver<X, Y, V> {
  get plotType(): PlotType {
    const view = this.view;
    return view !== null ? view.plotType : void 0 as any;
  }

  xScale(): ContinuousScale<X, number> | null {
    const view = this.view;
    return view !== null ? view.xScale() : null;
  }

  yScale(): ContinuousScale<Y, number> | null {
    const view = this.view;
    return view !== null ? view.yScale() : null;
  }

  scaledViewWillSetXScale(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null, view: V): void {
    // hook
  }

  scaledViewDidSetXScale(newXScale: ContinuousScale<X, number> | null, oldXScale: ContinuousScale<X, number> | null, view: V): void {
    // hook
  }

  scaledViewWillSetYScale(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null, view: V): void {
    // hook
  }

  scaledViewDidSetYScale(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null, view: V): void {
    // hook
  }

  scaledViewWillSetXDataDomain(newXDataDomain: Domain<X> | null, oldXDataDomain: Domain<X> | null, view: V): void {
    // hook
  }

  scaledViewDidSetXDataDomain(newXDataDomain: Domain<X> | null, oldXDataDomain: Domain<X> | null, view: V): void {
    // hook
  }

  scaledViewWillSetYDataDomain(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null, view: V): void {
    // hook
  }

  scaledViewDidSetYDataDomain(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null, view: V): void {
    // hook
  }

  plotViewWillSetDataPoint(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null, targetView: View | null, view: V): void {
    // hook
  }

  plotViewDidSetDataPoint(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null, targetView: View | null, view: V): void {
    // hook
  }
}
