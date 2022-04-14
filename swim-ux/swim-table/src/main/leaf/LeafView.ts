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

import type {Class, Instance, Creatable, Timing} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef, AnimatorDef} from "@swim/component";
import {AnyLength, Length} from "@swim/math";
import {
  AnyFocus,
  Focus,
  FocusAnimator,
  AnyExpansion,
  Expansion,
  ExpansionAnimator,
} from "@swim/style";
import {Look, Feel, ThemeConstraintAnimatorDef} from "@swim/theme";
import {
  PositionGestureInput,
  PositionGestureDef,
  ViewContextType,
  ViewFlags,
  View,
  ViewSetDef,
} from "@swim/view";
import {ViewNode, HtmlView} from "@swim/dom";
import {ButtonGlow} from "@swim/button";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import {CellView} from "../cell/CellView";
import type {LeafViewObserver} from "./LeafViewObserver";

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

    const highlightPhase = this.highlight.getPhase();
    const hoverPhase = this.hover.getPhase();
    const backgroundPhase = Math.max(highlightPhase, hoverPhase);
    this.modifyMood(Feel.default, [[Feel.transparent, 1 - backgroundPhase],
                                   [Feel.hovering, hoverPhase * (1 - highlightPhase)],
                                   [Feel.selected, highlightPhase]], false);
  }

  override readonly observerType?: Class<LeafViewObserver>;

  @PropertyDef({valueType: TableLayout, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly layout!: PropertyDef<this, {value: TableLayout | null, valueInit: AnyTableLayout | null}>;

  @PropertyDef({valueType: Number, value: 0, inherits: true, updateFlags: View.NeedsLayout})
  readonly depth!: PropertyDef<this, {value: number}>;

  @ThemeConstraintAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowSpacing!: ThemeConstraintAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeConstraintAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowHeight!: ThemeConstraintAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AnimatorDef<LeafView["stretch"]>({
    extends: ExpansionAnimator,
    value: null,
    inherits: true,
    updateFlags: View.NeedsLayout,
  })
  readonly stretch!: AnimatorDef<this, {
    extends: ExpansionAnimator<LeafView, Expansion | null, AnyExpansion | null>,
  }>;

  @PropertyDef({valueType: Boolean, value: false, inherits: true})
  readonly hovers!: PropertyDef<this, {value: boolean}>;

  @AnimatorDef<LeafView["hover"]>({
    extends: FocusAnimator,
    value: Focus.unfocused(),
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    didSetValue(newHover: Focus, oldHover: Focus): void {
      const highlightPhase = this.owner.highlight.getPhase();
      const hoverPhase = newHover.phase;
      const backgroundPhase = Math.max(highlightPhase, hoverPhase);
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 1 - backgroundPhase],
                                           [Feel.hovering, hoverPhase * (1 - highlightPhase)],
                                           [Feel.selected, highlightPhase]], false);
    },
  })
  readonly hover!: AnimatorDef<this, {
    extends: FocusAnimator<LeafView, Focus, AnyFocus>,
  }>;

  @AnimatorDef<LeafView["highlight"]>({
    extends: FocusAnimator,
    value: Focus.unfocused(),
    get transition(): Timing | null {
      return this.owner.getLookOr(Look.timing, null);
    },
    willFocus(): void {
      this.owner.callObservers("viewWillHighlight", this.owner);
    },
    didFocus(): void {
      this.owner.callObservers("viewDidHighlight", this.owner);
    },
    willUnfocus(): void {
      this.owner.callObservers("viewWillUnhighlight", this.owner);
    },
    didUnfocus(): void {
      this.owner.callObservers("viewDidUnhighlight", this.owner);
    },
    didSetValue(newHighlight: Focus, oldHighlight: Focus): void {
      const highlightPhase = newHighlight.phase;
      const hoverPhase = this.owner.hover.getPhase();
      const backgroundPhase = Math.max(highlightPhase, hoverPhase);
      this.owner.modifyMood(Feel.default, [[Feel.transparent, 1 - backgroundPhase],
                                           [Feel.hovering, hoverPhase * (1 - highlightPhase)],
                                           [Feel.selected, highlightPhase]], false);
    },
  })
  readonly highlight!: AnimatorDef<this, {
    extends: FocusAnimator<LeafView, Focus, AnyFocus>,
  }>;

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

  @ViewSetDef<LeafView["cells"]>({
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
  readonly cells!: ViewSetDef<this, {view: CellView}>;
  static readonly cells: FastenerClass<LeafView["cells"]>;

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutLeaf();
  }

  protected layoutLeaf(): void {
    const rowHeight = this.rowHeight.value;
    if (rowHeight !== null) {
      this.height.setState(rowHeight, Affinity.Intrinsic);
    }
  }

  protected override displayChildren(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                     displayChild: (this: this, child: View, displayFlags: ViewFlags,
                                                    viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildren(displayFlags, viewContext, displayChild);
    } else {
      super.displayChildren(displayFlags, viewContext, displayChild);
    }
  }

  protected layoutChildren(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                           displayChild: (this: this, child: View, displayFlags: ViewFlags,
                                          viewContext: ViewContextType<this>) => void): void {
    const layout = this.layout.value;
    const height = this.height.state;
    const stretch = this.stretch.getPhaseOr(1);
    type self = this;
    function layoutChild(this: self, child: View, displayFlags: ViewFlags,
                         viewContext: ViewContextType<self>): void {
      if (child instanceof CellView) {
        const key = child.key;
        const col = layout !== null && key !== void 0 ? layout.getCol(key) : null;
        if (col !== null) {
          child.display.setState(!col.hidden ? "flex" : "none", Affinity.Intrinsic);
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
      displayChild.call(this, child, displayFlags, viewContext);
    }
    super.displayChildren(displayFlags, viewContext, layoutChild);
  }

  @PropertyDef({valueType: Boolean, value: true, inherits: true})
  readonly glows!: PropertyDef<this, {value: boolean}>;

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

  @PositionGestureDef<LeafView["gesture"]>({
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
  readonly gesture!: PositionGestureDef<this, {view: LeafView}>;
  static readonly gesture: FastenerClass<LeafView["gesture"]>;
}
