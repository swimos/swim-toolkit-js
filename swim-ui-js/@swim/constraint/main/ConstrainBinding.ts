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
import {ConstrainVariable} from "./ConstrainVariable";
import {AnyConstraintStrength, ConstraintStrength} from "./ConstraintStrength";
import type {ConstraintScope} from "./ConstraintScope";

export class ConstrainBinding extends ConstrainVariable implements Debug {
  constructor(owner: ConstraintScope, name: string, value: number, strength: ConstraintStrength) {
    super();
    Object.defineProperty(this, "owner", {
      value: owner,
      enumerable: true,
    });
    Object.defineProperty(this, "name", {
      value: name,
      enumerable: true,
    });
    Object.defineProperty(this, "value", {
      value: value,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "state", {
      value: NaN,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "strength", {
      value: strength,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly owner: ConstraintScope;

  declare readonly name: string;

  declare readonly value: number;

  updateValue(value: number): void {
    Object.defineProperty(this, "value", {
      value: value,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly state: number;

  setState(newState: number): void {
    const oldState = this.state;
    if (isFinite(oldState) && !isFinite(newState)) {
      this.owner.removeConstraintVariable(this);
    }
    Object.defineProperty(this, "state", {
      value: newState,
      enumerable: true,
      configurable: true,
    });
    if (isFinite(newState)) {
      if (!isFinite(oldState)) {
        this.owner.addConstraintVariable(this);
      } else {
        this.owner.setConstraintVariable(this, newState);
      }
    }
  }

  declare readonly strength: ConstraintStrength;

  setStrength(newStrength: AnyConstraintStrength): void {
    const state = this.state;
    const oldStrength = this.strength;
    newStrength = ConstraintStrength.fromAny(newStrength);
    if (isFinite(state) && oldStrength !== newStrength) {
      this.owner.removeConstraintVariable(this);
    }
    Object.defineProperty(this, "strength", {
      value: newStrength,
      enumerable: true,
      configurable: true,
    });
    if (isFinite(state) && oldStrength !== newStrength) {
      this.owner.addConstraintVariable(this);
    }
  }

  debug(output: Output): void {
    output = output.debug(this.owner).write(46/*'.'*/).write("variable").write(40/*'('*/)
        .debug(this.name).write(", ").debug(this.value).write(41/*')'*/);
  }

  toString(): string {
    return Format.debug(this);
  }
}
