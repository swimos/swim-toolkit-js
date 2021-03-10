// Copyright 2015-2020 Swim inc.
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

import {ViewContextType, ViewFlags, View, ViewProperty, ViewFastener} from "@swim/view";
import {HtmlView, HtmlViewController} from "@swim/dom";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import {CellView} from "../cell/CellView";
import type {RowViewObserver} from "./RowViewObserver";

export class RowView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "cellFasteners", {
      value: [],
      enumerable: true,
    });
    this.initRow();
  }

  protected initRow(): void {
    this.addClass("table-row");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: HtmlViewController & RowViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<RowViewObserver>;

  @ViewProperty({type: TableLayout, inherit: true})
  declare layout: ViewProperty<this, TableLayout | undefined, AnyTableLayout | undefined>;

  @ViewProperty({type: Number, inherit: true})
  declare colSpacing: ViewProperty<this, number | undefined>;

  insertCell(cellView: CellView, targetView: View | null = null): void {
    const cellFasteners = this.cellFasteners as ViewFastener<this, CellView>[];
    let targetIndex = cellFasteners.length;
    for (let i = 0, n = cellFasteners.length; i < n; i += 1) {
      const cellFastener = cellFasteners[i]!;
      if (cellFastener.view === cellView) {
        return;
      } else if (cellFastener.view === targetView) {
        targetIndex = i;
      }
    }
    const cellFastener = this.createCellFastener(cellView);
    cellFasteners.splice(targetIndex, 0, cellFastener);
    cellFastener.setView(cellView, targetView);
    if (this.isMounted()) {
      cellFastener.mount();
    }
  }

  removeCell(cellView: CellView): void {
    const cellFasteners = this.cellFasteners as ViewFastener<this, CellView>[];
    for (let i = 0, n = cellFasteners.length; i < n; i += 1) {
      const cellFastener = cellFasteners[i]!;
      if (cellFastener.view === cellView) {
        cellFastener.setView(null);
        if (this.isMounted()) {
          cellFastener.unmount();
        }
        cellFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initCell(cellView: CellView, cellFastener: ViewFastener<this, CellView>): void {
    cellView.display.setAutoState("none");
    cellView.position.setAutoState("absolute");
    cellView.left.setAutoState(0);
    cellView.top.setAutoState(0);
    cellView.width.setAutoState(0);
    cellView.height.setAutoState(this.height.state);
  }

  protected willSetCell(newCellView: CellView | null, oldCellView: CellView | null,
                        targetView: View | null, cellFastener: ViewFastener<this, CellView>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.rowViewWillSetCell !== void 0) {
      viewController.rowViewWillSetCell(newCellView, oldCellView, targetView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.rowViewWillSetCell !== void 0) {
        viewObserver.rowViewWillSetCell(newCellView, oldCellView, targetView, this);
      }
    }
  }

  protected onSetCell(newCellView: CellView | null, oldCellView: CellView | null,
                      targetView: View | null, cellFastener: ViewFastener<this, CellView>): void {
    if (newCellView !== null) {
      this.initCell(newCellView, cellFastener);
    }
  }

  protected didSetCell(newCellView: CellView | null, oldCellView: CellView | null,
                       targetView: View | null, cellFastener: ViewFastener<this, CellView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.rowViewDidSetCell !== void 0) {
        viewObserver.rowViewDidSetCell(newCellView, oldCellView, targetView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.rowViewDidSetCell !== void 0) {
      viewController.rowViewDidSetCell(newCellView, oldCellView, targetView, this);
    }
  }

  /** @hidden */
  static CellFastener = ViewFastener.define<RowView, CellView>({
    type: CellView,
    child: false,
    willSetView(newCellView: CellView | null, oldCellView: CellView | null, targetView: View | null): void {
      this.owner.willSetCell(newCellView, oldCellView, targetView, this);
    },
    onSetView(newCellView: CellView | null, oldCellView: CellView | null, targetView: View | null): void {
      this.owner.onSetCell(newCellView, oldCellView, targetView, this);
    },
    didSetView(newCellView: CellView | null, oldCellView: CellView | null, targetView: View | null): void {
      this.owner.didSetCell(newCellView, oldCellView, targetView, this);
    },
  });

  protected createCellFastener(cellView: CellView): ViewFastener<this, CellView> {
    return new RowView.CellFastener(this, cellView.key, "cell");
  }

  /** @hidden */
  declare readonly cellFasteners: ReadonlyArray<ViewFastener<this, CellView>>;

  /** @hidden */
  protected mountCellFasteners(): void {
    const cellFasteners = this.cellFasteners;
    for (let i = 0, n = cellFasteners.length; i < n; i += 1) {
      const cellFastener = cellFasteners[i]!;
      cellFastener.mount();
    }
  }

  /** @hidden */
  protected unmountCellFasteners(): void {
    const cellFasteners = this.cellFasteners;
    for (let i = 0, n = cellFasteners.length; i < n; i += 1) {
      const cellFastener = cellFasteners[i]!;
      cellFastener.unmount();
    }
  }

  protected detectCell(view: View): CellView | null {
    return view instanceof CellView ? view : null;
  }

  protected onInsertCell(cellView: CellView, targetView: View | null): void {
    this.insertCell(cellView, targetView);
  }

  protected onRemoveCell(cellView: CellView): void {
    this.removeCell(cellView);
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    const cellView = this.detectCell(childView);
    if (cellView !== null) {
      this.onInsertCell(cellView, targetView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    const cellView = this.detectCell(childView);
    if (cellView !== null) {
      this.onRemoveCell(cellView);
    }
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildViews(displayFlags, viewContext, displayChildView);
    } else {
      super.displayChildViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    const layout = this.layout.state;
    const height = this.height.state;
    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (childView instanceof CellView) {
        const key = childView.key;
        const col = layout !== void 0 && key !== void 0 ? layout.getCol(key) : null;
        if (col !== null) {
          childView.display.setAutoState(!col.hidden ? "flex" : "none");
          childView.left.setAutoState(col.left !== null ? col.left : void 0);
          childView.width.setAutoState(col.width !== null ? col.width : void 0);
          childView.height.setAutoState(height);
        } else {
          childView.display.setAutoState("none");
          childView.left.setAutoState(void 0);
          childView.width.setAutoState(void 0);
          childView.height.setAutoState(void 0);
        }
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);
  }

  /** @hidden */
  protected mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountCellFasteners();
  }

  /** @hidden */
  protected unmountViewFasteners(): void {
    this.unmountCellFasteners();
    super.unmountViewFasteners();
  }
}
