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

import {ModelContextType, ModelContext} from "../ModelContext";
import {ModelFlags, Model} from "../Model";
import {ModelObserverType, ModelObserver} from "../ModelObserver";
import {ModelControllerType, ModelController} from "../ModelController";
import {ModelConsumerType, ModelConsumer} from "../ModelConsumer";
import {TraitPrototype, Trait} from "../Trait";
import {ModelService} from "../service/ModelService";
import {ModelScope} from "../scope/ModelScope";
import {ModelBinding} from "../binding/ModelBinding";
import {ModelTrait} from "../binding/ModelTrait";
import {ModelDownlink} from "../downlink/ModelDownlink";

export abstract class GenericModel extends Model {
  /** @hidden */
  _key?: string;
  /** @hidden */
  _parentModel: Model | null;
  /** @hidden */
  _modelController: ModelControllerType<this> | null;
  /** @hidden */
  _modelObservers?: ModelObserverType<this>[];
  /** @hidden */
  _modelFlags: ModelFlags;
  /** @hidden */
  _traits?: Trait[];
  /** @hidden */
  _traitMap?: {[key: string]: Trait | undefined};
  /** @hidden */
  _modelConsumers?: ModelConsumerType<this>[];
  /** @hidden */
  _modelServices?: {[serviceName: string]: ModelService<Model, unknown> | undefined};
  /** @hidden */
  _modelScopes?: {[scopeName: string]: ModelScope<Model, unknown> | undefined};
  /** @hidden */
  _modelBindings?: {[bindingName: string]: ModelBinding<Model, Model> | undefined};
  /** @hidden */
  _modelTraits?: {[bindingName: string]: ModelTrait<Model, Trait> | undefined};
  /** @hidden */
  _modelDownlinks?: {[downlinkName: string]: ModelDownlink<Model> | undefined};

  constructor() {
    super();
    this._parentModel = null;
    this._modelController = null;
    this._modelFlags = 0;
  }

  get modelController(): ModelController | null {
    return this._modelController;
  }

  setModelController(newModelController: ModelControllerType<this> | null): void {
    const oldModelController = this._modelController;
    if (oldModelController !== newModelController) {
      this.willSetModelController(newModelController);
      if (oldModelController !== null) {
        oldModelController.setModel(null);
      }
      this._modelController = newModelController;
      if (newModelController !== null) {
        newModelController.setModel(this);
      }
      this.onSetModelController(newModelController);
      this.didSetModelController(newModelController);
    }
  }

  get modelObservers(): ReadonlyArray<ModelObserver> {
    let modelObservers = this._modelObservers;
    if (modelObservers === void 0) {
      modelObservers = [];
      this._modelObservers = modelObservers;
    }
    return modelObservers;
  }

  addModelObserver(modelObserver: ModelObserverType<this>): void {
    let modelObservers = this._modelObservers;
    let index: number;
    if (modelObservers === void 0) {
      modelObservers = [];
      this._modelObservers = modelObservers;
      index = -1;
    } else {
      index = modelObservers.indexOf(modelObserver);
    }
    if (index < 0) {
      this.willAddModelObserver(modelObserver);
      modelObservers.push(modelObserver);
      this.onAddModelObserver(modelObserver);
      this.didAddModelObserver(modelObserver);
    }
  }

