// Copyright 2015-2023 Swim.inc
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
import type {Instance} from "@swim/util";
import type {Creatable} from "@swim/util";
import type {Observes} from "@swim/util";
import {Property} from "@swim/component";
import type {Length} from "@swim/math";
import type {ViewInsets} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import {ViewSet} from "@swim/view";
import {BarView} from "@swim/toolbar";
import type {SheetViewObserver} from "./SheetView";
import {SheetView} from "./SheetView";

/** @public */
export type BinderTabStyle = "bottom" | "mode" | "none";

/** @public */
export interface BinderViewObserver<V extends BinderView = BinderView> extends SheetViewObserver<V> {
  viewDidSetTabStyle?(tabStyle: BinderTabStyle, view: V): void;

  viewWillAttachTabBar?(tabBarView: BarView, targetView: View | null, view: V): void;

  viewDidDetachTabBar?(tabBarView: BarView, view: V): void;

  viewWillAttachTab?(tabView: SheetView, targetView: View | null, view: V): void;

  viewDidDetachTab?(tabView: SheetView, view: V): void;

  viewWillAttachActive?(activeView: SheetView, targetView: View | null, view: V): void;

  viewDidDetachActive?(activeView: SheetView, view: V): void;
}

/** @public */
export class BinderView extends SheetView {
  constructor(node: HTMLElement) {
    super(node);
    this.initBinder();
  }

  protected initBinder(): void {
    this.addClass("binder");
    this.setIntrinsic<BinderView>({
      position: "relative",
      overflow: "hidden",
    });
  }

  declare readonly observerType?: Class<BinderViewObserver>;

  @Property({
    valueType: String,
    value: "none",
    updateFlags: View.NeedsResize,
    didSetValue(tabStyle: BinderTabStyle): void {
      this.owner.callObservers("viewDidSetTabStyle", tabStyle, this.owner);
      this.owner.edgeInsets.decohereOutlets();
    },
  })
  readonly tabStyle!: Property<this, BinderTabStyle>;

  @ViewRef({
    viewType: BarView,
    binds: true,
    observes: true,
    initView(tabBarView: BarView): void {
      tabBarView.setIntrinsic({
        placement: "bottom",
        position: "absolute",
        left: 0,
        bottom: 0,
        width: this.owner.width.cssState,
        zIndex: 1,
      });
    },
    willAttachView(tabBarView: BarView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachTabBar", tabBarView, targetView, this.owner);
    },
    didAttachView(navBarView: BarView, target: View | null): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    willDetachView(navBarView: BarView): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    didDetachView(tabBarView: BarView): void {
      this.owner.callObservers("viewDidDetachTabBar", tabBarView, this.owner);
    },
    viewDidSetBarHeight(barHeight: Length | null): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
    viewDidMount(): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    viewWillUnmount(): void {
      this.owner.edgeInsets.decohereOutlets();
    },
  })
  readonly tabBar!: ViewRef<this, BarView> & Observes<BarView>;

  getTab<F extends Class<SheetView>>(key: string, tabViewClass: F): InstanceType<F> | null;
  getTab(key: string): SheetView | null;
  getTab(key: string, tabViewClass?: Class<SheetView>): SheetView | null {
    if (tabViewClass === void 0) {
      tabViewClass = SheetView;
    }
    const tabView = this.getChild(key);
    return tabView instanceof tabViewClass ? tabView : null;
  }

  getOrCreateTab<F extends Class<Instance<F, SheetView>> & Creatable<Instance<F, SheetView>>>(key: string, tabViewClass: F): InstanceType<F> {
    let tabView = this.getChild(key, tabViewClass);
    if (tabView === null) {
      tabView = tabViewClass.create();
      this.setChild(key, tabView);
    }
    return tabView!;
  }

  setTab(key: string, tabView: SheetView | null): void {
    this.setChild(key, tabView);
  }

  @ViewSet({
    viewType: SheetView,
    binds: false,
    observes: true,
    initView(tabView: SheetView): void {
      const tabBarView = this.owner.tabBar.view;
      const tabBarHeight = tabBarView !== null && tabBarView.mounted
                         ? tabBarView.height.cssState : null;
      tabView.setIntrinsic({
        position: "absolute",
        left: 0,
        top: 0,
        width: this.owner.width.cssState,
        height: this.owner.height.cssState,
        paddingTop: this.owner.paddingTop.state,
        paddingBottom: tabBarHeight,
        boxSizing: "border-box",
        zIndex: 0,
      });
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
  readonly tabs!: ViewSet<this, SheetView> & Observes<SheetView>;

  @ViewRef({
    viewType: SheetView,
    binds: false,
    observes: true,
    willAttachView(tabView: SheetView, targetView: View | null): void {
      this.owner.callObservers("viewWillAttachActive", tabView, targetView, this.owner);
    },
    didAttachView(tabView: SheetView, targetView: View | null): void {
      this.owner.fullBleed.setIntrinsic(tabView.fullBleed.value);
      if (tabView.parent === null) {
        this.owner.insertChild(tabView, targetView);
      }
    },
    didDetachView(tabView: SheetView): void {
      this.owner.callObservers("viewDidDetachActive", tabView, this.owner);
    },
    viewDidSetFullBleed(fullBleed: boolean, tabView: SheetView): void {
      this.owner.fullBleed.setIntrinsic(fullBleed);
    },
  })
  readonly active!: ViewRef<this, SheetView> & Observes<SheetView>;

  @Property({
    extends: true,
    getOutletValue(outlet: Property<unknown, ViewInsets>): ViewInsets {
      let edgeInsets = this.value;
      if (outlet.owner instanceof SheetView) {
        const tabBarView = this.owner.tabBar.view;
        if (tabBarView !== null && tabBarView.mounted) {
          edgeInsets = {
            insetTop: edgeInsets.insetTop,
            insetRight: edgeInsets.insetRight,
            insetBottom: 0,
            insetLeft: edgeInsets.insetLeft,
          };
        }
      }
      return edgeInsets;
    },
  })
  override get edgeInsets(): Property<this, ViewInsets> {
    return Property.dummy();
  }

  protected override onResize(): void {
    super.onResize();
    this.resizeBinder();
  }

  protected resizeBinder(): void {
    const binderWidth = this.width.cssState!;
    const binderHeight = this.height.cssState!;
    const paddingLeft = this.paddingLeft.value;
    const paddingRight = this.paddingRight.value;

    const tabBarView = this.tabBar.view;
    let tabBarHeight: Length | null = null;
    if (tabBarView !== null && tabBarView.mounted) {
      let tabBarWidth = binderWidth;
      tabBarHeight = tabBarView.height.cssState;
      if (paddingLeft !== null) {
        tabBarWidth = tabBarWidth.minus(paddingLeft);
      }
      if (paddingRight !== null) {
        tabBarWidth = tabBarWidth.minus(paddingRight);
      }
      tabBarView.setIntrinsic({
        left: paddingLeft,
        right: paddingRight,
        width: tabBarWidth,
      });
    }

    const tabViews = this.tabs.views;
    for (const viewId in tabViews) {
      const tabView = tabViews[viewId]!;
      tabView.setIntrinsic({
        width: binderWidth,
        height: binderHeight,
        paddingTop: this.paddingTop.state,
        paddingRight,
        paddingBottom: tabBarHeight,
        paddingLeft,
      });
    }
  }
}
