// Copyright 2015-2023 Swim.inc
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

import type {Mutable} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Timing} from "@swim/util";
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {EventHandler} from "@swim/component";
import {Provider} from "@swim/component";
import type {Service} from "@swim/component";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import {Look} from "@swim/theme";
import {StyleAnimator} from "@swim/dom";
import {HtmlView} from "@swim/dom";
import type {ModalService} from "@swim/dom";

/** @public */
export class ScrimView extends HtmlView {
  constructor(node: HTMLElement) {
    super(node);
    this.displayState = ScrimView.HiddenState;
    this.initScrim();
  }

  protected initScrim(): void {
    this.addClass("scrim");
    this.display.setState("none", Affinity.Intrinsic);
    this.position.setState("absolute", Affinity.Intrinsic);
    this.top.setState(0, Affinity.Intrinsic);
    this.right.setState(0, Affinity.Intrinsic);
    this.bottom.setState(0, Affinity.Intrinsic);
    this.left.setState(0, Affinity.Intrinsic);
    this.pointerEvents.setState("auto", Affinity.Intrinsic);
    this.cursor.setState("pointer", Affinity.Intrinsic);
    this.backgroundColor.setState(Color.black(0), Affinity.Intrinsic);
  }

  /** @internal */
  readonly displayState: number;

  /** @internal */
  setDisplayState(displayState: number): void {
    (this as Mutable<this>).displayState = displayState;
  }

  @StyleAnimator({
    extends: true,
    willTransition(): void {
      const displayState = this.owner.displayState;
      if (displayState === ScrimView.ShowState) {
        this.owner.willShowScrim();
      } else if (displayState === ScrimView.HideState) {
        this.owner.willHideScrim();
      }
    },
    didTransition(): void {
      const displayState = this.owner.displayState;
      if (displayState === ScrimView.ShowingState) {
        this.owner.didShowScrim();
      } else if (displayState === ScrimView.HidingState) {
        this.owner.didHideScrim();
      }
    },
  })
  override get backgroundColor(): StyleAnimator<this, Color | null, AnyColor | null> {
    return StyleAnimator.dummy();
  }

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
        this.backgroundColor.setState(Color.black(0), Affinity.Intrinsic);
        this.backgroundColor.setState(Color.black(opacity), timing, Affinity.Intrinsic);
      } else {
        this.willShowScrim();
        this.backgroundColor.setState(Color.black(opacity), Affinity.Intrinsic);
        this.didShowScrim();
      }
    }
  }

  protected willShowScrim(): void {
    this.setDisplayState(ScrimView.ShowingState);

    this.display.setState("block", Affinity.Intrinsic);
  }

  protected didShowScrim(): void {
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
        this.backgroundColor.setState(Color.black(0), timing, Affinity.Intrinsic);
      } else {
        this.willHideScrim();
        this.backgroundColor.setState(Color.black(0), Affinity.Intrinsic);
        this.didHideScrim();
      }
    }
  }

  protected willHideScrim(): void {
    this.setDisplayState(ScrimView.HidingState);
  }

  protected didHideScrim(): void {
    this.setDisplayState(ScrimView.HiddenState);

    this.display.setState("none", Affinity.Intrinsic);
  }

  @Provider({
    extends: true,
    observes: true,
    didAttachService(service: ModalService, target: Service | null): void {
      this.owner.serviceDidSetModality(service.modality.value, 0, service);
      super.didAttachService(service, target);
    },
    willDetachService(service: ModalService): void {
      super.willDetachService(service);
      this.owner.hide(false);
    },
  })
  override readonly modal!: Provider<this, ModalService> & HtmlView["modal"] & Observes<ModalService>;

  serviceDidSetModality(newModality: number, oldModality: number, modalService: ModalService): void {
    if (newModality !== 0) {
      const opacity = 0.5 * newModality;
      if (oldModality === 0) {
        this.show(opacity);
      } else {
        this.backgroundColor.setState(Color.black(opacity), Affinity.Intrinsic);
        if (this.displayState === ScrimView.ShowingState) {
          this.didShowScrim();
        }
      }
    } else {
      this.hide();
    }
  }

  @EventHandler({
    initType(): string {
      if (typeof PointerEvent !== "undefined") {
        return "pointerup";
      } else if (typeof TouchEvent !== "undefined") {
        return "touchend";
      } else {
        return "click";
      }
    },
    handle(event: Event): void {
      const modalService = this.owner.modal.service;
      if (modalService !== null) {
        modalService.displaceModals();
      }
    },
  })
  readonly click!: EventHandler<this>;

  @EventHandler({
    type: "click",
    handle(event: Event): void {
      event.preventDefault();
      event.stopPropagation();
    },
    init(): void {
      this.disable(typeof PointerEvent === "undefined"
                && typeof TouchEvent === "undefined");
    }
  })
  readonly syntheticClick!: EventHandler<this>;

  /** @internal */
  static readonly HiddenState: number = 0;
  /** @internal */
  static readonly HidingState: number = 1;
  /** @internal */
  static readonly HideState: number = 2;
  /** @internal */
  static readonly ShownState: number = 3;
  /** @internal */
  static readonly ShowingState: number = 4;
  /** @internal */
  static readonly ShowState: number = 5;
}
