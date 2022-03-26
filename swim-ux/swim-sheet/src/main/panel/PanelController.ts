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

import type {Class, ObserverType} from "@swim/util";
import type {PositionGestureInput} from "@swim/view";
import type {MemberFastenerClass} from "@swim/component";
import type {Trait} from "@swim/model";
import {TraitViewRef, TraitViewControllerRef, TraitViewControllerSet} from "@swim/controller";
import {ToolView, BarView, BarTrait, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import type {SheetTrait} from "../sheet/SheetTrait";
import {SheetController} from "../sheet/SheetController";
import {TabBarController} from "./TabBarController";
import {PanelView} from "./PanelView";
import {PanelTrait} from "./PanelTrait";
import type {PanelControllerObserver} from "./PanelControllerObserver";

/** @public */
export interface PanelControllerTabBarExt {
  attachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void;
  detachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void;
  attachTabBarView(tabBarView: BarView, tabBarController: BarController): void;
  detachTabBarView(tabBarView: BarView, tabBarController: BarController): void;
}

/** @public */
export interface PanelControllerTabsExt {
  attachTabTrait(tabTrait: SheetTrait, tabController: SheetController): void;
  detachTabTrait(tabTrait: SheetTrait, tabController: SheetController): void;
  attachTabView(tabView: SheetView, tabController: SheetController): void;
  detachTabView(tabView: SheetView, tabController: SheetController): void;
  attachIconToolView(iconToolView: ToolView, tabController: SheetController): void;
  detachIconToolView(iconToolView: ToolView, tabController: SheetController): void;
};

/** @public */
export interface PanelControllerActiveExt {
  attachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void;
  detachActiveTrait(activeTrait: SheetTrait, activeController: SheetController): void;
  attachActiveView(activeView: SheetView, activeController: SheetController): void;
  detachActiveView(activeView: SheetView, activeController: SheetController): void;
};

/** @public */
export class PanelController extends SheetController {
  override readonly observerType?: Class<PanelControllerObserver>;

  @TraitViewRef<PanelController, PanelTrait, PanelView>({
    traitType: PanelTrait,
    observesTrait: true,
    willAttachTrait(panelTrait: PanelTrait): void {
      this.owner.callObservers("controllerWillAttachPanelTrait", panelTrait, this.owner);
    },
    didAttachTrait(panelTrait: PanelTrait): void {
      const tabBarTrait = panelTrait.tabBar.trait;
      if (tabBarTrait !== null) {
        this.owner.tabBar.setTrait(tabBarTrait);
      }
      const tabTraits = panelTrait.tabs.traits;
      for (const traitId in tabTraits) {
        const tabTrait = tabTraits[traitId]!;
        this.owner.tabs.addTraitController(tabTrait);
      }
    },
    willDetachTrait(panelTrait: PanelTrait): void {
      const tabTraits = panelTrait.tabs.traits;
      for (const traitId in tabTraits) {
        const tabTrait = tabTraits[traitId]!;
        this.owner.tabs.deleteTraitController(tabTrait);
      }
      const tabBarTrait = panelTrait.tabBar.trait;
      if (tabBarTrait !== null) {
        this.owner.tabBar.deleteTrait(tabBarTrait);
      }
    },
    didDetachTrait(panelTrait: PanelTrait): void {
      this.owner.callObservers("controllerDidDetachPanelTrait", panelTrait, this.owner);
    },
    traitWillAttachTabBar(tabBarTrait: BarTrait): void {
      this.owner.tabBar.setTrait(tabBarTrait);
    },
    traitDidDetachTabBar(tabBarTrait: BarTrait): void {
      this.owner.tabBar.deleteTrait(tabBarTrait);
    },
    traitWillAttachTab(tabTrait: SheetTrait, targetTrait: Trait): void {
      this.owner.tabs.addTraitController(tabTrait, targetTrait);
    },
    traitDidDetachTab(tabTrait: SheetTrait): void {
      this.owner.tabs.deleteTraitController(tabTrait);
    },
    viewType: PanelView,
    observesView: true,
    initView(panelView: PanelView): void {
      const tabBarController = this.owner.tabBar.controller;
      if (tabBarController !== null) {
        tabBarController.bar.insertView(panelView);
        if (panelView.tabBar.view === null) {
          panelView.tabBar.setView(tabBarController.bar.view);
        }
      }
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        panelView.active.setView(activeController.sheet.attachView());
      }
    },
    willAttachView(panelView: PanelView): void {
      this.owner.callObservers("controllerWillAttachPanelView", panelView, this.owner);
      if (this.owner.sheet.view === null) {
        this.owner.sheet.setView(panelView);
      }
    },
    didAttachView(panelView: PanelView): void {
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        activeController.sheet.removeView();
      }
    },
    willDetachView(panelView: PanelView): void {
      this.owner.active.setController(null);
    },
    didDetachView(panelView: PanelView): void {
      if (this.owner.sheet.view === panelView) {
        this.owner.sheet.detachView();
      }
      this.owner.callObservers("controllerDidDetachPanelView", panelView, this.owner);
    },
    viewWillAttachTabBar(tabBarView: BarView): void {
      const tabBarController = this.owner.tabBar.controller;
      if (tabBarController !== null) {
        tabBarController.bar.setView(tabBarView);
      }
    },
    viewDidDetachTabBar(tabBarView: BarView): void {
      const tabBarController = this.owner.tabBar.controller;
      if (tabBarController !== null) {
        tabBarController.bar.setView(null);
      }
    },
  })
  readonly panel!: TraitViewRef<this, PanelTrait, PanelView>;
  static readonly panel: MemberFastenerClass<PanelController, "panel">;

  protected didPressTabTool(input: PositionGestureInput, event: Event | null, tabController: SheetController): void {
    this.callObservers("controllerDidPressTabTool", input, event, tabController, this);
    if (!input.defaultPrevented) {
      this.active.setController(tabController);
    }
  }

  protected didLongPressTabTool(input: PositionGestureInput, tabController: SheetController): void {
    this.callObservers("controllerDidLongPressTabTool", input, tabController, this);
  }

  @TraitViewControllerRef<PanelController, BarTrait, BarView, BarController, PanelControllerTabBarExt & ObserverType<BarController | TabBarController>>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): PanelView | null {
      return this.owner.panel.view;
    },
    getTraitViewRef(tabBarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return tabBarController.bar;
    },
    initController(tabBarController: BarController): void {
      const panelTrait = this.owner.panel.trait;
      if (panelTrait !== null) {
        const tabBarTrait = panelTrait.tabBar.trait;
        if (tabBarTrait !== null) {
          tabBarController.bar.setTrait(tabBarTrait);
        }
      }
    },
    willAttachController(tabBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachTabBar", tabBarController, this.owner);
    },
    didAttachController(tabBarController: BarController): void {
      const tabBarTrait = tabBarController.bar.trait;
      if (tabBarTrait !== null) {
        this.attachTabBarTrait(tabBarTrait, tabBarController);
      }
      tabBarController.bar.insertView();
    },
    willDetachController(tabBarController: BarController): void {
      const tabBarView = tabBarController.bar.view;
      if (tabBarView !== null) {
        this.detachTabBarView(tabBarView, tabBarController);
      }
      const tabBarTrait = tabBarController.bar.trait;
      if (tabBarTrait !== null) {
        this.detachTabBarTrait(tabBarTrait, tabBarController);
      }
    },
    didDetachController(tabBarController: BarController): void {
      this.owner.callObservers("controllerDidDetachTabBar", tabBarController, this.owner);
    },
    controllerWillAttachBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachTabBarTrait", tabBarTrait, this.owner);
      this.attachTabBarTrait(tabBarTrait, tabBarController);
    },
    controllerDidDetachBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void {
      this.detachTabBarTrait(tabBarTrait, tabBarController);
      this.owner.callObservers("controllerDidDetachTabBarTrait", tabBarTrait, this.owner);
    },
    attachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void {
      // hook
    },
    detachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(tabBarView: BarView, tabBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachTabBarView", tabBarView, this.owner);
      this.attachTabBarView(tabBarView, tabBarController);
    },
    controllerDidDetachBarView(tabBarView: BarView, tabBarController: BarController): void {
      this.detachTabBarView(tabBarView, tabBarController);
      this.owner.callObservers("controllerDidDetachTabBarView", tabBarView, this.owner);
    },
    attachTabBarView(tabBarView: BarView, tabBarController: BarController): void {
      const panelView = this.owner.panel.view;
      if (panelView !== null && panelView.tabBar.view === null) {
        panelView.tabBar.setView(tabBarView);
      }
    },
    detachTabBarView(tabBarView: BarView, tabBarController: BarController): void {
      tabBarView.remove();
    },
    controllerDidPressTabTool(input: PositionGestureInput, event: Event | null, tabController: SheetController): void {
      this.owner.didPressTabTool(input, event, tabController);
    },
    controllerDidLongPressTabTool(input: PositionGestureInput, tabController: SheetController): void {
      this.owner.didLongPressTabTool(input, tabController);
    },
    createController(): BarController {
      return new TabBarController();
    },
  })
  readonly tabBar!: TraitViewControllerRef<this, BarTrait, BarView, BarController> & PanelControllerTabBarExt;
  static readonly tabBar: MemberFastenerClass<PanelController, "tabBar">;

  @TraitViewControllerSet<PanelController, SheetTrait, SheetView, SheetController, PanelControllerTabsExt>({
    implements: true,
    type: SheetController,
    binds: false,
    observes: true,
    get parentView(): PanelView | null {
      return this.owner.panel.view;
    },
    getTraitViewRef(tabController: SheetController): TraitViewRef<unknown, SheetTrait, SheetView> {
      return tabController.sheet;
    },
    willAttachController(tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTab", tabController, this.owner);
    },
    didAttachController(tabController: SheetController): void {
      const tabTrait = tabController.sheet.trait;
      if (tabTrait !== null) {
        this.attachTabTrait(tabTrait, tabController);
      }
      const tabView = tabController.sheet.view;
      if (tabView !== null) {
        this.attachTabView(tabView, tabController);
      }
      if (this.owner.active.controller === null) {
        this.owner.active.setController(tabController);
      }
    },
    willDetachController(tabController: SheetController): void {
      if (tabController === this.owner.active.controller) {
        this.owner.active.setController(null);
      }
      const tabView = tabController.sheet.view;
      if (tabView !== null) {
        this.detachTabView(tabView, tabController);
      }
      const tabTrait = tabController.sheet.trait;
      if (tabTrait !== null) {
        this.detachTabTrait(tabTrait, tabController);
      }
    },
    didDetachController(tabController: SheetController): void {
      this.owner.callObservers("controllerDidDetachTab", tabController, this.owner);
    },
    controllerWillAttachSheetTrait(tabTrait: SheetTrait, tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTabTrait", tabTrait, tabController, this.owner);
      this.attachTabTrait(tabTrait, tabController);
    },
    controllerDidDetachSheetTrait(tabTrait: SheetTrait, tabController: SheetController): void {
      this.detachTabTrait(tabTrait, tabController);
      this.owner.callObservers("controllerDidDetachTabTrait", tabTrait, tabController, this.owner);
    },
    attachTabTrait(tabTrait: SheetTrait, tabController: SheetController): void {
      // hook
    },
    detachTabTrait(tabTrait: SheetTrait, tabController: SheetController): void {
      // hook
    },
    controllerWillAttachSheetView(tabView: SheetView, tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTabView", tabView, tabController, this.owner);
      this.attachTabView(tabView, tabController);
    },
    controllerDidDetachSheetView(tabView: SheetView, tabController: SheetController): void {
      this.detachTabView(tabView, tabController);
      this.owner.callObservers("controllerDidDetachTabView", tabView, tabController, this.owner);
    },
    attachTabView(tabView: SheetView, tabController: SheetController): void {
      const iconToolView = tabView.iconTool.view;
      if (iconToolView !== null) {
        this.attachIconToolView(iconToolView, tabController);
      }
      const panelView = this.owner.panel.view;
      if (panelView !== null) {
        panelView.tabs.attachView(tabView);
      }
    },
    detachTabView(tabView: SheetView, tabController: SheetController): void {
      const iconToolView = tabView.iconTool.view;
      if (iconToolView !== null) {
        this.detachIconToolView(iconToolView, tabController);
      }
      const panelView = this.owner.panel.view;
      if (panelView !== null) {
        panelView.tabs.deleteView(tabView);
      }
    },
    controllerWillAttachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTabIconToolView", iconToolView, tabController, this.owner);
      this.attachIconToolView(iconToolView, tabController);
    },
    controllerDidDetachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      this.detachIconToolView(iconToolView, tabController);
      this.owner.callObservers("controllerDidDetachTabIconToolView", iconToolView, tabController, this.owner);
    },
    attachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      // hook
    },
    detachIconToolView(iconToolView: ToolView, tabController: SheetController): void {
      iconToolView.remove();
    },
  })
  readonly tabs!: TraitViewControllerSet<this, SheetTrait, SheetView, SheetController> & PanelControllerTabsExt;
  static readonly tabs: MemberFastenerClass<PanelController, "tabs">;

  @TraitViewControllerRef<PanelController, SheetTrait, SheetView, SheetController, PanelControllerActiveExt>({
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
      const panelView = this.owner.panel.view;
      if (panelView !== null) {
        panelView.active.setView(activeView);
      }
    },
    detachActiveView(activeView: SheetView, activeController: SheetController): void {
      const panelView = this.owner.panel.view;
      if (panelView !== null) {
        panelView.active.deleteView();
      }
    },
  })
  readonly active!: TraitViewControllerRef<this, SheetTrait, SheetView, SheetController> & PanelControllerActiveExt;
  static readonly active: MemberFastenerClass<PanelController, "active">;
}
