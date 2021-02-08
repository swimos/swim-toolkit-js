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

import {AnyAngle, Angle, BoxR2, PathR2} from "@swim/math";
import type {GraphicsRenderer} from "../graphics/GraphicsRenderer";
import type {DrawingContext} from "../drawing/DrawingContext";
import {DrawingRenderer} from "../drawing/DrawingRenderer";
import {Icon} from "./Icon";

export class PolygonIcon extends Icon {
  constructor(sides: number, rotation: Angle) {
    super();
    Object.defineProperty(this, "sides", {
      value: sides,
      enumerable: true,
    });
    Object.defineProperty(this, "rotation", {
      value: rotation,
      enumerable: true,
    });
  }

  declare readonly sides: number;

  declare readonly rotation: Angle;

  render(renderer: GraphicsRenderer, frame: BoxR2): void {
    if (renderer instanceof DrawingRenderer) {
      this.draw(renderer.context, frame);
    }
  }

  draw(context: DrawingContext, frame: BoxR2): void {
    const sides = this.sides;
    if (sides >= 3) {
      const width = frame.width;
      const height = frame.height;
      const radius = Math.min(width, height) / 2;
      const sector = 2 * Math.PI / sides;
      let angle = this.rotation.radValue();
      context.moveTo(radius + radius * Math.cos(angle),
                     radius + radius * Math.sin(angle));
      angle += sector;
      for (let i = 1; i < sides; i += 1) {
        context.lineTo(radius + radius * Math.cos(angle),
                       radius + radius * Math.sin(angle));
        angle += sector;
      }
      context.closePath();
    }
  }

  toPath(frame: BoxR2): PathR2 {
    const context = PathR2.builder();
    const sides = this.sides;
    if (sides >= 3) {
      const centerX = (frame.xMin + frame.xMax) / 2;
      const centerY = (frame.yMin + frame.yMax) / 2;
      const width = frame.width;
      const height = frame.height;
      const radius = Math.min(width, height) / 2;
      const sector = 2 * Math.PI / sides;
      let angle = this.rotation.radValue();
      context.moveTo(centerX + radius * Math.cos(angle),
                     centerY + radius * Math.sin(angle));
      angle += sector;
      for (let i = 1; i < sides; i += 1) {
        context.lineTo(centerX + radius * Math.cos(angle),
                       centerY + radius * Math.sin(angle));
        angle += sector;
      }
      context.closePath();
    }
    return context.bind();
  }

  static create(sides: number, rotation?: AnyAngle): PolygonIcon {
    if (rotation !== void 0) {
      rotation = Angle.fromAny(rotation);
    } else {
      rotation = Angle.zero();
    }
    return new PolygonIcon(sides, rotation);
  }
}
