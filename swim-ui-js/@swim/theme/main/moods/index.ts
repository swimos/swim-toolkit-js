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

import {Feel} from "../feel/Feel";
import {Mood} from "../mood/Mood";
import {MoodVector} from "../mood/MoodVector";

Mood.ambient = MoodVector.of([Feel.ambient, 1]);
Mood.default = MoodVector.of([Feel.default, 1]);

Mood.primary = MoodVector.of([Feel.primary, 1]);
Mood.secondary = MoodVector.of([Feel.secondary, 1]);

Mood.selected = MoodVector.of([Feel.selected, 1]);
Mood.disabled = MoodVector.of([Feel.disabled, 1]);
Mood.inactive = MoodVector.of([Feel.inactive, 1]);
Mood.warning = MoodVector.of([Feel.warning, 1]);
Mood.alert = MoodVector.of([Feel.alert, 1]);

Mood.overlay = MoodVector.of([Feel.overlay, 1]);
Mood.floating = MoodVector.of([Feel.floating, 1]);
Mood.transparent = MoodVector.of([Feel.transparent, 1]);
Mood.translucent = MoodVector.of([Feel.translucent, 1]);
Mood.embossed = MoodVector.of([Feel.embossed, 1]);
Mood.nested = MoodVector.of([Feel.nested, 1]);

Mood.hovering = MoodVector.of([Feel.hovering, 1]);
