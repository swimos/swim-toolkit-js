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
import type {FastenerClass} from "@swim/component";
import type {PositionGestureInput} from "@swim/view";
import type {Graphics} from "@swim/graphics";
import {TraitViewRefDef} from "@swim/controller";
import {ToolController} from "./ToolController";
import {ButtonToolView} from "./ButtonToolView";
import {ButtonToolTrait} from "./ButtonToolTrait";
import type {ButtonToolControllerObserver} from "./ButtonToolControllerObserver";

/** @public */
export class ButtonToolController extends ToolController {
  override readonly observerType?: Class<ButtonToolControllerObserver>;

  protected setIcon(icon: Graphics | null): void {
    const toolView = this.tool.view;
    if (toolView !== null) {
      toolView.graphics.setState(icon);
    }
  }

  @TraitViewRefDef<ButtonToolController["tool"]>({
    extends: true,
    traitType: ButtonToolTrait,
    observesTrait: true,
    initTrait(toolTrait: ButtonToolTrait): void {
      this.owner.setIcon(toolTrait.icon.value);
    },
    deinitTrait(toolTrait: ButtonToolTrait): void {
      this.owner.setIcon(null);
    },
    traitDidSetIcon(toolIcon: Graphics | null): void {
      this.owner.setIcon(toolIcon);
    },
    viewType: ButtonToolView,
    observesView: true,
    initView(toolView: ButtonToolView): void {
      const toolTrait = this.trait;
      if (toolTrait !== null) {
        this.owner.setIcon(toolTrait.icon.value);
      }
    },
    viewDidSetGraphics(toolIcon: Graphics | null): void {
      this.owner.callObservers("controllerDidSetToolIcon", toolIcon, this.owner);
    },
    viewDidPress(input: PositionGestureInput, event: Event | null): void {
      this.owner.callObservers("controllerDidPressToolView", input, event, this.owner);
    },
    viewDidLongPress(input: PositionGestureInput): void {
      this.owner.callObservers("controllerDidLongPressToolView", input, this.owner);
    },
  })
  override readonly tool!: TraitViewRefDef<this, {
    extends: ToolController["tool"],
    trait: ButtonToolTrait,
    observesTrait: true,
    view: ButtonToolView,
    observesView: true,
  }>;
  static override readonly tool: FastenerClass<ButtonToolController["tool"]>;
}
