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
import {SecondaryAction} from "@swim/shell";

export class NewLaneSecondaryAction extends SecondaryAction {
  /** @hidden */
  readonly _metaHostRef: NodeRef;

  constructor(metHostRef: NodeRef) {
    super();
    this._metaHostRef = metHostRef;
  }

  get name(): string {
    return "New Lane";
  }

  createIcon(): SvgView {
    const icon = SvgView.create("svg").key("icon").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").fill("#1e2022").d("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
    return icon;
  }
}
