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

import type {Class} from "@swim/util";
import type {TimingLike} from "@swim/util";
import {Timing} from "@swim/util";
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {LengthLike} from "@swim/math";
import type {Length} from "@swim/math";
import type {Color} from "@swim/style";
import {Look} from "@swim/theme";
import {Mood} from "@swim/theme";
import type {ColorOrLookLike} from "@swim/theme";
import type {ColorOrLook} from "@swim/theme";
import {ViewRef} from "@swim/view";
import type {GraphicsView} from "@swim/graphics";
import type {ControllerObserver} from "@swim/controller";
import {Controller} from "@swim/controller";
import {TraitViewRef} from "@swim/controller";
import {DataPointView} from "./DataPointView";
import {DataPointTrait} from "./DataPointTrait";

/** @public */
export interface DataPointControllerObserver<X = unknown, Y = unknown, C extends DataPointController<X, Y> = DataPointController<X, Y>> extends ControllerObserver<C> {
  controllerWillAttachDataPointTrait?(dataPointTrait: DataPointTrait<X, Y>, controller: C): void;

  controllerDidDetachDataPointTrait?(dataPointTrait: DataPointTrait<X, Y>, controller: C): void;

  controllerWillAttachDataPointView?(dataPointView: DataPointView<X, Y>, controller: C): void;

  controllerDidDetachDataPointView?(dataPointView: DataPointView<X, Y> , controller: C): void;

  controllerDidSetDataPointX?(x: X | undefined, controller: C): void;

  controllerDidSetDataPointY?(y: Y | undefined, controller: C): void;

  controllerDidSetDataPointY2?(y2: Y | undefined, controller: C): void;

  controllerDidSetDataPointRadius?(radius: Length | null, controller: C): void;

  controllerDidSetDataPointColor?(color: Color | null, controller: C): void;

  controllerDidSetDataPointOpacity?(opacity: number | undefined, controller: C): void;

  controllerWillAttachDataPointLabelView?(labelView: GraphicsView, controller: C): void;

  controllerDidDetachDataPointLabelView?(labelView: GraphicsView, controller: C): void;
}

/** @public */
export class DataPointController<X = unknown, Y = unknown> extends Controller {
  declare readonly observerType?: Class<DataPointControllerObserver<X, Y>>;

  protected updateLabel(x: X | undefined, y: Y | undefined, dataPointTrait: DataPointTrait<X, Y>): void {
    const label = dataPointTrait.formatLabel(x, y);
    if (label !== void 0) {
      dataPointTrait.label.setValue(label, Affinity.Intrinsic);
    }
  }

  protected setX(x: X, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    dataPointView.x.setState(x, timing, Affinity.Intrinsic);
  }

  protected setY(y: Y, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    dataPointView.y.setState(y, timing, Affinity.Intrinsic);
  }

  protected setY2(y2: Y | undefined, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    dataPointView.y2.setState(y2, timing, Affinity.Intrinsic);
  }

  protected setRadius(radius: LengthLike | null, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    dataPointView.radius.setState(radius, timing, Affinity.Intrinsic);
  }

  protected setColor(color: ColorOrLookLike | null, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    if (color instanceof Look) {
      dataPointView.color.setLook(color, timing, Affinity.Intrinsic);
    } else {
      dataPointView.color.setState(color, timing, Affinity.Intrinsic);
    }
  }

