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

import type {BoxR2, PathR2} from "@swim/math";
import type {GraphicsRenderer} from "../graphics/GraphicsRenderer";
import type {Graphics} from "../graphics/Graphics";

export abstract class Icon implements Graphics {
  abstract render(renderer: GraphicsRenderer, frame: BoxR2): void;

  abstract toPath(frame: BoxR2): PathR2;
}
