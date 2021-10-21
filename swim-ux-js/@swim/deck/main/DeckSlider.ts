// Copyright 2015-2021 Swim Inc.
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

import {Mutable, Class, AnyTiming, Timing} from "@swim/util";
import {Affinity, FastenerOwner} from "@swim/fastener";
import {Length} from "@swim/math";
import type {Color} from "@swim/style";
import {Look, Mood, MoodVector, ThemeMatrix, ThemeAnimator} from "@swim/theme";
import {ViewContextType, ViewContext, View, ViewFastenerClass, ViewFastener} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {DeckSlot} from "./DeckSlot";
import type {DeckSliderObserver} from "./DeckSliderObserver";

export class DeckSlider extends DeckSlot {
  constructor(node: HTMLElement) {
    super(node);
    this.itemCount = 0;
    this.item = null;
    this.initSlider();
  }

  initSlider(): void {
    this.addClass("deck-slider");
    this.position.setState("relative", Affinity.Intrinsic);
  }

  override readonly observerType?: Class<DeckSliderObserver>;

  @ThemeAnimator({type: Number, inherits: true, updateFlags: View.NeedsLayout})
  override readonly deckPhase!: ThemeAnimator<this, number | undefined>;

  @ThemeAnimator({type: Number, state: 0.5})
  override readonly slotAlign!: ThemeAnimator<this, number>;

  override get colorLook(): Look<Color> {
    return Look.color;
  }

  /** @internal */
  itemCount: number;

  item: DeckSliderItem<this, HtmlView> | null;

  protected createItem(value: string): HtmlView {
    const itemView = HtmlView.fromTag("span");
    itemView.display.setState("flex", Affinity.Intrinsic);
    itemView.alignItems.setState("center", Affinity.Intrinsic);
    itemView.whiteSpace.setState("nowrap", Affinity.Intrinsic);
    itemView.text(value);
    return itemView;
  }