  protected setOpacity(opacity: number | undefined, timing?: TimingLike | boolean): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    } else if (timing === void 0 || timing === true) {
      timing = this.dataPointTiming.value;
      if (timing === true) {
        timing = dataPointView.getLook(Look.timing, Mood.ambient);
      }
    } else {
      timing = Timing.fromLike(timing);
    }
    dataPointView.opacity.setState(opacity, timing, Affinity.Intrinsic);
  }

  protected setLabelView(label: string | undefined): void {
    const dataPointView = this.dataPoint.view;
    if (dataPointView === null) {
      return;
    }
    dataPointView.label.setText(label);
  }

  @Property({valueType: Timing, inherits: true})
  get dataPointTiming(): Property<this, Timing | boolean | undefined> {
    return Property.dummy();
  }

  @TraitViewRef({
    traitType: DataPointTrait,
    observesTrait: true,
    willAttachTrait(dataPointTrait: DataPointTrait<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPointTrait", dataPointTrait, this.owner);
    },
    didAttachTrait(dataPointTrait: DataPointTrait<X, Y>): void {
      const dataPointView = this.view;
      if (dataPointView !== null) {
        this.owner.setX(dataPointTrait.x.value);
        this.owner.setY(dataPointTrait.y.value);
        const y2 = dataPointTrait.tryFastener("y2");
        if (y2 !== null) {
          this.owner.setY2(y2.value);
        }
        const radius = dataPointTrait.tryFastener("radius");
        if (radius !== null) {
          this.owner.setRadius(radius.value);
        }
        const color = dataPointTrait.tryFastener("color");
        if (color !== null) {
          this.owner.setColor(color.value);
        }
        const opacity = dataPointTrait.tryFastener("opacity");
        if (opacity !== null) {
          this.owner.setOpacity(opacity.value);
        }
        const label = dataPointTrait.tryFastener("label");
        if (label !== null) {
          this.owner.setLabelView(label.value);
        }
      }
    },
    willDetachTrait(dataPointTrait: DataPointTrait<X, Y>): void {
      const dataPointView = this.view;
      if (dataPointView !== null) {
        this.owner.setLabelView(void 0);
      }
    },
    didDetachTrait(dataPointTrait: DataPointTrait<X, Y>): void {
      this.owner.callObservers("controllerDidDetachDataPointTrait", dataPointTrait, this.owner);
    },
    traitDidSetX(x: X): void {
      this.owner.setX(x);
    },
    traitDidSetY(y: Y): void {
      this.owner.setY(y);
    },
    traitDidSetY2(y2: Y | undefined): void {
      this.owner.setY2(y2);
    },
    traitDidSetRadius(radius: Length | null): void {
      this.owner.setRadius(radius);
    },
    traitDidSetColor(color: ColorOrLook | null): void {
      this.owner.setColor(color);
    },
    traitDidSetOpacity(opacity: number | undefined): void {
      this.owner.setOpacity(opacity);
    },
    traitDidSetLabel(label: string | undefined): void {
      this.owner.setLabelView(label);
    },
    viewType: DataPointView,
    observesView: true,
    willAttachView(dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPointView", dataPointView, this.owner);
    },
    didAttachView(dataPointView: DataPointView<X, Y>): void {
      this.owner.label.setView(dataPointView.label.view);
      const dataPointTrait = this.trait;
      if (dataPointTrait === null) {
        return;
      }
        this.owner.setX(dataPointTrait.x.value);
        this.owner.setY(dataPointTrait.y.value);
        const y2 = dataPointTrait.tryFastener("y2");
        if (y2 !== null) {
          this.owner.setY2(y2.value);
        }
        const radius = dataPointTrait.tryFastener("radius");
        if (radius !== null) {
          this.owner.setRadius(radius.value);
        }
        const color = dataPointTrait.tryFastener("color");
        if (color !== null) {
          this.owner.setColor(color.value);
        }
        const opacity = dataPointTrait.tryFastener("opacity");
        if (opacity !== null) {
          this.owner.setOpacity(opacity.value);
        }
        const label = dataPointTrait.tryFastener("label");
        if (label !== null) {
          this.owner.setLabelView(label.value);
        }
        const x = dataPointView.x.value;
        const y = dataPointView.y.value;
        this.owner.updateLabel(x, y, dataPointTrait);
    },
    willDetachView(dataPointView: DataPointView<X, Y>): void {
      this.owner.label.setView(null);
    },
    didDetachView(dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerDidDetachDataPointView", dataPointView, this.owner);
    },
    viewDidSetX(x: X | undefined, dataPointView: DataPointView<X, Y>): void {
      const dataPointTrait = this.trait;
      if (dataPointTrait !== null) {
        const y = dataPointView.y.value;
        this.owner.updateLabel(x, y, dataPointTrait);
      }
      this.owner.callObservers("controllerDidSetDataPointX", x, this.owner);
    },
    viewDidSetY(y: Y | undefined, dataPointView: DataPointView<X, Y>): void {
      const dataPointTrait = this.trait;
      if (dataPointTrait !== null) {
        const x = dataPointView.x.value;
        this.owner.updateLabel(x, y, dataPointTrait);
      }
      this.owner.callObservers("controllerDidSetDataPointY", y, this.owner);
    },
    viewDidSetY2(y2: Y | undefined, dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointY2", y2, this.owner);
    },
    viewDidSetRadius(radius: Length | null, dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointRadius", radius, this.owner);
    },
    viewDidSetColor(color: Color | null, dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointColor", color, this.owner);
    },
    viewDidSetOpacity(opacity: number | undefined, dataPointView: DataPointView<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointOpacity", opacity, this.owner);
    },
    viewWillAttachLabel(labelView: GraphicsView): void {
      this.owner.label.setView(labelView);
    },
    viewDidDetachLabel(labelView: GraphicsView): void {
      this.owner.label.setView(null);
    },
    createView(): DataPointView<X, Y> {
      const dataPointView = new DataPointView<X, Y>();
      const dataPointTrait = this.trait;
      if (dataPointTrait !== null) {
        dataPointView.x.setState(dataPointTrait.x.value, Affinity.Intrinsic);
        dataPointView.y.setState(dataPointTrait.y.value, Affinity.Intrinsic);
        const y2 = dataPointTrait.tryFastener("y2");
        if (y2 !== null) {
          dataPointView.y2.setState(y2.value, Affinity.Intrinsic);
        }
        const radius = dataPointTrait.tryFastener("radius");
        if (radius !== null) {
          dataPointView.radius.setState(radius.value, Affinity.Intrinsic);
        }
      }
      return dataPointView;
    },
  })
  readonly dataPoint!: TraitViewRef<this, DataPointTrait<X, Y>, DataPointView<X, Y>> & Observes<DataPointTrait<X, Y>> & Observes<DataPointView<X, Y>>;

  @ViewRef({
    viewKey: true,
    willAttachView(labelView: GraphicsView): void {
      this.owner.callObservers("controllerWillAttachDataPointLabelView", labelView, this.owner);
    },
    didDetachView(labelView: GraphicsView): void {
      this.owner.callObservers("controllerDidDetachDataPointLabelView", labelView, this.owner);
    },
  })
  readonly label!: ViewRef<this, GraphicsView>;
}
