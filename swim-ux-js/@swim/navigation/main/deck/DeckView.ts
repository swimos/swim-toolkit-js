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

import {AnyTiming, Timing} from "@swim/mapping";
import {Length} from "@swim/math";
import {Look, Mood} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  View,
  ViewEdgeInsets,
  ViewProperty,
  ViewAnimator,
  ViewFastener,
} from "@swim/view";
import {HtmlView} from "@swim/dom";
import {DeckBar} from "./DeckBar";
import {DeckCard} from "./DeckCard";
import type {DeckViewObserver} from "./DeckViewObserver";
import type {DeckViewController} from "./DeckViewController";

export class DeckView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.cardCount = 0;
    this.card = null;
    this.initDeck();
  }

  protected initDeck(): void {
    this.addClass("deck");
    this.position.setAutoState("relative");
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
  }

  declare readonly viewController: DeckViewController | null;

  declare readonly viewObservers: ReadonlyArray<DeckViewObserver>;

  @ViewAnimator({type: Number, state: 0, updateFlags: View.NeedsLayout})
  declare deckPhase: ViewAnimator<this, number>;

  @ViewProperty({type: Number, state: 1})
  declare inAlign: ViewProperty<this, number>;

  @ViewProperty({type: Number, state: 1 / 3})
  declare outAlign: ViewProperty<this, number>;

  @ViewProperty({type: Object, inherit: true, state: null, updateFlags: View.NeedsResize})
  declare edgeInsets: ViewProperty<this, ViewEdgeInsets | null>;

  declare bar: DeckViewBar<this, DeckBar>; // defined by DeckViewBar

  /** @hidden */
  cardCount: number;

  card: ViewFastener<this, DeckCard> | null;

  pushCard(newCardView: DeckCard, timing?: AnyTiming | boolean): void {
    if (this.deckPhase.isAnimating()) {
      return;
    }

    const oldCardCount = this.cardCount;
    const newCardCount = oldCardCount + 1;
    this.cardCount = newCardCount;

    const oldCardKey = "card" + oldCardCount;
    const oldCardFastener = this.getViewFastener(oldCardKey) as DeckViewCard<this, DeckCard> | null;
    const oldCardView = oldCardFastener !== null ? oldCardFastener.view : null;

    const newCardKey = "card" + newCardCount;
    const newCardFastener = new DeckViewCardFastener(this, newCardKey, newCardKey) as unknown as DeckViewCard<this, DeckCard>;
    newCardFastener.cardIndex = newCardCount;
    this.willPushCard(newCardView, oldCardView);
    this.card = newCardFastener;

    this.setViewFastener(newCardKey, newCardFastener);
    newCardFastener.setView(newCardView);
    newCardFastener.injectView();

    if (timing === void 0 && oldCardCount === 0) {
      timing = false;
    } else if (timing === void 0 || timing === true) {
      timing = this.getLookOr(Look.timing, Mood.navigating, false);
    } else {
      timing = Timing.fromAny(timing);
    }

    this.deckPhase.setState(newCardCount, timing);
    if (timing === false) {
      this.didPushCard(newCardView, oldCardView);
    }
  }

  protected willPushCard(newCardView: DeckCard, oldCardView: DeckCard | null): void {
    this.willObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckWillPushCard !== void 0) {
        viewObserver.deckWillPushCard(newCardView, oldCardView, this);
      }
    });
  }

  protected didPushCard(newCardView: DeckCard, oldCardView: DeckCard | null): void {
    if (oldCardView !== null && oldCardView.parentView === this) {
      oldCardView.remove();
    }
    this.didObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckDidPushCard !== void 0) {
        viewObserver.deckDidPushCard(newCardView, oldCardView, this);
      }
    });
  }

  popCard(timing?: AnyTiming | boolean): DeckCard | null {
    if (this.deckPhase.isAnimating()) {
      return null;
    }

    const oldCardCount = this.cardCount;
    const newCardCount = oldCardCount - 1;
    this.cardCount = newCardCount;

    const oldCardKey = "card" + oldCardCount;
    const oldCardFastener = this.getViewFastener(oldCardKey) as DeckViewCard<this, DeckCard> | null;
    const oldCardView = oldCardFastener !== null ? oldCardFastener.view : null;

    if (oldCardView !== null) {
      const newCardKey = "card" + newCardCount;
      const newCardFastener = this.getViewFastener(newCardKey) as DeckViewCard<this, DeckCard> | null;
      const newCardView = newCardFastener !== null ? newCardFastener.view : null;
      this.willPopCard(newCardView, oldCardView);
      this.card = newCardFastener;
      if (newCardFastener !== null) {
        newCardFastener.injectView();
      }

      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, Mood.navigating, false);
      } else {
        timing = Timing.fromAny(timing);
      }

      this.deckPhase.setState(newCardCount, timing);
      if (timing === false) {
        this.didPopCard(newCardView, oldCardView);
      }
    }

    return oldCardView;
  }

  protected willPopCard(newCardView: DeckCard | null, oldCardView: DeckCard): void {
    this.willObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckWillPopCard !== void 0) {
        viewObserver.deckWillPopCard(newCardView, oldCardView, this);
      }
    });
  }

  protected didPopCard(newCardView: DeckCard | null, oldCardView: DeckCard): void {
    const oldCardKey = oldCardView.key;
    oldCardView.remove();
    if (oldCardKey !== void 0) {
      const oldCardFastener = this.getViewFastener(oldCardKey) as DeckViewCard<this, DeckCard> | null;
      if (oldCardFastener !== null && oldCardFastener.cardIndex > this.cardCount) {
        this.setViewFastener(oldCardKey, null);
      }
    }
    this.didObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckDidPopCard !== void 0) {
        viewObserver.deckDidPopCard(newCardView, oldCardView, this);
      }
    });
  }

  protected didLayout(viewContext: ViewContextType<this>): void {
    if (!this.deckPhase.isAnimating()) {
      const deckPhase = this.deckPhase.takeUpdatedValue();
      if (deckPhase !== void 0) {
        const nextCardIndex = Math.round(deckPhase + 1);
        const nextCardKey = "card" + nextCardIndex;
        const nextCardFastener = this.getViewFastener(nextCardKey) as DeckViewCard<this, DeckCard> | null;
        const nextCardView = nextCardFastener !== null ? nextCardFastener.view : null;
        if (nextCardView !== null) {
          this.didPopCard(this.card !== null ? this.card.view : null, nextCardView);
        } else if (this.card !== null && this.card.view !== null && Math.round(deckPhase) > 0) {
          const prevCardIndex = Math.round(deckPhase - 1);
          const prevCardKey = "card" + prevCardIndex;
          const prevCardFastener = this.getViewFastener(prevCardKey) as DeckViewCard<this, DeckCard> | null;
          const catdCardView = prevCardFastener !== null ? prevCardFastener.view : null;
          this.didPushCard(this.card.view, catdCardView);
        }
      }
    }
    super.didLayout(viewContext);
  }

  /** @hidden */
  didPressBackButton(event: Event | null): void {
    this.didObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckDidPressBackButton !== void 0) {
        viewObserver.deckDidPressBackButton(event, this);
      }
    });
  }

  /** @hidden */
  didPressCloseButton(event: Event | null): void {
    this.didObserve(function (viewObserver: DeckViewObserver): void {
      if (viewObserver.deckDidPressCloseButton !== void 0) {
        viewObserver.deckDidPressCloseButton(event, this);
      }
    });
  }
}

