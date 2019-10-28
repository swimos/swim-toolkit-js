// Copyright 2015-2019 SWIM.AI inc.
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

import {Domain, Label, User, Portal, PortalObserver} from "@swim/shell";
import {InspectorView, ShellView, ShellViewController} from "@swim/prism";
import {PrimaryActionStackController} from "./PrimaryActionStackController";
import {UserAccountController} from "./UserAccountController";
import {PortalRackController} from "./PortalRackController";
import {EntityTreeController} from "./EntityTreeController";
import {EntityInspectorController} from "./EntityInspectorController";

export class PortalShellController extends ShellViewController implements PortalObserver {
  /** @hidden */
  readonly _model: Portal;
  /** @hidden */
  _treeController: EntityTreeController | null;
  /** @hidden */
  _inspectorController: EntityInspectorController | null;
  /** @hidden */
  _actionStackController: PrimaryActionStackController | null;
  /** @hidden */
  _rackController: PortalRackController | null;
  /** @hidden */
  _accountController: UserAccountController | null;

  constructor(model: Portal) {
    super();
    this._model = model;
    this._treeController = null;
    this._inspectorController = null;
    this._actionStackController = null;
    this._rackController = null;
    this._accountController = null;
  }

  protected didSetView(view: ShellView | null): void {
    if (view !== null) {
      view.actionStack!.hide(false);
      this._rackController = this.createRackController(this._model);
      view.cabinet!.rack!.setViewController(this._rackController);
    } else {
      this._treeController = null;
      this._inspectorController = null;
      this._actionStackController = null;
      this._rackController = null;
      this._accountController = null;
    }
  }

  protected createRackController(portal: Portal): PortalRackController {
    return new PortalRackController(this, portal);
  }

  protected createAccountController(user: User): UserAccountController {
    return new UserAccountController(user);
  }

  get model(): Portal {
    return this._model;
  }

  get treeController(): EntityTreeController | null {
    return this._treeController;
  }

  setTreeController(newTreeController: EntityTreeController | null): void {
    this.setInspectorController(null);
    this.defocusInspector();
    this.view!.hidePopovers();

    const oldTreeController = this._treeController;
    if (oldTreeController) {
      oldTreeController.model.willCollapse();
      oldTreeController.model.didCollapse();
    }
    this._treeController = newTreeController;
    if (newTreeController) {
      newTreeController.model.willExpand();
      newTreeController.model.didExpand();
    }

    const treeView = this._view ? this._view.tree : null;
    if (treeView) {
      treeView.setViewController(newTreeController);
    }
  }

  get inspectorController(): EntityInspectorController | null {
    return this._inspectorController;
  }

  setInspectorController(inspectorController: EntityInspectorController | null): void {
    this._inspectorController = inspectorController;
    const inspectorView = this._view ? this._view.inspector : null;
    if (inspectorView) {
      inspectorView.setViewController(inspectorController);
    }
  }

  get actionStackController(): PrimaryActionStackController | null {
    return this._actionStackController;
  }

  setActionStackController(actionStackController: PrimaryActionStackController | null, ccw?: boolean): void {
    this._actionStackController = actionStackController;
    const actionStack = this._view ? this._view.actionStack : null;
    if (actionStack) {
      actionStack.setViewController(actionStackController);
      if (actionStackController) {
        actionStackController.setActionIcon(void 0, void 0, ccw);
        actionStack.show();
      } else {
        actionStack.hide();
      }
    }
  }

  get rackController(): PortalRackController | null {
    return this._rackController;
  }

  get accountController(): UserAccountController | null {
    return this._accountController;
  }

  showInspector(inspectorController: EntityInspectorController): void {
    this.setInspectorController(inspectorController);
    this._view!.inspector!.focus();
    this._view!.showInspector();
  }

  hideInspector(): void {
    this._view!.hideInspector();
  }

  focusInspector(): void {
    this._view!.inspector!.focus();
  }

  defocusInspector(): void {
    this._view!.inspector!.defocus();
  }

  shellWillDefocus(view: ShellView): void {
    if (!view.isMobile() || view._inspectorState === "hidden" || view._inspectorState === "hiding") {
      if (this._treeController) {
        this._treeController.deselect();
      }
    }
  }

  shellWillHideInspector(inspector: InspectorView, view: ShellView): void {
    if (this._treeController) {
      this._treeController.defocus();
    }
  }

  portalWillInsertDomain(domain: Domain, index: number): void {
    // stub
  }

  portalDidInsertDomain(domain: Domain, index: number): void {
    // stub
  }

  portalWillInsertLabel(label: Label, index: number): void {
    // stub
  }

  portalDidInsertLabel(label: Label, index: number): void {
    // stub
  }
}
