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

import {GraphicsView, GraphicsViewController} from "@swim/graphics";
import {TickView} from "../tick/TickView";
import {AxisOrientation, AxisView} from "./AxisView";
import {AxisViewObserver} from "./AxisViewObserver";

export class AxisViewController<D = unknown, V extends AxisView<D> = AxisView<D>> extends GraphicsViewController<V> implements AxisViewObserver<D, V> {
  get orientation(): AxisOrientation {
    const view = this._view;
    return view !== null ? view.orientation : void 0 as any;
  }

  createTickView(tickValue: D): TickView<D> | null | undefined {
    return void 0;
  }

  createTickLabel(tickValue: D, tickView: TickView<D>): GraphicsView | string | null | undefined {
    return void 0;
  }

  formatTickLabel(tickLabel: string, tickView: TickView<D>): string | null {
    return tickLabel;
  }
}
