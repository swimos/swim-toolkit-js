// Copyright 2015-2020 Swim inc.
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

import type {AnyValue, Value} from "@swim/structure";
import type {Uri} from "@swim/uri";
import {ModelValueDownlink} from "./ModelValueDownlink";
import {DownlinkTrait} from "./DownlinkTrait";

export abstract class ValueDownlinkTrait extends DownlinkTrait {
  protected downlinkDidSet(newValue: Value, oldValue: Value): void {
    // hook
  }

  @ModelValueDownlink<ValueDownlinkTrait, Value, AnyValue>({
    hostUri(): Uri | null {
      return this.owner.hostUri;
    },
    nodeUri(): Uri | null {
      return this.owner.nodeUri;
    },
    laneUri(): Uri | null {
      return this.owner.laneUri;
    },
    didSet(newValue: Value, oldValue: Value): void {
      if (this.owner.isConsuming()) {
        this.owner.downlinkDidSet(newValue, oldValue);
      }
    },
  })
  declare downlink: ModelValueDownlink<this, Value, AnyValue>;

  protected onStartConsuming(): void {
    super.onStartConsuming();
    this.downlink.enabled(true);
  }

  protected onStopConsuming(): void {
    super.onStopConsuming();
    this.downlink.enabled(false);
  }
}
