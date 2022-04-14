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

import type {ControllerObserver} from "@swim/controller";
import type {PanelView} from "./PanelView";
import type {PanelTrait} from "./PanelTrait";
import type {PanelController} from "./PanelController";

/** @public */
export interface PanelControllerObserver<C extends PanelController = PanelController> extends ControllerObserver<C> {
  controllerWillAttachPanelTrait?(panelTrait: PanelTrait, controller: C): void;

  controllerDidDetachPanelTrait?(panelTrait: PanelTrait, controller: C): void;

  controllerWillAttachPanelView?(panelView: PanelView, controller: C): void;

  controllerDidDetachPanelView?(panelView: PanelView, controller: C): void;
}
