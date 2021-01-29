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

import {BoxR2, AnyPathR2, PathR2, Transform} from "@swim/math";
import type {GraphicsRenderer} from "../graphics/GraphicsRenderer";
import type {DrawingContext} from "../drawing/DrawingContext";
import {DrawingRenderer} from "../drawing/DrawingRenderer";
import {Icon} from "./Icon";

export class IconPath extends Icon {
  constructor(path: PathR2) {
    super();
    Object.defineProperty(this, "path", {
      value: path,
      enumerable: true,
    });
  }

  declare readonly path: PathR2;

  render(renderer: GraphicsRenderer, frame: BoxR2): void {
    if (renderer instanceof DrawingRenderer) {
      this.draw(renderer.context, frame);
    }
  }

  draw(context: DrawingContext, frame: BoxR2): void {
    this.path.transformDraw(context, Transform.scale(frame.width, frame.height)
                                              .translate(frame.x, frame.y));
  }

  toPath(frame: BoxR2): PathR2 {
    return this.path.transform(Transform.scale(frame.width, frame.height)
                                        .translate(frame.x, frame.y));
  }

  static create(width: number, height: number, path: AnyPathR2): IconPath {
    path = PathR2.fromAny(path);
    if (width !== 1 || height !== 1) {
      path = path.transform(Transform.scale(1 / width, 1 / height));
    }
    return new IconPath(path);
  }
}
