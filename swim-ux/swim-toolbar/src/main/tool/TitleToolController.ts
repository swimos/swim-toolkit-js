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
import {ViewRefDef} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {TraitViewRefDef} from "@swim/controller";
import {ToolController} from "./ToolController";
import {TitleToolView} from "./TitleToolView";
import {TitleToolTrait} from "./TitleToolTrait";
import type {TitleToolControllerObserver} from "./TitleToolControllerObserver";

/** @public */
export class TitleToolController extends ToolController {
  override readonly observerType?: Class<TitleToolControllerObserver>;

  @TraitViewRefDef<TitleToolController["tool"]>({
    extends: true,
    traitType: TitleToolTrait,
    observesTrait: true,
    initTrait(toolTrait: TitleToolTrait): void {
      this.owner.setContentView(toolTrait.content.value);
    },
    deinitTrait(toolTrait: TitleToolTrait): void {
      this.owner.setContentView(void 0);
    },
    traitDidSetContent(content: string | undefined): void {
      this.owner.setContentView(content);
    },
    viewType: TitleToolView,
    observesView: true,
    initView(toolView: TitleToolView): void {
      this.owner.content.setView(toolView.content.view);
      const toolTrait = this.trait;
      if (toolTrait !== null) {
        this.owner.setContentView(toolTrait.content.value);
      }
    },
    deinitView(toolView: TitleToolView): void {
      this.owner.content.setView(null);
    },
    viewWillAttachContent(contentView: HtmlView): void {
      this.owner.content.setView(contentView);
    },
    viewDidDetachContent(contentView: HtmlView): void {
      this.owner.content.setView(null);
    },
  })
  override readonly tool!: TraitViewRefDef<this, {
    extends: ToolController["tool"],
    trait: TitleToolTrait,
    observesTrait: true,
    view: TitleToolView,
    observesView: true,
  }>;
  static override readonly tool: FastenerClass<TitleToolController["tool"]>;

  protected setContentView(content: string | undefined): void {
    const toolView = this.tool.view;
    if (toolView !== null) {
      toolView.content.setView(content !== void 0 ? content : null);
    }
  }

  @ViewRefDef<TitleToolController["content"]>({
    viewType: HtmlView,
    willAttachView(contentView: HtmlView): void {
      this.owner.callObservers("controllerWillAttachToolContentView", contentView, this.owner);
    },
    didDetachView(contentView: HtmlView): void {
      this.owner.callObservers("controllerDidDetachToolContentView", contentView, this.owner);
    },
  })
  readonly content!: ViewRefDef<this, {view: HtmlView}>;
  static readonly content: FastenerClass<TitleToolController["content"]>;
}
