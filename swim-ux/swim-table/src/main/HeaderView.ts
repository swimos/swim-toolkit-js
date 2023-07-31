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
import {Affinity} from "@swim/component";
import {Property} from "@swim/component";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyExpansion} from "@swim/style";
import type {Expansion} from "@swim/style";
import {ExpansionAnimator} from "@swim/style";
import {Look} from "@swim/theme";
import {ThemeConstraintAnimator} from "@swim/theme";
import type {ViewFlags} from "@swim/view";
import {View} from "@swim/view";
import {ViewSet} from "@swim/view";
import type {PositionGestureInput} from "@swim/view";
import {PositionGesture} from "@swim/view";
import type {ViewNode} from "@swim/dom";
import type {HtmlViewObserver} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import type {AnyTableLayout} from "./TableLayout";
import {TableLayout} from "./TableLayout";
import {ColView} from "./ColView";

/** @public */
export interface HeaderViewObserver<V extends HeaderView = HeaderView> extends HtmlViewObserver<V> {
  viewWillAttachCol?(colView: ColView, targetView: View | null, view: V): void;

  viewDidDetachCol?(colView: ColView, view: V): void;

  viewDidPress?(input: PositionGestureInput, event: Event | null, view: V): void;

  viewDidLongPress?(input: PositionGestureInput, view: V): void;
}

/** @public */
export class HeaderView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initHeader();
  }

  protected initHeader(): void {
    this.addClass("header");
    this.position.setState("relative", Affinity.Intrinsic);
    this.overflowX.setState("hidden", Affinity.Intrinsic);
    this.overflowY.setState("hidden", Affinity.Intrinsic);
  }

  declare readonly observerType?: Class<HeaderViewObserver>;

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

  getCol<F extends Class<ColView>>(key: string, colViewClass: F): InstanceType<F> | null;
  getCol(key: string): ColView | null;
  getCol(key: string, colViewClass?: Class<ColView>): ColView | null {
    if (colViewClass === void 0) {
      colViewClass = ColView;
    }
    const colView = this.getChild(key);
    return colView instanceof colViewClass ? colView : null;
  }

  getOrCreateCol<F extends Class<Instance<F, ColView>> & Creatable<Instance<F, ColView>>>(key: string, colViewClass: F): InstanceType<F> {
    let colView = this.getChild(key, colViewClass);
    if (colView === null) {
      colView = colViewClass.create();
      this.setChild(key, colView);
    }
    return colView!;
  }

  setCol(key: string, colView: ColView | null): void {
    this.setChild(key, colView);
  }

  @ViewSet({
    viewType: ColView,
    binds: true,
    initView(colView: ColView): void {
      colView.display.setState("none", Affinity.Intrinsic);
      colView.position.setState("absolute", Affinity.Intrinsic);
      colView.left.setState(0, Affinity.Intrinsic);
      colView.top.setState(0, Affinity.Intrinsic);
      colView.width.setState(0, Affinity.Intrinsic);
      colView.height.setState(this.owner.height.state, Affinity.Intrinsic);
    },
    willAttachView(colView: ColView, target: View | null): void {
      this.owner.callObservers("viewWillAttachCol", colView, target, this.owner);
    },
    didDetachView(colView: ColView): void {
      this.owner.callObservers("viewDidDetachCol", colView, this.owner);
    },
  })
  readonly cols!: ViewSet<this, ColView>;

  protected override onLayout(): void {
    super.onLayout();
    this.layoutHeader();
  }

  protected layoutHeader(): void {
    this.rowHeight.recohere(this.updateTime);
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
      if (child instanceof ColView) {
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

  @PositionGesture({
    bindsOwner: true,
    didPress(input: PositionGestureInput, event: Event | null): void {
      if (this.owner.clientBounds.contains(input.x, input.y)) {
        if (!input.defaultPrevented) {
          let target = input.target;
          while (target !== null && target !== this.owner.node) {
            const targetView = (target as ViewNode).view;
            if (targetView instanceof ColView) {
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
          if (targetView instanceof ColView) {
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
  readonly gesture!: PositionGesture<this, HeaderView>;
}
