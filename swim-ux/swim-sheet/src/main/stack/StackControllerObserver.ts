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
import type {ToolView, BarView, BarTrait, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import type {SheetController} from "../sheet/SheetController";
import type {StackView} from "./StackView";
import type {StackTrait} from "./StackTrait";
import type {StackController} from "./StackController";

/** @public */
export interface StackControllerObserver<C extends StackController = StackController> extends ControllerObserver<C> {
  controllerWillAttachStackTrait?(stackTrait: StackTrait, controller: C): void;

  controllerDidDetachStackTrait?(stackTrait: StackTrait, controller: C): void;

  controllerWillAttachStackView?(stackView: StackView, controller: C): void;

  controllerDidDetachStackView?(stackView: StackView, controller: C): void;

  controllerWillAttachNavbar?(navbarController: BarController, controller: C): void;

  controllerDidDetachNavbar?(navbarController: BarController, controller: C): void;

  controllerWillAttachNavbarTrait?(navbarTrait: BarTrait, controller: C): void;

  controllerDidDetachNavbarTrait?(navbarTrait: BarTrait, controller: C): void;

  controllerWillAttachNavbarView?(navbarView: BarView, controller: C): void;

  controllerDidDetachNavbarView?(navbarView: BarView, controller: C): void;

  controllerDidPressCloseTool?(input: PositionGestureInput, event: Event | null, controller: C): void;

  controllerDidPressBackTool?(input: PositionGestureInput, event: Event | null, controller: C): void;

  controllerDidPressMoreTool?(input: PositionGestureInput, event: Event | null, controller: C): void;

  controllerWillAttachSheet?(sheetController: SheetController, controller: C): void;

  controllerDidDetachSheet?(sheetController: SheetController, controller: C): void;

  controllerWillAttachSheetTrait?(sheetTrait: SheetTrait, sheetController: SheetController, controller: C): void;

  controllerDidDetachSheetTrait?(sheetTrait: SheetTrait, sheetController: SheetController, controller: C): void;

  controllerWillAttachSheetView?(sheetView: SheetView, sheetController: SheetController, controller: C): void;

  controllerDidDetachSheetView?(sheetView: SheetView, sheetController: SheetController, controller: C): void;

  controllerWillAttachSheetTitleView?(sheetTitleView: ToolView, sheetController: SheetController, controller: C): void;

  controllerDidDetachSheetTitleView?(sheetTitleView: ToolView, sheetController: SheetController, controller: C): void;

  controllerWillAttachActive?(activeController: SheetController, controller: C): void;

  controllerDidDetachActive?(activeController: SheetController, controller: C): void;

  controllerWillAttachActiveTrait?(activeTrait: SheetTrait, controller: C): void;

  controllerDidDetachActiveTrait?(activeTrait: SheetTrait, controller: C): void;

  controllerWillAttachActiveView?(activeView: SheetView, controller: C): void;

  controllerDidDetachActiveView?(activeView: SheetView, controller: C): void;
}
