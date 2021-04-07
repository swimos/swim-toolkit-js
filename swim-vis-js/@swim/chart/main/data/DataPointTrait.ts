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
import {GenericTrait} from "@swim/model";
import type {GraphicsView} from "@swim/graphics";
import type {DataPointTraitObserver} from "./DataPointTraitObserver";

export type DataPointLabel<X, Y> = DataPointLabelFunction<X, Y> | string;
export type DataPointLabelFunction<X, Y> = (dataPointTrait: DataPointTrait<X, Y>) => GraphicsView | string | null;

export class DataPointTrait<X, Y> extends GenericTrait {
  constructor(x: X, y: Y) {
    super();
    Object.defineProperty(this, "x", {
      value: x,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "y", {
      value: y,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "y2", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "radius", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "color", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "opacity", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "label", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<DataPointTraitObserver<X, Y>>;

  declare readonly x: X;

  setX(newX: X): void {
    const oldX = this.x;
    if (!Equals(newX, oldX)) {
      this.willSetX(newX, oldX);
      Object.defineProperty(this, "x", {
        value: newX,
        enumerable: true,
        configurable: true,
      });
      this.onSetX(newX, oldX);
      this.didSetX(newX, oldX);
    }
  }

  protected willSetX(newX: X, oldX: X): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointX !== void 0) {
        traitObserver.traitWillSetDataPointX(newX, oldX, this);
      }
    }
  }

  protected onSetX(newX: X, oldX: X): void {
    // hook
  }

  protected didSetX(newX: X, oldX: X): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointX !== void 0) {
        traitObserver.traitDidSetDataPointX(newX, oldX, this);
      }
    }
  }

  declare readonly y: Y;

  setY(newY: Y): void {
    const oldY = this.y;
    if (!Equals(newY, oldY)) {
      this.willSetY(newY, oldY);
      Object.defineProperty(this, "y", {
        value: newY,
        enumerable: true,
        configurable: true,
      });
      this.onSetY(newY, oldY);
      this.didSetY(newY, oldY);
    }
  }

  protected willSetY(newY: Y, oldY: Y): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointY !== void 0) {
        traitObserver.traitWillSetDataPointY(newY, oldY, this);
      }
    }
  }

  protected onSetY(newY: Y, oldY: Y): void {
    // hook
  }

  protected didSetY(newY: Y, oldY: Y): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointY !== void 0) {
        traitObserver.traitDidSetDataPointY(newY, oldY, this);
      }
    }
  }

  declare readonly y2: Y | undefined;

  setY2(newY2: Y | undefined): void {
    const oldY2 = this.y2;
    if (!Equals(newY2, oldY2)) {
      this.willSetY2(newY2, oldY2);
      Object.defineProperty(this, "y2", {
        value: newY2,
        enumerable: true,
        configurable: true,
      });
      this.onSetY2(newY2, oldY2);
      this.didSetY2(newY2, oldY2);
    }
  }

  protected willSetY2(newY2: Y | undefined, oldY2: Y | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointY2 !== void 0) {
        traitObserver.traitWillSetDataPointY2(newY2, oldY2, this);
      }
    }
  }

  protected onSetY2(newY2: Y | undefined, oldY2: Y | undefined): void {
    // hook
  }

  protected didSetY2(newY2: Y | undefined, oldY2: Y | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointY2 !== void 0) {
        traitObserver.traitDidSetDataPointY2(newY2, oldY2, this);
      }
    }
  }

  declare readonly radius: Length | null;

  setRadius(newRadius: AnyLength | null): void {
    if (newRadius !== null) {
      newRadius = Length.fromAny(newRadius);
    }
    const oldRadius = this.radius;
    if (!Equals(newRadius, oldRadius)) {
      this.willSetRadius(newRadius, oldRadius);
      Object.defineProperty(this, "radius", {
        value: newRadius,
        enumerable: true,
        configurable: true,
      });
      this.onSetRadius(newRadius, oldRadius);
      this.didSetRadius(newRadius, oldRadius);
    }
  }

  protected willSetRadius(newRadius: Length | null, oldRadius: Length | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointRadius !== void 0) {
        traitObserver.traitWillSetDataPointRadius(newRadius, oldRadius, this);
      }
    }
  }

  protected onSetRadius(newRadius: Length | null, oldRadius: Length | null): void {
    // hook
  }

  protected didSetRadius(newRadius: Length | null, oldRadius: Length | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointRadius !== void 0) {
        traitObserver.traitDidSetDataPointRadius(newRadius, oldRadius, this);
      }
    }
  }

  declare readonly color: Look<Color> | Color | null;

  setColor(newColor: Look<Color> | AnyColor | null): void {
    if (newColor !== null && !(newColor instanceof Look)) {
      newColor = Color.fromAny(newColor);
    }
    const oldColor = this.color;
    if (!Equals(newColor, oldColor)) {
      this.willSetColor(newColor, oldColor);
      Object.defineProperty(this, "color", {
        value: newColor,
        enumerable: true,
        configurable: true,
      });
      this.onSetColor(newColor, oldColor);
      this.didSetColor(newColor, oldColor);
    }
  }

  protected willSetColor(newColor: Look<Color> | Color | null, oldColor: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointColor !== void 0) {
        traitObserver.traitWillSetDataPointColor(newColor, oldColor, this);
      }
    }
  }

  protected onSetColor(newColor: Look<Color> | Color | null, oldColor: Look<Color> | Color | null): void {
    // hook
  }

  protected didSetColor(newColor: Look<Color> | Color | null, oldColor: Look<Color> | Color | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointColor !== void 0) {
        traitObserver.traitDidSetDataPointColor(newColor, oldColor, this);
      }
    }
  }

  declare readonly opacity: number | undefined;

  setOpacity(newOpacity: number | undefined): void {
    const oldOpacity = this.opacity;
    if (newOpacity !== oldOpacity) {
      this.willSetOpacity(newOpacity, oldOpacity);
      Object.defineProperty(this, "opacity", {
        value: newOpacity,
        enumerable: true,
        configurable: true,
      });
      this.onSetOpacity(newOpacity, oldOpacity);
      this.didSetOpacity(newOpacity, oldOpacity);
    }
  }

  protected willSetOpacity(newOpacity: number | undefined, oldOpacity: number | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointOpacity !== void 0) {
        traitObserver.traitWillSetDataPointOpacity(newOpacity, oldOpacity, this);
      }
    }
  }

  protected onSetOpacity(newOpacity: number | undefined, oldOpacity: number | undefined): void {
    // hook
  }

  protected didSetOpacity(newOpacity: number | undefined, oldOpacity: number | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointOpacity !== void 0) {
        traitObserver.traitDidSetDataPointOpacity(newOpacity, oldOpacity, this);
      }
    }
  }

  declare readonly label: DataPointLabel<X, Y> | null;

  setLabel(newLabel: DataPointLabel<X, Y> | null): void {
    const oldLabel = this.label;
    if (!Equals(newLabel, oldLabel)) {
      this.willSetLabel(newLabel, oldLabel);
      Object.defineProperty(this, "label", {
        value: newLabel,
        enumerable: true,
        configurable: true,
      });
      this.onSetLabel(newLabel, oldLabel);
      this.didSetLabel(newLabel, oldLabel);
    }
  }

  protected willSetLabel(newLabel: DataPointLabel<X, Y> | null, oldLabel: DataPointLabel<X, Y> | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitWillSetDataPointLabel !== void 0) {
        traitObserver.traitWillSetDataPointLabel(newLabel, oldLabel, this);
      }
    }
  }

  protected onSetLabel(newLabel: DataPointLabel<X, Y> | null, oldLabel: DataPointLabel<X, Y> | null): void {
    // hook
  }

  protected didSetLabel(newLabel: DataPointLabel<X, Y> | null, oldLabel: DataPointLabel<X, Y> | null): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.traitDidSetDataPointLabel !== void 0) {
        traitObserver.traitDidSetDataPointLabel(newLabel, oldLabel, this);
      }
    }
  }

  formatLabel(x: X | undefined, y: Y | undefined): string | undefined {
    return void 0;
  }
}
