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
import type {Color} from "@swim/style";
import {Look, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewProperty, ViewFastener} from "@swim/view";
import {HtmlView, HtmlViewController} from "@swim/dom";
import type {CellViewObserver} from "./CellViewObserver";

export class CellView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initCell();
  }

  protected initCell(): void {
    this.addClass("table-cell");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: HtmlViewController & CellViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<CellViewObserver>;

  @ViewProperty<CellView, Look<Color> | Color | undefined>({
    didUpdate(newTextColor: Look<Color> | Color | undefined, oldTextColor: Look<Color> | Color | undefined): void {
      this.owner.setTextColor(newTextColor);
    },
  })
  declare textColor: ViewProperty<this, Look<Color> | Color | undefined>;

  protected setTextColor(textColor: Look<Color> | Color | undefined): void {
    if (this.color.isAuto()) {
      if (textColor instanceof Look) {
        textColor = this.getLook(textColor);
      }
      this.color.setAutoState(textColor);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (this.color.isAuto()) {
      let textColor = this.textColor.state;
      if (textColor instanceof Look) {
        textColor = this.getLook(textColor);
      }
      this.color.setAutoState(textColor, timing);
    }
  }

  protected createContent(value?: string): HtmlView | null {
    const contentView = HtmlView.span.create();
    contentView.alignSelf.setAutoState("center");
    contentView.whiteSpace.setAutoState("nowrap");
    contentView.textOverflow.setAutoState("ellipsis");
    contentView.overflowX.setAutoState("hidden");
    contentView.overflowY.setAutoState("hidden");
    if (value !== void 0) {
      contentView.text(value);
    }
    return contentView;
  }

  protected initContent(contentView: HtmlView): void {
    // hook
  }

  protected willSetContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.cellViewWillSetContent !== void 0) {
      viewController.cellViewWillSetContent(newContentView, oldContentView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.cellViewWillSetContent !== void 0) {
        viewObserver.cellViewWillSetContent(newContentView, oldContentView, this);
      }
    }
  }

  protected onSetContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    if (newContentView !== null) {
      this.initContent(newContentView);
    }
  }

  protected didSetContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.cellViewDidSetContent !== void 0) {
        viewObserver.cellViewDidSetContent(newContentView, oldContentView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.cellViewDidSetContent !== void 0) {
      viewController.cellViewDidSetContent(newContentView, oldContentView, this);
    }
  }

  @ViewFastener<CellView, HtmlView, string>({
    key: true,
    type: HtmlView,
    fromAny(value: HtmlView | string): HtmlView | null {
      if (value instanceof HtmlView) {
        return value;
      } else {
        return this.owner.createContent(value);
      }
    },
    willSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.willSetContent(newContentView, oldContentView);
    },
    onSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.onSetContent(newContentView, oldContentView);
    },
    didSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.didSetContent(newContentView, oldContentView);
    },
  })
  declare content: ViewFastener<this, HtmlView, string>;
}
