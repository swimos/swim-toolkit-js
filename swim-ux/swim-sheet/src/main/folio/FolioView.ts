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
import {Length} from "@swim/math";
import {Affinity, MemberFastenerClass, Property} from "@swim/component";
import {ViewportInsets, ViewContextType, View, ViewRef} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {BarView} from "@swim/toolbar";
import {DrawerView} from "@swim/window";
import {SheetView} from "../sheet/SheetView";
import {StackView} from "../stack/StackView";
import type {FolioViewObserver} from "./FolioViewObserver";

/** @public */
export type FolioStyle = "stacked" | "unstacked";

/** @public */
export class FolioView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initFolio();
  }

  protected initFolio(): void {
    this.addClass("folio");
    this.display.setState("flex", Affinity.Intrinsic);
    this.position.setState("relative", Affinity.Intrinsic);
  }

  override readonly observerType?: Class<FolioViewObserver>;

  @Property<FolioView, FolioStyle | undefined>({
    type: String,
    updateFlags: View.NeedsResize,
    didSetValue(folioStyle: FolioStyle | undefined): void {
      this.owner.callObservers("viewDidSetFolioStyle", folioStyle, this.owner);
    },
  })
  readonly folioStyle!: Property<this, FolioStyle | undefined>;

  @Property({type: Object, inherits: true, value: null, updateFlags: View.NeedsResize})
  readonly edgeInsets!: Property<this, ViewportInsets | null>;

  @ViewRef<FolioView, BarView>({
    type: BarView,
    binds: true,
    initView(appbarView: BarView): void {
      let folioWidth = this.owner.width.state;
      folioWidth = folioWidth instanceof Length ? folioWidth : Length.px(this.owner.node.offsetWidth);

      const pocketView = this.owner.pocket.view;
      const pocketWidth = pocketView !== null ? pocketView.effectiveWidth.value : null;
      const sheetWidth = pocketWidth !== null ? folioWidth.minus(pocketWidth) : folioWidth;

      appbarView.position.setState("absolute", Affinity.Intrinsic);
      appbarView.left.setState(pocketWidth, Affinity.Intrinsic);
      appbarView.top.setState(0, Affinity.Intrinsic);
      appbarView.width.setState(sheetWidth, Affinity.Intrinsic);
      appbarView.zIndex.setState(1, Affinity.Intrinsic);
    },
    willAttachView(appbarView: BarView, target: View | null): void {
      this.owner.callObservers("viewWillAttachAppbar", appbarView, target, this.owner);
    },
    didAttachView(appbarView: BarView, target: View | null): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
    didDetachView(appbarView: BarView): void {
      this.owner.callObservers("viewDidDetachAppbar", appbarView, this.owner);
    },
  })
  readonly appbar!: ViewRef<this, BarView>;
  static readonly appbar: MemberFastenerClass<FolioView, "appbar">;

  @ViewRef<FolioView, DrawerView>({
    type: DrawerView,
    binds: true,
    observes: true,
    initView(pocketView: DrawerView): void {
      pocketView.present(false);
    },
    willAttachView(pocketView: DrawerView, target: View | null): void {
      this.owner.callObservers("viewWillAttachPocket", pocketView, target, this.owner);
    },
    didDetachView(pocketView: DrawerView): void {
      this.owner.callObservers("viewDidDetachPocket", pocketView, this.owner);
    },
    insertChild(parent: View, childView: DrawerView, targetView: View | null, key: string | undefined): void {
      parent.prependChild(childView, key);
    },
    viewDidSetEffectiveWidth(effectiveWidth: Length | null, pocketView: DrawerView): void {
      if (this.owner.folioStyle.value === "unstacked") {
        this.owner.requireUpdate(View.NeedsLayout);
      }
    },
  })
  readonly pocket!: ViewRef<this, DrawerView>;
  static readonly pocket: MemberFastenerClass<FolioView, "pocket">;

  @ViewRef<FolioView, StackView>({
    type: StackView,
    initView(stackView: StackView): void {
      stackView.flexGrow.setState(1, Affinity.Intrinsic);
    },
    willAttachView(stackView: StackView, target: View | null): void {
      this.owner.callObservers("viewWillAttachStack", stackView, target, this.owner);
    },
    didDetachView(stackView: StackView): void {
      this.owner.callObservers("viewDidDetachStack", stackView, this.owner);
    },
  })
  readonly stack!: ViewRef<this, StackView>;
  static readonly stack: MemberFastenerClass<FolioView, "stack">;

  @ViewRef<FolioView, SheetView>({
    type: SheetView,
    initView(coverView: SheetView): void {
      if (this.owner.folioStyle.value === "unstacked") {
        let folioWidth = this.owner.width.state;
        folioWidth = folioWidth instanceof Length ? folioWidth : Length.px(this.owner.node.offsetWidth);
        let folioHeight = this.owner.height.state;
        folioHeight = folioHeight instanceof Length ? folioHeight : Length.px(this.owner.node.offsetHeight);
        let edgeInsets = this.owner.edgeInsets.value;
        if (edgeInsets === void 0 && this.owner.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
          edgeInsets = this.owner.viewport.safeArea;
        }

        const pocketView = this.owner.pocket.view;
        const pocketWidth = pocketView !== null ? pocketView.effectiveWidth.value : null;
        const sheetWidth = pocketWidth !== null ? folioWidth.minus(pocketWidth) : folioWidth;

        const appbarView = this.owner.appbar.view;
        let appbarHeight: Length | null = null;
        if (appbarView !== null) {
          appbarHeight = appbarView.height.state;
          appbarHeight = appbarHeight !== null ? appbarHeight : appbarView.barHeight.state;
          appbarHeight = appbarHeight instanceof Length ? appbarHeight : Length.px(appbarView.node.offsetHeight);
          if (edgeInsets !== null) {
            edgeInsets = {
              insetTop: 0,
              insetRight: edgeInsets.insetRight,
              insetBottom: edgeInsets.insetBottom,
              insetLeft: edgeInsets.insetLeft,
            };
          }
        }

        coverView.position.setState("absolute", Affinity.Intrinsic);
        coverView.left.setState(pocketWidth, Affinity.Intrinsic);
        coverView.top.setState(0, Affinity.Intrinsic);
        coverView.width.setState(sheetWidth, Affinity.Intrinsic);
        coverView.height.setState(folioHeight, Affinity.Intrinsic);
        coverView.paddingTop.setState(appbarHeight, Affinity.Intrinsic);
        coverView.boxSizing.setState("border-box", Affinity.Intrinsic);
        coverView.zIndex.setState(0, Affinity.Intrinsic);
        coverView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
      }
    },
    willAttachView(coverView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachCover", coverView, target, this.owner);
    },
    didAttachView(coverView: SheetView, target: View | null): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
    willDetachView(coverView: SheetView): void {
      coverView.remove();
    },
    didDetachView(coverView: SheetView): void {
      this.owner.callObservers("viewDidDetachCover", coverView, this.owner);
    },
  })
  readonly cover!: ViewRef<this, SheetView>;
  static readonly cover: MemberFastenerClass<FolioView, "cover">;

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeFolio(viewContext);
  }

  protected resizeFolio(viewContext: ViewContextType<this>): void {
    let folioStyle = this.folioStyle.value;
    if (this.folioStyle.hasAffinity(Affinity.Intrinsic)) {
      folioStyle = this.viewportIdiom === "mobile" ? "stacked" : "unstacked";
      this.folioStyle.setValue(folioStyle, Affinity.Intrinsic);
    }

    if (folioStyle === "stacked") {
      this.resizeStacked(viewContext);
    } else if (folioStyle === "unstacked") {
      this.resizeUnstacked(viewContext);
    }
  }

  protected resizeStacked(viewContext: ViewContextType<this>): void {
    this.pocket.removeView();
    this.appbar.removeView();
    this.stack.insertView(this);

    const coverView = this.cover.view;
    if (coverView !== null && coverView.parent === this) {
      coverView.remove();
    }
  }

  protected resizeUnstacked(viewContext: ViewContextType<this>): void {
    let folioWidth = this.width.state;
    folioWidth = folioWidth instanceof Length ? folioWidth : Length.px(this.node.offsetWidth);
    let folioHeight = this.height.state;
    folioHeight = folioHeight instanceof Length ? folioHeight : Length.px(this.node.offsetHeight);
    let edgeInsets = this.edgeInsets.value;
    if (edgeInsets === void 0 && this.edgeInsets.hasAffinity(Affinity.Intrinsic)) {
      edgeInsets = viewContext.viewport.safeArea;
    }

    const pocketView = this.pocket.insertView();
    const pocketWidth = pocketView.effectiveWidth.value;
    const sheetWidth = pocketWidth !== null ? folioWidth.minus(pocketWidth) : folioWidth;

    const appbarView = this.appbar.view;
    let appbarHeight: Length | null = null;
    if (appbarView !== null) {
      this.appbar.insertView();
      appbarView.left.setState(pocketWidth, Affinity.Intrinsic);
      appbarView.width.setState(sheetWidth, Affinity.Intrinsic);
      appbarHeight = appbarView.height.state;
      appbarHeight = appbarHeight !== null ? appbarHeight : appbarView.barHeight.state;
      appbarHeight = appbarHeight instanceof Length ? appbarHeight : Length.px(appbarView.node.offsetHeight);
      if (edgeInsets !== null) {
        edgeInsets = {
          insetTop: 0,
          insetRight: edgeInsets.insetRight,
          insetBottom: edgeInsets.insetBottom,
          insetLeft: edgeInsets.insetLeft,
        };
      }
    }

    this.stack.insertView(pocketView);

    const coverView = this.cover.insertView(this);
    coverView.left.setState(pocketWidth, Affinity.Intrinsic);
    coverView.top.setState(0, Affinity.Intrinsic);
    coverView.width.setState(sheetWidth, Affinity.Intrinsic);
    coverView.height.setState(folioHeight, Affinity.Intrinsic);
    coverView.paddingTop.setState(appbarHeight, Affinity.Intrinsic);
    coverView.edgeInsets.setValue(edgeInsets, Affinity.Intrinsic);
    coverView.present(false);
  }

  protected override didLayout(viewContext: ViewContextType<this>): void {
    this.layoutFolio(viewContext);
    super.didLayout(viewContext);
  }

  protected layoutFolio(viewContext: ViewContextType<this>): void {
    const folioStyle = this.folioStyle.value;
    if (folioStyle === "stacked") {
      this.layoutStacked(viewContext);
    } else if (folioStyle === "unstacked") {
      this.layoutUnstacked(viewContext);
    }
  }

  protected layoutStacked(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected layoutUnstacked(viewContext: ViewContextType<this>): void {
    let folioWidth = this.width.state;
    folioWidth = folioWidth instanceof Length ? folioWidth : Length.px(this.node.offsetWidth);
    const pocketView = this.pocket.insertView();
    const pocketWidth = pocketView.effectiveWidth.value;
    const sheetWidth = pocketWidth !== null ? folioWidth.minus(pocketWidth) : folioWidth;

    const appbarView = this.appbar.view;
    if (appbarView !== null) {
      appbarView.left.setState(pocketWidth, Affinity.Intrinsic);
      appbarView.width.setState(sheetWidth, Affinity.Intrinsic);
    }

    const coverView = this.cover.view;
    if (coverView !== null) {
      coverView.left.setState(pocketWidth, Affinity.Intrinsic);
      coverView.width.setState(sheetWidth, Affinity.Intrinsic);
    }
  }
}
