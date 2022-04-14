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
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import {Length} from "@swim/math";
import {ViewContextType, View, ViewRefDef, ViewSetDef} from "@swim/view";
import {BarView} from "@swim/toolbar";
import {SheetView} from "../sheet/SheetView";
import type {BinderViewObserver} from "./BinderViewObserver";

/** @public */
export type BinderTabStyle = "bottom" | "mode" | "none";

/** @public */
export class BinderView extends SheetView {
  constructor(node: HTMLElement) {
    super(node);
    this.initBinder();
  }

  protected initBinder(): void {
    this.addClass("binder");
    this.position.setState("relative", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
  }

  override readonly observerType?: Class<BinderViewObserver>;

  @PropertyDef<BinderView["tabStyle"]>({
    valueType: String,
    value: "none",
    updateFlags: View.NeedsResize,
    didSetValue(tabStyle: BinderTabStyle): void {
      this.owner.callObservers("viewDidSetTabStyle", tabStyle, this.owner);
    },
  })
  readonly tabStyle!: PropertyDef<this, {value: BinderTabStyle}>;

  @ViewRefDef<BinderView["tabBar"]>({
    viewType: BarView,
    binds: true,
    observes: true,
    initView(tabBarView: BarView): void {
      let binderWidth = this.owner.width.state;
      binderWidth = binderWidth instanceof Length ? binderWidth : Length.px(this.owner.node.offsetWidth);

      tabBarView.placement.setValue("bottom", Affinity.Intrinsic);
      tabBarView.position.setState("absolute", Affinity.Intrinsic);
      tabBarView.left.setState(0, Affinity.Intrinsic);
      tabBarView.bottom.setState(0, Affinity.Intrinsic);
      tabBarView.width.setState(binderWidth, Affinity.Intrinsic);
      tabBarView.zIndex.setState(1, Affinity.Intrinsic);
    },
    willAttachView(tabBarView: BarView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachTabBar", tabBarView, targetView, this.owner);
    },
    didDetachView(tabBarView: BarView): void {
      this.owner.callObservers("viewDidDetachTabBar", tabBarView, this.owner);
    },
    viewDidSetBarHeight(barHeight: Length | null): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
  })
  readonly tabBar!: ViewRefDef<this, {view: BarView, observes: true}>;
  static readonly tabBar: FastenerClass<BinderView["tabBar"]>;

  @ViewSetDef<BinderView["tabs"]>({
    viewType: SheetView,
    binds: false,
    observes: true,
    initView(tabView: SheetView): void {
      let binderWidth = this.owner.width.state;
      binderWidth = binderWidth instanceof Length ? binderWidth : Length.px(this.owner.node.offsetWidth);
      let binderHeight = this.owner.height.state;
      binderHeight = binderHeight instanceof Length ? binderHeight : Length.px(this.owner.node.offsetHeight);
      let edgeInsets = this.owner.edgeInsets.value;
      if (edgeInsets === void 0 && this.owner.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
        edgeInsets = this.owner.viewport.safeArea;
      }

      const tabBarView = this.owner.tabBar.view;
      let tabBarHeight: Length | null = null;
      if (tabBarView !== null) {
        tabBarHeight = tabBarView.height.state;
        tabBarHeight = tabBarHeight instanceof Length ? tabBarHeight : Length.px(tabBarView.node.offsetHeight);
        if (edgeInsets !== null) {
          edgeInsets = {
            insetTop: edgeInsets.insetTop,
            insetRight: edgeInsets.insetRight,
            insetBottom: 0,
            insetLeft: edgeInsets.insetLeft,
          };
        }
      }

      tabView.position.setState("absolute", Affinity.Intrinsic);
      tabView.left.setState(0, Affinity.Intrinsic);
      tabView.top.setState(0, Affinity.Intrinsic);
      tabView.width.setState(binderWidth, Affinity.Intrinsic);
      tabView.height.setState(binderHeight, Affinity.Intrinsic);
      tabView.paddingBottom.setState(tabBarHeight, Affinity.Intrinsic);
      tabView.boxSizing.setState("border-box", Affinity.Intrinsic);
      tabView.zIndex.setState(0, Affinity.Intrinsic);
      tabView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    },
    willAttachView(tabView: SheetView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachTab", tabView, targetView, this.owner);
    },
    willDetachView(tabView: SheetView): void {
      if (tabView === this.owner.active.view) {
        this.owner.active.setView(null);
      }
    },
    didDetachView(tabView: SheetView): void {
      this.owner.callObservers("viewDidDetachTab", tabView, this.owner);
    },
    detectView(view: View): SheetView | null {
      return view instanceof SheetView ? view : null;
    },
  })
  readonly tabs!: ViewSetDef<this, {view: SheetView, observes: true}>;
  static readonly tabs: FastenerClass<BinderView["tabs"]>;

  @ViewRefDef<BinderView["active"]>({
    viewType: SheetView,
    binds: false,
    observes: true,
    willAttachView(tabView: SheetView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachActive", tabView, targetView, this.owner);
    },
    didAttachView(tabView: SheetView, targetView: View | null): void {
      this.owner.fullBleed.setValue(tabView.fullBleed.value, Affinity.Intrinsic);
      if (tabView.parent === null) {
        this.owner.insertChild(tabView, targetView);
      }
    },
    didDetachView(tabView: SheetView): void {
      this.owner.callObservers("viewDidDetachActive", tabView, this.owner);
    },
    viewDidSetFullBleed(fullBleed: boolean, tabView: SheetView): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
  })
  readonly active!: ViewRefDef<this, {view: SheetView, observes: true}>;
  static readonly active: FastenerClass<BinderView["active"]>;

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeBinder(viewContext);
  }