  pushItem(newItemView: HtmlView | string, timing?: AnyTiming | boolean): void {
    if (typeof newItemView === "string") {
      newItemView = this.createItem(newItemView);
    }

    const oldItemCount = this.itemCount;
    const newItemCount = oldItemCount + 1;
    this.itemCount = newItemCount;

    const oldItemKey = "item" + oldItemCount;
    const oldItemFastener = this.getFastener(oldItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
    const oldItemView = oldItemFastener !== null ? oldItemFastener.view : null;

    const newItemKey = "item" + newItemCount;
    const newItemFastener = DeckSliderItemFastener.create(this, newItemKey) as DeckSliderItem<this, HtmlView>;
    newItemFastener.itemIndex = newItemCount;
    this.willPushItem(newItemView, oldItemView);
    this.item = newItemFastener;

    this.setFastener(newItemKey, newItemFastener);
    newItemFastener.setView(newItemView);
    newItemFastener.injectView();

    if (timing === void 0 && oldItemCount === 0) {
      timing = false;
    } else if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, Mood.navigating, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    //if (this.deckPhase.superFastener === null) {
    //  this.deckPhase.setState(newItemCount, timing);
    //}
    if (timing === false) {
      this.didPushItem(newItemView, oldItemView);
    }
  }

  protected willPushItem(newItemView: HtmlView, oldItemView: HtmlView | null): void {
    this.forEachObserver(function (observer: DeckSliderObserver): void {
      if (observer.deckSliderWillPushItem !== void 0) {
        observer.deckSliderWillPushItem(newItemView, oldItemView, this);
      }
    });
  }

  protected didPushItem(newItemView: HtmlView, oldItemView: HtmlView | null): void {
    if (oldItemView !== null && oldItemView.parent === this) {
      oldItemView.remove();
    }
    this.forEachObserver(function (observer: DeckSliderObserver): void {
      if (observer.deckSliderDidPushItem !== void 0) {
        observer.deckSliderDidPushItem(newItemView, oldItemView, this);
      }
    });
  }

  popItem(timing?: AnyTiming | boolean): HtmlView | null {
    const oldItemCount = this.itemCount;
    const newItemCount = oldItemCount - 1;
    this.itemCount = newItemCount;

    const oldItemKey = "item" + oldItemCount;
    const oldItemFastener = this.getFastener(oldItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
    const oldItemView = oldItemFastener !== null ? oldItemFastener.view : null;

    if (oldItemView !== null) {
      const newItemKey = "item" + newItemCount;
      const newItemFastener = this.getFastener(newItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
      const newItemView = newItemFastener !== null ? newItemFastener.view : null;
      this.willPopItem(newItemView, oldItemView);
      this.item = newItemFastener;
      if (newItemFastener !== null) {
        newItemFastener.injectView();
      }

      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, Mood.navigating, false);
      } else {
        timing = Timing.fromAny(timing);
      }

      //if (this.deckPhase.superFastener === null) {
      //  this.deckPhase.setState(newItemCount, timing);
      //}
      if (timing === false) {
        this.didPopItem(newItemView, oldItemView);
      }
    }

    return oldItemView;
  }

  protected willPopItem(newItemView: HtmlView | null, oldItemView: HtmlView): void {
    this.forEachObserver(function (observer: DeckSliderObserver): void {
      if (observer.deckSliderWillPopItem !== void 0) {
        observer.deckSliderWillPopItem(newItemView, oldItemView, this);
      }
    });
  }

  protected didPopItem(newItemView: HtmlView | null, oldItemView: HtmlView): void {
    const oldItemKey = oldItemView.key;
    oldItemView.remove();
    if (oldItemKey !== void 0) {
      const oldItemFastener = this.getFastener(oldItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
      if (oldItemFastener !== null && oldItemFastener.itemIndex > this.itemCount) {
        this.setFastener(oldItemKey, null);
      }
    }
    this.forEachObserver(function (observer: DeckSliderObserver): void {
      if (observer.deckSliderDidPopItem !== void 0) {
        observer.deckSliderDidPopItem(newItemView, oldItemView, this);
      }
    });
  }

  protected override didLayout(viewContext: ViewContextType<this>): void {
    if (!this.deckPhase.tweening) {
      const deckPhase = this.deckPhase.value;
      if (deckPhase !== void 0) {
        const nextItemIndex = Math.round(deckPhase + 1);
        const nextItemKey = "item" + nextItemIndex;
        const nextItemFastener = this.getFastener(nextItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
        const nextItemView = nextItemFastener !== null ? nextItemFastener.view : null;
        if (nextItemView !== null) {
          this.didPopItem(this.item !== null ? this.item.view : null, nextItemView);
        } else if (this.item !== null && this.item.view !== null && Math.round(deckPhase) > 0) {
          const prevItemIndex = Math.round(deckPhase - 1);
          const prevItemKey = "item" + prevItemIndex;
          const prevItemFastener = this.getFastener(prevItemKey, ViewFastener) as DeckSliderItem<this, HtmlView> | null;
          const prevItemView = prevItemFastener !== null ? prevItemFastener.view : null;
          this.didPushItem(this.item.view, prevItemView);
        }
      }
    }
    super.didLayout(viewContext);
  }
}

/** @internal */
export interface DeckSliderItem<V extends DeckSlider = DeckSlider, T extends HtmlView = HtmlView> extends ViewFastener<V, T> {
  itemIndex: number;

  /** @internal */
  itemWidth: Length | string | null;

  /** @override */
  onSetView(itemView: T | null): void;

  /** @override */
  insertView(parent: View, childView: T, targetView: View | null, key: string | undefined): void;

  /** @protected */
  viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, itemView: T): void;

  viewDidLayout(viewContext: ViewContext, itemView: T): void;

  /** @protected */
  initItem(itemView: T): void;

  /** @protected */
  layoutItem(itemView: T): void;
}
/** @internal */
export const DeckSliderItem = (function (_super: typeof ViewFastener) {
  const DeckSliderItem = _super.extend() as ViewFastenerClass<DeckSliderItem<any, any>>;

  DeckSliderItem.prototype.onSetView = function (this: DeckSliderItem, itemView: HtmlView | null): void {
    if (itemView !== null) {
      this.initItem(itemView);
    }
  };

  DeckSliderItem.prototype.insertView = function (this: DeckSliderItem, parent: View, childView: HtmlView, targetView: View | null, key: string | undefined): void {
    const targetKey = "item" + (this.itemIndex + 1);
    targetView = parent.getChild(targetKey);
    parent.insertChild(childView, targetView, key);
  };

  DeckSliderItem.prototype.viewDidApplyTheme = function (this: DeckSliderItem, theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, itemView: HtmlView): void {
    if (itemView.color.hasAffinity(Affinity.Intrinsic)) {
      itemView.color.setState(theme.getOr(this.owner.colorLook, mood, null), timing, Affinity.Intrinsic);
    }
  };

  DeckSliderItem.prototype.viewDidLayout = function (this: DeckSliderItem, viewContext: ViewContext, itemView: HtmlView): void {
    this.layoutItem(itemView);
  };

  DeckSliderItem.prototype.initItem = function (this: DeckSliderItem, itemView: HtmlView): void {
    itemView.position.setState("absolute", Affinity.Intrinsic);
  };

  DeckSliderItem.prototype.layoutItem = function (this: DeckSliderItem, itemView: HtmlView): void {
    const itemIndex = this.itemIndex;
    const slotAlign = this.owner.slotAlign.getValue();
    let slotWidth: Length | number | null = this.owner.width.state;
    slotWidth = slotWidth instanceof Length ? slotWidth.pxValue() : this.owner.node.offsetWidth;
    let slotHeight: Length | number | null = this.owner.height.state;
    slotHeight = slotHeight instanceof Length ? slotHeight.pxValue() : this.owner.node.offsetHeight;
    const deckPhase = this.owner.deckPhase.getValueOr(0);
    const nextIndex = Math.max(this.owner.itemCount, Math.ceil(deckPhase));
    const prevIndex = nextIndex - 1;
    const itemPhase = deckPhase - prevIndex;

    let itemWidth: Length | number | null = itemView.width.state;
    this.itemWidth = itemWidth;
    if (itemWidth instanceof Length) {
      itemWidth = itemWidth.pxValue(slotWidth);
    } else {
      itemWidth = itemView.node.offsetWidth;
      // Memoize computed item width while animating
      // to avoid style recalculation in animation frames.
      if (this.owner.deckPhase.tweening) {
        itemView.width.setState(itemWidth, Affinity.Intrinsic);
      } else {
        itemView.width.setState(this.itemWidth, Affinity.Intrinsic);
      }
    }

    const slotSpace = slotWidth - itemWidth;
    if (itemIndex < prevIndex || itemIndex === prevIndex && itemPhase === 1) { // under
      itemView.left.setState(0, Affinity.Intrinsic);
      itemView.top.setState(0, Affinity.Intrinsic);
      itemView.height.setState(slotHeight, Affinity.Intrinsic);
      itemView.opacity.setState(0, Affinity.Intrinsic);
      itemView.setCulled(true);
    } else if (itemIndex === prevIndex) { // out
      itemView.left.setState(slotSpace * slotAlign * (1 - itemPhase), Affinity.Intrinsic);
      itemView.top.setState(0, Affinity.Intrinsic);
      itemView.height.setState(slotHeight, Affinity.Intrinsic);
      itemView.opacity.setState(1 - itemPhase, Affinity.Intrinsic);
      itemView.setCulled(false);
    } else if (itemIndex === nextIndex) { // in
      itemView.left.setState(slotSpace * (1 - itemPhase) + slotSpace * slotAlign * itemPhase, Affinity.Intrinsic);
      itemView.top.setState(0, Affinity.Intrinsic);
      itemView.height.setState(slotHeight, Affinity.Intrinsic);
      itemView.opacity.setState(itemPhase, Affinity.Intrinsic);
      itemView.setCulled(false);
    } else { // over
      itemView.left.setState(slotSpace, Affinity.Intrinsic);
      itemView.top.setState(0, Affinity.Intrinsic);
      itemView.height.setState(slotHeight, Affinity.Intrinsic);
      itemView.opacity.setState(0, Affinity.Intrinsic);
      itemView.setCulled(true);
    }
  };

  DeckSliderItem.construct = function <F extends DeckSliderItem<any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>, fastenerName: string): F {
    fastener = _super.construct(fastenerClass, fastener, owner, fastenerName) as F;
    (fastener as Mutable<typeof fastener>).itemIndex = 0;
    (fastener as Mutable<typeof fastener>).itemWidth = null;
    return fastener;
  };

  return DeckSliderItem;
})(ViewFastener);
/** @internal */
export const DeckSliderItemFastener = ViewFastener.define<DeckSlider, HtmlView>({
  extends: DeckSliderItem,
  key: true,
  type: HtmlView,
  child: false,
  observes: true,
});
