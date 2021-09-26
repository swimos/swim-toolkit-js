// Copyright 2015-2021 Swim Inc.
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

import type {Mutable} from "@swim/util";
import {AnyLength, Length, R2Box} from "@swim/math";
import {AnyExpansion, Expansion} from "@swim/style";
import {Look, Feel} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewFlags,
  View,
  ViewEdgeInsets,
  ViewProperty,
  ViewAnimator,
  ViewAnimatorConstraint,
  ExpansionViewAnimator,
  ViewFastener,
  PositionGestureInput,
} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import type {LeafView} from "../leaf/LeafView";
import {RowView} from "../row/RowView";
import {HeaderView} from "../header/HeaderView";
import type {TableViewContext} from "./TableViewContext";
import type {TableViewObserver} from "./TableViewObserver";

export class TableView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.rowFasteners = [];
    this.visibleViews = [];
    this.visibleFrame = new R2Box(0, 0, window.innerWidth, window.innerHeight);
    this.initTable();
  }

  protected initTable(): void {
    this.addClass("table");
    this.position.setState("relative", View.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, View.Intrinsic);
  }

  override readonly viewObservers!: ReadonlyArray<TableViewObserver>;

  override readonly viewContext!: TableViewContext;

  @ViewProperty({type: TableLayout, inherit: true, state: null, updateFlags: View.NeedsLayout})
  readonly layout!: ViewProperty<this, TableLayout | null, AnyTableLayout | null>;

  @ViewProperty({type: Object, inherit: true, state: null, updateFlags: View.NeedsLayout})
  readonly edgeInsets!: ViewProperty<this, ViewEdgeInsets | null>;

  protected didSetDepth(newDepth: number, oldDepth: number): void {
    this.modifyTheme(Feel.default, [[Feel.nested, newDepth !== 0 ? 1 : void 0]], false);
  }

  @ViewProperty<TableView, number>({
    type: Number,
    inherit: true,
    state: 0,
    updateFlags: View.NeedsLayout,
    didSetState(newDepth: number, oldDepth: number): void {
      this.owner.didSetDepth(newDepth, oldDepth);
    },
  })
  readonly depth!: ViewProperty<this, number>;

  @ViewAnimatorConstraint({type: Length, inherit: true, state: Length.zero(), updateFlags: View.NeedsLayout})
  readonly rowSpacing!: ViewAnimatorConstraint<this, Length, AnyLength>;

  @ViewAnimatorConstraint({type: Length, inherit: true, state: Length.px(24), updateFlags: View.NeedsLayout})
  readonly rowHeight!: ViewAnimatorConstraint<this, Length, AnyLength>;

  @ViewProperty({type: Boolean, inherit: true, state: false})
  readonly hovers!: ViewProperty<this, boolean>;

  @ViewProperty({type: Boolean, inherit: true, state: true})
  readonly glows!: ViewProperty<this, boolean>;

  @ViewAnimator({type: Expansion, inherit: true, state: null})
  readonly disclosure!: ExpansionViewAnimator<this, Expansion | null, AnyExpansion | null>;

  @ViewAnimator({type: Expansion, inherit: true, state: null})
  readonly disclosing!: ExpansionViewAnimator<this, Expansion | null, AnyExpansion | null>;

  @ViewAnimator({type: Expansion, inherit: true, state: null, updateFlags: View.NeedsLayout})
  readonly stretch!: ExpansionViewAnimator<this, Expansion | null, AnyExpansion | null>;

  protected createHeader(): HeaderView | null {
    return HeaderView.create();
  }

  protected initHeader(headerView: HeaderView): void {
    headerView.display.setState("none", View.Intrinsic);
    headerView.position.setState("absolute", View.Intrinsic);
    headerView.left.setState(0, View.Intrinsic);
    headerView.top.setState(null, View.Intrinsic);
    const layout = this.layout.state;
    headerView.width.setState(layout !== null ? layout.width : null, View.Intrinsic);
    headerView.setCulled(true);
  }

  protected attachHeader(headerView: HeaderView): void {
    // hook
  }

  protected detachHeader(headerView: HeaderView): void {
    // hook
  }

  protected willSetHeader(newHeaderView: HeaderView | null, oldHeaderView: HeaderView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetHeader !== void 0) {
        viewObserver.viewWillSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
  }

  protected onSetHeader(newHeaderView: HeaderView | null, oldHeaderView: HeaderView | null): void {
    if (oldHeaderView !== null) {
      this.detachHeader(oldHeaderView);
    }
    if (newHeaderView !== null) {
      this.attachHeader(newHeaderView);
      this.initHeader(newHeaderView);
    }
  }

  protected didSetHeader(newHeaderView: HeaderView | null, oldHeaderView: HeaderView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetHeader !== void 0) {
        viewObserver.viewDidSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
  }

  @ViewFastener<TableView, HeaderView>({
    key: true,
    type: HeaderView,
    child: true,
    willSetView(newTreeView: HeaderView | null, oldTreeView: HeaderView | null): void {
      this.owner.willSetHeader(newTreeView, oldTreeView);
    },
    onSetView(newTreeView: HeaderView | null, oldTreeView: HeaderView | null): void {
      this.owner.onSetHeader(newTreeView, oldTreeView);
    },
    didSetView(newTreeView: HeaderView | null, oldTreeView: HeaderView | null): void {
      this.owner.didSetHeader(newTreeView, oldTreeView);
    },
    createView(): HeaderView | null {
      return this.owner.createHeader();
    },
    insertView(parentView: View, childView: HeaderView, targetView: View | null, key: string | undefined): void {
      parentView.prependChildView(childView, key);
    }
  })
  readonly header!: ViewFastener<this, HeaderView>;

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
    rowView.display.setState("none", View.Intrinsic);
    rowView.position.setState("absolute", View.Intrinsic);
    rowView.left.setState(0, View.Intrinsic);
    rowView.top.setState(null, View.Intrinsic);
    const layout = this.layout.state;
    rowView.width.setState(layout !== null ? layout.width : null, View.Intrinsic);
    rowView.setCulled(true);
  }

  protected attachRow(rowView: RowView, rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected detachRow(rowView: RowView, rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected willSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                       targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetRow !== void 0) {
        viewObserver.viewWillSetRow(newRowView, oldRowView, targetView, this);
      }
    }
  }

  protected onSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                     targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    if (oldRowView !== null) {
      this.detachRow(oldRowView, rowFastener);
    }
    if (newRowView !== null) {
      this.attachRow(newRowView, rowFastener);
      this.initRow(newRowView, rowFastener);
    }
  }

  protected didSetRow(newRowView: RowView | null, oldRowView: RowView | null,
                      targetView: View | null, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetRow !== void 0) {
        viewObserver.viewDidSetRow(newRowView, oldRowView, targetView, this);
      }
    }
  }

  protected willSetLeaf(newLeafView: LeafView | null, oldLeafView: LeafView | null,
                        rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetLeaf !== void 0) {
        viewObserver.viewWillSetLeaf(newLeafView, oldLeafView, rowFastener);
      }
    }
  }

  protected onSetLeaf(newLeafView: LeafView | null, oldLeafView: LeafView | null,
                      rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didSetLeaf(newLeafView: LeafView | null, oldLeafView: LeafView | null,
                       rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetLeaf !== void 0) {
        viewObserver.viewDidSetLeaf(newLeafView, oldLeafView, rowFastener);
      }
    }
  }

  protected willHighlightLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillHighlightLeaf !== void 0) {
        viewObserver.viewWillHighlightLeaf(leafView, rowFastener);
      }
    }
  }

  protected didHighlightLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidHighlightLeaf !== void 0) {
        viewObserver.viewDidHighlightLeaf(leafView, rowFastener);
      }
    }
  }

  protected willUnhighlightLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillUnhighlightLeaf !== void 0) {
        viewObserver.viewWillUnhighlightLeaf(leafView, rowFastener);
      }
    }
  }

  protected didUnhighlightLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidUnhighlightLeaf !== void 0) {
        viewObserver.viewDidUnhighlightLeaf(leafView, rowFastener);
      }
    }
  }

  protected onEnterLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didEnterLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidEnterLeaf !== void 0) {
        viewObserver.viewDidEnterLeaf(leafView, rowFastener);
      }
    }
  }

  protected onLeaveLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didLeaveLeaf(leafView: LeafView, rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidLeaveLeaf !== void 0) {
        viewObserver.viewDidLeaveLeaf(leafView, rowFastener);
      }
    }
  }

  protected onPressLeaf(input: PositionGestureInput, event: Event | null, leafView: LeafView,
                        rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didPressLeaf(input: PositionGestureInput, event: Event | null, leafView: LeafView,
                         rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidPressLeaf !== void 0) {
        viewObserver.viewDidPressLeaf(input, event, leafView, rowFastener);
      }
    }
  }

  protected onLongPressLeaf(input: PositionGestureInput, leafView: LeafView,
                            rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didLongPressLeaf(input: PositionGestureInput, leafView: LeafView,
                             rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidLongPressLeaf !== void 0) {
        viewObserver.viewDidLongPressLeaf(input, leafView, rowFastener);
      }
    }
  }

  protected willSetTree(newTreeView: TableView | null, oldTreeView: TableView | null,
                        rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetTree !== void 0) {
        viewObserver.viewWillSetTree(newTreeView, oldTreeView, rowFastener);
      }
    }
  }

  protected onSetTree(newTreeView: TableView | null, oldTreeView: TableView | null,
                      rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didSetTree(newTreeView: TableView | null, oldTreeView: TableView | null,
                       rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetTree !== void 0) {
        viewObserver.viewDidSetTree(newTreeView, oldTreeView, rowFastener);
      }
    }
  }

  protected willExpandRow(rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillExpandRow !== void 0) {
        viewObserver.viewWillExpandRow(rowFastener);
      }
    }
  }

  protected onExpandRow(rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didExpandRow(rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidExpandRow !== void 0) {
        viewObserver.viewDidExpandRow(rowFastener);
      }
    }
  }

  protected willCollapseRow(rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillCollapseRow !== void 0) {
        viewObserver.viewWillCollapseRow(rowFastener);
      }
    }
  }

  protected onCollapseRow(rowFastener: ViewFastener<this, RowView>): void {
    // hook
  }

  protected didCollapseRow(rowFastener: ViewFastener<this, RowView>): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidCollapseRow !== void 0) {
        viewObserver.viewDidCollapseRow(rowFastener);
      }
    }
  }

  /** @hidden */
  static RowFastener = ViewFastener.define<TableView, RowView>({
    type: RowView,
    child: false,
    observe: true,
    willSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.willSetRow(newRowView, oldRowView, targetView, this);
    },
    onSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.onSetRow(newRowView, oldRowView, targetView, this);
    },
    didSetView(newRowView: RowView | null, oldRowView: RowView | null, targetView: View | null): void {
      this.owner.didSetRow(newRowView, oldRowView, targetView, this);
    },
    viewWillSetLeaf(newLeafView: LeafView | null, oldLeafView: LeafView | null): void {
      this.owner.willSetLeaf(newLeafView, oldLeafView, this);
    },
    viewDidSetLeaf(newLeafView: LeafView | null, oldLeafView: LeafView | null): void {
      this.owner.onSetLeaf(newLeafView, oldLeafView, this);
      this.owner.didSetLeaf(newLeafView, oldLeafView, this);
    },
    viewDidEnterLeaf(leafView: LeafView): void {
      this.owner.onEnterLeaf(leafView, this);
      this.owner.didEnterLeaf(leafView, this);
    },
    viewDidLeaveLeaf(leafView: LeafView): void {
      this.owner.onLeaveLeaf(leafView, this);
      this.owner.didLeaveLeaf(leafView, this);
    },
    viewDidPressLeaf(input: PositionGestureInput, event: Event | null, leafView: LeafView): void {
      this.owner.onPressLeaf(input, event, leafView, this);
      this.owner.didPressLeaf(input, event, leafView, this);
    },
    viewDidLongPressLeaf(input: PositionGestureInput, leafView: LeafView): void {
      this.owner.onLongPressLeaf(input, leafView, this);
      this.owner.didLongPressLeaf(input, leafView, this);
    },
    viewWillSetTree(newTreeView: TableView | null, oldTreeView: TableView | null): void {
      this.owner.willSetTree(newTreeView, oldTreeView, this);
    },
    viewDidSetTree(newTreeView: TableView | null, oldTreeView: TableView | null): void {
      this.owner.didSetTree(newTreeView, oldTreeView, this);
    },
    viewWillExpand(): void {
      this.owner.willExpandRow(this);
      this.owner.onExpandRow(this);
    },
    viewDidExpand(): void {
      this.owner.didExpandRow(this);
    },
    viewWillCollapse(): void {
      this.owner.willCollapseRow(this);
    },
    viewDidCollapse(): void {
      this.owner.onCollapseRow(this);
      this.owner.didCollapseRow(this);
    },
  });

  protected createRowFastener(rowView: RowView): ViewFastener<this, RowView> {
    return new TableView.RowFastener(this, rowView.key, "row");
  }

  /** @hidden */
  readonly rowFasteners: ReadonlyArray<ViewFastener<this, RowView>>;

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

  protected override onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    const rowView = this.detectRow(childView);
    if (rowView !== null) {
      this.insertRow(rowView, targetView);
    }
  }

  protected override onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    const rowView = this.detectRow(childView);
    if (rowView !== null) {
      this.removeRow(rowView);
    }
  }

  /** @hidden */
  readonly visibleViews: ReadonlyArray<View>;

  /** @hidden */
  readonly visibleFrame: R2Box;

  protected detectVisibleFrame(viewContext: ViewContext): R2Box {
    const xBleed = 0;
    const yBleed = this.rowHeight.getValueOr(Length.zero()).pxValue();
    const parentVisibleFrame = (viewContext as TableViewContext).visibleFrame as R2Box | undefined;
    if (parentVisibleFrame !== void 0) {
      let left: Length | number | null = this.left.state;
      left = left instanceof Length ? left.pxValue() : 0;
      let top: Length | number | null = this.top.state;
      top = top instanceof Length ? top.pxValue() : 0;
      return new R2Box(parentVisibleFrame.xMin - left - xBleed, parentVisibleFrame.yMin - top - yBleed,
                       parentVisibleFrame.xMax - left + xBleed, parentVisibleFrame.yMax - top + yBleed);
    } else {
      const bounds = this.node.getBoundingClientRect();
      const xMin = -bounds.x - xBleed;
      const yMin = -bounds.y - yBleed;
      const xMax = window.innerWidth - bounds.x + xBleed;
      const yMax = window.innerHeight - bounds.y + yBleed;
      return new R2Box(xMin, yMin, xMax, yMax);
    }
  }

  override extendViewContext(viewContext: ViewContext): ViewContextType<this> {
    const treeViewContext = Object.create(viewContext);
    treeViewContext.visibleFrame = this.visibleFrame;
    return treeViewContext;
  }

  override needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((processFlags & View.NeedsResize) !== 0) {
      processFlags |= View.NeedsScroll;
    }
    return processFlags;
  }

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeTable();
  }

  protected resizeTable(): void {
    const oldLayout = !this.layout.isInherited() ? this.layout.state : null;
    if (oldLayout !== null) {
      const superLayout = this.layout.superState;
      let width: Length | number | null = null;
      if (superLayout !== void 0 && superLayout !== null && superLayout.width !== null) {
        width = superLayout.width.pxValue();
      }
      if (width === null) {
        width = this.width.state;
        width = width instanceof Length ? width.pxValue() : this.node.offsetWidth;
      }
      const edgeInsets = this.edgeInsets.state;
      let paddingLeft: Length | number | null = this.paddingLeft.state;
      paddingLeft = paddingLeft instanceof Length ? paddingLeft.pxValue(width) : 0;
      let paddingRight: Length | number | null = this.paddingRight.state;
      paddingRight = paddingRight instanceof Length ? paddingRight.pxValue(width) : 0;
      let left = edgeInsets !== null ? edgeInsets.insetLeft : 0;
      left += paddingLeft;
      let right = edgeInsets !== null ? edgeInsets.insetRight : 0;
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

  protected override processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
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

    const visibleFrame = this.detectVisibleFrame(Object.getPrototypeOf(viewContext));
    (viewContext as Mutable<ViewContextType<this>>).visibleFrame = visibleFrame;
    (this as Mutable<this>).visibleFrame = visibleFrame;

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
          childView.display.setState(isVisible ? "flex" : "none", View.Intrinsic);
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

  protected override displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
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
    const width = layout !== null ? layout.width : null;
    const rowHeight = this.rowHeight.getValue();
    const rowSpacing = this.rowSpacing.getValue().pxValue(rowHeight.pxValue());
    const disclosingPhase = this.disclosing.getPhaseOr(1);

    const visibleViews = this.visibleViews as View[];
    visibleViews.length = 0;

    const visibleFrame = this.detectVisibleFrame(Object.getPrototypeOf(viewContext));
    (viewContext as Mutable<ViewContextType<this>>).visibleFrame = visibleFrame;
    (this as Mutable<this>).visibleFrame = visibleFrame;

    let yValue = 0;
    let yState = 0;
    let rowIndex = 0;

    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (childView instanceof RowView || childView instanceof HeaderView) {
        if (rowIndex !== 0) {
          yValue += rowSpacing * disclosingPhase;
          yState += rowSpacing;
        }
        if (childView.top.takesPrecedence(View.Intrinsic)) {
          childView.top.setIntermediateValue(Length.px(yValue), Length.px(yState));
        }
        childView.width.setState(width, View.Intrinsic);
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
        childView.display.setState(isVisible ? "flex" : "none", View.Intrinsic);
        childView.setCulled(!isVisible);
      } else {
        isVisible = true;
      }
      if (isVisible) {
        visibleViews.push(childView);
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
      if (childView instanceof RowView || childView instanceof HeaderView) {
        let heightValue: Length | number | null = childView.height.value;
        heightValue = heightValue instanceof Length ? heightValue.pxValue() : childView.node.offsetHeight;
        let heightState: Length | number | null = childView.height.state;
        heightState = heightState instanceof Length ? heightState.pxValue() : heightValue;
        yValue += heightValue * disclosingPhase;
        yState += heightState;
        rowIndex += 1;
      }
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);

    if (this.height.takesPrecedence(View.Intrinsic)) {
      this.height.setIntermediateValue(Length.px(yValue), Length.px(yState));
    }

    const disclosurePhase = this.disclosure.getPhaseOr(1);
    this.opacity.setState(disclosurePhase, View.Intrinsic);
  }

  /** @hidden */
  protected override mountViewFasteners(): void {
    super.mountViewFasteners();
    this.mountRowFasteners();
  }

  /** @hidden */
  protected override unmountViewFasteners(): void {
    this.unmountRowFasteners();
    super.unmountViewFasteners();
  }
}
