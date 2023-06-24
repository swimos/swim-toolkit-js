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
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Color} from "@swim/style";
import {Look} from "@swim/theme";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import {ViewRef} from "@swim/view";
import type {StyleSheet} from "@swim/dom";
import {StyleRule} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import {StyleView} from "@swim/dom";
import type {TokenViewInit} from "./TokenView";
import type {TokenViewObserver} from "./TokenView";
import {TokenView} from "./TokenView";

/** @public */
export interface InputTokenViewInit extends TokenViewInit {
}

/** @public */
export interface InputTokenViewObserver<V extends InputTokenView = InputTokenView> extends TokenViewObserver<V> {
  tokenDidUpdateInput?(inputView: HtmlView, view: V): void;

  tokenDidChangeInput?(inputView: HtmlView, view: V): void;

  tokenDidAcceptInput?(inputView: HtmlView, view: V): void;
}

/** @public */
export class InputTokenView extends TokenView {
  constructor(node: HTMLElement) {
    super(node);
    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
  }

  declare readonly observerType?: Class<InputTokenViewObserver>;

  protected override initToken(): void {
    super.initToken();
    this.addClass("input-token");
    this.label.attachView();
  }

  protected override initLabel(labelView: HtmlView): void {
    super.initLabel(labelView);
    labelView.paddingTop.setState(0, Affinity.Intrinsic);
    labelView.paddingRight.setState(0, Affinity.Intrinsic);
    labelView.paddingBottom.setState(0, Affinity.Intrinsic);
    labelView.paddingLeft.setState(0, Affinity.Intrinsic);
    labelView.borderTopStyle.setState("none", Affinity.Intrinsic);
    labelView.borderRightStyle.setState("none", Affinity.Intrinsic);
    labelView.borderBottomStyle.setState("none", Affinity.Intrinsic);
    labelView.borderLeftStyle.setState("none", Affinity.Intrinsic);
    labelView.boxSizing.setState("border-box", Affinity.Intrinsic);
    labelView.backgroundColor.setState(Color.transparent(), Affinity.Intrinsic);
    labelView.appearance.setState("none", Affinity.Intrinsic);
    labelView.outlineStyle.setState("none", Affinity.Intrinsic);
    labelView.pointerEvents.setState("auto", Affinity.Intrinsic);
  }

  @ViewRef({
    viewType: StyleView,
    viewKey: true,
    binds: true,
    init(): void {
      this.insertView();
    },
  })
  readonly stylesheet!: ViewRef<this, StyleView>;

  @StyleRule({
    inherits: true,
    get parent(): StyleSheet | null {
      const styleView = this.owner.stylesheet.view;
      return styleView !== null ? styleView.sheet : null;
    },
    selector: "::placeholder",
  })
  readonly placeholderRule!: StyleRule<this>;

  @ViewRef({
    viewType: HtmlView.forTag("input"),
    observes: true,
    didAttachView(labelView: HtmlView): void {
      if (labelView.parent === null) {
        this.owner.labelContainer.insertView();
        const labelContainer = this.owner.labelContainer.view;
        if (labelContainer !== null) {
          labelContainer.appendChild(labelView);
        }
      }
      this.owner.initLabel(labelView);
    },
    viewDidMount(labelView: HtmlView): void {
      labelView.addEventListener("input", this.owner.onInputUpdate as EventListener);
      labelView.addEventListener("change", this.owner.onInputChange);
      labelView.addEventListener("keydown", this.owner.onInputKey);
    },
    viewWillUnmount(labelView: HtmlView): void {
      labelView.removeEventListener("input", this.owner.onInputUpdate as EventListener);
      labelView.removeEventListener("change", this.owner.onInputChange);
      labelView.removeEventListener("keydown", this.owner.onInputKey);
    },
  })
  override readonly label!: ViewRef<this, HtmlView> & Observes<HtmlView>;

  /** @internal */
  get placeholderLook(): Look<Color> {
    return Look.placeholderColor;
  }

  protected override onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    this.placeholderRule.color.setState(theme.getOr(this.placeholderLook, mood, null), timing, Affinity.Intrinsic);

    const labelView = this.label.view;
    if (labelView !== null) {
      labelView.font(theme.getOr(Look.font, mood, null), false, Affinity.Intrinsic);
    }
  }

  protected onInputUpdate(event: InputEvent): void {
    const inputView = this.label.view;
    if (inputView !== null) {
      this.didUpdateInput(inputView);
    }
  }

  protected didUpdateInput(inputView: HtmlView): void {
    this.callObservers("tokenDidUpdateInput", inputView, this);
  }

  protected onInputChange(event: Event): void {
    const inputView = this.label.view;
    if (inputView !== null) {
      this.didChangeInput(inputView);
    }
  }

  protected didChangeInput(inputView: HtmlView): void {
    this.callObservers("tokenDidChangeInput", inputView, this);
  }

  protected onInputKey(event: KeyboardEvent): void {
    const inputView = this.label.view;
    if (inputView !== null && event.key === "Enter") {
      this.didAcceptInput(inputView);
    }
  }

  protected didAcceptInput(inputView: HtmlView): void {
    this.callObservers("tokenDidAcceptInput", inputView, this);
  }

  override init(init: InputTokenViewInit): void {
    super.init(init);
  }
}
