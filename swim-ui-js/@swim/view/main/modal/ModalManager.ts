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

import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {ViewNode, NodeView} from "../node/NodeView";
import {ModalOptions, Modal} from "./Modal";
import {ModalManagerObserver} from "./ModalManagerObserver";

export class ModalManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _modals: Modal[];
  /** @hidden */
  _modality: number;
  /** @hidden */
  _containerNode: ViewNode;

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this._modals = [];
    this._modality = 0;
    this._containerNode = document.body;
  }

  get modals(): ReadonlyArray<Modal> {
    return this._modals;
  }

  get modality(): number {
    return this._modality;
  }

  get containerNode(): ViewNode {
    return this._containerNode;
  }

  isModal(): boolean {
    return this._modality !== 0;
  }

  setContainer(container: ViewNode | NodeView): void {
    if (container instanceof View.Node) {
      container = container._node;
    }
    this._containerNode = container;
  }

  protected insertModalView(modalView: View): void {
    const containerNode = this._containerNode;
    const containerView = containerNode.view;
    if (containerView !== void 0) {
      containerView.appendChildView(modalView);
    } else if (modalView instanceof View.Node) {
      containerNode.appendChild(modalView._node);
      modalView.mount();
    } else {
      throw new TypeError("" + modalView);
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
    this.willObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerWillPresentModal !== void 0) {
        viewManagerObserver.viewManagerWillPresentModal(modal, options, this);
      }
    });
  }

  protected onPresentModal(modal: Modal, options: ModalOptions): void {
    // hook
  }

  protected didPresentModal(modal: Modal, options: ModalOptions): void {
    this.didObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerDidPresentModal !== void 0) {
        viewManagerObserver.viewManagerDidPresentModal(modal, options, this);
      }
    });
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
    this.willObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerWillDismissModal !== void 0) {
        viewManagerObserver.viewManagerWillDismissModal(modal, this);
      }
    });
  }

  protected onDismissModal(modal: Modal): void {
    // hook
  }

  protected didDismissModal(modal: Modal): void {
    this.didObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerDidDismissModal !== void 0) {
        viewManagerObserver.viewManagerDidDismissModal(modal, this);
      }
    });
  }

  dismissModals(): void {
    const modals = this._modals;
    while (modals.length !== 0) {
      this.dismissModal(modals[0]);
    }
  }

  updateModality(): void {
    const oldModality = this._modality;
    let newModality = 0;
    const modals = this._modals;
    for (let i = 0, n = modals.length; i < n; i += 1) {
      const modal = modals[i];
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
    this.willObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerWillUpdateModality !== void 0) {
        viewManagerObserver.viewManagerWillUpdateModality(newModality, oldModality, this);
      }
    });
  }

  protected onUpdateModality(newModality: number, oldModality: number): void {
    // hook
  }

  protected didUpdateModality(newModality: number, oldModality: number): void {
    this.didObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerDidUpdateModality !== void 0) {
        viewManagerObserver.viewManagerDidUpdateModality(newModality, oldModality, this);
      }
    });
  }

  displaceModals(event: Event | null): void {
    const handled = this.willDisplaceModals(event);
    if (!handled) {
      this.onDisplaceModals(event);
      this.didDisplaceModals(event);
    }
  }

  protected willDisplaceModals(event: Event | null): boolean {
    const viewManagerObservers = this._viewManagerObservers;
    if (viewManagerObservers !== void 0) {
      for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
        const viewManagerObserver: ModalManagerObserver = viewManagerObservers[i];
        if (viewManagerObserver.viewManagerWillDisplaceModals !== void 0) {
          const handled = viewManagerObserver.viewManagerWillDisplaceModals(event, this);
          if (handled === true) {
            return true;
          }
        }
      }
    }
    return false;
  }

  protected onDisplaceModals(event: Event | null): void {
    const modals = this._modals;
    let i = 0;
    while (i < modals.length) {
      const modal = modals[i];
      if (modal.modalState === "shown") {
        this.dismissModal(modal);
      } else {
        i += 1;
      }
    }
  }

  protected didDisplaceModals(event: Event | null): void {
    this.didObserve(function (viewManagerObserver: ModalManagerObserver): void {
      if (viewManagerObserver.viewManagerDidDisplaceModals !== void 0) {
        viewManagerObserver.viewManagerDidDisplaceModals(event, this);
      }
    });
  }

  readonly viewManagerObservers: ReadonlyArray<ModalManagerObserver>;

  protected onAddRootView(rootView: V): void {
    this.attachEvents(rootView);
  }

  protected onRemoveRootView(rootView: V): void {
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

  private static _global?: ModalManager;
  static global(): ModalManager {
    if (ModalManager._global === void 0) {
      ModalManager._global = new ModalManager();
    }
    return ModalManager._global;
  }
}
ViewManager.Modal = ModalManager;
