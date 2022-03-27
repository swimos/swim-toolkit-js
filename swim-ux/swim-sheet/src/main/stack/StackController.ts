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
import {NavBarController} from "./NavBarController";
import {StackView} from "./StackView";
import {StackTrait} from "./StackTrait";
import type {StackControllerObserver} from "./StackControllerObserver";

/** @public */
export interface StackControllerNavBarExt {
  attachNavBarTrait(navBarTrait: BarTrait, navBarController: BarController): void;
  detachNavBarTrait(navBarTrait: BarTrait, navBarController: BarController): void;
  attachNavBarView(navBarView: BarView, navBarController: BarController): void;
  detachNavBarView(navBarView: BarView, navBarController: BarController): void;
}

/** @public */
export interface StackControllerSheetsExt {
  attachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void;
  detachSheetTrait(sheetTrait: SheetTrait, sheetController: SheetController): void;
  attachSheetView(sheetView: SheetView, sheetController: SheetController): void;
  detachSheetView(sheetView: SheetView, sheetController: SheetController): void;
  attachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void;
  detachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void;
}

/** @public */
export interface StackControllerFrontExt {
  attachFrontTrait(frontTrait: SheetTrait, frontController: SheetController): void;
  detachFrontTrait(frontTrait: SheetTrait, frontController: SheetController): void;
  attachFrontView(frontView: SheetView, frontController: SheetController): void;
  detachFrontView(frontView: SheetView, frontController: SheetController): void;
  dismiss(timing?: AnyTiming | boolean): SheetView | null;
}

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
      const navBarTrait = stackTrait.navBar.trait;
      if (navBarTrait !== null) {
        this.owner.navBar.setTrait(navBarTrait);
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
      const navBarTrait = stackTrait.navBar.trait;
      if (navBarTrait !== null) {
        this.owner.navBar.deleteTrait(navBarTrait);
      }
    },
    didDetachTrait(stackTrait: StackTrait): void {
      this.owner.callObservers("controllerDidDetachStackTrait", stackTrait, this.owner);
    },
    traitWillAttachNavBar(navBarTrait: BarTrait): void {
      this.owner.navBar.setTrait(navBarTrait);
    },
    traitDidDetachNavBar(navBarTrait: BarTrait): void {
      this.owner.navBar.deleteTrait(navBarTrait);
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
      const navBarController = this.owner.navBar.controller;
      if (navBarController !== null) {
        navBarController.bar.insertView(stackView);
        if (stackView.navBar.view === null) {
          stackView.navBar.setView(navBarController.bar.view);
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
      const frontView = stackView.front.view;
      if (frontView !== null) {
        const backView = frontView.back.view;
        const forwardView = frontView.forward.view;
        let sheetController: SheetController | null = null;
        let backController: SheetController | null = null;
        let forwardController: SheetController | null = null;
        const sheetControllers = this.owner.sheets.controllers;
        for (const controllerId in sheetControllers) {
          const controller = sheetControllers[controllerId]!;
          const sheetView = controller.sheet.view;
          if (sheetView === frontView) {
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
        this.owner.front.setController(sheetController);
      }
    },
    willDetachView(stackView: StackView): void {
      this.owner.front.setController(null);
    },
    didDetachView(stackView: StackView): void {
      this.owner.callObservers("controllerDidDetachStackView", stackView, this.owner);
    },
    viewWillAttachNavBar(navBarView: BarView): void {
      const navBarController = this.owner.navBar.controller;
      if (navBarController !== null) {
        navBarController.bar.setView(navBarView);
      }
    },
    viewDidDetachNavBar(navBarView: BarView): void {
      const navBarController = this.owner.navBar.controller;
      if (navBarController !== null) {
        navBarController.bar.setView(null);
      }
    },
    viewWillAttachFront(frontView: SheetView): void {
      const backView = frontView.back.view;
      const forwardView = frontView.forward.view;
      let sheetController: SheetController | null = null;
      let backController: SheetController | null = null;
      let forwardController: SheetController | null = null;
      const sheetControllers = this.owner.sheets.controllers;
      for (const controllerId in sheetControllers) {
        const controller = sheetControllers[controllerId]!;
        const sheetView = controller.sheet.view;
        if (sheetView === frontView) {
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
        this.owner.front.setController(sheetController);
      }
    },
    viewDidDetachFront(frontView: SheetView): void {
      this.owner.front.setController(null);
    },
  })
  readonly stack!: TraitViewRef<this, StackTrait, StackView>;
  static readonly stack: MemberFastenerClass<StackController, "stack">;

  protected didPressCloseTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressCloseTool", input, event, this);
  }

  protected didPressBackTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressBackTool", input, event, this);
    if (!input.defaultPrevented) {
      this.front.dismiss();
    }
  }

  protected didPressMoreTool(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressMoreTool", input, event, this);
  }

  @TraitViewControllerRef<StackController, BarTrait, BarView, BarController, StackControllerNavBarExt & ObserverType<BarController | NavBarController>>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): StackView | null {
      return this.owner.stack.view;
    },
    getTraitViewRef(navBarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return navBarController.bar;
    },
    initController(navBarController: BarController): void {
      const stackTrait = this.owner.stack.trait;
      if (stackTrait !== null) {
        const navBarTrait = stackTrait.navBar.trait;
        if (navBarTrait !== null) {
          navBarController.bar.setTrait(navBarTrait);
        }
      }
    },
    willAttachController(navBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavBar", navBarController, this.owner);
    },
    didAttachController(navBarController: BarController): void {
      const navBarTrait = navBarController.bar.trait;
      if (navBarTrait !== null) {
        this.attachNavBarTrait(navBarTrait, navBarController);
      }
      navBarController.bar.insertView();
    },
    willDetachController(navBarController: BarController): void {
      const navBarView = navBarController.bar.view;
      if (navBarView !== null) {
        this.detachNavBarView(navBarView, navBarController);
      }
      const navBarTrait = navBarController.bar.trait;
      if (navBarTrait !== null) {
        this.detachNavBarTrait(navBarTrait, navBarController);
      }
    },
    didDetachController(navBarController: BarController): void {
      this.owner.callObservers("controllerDidDetachNavBar", navBarController, this.owner);
    },
    controllerWillAttachBarTrait(navBarTrait: BarTrait, navBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavBarTrait", navBarTrait, this.owner);
      this.attachNavBarTrait(navBarTrait, navBarController);
    },
    controllerDidDetachBarTrait(navBarTrait: BarTrait, navBarController: BarController): void {
      this.detachNavBarTrait(navBarTrait, navBarController);
      this.owner.callObservers("controllerDidDetachNavBarTrait", navBarTrait, this.owner);
    },
    attachNavBarTrait(navBarTrait: BarTrait, navBarController: BarController): void {
      // hook
    },
    detachNavBarTrait(navBarTrait: BarTrait, navBarController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(navBarView: BarView, navBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachNavBarView", navBarView, this.owner);
      this.attachNavBarView(navBarView, navBarController);
    },
    controllerDidDetachBarView(navBarView: BarView, navBarController: BarController): void {
      this.detachNavBarView(navBarView, navBarController);
      this.owner.callObservers("controllerDidDetachNavBarView", navBarView, this.owner);
    },
    attachNavBarView(navBarView: BarView, navBarController: BarController): void {
      const stackView = this.owner.stack.view;
      if (stackView !== null && stackView.navBar.view === null) {
        stackView.navBar.setView(navBarView);
      }
    },
    detachNavBarView(navBarView: BarView, navBarController: BarController): void {
      navBarView.remove();
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
      return new NavBarController();
    },
  })
  readonly navBar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & StackControllerNavBarExt;
  static readonly navBar: MemberFastenerClass<StackController, "navBar">;

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
      const titleToolView = sheetView.titleTool.view;
      if (titleToolView !== null) {
        this.attachTitleToolView(titleToolView, sheetController);
      }
      const stackView = this.owner.stack.view;
      if (stackView !== null) {
        stackView.sheets.addView(sheetView);
      }
    },
    detachSheetView(sheetView: SheetView, sheetController: SheetController): void {
      const titleToolView = sheetView.titleTool.view;
      if (titleToolView !== null) {
        this.detachTitleToolView(titleToolView, sheetController);
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
    controllerWillAttachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void {
      this.owner.callObservers("controllerWillAttachSheetTitleToolView", titleToolView, sheetController, this.owner);
      this.attachTitleToolView(titleToolView, sheetController);
    },
    controllerDidDetachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void {
      this.detachTitleToolView(titleToolView, sheetController);
      this.owner.callObservers("controllerDidDetachSheetTitleToolView", titleToolView, sheetController, this.owner);
    },
    attachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void {
      // hook
    },
    detachTitleToolView(titleToolView: ToolView, sheetController: SheetController): void {
      titleToolView.remove();
    },
    controllerDidDismissSheetView(sheetView: SheetView, sheetController: SheetController): void {
      const frontController = this.owner.front.controller;
      if (frontController !== null && frontController !== sheetController
          && sheetView.back.view === null && sheetView.forward.view === null) {
        this.detachController(sheetController);
      }
    },
  })
  readonly sheets!: TraitViewControllerSet<this, SheetTrait, SheetView, SheetController> & StackControllerSheetsExt;
  static readonly sheets: MemberFastenerClass<StackController, "sheets">;

  @TraitViewControllerRef<StackController, SheetTrait, SheetView, SheetController, StackControllerFrontExt>({
    implements: true,
    type: SheetController,
    binds: false,
    observes: true,
    getTraitViewRef(frontController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return frontController.sheet;
    },
    willAttachController(frontController: SheetController): void {
      this.owner.callObservers("controllerWillAttachFront", frontController, this.owner);
    },
    didAttachController(frontController: SheetController): void {
      const frontTrait = frontController.sheet.trait;
      if (frontTrait !== null) {
        this.attachFrontTrait(frontTrait, frontController);
      }
      const frontView = frontController.sheet.view;
      if (frontView !== null) {
        this.attachFrontView(frontView, frontController);
      }
    },
    willDetachController(frontController: SheetController): void {
      const frontView = frontController.sheet.view;
      if (frontView !== null) {
        this.detachFrontView(frontView, frontController);
      }
      const frontTrait = frontController.sheet.trait;
      if (frontTrait !== null) {
        this.detachFrontTrait(frontTrait, frontController);
      }
    },
    didDetachController(frontController: SheetController): void {
      this.owner.callObservers("controllerDidDetachFront", frontController, this.owner);
    },
    controllerWillAttachSheetTrait(frontTrait: SheetTrait, frontController: SheetController): void {
      this.owner.callObservers("controllerWillAttachFrontTrait", frontTrait, this.owner);
      this.attachFrontTrait(frontTrait, frontController);
    },
    controllerDidDetachSheetTrait(frontTrait: SheetTrait, frontController: SheetController): void {
      this.detachFrontTrait(frontTrait, frontController);
      this.owner.callObservers("controllerDidDetachFrontTrait", frontTrait, this.owner);
    },
    attachFrontTrait(frontTrait: SheetTrait, frontController: SheetController): void {
      // hook
    },
    detachFrontTrait(frontTrait: SheetTrait, frontController: SheetController): void {
      // hook
    },
    controllerWillAttachSheetView(frontView: SheetView, frontController: SheetController): void {
      this.owner.callObservers("controllerWillAttachFrontView", frontView, this.owner);
      this.attachFrontView(frontView, frontController);
    },
    controllerDidDetachSheetView(frontView: SheetView, frontController: SheetController): void {
      this.detachFrontView(frontView, frontController);
      this.owner.callObservers("controllerDidDetachFrontView", frontView, this.owner);
    },
    attachFrontView(frontView: SheetView, frontController: SheetController): void {
      // hook
    },
    detachFrontView(frontView: SheetView, frontController: SheetController): void {
      // hook
    },
    dismiss(timing?: AnyTiming | boolean): SheetView | null {
      const frontView = this.view;
      if (frontView !== null) {
        frontView.dismiss(timing);
      }
      return frontView;
    },
  })
  readonly front!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController> & StackControllerFrontExt;
  static readonly front: MemberFastenerClass<StackController, "front">;
}
