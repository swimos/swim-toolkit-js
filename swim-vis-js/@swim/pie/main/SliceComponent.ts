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
import {Look, Mood} from "@swim/theme";
import type {GraphicsView} from "@swim/graphics";
import {Trait, TraitObserverType} from "@swim/model";
import {
  ComponentProperty,
  ComponentTrait,
  ComponentView,
  CompositeComponent,
} from "@swim/component";
import {SliceView} from "./SliceView";
import {SliceTrait} from "./SliceTrait";
import type {SliceComponentObserver} from "./SliceComponentObserver";

export class SliceComponent<S extends Trait = SliceTrait> extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<SliceComponentObserver<S>>;

  createSlice(): SliceView {
    return SliceView.create();
  }

  get value(): number | undefined {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof SliceTrait) {
      return sourceTrait.value;
    } else {
      return void 0;
    }
  }

  setValue(value: number): void {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof SliceTrait) {
      sourceTrait.setValue(value);
    }
  }

  setLabel(label: GraphicsView | string | undefined): void {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof SliceTrait) {
      sourceTrait.setLabel(label);
    }
  }

  setLegend(label: GraphicsView | string | undefined): void {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof SliceTrait) {
      sourceTrait.setLegend(label);
    }
  }

  protected initSlice(sliceView: SliceView): void {
    // hook
  }

  protected attachSlice(sliceView: SliceView): void {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof SliceTrait) {
      this.setSliceValue(sourceTrait.value);
      this.setSliceLabel(sourceTrait.label);
      this.setSliceLegend(sourceTrait.legend);
    }
  }

  protected detachSlice(sliceView: SliceView): void {
    // hook
  }

  protected willSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetView !== void 0) {
        componentObserver.sliceWillSetView(newSliceView, oldSliceView, this);
      }
    }
  }

  protected onSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
    if (newSliceView !== null) {
      this.initSlice(newSliceView);
      this.label.setView(newSliceView.label.view);
      this.legend.setView(newSliceView.legend.view);
    }
  }

  protected didSetSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
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
    if (newValue === 0 && this.source.trait === null) {
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

  protected initSliceLabel(labelView: GraphicsView | null): void {
    // hook
  }

  protected willSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetLabel !== void 0) {
        componentObserver.sliceWillSetLabel(newLabelView, oldLabelView, this);
      }
    }
  }

  protected onSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    if (newLabelView !== null) {
      this.initSliceLabel(newLabelView);
    }
  }

  protected didSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetLabel !== void 0) {
        componentObserver.sliceDidSetLabel(newLabelView, oldLabelView, this);
      }
    }
  }

  protected setSliceLegend(legend: GraphicsView | string | undefined): void {
    const sliceView = this.slice.view;
    if (sliceView !== null) {
      sliceView.legend.setView(legend !== void 0 ? legend : null);
    }
  }

  protected initSliceLegend(legendView: GraphicsView | null): void {
    // hook
  }

  protected willSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetLegend !== void 0) {
        componentObserver.sliceWillSetLegend(newLegendView, oldLegendView, this);
      }
    }
  }

  protected onSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    if (newLegendView !== null) {
      this.initSliceLegend(newLegendView);
    }
  }

  protected didSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetLegend !== void 0) {
        componentObserver.sliceDidSetLegend(newLegendView, oldLegendView, this);
      }
    }
  }

  protected initSource(sourceTrait: S): void {
    // hook
  }

  protected attachSource(sourceTrait: S): void {
    if (sourceTrait instanceof SliceTrait) {
      const sliceView = this.slice.view;
      if (sliceView !== null) {
        this.setSliceValue(sourceTrait.value);
        this.setSliceLabel(sourceTrait.label);
        this.setSliceLegend(sourceTrait.legend);
      }
    }
  }

  protected detachSource(sourceTrait: S): void {
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

  protected willSetSource(newSourceTrait: S | null, oldSourceTrait: S | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceWillSetSource !== void 0) {
        componentObserver.sliceWillSetSource(newSourceTrait, oldSourceTrait, this);
      }
    }
  }

  protected onSetSource(newSourceTrait: S | null, oldSourceTrait: S | null): void {
    if (newSourceTrait !== null) {
      this.initSource(newSourceTrait);
    }
  }

  protected didSetSource(newSourceTrait: S | null, oldSourceTrait: S | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.sliceDidSetSource !== void 0) {
        componentObserver.sliceDidSetSource(newSourceTrait, oldSourceTrait, this);
      }
    }
  }

  @ComponentProperty({type: Timing, inherit: true})
  declare sliceTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  @ComponentView<SliceComponent<S>, SliceView>({
    type: SliceView,
    willSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      this.owner.willSetSlice(newSliceView, oldSliceView);
    },
    onSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      if (oldSliceView !== null) {
        this.owner.detachSlice(oldSliceView);
      }
      this.owner.onSetSlice(newSliceView, oldSliceView);
      if (newSliceView !== null) {
        this.owner.attachSlice(newSliceView);
      }
    },
    didSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null): void {
      this.owner.didSetSlice(newSliceView, oldSliceView);
    },
    sliceWillSetValue(newValue: number, oldValue: number, sliceView: SliceView): void {
      this.owner.willSetSliceValue(newValue, oldValue, sliceView);
    },
    sliceDidSetValue(newValue: number, oldValue: number, sliceView: SliceView): void {
      this.owner.onSetSliceValue(newValue, oldValue, sliceView);
      this.owner.didSetSliceValue(newValue, oldValue, sliceView);
    },
    createView(): SliceView | null {
      return this.owner.createSlice();
    }
  })
  declare slice: ComponentView<this, SliceView>;

  @ComponentView<SliceComponent<S>, GraphicsView>({
    observe: false,
    willSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.willSetSliceLabel(newLabelView, oldLabelView);
    },
    onSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.onSetSliceLabel(newLabelView, oldLabelView);
    },
    didSetView(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null): void {
      this.owner.didSetSliceLabel(newLabelView, oldLabelView);
    },
  })
  declare label: ComponentView<this, GraphicsView>;

  @ComponentView<SliceComponent<S>, GraphicsView>({
    observe: false,
    willSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.willSetSliceLegend(newLegendView, oldLegendView);
    },
    onSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.onSetSliceLegend(newLegendView, oldLegendView);
    },
    didSetView(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null): void {
      this.owner.didSetSliceLegend(newLegendView, oldLegendView);
    },
  })
  declare legend: ComponentView<this, GraphicsView>;

  @ComponentTrait<SliceComponent<S>, S, never, TraitObserverType<SliceTrait>>({
    extends: void 0,
    type: Trait,
    willSetTrait(newSourceTrait: S | null, oldSourceTrait: S | null): void {
      this.owner.willSetSource(newSourceTrait, oldSourceTrait);
    },
    onSetTrait(newSourceTrait: S | null, oldSourceTrait: S | null): void {
      if (oldSourceTrait !== null) {
        this.owner.detachSource(oldSourceTrait);
      }
      this.owner.onSetSource(newSourceTrait, oldSourceTrait);
      if (newSourceTrait !== null) {
        this.owner.attachSource(newSourceTrait);
      }
    },
    didSetTrait(newSourceTrait: S | null, oldSourceTrait: S | null): void {
      this.owner.didSetSource(newSourceTrait, oldSourceTrait);
    },
    sliceDidSetValue(newValue: number, oldValue: number, sourceTrait: SliceTrait): void {
      this.owner.setSliceValue(newValue);
    },
    sliceDidSetLabel(newLabel: GraphicsView | string | undefined, oldLabel: GraphicsView | string | undefined, sourceTrait: SliceTrait): void {
      this.owner.setSliceLabel(newLabel);
    },
    sliceDidSetLegend(newLegend: GraphicsView | string | undefined, oldLegend: GraphicsView | string | undefined, sourceTrait: SliceTrait): void {
      this.owner.setSliceLegend(newLegend);
    },
  })
  declare source: ComponentTrait<this, S>;
}
