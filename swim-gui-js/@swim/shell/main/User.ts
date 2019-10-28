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

import {UserObserver} from "./UserObserver";

export abstract class User {
  /** @hidden */
  _name: string | null;
  /** @hidden */
  _organization: string | null;
  /** @hidden */
  readonly _observers: UserObserver[];

  constructor(name: string | null, organization: string | null) {
    this._name = name;
    this._organization = organization;
    this._observers = [];
  }

  get name(): string | null {
    return this._name;
  }

  get organization(): string | null {
    return this._organization;
  }

  addObserver(observer: UserObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: UserObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: UserObserver): void {
    // hook
  }

  protected didAddObserver(observer: UserObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: UserObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: UserObserver): void {
    // hook
  }
}
