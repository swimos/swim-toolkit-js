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
import type {GraphicsView} from "@swim/graphics";
import {Trait, TraitObserverType} from "@swim/model";
import {
  Component,
  ComponentProperty,
  ComponentTrait,
  ComponentView,
  ComponentFastener,
  CompositeComponent,
} from "@swim/component";
import type {SliceView} from "./SliceView";
import {PieView} from "./PieView";
import type {SliceTrait} from "./SliceTrait";
import {PieTrait} from "./PieTrait";
import {SliceComponent} from "./SliceComponent";
import type {PieComponentObserver} from "./PieComponentObserver";

export class PieComponent<P extends Trait = PieTrait, S extends Trait = SliceTrait> extends CompositeComponent {
  declare readonly componentObservers: ReadonlyArray<PieComponentObserver<P, S>>;

  constructor() {
    super();
    Object.defineProperty(this, "sliceFasteners", {
      value: [],
      enumerable: true,
    });
  }

  setPieTitle(title: GraphicsView | string | undefined): void {
    const pieView = this.pie.view;
    if (pieView !== null) {
      pieView.title.setView(title !== void 0 ? title : null);
    }
  }

  insertSlice(sliceComponent: SliceComponent<S>, targetComponent: SliceComponent<S> | null = null): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent<S>>[];
    let targetIndex = sliceFasteners.length;
    if (targetComponent !== null) {
      for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
        const sliceFastener = sliceFasteners[i]!;
        if (sliceFastener.component === sliceComponent) {
          return;
        } else if (sliceFastener.component === targetComponent) {
          targetIndex = i;
        }
      }
    }
    const sliceFastener = this.createSliceFastener(sliceComponent);
    sliceFasteners.splice(targetIndex, 0, sliceFastener);
    sliceFastener.setComponent(sliceComponent);
    if (this.isMounted()) {
      sliceFastener.mount();
    }
  }

  removeSlice(sliceComponent: SliceComponent<S>): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent<S>>[];
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

  insertSliceTrait(sliceTrait: S): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent<S>>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceComponent = sliceFasteners[i]!.component;
      if (sliceComponent !== null && sliceComponent.source.trait === sliceTrait) {
        return;
      }
    }
    const sliceComponent = this.createSliceComponent(sliceTrait);
    if (sliceComponent !== null) {
      this.appendChildComponent(sliceComponent);
      sliceComponent.source.setTrait(sliceTrait);
      if (sliceComponent.slice.view === null) {
        const sliceView = this.createPieSlice(sliceComponent);
        if (sliceView !== null) {
          sliceComponent.slice.setView(sliceView);
        }
        const pieView = this.pie.view;
        if (pieView !== null) {
          sliceComponent.slice.insert(pieView, null);
        }
      }
    }
  }

  removeSliceTrait(sliceTrait: S): void {
    const sliceFasteners = this.sliceFasteners as ComponentFastener<this, SliceComponent<S>>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      const sliceComponent = sliceFastener.component;
      if (sliceComponent !== null && sliceComponent.source.trait === sliceTrait) {
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

  protected createSliceComponent(sliceTrait: S): SliceComponent<S> | null {
    return new SliceComponent();
  }

  protected initSliceComponent(sliceComponent: SliceComponent<S>): void {
    const sliceView = sliceComponent.slice.view;
    if (sliceView !== null) {
      this.initPieSlice(sliceView, sliceComponent);
      const labelView = sliceView.label.view;
      if (labelView !== null) {
        this.initPieSliceLabel(labelView, sliceComponent);
      }
      const legendView = sliceView.legend.view;
      if (legendView !== null) {
        this.initPieSliceLegend(legendView, sliceComponent);
      }
    }
  }

  protected createSliceFastener(sliceComponent: SliceComponent<S>): ComponentFastener<this, SliceComponent<S>> {
    return new PieComponent.SliceFastener(this as unknown as PieComponent, sliceComponent.key) as unknown as ComponentFastener<this, SliceComponent<S>>;
  }

  protected willSetSlice(newSliceComponent: SliceComponent<S> | null, oldSliceComponent: SliceComponent<S> | null,
                         sliceFastener: ComponentFastener<this, SliceComponent<S>>): void {
    // hook
  }

  protected onSetSlice(newSliceComponent: SliceComponent<S> | null, oldSliceComponent: SliceComponent<S> | null,
                       sliceFastener: ComponentFastener<this, SliceComponent<S>>): void {
    if (newSliceComponent !== null) {
      this.initSliceComponent(newSliceComponent);
    }
  }

  protected didSetSlice(newSliceComponent: SliceComponent<S> | null, oldSliceComponent: SliceComponent<S> | null,
                        sliceFastener: ComponentFastener<this, SliceComponent<S>>): void {
    // hook
  }

  createPie(): PieView | null {
    return PieView.create();
  }

  initPie(pieView: PieView): void {
    // hook
  }

  protected attachPie(pieView: PieView): void {
    const sourceTrait = this.source.trait;
    if (sourceTrait instanceof PieTrait) {
      this.setPieTitle(sourceTrait.title);
    }
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceComponent = sliceFasteners[i]!.component;
      if (sliceComponent !== null) {
        const sliceView = sliceComponent.slice.view;
        if (sliceView !== null && !sliceView.isMounted()) {
          pieView.appendChildView(sliceView);
        }
      }
    }
  }

  protected detachPie(pieView: PieView): void {
    // hook
  }

  protected willSetPie(newPieView: PieView | null, oldPieView: PieView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetView !== void 0) {
        componentObserver.pieWillSetView(newPieView, oldPieView, this);
      }
    }
  }

  protected onSetPie(newPieView: PieView | null, oldPieView: PieView | null): void {
    if (newPieView !== null) {
      this.initPie(newPieView);
      this.title.setView(newPieView.title.view);
    }
  }

  protected didSetPie(newPieView: PieView | null, oldPieView: PieView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetView !== void 0) {
        componentObserver.pieDidSetView(newPieView, oldPieView, this);
      }
    }
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
    // hook
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

  createPieSlice(sliceComponent: SliceComponent<S>): SliceView | null {
    return sliceComponent.createSlice();
  }

  initPieSlice(sliceView: SliceView, sliceComponent: SliceComponent<S>): void {
    // hook
  }

  protected willSetPieSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSlice !== void 0) {
        componentObserver.pieWillSetSlice(newSliceView, oldSliceView, sliceComponent, this);
      }
    }
  }

  protected onSetPieSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent<S>): void {
    if (newSliceView !== null) {
      this.initPieSlice(newSliceView, sliceComponent);
      const labelView = newSliceView.label.view;
      if (labelView !== null) {
        this.initPieSliceLabel(labelView, sliceComponent);
      }
      const legendView = newSliceView.legend.view;
      if (legendView !== null) {
        this.initPieSliceLegend(legendView, sliceComponent);
      }
    }
  }

  protected didSetPieSlice(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSlice !== void 0) {
        componentObserver.pieDidSetSlice(newSliceView, oldSliceView, sliceComponent, this);
      }
    }
  }

  protected willSetPieSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceValue !== void 0) {
        componentObserver.pieWillSetSliceValue(newValue, oldValue, sliceComponent, this);
      }
    }
  }

  protected onSetPieSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent<S>): void {
    // hook
  }

  protected didSetPieSliceValue(newValue: number, oldValue: number, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceValue !== void 0) {
        componentObserver.pieDidSetSliceValue(newValue, oldValue, sliceComponent, this);
      }
    }
  }

  initPieSliceLabel(labelView: GraphicsView, sliceComponent: SliceComponent<S>): void {
    // hook
  }

  protected willSetPieSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceLabel !== void 0) {
        componentObserver.pieWillSetSliceLabel(newLabelView, oldLabelView, sliceComponent, this);
      }
    }
  }

  protected onSetPieSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    if (newLabelView !== null) {
      this.initPieSliceLabel(newLabelView, sliceComponent);
    }
  }

  protected didSetPieSliceLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceLabel !== void 0) {
        componentObserver.pieDidSetSliceLabel(newLabelView, oldLabelView, sliceComponent, this);
      }
    }
  }

  initPieSliceLegend(labelView: GraphicsView, sliceComponent: SliceComponent<S>): void {
    // hook
  }

  protected willSetPieSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceLegend !== void 0) {
        componentObserver.pieWillSetSliceLegend(newLegendView, oldLegendView, sliceComponent, this);
      }
    }
  }

  protected onSetPieSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    if (newLegendView !== null) {
      this.initPieSliceLegend(newLegendView, sliceComponent);
    }
  }

  protected didSetPieSliceLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceLegend !== void 0) {
        componentObserver.pieDidSetSliceLegend(newLegendView, oldLegendView, sliceComponent, this);
      }
    }
  }

  protected initPieSliceSource(sourceTrait: S | null, sliceComponent: SliceComponent<S>): void {
    // hook
  }

  protected willSetPieSliceSource(newSourceTrait: S | null, oldSourceTrait: S | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSliceSource !== void 0) {
        componentObserver.pieWillSetSliceSource(newSourceTrait, oldSourceTrait, sliceComponent, this);
      }
    }
  }

  protected onSetPieSliceSource(newSourceTrait: S | null, oldSourceTrait: S | null, sliceComponent: SliceComponent<S>): void {
    if (newSourceTrait !== null) {
      this.initPieSliceSource(newSourceTrait, sliceComponent);
    }
  }

  protected didSetPieSliceSource(newSourceTrait: S | null, oldSourceTrait: S | null, sliceComponent: SliceComponent<S>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSliceSource !== void 0) {
        componentObserver.pieDidSetSliceSource(newSourceTrait, oldSourceTrait, sliceComponent, this);
      }
    }
  }

  protected initSource(sourceTrait: P): void {
    // hook
  }

  protected attachSource(sourceTrait: P): void {
    if (sourceTrait instanceof PieTrait) {
      const pieView = this.pie.view;
      if (pieView !== null) {
        this.setPieTitle(sourceTrait.title);
      }
      const sliceFasteners = sourceTrait.sliceFasteners;
      for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
        const sliceTrait = sliceFasteners[i]!.trait as S | null;
        if (sliceTrait !== null) {
          this.insertSliceTrait(sliceTrait);
        }
      }
    }
  }

  protected detachSource(sourceTrait: P): void {
    const pieView = this.pie.view;
    if (pieView !== null) {
      this.setPieTitle(void 0);
    }
    if (sourceTrait instanceof PieTrait) {
      const sliceFasteners = sourceTrait.sliceFasteners;
      for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
        const sliceTrait = sliceFasteners[i]!.trait as S | null;
        if (sliceTrait !== null) {
          this.removeSliceTrait(sliceTrait);
        }
      }
    }
  }

  protected willSetSource(newSourceTrait: P | null, oldSourceTrait: P | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieWillSetSource !== void 0) {
        componentObserver.pieWillSetSource(newSourceTrait, oldSourceTrait, this);
      }
    }
  }

  protected onSetSource(newSourceTrait: P | null, oldSourceTrait: P | null): void {
    if (newSourceTrait !== null) {
      this.initSource(newSourceTrait);
    }
  }

  protected didSetSource(newSourceTrait: P | null, oldSourceTrait: P | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.pieDidSetSource !== void 0) {
        componentObserver.pieDidSetSource(newSourceTrait, oldSourceTrait, this);
      }
    }
  }

  @ComponentProperty({type: Timing, state: true})
  declare sliceTiming: ComponentProperty<this, Timing | boolean | undefined, AnyTiming>;

  @ComponentView<PieComponent<P, S>, PieView>({
    type: PieView,
    willSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      this.owner.willSetPie(oldPieView, newPieView);
    },
    onSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      if (oldPieView !== null) {
        this.owner.detachPie(oldPieView);
      }
      this.owner.onSetPie(newPieView, oldPieView);
      if (newPieView !== null) {
        this.owner.attachPie(newPieView);
      }
    },
    didSetView(newPieView: PieView | null, oldPieView: PieView | null): void {
      this.owner.didSetPie(oldPieView, newPieView);
    },
    createView(): PieView | null {
      return this.owner.createPie();
    },
  })
  declare pie: ComponentView<this, PieView>;

  @ComponentView<PieComponent<P, S>, GraphicsView>({
    observe: false,
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

  @ComponentTrait<PieComponent<P, S>, P, never, TraitObserverType<PieTrait>>({
    extends: void 0,
    type: Trait,
    willSetTrait(newSourceTrait: P | null, oldSourceTrait: P | null): void {
      this.owner.willSetSource(newSourceTrait, oldSourceTrait);
    },
    onSetTrait(newSourceTrait: P | null, oldSourceTrait: P | null): void {
      if (oldSourceTrait !== null) {
        this.owner.detachSource(oldSourceTrait);
      }
      this.owner.onSetSource(newSourceTrait, oldSourceTrait);
      if (newSourceTrait !== null) {
        this.owner.attachSource(newSourceTrait);
      }
    },
    didSetTrait(newSourceTrait: P | null, oldSourceTrait: P | null): void {
      this.owner.didSetSource(newSourceTrait, oldSourceTrait);
    },
    pieDidSetTitle(newTitle: GraphicsView | string | undefined, oldTitle: GraphicsView | string | undefined, sourceTrait: PieTrait): void {
      this.owner.setPieTitle(newTitle);
    },
    pieWillSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sourceTrait: PieTrait): void {
      if (oldSliceTrait !== null) {
        this.owner.removeSliceTrait(oldSliceTrait as unknown as S);
      }
    },
    pieDidSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null, sourceTrait: PieTrait): void {
      if (newSliceTrait !== null) {
        this.owner.insertSliceTrait(newSliceTrait as unknown as S);
      }
    },
  })
  declare source: ComponentTrait<this, P>;

  /** @hidden */
  static SliceFastener = ComponentFastener.define<PieComponent, SliceComponent>({
    type: SliceComponent,
    child: false,
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
      this.owner.willSetPieSlice(newSliceView, oldSliceView, sliceComponent);
    },
    sliceDidSetView(newSliceView: SliceView | null, oldSliceView: SliceView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetPieSlice(newSliceView, oldSliceView, sliceComponent);
      this.owner.didSetPieSlice(newSliceView, oldSliceView, sliceComponent);
    },
    sliceWillSetValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
      this.owner.willSetPieSliceValue(newValue, oldValue, sliceComponent);
    },
    sliceDidSetValue(newValue: number, oldValue: number, sliceComponent: SliceComponent): void {
      this.owner.onSetPieSliceValue(newValue, oldValue, sliceComponent);
      this.owner.didSetPieSliceValue(newValue, oldValue, sliceComponent);
    },
    sliceWillSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.willSetPieSliceLabel(newLabelView, oldLabelView, sliceComponent);
    },
    sliceDidSetLabel(newLabelView: GraphicsView | null, oldLabelView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetPieSliceLabel(newLabelView, oldLabelView, sliceComponent);
      this.owner.didSetPieSliceLabel(newLabelView, oldLabelView, sliceComponent);
    },
    sliceWillSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.willSetPieSliceLegend(newLegendView, oldLegendView, sliceComponent);
    },
    sliceDidSetLegend(newLegendView: GraphicsView | null, oldLegendView: GraphicsView | null, sliceComponent: SliceComponent): void {
      this.owner.onSetPieSliceLegend(newLegendView, oldLegendView, sliceComponent);
      this.owner.didSetPieSliceLegend(newLegendView, oldLegendView, sliceComponent);
    },
    sliceWillSetSource(newSourceTrait: SliceTrait | null, oldSourceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
      this.owner.willSetPieSliceSource(newSourceTrait, oldSourceTrait, sliceComponent);
    },
    sliceDidSetSource(newSourceTrait: SliceTrait | null, oldSourceTrait: SliceTrait | null, sliceComponent: SliceComponent): void {
      this.owner.onSetPieSliceSource(newSourceTrait, oldSourceTrait, sliceComponent);
      this.owner.didSetPieSliceSource(newSourceTrait, oldSourceTrait, sliceComponent);
    },
  });

  /** @hidden */
  declare readonly sliceFasteners: ReadonlyArray<ComponentFastener<this, SliceComponent<S>>>;

  protected getSliceFastener(sliceTrait: S): ComponentFastener<this, SliceComponent<S>> | null {
    const sliceFasteners = this.sliceFasteners;
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      const sliceComponent = sliceFastener.component;
      if (sliceComponent !== null && sliceComponent.source.trait === sliceTrait) {
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

  /** @hidden */
  get autoSlice(): boolean {
    return true;
  }

  protected onInsertSlice(sliceComponent: SliceComponent<S>, targetComponent: SliceComponent<S> | null): void {
    if (this.autoSlice) {
      this.insertSlice(sliceComponent, targetComponent);
    }
  }

  protected onRemoveSlice(sliceComponent: SliceComponent<S>): void {
    if (this.autoSlice) {
      this.removeSlice(sliceComponent);
    }
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    if (childComponent instanceof SliceComponent) {
      this.onInsertSlice(childComponent, targetComponent instanceof SliceComponent ? targetComponent : null);
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    if (childComponent instanceof SliceComponent) {
      this.onRemoveSlice(childComponent);
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
