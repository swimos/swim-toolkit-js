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

import {Uri} from "@swim/uri";
import {NodeRef} from "@swim/client";
import {SvgView} from "@swim/view";
import {PrimaryAction, Entity, Domain} from "@swim/shell";
import {NodeEntity} from "./NodeEntity";
import {NewNodePrimaryAction} from "./NewNodePrimaryAction";
import {NewNodeSecondaryAction} from "./NewNodeSecondaryAction";
import {NewDirectorySecondaryAction} from "./NewDirectorySecondaryAction";

export class AgentDomain extends Domain {
  /** @hidden */
  readonly _metaHostRef: NodeRef;
  /** @hidden */
  _root: NodeEntity | null;
  /** @hidden */
  _primaryAction: PrimaryAction | null;

  constructor(metHostRef: NodeRef) {
    super();
    this._metaHostRef = metHostRef;
    this._root = null;
    this._primaryAction = null;
  }

  get name(): string {
    return "Agents";
  }

  get root(): Entity {
    if (this._root === null) {
      this._root = this.createRoot();
    }
    return this._root;
  }

  protected createRoot(): NodeEntity {
    const nodeRef = this._metaHostRef.nodeRef(Uri.empty());
    const nodeName = "/";
    const metaHostUri = this._metaHostRef.nodeUri();
    let metaNodeUri: Uri;
    if (metaHostUri.toString() === "swim:meta:host") {
      metaNodeUri = Uri.path(nodeName);
    } else {
      metaNodeUri = metaHostUri.appendedPath("node", nodeName);
    }
    const metaNodeRef = this._metaHostRef.nodeRef(metaNodeUri);
    return new NodeEntity(null, nodeRef, metaNodeRef, this._metaHostRef);
  }

  get primaryAction(): PrimaryAction | null {
    if (this._primaryAction === null) {
      this._primaryAction = this.createPrimaryAction();
    }
    return this._primaryAction;
  }

  protected createPrimaryAction(): PrimaryAction | null {
    const primaryAction = new NewNodePrimaryAction(this._metaHostRef);
    primaryAction.insertSecondaryAction(new NewNodeSecondaryAction(this._metaHostRef));
    primaryAction.insertSecondaryAction(new NewDirectorySecondaryAction(this._metaHostRef));
    return primaryAction;
  }

  createIcon(): SvgView {
    const icon = SvgView.create("svg").key("icon").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").d("M7.5,21 C7.12,21 6.79,20.79 6.62,20.47 L2.18,12.57 C2.06,12.41 2,12.21 2,12 C2,11.79 2.06,11.59 2.18,11.43 L6.62,3.53 C6.79,3.21 7.12,3 7.5,3 L16.5,3 C16.88,3 17.21,3.21 17.38,3.53 L21.82,11.43 C21.94,11.59 22,11.79 22,12 C22,12.21 21.94,12.41 21.82,12.57 L17.38,20.47 C17.21,20.79 16.88,21 16.5,21 L7.5,21 Z M19.85,12 L15.91,5 L8.09,5 L4.15,12 L8.09,19 L15.91,19 L19.85,12 Z M7.44065808,16.4296639 L11.14,7.02069092 L12.8625488,7.02069092 L16.5634001,16.4305109 L7.44065808,16.4296639 Z M9.96,14.71 L14.03,14.71 L12,9.29 L9.96,14.71 Z");
    return icon;
  }
}
