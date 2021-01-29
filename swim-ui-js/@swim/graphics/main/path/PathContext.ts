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

import type {DrawingContext} from "../drawing/DrawingContext";

export class PathContext implements DrawingContext {
  private x0: number | undefined;
  private y0: number | undefined;
  private x1: number | undefined;
  private y1: number | undefined;
  private d: string;

  constructor() {
    this.x0 = void 0;
    this.y0 = void 0;
    this.x1 = void 0;
    this.y1 = void 0;
    this.d = "";
  }

  moveTo(x: number, y: number): void {
    this.d += "M" + (this.x0 = this.x1 = x) + "," + (this.y0 = this.y1 = y);
  }

  lineTo(x: number, y: number): void {
    this.d += "L" + (this.x1 = x) + "," + (this.y1 = y);
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number): void {
    this.d += "Q" + x1 + "," + y1 + "," + (this.x1 = x) + "," + (this.y1 = y);
  }

  bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void {
    this.d += "C" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + (this.x1 = x) + "," + (this.y1 = y);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
    const x0 = +(this.x1 as any);
    const y0 = +(this.y1 as any);
    const x21 = x2 - x1;
    const y21 = y2 - y1;
    const x01 = x0 - x1;
    const y01 = y0 - y1;
    const l01_2 = x01 * x01 + y01 * y01;

    if (r < 0) {
      throw new Error("negative radius: " + r);
    } else if (this.x1 === void 0) {
      // empty path
      this.d += "M" + (this.x1 = x1) + "," + (this.y1 = y1);
    } else if (!(l01_2 > PathContext.Epsilon)) {
      // coincident endpoints
    } else if (!(Math.abs(y01 * x21 - y21 * x01) > PathContext.Epsilon) || r === 0) {
      // colinear control points
      this.d += "L" + (this.x1 = x1) + "," + (this.y1 = y1);
    } else {
      const x20 = x2 - x0;
      const y20 = y2 - y0;
      const l21_2 = x21 * x21 + y21 * y21;
      const l20_2 = x20 * x20 + y20 * y20;
      const l21 = Math.sqrt(l21_2);
      const l01 = Math.sqrt(l01_2);
      const l = r * Math.tan((Math.PI - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2);
      const t01 = l / l01;
      const t21 = l / l21;
      if (Math.abs(t01 - 1) > PathContext.Epsilon) {
        // line to start tangent
        this.d += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      this.d += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," +
                (this.x1 = x1 + t21 * x21) + "," + (this.y1 = y1 + t21 * y21);
    }
  }

  arc(cx: number, cy: number, r: number, a0: number, a1: number, ccw: boolean = false): void {
    const dx = r * Math.cos(a0);
    const dy = r * Math.sin(a0);
    const x0 = cx + dx;
    const y0 = cy + dy;
    const cw = 1 ^ +ccw;
    let da = ccw ? a0 - a1 : a1 - a0;

    if (r < 0) {
      throw new Error("negative radius: " + r);
    } else if (this.x1 === void 0) {
      // empty path
      this.d += "M" + x0 + "," + y0;
    } else if (Math.abs(+(this.x1 as any) - x0) > PathContext.Epsilon || Math.abs(+(this.y1 as any) - y0) > PathContext.Epsilon) {
      // line to start point
      this.d += "L" + x0 + "," + y0;
    }

    if (r === 0) {
      return;
    } else if (da < 0) {
      // reverse direction
      da = da % (2 * Math.PI) + 2 * Math.PI;
    }

    if (da > 2 * Math.PI - PathContext.Epsilon) {
      // complete circle
      this.d += "A" + r + "," + r + ",0,1," + cw + "," + (cx - dx) + "," + (cy - dy) +
                "A" + r + "," + r + ",0,1," + cw + "," + (this.x1 = x0) + "," + (this.y1 = y0);
    } else if (da > PathContext.Epsilon) {
      // non-zero arc angle
      this.d += "A" + r + "," + r + ",0," + (+(da >= Math.PI)) + "," + cw + "," +
                (this.x1 = cx + r * Math.cos(a1)) + "," + (this.y1 = cy + r * Math.sin(a1));
    }
  }

  rect(x: number, y: number, w: number, h: number): void {
    this.d += "M" + (this.x0 = this.x1 = x) + "," + (this.y0 = this.y1 = y) + "h" + w + "v" + h + "h" + -w + "Z";
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, phi: number, a0: number, a1: number, ccw?: boolean): void {
    let da = a1 - a0;
    if (ccw === true && da > 0) {
      da -= 2 * Math.PI;
    } else if (ccw === false && da < 0) {
      da += 2 * Math.PI;
    }
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosA1 = Math.cos(a1);
    const sinA1 = Math.sin(a1);
    const x1 = cosPhi * rx * cosA1 - sinPhi * ry * sinA1 + cx;
    const y1 = sinPhi * rx * cosA1 + cosPhi * ry * sinA1 + cy;
    const large = Math.abs(da) > Math.PI;
    const sweep = da > 0;
    this.d += "A" + rx + "," + ry + " " + phi + " " + (large ? "1" : "0") + " " + (sweep ? "1" : "0") + (this.x1 = x1) + "," + (this.y1 = y1);
  }

  closePath(): void {
    if (this.x1 !== void 0) {
      this.x1 = this.x0;
      this.y1 = this.y0;
      this.d += "Z";
    }
  }

  toString(): string {
    return this.d;
  }

  /** @hidden */
  static Epsilon: number = 1e-6;
}
