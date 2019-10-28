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

import {AnyUri, Uri} from "@swim/uri";
import {SvgView, HtmlView} from "@swim/view";
import {Indicator} from "./Indicator";
import {Widget} from "./Widget";
import {Activity} from "./Activity";
import {Shortcut} from "./Shortcut";
import {PrimaryAction} from "./PrimaryAction";
import {EntityObserver} from "./EntityObserver";

export abstract class Entity {
  /** @hidden */
  _childCount: number;
  /** @hidden */
  readonly _children: Entity[];
  /** @hidden */
  readonly _indicators: Indicator[];
  /** @hidden */
  readonly _widgets: Widget[];
  /** @hidden */
  readonly _activities: Activity[];
  /** @hidden */
  readonly _shortcuts: Shortcut[];
  /** @hidden */
  readonly _observers: EntityObserver[];

  constructor() {
    this._childCount = 0;
    this._children = [];
    this._indicators = [];
    this._widgets = [];
    this._activities = [];
    this._shortcuts = [];
    this._observers = [];
  }

  abstract get uri(): Uri;

  abstract get name(): string | null;

  createIcon(): SvgView | HtmlView | null {
    return null;
  }

  get primaryAction(): PrimaryAction | null {
    return null;
  }

  abstract get parent(): Entity | null;

  get childCount(): number {
    return this._childCount;
  }

  setChildCount(childCount: number): this {
    if (this._childCount !== childCount) {
      this.willSetChildCount(childCount);
      this._childCount = childCount;
      this.onSetChildCount(childCount);
      this.didSetChildCount(childCount);
    }
    return this;
  }

