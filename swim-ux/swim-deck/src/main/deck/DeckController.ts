// Copyright 2015-2021 Swim.inc
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

import {Class, Lazy, ObserverType} from "@swim/util";
import {Affinity, MemberFastenerClass} from "@swim/component";
import type {Trait} from "@swim/model";
import {Look, Mood} from "@swim/theme";
import type {PositionGestureInput} from "@swim/view";
import {VectorIcon} from "@swim/graphics";
import {
  Controller,
  TraitViewRef,
  TraitViewControllerRef,
  TraitViewControllerSet,
} from "@swim/controller";
import {
  ToolLayout,
  BarLayout,
  ToolView,
  ToolTrait,
  ToolController,
  ButtonToolController,
  BarView,
  BarTrait,
  BarController,
} from "@swim/toolbar";
import type {CardView} from "../card/CardView";
import type {CardTrait} from "../card/CardTrait";
import {CardController} from "../card/CardController";
import {DeckView} from "./DeckView";
import {DeckTrait} from "./DeckTrait";
import type {DeckControllerObserver} from "./DeckControllerObserver";

/** @public */
export interface DeckControllerBarExt {
  attachBarTrait(barTrait: BarTrait, barController: BarController): void;
  detachBarTrait(barTrait: BarTrait, barController: BarController): void;
  attachBarView(barView: BarView, barController: BarController): void;
  detachBarView(barView: BarView, barController: BarController): void;
}

/** @public */
export interface DeckControllerToolExt {
  layout: ToolLayout | null;
}

/** @public */
export type DeckControllerCardExt = {
  attachCardTrait(cardTrait: CardTrait, cardController: CardController): void;
  detachCardTrait(cardTrait: CardTrait, cardController: CardController): void;
  attachCardView(cardView: CardView, cardController: CardController): void;
  detachCardView(cardView: CardView, cardController: CardController): void;
  attachCardTitleView(cardTitleView: ToolView, cardController: CardController): void;
  detachCardTitleView(cardTitleView: ToolView, cardController: CardController): void;
};

/** @public */
export class DeckController extends Controller {
  override readonly observerType?: Class<DeckControllerObserver>;

  protected createBarLayout(): BarLayout | null {
    const tools = new Array<ToolLayout>();
    const topCardView = this.topCard.view;
    const topCardKey = topCardView !== null ? "title" + topCardView.uid : void 0;
    const backCardView = topCardView !== null ? topCardView.backCardView : null;
    const backCardKey = backCardView !== null ? "title" + backCardView.uid : void 0;

    if (topCardView === null || backCardView === null) {
      this.backTool.removeView();
      this.closeTool.insertView();
      const closeToolLayout = this.closeTool.layout;
      if (this.closeTool.controller !== null && closeToolLayout !== null) {
        tools.push(closeToolLayout);
      }
    } else {
      this.closeTool.removeView();
      this.backTool.insertView();
      const backToolLayout = this.backTool.layout;
      if (this.backTool.controller !== null && backToolLayout !== null) {
        tools.push(backToolLayout.withOverlap(backCardKey).withOverpad(16));
      }
    }

    if (backCardView !== null) {
      const backTitleView = backCardView.cardTitle.insertView(this.bar.view, void 0, void 0, backCardKey);
      if (backTitleView !== null) {
        const timing = backTitleView.getLookOr(Look.timing, Mood.navigating, false);
        backTitleView.color.setLook(Look.accentColor, timing, Affinity.Intrinsic);
        backTitleView.zIndex.setState(1, Affinity.Intrinsic);
      }
      const backCardLayout = ToolLayout.create(backCardKey!, 0, 0, 0, 0);
      tools.push(backCardLayout);
    }
    if (topCardView !== null) {
      const topTitleView = topCardView.cardTitle.insertView(this.bar.view, void 0, void 0, topCardKey);
      if (topTitleView !== null) {
        const timing = topTitleView.getLookOr(Look.timing, Mood.navigating, false);
        topTitleView.color.setLook(Look.textColor, timing, Affinity.Intrinsic);
        topTitleView.zIndex.setState(1, Affinity.Intrinsic);
      }
      const topCardLayout = ToolLayout.create(topCardKey!, 1, 0, 0, 0.5);
      tools.push(topCardLayout);
    }

    const menuToolLayout = this.menuTool.layout;
    if (this.menuTool.controller !== null && menuToolLayout !== null) {
      tools.push(menuToolLayout);
      this.menuTool.insertView();
    }

    return BarLayout.create(tools);
  }

