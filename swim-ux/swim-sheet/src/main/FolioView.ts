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
import type {Length} from "@swim/math";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {Presence} from "@swim/style";
import type {ViewInsets} from "@swim/view";
import {View} from "@swim/view";
import {ViewRef} from "@swim/view";
import type {HtmlViewObserver} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import {BarView} from "@swim/toolbar";
import {DrawerView} from "@swim/window";
import {SheetView} from "./SheetView";
import {StackView} from "./StackView";

/** @public */
export type FolioStyle = "stacked" | "unstacked";

/** @public */
export interface FolioViewObserver<V extends FolioView = FolioView> extends HtmlViewObserver<V> {
  viewDidSetFolioStyle?(folioStyle: FolioStyle | undefined, view: V): void;

  viewDidSetFullBleed?(fullBleed: boolean, view: V): void;

  viewWillAttachAppBar?(appBarView: BarView, targetView: View | null, view: V): void;

  viewDidDetachAppBar?(appBarView: BarView, view: V): void;

  viewWillAttachDrawer?(drawerView: DrawerView, targetView: View | null, view: V): void;

  viewDidDetachDrawer?(drawerView: DrawerView, view: V): void;

  viewWillAttachStack?(stackView: StackView, targetView: View | null, view: V): void;

  viewDidDetachStack?(stackView: StackView, view: V): void;

  viewWillAttachCover?(coverView: SheetView, targetView: View | null, view: V): void;

