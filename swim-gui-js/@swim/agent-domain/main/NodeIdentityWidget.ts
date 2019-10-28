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

import {HtmlView} from "@swim/view";
import {Widget, Entity} from "@swim/shell";
import {NodeIdentityView} from "./NodeIdentityView";

export class NodeIdentityWidget extends Widget {
  /** @hidden */
  _entity: Entity;

  constructor(entity: Entity) {
    super();
    this._entity = entity;
  }

  get entity(): Entity {
    return this._entity;
  }

  get name(): string {
    return "Identity";
  }

  createView(): HtmlView {
    return new NodeIdentityView(this._entity, document.createElement("div"));
  }
}
