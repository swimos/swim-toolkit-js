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

import {Class, Lazy} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import type {Trait} from "@swim/model";
import {Presence} from "@swim/style";
import {Look, Mood} from "@swim/theme";
import type {PositionGestureInput} from "@swim/view";
import {VectorIcon} from "@swim/graphics";
import {Controller, TraitViewRef, TraitViewControllerRefDef} from "@swim/controller";
import {
  ToolLayout,
  BarLayout,
  ToolView,
  ToolTrait,
  ToolController,
  ButtonToolController,
  BarView,
  BarController,
} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import {SheetController} from "../sheet/SheetController";
import type {NavBarControllerObserver} from "./NavBarControllerObserver";

/** @public */
export class NavBarController extends BarController {
  override readonly observerType?: Class<NavBarControllerObserver>;

  @PropertyDef({valueType: Boolean, value: true, updateFlags: Controller.NeedsAssemble})
  readonly showBackTitle!: PropertyDef<this, {value: boolean}>;

  protected override createLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();

    const frontController = this.front.controller;
    const frontKey = frontController !== null ? "title" + frontController.uid : void 0;
    const backController = frontController !== null ? frontController.back.controller : null;
    const backKey = backController !== null ? "title" + backController.uid : void 0;
    const showBackTitle = this.showBackTitle.value;

    if (frontController === null || backController === null) {
      const closeToolController = this.closeTool.controller;
      if (closeToolController !== null) {
        const closeToolLayout = closeToolController.layout.value;
        if (closeToolLayout !== null) {
          tools.push(closeToolLayout);
        }
        const closeToolView = closeToolController.tool.view;
        if (closeToolView !== null) {
          this.closeTool.insertView();
          closeToolView.zIndex.setState(2, Affinity.Intrinsic);
        }
      }
    } else {
      const backToolController = this.backTool.controller;
      if (backToolController !== null) {
        let backToolLayout = backToolController.layout.value;
        if (backToolLayout !== null) {
          if (showBackTitle) {
            backToolLayout = backToolLayout.withOverlap(backKey).withOverpad(16);
          }
          tools.push(backToolLayout);
        }
        const backToolView = this.backTool.insertView();
        backToolView.zIndex.setState(2, Affinity.Intrinsic);
      }
    }

