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

import type {CssRule} from "../css/CssRule";
import {StyleSheet} from "../css/StyleSheet";
import {HtmlViewInit, HtmlView} from "../html/HtmlView";
import type {StyleViewObserver} from "./StyleViewObserver";
import type {StyleViewController} from "./StyleViewController";

export interface StyleViewInit extends HtmlViewInit {
  viewController?: StyleViewController;
}

export class StyleView extends HtmlView {
  constructor(node: HTMLStyleElement) {
    super(node);
    Object.defineProperty(this, "sheet", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly node: HTMLStyleElement;

  declare readonly viewController: StyleViewController | null;

  declare readonly viewObservers: ReadonlyArray<StyleViewObserver>;

  initView(init: StyleViewInit): void {
    super.initView(init);
  }

  declare readonly sheet: StyleSheet | null;

  protected createSheet(): StyleSheet | null {
    const stylesheet = this.node.sheet;
    return stylesheet !== null ? new StyleSheet(this, stylesheet) : null;
  }

  hasCssRule(ruleName: string): boolean {
    const sheet = this.sheet;
    return sheet !== null && sheet.hasCssRule(ruleName);
  }

  getCssRule(ruleName: string): CssRule<StyleSheet> | null {
    const sheet = this.sheet;
    return sheet !== null ? sheet.getCssRule(ruleName) : null;
  }

  protected onMount(): void {
    super.onMount();
    Object.defineProperty(this, "sheet", {
      value: this.createSheet(),
      enumerable: true,
      configurable: true,
    });
  }

  protected onUnmount(): void {
    Object.defineProperty(this, "sheet", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    super.onUnmount();
  }

  /** @hidden */
  static readonly tag: string = "style";
}

HtmlView.Tag("style")(StyleView, "style");
