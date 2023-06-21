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

import {Objects} from "@swim/util";
import type {Equals} from "@swim/util";
import type {Output} from "@swim/codec";
import type {Debug} from "@swim/codec";
import {Format} from "@swim/codec";
import type {HistoryStateInit} from "./HistoryState";
import {HistoryService} from "./HistoryService";

/** @public */
export type AnyHyperlink = Hyperlink | HyperlinkInit | string;

/** @public */
export type HyperlinkInit = HistoryHyperlinkInit | LocationHyperlinkInit;

/** @public */
export abstract class Hyperlink implements Equals, Debug {
  abstract readonly state: Readonly<HistoryStateInit> | null;

  abstract readonly href: string | undefined;

  abstract readonly title: string | undefined;

  abstract activate(event?: Event | null): void;

  /** @override */
  abstract equals(that: unknown): boolean;

  /** @override */
  abstract debug<T>(output: Output<T>): Output<T>;

  /** @override */
  toString(): string {
    return Format.debug(this);
  }

  static history(state: HistoryStateInit, href?: string, title?: string): HistoryHyperlink {
    return new HistoryHyperlink(state, href, title);
  }

  static location(href: string, title?: string): LocationHyperlink {
    return new LocationHyperlink(href, title);
  }

  static fromInit(init: HyperlinkInit): Hyperlink {
    if ("fragment" in init || "permanent" in init || "ephemeral" in init) {
      const state: HistoryStateInit = {};
      if (init.fragment !== void 0) {
        state.fragment = init.fragment;
      }
      if (init.permanent !== void 0) {
        state.permanent = init.permanent;
      }
      if (init.ephemeral !== void 0) {
        state.ephemeral = init.ephemeral;
      }
      return new HistoryHyperlink(state, init.href, init.title);
    } else if (init.href !== void 0) {
      return new LocationHyperlink(init.href, init.title);
    }
    throw new TypeError("invalid hyperlink");
  }

  static fromAny(hyperlink: AnyHyperlink): Hyperlink;
  static fromAny(hyperlink: AnyHyperlink | null | undefined): Hyperlink | null | undefined;
  static fromAny(hyperlink: AnyHyperlink | null | undefined): Hyperlink | null | undefined {
    if (hyperlink === void 0 || hyperlink === null || hyperlink instanceof Hyperlink) {
      return hyperlink;
    } else if (typeof hyperlink === "string") {
      return new LocationHyperlink(hyperlink, void 0);
    } else if (!("state" in hyperlink) && !("href" in hyperlink)) {
      return new HistoryHyperlink(hyperlink, void 0, void 0);
    }
    return this.fromInit(hyperlink);
  }
}

/** @public */
export interface HistoryHyperlinkInit extends HistoryStateInit {
  href?: string;
  title?: string;
}

/** @public */
export class HistoryHyperlink extends Hyperlink {
  constructor(state: Readonly<HistoryStateInit>, href: string | undefined,
              title: string | undefined) {
    super();
    this.state = state;
    this.href = href;
    this.title = title;
  }

  override readonly state: Readonly<HistoryStateInit>;

  override readonly href: string | undefined;

  override readonly title: string | undefined;

  override activate(event?: Event | null): void {
    if (event !== void 0 && event !== null) {
      event.preventDefault();
    }
    HistoryService.global().pushHistory(this.state);
  }

  override equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof HistoryHyperlink) {
      return Objects.equal(this.state, that.state)
          && this.href === that.href && this.title === that.title;
    }
    return false;
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Hyperlink").write(46/*'.'*/).write("history")
                   .write(40/*'('*/).debug(this.state);
    if (this.href !== void 0) {
      output = output.write(", ").debug(this.href);
    }
    if (this.title !== void 0) {
      output = output.write(", ").debug(this.title);
    }
    output = output.write(41/*')'*/);
    return output;
  }
}

/** @public */
export interface LocationHyperlinkInit {
  state?: undefined;
  href: string;
  title?: string;
}

/** @public */
export class LocationHyperlink extends Hyperlink {
  constructor(href: string, title: string | undefined) {
    super();
    this.href = href;
    this.title = title;
  }

  get state(): Readonly<HistoryStateInit> | null {
    return null;
  }

  override readonly href: string;

  override readonly title: string | undefined;

  override activate(event?: Event | null): void {
    if (event !== void 0 && event !== null) {
      event.preventDefault();
    }
    window.location.assign(this.href);
  }

  override equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof LocationHyperlink) {
      return this.href === that.href && this.title === that.title;
    }
    return false;
  }

  debug<T>(output: Output<T>): Output<T> {
    output = output.write("Hyperlink").write(46/*'.'*/).write("location")
                   .write(40/*'('*/).debug(this.href);
    if (this.title !== void 0) {
      output = output.write(", ").debug(this.title);
    }
    output = output.write(41/*')'*/);
    return output;
  }
}
