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

import type {Class, Instance, Creatable} from "@swim/util";
import {Affinity, FastenerClass, PropertyDef, AnimatorDef} from "@swim/component";
import {AnyLength, Length} from "@swim/math";
import {AnyExpansion, Expansion, ExpansionAnimator} from "@swim/style";
import {Look, ThemeConstraintAnimatorDef} from "@swim/theme";
import {ViewContextType, ViewFlags, View, ViewSetDef} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {AnyTableLayout, TableLayout} from "../layout/TableLayout";
import {ColView} from "../col/ColView";
import type {HeaderViewObserver} from "./HeaderViewObserver";

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

  override readonly observerType?: Class<HeaderViewObserver>;

  @PropertyDef({valueType: TableLayout, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly layout!: PropertyDef<this, {value: TableLayout | null, valueInit: AnyTableLayout | null}>;

  @PropertyDef({valueType: Number, value: 0, inherits: true, updateFlags: View.NeedsLayout})
  readonly depth!: PropertyDef<this, {value: number}>;

  @ThemeConstraintAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowSpacing!: ThemeConstraintAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @ThemeConstraintAnimatorDef({valueType: Length, value: null, inherits: true, updateFlags: View.NeedsLayout})
  readonly rowHeight!: ThemeConstraintAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AnimatorDef<HeaderView["stretch"]>({
    extends: ExpansionAnimator,
    value: null,
    inherits: true,
    updateFlags: View.NeedsLayout,
  })
  readonly stretch!: AnimatorDef<this, {
    extends: ExpansionAnimator<HeaderView, Expansion | null, AnyExpansion | null>,
  }>;

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

  @ViewSetDef<HeaderView["cols"]>({
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
  readonly cols!: ViewSetDef<this, {view: ColView}>;
  static readonly cols: FastenerClass<HeaderView["cols"]>;

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutHeader();
  }

  protected layoutHeader(): void {
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
      if (child instanceof ColView) {
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
}
