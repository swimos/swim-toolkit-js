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
import {InspectorView, InspectorViewController, CardView, ShellView} from "@swim/prism";
import {WidgetCardController} from "./WidgetCardController";
import {EntityLeafController} from "./EntityLeafController";

export class EntityInspectorController extends InspectorViewController implements EntityObserver {
  /** @hidden */
  readonly _leafController: EntityLeafController;
  /** @hidden */
  readonly _model: Entity;

  constructor(leafController: EntityLeafController) {
    super();
    this._leafController = leafController;
    this._model = leafController._model;
    this.onMenuClick = this.onMenuClick.bind(this);
  }

  get model(): Entity {
    return this._model;
  }

  protected willSetView(view: InspectorView | null): void {
    if (this._view !== null) {
      this._view.navBar!.menuView()!.off("click", this.onMenuClick);
    }
  }

  protected didSetView(view: InspectorView | null): void {
    if (view !== null) {
      view.navBar!.menuView()!.on("click", this.onMenuClick);

      view.cardPanel!.removeAll();

      view.navBar!.titleView(this._model.name);

      const widgets = this._model.widgets;
      const widgetCount = widgets.length;
      for (let i = 0; i < widgetCount; i += 1) {
        this.insertWidget(widgets[i], widgetCount);
      }
      if (view.isMounted()) {
        this._model.addObserver(this);
      }
    } else {
      this._model.removeObserver(this);
    }
  }

  viewWillMount(view: InspectorView): void {
    this._model.addObserver(this);
  }

  viewDidUnmount(view: InspectorView): void {
    this._model.removeObserver(this);
  }

  protected createCardView(): HtmlView {
    return HtmlView.create(CardView);
  }

  protected createCardController(widget: Widget): WidgetCardController {
    return new WidgetCardController(widget);
  }

  insertWidget(widget: Widget, index: number): void {
    const cardView = this.createCardView();
    (cardView as any).widget = widget;
    cardView.append(widget.createView());
    this._view!.cardPanel!.append(cardView);
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
    // stub
  }

  entityWillRemoveChild(child: Entity, index: number): void {
    // stub
  }

  entityDidRemoveChild(child: Entity, index: number): void {
    // stub
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
    this.insertWidget(widget, index);
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

  protected onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView instanceof ShellView) {
      const menuSheet = this._leafController.menuSheet;
      menuSheet.setSource(this._view!.navBar!.menuView());
      appView.togglePopover(menuSheet);
    }
  }
}
