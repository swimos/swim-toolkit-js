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
import {Property} from "@swim/component";
import {Trait} from "@swim/model";
import type {Graphics} from "@swim/graphics";
import type {ToolView} from "@swim/toolbar";
import type {SheetTraitObserver} from "./SheetTraitObserver";

/** @public */
export type SheetTraitTitle = SheetTraitTitleFunction | string;
/** @public */
export type SheetTraitTitleFunction = (sheetTrait: SheetTrait) => ToolView | string | null;

/** @public */
export class SheetTrait extends Trait {
  override readonly observerType?: Class<SheetTraitObserver>;

  @Property<SheetTrait, SheetTraitTitle | null>({
    value: null,
    didSetValue(newTitle: SheetTraitTitle | null, oldTitle: SheetTraitTitle | null): void {
      this.owner.callObservers("traitDidSetTitle", newTitle, this.owner);
    },
    equalValues(newTitle: SheetTraitTitle | null, oldTitle: SheetTraitTitle | null): boolean {
      return newTitle === oldTitle;
    },
  })
  readonly title!: Property<this, SheetTraitTitle | null>;

  @Property<SheetTrait, Graphics | null>({
    value: null,
    didSetValue(newIcon: Graphics | null, oldIcon: Graphics | null): void {
      this.owner.callObservers("traitDidSetIcon", newIcon, this.owner);
    },
    equalValues(newIcon: Graphics | null, oldIcon: Graphics | null): boolean {
      return newIcon === oldIcon;
    },
  })
  readonly icon!: Property<this, Graphics | null>;
}
