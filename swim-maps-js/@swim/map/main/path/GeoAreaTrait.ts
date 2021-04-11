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

import {Equals} from "@swim/util";
import {AnyLength, Length} from "@swim/math";
import {AnyColor, Color} from "@swim/style";
import {Look} from "@swim/theme";
import {GeoPathTrait} from "./GeoPathTrait";
import type {GeoAreaTraitObserver} from "./GeoAreaTraitObserver";

export abstract class GeoAreaTrait extends GeoPathTrait {
  constructor() {
    super();
    Object.defineProperty(this, "fill", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "stroke", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "strokeWidth", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<GeoAreaTraitObserver>;

  declare readonly fill: Look<Color> | Color | null;

  setFill(newFill: Look<Color> | AnyColor | null): void {
    if (newFill !== null && !(newFill instanceof Look)) {
      newFill = Color.fromAny(newFill);
    }
    const oldFill = this.fill;
    if (!Equals(newFill, oldFill)) {
      this.willSetFill(newFill, oldFill);
      Object.defineProperty(this, "fill", {
        value: newFill,
        enumerable: true,
        configurable: true,
      });
      this.onSetFill(newFill, oldFill);
      this.didSetFill(newFill, oldFill);
    }
  }

  protected willSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetFill !== void 0) {
        traitObserver.traitWillSetFill(newFill, oldFill, this);
      }
    }
  }

  protected onSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    // hook
  }

  protected didSetFill(newFill: Look<Color> | Color | null, oldFill: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetFill !== void 0) {
        traitObserver.traitDidSetFill(newFill, oldFill, this);
      }
    }
  }

  declare readonly stroke: Look<Color> | Color | null;

  setStroke(newStroke: Look<Color> | AnyColor | null): void {
    if (newStroke !== null && !(newStroke instanceof Look)) {
      newStroke = Color.fromAny(newStroke);
    }
    const oldStroke = this.stroke;
    if (!Equals(newStroke, oldStroke)) {
      this.willSetStroke(newStroke, oldStroke);
      Object.defineProperty(this, "stroke", {
        value: newStroke,
        enumerable: true,
        configurable: true,
      });
      this.onSetStroke(newStroke, oldStroke);
      this.didSetStroke(newStroke, oldStroke);
    }
  }

  protected willSetStroke(newStroke: Look<Color> | Color | null, oldStroke: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetStroke !== void 0) {
        traitObserver.traitWillSetStroke(newStroke, oldStroke, this);
      }
    }
  }

  protected onSetStroke(newStroke: Look<Color> | Color | null, oldStroke: Look<Color> | Color | null): void {
    // hook
  }

  protected didSetStroke(newStroke: Look<Color> | Color | null, oldStroke: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetStroke !== void 0) {
        traitObserver.traitDidSetStroke(newStroke, oldStroke, this);
      }
    }
  }

  declare readonly strokeWidth: Length | null;

  setStrokeWidth(newStrokeWidth: AnyLength): void {
    newStrokeWidth = Length.fromAny(newStrokeWidth);
    const oldStrokeWidth = this.strokeWidth;
    if (!Equals(newStrokeWidth, oldStrokeWidth)) {
      this.willSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
      Object.defineProperty(this, "strokeWidth", {
        value: newStrokeWidth,
        enumerable: true,
        configurable: true,
      });
      this.onSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
      this.didSetStrokeWidth(newStrokeWidth, oldStrokeWidth);
    }
  }

  protected willSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetStrokeWidth !== void 0) {
        traitObserver.traitWillSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
      }
    }
  }

  protected onSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    // hook
  }

  protected didSetStrokeWidth(newStrokeWidth: Length | null, oldStrokeWidth: Length | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetStrokeWidth !== void 0) {
        traitObserver.traitDidSetStrokeWidth(newStrokeWidth, oldStrokeWidth, this);
      }
    }
  }
}