  protected willSetChildCount(childCount: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillSetChildCount(childCount);
    }
  }

  protected onSetChildCount(childCount: number): void {
    // hook
  }

  protected didSetChildCount(childCount: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidSetChildCount(childCount);
    }
  }

  get children(): ReadonlyArray<Entity> {
    return this._children;
  }

  getChild(uri: AnyUri): Entity | null {
    uri = Uri.fromAny(uri);
    for (let i = 0; i < this._children.length; i += 1) {
      const entity = this._children[i];
      if (uri.equals(entity.uri)) {
        return entity;
      }
    }
    return null;
  }

  insertChild(entity: Entity, index?: number): this {
    if (index === void 0) {
      // FIXME: binary search for insert index
      index = 0;
      for (const n = this._children.length; index < n; index += 1) {
        const child = this._children[index];
        if (child.uri.toString() > entity.uri.toString()) {
          break;
        }
      }
    } else {
      index = Math.min(Math.max(0, index), this._children.length);
    }
    this.willInsertChild(entity, index);
    this._children.splice(index, 0, entity);
    this.onInsertChild(entity, index);
    this.didInsertChild(entity, index);
    return this;
  }

  protected willInsertChild(entity: Entity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillInsertChild(entity, index);
    }
  }

  protected onInsertChild(entity: Entity, index: number): void {
    // hook
  }

  protected didInsertChild(entity: Entity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidInsertChild(entity, index);
    }
  }

  removeChild(entityUri: Uri): this {
    let entity: Entity | undefined;
    // FIXME: binary search for entity index
    let index = 0;
    for (const n = this._children.length; index < n; index += 1) {
      const child = this._children[index];
      if (child.uri.toString() === entityUri.toString()) {
        entity = child;
        break;
      }
    }
    if (entity !== void 0) {
      this.willRemoveChild(entity, index);
      this._children.splice(index, 1);
      this.onRemoveChild(entity, index);
      this.didRemoveChild(entity, index);
    }
    return this;
  }

  removeChildren(): void {
    while (this._children.length > 0) {
      const index = this._children.length - 1;
      const entity = this._children[index];
      this.willRemoveChild(entity, index);
      this._children.splice(index, 1);
      this.onRemoveChild(entity, index);
      this.didRemoveChild(entity, index);
    }
  }

  protected willRemoveChild(entity: Entity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillRemoveChild(entity, index);
    }
  }

  protected onRemoveChild(entity: Entity, index: number): void {
    // hook
  }

  protected didRemoveChild(entity: Entity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidRemoveChild(entity, index);
    }
  }

  get indicators(): ReadonlyArray<Indicator> {
    return this._indicators;
  }

  getIndicator(indicatorName: string): Indicator | null {
    const indicators = this._indicators;
    for (let i = 0, n = indicators.length; i < n; i += 1) {
      const indicator = indicators[i];
      if (indicator.name === indicatorName) {
        return indicator;
      }
    }
    return null;
  }

  insertIndicator(indicator: Indicator, index?: number): this {
    if (index === void 0) {
      index = this._indicators.length;
    } else {
      index = Math.min(Math.max(0, index), this._indicators.length);
    }
    this.willInsertIndicator(indicator, index);
    this._indicators.splice(index, 0, indicator);
    this.onInsertIndicator(indicator, index);
    this.didInsertIndicator(indicator, index);
    return this;
  }

  protected willInsertIndicator(indicator: Indicator, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillInsertIndicator(indicator, index);
    }
  }

  protected onInsertIndicator(indicator: Indicator, index: number): void {
    // hook
  }

  protected didInsertIndicator(indicator: Indicator, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidInsertIndicator(indicator, index);
    }
  }

  get widgets(): ReadonlyArray<Widget> {
    return this._widgets;
  }

  getWidget(widgetName: string): Widget | null {
    const widgets = this._widgets;
    for (let i = 0, n = widgets.length; i < n; i += 1) {
      const widget = widgets[i];
      if (widget.name === widgetName) {
        return widget;
      }
    }
    return null;
  }

  insertWidget(widget: Widget, index?: number): this {
    if (index === void 0) {
      index = this._widgets.length;
    } else {
      index = Math.min(Math.max(0, index), this._widgets.length);
    }
    this.willInsertWidget(widget, index);
    this._widgets.splice(index, 0, widget);
    this.onInsertWidget(widget, index);
    this.didInsertWidget(widget, index);
    return this;
  }

  protected willInsertWidget(widget: Widget, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillInsertWidget(widget, index);
    }
  }

  protected onInsertWidget(widget: Widget, index: number): void {
    // hook
  }

  protected didInsertWidget(widget: Widget, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidInsertWidget(widget, index);
    }
  }

  get activities(): ReadonlyArray<Activity> {
    return this._activities;
  }

  getActivity(activityName: string): Activity | null {
    const activities = this._activities;
    for (let i = 0, n = activities.length; i < n; i += 1) {
      const activity = activities[i];
      if (activity.name === activityName) {
        return activity;
      }
    }
    return null;
  }

  insertActivity(activity: Activity, index?: number): this {
    if (index === void 0) {
      index = this._activities.length;
    } else {
      index = Math.min(Math.max(0, index), this._activities.length);
    }
    this.willInsertActivity(activity, index);
    this._activities.splice(index, 0, activity);
    this.onInsertActivity(activity, index);
    this.didInsertActivity(activity, index);
    return this;
  }

  protected willInsertActivity(activity: Activity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillInsertActivity(activity, index);
    }
  }

  protected onInsertActivity(activity: Activity, index: number): void {
    // hook
  }

  protected didInsertActivity(activity: Activity, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidInsertActivity(activity, index);
    }
  }

  get shortcuts(): ReadonlyArray<Shortcut> {
    return this._shortcuts;
  }

  getShortcut(shortcutName: string): Shortcut | null {
    const shortcuts = this._shortcuts;
    for (let i = 0, n = shortcuts.length; i < n; i += 1) {
      const shortcut = shortcuts[i];
      if (shortcut.name === shortcutName) {
        return shortcut;
      }
    }
    return null;
  }

  insertShortcut(shortcut: Shortcut, index?: number): this {
    if (index === void 0) {
      index = this._shortcuts.length;
    } else {
      index = Math.min(Math.max(0, index), this._shortcuts.length);
    }
    this.willInsertShortcut(shortcut, index);
    this._shortcuts.splice(index, 0, shortcut);
    this.onInsertShortcut(shortcut, index);
    this.didInsertShortcut(shortcut, index);
    return this;
  }

  protected willInsertShortcut(shortcut: Shortcut, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityWillInsertShortcut(shortcut, index);
    }
  }

  protected onInsertShortcut(shortcut: Shortcut, index: number): void {
    // hook
  }

  protected didInsertShortcut(shortcut: Shortcut, index: number): void {
    for (let i = 0; i < this._observers.length; i += 1) {
      this._observers[i].entityDidInsertShortcut(shortcut, index);
    }
  }

  addObserver(observer: EntityObserver): void {
    if (this._observers.indexOf(observer) < 0) {
      this.willAddObserver(observer);
      this._observers.push(observer);
      this.didAddObserver(observer);
    }
  }

  removeObserver(observer: EntityObserver): void {
    const index = this._observers.indexOf(observer);
    if (index >= 0) {
      this.willRemoveObserver(observer);
      this._observers.splice(index, 1);
      this.didRemoveObserver(observer);
    }
  }

  protected willAddObserver(observer: EntityObserver): void {
    // hook
  }

  protected didAddObserver(observer: EntityObserver): void {
    // hook
  }

  protected willRemoveObserver(observer: EntityObserver): void {
    // hook
  }

  protected didRemoveObserver(observer: EntityObserver): void {
    // hook
  }

  willSelect(): void {
    // hook
  }

  didSelect(): void {
    // hook
  }

  willDeselect(): void {
    // hook
  }

  didDeselect(): void {
    // hook
  }

  willFocus(): void {
    // hook
  }

  didFocus(): void {
    // hook
  }

  willDefocus(): void {
    // hook
  }

  didDefocus(): void {
    // hook
  }

  willExpand(): void {
    // hook
  }

  didExpand(): void {
    // hook
  }

  willCollapse(): void {
    for (let i = 0; i < this._children.length; i += 1) {
      const child = this._children[i];
      child.willCollapse();
    }
  }

  didCollapse(): void {
    for (let i = 0; i < this._children.length; i += 1) {
      const child = this._children[i];
      child.didCollapse();
    }
  }
}