  viewDidDetachCover?(coverView: SheetView, view: V): void;
}

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
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
  }

  declare readonly observerType?: Class<FolioViewObserver>;

  @Property({
    valueType: String,
    updateFlags: View.NeedsResize,
    didSetValue(folioStyle: FolioStyle | undefined): void {
      this.owner.callObservers("viewDidSetFolioStyle", folioStyle, this.owner);
      this.owner.edgeInsets.decohereOutlets();
    },
  })
  readonly folioStyle!: Property<this, FolioStyle | undefined>;

  @Property({
    valueType: Boolean,
    value: false,
    didSetValue(fullBleed: boolean): void {
      this.owner.requireUpdate(View.NeedsResize, true);
      this.owner.callObservers("viewDidSetFullBleed", fullBleed, this.owner);
    },
  })
  readonly fullBleed!: Property<this, boolean>;

  @ViewRef({
    viewType: BarView,
    binds: true,
    initView(appBarView: BarView): void {
      const folioWidth = this.owner.width.cssState!;

      const drawerView = this.owner.drawer.view;
      const drawerWidth = drawerView !== null ? drawerView.effectiveWidth.value : null;
      const sheetWidth = drawerWidth !== null ? folioWidth.minus(drawerWidth) : folioWidth;

      appBarView.placement.setValue("top", Affinity.Intrinsic);
      appBarView.position.setState("absolute", Affinity.Intrinsic);
      appBarView.left.setState(drawerWidth, Affinity.Intrinsic);
      appBarView.top.setState(0, Affinity.Intrinsic);
      appBarView.width.setState(sheetWidth, Affinity.Intrinsic);
      appBarView.zIndex.setState(1, Affinity.Intrinsic);
    },
    willAttachView(appBarView: BarView, target: View | null): void {
      this.owner.callObservers("viewWillAttachAppBar", appBarView, target, this.owner);
    },
    didAttachView(navBarView: BarView, target: View | null): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    willDetachView(navBarView: BarView): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    didDetachView(appBarView: BarView): void {
      this.owner.callObservers("viewDidDetachAppBar", appBarView, this.owner);
    },
  })
  readonly appBar!: ViewRef<this, BarView>;

  @ViewRef({
    viewType: DrawerView,
    binds: true,
    observes: true,
    initView(drawerView: DrawerView): void {
      drawerView.overflowX.setState("hidden", Affinity.Intrinsic);
      drawerView.overflowY.setState("hidden", Affinity.Intrinsic);
      drawerView.zIndex.setState(2, Affinity.Intrinsic);
      drawerView.present(false);
    },
    willAttachView(drawerView: DrawerView, target: View | null): void {
      this.owner.callObservers("viewWillAttachDrawer", drawerView, target, this.owner);
    },
    didDetachView(drawerView: DrawerView): void {
      this.owner.callObservers("viewDidDetachDrawer", drawerView, this.owner);
    },
    insertChild(parent: View, childView: DrawerView, targetView: View | null, key: string | undefined): void {
      parent.prependChild(childView, key);
    },
    viewDidSetPresence(presence: Presence, drawerView: DrawerView): void {
      this.owner.edgeInsets.decohereOutlets();
    },
    viewDidSetEffectiveWidth(effectiveWidth: Length | null, drawerView: DrawerView): void {
      if (this.owner.folioStyle.value === "unstacked") {
        this.owner.requireUpdate(View.NeedsResize);
      }
    },
  })
  readonly drawer!: ViewRef<this, DrawerView> & Observes<DrawerView>;

  @ViewRef({
    viewType: StackView,
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

  @ViewRef({
    viewType: SheetView,
    binds: false,
    observes: true,
    initView(coverView: SheetView): void {
      if (this.owner.folioStyle.value === "unstacked") {
        const folioWidth = this.owner.width.cssState!;
        const folioHeight = this.owner.height.cssState!;

        const drawerView = this.owner.drawer.view;
        const drawerWidth = drawerView !== null ? drawerView.effectiveWidth.value : null;
        const sheetWidth = drawerWidth !== null ? folioWidth.minus(drawerWidth) : folioWidth;

        const appBarView = this.owner.appBar.view;
        const appBarHeight = appBarView !== null ? appBarView.height.cssState : null;

        coverView.position.setState("absolute", Affinity.Intrinsic);
        coverView.left.setState(drawerWidth, Affinity.Intrinsic);
        coverView.top.setState(0, Affinity.Intrinsic);
        coverView.width.setState(sheetWidth, Affinity.Intrinsic);
        coverView.height.setState(folioHeight, Affinity.Intrinsic);
        coverView.paddingTop.setState(appBarHeight, Affinity.Intrinsic);
        coverView.boxSizing.setState("border-box", Affinity.Intrinsic);
        coverView.zIndex.setState(0, Affinity.Intrinsic);
      }
    },
    willAttachView(coverView: SheetView, target: View | null): void {
      this.owner.callObservers("viewWillAttachCover", coverView, target, this.owner);
    },
    didAttachView(coverView: SheetView, target: View | null): void {
      this.owner.fullBleed.setValue(coverView.fullBleed.value, Affinity.Intrinsic);
    },
    willDetachView(coverView: SheetView): void {
      coverView.remove();
    },
    didDetachView(coverView: SheetView): void {
      this.owner.callObservers("viewDidDetachCover", coverView, this.owner);
    },
    viewDidSetFullBleed(fullBleed: boolean, coverView: SheetView): void {
      this.owner.fullBleed.setValue(fullBleed, Affinity.Intrinsic);
    },
  })
  readonly cover!: ViewRef<this, SheetView> & Observes<SheetView>;

  @Property({
    extends: true,
    getOutletValue(outlet: Property<unknown, ViewInsets>): ViewInsets {
      let edgeInsets = this.value;
      if (this.owner.folioStyle.value === "unstacked") {
        let insetTop = edgeInsets.insetTop;
        const insetRight = edgeInsets.insetRight;
        const insetBottom = edgeInsets.insetBottom;
        let insetLeft = edgeInsets.insetLeft;
        if (outlet.owner === this.owner.appBar.view) {
          const drawerView = this.owner.drawer.view;
          if (drawerView !== null) {
            insetLeft *= 1 - drawerView.presence.value.phase;
          }
          edgeInsets = {insetTop, insetRight, insetBottom, insetLeft};
        } else if (outlet.owner === this.owner.cover.view) {
          if (this.owner.appBar.view !== null) {
            insetTop = 0;
          }
          const drawerView = this.owner.drawer.view;
          if (drawerView !== null) {
            insetLeft *= 1 - drawerView.presence.value.phase;
          }
          edgeInsets = {insetTop, insetRight, insetBottom, insetLeft};
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
    this.resizeFolio();
  }

  protected resizeFolio(): void {
    let folioStyle = this.folioStyle.value;
    if (this.folioStyle.hasAffinity(Affinity.Intrinsic)) {
      folioStyle = this.viewIdiom === "mobile" ? "stacked" : "unstacked";
      this.folioStyle.setValue(folioStyle, Affinity.Intrinsic);
    }

    if (folioStyle === "stacked") {
      this.resizeStacked();
    } else if (folioStyle === "unstacked") {
      this.resizeUnstacked();
    }
  }

  protected resizeStacked(): void {
    this.drawer.removeView();
    this.appBar.removeView();
    this.stack.insertView(this);

    const coverView = this.cover.view;
    if (coverView !== null) {
      if (coverView.parent === this) {
        coverView.remove();
      }

      coverView.paddingLeft.setState(null, Affinity.Intrinsic);
    }
  }

  protected resizeUnstacked(): void {
    const folioWidth = this.width.cssState!;
    const folioHeight = this.height.cssState!;

    const drawerView = this.drawer.insertView();
    const drawerWidth = drawerView.effectiveWidth.value;
    const sheetWidth = drawerWidth !== null ? folioWidth.minus(drawerWidth) : folioWidth;

    const appBarView = this.appBar.view;
    let appBarHeight: Length | null = null;
    if (appBarView !== null) {
      this.appBar.insertView();
      appBarView.left.setState(drawerWidth, Affinity.Intrinsic);
      appBarView.width.setState(sheetWidth, Affinity.Intrinsic);
      appBarHeight = appBarView.height.cssState;
    }

    this.stack.insertView(drawerView);

    const coverView = this.cover.view;
    if (coverView !== null) {
      this.cover.insertView(this);
      if (this.fullBleed.value) {
        coverView.left.setState(0, Affinity.Intrinsic);
        coverView.top.setState(0, Affinity.Intrinsic);
        coverView.width.setState(folioWidth, Affinity.Intrinsic);
        coverView.height.setState(folioHeight, Affinity.Intrinsic);
        coverView.paddingTop.setState(appBarHeight, Affinity.Intrinsic);
        coverView.paddingLeft.setState(drawerWidth, Affinity.Intrinsic);
      } else {
        coverView.left.setState(drawerWidth, Affinity.Intrinsic);
        coverView.top.setState(0, Affinity.Intrinsic);
        coverView.width.setState(sheetWidth, Affinity.Intrinsic);
        coverView.height.setState(folioHeight, Affinity.Intrinsic);
        coverView.paddingTop.setState(appBarHeight, Affinity.Intrinsic);
        coverView.paddingLeft.setState(null, Affinity.Intrinsic);
      }
      coverView.present(false);
    }
  }

  protected override didLayout(): void {
    this.layoutFolio();
    super.didLayout();
  }

  protected layoutFolio(): void {
    const folioStyle = this.folioStyle.value;
    if (folioStyle === "stacked") {
      this.layoutStacked();
    } else if (folioStyle === "unstacked") {
      this.layoutUnstacked();
    }
  }

  protected layoutStacked(): void {
    // hook
  }

  protected layoutUnstacked(): void {
    const folioWidth = this.width.cssState!;

    const drawerView = this.drawer.insertView();
    const drawerWidth = drawerView.effectiveWidth.value;
    const sheetWidth = drawerWidth !== null ? folioWidth.minus(drawerWidth) : folioWidth;

    const appBarView = this.appBar.view;
    if (appBarView !== null) {
      appBarView.left.setState(drawerWidth, Affinity.Intrinsic);
      appBarView.width.setState(sheetWidth, Affinity.Intrinsic);
    }

    const coverView = this.cover.view;
    if (coverView !== null) {
      if (this.fullBleed.value) {
        coverView.left.setState(0, Affinity.Intrinsic);
        coverView.width.setState(folioWidth, Affinity.Intrinsic);
        coverView.paddingLeft.setState(drawerWidth, Affinity.Intrinsic);
      } else {
        coverView.left.setState(drawerWidth, Affinity.Intrinsic);
        coverView.top.setState(0, Affinity.Intrinsic);
        coverView.paddingLeft.setState(null, Affinity.Intrinsic);
      }
    }
  }
}
