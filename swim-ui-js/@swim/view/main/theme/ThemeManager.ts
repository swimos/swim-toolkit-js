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

import {Tween, Transition} from "@swim/animation";
import {Look, Mood, MoodVector, Theme, ThemeMatrix} from "@swim/theme";
import {View} from "../View";
import {ViewManager} from "../manager/ViewManager";
import {Viewport} from "../viewport/Viewport";
import type {ThemeManagerObserver} from "./ThemeManagerObserver";

export class ThemeManager<V extends View = View> extends ViewManager<V> {
  /** @hidden */
  _mood: MoodVector;
  /** @hidden */
  _theme: ThemeMatrix;

  constructor() {
    super();
    this._mood = this.initMood();
    this._theme = this.initTheme();
  }

  protected initMood(): MoodVector {
    return Mood.default;
  }

  protected initTheme(): ThemeMatrix {
    const viewport = Viewport.detect();
    const colorScheme = viewport.colorScheme;
    if (colorScheme === "dark") {
      return Theme.dark;
    } else {
      return Theme.light;
    }
  }

  get mood(): MoodVector {
    return this._mood;
  }

  setMood(mood: MoodVector): void {
    this._mood = mood;
    this.applyTheme(this._theme, this._mood);
    const rootViews = this.rootViews;
    for (let i = 0, n = rootViews.length; i < n; i += 1) {
      const rootView = rootViews[i]!;
      if (rootView.mood.isAuto()) {
        rootView.mood.setAutoState(mood);
        rootView.requireUpdate(View.NeedsChange);
      }
    }
  }

  get theme(): ThemeMatrix {
    return this._theme;
  }

  setTheme(theme: ThemeMatrix): void {
    this._theme = theme;
    this.applyTheme(this._theme, this._mood);
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
    this.applyTheme(this._theme, this._mood);
  }

  private static _global?: ThemeManager<any>;
  static global<V extends View>(): ThemeManager<V> {
    if (ThemeManager._global === void 0) {
      ThemeManager._global = new ThemeManager();
    }
    return ThemeManager._global;
  }
}
ViewManager.Theme = ThemeManager;
