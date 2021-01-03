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
  /** @hidden */
  _modelFlags: ModelFlags;
  /** @hidden */
  _modelController?: ModelControllerType<this>;
  /** @hidden */
  _modelObservers?: ReadonlyArray<ModelObserverType<this>>;
  /** @hidden */
  _traits?: Trait[];
  /** @hidden */
  _traitMap?: {[key: string]: Trait | undefined};

  constructor() {
    this._modelFlags = 0;
  }

  initModel(init: ModelInit): void {
    if (init.modelController !== void 0) {
      this.setModelController(init.modelController as ModelControllerType<this>);
    }
  }

  get modelClass(): ModelClass {
    return this.constructor as unknown as ModelClass;
  }

  get modelFlags(): ModelFlags {
    return this._modelFlags;
  }

  setModelFlags(modelFlags: ModelFlags): void {
    this._modelFlags = modelFlags;
  }

  get modelController(): ModelController | null {
    const modelController = this._modelController;
    return modelController !== void 0 ? modelController : null;
  }

  setModelController(newModelController: ModelControllerType<this> | null): void {
    const oldModelController = this._modelController;
    if (oldModelController === void 0 ? newModelController !== null : oldModelController !== newModelController) {
      this.willSetModelController(newModelController);
      if (oldModelController !== void 0) {
        oldModelController.setModel(null);
      }
      if (newModelController !== null) {
        this._modelController = newModelController;
        newModelController.setModel(this);
      } else if (this._modelController !== void 0) {
        this._modelController = void 0;
      }
      this.onSetModelController(newModelController);
      this.didSetModelController(newModelController);
    }
  }

  protected willSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected onSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected didSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  get modelObservers(): ReadonlyArray<ModelObserver> {
    let modelObservers = this._modelObservers;
    if (modelObservers === void 0) {
      modelObservers = [];
      this._modelObservers = modelObservers;
    }
    return modelObservers;
  }

  addModelObserver(newModelObserver: ModelObserverType<this>): void {
    const oldModelObservers = this._modelObservers;
    const n = oldModelObservers !== void 0 ? oldModelObservers.length : 0;
    const newModelObservers = new Array<ModelObserverType<this>>(n + 1);
    for (let i = 0; i < n; i += 1) {
      const modelObserver = oldModelObservers![i];
      if (modelObserver !== newModelObserver) {
        newModelObservers[i] = modelObserver;
      } else {
        return;
      }
    }
    newModelObservers[n] = newModelObserver;
    this.willAddModelObserver(newModelObserver);
    this._modelObservers = newModelObservers;
    this.onAddModelObserver(newModelObserver);
    this.didAddModelObserver(newModelObserver);
  }

  protected willAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  removeModelObserver(oldModelObserver: ModelObserverType<this>): void {
    const oldModelObservers = this._modelObservers;
    const n = oldModelObservers !== void 0 ? oldModelObservers.length : 0;
    if (n !== 0) {
      const newModelObservers = new Array<ModelObserverType<this>>(n - 1);
      let i = 0;
      while (i < n) {
        const modelObserver = oldModelObservers![i];
        if (modelObserver !== oldModelObserver) {
          newModelObservers[i] = modelObserver;
          i += 1;
        } else {
          i += 1;
          while (i < n) {
            newModelObservers[i - 1] = oldModelObservers![i];
            i += 1
          }
          this.willRemoveModelObserver(oldModelObserver);
          this._modelObservers = newModelObservers;
          this.onRemoveModelObserver(oldModelObserver);
          this.didRemoveModelObserver(oldModelObserver);
          return;
        }
      }
    }
  }

  protected willRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentModel(): Model | null;

  /** @hidden */
  abstract setParentModel(newParentModel: Model | null, oldParentModel: Model | null): void;

  protected willSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willSetParentModel(newParentModel, oldParentModel);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillSetParentModel !== void 0) {
      modelController.modelWillSetParentModel(newParentModel, oldParentModel, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillSetParentModel !== void 0) {
        modelObserver.modelWillSetParentModel(newParentModel, oldParentModel, this);
      }
    }
  }

  protected onSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onSetParentModel(newParentModel, oldParentModel);
    }
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
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidSetParentModel !== void 0) {
        modelObserver.modelDidSetParentModel(newParentModel, oldParentModel, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidSetParentModel !== void 0) {
      modelController.modelDidSetParentModel(newParentModel, oldParentModel, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didSetParentModel(newParentModel, oldParentModel);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willInsertChildModel(childModel, targetModel);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillInsertChildModel !== void 0) {
      modelController.modelWillInsertChildModel(childModel, targetModel, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillInsertChildModel !== void 0) {
        modelObserver.modelWillInsertChildModel(childModel, targetModel, this);
      }
    }
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onInsertChildModel(childModel, targetModel);
    }
  }

  protected didInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidInsertChildModel !== void 0) {
        modelObserver.modelDidInsertChildModel(childModel, targetModel, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidInsertChildModel !== void 0) {
      modelController.modelDidInsertChildModel(childModel, targetModel, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didInsertChildModel(childModel, targetModel);
    }
  }

  abstract cascadeInsert(updateFlags?: ModelFlags, modelContext?: ModelContext): void;

  abstract removeChildModel(key: string): Model | null;
  abstract removeChildModel(childModel: Model): void;

  abstract removeAll(): void;

  get removeChildFlags(): ModelFlags {
    return this.modelClass.removeChildFlags;
  }

  protected willRemoveChildModel(childModel: Model): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRemoveChildModel(childModel);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillRemoveChildModel !== void 0) {
      modelController.modelWillRemoveChildModel(childModel, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillRemoveChildModel !== void 0) {
        modelObserver.modelWillRemoveChildModel(childModel, this);
      }
    }
  }

  protected onRemoveChildModel(childModel: Model): void {
    this.requireUpdate(this.removeChildFlags);
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onRemoveChildModel(childModel);
    }
  }

  protected didRemoveChildModel(childModel: Model): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidRemoveChildModel !== void 0) {
        modelObserver.modelDidRemoveChildModel(childModel, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidRemoveChildModel !== void 0) {
      modelController.modelDidRemoveChildModel(childModel, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRemoveChildModel(childModel);
    }
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

  get insertTraitFlags(): ModelFlags {
    return this.modelClass.insertTraitFlags;
  }

  protected willInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willInsertTrait(newTrait, targetTrait);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillInsertTrait !== void 0) {
      modelController.modelWillInsertTrait(newTrait, targetTrait, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillInsertTrait !== void 0) {
        modelObserver.modelWillInsertTrait(newTrait, targetTrait, this);
      }
    }
  }

  protected onInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    this.requireUpdate(this.insertTraitFlags);
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onInsertTrait(newTrait, targetTrait);
    }
  }

  protected didInsertTrait(newTrait: Trait, targetTrait: Trait | null | undefined): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidInsertTrait !== void 0) {
        modelObserver.modelDidInsertTrait(newTrait, targetTrait, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidInsertTrait !== void 0) {
      modelController.modelDidInsertTrait(newTrait, targetTrait, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didInsertTrait(newTrait, targetTrait);
    }
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

  get removeTraitFlags(): ModelFlags {
    return this.modelClass.removeTraitFlags;
  }

  protected willRemoveTrait(oldTrait: Trait): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRemoveTrait(oldTrait);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillRemoveTrait !== void 0) {
      modelController.modelWillRemoveTrait(oldTrait, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillRemoveTrait !== void 0) {
        modelObserver.modelWillRemoveTrait(oldTrait, this);
      }
    }
  }

  protected onRemoveTrait(oldTrait: Trait): void {
    this.requireUpdate(this.removeTraitFlags);
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onRemoveTrait(oldTrait);
    }
  }

  protected didRemoveTrait(oldTrait: Trait): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidRemoveTrait !== void 0) {
        modelObserver.modelDidRemoveTrait(oldTrait, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidRemoveTrait !== void 0) {
      modelController.modelDidRemoveTrait(oldTrait, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRemoveTrait(oldTrait);
    }
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
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillMount !== void 0) {
      modelController.modelWillMount(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillMount !== void 0) {
        modelObserver.modelWillMount(this);
      }
    }
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidMount !== void 0) {
        modelObserver.modelDidMount(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidMount !== void 0) {
      modelController.modelDidMount(this);
    }
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillUnmount !== void 0) {
      modelController.modelWillUnmount(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillUnmount !== void 0) {
        modelObserver.modelWillUnmount(this);
      }
    }
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidUnmount !== void 0) {
        modelObserver.modelDidUnmount(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidUnmount !== void 0) {
      modelController.modelDidUnmount(this);
    }
  }

  isPowered(): boolean {
    return (this.modelFlags & Model.PoweredFlag) !== 0;
  }

  get powerFlags(): ModelFlags {
    return this.modelClass.powerFlags;
  }

  abstract cascadePower(): void;

  protected willPower(): void {
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillPower !== void 0) {
      modelController.modelWillPower(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillPower !== void 0) {
        modelObserver.modelWillPower(this);
      }
    }
  }

  protected onPower(): void {
    this.requestUpdate(this, this.modelFlags & ~Model.StatusMask, false);
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidPower !== void 0) {
        modelObserver.modelDidPower(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidPower !== void 0) {
      modelController.modelDidPower(this);
    }
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillUnpower !== void 0) {
      modelController.modelWillUnpower(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillUnpower !== void 0) {
        modelObserver.modelWillUnpower(this);
      }
    }
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidUnpower !== void 0) {
        modelObserver.modelDidUnpower(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidUnpower !== void 0) {
      modelController.modelDidUnpower(this);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRequireUpdate(updateFlags, immediate);
    }
  }

  protected didRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRequireUpdate(updateFlags, immediate);
    }
  }

  requestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    updateFlags = this.willRequestUpdate(targetModel, updateFlags, immediate);
    this._modelFlags |= updateFlags & (Model.NeedsAnalyze | Model.NeedsRefresh);
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      updateFlags |= (trait as any).willRequestUpdate(targetModel, updateFlags, immediate);
    }
    let additionalFlags = this.modifyUpdate(targetModel, updateFlags);
    additionalFlags &= ~Model.StatusMask;
    if (additionalFlags !== 0) {
      updateFlags |= additionalFlags;
      this.setModelFlags(this.modelFlags | additionalFlags);
    }
    return updateFlags;
  }

  protected didRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRequestUpdate(targetModel, updateFlags, immediate);
    }
  }

  protected modifyUpdate(targetModel: Model, updateFlags: ModelFlags): ModelFlags {
    let additionalFlags = 0;
    if ((updateFlags & Model.AnalyzeMask) !== 0) {
      additionalFlags |= Model.NeedsAnalyze;
    }
    if ((updateFlags & Model.RefreshMask) !== 0) {
      additionalFlags |= Model.NeedsRefresh;
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      additionalFlags |= (trait as any).modifyUpdate(targetModel, updateFlags);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      analyzeFlags = (trait as any).needsAnalyze(analyzeFlags, modelContext);
    }
    return analyzeFlags;
  }

  abstract cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void;

  protected willAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willAnalyze(analyzeFlags, modelContext);
    }
  }

  protected onAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onAnalyze(analyzeFlags, modelContext);
    }
  }

  protected didAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didAnalyze(analyzeFlags, modelContext);
    }
  }

  protected willMutate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willMutate(modelContext);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillMutate !== void 0) {
      modelController.modelWillMutate(modelContext, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillMutate !== void 0) {
        modelObserver.modelWillMutate(modelContext, this);
      }
    }
  }

  protected onMutate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onMutate(modelContext);
    }
  }

  protected didMutate(modelContext: ModelContextType<this>): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidMutate !== void 0) {
        modelObserver.modelDidMutate(modelContext, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidMutate !== void 0) {
      modelController.modelDidMutate(modelContext, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didMutate(modelContext);
    }
  }

  protected willAggregate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willAggregate(modelContext);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillAggregate !== void 0) {
      modelController.modelWillAggregate(modelContext, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillAggregate !== void 0) {
        modelObserver.modelWillAggregate(modelContext, this);
      }
    }
  }

  protected onAggregate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onAggregate(modelContext);
    }
  }

  protected didAggregate(modelContext: ModelContextType<this>): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidAggregate !== void 0) {
        modelObserver.modelDidAggregate(modelContext, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidAggregate !== void 0) {
      modelController.modelDidAggregate(modelContext, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didAggregate(modelContext);
    }
  }

  protected willCorrelate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willCorrelate(modelContext);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillCorrelate !== void 0) {
      modelController.modelWillCorrelate(modelContext, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillCorrelate !== void 0) {
        modelObserver.modelWillCorrelate(modelContext, this);
      }
    }
  }

  protected onCorrelate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onCorrelate(modelContext);
    }
  }

  protected didCorrelate(modelContext: ModelContextType<this>): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidCorrelate !== void 0) {
        modelObserver.modelDidCorrelate(modelContext, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidCorrelate !== void 0) {
      modelController.modelDidCorrelate(modelContext, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didCorrelate(modelContext);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willAnalyzeChildModels(analyzeFlags, modelContext);
    }
  }

  protected onAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onAnalyzeChildModels(analyzeFlags, modelContext);
    }
    this.analyzeChildModels(analyzeFlags, modelContext, this.analyzeChildModel);
  }

  protected didAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didAnalyzeChildModels(analyzeFlags, modelContext);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    }
  }

  protected onAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    }
    childModel.cascadeAnalyze(analyzeFlags, modelContext);
  }

  protected didAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    }
  }

  isRefreshing(): boolean {
    return (this.modelFlags & Model.RefreshingFlag) !== 0;
  }

  needsRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): ModelFlags {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      refreshFlags = (trait as any).needsRefresh(refreshFlags, modelContext);
    }
    return refreshFlags;
  }

  abstract cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void;

  protected willRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRefresh(refreshFlags, modelContext);
    }
  }

  protected onRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onRefresh(refreshFlags, modelContext);
    }
  }

  protected didRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRefresh(refreshFlags, modelContext);
    }
  }

  protected willValidate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willValidate(modelContext);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillValidate !== void 0) {
      modelController.modelWillValidate(modelContext, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillValidate !== void 0) {
        modelObserver.modelWillValidate(modelContext, this);
      }
    }
  }

  protected onValidate(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onValidate(modelContext);
    }
  }

  protected didValidate(modelContext: ModelContextType<this>): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidValidate !== void 0) {
        modelObserver.modelDidValidate(modelContext, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidValidate !== void 0) {
      modelController.modelDidValidate(modelContext, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didValidate(modelContext);
    }
  }

  protected willReconcile(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willReconcile(modelContext);
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillReconcile !== void 0) {
      modelController.modelWillReconcile(modelContext, this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillReconcile !== void 0) {
        modelObserver.modelWillReconcile(modelContext, this);
      }
    }
  }

  protected onReconcile(modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onReconcile(modelContext);
    }
  }

  protected didReconcile(modelContext: ModelContextType<this>): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidReconcile !== void 0) {
        modelObserver.modelDidReconcile(modelContext, this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidReconcile !== void 0) {
      modelController.modelDidReconcile(modelContext, this);
    }
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didReconcile(modelContext);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRefreshChildModels(refreshFlags, modelContext);
    }
  }

  protected onRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onRefreshChildModels(refreshFlags, modelContext);
    }
    this.refreshChildModels(refreshFlags, modelContext, this.refreshChildModel);
  }

  protected didRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRefreshChildModels(refreshFlags, modelContext);
    }
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
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).willRefreshChildModel(childModel, refreshFlags, modelContext);
    }
  }

  protected onRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).onRefreshChildModel(childModel, refreshFlags, modelContext);
    }
    childModel.cascadeRefresh(refreshFlags, modelContext);
  }

  protected didRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    const traits = this._traits;
    for (let i = 0, n = traits !== void 0 ? traits.length : 0; i < n; i += 1) {
      const trait = traits![i];
      (trait as any).didRefreshChildModel(childModel, refreshFlags, modelContext);
    }
  }

  isConsuming(): boolean {
    return (this.modelFlags & Model.ConsumingFlag) !== 0;
  }

  get startConsumingFlags(): ModelFlags {
    return this.modelClass.startConsumingFlags;
  }

  protected willStartConsuming(): void {
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillStartConsuming !== void 0) {
      modelController.modelWillStartConsuming(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillStartConsuming !== void 0) {
        modelObserver.modelWillStartConsuming(this);
      }
    }
  }

  protected onStartConsuming(): void {
    this.requireUpdate(this.startConsumingFlags);
  }

  protected didStartConsuming(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidStartConsuming !== void 0) {
        modelObserver.modelDidStartConsuming(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidStartConsuming !== void 0) {
      modelController.modelDidStartConsuming(this);
    }
  }

  get stopConsumingFlags(): ModelFlags {
    return this.modelClass.stopConsumingFlags;
  }

  protected willStopConsuming(): void {
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelWillStopConsuming !== void 0) {
      modelController.modelWillStopConsuming(this);
    }
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelWillStopConsuming !== void 0) {
        modelObserver.modelWillStopConsuming(this);
      }
    }
  }

  protected onStopConsuming(): void {
    this.requireUpdate(this.stopConsumingFlags);
  }

  protected didStopConsuming(): void {
    const modelObservers = this._modelObservers;
    for (let i = 0, n = modelObservers !== void 0 ? modelObservers.length : 0; i < n; i += 1) {
      const modelObserver = modelObservers![i];
      if (modelObserver.modelDidStopConsuming !== void 0) {
        modelObserver.modelDidStopConsuming(this);
      }
    }
    const modelController = this._modelController;
    if (modelController !== void 0 && modelController.modelDidStopConsuming !== void 0) {
      modelController.modelDidStopConsuming(this);
    }
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
