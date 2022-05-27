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

import {Class, Objects} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import type {PositionGestureInput} from "@swim/view";
import type {Trait} from "@swim/model";
import {
  Controller,
  TraitViewRefDef,
  TraitViewRef,
  TraitViewControllerRefDef,
  TraitViewControllerSetDef,
} from "@swim/controller";
import {ToolController, BarView, BarTrait, BarController} from "@swim/toolbar";
import type {SheetView} from "../sheet/SheetView";
import {SheetController} from "../sheet/SheetController";
import type {FolioStyle} from "../folio/FolioView";
import {TabBarController} from "./TabBarController";
import {BinderTabStyle, BinderView} from "./BinderView";
import type {BinderControllerObserver} from "./BinderControllerObserver";

/** @public */
export class BinderController extends SheetController {
  override readonly observerType?: Class<BinderControllerObserver>;

  @PropertyDef<BinderController["folioStyle"]>({
    valueType: String,
    inherits: true,
    lazy: false,
    didSetValue(folioStyle: FolioStyle | undefined): void {
      if (folioStyle === "stacked") {
        this.owner.tabStyle.setValue("bottom", Affinity.Intrinsic);
      } else if (folioStyle === "unstacked") {
        this.owner.tabStyle.setValue("mode", Affinity.Intrinsic);
      }
    },
  })
  readonly folioStyle!: PropertyDef<this, {value: FolioStyle | undefined}>;

  @PropertyDef<BinderController["tabStyle"]>({
    valueType: String,
    value: "none",
    didSetValue(tabStyle: BinderTabStyle): void {
      const tabBarController = this.owner.tabBar.controller;
      if (tabBarController !== null) {
        this.owner.tabBar.updateTabStyle(tabStyle, tabBarController);
      }
      const tabControllers = this.owner.tabs.controllers;
      for (const controllerId in tabControllers) {
        const tabController = tabControllers[controllerId]!;
        this.owner.tabs.updateTabStyle(tabStyle, tabController);
      }
      this.owner.callObservers("controllerDidSetTabStyle", tabStyle, this.owner);
      const binderView = this.owner.binder.view;
      if (binderView !== null) {
        binderView.tabStyle.setValue(tabStyle, Affinity.Inherited);
      }
    },
  })
  readonly tabStyle!: PropertyDef<this, {value: BinderTabStyle}>;

  @TraitViewRefDef<BinderController["binder"]>({
    willAttachTrait(binderTrait: Trait): void {
      this.owner.callObservers("controllerWillAttachBinderTrait", binderTrait, this.owner);
    },
    didDetachTrait(binderTrait: Trait): void {
      this.owner.callObservers("controllerDidDetachBinderTrait", binderTrait, this.owner);
    },
    viewType: BinderView,
    observesView: true,
    initView(binderView: BinderView): void {
      binderView.tabStyle.setValue(this.owner.tabStyle.value, Affinity.Inherited);
      const tabBarController = this.owner.tabBar.controller;
      if (tabBarController !== null) {
        binderView.tabBar.setView(tabBarController.bar.view);
      }
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        binderView.active.setView(activeController.sheet.attachView());
      }
    },
    willAttachView(binderView: BinderView): void {
      this.owner.callObservers("controllerWillAttachBinderView", binderView, this.owner);
      if (this.owner.sheet.view === null) {
        this.owner.sheet.setView(binderView);
      }
    },
    didAttachView(binderView: BinderView): void {
      //this.owner.tabStyle.setValue(binderView.tabStyle.value, Affinity.Intrinsic);
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        activeController.sheet.removeView();
      }
    },
    willDetachView(binderView: BinderView): void {
      this.owner.active.setController(null);
    },
    didDetachView(binderView: BinderView): void {
      if (this.owner.sheet.view === binderView) {
        this.owner.sheet.detachView();
      }
      this.owner.callObservers("controllerDidDetachBinderView", binderView, this.owner);
    },
    //viewDidSetTabStyle(tabStyle: BinderTabStyle, binderView: BinderView): void {
    //  this.owner.tabStyle.setValue(tabStyle, Affinity.Intrinsic);
    //},
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
  readonly binder!: TraitViewRefDef<this, {
    view: BinderView,
    observesView: true,
  }>;
  static readonly binder: FastenerClass<BinderController["binder"]>;

  protected didPressTabTool(input: PositionGestureInput, event: Event | null, tabController: SheetController): void {
    this.callObservers("controllerDidPressTabTool", input, event, tabController, this);
    if (!input.defaultPrevented) {
      this.active.setController(tabController);
    }
  }

  protected didLongPressTabTool(input: PositionGestureInput, tabController: SheetController): void {
    this.callObservers("controllerDidLongPressTabTool", input, tabController, this);
  }

