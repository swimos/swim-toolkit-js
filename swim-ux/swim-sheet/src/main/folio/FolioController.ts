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

import type {Class, ObserverType, AnyTiming} from "@swim/util";
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {Feel} from "@swim/theme";
import {PositionGestureInput, View, ViewRef} from "@swim/view";
import {TraitViewRef, TraitViewControllerRef} from "@swim/controller";
import {BarView, BarTrait, BarController} from "@swim/toolbar";
import {DrawerView} from "@swim/window";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import type {NavBarController} from "../stack/NavBarController";
import type {StackView} from "../stack/StackView";
import type {StackTrait} from "../stack/StackTrait";
import {StackControllerNavBarExt, StackController} from "../stack/StackController";
import {AppBarController} from "./AppBarController";
import {FolioStyle, FolioView} from "./FolioView";
import {FolioTrait} from "./FolioTrait";
import type {FolioControllerObserver} from "./FolioControllerObserver";

/** @public */
export interface FolioControllerStackExt {
  updateFullBleed(fullBleed: boolean, stackView: StackView): void;
}

/** @public */
export interface FolioControllerNavBarExt extends StackControllerNavBarExt {
  updateFolioStyle(folioStyle: FolioStyle | undefined, navBarController: BarController): void;
}

/** @public */
export interface FolioControllerAppBarExt {
  attachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void;
  detachAppBarTrait(appBarTrait: BarTrait, appBarController: BarController): void;
  attachAppBarView(appBarView: BarView, appBarController: BarController): void;
  detachAppBarView(appBarView: BarView, appBarController: BarController): void;
}

/** @public */
export interface FolioControllerDrawerExt {
  updateFullBleed(fullBleed: boolean, drawerView: DrawerView): void;
}

/** @public */
export interface FolioControllerCoverExt {
  attachCoverTrait(coverTrait: SheetTrait, coverController: SheetController): void;
  detachCoverTrait(coverTrait: SheetTrait, coverController: SheetController): void;
  attachCoverView(coverView: SheetView, coverController: SheetController): void;
  detachCoverView(coverView: SheetView, coverController: SheetController): void;
  present(timing?: AnyTiming | boolean): SheetView | null;
}

/** @public */
export class FolioController extends StackController {
  override readonly observerType?: Class<FolioControllerObserver>;

