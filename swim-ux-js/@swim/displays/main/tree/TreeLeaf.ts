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

import {AnyTiming, Timing} from "@swim/mapping";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  ViewFlags,
  View,
  ViewProperty,
  PositionGestureInput,
  PositionGestureDelegate,
} from "@swim/view";
import type {ViewNode, HtmlViewConstructor, HtmlView} from "@swim/dom";
import {ButtonMembraneInit, ButtonMembrane} from "@swim/controls";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import {AnyTreeCell, TreeCell} from "./TreeCell";
import type {TreeLeafObserver} from "./TreeLeafObserver";
import type {TreeLeafController} from "./TreeLeafController";

export type AnyTreeLeaf = TreeLeaf | TreeLeafInit | HTMLElement;

export interface TreeLeafInit extends ButtonMembraneInit {
  viewController?: TreeLeafController;
  highlighted?: boolean;

  cells?: AnyTreeCell[];
}

export class TreeLeaf extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    this.initLeaf();
  }

  protected initLeaf(): void {
    this.addClass("tree-leaf");
    this.position.setAutoState("relative");
    this.height.setAutoState(58);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: TreeLeafController | null;

  declare readonly viewObservers: ReadonlyArray<TreeLeafObserver>;

  initView(init: TreeLeafInit): void {
    super.initView(init);
    if (init.highlighted === true) {
      this.highlight();
    } else if (init.highlighted === false) {
      this.unhighlight();
    }

    if (init.cells !== void 0) {
      this.addCells(init.cells);
    }
  }

  addCell(cell: AnyTreeCell, key?: string): TreeCell {
    if (key === void 0 && "key" in cell) {
      key = cell.key;
    }
    cell = TreeCell.fromAny(cell);
    this.appendChildView(cell, key);
    return cell;
  }

  addCells(cells: ReadonlyArray<AnyTreeCell>): void {
    for (let i = 0, n = cells.length; i < n; i += 1) {
      this.addCell(cells[i]!);
    }
  }

  @ViewProperty({type: TreeSeed, inherit: true})
  declare seed: ViewProperty<this, TreeSeed | undefined, AnyTreeSeed | undefined>;

  @ViewProperty({type: Number, inherit: true})
  declare limbSpacing: ViewProperty<this, number | undefined>;

  @ViewProperty({type: Boolean, state: false})
  declare highlighted: ViewProperty<this, boolean>;

  highlight(timing?: AnyTiming | boolean): void {
    if (!this.highlighted.state) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willHighlight(timing);
      this.highlighted.setState(true);
      this.onHighlight(timing);
      this.didHighlight(timing);
    }
  }

  protected willHighlight(timing: Timing | boolean): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.leafWillHighlight !== void 0) {
      viewController.leafWillHighlight(timing, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.leafWillHighlight !== void 0) {
        viewObserver.leafWillHighlight(timing, this);
      }
    }
  }

  protected onHighlight(timing: Timing | boolean): void {
    this.modifyMood(Feel.default, [Feel.selected, 1]);
    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), timing);
    }
    const selectedColor = this.getLook(Look.accentColor);
    let selectedView = this.getChildView("selected") as HtmlView | null;
    if (selectedView === null) {
      selectedView = this.prepend("div", "selected");
      selectedView.addClass("selected");
      selectedView.position.setAutoState("absolute");
      selectedView.top.setAutoState(2);
      selectedView.bottom.setAutoState(2);
      selectedView.left.setAutoState(0);
      selectedView.width.setAutoState(4);
      if (selectedColor !== void 0) {
        selectedView.backgroundColor.setAutoState(selectedColor.alpha(0));
      }
    }
    if (selectedView !== null) {
      selectedView.backgroundColor.setAutoState(selectedColor, timing);
    }
  }

  protected didHighlight(timing: Timing | boolean): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.leafDidHighlight !== void 0) {
        viewObserver.leafDidHighlight(timing, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.leafDidHighlight !== void 0) {
      viewController.leafDidHighlight(timing, this);
    }
  }

  unhighlight(timing?: AnyTiming | boolean): void {
    if (this.highlighted.state) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.willUnhighlight(timing);
      this.highlighted.setState(false);
      this.onUnhighlight(timing);
      this.didUnhighlight(timing);
    }
  }

  protected willUnhighlight(timing: Timing | boolean): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.leafWillUnhighlight !== void 0) {
      viewController.leafWillUnhighlight(timing, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.leafWillUnhighlight !== void 0) {
        viewObserver.leafWillUnhighlight(timing, this);
      }
    }
  }

  protected onUnhighlight(timing: Timing | boolean): void {
    this.modifyMood(Feel.default, [Feel.selected, void 0]);
    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor !== void 0) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
    const selectedView = this.getChildView("selected") as HtmlView | null;
    if (selectedView !== null) {
      let selectedColor = this.getLook(Look.accentColor);
      if (selectedColor !== void 0) {
        selectedColor = selectedColor.alpha(0);
      }
      selectedView.backgroundColor.setAutoState(selectedColor, timing);
    }
  }

  protected didUnhighlight(timing: Timing | boolean): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.leafDidUnhighlight !== void 0) {
        viewObserver.leafDidUnhighlight(timing, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.leafDidUnhighlight !== void 0) {
      viewController.leafDidUnhighlight(timing, this);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor !== void 0 && !this.highlighted.state) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
    const selectedView = this.getChildView("selected") as HtmlView | null;
    if (selectedView !== null) {
      let selectedColor = this.getLook(Look.accentColor);
      if (selectedColor !== void 0 && !this.highlighted.state) {
        selectedColor = selectedColor.alpha(0);
      }
      selectedView.backgroundColor.setAutoState(selectedColor, timing);
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof TreeCell) {
      this.onInsertCell(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof TreeCell) {
      this.onRemoveCell(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertCell(cell: TreeCell): void {
    cell.position.setAutoState("absolute");
    cell.top.setAutoState(0);
    cell.bottom.setAutoState(0);
  }

  protected onRemoveCell(cell: TreeCell): void {
    // hook
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildViews(displayFlags, viewContext, displayChildView);
    } else {
      super.displayChildViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    const seed = this.seed.state;
    const height = this.height.state;
    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (childView instanceof TreeCell) {
        const key = childView.key;
        const root = seed !== void 0 && key !== void 0 ? seed.getRoot(key) : null;
        if (root !== null) {
          childView.display.setAutoState(!root.hidden ? "flex" : "none");
          const left = root.left;
          childView.left.setAutoState(left !== null ? left : void 0);
          const width = root.width;
          childView.width.setAutoState(width !== null ? width : void 0);
          childView.height.setAutoState(height);
        } else {
          childView.display.setAutoState("none");
          childView.left.setAutoState(void 0);
          childView.width.setAutoState(void 0);
          childView.height.setAutoState(void 0);
        }
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);
  }

  didEndPress(input: PositionGestureInput, event: Event | null): void {
    super.didEndPress(input, event);
    let target = input.target;
    while (target !== null && target !== this.node) {
      const targetView = (target as ViewNode).view;
      if (targetView instanceof TreeCell) {
        targetView.didPress(input, event);
        break;
      }
      target = target instanceof Node ? target.parentNode : null;
    }
  }

  didPress(input: PositionGestureInput, event: Event | null): void {
    if (!input.defaultPrevented) {
      const viewObservers = this.viewObservers;
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        if (viewObserver.leafDidPress !== void 0) {
          viewObserver.leafDidPress(input, event, this);
        }
      }
      const viewController = this.viewController;
      if (viewController !== null && viewController.leafDidPress !== void 0) {
        viewController.leafDidPress(input, event, this);
      }
    }
  }

  didLongPress(input: PositionGestureInput): void {
    let target = input.target;
    while (target !== null && target !== this.node) {
      const targetView = (target as ViewNode).view;
      if (targetView instanceof TreeCell) {
        targetView.didLongPress(input);
        break;
      }
      target = target instanceof Node ? target.parentNode : null;
    }

    if (!input.defaultPrevented) {
      const viewObservers = this.viewObservers;
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        if (viewObserver.leafDidLongPress !== void 0) {
          viewObserver.leafDidLongPress(input, this);
        }
      }
      const viewController = this.viewController;
      if (viewController !== null && viewController.leafDidLongPress !== void 0) {
        viewController.leafDidLongPress(input, this);
      }
    }
  }

  static fromInit(init: TreeLeafInit): TreeLeaf {
    const view = TreeLeaf.create();
    view.initView(init);
    return view;
  }

  static fromAny<S extends HtmlViewConstructor<InstanceType<S>>>(this: S, value: InstanceType<S> | HTMLElement): InstanceType<S>;
  static fromAny(value: AnyTreeLeaf): TreeLeaf;
  static fromAny(value: AnyTreeLeaf): TreeLeaf {
    if (value instanceof this) {
      return value;
    } else if (value instanceof HTMLElement) {
      return this.fromNode(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
