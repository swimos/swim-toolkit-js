// Copyright 2015-2019 SWIM.AI inc.
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

import {HtmlView, HtmlViewController} from "@swim/view";
import {SecondaryAction, SecondaryActionObserver} from "@swim/shell";
import {ActionItem} from "@swim/prism";

export class SecondaryActionItemController extends HtmlViewController<ActionItem> implements SecondaryActionObserver {
  /** @hidden */
  readonly _model: SecondaryAction;

  constructor(model: SecondaryAction) {
    super();
    this._model = model;
  }

  get model(): SecondaryAction {
    return this._model;
  }

  protected didSetView(view: ActionItem | null): void {
    if (view !== null) {
      const icon = this._model.createIcon();
      view.setChildView("icon", icon);
      const label = HtmlView.create("span")
          .display("block")
          .text(this._model.name);
      view.setChildView("label", label);
    }
  }
}
