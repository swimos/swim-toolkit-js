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
import {PrimaryActionObserver} from "./PrimaryActionObserver";
import {SecondaryAction} from "./SecondaryAction";

export abstract class PrimaryAction {
  /** @hidden */
  readonly _secondaryActions: SecondaryAction[];
  /** @hidden */
  readonly _observers: PrimaryActionObserver[];

  constructor() {
    this._secondaryActions = [];
    this._observers = [];
  }

  abstract get name(): string;

  abstract createIcon(): SvgView | HtmlView;

  get secondaryActions(): ReadonlyArray<SecondaryAction> {
    return this._secondaryActions;
  }

  getSecondaryAction(secondaryActionName: string): SecondaryAction | null {
    for (let i = 0; i < this._secondaryActions.length; i += 1) {
      const secondaryAction = this._secondaryActions[i];
      if (secondaryActionName === secondaryAction.name) {
        return secondaryAction;
      }
    }
    return null;
  }

  insertSecondaryAction(secondaryAction: SecondaryAction, index?: number): this {
    if (index === void 0) {
      index = this._secondaryActions.length;
    } else {
      index = Math.min(Math.max(0, index), this._secondaryActions.length);
    }
    this.willInsertSecondaryAction(secondaryAction, index);
    this._secondaryActions.splice(index, 0, secondaryAction);
    this.onInsertSecondaryAction(secondaryAction, index);
    this.didInsertSecondaryAction(secondaryAction, index);
    return this;
  }

  protected willInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionWillInsertSecondaryAction(secondaryAction, index);
    }
  }

  protected onInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    // hook
  }

  protected didInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionDidInsertSecondaryAction(secondaryAction, index);
    }
  }

  removeSecondaryAction(secondaryActionName: string): this {
    for (let i = 0; i < this._secondaryActions.length; i += 1) {
      const secondaryAction = this._secondaryActions[i];
      if (secondaryAction.name === secondaryActionName) {
        this.willRemoveSecondaryAction(secondaryAction, i);
        this._secondaryActions.splice(i, 1);
        this.onRemoveSecondaryAction(secondaryAction, i);
        this.didRemoveSecondaryAction(secondaryAction, i);
        break;
      }
    }
    return this;
  }

  removeSecondaryActions(): void {
    while (this._secondaryActions.length > 0) {
      const index = this._secondaryActions.length - 1;
      const secondaryAction = this._secondaryActions[index];
      this.willRemoveSecondaryAction(secondaryAction, index);
      this._secondaryActions.splice(index, 1);
      this.onRemoveSecondaryAction(secondaryAction, index);
      this.didRemoveSecondaryAction(secondaryAction, index);
    }
  }

  protected willRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionWillRemoveSecondaryAction(secondaryAction, index);
    }
  }

  protected onRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    // hook
  }

  protected didRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionDidRemoveSecondaryAction(secondaryAction, index);
    }
  }

  willExpand(actionView: HtmlView): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionWillExpand(actionView);
    }
  }

  didExpand(actionView: HtmlView): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionDidExpand(actionView);
    }
  }

  willCollapse(actionView: HtmlView): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionWillCollapse(actionView);
    }
  }

  didCollapse(actionView: HtmlView): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionDidCollapse(actionView);
    }
  }

  didActivate(actionView: HtmlView): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].primaryActionDidActivate(actionView);
    }
  }

  addObserver(observer: PrimaryActionObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: PrimaryActionObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: PrimaryActionObserver): void {
    // hook
  }

  protected didAddObserver(observer: PrimaryActionObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: PrimaryActionObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: PrimaryActionObserver): void {
    // hook
  }
}
