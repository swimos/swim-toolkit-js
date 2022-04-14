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
import {Affinity, FastenerClass, PropertyDef} from "@swim/component";
import {ViewContextType, ViewFlags, View, ViewSetDef} from "@swim/view";
import {PanelView} from "../panel/PanelView";
import type {FrameViewObserver} from "./FrameViewObserver";

/** @public */
export type FrameStyle = "block" | "stack";

/** @public */
export class FrameView extends PanelView {
  protected override initPanel(): void {
    super.initPanel();
    this.addClass("frame");
    this.marginTop.setState(0, Affinity.Intrinsic);
    this.marginRight.setState(0, Affinity.Intrinsic);
    this.marginBottom.setState(0, Affinity.Intrinsic);
    this.marginLeft.setState(0, Affinity.Intrinsic);
  }

  override readonly observerType?: Class<FrameViewObserver>;

  @PropertyDef<FrameView["frameStyle"]>({
    valueType: String,
    value: "block",
    inherits: true,
    updateFlags: View.NeedsLayout,
    didSetValue(frameStyle: FrameStyle): void {
      this.owner.callObservers("viewDidSetFrameStyle", frameStyle, this.owner);
    },
  })
  readonly frameStyle!: PropertyDef<this, {value: FrameStyle | undefined}>;

  @PropertyDef<FrameView["minBlockWidth"]>({
    valueType: Number,
    value: 720,
    inherits: true,
    updateFlags: View.NeedsLayout,
  })
  readonly minBlockWidth!: PropertyDef<this, {value: number}>;

  @PropertyDef<FrameView["minBlockHeight"]>({
    valueType: Number,
    value: 540,
    inherits: true,
    updateFlags: View.NeedsLayout,
  })
  readonly minBlockHeight!: PropertyDef<this, {value: number}>;

  @PropertyDef({valueType: Number, updateFlags: View.NeedsLayout})
  readonly widthBasis!: PropertyDef<this, {value: number | undefined}>;

  @PropertyDef({valueType: Number, updateFlags: View.NeedsLayout})
  readonly heightBasis!: PropertyDef<this, {value: number | undefined}>;

  @ViewSetDef<FrameView["panes"]>({
    viewType: PanelView,
    binds: true,
    observes: true,
    initView(paneView: PanelView): void {
      paneView.position.setState("absolute", Affinity.Intrinsic);
    },
    willAttachView(paneView: PanelView, target: View | null): void {
      this.owner.callObservers("viewWillAttachPane", paneView, target, this.owner);
    },
    didDetachView(paneView: PanelView): void {
      this.owner.callObservers("viewDidDetachPane", paneView, this.owner);
    },
    viewDidSetUnitWidth(unitWidth: number, paneView: PanelView): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
    viewDidSetUnitHeight(unitHeight: number, paneView: PanelView): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
    viewDidSetMinPanelHeight(minPanelHeight: number, paneView: PanelView): void {
      this.owner.requireUpdate(View.NeedsLayout);
    },
  })
  readonly panes!: ViewSetDef<this, {view: PanelView, observes: true}>;
  static readonly panes: FastenerClass<FrameView["panes"]>;

  protected override onResize(viewContext: ViewContextType<this>): void {
    super.onResize(viewContext);
    this.resizeFrame(viewContext);
  }

