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

import {Item, Record, Form} from "@swim/structure";
import {Length} from "@swim/math";
import {Color} from "@swim/color";
import {AnyBoxShadow, BoxShadow} from "./BoxShadow";

/** @hidden */
export class BoxShadowForm extends Form<BoxShadow, AnyBoxShadow> {
  constructor(unit: BoxShadow | undefined) {
    super();
    Object.defineProperty(this, "unit", {
      value: unit,
      enumerable: true,
    });
  }

  // @ts-ignore
  declare readonly unit: BoxShadow | undefined;

  withUnit(unit: BoxShadow | undefined): Form<BoxShadow, AnyBoxShadow> {
    if (unit !== this.unit) {
      return new BoxShadowForm(unit);
    } else {
      return this;
    }
  }

  mold(boxShadow: AnyBoxShadow): Item {
    let shadow = BoxShadow.fromAny(boxShadow);
    const record = Record.create();
    do {
      const header = Record.create(5);
      if (shadow._inset) {
        header.push("inset");
      }
      header.push(Length.form().mold(shadow._offsetX));
      header.push(Length.form().mold(shadow._offsetY));
      header.push(Length.form().mold(shadow._blurRadius));
      header.push(Length.form().mold(shadow._spreadRadius));
      header.push(Color.form().mold(shadow._color));
      record.attr("boxShadow", header);
      if (shadow._next !== null) {
        shadow = shadow._next;
        continue;
      }
      break;
    } while (true);
    return record;
  }

  cast(item: Item): BoxShadow | undefined {
    const value = item.toValue();
    let boxShadow: BoxShadow | undefined;
    try {
      boxShadow = BoxShadow.fromValue(value);
      if (boxShadow === void 0) {
        const string = value.stringValue();
        if (string !== void 0) {
          boxShadow = BoxShadow.parse(string);
        }
      }
    } catch (e) {
      // swallow
    }
    return boxShadow;
  }
}
BoxShadow.Form = BoxShadowForm;
