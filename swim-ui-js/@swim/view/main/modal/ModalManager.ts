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

import type {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import type {ModalOptions, Modal} from "./Modal";
import type {ModalManagerObserver} from "./ModalManagerObserver";

export class ModalManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _modals: Modal[];
  /** @hidden */
  _modality: number;
  /** @hidden */
  _matteView: View | null;

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this._modals = [];
    this._modality = 0;
    this._matteView = null;
  }

  get modals(): ReadonlyArray<Modal> {
    return this._modals;
  }

  isModal(): boolean {
    return this._modality !== 0;
  }

  get modality(): number {
    return this._modality;
  }

  get matteView(): View | null {
    return this._matteView;
  }

  setMatteView(matteView: View | null): void {
    this._matteView = matteView;
  }

  protected insertModalView(modalView: View): void {
    const matteView = this._matteView;
    if (matteView !== null) {
      matteView.appendChildView(modalView);
    } else {
      const constructor = this.constructor as typeof ModalManager;
      constructor.insertModalView(modalView);
    }
  }

  presentModal(modal: Modal, options: ModalOptions = {}): void {
    const modals = this._modals;
    if (modals.indexOf(modal) < 0) {
      if (!options.multi) {
        this.dismissModals();
      }
      this.willPresentModal(modal, options);
      modals.push(modal);
      const modalView = modal.modalView;
      if (modalView !== null && !modalView.isMounted()) {
        this.insertModalView(modalView);
      }
      modal.showModal(options, true);
      this.onPresentModal(modal, options);
      this.updateModality();
      this.didPresentModal(modal, options);
    }
  }

  protected willPresentModal(modal: Modal, options: ModalOptions): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerWillPresentModal !== void 0) {
        viewManagerObserver.modalManagerWillPresentModal(modal, options, this);
      }
    }
  }

  protected onPresentModal(modal: Modal, options: ModalOptions): void {
    // hook
  }

  protected didPresentModal(modal: Modal, options: ModalOptions): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerDidPresentModal !== void 0) {
        viewManagerObserver.modalManagerDidPresentModal(modal, options, this);
      }
    }
  }

  dismissModal(modal: Modal): void {
    const modals = this._modals;
    const index = modals.indexOf(modal);
    if (index >= 0) {
      this.willDismissModal(modal);
      modals.splice(index, 1);
      modal.hideModal(true);
      this.onDismissModal(modal);
      this.updateModality();
      this.didDismissModal(modal);
    }
  }

  protected willDismissModal(modal: Modal): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerWillDismissModal !== void 0) {
        viewManagerObserver.modalManagerWillDismissModal(modal, this);
      }
    }
  }

  protected onDismissModal(modal: Modal): void {
    // hook
  }

  protected didDismissModal(modal: Modal): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerDidDismissModal !== void 0) {
        viewManagerObserver.modalManagerDidDismissModal(modal, this);
      }
    }
  }

  dismissModals(): void {
    const modals = this._modals;
    while (modals.length !== 0) {
      this.dismissModal(modals[0]!);
    }
  }

  toggleModal(modal: Modal, options?: ModalOptions): void {
    const modalState = modal.modalState;
    if (modalState === "hidden" || modalState === "hiding") {
      this.presentModal(modal, options);
    } else if (modalState === "shown" || modalState === "showing") {
      this.dismissModal(modal);
    }
  }

  updateModality(): void {
    const oldModality = this._modality;
    let newModality = 0;
    const modals = this._modals;
    for (let i = 0, n = modals.length; i < n; i += 1) {
      const modal = modals[i]!;
      const modality = +modal.modality;
      newModality = Math.min(Math.max(newModality, modality), 1);
    }
    if (oldModality !== newModality) {
      this.willUpdateModality(newModality, oldModality);
      this._modality = newModality;
      this.onUpdateModality(newModality, oldModality);
      this.didUpdateModality(newModality, oldModality);
    }
  }

  protected willUpdateModality(newModality: number, oldModality: number): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerWillUpdateModality !== void 0) {
        viewManagerObserver.modalManagerWillUpdateModality(newModality, oldModality, this);
      }
    }
  }

  protected onUpdateModality(newModality: number, oldModality: number): void {
    // hook
  }

  protected didUpdateModality(newModality: number, oldModality: number): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerDidUpdateModality !== void 0) {
        viewManagerObserver.modalManagerDidUpdateModality(newModality, oldModality, this);
      }
    }
  }

  displaceModals(event: Event | null): void {
    const handled = this.willDisplaceModals(event);
    if (!handled) {
      this.onDisplaceModals(event);
      this.didDisplaceModals(event);
    }
  }

  protected willDisplaceModals(event: Event | null): boolean {
    let handled: boolean | undefined;
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerWillDisplaceModals !== void 0) {
        handled = viewManagerObserver.modalManagerWillDisplaceModals(event, this) as boolean | undefined;
      }
    }
    return handled !== void 0 ? handled : false;
  }

  protected onDisplaceModals(event: Event | null): void {
    const modals = this._modals;
    let i = 0;
    while (i < modals.length) {
      const modal = modals[i]!;
      if (modal.modalState === "shown") {
        this.dismissModal(modal);
      } else {
        i += 1;
      }
    }
  }

  protected didDisplaceModals(event: Event | null): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.modalManagerDidDisplaceModals !== void 0) {
        viewManagerObserver.modalManagerDidDisplaceModals(event, this);
      }
    }
  }

  declare readonly viewManagerObservers: ReadonlyArray<ModalManagerObserver>;

  protected onInsertRootView(rootView: V): void {
    super.onInsertRootView(rootView);
    this.attachEvents(rootView);
  }

  protected onRemoveRootView(rootView: V): void {
    super.onRemoveRootView(rootView);
    this.detachEvents(rootView);
  }

  protected attachEvents(view: V): void {
    view.on('click', this.onClick);
  }

  protected detachEvents(view: V): void {
    view.off('click', this.onClick);
  }

  protected onClick(event: Event): void {
    this.displaceModals(event);
  }

  static insertModalView(modalView: View): void { // overwritten by NodeView
    throw new TypeError("" + modalView);
  }

  private static _global?: ModalManager<any>;
  static global<V extends View>(): ModalManager<V> {
    if (ModalManager._global === void 0) {
      ModalManager._global = new ModalManager();
    }
    return ModalManager._global;
  }
}
ViewManager.Modal = ModalManager;