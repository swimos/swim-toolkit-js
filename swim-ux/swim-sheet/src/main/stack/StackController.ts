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
import type {MemberFastenerClass} from "@swim/component";
import type {Trait} from "@swim/model";
import type {PositionGestureInput} from "@swim/view";
import {
  Controller,
  TraitViewRef,
  TraitViewControllerRef,
  TraitViewControllerSet,
} from "@swim/controller";
import {ToolView, BarView, BarTrait, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import {NavbarController} from "./NavbarController";
import {StackView} from "./StackView";
import {StackTrait} from "./StackTrait";
import type {StackControllerObserver} from "./StackControllerObserver";

/** @public */
export interface StackControllerNavbarExt {
  attachNavbarTrait(navbarTrait: BarTrait, navbarController: BarController): void;
  detachNavbarTrait(navbarTrait: BarTrait, navbarController: BarController): void;
  attachNavbarView(navbarView: BarView, navbarController: BarController): void;
  detachNavbarView(navbarView: BarView, navbarController: BarController): void;
}

/** @public */
export type StackControllerSheetsExt = {
  attachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void;
  detachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void;
  attachSheetView(sheetView: SheetView, sheetController: SheetController): void;
  detachSheetView(sheetView: SheetView, sheetController: SheetController): void;
  attachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void;
  detachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void;
};

/** @public */
export type StackControllerActiveExt = {
  attachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void;
  detachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void;
  attachActiveView(activeView: SheetView, activeController: SheetController): void;
  detachActiveView(activeView: SheetView, activeController: SheetController): void;
  dismiss(timing?: AnyTiming | boolean): SheetView | null;
};

/** @public */
export class StackController extends Controller {
  override readonly observerType?: Class<StackControllerObserver>;

  @TraitViewRef<StackController, StackTrait, StackView>({
    traitType: StackTrait,
    observesTrait: true,
    willAttachTrait(stackTrait: StackTrait): void {
      this.owner.callObservers("controllerWillAttachStackTrait", stackTrait, this.owner);
    },
    didAttachTrait(stackTrait: StackTrait): void {
      const navbarTrait = stackTrait.navbar.trait;
      if (navbarTrait !== null) {
        this.owner.navbar.setTrait(navbarTrait);
      }
      const sheetTraits = stackTrait.sheets.traits;
      for (const traitId in sheetTraits) {
        const sheetTrait = sheetTraits[traitId]!;
        this.owner.sheets.addTraitController(sheetTrait);
      }
    },
    willDetachTrait(stackTrait: StackTrait): void {
      const sheetTraits = stackTrait.sheets.traits;
      for (const traitId in sheetTraits) {
        const sheetTrait = sheetTraits[traitId]!;
        this.owner.sheets.deleteTraitController(sheetTrait);
      }
      const navbarTrait = stackTrait.navbar.trait;
      if (navbarTrait !== null) {
        this.owner.navbar.deleteTrait(navbarTrait);
      }
    },
    didDetachTrait(stackTrait: StackTrait): void {
      this.owner.callObservers("controllerDidDetachStackTrait", stackTrait, this.owner);
    },
    traitWillAttachNavbar(navbarTrait: BarTrait): void {
      this.owner.navbar.setTrait(navbarTrait);
    },
    traitDidDetachNavbar(navbarTrait: BarTrait): void {
      this.owner.navbar.deleteTrait(navbarTrait);
    },
    traitWillAttachSheet(sheetTrait: SheetTrait, targetTrait: Trait): void {
      this.owner.sheets.addTraitController(sheetTrait, targetTrait);
    },
    traitDidDetachSheet(sheetTrait: SheetTrait): void {
      this.owner.sheets.deleteTraitController(sheetTrait);
    },
    viewType: StackView,
    observesView: true,
    initView(stackView: StackView): void {
      const navbarController = this.owner.navbar.controller;
      if (navbarController !== null) {
        navbarController.bar.insertView(stackView);
        if (stackView.navbar.view === null) {
          stackView.navbar.setView(navbarController.bar.view);
        }
      }
      const sheetControllers = this.owner.sheets.controllers;
      for (const controllerId in sheetControllers) {
        const sheetController = sheetControllers[controllerId]!;
        const sheetView = sheetController.sheet.view;
        if (sheetView !== null && sheetView.parent === null) {
          const sheetTrait = sheetController.sheet.trait;
          if (sheetTrait !== null) {
            sheetController.sheet.insertView(stackView, void 0, void 0, sheetTrait.key);
          }
        }
      }
    },
    willAttachView(stackView: StackView): void {
      this.owner.callObservers("controllerWillAttachStackView", stackView, this.owner);
    },
    didAttachView(stackView: StackView): void {
      const activeView = stackView.active.view;
      if (activeView !== null) {
        const backView = activeView.back.view;
        const forwardView = activeView.forward.view;
        let sheetController: SheetController | null = null;
        let backController: SheetController | null = null;
        let forwardController: SheetController | null = null;
        const sheetControllers = this.owner.sheets.controllers;
        for (const controllerId in sheetControllers) {
          const controller = sheetControllers[controllerId]!;
          const sheetView = controller.sheet.view;
          if (sheetView === activeView) {
            sheetController = controller;
          } else if (sheetView === backView) {
            backController = controller;
          } else if (sheetView === forwardView) {
            forwardController = controller;
          }
        }
        if (sheetController !== null) {
          sheetController.back.setController(backController);
          sheetController.forward.setController(forwardController);
        }
        this.owner.active.setController(sheetController);
      }
    },
    willDetachView(stackView: StackView): void {
      this.owner.active.setController(null);
    },
    didDetachView(stackView: StackView): void {
      this.owner.callObservers("controllerDidDetachStackView", stackView, this.owner);
    },
    viewWillAttachNavbar(navbarView: BarView): void {
      const navbarController = this.owner.navbar.controller;
      if (navbarController !== null) {
        navbarController.bar.setView(navbarView);
      }
    },
    viewDidDetachNavbar(navbarView: BarView): void {
      const navbarController = this.owner.navbar.controller;
      if (navbarController !== null) {
        navbarController.bar.setView(null);
      }
    },
    viewWillAttachActive(activeView: SheetView): void {
      const backView = activeView.back.view;
      const forwardView = activeView.forward.view;
      let sheetController: SheetController | null = null;
      let backController: SheetController | null = null;
      let forwardController: SheetController | null = null;
      const sheetControllers = this.owner.sheets.controllers;
      for (const controllerId in sheetControllers) {
        const controller = sheetControllers[controllerId]!;
        const sheetView = controller.sheet.view;
        if (sheetView === activeView) {
          sheetController = controller;
        } else if (sheetView === backView) {
          backController = controller;
        } else if (sheetView === forwardView) {
          forwardController = controller;
        }
      }
      if (sheetController !== null) {
        sheetController.back.setController(backController);
        sheetController.forward.setController(forwardController);
        this.owner.active.setController(sheetController);
      }
    },
    viewDidDetachActive(activeView: SheetView): void {
      this.owner.active.setController(null);
    },
  })
  readonly stack!: TraitViewRef<this, StackTrait, StackView>;
  static readonly stack: MemberFastenerClass<StackController, "stack">;

  protected didPressCloseTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressCloseTool", input, event, this);
  }

  protected didPressBackTool(input: PositionGestureInput, event: Event | null): void {
    this.active.dismiss();
    this.callObservers("controllerDidPressBackTool", input, event, this);
  }

  protected didPressMoreTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressMoreTool", input, event, this);
  }

  @TraitViewControllerRef<StackController, BarTrait, BarView, BarController, StackControllerNavbarExt & ObserverType<BarController | NavbarController>>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): StackView | null {
      return this.owner.stack.view;
    },
    getTraitViewRef(navbarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return navbarController.bar;
    },
    initController(navbarController: BarController): void {
      const stackTrait = this.owner.stack.trait;
      if (stackTrait !== null) {
        const navbarTrait = stackTrait.navbar.trait;
        if (navbarTrait !== null) {
          navbarController.bar.setTrait(navbarTrait);
        }
      }
    },
    willAttachController(navbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavbar", navbarController, this.owner);
    },
    didAttachController(navbarController: BarController): void {
      const navbarTrait = navbarController.bar.trait;
      if (navbarTrait !== null) {
        this.attachNavbarTrait(navbarTrait, navbarController);
      }
      navbarController.bar.insertView();
    },
    willDetachController(navbarController: BarController): void {
      const navbarView = navbarController.bar.view;
      if (navbarView !== null) {
        this.detachNavbarView(navbarView, navbarController);
      }
      const navbarTrait = navbarController.bar.trait;
      if (navbarTrait !== null) {
        this.detachNavbarTrait(navbarTrait, navbarController);
      }
    },
    didDetachController(navbarController: BarController): void {
      this.owner.callObservers("controllerDidDetachNavbar", navbarController, this.owner);
    },
    controllerWillAttachBarTrait(navbarTrait: BarTrait, navbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavbarTrait", navbarTrait, this.owner);
      this.attachNavbarTrait(navbarTrait, navbarController);
    },
    controllerDidDetachBarTrait(navbarTrait: BarTrait, navbarController: BarController): void {
      this.detachNavbarTrait(navbarTrait, navbarController);
      this.owner.callObservers("controllerDidDetachNavbarTrait", navbarTrait, this.owner);
    },
    attachNavbarTrait(navbarTrait: BarTrait, navbarController: BarController): void {
      // hook
    },
    detachNavbarTrait(navbarTrait: BarTrait, navbarController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(navbarView: BarView, navbarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavbarView", navbarView, this.owner);
      this.attachNavbarView(navbarView, navbarController);
    },
    controllerDidDetachBarView(navbarView: BarView, navbarController: BarController): void {
      this.detachNavbarView(navbarView, navbarController);
      this.owner.callObservers("controllerDidDetachNavbarView", navbarView, this.owner);
    },
    attachNavbarView(navbarView: BarView, navbarController: BarController): void {
      const stackView = this.owner.stack.view;
      if (stackView !== null && stackView.navbar.view === null) {
        stackView.navbar.setView(navbarView);
      }
    },
    detachNavbarView(navbarView: BarView, navbarController: BarController): void {
      navbarView.remove();
    },
    controllerDidPressCloseTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressCloseTool(input, event);
    },
    controllerDidPressBackTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressBackTool(input, event);
    },
    controllerDidPressMoreTool(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressMoreTool(input, event);
    },
    createController(): BarController {
      return new NavbarController();
    },
  })
  readonly navbar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & StackControllerNavbarExt;
  static readonly navbar: MemberFastenerClass<StackController, "navbar">;

  @TraitViewControllerSet<StackController, SheetTrait, SheetView, SheetController, StackControllerSheetsExt>({
    implements: true,
    type: SheetController,
    binds: false,
    observes: true,
    get parentView(): StackView | null {
      return this.owner.stack.view;
    },
    getTraitViewRef(sheetController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return sheetController.sheet;
    },
    willAttachController(sheetController: SheetController): void {
      this.owner.callObservers("controllerWillAttachSheet", sheetController, this.owner);
    },
    didAttachController(sheetController: SheetController): void {
      const sheetTrait = sheetController.sheet.trait;
      if (sheetTrait !== null) {
        this.attachSheetTrait(sheetTrait, sheetController);
      }
      const sheetView = sheetController.sheet.view;
      if (sheetView !== null) {
        this.attachSheetView(sheetView, sheetController);
      }
    },
    willDetachController(sheetController: SheetController): void {
      const sheetView = sheetController.sheet.view;
      if (sheetView !== null) {
        this.detachSheetView(sheetView, sheetController);
      }
      const sheetTrait = sheetController.sheet.trait;
      if (sheetTrait !== null) {
        this.detachSheetTrait(sheetTrait, sheetController);
      }
    },
    didDetachController(sheetController: SheetController): void {
      this.owner.callObservers("controllerDidDetachSheet", sheetController, this.owner);
    },
    controllerWillAttachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void {
      this.owner.callObservers("controllerWillAttachSheetTrait", sheetTrait, sheetController, this.owner);
      this.attachSheetTrait(sheetTrait, sheetController);
    },
    controllerDidDetachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void {
      this.detachSheetTrait(sheetTrait, sheetController);
      this.owner.callObservers("controllerDidDetachSheetTrait", sheetTrait, sheetController, this.owner);
    },
    attachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void {
      // hook
    },
    detachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void {
      // hook
    },
    controllerWillAttachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      this.owner.callObservers("controllerWillAttachSheetView", sheetView, sheetController, this.owner);
      this.attachSheetView(sheetView, sheetController);
    },
    controllerDidDetachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      this.detachSheetView(sheetView, sheetController);
      this.owner.callObservers("controllerDidDetachSheetView", sheetView, sheetController, this.owner);
    },
    attachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      const sheetTitleView = sheetView.sheetTitle.view;
      if (sheetTitleView !== null) {
        this.attachSheetTitleView(sheetTitleView, sheetController);
      }
      const stackView = this.owner.stack.view;
      if (stackView !== null) {
        stackView.sheets.addView(sheetView);
      }
    },
    detachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      const sheetTitleView = sheetView.sheetTitle.view;
      if (sheetTitleView !== null) {
        this.detachSheetTitleView(sheetTitleView, sheetController);
      }
      sheetView.remove();
    },
    controllerWillAttachBackView(backView: SheetView, sheetController: SheetController): void {
      const sheetControllers = this.controllers;
      for (const controllerId in sheetControllers) {
        const sheetController = sheetControllers[controllerId]!;
        if (sheetController.sheet.view === backView) {
          sheetController.back.setController(sheetController);
        }
      }
    },
    controllerDidDetachBackView(backView: SheetView, sheetController: SheetController): void {
      sheetController.back.setController(null);
    },
    controllerWillAttachForwardView(forwardView: SheetView, sheetController: SheetController): void {
      const sheetControllers = this.controllers;
      for (const controllerId in sheetControllers) {
        const sheetController = sheetControllers[controllerId]!;
        if (sheetController.sheet.view === forwardView) {
          sheetController.forward.setController(sheetController);
        }
      }
    },
    controllerDidDetachForwardView(forwardView: SheetView, sheetController: SheetController): void {
      sheetController.forward.setController(null);
    },
    controllerWillAttachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void {
      this.owner.callObservers("controllerWillAttachSheetTitleView", sheetTitleView, sheetController, this.owner);
      this.attachSheetTitleView(sheetTitleView, sheetController);
    },
    controllerDidDetachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void {
      this.detachSheetTitleView(sheetTitleView, sheetController);
      this.owner.callObservers("controllerDidDetachSheetTitleView", sheetTitleView, sheetController, this.owner);
    },
    attachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void {
      // hook
    },
    detachSheetTitleView(sheetTitleView: ToolView, sheetController: SheetController): void {
      sheetTitleView.remove();
    },
    controllerDidDismissSheetView(sheetView: SheetView, sheetController: SheetController): void {
      const activeController = this.owner.active.controller;
      if (activeController !== null && activeController !== sheetController
          && sheetView.back.view === null && sheetView.forward.view === null) {
        this.detachController(sheetController);
      }
    },
  })
  readonly sheets!: TraitViewControllerSet<this, SheetTrait, SheetView, SheetController> & StackControllerSheetsExt;
  static readonly sheets: MemberFastenerClass<StackController, "sheets">;

  @TraitViewControllerRef<StackController, SheetTrait, SheetView, SheetController, StackControllerActiveExt>({
    implements: true,
    type: SheetController,
    binds: false,
    observes: true,
    getTraitViewRef(activeController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return activeController.sheet;
    },
    willAttachController(activeController: SheetController): void {
      this.owner.callObservers("controllerWillAttachActive", activeController, this.owner);
    },
    didAttachController(activeController: SheetController): void {
      const activeTrait = activeController.sheet.trait;
      if (activeTrait !== null) {
        this.attachActiveTrait(activeTrait, activeController);
      }
      const activeView = activeController.sheet.view;
      if (activeView !== null) {
        this.attachActiveView(activeView, activeController);
      }
    },
    willDetachController(activeController: SheetController): void {
      const activeView = activeController.sheet.view;
      if (activeView !== null) {
        this.detachActiveView(activeView, activeController);
      }
      const activeTrait = activeController.sheet.trait;
      if (activeTrait !== null) {
        this.detachActiveTrait(activeTrait, activeController);
      }
    },
    didDetachController(activeController: SheetController): void {
      this.owner.callObservers("controllerDidDetachActive", activeController, this.owner);
    },
    controllerWillAttachSheetTrait(activeTrait: SheetTrait, activeController: SheetController): void {
      this.owner.callObservers("controllerWillAttachActiveTrait", activeTrait, this.owner);
      this.attachActiveTrait(activeTrait, activeController);
    },
    controllerDidDetachSheetTrait(activeTrait: SheetTrait, activeController: SheetController): void {
      this.detachActiveTrait(activeTrait, activeController);
      this.owner.callObservers("controllerDidDetachActiveTrait", activeTrait, this.owner);
    },
    attachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void {
      // hook
    },
    detachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void {
      // hook
    },
    controllerWillAttachSheetView(activeView: SheetView, activeController: SheetController): void {
      this.owner.callObservers("controllerWillAttachActiveView", activeView, this.owner);
      this.attachActiveView(activeView, activeController);
    },
    controllerDidDetachSheetView(activeView: SheetView, activeController: SheetController): void {
      this.detachActiveView(activeView, activeController);
      this.owner.callObservers("controllerDidDetachActiveView", activeView, this.owner);
    },
    attachActiveView(activeView: SheetView, activeController: SheetController): void {
      // hook
    },
    detachActiveView(activeView: SheetView, activeController: SheetController): void {
      // hook
    },
    dismiss(timing?: AnyTiming | boolean): SheetView | null {
      const activeView = this.view;
      if (activeView !== null) {
        activeView.dismiss(timing);
      }
      return activeView;
    },
  })
  readonly active!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController> & StackControllerActiveExt;
  static readonly active: MemberFastenerClass<StackController, "active">;
}
