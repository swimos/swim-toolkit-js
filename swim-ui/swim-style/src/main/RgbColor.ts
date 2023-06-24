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
import type {Mutable} from "@swim/util";
import {Numbers} from "@swim/util";
import {Constructors} from "@swim/util";
import {Interpolator} from "@swim/util";
import {Diagnostic} from "@swim/codec";
import type {Input} from "@swim/codec";
import type {Output} from "@swim/codec";
import {Parser} from "@swim/codec";
import {Base16} from "@swim/codec";
import {Unicode} from "@swim/codec";
import type {Item} from "@swim/structure";
import {Value} from "@swim/structure";
import type {AnyColor} from "./Color";
import {Color} from "./Color";
import type {ColorChannel} from "./Color";
import {ColorChannelParser} from "./Color";
import {HslColor} from "./"; // forward import

/** @public */
export type AnyRgbColor = RgbColor | RgbColorInit | string;

/** @public */
export interface RgbColorInit {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number;
}

/** @public */
export class RgbColor extends Color {
  constructor(r: number, g: number, b: number, a: number = 1) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.stringValue = void 0;
  }

  override isDefined(): boolean {
    return isFinite(this.r) && isFinite(this.g)
        && isFinite(this.b) && isFinite(this.a);
  }

  readonly r: number;

  readonly g: number;

  readonly b: number;

  readonly a: number;

  override alpha(): number;
  override alpha(a: number): RgbColor;
  override alpha(a?: number): number | RgbColor {
    if (a === void 0) {
      return this.a;
    } else if (this.a !== a) {
      return new RgbColor(this.r, this.g, this.b, a);
    } else {
      return this;
    }
  }

  override get lightness(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    return (max + min) / 2;
  }

  override plus(that: AnyColor): RgbColor {
    that = Color.fromAny(that).rgb();
    return new RgbColor(this.r + (that as RgbColor).r, this.g + (that as RgbColor).g,
                        this.b + (that as RgbColor).b, this.a + (that as RgbColor).a);
  }

  override times(scalar: number): RgbColor {
    return new RgbColor(this.r * scalar, this.g * scalar, this.b * scalar, this.a * scalar);
  }

  override combine(that: AnyColor, scalar: number = 1): Color {
    that = Color.fromAny(that).rgb();
    return new RgbColor(this.r + (that as RgbColor).r * scalar, this.g + (that as RgbColor).g * scalar,
                        this.b + (that as RgbColor).b * scalar, this.a + (that as RgbColor).a * scalar);
  }

  override lighter(k?: number): RgbColor {
    k = k === void 0 ? Color.Brighter : Math.pow(Color.Brighter, k);
    return k !== 1 ? new RgbColor(this.r * k, this.g * k, this.b * k, this.a) : this;
  }

  override darker(k?: number): RgbColor {
    k = k === void 0 ? Color.Darker : Math.pow(Color.Darker, k);
    return k !== 1 ? new RgbColor(this.r * k, this.g * k, this.b * k, this.a) : this;
  }

  override rgb(): RgbColor {
    return this;
  }

  override hsl(): HslColor {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    let h = NaN;
    let s = max - min;
    const l = (max + min) / 2;
    if (s !== 0) {
      if (r === max) {
        h = (g - b) / s + +(g < b) * 6;
      } else if (g === max) {
        h = (b - r) / s + 2;
      } else {
        h = (r - g) / s + 4;
      }
      s /= l < 0.5 ? max + min : 2 - (max + min);
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new HslColor(h, s, l, this.a);
  }

  override interpolateTo(that: RgbColor): Interpolator<RgbColor>;
  override interpolateTo(that: Color): Interpolator<Color>;
  override interpolateTo(that: unknown): Interpolator<Color> | null;
  override interpolateTo(that: unknown): Interpolator<Color> | null {
    if (that instanceof RgbColor) {
      return RgbColorInterpolator(this, that);
    } else {
      return super.interpolateTo(that);
    }
  }

  override equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof Color) {
      that = that.rgb();
      return Numbers.equivalent(this.r, (that as RgbColor).r, epsilon)
          && Numbers.equivalent(this.g, (that as RgbColor).g, epsilon)
          && Numbers.equivalent(this.b, (that as RgbColor).b, epsilon)
          && Numbers.equivalent(this.a, (that as RgbColor).a, epsilon);
    }
    return false;
  }

  override equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof RgbColor) {
      return this.r === that.r && this.g === that.g && this.b === that.b && this.a === that.a;
    }
    return false;
  }

  override hashCode(): number {
    return Murmur3.mash(Murmur3.mix(Murmur3.mix(Murmur3.mix(Murmur3.mix(Constructors.hash(RgbColor),
        Numbers.hash(this.r)), Numbers.hash(this.g)), Numbers.hash(this.b)), Numbers.hash(this.a)));
  }

  override debug<T>(output: Output<T>): Output<T> {
    output = output.write("Color").write(46/*'.'*/).write("rgb").write(40/*'('*/)
                   .debug(this.r).write(", ").debug(this.g).write(", ").debug(this.b);
    if (this.a !== 1) {
      output = output.write(", ").debug(this.a);
    }
    output = output.write(41/*')'*/);
    return output;
  }

  override toHexString(): string {
    const r = Math.min(Math.max(0, Math.round(this.r || 0)), 255);
    const g = Math.min(Math.max(0, Math.round(this.g || 0)), 255);
    const b = Math.min(Math.max(0, Math.round(this.b || 0)), 255);
    let s = "#";
    const base16Alphabet = Base16.lowercase.alphabet;
    s += base16Alphabet.charAt(r >>> 4 & 0xf);
    s += base16Alphabet.charAt(r & 0xf);
    s += base16Alphabet.charAt(g >>> 4 & 0xf);
    s += base16Alphabet.charAt(g & 0xf);
    s += base16Alphabet.charAt(b >>> 4 & 0xf);
    s += base16Alphabet.charAt(b & 0xf);
    return s;
  }

  toRgbString(): string {
    let a = this.a;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(this.a, 1));
    let s = a === 1 ? "rgb" : "rgba";
    s += "(";
    s += Math.max(0, Math.min(Math.round(this.r) || 0, 255));
    s += ",";
    s += Math.max(0, Math.min(Math.round(this.g) || 0, 255));
    s += ",";
    s += Math.max(0, Math.min(Math.round(this.b) || 0, 255));
    if (a !== 1) {
      s += ",";
      s += a;
    }
    s += ")";
    return s;
  }

  override toHslString(): string {
    return this.hsl().toHslString();
  }

  /** @internal */
  readonly stringValue: string | undefined;

  override toString(): string {
    let s = this.stringValue;
    if (s === void 0) {
      let a = this.a;
      a = isNaN(a) ? 1 : Math.max(0, Math.min(this.a, 1));
      if (a === 1) {
        s = this.toHexString();
      } else {
        s = this.toRgbString();
      }
      (this as Mutable<this>).stringValue = s;
    }
    return s;
  }

  /** @internal */
  static readonly Transparent: RgbColor = new this(0, 0, 0, 0);

  static override transparent(): RgbColor {
    return this.Transparent;
  }

  static override black(alpha: number = 1): RgbColor {
    return new RgbColor(0, 0, 0, alpha);
  }

  static override white(alpha: number = 1): RgbColor {
    return new RgbColor(255, 255, 255, alpha);
  }

  static override fromInit(value: RgbColorInit): RgbColor {
    return new RgbColor(value.r, value.g, value.b, value.a);
  }

  static override fromAny(value: AnyRgbColor): RgbColor;
  static override fromAny(value: AnyRgbColor | null): RgbColor | null;
  static override fromAny(value: AnyRgbColor | null | undefined): RgbColor | null | undefined;
  static override fromAny(value: AnyRgbColor | null | undefined): RgbColor | null | undefined {
    if (value === void 0 || value === null || value instanceof RgbColor) {
      return value;
    } else if (typeof value === "string") {
      return RgbColor.parse(value);
    } else if (RgbColor.isInit(value)) {
      return RgbColor.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static override fromValue(value: Value): RgbColor | null {
    const tag = value.tag;
    let positional: boolean;
    if (tag === "rgb" || tag === "rgba") {
      value = value.header(tag);
      positional = true;
    } else {
      positional = false;
    }
    let r: number | undefined;
    let g: number | undefined;
    let b: number | undefined;
    let a: number | undefined;
    value.forEach(function (member: Item, index: number): void {
      const key = member.key.stringValue();
      if (key !== void 0) {
        if (key === "r") {
          r = member.toValue().numberValue(r);
        } else if (key === "g") {
          g = member.toValue().numberValue(g);
        } else if (key === "b") {
          b = member.toValue().numberValue(b);
        } else if (key === "a") {
          a = member.toValue().numberValue(a);
        }
      } else if (member instanceof Value && positional) {
        if (index === 0) {
          r = member.numberValue(r);
        } else if (index === 1) {
          g = member.numberValue(g);
        } else if (index === 2) {
          b = member.numberValue(b);
        } else if (index === 3) {
          a = member.numberValue(a);
        }
      }
    });
    if (r !== void 0 && g !== void 0 && b !== void 0) {
      return new RgbColor(r, g, b, a);
    }
    return null;
  }

  static override parse(str: string): RgbColor {
    return Color.parse(str).rgb();
  }

  /** @internal */
  static override isInit(value: unknown): value is RgbColorInit {
    if (typeof value === "object" && value !== null) {
      const init = value as RgbColorInit;
      return typeof init.r === "number"
          && typeof init.g === "number"
          && typeof init.b === "number"
          && (typeof init.a === "number" || typeof init.a === "undefined");
    }
    return false;
  }

  /** @internal */
  static override isAny(value: unknown): value is AnyRgbColor {
    return value instanceof RgbColor
        || RgbColor.isInit(value)
        || typeof value === "string";
  }
}

/** @internal */
export const RgbColorInterpolator = (function (_super: typeof Interpolator) {
  const RgbColorInterpolator = function (c0: RgbColor, c1: RgbColor): Interpolator<RgbColor> {
    const interpolator = function (u: number): RgbColor {
      const c0 = interpolator[0];
      const c1 = interpolator[1];
      const r = c0.r + u * (c1.r - c0.r);
      const g = c0.g + u * (c1.g - c0.g);
      const b = c0.b + u * (c1.b - c0.b);
      const a = c0.a + u * (c1.a - c0.a);
      return new RgbColor(r, g, b, a);
    } as Interpolator<RgbColor>;
    Object.setPrototypeOf(interpolator, RgbColorInterpolator.prototype);
    (interpolator as Mutable<typeof interpolator>)[0] = c0;
    (interpolator as Mutable<typeof interpolator>)[1] = c1;
    return interpolator;
  } as {
    (c0: RgbColor, c1: RgbColor): Interpolator<RgbColor>;

    /** @internal */
    prototype: Interpolator<RgbColor>;
  };

  RgbColorInterpolator.prototype = Object.create(_super.prototype);
  RgbColorInterpolator.prototype.constructor = RgbColorInterpolator;

  return RgbColorInterpolator;
})(Interpolator);

/** @internal */
export class RgbColorParser extends Parser<RgbColor> {
  private readonly rParser: Parser<ColorChannel> | undefined;
  private readonly gParser: Parser<ColorChannel> | undefined;
  private readonly bParser: Parser<ColorChannel> | undefined;
  private readonly aParser: Parser<ColorChannel> | undefined;
  private readonly step: number | undefined;

  constructor(rParser?: Parser<ColorChannel>, gParser?: Parser<ColorChannel>,
              bParser?: Parser<ColorChannel>, aParser?: Parser<ColorChannel>,
              step?: number) {
    super();
    this.rParser = rParser;
    this.gParser = gParser;
    this.bParser = bParser;
    this.aParser = aParser;
    this.step = step;
  }

  override feed(input: Input): Parser<RgbColor> {
    return RgbColorParser.parse(input, this.rParser, this.gParser,
                                this.bParser, this.aParser, this.step);
  }

  static parse(input: Input, rParser?: Parser<ColorChannel>, gParser?: Parser<ColorChannel>,
               bParser?: Parser<ColorChannel>, aParser?: Parser<ColorChannel>,
               step?: number): Parser<RgbColor> {
    let c = 0;
    if (step === 1) {
      if (input.isCont() && input.head() === 114/*'r'*/) {
        input = input.step();
        step = 2;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("r", input));
      }
    }
    if (step === 2) {
      if (input.isCont() && input.head() === 103/*'g'*/) {
        input = input.step();
        step = 3;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("g", input));
      }
    }
    if (step === 3) {
      if (input.isCont() && input.head() === 98/*'b'*/) {
        input = input.step();
        step = 4;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("b", input));
      }
    }
    if (step === 4) {
      if (input.isCont() && input.head() === 97/*'a'*/) {
        input = input.step();
        step = 5;
      } else if (!input.isEmpty()) {
        step = 5;
      }
    }
    if (step === 5) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont() && c === 40/*'('*/) {
        input = input.step();
        step = 6;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("(", input));
      }
    }
    if (step === 6) {
      if (rParser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          rParser = ColorChannelParser.parse(input);
        }
      } else {
        rParser = rParser.feed(input);
      }
      if (rParser !== void 0) {
        if (rParser.isDone()) {
          step = 7;
        } else if (rParser.isError()) {
          return rParser.asError();
        }
      }
    }
    if (step === 7) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        if (c === 44/*','*/) {
          input = input.step();
        }
        step = 8;
      } else if (input.isDone()) {
        return Parser.error(Diagnostic.unexpected(input));
      }
    }
    if (step === 8) {
      if (gParser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          gParser = ColorChannelParser.parse(input);
        }
      } else {
        gParser = gParser.feed(input);
      }
      if (gParser !== void 0) {
        if (gParser.isDone()) {
          step = 9;
        } else if (gParser.isError()) {
          return gParser.asError();
        }
      }
    }
    if (step === 9) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        if (c === 44/*','*/) {
          input = input.step();
        }
        step = 10;
      } else if (input.isDone()) {
        return Parser.error(Diagnostic.unexpected(input));
      }
    }
    if (step === 10) {
      if (bParser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          bParser = ColorChannelParser.parse(input);
        }
      } else {
        bParser = bParser.feed(input);
      }
      if (bParser !== void 0) {
        if (bParser.isDone()) {
          step = 11;
        } else if (bParser.isError()) {
          return bParser.asError();
        }
      }
    }
    if (step === 11) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont()) {
        if (c === 41/*')'*/) {
          input = input.step();
          return Parser.done(new RgbColor(rParser!.bind().scale(255),
                                          gParser!.bind().scale(255),
                                          bParser!.bind().scale(255)));
        } else if (c === 44/*','*/ || c === 47/*'/'*/) {
          input = input.step();
        }
        step = 12;
      } else if (input.isDone()) {
        return Parser.error(Diagnostic.unexpected(input));
      }
    }
    if (step === 12) {
      if (aParser === void 0) {
        while (input.isCont() && Unicode.isSpace(input.head())) {
          input = input.step();
        }
        if (!input.isEmpty()) {
          aParser = ColorChannelParser.parse(input);
        }
      } else {
        aParser = aParser.feed(input);
      }
      if (aParser !== void 0) {
        if (aParser.isDone()) {
          step = 13;
        } else if (aParser.isError()) {
          return aParser.asError();
        }
      }
    }
    if (step === 13) {
      while (input.isCont() && (c = input.head(), Unicode.isSpace(c))) {
        input = input.step();
      }
      if (input.isCont() && c === 41/*')'*/) {
        input = input.step();
        return Parser.done(new RgbColor(rParser!.bind().scale(255),
                                        gParser!.bind().scale(255),
                                        bParser!.bind().scale(255),
                                        aParser!.bind().scale(1)));
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected(")", input));
      }
    }
    return new RgbColorParser(rParser, gParser, bParser, aParser, step);
  }

  /** @internal */
  static parseRest(input: Input): Parser<RgbColor> {
    return RgbColorParser.parse(input, void 0, void 0, void 0, void 0, 5);
  }
}

