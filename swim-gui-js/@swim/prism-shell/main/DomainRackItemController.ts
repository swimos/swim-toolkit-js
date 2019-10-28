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

import {HtmlViewController} from "@swim/view";
import {Domain, DomainObserver} from "@swim/shell";
import {RackItem} from "@swim/prism";
import {EntityTreeController} from "./EntityTreeController";
import {PortalShellController} from "./PortalShellController";

export class DomainRackItemController extends HtmlViewController<RackItem> implements DomainObserver {
  /** @hidden */
  readonly _model: Domain;

  constructor(model: Domain) {
    super();
    this._model = model;
  }

  get model(): Domain {
    return this._model;
  }

  protected didSetView(view: RackItem | null): void {
    if (view !== null) {
      view.iconView(this._model.createIcon());
      view.titleView(this._model.name);
    }
  }

  createTreeController(shellController: PortalShellController): EntityTreeController {
    return new EntityTreeController(shellController, this._model.root, this._model.primaryAction);
  }
}