  @TraitViewRef<FolioController, FolioTrait, FolioView>({
    traitType: FolioTrait,
    observesTrait: true,
    willAttachTrait(folioTrait: FolioTrait): void {
      this.owner.callObservers("controllerWillAttachFolioTrait", folioTrait, this.owner);
    },
    didAttachTrait(folioTrait: FolioTrait): void {
      const appBarTrait = folioTrait.appBar.trait;
      if (appBarTrait !== null) {
        this.owner.appBar.setTrait(appBarTrait);
      }
      const coverTrait = folioTrait.cover.trait;
      if (coverTrait !== null) {
        this.owner.cover.setTrait(coverTrait);
      }
    },
    willDetachTrait(folioTrait: FolioTrait): void {
      const coverTrait = folioTrait.cover.trait;
      if (coverTrait !== null) {
        this.owner.cover.deleteTrait(coverTrait);
      }
      const appBarTrait = folioTrait.appBar.trait;
      if (appBarTrait !== null) {
        this.owner.appBar.deleteTrait(appBarTrait);
      }
    },
    didDetachTrait(folioTrait: FolioTrait): void {
      this.owner.callObservers("controllerDidDetachFolioTrait", folioTrait, this.owner);
    },
    traitWillAttachAppBar(appBarTrait: BarTrait): void {
      this.owner.appBar.setTrait(appBarTrait);
    },
    traitDidDetachAppBar(appBarTrait: BarTrait): void {
      this.owner.appBar.deleteTrait(appBarTrait);
    },
    traitWillAttachCover(sheetTrait: SheetTrait): void {
      this.owner.cover.setTrait(sheetTrait);
    },
    traitDidDetachCover(sheetTrait: SheetTrait): void {
      this.owner.cover.deleteTrait(sheetTrait);
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
      const coverController = this.owner.cover.controller;
      if (folioStyle === "stacked") {
        if (coverController !== null) {
          this.owner.sheets.attachController(coverController);
        }
      } else if (folioStyle === "unstacked") {
        this.owner.cover.insertView(folioView);
        if (coverController !== null) {
          this.owner.sheets.detachController(coverController);
        }
        const appBarController = this.owner.appBar.controller;
        if (appBarController instanceof AppBarController) {
          appBarController.updateLayout();
        }
      }

      const navBarController = this.owner.navBar.controller;
      if (navBarController !== null) {
        this.owner.navBar.updateFolioStyle(folioStyle, navBarController);
      }
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
  readonly folio!: TraitViewRef<this, FolioTrait, FolioView>;
  static readonly folio: MemberFastenerClass<FolioController, "folio">;

  @TraitViewRef<FolioController, StackTrait, StackView, FolioControllerStackExt>({
    extends: true,
    implements: true,
    didAttachView(stackView: StackView, targetView: View | null): void {
      StackController.stack.prototype.didAttachView.call(this, stackView, targetView);
      this.updateFullBleed(this.owner.fullBleed.value, stackView);
    },
    updateFullBleed(fullBleed: boolean, stackView: StackView): void {
      stackView.outAlign.setValue(fullBleed ? -1 : -(1 / 3), Affinity.Intrinsic);
    },
  })
  override readonly stack!: TraitViewRef<this, StackTrait, StackView> & FolioControllerStackExt;
  static override readonly stack: MemberFastenerClass<StackController, "stack">;

  @TraitViewControllerRef<FolioController, BarTrait, BarView, BarController, FolioControllerNavBarExt & ObserverType<BarController | NavBarController>>({
    extends: true,
    implements: true,
    attachNavBarView(navBarView: BarView, navBarController: BarController): void {
      StackController.navBar.prototype.attachNavBarView.call(this, navBarView, navBarController);
      const folioView = this.owner.folio.view;
      const folioStyle = folioView !== null ? folioView.folioStyle.value : void 0;
      this.updateFolioStyle(folioStyle, navBarController);
    },
    updateFolioStyle(folioStyle: FolioStyle | undefined, navBarController: BarController): void {
      // hook
    },
  })
  override readonly navBar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & FolioControllerNavBarExt;
  static override readonly navBar: MemberFastenerClass<FolioController, "navBar">;

  protected didPressMenuTool(input: PositionGestureInput, event: Event | null): void {
    this.fullScreen.setValue(!this.fullScreen.value, Affinity.Intrinsic);
    this.callObservers("controllerDidPressMenuTool", input, event, this);
  }

  protected didPressActionTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressActionTool", input, event, this);
  }

  @TraitViewControllerRef<FolioController, BarTrait, BarView, BarController, FolioControllerAppBarExt & ObserverType<BarController | AppBarController>>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): FolioView | null {
      return this.owner.folio.view;
    },
    getTraitViewRef(appBarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return appBarController.bar;
    },
    initController(appBarController: BarController): void {
      const folioTrait = this.owner.folio.trait;
      if (folioTrait !== null) {
        const appBarTrait = folioTrait.appBar.trait;
        if (appBarTrait !== null) {
          appBarController.bar.setTrait(appBarTrait);
        }
      }
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
  readonly appBar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & FolioControllerAppBarExt;
  static readonly appBar: MemberFastenerClass<FolioController, "appBar">;

  @Property<FolioController, boolean>({
    type: Boolean,
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
  readonly fullScreen!: Property<this, boolean>;

  @Property<FolioController, boolean>({
    type: Boolean,
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
    },
  })
  readonly fullBleed!: Property<this, boolean>;

  @ViewRef<FolioController, DrawerView, FolioControllerDrawerExt>({
    implements: true,
    type: DrawerView,
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
      drawerView.modifyMood(Feel.default, [[Feel.translucent, fullBleed ? 1 : 0]]);
    },
  })
  readonly drawer!: ViewRef<this, DrawerView> & FolioControllerDrawerExt;
  static readonly drawer: MemberFastenerClass<FolioController, "drawer">;

  @TraitViewControllerRef<FolioController, SheetTrait, SheetView, SheetController, FolioControllerCoverExt>({
    implements: true,
    type: SheetController,
    binds: false,
    observes: true,
    getTraitViewRef(coverController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return coverController.sheet;
    },
    willAttachController(coverController: SheetController): void {
      this.owner.callObservers("controllerWillAttachCover", coverController, this.owner);
    },
    didAttachController(coverController: SheetController): void {
      const coverTrait = coverController.sheet.trait;
      if (coverTrait !== null) {
        this.attachCoverTrait(coverTrait, coverController);
      }
      const coverView = coverController.sheet.view;
      if (coverView !== null) {
        this.attachCoverView(coverView, coverController);
      }
    },
    willDetachController(coverController: SheetController): void {
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
    controllerWillAttachSheetTrait(coverTrait: SheetTrait, coverController: SheetController): void {
      this.owner.callObservers("controllerWillAttachCoverTrait", coverTrait, this.owner);
      this.attachCoverTrait(coverTrait, coverController);
    },
    controllerDidDetachSheetTrait(coverTrait: SheetTrait, coverController: SheetController): void {
      this.detachCoverTrait(coverTrait, coverController);
      this.owner.callObservers("controllerDidDetachCoverTrait", coverTrait, this.owner);
    },
    attachCoverTrait(coverTrait: SheetTrait, coverController: SheetController): void {
      // hook
    },
    detachCoverTrait(coverTrait: SheetTrait, coverController: SheetController): void {
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
    present(timing?: AnyTiming | boolean): SheetView | null {
      const folioView = this.owner.folio.view;
      const folioStyle = folioView !== null ? folioView.folioStyle.value : void 0;
      if (folioStyle === "stacked") {
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
  readonly cover!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController> & FolioControllerCoverExt;
  static readonly cover: MemberFastenerClass<FolioController, "cover">;
}
