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

import type {Timing} from "@swim/mapping";
import {Color} from "@swim/color";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewRelation} from "@swim/view";
import {StyleRule, StyleSheet, HtmlView, StyleView, SvgView} from "@swim/dom";
import type {PositionGesture} from "@swim/gesture";
import {TokenViewInit, TokenView} from "./TokenView";
import type {InputTokenViewObserver} from "./InputTokenViewObserver";
import type {InputTokenViewController} from "./InputTokenViewController";

export interface InputTokenViewInit extends TokenViewInit {
  controller?: InputTokenViewController;
}

export class InputTokenView extends TokenView {
  constructor(node: HTMLElement) {
    super(node);
    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
  }

  protected initNode(node: HTMLElement): void {
    super.initNode(node);
    this.addClass("input-token");
  }

  declare readonly viewController: InputTokenViewController | null;

  declare readonly viewObservers: ReadonlyArray<InputTokenViewObserver>;

  initView(init: InputTokenViewInit): void {
    super.initView(init);
  }

  protected initChildViews(): void {
    this.stylesheet.insert();
    super.initChildViews();
    this.label.setView(this.label.createView());
  }

  protected initStylesheet(styleView: StyleView): void {
    const sheet = styleView.sheet;
    if (sheet !== null) {
      const placeholder = new InputTokenView.PlaceholderRule(sheet, "placeholder");
      sheet.setCssRule("placeholder", placeholder);
    }
  }

  /** @hidden */
  static PlaceholderRule = StyleRule.define<StyleSheet>({
    css: "::placeholder {}",
  });

  protected initLabel(labelView: HtmlView): void {
    super.initLabel(labelView);
    labelView.paddingTop.setAutoState(0);
    labelView.paddingRight.setAutoState(0);
    labelView.paddingBottom.setAutoState(0);
    labelView.paddingLeft.setAutoState(0);
    labelView.borderTopStyle.setAutoState("none");
    labelView.borderRightStyle.setAutoState("none");
    labelView.borderBottomStyle.setAutoState("none");
    labelView.borderLeftStyle.setAutoState("none");
    labelView.boxSizing.setAutoState("border-box");
    labelView.backgroundColor.setAutoState(Color.transparent());
    labelView.appearance.setAutoState("none");
    labelView.outlineStyle.setAutoState("none");
    labelView.pointerEvents.setAutoState("auto");
  }

  protected createBodyGesture(bodyView: SvgView): PositionGesture<SvgView> | null {
    return null;
  }

  @ViewRelation<InputTokenView, StyleView>({
    child: true,
    type: HtmlView.style,
    viewDidMount(styleView: StyleView): void {
      this.owner.initStylesheet(styleView);
    },
  })
  declare stylesheet: ViewRelation<this, StyleView>;

  @ViewRelation<InputTokenView, HtmlView>({
    child: false,
    type: HtmlView.input,
    onSetView(labelView: HtmlView | null): void {
      if (labelView !== null) {
        if (labelView.parentView === null) {
          this.owner.labelContainer.insert();
          const labelContainer = this.owner.labelContainer.view;
          if (labelContainer !== null) {
            labelContainer.appendChildView(labelView);
          }
        }
        this.owner.initLabel(labelView);
      }
    },
    viewDidMount(labelView: HtmlView): void {
      labelView.on("input", this.owner.onInputUpdate as EventListener);
      labelView.on("change", this.owner.onInputChange);
      labelView.on("keydown", this.owner.onInputKey);
    },
    viewWillUnmount(labelView: HtmlView): void {
      labelView.off("input", this.owner.onInputUpdate as EventListener);
      labelView.off("change", this.owner.onInputChange);
      labelView.off("keydown", this.owner.onInputKey);
    },
  })
  declare label: ViewRelation<this, HtmlView>;

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    const styleView = this.stylesheet.view;
    if (styleView !== null) {
      const placeholder = styleView.getCssRule("placeholder") as StyleRule<StyleSheet> | null;
      if (placeholder !== null) {
        placeholder.color.setAutoState(theme.inner(mood, Look.mutedColor), timing);
      }
    }

    const labelView = this.label.view;
    if (labelView !== null) {
      const font = theme.inner(mood, Look.font);
      if (font !== void 0) {
        if (font.style !== void 0) {
          labelView.fontStyle.setAutoState(font.style);
        }
        if (font.variant !== void 0) {
          labelView.fontVariant.setAutoState(font.variant);
        }
        if (font.weight !== void 0) {
          labelView.fontWeight.setAutoState(font.weight);
        }
        if (font.stretch !== void 0) {
          labelView.fontStretch.setAutoState(font.stretch);
        }
        if (font.size !== void 0) {
          labelView.fontSize.setAutoState(font.size);
        }
        if (font.height !== void 0) {
          labelView.lineHeight.setAutoState(font.height);
        }
        labelView.fontFamily.setAutoState(font.family);
      }
    }
  }

  protected onInputUpdate(event: InputEvent): void {
    const inputView = this.label.view;
    if (inputView !== null) {
      this.didUpdateInput(inputView);
    }
  }

  protected didUpdateInput(inputView: HtmlView): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidUpdateInput !== void 0) {
        viewObserver.tokenDidUpdateInput(inputView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidUpdateInput !== void 0) {
      viewController.tokenDidUpdateInput(inputView, this);
    }
  }

  protected onInputChange(event: Event): void {
    const inputView = this.label.view;
    if (inputView !== null) {
      this.didChangeInput(inputView);
    }
  }

  protected didChangeInput(inputView: HtmlView): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidChangeInput !== void 0) {
        viewObserver.tokenDidChangeInput(inputView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidChangeInput !== void 0) {
      viewController.tokenDidChangeInput(inputView, this);
    }
  }

  protected onInputKey(event: KeyboardEvent): void {
    const inputView = this.label.view;
    if (inputView !== null && event.key === "Enter") {
      this.didAcceptInput(inputView);
    }
  }

  protected didAcceptInput(inputView: HtmlView): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.tokenDidAcceptInput !== void 0) {
        viewObserver.tokenDidAcceptInput(inputView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.tokenDidAcceptInput !== void 0) {
      viewController.tokenDidAcceptInput(inputView, this);
    }
  }
}
