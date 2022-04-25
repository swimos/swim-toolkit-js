// Copyright 2015-2022 Swim.inc
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

import type {Class} from "@swim/util";
import {Affinity, FastenerClass} from "@swim/component";
import {Look, Feel} from "@swim/theme";
import {View, ViewRef} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {FrameView} from "../frame/FrameView";
import type {CardViewObserver} from "./CardViewObserver";

/** @public */
export class CardView extends FrameView {
  protected override initPanel(): void {
    super.initPanel();
    this.addClass("card");
    this.marginTop.setState(6, Affinity.Intrinsic);
    this.marginRight.setState(6, Affinity.Intrinsic);
    this.marginBottom.setState(6, Affinity.Intrinsic);
    this.marginLeft.setState(6, Affinity.Intrinsic);
    this.borderTopLeftRadius.setState(4, Affinity.Intrinsic);
    this.borderTopRightRadius.setState(4, Affinity.Intrinsic);
    this.borderBottomLeftRadius.setState(4, Affinity.Intrinsic);
    this.borderBottomRightRadius.setState(4, Affinity.Intrinsic);
    this.backgroundColor.setLook(Look.backgroundColor, Affinity.Intrinsic);

    this.modifyTheme(Feel.default, [[Feel.raised, 1]]);
  }

  override readonly observerType?: Class<CardViewObserver>;

  @ViewRef<CardView["header"]>({
    viewType: HtmlView,
    viewKey: true,
    binds: true,
    setTitle(title: string | undefined): HtmlView {
      this.insertView();
      return this.owner.headerTitle.setText(title);
    },
    setSubtitle(subtitle: string | undefined): HtmlView {
      this.insertView();
      return this.owner.headerSubtitle.setText(subtitle);
    },
    insertChild(parent: View, child: HtmlView, target: View | null, key: string | undefined): void {
      if (target !== null) {
        parent.insertChild(child, target, key);
      } else {
        parent.prependChild(child, key);
      }
    },
    createView(): HtmlView {
      const headerView = HtmlView.create();
      headerView.addClass("header");
      headerView.display.setState("flex", Affinity.Intrinsic);
      headerView.justifyContent.setState("space-between", Affinity.Intrinsic);
      headerView.position.setState("absolute");
      headerView.left.setState(0, Affinity.Intrinsic);
      headerView.top.setState(0, Affinity.Intrinsic);
      headerView.width.setState("100%", Affinity.Intrinsic);
      headerView.height.setState(30, Affinity.Intrinsic);
      headerView.paddingLeft.setState(12, Affinity.Intrinsic);
      headerView.paddingRight.setState(12, Affinity.Intrinsic);
      headerView.boxSizing.setState("border-box", Affinity.Intrinsic);
      headerView.userSelect.setState("none", Affinity.Intrinsic);
      headerView.zIndex.setState(1, Affinity.Intrinsic);
      return headerView;
    }
  })
  readonly header!: ViewRef<this, HtmlView> & {
    setTitle(title: string | undefined): HtmlView,
    setSubtitle(subtitle: string | undefined): HtmlView,
  };
  static readonly header: FastenerClass<CardView["header"]>;

  @ViewRef<CardView["headerTitle"]>({
    viewType: HtmlView,
    viewKey: "title",
    get parentView(): HtmlView | null {
      return this.owner.header.view;
    },
    setText(title: string | undefined): HtmlView {
      let titleView = this.view;
      if (titleView === null) {
        titleView = this.insertView(titleView);
      }
      titleView.text(title);
      return titleView;
    },
    insertChild(parent: View, child: HtmlView, target: View | null, key: string | undefined): void {
      if (target === null) {
        target = this.owner.headerSubtitle.view;
      }
      parent.insertChild(child, target, key);
    },
    createView(): HtmlView {
      const titleView = HtmlView.create();
      titleView.addClass("header-title");
      titleView.alignSelf.setState("center", Affinity.Intrinsic);
      titleView.color.setLook(Look.legendColor, Affinity.Intrinsic);
      return titleView;
    },
  })
  readonly headerTitle!: ViewRef<this, HtmlView> & {
    setText(tite: string | undefined): HtmlView,
  };
  static readonly headerTitle: FastenerClass<CardView["headerTitle"]>;

  @ViewRef<CardView["headerSubtitle"]>({
    viewType: HtmlView,
    viewKey: "subtitle",
    get parentView(): HtmlView | null {
      return this.owner.header.view;
    },
    setText(title: string | undefined): HtmlView {
      let subtitleView = this.view;
      if (subtitleView === null) {
        subtitleView = this.insertView();
      }
      subtitleView.text(title);
      return subtitleView;
    },
    createView(): HtmlView {
      const subtitleView = HtmlView.create();
      subtitleView.addClass("header-subtitle");
      subtitleView.alignSelf.setState("center", Affinity.Intrinsic);
      subtitleView.color.setLook(Look.legendColor, Affinity.Intrinsic);
      return subtitleView;
    },
  })
  readonly headerSubtitle!: ViewRef<this, HtmlView> & {
    setText(subtitle: string | undefined): HtmlView,
  };
  static readonly headerSubtitle: FastenerClass<CardView["headerSubtitle"]>;
}
