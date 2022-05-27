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
import {FastenerClass, PropertyDef} from "@swim/component";
import type {Length} from "@swim/math";
import {Trait, TraitRefDef} from "@swim/model";
import type {Color} from "@swim/style";
import type {GraphicsView} from "@swim/graphics";
import {Controller, TraitViewRef, TraitViewControllerSetDef} from "@swim/controller";
import type {DataPointView} from "./DataPointView";
import type {DataPointTrait} from "./DataPointTrait";
import {DataPointController} from "./DataPointController";
import {DataSetTrait} from "./DataSetTrait";
import type {DataSetControllerObserver} from "./DataSetControllerObserver";

/** @public */
export class DataSetController<X = unknown, Y = unknown> extends Controller {
  override readonly observerType?: Class<DataSetControllerObserver<X, Y>>;

  @TraitRefDef<DataSetController<X, Y>["dataSet"]>({
    traitType: DataSetTrait,
    observes: true,
    willAttachTrait(dataSetTrait: DataSetTrait<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataSetTrait", dataSetTrait, this.owner);
    },
    didAttachTrait(dataSetTrait: DataSetTrait<X, Y>): void {
      this.owner.dataPoints.addTraits(dataSetTrait.dataPoints.traits);
    },
    willDetachTrait(dataSetTrait: DataSetTrait<X, Y>): void {
      this.owner.dataPoints.deleteTraits(dataSetTrait.dataPoints.traits);
    },
    didDetachTrait(dataSetTrait: DataSetTrait<X, Y>): void {
      this.owner.callObservers("controllerDidDetachDataSetTrait", dataSetTrait, this.owner);
    },
    traitWillAttachDataPoint(dataPointTrait: DataPointTrait<X, Y>, targetTrait: Trait): void {
      this.owner.dataPoints.addTrait(dataPointTrait, targetTrait);
    },
    traitDidDetachDataPoint(dataPointTrait: DataPointTrait<X, Y>): void {
      this.owner.dataPoints.deleteTrait(dataPointTrait);
    },
  })
  readonly dataSet!: TraitRefDef<this, {trait: DataSetTrait<X, Y>, observes: true}>;
  static readonly dataSet: FastenerClass<DataSetController["dataSet"]>;

  @PropertyDef({valueType: Timing, value: true})
  readonly dataPointTiming!: PropertyDef<this, {value: Timing | boolean | undefined, valueInit: AnyTiming}>;

  @TraitViewControllerSetDef<DataSetController<X, Y>["dataPoints"]>({
    controllerType: DataPointController,
    binds: true,
    observes: true,
    getTraitViewRef(dataPointController: DataPointController<X, Y>): TraitViewRef<unknown, DataPointTrait<X, Y>, DataPointView<X, Y>> {
      return dataPointController.dataPoint;
    },
    willAttachController(dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPoint", dataPointController, this.owner);
    },
    didAttachController(dataPointController: DataPointController<X, Y>): void {
      const dataPointTrait = dataPointController.dataPoint.trait;
      if (dataPointTrait !== null) {
        this.attachDataPointTrait(dataPointTrait, dataPointController);
      }
      const dataPointView = dataPointController.dataPoint.view;
      if (dataPointView !== null) {
        this.attachDataPointView(dataPointView, dataPointController);
      }
      const parentView = this.parentView;
      if (parentView !== null) {
        dataPointController.dataPoint.insertView(parentView);
      }
    },
    willDetachController(dataPointController: DataPointController<X, Y>): void {
      const dataPointView = dataPointController.dataPoint.view;
      if (dataPointView !== null) {
        this.detachDataPointView(dataPointView, dataPointController);
      }
      const dataPointTrait = dataPointController.dataPoint.trait;
      if (dataPointTrait !== null) {
        this.detachDataPointTrait(dataPointTrait, dataPointController);
      }
    },
    didDetachController(dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidDetachDataPoint", dataPointController, this.owner);
    },
    controllerWillAttachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPointTrait", dataPointTrait, dataPointController, this.owner);
      this.attachDataPointTrait(dataPointTrait, dataPointController);
    },
    controllerDidDetachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void {
      this.detachDataPointTrait(dataPointTrait, dataPointController);
      this.owner.callObservers("controllerDidDetachDataPointTrait", dataPointTrait, dataPointController, this.owner);
    },
    attachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void {
      // hook
    },
    detachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void {
      // hook
    },
    controllerWillAttachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPointView", dataPointView, dataPointController, this.owner);
      this.attachDataPointView(dataPointView, dataPointController);
    },
    controllerDidDetachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void {
      this.detachDataPointView(dataPointView, dataPointController);
      this.owner.callObservers("controllerDidDetachDataPointView", dataPointView, dataPointController, this.owner);
    },
    attachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void {
      const labelView = dataPointView.label.view;
      if (labelView !== null) {
        this.attachDataPointLabelView(labelView, dataPointController);
      }
    },
    detachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void {
      const labelView = dataPointView.label.view;
      if (labelView !== null) {
        this.detachDataPointLabelView(labelView, dataPointController);
      }
      dataPointView.remove();
    },
    controllerDidSetDataPointX(x: X | undefined, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointX", x, dataPointController, this.owner);
    },
    controllerDidSetDataPointY(y: Y | undefined, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointY", y, dataPointController, this.owner);
    },
    controllerDidSetDataPointY2(y2: Y | undefined, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointY2", y2, dataPointController, this.owner);
    },
    controllerDidSetDataPointRadius(radius: Length | null, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointRadius", radius, dataPointController, this.owner);
    },
    controllerDidSetDataPointColor(color: Color | null, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointColor", color, dataPointController, this.owner);
    },
    controllerDidSetDataPointOpacity(opacity: number | undefined, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerDidSetDataPointOpacity", opacity, dataPointController, this.owner);
    },
    controllerWillAttachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void {
      this.owner.callObservers("controllerWillAttachDataPointLabelView", labelView, dataPointController, this.owner);
      this.attachDataPointLabelView(labelView, dataPointController);
    },
    controllerDidDetachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void {
      this.detachDataPointLabelView(labelView, dataPointController);
      this.owner.callObservers("controllerDidDetachDataPointLabelView", labelView, dataPointController, this.owner);
    },
    attachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void {
      // hook
    },
    detachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void {
      // hook
    },
  })
  readonly dataPoints!: TraitViewControllerSetDef<this, {
    trait: DataPointTrait<X, Y>,
    view: DataPointView<X, Y>,
    controller: DataPointController<X, Y>,
    implements: {
      attachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void;
      detachDataPointTrait(dataPointTrait: DataPointTrait<X, Y>, dataPointController: DataPointController<X, Y>): void;
      attachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void;
      detachDataPointView(dataPointView: DataPointView<X, Y>, dataPointController: DataPointController<X, Y>): void;
      attachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void;
      detachDataPointLabelView(labelView: GraphicsView, dataPointController: DataPointController<X, Y>): void;
    },
    observes: true,
  }>;
  static readonly dataPoints: FastenerClass<DataSetController["dataPoints"]>;
}
