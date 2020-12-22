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

import {WarpRef} from "@swim/client";
import {ModelContextType, ModelContext} from "./ModelContext";
import {ModelObserverType, ModelObserver} from "./ModelObserver";
import {ModelControllerType, ModelController} from "./ModelController";
import {ModelConsumerType, ModelConsumer} from "./ModelConsumer";
import {TraitPrototype, Trait} from "./Trait";
import {ModelManager} from "./manager/ModelManager";
import {ModelServiceConstructor, ModelService} from "./service/ModelService";
import {RefreshService} from "./service/RefreshService";
import {WarpService} from "./service/WarpService";
import {ModelScopeConstructor, ModelScope} from "./scope/ModelScope";
import {ModelBindingConstructor, ModelBinding} from "./binding/ModelBinding";
import {ModelTraitConstructor, ModelTrait} from "./binding/ModelTrait";
import {ModelDownlinkContext} from "./downlink/ModelDownlinkContext";
import {ModelDownlink} from "./downlink/ModelDownlink";
import {GenericModel} from "./generic/GenericModel";
import {CompoundModel} from "./generic/CompoundModel";

export type ModelFlags = number;

export interface ModelInit {
  key?: string;
  modelController?: ModelController;
}

export interface ModelPrototype<M extends Model = Model> extends Function {
  readonly prototype: M;
}

export interface ModelClass {
  /** @hidden */
  _modelServiceConstructors?: {[serviceName: string]: ModelServiceConstructor<Model, unknown> | undefined};

  /** @hidden */
  _modelScopeConstructors?: {[scopeName: string]: ModelScopeConstructor<Model, unknown> | undefined};

  /** @hidden */
  _modelBindingConstructors?: {[bindingName: string]: ModelBindingConstructor<Model, Model> | undefined};

  /** @hidden */
  _modelTraitConstructors?: {[bindingName: string]: ModelTraitConstructor<Model, Trait> | undefined};

  readonly mountFlags: ModelFlags;

  readonly powerFlags: ModelFlags;

  readonly insertChildFlags: ModelFlags;

  readonly removeChildFlags: ModelFlags;

  readonly insertTraitFlags: ModelFlags;

  readonly removeTraitFlags: ModelFlags;

  readonly startConsumingFlags: ModelFlags;

  readonly stopConsumingFlags: ModelFlags;
}

export abstract class Model implements ModelDownlinkContext {
  abstract get modelController(): ModelController | null;

  abstract setModelController(modelController: ModelControllerType<this> | null): void;

  protected willSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected onSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected didSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  abstract get modelObservers(): ReadonlyArray<ModelObserver>;

  abstract addModelObserver(modelObserver: ModelObserverType<this>): void;

  protected willAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  abstract removeModelObserver(modelObserver: ModelObserverType<this>): void;

