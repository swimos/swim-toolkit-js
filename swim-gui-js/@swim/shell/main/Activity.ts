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

import {SvgView, HtmlView, PopoverView} from "@swim/view";

export abstract class Activity {
  /** @hidden */
  _popover: PopoverView | null;

  constructor() {
    this._popover = null;
  }

  abstract get name(): string;

  abstract createIcon(): SvgView | HtmlView;

  protected createPopover(): PopoverView | null {
    return null;
  }

  activate(): PopoverView | null {
    if (this._popover === null) {
      this._popover = this.createPopover();
      if (this._popover) {
        this._popover.hidePopover();
      }
    }
    return this._popover;
  }
}
