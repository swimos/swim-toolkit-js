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

import {ViewFastener} from "@swim/view";
import {HtmlView, HtmlViewController} from "@swim/dom";
import type {ColViewObserver} from "./ColViewObserver";

export class ColView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initCol();
  }

  protected initCol(): void {
    this.addClass("table-col");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: HtmlViewController & ColViewObserver | null;

  declare readonly viewObservers: ReadonlyArray<ColViewObserver>;

  protected createHeader(value?: string): HtmlView | null {
    const headerView = HtmlView.span.create();
    headerView.alignSelf.setAutoState("center");
    if (value !== void 0) {
      headerView.text(value);
    }
    return headerView;
  }

  protected initHeader(headerView: HtmlView): void {
    // hook
  }

  protected willSetHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.colViewWillSetHeader !== void 0) {
      viewController.colViewWillSetHeader(newHeaderView, oldHeaderView, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.colViewWillSetHeader !== void 0) {
        viewObserver.colViewWillSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
  }

  protected onSetHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    if (newHeaderView !== null) {
      this.initHeader(newHeaderView);
    }
  }

  protected didSetHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.colViewDidSetHeader !== void 0) {
        viewObserver.colViewDidSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.colViewDidSetHeader !== void 0) {
      viewController.colViewDidSetHeader(newHeaderView, oldHeaderView, this);
    }
  }

  @ViewFastener<ColView, HtmlView, string>({
    key: true,
    type: HtmlView,
    fromAny(value: HtmlView | string): HtmlView | null {
      if (value instanceof HtmlView) {
        return value;
      } else {
        return this.owner.createHeader(value);
      }
    },
    willSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.willSetHeader(newHeaderView, oldHeaderView);
    },
    onSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.onSetHeader(newHeaderView, oldHeaderView);
    },
    didSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.didSetHeader(newHeaderView, oldHeaderView);
    },
  })
  declare header: ViewFastener<this, HtmlView, string>;
}
