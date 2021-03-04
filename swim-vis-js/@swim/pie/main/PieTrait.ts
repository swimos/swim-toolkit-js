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

import {Equals} from "@swim/util";
import type {GraphicsView} from "@swim/graphics";
import {TraitModelType, Trait, TraitFastener, GenericTrait} from "@swim/model";
import {SliceTrait} from "./SliceTrait";
import type {PieTraitObserver} from "./PieTraitObserver";

export class PieTrait extends GenericTrait {
  constructor() {
    super();
    Object.defineProperty(this, "title", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "sliceFasteners", {
      value: [],
      enumerable: true,
    });
  }

  declare readonly traitObservers: ReadonlyArray<PieTraitObserver>;

  declare readonly title: GraphicsView | string | undefined;

  setTitle(newTitle: GraphicsView | string | undefined): void {
    const oldTitle = this.title;
    if (!Equals(oldTitle, newTitle)) {
      this.willSetTitle(newTitle, oldTitle);
      Object.defineProperty(this, "title", {
        value: newTitle,
        enumerable: true,
        configurable: true,
      });
      this.onSetTitle(newTitle, oldTitle);
      this.didSetTitle(newTitle, oldTitle);
    }
  }

  protected willSetTitle(newTitle: GraphicsView | string | undefined, oldTitle: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.pieWillSetTitle !== void 0) {
        traitObserver.pieWillSetTitle(newTitle, oldTitle, this);
      }
    }
  }

  protected onSetTitle(newTitle: GraphicsView | string | undefined, oldTitle: GraphicsView | string | undefined): void {
    // hook
  }

  protected didSetTitle(newTitle: GraphicsView | string | undefined, oldTitle: GraphicsView | string | undefined): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.pieDidSetTitle !== void 0) {
        traitObserver.pieDidSetTitle(newTitle, oldTitle, this);
      }
    }
  }

  insertSlice(sliceTrait: SliceTrait, targetTrait: SliceTrait | null = null): void {
    const sliceFasteners = this.sliceFasteners as TraitFastener<this, SliceTrait>[];
    let targetIndex = sliceFasteners.length;
    if (targetTrait !== null) {
      for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
        const sliceFastener = sliceFasteners[i]!;
        if (sliceFastener.trait === sliceTrait) {
          return;
        } else if (sliceFastener.trait === targetTrait) {
          targetIndex = i;
        }
      }
    }
    const sliceFastener = this.createSliceFastener(sliceTrait);
    sliceFasteners.splice(targetIndex, 0, sliceFastener);
    sliceFastener.setTrait(sliceTrait);
    if (this.isMounted()) {
      sliceFastener.mount();
    }
  }

  removeSlice(sliceTrait: SliceTrait): void {
    const sliceFasteners = this.sliceFasteners as TraitFastener<this, SliceTrait>[];
    for (let i = 0, n = sliceFasteners.length; i < n; i += 1) {
      const sliceFastener = sliceFasteners[i]!;
      if (sliceFastener.trait === sliceTrait) {
        sliceFastener.setTrait(null);
        if (this.isMounted()) {
          sliceFastener.unmount();
        }
        sliceFasteners.splice(i, 1);
        break;
      }
    }
  }

  /** @hidden */
  static SliceFastener = TraitFastener.define<PieTrait, SliceTrait>({
    type: SliceTrait,
    sibling: false,
    observe: false,
    willSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.willSetSlice(newSliceTrait, oldSliceTrait, this);
    },
    onSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.onSetSlice(newSliceTrait, oldSliceTrait, this);
    },
    didSetTrait(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null): void {
      this.owner.didSetSlice(newSliceTrait, oldSliceTrait, this);
    },
  });

  protected createSliceFastener(sliceTrait: SliceTrait): TraitFastener<this, SliceTrait> {
    return new PieTrait.SliceFastener(this, sliceTrait.key) as TraitFastener<this, SliceTrait>;
  }

  /** @hidden */
  declare readonly sliceFasteners: ReadonlyArray<TraitFastener<this, SliceTrait>>;

  protected willSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null,
                         sliceFastener: TraitFastener<this, SliceTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.pieWillSetSlice !== void 0) {
        traitObserver.pieWillSetSlice(newSliceTrait, oldSliceTrait, this);
      }
    }
  }

  protected onSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null,
                       sliceFastener: TraitFastener<this, SliceTrait>): void {
    // hook
  }

  protected didSetSlice(newSliceTrait: SliceTrait | null, oldSliceTrait: SliceTrait | null,
                        sliceFastener: TraitFastener<this, SliceTrait>): void {
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      if (traitObserver.pieDidSetSlice !== void 0) {
        traitObserver.pieDidSetSlice(newSliceTrait, oldSliceTrait, this);
      }
    }
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

  protected detectSlices(model: TraitModelType<this>): void {
    if (this.autoSlice) {
      const traits = model.traits;
      for (let i = 0, n = traits.length; i < n; i += 1) {
        const trait = traits[i]!;
        if (trait instanceof SliceTrait) {
          this.insertSlice(trait);
        }
      }
    }
  }

  protected onInsertSlice(sliceTrait: SliceTrait, targetTrait: SliceTrait | null): void {
    if (this.autoSlice) {
      this.insertSlice(sliceTrait, targetTrait);
    }
  }

  protected onRemoveSlice(sliceTrait: SliceTrait): void {
    if (this.autoSlice) {
      this.removeSlice(sliceTrait);
    }
  }

  protected didSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    if (newModel !== null) {
      this.detectSlices(newModel);
    }
    super.didSetModel(newModel, oldModel);
  }

  protected onInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    super.onInsertTrait(trait, targetTrait);
    if (trait instanceof SliceTrait) {
      this.onInsertSlice(trait, targetTrait instanceof SliceTrait ? targetTrait : null);
    }
  }

  protected onRemoveTrait(trait: Trait): void {
    super.onRemoveTrait(trait);
    if (trait instanceof SliceTrait) {
      this.onRemoveSlice(trait);
    }
  }

  /** @hidden */
  protected mountTraitFasteners(): void {
    super.mountTraitFasteners();
    this.mountSliceFasteners();
  }

  /** @hidden */
  protected unmountTraitFasteners(): void {
    this.unmountSliceFasteners();
    super.unmountTraitFasteners();
  }
}
