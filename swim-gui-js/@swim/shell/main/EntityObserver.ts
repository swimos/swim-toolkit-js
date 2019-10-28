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

import {Indicator} from "./Indicator";
import {Widget} from "./Widget";
import {Activity} from "./Activity";
import {Shortcut} from "./Shortcut";
import {Entity} from "./Entity";

export interface EntityObserver {
  entityWillSetChildCount(childCount: number): void;

  entityDidSetChildCount(childCount: number): void;

  entityWillInsertChild(child: Entity, index: number): void;

  entityDidInsertChild(child: Entity, index: number): void;

  entityWillRemoveChild(child: Entity, index: number): void;

  entityDidRemoveChild(child: Entity, index: number): void;

  entityWillInsertIndicator(indicator: Indicator, index: number): void;

  entityDidInsertIndicator(indicator: Indicator, index: number): void;

  entityWillInsertWidget(widget: Widget, index: number): void;

  entityDidInsertWidget(widget: Widget, index: number): void;

  entityWillInsertActivity(activity: Activity, index: number): void;

  entityDidInsertActivity(activity: Activity, index: number): void;

  entityWillInsertShortcut(shortcut: Shortcut, index: number): void;

  entityDidInsertShortcut(shortcut: Shortcut, index: number): void;
}
