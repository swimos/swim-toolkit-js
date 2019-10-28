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

import {PopoverView} from "@swim/view";
import {Activity} from "@swim/shell";
import {MenuItem, MenuItemController} from "@swim/prism";

/** @hidden */
export class ActivityMenuItemController extends MenuItemController {
  /** @hidden */
  readonly _model: Activity;

  constructor(model: Activity) {
    super();
    this._model = model;
  }

  get model(): Activity {
    return this._model;
  }

  protected didSetView(view: MenuItem | null): void {
    if (view !== null) {
      view.iconView(this._model.createIcon());
      view.titleView(this._model.name);
    }
  }

  activate(): PopoverView | null {
    return this._model.activate();
  }
}