  @TraitViewControllerRefDef<BinderController["tabBar"]>({
    controllerType: BarController,
    binds: true,
    observes: true,
    get parentView(): BinderView | null {
      return this.owner.binder.view;
    },
    getTraitViewRef(tabBarController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return tabBarController.bar;
    },
    initController(tabBarController: BarController): void {
      this.updateTabStyle(this.owner.tabStyle.value, tabBarController);
    },
    willAttachController(tabBarController: BarController): void {
      this.owner.callObservers("controllerWillAttachTabBar", tabBarController, this.owner);
    },
    didAttachController(tabBarController: BarController): void {
      const tabBarTrait = tabBarController.bar.trait;
      if (tabBarTrait !== null) {
        this.attachTabBarTrait(tabBarTrait, tabBarController);
      }
      const tabBarView = tabBarController.bar.view;
      if (tabBarView !== null) {
        this.attachTabBarView(tabBarView, tabBarController);
      }
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
      const binderView = this.owner.binder.view;
      if (binderView !== null && binderView.tabBar.view === null) {
        binderView.tabBar.attachView(tabBarView);
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
    updateTabStyle(tabStyle: BinderTabStyle, tabBarController: BarController): void {
      if (tabStyle === "bottom") {
        this.insertView();
      } else {
        this.removeView();
      }
    },
    createController(): BarController {
      return new TabBarController();
    },
  })
  readonly tabBar!: TraitViewControllerRefDef<this, {
    trait: BarTrait,
    view: BarView,
    controller: BarController,
    implements: {
      attachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void;
      detachTabBarTrait(tabBarTrait: BarTrait, tabBarController: BarController): void;
      attachTabBarView(tabBarView: BarView, tabBarController: BarController): void;
      detachTabBarView(tabBarView: BarView, tabBarController: BarController): void;
      updateTabStyle(tabStyle: BinderTabStyle, tabBarController: BarController): void;
    },
    observes: BarController & TabBarController,
  }>;
  static readonly tabBar: FastenerClass<BinderController["tabBar"]>;

  setTab(key: string, newTabController: SheetController | null): void {
    const oldTabController = this.getChild(key, SheetController);
    const active = oldTabController === this.active.controller;

    let targetTabController: Controller | null;
    if (oldTabController !== null) {
      targetTabController = oldTabController.nextSibling;
      this.tabs.deleteController(oldTabController);
    } else {
      targetTabController = null;
    }

    if (newTabController !== null) {
      this.tabs.insertController(null, newTabController, targetTabController, key);
      if (active) {
        this.active.setController(newTabController);
      }
    }
  }

  @TraitViewControllerSetDef<BinderController["tabs"]>({
    controllerType: SheetController,
    binds: false,
    ordered: true,
    observes: true,
    get parentView(): BinderView | null {
      return this.owner.binder.view;
    },
    getTraitViewRef(tabController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return tabController.sheet;
    },
    initController(tabController: SheetController): void {
      this.updateTabStyle(this.owner.tabStyle.value, tabController);
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
      const buttonToolController = tabController.buttonTool.controller;
      if (buttonToolController !== null) {
        this.attachButtonTool(buttonToolController, tabController);
      }
      if (this.owner.active.controller === null) {
        this.owner.active.setController(tabController);
      }
    },
    willDetachController(tabController: SheetController): void {
      if (tabController === this.owner.active.controller) {
        this.owner.active.setController(null);
      }
      const buttonToolController = tabController.buttonTool.controller;
      if (buttonToolController !== null) {
        this.detachButtonTool(buttonToolController, tabController);
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
    controllerWillAttachSheetTrait(tabTrait: Trait, tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTabTrait", tabTrait, tabController, this.owner);
      this.attachTabTrait(tabTrait, tabController);
    },
    controllerDidDetachSheetTrait(tabTrait: Trait, tabController: SheetController): void {
      this.detachTabTrait(tabTrait, tabController);
      this.owner.callObservers("controllerDidDetachTabTrait", tabTrait, tabController, this.owner);
    },
    attachTabTrait(tabTrait: Trait, tabController: SheetController): void {
      // hook
    },
    detachTabTrait(tabTrait: Trait, tabController: SheetController): void {
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
      const binderView = this.owner.binder.view;
      if (binderView !== null) {
        binderView.tabs.attachView(tabView);
      }
    },
    detachTabView(tabView: SheetView, tabController: SheetController): void {
      const binderView = this.owner.binder.view;
      if (binderView !== null) {
        binderView.tabs.deleteView(tabView);
      }
    },
    controllerWillAttachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      this.owner.callObservers("controllerWillAttachTabButtonTool", buttonToolController, tabController, this.owner);
      this.attachButtonTool(buttonToolController, tabController);
    },
    controllerDidDetachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      this.detachButtonTool(buttonToolController, tabController);
      this.owner.callObservers("controllerDidDetachTabButtonTool", buttonToolController, tabController, this.owner);
    },
    attachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      const tabStyle = this.owner.tabStyle.value;
      if (tabStyle === "mode") {
        const targetTabController = Objects.getNextValue(this.controllers, tabController.uid);
        const targetToolController = targetTabController !== void 0 ? targetTabController.buttonTool.controller : null;
        this.owner.modeTools.attachController(buttonToolController, targetToolController);
      }
    },
    detachButtonTool(buttonToolController: ToolController, tabController: SheetController): void {
      const tabStyle = this.owner.tabStyle.value;
      if (tabStyle === "mode") {
        this.owner.modeTools.deleteController(buttonToolController);
      }
      buttonToolController.remove();
    },
    updateTabStyle(tabStyle: BinderTabStyle, tabController: SheetController): void {
      const tabToolController = tabController.buttonTool.controller;
      if (tabToolController !== null) {
        if (tabStyle === "mode") {
          const targetTabController = Objects.getNextValue(this.controllers, tabController.uid);
          const targetToolController = targetTabController !== void 0 ? targetTabController.buttonTool.controller : null;
          this.owner.modeTools.attachController(tabToolController, targetToolController);
        } else {
          this.owner.modeTools.detachController(tabToolController);
        }
      }
    },
  })
  readonly tabs!: TraitViewControllerSetDef<this, {
    view: SheetView,
    controller: SheetController,
    implements: {
      attachTabTrait(tabTrait: Trait, tabController: SheetController): void;
      detachTabTrait(tabTrait: Trait, tabController: SheetController): void;
      attachTabView(tabView: SheetView, tabController: SheetController): void;
      detachTabView(tabView: SheetView, tabController: SheetController): void;
      attachButtonTool(buttonToolController: ToolController, tabController: SheetController): void;
      detachButtonTool(buttonToolController: ToolController, tabController: SheetController): void;
      updateTabStyle(tabStyle: BinderTabStyle, tabController: SheetController): void;
    },
    observes: true,
  }>;
  static readonly tabs: FastenerClass<BinderController["tabs"]>;

  @TraitViewControllerRefDef<BinderController["active"]>({
    controllerType: SheetController,
    binds: false,
    observes: true,
    getTraitViewRef(activeController: SheetController): TraitViewRef<unknown, Trait, SheetView> {
      return activeController.sheet;
    },
    willAttachController(activeController: SheetController): void {
      this.owner.callObservers("controllerWillAttachActive", activeController, this.owner);
    },
    didAttachController(activeController: SheetController): void {
      this.owner.fullBleed.setValue(activeController.fullBleed.value, Affinity.Intrinsic);
      const activeTrait = activeController.sheet.trait;
      if (activeTrait !== null) {
        this.attachActiveTrait(activeTrait, activeController);
      }
      const activeView = activeController.sheet.attachView();
      if (activeView !== null) {
        this.attachActiveView(activeView, activeController);
      }
      activeController.buttonTool.setActive(true);
    },
    willDetachController(activeController: SheetController): void {
      activeController.buttonTool.setActive(false);
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
    controllerWillAttachSheetTrait(activeTrait: Trait, activeController: SheetController): void {
      this.owner.callObservers("controllerWillAttachActiveTrait", activeTrait, this.owner);
      this.attachActiveTrait(activeTrait, activeController);
    },
    controllerDidDetachSheetTrait(activeTrait: Trait, activeController: SheetController): void {
      this.detachActiveTrait(activeTrait, activeController);
      this.owner.callObservers("controllerDidDetachActiveTrait", activeTrait, this.owner);
    },
    attachActiveTrait(activeTrait: Trait, activeController: SheetController): void {
      // hook
    },
    detachActiveTrait(activeTrait: Trait, activeController: SheetController): void {
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
      const binderView = this.owner.binder.view;
      if (binderView !== null) {
        binderView.active.setView(activeView);
      }
    },
    detachActiveView(activeView: SheetView, activeController: SheetController): void {
      const binderView = this.owner.binder.view;
      if (binderView !== null) {
        binderView.active.deleteView();
      }
    },
    controllerDidSetFullBleed(fullBleed: boolean, activeController: SheetController): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
    controllerDidScrollSheetView(activeView: SheetView, activeController: SheetController): void {
      this.owner.callObservers("controllerDidScrollSheetView", activeView, this.owner);
    },
  })
  readonly active!: TraitViewControllerRefDef<this, {
    view: SheetView,
    controller: SheetController,
    implements: {
      attachActiveTrait(activeTrait: Trait, activeController: SheetController): void;
      detachActiveTrait(activeTrait: Trait, activeController: SheetController): void;
      attachActiveView(activeView: SheetView, activeController: SheetController): void;
      detachActiveView(activeView: SheetView, activeController: SheetController): void;
    },
    observes: true,
  }>;
  static readonly active: FastenerClass<BinderController["active"]>;
}
