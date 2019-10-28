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

import {HtmlViewObserver} from "@swim/view";
import {LeafView} from "./LeafView";

export interface LeafViewObserver<V extends LeafView = LeafView> extends HtmlViewObserver<V> {
  leafDidPressDown?(view: V): void;

  leafDidPressHold?(view: V): void;

  leafDidPressUp?(duration: number, multi: boolean, view: V): void;

  leafDidPressAvatar?(view: V): void;

  leafDidPressMenu?(view: V): void;

  leafDidPressArrow?(view: V): void;

  leafWillSelect?(view: V): void;

  leafDidSelect?(view: V): void;

  leafWillDeselect?(view: V): void;

  leafDidDeselect?(view: V): void;

  leafWillFocus?(view: V): void;

  leafDidFocus?(view: V): void;

  leafWillDefocus?(view: V): void;

  leafDidDefocus?(view: V): void;

  leafWillExpand?(view: V): void;

  leafDidExpand?(view: V): void;

  leafWillCollapse?(view: V): void;

  leafDidCollapse?(view: V): void;
}
