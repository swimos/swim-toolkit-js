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
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import type {HtmlView} from "@swim/dom";
import {ComponentView, ComponentViewTrait, CompositeComponent} from "@swim/component";
import type {ColLayout} from "../layout/ColLayout";
import {ColView} from "./ColView";
import {ColTrait} from "./ColTrait";
import type {ColComponentObserver} from "./ColComponentObserver";

export class ColComponent extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<ColComponentObserver>;

  setHeader(header: HtmlView | string | undefined): void {
    const colTrait = this.col.trait;
    if (colTrait !== null) {
      colTrait.setHeader(header);
    }
  }

  protected initColTrait(colTrait: ColTrait): void {
    // hook
  }

  protected attachColTrait(colTrait: ColTrait): void {
    const colView = this.col.view;
    if (colView !== null) {
      this.setColHeader(colTrait.header);
    }
  }

  protected detachColTrait(colTrait: ColTrait): void {
    // hook
  }

  protected willSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colWillSetTrait !== void 0) {
        componentObserver.colWillSetTrait(newColTrait, oldColTrait, this);
      }
    }
  }

  protected onSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
    if (oldColTrait !== null) {
      this.detachColTrait(oldColTrait);
    }
    if (newColTrait !== null) {
      this.attachColTrait(newColTrait);
      this.initColTrait(newColTrait);
    }
  }

  protected didSetColTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colDidSetTrait !== void 0) {
        componentObserver.colDidSetTrait(newColTrait, oldColTrait, this);
      }
    }
  }

  protected willSetColLayout(newLayout: ColLayout | null, oldLayout: ColLayout | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colWillSetLayout !== void 0) {
        componentObserver.colWillSetLayout(newLayout, oldLayout, this);
      }
    }
  }

  protected onSetColLayout(newLayout: ColLayout | null, oldLayout: ColLayout | null): void {
    // hook
  }

  protected didSetColLayout(newLayout: ColLayout | null, oldLayout: ColLayout | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colDidSetLayout !== void 0) {
        componentObserver.colDidSetLayout(newLayout, oldLayout, this);
      }
    }
  }

  protected createColView(): ColView {
    return ColView.create();
  }

  protected initColView(colView: ColView): void {
    // hook
  }

  protected attachColView(colView: ColView): void {
    const colTrait = this.col.trait;
    if (colTrait !== null) {
      this.setColHeader(colTrait.header);
    }
  }

  protected detachColView(colView: ColView): void {
    // hook
  }

  protected willSetColView(newColView: ColView | null, oldColView: ColView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colWillSetView !== void 0) {
        componentObserver.colWillSetView(newColView, oldColView, this);
      }
    }
  }

  protected onSetColView(newColView: ColView | null, oldColView: ColView | null): void {
    if (oldColView !== null) {
      this.detachColView(oldColView);
    }
    if (newColView !== null) {
      this.attachColView(newColView);
      this.initColView(newColView);
      this.header.setView(newColView.header.view);
    }
  }

  protected didSetColView(newColView: ColView | null, oldColView: ColView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colDidSetView !== void 0) {
        componentObserver.colDidSetView(newColView, oldColView, this);
      }
    }
  }

  protected themeColView(colView: ColView, theme: ThemeMatrix,
                         mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected setColHeader(header: HtmlView | string | undefined): void {
    const colView = this.col.view;
    if (colView !== null) {
      colView.header.setView(header !== void 0 ? header : null);
    }
  }

  protected initColHeader(headerView: HtmlView): void {
    // hook
  }

  protected willSetColHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colWillSetHeader !== void 0) {
        componentObserver.colWillSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
  }

  protected onSetColHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    if (newHeaderView !== null) {
      this.initColHeader(newHeaderView);
    }
  }

  protected didSetColHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.colDidSetHeader !== void 0) {
        componentObserver.colDidSetHeader(newHeaderView, oldHeaderView, this);
      }
    }
  }

  /** @hidden */
  static ColFastener = ComponentViewTrait.define<ColComponent, ColView, ColTrait>({
    viewType: ColView,
    observeView: true,
    willSetView(newColView: ColView | null, oldColView: ColView | null): void {
      this.owner.willSetColView(newColView, oldColView);
    },
    onSetView(newColView: ColView | null, oldColView: ColView | null): void {
      this.owner.onSetColView(newColView, oldColView);
    },
    didSetView(newColView: ColView | null, oldColView: ColView | null): void {
      this.owner.didSetColView(newColView, oldColView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, colView: ColView): void {
      this.owner.themeColView(colView, theme, mood, timing);
    },
    colViewDidSetHeader(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      if (newHeaderView !== null) {
        this.owner.header.setView(newHeaderView);
      }
    },
    createView(): ColView | null {
      return this.owner.createColView();
    },
    traitType: ColTrait,
    observeTrait: true,
    willSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
      this.owner.willSetColTrait(newColTrait, oldColTrait);
    },
    onSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
      this.owner.onSetColTrait(newColTrait, oldColTrait);
    },
    didSetTrait(newColTrait: ColTrait | null, oldColTrait: ColTrait | null): void {
      this.owner.didSetColTrait(newColTrait, oldColTrait);
    },
    colTraitWillSetLayout(newLayout: ColLayout | null, oldLayout: ColLayout | null): void {
      this.owner.willSetColLayout(newLayout, oldLayout);
    },
    colTraitDidSetLayout(newLayout: ColLayout | null, oldLayout: ColLayout | null): void {
      this.owner.onSetColLayout(newLayout, oldLayout);
      this.owner.didSetColLayout(newLayout, oldLayout);
    },
    colTraitDidSetHeader(newHeader: HtmlView | string | undefined, oldHeader: HtmlView | string | undefined): void {
      this.owner.setColHeader(newHeader);
    },
  });

  @ComponentViewTrait<ColComponent, ColView, ColTrait>({
    extends: ColComponent.ColFastener,
  })
  declare col: ComponentViewTrait<this, ColView, ColTrait>;

  @ComponentView<ColComponent, HtmlView>({
    willSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.willSetColHeader(newHeaderView, oldHeaderView);
    },
    onSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.onSetColHeader(newHeaderView, oldHeaderView);
    },
    didSetView(newHeaderView: HtmlView | null, oldHeaderView: HtmlView | null): void {
      this.owner.didSetColHeader(newHeaderView, oldHeaderView);
    },
  })
  declare header: ComponentView<this, HtmlView>;
}
