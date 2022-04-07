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

import type {Class, AnyTiming} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import {Trait} from "@swim/model";
import {PositionGestureInput, View, ViewRefDef} from "@swim/view";
import {
  TraitViewRefDef,
  TraitViewRef,
  TraitViewControllerRefDef,
  TraitViewControllerSetDef,
} from "@swim/controller";
import {ToolView, ToolTrait, ToolController, BarView, BarTrait, BarController} from "@swim/toolbar";
import {DrawerView} from "@swim/window";
import type {SheetView} from "../sheet/SheetView";
import {SheetController} from "../sheet/SheetController";
import type {StackView} from "../stack/StackView";
import {StackController} from "../stack/StackController";
import {AppBarController} from "./AppBarController";
import {FolioStyle, FolioView} from "./FolioView";
import type {FolioControllerObserver} from "./FolioControllerObserver";

/** @public */
export class FolioController extends StackController {
  override readonly observerType?: Class<FolioControllerObserver>;

  @PropertyDef<FolioController["folioStyle"]>({
    valueType: String,
    didSetValue(folioStyle: FolioStyle | undefined): void {
      const coverController = this.owner.cover.controller;
      if (coverController !== null) {
        if (folioStyle === "stacked") {
          this.owner.sheets.attachController(coverController);
        } else if (folioStyle === "unstacked") {
          this.owner.cover.insertView(this.owner.folio.view);
          this.owner.sheets.detachController(coverController);
        }
      }

      const stackView = this.owner.stack.view;
      if (stackView !== null) {
        this.owner.stack.updateFolioStyle(folioStyle, stackView);
      }
      const navBarController = this.owner.navBar.controller;
      if (navBarController !== null) {
        this.owner.navBar.updateFolioStyle(folioStyle, navBarController);
      }
      const appBarController = this.owner.appBar.controller;
      if (appBarController !== null) {
        this.owner.appBar.updateFolioStyle(folioStyle, appBarController);
      }
      const sheetControllers = this.owner.sheets.controllers;
      for (const controllerId in sheetControllers) {
        const sheetController = sheetControllers[controllerId]!;
        const sheetView = sheetController.sheet.view;
        if (sheetView !== null) {
          this.owner.sheets.updateFolioStyle(folioStyle, sheetView, sheetController);
        }
      }
      this.owner.callObservers("controllerDidSetFolioStyle", folioStyle, this.owner);
      const folioView = this.owner.folio.view;
      if (folioView !== null) {
        folioView.folioStyle.setValue(folioStyle, Affinity.Inherited);
      }
    },
  })
  readonly folioStyle!: PropertyDef<this, {value: FolioStyle | undefined}>;

