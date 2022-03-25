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
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {Length} from "@swim/math";
import {ViewportInsets, ViewContextType, View, ViewRef, ViewSet} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {BarView} from "@swim/toolbar";
import {SheetView} from "../sheet/SheetView";
import type {StackViewObserver} from "./StackViewObserver";

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

  override readonly observerType?: Class<StackViewObserver>;

  @Property({type: Object, inherits: true, value: null, updateFlags: View.NeedsResize})
  readonly edgeInsets!: Property<this, ViewportInsets | null>;

  @ViewRef<StackView, BarView>({
    type: BarView,
    binds: true,
    observes: true,
    initView(navBarView: BarView): void {
      let stackWidth = this.owner.width.state;
      stackWidth = stackWidth instanceof Length ? stackWidth : Length.px(this.owner.node.offsetWidth);

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
    didDetachView(navBarView: BarView): void {
      this.owner.callObservers("viewDidDetachNavBar", navBarView, this.owner);
    },
    viewDidSetBarHeight(barHeight: Length | null): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
  })
  readonly navBar!: ViewRef<this, BarView>;
  static readonly navBar: MemberFastenerClass<StackView, "navBar">;

  @ViewSet<StackView, SheetView>({
    implements: true,
    type: SheetView,
    binds: true,
    observes: true,
    initView(sheetView: SheetView): void {
      let stackWidth = this.owner.width.state;
      stackWidth = stackWidth instanceof Length ? stackWidth : Length.px(this.owner.node.offsetWidth);
      let stackHeight = this.owner.height.state;
      stackHeight = stackHeight instanceof Length ? stackHeight : Length.px(this.owner.node.offsetHeight);
      let edgeInsets = this.owner.edgeInsets.value;
      if (edgeInsets === void 0 && this.owner.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
        edgeInsets = this.owner.viewport.safeArea;
      }

      const navBarView = this.owner.navBar.view;
      let navBarHeight: Length | null = null;
      if (navBarView !== null) {
        navBarHeight = navBarView.effectiveHeight.value;
        if (edgeInsets !== null) {
          edgeInsets = {
            insetTop: 0,
            insetRight: edgeInsets.insetRight,
            insetBottom: edgeInsets.insetBottom,
            insetLeft: edgeInsets.insetLeft,
          };
        }
      }

      sheetView.position.setState("absolute", Affinity.Intrinsic);
      sheetView.left.setState(stackWidth, Affinity.Intrinsic);
      sheetView.top.setState(0, Affinity.Intrinsic);
      sheetView.width.setState(stackWidth, Affinity.Intrinsic);
      sheetView.height.setState(stackHeight, Affinity.Intrinsic);
      sheetView.paddingTop.setState(navBarHeight, Affinity.Intrinsic);
      sheetView.boxSizing.setState("border-box", Affinity.Intrinsic);
      sheetView.zIndex.setState(0, Affinity.Intrinsic);
      sheetView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    },
    willAttachView(sheetView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachSheet", sheetView, target, this.owner);
      const backView = this.owner.front.view;
      if (sheetView !== backView) {
        sheetView.back.setView(backView);
        if (backView !== null) {
          backView.forward.setView(sheetView);
        }
        this.owner.front.setView(sheetView);
      }
    },
    didDetachView(sheetView: SheetView): void {
      const backView = sheetView.back.view;
      const forwardView = sheetView.forward.view;
      if (sheetView === this.owner.front.view) {
        this.owner.front.setView(backView, forwardView);
      }
      if (backView !== null) {
        backView.forward.setView(forwardView);
        sheetView.back.setView(null);
      }
      if (forwardView !== null) {
        sheetView.forward.setView(null);
        forwardView.back.setView(backView);
      }
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
      if (sheetView === this.owner.front.view) {
        this.owner.front.setView(null);
        const backView = sheetView.back.view;
        if (backView !== null) {
          this.owner.front.setView(backView, sheetView);
          backView.forward.setView(null);
          sheetView.back.setView(null);
        }
      }
    },
    viewDidDismiss(sheetView: SheetView): void {
      if (sheetView.forward.view !== null) {
        this.removeView(sheetView);
      } else {
        this.deleteView(sheetView);
      }
      this.owner.callObservers("viewDidDismissSheet", sheetView, this.owner);
    },
    viewWillLayout(viewContext: ViewContextType<SheetView>, sheetView: SheetView): void {
      sheetView.layoutSheet();
    },
    detectView(view: View): SheetView | null {
      return view instanceof SheetView && view.forward.view === null ? view : null;
    },
  })
  readonly sheets!: ViewSet<this, SheetView>;
  static readonly sheets: MemberFastenerClass<StackView, "sheets">;

  @ViewRef<StackView, SheetView>({
    type: SheetView,
    binds: false,
    willAttachView(sheetView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachFront", sheetView, target, this.owner);
      if (sheetView.parent === null) {
        this.owner.insertChild(sheetView, target);
      }
      if (sheetView.forward.view === null) {
        sheetView.sheetAlign.setValue(1, Affinity.Intrinsic);
        sheetView.present(sheetView.back.view !== null);
      } else {
        sheetView.sheetAlign.setValue(-(1 / 3), Affinity.Intrinsic);
        sheetView.present();
      }
    },
    didDetachView(sheetView: SheetView): void {
      if (sheetView.forward.view !== null) {
        sheetView.sheetAlign.setValue(-(1 / 3), Affinity.Intrinsic);
        sheetView.dismiss();
      } else {
        sheetView.sheetAlign.setValue(1, Affinity.Intrinsic);
        sheetView.dismiss();
      }
      this.owner.callObservers("viewDidDetachFront", sheetView, this.owner);
    },
  })
  readonly front!: ViewRef<this, SheetView>;
  static readonly front: MemberFastenerClass<StackView, "front">;

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeStack(viewContext);
  }

  protected resizeStack(viewContext: ViewContextType<this>): void {
    let stackWidth = this.width.state;
    stackWidth = stackWidth instanceof Length ? stackWidth : Length.px(this.node.offsetWidth);
    let stackHeight = this.height.state;
    stackHeight = stackHeight instanceof Length ? stackHeight : Length.px(this.node.offsetHeight);
    let edgeInsets = this.edgeInsets.value;
    if (edgeInsets === void 0 && this.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
      edgeInsets = viewContext.viewport.safeArea;
    }

    const navBarView = this.navBar.view;
    if (navBarView !== null) {
      navBarView.width.setState(stackWidth, Affinity.Intrinsic);
      if (edgeInsets !== null) {
        edgeInsets = {
          insetTop: 0,
          insetRight: edgeInsets.insetRight,
          insetBottom: edgeInsets.insetBottom,
          insetLeft: edgeInsets.insetLeft,
        };
      }
    }

    const sheetViews = this.sheets.views;
    for (const viewId in sheetViews) {
      const sheetView = sheetViews[viewId]!;
      sheetView.width.setState(stackWidth, Affinity.Intrinsic);
      sheetView.height.setState(stackHeight, Affinity.Intrinsic);
      sheetView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    }
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutStack(viewContext);
  }

  protected layoutStack(viewContext: ViewContextType<this>): void {
    const navBarView = this.navBar.view;
    let navBarHeight: Length | null = null;
    if (navBarView !== null) {
      navBarHeight = navBarView.height.state;
      navBarHeight = navBarHeight instanceof Length ? navBarHeight : Length.px(navBarView.node.offsetHeight);
    }

    const sheetViews = this.sheets.views;
    for (const viewId in sheetViews) {
      const sheetView = sheetViews[viewId]!;
      sheetView.paddingTop.setState(navBarHeight, Affinity.Intrinsic);
    }
  }
}
