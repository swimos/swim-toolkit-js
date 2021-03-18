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

import type {AnyTiming} from "@swim/mapping";
import type {ConstraintScope} from "@swim/constraint";
import type {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import type {AnimationTimeline} from "@swim/view";
import type {StyleAnimatorConstructor, StyleAnimator} from "./StyleAnimator";

export interface StyleContext extends AnimationTimeline, ConstraintScope {
  readonly node?: Node;

  isMounted(): boolean;

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel>): T | undefined;

  getStyle(propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined;

  setStyle(propertyName: string, value: unknown, priority?: string): this;

  hasStyleAnimator(animatorName: string): boolean;

  getStyleAnimator(animatorName: string): StyleAnimator<this, unknown> | null;

  setStyleAnimator(animatorName: string, animator: StyleAnimator<this, unknown> | null): void;

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean): void;

  requireUpdate(updateFlags: number): void;
}

/** @hidden */
export const StyleContext = {} as {
  decorateStyleAnimator(constructor: StyleAnimatorConstructor<StyleContext, unknown>,
                        target: Object, propertyKey: string | symbol): void;
};

StyleContext.decorateStyleAnimator = function (constructor: StyleAnimatorConstructor<StyleContext, unknown>,
                                               target: Object, propertyKey: string | symbol): void {
  Object.defineProperty(target, propertyKey, {
    get: function (this: StyleContext): StyleAnimator<StyleContext, unknown> {
      let styleAnimator = this.getStyleAnimator(propertyKey.toString());
      if (styleAnimator === null) {
        styleAnimator = new constructor(this, propertyKey.toString());
        this.setStyleAnimator(propertyKey.toString(), styleAnimator);
      }
      return styleAnimator;
    },
    configurable: true,
    enumerable: true,
  });
};
