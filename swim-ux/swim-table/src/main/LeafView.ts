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
import type {Timing} from "@swim/util";
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyFocus} from "@swim/style";
import {Focus} from "@swim/style";
import {FocusAnimator} from "@swim/style";
import type {AnyExpansion} from "@swim/style";
import type {Expansion} from "@swim/style";
import {ExpansionAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {Feel} from "@swim/theme";
import {ThemeConstraintAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import {ViewSet} from "@swim/view";
import type {PositionGestureInput} from "@swim/view";
import {PositionGesture} from "@swim/view";
import type {ViewNode} from "@swim/dom";
import type {HtmlViewObserver} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import {ButtonGlow} from "@swim/button";
import type {AnyTableLayout} from "./TableLayout";
import {TableLayout} from "./TableLayout";
import {CellView} from "./CellView";

/** @public */
export interface LeafViewObserver<V extends LeafView = LeafView> extends HtmlViewObserver<V> {
  viewWillAttachCell?(cellView: CellView, targetView: View | null, view: V): void;

  viewDidDetachCell?(cellView: CellView, view: V): void;

  viewWillHighlight?(view: V): void;

  viewDidHighlight?(view: V): void;

  viewWillUnhighlight?(view: V): void;

  viewDidUnhighlight?(view: V): void;

  viewDidEnter?(view: V): void;

  viewDidLeave?(view: V): void;

  viewDidPress?(input: PositionGestureInput, event: Event | null, view: V): void;

  viewDidLongPress?(input: PositionGestureInput, view: V): void;
}

/** @public */
export class LeafView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initLeaf();
  }

  protected initLeaf(): void {
    this.addClass("leaf");
    this.position.setState("relative", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, Affinity.Intrinsic);
    this.modifyMood(Feel.default, [[Feel.transparent, 1], [Feel.hovering, 0]], false);
  }

  override readonly observerType?: Class<LeafViewObserver>;

  @Property({valueType: TableLayout, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly layout!: Property<this, TableLayout | null, AnyTableLayout | null>;

  @Property({valueType: Number, value: 0, inherits: true, updateFlags: View.NeedsLayout})
  readonly depth!: Property<this, number>;

  @ThemeConstraintAnimator({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowSpacing!: ThemeConstraintAnimator<this, Length | null, AnyLength | null>;

  @ThemeConstraintAnimator({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowHeight!: ThemeConstraintAnimator<this, Length | null, AnyLength | null>;

  @ExpansionAnimator({value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly stretch!: ExpansionAnimator<this, Expansion | null, AnyExpansion | null>;

  @Property({valueType: Boolean, value: false, inherits: true})
  readonly hovers!: Property<this, boolean>;

  @FocusAnimator({
    value: Focus.unfocused(),
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    willFocus(): void {
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 0],
                                           [Feel.hovering, 1]], false);
    },
    willUnfocus(): void {
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 1 - this.owner.hover.state.phase],
                                           [Feel.hovering, 0]], false);
    },
  })
  readonly hover!: FocusAnimator<this, Focus, AnyFocus>;

  @FocusAnimator({
    value: Focus.unfocused(),
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    willFocus(): void {
      this.owner.callObservers("viewWillHighlight", this.owner);
      const timing = this.owner.getLook(Look.timing);
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 0]], timing);
      this.owner.backgroundColor.setLook(Look.selectionColor, timing, Affinity.Intrinsic);
    },
    didFocus(): void {
      this.owner.callObservers("viewDidHighlight", this.owner);
    },
    willUnfocus(): void {
      this.owner.callObservers("viewWillUnhighlight", this.owner);
      const timing = this.owner.getLook(Look.timing);
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 1 - this.owner.hover.state.phase]], timing);
      this.owner.backgroundColor.setLook(Look.backgroundColor, timing, Affinity.Intrinsic);
    },
    didUnfocus(): void {
      this.owner.callObservers("viewDidUnhighlight", this.owner);
    },
  })
  readonly highlight!: FocusAnimator<this, Focus, AnyFocus>;

  getCell<F extends Class<CellView>>(key: string, cellViewClass: F): InstanceType<F> | null;
  getCell(key: string): CellView | null;
  getCell(key: string, cellViewClass?: Class<CellView>): CellView | null {
    if (cellViewClass === void 0) {
      cellViewClass = CellView;
    }
    const cellView = this.getChild(key);
    return cellView instanceof cellViewClass ? cellView : null;
  }

  getOrCreateCell<F extends Class<Instance<F, CellView>> & Creatable<Instance<F, CellView>>>(key: string, cellViewClass: F): InstanceType<F> {
    let cellView = this.getChild(key, cellViewClass);
    if (cellView === null) {
      cellView = cellViewClass.create();
      this.setChild(key, cellView);
    }
    return cellView!;
  }

  setCell(key: string, cellView: CellView | null): void {
    this.setChild(key, cellView);
  }

  @ViewSet({
    viewType: CellView,
    binds: true,
    initView(cellView: CellView): void {
      cellView.display.setState("none", Affinity.Intrinsic);
      cellView.position.setState("absolute", Affinity.Intrinsic);
      cellView.left.setState(0, Affinity.Intrinsic);
      cellView.top.setState(0, Affinity.Intrinsic);
      cellView.width.setState(0, Affinity.Intrinsic);
      cellView.height.setState(this.owner.height.state, Affinity.Intrinsic);
    },
    willAttachView(cellView: CellView, target: View | null): void {
      this.owner.callObservers("viewWillAttachCell", cellView, target, this.owner);
    },
    didDetachView(cellView: CellView): void {
      this.owner.callObservers("viewDidDetachCell", cellView, this.owner);
    },
  })
  readonly cells!: ViewSet<this, CellView>;

  protected override onLayout(): void {
    this.rowHeight.recohere(this.updateTime);
    super.onLayout();
    this.layoutLeaf();
  }

  protected layoutLeaf(): void {
    const rowHeight = this.rowHeight.value;
    if (rowHeight !== null) {
      this.height.setState(rowHeight, Affinity.Intrinsic);
    }
  }

  protected override displayChildren(displayFlags: ViewFlags, displayChild: (this: this, child: View, displayFlags: ViewFlags) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildren(displayFlags, displayChild);
    } else {
      super.displayChildren(displayFlags, displayChild);
    }
  }

  protected layoutChildren(displayFlags: ViewFlags, displayChild: (this: this, child: View, displayFlags: ViewFlags) => void): void {
    const layout = this.layout.value;
    const height = this.height.state;
    const stretch = this.stretch.getPhaseOr(1);
    type self = this;
    function layoutChild(this: self, child: View, displayFlags: ViewFlags): void {
      if (child instanceof CellView) {
        const key = child.key;
        const col = layout !== null && key !== void 0 ? layout.getCol(key) : null;
        if (col !== null) {
          child.display.setState(!col.hidden && col.width !== null ? "flex" : "none", Affinity.Intrinsic);
          child.left.setState(col.left, Affinity.Intrinsic);
          child.width.setState(col.width, Affinity.Intrinsic);
          child.height.setState(height, Affinity.Intrinsic);
          const textColor = col.textColor;
          if (textColor instanceof Look) {
            child.color.setLook(textColor, Affinity.Intrinsic);
          } else {
            child.color.setState(textColor, Affinity.Intrinsic);
          }
          if (!col.persistent) {
            child.opacity.setState(stretch, Affinity.Intrinsic);
          }
        } else {
          child.display.setState("none", Affinity.Intrinsic);
          child.left.setState(null, Affinity.Intrinsic);
          child.width.setState(null, Affinity.Intrinsic);
          child.height.setState(null, Affinity.Intrinsic);
        }
      }
      displayChild.call(this, child, displayFlags);
    }
    super.displayChildren(displayFlags, layoutChild);
  }

  @Property({valueType: Boolean, value: true, inherits: true})
  readonly glows!: Property<this, boolean>;

  protected glow(input: PositionGestureInput): void {
    if (input.detail instanceof ButtonGlow) {
      input.detail.fade(input.x, input.y);
      input.detail = void 0;
    }
    if (input.detail === void 0) {
      const delay = input.inputType === "mouse" ? 0 : 100;
      input.detail = this.prependChild(ButtonGlow);
      (input.detail as ButtonGlow).glow(input.x, input.y, void 0, delay);
    }
  }

  @PositionGesture({
    bindsOwner: true,
    didBeginPress(input: PositionGestureInput, event: Event | null): void {
      if (this.owner.glows.value) {
        this.owner.glow(input);
      }
    },
    didMovePress(input: PositionGestureInput, event: Event | null): void {
      if (input.isRunaway()) {
        this.cancelPress(input, event);
      } else if (!this.owner.clientBounds.contains(input.x, input.y)) {
        input.clearHoldTimer();
        this.beginHover(input, event);
        if (input.detail instanceof ButtonGlow) {
          input.detail.fade(input.x, input.y);
          input.detail = void 0;
        }
      }
    },
    didEndPress(input: PositionGestureInput, event: Event | null): void {
      if (!this.owner.clientBounds.contains(input.x, input.y)) {
        this.endHover(input, event);
        if (input.detail instanceof ButtonGlow) {
          input.detail.fade(input.x, input.y);
          input.detail = void 0;
        }
      } else if (input.detail instanceof ButtonGlow) {
        input.detail.pulse(input.x, input.y);
      }
    },
    didCancelPress(input: PositionGestureInput, event: Event | null): void {
      if (!this.owner.clientBounds.contains(input.x, input.y)) {
        this.endHover(input, event);
      }
      if (input.detail instanceof ButtonGlow) {
        input.detail.fade(input.x, input.y);
        input.detail = void 0;
      }
    },
    didStartHovering(): void {
      if (this.owner.hovers.value) {
        this.owner.hover.focus(false);
      }
      this.owner.callObservers("viewDidEnter", this.owner);
    },
    didStopHovering(): void {
      if (this.owner.hovers.value) {
        this.owner.hover.unfocus();
      }
      this.owner.callObservers("viewDidLeave", this.owner);
    },
    didPress(input: PositionGestureInput, event: Event | null): void {
      if (this.owner.clientBounds.contains(input.x, input.y)) {
        if (!input.defaultPrevented) {
          let target = input.target;
          while (target !== null && target !== this.owner.node) {
            const targetView = (target as ViewNode).view;
            if (targetView instanceof CellView) {
              targetView.onPress(input, event);
              targetView.didPress(input, event);
              break;
            }
            target = target instanceof Node ? target.parentNode : null;
          }
        }
        if (!input.defaultPrevented) {
          this.owner.callObservers("viewDidPress", input, event, this.owner);
        }
      }
    },
    didLongPress(input: PositionGestureInput): void {
      if (!input.defaultPrevented) {
        let target = input.target;
        while (target !== null && target !== this.owner.node) {
          const targetView = (target as ViewNode).view;
          if (targetView instanceof CellView) {
            targetView.onLongPress(input);
            targetView.didLongPress(input);
            break;
          }
          target = target instanceof Node ? target.parentNode : null;
        }
      }
      if (!input.defaultPrevented) {
        this.owner.callObservers("viewDidLongPress", input, this.owner);
      }
    },
  })
  readonly gesture!: PositionGesture<this, LeafView>;
}
