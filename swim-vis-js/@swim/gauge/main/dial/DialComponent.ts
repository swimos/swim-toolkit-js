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

import {AnyTiming, Timing} from "@swim/mapping";
import {Look, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import type {GraphicsView} from "@swim/graphics";
import {
  ComponentProperty,
  ComponentView,
  ComponentViewTrait,
  CompositeComponent,
} from "@swim/component";
import {DialView} from "./DialView";
import {DialTrait} from "./DialTrait";
import type {DialComponentObserver} from "./DialComponentObserver";

export class DialComponent extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<DialComponentObserver>;

  get value(): number | undefined {
    const dialTrait = this.dial.trait;
    return dialTrait !== null ? dialTrait.value : void 0;
  }

  setValue(value: number): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      dialTrait.setValue(value);
    }
  }

  setLimit(limit: number): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      dialTrait.setLimit(limit);
    }
  }

  setLabel(label: GraphicsView | string | undefined): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      dialTrait.setLabel(label);
    }
  }

  setLegend(label: GraphicsView | string | undefined): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      dialTrait.setLegend(label);
    }
  }

  protected initDialTrait(dialTrait: DialTrait): void {
    // hook
  }

  protected attachDialTrait(dialTrait: DialTrait): void {
    const dialView = this.dial.view;
    if (dialView !== null) {
      this.setDialValue(dialTrait.value);
      this.setDialLimit(dialTrait.limit);
      this.setDialLabel(dialTrait.label);
      this.setDialLegend(dialTrait.legend);
    }
  }

  protected detachDialTrait(dialTrait: DialTrait): void {
    this.dial.removeView();
  }

  protected willSetDialTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetTrait !== void 0) {
        componentObserver.dialWillSetTrait(newDialTrait, oldDialTrait, this);
      }
    }
  }

  protected onSetDialTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
    if (oldDialTrait !== null) {
      this.detachDialTrait(oldDialTrait);
    }
    if (newDialTrait !== null) {
      this.attachDialTrait(newDialTrait);
      this.initDialTrait(newDialTrait);
    }
  }

  protected didSetDialTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetTrait !== void 0) {
        componentObserver.dialDidSetTrait(newDialTrait, oldDialTrait, this);
      }
    }
  }

  protected createDialView(): DialView {
    return DialView.create();
  }

  protected initDialView(dialView: DialView): void {
    this.updateDialValue(dialView.value.value, dialView.limit.value, dialView);
  }

  protected themeDialView(dialView: DialView, theme: ThemeMatrix,
                          mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected attachDialView(dialView: DialView): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      this.setDialValue(dialTrait.value);
      this.setDialLimit(dialTrait.limit);
      this.setDialLabel(dialTrait.label);
      this.setDialLegend(dialTrait.legend);
    }
  }

  protected detachDialView(dialView: DialView): void {
    // hook
  }

  protected willSetDialView(newDialView: DialView | null, oldDialView: DialView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetView !== void 0) {
        componentObserver.dialWillSetView(newDialView, oldDialView, this);
      }
    }
  }

  protected onSetDialView(newDialView: DialView | null, oldDialView: DialView | null): void {
    if (oldDialView !== null) {
      this.detachDialView(oldDialView);
    }
    if (newDialView !== null) {
      this.attachDialView(newDialView);
      this.initDialView(newDialView);
      this.label.setView(newDialView.label.view);
      this.legend.setView(newDialView.legend.view);
    }
  }

  protected didSetDialView(newDialView: DialView | null, oldDialView: DialView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetView !== void 0) {
        componentObserver.dialDidSetView(newDialView, oldDialView, this);
      }
    }
  }

  protected setDialValue(value: number): void {
    const dialView = this.dial.view;
    if (dialView !== null) {
      let timing = this.dialTiming.state;
      if (timing === true) {
        timing = dialView.getLook(Look.timing, Mood.ambient);
      }
      dialView.value.setAutoState(value, timing);
    }
  }

  protected setDialLimit(limit: number): void {
    const dialView = this.dial.view;
    if (dialView !== null) {
      let timing = this.dialTiming.state;
      if (timing === true) {
        timing = dialView.getLook(Look.timing, Mood.ambient);
      }
      dialView.limit.setAutoState(limit, timing);
    }
  }

  protected updateDialValue(value: number, limit: number, dialView: DialView): void {
    const dialTrait = this.dial.trait;
    if (dialTrait !== null) {
      const label = dialTrait.formatLabel(value, limit);
      if (label !== void 0) {
        dialTrait.setLabel(label);
      }
      const legend = dialTrait.formatLegend(value, limit);
      if (legend !== void 0) {
        dialTrait.setLegend(legend);
      }
    } else if (value === 0) {
      dialView.remove();
    }
  }

  protected willSetDialValue(newValue: number, oldValue: number, dialView: DialView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetValue !== void 0) {
        componentObserver.dialWillSetValue(newValue, oldValue, this);
      }
    }
  }

  protected onSetDialValue(newValue: number, oldValue: number, dialView: DialView): void {
    this.updateDialValue(newValue, dialView.limit.value, dialView);
  }

  protected didSetDialValue(newValue: number, oldValue: number, dialView: DialView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetValue !== void 0) {
        componentObserver.dialDidSetValue(newValue, oldValue, this);
      }
    }
  }

  protected willSetDialLimit(newLimit: number, oldLimit: number, dialView: DialView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetLimit !== void 0) {
        componentObserver.dialWillSetLimit(newLimit, oldLimit, this);
      }
    }
  }

  protected onSetDialLimit(newLimit: number, oldLimit: number, dialView: DialView): void {
    this.updateDialValue(dialView.value.value, newLimit, dialView);
  }

  protected didSetDialLimit(newLimit: number, oldLimit: number, dialView: DialView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetLimit !== void 0) {
        componentObserver.dialDidSetLimit(newLimit, oldLimit, this);
      }
    }
  }

  protected setDialLabel(label: GraphicsView | string | undefined): void {
    const dialView = this.dial.view;
    if (dialView !== null) {
      dialView.label.setView(label !== void 0 ? label : null);
    }
  }

  protected initDialLabelView(labelView: GraphicsView): void {
    // hook
  }

  protected willSetDialLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetLabelView !== void 0) {
        componentObserver.dialWillSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected onSetDialLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (newLabelView !== null) {
      this.initDialLabelView(newLabelView);
    }
  }

  protected didSetDialLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetLabelView !== void 0) {
        componentObserver.dialDidSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected setDialLegend(legend: GraphicsView | string | undefined): void {
    const dialView = this.dial.view;
    if (dialView !== null) {
      dialView.legend.setView(legend !== void 0 ? legend : null);
    }
  }

  protected initDialLegendView(legendView: GraphicsView): void {
    // hook
  }

  protected willSetDialLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialWillSetLegendView !== void 0) {
        componentObserver.dialWillSetLegendView(newLegendView, oldLegendView, this);
      }
    }
  }

  protected onSetDialLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    if (newLegendView !== null) {
      this.initDialLegendView(newLegendView);
    }
  }

  protected didSetDialLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.dialDidSetLegendView !== void 0) {
        componentObserver.dialDidSetLegendView(newLegendView, oldLegendView, this);
      }
    }
  }

  @ComponentProperty({type: Timing, inherit: true})
  declare dialTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  /** @hidden */
  static DialFastener = ComponentViewTrait.define<DialComponent, DialView, DialTrait>({
    viewType: DialView,
    observeView: true,
    willSetView(newDialView: DialView | null, oldDialView: DialView | null): void {
      this.owner.willSetDialView(newDialView, oldDialView);
    },
    onSetView(newDialView: DialView | null, oldDialView: DialView | null): void {
      this.owner.onSetDialView(newDialView, oldDialView);
    },
    didSetView(newDialView: DialView | null, oldDialView: DialView | null): void {
      this.owner.didSetDialView(newDialView, oldDialView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, dialView: DialView): void {
      this.owner.themeDialView(dialView, theme, mood, timing);
    },
    dialViewWillSetValue(newValue: number, oldValue: number, dialView: DialView): void {
      this.owner.willSetDialValue(newValue, oldValue, dialView);
    },
    dialViewDidSetValue(newValue: number, oldValue: number, dialView: DialView): void {
      this.owner.onSetDialValue(newValue, oldValue, dialView);
      this.owner.didSetDialValue(newValue, oldValue, dialView);
    },
    dialViewWillSetLimit(newLimit: number, oldLimit: number, dialView: DialView): void {
      this.owner.willSetDialLimit(newLimit, oldLimit, dialView);
    },
    dialViewDidSetLimit(newLimit: number, oldLimit: number, dialView: DialView): void {
      this.owner.onSetDialLimit(newLimit, oldLimit, dialView);
      this.owner.didSetDialLimit(newLimit, oldLimit, dialView);
    },
    dialViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      if (newLabelView !== null) {
        this.owner.label.setView(newLabelView);
      }
    },
    dialViewDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      if (newLegendView !== null) {
        this.owner.legend.setView(newLegendView);
      }
    },
    createView(): DialView | null {
      return this.owner.createDialView();
    },
    traitType: DialTrait,
    observeTrait: true,
    willSetTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
      this.owner.willSetDialTrait(newDialTrait, oldDialTrait);
    },
    onSetTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
      this.owner.onSetDialTrait(newDialTrait, oldDialTrait);
    },
    didSetTrait(newDialTrait: DialTrait | null, oldDialTrait: DialTrait | null): void {
      this.owner.didSetDialTrait(newDialTrait, oldDialTrait);
    },
    dialTraitDidSetValue(newValue: number, oldValue: number): void {
      this.owner.setDialValue(newValue);
    },
    dialTraitDidSetLimit(newLimit: number, oldLimit: number): void {
      this.owner.setDialLimit(newLimit);
    },
    dialTraitDidSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
      this.owner.setDialLabel(newLabel);
    },
    dialTraitDidSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined): void {
      this.owner.setDialLegend(newLegend);
    },
  });

  @ComponentViewTrait<DialComponent, DialView, DialTrait>({
    extends: DialComponent.DialFastener,
  })
  declare dial: ComponentViewTrait<this, DialView, DialTrait>;

  @ComponentView<DialComponent, GraphicsView>({
    key: true,
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetDialLabelView(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetDialLabelView(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetDialLabelView(newLabelView, oldLabelView);
    },
  })
  declare label: ComponentView<this, GraphicsView>;

  @ComponentView<DialComponent, GraphicsView>({
    key: true,
    willSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.willSetDialLegendView(newLegendView, oldLegendView);
    },
    onSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.onSetDialLegendView(newLegendView, oldLegendView);
    },
    didSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.didSetDialLegendView(newLegendView, oldLegendView);
    },
  })
  declare legend: ComponentView<this, GraphicsView>;
}
