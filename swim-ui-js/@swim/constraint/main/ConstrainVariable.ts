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

import {ConstraintMap} from "./ConstraintMap";
import type {ConstraintSymbol} from "./ConstraintSymbol";
import {Constrain} from "./Constrain";
import {ConstrainTerm} from "./ConstrainTerm";
import type {AnyConstraintStrength, ConstraintStrength} from "./ConstraintStrength";

export abstract class ConstrainVariable extends ConstrainTerm implements ConstraintSymbol {
  /** @hidden */
  isExternal(): boolean {
    return true;
  }

  /** @hidden */
  isDummy(): boolean {
    return false;
  }

  /** @hidden */
  isInvalid(): boolean {
    return false;
  }

  isConstant(): boolean {
    return false;
  }

  abstract get name(): string;

  abstract get value(): number;

  abstract updateValue(value: number): void;

  abstract get state(): number;

  abstract setState(state: number): void;

  abstract get strength(): ConstraintStrength;

  abstract setStrength(strength: AnyConstraintStrength): void;

  get coefficient(): number {
    return 1;
  }

  get variable(): ConstrainVariable {
    return this;
  }

  get terms(): ConstraintMap<ConstrainVariable, number> {
    const terms = new ConstraintMap<ConstrainVariable, number>();
    terms.set(this, 1);
    return terms;
  }

  get constant(): number {
    return 0;
  }

  plus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (this === that) {
      return Constrain.product(2, this);
    } else {
      return Constrain.sum(this, that);
    }
  }

  opposite(): ConstrainTerm {
    return Constrain.product(-1, this);
  }

  minus(that: Constrain | number): Constrain {
    if (typeof that === "number") {
      that = Constrain.constant(that);
    }
    if (this === that) {
      return Constrain.zero();
    } else {
      return Constrain.sum(this, that.opposite());
    }
  }

  times(coefficient: number): Constrain {
    return Constrain.product(coefficient, this);
  }

  divide(scalar: number): Constrain {
    return Constrain.product(1 / scalar, this);
  }
}
Constrain.Variable = ConstrainVariable;
