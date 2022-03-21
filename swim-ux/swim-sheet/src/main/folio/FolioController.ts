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
import {PositionGestureInput, ViewRef} from "@swim/view";
import {TraitViewRef, TraitViewControllerRef} from "@swim/controller";
import {BarView, BarTrait, BarController} from "@swim/toolbar";
import {DrawerView} from "@swim/window";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import type {StackView} from "../stack/StackView";
import type {StackTrait} from "../stack/StackTrait";
import {StackController} from "../stack/StackController";
import {AppbarController} from "./AppbarController";
import {FolioStyle, FolioView} from "./FolioView";
import {FolioTrait} from "./FolioTrait";
import type {FolioControllerObserver} from "./FolioControllerObserver";

/** @public */
export interface FolioControllerAppbarExt {
  attachAppbarTrait(appbarTrait: BarTrait, appbarController: BarController): void;
  detachAppbarTrait(appbarTrait: BarTrait, appbarController: BarController): void;
  attachAppbarView(appbarView: BarView, appbarController: BarController): void;
  detachAppbarView(appbarView: BarView, appbarController: BarController): void;
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
      const appbarTrait = folioTrait.appbar.trait;
      if (appbarTrait !== null) {
        this.owner.appbar.setTrait(appbarTrait);
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
      const appbarTrait = folioTrait.appbar.trait;
      if (appbarTrait !== null) {
        this.owner.appbar.deleteTrait(appbarTrait);
      }
    },
    didDetachTrait(folioTrait: FolioTrait): void {
      this.owner.callObservers("controllerDidDetachFolioTrait", folioTrait, this.owner);
    },
    traitWillAttachAppbar(appbarTrait: BarTrait): void {
      this.owner.appbar.setTrait(appbarTrait);
    },
    traitDidDetachAppbar(appbarTrait: BarTrait): void {
      this.owner.appbar.deleteTrait(appbarTrait);
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
      const appbarController = this.owner.appbar.controller;
      if (appbarController !== null) {
        appbarController.bar.attachView();
        if (folioView.appbar.view === null) {
          folioView.appbar.setView(appbarController.bar.view);
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
      this.owner.pocket.setView(folioView.pocket.attachView());
      this.owner.stack.setView(folioView.stack.attachView());
    },
    willDetachView(folioView: FolioView): void {
      this.owner.stack.setView(null);
      this.owner.pocket.setView(null);
    },
    didDetachView(folioView: FolioView): void {
      this.owner.callObservers("controllerDidDetachFolioView", folioView, this.owner);
    },
    viewDidSetFolioStyle(folioStyle: FolioStyle | undefined, folioView: FolioView): void {
      const coverController = this.owner.cover.controller;
      if (folioStyle === "stacked") {
        if (coverController !== null) {
          this.owner.sheets.addController(coverController);
        }
      } else if (folioStyle === "unstacked") {
        if (coverController !== null) {
          this.owner.sheets.detachController(coverController);
        }
        this.owner.cover.insertView(folioView);
        const appbarController = this.owner.appbar.controller;
        if (appbarController instanceof AppbarController) {
          appbarController.updateLayout();
        }
      }
    },
    viewWillAttachPocket(pocketView: DrawerView): void {
      this.owner.pocket.setView(pocketView);
    },
    viewDidDetachPocket(pocketView: DrawerView): void {
      this.owner.pocket.setView(null);
    },
    viewWillAttachAppbar(appbarView: BarView): void {
      const appbarController = this.owner.appbar.controller;
      if (appbarController !== null) {
        appbarController.bar.setView(appbarView);
      }
    },
    viewDidDetachAppbar(appbarView: BarView): void {
      const appbarController = this.owner.appbar.controller;
      if (appbarController !== null) {
        appbarController.bar.setView(null);
      }
    },
  })
  readonly folio!: TraitViewRef<this, FolioTrait, FolioView>;
  static readonly folio: MemberFastenerClass<FolioController, "folio">;

  protected didPressMenuTool(input: PositionGestureInput, event: Event | null): void {
    this.fullScreen.setValue(!this.fullScreen.value, Affinity.Intrinsic);
    this.callObservers("controllerDidPressMenuTool", input, event, this);
  }

