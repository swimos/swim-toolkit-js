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

import {AnyLength, Length, BoxR2} from "@swim/math";
import {Look} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewEdgeInsets, ViewProperty, ViewFastener} from "@swim/view";
import {HtmlView, HtmlViewController} from "@swim/dom";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import {RowView} from "../row/RowView";
import type {TableViewObserver} from "./TableViewObserver";

export class TableView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "rowFasteners", {
      value: [],
      enumerable: true,
    });
    Object.defineProperty(this, "visibleViews", {
      value: [],
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "visibleFrame", {
      value: new BoxR2(0, 0, window.innerWidth, window.innerHeight),
      enumerable: true,
      configurable: true,
    });
    this.initTable();
  }

  protected initTable(): void {
    this.addClass("table");
  }

  declare readonly viewController: HtmlViewController & TableViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<TableViewObserver>;

  @ViewProperty({type: TableLayout, updateFlags: View.NeedsLayout})
  declare layout: ViewProperty<this, TableLayout | undefined, AnyTableLayout | undefined>;

  @ViewProperty({type: Length, state: Length.zero()})
  declare rowSpacing: ViewProperty<this, Length, AnyLength>;

  @ViewProperty({type: Length, state: Length.px(24)})
  declare rowHeight: ViewProperty<this, Length, AnyLength>;

  @ViewProperty({type: Object, inherit: true})
  declare edgeInsets: ViewProperty<this, ViewEdgeInsets | undefined>;

  insertRow(rowView: RowView, targetView: View | null = null): void {
    const rowFasteners = this.rowFasteners as ViewFastener<this, RowView>[];
    let targetIndex = rowFasteners.length;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.view === rowView) {
        return;
      } else if (rowFastener.view === targetView) {
        targetIndex = i;
      }
    }
    const rowFastener = this.createRowFastener(rowView);
    rowFasteners.splice(targetIndex, 0, rowFastener);
    rowFastener.setView(rowView, targetView);
    if (this.isMounted()) {
      rowFastener.mount();
    }
  }

  removeRow(rowView: RowView): void {
    const rowFasteners = this.rowFasteners as ViewFastener<this, RowView>[];
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      if (rowFastener.view === rowView) {
        rowFastener.setView(null);
        if (this.isMounted()) {
          rowFastener.unmount();
        }
        rowFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected initRow(rowView: RowView, rowFastener: ViewFastener<this, RowView>): void {
    rowView.display.setAutoState("none");
    rowView.position.setAutoState("absolute");
    rowView.left.setAutoState(0);
    rowView.top.setAutoState(void 0);
    const layout = this.layout.state;
    rowView.width.setAutoState(layout !== void 0 && layout.width !== null ? layout.width : void 0);
    rowView.height.setAutoState(this.rowHeight.getState());
    rowView.opacity.setAutoState(0);
    rowView.setCulled(true);
  }

  protected willSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                       targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.tableViewWillSetRow !== void 0) {
      viewController.tableViewWillSetRow(newRowView, oldRowView, targetView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tableViewWillSetRow !== void 0) {
        viewObserver.tableViewWillSetRow(newRowView, oldRowView, targetView, this);
      }
    }
  }

  protected onSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                     targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    if (newRowView !== null) {
      this.initRow(newRowView, rowFastener);
    }
  }

  protected didSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                      targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tableViewDidSetRow !== void 0) {
        viewObserver.tableViewDidSetRow(newRowView, oldRowView, targetView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tableViewDidSetRow !== void 0) {
      viewController.tableViewDidSetRow(newRowView, oldRowView, targetView, this);
    }
  }

  /** @hidden */
  static RowFastener = ViewFastener.define<TableView, RowView>({
    type: RowView,
    child: false,
    willSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.willSetRow(newRowView, oldRowView, targetView, this);
    },
    onSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.onSetRow(newRowView, oldRowView, targetView, this);
    },
    didSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.didSetRow(newRowView, oldRowView, targetView, this);
    },
  });

  protected createRowFastener(rowView: RowView): ViewFastener<this, RowView> {
    return new TableView.RowFastener(this, rowView.key, "row");
  }

  /** @hidden */
  declare readonly rowFasteners: ReadonlyArray<ViewFastener<this, RowView>>;

  /** @hidden */
  protected mountRowFasteners(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      rowFastener.mount();
    }
  }

  /** @hidden */
  protected unmountRowFasteners(): void {
    const rowFasteners = this.rowFasteners;
    for (let i = 0, n = rowFasteners.length; i < n; i += 1) {
      const rowFastener = rowFasteners[i]!;
      rowFastener.unmount();
    }
  }

  protected detectRow(view: View): RowView | null {
    return view instanceof RowView ? view : null;
  }

  protected onInsertRow(rowView: RowView, targetView: View | null): void {
    this.insertRow(rowView, targetView);
  }

  protected onRemoveRow(rowView: RowView): void {
    this.removeRow(rowView);
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    const rowView = this.detectRow(childView);
    if (rowView !== null) {
      this.onInsertRow(rowView, targetView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    const rowView = this.detectRow(childView);
    if (rowView !== null) {
      this.onRemoveRow(rowView);
    }
  }

  /** @hidden */
  declare readonly visibleViews: ReadonlyArray<View>;

  /** @hidden */
  declare readonly visibleFrame: BoxR2;

  protected detectVisibleFrame(): BoxR2 {
    const xBleed = 0;
    const yBleed = 64;
    const bounds = this.node.getBoundingClientRect();
    const xMin = -bounds.x - xBleed;
    const yMin = -bounds.y - yBleed;
    const xMax = window.innerWidth - bounds.x + xBleed;
    const yMax = window.innerHeight - bounds.y + yBleed;
    return new BoxR2(xMin, yMin, xMax, yMax);
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsResize) !== 0) {
      processFlags |= View.NeedsScroll;
    }
    return processFlags;
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeTable();
  }

  protected resizeTable(): void {
    const oldLayout = this.layout.state;
    if (oldLayout !== void 0) {
      let width: Length | string | number | undefined = this.width.state;
      width = width instanceof Length ? width.pxValue() : this.node.offsetWidth;
      const edgeInsets = this.edgeInsets.state;
      let paddingLeft: Length | string | number | undefined = this.paddingLeft.state;
      paddingLeft = paddingLeft instanceof Length ? paddingLeft.pxValue(width) : 0;
      let paddingRight: Length | string | number | undefined = this.paddingRight.state;
      paddingRight = paddingRight instanceof Length ? paddingRight.pxValue(width) : 0;
      let left = edgeInsets !== void 0 ? edgeInsets.insetLeft : 0;
      left += paddingLeft;
      let right = edgeInsets !== void 0 ? edgeInsets.insetRight : 0;
      right += paddingRight;
      const newLayout = oldLayout.resized(width, left, right);
      this.layout.setState(newLayout);
    }
  }

  protected processVisibleViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                                processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                   viewContext: ViewContextType<this>) => void): void {
    const visibleViews = this.visibleViews;
    let i = 0;
    while (i < visibleViews.length) {
      const childView = visibleViews[i]!;
      processChildView.call(this, childView, processFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
        continue;
      }
      i += 1;
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if (!this.isCulled()) {
      if ((processFlags & View.NeedsScroll) !== 0) {
        this.scrollChildViews(processFlags, viewContext, processChildView);
      } else {
        this.processVisibleViews(processFlags, viewContext, processChildView);
      }
    }
  }

  protected scrollChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                             processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    const visibleViews = this.visibleViews as View[];
    visibleViews.length = 0;

    const visibleFrame = this.detectVisibleFrame();
    Object.defineProperty(this, "visibleFrame", {
      value: visibleFrame,
      enumerable: true,
      configurable: true,
    });

    type self = this;
    function scrollChildView(this: self, childView: View, processFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      let isVisible: boolean;
      if (childView instanceof HtmlView) {
        const top = childView.top.state;
        const height = childView.height.state;
        if (top instanceof Length && height instanceof Length) {
          const yMin0 = visibleFrame.yMin;
          const yMax0 = visibleFrame.yMax;
          const yMin1 = top.pxValue();
          const yMax1 = yMin1 + height.pxValue();
          isVisible = yMin0 <= yMax1 && yMin1 <= yMax0;
          childView.display.setAutoState(isVisible ? "flex" : "none");
          childView.setCulled(!isVisible);
        } else {
          isVisible = true;
        }
      } else {
        isVisible = true;
      }
      if (isVisible) {
        visibleViews.push(childView);
        processChildView.call(this, childView, processFlags, viewContext);
      }
    }
    super.processChildViews(processFlags, viewContext, scrollChildView);
  }

  protected displayVisibleViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                   viewContext: ViewContextType<this>) => void): void {
    const visibleViews = this.visibleViews;
    let i = 0;
    while (i < visibleViews.length) {
      const childView = visibleViews[i]!;
      displayChildView.call(this, childView, displayFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
        continue;
      }
      i += 1;
    }
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildViews(displayFlags, viewContext, displayChildView);
    } else {
      this.displayVisibleViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    this.resizeTable();
    const layout = this.layout.state;
    let width: Length | undefined;
    if (layout !== void 0 && layout.width !== null) {
      width = layout.width;
    }

    const rowHeight = this.rowHeight.getState();
    const rowSpacing = this.rowSpacing.getState();

    const ySpacing = rowSpacing.pxValue(rowHeight.pxValue());
    let y = ySpacing;

    const visibleViews = this.visibleViews as View[];
    visibleViews.length = 0;

    const visibleFrame = this.detectVisibleFrame();
    Object.defineProperty(this, "visibleFrame", {
      value: visibleFrame,
      enumerable: true,
      configurable: true,
    });

    const timing = this.getLook(Look.timing);

    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (childView instanceof RowView) {
        childView.top.setAutoState(y, timing);
        childView.width.setAutoState(width);
        childView.height.setAutoState(rowHeight, timing);
        childView.opacity.setAutoState(1, timing);
      }
      let isVisible: boolean;
      if (childView instanceof HtmlView) {
        const top = childView.top.state;
        const height = childView.height.state;
        if (top instanceof Length && height instanceof Length) {
          const yMin0 = visibleFrame.yMin;
          const yMax0 = visibleFrame.yMax;
          const yMin1 = top.pxValue();
          const yMax1 = yMin1 + height.pxValue();
          isVisible = yMin0 <= yMax1 && yMin1 <= yMax0;
        } else {
          isVisible = true;
        }
        childView.display.setAutoState(isVisible ? "flex" : "none");
        childView.setCulled(!isVisible);
      } else {
        isVisible = true;
      }
      if (isVisible) {
        visibleViews.push(childView);
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
      if (childView instanceof RowView) {
        let height: Length | string | number | undefined = childView.height.state;
        height = height instanceof Length ? height.pxValue() : childView.node.offsetHeight;
        y += height + ySpacing;
      }
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);

    this.height.setAutoState(y);
  }

  /** @hidden */
  protected mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountRowFasteners();
  }

  /** @hidden */
  protected unmountViewFasteners(): void {
    this.unmountRowFasteners();
    super.unmountViewFasteners();
  }
}
