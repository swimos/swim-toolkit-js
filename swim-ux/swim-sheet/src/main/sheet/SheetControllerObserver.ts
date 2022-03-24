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

import type {PositionGestureInput} from "@swim/view";
import type {ControllerObserver} from "@swim/controller";
import type {ToolView} from "@swim/toolbar";
import type {SheetView} from "./SheetView";
import type {SheetTrait} from "./SheetTrait";
import type {SheetController} from "./SheetController";

/** @public */
export interface SheetControllerObserver<C extends SheetController = SheetController> extends ControllerObserver<C> {
  controllerWillAttachSheetTrait?(sheetTrait: SheetTrait, controller: C): void;

  controllerDidDetachSheetTrait?(sheetTrait: SheetTrait, controller: C): void;

  controllerWillAttachSheetView?(sheetView: SheetView, controller: C): void;

  controllerDidDetachSheetView?(sheetView: SheetView, controller: C): void;

  controllerWillAttachBack?(backController: SheetController, controller: C): void;

  controllerDidDetachBack?(backController: SheetController, controller: C): void;

  controllerWillAttachBackView?(backView: SheetView, controller: C): void;

  controllerDidDetachBackView?(backView: SheetView, controller: C): void;

  controllerWillAttachForward?(forwardController: SheetController, controller: C): void;

  controllerDidDetachForward?(forwardController: SheetController, controller: C): void;

  controllerWillAttachForwardView?(forwardView: SheetView, controller: C): void;

  controllerDidDetachForwardView?(forwardView: SheetView, controller: C): void;

  controllerWillAttachTitleToolView?(titleToolView: ToolView, controller: C): void;

  controllerDidDetachTitleToolView?(titleToolView: ToolView, controller: C): void;

  controllerWillAttachIconToolView?(iconToolView: ToolView, controller: C): void;

  controllerDidDetachIconToolView?(iconToolView: ToolView, controller: C): void;

  controllerDidPressIconTool?(input: PositionGestureInput, event: Event | null, controller: C): void;

  controllerDidLongPressIconTool?(input: PositionGestureInput, controller: C): void;

  controllerWillPresentSheetView?(sheetView: SheetView, controller: C): void;

  controllerDidPresentSheetView?(sheetView: SheetView, controller: C): void;

  controllerWillDismissSheetView?(sheetView: SheetView, controller: C): void;

  controllerDidDismissSheetView?(sheetView: SheetView, controller: C): void;
}