  protected updateBarLayout(): void {
    const barView = this.bar.view;
    if (barView !== null) {
      const barLayout = this.createBarLayout();
      if (barLayout !== null) {
        const timing = barView.getLookOr(Look.timing, Mood.navigating, false);
        barView.layout.setState(barLayout, timing);
      }
    }
  }

  @TraitViewRef<DeckController, DeckTrait, DeckView>({
    traitType: DeckTrait,
    observesTrait: true,
    willAttachTrait(deckTrait: DeckTrait): void {
      this.owner.callObservers("controllerWillAttachDeckTrait", deckTrait, this.owner);
    },
    didAttachTrait(deckTrait: DeckTrait): void {
      const barTrait = deckTrait.bar.trait;
      if (barTrait !== null) {
        this.owner.bar.setTrait(barTrait);
      }
      const cardTraits = deckTrait.cards.traits;
      for (const traitId in cardTraits) {
        const cardTrait = cardTraits[traitId]!;
        this.owner.cards.addTraitController(cardTrait);
      }
    },
    willDetachTrait(deckTrait: DeckTrait): void {
      const cardTraits = deckTrait.cards.traits;
      for (const traitId in cardTraits) {
        const cardTrait = cardTraits[traitId]!;
        this.owner.cards.deleteTraitController(cardTrait);
      }
      const barTrait = deckTrait.bar.trait;
      if (barTrait !== null) {
        this.owner.bar.deleteTrait(barTrait);
      }
    },
    didDetachTrait(deckTrait: DeckTrait): void {
      this.owner.callObservers("controllerDidDetachDeckTrait", deckTrait, this.owner);
    },
    traitWillAttachBar(barTrait: BarTrait): void {
      this.owner.bar.setTrait(barTrait);
    },
    traitDidDetachBar(barTrait: BarTrait): void {
      this.owner.bar.deleteTrait(barTrait);
    },
    traitWillAttachCard(cardTrait: CardTrait, targetTrait: Trait): void {
      this.owner.cards.addTraitController(cardTrait, targetTrait);
    },
    traitDidDetachCard(cardTrait: CardTrait): void {
      this.owner.cards.deleteTraitController(cardTrait);
    },
    viewType: DeckView,
    observesView: true,
    initView(deckView: DeckView): void {
      const barController = this.owner.bar.controller;
      if (barController !== null) {
        barController.bar.insertView(deckView);
        if (deckView.bar.view === null) {
          deckView.bar.setView(barController.bar.view);
        }
      }
      const cardControllers = this.owner.cards.controllers;
      for (const controllerId in cardControllers) {
        const cardController = cardControllers[controllerId]!;
        const cardView = cardController.card.view;
        if (cardView !== null && cardView.parent === null) {
          const cardTrait = cardController.card.trait;
          if (cardTrait !== null) {
            cardController.card.insertView(deckView, void 0, void 0, cardTrait.key);
          }
        }
      }
    },
    willAttachView(deckView: DeckView): void {
      this.owner.callObservers("controllerWillAttachDeckView", deckView, this.owner);
    },
    didDetachView(deckView: DeckView): void {
      this.owner.callObservers("controllerDidDetachDeckView", deckView, this.owner);
    },
    viewWillAttachBar(barView: BarView): void {
      const barController = this.owner.bar.controller;
      if (barController !== null) {
        barController.bar.setView(barView);
      }
    },
    viewDidDetachBar(barView: BarView): void {
      const barController = this.owner.bar.controller;
      if (barController !== null) {
        barController.bar.setView(null);
      }
    },
  })
  readonly deck!: TraitViewRef<this, DeckTrait, DeckView>;
  static readonly deck: MemberFastenerClass<DeckController, "deck">;

