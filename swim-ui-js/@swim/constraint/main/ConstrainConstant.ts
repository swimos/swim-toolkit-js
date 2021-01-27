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
import type {ConstrainVariable} from "./ConstrainVariable";

export class ConstrainConstant extends ConstrainTerm implements Debug {
  constructor(value: number) {
    super();
    Object.defineProperty(this, "value", {
      value: value,
      enumerable: true,
    });
  }

  isConstant(): boolean {
    return true;
  }

  declare readonly value: number;

  get coefficient(): number {
    return 0;
  }

  get variable(): ConstrainVariable | null {
    return null;
  }

  get terms(): ConstraintMap<ConstrainVariable, number> {
    return new ConstraintMap<ConstrainVariable, number>();
  }

  get constant(): number {
    return this.value;
  }

  plus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (that instanceof ConstrainConstant) {
      return Constrain.constant(this.value + that.value);
    } else {
      return Constrain.sum(this, that);
    }
  }

  opposite(): ConstrainTerm {
    return Constrain.constant(-this.value);
  }

  minus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (that instanceof ConstrainConstant) {
      return Constrain.constant(this.value - that.value);
    } else {
      return Constrain.sum(this, that.opposite());
    }
  }

  times(scalar: number): Constrain {
    return Constrain.constant(this.value * scalar);
  }

  divide(scalar: number): Constrain {
    return Constrain.constant(this.value / scalar);
  }

  debug(output: Output): void {
    output = output.write("Constrain").write(46/*'.'*/).write("constant")
        .write(40/*'('*/).debug(this.value).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
