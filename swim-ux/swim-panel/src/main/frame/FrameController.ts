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
import type {PanelView} from "../panel/PanelView";
import type {PanelTrait} from "../panel/PanelTrait";
import {PanelController} from "../panel/PanelController";
import {FrameView} from "./FrameView";
import {FrameTrait} from "./FrameTrait";
import type {FrameControllerObserver} from "./FrameControllerObserver";

/** @public */
export class FrameController extends PanelController {
  override readonly observerType?: Class<FrameControllerObserver>;

  @TraitViewRefDef<FrameController["panel"]>({
    extends: true,
    traitType: FrameTrait,
    observesTrait: true,
    didAttachTrait(frameTrait: FrameTrait, targetTrait: Trait | null): void {
      PanelController.panel.prototype.didAttachTrait.call(this, frameTrait, targetTrait);
      this.owner.panes.addTraits(frameTrait.panes.traits);
    },
    willDetachTrait(frameTrait: FrameTrait): void {
      PanelController.panel.prototype.willDetachTrait.call(this, frameTrait);
      this.owner.panes.deleteTraits(frameTrait.panes.traits);
    },
    traitWillAttachPane(paneTrait: PanelTrait, targetTrait: Trait | null): void {
      this.owner.panes.addTrait(paneTrait, targetTrait);
    },
    traitDidDetachPane(paneTrait: PanelTrait): void {
      this.owner.panes.deleteTrait(paneTrait);
    },
    viewType: FrameView,
    initView(frameView: PanelView): void {
      PanelController.panel.prototype.initView.call(this, frameView);
      const paneControllers = this.owner.panes.controllers;
      for (const controllerId in paneControllers) {
        const paneController = paneControllers[controllerId]!;
        const paneView = paneController.panel.view;
        if (paneView !== null && paneView.parent === null) {
          const paneTrait = paneController.panel.trait;
          if (paneTrait !== null) {
            paneController.panel.insertView(frameView, void 0, void 0, paneTrait.key);
          }
        }
      }
    },
  })
  override readonly panel!: TraitViewRefDef<this, {
    extends: PanelController["panel"],
    trait: FrameTrait,
    observesTrait: true,
    view: FrameView,
  }>;
  static override readonly panel: FastenerClass<FrameController["panel"]>;

  @TraitViewControllerSetDef<FrameController["panes"]>({
    controllerType: PanelController,
    binds: true,
    observes: true,
    get parentView(): FrameView | null {
      return this.owner.panel.view;
    },
    getTraitViewRef(paneController: PanelController): TraitViewRef<unknown, PanelTrait, PanelView> {
      return paneController.panel;
    },
    willAttachController(paneController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPane", paneController, this.owner);
    },
    didAttachController(paneController: PanelController): void {
      const paneTrait = paneController.panel.trait;
      if (paneTrait !== null) {
        this.attachPaneTrait(paneTrait, paneController);
      }
      const paneView = paneController.panel.view;
      if (paneView !== null) {
        this.attachPaneView(paneView, paneController);
      }
    },
    willDetachController(paneController: PanelController): void {
      const paneView = paneController.panel.view;
      if (paneView !== null) {
        this.detachPaneView(paneView, paneController);
      }
      const paneTrait = paneController.panel.trait;
      if (paneTrait !== null) {
        this.detachPaneTrait(paneTrait, paneController);
      }
    },
    didDetachController(paneController: PanelController): void {
      this.owner.callObservers("controllerDidDetachPane", paneController, this.owner);
    },
    controllerWillAttachPanelTrait(paneTrait: PanelTrait, paneController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPaneTrait", paneTrait, paneController, this.owner);
      this.attachPaneTrait(paneTrait, paneController);
    },
    controllerDidDetachPanelTrait(paneTrait: PanelTrait, paneController: PanelController): void {
      this.detachPaneTrait(paneTrait, paneController);
      this.owner.callObservers("controllerDidDetachPaneTrait", paneTrait, paneController, this.owner);
    },
    attachPaneTrait(paneTrait: PanelTrait, paneController: PanelController): void {
      // hook
    },
    detachPaneTrait(paneTrait: PanelTrait, paneController: PanelController): void {
      // hook
    },
    controllerWillAttachPanelView(paneView: PanelView, paneController: PanelController): void {
      this.owner.callObservers("controllerWillAttachPaneView", paneView, paneController, this.owner);
      this.attachPaneView(paneView, paneController);
    },
    controllerDidDetachPanelView(paneView: PanelView, paneController: PanelController): void {
      this.detachPaneView(paneView, paneController);
      this.owner.callObservers("controllerDidDetachPaneView", paneView, paneController, this.owner);
    },
    attachPaneView(paneView: PanelView, paneController: PanelController): void {
      // hook
    },
    detachPaneView(paneView: PanelView, paneController: PanelController): void {
      paneView.remove();
    },
    createController(paneTrait?: PanelTrait): PanelController {
      if (paneTrait !== void 0) {
        return paneTrait.createPanelController();
      } else {
        return TraitViewControllerSet.prototype.createController.call(this);
      }
    },
  })
  readonly panes!: TraitViewControllerSetDef<this, {
    trait: PanelTrait,
    view: PanelView,
    controller: PanelController,
    implements: {
      attachPaneTrait(paneTrait: PanelTrait, paneController: PanelController): void;
      detachPaneTrait(paneTrait: PanelTrait, paneController: PanelController): void;
      attachPaneView(paneView: PanelView, paneController: PanelController): void;
      detachPaneView(paneView: PanelView, paneController: PanelController): void;
    },
    observes: true,
  }>;
  static readonly panes: FastenerClass<FrameController["panes"]>;
}
