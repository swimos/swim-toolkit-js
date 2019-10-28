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

import {AnyValue, Value} from "@swim/structure";
import {Uri} from "@swim/uri";
import {Downlink, MapDownlink, MapDownlinkObserver, NodeRef} from "@swim/client";
import {Color} from "@swim/color";
import {SvgView} from "@swim/view";
import {Entity} from "@swim/shell";
import {NodeEntity} from "./NodeEntity";

export class NodeSearchEntity extends Entity implements MapDownlinkObserver<Value, Value> {
  /** @hidden */
  readonly _parent: Entity | null;
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  readonly _metaHostRef: NodeRef;

  /** @hidden */
  _query: string;

  /** @hidden */
  _resultsLink: MapDownlink<Value, Value, AnyValue, AnyValue> | null;

  constructor(parent: Entity | null, nodeRef: NodeRef, metaHostRef: NodeRef, query: string) {
    super();
    this._parent = parent;
    this._nodeRef = nodeRef;
    this._metaHostRef = metaHostRef;
    this._query = query;

    this._resultsLink = null;
  }

  get parent(): Entity | null {
    return this._parent;
  }

  get nodeRef(): NodeRef {
    return this._nodeRef;
  }

  get metaHostRef(): NodeRef {
    return this._metaHostRef;
  }

  get uri(): Uri {
    return this._nodeRef.nodeUri();
  }

  get name(): string | null {
    return this._query;
  }

  createIcon(): SvgView {
    const icon = SvgView.create("svg").key("icon").width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").fill(Color.rgb(0, 0, 0, 0.15)).d("M14,2 L22,23 L2,23 L10,2 L14,2 Z M12,7 L7.5,19 L16.5,19 L12,7 Z");
    return icon;
  }

  protected createChildNode(nodeUri: Uri): NodeEntity {
    const childRef = this._nodeRef.nodeRef(nodeUri);
    const nodeName = nodeUri.toString();
    const metaHostUri = this._metaHostRef.nodeUri();
    let metaNodeUri: Uri;
    if (metaHostUri.toString() === "swim:meta:host") {
      metaNodeUri = Uri.path(nodeName);
    } else {
      metaNodeUri = metaHostUri.appendedPath("node", nodeName);
    }
    const metaChildRef = this._metaHostRef.nodeRef(metaNodeUri);
    return new NodeEntity(this, childRef, metaChildRef, this._metaHostRef);
  }

  protected didUpdateChildNode(nodeUri: Uri, value: Value): void {
    const child = this.getChild(nodeUri);
    if (!child) {
      const newChild = this.createChildNode(nodeUri);
      newChild._name = nodeUri.path().foot().head();
      newChild._created = value.get("created").numberValue(0);
      newChild.setChildCount(value.get("childCount").numberValue(0));
      this.insertChild(newChild);
    }
  }

  protected didRemoveChildNode(nodeUri: Uri): void {
    this.removeChild(nodeUri);
  }

  didUpdate(key: Value, newValue: Value, oldValue: Value, downlink: Downlink): void {
    if (downlink === this._resultsLink) {
      const nodeUri = Uri.form().cast(key);
      if (nodeUri) {
        this.didUpdateChildNode(nodeUri, newValue);
      }
    }
  }

  didRemove(key: Value, oldValue: Value, downlink: Downlink): void {
    if (downlink === this._resultsLink) {
      const nodeUri = Uri.form().cast(key);
      if (nodeUri) {
        this.didRemoveChildNode(nodeUri);
      }
    }
  }

  protected linkResults(): void {
    if (!this._resultsLink) {
      const laneUri = Uri.path("nodes").updatedQuery("q", this._query);
      this._resultsLink = this._metaHostRef.downlinkMap()
          .laneUri(laneUri)
          .observe(this)
          .open();
    }
  }

  protected unlinkResults(): void {
    if (this._resultsLink) {
      this._resultsLink.close();
      this._resultsLink = null;
      this.removeChildren();
    }
  }

  didExpand(): void {
    this.linkResults();
    super.didExpand();
  }

  willCollapse(): void {
    super.willCollapse();
    this.unlinkResults();
  }
}
