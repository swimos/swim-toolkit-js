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
import {TreeView} from "./TreeView";
import {TreeViewObserver} from "./TreeViewObserver";

export class TreeViewController<V extends TreeView = TreeView> extends HtmlViewController<V> implements TreeViewObserver<V> {
  treeDidPressLeafDown(leaf: LeafView, view: V): void {
    // hook
  }

  treeDidPressLeafHold(leaf: LeafView, view: V): void {
    // hook
  }

  treeDidPressLeafUp(duration: number, multi: boolean, leaf: LeafView, view: V): void {
    // hook
  }

  treeDidPressLeafAvatar(leaf: LeafView, view: V): void {
    // hook
  }

  treeDidPressLeafArrow(leaf: LeafView, view: V): void {
    // hook
  }
}
