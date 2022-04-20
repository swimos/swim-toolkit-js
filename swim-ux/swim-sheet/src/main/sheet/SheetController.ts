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

import {Mutable, Class, Objects} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import type {Trait} from "@swim/model";
import {Look} from "@swim/theme";
import type {PositionGestureInput, ViewContextType} from "@swim/view";
import type {Graphics} from "@swim/graphics";
import {
  Controller,
  ControllerRefDef,
  TraitViewRefDef,
  TraitViewRef,
  TraitViewControllerRefDef,
  TraitViewControllerSetDef,
} from "@swim/controller";
import {
  ToolLayout,
  ToolView,
  ButtonToolView,
  ToolTrait,
  ToolController,
  TitleToolController,
  ButtonToolController,
} from "@swim/toolbar";
import {SheetView} from "./SheetView";
import type {SheetControllerObserver} from "./SheetControllerObserver";

/** @public */
export class SheetController extends Controller {
  override readonly observerType?: Class<SheetControllerObserver>;

  @PropertyDef<SheetController["fullBleed"]>({
    valueType: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.callObservers("controllerDidSetFullBleed", fullBleed, this.owner);
      const sheetView = this.owner.sheet.view;
      if (sheetView !== null) {
        sheetView.fullBleed.setValue(fullBleed, Affinity.Inherited);
      }
    },
  })
  readonly fullBleed!: PropertyDef<this, {value: boolean}>;

  @TraitViewRefDef<SheetController["sheet"]>({
    viewType: SheetView,
    observesView: true,
    willAttachTrait(sheetTrait: Trait): void {
      this.owner.callObservers("controllerWillAttachSheetTrait", sheetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: Trait): void {
      this.owner.callObservers("controllerDidDetachSheetTrait", sheetTrait, this.owner);
    },
    willAttachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillAttachSheetView", sheetView, this.owner);
    },
    didAttachView(sheetView: SheetView): void {
      this.owner.fullBleed.setValue(sheetView.fullBleed.value, Affinity.Intrinsic);
    },
    didDetachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidDetachSheetView", sheetView, this.owner);
    },
    viewDidScroll(viewContext: ViewContextType<SheetView>, sheetView: SheetView): void {
      this.owner.callObservers("controllerDidScrollSheetView", sheetView, this.owner);
    },
    viewWillAttachBack(backView: SheetView): void {
      this.owner.callObservers("controllerWillAttachBackView", backView, this.owner);
    },
    viewDidDetachBack(backView: SheetView): void {
      this.owner.callObservers("controllerDidDetachBackView", backView, this.owner);
    },
    viewWillAttachForward(forwardView: SheetView): void {
      this.owner.callObservers("controllerWillAttachForwardView", forwardView, this.owner);
    },
    viewDidDetachForward(forwardView: SheetView): void {
      this.owner.callObservers("controllerDidDetachForwardView", forwardView, this.owner);
    },
    viewDidSetFullBleed(fullBleed: boolean, sheetView: SheetView): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
    viewWillPresent(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillPresentSheetView", sheetView, this.owner);
    },
    viewDidPresent(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidPresentSheetView", sheetView, this.owner);
    },
    viewWillDismiss(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillDismissSheetView", sheetView, this.owner);
    },
    viewDidDismiss(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidDismissSheetView", sheetView, this.owner);
    },
  })
  readonly sheet!: TraitViewRefDef<this, {
    view: SheetView,
    observesView: true,
  }>;
  static readonly sheet: FastenerClass<SheetController["sheet"]>;

  @ControllerRefDef<SheetController["back"]>({
    controllerType: SheetController,
    binds: false,
    willAttachController(backController: SheetController): void {
      this.owner.callObservers("controllerWillAttachBack", backController, this.owner);
    },
    didDetachController(backController: SheetController): void {
      this.owner.callObservers("controllerDidDetachBack", backController, this.owner);
    },
  })
  readonly back!: ControllerRefDef<this, {controller: SheetController}>;
  static readonly back: FastenerClass<SheetController["back"]>;

  @ControllerRefDef<SheetController["forward"]>({
    controllerType: SheetController,
    binds: false,
    willAttachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerWillAttachForward", forwardController, this.owner);
    },
    didDetachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerDidDetachForward", forwardController, this.owner);
    },
  })
  readonly forward!: ControllerRefDef<this, {controller: SheetController}>;
  static readonly forward: FastenerClass<SheetController["forward"]>;

  @TraitViewControllerRefDef<SheetController["titleTool"]>({
    controllerType: ToolController,
    binds: true,
    observes: true,
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    willAttachController(toolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachTitleTool", toolController, this.owner);
    },
    didAttachController(toolController: ToolController): void {
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.attachToolTrait(toolTrait, toolController);
      }
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.attachToolView(toolView, toolController);
      }
    },
    willDetachController(toolController: ToolController): void {
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.detachToolView(toolView, toolController);
      }
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.detachToolTrait(toolTrait, toolController);
      }
    },
    didDetachController(toolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachTitleTool", toolController, this.owner);
    },
    controllerWillAttachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.attachToolTrait(toolTrait, toolController);
    },
    controllerDidDetachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.detachToolTrait(toolTrait, toolController);
    },
    attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    controllerWillAttachToolView(toolView: ToolView, toolController: ToolController): void {
      this.attachToolView(toolView, toolController);
    },
    controllerDidDetachToolView(toolView: ToolView, toolController: ToolController): void {
      this.detachToolView(toolView, toolController);
    },
    attachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
    detachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressTitleTool", input, event, this.owner);
    },
    controllerDidLongPressToolView(input: PositionGestureInput): void {
      this.owner.callObservers("controllerDidLongPressTitleTool", input, this.owner);
    },
    setText(title: string | undefined): ToolView {
      let toolController = this.controller as TitleToolController | null;
      if (toolController === null) {
        toolController = this.createController() as TitleToolController;
        this.setController(toolController);
      }
      const toolView = toolController.tool.attachView();
      toolView.content.setText(title);
      return toolView;
    },
    createController(): ToolController {
      const toolController = TitleToolController.create();
      const toolView = toolController.tool.attachView();
      toolView.fontSize.setState(14, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly titleTool!: TraitViewControllerRefDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    implements: {
      attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      attachToolView(toolView: ToolView, toolController: ToolController): void,
      detachToolView(toolView: ToolView, toolController: ToolController): void,
      setText(title: string | undefined): ToolView,
    },
    observes: true,
  }>;
  static readonly titleTool: FastenerClass<SheetController["titleTool"]>;

  @TraitViewControllerRefDef<SheetController["buttonTool"]>({
    controllerType: ToolController,
    binds: true,
    observes: true,
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    init(): void {
      (this as Mutable<typeof this>).active = false;
    },
    initController(toolController: ToolController): void {
      const buttonToolView = this.view;
      if (buttonToolView !== null) {
        this.updateActive(this.active, buttonToolView);
      }
    },
    willAttachController(toolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachButtonTool", toolController, this.owner);
    },
    didAttachController(toolController: ToolController): void {
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.attachToolTrait(toolTrait, toolController);
      }
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.attachToolView(toolView, toolController);
      }
    },
    willDetachController(toolController: ToolController): void {
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.detachToolView(toolView, toolController);
      }
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.detachToolTrait(toolTrait, toolController);
      }
    },
    didDetachController(toolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachButtonTool", toolController, this.owner);
    },
    controllerWillAttachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.attachToolTrait(toolTrait, toolController);
    },
    controllerDidDetachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.detachToolTrait(toolTrait, toolController);
    },
    attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    controllerWillAttachToolView(toolView: ToolView, toolController: ToolController): void {
      this.attachToolView(toolView, toolController);
      this.updateActive(this.active, toolView);
    },
    controllerDidDetachToolView(toolView: ToolView, toolController: ToolController): void {
      this.detachToolView(toolView, toolController);
    },
    attachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
    detachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressButtonTool", input, event, this.owner);
    },
    controllerDidLongPressToolView(input: PositionGestureInput): void {
      this.owner.callObservers("controllerDidLongPressButtonTool", input, this.owner);
    },
    setActive(active: boolean): void {
      (this as Mutable<typeof this>).active = active;
      const buttonToolView = this.view;
      if (buttonToolView !== null) {
        this.updateActive(active, buttonToolView);
      }
    },
    updateActive(active: boolean, buttonToolView: ToolView): void {
      if (buttonToolView instanceof ButtonToolView) {
        const timing = !buttonToolView.inserting ? buttonToolView.getLook(Look.timing) : false;
        if (active) {
          buttonToolView.iconColor.setLook(Look.accentColor, timing, Affinity.Intrinsic);
        } else {
          buttonToolView.iconColor.setLook(Look.iconColor, timing, Affinity.Intrinsic);
        }
      }
    },
    setIcon(icon: Graphics | null): void {
      let toolController = this.controller as ButtonToolController | null;
      if (toolController === null) {
        toolController = this.createController() as ButtonToolController;
        this.setController(toolController);
      }
      const toolView = toolController.tool.attachView();
      toolView.graphics.setState(icon, Affinity.Intrinsic);
    },
    createController(): ToolController {
      const toolController = ButtonToolController.create();
      const toolLayout = ToolLayout.create("", 0, 0, 36);
      toolController.layout.setValue(toolLayout);
      const toolView = toolController.tool.attachView();
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly buttonTool!: TraitViewControllerRefDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    defines: {
      readonly active: boolean;
    },
    implements: {
      attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      attachToolView(toolView: ToolView, toolController: ToolController): void,
      detachToolView(toolView: ToolView, toolController: ToolController): void,
      setActive(active: boolean): void,
      updateActive(active: boolean, buttonToolView: ToolView): void,
      setIcon(icon: Graphics | null): void,
    },
    observes: ToolController & ButtonToolController,
  }>;
  static readonly buttonTool: FastenerClass<SheetController["buttonTool"]>;

  @TraitViewControllerSetDef<SheetController["modeTools"]>({
    controllerType: ToolController,
    binds: false,
    ordered: true,
    observes: true,
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    willAttachController(toolController: ToolController): void {
      let targetToolController: ToolController | null | undefined = Objects.getNextValue(this.controllers, toolController.uid);
      if (targetToolController === void 0) {
        targetToolController = null;
      }
      this.owner.callObservers("controllerWillAttachModeTool", toolController, targetToolController, this.owner);
    },
    didAttachController(toolController: ToolController): void {
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.attachToolTrait(toolTrait, toolController);
      }
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.attachToolView(toolView, toolController);
      }
    },
    willDetachController(toolController: ToolController): void {
      const toolView = toolController.tool.view;
      if (toolView !== null) {
        this.detachToolView(toolView, toolController);
      }
      const toolTrait = toolController.tool.trait;
      if (toolTrait !== null) {
        this.detachToolTrait(toolTrait, toolController);
      }
    },
    didDetachController(toolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachModeTool", toolController, this.owner);
    },
    controllerWillAttachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachModeToolTrait", toolTrait, toolController, this.owner);
      this.attachToolTrait(toolTrait, toolController);
    },
    controllerDidDetachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      this.detachToolTrait(toolTrait, toolController);
      this.owner.callObservers("controllerDidDetachModeToolTrait", toolTrait, toolController, this.owner);
    },
    attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void {
      // hook
    },
    controllerWillAttachToolView(toolView: ToolView, toolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachModeToolView", toolView, toolController, this.owner);
      this.attachToolView(toolView, toolController);
    },
    controllerDidDetachToolView(toolView: ToolView, toolController: ToolController): void {
      this.detachToolView(toolView, toolController);
      this.owner.callObservers("controllerDidDetachModeToolView", toolView, toolController, this.owner);
    },
    attachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
    detachToolView(toolView: ToolView, toolController: ToolController): void {
      // hook
    },
  })
  readonly modeTools!: TraitViewControllerSetDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    implements: {
      attachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      detachToolTrait(toolTrait: ToolTrait, toolController: ToolController): void,
      attachToolView(toolView: ToolView, toolController: ToolController): void,
      detachToolView(toolView: ToolView, toolController: ToolController): void,
    },
    observes: true,
  }>;
  static readonly modeTools: FastenerClass<SheetController["modeTools"]>;
}
