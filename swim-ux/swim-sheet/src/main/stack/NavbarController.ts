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
import {Presence} from "@swim/style";
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
  ButtonToolController,
  BarView,
  BarController,
} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import type {NavBarControllerObserver} from "./NavBarControllerObserver";

/** @public */
export class NavBarController extends BarController {
  override readonly observerType?: Class<NavBarControllerObserver>;

  @Property({type: Boolean, value: true, updateFlags: Controller.NeedsAssemble})
  readonly showBackTitle!: Property<this, boolean>;

  protected override createLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();
    const frontView = this.front.view;
    const frontKey = frontView !== null ? "title" + frontView.uid : void 0;
    const backView = frontView !== null ? frontView.back.view : null;
    const backKey = backView !== null ? "title" + backView.uid : void 0;
    const showBackTitle = this.showBackTitle.value;

    if (frontView === null || backView === null) {
      this.backTool.removeView();
      const closeToolController = this.closeTool.controller;
      if (closeToolController !== null) {
        const closeToolLayout = closeToolController.layout.value;
        if (closeToolLayout !== null) {
          tools.push(closeToolLayout);
        }
        if (closeToolController.tool.view !== null) {
          this.closeTool.insertView();
        }
      }
    } else {
      this.closeTool.removeView();
      this.backTool.insertView();
      const backToolController = this.backTool.controller;
      if (backToolController !== null) {
        let backToolLayout = backToolController.layout.value;
        if (backToolLayout !== null) {
          if (showBackTitle) {
            backToolLayout = backToolLayout.withOverlap(backKey).withOverpad(16);
          }
          tools.push(backToolLayout);
        }
      }
    }

    if (showBackTitle) {
      if (backView !== null) {
        const backLayout = ToolLayout.create(backKey!, 0, 0, 0, 0, -1, -1);
        tools.push(backLayout);
        const backTitleView = backView.titleTool.insertView(this.bar.view, void 0, void 0, backKey);
        if (backTitleView !== null) {
          const timing = backTitleView.getLookOr(Look.timing, Mood.navigating, false);
          backTitleView.color.setLook(Look.accentColor, timing, Affinity.Intrinsic);
          backTitleView.zIndex.setState(1, Affinity.Intrinsic);
        }
      }
      if (frontView !== null) {
        const frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 1, 1);
        tools.push(frontLayout);
        const frontTitleView = frontView.titleTool.insertView(this.bar.view, void 0, void 0, frontKey);
        if (frontTitleView !== null) {
          const timing = frontTitleView.getLookOr(Look.timing, Mood.navigating, false);
          frontTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
          frontTitleView.zIndex.setState(1, Affinity.Intrinsic);
        }
      }
    } else {
      const barView = this.bar.view;
      const oldBarLayout = barView !== null ? barView.layout.value : null;
      const oldBackLayout = oldBarLayout !== null && backKey !== void 0 ? oldBarLayout.getTool(backKey) : null;
      if (backView !== null) {
        if (oldBackLayout !== null) {
          const backLayout = ToolLayout.create(backKey!, 0, 0, 0, 0, -1, -1).withPresence(Presence.dismissed());
          tools.push(backLayout);
        } else {
          backView.titleTool.removeView();
        }
      }
      if (frontView !== null) {
        let frontLayout: ToolLayout;
        if (oldBackLayout === null) {
          frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 0, 1);
        } else {
          frontLayout = ToolLayout.create(frontKey!, 1, 0, 0, 0.5, 1, 1);
        }
        tools.push(frontLayout);
        const frontTitleView = frontView.titleTool.insertView(this.bar.view, void 0, void 0, frontKey);
        if (frontTitleView !== null) {
          const timing = frontTitleView.getLookOr(Look.timing, Mood.navigating, false);
          frontTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
          frontTitleView.zIndex.setState(1, Affinity.Intrinsic);
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

  @TraitViewControllerRef<NavBarController, ToolTrait, ToolView, ToolController, ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "close",
    observes: true,
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
      toolController.layout.setValue(ToolLayout.create(this.viewKey!, 0, 0, 48));
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(NavBarController.closeIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly closeTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController>;
  static readonly closeTool: MemberFastenerClass<NavBarController, "closeTool">;

  @TraitViewControllerRef<NavBarController, ToolTrait, ToolView, ToolController, ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "back",
    observes: true,
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
      toolController.layout.setValue(ToolLayout.create(this.viewKey!, 0, 0, 48));
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(NavBarController.backIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly backTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController>;
  static readonly backTool: MemberFastenerClass<NavBarController, "backTool">;

  @TraitViewControllerRef<NavBarController, ToolTrait, ToolView, ToolController, ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "more",
    observes: true,
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
      toolController.layout.setValue(ToolLayout.create(this.viewKey!, 0, 0, 48));
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(NavBarController.moreIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly moreTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController>;
  static readonly moreTool: MemberFastenerClass<NavBarController, "moreTool">;

  @TraitViewControllerRef<NavBarController, SheetTrait, SheetView, SheetController>({
    type: SheetController,
    inherits: true,
    observes: true,
    getTraitViewRef(frontController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
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
    controllerWillAttachTitleToolView(titleToolView: ToolView, frontController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
    controllerDidDetachTitleToolView(titleToolView: ToolView, frontController: SheetController): void {
      this.owner.requireUpdate(Controller.NeedsAssemble);
    },
  })
  readonly front!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController>;
  static readonly front: MemberFastenerClass<NavBarController, "front">;

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