/** @hidden */
export abstract class DeckViewBar<V extends DeckView, S extends DeckBar> extends ViewFastener<V, S> {
  onSetView(barView: S | null): void {
    if (barView !== null) {
      this.initBar(barView);
    }
  }

  insertView(parentView: View, childView: S, targetView: View | null, key: string | undefined): void {
    parentView.prependChildView(childView, key);
  }

  viewDidResize(viewContext: ViewContext, barView: S): void {
    this.resizeBar(barView);
  }

  protected initBar(barView: S): void {
    let deckWidth = this.owner.width.state;
    deckWidth = deckWidth instanceof Length ? deckWidth : Length.px(this.owner.node.offsetWidth);
    barView.position.setAutoState("absolute");
    barView.left.setAutoState(0);
    barView.top.setAutoState(0);
    barView.width.setAutoState(deckWidth);
    barView.zIndex.setAutoState(1);
  }

  protected resizeBar(barView: S): void {
    let deckWidth = this.owner.width.state;
    deckWidth = deckWidth instanceof Length ? deckWidth : Length.px(this.owner.node.offsetWidth);
    barView.width.setAutoState(deckWidth);
  }

  deckBarDidPressBackButton(event: Event | null, view: V): void {
    this.owner.didPressBackButton(event);
  }

  deckBarDidPressCloseButton(event: Event | null, view: V): void {
    this.owner.didPressCloseButton(event);
  }
}
ViewFastener({
  extends: DeckViewBar,
  key: true,
  type: DeckBar,
  observe: true,
})(DeckView.prototype, "bar");

/** @hidden */
export abstract class DeckViewCard<V extends DeckView, S extends DeckCard> extends ViewFastener<V, S> {
  constructor(owner: V, key: string | undefined, fastenerName: string | undefined) {
    super(owner, key, fastenerName);
    this.cardIndex = 0;
  }

  cardIndex: number;

  onSetView(cardView: S | null): void {
    if (cardView !== null) {
      this.initCard(cardView);
    }
  }

  insertView(parentView: View, childView: S, targetView: View | null, key: string | undefined): void {
    const targetKey = "card" + (this.cardIndex + 1);
    targetView = parentView.getChildView(targetKey);
    parentView.insertChildView(childView, targetView, key);
  }

