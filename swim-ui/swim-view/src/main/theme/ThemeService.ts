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

import {Mutable, Class, Lazy, AnyTiming, Timing} from "@swim/util";
import {Affinity, Service} from "@swim/component";
import {Look, Mood, MoodVector, Theme, ThemeMatrix} from "@swim/theme";
import {Viewport} from "../viewport/Viewport";
import type {ThemeServiceObserver} from "./ThemeServiceObserver";
import {View} from "../"; // forward import

/** @public */
export class ThemeService<V extends View = View> extends Service<V> {
  constructor() {
    super();
    this.mood = this.initMood();
    this.theme = this.detectTheme(Viewport.detect());
    this.prefersColorSchemeQuery = null;

    this.updateViewportColorScheme = this.updateViewportColorScheme.bind(this);
  }

  override readonly observerType?: Class<ThemeServiceObserver<V>>;

  readonly mood: MoodVector;

  protected initMood(): MoodVector {
    return Mood.default;
  }

  setMood(mood: MoodVector): void {
    (this as Mutable<this>).mood = mood;
    this.applyTheme(this.theme, mood);
    const roots = this.roots;
    for (let i = 0, n = roots.length; i < n; i += 1) {
      const root = roots[i]!;
      root.mood.setValue(mood, Affinity.Inherited);
      root.requireUpdate(View.NeedsChange);
    }
  }

  readonly theme: ThemeMatrix;

  protected detectTheme(viewport: Viewport): ThemeMatrix {
    const colorScheme = viewport.colorScheme;
    if (colorScheme === "dark") {
      return Theme.dark;
    } else {
      return Theme.light;
    }
  }

  setTheme(theme: ThemeMatrix): void {
    (this as Mutable<this>).theme = theme;
    this.applyTheme(theme, this.mood);
    const roots = this.roots;
    for (let i = 0, n = roots.length; i < n; i += 1) {
      const root = roots[i]!;
      root.theme.setValue(theme, Affinity.Inherited);
      root.requireUpdate(View.NeedsChange);
    }
  }

  protected applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean): void {
    if (timing === void 0 || timing === true) {
      timing = theme.getOr(Look.timing, Mood.ambient, false);
    } else {
      timing = Timing.fromAny(timing);
    }
    this.willApplyTheme(theme, mood, timing as Timing | boolean);
    this.onApplyTheme(theme, mood, timing as Timing | boolean);
    this.didApplyTheme(theme, mood, timing as Timing | boolean);
  }

  protected willApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.serviceWillApplyTheme !== void 0) {
        observer.serviceWillApplyTheme(theme, mood, timing, this);
      }
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected didApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.serviceDidApplyTheme !== void 0) {
        observer.serviceDidApplyTheme(theme, mood, timing, this);
      }
    }
  }

  protected override onAttachRoot(root: V): void {
    super.onAttachRoot(root);
    root.mood.setValue(this.mood, Affinity.Inherited);
    root.theme.setValue(this.theme, Affinity.Inherited);
    root.requireUpdate(View.NeedsChange);
  }

  protected override onAttach(): void {
    super.onAttach();
    this.attachEvents();
  }

  protected override onDetach(): void {
    this.detachEvents();
    super.onDetach();
  }

  protected attachEvents(): void {
    if (typeof window !== "undefined") {
      this.prefersColorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.prefersColorSchemeQuery.addEventListener("change", this.updateViewportColorScheme);
    }
  }

  protected detachEvents(): void {
    if (typeof window !== "undefined") {
      if (this.prefersColorSchemeQuery !== null) {
        this.prefersColorSchemeQuery.removeEventListener("change", this.updateViewportColorScheme);
        this.prefersColorSchemeQuery = null;
      }
    }
  }

  /** @internal */
  prefersColorSchemeQuery: MediaQueryList | null;

  /** @internal */
  protected updateViewportColorScheme(): void {
    const viewport = Viewport.detect();
    const theme = this.detectTheme(viewport);
    this.setTheme(theme);
  }

  @Lazy
  static global<V extends View>(): ThemeService<V> {
    return new ThemeService();
  }
}
