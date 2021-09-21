// Copyright 2015-2021 Swim Inc.
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

import type {PositionGestureInput} from "@swim/view";
import type {ControllerObserver} from "@swim/controller";
import type {CellView} from "./CellView";
import type {CellTrait} from "./CellTrait";
import type {CellController} from "./CellController";

export interface CellControllerObserver<C extends CellController = CellController> extends ControllerObserver<C> {
  controllerWillSetCellTrait?(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null, controller: C): void;

  controllerDidSetCellTrait?(newCellTrait: CellTrait | null, oldCellTrait: CellTrait | null, controller: C): void;

  controllerWillSetCellView?(newCellView: CellView | null, oldCellView: CellView | null, controller: C): void;

  controllerDidSetCellView?(newCellView: CellView | null, oldCellView: CellView | null, controller: C): void;

  controllerDidPressCellView?(input: PositionGestureInput, event: Event | null, cellView: CellView, controller: C): void;

  controllerDidLongPressCellView?(input: PositionGestureInput, cellView: CellView, controller: C): void;
}