  @TraitViewControllerRef<DeckController, BarTrait, BarView, BarController, DeckControllerBarExt>({
    implements: true,
    type: BarController,
    binds: true,
    observes: true,
    get parentView(): DeckView | null {
      return this.owner.deck.view;
    },
    getTraitViewRef(barController: BarController): TraitViewRef<unknown, BarTrait, BarView> {
      return barController.bar;
    },
    initController(barController: BarController): void {
      const deckTrait = this.owner.deck.trait;
      if (deckTrait !== null) {
        const barTrait = deckTrait.bar.trait;
        if (barTrait !== null) {
          barController.bar.setTrait(barTrait);
        }
      }
    },
    willAttachController(barController: BarController): void {
      this.owner.callObservers("controllerWillAttachBar", barController, this.owner);
    },
    didAttachController(barController: BarController): void {
      const barTrait = barController.bar.trait;
      if (barTrait !== null) {
        this.attachBarTrait(barTrait, barController);
      }
      barController.bar.insertView();
    },
    willDetachController(barController: BarController): void {
      const barView = barController.bar.view;
      if (barView !== null) {
        this.detachBarView(barView, barController);
      }
      const barTrait = barController.bar.trait;
      if (barTrait !== null) {
        this.detachBarTrait(barTrait, barController);
      }
    },
    didDetachController(barController: BarController): void {
      this.owner.callObservers("controllerDidDetachBar", barController, this.owner);
    },
    controllerWillAttachBarTrait(barTrait: BarTrait, barController: BarController): void {
      this.owner.callObservers("controllerWillAttachBarTrait", barTrait, this.owner);
      this.attachBarTrait(barTrait, barController);
    },
    controllerDidDetachBarTrait(barTrait: BarTrait, barController: BarController): void {
      this.detachBarTrait(barTrait, barController);
      this.owner.callObservers("controllerDidDetachBarTrait", barTrait, this.owner);
    },
    attachBarTrait(barTrait: BarTrait, barController: BarController): void {
      // hook
    },
    detachBarTrait(barTrait: BarTrait, barController: BarController): void {
      // hook
    },
    controllerWillAttachBarView(barView: BarView, barController: BarController): void {
      this.owner.callObservers("controllerWillAttachBarView", barView, this.owner);
      this.attachBarView(barView, barController);
    },
    controllerDidDetachBarView(barView: BarView, barController: BarController): void {
      this.detachBarView(barView, barController);
      this.owner.callObservers("controllerDidDetachBarView", barView, this.owner);
    },
    attachBarView(barView: BarView, barController: BarController): void {
      const deckView = this.owner.deck.view;
      if (deckView !== null && deckView.bar.view === null) {
        deckView.bar.setView(barView);
      }
    },
    detachBarView(barView: BarView, barController: BarController): void {
      barView.remove();
    },
    detectController(controller: Controller): BarController | null {
      return controller instanceof BarController ? controller : null;
    },
  })
  readonly bar!: TraitViewControllerRef<this, BarTrait, BarView, BarController>;
  static readonly bar: MemberFastenerClass<DeckController, "bar">;

  protected didPressClose(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressClose", input, event, this);
  }

