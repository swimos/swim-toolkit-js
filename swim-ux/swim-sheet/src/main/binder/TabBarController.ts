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
import type {Trait} from "@swim/model";
import type {PositionGestureInput} from "@swim/view";
import {FastenerClass, PropertyDef} from "@swim/component";
import {
  Controller,
  TraitViewRef,
  TraitViewControllerRefDef,
  TraitViewControllerSetDef,
} from "@swim/controller";
import {ToolLayout, BarLayout, ToolController, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import {SheetController} from "../sheet/SheetController";
import type {TabBarControllerObserver} from "./TabBarControllerObserver";
import type {BinderTabStyle} from "./BinderView";

/** @public */
export class TabBarController extends BarController {
  override readonly observerType?: Class<TabBarControllerObserver>;

  protected override createLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();
    tools.push(ToolLayout.create("leftPadding", 0.5, 0, 0, 0));

    const tabControllers = new Array<SheetController>();
    for (const controllerId in this.tabs.controllers) {
      tabControllers.push(this.tabs.controllers[controllerId]!);
    }
    if (this.tabStyle.value === "bottom") {
      for (let i = 0, n = tabControllers.length; i < n; i += 1) {
        const tabController = tabControllers[i]!;
        const tabToolView = tabController.buttonTool.attachView();
        const tabKey = "tab" + tabToolView.uid;
        const tabToolLayout = ToolLayout.create(tabKey, 1, 0, 0, 0.5);
        tools.push(tabToolLayout);
        const targetTabController = i + 1 < n ? tabControllers[i + 1] : null;
        const targetToolView = targetTabController !== null ? tabController.buttonTool.view : null;
        tabController.buttonTool.insertView(this.bar.view, void 0, targetToolView, tabKey);
      }
    }

    tools.push(ToolLayout.create("rightPadding", 0.5, 0, 0, 1));
    return BarLayout.create(tools);
  }

  @TraitViewControllerSetDef<TabBarController["tabs"]>({
    controllerType: SheetController,
    ordered: true,
    inherits: true,
    observes: true,
    getTraitViewRef(tabController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return tabController.sheet;
    },
    willAttachController(tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerWillAttachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidPressButtonTool(input: PositionGestureInput, event: Event | null, tabController: SheetController): void {
      this.owner.callObservers("controllerDidPressTabTool", input, event, tabController, this.owner);
    },
    controllerDidLongPressButtonTool(input: PositionGestureInput, tabController: SheetController): void {
      this.owner.callObservers("controllerDidLongPressTabTool", input, tabController, this.owner);
    },
  })
  readonly tabs!: TraitViewControllerSetDef<this, {
    view: SheetView,
    controller: SheetController,
    observes: true,
  }>;
  static readonly tabs: FastenerClass<TabBarController["tabs"]>;

  @TraitViewControllerRefDef<TabBarController["active"]>({
    controllerType: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(activeController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return activeController.sheet;
    },
    willAttachController(activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(activeController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerWillAttachButtonTool(buttonToolController: ToolController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachButtonTool(buttonToolController: ToolController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly active!: TraitViewControllerRefDef<this, {
    trait: Trait,
    view: SheetView,
    controller: SheetController,
    observes: true,
  }>;
  static readonly active: FastenerClass<TabBarController["active"]>;

  @PropertyDef<TabBarController["tabStyle"]>({
    valueType: String,
    value: "none",
    inherits: true,
    didSetValue(tabStyle: BinderTabStyle): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly tabStyle!: PropertyDef<this, {value: BinderTabStyle}>;
}
