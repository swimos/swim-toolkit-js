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

import {HtmlAppViewController} from "@swim/view";
import {CabinetView} from "../cabinet/CabinetView";
import {InspectorView} from "../inspector/InspectorView";
import {ShellView} from "./ShellView";
import {ShellViewObserver} from "./ShellViewObserver";

export class ShellViewController<V extends ShellView = ShellView> extends HtmlAppViewController<V> implements ShellViewObserver<V> {
  shellWillSearch(query: string, view: V): void {
    // hook
  }

  shellDidSearch(query: string, view: V): void {
    // hook
  }

  shellWillDefocus(view: V): void {
    // hook
  }

  shellDidDefocus(view: V): void {
    // hook
  }

  shellWillShowCabinet(cabinet: CabinetView, view: V): void {
    // hook
  }

  shellDidShowCabinet(cabinet: CabinetView, view: V): void {
    // hook
  }

  shellWillHideCabinet(cabinet: CabinetView, view: V): void {
    // hook
  }

  shellDidHideCabinet(cabinet: CabinetView, view: V): void {
    // hook
  }

  shellWillShowInspector(inspector: InspectorView, view: V): void {
    // hook
  }

  shellDidShowInspector(inspector: InspectorView, view: V): void {
    // hook
  }

  shellWillHideInspector(inspector: InspectorView, view: V): void {
    // hook
  }

  shellDidHideInspector(inspector: InspectorView, view: V): void {
    // hook
  }
}
