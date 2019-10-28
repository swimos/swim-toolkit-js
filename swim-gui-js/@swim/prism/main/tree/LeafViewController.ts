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

import {HtmlViewController} from "@swim/view";
import {LeafView} from "./LeafView";
import {LeafViewObserver} from "./LeafViewObserver";

export class LeafViewController<V extends LeafView = LeafView> extends HtmlViewController<V> implements LeafViewObserver<V> {
  get highlighted(): boolean {
    return this._view ? this._view.highlighted : false;
  }

  get focussed(): boolean {
    return this._view ? this._view.focussed : false;
  }

  get expanded(): boolean {
    return this._view ? this._view.expanded : false;
  }

  leafDidPressDown(view: V): void {
    // hook
  }

  leafDidPressHold(view: V): void {
    // hook
  }

  leafDidPressUp(duration: number, multi: boolean, view: V): void {
    // hook
  }

  leafDidPressAvatar(view: V): void {
    // hook
  }

  leafDidPressMenu(view: V): void {
    // hook
  }

  leafDidPressArrow(view: V): void {
    // hook
  }

  leafWillSelect(view: V): void {
    // hook
  }

  leafDidSelect(view: V): void {
    // hook
  }

  leafWillDeselect(view: V): void {
    // hook
  }

  leafDidDeselect(view: V): void {
    // hook
  }

  leafWillFocus(view: V): void {
    // hook
  }

  leafDidFocus(view: V): void {
    // hook
  }

  leafWillDefocus(view: V): void {
    // hook
  }

  leafDidDefocus(view: V): void {
    // hook
  }

  leafWillExpand(view: V): void {
    // hook
  }

  leafDidExpand(view: V): void {
    // hook
  }

  leafWillCollapse(view: V): void {
    // hook
  }

  leafDidCollapse(view: V): void {
    // hook
  }
}
