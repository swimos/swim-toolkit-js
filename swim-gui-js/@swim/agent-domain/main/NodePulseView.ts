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

import {Format} from "@swim/codec";
import {Value} from "@swim/structure";
import {Uri} from "@swim/uri";
import {ValueDownlink} from "@swim/client";
import {HtmlView} from "@swim/view";
import {NodeEntity} from "./NodeEntity";

interface NodePulse {
  agentCount: number;
  agentExecRate: number;
  agentExecTime: number;
  timerEventRate: number;
  timerEventCount: number;
  downlinkCount: number;
  downlinkEventRate: number;
  downlinkEventCount: number;
  downlinkCommandRate: number;
  downlinkCommandCount: number;
  uplinkCount: number;
  uplinkEventRate: number;
  uplinkEventCount: number;
  uplinkCommandRate: number;
  uplinkCommandCount: number;
}

export class NodePulseView extends HtmlView {
  /** @hidden */
  readonly _entity: NodeEntity;
  /** @hidden */
  _agentCountView: HtmlView;
  /** @hidden */
  _agentExecView: HtmlView;
  /** @hidden */
  _timerEventView: HtmlView;
  /** @hidden */
  _downlinkCountView: HtmlView;
  /** @hidden */
  _downlinkEventView: HtmlView;
  /** @hidden */
  _downlinkCommandView: HtmlView;
  /** @hidden */
  _uplinkCountView: HtmlView;
  /** @hidden */
  _uplinkEventView: HtmlView;
  /** @hidden */
  _uplinkCommandView: HtmlView;
  /** @hidden */
  _pulseLink: ValueDownlink<Value> | null;
  /** @hidden */
  _pulseTimeout: number;
  /** @hidden */
  _pulse: NodePulse | null;

  constructor(entity: NodeEntity, node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onPulseTimeout = this.onPulseTimeout.bind(this);
    this._entity = entity;
    this._pulseLink = null;
    this._pulseTimeout = 0;
    this._pulse = null;
    this.initChildren();
  }

  protected initChildren(): void {
    this.display("flex")
        .flexDirection("column")
        .flexGrow(1)
        .paddingTop(16)
        .paddingRight(32)
        .paddingBottom(16)
        .paddingLeft(32)
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(14);

    const table = this.append("table")
        .width("100%")
        .borderCollapse("collapse");

    const agentsRow = table.append("tr");
    agentsRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Agents");
    this._agentCountView = agentsRow.append("td")
        .width("70%")
        .paddingTop(4)
        .paddingBottom(4)
        .colspan(2)
        .color("#9a9a9a");

    const computeRow = table.append("tr");
    computeRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Compute");
    this._agentExecView = computeRow.append("td")
        .width("70%")
        .paddingTop(4)
        .paddingBottom(4)
        .colspan(2)
        .color("#9a9a9a");

    const timerRow = table.append("tr");
    timerRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Timers");
    this._timerEventView = timerRow.append("td")
        .width("70%")
        .paddingTop(4)
        .paddingBottom(4)
        .colspan(2)
        .color("#9a9a9a");

    const linkHeaderRow = table.append("tr");
    linkHeaderRow.append("th")
        .width("30%");
    linkHeaderRow.append("th")
        .width("35%")
        .paddingTop(20)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Downlinks");
    linkHeaderRow.append("th")
        .width("35%")
        .paddingTop(20)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Uplinks");

    const linksRow = table.append("tr");
    linksRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Links");
    this._downlinkCountView = linksRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");
    this._uplinkCountView = linksRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");

    const eventsRow = table.append("tr");
    eventsRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Events");
    this._downlinkEventView = eventsRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");
    this._uplinkEventView = eventsRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");

    const commandsRow = table.append("tr");
    commandsRow.append("th")
        .width("30%")
        .paddingTop(4)
        .paddingBottom(4)
        .fontWeight("normal")
        .textAlign("left")
        .color("#4a4a4a")
        .text("Commands");
    this._downlinkCommandView = commandsRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");
    this._uplinkCommandView = commandsRow.append("td")
        .width("35%")
        .paddingTop(4)
        .paddingBottom(4)
        .color("#9a9a9a");
  }

  protected onMount(): void {
    this.linkPulse();
  }

  protected onUnmount(): void {
    this.unlinkPulse();
    if (this._pulseTimeout) {
      clearTimeout(this._pulseTimeout);
      this._pulseTimeout = 0;
    }
  }

