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

import {HtmlView} from "@swim/view";
import {Indicator, Widget, Activity, Shortcut, Entity, EntityObserver} from "@swim/shell";
import {MenuSheet, LeafView, LeafViewController, TreeView} from "@swim/prism";
import {EntityMenuSheetController} from "./EntityMenuSheetController";

export class EntityLeafController extends LeafViewController implements EntityObserver {
  /** @hidden */
  readonly _model: Entity;
  /** @hidden */
  readonly _childLeafs: LeafView[];
  /** @hidden */
  _menuSheet: MenuSheet | null;

  constructor(model: Entity) {
    super();
    this._model = model;
    this._childLeafs = [];
    this._menuSheet = null;
  }

  get model(): Entity {
    return this._model;
  }

  get childCount(): number {
    return this._model.childCount;
  }

  get descendantCount(): number {
    let descendantCount = 1;
    const childLeafs = this._childLeafs;
    for (let i = 0, n = childLeafs.length; i < n; i += 1) {
      const childLeafController = childLeafs[i].viewController;
      if (childLeafController instanceof EntityLeafController && childLeafController.expanded) {
        descendantCount += childLeafController.descendantCount;
      } else {
        descendantCount += 1;
      }
    }
    return descendantCount;
  }

  get menuSheet(): MenuSheet {
    let menuSheet = this._menuSheet;
    if (!menuSheet) {
      menuSheet = this.createLeafMenuSheet();
      const menuSheetController = this.createMenuSheetController(this._model);
      menuSheet.setViewController(menuSheetController);
      this._menuSheet = menuSheet;
    }
    return menuSheet;
  }

  protected createLeafMenuSheet(): MenuSheet {
    const menuSheet = new MenuSheet();
    menuSheet.hidePopover(false);
    return menuSheet;
  }

  protected createMenuSheetController(entity: Entity): EntityMenuSheetController {
    return new EntityMenuSheetController(entity);
  }

  protected didSetView(view: LeafView | null): void {
    if (view !== null) {
      view.avatarIcon(this._model.createIcon());
      view.titleView(this._model.name);
      view.setExpandable(this._model.childCount !== 0);
      if (view.isMounted()) {
        this._model.addObserver(this);
      }
    } else {
      this._model.removeObserver(this);
    }
  }

  viewWillMount(view: LeafView): void {
    this._model.addObserver(this);
  }

  viewDidUnmount(view: LeafView): void {
    this._model.removeObserver(this);
  }

  protected createLeafView(): LeafView {
    return HtmlView.create(LeafView);
  }

  protected createLeafController(entity: Entity): EntityLeafController {
    return new EntityLeafController(entity);
  }

  insertChild(child: Entity, index: number): void {
    const leafView = this.createLeafView();
    leafView.setDepth(this._view!.depth + 1, false);
    const leafController = this.createLeafController(child);
    leafView.setViewController(leafController);

    const childLeafs = this._childLeafs;
    childLeafs.splice(index, 0, leafView);

    const parentView = this.parentView;
    if (parentView instanceof TreeView && this.expanded) {
      let parentIndex = parentView.childViews.indexOf(this._view!) + 1;
      for (let i = 0; i < index; i += 1) {
        const childLeafController = childLeafs[i].viewController;
        if (childLeafController instanceof EntityLeafController) {
          parentIndex += childLeafController.descendantCount;
        } else {
          parentIndex += 1;
        }
      }
      parentView.insertChildNode(leafView.node, parentView.node.childNodes[parentIndex] || null);
    }
  }

  removeChild(child: Entity, index: number): void {
    const childLeafs = this._childLeafs;
    const leafView = childLeafs[index];
    childLeafs.splice(index, 1);
    leafView.remove();
  }

  entityWillSetChildCount(childCount: number): void {
    // stub
  }

  entityDidSetChildCount(childCount: number): void {
    const view = this._view;
    if (view !== null) {
      view.setExpandable(childCount !== 0);
    }
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

  leafWillSelect(view: LeafView): void {
    this._model.willSelect();
  }

  leafDidSelect(view: LeafView): void {
    this._model.didSelect();
  }

  leafWillDeselect(view: LeafView): void {
    this._model.willDeselect();
  }

  leafDidDeselect(view: LeafView): void {
    this._model.didDeselect();
  }

  leafWillFocus(view: LeafView): void {
    this._model.willFocus();
  }

  leafDidFocus(view: LeafView): void {
    this._model.didFocus();
  }

  leafWillDefocus(view: LeafView): void {
    this._model.willDefocus();
  }

  leafDidDefocus(view: LeafView): void {
    this._model.didDefocus();
  }

  leafWillExpand(view: LeafView): void {
    this._model.willExpand();
    const parentView = this.parentView;
    if (parentView instanceof TreeView) {
      let index = parentView.childViews.indexOf(view) + 1;
      const childLeafs = this._childLeafs;
      for (let i = 0, n = childLeafs.length; i < n; i += 1) {
        const childLeaf = childLeafs[i];
        parentView.insertChildNode(childLeaf.node, parentView.node.childNodes[index] || null);
        index += 1;
      }
    }
  }

  leafDidExpand(view: LeafView): void {
    this._model.didExpand();
  }

  leafWillCollapse(view: LeafView): void {
    this._model.willCollapse();
    const childLeafs = this._childLeafs;
    for (let i = 0, n = childLeafs.length; i < n; i += 1) {
      const childLeaf = childLeafs[i];
      childLeaf.remove();
      childLeaf.collapse();
    }
  }

  leafDidCollapse(view: LeafView): void {
    this._model.didCollapse();
  }
}
