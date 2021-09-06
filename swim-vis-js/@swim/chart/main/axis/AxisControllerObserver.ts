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

import type {ControllerObserver} from "@swim/controller";
import type {AxisView} from "./AxisView";
import type {AxisTrait} from "./AxisTrait";
import type {AxisController} from "./AxisController";

export interface AxisControllerObserver<D, C extends AxisController<D> = AxisController<D>> extends ControllerObserver<C> {
  controllerWillSetAxisTrait?(newAxisTrait: AxisTrait<D> | null, oldAxisTrait: AxisTrait<D> | null, controller: C): void;

  controllerDidSetAxisTrait?(newAxisTrait: AxisTrait<D> | null, oldAxisTrait: AxisTrait<D> | null, controller: C): void;

  controllerWillSetAxisView?(newAxisView: AxisView<D> | null, oldAxisView: AxisView<D> | null, controller: C): void;

  controllerDidSetAxisView?(newAxisView: AxisView<D> | null, oldAxisView: AxisView<D> | null, controller: C): void;
}
