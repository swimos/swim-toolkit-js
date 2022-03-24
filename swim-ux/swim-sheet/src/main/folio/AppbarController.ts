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

import {Class, Lazy, ObserverType} from "@swim/util";
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {Look, Mood} from "@swim/theme";
import type {PositionGestureInput} from "@swim/view";
import {VectorIcon} from "@swim/graphics";
import {Controller, TraitViewRef, TraitViewControllerRef} from "@swim/controller";
import {
  ToolLayout,
  BarLayout,
  ToolView,
  ToolTrait,
  ToolController,
  ButtonToolView,
  ButtonToolController,
  BarView,
  BarController,
} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import type {AppBarControllerObserver} from "./AppBarControllerObserver";

/** @public */
export class AppBarController extends BarController {
  override readonly observerType?: Class<AppBarControllerObserver>;

  protected override createLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();
    const coverView = this.cover.view;
    const coverKey = coverView !== null ? "cover" + coverView.uid : "cover";

    const menuToolController = this.menuTool.controller;
    if (menuToolController !== null) {
      const menuToolLayout = menuToolController.layout.value;
      if (menuToolLayout !== null) {
        tools.push(menuToolLayout);
      }
      if (menuToolController.tool.view !== null) {
        this.menuTool.insertView();
      }
    }

    const coverLayout = ToolLayout.create(coverKey, 1, 0, 0, 0);
    tools.push(coverLayout);
    if (coverView !== null) {
      const coverTitleView = coverView.titleTool.insertView(this.bar.view, void 0, void 0, coverKey);
      if (coverTitleView !== null) {
        const timing = coverTitleView.getLookOr(Look.timing, Mood.navigating, false);
        coverTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
        coverTitleView.zIndex.setState(1, Affinity.Intrinsic);
      }
    }

    const actionToolController = this.actionTool.controller;
    if (actionToolController !== null) {
      const actionToolLayout = actionToolController.layout.value;
      if (actionToolLayout !== null) {
        tools.push(actionToolLayout);
      }
      if (actionToolController.tool.view !== null) {
        this.actionTool.insertView();
      }
    }

    return BarLayout.create(tools);
  }

  @TraitViewControllerRef<AppBarController, ToolTrait, ToolView, ToolController, ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "menu",
    observes: true,
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressMenuTool", input, event, this.owner);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      toolController.layout.setValue(ToolLayout.create(this.viewKey!, 0, 0, 48));
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      if (this.owner.fullScreen.value) {
        toolView.graphics.setState(AppBarController.menuIcon, Affinity.Intrinsic);
      } else {
        toolView.graphics.setState(AppBarController.menuCloseIcon, Affinity.Intrinsic);
      }
      return toolController;
    },
  })
  readonly menuTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController>;
  static readonly menuTool: MemberFastenerClass<AppBarController, "menuTool">;

  @TraitViewControllerRef<AppBarController, ToolTrait, ToolView, ToolController, ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "action",
    observes: true,
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressActionTool", input, event, this.owner);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      toolController.layout.setValue(ToolLayout.create(this.viewKey!, 0, 0, 48));
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(AppBarController.actionIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly actionTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController>;
  static readonly actionTool: MemberFastenerClass<AppBarController, "actionTool">;

  @TraitViewControllerRef<AppBarController, SheetTrait, SheetView, SheetController>({
    type: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(coverController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return coverController.sheet;
    },
    willAttachController(coverController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(coverController: SheetController): void {
      const sheetView = coverController.sheet.view;
      if (sheetView !== null && sheetView.back.view === null && sheetView.forward.view === null) {
        this.owner.requireUpdate(Controller.NeedsAssemble);
      }
    },
    controllerWillAttachTitleToolView(titleToolView: ToolView, coverController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachTitleToolView(titleToolView: ToolView, coverController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly cover!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController>;
  static readonly cover: MemberFastenerClass<AppBarController, "cover">;

  @Property<AppBarController, boolean>({
    type: Boolean,
    value: false,
    inherits: true,
    didSetValue(fullScreen: boolean): void {
      const toolView = this.owner.menuTool.view;
      if (toolView instanceof ButtonToolView) {
        if (fullScreen) {
          toolView.graphics.setState(AppBarController.menuIcon, Affinity.Intrinsic);
        } else {
          toolView.graphics.setState(AppBarController.menuCloseIcon, Affinity.Intrinsic);
        }
      }
    },
  })
  readonly fullScreen!: Property<this, boolean>;

  /** @internal */
  @Lazy
  static get menuIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M3,18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3Z");
  }

  /** @internal */
  @Lazy
  static get menuCloseIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M3,18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18,9.59L17.42,12,21,8.41,19.59,7l-5,5,5,5L21,15.59Z");
  }

  /** @internal */
  @Lazy
  static get actionIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z");
  }
}
