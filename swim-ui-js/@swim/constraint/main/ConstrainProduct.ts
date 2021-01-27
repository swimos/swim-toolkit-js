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
import {Constrain} from "./Constrain";
import {ConstrainTerm} from "./ConstrainTerm";
import {ConstrainVariable} from "./"; // forward import

export class ConstrainProduct extends ConstrainTerm implements Debug {
  constructor(coefficient: number, variable: ConstrainVariable) {
    super();
    Object.defineProperty(this, "coefficient", {
      value: coefficient,
      enumerable: true,
    });
    Object.defineProperty(this, "variable", {
      value: variable,
      enumerable: true,
    });
  }

  isConstant(): boolean {
    return false;
  }

  declare readonly coefficient: number;

  declare readonly variable: ConstrainVariable;

  get terms(): ConstraintMap<ConstrainVariable, number> {
    const terms = new ConstraintMap<ConstrainVariable, number>();
    terms.set(this.variable, this.coefficient);
    return terms;
  }

  get constant(): number {
    return 0;
  }

  plus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (that instanceof ConstrainProduct && this.variable === that.variable) {
      return Constrain.product(this.coefficient + that.coefficient, this.variable);
    } else if (that instanceof ConstrainVariable && this.variable === that) {
      return Constrain.product(this.coefficient + 1, this.variable);
    } else {
      return Constrain.sum(this, that);
    }
  }

  opposite(): ConstrainTerm {
    return Constrain.product(-this.coefficient, this.variable);
  }

  minus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (that instanceof ConstrainProduct && this.variable === that.variable) {
      return Constrain.product(this.coefficient - that.coefficient, this.variable);
    } else if (that instanceof ConstrainVariable && this.variable === that) {
      return Constrain.product(this.coefficient - 1, this.variable);
    } else {
      return Constrain.sum(this, that.opposite());
    }
  }

  times(scalar: number): Constrain {
    return Constrain.product(this.coefficient * scalar, this.variable);
  }

  divide(scalar: number): Constrain {
    return Constrain.product(this.coefficient / scalar, this.variable);
  }

  debug(output: Output): void {
    output = output.write("Constrain").write(46/*'.'*/).write("product").write(40/*'('*/)
        .debug(this.coefficient).write(", ").debug(this.variable).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
