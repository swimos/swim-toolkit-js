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

import {Tween} from "@swim/transition";
import {SvgView, HtmlView} from "@swim/view";
import {PrimaryAction, PrimaryActionObserver, SecondaryAction} from "@swim/shell";
import {ActionStack, ActionStackController, ActionItem} from "@swim/prism";
import {SecondaryActionItemController} from "./SecondaryActionItemController";

export class PrimaryActionStackController extends ActionStackController implements PrimaryActionObserver {
  /** @hidden */
  readonly _model: PrimaryAction;

  constructor(model: PrimaryAction) {
    super();
    this._model = model;
  }

  get model(): PrimaryAction {
    return this._model;
  }

  protected didSetView(view: ActionStack | null): void {
    if (view !== null) {
      view.removeItems();
      const secondaryActions = this._model.secondaryActions;
      for (let i = 0; i < secondaryActions.length; i += 1) {
        this.insertSecondaryAction(secondaryActions[i], i);
      }
    }
  }

  setActionIcon(icon?: SvgView | HtmlView | null, tween?: Tween<any>, ccw?: boolean): void {
    const view = this._view;
    if (view !== null) {
      if (icon === void 0) {
        icon = this._model.createIcon();
      }
      view.setButtonIcon(icon, tween, ccw);
    }
  }

  protected createActionItem(): ActionItem {
    return HtmlView.create(ActionItem);
  }

  protected createSecondaryActionController(secondaryAction: SecondaryAction): SecondaryActionItemController {
    return new SecondaryActionItemController(secondaryAction);
  }

  insertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    const actionItem = this.createActionItem().key(secondaryAction.name);
    const secondaryActionController = this.createSecondaryActionController(secondaryAction);
    actionItem.setViewController(secondaryActionController);
    this.view!.insertItem(actionItem, index);
  }

  removeSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    const childViews = this.childViews;
    for (let i = 0; i < childViews.length; i += 1) {
      const childView = childViews[i];
      const childViewController = childView.viewController;
      if (childViewController instanceof SecondaryActionItemController && childViewController.model === secondaryAction) {
        this.removeChildView(childView);
      }
    }
  }

  primaryActionWillInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    // nop
  }

  primaryActionDidInsertSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    this.insertSecondaryAction(secondaryAction, index);
  }

  primaryActionWillRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    // nop
  }

  primaryActionDidRemoveSecondaryAction(secondaryAction: SecondaryAction, index: number): void {
    this.removeSecondaryAction(secondaryAction, index);
  }

  primaryActionWillExpand(actionView: HtmlView): void {
    // nop
  }

  primaryActionDidExpand(actionView: HtmlView): void {
    // nop
  }

  primaryActionWillCollapse(actionView: HtmlView): void {
    // nop
  }

  primaryActionDidCollapse(actionView: HtmlView): void {
    // nop
  }

  primaryActionWillActivate(actionView: HtmlView): void {
    // nop
  }

  primaryActionDidActivate(actionView: HtmlView): void {
    // nop
  }

  actionStackDidPress(view: ActionStack): void {
    this._model.didActivate(view);
  }

  actionStackDidPressHold(view: ActionStack): void {
    // override
  }

  actionStackDidLongPress(view: ActionStack): void {
    // override
  }

  actionStackDidContextPress(view: ActionStack): void {
    // override
  }

  actionStackWillExpand(view: ActionStack): void {
    this._model.willExpand(view);
  }

  actionStackDidExpand(view: ActionStack): void {
    this._model.didExpand(view);
  }

  actionStackWillCollapse(view: ActionStack): void {
    this._model.willCollapse(view);
  }

  actionStackDidCollapse(view: ActionStack): void {
    this._model.didCollapse(view);
  }
}
