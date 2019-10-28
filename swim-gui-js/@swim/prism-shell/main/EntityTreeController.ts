// Copyright 2015-2019 SWIM.AI inc.
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

import {View, HtmlView} from "@swim/view";
import {Indicator, Widget, Activity, Shortcut, PrimaryAction, Entity, EntityObserver} from "@swim/shell";
import {LeafView, TreeView, TreeViewController, ShellView} from "@swim/prism";
import {PrimaryActionStackController} from "./PrimaryActionStackController";
import {EntityLeafController} from "./EntityLeafController";
import {EntityInspectorController} from "./EntityInspectorController";
import {PortalShellController} from "./PortalShellController";

export class EntityTreeController extends TreeViewController implements EntityObserver {
  /** @hidden */
  readonly _shellController: PortalShellController;
  /** @hidden */
  readonly _model: Entity;
  /** @hidden */
  readonly _selectedLeafs: LeafView[];
  /** @hidden */
  readonly _primaryAction: PrimaryAction | null;
  /** @hidden */
  _focussedLeaf: LeafView | null;

  constructor(shellController: PortalShellController, model: Entity,
              primaryAction: PrimaryAction | null) {
    super();
    this._shellController = shellController;
    this._model = model;
    this._selectedLeafs = [];
    this._focussedLeaf = null;
    this._primaryAction = primaryAction;
  }

  get shellController(): PortalShellController {
    return this._shellController;
  }

  get model(): Entity {
    return this._model;
  }

  get primaryAction(): PrimaryAction | null {
    return this._primaryAction;
  }

  protected didSetView(view: TreeView | null): void {
    if (view !== null) {
      view.removeAll();
      const children = this._model.children;
      for (let i = 0, n = children.length; i < n; i += 1) {
        this.insertChild(children[i], i);
      }
      const actionStackController = this.createActionStackController(this._primaryAction);
      this._shellController.setActionStackController(actionStackController);
      if (view.isMounted()) {
        this._model.addObserver(this);
      }
    } else {
      this._model.removeObserver(this);
    }
  }

  viewWillMount(view: TreeView): void {
    this._model.addObserver(this);
  }

  viewDidUnmount(view: TreeView): void {
    this._model.removeObserver(this);
  }

  viewWillRemoveChildView(childView: View, view: TreeView): void {
    if (childView instanceof LeafView) {
      this.deselectLeaf(childView);
    }
  }

  protected createLeafView(): LeafView {
    return HtmlView.create(LeafView);
  }

  protected createLeafController(entity: Entity): EntityLeafController {
    return new EntityLeafController(entity);
  }

  insertChild(child: Entity, index: number): void {
    const leafView = this.createLeafView();
    const leafController = this.createLeafController(child);
    leafView.setViewController(leafController);
    const childViews = this._view!.childViews;
    let parentIndex = 0;
    for (let i = 0; i < index; i += 1) {
      const childLeafController = childViews[parentIndex].viewController;
      if (childLeafController instanceof EntityLeafController) {
        parentIndex += childLeafController.descendantCount;
      } else {
        parentIndex += 1;
      }
    }
    this.view!.insertChildNode(leafView.node, this.view!.node.childNodes[parentIndex] || null);
  }

  removeChild(child: Entity, index: number): void {
    const childViews = this._view!.childViews;
    let parentIndex = 0;
    for (let i = 0; i < index; i += 1) {
      const childLeafController = childViews[parentIndex].viewController;
      if (childLeafController instanceof EntityLeafController) {
        parentIndex += childLeafController.descendantCount;
      } else {
        parentIndex += 1;
      }
    }
    this.removeChildView(childViews[parentIndex]);
  }

  createActionStackController(primaryAction: PrimaryAction | null): PrimaryActionStackController | null {
    return primaryAction ? new PrimaryActionStackController(primaryAction) : null;
  }

  entityWillSetChildCount(childCount: number): void {
    // stub
  }

  entityDidSetChildCount(childCount: number): void {
    // stub
  }

  entityWillInsertChild(child: Entity, index: number): void {
    // stub
  }

