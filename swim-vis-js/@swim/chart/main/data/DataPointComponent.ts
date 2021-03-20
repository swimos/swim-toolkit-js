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

import {AnyTiming, Timing} from "@swim/mapping";
import type {AnyLength, Length} from "@swim/math";
import type {AnyColor, Color} from "@swim/style";
import {Look, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import type {GraphicsView} from "@swim/graphics";
import {ComponentProperty, ComponentView, ComponentViewTrait, CompositeComponent} from "@swim/component";
import {DataPointView} from "./DataPointView";
import {DataPointTrait} from "./DataPointTrait";
import type {DataPointComponentObserver} from "./DataPointComponentObserver";

export class DataPointComponent<X, Y> extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<DataPointComponentObserver<X, Y>>;

  get x(): X | undefined {
    const dataPointTrait = this.dataPoint.trait;
    return dataPointTrait !== null ? dataPointTrait.x : void 0;
  }

  get y(): Y | undefined {
    const dataPointTrait = this.dataPoint.trait;
    return dataPointTrait !== null ? dataPointTrait.y : void 0;
  }

  get y2(): Y | undefined {
    const dataPointTrait = this.dataPoint.trait;
    return dataPointTrait !== null ? dataPointTrait.y2 : void 0;
  }

  get radius(): Length | null {
    const dataPointTrait = this.dataPoint.trait;
    return dataPointTrait !== null ? dataPointTrait.radius : null;
  }

  get color(): Look<Color> | AnyColor | null {
    const dataPointTrait = this.dataPoint.trait;
    return dataPointTrait !== null ? dataPointTrait.color : null;
  }

  setX(x: X): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setX(x);
    }
  }

  setY(y: Y): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setY(y);
    }
  }

  setY2(y: Y): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setY2(y);
    }
  }

  setRadius(radius: AnyLength | null): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setRadius(radius);
    }
  }

  setColor(color: Look<Color> | AnyColor | null): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setColor(color);
    }
  }

  setLabel(label: GraphicsView | string | undefined): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      dataPointTrait.setLabel(label);
    }
  }

  protected initDataPointTrait(dataPointTrait: DataPointTrait<X, Y>): void {
    // hook
  }

  protected attachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      this.setDataPointX(dataPointTrait.x);
      this.setDataPointY(dataPointTrait.y);
      this.setDataPointY2(dataPointTrait.y2);
      this.setDataPointRadius(dataPointTrait.radius);
      this.setDataPointColor(dataPointTrait.color);
      this.setDataPointLabel(dataPointTrait.label);
    }
  }

  protected detachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      this.setDataPointLabel(void 0);
    }
  }

  protected willSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetTrait !== void 0) {
        componentObserver.dataPointWillSetTrait(newDataPointTrait, oldDataPointTrait, this);
      }
    }
  }

  protected onSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null): void {
    if (oldDataPointTrait !== null) {
      this.detachDataPointTrait(oldDataPointTrait);
    }
    if (newDataPointTrait !== null) {
      this.attachDataPointTrait(newDataPointTrait);
      this.initDataPointTrait(newDataPointTrait);
    }
  }

  protected didSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetTrait !== void 0) {
        componentObserver.dataPointDidSetTrait(newDataPointTrait, oldDataPointTrait, this);
      }
    }
  }

  protected createDataPointView(): DataPointView<X, Y> {
    return DataPointView.create();
  }

  protected initDataPointView(dataPointView: DataPointView<X, Y>): void {
    this.updateDataPointLabel(dataPointView);
  }

  protected themeDataPointView(dataPointView: DataPointView<X, Y>, theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected attachDataPointView(dataPointView: DataPointView<X, Y>): void {
    this.label.setView(dataPointView.label.view);

    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      this.setDataPointX(dataPointTrait.x);
      this.setDataPointY(dataPointTrait.y);
      this.setDataPointY2(dataPointTrait.y2);
      this.setDataPointRadius(dataPointTrait.radius);
      this.setDataPointColor(dataPointTrait.color);
      this.setDataPointLabel(dataPointTrait.label);
    }
  }

  protected detachDataPointView(dataPointView: DataPointView<X, Y>): void {
    this.label.setView(null);
  }

  protected willSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetView !== void 0) {
        componentObserver.dataPointWillSetView(newDataPointView, oldDataPointView, this);
      }
    }
  }

  protected onSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null): void {
    if (oldDataPointView !== null) {
      this.detachDataPointView(oldDataPointView);
    }
    if (newDataPointView !== null) {
      this.attachDataPointView(newDataPointView);
      this.initDataPointView(newDataPointView);
    }
  }

  protected didSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetView !== void 0) {
        componentObserver.dataPointDidSetView(newDataPointView, oldDataPointView, this);
      }
    }
  }

  protected setDataPointX(x: X): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      let timing = this.dataPointTiming.state;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
      dataPointView.x.setAutoState(x, timing);
    }
  }

  protected setDataPointY(y: Y): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      let timing = this.dataPointTiming.state;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
      dataPointView.y.setAutoState(y, timing);
    }
  }

  protected setDataPointY2(y2: Y | undefined): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      let timing = this.dataPointTiming.state;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
      dataPointView.y2.setAutoState(y2, timing);
    }
  }

  protected setDataPointRadius(radius: AnyLength | null): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      let timing = this.dataPointTiming.state;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
      dataPointView.radius.setAutoState(radius, timing);
    }
  }

  protected setDataPointColor(color: Look<Color> | AnyColor | null): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      let timing = this.dataPointTiming.state;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
      if (color instanceof Look) {
        dataPointView.color.setLook(color, timing);
      } else {
        dataPointView.color.setLook(null);
        dataPointView.color.setAutoState(color, timing);
      }
    }
  }

  protected willSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetX !== void 0) {
        componentObserver.dataPointWillSetX(newX, oldX, this);
      }
    }
  }

  protected onSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointView: DataPointView<X, Y>): void {
    this.updateDataPointLabel(dataPointView);
  }

  protected didSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetX !== void 0) {
        componentObserver.dataPointDidSetX(newX, oldX, this);
      }
    }
  }

  protected willSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetY !== void 0) {
        componentObserver.dataPointWillSetY(newY, oldY, this);
      }
    }
  }

  protected onSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    this.updateDataPointLabel(dataPointView);
  }

  protected didSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetY !== void 0) {
        componentObserver.dataPointDidSetY(newY, oldY, this);
      }
    }
  }

  protected willSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetY2 !== void 0) {
        componentObserver.dataPointWillSetY2(newY2, oldY2, this);
      }
    }
  }

  protected onSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    // hook
  }

  protected didSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetY2 !== void 0) {
        componentObserver.dataPointDidSetY2(newY2, oldY2, this);
      }
    }
  }

  protected willSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetRadius !== void 0) {
        componentObserver.dataPointWillSetRadius(newRadius, oldRadius, this);
      }
    }
  }

  protected onSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointView: DataPointView<X, Y>): void {
    // hook
  }

  protected didSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointView: DataPointView<X, Y>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetRadius !== void 0) {
        componentObserver.dataPointDidSetRadius(newRadius, oldRadius, this);
      }
    }
  }

  protected setDataPointLabel(label: GraphicsView | string | undefined): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView !== null) {
      dataPointView.label.setView(label !== void 0 ? label : null);
    }
  }

  protected initDataPointLabelView(labelView: GraphicsView): void {
    // hook
  }

  protected attachDataPointLabelView(labelView: GraphicsView): void {
    // hook
  }

  protected detachDataPointLabelView(labelView: GraphicsView): void {
    // hook
  }

  protected willSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointWillSetLabelView !== void 0) {
        componentObserver.dataPointWillSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected onSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (oldLabelView !== null) {
      this.detachDataPointLabelView(oldLabelView);
    }
    if (newLabelView !== null) {
      this.attachDataPointLabelView(newLabelView);
      this.initDataPointLabelView(newLabelView);
    }
  }

  protected didSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataPointDidSetLabelView !== void 0) {
        componentObserver.dataPointDidSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected updateDataPointLabel(dataPointView: DataPointView<X, Y>): void {
    const dataPointTrait = this.dataPoint.trait;
    if (dataPointTrait !== null) {
      const x = dataPointView.x.value;
      const y = dataPointView.y.value;
      const label = dataPointTrait.formatLabel(x, y);
      if (label !== void 0) {
        dataPointTrait.setLabel(label);
      }
    }
  }

  @ComponentProperty({type: Timing, inherit: true})
  declare dataPointTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  /** @hidden */
  static DataPointFastener = ComponentViewTrait.define<DataPointComponent<unknown, unknown>, DataPointView<unknown, unknown>, DataPointTrait<unknown, unknown>>({
    viewType: DataPointView,
    observeView: true,
    willSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null): void {
      this.owner.willSetDataPointView(newDataPointView, oldDataPointView);
    },
    onSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null): void {
      this.owner.onSetDataPointView(newDataPointView, oldDataPointView);
    },
    didSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null): void {
      this.owner.didSetDataPointView(newDataPointView, oldDataPointView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.themeDataPointView(dataPointView, theme, mood, timing);
    },
    dataPointViewWillSetX(newX: unknown | undefined, oldX: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.willSetDataPointX(newX, oldX, dataPointView);
    },
    dataPointViewDidSetX(newX: unknown | undefined, oldX: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointX(newX, oldX, dataPointView);
      this.owner.didSetDataPointX(newX, oldX, dataPointView);
    },
    dataPointViewWillSetY(newY: unknown | undefined, oldY: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.willSetDataPointY(newY, oldY, dataPointView);
    },
    dataPointViewDidSetY(newY: unknown | undefined, oldY: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointY(newY, oldY, dataPointView);
      this.owner.didSetDataPointY(newY, oldY, dataPointView);
    },
    dataPointViewWillSetY2(newY2: unknown | undefined, oldY2: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.willSetDataPointY2(newY2, oldY2, dataPointView);
    },
    dataPointViewDidSetY2(newY2: unknown | undefined, oldY2: unknown | undefined, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointY2(newY2, oldY2, dataPointView);
      this.owner.didSetDataPointY2(newY2, oldY2, dataPointView);
    },
    dataPointViewWillSetRadius(newRadius: Length | null, oldRadius: Length | null, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.willSetDataPointRadius(newRadius, oldRadius, dataPointView);
    },
    dataPointViewDidSetRadius(newRadius: Length | null, oldRadius: Length | null, dataPointView: DataPointView<unknown, unknown>): void {
      this.owner.onSetDataPointRadius(newRadius, oldRadius, dataPointView);
      this.owner.didSetDataPointRadius(newRadius, oldRadius, dataPointView);
    },
    dataPointViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      if (newLabelView !== null) {
        this.owner.label.setView(newLabelView);
      }
    },
    createView(): DataPointView<unknown, unknown> | null {
      return this.owner.createDataPointView();
    },
    traitType: DataPointTrait,
    observeTrait: true,
    willSetTrait(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null): void {
      this.owner.willSetDataPointTrait(newDataPointTrait, oldDataPointTrait);
    },
    onSetTrait(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null): void {
      this.owner.onSetDataPointTrait(newDataPointTrait, oldDataPointTrait);
    },
    didSetTrait(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null): void {
      this.owner.didSetDataPointTrait(newDataPointTrait, oldDataPointTrait);
    },
    dataPointTraitDidSetX(newX: unknown | undefined, oldX: unknown | undefined): void {
      this.owner.setDataPointX(newX);
    },
    dataPointTraitDidSetY(newY: unknown | undefined, oldY: unknown | undefined): void {
      this.owner.setDataPointY(newY);
    },
    dataPointTraitDidSetY2(newY2: unknown | undefined, oldY2: unknown | undefined): void {
      this.owner.setDataPointY2(newY2);
    },
    dataPointTraitDidSetRadius(newRadius: Length | null, oldRadius: Length | null): void {
      this.owner.setDataPointRadius(newRadius);
    },
    dataPointTraitDidSetColor(newColor: Look<Color> | Color | null, oldColor: Look<Color> | Color | null): void {
      this.owner.setDataPointColor(newColor);
    },
    dataPointTraitDidSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
      this.owner.setDataPointLabel(newLabel);
    },
  });

  @ComponentViewTrait<DataPointComponent<X, Y>, DataPointView<X, Y>, DataPointTrait<X, Y>>({
    extends: DataPointComponent.DataPointFastener,
  })
  declare dataPoint: ComponentViewTrait<this, DataPointView<X, Y>, DataPointTrait<X, Y>>;

  @ComponentView<DataPointComponent<X, Y>, GraphicsView>({
    key: true,
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetDataPointLabelView(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetDataPointLabelView(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetDataPointLabelView(newLabelView, oldLabelView);
    },
  })
  declare label: ComponentView<this, GraphicsView>;
}