  protected willRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected willObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    const modelObservers = this.modelObservers;
    let i = 0;
    while (i < modelObservers.length) {
      const modelObserver = modelObservers[i];
      result = callback.call(this, modelObserver);
      if (result !== void 0) {
        return result;
      }
      if (modelObserver === modelObservers[i]) {
        i += 1;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelObservers = this.modelObservers;
    let i = 0;
    while (i < modelObservers.length) {
      const modelObserver = modelObservers[i];
      result = callback.call(this, modelObserver);
      if (result !== void 0) {
        return result;
      }
      if (modelObserver === modelObservers[i]) {
        i += 1;
      }
    }
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  initModel(init: ModelInit): void {
    if (init.modelController !== void 0) {
      this.setModelController(init.modelController as ModelControllerType<this>);
    }
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentModel(): Model | null;

  /** @hidden */
  abstract setParentModel(newParentModel: Model | null, oldParentModel: Model | null): void;

  protected willSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willSetParentModel(newParentModel, oldParentModel);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillSetParentModel !== void 0) {
        modelObserver.modelWillSetParentModel(newParentModel, oldParentModel, this);
      }
    });
  }

  protected onSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onSetParentModel(newParentModel, oldParentModel);
    });
    if (newParentModel !== null) {
      if (newParentModel.isMounted()) {
        this.cascadeMount();
        if (newParentModel.isPowered()) {
          this.cascadePower();
        }
      }
    } else if (this.isMounted()) {
      try {
        if (this.isPowered()) {
          this.cascadeUnpower();
        }
      } finally {
        this.cascadeUnmount();
      }
    }
  }

  protected didSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidSetParentModel !== void 0) {
        modelObserver.modelDidSetParentModel(newParentModel, oldParentModel, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didSetParentModel(newParentModel, oldParentModel);
    });
  }

  abstract remove(): void;

  abstract get childModelCount(): number;

  abstract get childModels(): ReadonlyArray<Model>;

  abstract firstChildModel(): Model | null;

  abstract lastChildModel(): Model | null;

  abstract nextChildModel(targetModel: Model): Model | null;

  abstract previousChildModel(targetModel: Model): Model | null;

  abstract forEachChildModel<T, S = unknown>(callback: (this: S, childModel: Model) => T | void,
                                             thisArg?: S): T | undefined;

  abstract getChildModel(key: string): Model | null;

  abstract setChildModel(key: string, newChildModel: Model | null): Model | null;

  abstract appendChildModel(childModel: Model, key?: string): void;

  abstract prependChildModel(childModel: Model, key?: string): void;

  abstract insertChildModel(childModel: Model, targetModel: Model | null, key?: string): void;

  get insertChildFlags(): ModelFlags {
    return this.modelClass.insertChildFlags;
  }

  protected willInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willInsertChildModel(childModel, targetModel);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillInsertChildModel !== void 0) {
        modelObserver.modelWillInsertChildModel(childModel, targetModel, this);
      }
    });
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onInsertChildModel(childModel, targetModel);
    });
  }

  protected didInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidInsertChildModel !== void 0) {
        modelObserver.modelDidInsertChildModel(childModel, targetModel, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didInsertChildModel(childModel, targetModel);
    });
  }

  abstract cascadeInsert(updateFlags?: ModelFlags, modelContext?: ModelContext): void;

  abstract removeChildModel(key: string): Model | null;
  abstract removeChildModel(childModel: Model): void;

  abstract removeAll(): void;

  get removeChildFlags(): ModelFlags {
    return this.modelClass.removeChildFlags;
  }

  protected willRemoveChildModel(childModel: Model): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRemoveChildModel(childModel);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRemoveChildModel !== void 0) {
        modelObserver.modelWillRemoveChildModel(childModel, this);
      }
    });
  }

  protected onRemoveChildModel(childModel: Model): void {
    this.requireUpdate(this.removeChildFlags);
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onRemoveChildModel(childModel);
    });
  }

  protected didRemoveChildModel(childModel: Model): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRemoveChildModel !== void 0) {
        modelObserver.modelDidRemoveChildModel(childModel, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRemoveChildModel(childModel);
    });
  }

  getSuperModel<M extends Model>(modelPrototype: ModelPrototype<M>): M | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else if (parentModel instanceof modelPrototype) {
      return parentModel;
    } else {
      return parentModel.getSuperModel(modelPrototype);
    }
  }

  getBaseModel<M extends Model>(modelPrototype: ModelPrototype<M>): M | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else {
      const baseModel = parentModel.getBaseModel(modelPrototype);
      if (baseModel !== null) {
        return baseModel;
      } else {
        return parentModel instanceof modelPrototype ? parentModel : null;
      }
    }
  }

  abstract get traitCount(): number;

  abstract get traits(): ReadonlyArray<Trait>;

  abstract firstTrait(): Trait | null;

  abstract lastTrait(): Trait | null;

  abstract nextTrait(targetTrait: Trait): Trait | null;

  abstract previousTrait(targetTrait: Trait): Trait | null;

  abstract forEachTrait<T, S = unknown>(callback: (this: S, trait: Trait) => T | void,
                                        thisArg?: S): T | undefined;

  abstract getTrait(key: string): Trait | null;
  abstract getTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null;
  abstract getTrait(key: string | TraitPrototype<Trait>): Trait | null;

  abstract setTrait(key: string, newTrait: Trait | null): Trait | null;

  abstract appendTrait(trait: Trait, key?: string): void;

  abstract prependTrait(trait: Trait, key?: string): void;

  abstract insertTrait(trait: Trait, targetTrait: Trait | null, key?: string): void;

  get insertTraitFlags(): ModelFlags {
    return this.modelClass.insertTraitFlags;
  }

  protected willInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willInsertTrait(newTrait, targetTrait);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillInsertTrait !== void 0) {
        modelObserver.modelWillInsertTrait(newTrait, targetTrait, this);
      }
    });
  }

  protected onInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    this.requireUpdate(this.insertTraitFlags);
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onInsertTrait(newTrait, targetTrait);
    });
  }

  protected didInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidInsertTrait !== void 0) {
        modelObserver.modelDidInsertTrait(newTrait, targetTrait, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didInsertTrait(newTrait, targetTrait);
    });
  }

  abstract removeTrait(key: string): Trait | null;
  abstract removeTrait(trait: Trait): void;

  get removeTraitFlags(): ModelFlags {
    return this.modelClass.removeTraitFlags;
  }

  protected willRemoveTrait(oldTrait: Trait): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRemoveTrait(oldTrait);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRemoveTrait !== void 0) {
        modelObserver.modelWillRemoveTrait(oldTrait, this);
      }
    });
  }

  protected onRemoveTrait(oldTrait: Trait): void {
    this.requireUpdate(this.removeTraitFlags);
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onRemoveTrait(oldTrait);
    });
  }

  protected didRemoveTrait(oldTrait: Trait): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRemoveTrait !== void 0) {
        modelObserver.modelDidRemoveTrait(oldTrait, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRemoveTrait(oldTrait);
    });
  }

  getSuperTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else {
      const trait = parentModel.getTrait(traitPrototype);
      if (trait !== null) {
        return trait;
      } else {
        return parentModel.getSuperTrait(traitPrototype);
      }
    }
  }

  getBaseTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else {
      const baseTrait = parentModel.getBaseTrait(traitPrototype);
      if (baseTrait !== null) {
        return baseTrait;
      } else {
        return parentModel.getTrait(traitPrototype);
      }
    }
  }

  readonly refreshService: RefreshService<this>; // defined by RefreshService

  readonly warpService: WarpService<this>; // defined by WarpService

  readonly warpRef: ModelScope<this, WarpRef | undefined>; // defined by GenericModel

  get modelClass(): ModelClass {
    return this.constructor as unknown as ModelClass;
  }

  /** @hidden */
  abstract get modelFlags(): ModelFlags;

  /** @hidden */
  abstract setModelFlags(modelFlags: ModelFlags): void;

  isMounted(): boolean {
    return (this.modelFlags & Model.MountedFlag) !== 0;
  }

  get mountFlags(): ModelFlags {
    return this.modelClass.mountFlags;
  }

  mount(): void {
    if (!this.isMounted() && this.parentModel === null) {
      this.cascadeMount();
      if (!this.isPowered() && document.visibilityState === "visible") {
        this.cascadePower();
      }
      this.cascadeInsert();
    }
  }

  abstract cascadeMount(): void;

  protected willMount(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillMount !== void 0) {
        modelObserver.modelWillMount(this);
      }
    });
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidMount !== void 0) {
        modelObserver.modelDidMount(this);
      }
    });
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillUnmount !== void 0) {
        modelObserver.modelWillUnmount(this);
      }
    });
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidUnmount !== void 0) {
        modelObserver.modelDidUnmount(this);
      }
    });
  }

  isPowered(): boolean {
    return (this.modelFlags & Model.PoweredFlag) !== 0;
  }

  get powerFlags(): ModelFlags {
    return this.modelClass.powerFlags;
  }

  abstract cascadePower(): void;

  protected willPower(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillPower !== void 0) {
        modelObserver.modelWillPower(this);
      }
    });
  }

  protected onPower(): void {
    this.requestUpdate(this, this.modelFlags & ~Model.StatusMask, false);
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidPower !== void 0) {
        modelObserver.modelDidPower(this);
      }
    });
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillUnpower !== void 0) {
        modelObserver.modelWillUnpower(this);
      }
    });
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidUnpower !== void 0) {
        modelObserver.modelDidUnpower(this);
      }
    });
  }

  requireUpdate(updateFlags: ModelFlags, immediate: boolean = false): void {
    updateFlags &= ~Model.StatusMask;
    if (updateFlags !== 0) {
      this.willRequireUpdate(updateFlags, immediate);
      const oldUpdateFlags = this.modelFlags;
      const newUpdateFlags = oldUpdateFlags | updateFlags;
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags;
      if (deltaUpdateFlags !== 0) {
        this.setModelFlags(newUpdateFlags);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRequireUpdate(updateFlags, immediate);
    });
  }

  protected didRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRequireUpdate(updateFlags, immediate);
    });
  }

  requestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    updateFlags = this.willRequestUpdate(targetModel, updateFlags, immediate);
    const parentModel = this.parentModel;
    if (parentModel !== null) {
      parentModel.requestUpdate(targetModel, updateFlags, immediate);
    } else if (this.isMounted()) {
      const refreshManager = this.refreshService.manager;
      if (refreshManager !== void 0) {
        refreshManager.requestUpdate(targetModel, updateFlags, immediate);
      }
    }
    this.didRequestUpdate(targetModel, updateFlags, immediate);
  }

  protected willRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): ModelFlags {
    this.forEachTrait(function (trait: Trait): void {
      updateFlags |= (trait as any).willRequestUpdate(targetModel, updateFlags, immediate);
    });
    let additionalFlags = this.modifyUpdate(targetModel, updateFlags);
    additionalFlags &= ~Model.StatusMask;
    if (additionalFlags !== 0) {
      updateFlags |= additionalFlags;
      this.setModelFlags(this.modelFlags | additionalFlags);
    }
    return updateFlags;
  }

  protected didRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRequestUpdate(targetModel, updateFlags, immediate);
    });
  }

  protected modifyUpdate(targetModel: Model, updateFlags: ModelFlags): ModelFlags {
    let additionalFlags = 0;
    if ((updateFlags & Model.AnalyzeMask) !== 0) {
      additionalFlags |= Model.NeedsAnalyze;
    }
    if ((updateFlags & Model.RefreshMask) !== 0) {
      additionalFlags |= Model.NeedsRefresh;
    }
    this.forEachTrait(function (trait: Trait): void {
      additionalFlags |= (trait as any).modifyUpdate(targetModel, updateFlags);
    });
    return additionalFlags;
  }

  isTraversing(): boolean {
    return (this.modelFlags & Model.TraversingFlag) !== 0;
  }

  isUpdating(): boolean {
    return (this.modelFlags & Model.UpdatingMask) !== 0;
  }

  isAnalyzing(): boolean {
    return (this.modelFlags & Model.AnalyzingFlag) !== 0;
  }

  needsAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): ModelFlags {
    this.forEachTrait(function (trait: Trait): void {
      analyzeFlags = trait.needsAnalyze(analyzeFlags, modelContext);
    });
    return analyzeFlags;
  }

  abstract cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void;

  protected willAnalyze(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willAnalyze(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAnalyze !== void 0) {
        modelObserver.modelWillAnalyze(modelContext, this);
      }
    });
  }

  protected onAnalyze(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onAnalyze(modelContext);
    });
  }

  protected didAnalyze(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAnalyze !== void 0) {
        modelObserver.modelDidAnalyze(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didAnalyze(modelContext);
    });
  }

  protected willMutate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willMutate(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillMutate !== void 0) {
        modelObserver.modelWillMutate(modelContext, this);
      }
    });
  }

  protected onMutate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onMutate(modelContext);
    });
  }

  protected didMutate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidMutate !== void 0) {
        modelObserver.modelDidMutate(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didMutate(modelContext);
    });
  }

  protected willAggregate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willAggregate(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAggregate !== void 0) {
        modelObserver.modelWillAggregate(modelContext, this);
      }
    });
  }

  protected onAggregate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onAggregate(modelContext);
    });
  }

  protected didAggregate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAggregate !== void 0) {
        modelObserver.modelDidAggregate(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didAggregate(modelContext);
    });
  }

  protected willCorrelate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willCorrelate(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillCorrelate !== void 0) {
        modelObserver.modelWillCorrelate(modelContext, this);
      }
    });
  }

  protected onCorrelate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onCorrelate(modelContext);
    });
  }

  protected didCorrelate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidCorrelate !== void 0) {
        modelObserver.modelDidCorrelate(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didCorrelate(modelContext);
    });
  }

  /** @hidden */
  protected doAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    if ((analyzeFlags & Model.AnalyzeMask) !== 0 && this.childModelCount !== 0) {
      this.willAnalyzeChildModels(analyzeFlags, modelContext);
      this.onAnalyzeChildModels(analyzeFlags, modelContext);
      this.didAnalyzeChildModels(analyzeFlags, modelContext);
    }
  }

  protected willAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willAnalyzeChildModels(analyzeFlags, modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAnalyzeChildModels !== void 0) {
        modelObserver.modelWillAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
  }

  protected onAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onAnalyzeChildModels(analyzeFlags, modelContext);
    });
    this.analyzeChildModels(analyzeFlags, modelContext, this.analyzeChildModel);
  }

  protected didAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAnalyzeChildModels !== void 0) {
        modelObserver.modelDidAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didAnalyzeChildModels(analyzeFlags, modelContext);
    });
  }

  /** @hidden */
  protected analyzeOwnChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                                  analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                      modelContext: ModelContextType<this>) => void): void {
    function doAnalyzeChildModel(this: Model, childModel: Model): void {
      analyzeChildModel.call(this, childModel, analyzeFlags, modelContext);
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doAnalyzeChildModel, this);
  }

  protected abstract analyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                                        analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                            modelContext: ModelContextType<this>) => void): void;

  /** @hidden */
  protected analyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    this.onAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    this.didAnalyzeChildModel(childModel, analyzeFlags, modelContext);
  }

  protected willAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    });
  }

  protected onAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    });
    childModel.cascadeAnalyze(analyzeFlags, modelContext);
  }

  protected didAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    });
  }

  isRefreshing(): boolean {
    return (this.modelFlags & Model.RefreshingFlag) !== 0;
  }

  needsRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): ModelFlags {
    this.forEachTrait(function (trait: Trait): void {
      refreshFlags = trait.needsRefresh(refreshFlags, modelContext);
    });
    return refreshFlags;
  }

  abstract cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void;

  protected willRefresh(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRefresh(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRefresh !== void 0) {
        modelObserver.modelWillRefresh(modelContext, this);
      }
    });
  }

  protected onRefresh(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onRefresh(modelContext);
    });
  }

  protected didRefresh(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRefresh !== void 0) {
        modelObserver.modelDidRefresh(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRefresh(modelContext);
    });
  }

  protected willValidate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willValidate(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillValidate !== void 0) {
        modelObserver.modelWillValidate(modelContext, this);
      }
    });
  }

  protected onValidate(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onValidate(modelContext);
    });
  }

  protected didValidate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidValidate !== void 0) {
        modelObserver.modelDidValidate(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didValidate(modelContext);
    });
  }

  protected willReconcile(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willReconcile(modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillReconcile !== void 0) {
        modelObserver.modelWillReconcile(modelContext, this);
      }
    });
  }

  protected onReconcile(modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onReconcile(modelContext);
    });
  }

  protected didReconcile(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidReconcile !== void 0) {
        modelObserver.modelDidReconcile(modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didReconcile(modelContext);
    });
  }

  /** @hidden */
  protected doRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    if ((refreshFlags & Model.RefreshMask) !== 0 && this.childModelCount !== 0) {
      this.willRefreshChildModels(refreshFlags, modelContext);
      this.onRefreshChildModels(refreshFlags, modelContext);
      this.didRefreshChildModels(refreshFlags, modelContext);
    }
  }

  protected willRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRefreshChildModels(refreshFlags, modelContext);
    });
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRefreshChildModels !== void 0) {
        modelObserver.modelWillRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
  }

  protected onRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onRefreshChildModels(refreshFlags, modelContext);
    });
    this.refreshChildModels(refreshFlags, modelContext, this.refreshChildModel);
  }

  protected didRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRefreshChildModels !== void 0) {
        modelObserver.modelDidRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRefreshChildModels(refreshFlags, modelContext);
    });
  }

  /** @hidden */
  protected refreshOwnChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                                  refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                      modelContext: ModelContextType<this>) => void): void {
    function doRefreshChildModel(this: Model, childModel: Model): void {
      refreshChildModel.call(this, childModel, refreshFlags, modelContext);
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }
    this.forEachChildModel(doRefreshChildModel, this);
  }

  protected abstract refreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                                        refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                            modelContext: ModelContextType<this>) => void): void;

  /** @hidden */
  protected refreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willRefreshChildModel(childModel, refreshFlags, modelContext);
    this.onRefreshChildModel(childModel, refreshFlags, modelContext);
    this.didRefreshChildModel(childModel, refreshFlags, modelContext);
  }

  protected willRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).willRefreshChildModel(childModel, refreshFlags, modelContext);
    });
  }

  protected onRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).onRefreshChildModel(childModel, refreshFlags, modelContext);
    });
    childModel.cascadeRefresh(refreshFlags, modelContext);
  }

  protected didRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.forEachTrait(function (trait: Trait): void {
      (trait as any).didRefreshChildModel(childModel, refreshFlags, modelContext);
    });
  }

  isConsuming(): boolean {
    return (this.modelFlags & Model.ConsumingFlag) !== 0;
  }

  get startConsumingFlags(): ModelFlags {
    return this.modelClass.startConsumingFlags;
  }

  protected willStartConsuming(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillStartConsuming !== void 0) {
        modelObserver.modelWillStartConsuming(this);
      }
    });
  }

  protected onStartConsuming(): void {
    this.requireUpdate(this.startConsumingFlags);
  }

  protected didStartConsuming(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidStartConsuming !== void 0) {
        modelObserver.modelDidStartConsuming(this);
      }
    });
  }

  get stopConsumingFlags(): ModelFlags {
    return this.modelClass.stopConsumingFlags;
  }

  protected willStopConsuming(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillStopConsuming !== void 0) {
        modelObserver.modelWillStopConsuming(this);
      }
    });
  }

  protected onStopConsuming(): void {
    this.requireUpdate(this.stopConsumingFlags);
  }

  protected didStopConsuming(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidStopConsuming !== void 0) {
        modelObserver.modelDidStopConsuming(this);
      }
    });
  }

  abstract get modelConsumers(): ReadonlyArray<ModelConsumer>;

  abstract addModelConsumer(modelConsumer: ModelConsumerType<this>): void;

  protected willAddModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  protected onAddModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  protected didAddModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  abstract removeModelConsumer(modelConsumer: ModelConsumerType<this>): void;

  protected willRemoveModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  protected onRemoveModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  protected didRemoveModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    // hook
  }

  abstract hasModelService(serviceName: string): boolean;

  abstract getModelService(serviceName: string): ModelService<this, unknown> | null;

  abstract setModelService(serviceName: string, modelService: ModelService<this, unknown> | null): void;

  /** @hidden */
  getLazyModelService(serviceName: string): ModelService<this, unknown> | null {
    let modelService = this.getModelService(serviceName) as ModelService<this, unknown> | null;
    if (modelService === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const constructor = Model.getModelServiceConstructor(serviceName, modelClass);
      if (constructor !== null) {
        modelService = new constructor(this, serviceName) as ModelService<this, unknown>;
        this.setModelService(serviceName, modelService);
      }
    }
    return modelService;
  }

  abstract hasModelScope(scopeName: string): boolean;

  abstract getModelScope(scopeName: string): ModelScope<this, unknown> | null;

  abstract setModelScope(scopeName: string, modelScope: ModelScope<this, unknown> | null): void;

  /** @hidden */
  getLazyModelScope(scopeName: string): ModelScope<this, unknown> | null {
    let modelScope = this.getModelScope(scopeName) as ModelScope<this, unknown> | null;
    if (modelScope === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const constructor = Model.getModelScopeConstructor(scopeName, modelClass);
      if (constructor !== null) {
        modelScope = new constructor(this, scopeName) as ModelScope<this, unknown>;
        this.setModelScope(scopeName, modelScope);
      }
    }
    return modelScope;
  }

  abstract hasModelBinding(bindingName: string): boolean;

  abstract getModelBinding(bindingName: string): ModelBinding<this, Model> | null;

  abstract setModelBinding(bindingName: string, modelBinding: ModelBinding<this, Model, unknown> | null): void;

  /** @hidden */
  getLazyModelBinding(bindingName: string): ModelBinding<this, Model> | null {
    let modelBinding = this.getModelBinding(bindingName) as ModelBinding<this, Model> | null;
    if (modelBinding === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const constructor = Model.getModelBindingConstructor(bindingName, modelClass);
      if (constructor !== null) {
        modelBinding = new constructor(this, bindingName) as ModelBinding<this, Model>;
        this.setModelBinding(bindingName, modelBinding);
      }
    }
    return modelBinding;
  }

  abstract hasModelTrait(bindingName: string): boolean;

  abstract getModelTrait(bindingName: string): ModelTrait<this, Trait> | null;

  abstract setModelTrait(bindingName: string, modelTrait: ModelTrait<this, Trait, unknown> | null): void;

  /** @hidden */
  getLazyModelTrait(bindingName: string): ModelTrait<this, Trait> | null {
    let modelTrait = this.getModelTrait(bindingName) as ModelTrait<this, Trait> | null;
    if (modelTrait === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const constructor = Model.getModelTraitConstructor(bindingName, modelClass);
      if (constructor !== null) {
        modelTrait = new constructor(this, bindingName) as ModelTrait<this, Trait>;
        this.setModelTrait(bindingName, modelTrait);
      }
    }
    return modelTrait;
  }

  abstract hasModelDownlink(downlinkName: string): boolean;

  abstract getModelDownlink(downlinkName: string): ModelDownlink<this> | null;

  abstract setModelDownlink(downlinkName: string, modelDownlink: ModelDownlink<this> | null): void;

  /** @hidden */
  extendModelContext(modelContext: ModelContext): ModelContextType<this> {
    return modelContext as ModelContextType<this>;
  }

  get superModelContext(): ModelContext {
    let superModelContext: ModelContext;
    const parentModel = this.parentModel;
    if (parentModel !== null) {
      superModelContext = parentModel.modelContext;
    } else if (this.isMounted()) {
      const refreshManager = this.refreshService.manager;
      if (refreshManager !== void 0) {
        superModelContext = refreshManager.modelContext;
      } else {
        superModelContext = ModelContext.default();
      }
    } else {
      superModelContext = ModelContext.default();
    }
    return superModelContext;
  }

  get modelContext(): ModelContext {
    return this.extendModelContext(this.superModelContext);
  }

  /** @hidden */
  static getModelServiceConstructor(serviceName: string, modelClass: ModelClass | null = null): ModelServiceConstructor<Model, unknown> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelServiceConstructors")) {
        const descriptor = modelClass._modelServiceConstructors![serviceName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelService(constructor: ModelServiceConstructor<Model, unknown>,
                              modelClass: ModelClass, serviceName: string): void {
    if (!modelClass.hasOwnProperty("_modelServiceConstructors")) {
      modelClass._modelServiceConstructors = {};
    }
    modelClass._modelServiceConstructors![serviceName] = constructor;
    Object.defineProperty(modelClass, serviceName, {
      get: function (this: Model): ModelService<Model, unknown> {
        let modelService = this.getModelService(serviceName);
        if (modelService === null) {
          modelService = new constructor(this, serviceName);
          this.setModelService(serviceName, modelService);
        }
        return modelService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getModelScopeConstructor(scopeName: string, modelClass: ModelClass | null = null): ModelScopeConstructor<Model, unknown> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelScopeConstructors")) {
        const constructor = modelClass._modelScopeConstructors![scopeName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelScope(constructor: ModelScopeConstructor<Model, unknown>,
                            modelClass: ModelClass, scopeName: string): void {
    if (!modelClass.hasOwnProperty("_modelScopeConstructors")) {
      modelClass._modelScopeConstructors = {};
    }
    modelClass._modelScopeConstructors![scopeName] = constructor;
    Object.defineProperty(modelClass, scopeName, {
      get: function (this: Model): ModelScope<Model, unknown> {
        let modelScope = this.getModelScope(scopeName);
        if (modelScope === null) {
          modelScope = new constructor(this, scopeName);
          this.setModelScope(scopeName, modelScope);
        }
        return modelScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getModelBindingConstructor(bindingName: string, modelClass: ModelClass | null = null): ModelBindingConstructor<Model, Model> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelBindingConstructors")) {
        const constructor = modelClass._modelBindingConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelBinding(constructor: ModelBindingConstructor<Model, Model>,
                              modelClass: ModelClass, bindingName: string): void {
    if (!modelClass.hasOwnProperty("_modelBindingConstructors")) {
      modelClass._modelBindingConstructors = {};
    }
    modelClass._modelBindingConstructors![bindingName] = constructor;
    Object.defineProperty(modelClass, bindingName, {
      get: function (this: Model): ModelBinding<Model, Model> {
        let modelBinding = this.getModelBinding(bindingName);
        if (modelBinding === null) {
          modelBinding = new constructor(this, bindingName);
          this.setModelBinding(bindingName, modelBinding);
        }
        return modelBinding;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getModelTraitConstructor(bindingName: string, modelClass: ModelClass | null = null): ModelTraitConstructor<Model, Trait> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelTraitConstructors")) {
        const constructor = modelClass._modelTraitConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelTrait(constructor: ModelTraitConstructor<Model, Trait>,
                            modelClass: ModelClass, bindingName: string): void {
    if (!modelClass.hasOwnProperty("_modelTraitConstructors")) {
      modelClass._modelTraitConstructors = {};
    }
    modelClass._modelTraitConstructors![bindingName] = constructor;
    Object.defineProperty(modelClass, bindingName, {
      get: function (this: Model): ModelTrait<Model, Trait> {
        let modelTrait = this.getModelTrait(bindingName);
        if (modelTrait === null) {
          modelTrait = new constructor(this, bindingName);
          this.setModelTrait(bindingName, modelTrait);
        }
        return modelTrait;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: ModelFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: ModelFlags = 1 << 1;
  /** @hidden */
  static readonly ConsumingFlag: ModelFlags = 1 << 2;
  /** @hidden */
  static readonly TraversingFlag: ModelFlags = 1 << 3;
  /** @hidden */
  static readonly AnalyzingFlag: ModelFlags = 1 << 4;
  /** @hidden */
  static readonly RefreshingFlag: ModelFlags = 1 << 5;
  /** @hidden */
  static readonly RemovingFlag: ModelFlags = 1 << 6;
  /** @hidden */
  static readonly ImmediateFlag: ModelFlags = 1 << 7;
  /** @hidden */
  static readonly UpdatingMask: ModelFlags = Model.AnalyzingFlag
                                           | Model.RefreshingFlag;
  /** @hidden */
  static readonly StatusMask: ModelFlags = Model.MountedFlag
                                         | Model.PoweredFlag
                                         | Model.ConsumingFlag
                                         | Model.TraversingFlag
                                         | Model.AnalyzingFlag
                                         | Model.RefreshingFlag
                                         | Model.RemovingFlag
                                         | Model.ImmediateFlag;

  static readonly NeedsAnalyze: ModelFlags = 1 << 8;
  static readonly NeedsMutate: ModelFlags = 1 << 9;
  static readonly NeedsAggregate: ModelFlags = 1 << 10;
  static readonly NeedsCorrelate: ModelFlags = 1 << 11;
  /** @hidden */
  static readonly AnalyzeMask: ModelFlags = Model.NeedsAnalyze
                                          | Model.NeedsMutate
                                          | Model.NeedsAggregate
                                          | Model.NeedsCorrelate;

  static readonly NeedsRefresh: ModelFlags = 1 << 12;
  static readonly NeedsValidate: ModelFlags = 1 << 13;
  static readonly NeedsReconcile: ModelFlags = 1 << 14;
  /** @hidden */
  static readonly RefreshMask: ModelFlags = Model.NeedsRefresh
                                          | Model.NeedsValidate
                                          | Model.NeedsReconcile;

  /** @hidden */
  static readonly UpdateMask: ModelFlags = Model.AnalyzeMask
                                         | Model.RefreshMask;

  /** @hidden */
  static readonly ModelFlagShift: ModelFlags = 24;
  /** @hidden */
  static readonly ModelFlagMask: ModelFlags = (1 << Model.ModelFlagShift) - 1;

  static readonly mountFlags: ModelFlags = 0;
  static readonly powerFlags: ModelFlags = 0;
  static readonly insertChildFlags: ModelFlags = 0;
  static readonly removeChildFlags: ModelFlags = 0;
  static readonly insertTraitFlags: ModelFlags = 0;
  static readonly removeTraitFlags: ModelFlags = 0;
  static readonly startConsumingFlags: ModelFlags = 0;
  static readonly stopConsumingFlags: ModelFlags = 0;

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ModelManager; // defined by ModelManager
  /** @hidden */
  static Service: typeof ModelService; // defined by ModelService
  /** @hidden */
  static Scope: typeof ModelScope; // defined by ModelScope
  /** @hidden */
  static Binding: typeof ModelBinding; // defined by ModelBinding
  /** @hidden */
  static Generic: typeof GenericModel; // defined by GenericModel
  /** @hidden */
  static Compound: typeof CompoundModel; // defined by CompoundModel
}
