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

import {ViewContextType, ViewFlags, View, ViewProperty} from "@swim/view";
import {HtmlViewConstructor, HtmlViewInit, HtmlView} from "@swim/dom";
import {AnyTreeSeed, TreeSeed} from "./TreeSeed";
import {AnyTreeVein, TreeVein} from "./TreeVein";
import type {TreeStemObserver} from "./TreeStemObserver";
import type {TreeStemController} from "./TreeStemController";

export type AnyTreeStem = TreeStem | TreeStemInit | HTMLElement;

export interface TreeStemInit extends HtmlViewInit {
  viewController?: TreeStemController;

  veins?: AnyTreeVein[];
}

export class TreeStem extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.initStem();
  }

  protected initStem(): void {
    this.addClass("tree-stem");
    this.position.setAutoState("relative");
    this.height.setAutoState(60);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: TreeStemController | null;

  declare readonly viewObservers: ReadonlyArray<TreeStemObserver>;

  initView(init: TreeStemInit): void {
    super.initView(init);
    if (init.veins !== void 0) {
      this.addVeins(init.veins);
    }
  }

  addVein(vein: AnyTreeVein, key?: string): TreeVein {
    if (key === void 0 && "key" in vein) {
      key = vein.key;
    }
    vein = TreeVein.fromAny(vein);
    this.appendChildView(vein, key);
    return vein;
  }

  addVeins(veins: ReadonlyArray<AnyTreeVein>): void {
    for (let i = 0, n = veins.length; i < n; i += 1) {
      this.addVein(veins[i]!);
    }
  }

  @ViewProperty({type: TreeSeed, inherit: true})
  declare seed: ViewProperty<this, TreeSeed | undefined, AnyTreeSeed | undefined>;

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    if (childView instanceof TreeVein) {
      this.onInsertVein(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    if (childView instanceof TreeVein) {
      this.onRemoveVein(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertVein(vein: TreeVein): void {
    vein.position.setAutoState("absolute");
    vein.top.setAutoState(0);
    vein.bottom.setAutoState(0);
  }

  protected onRemoveVein(vein: TreeVein): void {
    // hook
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    if ((displayFlags & View.NeedsLayout) !== 0) {
      this.layoutChildViews(displayFlags, viewContext, displayChildView);
    } else {
      super.displayChildViews(displayFlags, viewContext, displayChildView);
    }
  }

  protected layoutChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                             displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                viewContext: ViewContextType<this>) => void): void {
    const seed = this.seed.state;
    const height = this.height.state;
    type self = this;
    function layoutChildView(this: self, childView: View, displayFlags: ViewFlags,
                             viewContext: ViewContextType<self>): void {
      if (childView instanceof TreeVein) {
        const key = childView.key;
        const root = seed !== void 0 && key !== void 0 ? seed.getRoot(key) : null;
        if (root !== null) {
          childView.display.setAutoState(!root.hidden ? "flex" : "none");
          const left = root.left;
          childView.left.setAutoState(left !== null ? left : void 0);
          const width = root.width;
          childView.width.setAutoState(width !== null ? width : void 0);
          childView.height.setAutoState(height);
        } else {
          childView.display.setAutoState("none");
          childView.left.setAutoState(void 0);
          childView.width.setAutoState(void 0);
          childView.height.setAutoState(void 0);
        }
      }
      displayChildView.call(this, childView, displayFlags, viewContext);
    }
    super.displayChildViews(displayFlags, viewContext, layoutChildView);
  }

  static fromInit(init: TreeStemInit): TreeStem {
    const view = TreeStem.create();
    view.initView(init);
    return view;
  }

  static fromAny<S extends HtmlViewConstructor<InstanceType<S>>>(this: S, value: InstanceType<S> | HTMLElement): InstanceType<S>;
  static fromAny(value: AnyTreeStem): TreeStem;
  static fromAny(value: AnyTreeStem): TreeStem {
    if (value instanceof this) {
      return value;
    } else if (value instanceof HTMLElement) {
      return this.fromNode(value);
    } else if (typeof value === "object" && value !== null) {
      return this.fromInit(value);
    }
    throw new TypeError("" + value);
  }
}
