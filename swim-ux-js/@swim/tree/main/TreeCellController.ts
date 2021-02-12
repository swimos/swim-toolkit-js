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

import {HtmlViewController} from "@swim/dom";
import type {PositionGestureInput} from "@swim/gesture";
import type {TreeCell} from "./TreeCell";
import type {TreeCellObserver} from "./TreeCellObserver";

export class TreeCellController<V extends TreeCell = TreeCell> extends HtmlViewController<V> implements TreeCellObserver<V> {
  cellDidPress(input: PositionGestureInput, event: Event | null, view: V): void {
    // hook
  }

  cellDidLongPress(input: PositionGestureInput, view: V): void {
    // hook
  }
}
