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
import {Recon} from "@swim/recon";
import {Uri} from "@swim/uri";
import {Downlink, MapDownlink, MapDownlinkObserver, ValueDownlink} from "@swim/client";
import {HtmlView} from "@swim/view";
import {NodeEntity} from "./NodeEntity";

export class NodeLanesView extends HtmlView implements MapDownlinkObserver<Value, Value> {
  /** @hidden */
  readonly _entity: NodeEntity;
  /** @hidden */
  _lanesLink: MapDownlink<Value, Value, AnyValue, AnyValue> | null;
  /** @hidden */
  _laneValueLinks: {[laneName: string]: ValueDownlink<Value, AnyValue>};

  constructor(entity: NodeEntity, node: HTMLElement, key: string | null = null) {
    super(node, key);
    this._entity = entity;
    this._lanesLink = null;
    this._laneValueLinks = {};
    this.initChildren();
  }

  protected initChildren(): void {
    this.display("flex")
        .position("relative")
        .flexGrow(1)
        .flexBasis(0)
        .paddingTop(16)
        .paddingRight(32)
        .paddingBottom(16)
        .paddingLeft(32)
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(14);

    const table = this.append("table")
        .key("table")
        .width("100%")
        .borderCollapse("collapse");

    const headerRow = table.append("tr");
    headerRow.append("th")
        .paddingTop(4)
        .paddingRight(8)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Lane");
    headerRow.append("th")
        .width("100%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Value");
  }

  protected onMount(): void {
    this.link();
  }

  protected onUnmount(): void {
    this.unlink();
  }

  protected didSetLaneValue(laneRow: HtmlView, newValue: Value, oldValue: Value,
                            downlink: ValueDownlink<Value, AnyValue>): void {
    const valueCell = laneRow.getChildView("value") as HtmlView;
    const valueContainer = valueCell.getChildView("container") as HtmlView;
    valueContainer.text(Recon.toString(newValue))
                  .color("#ffffff")
                  .color("#9a9a9a", {duration: 500, ease: "cubic-out"});
  }

  protected didUpdateLane(laneUri: Uri, value: Value): void {
    const laneName = laneUri.toString();
    const laneType = value.get("laneType").stringValue(null);

    const table = this.getChildView("table") as HtmlView;
    let laneRow = table.getChildView(laneName) as HtmlView | null;
    if (!laneRow) {
      laneRow = table.append("tr")
          .key(laneName);
      laneRow.append("td")
          .paddingTop(4)
          .paddingRight(8)
          .paddingBottom(4)
          .color("#9a9a9a")
          .text(laneName);
      const valueCell = laneRow.append("td")
          .key("value")
          .position("relative")
          .width("100%")
          .paddingTop(4)
          .paddingBottom(4);
      const valueContainer = valueCell.append("div")
          .key("container")
          .position("absolute")
          .top(4)
          .right(0)
          .bottom(4)
          .left(0)
          .overflow("hidden")
          .textOverflow("ellipsis")
          .whiteSpace("nowrap");
      if (laneType === "value") {
        valueContainer.color("#9a9a9a");
      } else {
        valueContainer.fontStyle("italic")
                      .color("#727272")
                      .text("(" + laneType + ")");
      }
    }

    if (laneType === "value") {
      let laneValueLink = this._laneValueLinks[laneName];
      if (!laneValueLink) {
        laneValueLink = this._entity._nodeRef.downlinkValue()
            .laneUri(laneUri)
            .didSet(this.didSetLaneValue.bind(this, laneRow))
            .open();
        this._laneValueLinks[laneName] = laneValueLink;
      }
    }
  }

  protected didRemoveLane(laneUri: Uri): void {
    // TODO
  }

  didUpdate(key: Value, newValue: Value, oldValue: Value, downlink: Downlink): void {
    if (downlink === this._lanesLink) {
      const laneUri = Uri.form().cast(key);
      if (laneUri) {
        this.didUpdateLane(laneUri, newValue);
      }
    }
  }

  didRemove(key: Value, oldValue: Value, downlink: Downlink): void {
    if (downlink === this._lanesLink) {
      const laneUri = Uri.form().cast(key);
      if (laneUri) {
        this.didRemoveLane(laneUri);
      }
    }
  }

  protected link(): void {
    this.linkLanes();
  }

  protected unlink(): void {
    this.unlinkLanes();
    this.unlinkLaneValues();
  }

  protected linkLanes(): void {
    if (!this._lanesLink) {
      this._lanesLink = this._entity._nodeRef.downlinkMap()
          .nodeUri(Uri.parse("swim:meta:node").appendedPath(this._entity.uri.toString()))
          .laneUri("lanes")
          .observe(this)
          .open();
    }
  }

  protected unlinkLanes(): void {
    if (this._lanesLink) {
      this._lanesLink.close();
      this._lanesLink = null;
    }
  }

  protected unlinkLaneValues(): void {
    const laneValueLinks = this._laneValueLinks;
    this._laneValueLinks = {};
    const laneNames = Object.keys(laneValueLinks);
    for (let i = 0, n = laneNames.length; i < n; i += 1) {
      const laneName = laneNames[i];
      const laneValueLink = laneValueLinks[laneName];
      laneValueLink.close();
    }
  }
}
