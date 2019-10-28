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
import {SecondaryAction} from "./SecondaryAction";

export interface PrimaryActionObserver {
  primaryActionWillInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void;

  primaryActionDidInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void;

  primaryActionWillRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void;

  primaryActionDidRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void;

  primaryActionWillExpand(actionView: HtmlView): void;

  primaryActionDidExpand(actionView: HtmlView): void;

  primaryActionWillCollapse(actionView: HtmlView): void;

  primaryActionDidCollapse(actionView: HtmlView): void;

  primaryActionDidActivate(actionView: HtmlView): void;
}
