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

import {Lazy} from "@swim/util";
import {Tween, Transition} from "@swim/animation";
import {Look, Mood, MoodVector, Theme, ThemeMatrix} from "@swim/theme";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {Viewport} from "../viewport/Viewport";
import type {ThemeManagerObserver} from "./ThemeManagerObserver";

export class ThemeManager<V extends View = View> extends ViewManager<V> {
  constructor() {
    super();
    Object.defineProperty(this, "mood", {
      value: this.initMood(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "theme", {
      value: this.initTheme(),
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly mood: MoodVector;

  protected initMood(): MoodVector {
    return Mood.default;
  }

  setMood(mood: MoodVector): void {
    Object.defineProperty(this, "mood", {
      value: mood,
      enumerable: true,
      configurable: true,
    });
    this.applyTheme(this.theme, mood);
    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      const rootView = rootViews[i]!;
      if (rootView.mood.isAuto()) {
        rootView.mood.setAutoState(mood);
        rootView.requireUpdate(View.NeedsChange);
      }
    }
  }

  declare readonly theme: ThemeMatrix;

  protected initTheme(): ThemeMatrix {
    const viewport = Viewport.detect();
    const colorScheme = viewport.colorScheme;
    if (colorScheme === "dark") {
      return Theme.dark;
    } else {
      return Theme.light;
    }
  }

  setTheme(theme: ThemeMatrix): void {
    Object.defineProperty(this, "theme", {
      value: theme,
      enumerable: true,
      configurable: true,
    });
    this.applyTheme(theme, this.mood);
    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      const rootView = rootViews[i]!;
      if (rootView.theme.isAuto()) {
        rootView.theme.setAutoState(theme);
        rootView.requireUpdate(View.NeedsChange);
      }
    }
  }

  protected applyTheme(theme: ThemeMatrix, mood: MoodVector, tween?: Tween<any>): void {
    if (tween === void 0 || tween === true) {
      tween = theme.inner(Mood.ambient, Look.transition);
      if (tween === void 0) {
        tween = null;
      }
    } else {
      tween = Transition.forTween(tween);
    }
    this.willApplyTheme(theme, mood, tween);
    this.onApplyTheme(theme, mood, tween);
    this.didApplyTheme(theme, mood, tween);
  }

  protected willApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                           transition: Transition<any> | null): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.themeManagerWillApplyTheme !== void 0) {
        viewManagerObserver.themeManagerWillApplyTheme(theme, mood, transition, this);
      }
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    // hook
  }

  protected didApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                          transition: Transition<any> | null): void {
    const viewManagerObservers = this.viewManagerObservers;
    for (let i = 0, n = viewManagerObservers.length; i < n; i += 1) {
      const viewManagerObserver = viewManagerObservers[i]!;
      if (viewManagerObserver.themeManagerDidApplyTheme !== void 0) {
        viewManagerObserver.themeManagerDidApplyTheme(theme, mood, transition, this);
      }
    }
  }

  declare readonly viewManagerObservers: ReadonlyArray<ThemeManagerObserver>;

  protected onInsertRootView(rootView: V): void {
    super.onInsertRootView(rootView);
    this.applyTheme(this.theme, this.mood);
  }

  @Lazy
  static global<V extends View>(): ThemeManager<V> {
    return new ThemeManager();
  }
}
