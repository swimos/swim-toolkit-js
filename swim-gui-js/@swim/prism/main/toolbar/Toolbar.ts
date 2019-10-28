// Copyright 2015-2019 SWIM.AI inc.
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

import {Color} from "@swim/color";
import {Constraint} from "@swim/constraint";
import {LayoutAnchor, View, HtmlView} from "@swim/view";
import {ToolbarController} from "./ToolbarController";
import {SearchBar} from "../search/SearchBar";
import {DockBar} from "../dock/DockBar";
import {CabinetBar} from "../cabinet/CabinetBar";
import {TreeBar} from "../tree/TreeBar";

export class Toolbar extends HtmlView {
  /** @hidden */
  _viewController: ToolbarController | null;

  /** @hidden */
  _cabinetBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _cabinetBarInsetLeftConstraint: Constraint | undefined;
  /** @hidden */
  _searchBarLeftConstraint: Constraint | undefined;
  /** @hidden */
  _searchBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _treeBarRightConstraint: Constraint | undefined;
  /** @hidden */
  _treeBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _dockBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _dockBarInsetRightConstraint: Constraint | undefined;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("toolbar")
        .position("relative")
        .height(60)
        .borderTopWidth(1)
        .borderTopStyle("solid")
        .borderTopColor(Color.transparent())
        .borderBottomWidth(1)
        .borderBottomStyle("solid")
        .borderBottomColor(Color.black())
        .boxSizing("border-box")
        .backgroundColor("#2b2d2f");
  }

  protected initChildren(): void {
    this.append(CabinetBar, "cabinetBar");
    this.append(SearchBar, "searchBar");
    this.append(TreeBar, "treeBar");
    this.append(DockBar, "dockBar");
  }

  get viewController(): ToolbarController | null {
    return this._viewController;
  }

  @LayoutAnchor("strong")
  cabinetBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetBarInsetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  searchBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  searchBarInsetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeBarInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  dockBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  dockBarInsetRight: LayoutAnchor<this>;

  get cabinetBar(): CabinetBar | null {
    const childView = this.getChildView("cabinetBar");
    return childView instanceof CabinetBar ? childView : null;
  }

  get searchBar(): SearchBar | null {
    const childView = this.getChildView("searchBar");
    return childView instanceof SearchBar ? childView : null;
  }

  get treeBar(): TreeBar | null {
    const childView = this.getChildView("treeBar");
    return childView instanceof TreeBar ? childView : null;
  }

  get dockBar(): DockBar | null {
    const childView = this.getChildView("dockBar");
    return childView instanceof DockBar ? childView : null;
  }

  /** @hidden */
  updateLayoutValues(): void {
    const searchBar = this.searchBar;
    if (searchBar) {
      searchBar.paddingLeft(this.searchBarInsetLeft.value);
    }
    const treeBar = this.treeBar;
    if (treeBar) {
      treeBar.paddingRight(this.treeBarInsetRight.value);
    }
    super.updateLayoutValues();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "cabinetBar" && childView instanceof CabinetBar) {
      this.onInsertCabinetBar(childView);
    } else if (childKey === "searchBar" && childView instanceof SearchBar) {
      this.onInsertSearchBar(childView);
    } else if (childKey === "treeBar" && childView instanceof TreeBar) {
      this.onInsertTreeBar(childView);
    } else if (childKey === "dockBar" && childView instanceof DockBar) {
      this.onInsertDockBar(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "cabinetBar" && childView instanceof CabinetBar) {
      this.onRemoveCabinetBar(childView);
    } else if (childKey === "searchBar" && childView instanceof SearchBar) {
      this.onRemoveSearchBar(childView);
    } else if (childKey === "treeBar" && childView instanceof TreeBar) {
      this.onRemoveTreeBar(childView);
    } else if (childKey === "dockBar" && childView instanceof DockBar) {
      this.onRemoveDockBar(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertCabinetBar(cabinetBar: CabinetBar): void {
    cabinetBar.position("absolute").top(0).bottom(0).left(0);
    cabinetBar.widthAnchor.enabled(true);
    this._cabinetBarWidthConstraint = this.constraint(cabinetBar.widthAnchor, "eq", this.cabinetBarWidth).enabled(true);
    this._cabinetBarInsetLeftConstraint = this.constraint(cabinetBar.insetLeft, "eq", this.cabinetBarInsetLeft).enabled(true);
  }

  protected onRemoveCabinetBar(cabinetBar: CabinetBar): void {
    if (this._cabinetBarInsetLeftConstraint) {
      this._cabinetBarInsetLeftConstraint.enabled(false);
      this._cabinetBarInsetLeftConstraint = void 0;
    }
    if (this._cabinetBarWidthConstraint) {
      this._cabinetBarWidthConstraint.enabled(false);
      this._cabinetBarWidthConstraint = void 0;
    }
  }

  protected onInsertSearchBar(searchBar: SearchBar): void {
    searchBar.position("absolute").top(0).bottom(0);
    searchBar.leftAnchor.enabled(true);
    searchBar.widthAnchor.enabled(true);
    this._searchBarLeftConstraint = this.constraint(searchBar.leftAnchor, "eq", this.cabinetBarWidth).enabled(true);
    this._searchBarWidthConstraint = this.constraint(searchBar.widthAnchor, "eq", this.searchBarWidth).enabled(true);
  }

  protected onRemoveSearchBar(searchBar: SearchBar): void {
    if (this._searchBarWidthConstraint) {
      this._searchBarWidthConstraint.enabled(false);
      this._searchBarWidthConstraint = void 0;
    }
    if (this._searchBarLeftConstraint) {
      this._searchBarLeftConstraint.enabled(false);
      this._searchBarLeftConstraint = void 0;
    }
  }

  protected onInsertTreeBar(treeBar: TreeBar): void {
    treeBar.position("absolute").top(0).bottom(0);
    treeBar.rightAnchor.enabled(true);
    treeBar.widthAnchor.enabled(true);
    this._searchBarLeftConstraint = this.constraint(treeBar.rightAnchor, "eq", this.dockBarWidth).enabled(true);
    this._searchBarWidthConstraint = this.constraint(treeBar.widthAnchor, "eq", this.treeBarWidth).enabled(true);
  }

  protected onRemoveTreeBar(treeBar: TreeBar): void {
    if (this._treeBarWidthConstraint) {
      this._treeBarWidthConstraint.enabled(false);
      this._treeBarWidthConstraint = void 0;
    }
    if (this._treeBarRightConstraint) {
      this._treeBarRightConstraint.enabled(false);
      this._treeBarRightConstraint = void 0;
    }
  }

  protected onInsertDockBar(dockBar: DockBar): void {
    dockBar.position("absolute").top(0).right(0).bottom(0);
    dockBar.widthAnchor.enabled(true);
    this._dockBarWidthConstraint = this.constraint(dockBar.widthAnchor, "eq", this.dockBarWidth).enabled(true);
    this._dockBarInsetRightConstraint = this.constraint(dockBar.insetRight, "eq", this.dockBarInsetRight).enabled(true);
  }

  protected onRemoveDockBar(dockBar: DockBar): void {
    if (this._dockBarInsetRightConstraint) {
      this._dockBarInsetRightConstraint.enabled(false);
      this._dockBarInsetRightConstraint = void 0;
    }
    if (this._dockBarWidthConstraint) {
      this._dockBarWidthConstraint.enabled(false);
      this._dockBarWidthConstraint = void 0;
    }
  }
}
