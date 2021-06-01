// Copyright 2015-2021 Swim inc.
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

import type {ComponentObserver} from "@swim/component";
import type {AxisView} from "./AxisView";
import type {AxisTrait} from "./AxisTrait";
import type {AxisComponent} from "./AxisComponent";

export interface AxisComponentObserver<D, C extends AxisComponent<D> = AxisComponent<D>> extends ComponentObserver<C> {
  componentWillSetAxisTrait?(newAxisTrait: AxisTrait<D> | null, oldAxisTrait: AxisTrait<D> | null, component: C): void;

  componentDidSetAxisTrait?(newAxisTrait: AxisTrait<D> | null, oldAxisTrait: AxisTrait<D> | null, component: C): void;

  componentWillSetAxisView?(newAxisView: AxisView<D> | null, oldAxisView: AxisView<D> | null, component: C): void;

  componentDidSetAxisView?(newAxisView: AxisView<D> | null, oldAxisView: AxisView<D> | null, component: C): void;
}
