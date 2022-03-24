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
import type {PositionGestureInput} from "@swim/view";
import {Affinity, MemberFastenerClass} from "@swim/component";
import {Look} from "@swim/theme";
import {
  Controller,
  TraitViewRef,
  TraitViewControllerRef,
  TraitViewControllerSet,
} from "@swim/controller";
import {ToolLayout, BarLayout, ToolView, ButtonToolView, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import type {TabBarControllerObserver} from "./TabBarControllerObserver";

/** @public */
export class TabBarController extends BarController {
  override readonly observerType?: Class<TabBarControllerObserver>;

  protected override createLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();
    tools.push(ToolLayout.create("left", 0.5, 0, 0, 0));

    const activeController = this.active.controller;
    const tabControllers = this.tabs.controllers;
    for (const controllerId in tabControllers) {
      const tabController = tabControllers[controllerId]!;
      const tabToolView = tabController.iconTool.view;
      if (tabToolView !== null) {
        const tabKey = "tab" + tabToolView.uid;
        const tabToolLayout = ToolLayout.create(tabKey, 1, 0, 0, 0.5);
        tools.push(tabToolLayout);
        tabController.iconTool.insertView(this.bar.view, void 0, void 0, tabKey);
        if (tabToolView instanceof ButtonToolView) {
          if (tabController === activeController) {
            tabToolView.iconColor.setLook(Look.accentColor, Affinity.Intrinsic);
          } else {
            tabToolView.iconColor.setLook(Look.iconColor, Affinity.Intrinsic);
          }
        }
      }
    }

    tools.push(ToolLayout.create("right", 0.5, 0, 0, 1));
    return BarLayout.create(tools);
  }

  @TraitViewControllerSet<TabBarController, SheetTrait, SheetView, SheetController>({
    type: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(tabController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return tabController.sheet;
    },
    willAttachController(tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerWillAttachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidPressIconTool(input: PositionGestureInput, event: Event | null, tabController: SheetController): void {
      this.owner.callObservers("controllerDidPressTabTool", input, event, tabController, this.owner);
    },
    controllerDidLongPressIconTool(input: PositionGestureInput, tabController: SheetController): void {
      this.owner.callObservers("controllerDidLongPressTabTool", input, tabController, this.owner);
    },
  })
  readonly tabs!: TraitViewControllerSet<this, SheetTrait, SheetView, SheetController>;
  static readonly tabs: MemberFastenerClass<TabBarController, "tabs">;

  @TraitViewControllerRef<TabBarController, SheetTrait, SheetView, SheetController>({
    type: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(activeController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return activeController.sheet;
    },
    willAttachController(activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerWillAttachIconToolView(iconToolView: ToolView, activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachIconToolView(iconToolView: ToolView, activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly active!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController>;
  static readonly active: MemberFastenerClass<TabBarController, "active">;
}
