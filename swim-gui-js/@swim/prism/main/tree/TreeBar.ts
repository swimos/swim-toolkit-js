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

import {HtmlView, HtmlViewController} from "@swim/view";

export class TreeBar extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<TreeBar> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("tree-bar")
        .display("flex")
        .justifyContent("flex-end")
        .boxSizing("border-box");
  }

  protected initChildren(): void {
    // stub
  }

  get viewController(): HtmlViewController<TreeBar> | null {
    return this._viewController;
  }
}
