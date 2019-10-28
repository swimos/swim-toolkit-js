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

import {SvgView, HtmlView} from "@swim/view";
import {PrimaryAction} from "./PrimaryAction";
import {Entity} from "./Entity";
import {DomainObserver} from "./DomainObserver";

export abstract class Domain {
  /** @hidden */
  readonly _observers: DomainObserver[];

  constructor() {
    this._observers = [];
  }

  abstract get name(): string;

  abstract get root(): Entity;

  get primaryAction(): PrimaryAction | null {
    return null;
  }

  abstract createIcon(): SvgView | HtmlView;

  addObserver(observer: DomainObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: DomainObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: DomainObserver): void {
    // hook
  }

  protected didAddObserver(observer: DomainObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: DomainObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: DomainObserver): void {
    // hook
  }
}
