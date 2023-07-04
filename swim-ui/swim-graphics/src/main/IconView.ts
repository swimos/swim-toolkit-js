// Copyright 2015-2023 Swim.inc
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

import type {FastenerClass} from "@swim/component";
import type {Animator} from "@swim/component";
import type {AnyLength} from "@swim/math";
import type {Length} from "@swim/math";
import type {AnyColor} from "@swim/style";
import type {Color} from "@swim/style";
import {ThemeAnimator} from "@swim/theme";
import {View} from "@swim/view";
import {Graphics} from "./Graphics";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";

/** @public */
export interface IconView extends View {
  readonly xAlign: Animator<this, number>;

  readonly yAlign: Animator<this, number>;

  readonly iconWidth: ThemeAnimator<this, Length | null, AnyLength | null>;

  readonly iconHeight: ThemeAnimator<this, Length | null, AnyLength | null>;

  readonly iconColor: ThemeAnimator<this, Color | null, AnyColor | null>;

  readonly graphics: ThemeAnimator<this, Graphics | null>;
}

/** @public */
export const IconView = {
  [Symbol.hasInstance](instance: unknown): instance is IconView {
    return instance instanceof View
        && "xAlign" in instance
        && "yAlign" in instance
        && "iconWidth" in instance
        && "iconHeight" in instance
        && "iconColor" in instance
        && "graphics" in instance;
  },
};

/** @internal */
export const IconGraphicsAnimator = (function (_super: typeof ThemeAnimator) {
  const IconGraphicsAnimator = _super.extend("IconGraphicsAnimator", {
    valueType: Graphics,
  }) as FastenerClass<ThemeAnimator<any, any, any>>;

  IconGraphicsAnimator.prototype.transformState = function (this: ThemeAnimator<unknown, Graphics | null>, icon: Graphics | null): Graphics | null {
    const iconView = this.owner;
    if (IconView[Symbol.hasInstance](iconView) && icon instanceof Icon) {
      const iconColor = iconView.iconColor.state;
      if (iconColor !== null && icon instanceof FilledIcon) {
        icon = icon.withFillColor(iconColor);
      } else {
        const theme = iconView.theme.value;
        const mood = iconView.mood.value;
        if (theme !== null && mood !== null) {
          icon = icon.withTheme(theme, mood);
        }
      }
    }
    return icon;
  };

  return IconGraphicsAnimator;
})(ThemeAnimator);
