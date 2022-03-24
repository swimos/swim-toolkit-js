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

import type {Class, ObserverType} from "@swim/util";
import type {MemberFastenerClass} from "@swim/component";
import {PositionGestureInput, ViewRef} from "@swim/view";
import type {Graphics} from "@swim/graphics";
import {Controller, ControllerRef, TraitViewRef} from "@swim/controller";
import {ToolView, ButtonToolView} from "@swim/toolbar";
import {SheetView} from "./SheetView";
import {SheetTraitTitle, SheetTrait} from "./SheetTrait";
import type {SheetControllerObserver} from "./SheetControllerObserver";

/** @public */
export class SheetController extends Controller {
  override readonly observerType?: Class<SheetControllerObserver>;

  @ControllerRef<SheetController, SheetController>({
    type: SheetController,
    binds: false,
    willAttachController(backController: SheetController): void {
      this.owner.callObservers("controllerWillAttachBack", backController, this.owner);
    },
    didDetachController(backController: SheetController): void {
      this.owner.callObservers("controllerDidDetachBack", backController, this.owner);
    },
  })
  readonly back!: ControllerRef<this, SheetController>;
  static readonly back: MemberFastenerClass<SheetController, "back">;

  @ControllerRef<SheetController, SheetController>({
    type: SheetController,
    binds: false,
    willAttachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerWillAttachForward", forwardController, this.owner);
    },
    didDetachController(forwardController: SheetController): void {
      this.owner.callObservers("controllerDidDetachForward", forwardController, this.owner);
    },
  })
  readonly forward!: ControllerRef<this, SheetController>;
  static readonly forward: MemberFastenerClass<SheetController, "forward">;

  @TraitViewRef<SheetController, SheetTrait, SheetView>({
    traitType: SheetTrait,
    observesTrait: true,
    initTrait(sheetTrait: SheetTrait): void {
      this.owner.setTitleToolView(sheetTrait.title.value, sheetTrait);
      this.owner.setIconToolView(sheetTrait.icon.value);
    },
    deinitTrait(sheetTrait: SheetTrait): void {
      this.owner.setIconToolView(null);
      this.owner.setTitleToolView(null, sheetTrait);
    },
    willAttachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("controllerWillAttachSheetTrait", sheetTrait, this.owner);
    },
    didDetachTrait(sheetTrait: SheetTrait): void {
      this.owner.callObservers("controllerDidDetachSheetTrait", sheetTrait, this.owner);
    },
    traitDidSetTitle(title: SheetTraitTitle | null, sheetTrait: SheetTrait): void {
      this.owner.setTitleToolView(title, sheetTrait);
    },
    traitDidSetIcon(icon: Graphics | null): void {
      this.owner.setIconToolView(icon);
    },
    viewType: SheetView,
    observesView: true,
    initView(sheetView: SheetView): void {
      this.owner.titleTool.setView(sheetView.titleTool.view);
      this.owner.iconTool.setView(sheetView.iconTool.view);
      const sheetTrait = this.trait;
      if (sheetTrait !== null) {
        this.owner.setTitleToolView(sheetTrait.title.value, sheetTrait);
        this.owner.setIconToolView(sheetTrait.icon.value);
      }
    },
    deinitView(sheetView: SheetView): void {
      this.owner.iconTool.setView(null);
      this.owner.titleTool.setView(null);
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
    viewWillAttachTitleTool(titleToolView: ToolView): void {
      this.owner.titleTool.setView(titleToolView);
    },
    viewDidDetachTitleTool(titleToolView: ToolView): void {
      this.owner.titleTool.setView(null);
    },
    viewWillAttachIconTool(iconToolView: ToolView): void {
      this.owner.iconTool.setView(iconToolView);
    },
    viewDidDetachIconTool(iconToolView: ToolView): void {
      this.owner.iconTool.setView(null);
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

  protected createTitleToolView(title: SheetTraitTitle, sheetTrait: SheetTrait): ToolView | string | null {
    if (typeof title === "function") {
      return title(sheetTrait);
    } else {
      return title;
    }
  }

  protected setTitleToolView(title: SheetTraitTitle | null, sheetTrait: SheetTrait): void {
    const sheetView = this.sheet.view;
    if (sheetView !== null) {
      const titleToolView = title !== null ? this.createTitleToolView(title, sheetTrait) : null;
      sheetView.titleTool.setView(titleToolView);
    }
  }

  @ViewRef<SheetController, ToolView>({
    type: ToolView,
    willAttachView(titleToolView: ToolView): void {
      this.owner.callObservers("controllerWillAttachTitleToolView", titleToolView, this.owner);
    },
    didDetachView(titleToolView: ToolView): void {
      this.owner.callObservers("controllerDidDetachTitleToolView", titleToolView, this.owner);
    },
  })
  readonly titleTool!: ViewRef<this, ToolView>;
  static readonly titleTool: MemberFastenerClass<SheetController, "titleTool">;

  setIconToolView(icon: Graphics | null): void {
    const sheetView = this.sheet.view;
    if (sheetView !== null) {
      sheetView.iconTool.setView(icon);
    }
  }

  @ViewRef<SheetController, ToolView, ObserverType<ToolView | ButtonToolView>>({
    implements: true,
    type: ToolView,
    observes: true,
    willAttachView(iconToolView: ToolView): void {
      this.owner.callObservers("controllerWillAttachIconToolView", iconToolView, this.owner);
    },
    didDetachView(iconToolView: ToolView): void {
      this.owner.callObservers("controllerDidDetachIconToolView", iconToolView, this.owner);
    },
    viewDidPress(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressIconTool", input, event, this.owner);
    },
    viewDidLongPress(input: PositionGestureInput): void {
      this.owner.callObservers("controllerDidLongPressIconTool", input, this.owner);
    },
  })
  readonly iconTool!: ViewRef<this, ToolView>;
  static readonly iconTool: MemberFastenerClass<SheetController, "iconTool">;
}
