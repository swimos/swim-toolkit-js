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

import {NodeRef} from "@swim/client";
import {SvgView} from "@swim/view";
import {PrimaryAction} from "@swim/shell";

export class NewNodePrimaryAction extends PrimaryAction {
  /** @hidden */
  readonly _metaHostRef: NodeRef;

  constructor(metHostRef: NodeRef) {
    super();
    this._metaHostRef = metHostRef;
  }

  get name(): string {
    return "New Node";
  }

  createIcon(): SvgView {
    const icon = SvgView.create("svg").key("icon").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").fill("#9a9a9a").d("M18,1.61 L24,12 L18,22.39 L6,22.39 L0,12 L6,1.61 L18,1.61 Z M16.85,3.61 L7.15,3.61 L2.31,12 L7.15,20.39 L16.85,20.39 L21.69,12 L16.85,3.61 Z M18,13 L13,13 L13,18 L11,18 L11,13 L6,13 L6,11 L11,11 L11,6 L13,6 L13,11 L18,11 L18,13 Z");
    return icon;
  }
}
