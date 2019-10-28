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

import {HtmlView, HtmlAppView} from "@swim/view";
import {Activity, Shortcut, Entity} from "@swim/shell";
import {MenuSeparator, MenuItem, MenuItemController, MenuSheet, MenuSheetController} from "@swim/prism";
import {ActivityMenuItemController} from "./ActivityMenuItemController";
import {ShortcutMenuItemController} from "./ShortcutMenuItemController";

export class EntityMenuSheetController extends MenuSheetController {
  /** @hidden */
  readonly _model: Entity;

  constructor(model: Entity) {
    super();
    this._model = model;
  }

  get model(): Entity {
    return this._model;
  }

  protected didSetView(view: MenuSheet | null): void {
    if (view !== null) {
      let k = 0;
      const activities = this._model.activities;
      const activityCount = activities.length;
      const shortcuts = this._model.shortcuts;
      const shortcutCount = shortcuts.length;
      for (let i = 0; i < activityCount; i += 1) {
        this.insertActivity(activities[i], k);
        k += 1;
      }
      if (activityCount > 0 && shortcutCount > 0) {
        this.view!.append(MenuSeparator);
        k += 1;
      }
      for (let i = 0; i < shortcutCount; i += 1) {
        this.insertShortcut(shortcuts[i], k);
        k += 1;
      }
    }
  }

  protected createMenuItem(): MenuItem {
    return HtmlView.create(MenuItem);
  }

  protected createActivityMenuItemController(activity: Activity): ActivityMenuItemController {
    return new ActivityMenuItemController(activity);
  }

  insertActivity(activity: Activity, index: number): void {
    const menuItem = this.createMenuItem().key(activity.name);
    const activityController = this.createActivityMenuItemController(activity);
    menuItem.setViewController(activityController);
    this.view!.insertChildNode(menuItem.node, this.view!.node.childNodes[1 + index] || null);
  }

  protected createShortcutMenuItemController(shortcut: Shortcut): ShortcutMenuItemController {
    return new ShortcutMenuItemController(shortcut);
  }

  insertShortcut(shortcut: Shortcut, index: number): void {
    const menuItem = this.createMenuItem().key(shortcut.name);
    const shortcutController = this.createShortcutMenuItemController(shortcut);
    menuItem.setViewController(shortcutController);
    const activityCount = this._model.activities.length;
    if (activityCount > 0) {
      index += activityCount + 1;
    }
    this.view!.insertChildNode(menuItem.node, this.view!.node.childNodes[1 + index] || null);
  }

  menuDidPressItem(item: MenuItem, sheet: MenuSheet): void {
    const menuController = item.viewController;
    if (menuController instanceof MenuItemController) {
      const appView = this.appView;
      const actionSheet = menuController.activate();
      if (actionSheet && appView instanceof HtmlAppView) {
        actionSheet.setSource(this.source);
        appView.togglePopover(actionSheet, {modal: true});
      }
    }
  }
}
