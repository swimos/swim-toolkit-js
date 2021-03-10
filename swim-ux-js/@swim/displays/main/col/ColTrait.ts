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

import {Equals} from "@swim/util";
import type {HtmlView} from "@swim/dom";
import {GenericTrait} from "@swim/model";
import {AnyColLayout, ColLayout} from "../layout/ColLayout";
import type {ColTraitObserver} from "./ColTraitObserver";

export class ColTrait extends GenericTrait {
  constructor() {
    super();
    Object.defineProperty(this, "layout", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "header", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<ColTraitObserver>;

  declare readonly layout: ColLayout | null;

  setLayout(newLayout: AnyColLayout | null): void {
    if (newLayout !== null) {
      newLayout = ColLayout.fromAny(newLayout);
    }
    const oldLayout = this.layout;
    if (!Equals(newLayout, oldLayout)) {
      this.willSetLayout(newLayout as ColLayout, oldLayout);
      Object.defineProperty(this, "layout", {
        value: newLayout,
        enumerable: true,
        configurable: true,
      });
      this.onSetLayout(newLayout as ColLayout, oldLayout);
      this.didSetLayout(newLayout as ColLayout, oldLayout);
    }
  }

  protected willSetLayout(newLayout: ColLayout | null, oldHeader: ColLayout | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.colTraitWillSetLayout !== void 0) {
        traitObserver.colTraitWillSetLayout(newLayout, oldHeader, this);
      }
    }
  }

  protected onSetLayout(newLayout: ColLayout | null, oldHeader: ColLayout | null): void {
    // hook
  }

  protected didSetLayout(newLayout: ColLayout | null, oldHeader: ColLayout | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.colTraitDidSetLayout !== void 0) {
        traitObserver.colTraitDidSetLayout(newLayout, oldHeader, this);
      }
    }
  }

  declare readonly header: HtmlView | string | undefined;

  setHeader(newHeader: HtmlView | string | undefined): void {
    const oldHeader = this.header;
    if (!Equals(newHeader, oldHeader)) {
      this.willSetHeader(newHeader, oldHeader);
      Object.defineProperty(this, "header", {
        value: newHeader,
        enumerable: true,
        configurable: true,
      });
      this.onSetHeader(newHeader, oldHeader);
      this.didSetHeader(newHeader, oldHeader);
    }
  }

  protected willSetHeader(newHeader: HtmlView | string | undefined, oldHeader: HtmlView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.colTraitWillSetHeader !== void 0) {
        traitObserver.colTraitWillSetHeader(newHeader, oldHeader, this);
      }
    }
  }

  protected onSetHeader(newHeader: HtmlView | string | undefined, oldHeader: HtmlView | string | undefined): void {
    // hook
  }

  protected didSetHeader(newHeader: HtmlView | string | undefined, oldHeader: HtmlView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.colTraitDidSetHeader !== void 0) {
        traitObserver.colTraitDidSetHeader(newHeader, oldHeader, this);
      }
    }
  }
}
