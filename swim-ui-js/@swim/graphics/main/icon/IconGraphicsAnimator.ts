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

import {ThemeAnimatorClass, ThemeAnimator} from "@swim/theme";
import type {Graphics} from "../graphics/Graphics";
import {Icon} from "./Icon";
import {FilledIcon} from "./FilledIcon";
import {IconView} from "./"; // forward import

/** @internal */
export const IconGraphicsAnimator = (function (_super: typeof ThemeAnimator) {
  const IconGraphicsAnimator = _super.extend("IconGraphicsAnimator") as ThemeAnimatorClass<ThemeAnimator<any, Graphics | null | undefined, Graphics | null | undefined>>;

  IconGraphicsAnimator.prototype.fromAny = function (this: ThemeAnimator<unknown, Graphics | null>, value: Graphics | null): Graphics | null {
    const iconView = this.owner;
    if (IconView.is(iconView) && value instanceof Icon) {
      const iconColor = iconView.iconColor.state;
      if (iconColor !== null && value instanceof FilledIcon) {
        value = value.withFillColor(iconColor);
      } else {
        const theme = iconView.theme.state;
        const mood = iconView.mood.state;
        if (theme !== null && mood !== null) {
          value = value.withTheme(theme, mood);
        }
      }
    }
    return value;
  };

  return IconGraphicsAnimator;
})(ThemeAnimator);
