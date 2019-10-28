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

import {HtmlAppViewObserver} from "@swim/view";
import {CabinetView} from "../cabinet/CabinetView";
import {InspectorView} from "../inspector/InspectorView";
import {ShellView} from "./ShellView";

export interface ShellViewObserver<V extends ShellView = ShellView> extends HtmlAppViewObserver<V> {
  shellWillSearch?(query: string, view: V): void;

  shellDidSearch?(query: string, view: V): void;

  shellWillDefocus?(view: V): void;

  shellDidDefocus?(view: V): void;

  shellWillShowCabinet?(cabinet: CabinetView, view: V): void;

  shellDidShowCabinet?(cabinet: CabinetView, view: V): void;

  shellWillHideCabinet?(cabinet: CabinetView, view: V): void;

  shellDidHideCabinet?(cabinet: CabinetView, view: V): void;

  shellWillShowInspector?(inspector: InspectorView, view: V): void;

  shellDidShowInspector?(inspector: InspectorView, view: V): void;

  shellWillHideInspector?(inspector: InspectorView, view: V): void;

  shellDidHideInspector?(inspector: InspectorView, view: V): void;
}