  @TraitViewControllerRef<DeckController, ToolTrait, ToolView, ToolController, DeckControllerToolExt & ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "close",
    observes: true,
    init(): void {
      this.layout = ToolLayout.create(this.viewKey!, 0, 0, 48);
    },
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    didAttachController(toolController: ToolController): void {
      this.owner.updateBarLayout();
    },
    willDetachController(toolController: ToolController): void {
      toolController.tool.removeView();
      this.owner.updateBarLayout();
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressClose(input, event);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(DeckController.closeIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly closeTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController> & DeckControllerToolExt;
  static readonly closeTool: MemberFastenerClass<DeckController, "closeTool">;

  /** @internal */
  @Lazy
  static get closeIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12Z");
  }

  protected didPressBack(input: PositionGestureInput, event: Event | null): void {
    const topCardView = this.topCard.view;
    if (topCardView !== null) {
      const timing = topCardView.getLookOr(Look.timing, Mood.navigating, false);
      topCardView.presence.dismiss(timing);
    }
  }

  @TraitViewControllerRef<DeckController, ToolTrait, ToolView, ToolController, DeckControllerToolExt & ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "back",
    observes: true,
    init(): void {
      this.layout = ToolLayout.create(this.viewKey!, 0, 0, 48);
    },
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    didAttachController(toolController: ToolController): void {
      this.owner.updateBarLayout();
    },
    willDetachController(toolController: ToolController): void {
      toolController.tool.removeView();
      this.owner.updateBarLayout();
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressBack(input, event);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(DeckController.backIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly backTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController> & DeckControllerToolExt;
  static readonly backTool: MemberFastenerClass<DeckController, "backTool">;

  /** @internal */
  @Lazy
  static get backIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M17.77,3.77L16,2L6,12L16,22L17.77,20.23L9.54,12Z").withFillLook(Look.accentColor);
  }

  protected didPressMenu(input: PositionGestureInput, event: Event | null): void {
    this.callObservers("controllerDidPressMenu", input, event, this);
  }

  @TraitViewControllerRef<DeckController, ToolTrait, ToolView, ToolController, DeckControllerToolExt & ObserverType<ToolController | ButtonToolController>>({
    implements: true,
    type: BarController,
    binds: true,
    viewKey: "menu",
    observes: true,
    init(): void {
      this.layout = ToolLayout.create(this.viewKey!, 0, 0, 48);
    },
    get parentView(): BarView | null {
      return this.owner.bar.view;
    },
    getTraitViewRef(toolController: ToolController): TraitViewRef<unknown, ToolTrait, ToolView> {
      return toolController.tool;
    },
    didAttachController(toolController: ToolController): void {
      this.owner.updateBarLayout();
    },
    willDetachController(toolController: ToolController): void {
      toolController.tool.removeView();
      this.owner.updateBarLayout();
    },
    controllerDidPressToolView(input: PositionGestureInput, event: Event | null): void {
      this.owner.didPressMenu(input, event);
    },
    createController(): ToolController {
      const toolController = new ButtonToolController();
      const toolView = toolController.tool.attachView()!;
      toolView.iconWidth.setState(24, Affinity.Intrinsic);
      toolView.iconHeight.setState(24, Affinity.Intrinsic);
      toolView.graphics.setState(DeckController.menuIcon, Affinity.Intrinsic);
      return toolController;
    },
  })
  readonly menuTool!: TraitViewControllerRef<this, ToolTrait, ToolView, ToolController> & DeckControllerToolExt;
  static readonly menuTool: MemberFastenerClass<DeckController, "menuTool">;

  /** @internal */
  @Lazy
  static get menuIcon(): VectorIcon {
    return VectorIcon.create(24, 24, "M3,18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3Z");
  }

  @TraitViewControllerSet<DeckController, CardTrait, CardView, CardController, DeckControllerCardExt>({
    implements: true,
    type: CardController,
    binds: true,
    observes: true,
    get parentView(): DeckView | null {
      return this.owner.deck.view;
    },
    getTraitViewRef(cardController: CardController): TraitViewRef<unknown, CardTrait, CardView> {
      return cardController.card;
    },
    willAttachController(cardController: CardController): void {
      this.owner.callObservers("controllerWillAttachCard", cardController, this.owner);
    },
    didAttachController(cardController: CardController): void {
      const cardTrait = cardController.card.trait;
      if (cardTrait !== null) {
        this.attachCardTrait(cardTrait, cardController);
      }
      const cardView = cardController.card.view;
      if (cardView !== null) {
        this.attachCardView(cardView, cardController);
      }
    },
    willDetachController(cardController: CardController): void {
      const cardView = cardController.card.view;
      if (cardView !== null) {
        this.detachCardView(cardView, cardController);
      }
      const cardTrait = cardController.card.trait;
      if (cardTrait !== null) {
        this.detachCardTrait(cardTrait, cardController);
      }
    },
    didDetachController(cardController: CardController): void {
      this.owner.callObservers("controllerDidDetachCard", cardController, this.owner);
    },
    controllerWillAttachCardTrait(cardTrait: CardTrait, cardController: CardController): void {
      this.owner.callObservers("controllerWillAttachCardTrait", cardTrait, cardController, this.owner);
      this.attachCardTrait(cardTrait, cardController);
    },
    controllerDidDetachCardTrait(cardTrait: CardTrait, cardController: CardController): void {
      this.detachCardTrait(cardTrait, cardController);
      this.owner.callObservers("controllerDidDetachCardTrait", cardTrait, cardController, this.owner);
    },
    attachCardTrait(cardTrait: CardTrait, cardController: CardController): void {
      // hook
    },
    detachCardTrait(cardTrait: CardTrait, cardController: CardController): void {
      // hook
    },
    controllerWillAttachCardView(cardView: CardView, cardController: CardController): void {
      this.owner.callObservers("controllerWillAttachCardView", cardView, cardController, this.owner);
      this.attachCardView(cardView, cardController);
    },
    controllerDidDetachCardView(cardView: CardView, cardController: CardController): void {
      this.detachCardView(cardView, cardController);
      this.owner.callObservers("controllerDidDetachCardView", cardView, cardController, this.owner);
    },
    attachCardView(cardView: CardView, cardController: CardController): void {
      const cardTitleView = cardView.cardTitle.view;
      if (cardTitleView !== null) {
        this.attachCardTitleView(cardTitleView, cardController);
      }
      const deckView = this.owner.deck.view;
      if (deckView !== null) {
        deckView.cards.addView(cardView);
      }
      if (this.owner.topCard.controller === null && cardView.presence.presented) {
        this.owner.topCard.setController(cardController);
      }
    },
    detachCardView(cardView: CardView, cardController: CardController): void {
      const cardTitleView = cardView.cardTitle.view;
      if (cardTitleView !== null) {
        this.detachCardTitleView(cardTitleView, cardController);
      }
      cardView.remove();
    },
    controllerWillAttachCardTitleView(cardTitleView: ToolView, cardController: CardController): void {
      this.owner.callObservers("controllerWillAttachCardTitleView", cardTitleView, cardController, this.owner);
      this.attachCardTitleView(cardTitleView, cardController);
    },
    controllerDidDetachCardTitleView(cardTitleView: ToolView, cardController: CardController): void {
      this.detachCardTitleView(cardTitleView, cardController);
      this.owner.callObservers("controllerDidDetachCardTitleView", cardTitleView, cardController, this.owner);
    },
    attachCardTitleView(cardTitleView: ToolView, cardController: CardController): void {
      // hook
    },
    detachCardTitleView(cardTitleView: ToolView, cardController: CardController): void {
      cardTitleView.remove();
    },
    controllerWillPresentCardView(cardView: CardView, cardController: CardController): void {
      if (this.owner.topCard.controller === null) {
        this.owner.topCard.setController(cardController);
      }
    },
    controllerDidPresentCardView(cardView: CardView, cardController: CardController): void {
      // hook
    },
    controllerWillDismissCardView(cardView: CardView, cardController: CardController): void {
      if (this.owner.topCard.controller === cardController) {
        this.owner.topCard.setController(null);
      }
    },
    controllerDidDismissCardView(cardView: CardView, cardController: CardController): void {
      const topCardController = this.owner.topCard.controller;
      if (topCardController !== null && topCardController !== cardController
          && cardView.backCardView === null && cardView.frontCardView === null) {
        this.removeController(cardController);
      }
    },
  })
  readonly cards!: TraitViewControllerSet<this, CardTrait, CardView, CardController>;
  static readonly cards: MemberFastenerClass<DeckController, "cards">;

  @TraitViewControllerRef<DeckController, CardTrait, CardView, CardController>({
    type: CardController,
    binds: false,
    observes: true,
    getTraitViewRef(cardController: CardController): TraitViewRef<unknown, CardTrait, CardView> {
      return cardController.card;
    },
    willAttachController(cardController: CardController): void {
      this.owner.callObservers("controllerWillAttachTopCard", cardController, this.owner);
      this.owner.updateBarLayout();
    },
    didDetachController(cardController: CardController): void {
      const cardView = cardController.card.view;
      if (cardView !== null && cardView.backCardView === null && cardView.frontCardView === null) {
        this.owner.updateBarLayout();
      }
      this.owner.callObservers("controllerDidDetachTopCard", cardController, this.owner);
    },
    controllerWillAttachCardTitleView(titleView: ToolView, cardController: CardController): void {
      this.owner.updateBarLayout();
    },
    controllerDidDetachCardTitleView(titleView: ToolView, cardController: CardController): void {
      this.owner.updateBarLayout();
    },
  })
  readonly topCard!: TraitViewControllerRef<this, CardTrait, CardView, CardController>;
  static readonly topCard: MemberFastenerClass<DeckController, "topCard">;
}