  removeModelObserver(modelObserver: ModelObserverType<this>): void {
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
      const index = modelObservers.indexOf(modelObserver);
      if (index >= 0) {
        this.willRemoveModelObserver(modelObserver);
        modelObservers.splice(index, 1);
        this.onRemoveModelObserver(modelObserver);
        this.didRemoveModelObserver(modelObserver);
      }
    }
  }

  protected willObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelController = this._modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
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
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
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
    }
    const modelController = this._modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  get key(): string | undefined {
    return this._key;
  }

  /** @hidden */
  setKey(key: string | undefined): void {
    if (key !== void 0) {
      this._key = key;
    } else if (this._key !== void 0) {
      this._key = void 0;
    }
  }

  get parentModel(): Model | null {
    return this._parentModel;
  }

  /** @hidden */
  setParentModel(newParentModel: Model | null, oldParentModel: Model | null) {
    this.willSetParentModel(newParentModel, oldParentModel);
    this._parentModel = newParentModel;
    this.onSetParentModel(newParentModel, oldParentModel);
    this.didSetParentModel(newParentModel, oldParentModel);
  }

  remove(): void {
    const parentModel = this._parentModel;
    if (parentModel !== null) {
      if ((this._modelFlags & Model.TraversingFlag) === 0) {
        parentModel.removeChildModel(this);
      } else {
        this._modelFlags |= Model.RemovingFlag;
      }
    }
  }

  abstract get childModelCount(): number;

  abstract get childModels(): ReadonlyArray<Model>;

  abstract forEachChildModel<T, S = unknown>(callback: (this: S, childModel: Model) => T | void,
                                             thisArg?: S): T | undefined;

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

  get traitCount(): number {
    const traits = this._traits;
    return traits !== void 0 ? traits.length : 0;
  }

  get traits(): ReadonlyArray<Trait> {
    let traits = this._traits;
    if (traits === void 0) {
      traits = [];
      this._traits = traits;
    }
    return traits;
  }

  firstTrait(): Trait | null {
    const traits = this._traits;
    return traits !== void 0 && traits.length !== 0 ? traits[0] : null;
  }

  lastTrait(): Trait | null {
    const traits = this._traits;
    return traits !== void 0 && traits.length !== 0 ? traits[traits.length - 1] : null;
  }

  nextTrait(targetTrait: Trait): Trait | null {
    const traits = this._traits;
    const targetIndex = traits !== void 0 ? traits.indexOf(targetTrait) : -1;
    return targetIndex >= 0 && targetIndex + 1 < traits!.length ? traits![targetIndex + 1] : null;
  }

  previousTrait(targetTrait: Trait): Trait | null {
    const traits = this._traits;
    const targetIndex = traits !== void 0 ? traits.indexOf(targetTrait) : -1;
    return targetIndex - 1 >= 0 ? traits![targetIndex - 1] : null;
  }

  forEachTrait<T, S = unknown>(callback: (this: S, trait: Trait) => T | void,
                               thisArg?: S): T | undefined {
    let result: T | undefined;
    const traits = this._traits;
    if (traits !== void 0) {
      let i = 0;
      while (i < traits.length) {
        const trait = traits[i];
        result = callback.call(thisArg, trait);
        if (result !== void 0) {
          break;
        }
        if (traits[i] === trait) {
          i += 1;
        }
      }
    }
    return result;
  }

  getTrait(key: string): Trait | null;
  getTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null;
  getTrait(key: string | TraitPrototype<Trait>): Trait | null;
  getTrait(key: string | TraitPrototype<Trait>): Trait | null {
    if (typeof key === "string") {
      const traitMap = this._traitMap;
      if (traitMap !== void 0) {
        const trait = traitMap[key];
        if (trait !== void 0) {
          return trait;
        }
      }
    } else {
      const traits = this._traits;
      if (traits !== void 0) {
        for (let i = 0, n = traits.length; i < n; i += 1) {
          const trait = traits[i];
          if (trait instanceof key) {
            return trait;
          }
        }
      }
    }
    return null;
  }

  setTrait(key: string, newTrait: Trait | null): Trait | null {
    if (newTrait !== null) {
      newTrait.remove();
    }
    let index = -1;
    let oldTrait: Trait | null = null;
    let targetTrait: Trait | null = null;
    let traits = this._traits;
    if (traits === void 0) {
      traits = [];
      this._traits = traits;
    }
    const traitMap = this._traitMap;
    if (traitMap !== void 0) {
      const trait = traitMap[key];
      if (trait !== void 0) {
        index = traits.indexOf(trait);
        // assert(index >= 0);
        oldTrait = trait;
        targetTrait = traits[index + 1] || null;
        this.willRemoveTrait(trait);
        trait.setModel(null, this);
        this.removeTraitMap(trait);
        traits.splice(index, 1);
        this.onRemoveTrait(trait);
        this.didRemoveTrait(trait);
        trait.setKey(void 0);
      }
    }
    if (newTrait !== null) {
      newTrait.setKey(key);
      this.willInsertTrait(newTrait, targetTrait);
      if (index >= 0) {
        traits.splice(index, 0, newTrait);
      } else {
        traits.push(newTrait);
      }
      this.insertTraitMap(newTrait);
      newTrait.setModel(this, null);
      this.onInsertTrait(newTrait, targetTrait);
      this.didInsertTrait(newTrait, targetTrait);
    }
    return oldTrait;
  }

  /** @hidden */
  protected insertTraitMap(trait: Trait): void {
    const key = trait.key;
    if (key !== void 0) {
      let traitMap = this._traitMap;
      if (traitMap === void 0) {
        traitMap = {};
        this._traitMap = traitMap;
      }
      traitMap[key] = trait;
    }
  }

  /** @hidden */
  protected removeTraitMap(trait: Trait): void {
    const traitMap = this._traitMap;
    if (traitMap !== void 0) {
      const key = trait.key;
      if (key !== void 0) {
        delete traitMap[key];
      }
    }
  }

  appendTrait(trait: Trait, key?: string): void {
    trait.remove();
    if (key !== void 0) {
      this.removeTrait(key);
      trait.setKey(key);
    }
    this.willInsertTrait(trait, null);
    let traits = this._traits;
    if (traits === void 0) {
      traits = [];
      this._traits = traits;
    }
    traits.push(trait);
    this.insertTraitMap(trait);
    trait.setModel(this, null);
    this.onInsertTrait(trait, null);
    this.didInsertTrait(trait, null);
  }

  prependTrait(trait: Trait, key?: string): void {
    trait.remove();
    if (key !== void 0) {
      this.removeTrait(key);
      trait.setKey(key);
    }
    let traits = this._traits;
    if (traits === void 0) {
      traits = [];
      this._traits = traits;
    }
    const targetTrait = traits.length !== 0 ? traits[0] : null;
    this.willInsertTrait(trait, targetTrait);
    traits.unshift(trait);
    this.insertTraitMap(trait);
    trait.setModel(this, null);
    this.onInsertTrait(trait, targetTrait);
    this.didInsertTrait(trait, targetTrait);
  }

  insertTrait(trait: Trait, targetTrait: Trait | null, key?: string): void {
    if (targetTrait !== null && targetTrait.model !== this) {
      throw new TypeError("" + targetTrait);
    }
    trait.remove();
    if (key !== void 0) {
      this.removeTrait(key);
      trait.setKey(key);
    }
    this.willInsertTrait(trait, targetTrait);
    let traits = this._traits;
    if (traits === void 0) {
      traits = [];
      this._traits = traits;
    }
    const index = targetTrait !== null ? traits.indexOf(targetTrait) : -1;
    if (index >= 0) {
      traits.splice(index, 0, trait);
    } else {
      traits.push(trait);
    }
    this.insertTraitMap(trait);
    trait.setModel(this, null);
    this.onInsertTrait(trait, targetTrait);
    this.didInsertTrait(trait, targetTrait);
  }

  protected onInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    super.onInsertTrait(trait, targetTrait);
    this.insertModelTrait(trait);
  }

  removeTrait(key: string): Trait | null;
  removeTrait(trait: Trait): void;
  removeTrait(key: string | Trait): Trait | null | void {
    let trait: Trait | null;
    if (typeof key === "string") {
      trait = this.getTrait(key);
      if (trait === null) {
        return null;
      }
    } else {
      trait = key;
    }
    if (trait.model !== this) {
      throw new Error("not a member trait");
    }
    this.willRemoveTrait(trait);
    trait.setModel(null, this);
    this.removeTraitMap(trait);
    const traits = this._traits;
    const index = traits !== void 0 ? traits.indexOf(trait) : -1;
    if (index >= 0) {
      traits!.splice(index, 1);
    }
    this.onRemoveTrait(trait);
    this.didRemoveTrait(trait);
    trait.setKey(void 0);
    if (typeof key === "string") {
      return trait;
    }
  }

  protected onRemoveTrait(trait: Trait): void {
    super.onRemoveTrait(trait);
    this.removeModelTrait(trait);
  }

  /** @hidden */
  get modelFlags(): ModelFlags {
    return this._modelFlags;
  }

  /** @hidden */
  setModelFlags(modelFlags: ModelFlags): void {
    this._modelFlags = modelFlags;
  }

  cascadeMount(): void {
    if ((this._modelFlags & Model.MountedFlag) === 0) {
      this._modelFlags |= Model.MountedFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willMount();
        this.onMount();
        this.doMountTraits();
        this.doMountChildModels();
        this.didMount();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
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
    this.forEachTrait(function (trait: Trait): void {
      trait.doMount();
    });
  }

  /** @hidden */
  protected doMountChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeMount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeUnmount(): void {
    if ((this._modelFlags & Model.MountedFlag) !== 0) {
      this._modelFlags &= ~Model.MountedFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willUnmount();
        this.doUnmountChildModels();
        this.doUnmountTraits();
        this.onUnmount();
        this.didUnmount();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
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
    this._modelFlags &= ~Model.ModelFlagMask | Model.RemovingFlag;
  }

  /** @hidden */
  protected doUnmountTraits(): void {
    this.forEachTrait(function (trait: Trait): void {
      trait.doUnmount();
    });
  }

  /** @hidden */
  protected doUnmountChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeUnmount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadePower(): void {
    if ((this._modelFlags & Model.PoweredFlag) === 0) {
      this._modelFlags |= Model.PoweredFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willPower();
        this.onPower();
        this.doPowerTraits();
        this.doPowerChildModels();
        this.didPower();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  protected doPowerTraits(): void {
    this.forEachTrait(function (trait: Trait): void {
      trait.doPower();
    });
  }

  /** @hidden */
  protected doPowerChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadePower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeUnpower(): void {
    if ((this._modelFlags & Model.PoweredFlag) !== 0) {
      this._modelFlags &= ~Model.PoweredFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willUnpower();
        this.doUnpowerChildModels();
        this.doUnpowerTraits();
        this.onUnpower();
        this.didUnpower();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already unpowered");
    }
  }

  /** @hidden */
  protected doUnpowerTraits(): void {
    this.forEachTrait(function (trait: Trait): void {
      trait.doUnpower();
    });
  }

  /** @hidden */
  protected doUnpowerChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeUnpower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    analyzeFlags |= this._modelFlags & Model.UpdateMask;
    analyzeFlags = this.needsAnalyze(analyzeFlags, extendedModelContext);
    this.doAnalyze(analyzeFlags, extendedModelContext);
  }

  /** @hidden */
  protected doAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = analyzeFlags;
    this._modelFlags |= Model.TraversingFlag | Model.AnalyzingFlag;
    this._modelFlags &= ~Model.NeedsAnalyze;
    try {
      this.willAnalyze(modelContext);
      if (((this._modelFlags | analyzeFlags) & Model.NeedsMutate) !== 0) {
        this.willMutate(modelContext);
        cascadeFlags |= Model.NeedsMutate;
        this._modelFlags &= ~Model.NeedsMutate;
      }
      if (((this._modelFlags | analyzeFlags) & Model.NeedsAggregate) !== 0) {
        this.willAggregate(modelContext);
        cascadeFlags |= Model.NeedsAggregate;
        this._modelFlags &= ~Model.NeedsAggregate;
      }
      if (((this._modelFlags | analyzeFlags) & Model.NeedsCorrelate) !== 0) {
        this.willCorrelate(modelContext);
        cascadeFlags |= Model.NeedsCorrelate;
        this._modelFlags &= ~Model.NeedsCorrelate;
      }

      this.onAnalyze(modelContext);
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
      this.didAnalyze(modelContext);
    } finally {
      this._modelFlags &= ~(Model.TraversingFlag | Model.AnalyzingFlag);
    }
  }

  protected onMutate(modelContext: ModelContextType<this>): void {
    super.onMutate(modelContext);
    this.mutateScopes();
  }

  protected analyzeTraitChildModels(traits: ReadonlyArray<Trait>, traitIndex: number,
                                    analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                                    analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                        modelContext: ModelContextType<this>) => void): void {
    if (traitIndex < traits.length) {
      const trait = traits[traitIndex];
      (trait as any).analyzeChildModels(analyzeFlags, modelContext, analyzeChildModel,
                                        this.analyzeTraitChildModels.bind(this, traits, traitIndex + 1));
    } else {
      this.analyzeOwnChildModels(analyzeFlags, modelContext, analyzeChildModel);
    }
  }

  protected analyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                               analyzeChildModel: (this: this, childModel: Model, analyzeFlags: ModelFlags,
                                                   modelContext: ModelContextType<this>) => void): void {
    const traits = this._traits;
    if (traits !== void 0 && traits.length !== 0) {
      this.analyzeTraitChildModels(traits, 0, analyzeFlags, modelContext, analyzeChildModel);
    } else {
      this.analyzeOwnChildModels(analyzeFlags, modelContext, analyzeChildModel);
    }
  }

  cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    refreshFlags |= this._modelFlags & Model.UpdateMask;
    refreshFlags = this.needsRefresh(refreshFlags, extendedModelContext);
    this.doRefresh(refreshFlags, extendedModelContext);
  }

  /** @hidden */
  protected doRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = refreshFlags;
    this._modelFlags |= Model.TraversingFlag | Model.RefreshingFlag;
    this._modelFlags &= ~Model.NeedsRefresh;
    try {
      this.willRefresh(modelContext);
      if (((this._modelFlags | refreshFlags) & Model.NeedsValidate) !== 0) {
        this.willValidate(modelContext);
        cascadeFlags |= Model.NeedsValidate;
        this._modelFlags &= ~Model.NeedsValidate;
      }
      if (((this._modelFlags | refreshFlags) & Model.NeedsReconcile) !== 0) {
        this.willReconcile(modelContext);
        cascadeFlags |= Model.NeedsReconcile;
        this._modelFlags &= ~Model.NeedsReconcile;
      }

      this.onRefresh(modelContext);
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
      this.didRefresh(modelContext);
    } finally {
      this._modelFlags &= ~(Model.TraversingFlag | Model.RefreshingFlag);
    }
  }

  protected refreshTraitChildModels(traits: ReadonlyArray<Trait>, traitIndex: number,
                                    refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                                    refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                        modelContext: ModelContextType<this>) => void): void {
    if (traitIndex < traits.length) {
      const trait = traits[traitIndex];
      (trait as any).refreshChildModels(refreshFlags, modelContext, refreshChildModel,
                                        this.refreshTraitChildModels.bind(this, traits, traitIndex + 1));
    } else {
      this.refreshOwnChildModels(refreshFlags, modelContext, refreshChildModel);
    }
  }

  protected refreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                               refreshChildModel: (this: this, childModel: Model, refreshFlags: ModelFlags,
                                                   modelContext: ModelContextType<this>) => void): void {
    const traits = this._traits;
    if (traits !== void 0 && traits.length !== 0) {
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
    if ((this._modelFlags & Model.ConsumingFlag) === 0) {
      this.willStartConsuming();
      this._modelFlags |= Model.ConsumingFlag;
      this.onStartConsuming();
      this.didStartConsuming();
    }
  }

  protected stopConsuming(): void {
    if ((this._modelFlags & Model.ConsumingFlag) !== 0) {
      this.willStopConsuming();
      this._modelFlags &= ~Model.ConsumingFlag;
      this.onStopConsuming();
      this.didStopConsuming();
    }
  }

  get modelConsumers(): ReadonlyArray<ModelConsumer> {
    let modelConsumers = this._modelConsumers;
    if (modelConsumers === void 0) {
      modelConsumers = [];
      this._modelConsumers = modelConsumers;
    }
    return modelConsumers;
  }

  addModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    let modelConsumers = this._modelConsumers;
    let index: number;
    if (modelConsumers === void 0) {
      modelConsumers = [];
      this._modelConsumers = modelConsumers;
      index = -1;
    } else {
      index = modelConsumers.indexOf(modelConsumer);
    }
    if (index < 0) {
      this.willAddModelConsumer(modelConsumer);
      modelConsumers.push(modelConsumer);
      this.onAddModelConsumer(modelConsumer);
      this.didAddModelConsumer(modelConsumer);
      if (modelConsumers.length === 1) {
        this.startConsuming();
      }
    }
  }

  removeModelConsumer(modelConsumer: ModelConsumerType<this>): void {
    const modelConsumers = this._modelConsumers;
    if (modelConsumers !== void 0) {
      const index = modelConsumers.indexOf(modelConsumer);
      if (index >= 0) {
        this.willRemoveModelConsumer(modelConsumer);
        modelConsumers.splice(index, 1);
        this.onRemoveModelConsumer(modelConsumer);
        this.didRemoveModelConsumer(modelConsumer);
        if (modelConsumers.length === 0) {
          this.stopConsuming();
        }
      }
    }
  }

  hasModelService(serviceName: string): boolean {
    const modelServices = this._modelServices;
    return modelServices !== void 0 && modelServices[serviceName] !== void 0;
  }

  getModelService(serviceName: string): ModelService<this, unknown> | null {
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      const modelService = modelServices[serviceName];
      if (modelService !== void 0) {
        return modelService as ModelService<this, unknown>;
      }
    }
    return null;
  }

  setModelService(serviceName: string, newModelService: ModelService<this, unknown> | null): void {
    let modelServices = this._modelServices;
    if (modelServices === void 0) {
      modelServices = {};
      this._modelServices = modelServices;
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
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      for (const serviceName in modelServices) {
        const modelService = modelServices[serviceName]!;
        modelService.mount();
      }
    }
  }

  /** @hidden */
  protected unmountServices(): void {
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      for (const serviceName in modelServices) {
        const modelService = modelServices[serviceName]!;
        modelService.unmount();
      }
    }
  }

  hasModelScope(scopeName: string): boolean {
    const modelScopes = this._modelScopes;
    return modelScopes !== void 0 && modelScopes[scopeName] !== void 0;
  }

  getModelScope(scopeName: string): ModelScope<this, unknown> | null {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      const modelScope = modelScopes[scopeName];
      if (modelScope !== void 0) {
        return modelScope as ModelScope<this, unknown>;
      }
    }
    return null;
  }

  setModelScope(scopeName: string, newModelScope: ModelScope<this, unknown> | null): void {
    let modelScopes = this._modelScopes;
    if (modelScopes === void 0) {
      modelScopes = {};
      this._modelScopes = modelScopes;
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
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      for (const scopeName in modelScopes) {
        const modelScope = modelScopes[scopeName]!;
        modelScope.onMutate();
      }
    }
  }

  /** @hidden */
  protected mountScopes(): void {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      for (const scopeName in modelScopes) {
        const modelScope = modelScopes[scopeName]!;
        modelScope.mount();
      }
    }
  }

  /** @hidden */
  protected unmountScopes(): void {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      for (const scopeName in modelScopes) {
        const modelScope = modelScopes[scopeName]!;
        modelScope.unmount();
      }
    }
  }

  hasModelBinding(bindingName: string): boolean {
    const modelBindings = this._modelBindings;
    return modelBindings !== void 0 && modelBindings[bindingName] !== void 0;
  }

  getModelBinding(bindingName: string): ModelBinding<this, Model> | null {
    const modelBindings = this._modelBindings;
    if (modelBindings !== void 0) {
      const modelBinding = modelBindings[bindingName];
      if (modelBinding !== void 0) {
        return modelBinding as ModelBinding<this, Model>;
      }
    }
    return null;
  }

  setModelBinding(bindingName: string, newModelBinding: ModelBinding<this, any> | null): void {
    let modelBindings = this._modelBindings;
    if (modelBindings === void 0) {
      modelBindings = {};
      this._modelBindings = modelBindings;
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
    const modelBindings = this._modelBindings;
    if (modelBindings !== void 0) {
      for (const bindingName in modelBindings) {
        const modelBinding = modelBindings[bindingName]!;
        modelBinding.mount();
      }
    }
  }

  /** @hidden */
  protected unmountModelBindings(): void {
    const modelBindings = this._modelBindings;
    if (modelBindings !== void 0) {
      for (const bindingName in modelBindings) {
        const modelBinding = modelBindings[bindingName]!;
        modelBinding.unmount();
      }
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

  hasModelTrait(bindingName: string): boolean {
    const modelTraits = this._modelTraits;
    return modelTraits !== void 0 && modelTraits[bindingName] !== void 0;
  }

  getModelTrait(bindingName: string): ModelTrait<this, Trait> | null {
    const modelTraits = this._modelTraits;
    if (modelTraits !== void 0) {
      const modelTrait = modelTraits[bindingName];
      if (modelTrait !== void 0) {
        return modelTrait as ModelTrait<this, Trait>;
      }
    }
    return null;
  }

  setModelTrait(bindingName: string, newModelTrait: ModelTrait<this, any> | null): void {
    let modelTraits = this._modelTraits;
    if (modelTraits === void 0) {
      modelTraits = {};
      this._modelTraits = modelTraits;
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
    const modelTraits = this._modelTraits;
    if (modelTraits !== void 0) {
      for (const bindingName in modelTraits) {
        const modelTrait = modelTraits[bindingName]!;
        modelTrait.mount();
      }
    }
  }

  /** @hidden */
  protected unmountModelTraits(): void {
    const modelTraits = this._modelTraits;
    if (modelTraits !== void 0) {
      for (const bindingName in modelTraits) {
        const modelTrait = modelTraits[bindingName]!;
        modelTrait.unmount();
      }
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

  hasModelDownlink(downlinkName: string): boolean {
    const modelDownlinks = this._modelDownlinks;
    return modelDownlinks !== void 0 && modelDownlinks[downlinkName] !== void 0;
  }

  getModelDownlink(downlinkName: string): ModelDownlink<this> | null {
    const modelDownlinks = this._modelDownlinks;
    if (modelDownlinks !== void 0) {
      const modelDownlink = modelDownlinks[downlinkName];
      if (modelDownlink !== void 0) {
        return modelDownlink as ModelDownlink<this>;
      }
    }
    return null;
  }

  setModelDownlink(downlinkName: string, newModelDownlink: ModelDownlink<this> | null): void {
    let modelDownlinks = this._modelDownlinks;
    if (modelDownlinks === void 0) {
      modelDownlinks = {};
      this._modelDownlinks = modelDownlinks;
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
    const modelDownlinks = this._modelDownlinks;
    if (modelDownlinks !== void 0) {
      for (const downlinkName in modelDownlinks) {
        const modelDownlink = modelDownlinks[downlinkName]!;
        modelDownlink.mount();
      }
    }
  }

  /** @hidden */
  protected unmountDownlinks(): void {
    const modelDownlinks = this._modelDownlinks;
    if (modelDownlinks !== void 0) {
      for (const downlinkName in modelDownlinks) {
        const modelDownlink = modelDownlinks[downlinkName]!;
        modelDownlink.unmount();
      }
    }
  }

  /** @hidden */
  protected reconcileDownlinks(): void {
    const modelDownlinks = this._modelDownlinks;
    if (modelDownlinks !== void 0) {
      for (const downlinkName in modelDownlinks) {
        const modelDownlink = modelDownlinks[downlinkName]!;
        modelDownlink.reconcile();
      }
    }
  }
}
Model.Generic = GenericModel;

ModelScope({
  type: Object,
  inherit: true,
  updateFlags: Model.NeedsReconcile,
})(Model.prototype, "warpRef");
