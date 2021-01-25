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

import type {Equivalent, HashCode} from "@swim/util";
import {Output, Parser, Debug, Diagnostic, Unicode} from "@swim/codec";
import type {Interpolate, Interpolator} from "@swim/mapping";
import type {Value, Form} from "@swim/structure";
import {AnyAngle, Angle} from "@swim/math";
import type {ColorParser} from "./ColorParser";
import type {ColorForm} from "./ColorForm";
import type {RgbColorInit, RgbColor} from "../rgb/RgbColor";
import type {HexColorParser} from "../rgb/HexColorParser";
import type {RgbColorParser} from "../rgb/RgbColorParser";
import {RgbColorInterpolator} from "../"; // forward import
import type {HslColorInit, HslColor} from "../hsl/HslColor";
import type {HslColorParser} from "../hsl/HslColorParser";

export type AnyColor = Color | ColorInit | string;

export type ColorInit = RgbColorInit | HslColorInit;

export abstract class Color implements Interpolate<Color>, HashCode, Equivalent, Debug {
  abstract isDefined(): boolean;

  abstract alpha(): number;
  abstract alpha(a: number): Color;

  abstract plus(that: AnyColor): Color;

  abstract times(scalar: number): Color;

  abstract combine(that: AnyColor, scalar?: number): Color;

  abstract lightness(): number;

  abstract lighter(k?: number): Color;

  abstract darker(k?: number): Color;

  contrast(k?: number): Color {
    return this.lightness() < 0.67 ? this.lighter(k) : this.darker(k);
  }

  abstract rgb(): RgbColor;

  abstract hsl(): HslColor;

  interpolateTo(that: Color): Interpolator<Color>;
  interpolateTo(that: unknown): Interpolator<Color> | null;
  interpolateTo(that: unknown): Interpolator<Color> | null {
    if (that instanceof Color) {
      return RgbColorInterpolator(this.rgb(), that.rgb());
    } else {
      return null;
    }
  }

  abstract equivalentTo(that: unknown, epsilon?: number): boolean;

  abstract equals(other: unknown): boolean;

  abstract hashCode(): number;

  abstract debug(output: Output): void;

  abstract toHexString(): string;

  abstract toString(): string;

  static transparent(): Color {
    return Color.Rgb.transparent();
  }

  static black(alpha?: number): Color {
    return Color.Rgb.black(alpha);
  }

  static white(alpha?: number): Color {
    return Color.Rgb.white(alpha);
  }

  static rgb(value: AnyColor): RgbColor;
  static rgb(r: number, g: number, b: number, a?: number): RgbColor;
  static rgb(r: AnyColor | number, g?: number, b?: number, a?: number): RgbColor {
    if (arguments.length === 1) {
      return Color.fromAny(r as AnyColor).rgb();
    } else {
      return new Color.Rgb(r as number, g!, b!, a);
    }
  }

  static hsl(value: AnyColor): HslColor;
  static hsl(h: AnyAngle, s: number, l: number, a?: number): HslColor;
  static hsl(h: AnyColor | AnyAngle, s?: number, l?: number, a?: number): HslColor {
    if (arguments.length === 1) {
      return Color.fromAny(h as AnyColor).hsl();
    } else {
      h = typeof h === "number" ? h : Angle.fromAny(h as AnyAngle).degValue();
      return new Color.Hsl(h, s!, l!, a);
    }
  }

  static fromName(name: string): Color | undefined {
    switch (name) {
      case "transparent": return Color.transparent();
      case "black": return Color.black();
      case "white": return Color.white();
      default: return void 0;
    }
  }

  static fromInit(value: ColorInit): Color {
    if (Color.Rgb.isInit(value)) {
      return Color.Rgb.fromInit(value);
    } else if (Color.Hsl.isInit(value)) {
      return Color.Hsl.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static fromAny(value: AnyColor): Color {
    if (value instanceof Color) {
      return value;
    } else if (typeof value === "string") {
      return Color.parse(value);
    } else if (Color.Rgb.isInit(value)) {
      return Color.Rgb.fromInit(value);
    } else if (Color.Hsl.isInit(value)) {
      return Color.Hsl.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static fromValue(value: Value): Color | undefined {
    let color: Color | undefined;
    color = Color.Rgb.fromValue(value);
    if (color === void 0) {
      color = Color.Hsl.fromValue(value);
    }
    return color;
  }

  static parse(string: string): Color {
    let input = Unicode.stringInput(string);
    while (input.isCont() && Unicode.isWhitespace(input.head())) {
      input = input.step();
    }
    let parser = Color.Parser.parse(input);
    if (parser.isDone()) {
      while (input.isCont() && Unicode.isWhitespace(input.head())) {
        input = input.step();
      }
    }
    if (input.isCont() && !parser.isError()) {
      parser = Parser.error(Diagnostic.unexpected(input));
    }
    return parser.bind();
  }

  /** @hidden */
  static isInit(value: unknown): value is ColorInit {
    return Color.Rgb.isInit(value) || Color.Hsl.isInit(value);
  }

  /** @hidden */
  static isAny(value: unknown): value is AnyColor {
    return value instanceof Color
        || Color.isInit(value)
        || typeof value === "string";
  }

  private static _form?: Form<Color, AnyColor>;
  static form(unit?: AnyColor): Form<Color, AnyColor> {
    if (unit !== void 0) {
      unit = Color.fromAny(unit);
    }
    if (unit === void 0 || unit === Color.transparent()) {
      if (Color._form === void 0) {
        Color._form = new Color.Form(Color.transparent());
      }
      return Color._form;
    } else {
      return new Color.Form(unit);
    }
  }

  /** @hidden */
  static Darker: number = 0.7;
  /** @hidden */
  static Brighter: number = 1 / Color.Darker;

  // Forward type declarations
  /** @hidden */
  static Parser: typeof ColorParser; // defined by ColorParser
  /** @hidden */
  static Form: typeof ColorForm; // defined by ColorForm
  /** @hidden */
  static Rgb: typeof RgbColor; // defined by RgbColor
  /** @hidden */
  static HexParser: typeof HexColorParser; // defined by HexColorParser
  /** @hidden */
  static RgbParser: typeof RgbColorParser; // defined by RgbColorParser
  /** @hidden */
  static Hsl: typeof HslColor; // defined by HslColor
  /** @hidden */
  static HslParser: typeof HslColorParser; // defined by HslColorParser
}
