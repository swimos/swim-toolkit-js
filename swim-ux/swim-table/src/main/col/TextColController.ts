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
import {ColController} from "./ColController";
import {TextColView} from "./TextColView";
import {TextColTrait} from "./TextColTrait";
import type {TextColControllerObserver} from "./TextColControllerObserver";

/** @public */
export class TextColController extends ColController {
  override readonly observerType?: Class<TextColControllerObserver>;

  @TraitViewRefDef<TextColController["col"]>({
    extends: true,
    traitType: TextColTrait,
    observesTrait: true,
    initTrait(cellTrait: TextColTrait): void {
      this.owner.setLabelView(cellTrait.label.value);
    },
    deinitTrait(cellTrait: TextColTrait): void {
      this.owner.setLabelView(void 0);
    },
    traitDidSetLabel(label: string | undefined): void {
      this.owner.setLabelView(label);
    },
    viewType: TextColView,
    observesView: true,
    initView(colView: TextColView): void {
      this.owner.label.setView(colView.label.view);
      const cellTrait = this.trait;
      if (cellTrait !== null) {
        this.owner.setLabelView(cellTrait.label.value);
      }
    },
    deinitView(colView: TextColView): void {
      this.owner.label.setView(null);
    },
    viewWillAttachLabel(labelView: HtmlView): void {
      this.owner.label.setView(labelView);
    },
    viewDidDetachLabel(labelView: HtmlView): void {
      this.owner.label.setView(null);
    },
  })
  override readonly col!: TraitViewRefDef<this, {
    extends: ColController["col"],
    trait: TextColTrait,
    observesTrait: true,
    view: TextColView,
    observesView: true,
  }>;
  static override readonly col: FastenerClass<TextColController["col"]>;

  protected setLabelView(label: string | undefined): void {
    const colView = this.col.view;
    if (colView !== null) {
      colView.label.setView(label !== void 0 ? label : null);
    }
  }

  @ViewRefDef<TextColController["label"]>({
    viewType: HtmlView,
    willAttachView(contentView: HtmlView): void {
      this.owner.callObservers("controllerWillAttachColLabelView", contentView, this.owner);
    },
    didDetachView(contentView: HtmlView): void {
      this.owner.callObservers("controllerDidDetachColLabelView", contentView, this.owner);
    },
  })
  readonly label!: ViewRefDef<this, {view: HtmlView}>;
  static readonly label: FastenerClass<TextColController["label"]>;
}
