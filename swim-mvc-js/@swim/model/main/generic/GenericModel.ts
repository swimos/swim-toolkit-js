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

import {Arrays} from "@swim/util";
import type {ModelContextType, ModelContext} from "../ModelContext";
import {ModelFlags, Model} from "../Model";
import type {ModelObserverType} from "../ModelObserver";
import type {ModelConsumerType, ModelConsumer} from "../ModelConsumer";
import type {Trait} from "../Trait";
import type {ModelService} from "../service/ModelService";
import {ModelScope} from "../scope/ModelScope";
import type {ModelBinding} from "../binding/ModelBinding";
import type {ModelTrait} from "../binding/ModelTrait";
import type {ModelDownlink} from "../downlink/ModelDownlink";

export abstract class GenericModel extends Model {
  constructor() {
    super();
    Object.defineProperty(this, "key", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "parentModel", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelConsumers", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelServices", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelScopes", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelBindings", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelTraits", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "modelDownlinks", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  protected willObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController as ModelObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    const modelObservers = this.modelObservers;
    for (let i = 0, n = modelObservers.length; i < n; i += 1) {
      const modelObserver = modelObservers[i]!;
      result = callback.call(this, modelObserver as ModelObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelObservers = this.modelObservers;
    for (let i = 0, n = modelObservers.length; i < n; i += 1) {
      const modelObserver = modelObservers[i]!;
      result = callback.call(this, modelObserver as ModelObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController as ModelObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  declare readonly key: string | undefined;

  /** @hidden */
  setKey(key: string | undefined): void {
    Object.defineProperty(this, "key", {
      value: key,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly parentModel: Model | null;

  /** @hidden */
  setParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.willSetParentModel(newParentModel, oldParentModel);
    Object.defineProperty(this, "parentModel", {
      value: newParentModel,
      enumerable: true,
      configurable: true,
    });
    this.onSetParentModel(newParentModel, oldParentModel);
    this.didSetParentModel(newParentModel, oldParentModel);
  }

  remove(): void {
    const parentModel = this.parentModel;
    if (parentModel !== null) {
      if ((this.modelFlags & Model.TraversingFlag) === 0) {
        parentModel.removeChildModel(this);
      } else {
        this.setModelFlags(this.modelFlags | Model.RemovingFlag);
      }
    }
  }

  abstract get childModelCount(): number;

  abstract readonly childModels: ReadonlyArray<Model>;

  abstract firstChildModel(): Model | null;

  abstract lastChildModel(): Model | null;

  abstract nextChildModel(targetModel: Model): Model | null;

  abstract previousChildModel(targetModel: Model): Model | null;

  abstract forEachChildModel<T>(callback: (childModel: Model) => T | void): T | undefined;
  abstract forEachChildModel<T, S>(callback: (this: S, childModel: Model) => T | void,
                                   thisArg: S): T | undefined;

  abstract getChildModel(key: string): Model | null;

  abstract setChildModel(key: string, newChildModel: Model | null): Model | null;

  abstract appendChildModel(childModel: Model, key?: string): void;

  abstract prependChildModel(childModel: Model, key?: string): void;

  abstract insertChildModel(childModel: Model, targetModel: Model | null, key?: string): void;

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    super.onInsertChildModel(childModel, targetModel);
    this.insertModelBinding(childModel);
  }

  cascadeInsert(updateFlags?: ModelFlags, modelContext?: ModelContext): void {
    // nop
  }

  abstract removeChildModel(key: string): Model | null;
  abstract removeChildModel(childModel: Model): void;

  protected onRemoveChildModel(childModel: Model): void {
    super.onRemoveChildModel(childModel);
    this.removeModelBinding(childModel);
  }

  abstract removeAll(): void;

  protected onInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    super.onInsertTrait(trait, targetTrait);
    this.insertModelTrait(trait);
  }

  protected onRemoveTrait(trait: Trait): void {
    super.onRemoveTrait(trait);
    this.removeModelTrait(trait);
  }

  cascadeMount(): void {
    if ((this.modelFlags & Model.MountedFlag) === 0) {
      this.setModelFlags(this.modelFlags | (Model.MountedFlag | Model.TraversingFlag));
      try {
        this.willMount();
        this.onMount();
        this.doMountTraits();
        this.doMountChildModels();
        this.didMount();
      } finally {
        this.setModelFlags(this.modelFlags & ~Model.TraversingFlag);
      }
    } else {
      throw new Error("already mounted");
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountServices();
    this.mountScopes();
    this.mountModelBindings();
    this.mountModelTraits();
    this.mountDownlinks();
  }

  /** @hidden */
  protected doMountTraits(): void {
    const traits = this.traits;
    for (let i = 0, n = traits.length; i < n; i += 1) {
      (traits[i]! as any).doMount();
    }
  }

  /** @hidden */
  protected doMountChildModels(): void {
    type self = this;
    function doMountChildModel(this: self, childModel: Model): void {
      childModel.cascadeMount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doMountChildModel, this);
  }

  cascadeUnmount(): void {
    if ((this.modelFlags & Model.MountedFlag) !== 0) {
      this.setModelFlags(this.modelFlags & ~Model.MountedFlag | Model.TraversingFlag);
      try {
        this.willUnmount();
        this.doUnmountChildModels();
        this.doUnmountTraits();
        this.onUnmount();
        this.didUnmount();
      } finally {
        this.setModelFlags(this.modelFlags & ~Model.TraversingFlag);
      }
    } else {
      throw new Error("already unmounted");
    }
  }

  protected onUnmount(): void {
    this.unmountDownlinks();
    this.unmountModelTraits();
    this.unmountModelBindings();
    this.unmountScopes();
    this.unmountServices();
    this.setModelFlags(this.modelFlags & (~Model.ModelFlagMask | Model.RemovingFlag));
  }

  /** @hidden */
  protected doUnmountTraits(): void {
    const traits = this.traits;
    for (let i = 0, n = traits.length; i < n; i += 1) {
      (traits[i]! as any).doUnmount();
    }
  }

  /** @hidden */
  protected doUnmountChildModels(): void {
    type self = this;
    function doUnmountChildModel(this: self, childModel: Model): void {
      childModel.cascadeUnmount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doUnmountChildModel, this);
  }

  cascadePower(): void {
    if ((this.modelFlags & Model.PoweredFlag) === 0) {
      this.setModelFlags(this.modelFlags | (Model.PoweredFlag | Model.TraversingFlag));
      try {
        this.willPower();
        this.onPower();
        this.doPowerTraits();
        this.doPowerChildModels();
        this.didPower();
      } finally {
        this.setModelFlags(this.modelFlags & ~Model.TraversingFlag);
      }
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  protected doPowerTraits(): void {
    const traits = this.traits;
    for (let i = 0, n = traits.length; i < n; i += 1) {
      (traits[i]! as any).doPower();
    }
  }

  /** @hidden */
  protected doPowerChildModels(): void {
    type self = this;
    function doPowerChildModel(this: self, childModel: Model): void {
      childModel.cascadePower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doPowerChildModel, this);
  }

  cascadeUnpower(): void {
    if ((this.modelFlags & Model.PoweredFlag) !== 0) {
      this.setModelFlags(this.modelFlags & ~Model.PoweredFlag | Model.TraversingFlag);
      try {
        this.willUnpower();
        this.doUnpowerChildModels();
        this.doUnpowerTraits();
        this.onUnpower();
        this.didUnpower();
      } finally {
        this.setModelFlags(this.modelFlags & ~Model.TraversingFlag);
      }
    } else {
      throw new Error("already unpowered");
    }
  }

  /** @hidden */
  protected doUnpowerTraits(): void {
    const traits = this.traits;
    for (let i = 0, n = traits.length; i < n; i += 1) {
      (traits[i]! as any).doUnpower();
    }
  }

  /** @hidden */
  protected doUnpowerChildModels(): void {
    type self = this;
    function doUnpowerChildModel(this: self, childModel: Model): void {
      childModel.cascadeUnpower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doUnpowerChildModel, this);
  }

  cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    analyzeFlags &= ~Model.NeedsAnalyze;
    analyzeFlags |= this.modelFlags & Model.UpdateMask;
    analyzeFlags = this.needsAnalyze(analyzeFlags, extendedModelContext);
    if ((analyzeFlags & Model.AnalyzeMask) !== 0) {
      this.doAnalyze(analyzeFlags, extendedModelContext);
    }
  }

  /** @hidden */
  protected doAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = analyzeFlags;
    this.setModelFlags(this.modelFlags & ~Model.NeedsAnalyze | (Model.TraversingFlag | Model.AnalyzingFlag));
    try {
      this.willAnalyze(cascadeFlags, modelContext);
      if (((this.modelFlags | analyzeFlags) & Model.NeedsMutate) !== 0) {
        this.willMutate(modelContext);
        cascadeFlags |= Model.NeedsMutate;
        this.setModelFlags(this.modelFlags & ~Model.NeedsMutate);
      }
      if (((this.modelFlags | analyzeFlags) & Model.NeedsAggregate) !== 0) {
        this.willAggregate(modelContext);
        cascadeFlags |= Model.NeedsAggregate;
        this.setModelFlags(this.modelFlags & ~Model.NeedsAggregate);
      }
      if (((this.modelFlags | analyzeFlags) & Model.NeedsCorrelate) !== 0) {
        this.willCorrelate(modelContext);
        cascadeFlags |= Model.NeedsCorrelate;
        this.setModelFlags(this.modelFlags & ~Model.NeedsCorrelate);
      }

      this.onAnalyze(cascadeFlags, modelContext);
      if ((cascadeFlags & Model.NeedsMutate) !== 0) {
        this.onMutate(modelContext);
      }
      if ((cascadeFlags & Model.NeedsAggregate) !== 0) {
        this.onAggregate(modelContext);
      }
      if ((cascadeFlags & Model.NeedsCorrelate) !== 0) {
        this.onCorrelate(modelContext);
      }

      this.doAnalyzeChildModels(cascadeFlags, modelContext);

      if ((cascadeFlags & Model.NeedsCorrelate) !== 0) {
        this.didCorrelate(modelContext);
      }
      if ((cascadeFlags & Model.NeedsAggregate) !== 0) {
        this.didAggregate(modelContext);
      }
      if ((cascadeFlags & Model.NeedsMutate) !== 0) {
        this.didMutate(modelContext);
      }
      this.didAnalyze(cascadeFlags, modelContext);
    } finally {
      this.setModelFlags(this.modelFlags & ~(Model.TraversingFlag | Model.AnalyzingFlag));
    }
  }

  protected onMutate(modelContext: ModelContextType<this>): void {
    super.onMutate(modelContext);
    this.mutateScopes();
  }

  /** @hidden */
  protected abstract analyzeOwnChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                                           analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                               modelContext: ModelContextType<this>) => void): void;

  protected analyzeTraitChildModels(traits: ReadonlyArray<Trait>, traitIndex: number,
                                    analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                                    analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                        modelContext: ModelContextType<this>) => void): void {
    if (traitIndex < traits.length) {
      (traits[traitIndex] as any).analyzeChildModels(analyzeFlags, modelContext, analyzeChildModel,
                                                     this.analyzeTraitChildModels.bind(this, traits, traitIndex + 1));
    } else {
      this.analyzeOwnChildModels(analyzeFlags, modelContext, analyzeChildModel);
    }
  }

  protected analyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                               analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                   modelContext: ModelContextType<this>) => void): void {
    const traits = this.traits;
    if (traits.length !== 0) {
      this.analyzeTraitChildModels(traits, 0, analyzeFlags, modelContext, analyzeChildModel);
    } else {
      this.analyzeOwnChildModels(analyzeFlags, modelContext, analyzeChildModel);
    }
  }

  cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    refreshFlags &= ~Model.NeedsRefresh;
    refreshFlags |= this.modelFlags & Model.UpdateMask;
    refreshFlags = this.needsRefresh(refreshFlags, extendedModelContext);
    if ((refreshFlags & Model.RefreshMask) !== 0) {
      this.doRefresh(refreshFlags, extendedModelContext);
    }
  }

  /** @hidden */
  protected doRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = refreshFlags;
    this.setModelFlags(this.modelFlags & ~Model.NeedsRefresh | (Model.TraversingFlag | Model.RefreshingFlag));
    try {
      this.willRefresh(cascadeFlags, modelContext);
      if (((this.modelFlags | refreshFlags) & Model.NeedsValidate) !== 0) {
        this.willValidate(modelContext);
        cascadeFlags |= Model.NeedsValidate;
        this.setModelFlags(this.modelFlags & ~Model.NeedsValidate);
      }
      if (((this.modelFlags | refreshFlags) & Model.NeedsReconcile) !== 0) {
        this.willReconcile(modelContext);
        cascadeFlags |= Model.NeedsReconcile;
        this.setModelFlags(this.modelFlags & ~Model.NeedsReconcile);
      }

      this.onRefresh(cascadeFlags, modelContext);
      if ((cascadeFlags & Model.NeedsValidate) !== 0) {
        this.onValidate(modelContext);
      }
      if ((cascadeFlags & Model.NeedsReconcile) !== 0) {
        this.onReconcile(modelContext);
      }

      this.doRefreshChildModels(cascadeFlags, modelContext);

      if ((cascadeFlags & Model.NeedsReconcile) !== 0) {
        this.didReconcile(modelContext);
      }
      if ((cascadeFlags & Model.NeedsValidate) !== 0) {
        this.didValidate(modelContext);
      }
      this.didRefresh(cascadeFlags, modelContext);
    } finally {
      this.setModelFlags(this.modelFlags & ~(Model.TraversingFlag | Model.RefreshingFlag));
    }
  }

