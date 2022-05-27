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

import type {Class} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import type {PositionGestureInput} from "@swim/view";
import {Controller, TraitViewRefDef} from "@swim/controller";
import {AnyToolLayout, ToolLayout} from "../layout/ToolLayout";
import {ToolView} from "./ToolView";
import {ToolTrait} from "./ToolTrait";
import type {ToolControllerObserver} from "./ToolControllerObserver";

/** @public */
export class ToolController extends Controller {
  override readonly observerType?: Class<ToolControllerObserver>;

  @TraitViewRefDef<ToolController["tool"]>({
    traitType: ToolTrait,
    observesTrait: true,
    initTrait(toolTrait: ToolTrait): void {
      this.owner.layout.setValue(toolTrait.layout.value, Affinity.Intrinsic);
    },
    willAttachTrait(toolTrait: ToolTrait): void {
      this.owner.callObservers("controllerWillAttachToolTrait", toolTrait, this.owner);
    },
    didDetachTrait(toolTrait: ToolTrait): void {
      this.owner.callObservers("controllerDidDetachToolTrait", toolTrait, this.owner);
    },
    traitDidSetToolLayout(toolLayout: ToolLayout | null): void {
      this.owner.layout.setValue(toolLayout, Affinity.Intrinsic);
    },
    viewType: ToolView,
    observesView: true,
    willAttachView(toolView: ToolView): void {
      this.owner.callObservers("controllerWillAttachToolView", toolView, this.owner);
    },
    didDetachView(toolView: ToolView): void {
      this.owner.callObservers("controllerDidDetachToolView", toolView, this.owner);
    },
    viewDidPress(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressToolView", input, event, this.owner);
    },
    viewDidLongPress(input: PositionGestureInput): void {
      this.owner.callObservers("controllerDidLongPressToolView", input, this.owner);
    },
  })
  readonly tool!: TraitViewRefDef<this, {
    trait: ToolTrait,
    observesTrait: true,
    view: ToolView,
    observesView: true,
  }>;
  static readonly tool: FastenerClass<ToolController["tool"]>;

  @PropertyDef<ToolController["layout"]>({
    valueType: ToolLayout,
    value: null,
    didSetValue(toolLayout: ToolLayout | null): void {
      this.owner.callObservers("controllerDidSetToolLayout", toolLayout, this.owner);
    },
  })
  readonly layout!: PropertyDef<this, {value: ToolLayout | null, valueInit: AnyToolLayout | null}>;
}
