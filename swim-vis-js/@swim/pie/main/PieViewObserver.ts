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

import type {ViewObserver} from "@swim/view";
import type {GraphicsView} from "@swim/graphics";
import type {SliceView} from "./SliceView";
import type {PieView} from "./PieView";

export interface PieViewObserver<V extends PieView = PieView> extends ViewObserver<V> {
  pieWillSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, view: V): void;

  pieDidSetTitle?(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null, view: V): void;

  pieWillSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, view: V): void;

  pieDidSetSlice?(newSliceView: SliceView | null, oldSliceView: SliceView | null, view: V): void;
}
