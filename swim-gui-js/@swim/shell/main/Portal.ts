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

import {Entity} from "./Entity";
import {Domain} from "./Domain";
import {Label} from "./Label";
import {User} from "./User";
import {PortalObserver} from "./PortalObserver";

export abstract class Portal {
  /** @hidden */
  readonly _domains: Domain[];
  /** @hidden */
  readonly _labels: Label[];
  /** @hidden */
  readonly _observers: PortalObserver[];

  constructor() {
    this._domains = [];
    this._labels = [];
    this._observers = [];
  }

  abstract get user(): User;

  abstract get scope(): Entity | null;

  search(query: string): Entity | null {
    return null;
  }

  get domains(): ReadonlyArray<Domain> {
    return this._domains;
  }

  insertDomain(domain: Domain, index?: number): this {
    if (index === void 0) {
      index = this._domains.length;
    } else {
      index = Math.min(Math.max(0, index), this._domains.length);
    }
    this.willInsertDomain(domain, index);
    this._domains.splice(index, 0, domain);
    this.onInsertDomain(domain, index);
    this.didInsertDomain(domain, index);
    return this;
  }

  protected willInsertDomain(domain: Domain, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].portalWillInsertDomain(domain, index);
    }
  }

  protected onInsertDomain(domain: Domain, index: number): void {
    // hook
  }

  protected didInsertDomain(domain: Domain, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].portalDidInsertDomain(domain, index);
    }
  }

  get labels(): ReadonlyArray<Label> {
    return this._labels;
  }

  insertLabel(label: Label, index?: number): this {
    if (index === void 0) {
      index = this._labels.length;
    } else {
      index = Math.min(Math.max(0, index), this._labels.length);
    }
    this.willInsertLabel(label, index);
    this._labels.splice(index, 0, label);
    this.onInsertLabel(label, index);
    this.didInsertLabel(label, index);
    return this;
  }

  protected willInsertLabel(label: Label, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].portalWillInsertLabel(label, index);
    }
  }

  protected onInsertLabel(label: Label, index: number): void {
    // hook
  }

  protected didInsertLabel(label: Label, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].portalDidInsertLabel(label, index);
    }
  }

  addObserver(observer: PortalObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: PortalObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: PortalObserver): void {
    // hook
  }

  protected didAddObserver(observer: PortalObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: PortalObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: PortalObserver): void {
    // hook
  }
}
