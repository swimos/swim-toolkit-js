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

import {SvgView} from "@swim/dom";
import {IconButton} from "@swim/button";
import type {DrawerView} from "./DrawerView";

export class DrawerButton extends IconButton {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "drawerView", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    super.initNode(node);
    this.addClass("drawer-button");
  }

  protected initChildren(): void {
    this.setIcon(this.createIcon());
  }

  protected createIcon(): SvgView {
    const icon = SvgView.create().width(24).height(24).viewBox("0 0 24 24");
    icon.append("path").d("M21,17 L21,19 L3,19 L3,17 L21,17 Z M21,11 L21,13 L3,13 L3,11 L21,11 Z M3,5 L3,7 L21,7 L21,5 L3,5 Z");
    return icon;
  }

  declare readonly drawerView: DrawerView | null;

  setDrawerView(drawerView: DrawerView | null): void {
    Object.defineProperty(this, "drawerView", {
      value: drawerView,
      enumerable: true,
      configurable: true,
    });
  }

  protected onClick(event: MouseEvent): void {
    super.onClick(event);
    const drawerView = this.drawerView;
    if (drawerView !== null) {
      drawerView.toggle();
    }
  }
}
