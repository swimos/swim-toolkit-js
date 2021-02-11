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

import type {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {DrawingRenderer} from "../drawing/DrawingRenderer";
import type {PaintingContext} from "./PaintingContext";

export abstract class PaintingRenderer extends DrawingRenderer {
  abstract readonly context: PaintingContext;

  abstract readonly theme: ThemeMatrix | null;

  abstract readonly mood: MoodVector | null;

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined {
    const theme = this.theme;
    let value: T | undefined;
    if (theme !== null) {
      if (mood === void 0 || mood === null) {
        mood = this.mood;
      }
      if (mood !== null) {
        value = theme.dot(look, mood);
      }
    }
    return value;
  }

  getLookOr<T, V>(look: Look<T, unknown>, elseValue: V, mood?: MoodVector<Feel> | null): T | V {
    const theme = this.theme;
    let value: T | V | undefined;
    if (theme !== null) {
      if (mood === void 0 || mood === null) {
        mood = this.mood;
      }
      if (mood !== null) {
        value = theme.dot(look, mood);
      }
    }
    if (value === void 0) {
      value = elseValue;
    }
    return value;
  }
}
