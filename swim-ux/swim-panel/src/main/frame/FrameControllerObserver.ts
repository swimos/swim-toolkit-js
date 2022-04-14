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

import type {PanelView} from "../panel/PanelView";
import type {PanelTrait} from "../panel/PanelTrait";
import type {PanelController} from "../panel/PanelController";
import type {PanelControllerObserver} from "../panel/PanelControllerObserver";
import type {FrameView} from "./FrameView";
import type {FrameTrait} from "./FrameTrait";
import type {FrameController} from "./FrameController";

/** @public */
export interface FrameControllerObserver<C extends FrameController = FrameController> extends PanelControllerObserver<C> {
  controllerWillAttachPanelTrait?(frameTrait: FrameTrait, controller: C): void;

  controllerDidDetachPanelTrait?(frameTrait: FrameTrait, controller: C): void;

  controllerWillAttachPanelView?(frameView: FrameView, controller: C): void;

  controllerDidDetachPanelView?(frameView: FrameView, controller: C): void;

  controllerWillAttachPane?(paneController: PanelController, controller: C): void;

  controllerDidDetachPane?(paneController: PanelController, controller: C): void;

  controllerWillAttachPaneTrait?(paneTrait: PanelTrait, paneController: PanelController, controller: C): void;

  controllerDidDetachPaneTrait?(paneTrait: PanelTrait, paneController: PanelController, controller: C): void;

  controllerWillAttachPaneView?(paneView: PanelView, paneController: PanelController, controller: C): void;

  controllerDidDetachPaneView?(paneView: PanelView, paneController: PanelController, controller: C): void;
}
