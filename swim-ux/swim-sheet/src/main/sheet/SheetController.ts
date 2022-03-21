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
import type {MemberFastenerClass} from "@swim/component";
import {ViewRef} from "@swim/view";
import {Controller, TraitViewRef} from "@swim/controller";
import {ToolView} from "@swim/toolbar";
import {SheetView} from "./SheetView";
import {SheetTraitTitle, SheetTrait} from "./SheetTrait";
import type {SheetControllerObserver} from "./SheetControllerObserver";

/** @public */
export class SheetController extends Controller {
  override readonly observerType?: Class<SheetControllerObserver>;

  @TraitViewRef<SheetController, SheetTrait, SheetView>({
    traitType: SheetTrait,
    observesTrait: true,
    initTrait(sheetTrait: SheetTrait): void {
      this.owner.setTitleView(sheetTrait.title.value, sheetTrait);
    },
    deinitTrait(sheetTrait: SheetTrait): void {
      this.owner.setTitleView(null, sheetTrait);
    },
    willAttachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("controllerWillAttachSheetTrait", sheetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("controllerDidDetachSheetTrait", sheetTrait, this.owner);
    },
    traitDidSetTitle(newTitle: SheetTraitTitle | null, oldTitle: SheetTraitTitle | null, sheetTrait: SheetTrait): void {
      this.owner.setTitleView(newTitle, sheetTrait);
    },
    viewType: SheetView,
    observesView: true,
    initView(sheetView: SheetView): void {
      this.owner.title.setView(sheetView.sheetTitle.view);
      const sheetTrait = this.trait;
      if (sheetTrait !== null) {
        this.owner.setTitleView(sheetTrait.title.value, sheetTrait);
      }
    },
    deinitView(sheetView: SheetView): void {
      this.owner.title.setView(null);
    },
    willAttachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillAttachSheetView", sheetView, this.owner);
    },
    didDetachView(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidDetachSheetView", sheetView, this.owner);
    },
    viewWillAttachBack(backView: SheetView): void {
      this.owner.callObservers("controllerWillAttachBackView", backView, this.owner);
    },
    viewDidDetachBack(backView: SheetView): void {
      this.owner.callObservers("controllerDidDetachBackView", backView, this.owner);
    },
    viewWillAttachForward(forwardView: SheetView): void {
      this.owner.callObservers("controllerWillAttachForwardView", forwardView, this.owner);
    },
    viewDidDetachForward(forwardView: SheetView): void {
      this.owner.callObservers("controllerDidDetachForwardView", forwardView, this.owner);
    },
    viewWillAttachTitle(titleView: ToolView): void {
      this.owner.title.setView(titleView);
    },
    viewDidDetachTitle(titleView: ToolView): void {
      this.owner.title.setView(null);
    },
    viewWillPresent(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillPresentSheetView", sheetView, this.owner);
    },
    viewDidPresent(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidPresentSheetView", sheetView, this.owner);
    },
    viewWillDismiss(sheetView: SheetView): void {
      this.owner.callObservers("controllerWillDismissSheetView", sheetView, this.owner);
    },
    viewDidDismiss(sheetView: SheetView): void {
      this.owner.callObservers("controllerDidDismissSheetView", sheetView, this.owner);
    },
  })
  readonly sheet!: TraitViewRef<this, SheetTrait, SheetView>;
  static readonly sheet: MemberFastenerClass<SheetController, "sheet">;

  protected createTitleView(title: SheetTraitTitle, sheetTrait: SheetTrait): ToolView | string | null {
    if (typeof title === "function") {
      return title(sheetTrait);
    } else {
      return title;
    }
  }

  protected setTitleView(title: SheetTraitTitle | null, sheetTrait: SheetTrait): void {
    const sheetView = this.sheet.view;
    if (sheetView !== null) {
      const titleView = title !== null ? this.createTitleView(title, sheetTrait) : null;
      sheetView.sheetTitle.setView(titleView);
    }
  }

  @ViewRef<SheetController, ToolView>({
    type: ToolView,
    willAttachView(titleView: ToolView): void {
      this.owner.callObservers("controllerWillAttachSheetTitleView", titleView, this.owner);
    },
    didDetachView(titleView: ToolView): void {
      this.owner.callObservers("controllerDidDetachSheetTitleView", titleView, this.owner);
    },
  })
  readonly title!: ViewRef<this, ToolView>;
  static readonly title: MemberFastenerClass<SheetController, "title">;
}
