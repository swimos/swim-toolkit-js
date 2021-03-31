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
import type {LayoutManager} from "./LayoutManager";

/** @hidden */
export class LayoutSolver extends ConstraintSolver {
  /** @hidden */
  readonly _layoutManager: LayoutManager;

  constructor(layoutManager: LayoutManager) {
    super();
    this._layoutManager = layoutManager;
  }

  get layoutManager(): LayoutManager {
    return this._layoutManager;
  }

  protected didAddConstraint(constraint: Constraint): void {
    this._layoutManager.didAddConstraint(constraint);
  }

  protected didRemoveConstraint(constraint: Constraint): void {
    this._layoutManager.didRemoveConstraint(constraint);
  }

  protected didAddConstraintVariable(constraintVariable: ConstrainVariable): void {
    this._layoutManager.didAddConstraintVariable(constraintVariable);
  }

  protected didRemoveConstraintVariable(constraintVariable: ConstrainVariable): void {
    this._layoutManager.didRemoveConstraintVariable(constraintVariable);
  }

  protected didUpdateConstraintVariable(constraintVariable: ConstrainVariable, newValue: number, oldValue: number): void {
    this._layoutManager.didUpdateConstraintVariable(constraintVariable, newValue, oldValue);
  }
}