  @PropertyDef<FolioController["fullBleed"]>({
    valueType: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      const drawerView = this.owner.drawer.view;
      if (drawerView !== null) {
        this.owner.drawer.updateFullBleed(fullBleed, drawerView);
      }
      const stackView = this.owner.stack.view;
      if (stackView !== null) {
        this.owner.stack.updateFullBleed(fullBleed, stackView);
      }
      const sheetControllers = this.owner.sheets.controllers;
      for (const controllerId in sheetControllers) {
        const sheetController = sheetControllers[controllerId]!;
        const sheetView = sheetController.sheet.view;
        if (sheetView !== null) {
          this.owner.sheets.updateFullBleed(fullBleed, sheetView, sheetController);
        }
      }
      this.owner.callObservers("controllerDidSetFullBleed", fullBleed, this.owner);
      const folioView = this.owner.folio.view;
      if (folioView !== null) {
        folioView.fullBleed.setValue(fullBleed, Affinity.Inherited);
      }
    },
  })
  readonly fullBleed!: PropertyDef<this, {value: boolean}>;

  @PropertyDef<FolioController["fullScreen"]>({
    valueType: Boolean,
    value: false,
    didSetValue(fullScreen: boolean): void {
      const drawerView = this.owner.drawer.view;
      if (drawerView !== null) {
        if (fullScreen) {
          drawerView.dismiss();
        } else {
          drawerView.present();
        }
      }
      this.owner.callObservers("controllerDidSetFullScreen", fullScreen, this.owner);
    },
  })
  readonly fullScreen!: PropertyDef<this, {value: boolean}>;

  @TraitViewRefDef<FolioController["folio"]>({
    traitType: Trait,
    willAttachTrait(folioTrait: Trait): void {
      this.owner.callObservers("controllerWillAttachFolioTrait", folioTrait, this.owner);
    },
    didDetachTrait(folioTrait: Trait): void {
      this.owner.callObservers("controllerDidDetachFolioTrait", folioTrait, this.owner);
    },
    viewType: FolioView,
    observesView: true,
    initView(folioView: FolioView): void {
      const appBarController = this.owner.appBar.controller;
      if (appBarController !== null) {
        appBarController.bar.attachView();
        if (folioView.appBar.view === null) {
          folioView.appBar.setView(appBarController.bar.view);
        }
      }
      const coverController = this.owner.cover.controller;
      if (coverController !== null && folioView.cover.view === null) {
        folioView.cover.setView(coverController.sheet.view);
      }
    },
    willAttachView(folioView: FolioView): void {
      this.owner.callObservers("controllerWillAttachFolioView", folioView, this.owner);
    },
    didAttachView(folioView: FolioView): void {
      this.owner.folioStyle.setValue(folioView.folioStyle.value, Affinity.Intrinsic);
      this.owner.fullBleed.setValue(folioView.fullBleed.value, Affinity.Intrinsic);
      this.owner.drawer.setView(folioView.drawer.attachView());
      this.owner.stack.setView(folioView.stack.attachView());
    },
    willDetachView(folioView: FolioView): void {
      this.owner.stack.setView(null);
      this.owner.drawer.setView(null);
    },
    didDetachView(folioView: FolioView): void {
      this.owner.callObservers("controllerDidDetachFolioView", folioView, this.owner);
    },
    viewDidSetFolioStyle(folioStyle: FolioStyle | undefined, folioView: FolioView): void {
      this.owner.folioStyle.setValue(folioStyle, Affinity.Intrinsic);
    },
    viewDidSetFullBleed(fullBleed: boolean, folioView: FolioView): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
    viewWillAttachDrawer(drawerView: DrawerView): void {
      this.owner.drawer.setView(drawerView);
    },
    viewDidDetachDrawer(drawerView: DrawerView): void {
      this.owner.drawer.setView(null);
    },
    viewWillAttachAppBar(appBarView: BarView): void {
      const appBarController = this.owner.appBar.controller;
      if (appBarController !== null) {
        appBarController.bar.setView(appBarView);
      }
    },
    viewDidDetachAppBar(appBarView: BarView): void {
      const appBarController = this.owner.appBar.controller;
      if (appBarController !== null) {
        appBarController.bar.setView(null);
      }
    },
  })
  readonly folio!: TraitViewRefDef<this, {
    view: FolioView,
    observesView: true,
  }>;
  static readonly folio: FastenerClass<FolioController["folio"]>;

  @TraitViewRefDef<FolioController["stack"]>({
    extends: true,
    didAttachView(stackView: StackView, targetView: View | null): void {
      StackController.stack.prototype.didAttachView.call(this, stackView, targetView);
      this.updateFolioStyle(this.owner.folioStyle.value, stackView);
      this.updateFullBleed(this.owner.fullBleed.value, stackView);
    },
    updateFolioStyle(folioStyle: FolioStyle | undefined, stackView: StackView): void {
      // hook
    },
    updateFullBleed(fullBleed: boolean, stackView: StackView): void {
      // hook
    },
  })
  override readonly stack!: TraitViewRefDef<this, {
    extends: StackController["stack"],
    implements: {
      updateFolioStyle(folioStyle: FolioStyle | undefined, stackView: StackView): void;
      updateFullBleed(fullBleed: boolean, stackView: StackView): void;
    },
  }>;
  static override readonly stack: FastenerClass<FolioController["stack"]>;

  @TraitViewControllerSetDef<FolioController["sheets"]>({
    extends: true,
    attachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      StackController.sheets.prototype.attachSheetView.call(this, sheetView, sheetController);
      this.updateFolioStyle(this.owner.folioStyle.value, sheetView, sheetController);
      this.updateFullBleed(this.owner.fullBleed.value, sheetView, sheetController);
    },
    updateFolioStyle(folioStyle: FolioStyle | undefined, sheetView: SheetView, sheetController: SheetController): void {
      // hook
    },
    updateFullBleed(fullBleed: boolean, sheetView: SheetView, sheetController: SheetController): void {
      // hook
    },
  })
  override readonly sheets!: TraitViewControllerSetDef<this, {
    extends: StackController["sheets"],
    implements: {
      updateFolioStyle(folioStyle: FolioStyle | undefined, sheetView: SheetView, sheetController: SheetController): void;
      updateFullBleed(fullBleed: boolean, sheetView: SheetView, sheetController: SheetController): void;
    },
  }>;
  static override readonly sheets: FastenerClass<FolioController["sheets"]>;

  @TraitViewControllerRefDef<FolioController["navBar"]>({
    extends: true,
    initController(navBarController: BarController): void {
      StackController.navBar.prototype.initController.call(this, navBarController);
      this.updateFolioStyle(this.owner.folioStyle.value, navBarController);
      this.frontViewDidScroll;
    },
    updateFolioStyle(folioStyle: FolioStyle | undefined, navBarController: BarController): void {
      // hook
    },
  })
  override readonly navBar!: TraitViewControllerRefDef<this, {
    extends: StackController["navBar"];
    implements: {
      updateFolioStyle(folioStyle: FolioStyle | undefined, navBarController: BarController): void;
    };
  }>;
  static override readonly navBar: FastenerClass<FolioController["navBar"]>;

  protected didPressMenuTool(input: PositionGestureInput, event: Event | null): void {
    this.fullScreen.setValue(!this.fullScreen.value, Affinity.Intrinsic);
    this.callObservers("controllerDidPressMenuTool", input, event, this);
  }

  protected didPressActionTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressActionTool", input, event, this);
  }

  @TraitViewControllerRefDef<FolioController["appBar"]>({
    controllerType: BarController,
    binds: true,
    observes: true,
    get parentView(): FolioView | null {
      return this.owner.folio.view;
    },
    getTraitViewRef(appBarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return appBarController.bar;
    },
    initController(appBarController: BarController): void {
      appBarController.bar.attachView();
    },
    willAttachController(appBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppBar", appBarController, this.owner);
    },
    didAttachController(appBarController: BarController): void {
      const appBarTrait = appBarController.bar.trait;
      if (appBarTrait !== null) {
        this.attachAppBarTrait(appBarTrait, appBarController);
      }
      const appBarView = appBarController.bar.view;
      if (appBarView !== null) {
        this.attachAppBarView(appBarView, appBarController);
      }
    },
    willDetachController(appBarController: BarController): void {
      const appBarView = appBarController.bar.view;
      if (appBarView !== null) {
        this.detachAppBarView(appBarView, appBarController);
      }
      const appBarTrait = appBarController.bar.trait;
      if (appBarTrait !== null) {
        this.detachAppBarTrait(appBarTrait, appBarController);
      }
    },
    didDetachController(appBarController: BarController): void {
      this.owner.callObservers("controllerDidDetachAppBar", appBarController, this.owner);
    },
    controllerWillAttachBarTrait(appBarTrait: BarTrait, appBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppBarTrait", appBarTrait, this.owner);
      this.attachAppBarTrait(appBarTrait, appBarController);
    },
    controllerDidDetachBarTrait(appBarTrait: BarTrait, appBarController: BarController): void {
      this.detachAppBarTrait(appBarTrait, appBarController);
      this.owner.callObservers("controllerDidDetachAppBarTrait", appBarTrait, this.owner);
    },
    attachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void {
      // hook
    },
    detachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(appBarView: BarView, appBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppBarView", appBarView, this.owner);
      this.attachAppBarView(appBarView, appBarController);
    },
    controllerDidDetachBarView(appBarView: BarView, appBarController: BarController): void {
      this.detachAppBarView(appBarView, appBarController);
      this.owner.callObservers("controllerDidDetachAppBarView", appBarView, this.owner);
    },
    attachAppBarView(appBarView: BarView, appBarController: BarController): void {
      const folioView = this.owner.folio.view;
      if (folioView !== null && folioView.appBar.view === null) {
        folioView.appBar.setView(appBarView);
      }
    },
    detachAppBarView(appBarView: BarView, appBarController: BarController): void {
      appBarView.remove();
    },
    updateFolioStyle(folioStyle: FolioStyle | undefined, appBarController: BarController): void {
      appBarController.updateLayout();
    },
    controllerDidPressMenuTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressMenuTool(input, event);
    },
    controllerDidPressActionTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressActionTool(input, event);
    },
    createController(): BarController {
      return new AppBarController();
    },
  })
  readonly appBar!: TraitViewControllerRefDef<this, {
    trait: BarTrait,
    view: BarView,
    controller: BarController,
    implements: {
      attachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void;
      detachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void;
      attachAppBarView(appBarView: BarView, appBarController: BarController): void;
      detachAppBarView(appBarView: BarView, appBarController: BarController): void;
      updateFolioStyle(folioStyle: FolioStyle | undefined, appBarController: BarController): void;
    },
    observes: BarController & AppBarController,
  }>;
  static readonly appBar: FastenerClass<FolioController["appBar"]>;

  @ViewRefDef<FolioController["drawer"]>({
    viewType: DrawerView,
    get parentView(): FolioView | null {
      return this.owner.folio.view;
    },
    willAttachView(drawerView: DrawerView): void {
      this.owner.callObservers("controllerWillAttachDrawerView", drawerView, this.owner);
    },
    didAttachView(drawerView: DrawerView): void {
      this.updateFullBleed(this.owner.fullBleed.value, drawerView);
      if (this.owner.fullScreen.value) {
        drawerView.dismiss();
      } else {
        drawerView.present();
      }
    },
    didDetachView(drawerView: DrawerView): void {
      this.owner.callObservers("controllerDidDetachDrawerView", drawerView, this.owner);
    },
    updateFullBleed(fullBleed: boolean, drawerView: DrawerView): void {
      // hook
    },
  })
  readonly drawer!: ViewRefDef<this, {
    view: DrawerView,
    implements: {
      updateFullBleed(fullBleed: boolean, drawerView: DrawerView): void;
    },
  }>;
  static readonly drawer: FastenerClass<FolioController["drawer"]>;

  @TraitViewControllerRefDef<FolioController["cover"]>({
    controllerType: SheetController,
    binds: false,
    observes: true,
    getTraitViewRef(coverController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return coverController.sheet;
    },
    willAttachController(coverController: SheetController): void {
      this.owner.callObservers("controllerWillAttachCover", coverController, this.owner);
    },
    didAttachController(coverController: SheetController): void {
      this.owner.fullBleed.setValue(coverController.fullBleed.value, Affinity.Intrinsic);
      const coverTrait = coverController.sheet.trait;
      if (coverTrait !== null) {
        this.attachCoverTrait(coverTrait, coverController);
      }
      const coverView = coverController.sheet.view;
      if (coverView !== null) {
        this.attachCoverView(coverView, coverController);
      }
      const modeToolControllers = coverController.modeTools.controllers;
      for (const controllerId in modeToolControllers) {
        this.owner.modeTools.attachController(modeToolControllers[controllerId]!);
      }
    },
    willDetachController(coverController: SheetController): void {
      const modeToolControllers = coverController.modeTools.controllers;
      for (const controllerId in modeToolControllers) {
        this.owner.modeTools.detachController(modeToolControllers[controllerId]!);
      }
      const coverView = coverController.sheet.view;
      if (coverView !== null) {
        this.detachCoverView(coverView, coverController);
      }
      const coverTrait = coverController.sheet.trait;
      if (coverTrait !== null) {
        this.detachCoverTrait(coverTrait, coverController);
      }
    },
    didDetachController(coverController: SheetController): void {
      this.owner.callObservers("controllerDidDetachCover", coverController, this.owner);
    },
    controllerWillAttachSheetTrait(coverTrait: Trait, coverController: SheetController): void {
      this.owner.callObservers("controllerWillAttachCoverTrait", coverTrait, this.owner);
      this.attachCoverTrait(coverTrait, coverController);
    },
    controllerDidDetachSheetTrait(coverTrait: Trait, coverController: SheetController): void {
      this.detachCoverTrait(coverTrait, coverController);
      this.owner.callObservers("controllerDidDetachCoverTrait", coverTrait, this.owner);
    },
    attachCoverTrait(coverTrait: Trait, coverController: SheetController): void {
      // hook
    },
    detachCoverTrait(coverTrait: Trait, coverController: SheetController): void {
      // hook
    },
    controllerWillAttachSheetView(coverView: SheetView, coverController: SheetController): void {
      this.owner.callObservers("controllerWillAttachCoverView", coverView, this.owner);
      this.attachCoverView(coverView, coverController);
    },
    controllerDidDetachSheetView(coverView: SheetView, coverController: SheetController): void {
      this.detachCoverView(coverView, coverController);
      this.owner.callObservers("controllerDidDetachCoverView", coverView, this.owner);
    },
    attachCoverView(coverView: SheetView, coverController: SheetController): void {
      const folioView = this.owner.folio.view;
      if (folioView !== null) {
        folioView.cover.setView(coverView);
      }
    },
    detachCoverView(coverView: SheetView, coverController: SheetController): void {
      // hook
    },
    controllerDidSetFullBleed(fullBleed: boolean, sheetController: SheetController): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
    controllerWillAttachModeTool(modeToolController: ToolController, coverController: SheetController): void {
      this.owner.modeTools.attachController(modeToolController);
    },
    controllerDidDetachModeTool(modeToolController: ToolController, coverController: SheetController): void {
      this.owner.modeTools.detachController(modeToolController);
    },
    present(timing?: AnyTiming | boolean): SheetView | null {
      if (this.owner.folioStyle.value === "stacked") {
        const coverController = this.controller;
        const coverView = coverController !== null ? coverController.sheet.view : null;
        if (coverView !== null && coverView.parent === null) {
          this.owner.sheets.attachController(coverController!);
          if (timing !== void 0) {
            coverView.present(timing);
          }
        }
        return coverView;
      }
      return null;
    },
  })
  readonly cover!: TraitViewControllerRefDef<this, {
    view: SheetView,
    controller: SheetController,
    implements: {
      attachCoverTrait(coverTrait: Trait, coverController: SheetController): void;
      detachCoverTrait(coverTrait: Trait, coverController: SheetController): void;
      attachCoverView(coverView: SheetView, coverController: SheetController): void;
      detachCoverView(coverView: SheetView, coverController: SheetController): void;
      present(timing?: AnyTiming | boolean): SheetView | null;
    },
    observes: true,
  }>;
  static readonly cover: FastenerClass<FolioController["cover"]>;

  @TraitViewControllerSetDef<FolioController["modeTools"]>({
    controllerType: ToolController,
    binds: false,
    observes: true,
    getTraitViewRef(modeToolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return modeToolController.tool;
    },
    willAttachController(modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachCoverModeTool", modeToolController, this.owner);
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
      this.owner.callObservers("controllerDidDetachCoverModeTool", modeToolController, this.owner);
    },
    controllerWillAttachToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachCoverModeToolTrait", modeToolTrait, modeToolController, this.owner);
      this.attachModeToolTrait(modeToolTrait, modeToolController);
    },
    controllerDidDetachToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      this.detachModeToolTrait(modeToolTrait, modeToolController);
      this.owner.callObservers("controllerDidDetachCoverModeToolTrait", modeToolTrait, modeToolController, this.owner);
    },
    attachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      // hook
    },
    detachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void {
      // hook
    },
    controllerWillAttachToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      this.owner.callObservers("controllerWillAttachCoverModeToolView", modeToolView, modeToolController, this.owner);
      this.attachModeToolView(modeToolView, modeToolController);
    },
    controllerDidDetachToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      this.detachModeToolView(modeToolView, modeToolController);
      this.owner.callObservers("controllerDidDetachCoverModeToolView", modeToolView, modeToolController, this.owner);
    },
    attachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      // hook
    },
    detachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void {
      // hook
    },
  })
  readonly modeTools!: TraitViewControllerSetDef<this, {
    trait: ToolTrait,
    view: ToolView,
    controller: ToolController,
    implements: {
      attachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void;
      detachModeToolTrait(modeToolTrait: ToolTrait, modeToolController: ToolController): void;
      attachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void;
      detachModeToolView(modeToolView: ToolView, modeToolController: ToolController): void;
    },
    observes: true,
  }>;
  static readonly modeTools: FastenerClass<FolioController["modeTools"]>;
}
