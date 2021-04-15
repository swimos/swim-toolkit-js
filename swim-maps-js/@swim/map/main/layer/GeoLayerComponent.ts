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

import type {Timing} from "@swim/mapping";
import type {GeoBox} from "@swim/geo";
import type {Trait} from "@swim/model";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import {Component, ComponentViewTrait, ComponentFastener} from "@swim/component";
import type {GeoViewContext} from "../geo/GeoViewContext";
import type {GeoView} from "../geo/GeoView";
import type {GeoTrait} from "../geo/GeoTrait";
import {GeoComponent} from "../geo/GeoComponent";
import {GeoTreeView} from "../tree/GeoTreeView";
import {GeoLayerTrait} from "./GeoLayerTrait";
import type {GeoLayerComponentObserver} from "./GeoLayerComponentObserver";

export class GeoLayerComponent extends GeoComponent {
  constructor() {
    super();
    Object.defineProperty(this, "featureFasteners", {
      value: [],
      enumerable: true,
    });
  }

  declare readonly componentObservers: ReadonlyArray<GeoLayerComponentObserver>;

  protected initGeoTrait(geoTrait: GeoLayerTrait): void {
    // hook
  }

  protected attachGeoTrait(geoTrait: GeoLayerTrait): void {
    const featureFasteners = geoTrait.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureTrait = featureFasteners[i]!.trait;
      if (featureTrait !== null) {
        this.insertFeatureTrait(featureTrait);
      }
    }
  }

  protected detachGeoTrait(geoTrait: GeoLayerTrait): void {
    const featureFasteners = geoTrait.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureTrait = featureFasteners[i]!.trait;
      if (featureTrait !== null) {
        this.removeFeatureTrait(featureTrait);
      }
    }
  }

  protected willSetGeoTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetGeoTrait !== void 0) {
        componentObserver.componentWillSetGeoTrait(newGeoTrait, oldGeoTrait, this);
      }
    }
  }

  protected onSetGeoTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
    if (oldGeoTrait !== null) {
      this.detachGeoTrait(oldGeoTrait);
    }
    if (newGeoTrait !== null) {
      this.attachGeoTrait(newGeoTrait);
      this.initGeoTrait(newGeoTrait);
    }
  }

  protected didSetGeoTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetGeoTrait !== void 0) {
        componentObserver.componentDidSetGeoTrait(newGeoTrait, oldGeoTrait, this);
      }
    }
  }

  protected willSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetGeoBounds !== void 0) {
        componentObserver.componentWillSetGeoBounds(newGeoBounds, oldGeoBounds, this);
      }
    }
  }

  protected onSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    // hook
  }

  protected didSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetGeoBounds !== void 0) {
        componentObserver.componentDidSetGeoBounds(newGeoBounds, oldGeoBounds, this);
      }
    }
  }

  protected createGeoView(): GeoView | null {
    return GeoTreeView.create();
  }

  protected initGeoView(geoView: GeoView): void {
    // hook
  }

  protected attachGeoView(geoView: GeoView): void {
    const featureFasteners = this.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureComponent = featureFasteners[i]!.component;
      if (featureComponent !== null) {
        const featureView = featureComponent.geo.view;
        if (featureView !== null && featureView.parentView === null) {
          featureComponent.geo.injectView(geoView);
        }
      }
    }
  }

  protected detachGeoView(geoView: GeoView): void {
    // hook
  }

  protected willSetGeoView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetGeoView !== void 0) {
        componentObserver.componentWillSetGeoView(newGeoView, oldGeoView, this);
      }
    }
  }

  protected onSetGeoView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
    if (oldGeoView !== null) {
      this.detachGeoView(oldGeoView);
    }
    if (newGeoView !== null) {
      this.attachGeoView(newGeoView);
      this.initGeoView(newGeoView);
    }
  }

  protected didSetGeoView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetGeoView !== void 0) {
        componentObserver.componentDidSetGeoView(newGeoView, oldGeoView, this);
      }
    }
  }

  protected projectGeoView(viewContext: GeoViewContext, geoView: GeoView): void {
    // hook
  }

  protected themeGeoView(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, geoView: GeoView): void {
    // hook
  }

  /** @hidden */
  static GeoFastener = ComponentViewTrait.define<GeoLayerComponent, GeoView, GeoLayerTrait>({
    observeView: true,
    willSetView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
      this.owner.willSetGeoView(newGeoView, oldGeoView);
    },
    onSetView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
      this.owner.onSetGeoView(newGeoView, oldGeoView);
    },
    didSetView(newGeoView: GeoView | null, oldGeoView: GeoView | null): void {
      this.owner.didSetGeoView(newGeoView, oldGeoView);
    },
    viewWillProject(viewContext: GeoViewContext, geoView: GeoView): void {
      this.owner.projectGeoView(viewContext, geoView);
    },
    viewDidApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, geoView: GeoView): void {
      this.owner.themeGeoView(theme, mood, timing, geoView);
    },
    createView(): GeoView | null {
      return this.owner.createGeoView();
    },
    traitType: GeoLayerTrait,
    observeTrait: true,
    willSetTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
      this.owner.willSetGeoTrait(newGeoTrait, oldGeoTrait);
    },
    onSetTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
      this.owner.onSetGeoTrait(newGeoTrait, oldGeoTrait);
    },
    didSetTrait(newGeoTrait: GeoLayerTrait | null, oldGeoTrait: GeoLayerTrait | null): void {
      this.owner.didSetGeoTrait(newGeoTrait, oldGeoTrait);
    },
    traitWillSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
      this.owner.willSetGeoBounds(newGeoBounds, oldGeoBounds);
    },
    traitDidSetGeoBounds(newGeoBounds: GeoBox, oldGeoBounds: GeoBox): void {
      this.owner.onSetGeoBounds(newGeoBounds, oldGeoBounds);
      this.owner.didSetGeoBounds(newGeoBounds, oldGeoBounds);
    },
    traitWillSetFeature(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null, targetTrait: Trait): void {
      if (oldFeatureTrait !== null) {
        this.owner.removeFeatureTrait(oldFeatureTrait);
      }
    },
    traitDidSetFeature(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null, targetTrait: Trait): void {
      if (newFeatureTrait !== null) {
        this.owner.insertFeatureTrait(newFeatureTrait, targetTrait);
      }
    },
  });

  @ComponentViewTrait<GeoLayerComponent, GeoView, GeoLayerTrait>({
    extends: GeoLayerComponent.GeoFastener,
  })
  declare geo: ComponentViewTrait<this, GeoView, GeoLayerTrait>;

  insertFeature(featureComponent: GeoComponent, targetComponent: Component | null = null): void {
    const featureFasteners = this.featureFasteners as ComponentFastener<this, GeoComponent>[];
    let targetIndex = featureFasteners.length;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      if (featureFastener.component === featureComponent) {
        return;
      } else if (featureFastener.component === targetComponent) {
        targetIndex = i;
      }
    }
    const featureFastener = this.createFeatureFastener(featureComponent);
    featureFasteners.splice(targetIndex, 0, featureFastener);
    featureFastener.setComponent(featureComponent, targetComponent);
    if (this.isMounted()) {
      featureFastener.mount();
    }
  }

  removeFeature(featureComponent: GeoComponent): void {
    const featureFasteners = this.featureFasteners as ComponentFastener<this, GeoComponent>[];
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      if (featureFastener.component === featureComponent) {
        featureFastener.setComponent(null);
        if (this.isMounted()) {
          featureFastener.unmount();
        }
        featureFasteners.splice(i, 1);
        break;
      }
    }
  }

  protected createFeature(featureTrait: GeoTrait): GeoComponent | null {
    return GeoComponent.fromTrait(featureTrait);
  }

  protected initFeature(featureComponent: GeoComponent, featureFastener: ComponentFastener<this, GeoComponent>): void {
    const featureTrait = featureComponent.geo.trait;
    if (featureTrait !== null) {
      this.initFeatureTrait(featureTrait, featureFastener);
    }
    const featureView = featureComponent.geo.view;
    if (featureView !== null) {
      this.initFeatureView(featureView, featureFastener);
    }
  }

  protected attachFeature(featureComponent: GeoComponent, featureFastener: ComponentFastener<this, GeoComponent>): void {
    const featureTrait = featureComponent.geo.trait;
    if (featureTrait !== null) {
      this.attachFeatureTrait(featureTrait, featureFastener);
    }
    const featureView = featureComponent.geo.view;
    if (featureView !== null) {
      this.attachFeatureView(featureView, featureFastener);
    }
  }

  protected detachFeature(featureComponent: GeoComponent, featureFastener: ComponentFastener<this, GeoComponent>): void {
    const featureView = featureComponent.geo.view;
    if (featureView !== null) {
      this.detachFeatureView(featureView, featureFastener);
    }
    const featureTrait = featureComponent.geo.trait;
    if (featureTrait !== null) {
      this.detachFeatureTrait(featureTrait, featureFastener);
    }
  }

  protected willSetFeature(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null,
                           featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetFeature !== void 0) {
        componentObserver.componentWillSetFeature(newFeatureComponent, oldFeatureComponent, featureFastener);
      }
    }
  }

  protected onSetFeature(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null,
                         featureFastener: ComponentFastener<this, GeoComponent>): void {
    if (oldFeatureComponent !== null) {
      this.detachFeature(oldFeatureComponent, featureFastener);
    }
    if (newFeatureComponent !== null) {
      this.attachFeature(newFeatureComponent, featureFastener);
      this.initFeature(newFeatureComponent, featureFastener);
    }
  }

  protected didSetFeature(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null,
                          featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetFeature !== void 0) {
        componentObserver.componentDidSetFeature(newFeatureComponent, oldFeatureComponent, featureFastener);
      }
    }
  }

  insertFeatureTrait(featureTrait: GeoTrait, targetTrait: Trait | null = null): void {
    const featureFasteners = this.featureFasteners as ComponentFastener<this, GeoComponent>[];
    let targetComponent: GeoComponent | null = null;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureComponent = featureFasteners[i]!.component;
      if (featureComponent !== null) {
        if (featureComponent.geo.trait === featureTrait) {
          return;
        } else if (featureComponent.geo.trait === targetTrait) {
          targetComponent = featureComponent;
        }
      }
    }
    const featureComponent = this.createFeature(featureTrait);
    if (featureComponent !== null) {
      featureComponent.geo.setTrait(featureTrait);
      this.insertChildComponent(featureComponent, targetComponent);
      if (featureComponent.geo.view === null) {
        const featureView = this.createFeatureView(featureComponent);
        let targetView: GeoView | null = null;
        if (targetComponent !== null) {
          targetView = targetComponent.geo.view;
        }
        const geoView = this.geo.view;
        if (geoView !== null) {
          featureComponent.geo.injectView(geoView, featureView, targetView, null);
        } else {
          featureComponent.geo.setView(featureView, targetView);
        }
      }
    }
  }

  removeFeatureTrait(featureTrait: GeoTrait): void {
    const featureFasteners = this.featureFasteners as ComponentFastener<this, GeoComponent>[];
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      const featureComponent = featureFastener.component;
      if (featureComponent !== null && featureComponent.geo.trait === featureTrait) {
        featureFastener.setComponent(null);
        if (this.isMounted()) {
          featureFastener.unmount();
        }
        featureFasteners.splice(i, 1);
        featureComponent.remove();
        return;
      }
    }
  }

  protected initFeatureTrait(featureTrait: GeoTrait, featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected attachFeatureTrait(featureTrait: GeoTrait, featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected detachFeatureTrait(featureTrait: GeoTrait, featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected willSetFeatureTrait(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null,
                                featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetFeatureTrait !== void 0) {
        componentObserver.componentWillSetFeatureTrait(newFeatureTrait, oldFeatureTrait, featureFastener);
      }
    }
  }

  protected onSetFeatureTrait(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null,
                              featureFastener: ComponentFastener<this, GeoComponent>): void {
    if (oldFeatureTrait !== null) {
      this.detachFeatureTrait(oldFeatureTrait, featureFastener);
    }
    if (newFeatureTrait !== null) {
      this.attachFeatureTrait(newFeatureTrait, featureFastener);
      this.initFeatureTrait(newFeatureTrait, featureFastener);
    }
  }

  protected didSetFeatureTrait(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null,
                               featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetFeatureTrait !== void 0) {
        componentObserver.componentDidSetFeatureTrait(newFeatureTrait, oldFeatureTrait, featureFastener);
      }
    }
  }

  protected createFeatureView(featureComponent: GeoComponent): GeoView | null {
    return featureComponent.geo.createView();
  }

  protected initFeatureView(featureView: GeoView, featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected attachFeatureView(featureView: GeoView, featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected detachFeatureView(featureView: GeoView, featureFastener: ComponentFastener<this, GeoComponent>): void {
    featureView.remove();
  }

  protected willSetFeatureView(newFeatureView: GeoView | null, oldFeatureView: GeoView | null,
                               featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetFeatureView !== void 0) {
        componentObserver.componentWillSetFeatureView(newFeatureView, oldFeatureView, featureFastener);
      }
    }
  }

  protected onSetFeatureView(newFeatureView: GeoView | null, oldFeatureView: GeoView | null,
                             featureFastener: ComponentFastener<this, GeoComponent>): void {
    if (oldFeatureView !== null) {
      this.detachFeatureView(oldFeatureView, featureFastener);
    }
    if (newFeatureView !== null) {
      this.attachFeatureView(newFeatureView, featureFastener);
      this.initFeatureView(newFeatureView, featureFastener);
    }
  }

  protected didSetFeatureView(newFeatureView: GeoView | null, oldFeatureView: GeoView | null,
                              featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetFeatureView !== void 0) {
        componentObserver.componentDidSetFeatureView(newFeatureView, oldFeatureView, featureFastener);
      }
    }
  }

  protected willSetFeatureGeoBounds(newFeatureGeoBounds: GeoBox, oldFeatureGeoBounds: GeoBox,
                                    featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetFeatureGeoBounds !== void 0) {
        componentObserver.componentWillSetFeatureGeoBounds(newFeatureGeoBounds, oldFeatureGeoBounds, featureFastener);
      }
    }
  }

  protected onSetFeatureGeoBounds(newFeatureGeoBounds: GeoBox, oldFeatureGeoBounds: GeoBox,
                                  featureFastener: ComponentFastener<this, GeoComponent>): void {
    // hook
  }

  protected didSetFeatureGeoBounds(newFeatureGeoBounds: GeoBox, oldFeatureGeoBounds: GeoBox,
                                   featureFastener: ComponentFastener<this, GeoComponent>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetFeatureGeoBounds !== void 0) {
        componentObserver.componentDidSetFeatureGeoBounds(newFeatureGeoBounds, oldFeatureGeoBounds, featureFastener);
      }
    }
  }

  /** @hidden */
  static FeatureFastener = ComponentFastener.define<GeoLayerComponent, GeoComponent>({
    type: GeoComponent,
    child: false,
    observe: true,
    willSetComponent(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null): void {
      this.owner.willSetFeature(newFeatureComponent, oldFeatureComponent, this);
    },
    onSetComponent(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null): void {
      this.owner.onSetFeature(newFeatureComponent, oldFeatureComponent, this);
    },
    didSetComponent(newFeatureComponent: GeoComponent | null, oldFeatureComponent: GeoComponent | null): void {
      this.owner.didSetFeature(newFeatureComponent, oldFeatureComponent, this);
    },
    componentWillSetGeoTrait(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null): void {
      this.owner.willSetFeatureTrait(newFeatureTrait, oldFeatureTrait, this);
    },
    componentDidSetGeoTrait(newFeatureTrait: GeoTrait | null, oldFeatureTrait: GeoTrait | null): void {
      this.owner.onSetFeatureTrait(newFeatureTrait, oldFeatureTrait, this);
      this.owner.didSetFeatureTrait(newFeatureTrait, oldFeatureTrait, this);
    },
    componentWillSetGeoView(newFeatureView: GeoView | null, oldFeatureView: GeoView | null): void {
      this.owner.willSetFeatureView(newFeatureView, oldFeatureView, this);
    },
    componentDidSetGeoView(newFeatureView: GeoView | null, oldFeatureView: GeoView | null): void {
      this.owner.onSetFeatureView(newFeatureView, oldFeatureView, this);
      this.owner.didSetFeatureView(newFeatureView, oldFeatureView, this);
    },
    componentWillSetGeoBounds(newFeatureGeoBounds: GeoBox, oldFeatureGeoBounds: GeoBox): void {
      this.owner.willSetFeatureGeoBounds(newFeatureGeoBounds, oldFeatureGeoBounds, this);
    },
    componentDidSetGeoBounds(newFeatureGeoBounds: GeoBox, oldFeatureGeoBounds: GeoBox): void {
      this.owner.onSetFeatureGeoBounds(newFeatureGeoBounds, oldFeatureGeoBounds, this);
      this.owner.didSetFeatureGeoBounds(newFeatureGeoBounds, oldFeatureGeoBounds, this);
    },
  });

  protected createFeatureFastener(featureComponent: GeoComponent): ComponentFastener<this, GeoComponent> {
    return new GeoLayerComponent.FeatureFastener(this, featureComponent.key, "feature");
  }

  /** @hidden */
  declare readonly featureFasteners: ReadonlyArray<ComponentFastener<this, GeoComponent>>;

  protected getFeatureFastener(featureTrait: GeoTrait): ComponentFastener<this, GeoComponent> | null {
    const featureFasteners = this.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      const featureComponent = featureFastener.component;
      if (featureComponent !== null && featureComponent.geo.trait === featureTrait) {
        return featureFastener;
      }
    }
    return null;
  }

  /** @hidden */
  protected mountFeatureFasteners(): void {
    const featureFasteners = this.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      featureFastener.mount();
    }
  }

  /** @hidden */
  protected unmountFeatureFasteners(): void {
    const featureFasteners = this.featureFasteners;
    for (let i = 0, n = featureFasteners.length; i < n; i += 1) {
      const featureFastener = featureFasteners[i]!;
      featureFastener.unmount();
    }
  }

  protected detectFeatureComponent(component: Component): GeoComponent | null {
    return component instanceof GeoComponent ? component : null;
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    const featureComponent = this.detectFeatureComponent(childComponent);
    if (featureComponent !== null) {
      this.insertFeature(featureComponent, targetComponent);
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    const featureComponent = this.detectFeatureComponent(childComponent);
    if (featureComponent !== null) {
      this.removeFeature(featureComponent);
    }
  }

  /** @hidden */
  protected mountComponentFasteners(): void {
    super.mountComponentFasteners();
    this.mountFeatureFasteners();
  }

  /** @hidden */
  protected unmountComponentFasteners(): void {
    this.unmountFeatureFasteners();
    super.unmountComponentFasteners();
  }
}
