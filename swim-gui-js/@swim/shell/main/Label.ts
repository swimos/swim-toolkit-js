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

import {Color} from "@swim/color";
import {Entity} from "./Entity";
import {LabelObserver} from "./LabelObserver";

export abstract class Label {
  /** @hidden */
  readonly _observers: LabelObserver[];

  constructor() {
    this._observers = [];
  }

  abstract get name(): string;

  abstract get root(): Entity;

  abstract get color(): Color;

  addObserver(observer: LabelObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: LabelObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: LabelObserver): void {
    // hook
  }

  protected didAddObserver(observer: LabelObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: LabelObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: LabelObserver): void {
    // hook
  }
}
