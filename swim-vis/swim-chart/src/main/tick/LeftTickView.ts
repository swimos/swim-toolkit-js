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

import {Affinity} from "@swim/component";
import {R2Point} from "@swim/math";
import type {R2Box} from "@swim/math";
import type {GraphicsView} from "@swim/graphics";
import type {PaintingContext} from "@swim/graphics";
import {TypesetView} from "@swim/graphics";
import type {TickOrientation} from "./TickView";
import {TickView} from "./TickView";

/** @public */
export class LeftTickView<Y = unknown> extends TickView<Y> {
  constructor(value: Y) {
    super(value);
  }

  override get orientation(): TickOrientation {
    return "left";
  }

  protected override layoutLabel(labelView: GraphicsView): void {
    const anchor = this.anchor.getValue();
    const x0 = Math.round(anchor.x);
    const y = Math.round(anchor.y);
    const x1 = x0 - this.tickMarkLength.getValue();
    const x2 = x1 - this.tickLabelPadding.getValue();

    if (TypesetView.is(labelView)) {
      labelView.textAlign.setState("right", Affinity.Intrinsic);
      labelView.textBaseline.setState("middle", Affinity.Intrinsic);
      labelView.textOrigin.setState(new R2Point(x2, y), Affinity.Intrinsic);
    }
  }

  protected override renderTick(context: PaintingContext, frame: R2Box): void {
    const anchor = this.anchor.getValue();
    const x0 = Math.round(anchor.x);
    const y = Math.round(anchor.y);
    const tickMarkLength = this.tickMarkLength.getValue();
    const x1 = x0 - tickMarkLength;

    // save
    const contextLineWidth = context.lineWidth;
    const contextStrokeStyle = context.strokeStyle;

    const tickMarkColor = this.tickMarkColor.value;
    const tickMarkWidth = this.tickMarkWidth.getValue();
    if (tickMarkColor !== null && tickMarkWidth !== 0 && tickMarkLength !== 0) {
      context.beginPath();
      context.strokeStyle = tickMarkColor.toString();
      context.lineWidth = tickMarkWidth;
      context.moveTo(x0, y);
      context.lineTo(x1, y);
      context.stroke();
    }

    const gridLineColor = this.gridLineColor.value;
    const gridLineWidth = this.gridLineWidth.getValue();
    if (gridLineColor !== null && gridLineWidth !== 0 && frame.yMin < y && y < frame.yMax) {
      context.beginPath();
      context.lineWidth = gridLineWidth;
      context.strokeStyle = gridLineColor.toString();
      context.moveTo(x0, y);
      context.lineTo(frame.xMax, y);
      context.stroke();
    }

    // restore
    context.lineWidth = contextLineWidth;
    context.strokeStyle = contextStrokeStyle;
  }
}
