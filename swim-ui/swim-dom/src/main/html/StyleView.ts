// Copyright 2015-2023 Swim.inc
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

import type {Class} from "@swim/util";
import type {Timing} from "@swim/util";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import type {StyleContext} from "../css/StyleContext";
import {StyleSheet} from "../css/StyleSheet";
import type {HtmlViewInit} from "../html/HtmlView";
import {HtmlView} from "../html/HtmlView";
import type {StyleViewObserver} from "./StyleViewObserver";

/** @public */
export interface StyleViewInit extends HtmlViewInit {
}

/** @public */
export class StyleView extends HtmlView implements StyleContext {
  constructor(node: HTMLStyleElement) {
    super(node);
  }

  override readonly observerType?: Class<StyleViewObserver>;

  override readonly node!: HTMLStyleElement;

  @StyleSheet({})
  readonly sheet!: StyleSheet<this>;

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    this.sheet.applyTheme(theme, mood, timing);
  }

  protected override onMount(): void {
    super.onMount();
    this.sheet.attachCss(this.node.sheet!);
  }

  protected override onUnmount(): void {
    this.sheet.detachCss();
    super.onUnmount();
  }

  override init(init: StyleViewInit): void {
    super.init(init);
  }

  /** @internal */
  static override readonly tag: string = "style";
}
