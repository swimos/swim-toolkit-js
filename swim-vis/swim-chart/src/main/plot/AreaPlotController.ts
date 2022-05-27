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

import {Class, AnyTiming, Timing} from "@swim/util";
import {Affinity, FastenerClass} from "@swim/component";
import type {Color} from "@swim/style";
import {Look, Mood, ColorOrLook} from "@swim/theme";
import {TraitViewRefDef, TraitViewControllerSetDef} from "@swim/controller";
import {DataSetTrait} from "../data/DataSetTrait";
import {AreaPlotView} from "./AreaPlotView";
import {AreaPlotTrait} from "./AreaPlotTrait";
import {SeriesPlotController} from "./SeriesPlotController";
import type {AreaPlotControllerObserver} from "./AreaPlotControllerObserver";

/** @public */
export class AreaPlotController<X = unknown, Y = unknown> extends SeriesPlotController<X, Y> {
  override readonly observerType?: Class<AreaPlotControllerObserver<X, Y>>;

  @TraitViewControllerSetDef<AreaPlotController<X, Y>["dataPoints"]>({
    extends: true,
    get parentView(): AreaPlotView<X, Y> | null {
      return this.owner.plot.view;
    },
  })
  override readonly dataPoints!: TraitViewControllerSetDef<this, {
    extends: SeriesPlotController<X, Y>["dataPoints"],
  }>;
  static override readonly dataPoints: FastenerClass<AreaPlotController["dataPoints"]>;

  protected setFill(fill: ColorOrLook | null, timing?: AnyTiming | boolean): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      if (timing === void 0 || timing === true) {
        timing = this.plotTiming.value;
        if (timing === true) {
          timing = plotView.getLook(Look.timing, Mood.ambient);
        }
      } else {
        timing = Timing.fromAny(timing);
      }
      if (fill instanceof Look) {
        plotView.fill.setLook(fill, timing, Affinity.Intrinsic);
      } else {
        plotView.fill.setState(fill, timing, Affinity.Intrinsic);
      }
    }
  }

  @TraitViewRefDef<AreaPlotController<X, Y>["plot"]>({
    traitType: AreaPlotTrait,
    observesTrait: true,
    initTrait(plotTrait: AreaPlotTrait<X, Y>): void {
      if (this.owner.dataSet.trait === null) {
        const dataSetTrait = plotTrait.getTrait(DataSetTrait) as DataSetTrait<X, Y>;
        if (dataSetTrait !== null) {
          this.owner.dataSet.setTrait(dataSetTrait);
        }
      }
      const plotView = this.view;
      if (plotView !== null) {
        const fill = plotTrait.fill.value;
        if (fill !== null) {
          this.owner.setFill(fill);
        }
      }
    },
    willAttachTrait(plotTrait: AreaPlotTrait<X, Y>): void {
      this.owner.callObservers("controllerWillAttachPlotTrait", plotTrait, this.owner);
    },
    didDetachTrait(plotTrait: AreaPlotTrait<X, Y>): void {
      this.owner.callObservers("controllerDidDetachPlotTrait", plotTrait, this.owner);
    },
    traitDidSetFill(fill: ColorOrLook | null): void {
      this.owner.setFill(fill);
    },
    viewType: AreaPlotView,
    observesView: true,
    initView(plotView: AreaPlotView<X, Y>): void {
      const dataPointControllers = this.owner.dataPoints.controllers;
      for (const controllerId in dataPointControllers) {
        const dataPointController = dataPointControllers[controllerId]!;
        dataPointController.dataPoint.insertView(plotView);
      }
      const plotTrait = this.trait;
      if (plotTrait !== null) {
        const fill = plotTrait.fill.value;
        if (fill !== null) {
          this.owner.setFill(fill);
        }
      }
    },
    willAttachView(plotView: AreaPlotView<X, Y>): void {
      this.owner.callObservers("controllerWillAttachPlotView", plotView, this.owner);
    },
    didDetachView(plotView: AreaPlotView<X, Y>): void {
      this.owner.callObservers("controllerDidDetachPlotView", plotView, this.owner);
    },
    viewDidSetFill(fill: Color | null): void {
      this.owner.callObservers("controllerDidSetPlotFill", fill, this.owner);
    },
  })
  readonly plot!: TraitViewRefDef<this, {
    trait: AreaPlotTrait<X, Y>,
    observesTrait: true,
    view: AreaPlotView<X, Y>,
    observesView: true,
  }>;
  static readonly plot: FastenerClass<AreaPlotController["plot"]>;
}