  entityDidInsertChild(child: Entity, index: number): void {
    this.insertChild(child, index);
  }

  entityWillRemoveChild(child: Entity, index: number): void {
    // stub
  }

  entityDidRemoveChild(child: Entity, index: number): void {
    this.removeChild(child, index);
  }

  entityWillInsertIndicator(indicator: Indicator, index: number): void {
    // stub
  }

  entityDidInsertIndicator(indicator: Indicator, index: number): void {
    // stub
  }

  entityWillInsertWidget(widget: Widget, index: number): void {
    // stub
  }

  entityDidInsertWidget(widget: Widget, index: number): void {
    // stub
  }

  entityWillInsertActivity(activity: Activity, index: number): void {
    // stub
  }

  entityDidInsertActivity(activity: Activity, index: number): void {
    // stub
  }

  entityWillInsertShortcut(shortcut: Shortcut, index: number): void {
    // stub
  }

  entityDidInsertShortcut(shortcut: Shortcut, index: number): void {
    // stub
  }

  protected createInspectorController(leafController: EntityLeafController): EntityInspectorController {
    return new EntityInspectorController(leafController);
  }

  get selectedLeafs(): ReadonlyArray<LeafView> {
    return this._selectedLeafs;
  }

  get focussedLeaf(): LeafView | null {
    return this._focussedLeaf;
  }

  treeDidPressLeafDown(leaf: LeafView, view: TreeView): void {
    // stub
  }

  treeDidPressLeafHold(leaf: LeafView, view: TreeView): void {
    if (this._selectedLeafs.indexOf(leaf) < 0) {
      leaf.highlight();
    } else {
      leaf.unhighlight();
    }
  }

  treeDidPressLeafUp(duration: number, multi: boolean, leaf: LeafView, view: TreeView): void {
    const appView = this.appView;
    const isMobile = appView instanceof ShellView && appView.isMobile();
    if (this._selectedLeafs.indexOf(leaf) < 0) {
      if (isMobile && duration < 500) {
        this.activateLeaf(leaf);
      } else {
        this.selectLeaf(leaf, isMobile || multi || duration >= 500);
      }
    } else {
      if (isMobile && duration < 500) {
        this.activateLeaf(leaf);
      } else if (isMobile || multi || duration >= 500) {
        this.deselectLeaf(leaf);
      } else {
        this.selectLeaf(leaf, false);
      }
    }
  }

  treeDidPressLeafAvatar(leaf: LeafView, view: TreeView): void {
    this.treeDidPressLeafUp(0, false, leaf, view);
  }

  treeDidPressLeafArrow(leaf: LeafView, view: TreeView): void {
    leaf.toggle();
  }

  activateLeaf(leaf: LeafView): void {
    this.willActivateLeaf(leaf);
    this.focusLeaf(leaf);
    this.didActivateLeaf(leaf);
  }

  protected willActivateLeaf(leaf: LeafView): void {
    // stub
  }

  protected didActivateLeaf(leaf: LeafView): void {
    const leafController = leaf.viewController;
    if (leafController instanceof EntityLeafController) {
      const inspectorController = this.createInspectorController(leafController);
      this._shellController.showInspector(inspectorController);
      const actionStackController = this.createActionStackController(leafController.model.primaryAction);
      this._shellController.setActionStackController(actionStackController);
    }
  }

  focusLeaf(leaf: LeafView): void {
    if (this._focussedLeaf !== leaf) {
      this.defocusLeaf();
      this.willFocusLeaf(leaf);
      leaf.willFocus();
      this._focussedLeaf = leaf;
      leaf._focussed = true;
      leaf.highlight(true);
      leaf.didFocus();
      this.didFocusLeaf(leaf);
    }
  }

  protected willFocusLeaf(leaf: LeafView): void {
    // stub
  }

  protected didFocusLeaf(leaf: LeafView): void {
    const appView = this.appView;
    if (appView instanceof ShellView && !appView.isMobile()) {
      const leafController = leaf.viewController;
      if (leafController instanceof EntityLeafController) {
        const inspectorController = this.createInspectorController(leafController);
        this._shellController.showInspector(inspectorController);
        const actionStackController = this.createActionStackController(leafController.model.primaryAction);
        this._shellController.setActionStackController(actionStackController);
      }
    }
  }