  protected didPressActionTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressActionTool", input, event, this);
  }

  @TraitViewControllerRef<FolioController, BarTrait, BarView, BarController, FolioControllerAppbarExt & ObserverType<BarController | AppbarController>>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): FolioView | null {
      return this.owner.folio.view;
    },
    getTraitViewRef(appbarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return appbarController.bar;
    },
    initController(appbarController: BarController): void {
      const folioTrait = this.owner.folio.trait;
      if (folioTrait !== null) {
        const appbarTrait = folioTrait.appbar.trait;
        if (appbarTrait !== null) {
          appbarController.bar.setTrait(appbarTrait);
        }
      }
      appbarController.bar.attachView();
    },
    willAttachController(appbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppbar", appbarController, this.owner);
    },
    didAttachController(appbarController: BarController): void {
      const appbarTrait = appbarController.bar.trait;
      if (appbarTrait !== null) {
        this.attachAppbarTrait(appbarTrait, appbarController);
      }
      const appbarView = appbarController.bar.view;
      if (appbarView !== null) {
        this.attachAppbarView(appbarView, appbarController);
      }
    },
    willDetachController(appbarController: BarController): void {
      const appbarView = appbarController.bar.view;
      if (appbarView !== null) {
        this.detachAppbarView(appbarView, appbarController);
      }
      const appbarTrait = appbarController.bar.trait;
      if (appbarTrait !== null) {
        this.detachAppbarTrait(appbarTrait, appbarController);
      }
    },
    didDetachController(appbarController: BarController): void {
      this.owner.callObservers("controllerDidDetachAppbar", appbarController, this.owner);
    },
    controllerWillAttachBarTrait(appbarTrait: BarTrait, appbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppbarTrait", appbarTrait, this.owner);
      this.attachAppbarTrait(appbarTrait, appbarController);
    },
    controllerDidDetachBarTrait(appbarTrait: BarTrait, appbarController: BarController): void {
      this.detachAppbarTrait(appbarTrait, appbarController);
      this.owner.callObservers("controllerDidDetachAppbarTrait", appbarTrait, this.owner);
    },
    attachAppbarTrait(appbarTrait: BarTrait, appbarController: BarController): void {
      // hook
    },
    detachAppbarTrait(appbarTrait: BarTrait, appbarController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(appbarView: BarView, appbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachAppbarView", appbarView, this.owner);
      this.attachAppbarView(appbarView, appbarController);
    },
    controllerDidDetachBarView(appbarView: BarView, appbarController: BarController): void {
      this.detachAppbarView(appbarView, appbarController);
      this.owner.callObservers("controllerDidDetachAppbarView", appbarView, this.owner);
    },
    attachAppbarView(appbarView: BarView, appbarController: BarController): void {
      const folioView = this.owner.folio.view;
      if (folioView !== null && folioView.appbar.view === null) {
        folioView.appbar.setView(appbarView);
      }
    },
    detachAppbarView(appbarView: BarView, appbarController: BarController): void {
      appbarView.remove();
    },
    controllerDidPressMenuTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressMenuTool(input, event);
    },
    controllerDidPressActionTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressActionTool(input, event);
    },
    createController(): BarController {
      return new AppbarController();
    },
  })
  readonly appbar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & FolioControllerAppbarExt;
  static readonly appbar: MemberFastenerClass<FolioController, "appbar">;

  @Property<FolioController, boolean>({
    type: Boolean,
    value: false,
    didSetValue(fullScreen: boolean): void {
      const pocketView = this.owner.pocket.view;
      if (pocketView !== null) {
        if (fullScreen) {
          pocketView.dismiss();
        } else {
          pocketView.present();
        }
      }
      this.owner.callObservers("controllerDidSetFullScreen", fullScreen, this.owner);
    },
  })
  readonly fullScreen!: Property<this, boolean>;

  @ViewRef<FolioController, DrawerView>({
    type: DrawerView,
    get parentView(): FolioView | null {
      return this.owner.folio.view;
    },
    willAttachView(pocketView: DrawerView): void {
      this.owner.callObservers("controllerWillAttachPocketView", pocketView, this.owner);
    },
    didAttachView(pocketView: DrawerView): void {
      if (this.owner.fullScreen.value) {
        pocketView.dismiss();
      } else {
        pocketView.present();
      }
    },
    didDetachView(pocketView: DrawerView): void {
      this.owner.callObservers("controllerDidDetachPocketView", pocketView, this.owner);
    },
  })
  readonly pocket!: ViewRef<this, DrawerView>;
  static readonly pocket: MemberFastenerClass<FolioController, "pocket">;

  @TraitViewRef<FolioController, StackTrait, StackView>({
    extends: true,
  })
  override readonly stack!: TraitViewRef<this, StackTrait, StackView>;
  static override readonly stack: MemberFastenerClass<StackController, "stack">;

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
      const coverController = this.controller;
      const coverView = coverController !== null ? coverController.sheet.view : null;
      if (coverView !== null && coverView.parent === null) {
        this.owner.sheets.addController(coverController!);
        if (timing !== void 0) {
          coverView.present(timing);
        }
      }
      return coverView;
    },
  })
  readonly cover!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController> & FolioControllerCoverExt;
  static readonly cover: MemberFastenerClass<FolioController, "cover">;
}