  protected resizeBinder(viewContext: ViewContextType<this>): void {
    let binderWidth = this.width.state;
    binderWidth = binderWidth instanceof Length ? binderWidth : Length.px(this.node.offsetWidth);
    let binderHeight = this.height.state;
    binderHeight = binderHeight instanceof Length ? binderHeight : Length.px(this.node.offsetHeight);
    let edgeInsets = this.edgeInsets.value;
    if (edgeInsets === void 0 && this.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
      edgeInsets = viewContext.viewport.safeArea;
    }

    const tabBarView = this.tabBar.view;
    let tabBarHeight: Length | null = null;
    if (tabBarView !== null) {
      let tabBarWidth = binderWidth;
      tabBarHeight = tabBarView.height.state;
      tabBarHeight = tabBarHeight instanceof Length ? tabBarHeight : Length.px(tabBarView.node.offsetHeight);
      const paddingLeft = this.paddingLeft.value;
      if (paddingLeft !== null) {
        tabBarWidth = tabBarWidth.minus(paddingLeft);
      }
      const paddingRight = this.paddingRight.value;
      if (paddingRight !== null) {
        tabBarWidth = tabBarWidth.minus(paddingRight);
      }
      tabBarView.left.setState(paddingLeft, Affinity.Intrinsic);
      tabBarView.right.setState(paddingRight, Affinity.Intrinsic);
      tabBarView.width.setState(tabBarWidth, Affinity.Intrinsic);
      if (edgeInsets !== null) {
        edgeInsets = {
          insetTop: edgeInsets.insetTop,
          insetRight: edgeInsets.insetRight,
          insetBottom: 0,
          insetLeft: edgeInsets.insetLeft,
        };
      }
    }

    const tabViews = this.tabs.views;
    for (const viewId in tabViews) {
      const tabView = tabViews[viewId]!;
      tabView.width.setState(binderWidth, Affinity.Intrinsic);
      tabView.height.setState(binderHeight, Affinity.Intrinsic);
      tabView.paddingTop.setState(this.paddingTop.state, Affinity.Intrinsic);
      tabView.paddingBottom.setState(tabBarHeight, Affinity.Intrinsic);
      tabView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    }
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutBinder(viewContext);
  }

  protected layoutBinder(viewContext: ViewContextType<this>): void {
    const tabBarView = this.tabBar.view;
    let tabBarHeight: Length | null = null;
    if (tabBarView !== null) {
      tabBarHeight = tabBarView.height.state;
      tabBarHeight = tabBarHeight instanceof Length ? tabBarHeight : Length.px(tabBarView.node.offsetHeight);
    }

    const tabViews = this.tabs.views;
    for (const viewId in tabViews) {
      const tabView = tabViews[viewId]!;
      tabView.paddingTop.setState(this.paddingTop.state, Affinity.Intrinsic);
      tabView.paddingBottom.setState(tabBarHeight, Affinity.Intrinsic);
    }
  }
}
