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

import type {Class, Observes} from "@swim/util";
import {Affinity, FastenerClass} from "@swim/component";
import {ViewContextType, ViewFlags, View, ViewSet} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {SheetView} from "@swim/sheet";
import {PanelView} from "../panel/PanelView";
import {FrameView} from "../frame/FrameView";
import type {BoardViewObserver} from "./BoardViewObserver";

/** @public */
export class BoardView extends SheetView {
  protected override initSheet(): void {
    super.initSheet();
    this.addClass("board");
  }

  override readonly observerType?: Class<BoardViewObserver>;

  @ViewSet<BoardView["panels"]>({
    viewType: PanelView,
    binds: true,
    observes: true,
    initView(panelView: PanelView): void {
      panelView.position.setState("absolute", Affinity.Intrinsic);
      panelView.visibility.setState("hidden", Affinity.Intrinsic);
    },
    willAttachView(panelView: PanelView, target: View | null): void {
      this.owner.callObservers("viewWillAttachPanel", panelView, target, this.owner);
    },
    didDetachView(panelView: PanelView): void {
      this.owner.callObservers("viewDidDetachPanel", panelView, this.owner);
    },
    viewDidSetUnitWidth(unitWidth: number, panelView: PanelView): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
    viewDidSetUnitHeight(unitHeight: number, panelView: PanelView): void {
      this.owner.requireUpdate(View.NeedsResize);
    },
  })
  readonly panels!: ViewSet<this, PanelView> & Observes<PanelView>;
  static readonly panels: FastenerClass<BoardView["panels"]>;

  protected override processChildren(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                                     processChild: (this: this, child: View, processFlags: ViewFlags,
                                                    viewContext: ViewContextType<this>) => void): void {
    if ((processFlags & View.NeedsResize) !== 0) {
      this.resizeChildren(processFlags, viewContext, processChild);
    } else {
      super.processChildren(processFlags, viewContext, processChild);
    }
  }

  protected resizeChildren(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                           processChild: (this: this, child: View, processFlags: ViewFlags,
                                          viewContext: ViewContextType<this>) => void): void {
    const x = this.paddingLeft.pxValue();
    let y = this.paddingTop.pxValue();
    const width = this.width.pxValue() - this.marginLeft.pxValue() - x - this.paddingRight.pxValue() - this.marginRight.pxValue();
    const height = this.height.pxValue() - y - this.paddingBottom.pxValue();
    type self = this;
    function resizeChild(this: self, child: View, processFlags: ViewFlags,
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
      if (child instanceof HtmlView) {
        child.paddingBottom.setState(child.nextSibling === null ? this.paddingBottom.value : null, Affinity.Transient);
      }
      processChild.call(this, child, processFlags, viewContext);
      if (child instanceof PanelView) {
        child.visibility.setState(void 0, Affinity.Intrinsic);
        y += child.marginTop.pxValue() + child.height.pxValue() + child.marginBottom.pxValue();
      }
    }
    super.processChildren(processFlags, viewContext, resizeChild);
  }
}