    if (showBackTitle) {
      if (backController !== null) {
        const backLayout = ToolLayout.create(backKey!, 0, 0, 0, 0, -1, -1);
        tools.push(backLayout);
        const backTitleView = backController.titleTool.insertView(this.bar.view, void 0, void 0, backKey);
        if (backTitleView !== null) {
          const timing = backTitleView.getLookOr(Look.timing, Mood.navigating, false);
          backTitleView.color.setLook(Look.accentColor, timing, Affinity.Intrinsic);
          backTitleView.zIndex.setState(3, Affinity.Intrinsic);
          backTitleView.pointerEvents.setState("none", Affinity.Intrinsic);
        }
      }
      if (frontController !== null) {
        const frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 1, 1);
        tools.push(frontLayout);
        const frontTitleView = frontController.titleTool.insertView(this.bar.view, void 0, void 0, frontKey);
        if (frontTitleView !== null) {
          const timing = frontTitleView.getLookOr(Look.timing, Mood.navigating, false);
          frontTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
          frontTitleView.zIndex.setState(1, Affinity.Intrinsic);
          frontTitleView.pointerEvents.setState("auto", Affinity.Intrinsic);
        }
      }
    } else {
      const barView = this.bar.view;
      const oldBarLayout = barView !== null ? barView.layout.value : null;
      const oldBackLayout = oldBarLayout !== null && backKey !== void 0 ? oldBarLayout.getTool(backKey) : null;
      if (backController !== null && oldBackLayout !== null) {
        const backLayout = ToolLayout.create(backKey!, 0, 0, 0, 0, -1, -1).withPresence(Presence.dismissed());
        tools.push(backLayout);
      }
      if (frontController !== null) {
        let frontLayout: ToolLayout;
        if (oldBackLayout === null) {
          frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 0, 1);
        } else {
          frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 1, 1);
        }
        tools.push(frontLayout);
        const frontTitleView = frontController.titleTool.insertView(this.bar.view, void 0, void 0, frontKey);
        if (frontTitleView !== null) {
          const timing = frontTitleView.getLookOr(Look.timing, Mood.navigating, false);
          frontTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
          frontTitleView.zIndex.setState(1, Affinity.Intrinsic);
          frontTitleView.pointerEvents.setState("auto", Affinity.Intrinsic);
        }
      }
    }

    const moreToolController = this.moreTool.controller;
    if (moreToolController !== null) {
      const moreToolLayout = moreToolController.layout.value;
      if (moreToolLayout !== null) {
        tools.push(moreToolLayout);
      }
      if (moreToolController.tool.view !== null) {
        this.moreTool.insertView();
      }
    }

    return BarLayout.create(tools);
  }

  @TraitViewControllerRefDef<NavBarController["closeTool"]>({
    controllerType: ToolController,
    binds: true,
    observes: true,
    viewKey: "close",
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressCloseTool", input, event, this.owner);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolLayout = ToolLayout.create(this.viewKey!, 0, 0, 48);
      toolController.layout.setValue(toolLayout);
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(this.owner.closeIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly closeTool!: TraitViewControllerRefDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    observes: ToolController & ButtonToolController,
  }>;
  static readonly closeTool: FastenerClass<NavBarController["closeTool"]>;

  @TraitViewControllerRefDef<NavBarController["backTool"]>({
    controllerType: ToolController,
    binds: true,
    observes: true,
    viewKey: "back",
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressBackTool", input, event, this.owner);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolLayout = ToolLayout.create(this.viewKey!, 0, 0, 48);
      toolController.layout.setValue(toolLayout);
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(this.owner.backIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly backTool!: TraitViewControllerRefDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    observes: ToolController & ButtonToolController,
  }>;
  static readonly backTool: FastenerClass<NavBarController["backTool"]>;

  @TraitViewControllerRefDef<NavBarController["moreTool"]>({
    controllerType: ToolController,
    binds: true,
    observes: true,
    viewKey: "more",
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressMoreTool", input, event, this.owner);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolLayout = ToolLayout.create(this.viewKey!, 0, 0, 48);
      toolController.layout.setValue(toolLayout);
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(this.owner.moreIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly moreTool!: TraitViewControllerRefDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    observes: ToolController & ButtonToolController,
  }>;
  static readonly moreTool: FastenerClass<NavBarController["moreTool"]>;

  @TraitViewControllerRefDef<NavBarController["front"]>({
    controllerType: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(frontController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return frontController.sheet;
    },
    willAttachController(frontController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    didDetachController(frontController: SheetController): void {
      const sheetView = frontController.sheet.view;
      if (sheetView !== null && sheetView.back.view === null && sheetView.forward.view === null) {
        this.owner.requireUpdate(Controller.NeedsAssemble);
      }
    },
    controllerWillAttachTitleTool(titleToolController: ToolController, frontController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachTitleTool(titleToolController: ToolController, frontController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly front!: TraitViewControllerRefDef<this, {
    view: SheetView,
    controller: SheetController,
    observes: true,
  }>;
  static readonly front: FastenerClass<NavBarController["front"]>;

  get closeIcon(): VectorIcon {
    return NavBarController.closeIcon;
  }

  get backIcon(): VectorIcon {
    return NavBarController.backIcon;
  }

  get moreIcon(): VectorIcon {
    return NavBarController.moreIcon;
  }

  /** @internal */
  @Lazy
  static get closeIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12Z");
  }

  /** @internal */
  @Lazy
  static get backIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M17.77,3.77L16,2L6,12L16,22L17.77,20.23L9.54,12Z").withFillLook(Look.accentColor);
  }

  /** @internal */
  @Lazy
  static get moreIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M6,10c-1.1,0,-2,.9,-2,2s.9,2,2,2,2,-.9,2,-2,-.9,-2,-2,-2Zm12,0c-1.1,0,-2,.9,-2,2s.9,2,2,2,2,-.9,2,-2,-.9,-2,-2,-2Zm-6,0c-1.1,0,-2,.9,-2,2s.9,2,2,2,2,-.9,2,-2,-.9,-2,-2,-2Z");
  }
}
