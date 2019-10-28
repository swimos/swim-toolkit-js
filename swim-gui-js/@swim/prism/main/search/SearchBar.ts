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
import {SearchField} from "./SearchField";
import {SearchButton} from "./SearchButton";

export class SearchBar extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<SearchBar> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("search-bar")
        .display("flex")
        .boxSizing("border-box");
  }

  protected initChildren(): void {
    this.append(SearchField, "searchField");
    this.append(SearchButton, "searchButton");
  }

  get viewController(): HtmlViewController<SearchBar> | null {
    return this._viewController;
  }

  get searchField(): SearchField | null {
    const childView = this.getChildView("searchField");
    return childView instanceof SearchField ? childView : null;
  }

  get searchButton(): SearchButton | null {
    const childView = this.getChildView("searchButton");
    return childView instanceof SearchButton ? childView : null;
  }
}
