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

import {ConstrainVariable, Constraint, ConstraintSolver} from "@swim/constraint";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {LayoutAnchor} from "./LayoutAnchor";
import {LayoutSolver} from "./LayoutSolver";
import {LayoutManagerObserver} from "./LayoutManagerObserver";
import {NodeView} from "../node/NodeView";

export class LayoutManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  readonly _solver: LayoutSolver;

  constructor() {
    super();
    this._solver = this.createSolver();
  }

  /** @hidden */
  protected createSolver(): LayoutSolver {
    return new LayoutSolver(this);
  }

  get solver(): ConstraintSolver {
    return this._solver;
  }

  activateConstraint(constraint: Constraint): void {
    this._solver.addConstraint(constraint);
  }

  deactivateConstraint(constraint: Constraint): void {
    this._solver.removeConstraint(constraint);
  }

  activateConstraintVariable(constraintVariable: ConstrainVariable): void {
    this._solver.addConstraintVariable(constraintVariable);
  }

  deactivateConstraintVariable(constraintVariable: ConstrainVariable): void {
    this._solver.removeConstraintVariable(constraintVariable);
  }

  setConstraintVariable(constraintVariable: ConstrainVariable, state: number): void {
    this._solver.setConstraintVariable(constraintVariable, state);
  }

  updateConstraintVariables(): void {
    this._solver.updateConstraintVariables();
  }

  didAddConstraint(constraint: Constraint): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsLayout);
    }
  }

  didRemoveConstraint(constraint: Constraint): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsLayout);
    }
  }

  didAddConstraintVariable(constraintVariable: ConstrainVariable): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsLayout);
    }
  }

  didRemoveConstraintVariable(constraintVariable: ConstrainVariable): void {
    const rootViews = this._rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      rootViews[i].requireUpdate(View.NeedsLayout);
    }
  }

  didUpdateConstraintVariable(constraintVariable: ConstrainVariable, newValue: number, oldValue: number): void {
    if (oldValue !== newValue) {
      const rootViews = this._rootViews;
      for (let i = 0, n = rootViews.length; i < n; i += 1) {
        rootViews[i].requireUpdate(View.NeedsLayout);
      }
    }
  }

  readonly viewManagerObservers: ReadonlyArray<LayoutManagerObserver>;

  protected onAddRootView(rootView: V): void {
    super.onAddRootView(rootView);
    this.addLayoutAnchors(rootView);
  }

  protected onRemoveRootView(rootView: V): void {
    super.onRemoveRootView(rootView);
  }

  protected addLayoutAnchors(rootView: V): void {
    if (rootView instanceof View.Node && (rootView as NodeView)._node === document.body) {
      this.addSafeAreaAnchors(rootView);
    }
  }

  protected removeLayoutAnchors(rootView: V): void {
    // hook
  }

  protected addSafeAreaAnchors(rootView: V): void {
    LayoutAnchor({
      strength: "strong",
      getState(oldState: number): number {
        const newState = this.view.viewport.safeArea.insetTop;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsLayout);
        }
        return newState;
      },
    })(rootView, "safeAreaInsetTop");
    LayoutAnchor({
      strength: "strong",
      getState(oldState: number): number {
        const newState = this.view.viewport.safeArea.insetRight;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsLayout);
        }
        return newState;
      },
    })(rootView, "safeAreaInsetRight");
    LayoutAnchor({
      strength: "strong",
      getState(oldState: number): number {
        const newState = this.view.viewport.safeArea.insetBottom;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsLayout);
        }
        return newState;
      },
    })(rootView, "safeAreaInsetBottom");
    LayoutAnchor({
      strength: "strong",
      getState(oldState: number): number {
        const newState = this.view.viewport.safeArea.insetLeft;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsLayout);
        }
        return newState;
      },
    })(rootView, "safeAreaInsetLeft");
  }

  private static _global?: LayoutManager;
  static global(): LayoutManager {
    if (LayoutManager._global === void 0) {
      LayoutManager._global = new LayoutManager();
    }
    return LayoutManager._global;
  }
}
ViewManager.Layout = LayoutManager;
