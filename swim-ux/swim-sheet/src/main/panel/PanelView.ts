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
import {Affinity, MemberFastenerClass} from "@swim/component";
import {Length} from "@swim/math";
import {ViewContextType, View, ViewRef, ViewSet} from "@swim/view";
import {BarView} from "@swim/toolbar";
import {SheetView} from "../sheet/SheetView";
import type {PanelViewObserver} from "./PanelViewObserver";

/** @public */
export class PanelView extends SheetView {
  constructor(node: HTMLElement) {
    super(node);
    this.initPanel();
  }

  protected initPanel(): void {
    this.addClass("panel");
    this.position.setState("relative", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
  }

  override readonly observerType?: Class<PanelViewObserver>;

  @ViewRef<PanelView, BarView>({
    type: BarView,
    binds: true,
    observes: true,
    initView(tabBarView: BarView): void {
      let panelWidth = this.owner.width.state;
      panelWidth = panelWidth instanceof Length ? panelWidth : Length.px(this.owner.node.offsetWidth);

      tabBarView.placement.setValue("bottom", Affinity.Intrinsic);
      tabBarView.position.setState("absolute", Affinity.Intrinsic);
      tabBarView.left.setState(0, Affinity.Intrinsic);
      tabBarView.bottom.setState(0, Affinity.Intrinsic);
      tabBarView.width.setState(panelWidth, Affinity.Intrinsic);
      tabBarView.zIndex.setState(1, Affinity.Intrinsic);
    },
    willAttachView(tabBarView: BarView, target: View | null): void {
      this.owner.callObservers("viewWillAttachTabBar", tabBarView, target, this.owner);
    },
    didDetachView(tabBarView: BarView): void {
      this.owner.callObservers("viewDidDetachTabBar", tabBarView, this.owner);
    },
    viewDidSetBarHeight(barHeight: Length | null): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
  })
  readonly tabBar!: ViewRef<this, BarView>;
  static readonly tabBar: MemberFastenerClass<PanelView, "tabBar">;

  @ViewSet<PanelView, SheetView>({
    implements: true,
    type: SheetView,
    binds: false,
    observes: true,
    initView(tabView: SheetView): void {
      let panelWidth = this.owner.width.state;
      panelWidth = panelWidth instanceof Length ? panelWidth : Length.px(this.owner.node.offsetWidth);
      let panelHeight = this.owner.height.state;
      panelHeight = panelHeight instanceof Length ? panelHeight : Length.px(this.owner.node.offsetHeight);
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
      tabView.left.setState(panelWidth, Affinity.Intrinsic);
      tabView.top.setState(0, Affinity.Intrinsic);
      tabView.width.setState(panelWidth, Affinity.Intrinsic);
      tabView.height.setState(panelHeight, Affinity.Intrinsic);
      tabView.paddingBottom.setState(tabBarHeight, Affinity.Intrinsic);
      tabView.boxSizing.setState("border-box", Affinity.Intrinsic);
      tabView.zIndex.setState(0, Affinity.Intrinsic);
      tabView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    },
    willAttachView(tabView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachTab", tabView, target, this.owner);
    },
    didDetachView(tabView: SheetView): void {
      if (tabView === this.owner.active.view) {
        this.owner.active.setView(null);
      }
      this.owner.callObservers("viewDidDetachTab", tabView, this.owner);
    },
    detectView(view: View): SheetView | null {
      return view instanceof SheetView ? view : null;
    },
  })
  readonly tabs!: ViewSet<this, SheetView>;
  static readonly tabs: MemberFastenerClass<PanelView, "tabs">;

  @ViewRef<PanelView, SheetView>({
    type: SheetView,
    binds: false,
    willAttachView(tabView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachActive", tabView, target, this.owner);
      if (tabView.parent === null) {
        this.owner.insertChild(tabView, target);
      }
    },
    didDetachView(tabView: SheetView): void {
      this.owner.callObservers("viewDidDetachActive", tabView, this.owner);
    },
  })
  readonly active!: ViewRef<this, SheetView>;
  static readonly active: MemberFastenerClass<PanelView, "active">;

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizePanel(viewContext);
  }

  protected resizePanel(viewContext: ViewContextType<this>): void {
    let panelWidth = this.width.state;
    panelWidth = panelWidth instanceof Length ? panelWidth : Length.px(this.node.offsetWidth);
    let panelHeight = this.height.state;
    panelHeight = panelHeight instanceof Length ? panelHeight : Length.px(this.node.offsetHeight);
    let edgeInsets = this.edgeInsets.value;
    if (edgeInsets === void 0 && this.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
      edgeInsets = viewContext.viewport.safeArea;
    }

    const tabBarView = this.tabBar.view;
    if (tabBarView !== null) {
      tabBarView.width.setState(panelWidth, Affinity.Intrinsic);
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
      tabView.width.setState(panelWidth, Affinity.Intrinsic);
      tabView.height.setState(panelHeight, Affinity.Intrinsic);
      tabView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    }
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutPanel(viewContext);
  }

  protected layoutPanel(viewContext: ViewContextType<this>): void {
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
