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
import {ModalOptions, Modal} from "./Modal";
import {ModalManagerObserver} from "./ModalManagerObserver";
import {ViewNode, NodeView} from "../node/NodeView";

export class ModalManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _modals: Modal[];
  /** @hidden */
  _containerNode: ViewNode;

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this._modals = [];
    this._containerNode = document.body;
  }

  get modals(): ReadonlyArray<Modal> {
    return this._modals;
  }

  get containerNode(): ViewNode {
    return this._containerNode;
  }

  setContainer(container: ViewNode | NodeView): void {
    if (container instanceof View.Node) {
      container = container._node;
    }
    this._containerNode = container;
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
      this.onPresentModal(modal, options);
      modal.showModal(true);
      this.didPresentModal(modal, options);
    }
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

  protected willPresentModal(modal: Modal, options: ModalOptions): void {
    this.willObserve(function (managerObserver: ModalManagerObserver): void {
      if (managerObserver.managerWillPresentModal !== void 0) {
        managerObserver.managerWillPresentModal(modal, options, this);
      }
    });
  }

  protected onPresentModal(modal: Modal, options: ModalOptions): void {
    // hook
  }

  protected didPresentModal(modal: Modal, options: ModalOptions): void {
    this.didObserve(function (managerObserver: ModalManagerObserver): void {
      if (managerObserver.managerDidPresentModal !== void 0) {
        managerObserver.managerDidPresentModal(modal, options, this);
      }
    });
  }

  dismissModal(modal: Modal): void {
    const modals = this._modals;
    const index = modals.indexOf(modal);
    if (index >= 0) {
      this.willDismissModal(modal);
      modals.splice(index, 1);
      this.onDismissModal(modal);
      modal.hideModal(true);
      this.didDismissModal(modal);
    }
  }

  protected willDismissModal(modal: Modal): void {
    this.willObserve(function (managerObserver: ModalManagerObserver): void {
      if (managerObserver.managerWillDismissModal !== void 0) {
        managerObserver.managerWillDismissModal(modal, this);
      }
    });
  }

  protected onDismissModal(modal: Modal): void {
    // hook
  }

  protected didDismissModal(modal: Modal): void {
    this.didObserve(function (managerObserver: ModalManagerObserver): void {
      if (managerObserver.managerDidDismissModal !== void 0) {
        managerObserver.managerDidDismissModal(modal, this);
      }
    });
  }

  dismissModals(): void {
    const modals = this._modals;
    while (modals.length !== 0) {
      const modal = modals[0];
      this.willDismissModal(modal);
      modals.shift();
      this.onDismissModal(modal);
      modal.hideModal(true);
      this.didDismissModal(modal);
    }
  }

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
    this.defaultClick(event);
  }

  defaultClick(event: Event): void {
    const handled = this.willDefaultClick(event);
    if (!handled) {
      this.onDefaultClick(event);
      this.didDefaultClick(event);
    }
  }

  protected willDefaultClick(event: Event): boolean {
    const managerObservers = this._managerObservers;
    if (managerObservers !== void 0) {
      for (let i = 0, n = managerObservers.length; i < n; i += 1) {
        const managerObserver: ModalManagerObserver = managerObservers[i];
        if (managerObserver.managerWillDefaultClick !== void 0) {
          const handled = managerObserver.managerWillDefaultClick(event, this);
          if (handled === true) {
            return true;
          }
        }
      }
    }
    return false;
  }

  protected onDefaultClick(event: Event): void {
    this.dismissModals();
  }

  protected didDefaultClick(event: Event): void {
    this.didObserve(function (managerObserver: ModalManagerObserver): void {
      if (managerObserver.managerDidDefaultClick !== void 0) {
        managerObserver.managerDidDefaultClick(event, this);
      }
    });
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
