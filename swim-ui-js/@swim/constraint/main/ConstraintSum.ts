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

import {Output, Debug, Format} from "@swim/codec";
import {ConstraintMap} from "./ConstraintMap";
import {AnyConstraintExpression, ConstraintExpression} from "./ConstraintExpression";
import type {ConstraintVariable} from "./ConstraintVariable";

/** @hidden */
export class ConstraintSum implements ConstraintExpression, Debug {
  constructor(terms: ConstraintMap<ConstraintVariable, number>, constant: number) {
    Object.defineProperty(this, "terms", {
      value: terms,
      enumerable: true,
    });
    Object.defineProperty(this, "constant", {
      value: constant,
      enumerable: true,
    });
  }

  isConstant(): boolean {
    return this.terms.isEmpty();
  }

  declare readonly terms: ConstraintMap<ConstraintVariable, number>;

  declare readonly constant: number;

  plus(that: AnyConstraintExpression): ConstraintExpression {
    return ConstraintExpression.sum(this, that);
  }

  negative(): ConstraintExpression {
    const oldTerms = this.terms;
    const newTerms = new ConstraintMap<ConstraintVariable, number>();
    for (let i = 0, n = oldTerms.size; i < n; i += 1) {
      const [variable, coefficient] = oldTerms.getEntry(i)!;
      newTerms.set(variable, -coefficient);
    }
    return new ConstraintSum(newTerms, -this.constant);
  }

  minus(that: AnyConstraintExpression): ConstraintExpression {
    if (typeof that === "number") {
      that = ConstraintExpression.constant(that);
    } else {
      that = that.negative();
    }
    return ConstraintExpression.sum(this, that);
  }

  times(scalar: number): ConstraintExpression {
    const oldTerms = this.terms;
    const newTerms = new ConstraintMap<ConstraintVariable, number>();
    for (let i = 0, n = oldTerms.size; i < n; i += 1) {
      const [variable, coefficient] = oldTerms.getEntry(i)!;
      newTerms.set(variable, coefficient * scalar);
    }
    return new ConstraintSum(newTerms, this.constant * scalar);
  }

  divide(scalar: number): ConstraintExpression {
    const oldTerms = this.terms;
    const newTerms = new ConstraintMap<ConstraintVariable, number>();
    for (let i = 0, n = oldTerms.size; i < n; i += 1) {
      const [variable, coefficient] = oldTerms.getEntry(i)!;
      newTerms.set(variable, coefficient / scalar);
    }
    return new ConstraintSum(newTerms, this.constant / scalar);
  }

  debug(output: Output): void {
    output = output.write("ConstraintExpression").write(46/*'.'*/).write("sum").write(40/*'('*/);
    const n = this.terms.size;
    for (let i = 0; i < n; i += 1) {
      const [variable, coefficient] = this.terms.getEntry(i)!;
      if (i > 0) {
        output = output.write(", ");
      }
      if (coefficient === 1) {
        output = output.debug(variable);
      } else {
        output = output.debug(ConstraintExpression.product(coefficient, variable));
      }
    }
    if (this.constant !== 0) {
      if (n > 0) {
        output = output.write(", ");
      }
      output = output.debug(this.constant);
    }
    output = output.write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
