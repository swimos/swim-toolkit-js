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

import type {Mutable, Class, Initable, ObserverType} from "@swim/util";
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {Trait} from "@swim/model";
import {Look} from "@swim/theme";
import type {PositionGestureInput} from "@swim/view";
import {Graphics} from "@swim/graphics";
import {
  AnyController,
  ControllerInit,
  Controller,
  ControllerRef,
  TraitViewRef,
  TraitViewControllerRef,
  TraitViewControllerSet,
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
export interface SheetControllerButtonToolsExt {
  readonly active: boolean;
  setActive(active: boolean): void;
  updateActive(active: boolean, buttonToolView: ToolView): void;
}

/** @public */
export interface SheetControllerModeToolsExt {
  attachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void;
  detachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void;
  attachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void;
  detachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void;
}

/** @public */
export class SheetController extends Controller {
  override readonly observerType?: Class<SheetControllerObserver>;

  @Property<SheetController, boolean>({
    type: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.callObservers("controllerDidSetFullBleed", fullBleed, this.owner);
      const sheetView = this.owner.sheet.view;
      if (sheetView !== null) {
        sheetView.fullBleed.setValue(fullBleed, Affinity.Inherited);
      }
    },
  })
  readonly fullBleed!: Property<this, boolean>;

  @TraitViewRef<SheetController, Trait, SheetView>({
    traitType: Trait,
    willAttachTrait(sheetTrait: Trait): void {
      this.owner.callObservers("controllerWillAttachSheetTrait", sheetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: Trait): void {
      this.owner.callObservers("controllerDidDetachSheetTrait", sheetTrait, this.owner);
    },
    viewType: SheetView,
    observesView: true,
    willAttachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillAttachSheetView", sheetView, this.owner);
    },
    didAttachView(sheetView: SheetView): void {
      this.owner.fullBleed.setValue(sheetView.fullBleed.value, Affinity.Intrinsic);
    },
    didDetachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidDetachSheetView", sheetView, this.owner);
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
  readonly sheet!: TraitViewRef<this, Trait, SheetView>;
  static readonly sheet: MemberFastenerClass<SheetController, "sheet">;

  @ControllerRef<SheetController, SheetController>({
    type: SheetController,
    binds: false,
    willAttachController(backController: SheetController): void {
      this.owner.callObservers("controllerWillAttachBack", backController, this.owner);
    },
    didDetachController(backController: SheetController): void {
      this.owner.callObservers("controllerDidDetachBack", backController, this.owner);
    },
  })
  readonly back!: ControllerRef<this, SheetController>;
  static readonly back: MemberFastenerClass<SheetController, "back">;

  @ControllerRef<SheetController, SheetController>({
    type: SheetController,
    binds: false,
    willAttachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerWillAttachForward", forwardController, this.owner);
    },
    didDetachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerDidDetachForward", forwardController, this.owner);
    },
  })
  readonly forward!: ControllerRef<this, SheetController>;
  static readonly forward: MemberFastenerClass<SheetController, "forward">;

  @TraitViewControllerRef<SheetController, ToolTrait, ToolView, ToolController & Initable<ControllerInit | string>>({
    type: ToolController,
    binds: true,
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    willAttachController(titleToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachTitleTool", titleToolController, this.owner);
    },
    didDetachController(titleToolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachTitleTool", titleToolController, this.owner);
    },
    createController(): ToolController {
      const toolController = TitleToolController.create();
      const toolView = toolController.tool.attachView();
      toolView.fontSize.setState(14, Affinity.Intrinsic);
      return toolController;
    },
    fromAny(value: AnyController<ToolController> | string): ToolController {
      if (typeof value === "string") {
        const toolController = this.createController() as TitleToolController;
        const toolView = toolController.tool.attachView();
        toolView.content.setView(value);
        return toolController;
      } else {
        return ToolController.fromAny(value);
      }
    },
  })
  readonly titleTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController & Initable<ControllerInit | string>>;
  static readonly titleTool: MemberFastenerClass<SheetController, "titleTool">;

  @TraitViewControllerRef<SheetController, ToolTrait, ToolView, ToolController & Initable<ControllerInit | Graphics>, SheetControllerButtonToolsExt & ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: ToolController,
    binds: true,
    observes: true,
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    init(): void {
      (this as Mutable<typeof this>).active = false;
    },
    initController(buttonToolController: ToolController): void {
      const buttonToolView = this.view;
      if (buttonToolView !== null) {
        this.updateActive(this.active, buttonToolView);
      }
    },
    willAttachController(buttonToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachButtonTool", buttonToolController, this.owner);
    },
    didDetachController(buttonToolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachButtonTool", buttonToolController, this.owner);
    },
    controllerWillAttachToolView(buttonToolView: ToolView): void {
      this.updateActive(this.active, buttonToolView);
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
        if (active) {
          buttonToolView.iconColor.setLook(Look.accentColor, Affinity.Intrinsic);
        } else {
          buttonToolView.iconColor.setLook(Look.iconColor, Affinity.Intrinsic);
        }
      }
    },
    createController(): ToolController {
      const toolController = ButtonToolController.create();
      toolController.layout.setValue(ToolLayout.create("", 0, 0, 36));
      const toolView = toolController.tool.attachView();
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      return toolController;
    },
    fromAny(value: AnyController<ToolController> | Graphics): ToolController {
      if (!(value instanceof Controller) && Graphics.is(value)) {
        const toolController = this.createController() as ButtonToolController;
        const toolView = toolController.tool.attachView();
        toolView.graphics.setState(value, Affinity.Intrinsic);
        return toolController;
      } else {
        return ToolController.fromAny(value);
      }
    },
  })
  readonly buttonTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController & Initable<ControllerInit | Graphics>> & SheetControllerButtonToolsExt;
  static readonly buttonTool: MemberFastenerClass<SheetController, "buttonTool">;

  @TraitViewControllerSet<SheetController, ToolTrait, ToolView, ToolController, SheetControllerModeToolsExt>({
    implements: true,
    type: ToolController,
    binds: false,
    observes: true,
    getTraitViewRef(modeToolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return modeToolController.tool;
    },
    willAttachController(modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachModeTool", modeToolController, this.owner);
    },
    didAttachController(modeToolController: ToolController): void {
      const modeToolTrait = modeToolController.tool.trait;
      if (modeToolTrait !== null) {
        this.attachModeToolTrait(modeToolTrait, modeToolController);
      }
      const modeToolView = modeToolController.tool.view;
      if (modeToolView !== null) {
        this.attachModeToolView(modeToolView, modeToolController);
      }
    },
    willDetachController(modeToolController: ToolController): void {
      const modeToolView = modeToolController.tool.view;
      if (modeToolView !== null) {
        this.detachModeToolView(modeToolView, modeToolController);
      }
      const modeToolTrait = modeToolController.tool.trait;
      if (modeToolTrait !== null) {
        this.detachModeToolTrait(modeToolTrait, modeToolController);
      }
    },
    didDetachController(modeToolController: ToolController): void {
      this.owner.callObservers("controllerDidDetachModeTool", modeToolController, this.owner);
    },
    controllerWillAttachToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachModeToolTrait", modeToolTrait, modeToolController, this.owner);
      this.attachModeToolTrait(modeToolTrait, modeToolController);
    },
    controllerDidDetachToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      this.detachModeToolTrait(modeToolTrait, modeToolController);
      this.owner.callObservers("controllerDidDetachModeToolTrait", modeToolTrait, modeToolController, this.owner);
    },
    attachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      // hook
    },
    detachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      // hook
    },
    controllerWillAttachToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachModeToolView", modeToolView, modeToolController, this.owner);
      this.attachModeToolView(modeToolView, modeToolController);
    },
    controllerDidDetachToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      this.detachModeToolView(modeToolView, modeToolController);
      this.owner.callObservers("controllerDidDetachModeToolView", modeToolView, modeToolController, this.owner);
    },
    attachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      // hook
    },
    detachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      // hook
    },
  })
  readonly modeTools!: TraitViewControllerSet<this, ToolTrait, ToolView, ToolController> & SheetControllerModeToolsExt;
  static readonly modeTools: MemberFastenerClass<SheetController, "modeTools">;
}
