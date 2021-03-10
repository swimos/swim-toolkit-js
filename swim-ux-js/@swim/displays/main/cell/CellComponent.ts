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
import {CellView} from "./CellView";
import {CellTrait} from "./CellTrait";
import type {CellComponentObserver} from "./CellComponentObserver";

export class CellComponent extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<CellComponentObserver>;

  setContent(content: HtmlView | string | undefined): void {
    const cellTrait = this.cell.trait;
    if (cellTrait !== null) {
      cellTrait.setContent(content);
    }
  }

  protected initCellTrait(cellTrait: CellTrait): void {
    // hook
  }

  protected attachCellTrait(cellTrait: CellTrait): void {
    const cellView = this.cell.view;
    if (cellView !== null) {
      this.setCellContent(cellTrait.content);
    }
  }

  protected detachCellTrait(cellTrait: CellTrait): void {
    // hook
  }

  protected willSetCellTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellWillSetTrait !== void 0) {
        componentObserver.cellWillSetTrait(newCellTrait, oldCellTrait, this);
      }
    }
  }

  protected onSetCellTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
    if (oldCellTrait !== null) {
      this.detachCellTrait(oldCellTrait);
    }
    if (newCellTrait !== null) {
      this.attachCellTrait(newCellTrait);
      this.initCellTrait(newCellTrait);
    }
  }

  protected didSetCellTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellDidSetTrait !== void 0) {
        componentObserver.cellDidSetTrait(newCellTrait, oldCellTrait, this);
      }
    }
  }

  protected createCellView(): CellView {
    return CellView.create();
  }

  protected initCellView(cellView: CellView): void {
    // hook
  }

  protected attachCellView(cellView: CellView): void {
    const cellTrait = this.cell.trait;
    if (cellTrait !== null) {
      this.setCellContent(cellTrait.content);
    }
  }

  protected detachCellView(cellView: CellView): void {
    // hook
  }

  protected willSetCellView(newCellView: CellView | null, oldCellView: CellView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellWillSetView !== void 0) {
        componentObserver.cellWillSetView(newCellView, oldCellView, this);
      }
    }
  }

  protected onSetCellView(newCellView: CellView | null, oldCellView: CellView | null): void {
    if (oldCellView !== null) {
      this.detachCellView(oldCellView);
    }
    if (newCellView !== null) {
      this.attachCellView(newCellView);
      this.initCellView(newCellView);
      this.content.setView(newCellView.content.view);
    }
  }

  protected didSetCellView(newCellView: CellView | null, oldCellView: CellView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellDidSetView !== void 0) {
        componentObserver.cellDidSetView(newCellView, oldCellView, this);
      }
    }
  }

  protected themeCellView(cellView: CellView, theme: ThemeMatrix,
                          mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected setCellContent(content: HtmlView | string | undefined): void {
    const cellView = this.cell.view;
    if (cellView !== null) {
      cellView.content.setView(content !== void 0 ? content : null);
    }
  }

  protected initCellContent(contentView: HtmlView | null): void {
    // hook
  }

  protected willSetCellContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellWillSetContent !== void 0) {
        componentObserver.cellWillSetContent(newContentView, oldContentView, this);
      }
    }
  }

  protected onSetCellContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    if (newContentView !== null) {
      this.initCellContent(newContentView);
    }
  }

  protected didSetCellContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.cellDidSetContent !== void 0) {
        componentObserver.cellDidSetContent(newContentView, oldContentView, this);
      }
    }
  }

  /** @hidden */
  static CellFastener = ComponentViewTrait.define<CellComponent, CellView, CellTrait>({
    viewType: CellView,
    observeView: true,
    willSetView(newCellView: CellView | null, oldCellView: CellView | null): void {
      this.owner.willSetCellView(newCellView, oldCellView);
    },
    onSetView(newCellView: CellView | null, oldCellView: CellView | null): void {
      this.owner.onSetCellView(newCellView, oldCellView);
    },
    didSetView(newCellView: CellView | null, oldCellView: CellView | null): void {
      this.owner.didSetCellView(newCellView, oldCellView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, cellView: CellView): void {
      this.owner.themeCellView(cellView, theme, mood, timing);
    },
    cellViewDidSetContent(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      if (newContentView !== null) {
        this.owner.content.setView(newContentView);
      }
    },
    createView(): CellView | null {
      return this.owner.createCellView();
    },
    traitType: CellTrait,
    observeTrait: true,
    willSetTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
      this.owner.willSetCellTrait(newCellTrait, oldCellTrait);
    },
    onSetTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
      this.owner.onSetCellTrait(newCellTrait, oldCellTrait);
    },
    didSetTrait(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null): void {
      this.owner.didSetCellTrait(newCellTrait, oldCellTrait);
    },
    cellTraitDidSetContent(newContent: HtmlView | string | undefined, oldContent: HtmlView | string | undefined): void {
      this.owner.setCellContent(newContent);
    },
  });

  @ComponentViewTrait<CellComponent, CellView, CellTrait>({
    extends: CellComponent.CellFastener,
  })
  declare cell: ComponentViewTrait<this, CellView, CellTrait>;

  @ComponentView<CellComponent, HtmlView>({
    willSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.willSetCellContent(newContentView, oldContentView);
    },
    onSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.onSetCellContent(newContentView, oldContentView);
    },
    didSetView(newContentView: HtmlView | null, oldContentView: HtmlView | null): void {
      this.owner.didSetCellContent(newContentView, oldContentView);
    },
  })
  declare content: ComponentView<this, HtmlView>;
}