  protected resizeFrame(viewContext: ViewContextType<this>): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected override onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    this.layoutFrame(viewContext);
  }

  protected layoutFrame(viewContext: ViewContextType<this>): void {
    if (!this.frameStyle.derived) {
      const widthBasis = this.widthBasis.value;
      const heightBasis = this.heightBasis.value;
      const width = widthBasis !== void 0 ? widthBasis : this.width.pxValue();
      const height = heightBasis !== void 0 ? heightBasis : this.height.pxValue();
      let frameStyle: FrameStyle;
      if (width >= this.minBlockWidth.value && height >= this.minBlockHeight.value) {
        frameStyle = "block";
      } else {
        frameStyle = "stack";
      }
      this.frameStyle.setValue(frameStyle, Affinity.Intrinsic);
    }

    if (this.panes.viewCount === 0) {
      const widthBasis = this.widthBasis.value;
      if (widthBasis !== void 0) {
        this.width.setState(widthBasis, Affinity.Intrinsic);
      }
      const heightBasis = this.heightBasis.value;
      if (heightBasis !== void 0) {
        this.height.setState(heightBasis, Affinity.Intrinsic);
      }
    }
  }

  protected override displayChildren(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                     displayChild: (this: this, child: View, displayFlags: ViewFlags,
                                                    viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0 && this.panes.viewCount !== 0) {
      this.frameStyle.recohere(viewContext.updateTime);
      const frameStyle = this.frameStyle.value;
      if (frameStyle === "block") {
        this.layoutBlockChildren(displayFlags, viewContext, displayChild);
      } else {
        this.layoutStackChildren(displayFlags, viewContext, displayChild);
      }
    } else {
      super.displayChildren(displayFlags, viewContext, displayChild);
    }
  }

  protected layoutBlockChildren(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                displayChild: (this: this, child: View, displayFlags: ViewFlags,
                                               viewContext: ViewContextType<this>) => void): void {
    let x = this.paddingLeft.pxValue();
    let y = this.paddingTop.pxValue();
    const widthBasis = this.widthBasis.value;
    const heightBasis = this.heightBasis.value;
    const width = (widthBasis !== void 0 ? widthBasis : this.width.pxValue()) - x;
    const height = (heightBasis !== void 0 ? heightBasis : this.height.pxValue()) - y;
    const left = x;
    const epsilon = 0.01;
    let rowHeight = 0;
    let rightView: PanelView | null = null;

    type self = this;
    function layoutBlockChild(this: self, child: View, displayFlags: ViewFlags,
                              viewContext: ViewContextType<self>): void {
      if (child instanceof PanelView) {
        if (rightView === null) { // allocate row
          let unitRowWidth = 0;
          let paneView: PanelView | null = child;
          while (paneView !== null) {
            const unitPanelWidth = paneView.unitWidth.value;
            if (rightView === null || unitRowWidth + unitPanelWidth < 1 + epsilon) {
              unitRowWidth += unitPanelWidth;
              rightView = paneView;
              paneView = paneView.getNextSibling(PanelView);
            } else {
              break;
            }
          }
        }

        const panelWidth = child.unitWidth.value * width;
        const panelHeight = Math.max(child.minPanelHeight.value, child.unitHeight.value * height);
        child.left.setState(x, Affinity.Intrinsic);
        child.top.setState(y, Affinity.Intrinsic);
        if (child instanceof FrameView) {
          child.widthBasis.setValue(panelWidth - child.marginLeft.pxValue() - child.marginRight.pxValue(), Affinity.Intrinsic);
          child.heightBasis.setValue(panelHeight - child.marginTop.pxValue() - child.marginBottom.pxValue(), Affinity.Intrinsic);
        } else {
          child.width.setState(panelWidth - child.marginLeft.pxValue() - child.marginRight.pxValue(), Affinity.Intrinsic);
          child.height.setState(panelHeight - child.marginTop.pxValue() - child.marginBottom.pxValue(), Affinity.Intrinsic);
        }
        x += panelWidth;
      }

      displayChild.call(this, child, displayFlags, viewContext);

      if (child instanceof PanelView) {
        rowHeight = Math.max(rowHeight, child.marginTop.pxValue() + child.height.pxValue() + child.marginBottom.pxValue());
        if (child === rightView) { // begin new row
          x = left;
          y += rowHeight;
          rowHeight = 0;
          rightView = null;
        }
      }
    }
    super.displayChildren(displayFlags, viewContext, layoutBlockChild);

    if (widthBasis !== void 0) {
      this.width.setState(width, Affinity.Intrinsic);
    }
    if (heightBasis !== void 0) {
      this.height.setState(y, Affinity.Intrinsic);
    }
  }

  protected layoutStackChildren(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                                displayChild: (this: this, child: View, displayFlags: ViewFlags,
                                               viewContext: ViewContextType<this>) => void): void {
    const x = this.paddingLeft.pxValue();
    let y = this.paddingTop.pxValue();
    const widthBasis = this.widthBasis.value;
    const heightBasis = this.heightBasis.value;
    const width = (widthBasis !== void 0 ? widthBasis : this.width.pxValue()) - x;
    const height = (heightBasis !== void 0 ? heightBasis : this.height.pxValue()) - y;

    type self = this;
    function layoutStackChild(this: self, child: View, displayFlags: ViewFlags,
                              viewContext: ViewContextType<self>): void {
      if (child instanceof PanelView) {
        const panelHeight = Math.max(child.minPanelHeight.value, child.unitHeight.value * height);
        child.left.setState(x, Affinity.Intrinsic);
        child.top.setState(y, Affinity.Intrinsic);
        if (child instanceof FrameView) {
          child.widthBasis.setValue(width - child.marginLeft.pxValue() - child.marginRight.pxValue(), Affinity.Intrinsic);
          child.heightBasis.setValue(panelHeight - child.marginTop.pxValue() - child.marginBottom.pxValue(), Affinity.Intrinsic);
        } else {
          child.width.setState(width - child.marginLeft.pxValue() - child.marginRight.pxValue(), Affinity.Intrinsic);
          child.height.setState(panelHeight - child.marginTop.pxValue() - child.marginBottom.pxValue(), Affinity.Intrinsic);
        }
      }
      displayChild.call(this, child, displayFlags, viewContext);
      if (child instanceof PanelView) {
        y += child.marginTop.pxValue() + child.height.pxValue() + child.marginBottom.pxValue();
      }
    }
    super.displayChildren(displayFlags, viewContext, layoutStackChild);

    if (widthBasis !== void 0) {
      this.width.setState(width, Affinity.Intrinsic);
    }
    if (heightBasis !== void 0) {
      this.height.setState(y + this.paddingBottom.pxValue(), Affinity.Intrinsic);
    }
  }
}