  defocusLeaf(leaf: LeafView | null = this._focussedLeaf): void {
    if (this._focussedLeaf === leaf && leaf) {
      this.willDefocusLeaf(leaf);
      leaf.willDefocus();
      this._focussedLeaf = null;
      leaf._focussed = false;
      if (this._selectedLeafs.indexOf(leaf) < 0) {
        leaf.unhighlight(true);
      }
      leaf.didDefocus();
      this.didDefocusLeaf(leaf);
    }
  }

  protected willDefocusLeaf(leaf: LeafView): void {
    // stub
  }

  protected didDefocusLeaf(leaf: LeafView): void {
    this._shellController.defocusInspector();
  }

  defocus(): void {
    this.willDefocus();
    this.defocusActionStack();
    this.defocusLeaf();
    this.didDefocus();
  }

  protected willDefocus(): void {
    // stub
  }

  protected didDefocus(): void {
    // stub
  }

  selectLeaf(leaf: LeafView, multi: boolean): void {
    let alreadySelected = false;
    if (!multi) {
      for (let i = this._selectedLeafs.length - 1; i >= 0; i -= 1) {
        const selectedLeaf = this._selectedLeafs[i];
        if (selectedLeaf !== leaf) {
          this.willDeselectLeaf(selectedLeaf);
          leaf.willDeselect();
          this._selectedLeafs.splice(i, 1);
          if (this._focussedLeaf !== selectedLeaf) {
            selectedLeaf.unhighlight();
          }
          leaf.didDeselect();
          this.didDeselectLeaf(selectedLeaf);
        } else {
          alreadySelected = true;
        }
      }
    }
    if (!alreadySelected) {
      this.willSelectLeaf(leaf);
      leaf.willSelect();
      this._selectedLeafs.push(leaf);
      leaf.highlight();
      leaf.didSelect();
      this.didSelectLeaf(leaf);
    }
    this.focusLeaf(leaf);
  }

  protected willSelectLeaf(leaf: LeafView): void {
    // stub
  }

  protected didSelectLeaf(leaf: LeafView): void {
    // stub
  }

  deselectLeaf(leaf: LeafView): void {
    const index = this._selectedLeafs.indexOf(leaf);
    if (index >= 0) {
      if (this._focussedLeaf === leaf) {
        this.willDefocusLeaf(leaf);
        leaf.willDefocus();
        this._focussedLeaf = null;
        leaf._focussed = false;
        leaf.didDefocus();
        this.didDefocusLeaf(leaf);
      }
      this.willDeselectLeaf(leaf);
      leaf.willDeselect();
      this._selectedLeafs.splice(index, 1);
      leaf.unhighlight(true);
      leaf.didDeselect();
      this.didDeselectLeaf(leaf);
    }
    if (this._selectedLeafs.length > 0) {
      this.focusLeaf(this._selectedLeafs[this._selectedLeafs.length - 1]);
    } else {
      this.defocus();
    }
  }

  protected willDeselectLeaf(leaf: LeafView): void {
    // stub
  }

  protected didDeselectLeaf(leaf: LeafView): void {
    // stub
  }

  deselect(): void {
    this.defocusActionStack();
    this.defocusLeaf();
    this.willDeselect();
    for (let i = this._selectedLeafs.length - 1; i >= 0; i -= 1) {
      const selectedLeaf = this._selectedLeafs[i];
      this.willDeselectLeaf(selectedLeaf);
      selectedLeaf.willDeselect();
      this._selectedLeafs.splice(i, 1);
      selectedLeaf.unhighlight(true);
      selectedLeaf.didDeselect();
      this.didDeselectLeaf(selectedLeaf);
    }
    this.didDeselect();
  }

  willDeselect(): void {
    // stub
  }

  didDeselect(): void {
    // stub
  }

  defocusActionStack(): void {
    const actionStackController = this.createActionStackController(this._primaryAction);
    this._shellController.setActionStackController(actionStackController, true);
  }
}
