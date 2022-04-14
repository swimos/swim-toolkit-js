// Copyright 2015-2022 Swim.inc
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

import type {Class} from "@swim/util";
import {Affinity, PropertyDef} from "@swim/component";
import {HtmlView} from "@swim/dom";
import type {PanelViewObserver} from "./PanelViewObserver";

/** @public */
export class PanelView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initPanel();
  }

  protected initPanel(): void {
    this.addClass("panel");
    this.position.setState("relative", Affinity.Intrinsic);
    this.boxSizing.setState("border-box", Affinity.Intrinsic);
  }

  override readonly observerType?: Class<PanelViewObserver>;

  @PropertyDef<PanelView["unitWidth"]>({
    valueType: Number,
    value: 1,
    didSetValue(unitWidth: number): void {
      this.owner.callObservers("viewDidSetUnitWidth", unitWidth, this.owner);
    },
  })
  readonly unitWidth!: PropertyDef<this, {value: number}>;

  @PropertyDef<PanelView["unitHeight"]>({
    valueType: Number,
    value: 1,
    didSetValue(unitHeight: number): void {
      this.owner.callObservers("viewDidSetUnitHeight", unitHeight, this.owner);
    },
  })
  readonly unitHeight!: PropertyDef<this, {value: number}>;

  @PropertyDef<PanelView["minPanelHeight"]>({
    valueType: Number,
    value: 180,
    inherits: true,
    didSetValue(minPanelHeight: number): void {
      this.owner.callObservers("viewDidSetMinPanelHeight", minPanelHeight, this.owner);
    },
  })
  readonly minPanelHeight!: PropertyDef<this, {value: number}>;
}
