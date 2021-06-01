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

import {R2Point, R2Box} from "@swim/math";
import {View} from "@swim/view";
import {GraphicsView, CanvasContext, TypesetView} from "@swim/graphics";
import {TickOrientation, TickView} from "./TickView";

export class LeftTickView<Y> extends TickView<Y> {
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
      labelView.textAlign.setState("right", View.Intrinsic);
      labelView.textBaseline.setState("middle", View.Intrinsic);
      labelView.textOrigin.setState(new R2Point(x2, y), View.Intrinsic);
    }
  }

  protected override renderTick(context: CanvasContext, frame: R2Box): void {
    const anchor = this.anchor.getValue();
    const x0 = Math.round(anchor.x);
    const y = Math.round(anchor.y);
    const tickMarkLength = this.tickMarkLength.getValue();
    const x1 = x0 - tickMarkLength;

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
      context.strokeStyle = gridLineColor.toString();
      context.lineWidth = gridLineWidth;
      context.moveTo(x0, y);
      context.lineTo(frame.xMax, y);
      context.stroke();
    }
  }
}
