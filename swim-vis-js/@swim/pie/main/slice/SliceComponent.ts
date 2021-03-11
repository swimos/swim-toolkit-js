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
import {SliceView} from "./SliceView";
import {SliceTrait} from "./SliceTrait";
import type {SliceComponentObserver} from "./SliceComponentObserver";

export class SliceComponent extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<SliceComponentObserver>;

  get value(): number | undefined {
    const sliceTrait = this.slice.trait;
    return sliceTrait !== null ? sliceTrait.value : void 0;
  }

  setValue(value: number): void {
    const sliceTrait = this.slice.trait;
    if (sliceTrait !== null) {
      sliceTrait.setValue(value);
    }
  }

  setLabel(label: GraphicsView | string | undefined): void {
    const sliceTrait = this.slice.trait;
    if (sliceTrait !== null) {
      sliceTrait.setLabel(label);
    }
  }

  setLegend(label: GraphicsView | string | undefined): void {
    const sliceTrait = this.slice.trait;
    if (sliceTrait !== null) {
      sliceTrait.setLegend(label);
    }
  }

  protected initSliceTrait(sliceTrait: SliceTrait): void {
    // hook
  }

  protected attachSliceTrait(sliceTrait: SliceTrait): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      this.setSliceValue(sliceTrait.value);
      this.setSliceLabel(sliceTrait.label);
      this.setSliceLegend(sliceTrait.legend);
    }
  }

  protected detachSliceTrait(sliceTrait: SliceTrait): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      if (sliceView.value.isAuto()) {
        // remove after tween to zero
        sliceView.value.setAutoState(0);
      } else {
        sliceView.remove();
      }
    }
  }

  protected willSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetTrait !== void 0) {
        componentObserver.sliceWillSetTrait(newSliceTrait, oldSliceTrait, this);
      }
    }
  }

  protected onSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
    if (oldSliceTrait !== null) {
      this.detachSliceTrait(oldSliceTrait);
    }
    if (newSliceTrait !== null) {
      this.attachSliceTrait(newSliceTrait);
      this.initSliceTrait(newSliceTrait);
    }
  }

  protected didSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetTrait !== void 0) {
        componentObserver.sliceDidSetTrait(newSliceTrait, oldSliceTrait, this);
      }
    }
  }

  protected createSliceView(): SliceView {
    return SliceView.create();
  }

  protected initSliceView(sliceView: SliceView): void {
    // hook
  }

  protected themeSliceView(sliceView: SliceView, theme: ThemeMatrix,
                           mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  protected attachSliceView(sliceView: SliceView): void {
    const sliceTrait = this.slice.trait;
    if (sliceTrait !== null) {
      this.setSliceValue(sliceTrait.value);
      this.setSliceLabel(sliceTrait.label);
      this.setSliceLegend(sliceTrait.legend);
    }
  }

  protected detachSliceView(sliceView: SliceView): void {
    // hook
  }

  protected willSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetView !== void 0) {
        componentObserver.sliceWillSetView(newSliceView, oldSliceView, this);
      }
    }
  }

  protected onSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
    if (oldSliceView !== null) {
      this.detachSliceView(oldSliceView);
    }
    if (newSliceView !== null) {
      this.attachSliceView(newSliceView);
      this.initSliceView(newSliceView);
      this.label.setView(newSliceView.label.view);
      this.legend.setView(newSliceView.legend.view);
    }
  }

  protected didSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetView !== void 0) {
        componentObserver.sliceDidSetView(newSliceView, oldSliceView, this);
      }
    }
  }

  protected setSliceValue(value: number): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      let timing = this.sliceTiming.state;
      if (timing === true) {
        timing = sliceView.getLook(Look.timing, Mood.ambient);
      }
      sliceView.value.setAutoState(value, timing);
    }
  }

  protected willSetSliceValue(newValue: number, oldValue: number, sliceView: SliceView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetValue !== void 0) {
        componentObserver.sliceWillSetValue(newValue, oldValue, this);
      }
    }
  }

  protected onSetSliceValue(newValue: number, oldValue: number, sliceView: SliceView): void {
    const sliceTrait = this.slice.trait;
    if (sliceTrait !== null) {
      const label = sliceTrait.formatLabel(newValue);
      if (label !== void 0) {
        sliceTrait.setLabel(label);
      }
      const legend = sliceTrait.formatLegend(newValue);
      if (legend !== void 0) {
        sliceTrait.setLegend(legend);
      }
    } else if (newValue === 0) {
      sliceView.remove();
    }
  }

  protected didSetSliceValue(newValue: number, oldValue: number, sliceView: SliceView): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetValue !== void 0) {
        componentObserver.sliceDidSetValue(newValue, oldValue, this);
      }
    }
  }

  protected setSliceLabel(label: GraphicsView | string | undefined): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      sliceView.label.setView(label !== void 0 ? label : null);
    }
  }

  protected initSliceLabelView(labelView: GraphicsView): void {
    // hook
  }

  protected willSetSliceLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetLabelView !== void 0) {
        componentObserver.sliceWillSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected onSetSliceLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (newLabelView !== null) {
      this.initSliceLabelView(newLabelView);
    }
  }

  protected didSetSliceLabelView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetLabelView !== void 0) {
        componentObserver.sliceDidSetLabelView(newLabelView, oldLabelView, this);
      }
    }
  }

  protected setSliceLegend(legend: GraphicsView | string | undefined): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      sliceView.legend.setView(legend !== void 0 ? legend : null);
    }
  }

  protected initSliceLegendView(legendView: GraphicsView): void {
    // hook
  }

  protected willSetSliceLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetLegendView !== void 0) {
        componentObserver.sliceWillSetLegendView(newLegendView, oldLegendView, this);
      }
    }
  }

  protected onSetSliceLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    if (newLegendView !== null) {
      this.initSliceLegendView(newLegendView);
    }
  }

  protected didSetSliceLegendView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetLegendView !== void 0) {
        componentObserver.sliceDidSetLegendView(newLegendView, oldLegendView, this);
      }
    }
  }

  @ComponentProperty({type: Timing, inherit: true})
  declare sliceTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  /** @hidden */
  static SliceFastener = ComponentViewTrait.define<SliceComponent, SliceView, SliceTrait>({
    viewType: SliceView,
    observeView: true,
    willSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      this.owner.willSetSliceView(newSliceView, oldSliceView);
    },
    onSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      this.owner.onSetSliceView(newSliceView, oldSliceView);
    },
    didSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      this.owner.didSetSliceView(newSliceView, oldSliceView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, sliceView: SliceView): void {
      this.owner.themeSliceView(sliceView, theme, mood, timing);
    },
    sliceViewWillSetValue(newValue: number, oldValue: number, sliceView: SliceView): void {
      this.owner.willSetSliceValue(newValue, oldValue, sliceView);
    },
    sliceViewDidSetValue(newValue: number, oldValue: number, sliceView: SliceView): void {
      this.owner.onSetSliceValue(newValue, oldValue, sliceView);
      this.owner.didSetSliceValue(newValue, oldValue, sliceView);
    },
    sliceViewDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      if (newLabelView !== null) {
        this.owner.label.setView(newLabelView);
      }
    },
    sliceViewDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      if (newLegendView !== null) {
        this.owner.legend.setView(newLegendView);
      }
    },
    createView(): SliceView | null {
      return this.owner.createSliceView();
    },
    traitType: SliceTrait,
    observeTrait: true,
    willSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.willSetSliceTrait(newSliceTrait, oldSliceTrait);
    },
    onSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.onSetSliceTrait(newSliceTrait, oldSliceTrait);
    },
    didSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.didSetSliceTrait(newSliceTrait, oldSliceTrait);
    },
    sliceTraitDidSetValue(newValue: number, oldValue: number): void {
      this.owner.setSliceValue(newValue);
    },
    sliceTraitDidSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined): void {
      this.owner.setSliceLabel(newLabel);
    },
    sliceTraitDidSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined): void {
      this.owner.setSliceLegend(newLegend);
    },
  });

  @ComponentViewTrait<SliceComponent, SliceView, SliceTrait>({
    extends: SliceComponent.SliceFastener,
  })
  declare slice: ComponentViewTrait<this, SliceView, SliceTrait>;

  @ComponentView<SliceComponent, GraphicsView>({
    key: true,
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetSliceLabelView(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetSliceLabelView(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetSliceLabelView(newLabelView, oldLabelView);
    },
  })
  declare label: ComponentView<this, GraphicsView>;

  @ComponentView<SliceComponent, GraphicsView>({
    key: true,
    willSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.willSetSliceLegendView(newLegendView, oldLegendView);
    },
    onSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.onSetSliceLegendView(newLegendView, oldLegendView);
    },
    didSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.didSetSliceLegendView(newLegendView, oldLegendView);
    },
  })
  declare legend: ComponentView<this, GraphicsView>;
}
