// Copyright 2015-2023 Swim.inc
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

import {Murmur3} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import type {Equivalent} from "@swim/util";
import type {HashCode} from "@swim/util";
import type {Interpolate} from "@swim/util";
import type {Interpolator} from "@swim/util";
import type {Output} from "@swim/codec";
import type {Debug} from "@swim/codec";
import {Format} from "@swim/codec";
import {ExpansionInterpolator} from "./ExpansionInterpolator";

/** @public */
export type AnyExpansion = Expansion | ExpansionInit | boolean;

/** @public */
export interface ExpansionInit {
  /** @internal */
  uid?: never; // force type ambiguity between Expansion and ExpansionInit
  readonly phase: number;
  readonly direction: number;
}

/** @public */
export class Expansion implements Interpolate<Expansion>, HashCode, Equivalent, Debug {
  constructor(phase: number, direction: number) {
    this.phase = phase;
    this.direction = direction;
  }

  /** @internal */
  declare uid?: unknown; // force type ambiguity between Expansion and ExpansionInit

  readonly phase: number;

  withPhase(phase: number): Expansion {
    if (phase !== this.phase) {
      return Expansion.create(phase, this.direction);
    } else {
      return this;
    }
  }

  readonly direction: number;

  withDirection(direction: number): Expansion {
    if (direction !== this.direction) {
      return Expansion.create(this.phase, direction);
    } else {
      return this;
    }
  }

  get collapsed(): boolean {
    return this.phase === 0 && this.direction === 0;
  }

  get expanded(): boolean {
    return this.phase === 1 && this.direction === 0;
  }

  get expanding(): boolean {
    return this.direction > 0;
  }

  get collapsing(): boolean {
    return this.direction < 0;
  }

  asExpanding(): Expansion {
    if (!this.expanding) {
      return Expansion.expanding(this.phase);
    } else {
      return this;
    }
  }

  asCollapsing(): Expansion {
    if (!this.collapsing) {
      return Expansion.collapsing(this.phase);
    } else {
      return this;
    }
  }

  asToggling(): Expansion {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Expansion.collapsing(this.phase);
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Expansion.expanding(this.phase);
    } else {
      return this;
    }
  }

  asToggled(): Expansion {
    if (this.direction > 0 || this.phase >= 0.5) {
      return Expansion.collapsed();
    } else if (this.direction < 0 || this.phase < 0.5) {
      return Expansion.expanded();
    } else {
      return this;
    }
  }

  interpolateTo(that: Expansion): Interpolator<Expansion>;
  interpolateTo(that: unknown): Interpolator<Expansion> | null;
  interpolateTo(that: unknown): Interpolator<Expansion> | null {
    if (that instanceof Expansion) {
      return ExpansionInterpolator(this, that);
    } else {
      return null;
    }
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Expansion) {
      return Numbers.equivalent(this.phase, that.phase, epsilon)
          && Numbers.equivalent(this.direction, that.direction, epsilon);
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Expansion) {
      return this.phase === that.phase && this.direction === that.direction;
    }
    return false;
  }

  hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Constructors.hash(Expansion),
        Numbers.hash(this.phase)), Numbers.hash(this.direction)));
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Expansion").write(46/*'.'*/);
    if (this.phase === 0 && this.direction === 0) {
      output = output.write("collapsed").write(40/*'('*/);
    } else if (this.phase === 1 && this.direction === 0) {
      output = output.write("expanded").write(40/*'('*/);
    } else if (this.direction === 1) {
      output = output.write("expanding").write(40/*'('*/);
      if (this.phase !== 0) {
        output = output.debug(this.phase);
      }
    } else if (this.direction === -1) {
      output = output.write("collapsing").write(40/*'('*/);
      if (this.phase !== 1) {
        output = output.debug(this.phase);
      }
    } else {
      output = output.write("create").write(40/*'('*/).debug(this.phase);
      if (this.direction !== 0) {
        output = output.write(", ").debug(this.direction);
      }
    }
    output = output.write(41/*')'*/);
    return output;
  }

  toString(): string {
    return Format.debug(this);
  }

  /** @internal */
  static readonly Collapsed: Expansion = new Expansion(0, 0);

  static collapsed(): Expansion {
    return this.Collapsed;
  }

  /** @internal */
  static readonly Expanded: Expansion = new Expansion(1, 0);

  static expanded(): Expansion {
    return this.Expanded;
  }

  static expanding(phase?: number): Expansion {
    if (phase === void 0) {
      phase = 0;
    }
    return new Expansion(phase, 1);
  }

  static collapsing(phase?: number): Expansion {
    if (phase === void 0) {
      phase = 1;
    }
    return new Expansion(phase, -1);
  }

  static create(phase: number, direction?: number): Expansion {
    if (direction === void 0) {
      direction = 0;
    }
    if (phase === 0 && direction === 0) {
      return Expansion.collapsed();
    } else if (phase === 1 && direction === 0) {
      return Expansion.expanded();
    } else {
      return new Expansion(phase, direction);
    }
  }

  static fromInit(value: ExpansionInit): Expansion {
    return new Expansion(value.phase, value.direction);
  }

  static fromAny(value: AnyExpansion): Expansion;
  static fromAny(value: AnyExpansion | null): Expansion | null;
  static fromAny(value: AnyExpansion | null | undefined): Expansion | null | undefined;
  static fromAny(value: AnyExpansion | null | undefined): Expansion | null | undefined {
    if (value === void 0 || value === null || value instanceof Expansion) {
      return value;
    } else if (Expansion.isInit(value)) {
      return Expansion.fromInit(value);
    } else if (value === true) {
      return Expansion.expanded();
    } else if (value === false) {
      return Expansion.collapsed();
    }
    throw new TypeError("" + value);
  }

  /** @internal */
  static isInit(value: unknown): value is ExpansionInit {
    if (typeof value === "object" && value !== null) {
      const init = value as ExpansionInit;
      return typeof init.phase === "number"
          && typeof init.direction === "number";
    }
    return false;
  }

  /** @internal */
  static isAny(value: unknown): value is AnyExpansion {
    return value instanceof Expansion
        || Expansion.isInit(value)
        || typeof value === "boolean";
  }
}
