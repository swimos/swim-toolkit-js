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

export class SearchField extends HtmlView {
  /** @hidden */
  _viewController: HtmlViewController<SearchField> | null;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("search-field")
        .display("flex")
        .flexGrow(1)
        .flexShrink(1)
        .alignItems("center")
        .userSelect("auto");
  }

  protected initChildren(): void {
    this.append(this.createSearchField().key("search"));
  }

  protected createSearchField(): HtmlView {
    const search = HtmlView.create("input")
        .type("text")
        .placeholder("Search")
        .display("block")
        .flexGrow(1)
        .width(0)
        .height(40)
        .paddingTop(0)
        .paddingRight(20)
        .paddingBottom(0)
        .paddingLeft(20)
        .borderWidth(1)
        .borderStyle("solid")
        .borderColor("#171d1f")
        .borderRadius(20)
        .outlineStyle("none")
        .boxSizing("border-box")
        .fontFamily("system-ui, 'Open Sans', sans-serif")
        .fontSize(16)
        .color("#d8d8d8")
        .backgroundColor("#171d1f");
    search.setStyle("-webkit-appearance", "none");
    return search;
  }

  get viewController(): HtmlViewController<SearchField> | null {
    return this._viewController;
  }
}