/** @internal */
export class HexColorParser extends Parser<RgbColor> {
  private readonly value: number | undefined;
  private readonly step: number | undefined;

  constructor(value?: number, step?: number) {
    super();
    this.value = value;
    this.step = step;
  }

  override feed(input: Input): Parser<RgbColor> {
    return HexColorParser.parse(input, this.value, this.step);
  }

  static parse(input: Input, value: number = 0, step: number = 1): Parser<RgbColor> {
    let c = 0;
    if (step === 1) {
      if (input.isCont() && input.head() === 35/*'#'*/) {
        input = input.step();
        step = 2;
      } else if (!input.isEmpty()) {
        return Parser.error(Diagnostic.expected("#", input));
      }
    }
    if (step >= 2) {
      while (step <= 9 && input.isCont()) {
        c = input.head();
        if (Base16.isDigit(c)) {
          input = input.step();
          value = (value << 4) | Base16.decodeDigit(c);
          step += 1;
        } else {
          break;
        }
      }
      if (!input.isEmpty()) {
        if (step === 5) { // #xxx
          return Parser.done(new RgbColor(value >> 8 & 0x0f | value >> 4 & 0xf0,
                                          value >> 4 & 0x0f | value & 0xf0,
                                          value << 4 & 0xf0 | value & 0x0f));
        } else if (step === 6) { // #xxxx
          return Parser.done(new RgbColor(value >> 12 & 0x0f | value >> 8 & 0xf0,
                                          value >> 8 & 0x0f | value >> 4 & 0xf0,
                                          value >> 4 & 0x0f | value & 0xf0,
                                          (value << 4 & 0xf0 | value & 0x0f) / 255));
        } else if (step === 8) { // #xxxxxx
          return Parser.done(new RgbColor(value >> 16 & 0xff,
                                          value >> 8 & 0xff,
                                          value & 0xff));
        } else if (step === 10) { // #xxxxxxxx
          return Parser.done(new RgbColor(value >> 24 & 0xff,
                                          value >> 16 & 0xff,
                                          value >> 8 & 0xff,
                                          (value & 0xff) / 255));
        } else {
          return Parser.error(Diagnostic.unexpected(input));
        }
      }
    }
    return new HexColorParser(value, step);
  }
}