  protected updatePulse(pulse: NodePulse): void {
    this._agentCountView.text(Format.prefix(pulse.agentCount, 1));
    this._agentExecView.text(Format.duration(pulse.agentExecTime) + (pulse.agentExecRate ? " (" + Format.prefix(pulse.agentExecRate, 0) + "s)" : ""));
    this._timerEventView.text(Format.prefix(pulse.timerEventCount, 1) + (pulse.timerEventRate ? " (" + Format.prefix(pulse.timerEventRate, 0) + "/s)" : ""));

    this._downlinkCountView.text(Format.prefix(pulse.downlinkCount, 1));
    this._downlinkEventView.text(Format.prefix(pulse.downlinkEventCount, 1) + (pulse.downlinkEventRate ? " (" + Format.prefix(pulse.downlinkEventRate, 0) + "/s)" : ""));
    this._downlinkCommandView.text(Format.prefix(pulse.downlinkCommandCount, 1) + (pulse.downlinkCommandRate ? " (" + Format.prefix(pulse.downlinkCommandRate, 0) + "/s)" : ""));

    this._uplinkCountView.text(Format.prefix(pulse.uplinkCount, 1));
    this._uplinkEventView.text(Format.prefix(pulse.uplinkEventCount, 1) + (pulse.uplinkEventRate ? " (" + Format.prefix(pulse.uplinkEventRate, 0) + "/s)" : ""));
    this._uplinkCommandView.text(Format.prefix(pulse.uplinkCommandCount, 1) + (pulse.uplinkCommandRate ? " (" + Format.prefix(pulse.uplinkCommandRate, 0) + "/s)" : ""));
  }

  protected didSetPulse(value: Value): void {
    const agents = value.get("agents");
    const downlinks = value.get("downlinks");
    const uplinks = value.get("uplinks");
    const pulse: NodePulse = {
      agentCount: agents.get("agentCount").numberValue(0),
      agentExecRate: agents.get("execRate").numberValue(0) / 1000000000,
      agentExecTime: Math.round(agents.get("execTime").numberValue(0) / 1000000),
      timerEventRate: agents.get("timerEventRate").numberValue(0),
      timerEventCount: agents.get("timerEventCount").numberValue(0),
      downlinkCount: downlinks.get("linkCount").numberValue(0),
      downlinkEventRate: downlinks.get("eventRate").numberValue(0),
      downlinkEventCount: downlinks.get("eventCount").numberValue(0),
      downlinkCommandRate: downlinks.get("commandRate").numberValue(0),
      downlinkCommandCount: downlinks.get("commandCount").numberValue(0),
      uplinkCount: uplinks.get("linkCount").numberValue(0),
      uplinkEventRate: uplinks.get("eventRate").numberValue(0),
      uplinkEventCount: uplinks.get("eventCount").numberValue(0),
      uplinkCommandRate: uplinks.get("commandRate").numberValue(0),
      uplinkCommandCount: uplinks.get("commandCount").numberValue(0),
    };
    this._pulse = pulse;
    this.updatePulse(pulse);

    if (this._pulseTimeout) {
      clearTimeout(this._pulseTimeout);
    }
    this._pulseTimeout = setTimeout(this.onPulseTimeout, 2000) as any;
  }

  protected onPulseTimeout(): void {
    const pulse = this._pulse!;
    pulse.agentExecRate = 0;
    pulse.timerEventRate = 0;
    pulse.downlinkEventRate = 0;
    pulse.downlinkCommandRate = 0;
    pulse.uplinkEventRate = 0;
    pulse.uplinkCommandRate = 0;
    this.updatePulse(pulse);

    if (this._pulseTimeout) {
      clearTimeout(this._pulseTimeout);
      this._pulseTimeout = 0;
    }
  }

  protected linkPulse(): void {
    if (!this._pulseLink) {
      this._pulseLink = this._entity._nodeRef.downlinkValue()
          .nodeUri(Uri.parse("swim:meta:node").appendedPath(this._entity.uri.toString()))
          .laneUri("pulse")
          .didSet(this.didSetPulse.bind(this))
          .open();
    }
  }

  protected unlinkPulse(): void {
    if (this._pulseLink) {
      this._pulseLink.close();
      this._pulseLink = null;
    }
  }
}
