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

import {Item, Record, Num, Bool, Form} from "@swim/structure";
import {Length, Angle, Transform} from "@swim/math";
import {DateTime} from "@swim/time";
import {Color} from "@swim/color";
import {Font} from "../font/Font";
import {BoxShadow} from "../shadow/BoxShadow";
import {AnyStyleValue, StyleValue} from "./StyleValue";

/** @hidden */
export class StyleValueForm extends Form<StyleValue, AnyStyleValue> {
  constructor(unit: StyleValue | undefined) {
    super();
    Object.defineProperty(this, "unit", {
      value: unit,
      enumerable: true,
    });
  }

  // @ts-ignore
  declare readonly unit: StyleValue | undefined;

  withUnit(unit: StyleValue | undefined): Form<StyleValue, AnyStyleValue> {
    if (unit !== this.unit) {
      return new StyleValueForm(unit);
    } else {
      return this;
    }
  }

  mold(value: AnyStyleValue): Item {
    if (value !== void 0) {
      value = StyleValue.fromAny(value);
      if (value instanceof DateTime) {
        return DateTime.form().mold(value);
      } else if (value instanceof Angle) {
        return Angle.form().mold(value);
      } else if (value instanceof Length) {
        return Length.form().mold(value);
      } else if (value instanceof Color) {
        return Color.form().mold(value);
      } else if (value instanceof Font) {
        return Font.form().mold(value);
      } else if (value instanceof BoxShadow) {
        return BoxShadow.form().mold(value);
      } else if (value instanceof Transform) {
        return Transform.form().mold(value);
      } else if (typeof value === "number") {
        return Num.from(value);
      }
      throw new TypeError("" + value);
    } else {
      return Item.extant();
    }
  }

  cast(item: Item): StyleValue | undefined {
    const value = item.toValue();
    if (value instanceof Num) {
      return value.numberValue();
    }
    if (value instanceof Bool) {
      return value.booleanValue();
    }
    const string = value.stringValue(void 0);
    if (string !== void 0) {
      try {
        return StyleValue.parse(string);
      } catch (e) {
        // swallow
      }
    }
    if (value instanceof Record) {
      const date = DateTime.fromValue(value);
      if (date !== void 0) {
        return date;
      }
      const angle = Angle.fromValue(value);
      if (angle !== void 0) {
        return angle;
      }
      const length = Length.fromValue(value);
      if (length !== void 0) {
        return length;
      }
      const color = Color.fromValue(value);
      if (color !== void 0) {
        return color;
      }
      const font = Font.fromValue(value);
      if (font !== void 0) {
        return font;
      }
      const boxShadow = BoxShadow.fromValue(value);
      if (boxShadow !== void 0) {
        return boxShadow;
      }
      const transform = Transform.fromValue(value);
      if (transform !== void 0) {
        return transform;
      }
    }
    return void 0;
  }
}
StyleValue.Form = StyleValueForm;
