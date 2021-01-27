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

import {Constrain} from "./Constrain";
import type {ConstraintRelation} from "./ConstraintRelation";
import {AnyConstraintStrength, ConstraintStrength} from "./ConstraintStrength";
import {Constraint} from "./Constraint";
import type {ConstraintScope} from "./ConstraintScope";

export class ConstraintGroup {
  constructor(scope: ConstraintScope) {
    Object.defineProperty(this, "scope", {
      value: scope,
      enumerable: true,
    });
    Object.defineProperty(this, "constraints", {
      value: [],
      enumerable: true,
    });
    Object.defineProperty(this, "active", {
      value: false,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly scope: ConstraintScope;

  constraint(lhs: Constrain | number, relation: ConstraintRelation,
             rhs?: Constrain | number, strength?: AnyConstraintStrength): Constraint {
    if (typeof lhs === "number") {
      lhs = Constrain.constant(lhs);
    }
    if (typeof rhs === "number") {
      rhs = Constrain.constant(rhs);
    }
    const constrain = rhs !== void 0 ? lhs.minus(rhs) : lhs;
    if (strength === void 0) {
      strength = ConstraintStrength.Required;
    } else {
      strength = ConstraintStrength.fromAny(strength);
    }
    const constraint = new Constraint(this.scope, constrain, relation, strength);
    this.addConstraint(constraint);
    return constraint;
  }

  declare readonly constraints: ReadonlyArray<Constraint>;

  hasConstraint(constraint: Constraint): boolean {
    const constraints = this.constraints;
    return constraints.indexOf(constraint) >= 0;
  }

  addConstraint(constraint: Constraint): void {
    const constraints = this.constraints;
    if (constraints.indexOf(constraint) < 0) {
      (constraints as Constraint[]).push(constraint);
      constraint.enabled(this.active);
    }
  }

  removeConstraint(constraint: Constraint): void {
    const constraints = this.constraints;
    if (constraints !== void 0) {
      const index = constraints.indexOf(constraint);
      if (index >= 0) {
        (constraints as Constraint[]).splice(index, 1);
        constraint.enabled(false);
      }
    }
  }

  /** @hidden */
  enableConstraints(): void {
    const constraints = this.constraints;
    for (let i = 0, n = constraints.length ; i < n; i += 1) {
      constraints[i]!.enabled(true);
    }
  }

  /** @hidden */
  disableConstraints(): void {
    const constraints = this.constraints;
    for (let i = 0, n = constraints.length ; i < n; i += 1) {
      constraints[i]!.enabled(false);
    }
  }

  /** @hidden */
  declare readonly active: boolean;

  enabled(): boolean;
  enabled(enabled: boolean): this;
  enabled(enabled?: boolean): boolean | this {
    if (enabled === void 0) {
      return this.active;
    } else {
      if (enabled && !this.active) {
        Object.defineProperty(this, "active", {
          value: true,
          enumerable: true,
          configurable: true,
        });
        this.enableConstraints();
      } else if (!enabled && this.active) {
        Object.defineProperty(this, "active", {
          value: false,
          enumerable: true,
          configurable: true,
        });
        this.disableConstraints();
      }
      return this;
    }
  }
}
