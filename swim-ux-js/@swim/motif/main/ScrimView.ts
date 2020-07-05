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

import {Color} from "@swim/color";
import {Ease, Tween, AnyTransition, Transition} from "@swim/transition";
import {ModalState, ViewScope, ViewNodeType, HtmlViewInit, HtmlView, UiView} from "@swim/view";

export interface ScrimViewInit extends HtmlViewInit {
  scrimTransition?: AnyTransition<any>;
}

export class ScrimView extends HtmlView {
  /** @hidden */
  _modalState: ModalState;

  constructor(node: HTMLElement) {
    super(node);
    this._modalState = "hidden";
    this.onClick = this.onClick.bind(this);
    this.onSyntheticClick = this.onSyntheticClick.bind(this);
    if (typeof PointerEvent !== "undefined") {
      this.on("pointerup", this.onClick);
      this.on("click", this.onSyntheticClick);
    } else if (typeof TouchEvent !== "undefined") {
      this.onSyntheticClick = this.onSyntheticClick.bind(this);
      this.on("touchend", this.onClick);
      this.on("click", this.onSyntheticClick);
    } else {
      this.on("click", this.onClick);
    }
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
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

  initView(init: ScrimViewInit): void {
    super.initView(init);
    if (init.scrimTransition !== void 0) {
      this.scrimTransition(init.scrimTransition);
    }
  }

  get modalState(): ModalState {
    return this._modalState;
  }

  isShown(): boolean {
    return this._modalState === "shown" || this._modalState === "showing";
  }

  isHidden(): boolean {
    return this._modalState === "hidden" || this._modalState === "hiding";
  }

  @ViewScope(Transition, {
    inherit: true,
    init(): Transition<any> {
      return Transition.duration(250, Ease.cubicOut);
    },
  })
  scrimTransition: ViewScope<this, Transition<any>, AnyTransition<any>>;

  show(opacity: number, tween?: Tween<any>): void {
    if (this._modalState === "hidden" || this._modalState === "hiding") {
      if (tween === void 0 || tween === true) {
        tween = this.scrimTransition.getStateOr(null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willShow();
      this.display("block");
      if (tween !== null) {
        this.backgroundColor.setAutoState(Color.black(0));
        this.backgroundColor.setAutoState(Color.black(opacity), tween.onEnd(this.didShow.bind(this)));
      } else {
        this.backgroundColor.setAutoState(Color.black(opacity));
        this.didShow();
      }
    }
  }

  protected willShow(): void {
    this._modalState = "showing";
  }

  protected didShow(): void {
    this._modalState = "shown";
  }

  hide(tween?: Tween<any>): void {
    if (this._modalState === "shown" || this._modalState === "showing") {
      if (tween === void 0 || tween === true) {
        tween = this.scrimTransition.getStateOr(null);
      } else {
        tween = Transition.forTween(tween);
      }
      this.willHide();
      if (tween !== null) {
        this.backgroundColor.setAutoState(Color.black(0), tween.onEnd(this.didHide.bind(this)));
      } else {
        this.backgroundColor.setAutoState(Color.black(0));
        this.didHide();
      }
    }
  }

  protected willHide(): void {
    this._modalState = "hiding";
  }

  protected didHide(): void {
    this._modalState = "hidden";
    this.display("none");
  }

  protected onClick(event: Event): void {
    const rootView = this.rootView;
    if (rootView instanceof UiView) {
      event.stopPropagation();
      rootView.onFallthroughClick(event);
    }
  }

  protected onSyntheticClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
