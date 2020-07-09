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

import {Tween, Transition} from "@swim/transition";
import {ViewFlags, View, ViewScope, Viewport, UiViewContext, UiViewInit, UiView} from "@swim/view";
import {Look} from "../look/Look";
import {Feel} from "../feel/Feel";
import {Mood} from "../mood/Mood";
import {MoodVector} from "../mood/MoodVector";
import {MoodMatrix} from "../mood/MoodMatrix";
import {Theme} from "../theme/Theme";
import {ThemeMatrix} from "../theme/ThemeMatrix";
import {ThemedViewInit, ThemedView} from "./ThemedView";
import {ThemedUiViewObserver} from "./ThemedUiViewObserver";
import {ThemedUiViewController} from "./ThemedUiViewController";

export interface ThemedUiViewInit extends UiViewInit, ThemedViewInit {
  viewController?: ThemedUiViewController;
}

export class ThemedUiView extends UiView implements ThemedView {
  get viewController(): ThemedUiViewController | null {
    return this._viewController;
  }

  initView(init: ThemedUiViewInit): void {
    super.initView(init);
    if (init.mood !== void 0) {
      this.mood(init.mood);
    }
    if (init.moodModifier !== void 0) {
      this.moodModifier(init.moodModifier);
    }
    if (init.theme !== void 0) {
      this.theme(init.theme);
    }
    if (init.themeModifier !== void 0) {
      this.themeModifier(init.themeModifier);
    }
  }

  protected initTheme(): ThemeMatrix {
    const colorScheme = this.viewport.colorScheme;
    if (colorScheme === "dark") {
      return Theme.dark;
    } else {
      return Theme.light;
    }
  }

  @ViewScope(MoodVector, {
    value: Mood.default,
  })
  mood: ViewScope<this, MoodVector>;

  @ViewScope(MoodMatrix)
  moodModifier: ViewScope<this, MoodMatrix>;

  @ViewScope<ThemedUiView, typeof ThemeMatrix>(ThemeMatrix, {
    init(): ThemeMatrix {
      return this.view.initTheme();
    },
  })
  theme: ViewScope<this, ThemeMatrix>;

  @ViewScope(MoodMatrix)
  themeModifier: ViewScope<this, MoodMatrix>;

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel>): T | undefined {
    const theme = this.theme.state;
    let value: T | undefined;
    if (theme !== void 0) {
      if (mood === void 0) {
        mood = this.mood.getState();
      }
      value = theme.inner(mood, look)
    }
    return value;
  }

  getLookOr<T, V>(look: Look<T, unknown>, elseValue: V, mood?: MoodVector<Feel>): T | V {
    const theme = this.theme.state;
    let value: T | V | undefined;
    if (theme !== void 0) {
      if (mood === void 0) {
        mood = this.mood.getState();
      }
      value = theme.inner(mood, look)
    }
    if (value === void 0) {
      value = elseValue;
    }
    return value;
  }

  modifyMood(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    const oldMoodModifier = this.moodModifier.getStateOr(MoodMatrix.empty());
    const newMoodModifier = oldMoodModifier.updatedCol(feel, true, ...entries);
    if (!newMoodModifier.equals(oldMoodModifier)) {
      this.moodModifier.setState(newMoodModifier);
      this.computeMood();
      this.requireUpdate(View.NeedsCompute);
    }
  }

  modifyTheme(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    const oldThemeModifier = this.themeModifier.getStateOr(MoodMatrix.empty());
    const newThemeModifier = oldThemeModifier.updatedCol(feel, true, ...entries);
    if (!newThemeModifier.equals(oldThemeModifier)) {
      this.themeModifier.setState(newThemeModifier);
      this.computeTheme();
      this.requireUpdate(View.NeedsCompute);
    }
  }

  applyTheme(theme: ThemeMatrix, mood: MoodVector, tween?: Tween<any>): void {
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
    this.willObserve(function (viewObserver: ThemedUiViewObserver): void {
      if (viewObserver.viewWillApplyTheme !== void 0) {
        viewObserver.viewWillApplyTheme(theme, mood, transition, this);
      }
    });
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    if (this._node === document.body) {
      this.applyDocumentTheme(theme, mood, transition);
    }
  }

  applyDocumentTheme(theme: ThemeMatrix, mood: MoodVector, tween?: Tween<any>): void {
    const font = theme.inner(Mood.ambient, Look.font);
    if (font !== void 0) {
      if (font._style !== void 0) {
        this.fontStyle.setAutoState(font._style);
      }
      if (font._variant !== void 0) {
        this.fontVariant.setAutoState(font._variant);
      }
      if (font._weight !== void 0) {
        this.fontWeight.setAutoState(font._weight);
      }
      if (font._stretch !== void 0) {
        this.fontStretch.setAutoState(font._stretch);
      }
      if (font._size !== void 0) {
        this.fontSize.setAutoState(font._size);
      }
      if (font._height !== void 0) {
        this.lineHeight.setAutoState(font._height);
      }
      this.fontFamily.setAutoState(font._family);
    }

    this.backgroundColor.setAutoState(theme.inner(Mood.ambient, Look.backgroundColor), tween);
    this.color.setAutoState(theme.inner(Mood.ambient, Look.color), tween);
  }

  protected didApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                          transition: Transition<any> | null): void {
    this.didObserve(function (viewObserver: ThemedUiViewObserver): void {
      if (viewObserver.viewDidApplyTheme !== void 0) {
        viewObserver.viewDidApplyTheme(theme, mood, transition, this);
      }
    });
  }

  protected onResize(viewContext: UiViewContext): void {
    super.onResize(viewContext);
    this.updateViewIdiom(viewContext.viewport);
  }

  protected updateViewIdiom(viewport: Viewport) {
    if (viewport.width < 960 || viewport.height < 480) {
      this.setViewIdiom("mobile");
    } else {
      this.setViewIdiom("desktop");
    }
  }

  protected computeMood(): void {
    // nop
  }

  protected computeTheme(): void {
    // nop
  }

  protected onCompute(viewContext: UiViewContext): void {
    super.onCompute(viewContext);
    this.computeMood();
    this.computeTheme();

    const theme = this.theme.state;
    const mood = this.mood.state;
    if (theme !== void 0 && mood !== void 0) {
      this.applyTheme(theme, mood);
    }
  }

  static readonly mountFlags: ViewFlags = UiView.mountFlags | View.NeedsCompute;
}