  viewDidResize(viewContext: ViewContext, cardView: S): void {
    this.resizeCard(cardView, viewContext);
  }

  viewDidLayout(viewContext: ViewContext, cardView: S): void {
    this.layoutCard(cardView, viewContext);
  }

  protected initCard(cardView: S): void {
    let edgeInsets = this.owner.edgeInsets.state;
    if (edgeInsets === void 0 && this.owner.edgeInsets.isAuto()) {
      edgeInsets = this.owner.viewport.safeArea;
    }

    let deckWidth = this.owner.width.state;
    deckWidth = deckWidth instanceof Length ? deckWidth : Length.px(this.owner.node.offsetWidth);
    let deckHeight = this.owner.height.state;
    deckHeight = deckHeight instanceof Length ? deckHeight : Length.px(this.owner.node.offsetHeight);

    let barHeight: Length | null = null;
    const barView = this.owner.bar.view;
    if (barView !== null) {
      barHeight = barView.height.state;
      barHeight = barHeight instanceof Length ? barHeight : Length.px(barView.node.offsetHeight);
      if (edgeInsets !== null) {
        edgeInsets = {
          insetTop: 0,
          insetRight: edgeInsets.insetRight,
          insetBottom: edgeInsets.insetBottom,
          insetLeft: edgeInsets.insetLeft,
        };
      }
    }

    cardView.edgeInsets.setAutoState(edgeInsets);
    cardView.position.setAutoState("absolute");
    cardView.left.setAutoState(deckWidth);
    cardView.top.setAutoState(0);
    cardView.width.setAutoState(deckWidth);
    cardView.height.setAutoState(deckHeight);
    cardView.paddingTop.setAutoState(barHeight);
    cardView.boxSizing.setAutoState("border-box");
    cardView.zIndex.setAutoState(0);
    cardView.visibility.setAutoState("hidden");
  }

  protected resizeCard(cardView: S, viewContext: ViewContext): void {
    let edgeInsets = this.owner.edgeInsets.state;
    if (edgeInsets === void 0 && this.owner.edgeInsets.isAuto()) {
      edgeInsets = viewContext.viewport.safeArea;
    }

    let deckWidth = this.owner.width.state;
    deckWidth = deckWidth instanceof Length ? deckWidth : Length.px(this.owner.node.offsetWidth);
    let deckHeight = this.owner.height.state;
    deckHeight = deckHeight instanceof Length ? deckHeight : Length.px(this.owner.node.offsetHeight);

    let barHeight: Length | null = null;
    const barView = this.owner.bar.view;
    if (barView !== null) {
      barHeight = barView.height.state;
      barHeight = barHeight instanceof Length ? barHeight : Length.px(barView.node.offsetHeight);
      if (edgeInsets !== null) {
        edgeInsets = {
          insetTop: 0,
          insetRight: edgeInsets.insetRight,
          insetBottom: edgeInsets.insetBottom,
          insetLeft: edgeInsets.insetLeft,
        };
      }
    }

    cardView.edgeInsets.setAutoState(edgeInsets);
    cardView.width.setAutoState(deckWidth);
    cardView.height.setAutoState(deckHeight);
    cardView.paddingTop.setAutoState(barHeight);
  }

  protected layoutCard(cardView: S, viewContext: ViewContext): void {
    let cardWidth = cardView.width.state;
    cardWidth = cardWidth instanceof Length ? cardWidth : Length.px(cardView.node.offsetWidth);

    const inAlign = this.owner.inAlign.state;
    const outAlign = this.owner.outAlign.state;
    const deckPhase = this.owner.deckPhase.getValue();
    const nextIndex = Math.max(this.owner.cardCount, Math.ceil(deckPhase));
    const prevIndex = nextIndex - 1;
    const cardPhase = deckPhase - prevIndex;

    const cardIndex = this.cardIndex;
    if (cardIndex < prevIndex || cardIndex === prevIndex && cardPhase === 1) { // under
      cardView.left.setAutoState(-cardWidth.pxValue() * outAlign);
      cardView.visibility.setAutoState("hidden");
      cardView.setCulled(true);
    } else if (cardIndex === prevIndex) { // out
      cardView.left.setAutoState(-cardWidth.pxValue() * outAlign * cardPhase);
      cardView.visibility.setAutoState(void 0);
      cardView.setCulled(false);
    } else if (cardIndex === nextIndex) { // in
      cardView.left.setAutoState(cardWidth.pxValue() * inAlign * (1 - cardPhase));
      cardView.visibility.setAutoState(void 0);
      cardView.setCulled(false);
    } else { // over
      cardView.left.setAutoState(cardWidth.pxValue() * inAlign);
      cardView.visibility.setAutoState("hidden");
      cardView.setCulled(true);
    }
  }
}

/** @hidden */
export const DeckViewCardFastener = ViewFastener.define<DeckView, DeckCard>({
  extends: DeckViewCard,
  type: DeckCard,
  child: false,
  observe: true,
});