  /** @hidden */
  protected abstract refreshOwnChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                                           refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                               modelContext: ModelContextType<this>) => void): void;

  protected refreshTraitChildModels(traits: ReadonlyArray<Trait>, traitIndex: number,
                                    refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                                    refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                        modelContext: ModelContextType<this>) => void): void {
    if (traitIndex < traits.length) {
      (traits[traitIndex] as any).refreshChildModels(refreshFlags, modelContext, refreshChildModel,
                                                     this.refreshTraitChildModels.bind(this, traits, traitIndex + 1));
    } else {
      this.refreshOwnChildModels(refreshFlags, modelContext, refreshChildModel);
    }
  }

  protected refreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                               refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                   modelContext: ModelContextType<this>) => void): void {
    const traits = this.traits;
    if (traits.length !== 0) {
      this.refreshTraitChildModels(traits, 0, refreshFlags, modelContext, refreshChildModel);
    } else {
      this.refreshOwnChildModels(refreshFlags, modelContext, refreshChildModel);
    }
  }

  protected onReconcile(modelContext: ModelContextType<this>): void {
    super.onReconcile(modelContext);
    this.reconcileDownlinks();
  }

  protected startConsuming(): void {
    if ((this.modelFlags & Model.ConsumingFlag) === 0) {
      this.willStartConsuming();
      this.setModelFlags(this.modelFlags | Model.ConsumingFlag);
      this.onStartConsuming();
      this.didStartConsuming();
    }
  }

  protected stopConsuming(): void {
    if ((this.modelFlags & Model.ConsumingFlag) !== 0) {
      this.willStopConsuming();
      this.setModelFlags(this.modelFlags & ~Model.ConsumingFlag);
      this.onStopConsuming();
      this.didStopConsuming();
    }
  }

  declare readonly modelConsumers: ReadonlyArray<ModelConsumer>;

  addModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    const oldModelConsumers = this.modelConsumers;
    const newModelConsumers = Arrays.inserted(modelConsumer, oldModelConsumers);
    if (oldModelConsumers !== newModelConsumers) {
      this.willAddModelConsumer(modelConsumer);
      Object.defineProperty(this, "modelConsumers", {
        value: newModelConsumers,
        enumerable: true,
        configurable: true,
      });
      this.onAddModelConsumer(modelConsumer);
      this.didAddModelConsumer(modelConsumer);
      if (oldModelConsumers.length === 0) {
        this.startConsuming();
      }
    }
  }

  removeModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    const oldModelConsumers = this.modelConsumers;
    const newModelConsumers = Arrays.removed(modelConsumer, oldModelConsumers);
    if (oldModelConsumers !== newModelConsumers) {
      this.willRemoveModelConsumer(modelConsumer);
      Object.defineProperty(this, "modelConsumers", {
        value: newModelConsumers,
        enumerable: true,
        configurable: true,
      });
      this.onRemoveModelConsumer(modelConsumer);
      this.didRemoveModelConsumer(modelConsumer);
      if (newModelConsumers.length === 0) {
        this.stopConsuming();
      }
    }
  }

  /** @hidden */
  declare readonly modelServices: {[serviceName: string]: ModelService<Model, unknown> | undefined} | null;

  hasModelService(serviceName: string): boolean {
    const modelServices = this.modelServices;
    return modelServices !== null && modelServices[serviceName] !== void 0;
  }

  getModelService(serviceName: string): ModelService<this, unknown> | null {
    const modelServices = this.modelServices;
    if (modelServices !== null) {
      const modelService = modelServices[serviceName];
      if (modelService !== void 0) {
        return modelService as ModelService<this, unknown>;
      }
    }
    return null;
  }

  setModelService(serviceName: string, newModelService: ModelService<this, unknown> | null): void {
    let modelServices = this.modelServices;
    if (modelServices === null) {
      modelServices = {};
      Object.defineProperty(this, "modelServices", {
        value: modelServices,
        enumerable: true,
        configurable: true,
      });
    }
    const oldModelService = modelServices[serviceName];
    if (oldModelService !== void 0 && this.isMounted()) {
      oldModelService.unmount();
    }
    if (newModelService !== null) {
      modelServices[serviceName] = newModelService;
      if (this.isMounted()) {
        newModelService.mount();
      }
    } else {
      delete modelServices[serviceName];
    }
  }

  /** @hidden */
  protected mountServices(): void {
    const modelServices = this.modelServices;
    for (const serviceName in modelServices) {
      const modelService = modelServices[serviceName]!;
      modelService.mount();
    }
  }

  /** @hidden */
  protected unmountServices(): void {
    const modelServices = this.modelServices;
    for (const serviceName in modelServices) {
      const modelService = modelServices[serviceName]!;
      modelService.unmount();
    }
  }

  /** @hidden */
  declare readonly modelScopes: {[scopeName: string]: ModelScope<Model, unknown> | undefined} | null;

  hasModelScope(scopeName: string): boolean {
    const modelScopes = this.modelScopes;
    return modelScopes !== null && modelScopes[scopeName] !== void 0;
  }

  getModelScope(scopeName: string): ModelScope<this, unknown> | null {
    const modelScopes = this.modelScopes;
    if (modelScopes !== null) {
      const modelScope = modelScopes[scopeName];
      if (modelScope !== void 0) {
        return modelScope as ModelScope<this, unknown>;
      }
    }
    return null;
  }

  setModelScope(scopeName: string, newModelScope: ModelScope<this, unknown> | null): void {
    let modelScopes = this.modelScopes;
    if (modelScopes === null) {
      modelScopes = {};
      Object.defineProperty(this, "modelScopes", {
        value: modelScopes,
        enumerable: true,
        configurable: true,
      });
    }
    const oldModelScope = modelScopes[scopeName];
    if (oldModelScope !== void 0 && this.isMounted()) {
      oldModelScope.unmount();
    }
    if (newModelScope !== null) {
      modelScopes[scopeName] = newModelScope;
      if (this.isMounted()) {
        newModelScope.mount();
      }
    } else {
      delete modelScopes[scopeName];
    }
  }

  /** @hidden */
  mutateScopes(): void {
    const modelScopes = this.modelScopes;
    for (const scopeName in modelScopes) {
      const modelScope = modelScopes[scopeName]!;
      modelScope.onMutate();
    }
  }

  /** @hidden */
  protected mountScopes(): void {
    const modelScopes = this.modelScopes;
    for (const scopeName in modelScopes) {
      const modelScope = modelScopes[scopeName]!;
      modelScope.mount();
    }
  }

  /** @hidden */
  protected unmountScopes(): void {
    const modelScopes = this.modelScopes;
    for (const scopeName in modelScopes) {
      const modelScope = modelScopes[scopeName]!;
      modelScope.unmount();
    }
  }

  /** @hidden */
  declare readonly modelBindings: {[bindingName: string]: ModelBinding<Model, Model> | undefined} | null;

  hasModelBinding(bindingName: string): boolean {
    const modelBindings = this.modelBindings;
    return modelBindings !== null && modelBindings[bindingName] !== void 0;
  }

  getModelBinding(bindingName: string): ModelBinding<this, Model> | null {
    const modelBindings = this.modelBindings;
    if (modelBindings !== null) {
      const modelBinding = modelBindings[bindingName];
      if (modelBinding !== void 0) {
        return modelBinding as ModelBinding<this, Model>;
      }
    }
    return null;
  }

  setModelBinding(bindingName: string, newModelBinding: ModelBinding<this, any> | null): void {
    let modelBindings = this.modelBindings;
    if (modelBindings === null) {
      modelBindings = {};
      Object.defineProperty(this, "modelBindings", {
        value: modelBindings,
        enumerable: true,
        configurable: true,
      });
    }
    const oldModelBinding = modelBindings[bindingName];
    if (oldModelBinding !== void 0 && this.isMounted()) {
      oldModelBinding.unmount();
    }
    if (newModelBinding !== null) {
      modelBindings[bindingName] = newModelBinding;
      if (this.isMounted()) {
        newModelBinding.mount();
      }
    } else {
      delete modelBindings[bindingName];
    }
  }

  /** @hidden */
  protected mountModelBindings(): void {
    const modelBindings = this.modelBindings;
    for (const bindingName in modelBindings) {
      const modelBinding = modelBindings[bindingName]!;
      modelBinding.mount();
    }
  }

  /** @hidden */
  protected unmountModelBindings(): void {
    const modelBindings = this.modelBindings;
    for (const bindingName in modelBindings) {
      const modelBinding = modelBindings[bindingName]!;
      modelBinding.unmount();
    }
  }

  /** @hidden */
  protected insertModelBinding(childModel: Model): void {
    const bindingName = childModel.key;
    if (bindingName !== void 0) {
      const modelBinding = this.getLazyModelBinding(bindingName);
      if (modelBinding !== null && modelBinding.child === true) {
        modelBinding.doSetModel(childModel);
      }
    }
  }

  /** @hidden */
  protected removeModelBinding(childModel: Model): void {
    const bindingName = childModel.key;
    if (bindingName !== void 0) {
      const modelBinding = this.getModelBinding(bindingName);
      if (modelBinding !== null && modelBinding.child === true) {
        modelBinding.doSetModel(null);
      }
    }
  }

  /** @hidden */
  declare readonly modelTraits: {[bindingName: string]: ModelTrait<Model, Trait> | undefined} | null;

  hasModelTrait(bindingName: string): boolean {
    const modelTraits = this.modelTraits;
    return modelTraits !== null && modelTraits[bindingName] !== void 0;
  }

  getModelTrait(bindingName: string): ModelTrait<this, Trait> | null {
    const modelTraits = this.modelTraits;
    if (modelTraits !== null) {
      const modelTrait = modelTraits[bindingName];
      if (modelTrait !== void 0) {
        return modelTrait as ModelTrait<this, Trait>;
      }
    }
    return null;
  }

  setModelTrait(bindingName: string, newModelTrait: ModelTrait<this, any> | null): void {
    let modelTraits = this.modelTraits;
    if (modelTraits === null) {
      modelTraits = {};
      Object.defineProperty(this, "modelTraits", {
        value: modelTraits,
        enumerable: true,
        configurable: true,
      });
    }
    const oldModelTrait = modelTraits[bindingName];
    if (oldModelTrait !== void 0 && this.isMounted()) {
      oldModelTrait.unmount();
    }
    if (newModelTrait !== null) {
      modelTraits[bindingName] = newModelTrait;
      if (this.isMounted()) {
        newModelTrait.mount();
      }
    } else {
      delete modelTraits[bindingName];
    }
  }

  /** @hidden */
  protected mountModelTraits(): void {
    const modelTraits = this.modelTraits;
    for (const bindingName in modelTraits) {
      const modelTrait = modelTraits[bindingName]!;
      modelTrait.mount();
    }
  }

  /** @hidden */
  protected unmountModelTraits(): void {
    const modelTraits = this.modelTraits;
    for (const bindingName in modelTraits) {
      const modelTrait = modelTraits[bindingName]!;
      modelTrait.unmount();
    }
  }

  /** @hidden */
  protected insertModelTrait(trait: Trait): void {
    const bindingName = trait.key;
    if (bindingName !== void 0) {
      const modelTrait = this.getLazyModelTrait(bindingName);
      if (modelTrait !== null && modelTrait.sibling === true) {
        modelTrait.doSetTrait(trait);
      }
    }
  }

  /** @hidden */
  protected removeModelTrait(trait: Trait): void {
    const bindingName = trait.key;
    if (bindingName !== void 0) {
      const modelTrait = this.getModelTrait(bindingName);
      if (modelTrait !== null && modelTrait.sibling === true) {
        modelTrait.doSetTrait(null);
      }
    }
  }

  /** @hidden */
  declare readonly modelDownlinks: {[downlinkName: string]: ModelDownlink<Model> | undefined} | null;

  hasModelDownlink(downlinkName: string): boolean {
    const modelDownlinks = this.modelDownlinks;
    return modelDownlinks !== null && modelDownlinks[downlinkName] !== void 0;
  }

  getModelDownlink(downlinkName: string): ModelDownlink<this> | null {
    const modelDownlinks = this.modelDownlinks;
    if (modelDownlinks !== null) {
      const modelDownlink = modelDownlinks[downlinkName];
      if (modelDownlink !== void 0) {
        return modelDownlink as ModelDownlink<this>;
      }
    }
    return null;
  }

  setModelDownlink(downlinkName: string, newModelDownlink: ModelDownlink<this> | null): void {
    let modelDownlinks = this.modelDownlinks;
    if (modelDownlinks === null) {
      modelDownlinks = {};
      Object.defineProperty(this, "modelDownlinks", {
        value: modelDownlinks,
        enumerable: true,
        configurable: true,
      });
    }
    const oldModelDownlink = modelDownlinks[downlinkName];
    if (oldModelDownlink !== void 0 && this.isMounted()) {
      oldModelDownlink.unmount();
    }
    if (newModelDownlink !== null) {
      modelDownlinks[downlinkName] = newModelDownlink;
      if (this.isMounted()) {
        newModelDownlink.mount();
      }
    } else {
      delete modelDownlinks[downlinkName];
    }
  }

  /** @hidden */
  protected mountDownlinks(): void {
    const modelDownlinks = this.modelDownlinks;
    for (const downlinkName in modelDownlinks) {
      const modelDownlink = modelDownlinks[downlinkName]!;
      modelDownlink.mount();
    }
  }

  /** @hidden */
  protected unmountDownlinks(): void {
    const modelDownlinks = this.modelDownlinks;
    for (const downlinkName in modelDownlinks) {
      const modelDownlink = modelDownlinks[downlinkName]!;
      modelDownlink.unmount();
    }
  }

  /** @hidden */
  protected reconcileDownlinks(): void {
    const modelDownlinks = this.modelDownlinks;
    for (const downlinkName in modelDownlinks) {
      const modelDownlink = modelDownlinks[downlinkName]!;
      modelDownlink.reconcile();
    }
  }
}

ModelScope({
  type: Object,
  inherit: true,
  updateFlags: Model.NeedsReconcile,
})(Model.prototype, "warpRef");
