// Copyright 2015-2022 Swim.inc
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

import type {Class} from "@swim/util";
import {PropertyDef} from "@swim/component";
import {Trait} from "@swim/model";
import {AnyToolLayout, ToolLayout} from "../layout/ToolLayout";
import type {ToolTraitObserver} from "./ToolTraitObserver";
import {ToolController} from "./"; // forward import

/** @public */
export class ToolTrait extends Trait {
  override readonly observerType?: Class<ToolTraitObserver>;

  @PropertyDef<ToolTrait["layout"]>({
    valueType: ToolLayout,
    value: null,
    didSetValue(toolLayout: ToolLayout | null): void {
      this.owner.callObservers("traitDidSetToolLayout", toolLayout, this.owner);
    },
  })
  readonly layout!: PropertyDef<this, {value: ToolLayout | null, valueInit: AnyToolLayout | null}>;

  createToolController(): ToolController {
    return new ToolController();
  }
}
