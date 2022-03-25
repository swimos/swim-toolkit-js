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
import type {ToolView, BarView, BarTrait, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import type {SheetController} from "../sheet/SheetController";
import type {SheetControllerObserver} from "../sheet/SheetControllerObserver";
import type {PanelView} from "./PanelView";
import type {PanelTrait} from "./PanelTrait";
import type {PanelController} from "./PanelController";

/** @public */
export interface PanelControllerObserver<C extends PanelController = PanelController> extends SheetControllerObserver<C> {
  controllerWillAttachPanelTrait?(panelTrait: PanelTrait, controller: C): void;

  controllerDidDetachPanelTrait?(panelTrait: PanelTrait, controller: C): void;

  controllerWillAttachPanelView?(panelView: PanelView, controller: C): void;

  controllerDidDetachPanelView?(panelView: PanelView, controller: C): void;

  controllerWillAttachTabBar?(tabBarController: BarController, controller: C): void;

  controllerDidDetachTabBar?(tabBarController: BarController, controller: C): void;

  controllerWillAttachTabBarTrait?(tabBarTrait: BarTrait, controller: C): void;

  controllerDidDetachTabBarTrait?(tabBarTrait: BarTrait, controller: C): void;

  controllerWillAttachTabBarView?(tabBarView: BarView, controller: C): void;

  controllerDidDetachTabBarView?(tabBarView: BarView, controller: C): void;

  controllerWillAttachTab?(tabController: SheetController, controller: C): void;

  controllerDidDetachTab?(tabController: SheetController, controller: C): void;

  controllerWillAttachTabTrait?(tabTrait: SheetTrait, tabController: SheetController, controller: C): void;

  controllerDidDetachTabTrait?(tabTrait: SheetTrait, tabController: SheetController, controller: C): void;

  controllerWillAttachTabView?(tabView: SheetView, tabController: SheetController, controller: C): void;

  controllerDidDetachTabView?(tabView: SheetView, tabController: SheetController, controller: C): void;

  controllerWillAttachTabIconToolView?(iconToolView: ToolView, tabController: SheetController, controller: C): void;

  controllerDidDetachTabIconToolView?(iconToolView: ToolView, tabController: SheetController, controller: C): void;

  controllerDidPressTabTool?(input: PositionGestureInput, event: Event | null, tabController: SheetController, controller: C): void;

  controllerDidLongPressTabTool?(input: PositionGestureInput, tabController: SheetController, controller: C): void;

  controllerWillAttachActive?(activeController: SheetController, controller: C): void;

  controllerDidDetachActive?(activeController: SheetController, controller: C): void;

  controllerWillAttachActiveTrait?(activeTrait: SheetTrait, controller: C): void;

  controllerDidDetachActiveTrait?(activeTrait: SheetTrait, controller: C): void;

  controllerWillAttachActiveView?(activeView: SheetView, controller: C): void;

  controllerDidDetachActiveView?(activeView: SheetView, controller: C): void;
}
