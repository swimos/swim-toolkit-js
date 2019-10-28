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
import {Widget} from "@swim/shell";
import {NodeEntity} from "./NodeEntity";
import {NodePulseView} from "./NodePulseView";

export class NodePulseWidget extends Widget {
  /** @hidden */
  _entity: NodeEntity;

  constructor(entity: NodeEntity) {
    super();
    this._entity = entity;
  }

  get entity(): NodeEntity {
    return this._entity;
  }

  get name(): string {
    return "Node Pulse";
  }

  createView(): HtmlView {
    return new NodePulseView(this._entity, document.createElement("div"));
  }
}
