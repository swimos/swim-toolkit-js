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

import type {Domain, ContinuousScale} from "@swim/mapping";
import type {GraphicsViewObserver} from "@swim/graphics";
import type {ScaledYView} from "./ScaledYView";

export interface ScaledYViewObserver<Y, V extends ScaledYView<Y> = ScaledYView<Y>> extends GraphicsViewObserver<V> {
  viewWillSetYScale?(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null, view: V): void;

  viewDidSetYScale?(newYScale: ContinuousScale<Y, number> | null, oldYScale: ContinuousScale<Y, number> | null, view: V): void;

  viewWillSetYRangePadding?(newYRangePadding: readonly [number, number], oldYRangePadding: readonly [number, number], view: V): void;

  viewDidSetYRangePadding?(newYRangePadding: readonly [number, number], oldYRangePadding: readonly [number, number], view: V): void;

  viewWillSetYDataDomain?(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null, view: V): void;

  viewDidSetYDataDomain?(newYDataDomain: Domain<Y> | null, oldYDataDomain: Domain<Y> | null, view: V): void;
}
