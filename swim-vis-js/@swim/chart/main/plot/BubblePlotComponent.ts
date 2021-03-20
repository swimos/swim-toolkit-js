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

import type {Timing} from "@swim/mapping";
import type {Length} from "@swim/math";
import type {Color} from "@swim/style";
import {Look, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {ComponentViewTrait, ComponentFastener} from "@swim/component";
import type {DataPointComponent} from "../data/DataPointComponent";
import {DataSetTrait} from "../data/DataSetTrait";
import {BubblePlotView} from "./BubblePlotView";
import {BubblePlotTrait} from "./BubblePlotTrait";
import {ScatterPlotComponent} from "./ScatterPlotComponent";
import type {BubblePlotComponentObserver} from "./BubblePlotComponentObserver";

export class BubblePlotComponent<X, Y> extends ScatterPlotComponent<X, Y> {
  declare readonly componentObservers: ReadonlyArray<BubblePlotComponentObserver<X, Y>>;

  protected detectDataSet(plotTrait: BubblePlotTrait<X, Y>): DataSetTrait<X, Y> | null {
    return plotTrait.getTrait(DataSetTrait);
  }

  protected attachDataPoint(dataPointComponent: DataPointComponent<X, Y>, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    super.attachDataPoint(dataPointComponent, dataPointFastener);
    const dataPointView = dataPointComponent.dataPoint.view;
    if (dataPointView !== null && dataPointView.parentView === null) {
      const plotView = this.plot.view;
      if (plotView !== null) {
        dataPointComponent.dataPoint.injectView(plotView);
      }
    }
  }

  protected detachDataPoint(dataPointComponent: DataPointComponent<X, Y>, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    super.detachDataPoint(dataPointComponent, dataPointFastener);
    dataPointComponent.dataPoint.removeView();
  }

  protected initPlotTrait(plotTrait: BubblePlotTrait<X, Y>): void {
    if (this.dataSet.trait === null) {
      const dataSetTrait = this.detectDataSet(plotTrait);
      if (dataSetTrait !== null) {
        this.dataSet.setTrait(dataSetTrait);
      }
    }
  }

  protected attachPlotTrait(plotTrait: BubblePlotTrait<X, Y>): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      this.setPlotRadius(plotTrait.radius);
      this.setPlotFill(plotTrait.fill);
    }
  }

  protected detachPlotTrait(plotTrait: BubblePlotTrait<X, Y>): void {
    this.plot.removeView();
  }

  protected willSetPlotTrait(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.plotWillSetTrait !== void 0) {
        componentObserver.plotWillSetTrait(newPlotTrait, oldPlotTrait, this);
      }
    }
  }

  protected onSetPlotTrait(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null): void {
    if (oldPlotTrait !== null) {
      this.detachPlotTrait(oldPlotTrait);
    }
    if (newPlotTrait !== null) {
      this.attachPlotTrait(newPlotTrait);
      this.initPlotTrait(newPlotTrait);
    }
  }

  protected didSetPlotTrait(newPlotTrait: BubblePlotTrait<X, Y> | null, oldPlotTrait: BubblePlotTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.plotDidSetTrait !== void 0) {
        componentObserver.plotDidSetTrait(newPlotTrait, oldPlotTrait, this);
      }
    }
  }

  protected createPlotView(): BubblePlotView<X, Y> {
    return BubblePlotView.create<X, Y>();
  }

  protected initPlotView(plotView: BubblePlotView<X, Y>): void {
    // hook
  }

  protected themePlotView(plotView: BubblePlotView<X, Y>, theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected attachPlotView(plotView: BubblePlotView<X, Y>): void {
    const plotTrait = this.plot.trait;
    if (plotTrait !== null) {
      this.setPlotRadius(plotTrait.radius);
      this.setPlotFill(plotTrait.fill);
    }

    const dataPointFasteners = this.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointComponent = dataPointFasteners[i]!.component;
      if (dataPointComponent !== null) {
        dataPointComponent.dataPoint.injectView(plotView);
      }
    }
  }

  protected detachPlotView(plotView: BubblePlotView<X, Y>): void {
    // hook
  }

  protected willSetPlotView(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.plotWillSetView !== void 0) {
        componentObserver.plotWillSetView(newPlotView, oldPlotView, this);
      }
    }
  }

  protected onSetPlotView(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null): void {
    if (oldPlotView !== null) {
      this.detachPlotView(oldPlotView);
    }
    if (newPlotView !== null) {
      this.attachPlotView(newPlotView);
      this.initPlotView(newPlotView);
    }
  }

  protected didSetPlotView(newPlotView: BubblePlotView<X, Y> | null, oldPlotView: BubblePlotView<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.plotDidSetView !== void 0) {
        componentObserver.plotDidSetView(newPlotView, oldPlotView, this);
      }
    }
  }

  protected setPlotFill(fill: Look<Color> | Color | null): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      let timing = this.plotTiming.state;
      if (timing === true) {
        timing = plotView.getLook(Look.timing, Mood.ambient);
      }
      if (fill instanceof Look) {
        plotView.fill.setLook(fill, timing);
      } else {
        plotView.fill.setLook(null);
        plotView.fill.setAutoState(fill, timing);
      }
    }
  }

  protected setPlotRadius(radius: Length | null): void {
    const plotView = this.plot.view;
    if (plotView !== null) {
      let timing = this.plotTiming.state;
      if (timing === true) {
        timing = plotView.getLook(Look.timing, Mood.ambient);
      }
      plotView.radius.setAutoState(radius, timing);
    }
  }

  /** @hidden */
  static PlotFastener = ComponentViewTrait.define<BubblePlotComponent<unknown, unknown>, BubblePlotView<unknown, unknown>, BubblePlotTrait<unknown, unknown>>({
    viewType: BubblePlotView,
    observeView: true,
    willSetView(newPlotView: BubblePlotView<unknown, unknown> | null, oldPlotView: BubblePlotView<unknown, unknown> | null): void {
      this.owner.willSetPlotView(newPlotView, oldPlotView);
    },
    onSetView(newPlotView: BubblePlotView<unknown, unknown> | null, oldPlotView: BubblePlotView<unknown, unknown> | null): void {
      this.owner.onSetPlotView(newPlotView, oldPlotView);
    },
    didSetView(newPlotView: BubblePlotView<unknown, unknown> | null, oldPlotView: BubblePlotView<unknown, unknown> | null): void {
      this.owner.didSetPlotView(newPlotView, oldPlotView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, plotView: BubblePlotView<unknown, unknown>): void {
      this.owner.themePlotView(plotView, theme, mood, timing);
    },
    createView(): BubblePlotView<unknown, unknown> | null {
      return this.owner.createPlotView();
    },
    traitType: BubblePlotTrait,
    observeTrait: true,
    willSetTrait(newPlotTrait: BubblePlotTrait<unknown, unknown> | null, oldPlotTrait: BubblePlotTrait<unknown, unknown> | null): void {
      this.owner.willSetPlotTrait(newPlotTrait, oldPlotTrait);
    },
    onSetTrait(newPlotTrait: BubblePlotTrait<unknown, unknown> | null, oldPlotTrait: BubblePlotTrait<unknown, unknown> | null): void {
      this.owner.onSetPlotTrait(newPlotTrait, oldPlotTrait);
    },
    didSetTrait(newPlotTrait: BubblePlotTrait<unknown, unknown> | null, oldPlotTrait: BubblePlotTrait<unknown, unknown> | null): void {
      this.owner.didSetPlotTrait(newPlotTrait, oldPlotTrait);
    },
    bubblePlotTraitDidSetRadius(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
      this.owner.setPlotRadius(newStrokeWidth);
    },
    bubblePlotTraitDidSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
      this.owner.setPlotFill(newFill);
    },
  });

  @ComponentViewTrait<BubblePlotComponent<X, Y>, BubblePlotView<X, Y>, BubblePlotTrait<X, Y>>({
    extends: BubblePlotComponent.PlotFastener,
  })
  declare plot: ComponentViewTrait<this, BubblePlotView<X, Y>, BubblePlotTrait<X, Y>>;
}
