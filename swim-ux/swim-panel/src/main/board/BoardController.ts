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

import type {Class} from "@swim/util";
import type {FastenerClass} from "@swim/component";
import type {Trait} from "@swim/model";
import {
  TraitViewRefDef,
  TraitViewRef,
  TraitViewControllerSetDef,
  TraitViewControllerSet,
} from "@swim/controller";
import {SheetController} from "@swim/sheet";
import type {PanelView} from "../panel/PanelView";
import type {PanelTrait} from "../panel/PanelTrait";
import {PanelController} from "../panel/PanelController";
import {BoardView} from "./BoardView";
import {BoardTrait} from "./BoardTrait";
import type {BoardControllerObserver} from "./BoardControllerObserver";

/** @public */
export class BoardController extends SheetController {
  override readonly observerType?: Class<BoardControllerObserver>;

  @TraitViewRefDef<BoardController["sheet"]>({
    extends: SheetController.sheet,
    traitType: BoardTrait,
    observesTrait: true,
    didAttachTrait(boardTrait: BoardTrait, targetTrait: Trait): void {
      SheetController.sheet.prototype.didAttachTrait.call(this, boardTrait, targetTrait);
      this.owner.panels.addTraits(boardTrait.panels.traits);
    },
    willDetachTrait(boardTrait: BoardTrait): void {
      this.owner.panels.deleteTraits(boardTrait.panels.traits);
      SheetController.sheet.prototype.willDetachTrait.call(this, boardTrait);
    },
    traitWillAttachPanel(panelTrait: PanelTrait, targetTrait: Trait | null): void {
      this.owner.panels.addTrait(panelTrait, targetTrait);
    },
    traitDidDetachPanel(panelTrait: PanelTrait): void {
      this.owner.panels.deleteTrait(panelTrait);
    },
    viewType: BoardView,
    initView(boardView: BoardView): void {
      SheetController.sheet.prototype.initView.call(this, boardView);
      const panelControllers = this.owner.panels.controllers;
      for (const controllerId in panelControllers) {
        const panelController = panelControllers[controllerId]!;
        const panelView = panelController.panel.view;
        if (panelView !== null && panelView.parent === null) {
          const panelTrait = panelController.panel.trait;
          if (panelTrait !== null) {
            panelController.panel.insertView(boardView, void 0, void 0, panelTrait.key);
          }
        }
      }
    },
  })
  override readonly sheet!: TraitViewRefDef<this, {
    extends: SheetController["sheet"],
    trait: BoardTrait,
    observesTrait: true,
    view: BoardView,
  }>;
  static override readonly sheet: FastenerClass<BoardController["sheet"]>;

  @TraitViewControllerSetDef<BoardController["panels"]>({
    controllerType: PanelController,
    binds: true,
    observes: true,
    get parentView(): BoardView | null {
      return this.owner.sheet.view;
    },
    getTraitViewRef(panelController: PanelController): TraitViewRef<unknown, PanelTrait, PanelView> {
      return panelController.panel;
    },
    willAttachController(panelController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPanel", panelController, this.owner);
    },
    didAttachController(panelController: PanelController): void {
      const panelTrait = panelController.panel.trait;
      if (panelTrait !== null) {
        this.attachPanelTrait(panelTrait, panelController);
      }
      const panelView = panelController.panel.view;
      if (panelView !== null) {
        this.attachPanelView(panelView, panelController);
      }
    },
    willDetachController(panelController: PanelController): void {
      const panelView = panelController.panel.view;
      if (panelView !== null) {
        this.detachPanelView(panelView, panelController);
      }
      const panelTrait = panelController.panel.trait;
      if (panelTrait !== null) {
        this.detachPanelTrait(panelTrait, panelController);
      }
    },
    didDetachController(panelController: PanelController): void {
      this.owner.callObservers("controllerDidDetachPanel", panelController, this.owner);
    },
    controllerWillAttachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPanelTrait", panelTrait, panelController, this.owner);
      this.attachPanelTrait(panelTrait, panelController);
    },
    controllerDidDetachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void {
      this.detachPanelTrait(panelTrait, panelController);
      this.owner.callObservers("controllerDidDetachPanelTrait", panelTrait, panelController, this.owner);
    },
    attachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void {
      // hook
    },
    detachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void {
      // hook
    },
    controllerWillAttachPanelView(panelView: PanelView, panelController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPanelView", panelView, panelController, this.owner);
      this.attachPanelView(panelView, panelController);
    },
    controllerDidDetachPanelView(panelView: PanelView, panelController: PanelController): void {
      this.detachPanelView(panelView, panelController);
      this.owner.callObservers("controllerDidDetachPanelView", panelView, panelController, this.owner);
    },
    attachPanelView(panelView: PanelView, panelController: PanelController): void {
      // hook
    },
    detachPanelView(panelView: PanelView, panelController: PanelController): void {
      panelView.remove();
    },
    createController(panelTrait?: PanelTrait): PanelController {
      if (panelTrait !== void 0) {
        return panelTrait.createPanelController();
      } else {
        return TraitViewControllerSet.prototype.createController.call(this);
      }
    },
  })
  readonly panels!: TraitViewControllerSetDef<this, {
    trait: PanelTrait,
    view: PanelView,
    controller: PanelController,
    implements: {
      attachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void;
      detachPanelTrait(panelTrait: PanelTrait, panelController: PanelController): void;
      attachPanelView(panelView: PanelView, panelController: PanelController): void;
      detachPanelView(panelView: PanelView, panelController: PanelController): void;
    },
    observes: true,
  }>;
  static readonly panels: FastenerClass<BoardController["panels"]>;
}
