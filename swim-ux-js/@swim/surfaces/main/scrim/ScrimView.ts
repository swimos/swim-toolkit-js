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
import {AnyColor, Color} from "@swim/style";
import {Look} from "@swim/theme";
import type {ModalManager, ModalManagerObserver,} from "@swim/view";
import {StyleAnimator, HtmlView} from "@swim/dom";

export class ScrimView extends HtmlView implements ModalManagerObserver {
  constructor(node: HTMLElement) {
    super(node);
    Object.defineProperty(this, "displayState", {
      value: ScrimView.HiddenState,
      enumerable: true,
      configurable: true,
    });
    this.onClick = this.onClick.bind(this);
    if (typeof PointerEvent !== "undefined") {
      this.onSyntheticClick = this.onSyntheticClick.bind(this);
      this.on("pointerup", this.onClick);
      this.on("click", this.onSyntheticClick);
    } else if (typeof TouchEvent !== "undefined") {
      this.onSyntheticClick = this.onSyntheticClick.bind(this);
      this.on("touchend", this.onClick);
      this.on("click", this.onSyntheticClick);
    } else {
      this.on("click", this.onClick);
    }
    this.initScrim();
  }

  protected initScrim(): void {
    this.addClass("scrim");
    this.display.setAutoState("none");
    this.position.setAutoState("absolute");
    this.top.setAutoState(0);
    this.right.setAutoState(0);
    this.bottom.setAutoState(0);
    this.left.setAutoState(0);
    this.pointerEvents.setAutoState("auto");
    this.cursor.setAutoState("pointer");
    this.backgroundColor.setAutoState(Color.black(0));
  }

  /** @hidden */
  declare readonly displayState: number;

  /** @hidden */
  setDisplayState(displayState: number): void {
    Object.defineProperty(this, "displayState", {
      value: displayState,
      enumerable: true,
      configurable: true,
    });
  }

  @StyleAnimator<ScrimView, Color | null, AnyColor | null>({
    propertyNames: "background-color",
    type: Color,
    state: null,
    onBegin(backgroundColor: Color | null): void {
      const displayState = this.owner.displayState;
      if (displayState === ScrimView.ShowState) {
        this.owner.willShow();
      } else if (displayState === ScrimView.HideState) {
        this.owner.willHide();
      }
    },
    onEnd(backgroundColor: Color | null): void {
      const displayState = this.owner.displayState;
      if (displayState === ScrimView.ShowingState) {
        this.owner.didShow();
      } else if (displayState === ScrimView.HidingState) {
        this.owner.didHide();
      }
    },
  })
  declare backgroundColor: StyleAnimator<this, Color | null, AnyColor | null>;

  isShown(): boolean {  
    switch (this.displayState) {
      case ScrimView.ShownState:
      case ScrimView.ShowingState:
      case ScrimView.ShowState: return true;
      default: return false;
    }
  }

  isHidden(): boolean {
    switch (this.displayState) {
      case ScrimView.HiddenState:
      case ScrimView.HidingState:
      case ScrimView.HideState: return true;
      default: return false;
    }
  }

  show(opacity: number, timing?: AnyTiming | boolean): void {
    if (this.isHidden()) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(ScrimView.ShowState);
      if (timing !== false) {
        this.backgroundColor.setAutoState(Color.black(0));
        this.backgroundColor.setAutoState(Color.black(opacity), timing);
      } else {
        this.willShow();
        this.backgroundColor.setAutoState(Color.black(opacity));
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    this.setDisplayState(ScrimView.ShowingState);

    this.display.setAutoState("block");
  }

  protected didShow(): void {
    this.setDisplayState(ScrimView.ShownState);
  }

  hide(timing?: AnyTiming | boolean): void {
    if (this.isShown()) {
      if (timing === void 0 || timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      this.setDisplayState(ScrimView.HideState);
      if (timing !== false) {
        this.backgroundColor.setAutoState(Color.black(0), timing);
      } else {
        this.willHide();
        this.backgroundColor.setAutoState(Color.black(0));
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    this.setDisplayState(ScrimView.HidingState);
  }

  protected didHide(): void {
    this.setDisplayState(ScrimView.HiddenState);

    this.display.setAutoState("none");
  }

  protected onMount(): void {
    super.onMount();
    const modalManager = this.modalService.manager;
    if (modalManager !== void 0) {
      modalManager.addViewManagerObserver(this);
      this.modalManagerDidUpdateModality(modalManager.modality, 0, modalManager);
    }
  }

  protected onUnmount(): void {
    const modalManager = this.modalService.manager;
    if (modalManager !== void 0) {
      modalManager.removeViewManagerObserver(this);
    }
    this.hide(false);
    super.onUnmount();
  }

  modalManagerDidUpdateModality(newModality: number, oldModality: number, modalManager: ModalManager): void {
    if (newModality !== 0) {
      const opacity = 0.5 * newModality;
      if (oldModality === 0) {
        this.show(opacity);
      } else {
        this.backgroundColor.setAutoState(Color.black(opacity));
        if (this.displayState === ScrimView.ShowingState) {
          this.didShow();
        }
      }
    } else {
      this.hide();
    }
  }

  protected onClick(event: Event): void {
    const modalManager = this.modalService.manager;
    if (modalManager !== void 0) {
      modalManager.displaceModals(event);
    }
  }

  protected onSyntheticClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** @hidden */
  static readonly HiddenState: number = 0;
  /** @hidden */
  static readonly HidingState: number = 1;
  /** @hidden */
  static readonly HideState: number = 2;
  /** @hidden */
  static readonly ShownState: number = 3;
  /** @hidden */
  static readonly ShowingState: number = 4;
  /** @hidden */
  static readonly ShowState: number = 5;
}
