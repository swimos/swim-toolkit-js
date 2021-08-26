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

import type {View} from "@swim/view";
import type {GraphicsViewObserver} from "@swim/graphics";
import type {ScaledXYViewObserver} from "./ScaledXYViewObserver";
import type {ScaledXView} from "./ScaledXView";
import type {ScaledYView} from "./ScaledYView";
import type {ScaledView} from "./ScaledView";

export interface ScaledViewObserver<X, Y, V extends ScaledView<X, Y> = ScaledView<X, Y>> extends GraphicsViewObserver<V>, ScaledXYViewObserver<X, Y, V> {
  viewWillSetScaled?(newScaledView: ScaledXView<X> | ScaledYView<Y> | null, oldScaledView: ScaledXView<X> | ScaledYView<Y> | null, targetView: View | null, view: V): void;

  viewDidSetScaled?(newScaledView: ScaledXView<X> | ScaledYView<Y> | null, oldScaledView: ScaledXView<X> | ScaledYView<Y> | null, targetView: View | null, view: V): void;
}
