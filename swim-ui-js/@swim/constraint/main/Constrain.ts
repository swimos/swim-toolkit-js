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

import {ConstraintKey, ConstraintMap} from "./ConstraintMap";
import {ConstrainSum} from "./"; // forward import
import {ConstrainTerm} from "./"; // forward import
import {ConstrainProduct} from "./"; // forward import
import {ConstrainConstant} from "./"; // forward import
import type {ConstrainVariable} from "./ConstrainVariable";

export abstract class Constrain implements ConstraintKey {
  constructor() {
    Object.defineProperty(this, "id", {
      value: ConstraintMap.nextId(),
      enumerable: true,
    });
  }

  declare readonly id: number;

  abstract isConstant(): boolean;

  abstract readonly terms: ConstraintMap<ConstrainVariable, number>;

  abstract readonly constant: number;

  abstract plus(that: Constrain | number): Constrain;

  abstract opposite(): Constrain;

  abstract minus(that: Constrain | number): Constrain;

  abstract times(scalar: number): Constrain;

  abstract divide(scalar: number): Constrain;

  static sum(...args: (Constrain | number)[]): ConstrainSum {
    const terms = new ConstraintMap<ConstrainVariable, number>();
    let constant = 0;
    for (let i = 0, n = args.length; i < n; i += 1) {
      const arg = args[i]!;
      if (typeof arg === "number") {
        constant += arg;
      } else if (arg instanceof ConstrainTerm) {
        const variable = arg.variable;
        if (variable !== null) {
          const field = terms.getField(variable);
          if (field !== void 0) {
            field[1] += arg.coefficient;
          } else {
            terms.set(variable, arg.coefficient);
          }
        } else {
          constant += arg.constant;
        }
      } else {
        const subterms = arg.terms;
        for (let j = 0, k = subterms.size; j < k; j += 1) {
          const [variable, coefficient] = subterms.getEntry(j)!;
          const field = terms.getField(variable);
          if (field !== void 0) {
            field[1] += coefficient;
          } else {
            terms.set(variable, coefficient);
          }
        }
        constant += arg.constant;
      }
    }
    return new ConstrainSum(terms, constant);
  }

  static product(coefficient: number, variable: ConstrainVariable): ConstrainProduct {
    return new ConstrainProduct(coefficient, variable);
  }

  static constant(value: number): ConstrainConstant {
    return new ConstrainConstant(value);
  }

  static zero(): ConstrainConstant {
    return new ConstrainConstant(0);
  }
}
