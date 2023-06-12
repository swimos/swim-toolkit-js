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

import {Interpolator} from "@swim/util";
import {Diagnostic} from "@swim/codec";
import type {Input} from "@swim/codec";
import {Parser} from "@swim/codec";
import {Unicode} from "@swim/codec";
import type {Form} from "@swim/structure";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyAngle} from "@swim/math";
import {Angle} from "@swim/math";
import type {AnyTransform} from "@swim/math";
import {Transform} from "@swim/math";
import type {AnyDateTime} from "@swim/time";
import {DateTime} from "@swim/time";
import type {AnyFont} from "../font/Font";
import {Font} from "../font/Font";
import type {AnyColor} from "../color/Color";
import {Color} from "../color/Color";
import type {RgbColorInit} from "../rgb/RgbColor";
import type {HslColorInit} from "../hsl/HslColor";
import type {AnyLinearGradient} from "../gradient/LinearGradient";
import {LinearGradient} from "../gradient/LinearGradient";
import type {AnyBoxShadow} from "../shadow/BoxShadow";
import type {BoxShadowInit} from "../shadow/BoxShadow";
import {BoxShadow} from "../shadow/BoxShadow";
import {StyleValueForm} from "../"; // forward import
import {StyleValueParser} from "../"; // forward import

/** @public */
export type AnyStyleValue = AnyDateTime
                          | AnyAngle
                          | AnyLength
                          | AnyFont
                          | AnyColor | RgbColorInit | HslColorInit
                          | AnyLinearGradient
                          | AnyBoxShadow | BoxShadowInit
                          | AnyTransform
                          | Interpolator<any>
                          | number
                          | boolean;

/** @public */
export type StyleValue = DateTime
                       | Angle
                       | Length
                       | Font
                       | Color
                       | LinearGradient
                       | BoxShadow
                       | Transform
                       | Interpolator<any>
                       | number
                       | boolean;

/** @public */
export const StyleValue = (function () {
  const StyleValue = {} as {
    fromAny(value: AnyStyleValue): StyleValue;

    parse(input: Input | string): StyleValue;

    form(): Form<StyleValue, AnyStyleValue>;
  };

  StyleValue.fromAny = function (value: AnyStyleValue): StyleValue {
    if (value instanceof DateTime
        || value instanceof Angle
        || value instanceof Length
        || value instanceof Color
        || value instanceof Font
        || value instanceof BoxShadow
        || value instanceof LinearGradient
        || value instanceof Transform
        || value instanceof Interpolator
        || typeof value === "number"
        || typeof value === "boolean") {
      return value;
    } else if (value instanceof Date || DateTime.isInit(value)) {
      return DateTime.fromAny(value);
    } else if (Font.isInit(value)) {
      return Font.fromAny(value);
    } else if (Color.isInit(value)) {
      return Color.fromAny(value);
    } else if (BoxShadow.isInit(value)) {
      return BoxShadow.fromAny(value)!;
    } else if (typeof value === "string") {
      return StyleValue.parse(value);
    }
    throw new TypeError("" + value);
  };

  StyleValue.parse = function (input: Input | string): StyleValue {
    if (typeof input === "string") {
      input = Unicode.stringInput(input);
    }
    while (input.isCont() && Unicode.isWhitespace(input.head())) {
      input = input.step();
    }
    let parser = StyleValueParser.parse(input);
    if (parser.isDone()) {
      while (input.isCont() && Unicode.isWhitespace(input.head())) {
        input = input.step();
      }
    }
    if (input.isCont() && !parser.isError()) {
      parser = Parser.error(Diagnostic.unexpected(input));
    }
    return parser.bind();
  };

  Object.defineProperty(StyleValue, "form", {
    value: function (): Form<StyleValue, AnyStyleValue> {
      const form = new StyleValueForm(void 0);
      Object.defineProperty(StyleValue, "form", {
        value: function (): Form<StyleValue, AnyStyleValue> {
          return form;
        },
        enumerable: true,
        configurable: true,
      });
      return form;
    },
    enumerable: true,
    configurable: true,
  });

  return StyleValue;
})();
