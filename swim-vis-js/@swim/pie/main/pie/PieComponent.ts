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
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import type {GraphicsView} from "@swim/graphics";
import type {Trait} from "@swim/model";
import {
  Component,
  ComponentProperty,
  ComponentView,
  ComponentViewTrait,
  ComponentFastener,
  CompositeComponent,
} from "@swim/component";
import type {SliceView} from "../slice/SliceView";
import type {SliceTrait} from "../slice/SliceTrait";
import {SliceComponent} from "../slice/SliceComponent";
import {PieView} from "./PieView";
import {PieTrait} from "./PieTrait";
import type {PieComponentObserver} from "./PieComponentObserver";

export class PieComponent extends CompositeComponent {
  constructor() {
    super();
    Object.defineProperty(this, "sliceFasteners", {
      value: [],
      enumerable: true,
    });
  }

  declare readonly componentObservers: ReadonlyArray<PieComponentObserver>;

  setTitle(title: GraphicsView | string | undefined): void {
    const pieTrait = this.pie.trait;
    if (pieTrait !== null) {
      pieTrait.setTitle(title);
    }
  }

  protected createPieView(): PieView | null {
    return PieView.create();
  }

  protected initPieView(pieView: PieView): void {
    // hook
  }

  protected attachPieView(pieView: PieView): void {
    const pieTrait = this.pie.trait;
    if (pieTrait !== null) {
      this.setPieTitle(pieTrait.title);
    }
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceComponent = sliceFasteners[i]!.component;
      if (sliceComponent !== null) {
        const sliceView = sliceComponent.slice.view;
        if (sliceView !== null && !sliceView.isMounted()) {
          sliceComponent.slice.injectView(pieView);
        }
      }
    }
  }

  protected detachPieView(pieView: PieView): void {
    // hook
  }

  protected willSetPieView(newPieView: PieView | null, oldPieView: PieView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetView !== void 0) {
        componentObserver.pieWillSetView(newPieView, oldPieView, this);
      }
    }
  }

  protected onSetPieView(newPieView: PieView | null, oldPieView: PieView | null): void {
    if (oldPieView !== null) {
      this.detachPieView(oldPieView);
    }
    if (newPieView !== null) {
      this.attachPieView(newPieView);
      this.initPieView(newPieView);
      this.title.setView(newPieView.title.view);
    }
  }

  protected didSetPieView(newPieView: PieView | null, oldPieView: PieView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetView !== void 0) {
        componentObserver.pieDidSetView(newPieView, oldPieView, this);
      }
    }
  }

  protected themePieView(pieView: PieView, theme: ThemeMatrix,
                         mood: MoodVector, timing: Timing | boolean): void {
    // hook
  }

  setPieTitle(title: GraphicsView | string | undefined): void {
    const pieView = this.pie.view;
    if (pieView !== null) {
      pieView.title.setView(title !== void 0 ? title : null);
    }
  }

  protected initPieTitle(titleView: GraphicsView | null): void {
    // hook
  }

  protected willSetPieTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetTitle !== void 0) {
        componentObserver.pieWillSetTitle(newTitleView, oldTitleView, this);
      }
    }
  }

  protected onSetPieTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    if (newTitleView !== null) {
      this.initPieTitle(newTitleView);
    }
  }

  protected didSetPieTitle(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetTitle !== void 0) {
        componentObserver.pieDidSetTitle(newTitleView, oldTitleView, this);
      }
    }
  }

  protected initPieTrait(pieTrait: PieTrait): void {
    // hook
  }

  protected attachPieTrait(pieTrait: PieTrait): void {
    const pieView = this.pie.view;
    if (pieView !== null) {
      this.setPieTitle(pieTrait.title);
    }
    const sliceFasteners = pieTrait.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceTrait = sliceFasteners[i]!.trait;
      if (sliceTrait !== null) {
        this.insertSliceTrait(sliceTrait);
      }
    }
  }

  protected detachPieTrait(pieTrait: PieTrait): void {
    const pieView = this.pie.view;
    if (pieView !== null) {
      this.setPieTitle(void 0);
    }
    const sliceFasteners = pieTrait.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceTrait = sliceFasteners[i]!.trait;
      if (sliceTrait !== null) {
        this.removeSliceTrait(sliceTrait);
      }
    }
  }

  protected willSetPieTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetTrait !== void 0) {
        componentObserver.pieWillSetTrait(newPieTrait, oldPieTrait, this);
      }
    }
  }

  protected onSetPieTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
    if (oldPieTrait !== null) {
      this.detachPieTrait(oldPieTrait);
    }
    if (newPieTrait !== null) {
      this.attachPieTrait(newPieTrait);
      this.initPieTrait(newPieTrait);
    }
  }

  protected didSetPieTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetTrait !== void 0) {
        componentObserver.pieDidSetTrait(newPieTrait, oldPieTrait, this);
      }
    }
  }

  /** @hidden */
  static PieFastener = ComponentViewTrait.define<PieComponent, PieView, PieTrait>({
    viewType: PieView,
    observeView: true,
    willSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      this.owner.willSetPieView(newPieView, oldPieView);
    },
    onSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      this.owner.onSetPieView(newPieView, oldPieView);
    },
    didSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      this.owner.didSetPieView(newPieView, oldPieView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                      timing: Timing | boolean, pieView: PieView): void {
      this.owner.themePieView(pieView, theme, mood, timing);
    },
    createView(): PieView | null {
      return this.owner.createPieView();
    },
    traitType: PieTrait,
    observeTrait: true,
    willSetTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
      this.owner.willSetPieTrait(newPieTrait, oldPieTrait);
    },
    onSetTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
      this.owner.onSetPieTrait(newPieTrait, oldPieTrait);
    },
    didSetTrait(newPieTrait: PieTrait | null, oldPieTrait: PieTrait | null): void {
      this.owner.didSetPieTrait(newPieTrait, oldPieTrait);
    },
    pieTraitDidSetTitle(newTitle: GraphicsView | string | undefined, oldTitle: GraphicsView | string | undefined, pieTrait: PieTrait): void {
      this.owner.setPieTitle(newTitle);
    },
    pieTraitWillSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, targetTrait: Trait, pieTrait: PieTrait): void {
      if (oldSliceTrait !== null) {
        this.owner.removeSliceTrait(oldSliceTrait);
      }
    },
    pieTraitDidSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, targetTrait: Trait, pieTrait: PieTrait): void {
      if (newSliceTrait !== null) {
        this.owner.insertSliceTrait(newSliceTrait, targetTrait);
      }
    },
  });

  @ComponentViewTrait<PieComponent, PieView, PieTrait>({
    extends: PieComponent.PieFastener,
  })
  declare pie: ComponentViewTrait<this, PieView, PieTrait>;

  @ComponentView<PieComponent, GraphicsView>({
    key: true,
    willSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.willSetPieTitle(newTitleView, oldTitleView);
    },
    onSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.onSetPieTitle(newTitleView, oldTitleView);
    },
    didSetView(newTitleView: GraphicsView | null, oldTitleView: GraphicsView | null): void {
      this.owner.didSetPieTitle(newTitleView, oldTitleView);
    },
  })
  declare title: ComponentView<this, GraphicsView>;

  protected createSliceView(sliceComponent: SliceComponent): SliceView | null {
    return sliceComponent.slice.createView();
  }

  protected initSliceView(sliceView: SliceView, sliceComponent: SliceComponent): void {
    // hook
  }

  protected willSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceView !== void 0) {
        componentObserver.pieWillSetSliceView(newSliceView, oldSliceView, sliceComponent, this);
      }
    }
  }

  protected onSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
    if (newSliceView !== null) {
      this.initSliceView(newSliceView, sliceComponent);
      const labelView = newSliceView.label.view;
      if (labelView !== null) {
        this.initSliceLabel(labelView, sliceComponent);
      }
      const legendView = newSliceView.legend.view;
      if (legendView !== null) {
        this.initSliceLegend(legendView, sliceComponent);
      }
    }
  }

  protected didSetSliceView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceView !== void 0) {
        componentObserver.pieDidSetSliceView(newSliceView, oldSliceView, sliceComponent, this);
      }
    }
  }

  protected willSetSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceValue !== void 0) {
        componentObserver.pieWillSetSliceValue(newValue, oldValue, sliceComponent, this);
      }
    }
  }

  protected onSetSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
    // hook
  }

  protected didSetSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceValue !== void 0) {
        componentObserver.pieDidSetSliceValue(newValue, oldValue, sliceComponent, this);
      }
    }
  }

  protected initSliceLabel(labelView: GraphicsView, sliceComponent: SliceComponent): void {
    // hook
  }

  protected willSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceLabel !== void 0) {
        componentObserver.pieWillSetSliceLabel(newLabelView, oldLabelView, sliceComponent, this);
      }
    }
  }

  protected onSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
    if (newLabelView !== null) {
      this.initSliceLabel(newLabelView, sliceComponent);
    }
  }

  protected didSetSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceLabel !== void 0) {
        componentObserver.pieDidSetSliceLabel(newLabelView, oldLabelView, sliceComponent, this);
      }
    }
  }

  protected initSliceLegend(labelView: GraphicsView, sliceComponent: SliceComponent): void {
    // hook
  }

  protected willSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceLegend !== void 0) {
        componentObserver.pieWillSetSliceLegend(newLegendView, oldLegendView, sliceComponent, this);
      }
    }
  }

  protected onSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
    if (newLegendView !== null) {
      this.initSliceLegend(newLegendView, sliceComponent);
    }
  }

  protected didSetSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceLegend !== void 0) {
        componentObserver.pieDidSetSliceLegend(newLegendView, oldLegendView, sliceComponent, this);
      }
    }
  }

  insertSliceTrait(sliceTrait: SliceTrait, targetTrait: Trait | null = null): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent>[];
    let targetComponent: SliceComponent | null = null;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceComponent = sliceFasteners[i]!.component;
      if (sliceComponent !== null) {
        if (sliceComponent.slice.trait === sliceTrait) {
          return;
        } else if (sliceComponent.slice.trait === targetTrait) {
          targetComponent = sliceComponent;
        }
      }
    }
    const sliceComponent = this.createSlice(sliceTrait);
    if (sliceComponent !== null) {
      this.insertChildComponent(sliceComponent, targetComponent);
      sliceComponent.slice.setTrait(sliceTrait);
      if (sliceComponent.slice.view === null) {
        const sliceView = this.createSliceView(sliceComponent);
        let targetView: SliceView | null = null;
        if (targetComponent !== null) {
          targetView = targetComponent.slice.view;
        }
        const pieView = this.pie.view;
        if (pieView !== null) {
          sliceComponent.slice.injectView(pieView, sliceView, targetView, null);
        } else {
          sliceComponent.slice.setView(sliceView, targetView);
        }
      }
    }
  }

  removeSliceTrait(sliceTrait: SliceTrait): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      const sliceComponent = sliceFastener.component;
      if (sliceComponent !== null && sliceComponent.slice.trait === sliceTrait) {
        sliceFastener.setComponent(null);
        if (this.isMounted()) {
          sliceFastener.unmount();
        }
        sliceFasteners.splice(i, 1);
        sliceComponent.remove();
        return;
      }
    }
  }

  protected initSliceTrait(sliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
    // hook
  }

  protected willSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceTrait !== void 0) {
        componentObserver.pieWillSetSliceTrait(newSliceTrait, oldSliceTrait, sliceComponent, this);
      }
    }
  }

  protected onSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
    if (newSliceTrait !== null) {
      this.initSliceTrait(newSliceTrait, sliceComponent);
    }
  }

  protected didSetSliceTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceTrait !== void 0) {
        componentObserver.pieDidSetSliceTrait(newSliceTrait, oldSliceTrait, sliceComponent, this);
      }
    }
  }

  insertSlice(sliceComponent: SliceComponent, targetComponent: Component | null = null): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent>[];
    let targetIndex = -1;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      if (sliceFastener.component === sliceComponent) {
        return;
      } else if (sliceFastener.component === targetComponent) {
        targetIndex = i;
      }
    }
    const sliceFastener = this.createSliceFastener(sliceComponent);
    sliceFasteners.splice(targetIndex, 0, sliceFastener);
    sliceFastener.setComponent(sliceComponent, targetComponent);
    if (this.isMounted()) {
      sliceFastener.mount();
    }
  }

  removeSlice(sliceComponent: SliceComponent): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      if (sliceFastener.component === sliceComponent) {
        sliceFastener.setComponent(null);
        if (this.isMounted()) {
          sliceFastener.unmount();
        }
        sliceFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected createSlice(sliceTrait: SliceTrait): SliceComponent | null {
    return new SliceComponent();
  }

  protected initSlice(sliceComponent: SliceComponent): void {
    const sliceView = sliceComponent.slice.view;
    if (sliceView !== null) {
      this.initSliceView(sliceView, sliceComponent);
      const labelView = sliceView.label.view;
      if (labelView !== null) {
        this.initSliceLabel(labelView, sliceComponent);
      }
      const legendView = sliceView.legend.view;
      if (legendView !== null) {
        this.initSliceLegend(legendView, sliceComponent);
      }
    }
  }

  protected willSetSlice(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null,
                         sliceFastener: ComponentFastener<this, SliceComponent>): void {
    // hook
  }

  protected onSetSlice(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null,
                       sliceFastener: ComponentFastener<this, SliceComponent>): void {
    if (newSliceComponent !== null) {
      this.initSlice(newSliceComponent);
    }
  }

  protected didSetSlice(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null,
                        sliceFastener: ComponentFastener<this, SliceComponent>): void {
    // hook
  }

  @ComponentProperty({type: Timing, state: true})
  declare sliceTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  /** @hidden */
  static SliceFastener = ComponentFastener.define<PieComponent, SliceComponent>({
    type: SliceComponent,
    child: false,
    observe: true,
    willSetComponent(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null): void {
      this.owner.willSetSlice(newSliceComponent, oldSliceComponent, this);
    },
    onSetComponent(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null): void {
      this.owner.onSetSlice(newSliceComponent, oldSliceComponent, this);
    },
    didSetComponent(newSliceComponent: SliceComponent | null, oldSliceComponent: SliceComponent | null): void {
      this.owner.didSetSlice(newSliceComponent, oldSliceComponent, this);
    },
    sliceWillSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
      this.owner.willSetSliceView(newSliceView, oldSliceView, sliceComponent);
    },
    sliceDidSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetSliceView(newSliceView, oldSliceView, sliceComponent);
      this.owner.didSetSliceView(newSliceView, oldSliceView, sliceComponent);
    },
    sliceWillSetValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
      this.owner.willSetSliceValue(newValue, oldValue, sliceComponent);
    },
    sliceDidSetValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
      this.owner.onSetSliceValue(newValue, oldValue, sliceComponent);
      this.owner.didSetSliceValue(newValue, oldValue, sliceComponent);
    },
    sliceWillSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.willSetSliceLabel(newLabelView, oldLabelView, sliceComponent);
    },
    sliceDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetSliceLabel(newLabelView, oldLabelView, sliceComponent);
      this.owner.didSetSliceLabel(newLabelView, oldLabelView, sliceComponent);
    },
    sliceWillSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.willSetSliceLegend(newLegendView, oldLegendView, sliceComponent);
    },
    sliceDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetSliceLegend(newLegendView, oldLegendView, sliceComponent);
      this.owner.didSetSliceLegend(newLegendView, oldLegendView, sliceComponent);
    },
    sliceWillSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
      this.owner.willSetSliceTrait(newSliceTrait, oldSliceTrait, sliceComponent);
    },
    sliceDidSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
      this.owner.onSetSliceTrait(newSliceTrait, oldSliceTrait, sliceComponent);
      this.owner.didSetSliceTrait(newSliceTrait, oldSliceTrait, sliceComponent);
    },
  });

  protected createSliceFastener(sliceComponent: SliceComponent): ComponentFastener<this, SliceComponent> {
    return new PieComponent.SliceFastener(this, sliceComponent.key, "slice") as unknown as ComponentFastener<this, SliceComponent>;
  }

  /** @hidden */
  declare readonly sliceFasteners: ReadonlyArray<ComponentFastener<this, SliceComponent>>;

  protected getSliceFastener(sliceTrait: SliceTrait): ComponentFastener<this, SliceComponent> | null {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      const sliceComponent = sliceFastener.component;
      if (sliceComponent !== null && sliceComponent.slice.trait === sliceTrait) {
        return sliceFastener;
      }
    }
    return null;
  }

  /** @hidden */
  protected mountSliceFasteners(): void {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      sliceFastener.mount();
    }
  }

  /** @hidden */
  protected unmountSliceFasteners(): void {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      sliceFastener.unmount();
    }
  }

  protected detectSliceComponent(component: Component): SliceComponent | null {
    return component instanceof SliceComponent ? component : null;
  }

  protected onInsertSliceComponent(sliceComponent: SliceComponent, targetComponent: Component | null): void {
    this.insertSlice(sliceComponent, targetComponent);
  }

  protected onRemoveSliceComponent(sliceComponent: SliceComponent): void {
    this.removeSlice(sliceComponent);
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    const sliceComponent = this.detectSliceComponent(childComponent);
    if (sliceComponent !== null) {
      this.onInsertSliceComponent(sliceComponent, targetComponent);
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    const sliceComponent = this.detectSliceComponent(childComponent);
    if (sliceComponent !== null) {
      this.onRemoveSliceComponent(sliceComponent);
    }
  }

  /** @hidden */
  protected mountComponentFasteners(): void {
    super.mountComponentFasteners();
    this.mountSliceFasteners();
  }

  /** @hidden */
  protected unmountComponentFasteners(): void {
    this.unmountSliceFasteners();
    super.unmountComponentFasteners();
  }
}
