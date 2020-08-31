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

import {ThemedHtmlViewController} from "@swim/theme";
import {PinViewState, PinView} from "./PinView";
import {PinViewObserver} from "./PinViewObserver";

export class PinViewController<V extends PinView = PinView> extends ThemedHtmlViewController<V> implements PinViewObserver<V> {
  get pinState(): PinViewState | null {
    return this._view !== null ? this._view.pinState : null;
  }

  pinWillExpand(view: V): void {
    // hook
  }

  pinDidExpand(view: V): void {
    // hook
  }

  pinWillCollapse(view: V): void {
    const labelView = view.label.subview;
    if (labelView !== null) {
      labelView.node.blur();
    }
  }

  pinDidCollapse(view: V): void {
    // hook
  }

  pinDidPressHead(view: V): void {
    view.toggle();
    const labelView = view.label.subview;
    if (labelView !== null && view.isExpanded()) {
      labelView.node.focus();
    }
  }

  pinDidPressBody(view: V): void {
    // hook
  }
}
