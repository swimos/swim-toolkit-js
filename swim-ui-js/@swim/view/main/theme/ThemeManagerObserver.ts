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

import {Transition} from "@swim/tween";
import {MoodVector, ThemeMatrix} from "@swim/theme";
import {View} from "../View";
import {ViewManagerObserver} from "../manager/ViewManagerObserver";
import {ThemeManager} from "./ThemeManager";

export interface ThemeManagerObserver<V extends View = View, VM extends ThemeManager<V> = ThemeManager<V>> extends ViewManagerObserver<V, VM> {
  themeManagerWillApplyTheme?(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, themeManager: VM): void;

  themeManagerDidApplyTheme?(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, themeManager: VM): void;
}
