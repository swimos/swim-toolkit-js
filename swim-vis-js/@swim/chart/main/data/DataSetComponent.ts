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
import type {Length} from "@swim/math";
import type {Trait} from "@swim/model";
import type {GraphicsView} from "@swim/graphics";
import {
  Component,
  ComponentProperty,
  ComponentTrait,
  ComponentFastener,
  CompositeComponent,
} from "@swim/component";
import type {DataPointView} from "./DataPointView";
import type {DataPointTrait} from "./DataPointTrait";
import {DataPointComponent} from "./DataPointComponent";
import {DataSetTrait} from "./DataSetTrait";
import type {DataSetComponentObserver} from "./DataSetComponentObserver";

export class DataSetComponent<X, Y> extends CompositeComponent {
  constructor() {
    super();
    Object.defineProperty(this, "dataPointFasteners", {
      value: [],
      enumerable: true,
    });
  }

  declare readonly componentObservers: ReadonlyArray<DataSetComponentObserver<X, Y>>;

  protected initDataSetTrait(dataSetTrait: DataSetTrait<X, Y>): void {
    // hook
  }

  protected attachDataSetTrait(dataSetTrait: DataSetTrait<X, Y>): void {
    const dataPointFasteners = dataSetTrait.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointTrait = dataPointFasteners[i]!.trait;
      if (dataPointTrait !== null) {
        this.insertDataPointTrait(dataPointTrait);
      }
    }
  }

  protected detachDataSetTrait(dataSetTrait: DataSetTrait<X, Y>): void {
    const dataPointFasteners = dataSetTrait.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointTrait = dataPointFasteners[i]!.trait;
      if (dataPointTrait !== null) {
        this.removeDataPointTrait(dataPointTrait);
      }
    }
  }

  protected willSetDataSetTrait(newDataSetTrait: DataSetTrait<X, Y> | null, oldDataSetTrait: DataSetTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetTrait !== void 0) {
        componentObserver.dataSetWillSetTrait(newDataSetTrait, oldDataSetTrait, this);
      }
    }
  }

  protected onSetDataSetTrait(newDataSetTrait: DataSetTrait<X, Y> | null, oldDataSetTrait: DataSetTrait<X, Y> | null): void {
    if (oldDataSetTrait !== null) {
      this.detachDataSetTrait(oldDataSetTrait);
    }
    if (newDataSetTrait !== null) {
      this.attachDataSetTrait(newDataSetTrait);
      this.initDataSetTrait(newDataSetTrait);
    }
  }

  protected didSetDataSetTrait(newDataSetTrait: DataSetTrait<X, Y> | null, oldDataSetTrait: DataSetTrait<X, Y> | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetDidSetTrait !== void 0) {
        componentObserver.dataSetDidSetTrait(newDataSetTrait, oldDataSetTrait, this);
      }
    }
  }

  /** @hidden */
  static DataSetFastener = ComponentTrait.define<DataSetComponent<unknown, unknown>, DataSetTrait<unknown, unknown>>({
    type: DataSetTrait,
    observe: true,
    willSetTrait(newDataSetTrait: DataSetTrait<unknown, unknown> | null, oldDataSetTrait: DataSetTrait<unknown, unknown> | null): void {
      this.owner.willSetDataSetTrait(newDataSetTrait, oldDataSetTrait);
    },
    onSetTrait(newDataSetTrait: DataSetTrait<unknown, unknown> | null, oldDataSetTrait: DataSetTrait<unknown, unknown> | null): void {
      this.owner.onSetDataSetTrait(newDataSetTrait, oldDataSetTrait);
    },
    didSetTrait(newDataSetTrait: DataSetTrait<unknown, unknown> | null, oldDataSetTrait: DataSetTrait<unknown, unknown> | null): void {
      this.owner.didSetDataSetTrait(newDataSetTrait, oldDataSetTrait);
    },
    dataSetTraitWillSetDataPoint(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null, targetTrait: Trait): void {
      if (oldDataPointTrait !== null) {
        this.owner.removeDataPointTrait(oldDataPointTrait);
      }
    },
    dataSetTraitDidSetDataPoint(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null, targetTrait: Trait): void {
      if (newDataPointTrait !== null) {
        this.owner.insertDataPointTrait(newDataPointTrait, targetTrait);
      }
    },
  });

  @ComponentTrait<DataSetComponent<X, Y>, DataSetTrait<X, Y>>({
    extends: DataSetComponent.DataSetFastener,
  })
  declare dataSet: ComponentTrait<this, DataSetTrait<X, Y>>;

  insertDataPoint(dataPointComponent: DataPointComponent<X, Y>, targetComponent: Component | null = null): void {
    const dataPointFasteners = this.dataPointFasteners as ComponentFastener<this, DataPointComponent<X, Y>>[];
    let targetIndex = dataPointFasteners.length;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      if (dataPointFastener.component === dataPointComponent) {
        return;
      } else if (dataPointFastener.component === targetComponent) {
        targetIndex = i;
      }
    }
    const dataPointFastener = this.createDataPointFastener(dataPointComponent);
    dataPointFasteners.splice(targetIndex, 0, dataPointFastener);
    dataPointFastener.setComponent(dataPointComponent, targetComponent);
    if (this.isMounted()) {
      dataPointFastener.mount();
    }
  }

  removeDataPoint(dataPointComponent: DataPointComponent<X, Y>): void {
    const dataPointFasteners = this.dataPointFasteners as ComponentFastener<this, DataPointComponent<X, Y>>[];
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      if (dataPointFastener.component === dataPointComponent) {
        dataPointFastener.setComponent(null);
        if (this.isMounted()) {
          dataPointFastener.unmount();
        }
        dataPointFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected createDataPoint(dataPointTrait: DataPointTrait<X, Y>): DataPointComponent<X, Y> | null {
    return new DataPointComponent<X, Y>();
  }

  protected initDataPoint(dataPointComponent: DataPointComponent<X, Y>, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const dataPointView = dataPointComponent.dataPoint.view;
    if (dataPointView !== null) {
      this.initDataPointView(dataPointView, dataPointFastener);
      const labelView = dataPointView.label.view;
      if (labelView !== null) {
        this.initDataPointLabelView(labelView, dataPointFastener);
      }
    }
  }

  protected willSetDataPoint(newDataPointComponent: DataPointComponent<X, Y> | null, oldDataPointComponent: DataPointComponent<X, Y> | null,
                             dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPoint !== void 0) {
        componentObserver.dataSetWillSetDataPoint(newDataPointComponent, oldDataPointComponent, dataPointFastener);
      }
    }
  }

  protected onSetDataPoint(newDataPointComponent: DataPointComponent<X, Y> | null, oldDataPointComponent: DataPointComponent<X, Y> | null,
                           dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    if (newDataPointComponent !== null) {
      this.initDataPoint(newDataPointComponent, dataPointFastener);
    }
  }

  protected didSetDataPoint(newDataPointComponent: DataPointComponent<X, Y> | null, oldDataPointComponent: DataPointComponent<X, Y> | null,
                            dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetDidSetDataPoint !== void 0) {
        componentObserver.dataSetDidSetDataPoint(newDataPointComponent, oldDataPointComponent, dataPointFastener);
      }
    }
  }

  insertDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, targetTrait: Trait | null = null): void {
    const dataPointFasteners = this.dataPointFasteners as ComponentFastener<this, DataPointComponent<X, Y>>[];
    let targetComponent: DataPointComponent<X, Y> | null = null;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointComponent = dataPointFasteners[i]!.component;
      if (dataPointComponent !== null) {
        if (dataPointComponent.dataPoint.trait === dataPointTrait) {
          return;
        } else if (dataPointComponent.dataPoint.trait === targetTrait) {
          targetComponent = dataPointComponent;
        }
      }
    }
    const dataPointComponent = this.createDataPoint(dataPointTrait);
    if (dataPointComponent !== null) {
      this.insertChildComponent(dataPointComponent, targetComponent);
      dataPointComponent.dataPoint.setTrait(dataPointTrait);
      if (dataPointComponent.dataPoint.view === null) {
        const dataPointView = this.createDataPointView(dataPointComponent);
        let targetView: DataPointView<X, Y> | null = null;
        if (targetComponent !== null) {
          targetView = targetComponent.dataPoint.view;
        }
        dataPointComponent.dataPoint.setView(dataPointView, targetView);
      }
    }
  }

  removeDataPointTrait(dataPointTrait: DataPointTrait<X, Y>): void {
    const dataPointFasteners = this.dataPointFasteners as ComponentFastener<this, DataPointComponent<X, Y>>[];
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      const dataPointComponent = dataPointFastener.component;
      if (dataPointComponent !== null && dataPointComponent.dataPoint.trait === dataPointTrait) {
        dataPointFastener.setComponent(null);
        if (this.isMounted()) {
          dataPointFastener.unmount();
        }
        dataPointFasteners.splice(i, 1);
        dataPointComponent.remove();
        return;
      }
    }
  }

  protected initDataPointTrait(dataPointTrait: DataPointTrait<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected willSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointTrait !== void 0) {
        componentObserver.dataSetWillSetDataPointTrait(newDataPointTrait, oldDataPointTrait, dataPointFastener);
      }
    }
  }

  protected onSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    if (newDataPointTrait !== null) {
      this.initDataPointTrait(newDataPointTrait, dataPointFastener);
    }
  }

  protected didSetDataPointTrait(newDataPointTrait: DataPointTrait<X, Y> | null, oldDataPointTrait: DataPointTrait<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetDidSetDataPointTrait !== void 0) {
        componentObserver.dataSetDidSetDataPointTrait(newDataPointTrait, oldDataPointTrait, dataPointFastener);
      }
    }
  }

  protected createDataPointView(dataPointComponent: DataPointComponent<X, Y>): DataPointView<X, Y> | null {
    return dataPointComponent.dataPoint.createView();
  }

  protected initDataPointView(dataPointView: DataPointView<X, Y>, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected willSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointView !== void 0) {
        componentObserver.dataSetWillSetDataPointView(newDataPointView, oldDataPointView, dataPointFastener);
      }
    }
  }

  protected onSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    if (newDataPointView !== null) {
      this.initDataPointView(newDataPointView, dataPointFastener);
      const labelView = newDataPointView.label.view;
      if (labelView !== null) {
        this.initDataPointLabelView(labelView, dataPointFastener);
      }
    }
  }

  protected didSetDataPointView(newDataPointView: DataPointView<X, Y> | null, oldDataPointView: DataPointView<X, Y> | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetDidSetDataPointView !== void 0) {
        componentObserver.dataSetDidSetDataPointView(newDataPointView, oldDataPointView, dataPointFastener);
      }
    }
  }

  protected willSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointX !== void 0) {
        componentObserver.dataSetWillSetDataPointX(newX, oldX, dataPointFastener);
      }
    }
  }

  protected onSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected didSetDataPointX(newX: X | undefined, oldX: X | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointX !== void 0) {
        componentObserver.dataSetWillSetDataPointX(newX, oldX, dataPointFastener);
      }
    }
  }

  protected willSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointY !== void 0) {
        componentObserver.dataSetWillSetDataPointY(newY, oldY, dataPointFastener);
      }
    }
  }

  protected onSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected didSetDataPointY(newY: Y | undefined, oldY: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointY !== void 0) {
        componentObserver.dataSetWillSetDataPointY(newY, oldY, dataPointFastener);
      }
    }
  }

  protected willSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointY2 !== void 0) {
        componentObserver.dataSetWillSetDataPointY2(newY2, oldY2, dataPointFastener);
      }
    }
  }

  protected onSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected didSetDataPointY2(newY2: Y | undefined, oldY2: Y | undefined, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointY2 !== void 0) {
        componentObserver.dataSetWillSetDataPointY2(newY2, oldY2, dataPointFastener);
      }
    }
  }

  protected willSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointRadius !== void 0) {
        componentObserver.dataSetWillSetDataPointRadius(newRadius, oldRadius, dataPointFastener);
      }
    }
  }

  protected onSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected didSetDataPointRadius(newRadius: Length | null, oldRadius: Length | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointRadius !== void 0) {
        componentObserver.dataSetWillSetDataPointRadius(newRadius, oldRadius, dataPointFastener);
      }
    }
  }

  protected initDataPointLabelView(labelView: GraphicsView, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    // hook
  }

  protected willSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetWillSetDataPointLabelView !== void 0) {
        componentObserver.dataSetWillSetDataPointLabelView(newLabelView, oldLabelView, dataPointFastener);
      }
    }
  }

  protected onSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    if (newLabelView !== null) {
      this.initDataPointLabelView(newLabelView, dataPointFastener);
    }
  }

  protected didSetDataPointLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, dataPointFastener: ComponentFastener<this, DataPointComponent<X, Y>>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dataSetDidSetDataPointLabelView !== void 0) {
        componentObserver.dataSetDidSetDataPointLabelView(newLabelView, oldLabelView, dataPointFastener);
      }
    }
  }

  @ComponentProperty({type: Timing, state: true})
  declare dataPointTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  /** @hidden */
  static DataPointFastener = ComponentFastener.define<DataSetComponent<unknown, unknown>, DataPointComponent<unknown, unknown>>({
    type: DataPointComponent,
    child: false,
    observe: true,
    willSetComponent(newDataPointComponent: DataPointComponent<unknown, unknown> | null, oldDataPointComponent: DataPointComponent<unknown, unknown> | null): void {
      this.owner.willSetDataPoint(newDataPointComponent, oldDataPointComponent, this);
    },
    onSetComponent(newDataPointComponent: DataPointComponent<unknown, unknown> | null, oldDataPointComponent: DataPointComponent<unknown, unknown> | null): void {
      this.owner.onSetDataPoint(newDataPointComponent, oldDataPointComponent, this);
    },
    didSetComponent(newDataPointComponent: DataPointComponent<unknown, unknown> | null, oldDataPointComponent: DataPointComponent<unknown, unknown> | null): void {
      this.owner.didSetDataPoint(newDataPointComponent, oldDataPointComponent, this);
    },
    dataPointWillSetTrait(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null): void {
      this.owner.willSetDataPointTrait(newDataPointTrait, oldDataPointTrait, this);
    },
    dataPointDidSetTrait(newDataPointTrait: DataPointTrait<unknown, unknown> | null, oldDataPointTrait: DataPointTrait<unknown, unknown> | null): void {
      this.owner.onSetDataPointTrait(newDataPointTrait, oldDataPointTrait, this);
      this.owner.didSetDataPointTrait(newDataPointTrait, oldDataPointTrait, this);
    },
    dataPointWillSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null): void {
      this.owner.willSetDataPointView(newDataPointView, oldDataPointView, this);
    },
    dataPointDidSetView(newDataPointView: DataPointView<unknown, unknown> | null, oldDataPointView: DataPointView<unknown, unknown> | null): void {
      this.owner.onSetDataPointView(newDataPointView, oldDataPointView, this);
      this.owner.didSetDataPointView(newDataPointView, oldDataPointView, this);
    },
    dataPointWillSetX(newValue: number, oldValue: number): void {
      this.owner.willSetDataPointX(newValue, oldValue, this);
    },
    dataPointDidSetX(newValue: number, oldValue: number): void {
      this.owner.onSetDataPointX(newValue, oldValue, this);
      this.owner.didSetDataPointX(newValue, oldValue, this);
    },
    dataPointWillSetLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetDataPointLabelView(newLabelView, oldLabelView, this);
    },
    dataPointDidSetLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetDataPointLabelView(newLabelView, oldLabelView, this);
      this.owner.didSetDataPointLabelView(newLabelView, oldLabelView, this);
    },
  });

  protected createDataPointFastener(dataPointComponent: DataPointComponent<X, Y>): ComponentFastener<this, DataPointComponent<X, Y>> {
    return new DataSetComponent.DataPointFastener(this as DataSetComponent<unknown, unknown>, dataPointComponent.key, "dataPoint") as ComponentFastener<this, DataPointComponent<X, Y>>;
  }

  /** @hidden */
  declare readonly dataPointFasteners: ReadonlyArray<ComponentFastener<this, DataPointComponent<X, Y>>>;

  protected getDataPointFastener(dataPointTrait: DataPointTrait<X, Y>): ComponentFastener<this, DataPointComponent<X, Y>> | null {
    const dataPointFasteners = this.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      const dataPointComponent = dataPointFastener.component;
      if (dataPointComponent !== null && dataPointComponent.dataPoint.trait === dataPointTrait) {
        return dataPointFastener;
      }
    }
    return null;
  }

  /** @hidden */
  protected mountDataPointFasteners(): void {
    const dataPointFasteners = this.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      dataPointFastener.mount();
    }
  }

  /** @hidden */
  protected unmountDataPointFasteners(): void {
    const dataPointFasteners = this.dataPointFasteners;
    for (let i = 0, n = dataPointFasteners.length; i < n; i += 1) {
      const dataPointFastener = dataPointFasteners[i]!;
      dataPointFastener.unmount();
    }
  }

  protected detectDataPointComponent(component: Component): DataPointComponent<X, Y> | null {
    return component instanceof DataPointComponent ? component : null;
  }

  protected onInsertDataPointComponent(dataPointComponent: DataPointComponent<X, Y>, targetComponent: Component | null): void {
    this.insertDataPoint(dataPointComponent, targetComponent);
  }

  protected onRemoveDataPointComponent(dataPointComponent: DataPointComponent<X, Y>): void {
    this.removeDataPoint(dataPointComponent);
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    const dataPointComponent = this.detectDataPointComponent(childComponent);
    if (dataPointComponent !== null) {
      this.onInsertDataPointComponent(dataPointComponent, targetComponent);
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    const dataPointComponent = this.detectDataPointComponent(childComponent);
    if (dataPointComponent !== null) {
      this.onRemoveDataPointComponent(dataPointComponent);
    }
  }

  /** @hidden */
  protected mountComponentFasteners(): void {
    super.mountComponentFasteners();
    this.mountDataPointFasteners();
  }

  /** @hidden */
  protected unmountComponentFasteners(): void {
    this.unmountDataPointFasteners();
    super.unmountComponentFasteners();
  }
}
