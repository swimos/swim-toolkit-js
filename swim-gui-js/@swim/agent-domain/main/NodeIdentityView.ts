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
import {Entity} from "@swim/shell";

export class NodeIdentityView extends HtmlView {
  /** @hidden */
  readonly _entity: Entity;

  constructor(entity: Entity, node: HTMLElement, key: string | null = null) {
    super(node, key);
    this._entity = entity;
    this.initChildren();
  }

  protected initChildren(): void {
    this.display("flex")
        .flexGrow(1)
        .alignItems("center")
        .minHeight(80)
        .fontFamily("system-ui, 'Open Sans', sans-serif");

    this.append("div")
        .paddingLeft(32)
        .paddingRight(32)
        .whiteSpace("nowrap")
        .textOverflow("ellipsis")
        .overflow("hidden")
        .fontSize(17)
        .color("#ffffff")
        .text(this._entity.name);
  }
}
