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
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {Length} from "@swim/math";
import type {ViewInsets} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import {ViewSet} from "@swim/view";
import type {HtmlViewObserver} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import {BarView} from "@swim/toolbar";
import {SheetView} from "./SheetView";

/** @public */
export interface StackViewObserver<V extends StackView = StackView> extends HtmlViewObserver<V> {
  viewWillAttachNavBar?(navBarView: BarView, targetView: View | null, view: V): void;

  viewDidDetachNavBar?(navBarView: BarView, view: V): void;

  viewWillAttachSheet?(sheetView: SheetView, targetView: View | null, view: V): void;

  viewDidDetachSheet?(sheetView: SheetView, view: V): void;

  viewWillAttachFront?(frontView: SheetView, targetView: View | null, view: V): void;

  viewDidDetachFront?(frontView: SheetView, view: V): void;

  viewWillPresentSheet?(sheetView: SheetView, view: V): void;

  viewDidPresentSheet?(sheetView: SheetView, view: V): void;

  viewWillDismissSheet?(sheetView: SheetView, view: V): void;

  viewDidDismissSheet?(sheetView: SheetView, view: V): void;
}

/** @public */
export class StackView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initStack();
  }

  protected initStack(): void {
    this.addClass("stack");
    this.position.setState("relative", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
  }

  declare readonly observerType?: Class<StackViewObserver>;

  @ViewRef({
    viewType: BarView,
    binds: true,
    observes: true,
    initView(navBarView: BarView): void {
      const stackWidth = this.owner.width.cssState;
      navBarView.placement.setValue("top", Affinity.Intrinsic);
      navBarView.position.setState("absolute", Affinity.Intrinsic);
      navBarView.left.setState(0, Affinity.Intrinsic);
      navBarView.top.setState(0, Affinity.Intrinsic);
      navBarView.width.setState(stackWidth, Affinity.Intrinsic);
      navBarView.zIndex.setState(1, Affinity.Intrinsic);
    },
    willAttachView(navBarView: BarView, target: View | null): void {
      this.owner.callObservers("viewWillAttachNavBar", navBarView, target, this.owner);
    },
    didAttachView(navBarView: BarView, target: View | null): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    willDetachView(navBarView: BarView): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    didDetachView(navBarView: BarView): void {
      this.owner.callObservers("viewDidDetachNavBar", navBarView, this.owner);
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
  readonly navBar!: ViewRef<this, BarView> & Observes<BarView>;

  @ViewSet({
    viewType: SheetView,
    binds: true,
    observes: true,
    initView(sheetView: SheetView): void {
      const stackWidth = this.owner.width.cssState;
      const stackHeight = this.owner.height.cssState;

      const navBarView = this.owner.navBar.view;
      const navBarHeight = navBarView !== null && navBarView.mounted
                         ? navBarView.height.cssState : null;

      sheetView.position.setState("absolute", Affinity.Intrinsic);
      sheetView.left.setState(stackWidth, Affinity.Intrinsic);
      sheetView.top.setState(0, Affinity.Intrinsic);
      sheetView.width.setState(stackWidth, Affinity.Intrinsic);
      sheetView.height.setState(stackHeight, Affinity.Intrinsic);
      sheetView.paddingTop.setState(navBarHeight, Affinity.Intrinsic);
      sheetView.boxSizing.setState("border-box", Affinity.Intrinsic);
      sheetView.zIndex.setState(0, Affinity.Intrinsic);
    },
    willAttachView(sheetView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachSheet", sheetView, target, this.owner);
    },
    didDetachView(sheetView: SheetView): void {
      this.owner.callObservers("viewDidDetachSheet", sheetView, this.owner);
    },
    viewWillPresent(sheetView: SheetView): void {
      this.owner.callObservers("viewWillPresentSheet", sheetView, this.owner);
    },
    viewDidPresent(sheetView: SheetView): void {
      this.owner.callObservers("viewDidPresentSheet", sheetView, this.owner);
    },
    viewWillDismiss(sheetView: SheetView): void {
      this.owner.callObservers("viewWillDismissSheet", sheetView, this.owner);
    },
    viewDidDismiss(sheetView: SheetView): void {
      this.owner.callObservers("viewDidDismissSheet", sheetView, this.owner);
    },
    viewWillLayout(sheetView: SheetView): void {
      sheetView.layoutSheet();
    },
  })
  readonly sheets!: ViewSet<this, SheetView> & Observes<SheetView>;

  @ViewRef({
    viewType: SheetView,
    binds: false,
    willAttachView(sheetView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachFront", sheetView, target, this.owner);
    },
    didDetachView(sheetView: SheetView): void {
      this.owner.callObservers("viewDidDetachFront", sheetView, this.owner);
    },
  })
  readonly front!: ViewRef<this, SheetView>;

  @Property({
    extends: true,
    getOutletValue(outlet: Property<unknown, ViewInsets>): ViewInsets {
      let edgeInsets = this.value;
      let navBarView: BarView | null;
      if (outlet.owner instanceof SheetView
          && (navBarView = this.owner.navBar.view) !== null
          && navBarView.mounted) {
        edgeInsets = {
          insetTop: 0,
          insetRight: edgeInsets.insetRight,
          insetBottom: edgeInsets.insetBottom,
          insetLeft: edgeInsets.insetLeft,
        };
      }
      return edgeInsets;
    },
  })
  override readonly edgeInsets!: Property<this, ViewInsets>;

  protected override onResize(): void {
    super.onResize();
    this.resizeStack();
  }

  protected resizeStack(): void {
    const stackWidth = this.width.cssState;
    const stackHeight = this.height.cssState;

    const navBarView = this.navBar.view;
    let navBarHeight: Length | null = null;
    if (navBarView !== null && navBarView.mounted) {
      navBarView.width.setState(stackWidth, Affinity.Intrinsic);
      navBarHeight = navBarView.height.cssState;
    }

    const sheetViews = this.sheets.views;
    for (const viewId in sheetViews) {
      const sheetView = sheetViews[viewId]!;
      sheetView.width.setState(stackWidth, Affinity.Intrinsic);
      sheetView.height.setState(stackHeight, Affinity.Intrinsic);
      sheetView.paddingTop.setState(navBarHeight, Affinity.Intrinsic);
    }
  }
}
