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

import {Color} from "@swim/color";
import {Ease, Tween, Transition} from "@swim/transition";
import {BoxShadow} from "@swim/style";
import {LayoutAnchor, View, HtmlView} from "@swim/view";
import {AccountItem} from "../account/AccountItem";
import {SettingsItem} from "../settings/SettingsItem";
import {RackView} from "../rack/RackView";
import {CabinetViewController} from "./CabinetViewController";
import {ShellView} from "../shell/ShellView";

export type CabinetState = "shown" | "showing"
                         | "hidden" | "hiding"
                         | "collapsed" | "collapsing";

export class CabinetView extends HtmlView {
  /** @hidden */
  _viewController: CabinetViewController | null;
  /** @hidden */
  _cabinetState: CabinetState;
  /** @hidden */
  _cabinetTransition: Transition<any>;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);

    this._cabinetState = "hidden";
    this._cabinetTransition = Transition.duration(250, Ease.cubicOut);

    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("cabinet")
        .position("relative")
        .display("none")
        .flexDirection("column")
        .width(200)
        .overflowX("hidden")
        .overflowY("auto")
        .backgroundColor("#26282a");
    this._node.style.setProperty("-webkit-overflow-scrolling", "touch");
  }

  protected initChildren(): void {
    this.append(AccountItem, "account");
    this.append(RackView, "rack");
    this.append(SettingsItem, "settings");
  }

  get viewController(): CabinetViewController | null {
    return this._viewController;
  }

  get account(): AccountItem | null {
    const childView = this.getChildView("account");
    return childView instanceof AccountItem ? childView : null;
  }

  get rack(): RackView | null {
    const childView = this.getChildView("rack");
    return childView instanceof RackView ? childView : null;
  }

  get settings(): SettingsItem | null {
    const childView = this.getChildView("settings");
    return childView instanceof SettingsItem ? childView : null;
  }

  @LayoutAnchor("strong")
  expandedWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  collapsedWidth: LayoutAnchor<this>;

  protected onMount(): void {
    this.on("click", this.onClick);
    this.onResize();
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      if (appView.isMobile()) {
        this.borderRightColor(Color.transparent());
        this.boxShadow.setState(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)));
      } else {
        this.borderRightColor(Color.black());
        this.boxShadow.setState(void 0);
      }
    }
  }

  /** @hidden */
  updateLayoutValues(): void {
    if (this._cabinetState === "shown") {
      this.width(this.expandedWidth.value);
    } else if (this._cabinetState === "collapsed") {
      this.width(this.collapsedWidth.value);
    }
    super.updateLayoutValues();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "account" && childView instanceof AccountItem) {
      this.onInsertAccount(childView);
    } else if (childKey === "rack" && childView instanceof RackView) {
      this.onInsertRack(childView);
    } else if (childKey === "settings" && childView instanceof SettingsItem) {
      this.onInsertSettings(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "account" && childView instanceof AccountItem) {
      this.onRemoveAccount(childView);
    } else if (childKey === "rack" && childView instanceof RackView) {
      this.onRemoveRack(childView);
    } else if (childKey === "settings" && childView instanceof SettingsItem) {
      this.onRemoveSettings(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertAccount(account: AccountItem): void {
    account.flexShrink(0);
  }

  protected onRemoveAccount(account: AccountItem): void {
    // stub
  }

  protected onInsertRack(rack: RackView): void {
    rack.flexGrow(1)
        .flexShrink(0);
  }

  protected onRemoveRack(rack: RackView): void {
    // stub
  }

  protected onInsertSettings(settings: SettingsItem): void {
    settings.flexShrink(0);
  }

  protected onRemoveSettings(settings: SettingsItem): void {
    // stub
  }

  show(tween?: Tween<any>): void {
    if (this._cabinetState !== "shown" && this._cabinetState !== "showing") {
      if (tween === void 0 || tween === true) {
        tween = this._cabinetTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willShow();
      const rack = this.rack;
      if (rack) {
        rack.expand(false);
      }
      const settings = this.settings;
      if (settings) {
        settings.expand(false);
      }
      this.width(this.expandedWidth.value, false);
      if (tween) {
        tween = tween.onEnd(this.didShow.bind(this));
        this.left(-this.expandedWidth.value)
            .left(0, tween);
      } else {
        this.left(0);
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.willShowCabinet(this);
    }
    this._cabinetState = "showing";
  }

  protected didShow(): void {
    this._cabinetState = "shown";
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.didShowCabinet(this);
    }
  }

  hide(tween?: Tween<any>): void {
    if (this._cabinetState !== "hidden" && this._cabinetState !== "hiding") {
      if (tween === void 0 || tween === true) {
        tween = this._cabinetTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willHide();
      if (tween) {
        tween = tween.onEnd(this.didHide.bind(this));
        this.left(0)
            .left(-this.expandedWidth.value, tween);
      } else {
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.willHideCabinet(this);
    }
    this._cabinetState = "hiding";
  }

  protected didHide(): void {
    this._cabinetState = "hidden";
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.didHideCabinet(this);
    }
  }

  expand(tween?: Tween<any>): void {
    if (this._cabinetState !== "shown" && this._cabinetState !== "showing") {
      if (tween === void 0 || tween === true) {
        tween = this._cabinetTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willExpand();
      const rack = this.rack;
      if (rack) {
        rack.expand(tween);
      }
      const settings = this.settings;
      if (settings) {
        settings.expand(tween);
      }
      if (tween) {
        tween = tween.onEnd(this.didExpand.bind(this));
        this.width(this.expandedWidth.value, tween);
      } else {
        this.width(this.expandedWidth.value);
        this.didExpand();
      }
    }
  }

  protected willExpand(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.willExpandCabinet(this);
    }
    this._cabinetState = "showing";
  }

  protected didExpand(): void {
    this._cabinetState = "shown";
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.didExpandCabinet(this);
    }
  }

  collapse(tween?: Tween<any>): void {
    if (this._cabinetState !== "collapsed" && this._cabinetState !== "collapsing") {
      if (tween === void 0 || tween === true) {
        tween = this._cabinetTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willCollapse();
      const rack = this.rack;
      if (rack) {
        rack.collapse(tween);
      }
      const settings = this.settings;
      if (settings) {
        settings.collapse(tween);
      }
      if (tween) {
        tween = tween.onEnd(this.didCollapse.bind(this));
        this.width(this.collapsedWidth.value, tween);
      } else {
        this.width(this.collapsedWidth.value);
        this.didCollapse();
      }
    }
  }

  protected willCollapse(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.willCollapseCabinet(this);
    }
    this._cabinetState = "collapsing";
  }

  protected didCollapse(): void {
    this._cabinetState = "collapsed";
    const appView = this.appView;
    if (appView instanceof ShellView) {
      appView.didCollapseCabinet(this);
    }
  }

  toggle(tween?: Tween<any>): void {
    const appView = this.appView;
    if (this._cabinetState === "hidden" || this._cabinetState === "hiding") {
      this.show(tween);
    } else if (this._cabinetState === "collapsed" || this._cabinetState === "collapsing") {
      this.expand(tween);
    } else if (appView instanceof ShellView && appView.isMobile()) {
      this.hide(tween);
    } else {
      this.collapse(tween);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    const appView = this.appView;
    if (appView) {
      appView.hidePopovers();
    }
  }
}
