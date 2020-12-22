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
import {ModelContextType} from "./ModelContext";
import {ModelFlags, ModelPrototype, Model} from "./Model";
import {TraitObserverType, TraitObserver} from "./TraitObserver";
import {TraitConsumerType, TraitConsumer} from "./TraitConsumer";
import {WarpManager} from "./warp/WarpManager";
import {TraitServiceConstructor, TraitService} from "./service/TraitService";
import {TraitScopeConstructor, TraitScope} from "./scope/TraitScope";
import {TraitModelConstructor, TraitModel} from "./binding/TraitModel";
import {TraitBindingConstructor, TraitBinding} from "./binding/TraitBinding";
import {ModelDownlinkContext} from "./downlink/ModelDownlinkContext";
import {ModelDownlink} from "./downlink/ModelDownlink";
import {GenericTrait} from "./generic/GenericTrait";

export type TraitModelType<R extends Trait> = R extends {readonly model: infer M} ? M extends null ? never : M : Model;

export type TraitContextType<R extends Trait> = ModelContextType<TraitModelType<R>>;

export type TraitFlags = number;

export interface TraitPrototype<R extends Trait = Trait> extends Function {
  readonly prototype: R;
}

export interface TraitClass {
  /** @hidden */
  _traitServiceConstructors?: {[serviceName: string]: TraitServiceConstructor<Trait, unknown> | undefined};

  /** @hidden */
  _traitScopeConstructors?: {[scopeName: string]: TraitScopeConstructor<Trait, unknown> | undefined};

  /** @hidden */
  _traitModelConstructors?: {[bindingName: string]: TraitModelConstructor<Trait, Model> | undefined};

  /** @hidden */
  _traitBindingConstructors?: {[bindingName: string]: TraitBindingConstructor<Trait, Trait> | undefined};

  readonly mountFlags: ModelFlags;

  readonly powerFlags: ModelFlags;

  readonly insertChildFlags: ModelFlags;

  readonly removeChildFlags: ModelFlags;

  readonly insertTraitFlags: ModelFlags;

  readonly removeTraitFlags: ModelFlags;

  readonly startConsumingFlags: TraitFlags;

  readonly stopConsumingFlags: TraitFlags;
}

export abstract class Trait implements ModelDownlinkContext {
  abstract get traitObservers(): ReadonlyArray<TraitObserver>;

  abstract addTraitObserver(traitObserver: TraitObserverType<this>): void;

  protected willAddTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  protected onAddTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  protected didAddTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  abstract removeTraitObserver(traitObserver: TraitObserverType<this>): void;

  protected willRemoveTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  protected onRemoveTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  protected didRemoveTraitObserver(traitObserver: TraitObserverType<this>): void {
    // hook
  }

  protected willObserve<T>(callback: (this: this, traitObserver: TraitObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const traitObservers = this.traitObservers;
    let i = 0;
    while (i < traitObservers.length) {
      const traitObserver = traitObservers[i];
      result = callback.call(this, traitObserver);
      if (result !== void 0) {
        return result;
      }
      if (traitObserver === traitObservers[i]) {
        i += 1;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, traitObserver: TraitObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const traitObservers = this.traitObservers;
    let i = 0;
    while (i < traitObservers.length) {
      const traitObserver = traitObservers[i];
      result = callback.call(this, traitObserver);
      if (result !== void 0) {
        return result;
      }
      if (traitObserver === traitObservers[i]) {
        i += 1;
      }
    }
    return result;
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get model(): Model | null;

  /** @hidden */
  abstract setModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void;

  protected willSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillSetModel !== void 0) {
        traitObserver.traitWillSetModel(newModel, oldModel, this);
      }
    });
  }

  protected onSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    if (newModel !== null) {
      if (newModel.isMounted()) {
        this.doMount();
        if (newModel.isPowered()) {
          this.doPower();
        }
      }
    } else if (this.isMounted()) {
      try {
        if (this.isPowered()) {
          this.doUnpower();
        }
      } finally {
        this.doUnmount();
      }
    }
  }

  protected didSetModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidSetModel !== void 0) {
        traitObserver.traitDidSetModel(newModel, oldModel, this);
      }
    });
  }

  abstract remove(): void;

  get parentModel(): Model | null {
    const model = this.model;
    return model !== null ? model.parentModel : null;
  }

  protected willSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillSetParentModel !== void 0) {
        traitObserver.traitWillSetParentModel(newParentModel, oldParentModel, this);
      }
    });
  }

  protected onSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    // hook
  }

  protected didSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidSetParentModel !== void 0) {
        traitObserver.traitDidSetParentModel(newParentModel, oldParentModel, this);
      }
    });
  }

  get childModelCount(): number {
    const model = this.model;
    return model !== null ? model.childModelCount : 0;
  }

  get childModels(): ReadonlyArray<Model> {
    const model = this.model;
    return model !== null ? model.childModels : [];
  }

  firstChildModel(): Model | null {
    const model = this.model;
    return model !== null ? model.firstChildModel() : null;
  }

  lastChildModel(): Model | null {
    const model = this.model;
    return model !== null ? model.lastChildModel() : null;
  }

  nextChildModel(targetModel: Model): Model | null {
    const model = this.model;
    return model !== null ? model.nextChildModel(targetModel) : null;
  }

  previousChildModel(targetModel: Model): Model | null {
    const model = this.model;
    return model !== null ? model.previousChildModel(targetModel) : null;
  }

  forEachChildModel<T, S = unknown>(callback: (this: S, childModel: Model) => T | void,
                                    thisArg?: S): T | undefined {
    const model = this.model;
    return model !== null ? model.forEachChildModel(callback, thisArg) : void 0;
  }

  getChildModel(key: string): Model | null {
    const model = this.model;
    return model !== null ? model.getChildModel(key) : null;
  }

  setChildModel(key: string, newChildModel: Model | null): Model | null {
    const model = this.model;
    if (model !== null) {
      return model.setChildModel(key, newChildModel);
    } else {
      throw new Error("no model");
    }
  }

  appendChildModel(childModel: Model, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.appendChildModel(childModel, key);
    } else {
      throw new Error("no model");
    }
  }

  prependChildModel(childModel: Model, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.prependChildModel(childModel, key);
    } else {
      throw new Error("no model");
    }
  }

  insertChildModel(childModel: Model, targetModel: Model | null, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.insertChildModel(childModel, targetModel, key);
    } else {
      throw new Error("no model");
    }
  }

  get insertChildFlags(): ModelFlags {
    return this.traitClass.insertChildFlags;
  }

  protected willInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillInsertChildModel !== void 0) {
        traitObserver.traitWillInsertChildModel(childModel, targetModel, this);
      }
    });
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidInsertChildModel !== void 0) {
        traitObserver.traitDidInsertChildModel(childModel, targetModel, this);
      }
    });
  }

  removeChildModel(key: string): Model | null;
  removeChildModel(childModel: Model): void;
  removeChildModel(key: string | Model): Model | null | void {
    const model = this.model;
    if (typeof key === "string") {
      return model !== null ? model.removeChildModel(key) : null;
    } else if (model !== null) {
      model.removeChildModel(key);
    }
  }

  get removeChildFlags(): ModelFlags {
    return this.traitClass.removeChildFlags;
  }

  protected willRemoveChildModel(childModel: Model): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillRemoveChildModel !== void 0) {
        traitObserver.traitWillRemoveChildModel(childModel, this);
      }
    });
  }

  protected onRemoveChildModel(childModel: Model): void {
    this.requireUpdate(this.removeChildFlags);
  }

  protected didRemoveChildModel(childModel: Model): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidRemoveChildModel !== void 0) {
        traitObserver.traitDidRemoveChildModel(childModel, this);
      }
    });
  }

  getSuperModel<M extends Model>(modelPrototype: ModelPrototype<M>): M | null {
    const model = this.model;
    return model !== null ? model.getSuperModel(modelPrototype) : null;
  }

  getBaseModel<M extends Model>(modelPrototype: ModelPrototype<M>): M | null {
    const model = this.model;
    return model !== null ? model.getBaseModel(modelPrototype) : null;
  }

  get traitCount(): number {
    const model = this.model;
    return model !== null ? model.traitCount : 0;
  }

  get traits(): ReadonlyArray<Trait> {
    const model = this.model;
    return model !== null ? model.traits : [];
  }

  firstTrait(): Trait | null {
    const model = this.model;
    return model !== null ? model.firstTrait() : null;
  }

  lastTrait(): Trait | null {
    const model = this.model;
    return model !== null ? model.lastTrait() : null;
  }

  nextTrait(targetTrait: Trait): Trait | null {
    const model = this.model;
    return model !== null ? model.nextTrait(targetTrait) : null;
  }

  previousTrait(targetTrait: Trait): Trait | null {
    const model = this.model;
    return model !== null ? model.previousTrait(targetTrait) : null;
  }

  forEachTrait<T, S = unknown>(callback: (this: S, trait: Trait) => T | void,
                               thisArg?: S): T | undefined {
    const model = this.model;
    return model !== null ? model.forEachTrait(callback, thisArg) : void 0;
  }

  getTrait(key: string): Trait | null;
  getTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null;
  getTrait(key: string | TraitPrototype<Trait>): Trait | null;
  getTrait(key: string | TraitPrototype<Trait>): Trait | null {
    const model = this.model;
    return model !== null ? model.getTrait(key) : null;
  }

  setTrait(key: string, newTrait: Trait | null): Trait | null {
    const model = this.model;
    if (model !== null) {
      return model.setTrait(key, newTrait);
    } else {
      throw new Error("no model");
    }
  }

  appendTrait(trait: Trait, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.appendTrait(trait, key);
    } else {
      throw new Error("no model");
    }
  }

  prependTrait(trait: Trait, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.prependTrait(trait, key);
    } else {
      throw new Error("no model");
    }
  }

  insertTrait(trait: Trait, targetTrait: Trait | null, key?: string): void {
    const model = this.model;
    if (model !== null) {
      model.insertTrait(trait, targetTrait, key);
    } else {
      throw new Error("no model");
    }
  }

  get insertTraitFlags(): ModelFlags {
    return this.traitClass.insertTraitFlags;
  }

  protected willInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    this.willObserve(function (modelObserver: TraitObserver): void {
      if (modelObserver.traitWillInsertTrait !== void 0) {
        modelObserver.traitWillInsertTrait(trait, targetTrait, this);
      }
    });
  }

  protected onInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    this.requireUpdate(this.insertTraitFlags);
  }

  protected didInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    this.didObserve(function (modelObserver: TraitObserver): void {
      if (modelObserver.traitDidInsertTrait !== void 0) {
        modelObserver.traitDidInsertTrait(trait, targetTrait, this);
      }
    });
  }

  removeTrait(key: string): Trait | null;
  removeTrait(trait: Trait): void;
  removeTrait(key: string | Trait): Trait | null | void {
    const model = this.model;
    if (typeof key === "string") {
      return model !== null ? model.removeTrait(key) : null;
    } else if (model !== null) {
      model.removeTrait(key);
    }
  }

  get removeTraitFlags(): ModelFlags {
    return this.traitClass.removeTraitFlags;
  }

  protected willRemoveTrait(trait: Trait): void {
    this.willObserve(function (modelObserver: TraitObserver): void {
      if (modelObserver.traitWillRemoveTrait !== void 0) {
        modelObserver.traitWillRemoveTrait(trait, this);
      }
    });
  }

  protected onRemoveTrait(trait: Trait): void {
    this.requireUpdate(this.removeTraitFlags);
  }

  protected didRemoveTrait(trait: Trait): void {
    this.didObserve(function (modelObserver: TraitObserver): void {
      if (modelObserver.traitDidRemoveTrait !== void 0) {
        modelObserver.traitDidRemoveTrait(trait, this);
      }
    });
  }

  getSuperTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null {
    const model = this.model;
    return model !== null ? model.getSuperTrait(traitPrototype) : null;
  }

  getBaseTrait<R extends Trait>(traitPrototype: TraitPrototype<R>): R | null {
    const model = this.model;
    return model !== null ? model.getBaseTrait(traitPrototype) : null;
  }

  readonly warpService: TraitService<this, WarpManager>; // defined by WarpService

  readonly warpRef: TraitScope<this, WarpRef | undefined>; // defined by GenericTrait

  get traitClass(): TraitClass {
    return this.constructor as unknown as TraitClass;
  }

  /** @hidden */
  abstract get traitFlags(): TraitFlags;

  /** @hidden */
  abstract setTraitFlags(traitFlags: TraitFlags): void;

  isMounted(): boolean {
    return (this.traitFlags & Trait.MountedFlag) !== 0;
  }

  get mountFlags(): ModelFlags {
    return this.traitClass.mountFlags;
  }

  /** @hidden */
  abstract doMount(): void;

  protected willMount(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillMount !== void 0) {
        traitObserver.traitWillMount(this);
      }
    });
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidMount !== void 0) {
        traitObserver.traitDidMount(this);
      }
    });
  }

  /** @hidden */
  abstract doUnmount(): void;

  protected willUnmount(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillUnmount !== void 0) {
        traitObserver.traitWillUnmount(this);
      }
    });
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidUnmount !== void 0) {
        traitObserver.traitDidUnmount(this);
      }
    });
  }

  isPowered(): boolean {
    return (this.traitFlags & Trait.PoweredFlag) !== 0;
  }

  get powerFlags(): ModelFlags {
    return this.traitClass.powerFlags;
  }

  /** @hidden */
  abstract doPower(): void;

  protected willPower(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillPower !== void 0) {
        traitObserver.traitWillPower(this);
      }
    });
  }

  protected onPower(): void {
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidPower !== void 0) {
        traitObserver.traitDidPower(this);
      }
    });
  }

  /** @hidden */
  abstract doUnpower(): void;

  protected willUnpower(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillUnpower !== void 0) {
        traitObserver.traitWillUnpower(this);
      }
    });
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidUnpower !== void 0) {
        traitObserver.traitDidUnpower(this);
      }
    });
  }

  requireUpdate(updateFlags: ModelFlags, immediate: boolean = false): void {
    const model = this.model;
    if (model !== null) {
      model.requireUpdate(updateFlags, immediate);
    } else {
      throw new TypeError("no model");
    }
  }

  protected willRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    const model = this.model;
    if (model !== null) {
      model.requestUpdate(targetModel, updateFlags, immediate);
    } else {
      throw new TypeError("no model");
    }
  }

  protected willRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): ModelFlags {
    return updateFlags;
  }

  protected didRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  protected modifyUpdate(targetModel: Model, updateFlags: ModelFlags): ModelFlags {
    return 0;
  }

  isTraversing(): boolean {
    const model = this.model;
    return model !== null && model.isTraversing();
  }

  isUpdating(): boolean {
    const model = this.model;
    return model !== null && model.isUpdating();
  }

  isAnalyzing(): boolean {
    const model = this.model;
    return model !== null && model.isAnalyzing();
  }

  needsAnalyze(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): ModelFlags {
    return analyzeFlags;
  }

  protected willAnalyze(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillAnalyze !== void 0) {
        traitObserver.traitWillAnalyze(modelContext, this);
      }
    });
  }

  protected onAnalyze(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didAnalyze(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidAnalyze !== void 0) {
        traitObserver.traitDidAnalyze(modelContext, this);
      }
    });
  }

  protected willMutate(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillMutate !== void 0) {
        traitObserver.traitWillMutate(modelContext, this);
      }
    });
  }

  protected onMutate(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didMutate(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidMutate !== void 0) {
        traitObserver.traitDidMutate(modelContext, this);
      }
    });
  }

  protected willAggregate(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillAggregate !== void 0) {
        traitObserver.traitWillAggregate(modelContext, this);
      }
    });
  }

  protected onAggregate(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didAggregate(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidAggregate !== void 0) {
        traitObserver.traitDidAggregate(modelContext, this);
      }
    });
  }

  protected willCorrelate(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillCorrelate !== void 0) {
        traitObserver.traitWillCorrelate(modelContext, this);
      }
    });
  }

  protected onCorrelate(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didCorrelate(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidCorrelate !== void 0) {
        traitObserver.traitDidCorrelate(modelContext, this);
      }
    });
  }

  protected willAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillAnalyzeChildModels !== void 0) {
        traitObserver.traitWillAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
  }

  protected onAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidAnalyzeChildModels !== void 0) {
        traitObserver.traitDidAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
  }

  protected analyzeChildModels(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>,
                               analyzeChildModel: (this: TraitModelType<this>, childModel: Model, analyzeFlags: ModelFlags,
                                                   modelContext: TraitContextType<this>) => void,
                               analyzeChildModels: (this: TraitModelType<this>, analyzeFlags: ModelFlags, modelContext: TraitContextType<this>,
                                                    analyzeChildModel: (this: TraitModelType<this>, childModel: Model, analyzeFlags: ModelFlags,
                                                                        modelContext: TraitContextType<this>) => void) => void): void {
    analyzeChildModels.call(this.model, analyzeFlags, modelContext, analyzeChildModel);
  }

  protected willAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected onAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  isRefreshing(): boolean {
    const model = this.model;
    return model !== null && model.isRefreshing();
  }

  needsRefresh(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): ModelFlags {
    return refreshFlags;
  }

  protected willRefresh(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillRefresh !== void 0) {
        traitObserver.traitWillRefresh(modelContext, this);
      }
    });
  }

  protected onRefresh(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didRefresh(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidRefresh !== void 0) {
        traitObserver.traitDidRefresh(modelContext, this);
      }
    });
  }

  protected willValidate(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillValidate !== void 0) {
        traitObserver.traitWillValidate(modelContext, this);
      }
    });
  }

  protected onValidate(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didValidate(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidValidate !== void 0) {
        traitObserver.traitDidValidate(modelContext, this);
      }
    });
  }

  protected willReconcile(modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillReconcile !== void 0) {
        traitObserver.traitWillReconcile(modelContext, this);
      }
    });
  }

  protected onReconcile(modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didReconcile(modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidReconcile !== void 0) {
        traitObserver.traitDidReconcile(modelContext, this);
      }
    });
  }

  protected willRefreshChildModels(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillRefreshChildModels !== void 0) {
        traitObserver.traitWillRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
  }

  protected onRefreshChildModels(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didRefreshChildModels(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidRefreshChildModels !== void 0) {
        traitObserver.traitDidRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
  }

  protected refreshChildModels(refreshFlags: ModelFlags, modelContext: TraitContextType<this>,
                               refreshChildModel: (this: TraitModelType<this>, childModel: Model, refreshFlags: ModelFlags,
                                                   modelContext: TraitContextType<this>) => void,
                               refreshChildModels: (this: TraitModelType<this>, refreshFlags: ModelFlags, modelContext: TraitContextType<this>,
                                                    refreshChildModel: (this: TraitModelType<this>, childModel: Model, refreshFlags: ModelFlags,
                                                                        modelContext: TraitContextType<this>) => void) => void): void {
    refreshChildModels.call(this.model, refreshFlags, modelContext, refreshChildModel);
  }

  protected willRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected onRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  protected didRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  isConsuming(): boolean {
    return (this.traitFlags & Trait.ConsumingFlag) !== 0;
  }

  get startConsumingFlags(): ModelFlags {
    return this.traitClass.startConsumingFlags;
  }

  protected willStartConsuming(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillStartConsuming !== void 0) {
        traitObserver.traitWillStartConsuming(this);
      }
    });
  }

  protected onStartConsuming(): void {
    this.requireUpdate(this.startConsumingFlags);
  }

  protected didStartConsuming(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidStartConsuming !== void 0) {
        traitObserver.traitDidStartConsuming(this);
      }
    });
  }

  get stopConsumingFlags(): ModelFlags {
    return this.traitClass.stopConsumingFlags;
  }

  protected willStopConsuming(): void {
    this.willObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitWillStopConsuming !== void 0) {
        traitObserver.traitWillStopConsuming(this);
      }
    });
  }

  protected onStopConsuming(): void {
    this.requireUpdate(this.stopConsumingFlags);
  }

  protected didStopConsuming(): void {
    this.didObserve(function (traitObserver: TraitObserver): void {
      if (traitObserver.traitDidStopConsuming !== void 0) {
        traitObserver.traitDidStopConsuming(this);
      }
    });
  }

  abstract get traitConsumers(): ReadonlyArray<TraitConsumer>;

  abstract addTraitConsumer(traitConsumer: TraitConsumerType<this>): void;

  protected willAddTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  protected onAddTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  protected didAddTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  abstract removeTraitConsumer(traitConsumer: TraitConsumerType<this>): void;

  protected willRemoveTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  protected onRemoveTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  protected didRemoveTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    // hook
  }

  abstract hasTraitService(serviceName: string): boolean;

  abstract getTraitService(serviceName: string): TraitService<this, unknown> | null;

  abstract setTraitService(serviceName: string, traitService: TraitService<this, unknown> | null): void;

  /** @hidden */
  getLazyTraitService(serviceName: string): TraitService<this, unknown> | null {
    let traitService = this.getTraitService(serviceName) as TraitService<this, unknown> | null;
    if (traitService === null) {
      const traitClass = (this as any).__proto__ as TraitClass;
      const constructor = Trait.getTraitServiceConstructor(serviceName, traitClass);
      if (constructor !== null) {
        traitService = new constructor(this, serviceName) as TraitService<this, unknown>;
        this.setTraitService(serviceName, traitService);
      }
    }
    return traitService;
  }

  abstract hasTraitScope(scopeName: string): boolean;

  abstract getTraitScope(scopeName: string): TraitScope<this, unknown> | null;

  abstract setTraitScope(scopeName: string, traitScope: TraitScope<this, unknown> | null): void;

  /** @hidden */
  getLazyTraitScope(scopeName: string): TraitScope<this, unknown> | null {
    let traitScope = this.getTraitScope(scopeName) as TraitScope<this, unknown> | null;
    if (traitScope === null) {
      const traitClass = (this as any).__proto__ as TraitClass;
      const constructor = Trait.getTraitScopeConstructor(scopeName, traitClass);
      if (constructor !== null) {
        traitScope = new constructor(this, scopeName) as TraitScope<this, unknown>;
        this.setTraitScope(scopeName, traitScope);
      }
    }
    return traitScope;
  }

  abstract hasTraitModel(bindingName: string): boolean;

  abstract getTraitModel(bindingName: string): TraitModel<this, Model> | null;

  abstract setTraitModel(bindingName: string, traitModel: TraitModel<this, Model, unknown> | null): void;

  /** @hidden */
  getLazyTraitModel(bindingName: string): TraitModel<this, Model> | null {
    let traitModel = this.getTraitModel(bindingName) as TraitModel<this, Model> | null;
    if (traitModel === null) {
      const traitClass = (this as any).__proto__ as TraitClass;
      const constructor = Trait.getTraitModelConstructor(bindingName, traitClass);
      if (constructor !== null) {
        traitModel = new constructor(this, bindingName) as TraitModel<this, Model>;
        this.setTraitModel(bindingName, traitModel);
      }
    }
    return traitModel;
  }

  abstract hasTraitBinding(bindingName: string): boolean;

  abstract getTraitBinding(bindingName: string): TraitBinding<this, Trait> | null;

  abstract setTraitBinding(bindingName: string, traitBinding: TraitBinding<this, Trait, unknown> | null): void;

  /** @hidden */
  getLazyTraitBinding(bindingName: string): TraitBinding<this, Trait> | null {
    let traitBinding = this.getTraitBinding(bindingName) as TraitBinding<this, Trait> | null;
    if (traitBinding === null) {
      const traitClass = (this as any).__proto__ as TraitClass;
      const constructor = Trait.getTraitBindingConstructor(bindingName, traitClass);
      if (constructor !== null) {
        traitBinding = new constructor(this, bindingName) as TraitBinding<this, Trait>;
        this.setTraitBinding(bindingName, traitBinding);
      }
    }
    return traitBinding;
  }

  abstract hasModelDownlink(downlinkName: string): boolean;

  abstract getModelDownlink(downlinkName: string): ModelDownlink<this> | null;

  abstract setModelDownlink(downlinkName: string, traitDownlink: ModelDownlink<this> | null): void;

  get modelContext(): TraitContextType<this> | null {
    const model = this.model;
    return model !== null ? model.modelContext as TraitContextType<this> : null;
  }

  /** @hidden */
  static getTraitServiceConstructor(serviceName: string, traitClass: TraitClass | null = null): TraitServiceConstructor<Trait, unknown> | null {
    if (traitClass === null) {
      traitClass = this.prototype as unknown as TraitClass;
    }
    do {
      if (traitClass.hasOwnProperty("_traitServiceConstructors")) {
        const descriptor = traitClass._traitServiceConstructors![serviceName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      traitClass = (traitClass as any).__proto__ as TraitClass | null;
    } while (traitClass !== null);
    return null;
  }

  /** @hidden */
  static decorateTraitService(constructor: TraitServiceConstructor<Trait, unknown>,
                              traitClass: TraitClass, serviceName: string): void {
    if (!traitClass.hasOwnProperty("_traitServiceConstructors")) {
      traitClass._traitServiceConstructors = {};
    }
    traitClass._traitServiceConstructors![serviceName] = constructor;
    Object.defineProperty(traitClass, serviceName, {
      get: function (this: Trait): TraitService<Trait, unknown> {
        let traitService = this.getTraitService(serviceName);
        if (traitService === null) {
          traitService = new constructor(this, serviceName);
          this.setTraitService(serviceName, traitService);
        }
        return traitService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getTraitScopeConstructor(scopeName: string, traitClass: TraitClass | null = null): TraitScopeConstructor<Trait, unknown> | null {
    if (traitClass === null) {
      traitClass = this.prototype as unknown as TraitClass;
    }
    do {
      if (traitClass.hasOwnProperty("_traitScopeConstructors")) {
        const constructor = traitClass._traitScopeConstructors![scopeName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      traitClass = (traitClass as any).__proto__ as TraitClass | null;
    } while (traitClass !== null);
    return null;
  }

  /** @hidden */
  static decorateTraitScope(constructor: TraitScopeConstructor<Trait, unknown>,
                            traitClass: TraitClass, scopeName: string): void {
    if (!traitClass.hasOwnProperty("_traitScopeConstructors")) {
      traitClass._traitScopeConstructors = {};
    }
    traitClass._traitScopeConstructors![scopeName] = constructor;
    Object.defineProperty(traitClass, scopeName, {
      get: function (this: Trait): TraitScope<Trait, unknown> {
        let traitScope = this.getTraitScope(scopeName);
        if (traitScope === null) {
          traitScope = new constructor(this, scopeName);
          this.setTraitScope(scopeName, traitScope);
        }
        return traitScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getTraitModelConstructor(bindingName: string, traitClass: TraitClass | null = null): TraitModelConstructor<Trait, Model> | null {
    if (traitClass === null) {
      traitClass = this.prototype as unknown as TraitClass;
    }
    do {
      if (traitClass.hasOwnProperty("_traitModelConstructors")) {
        const constructor = traitClass._traitModelConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      traitClass = (traitClass as any).__proto__ as TraitClass | null;
    } while (traitClass !== null);
    return null;
  }

  /** @hidden */
  static decorateTraitModel(constructor: TraitModelConstructor<Trait, Model>,
                            traitClass: TraitClass, bindingName: string): void {
    if (!traitClass.hasOwnProperty("_traitModelConstructors")) {
      traitClass._traitModelConstructors = {};
    }
    traitClass._traitModelConstructors![bindingName] = constructor;
    Object.defineProperty(traitClass, bindingName, {
      get: function (this: Trait): TraitModel<Trait, Model> {
        let traitModel = this.getTraitModel(bindingName);
        if (traitModel === null) {
          traitModel = new constructor(this, bindingName);
          this.setTraitModel(bindingName, traitModel);
        }
        return traitModel;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getTraitBindingConstructor(bindingName: string, traitClass: TraitClass | null = null): TraitBindingConstructor<Trait, Trait> | null {
    if (traitClass === null) {
      traitClass = this.prototype as unknown as TraitClass;
    }
    do {
      if (traitClass.hasOwnProperty("_traitBindingConstructors")) {
        const constructor = traitClass._traitBindingConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      traitClass = (traitClass as any).__proto__ as TraitClass | null;
    } while (traitClass !== null);
    return null;
  }

  /** @hidden */
  static decorateTraitBinding(constructor: TraitBindingConstructor<Trait, Trait>,
                              traitClass: TraitClass, bindingName: string): void {
    if (!traitClass.hasOwnProperty("_traitBindingConstructors")) {
      traitClass._traitBindingConstructors = {};
    }
    traitClass._traitBindingConstructors![bindingName] = constructor;
    Object.defineProperty(traitClass, bindingName, {
      get: function (this: Trait): TraitBinding<Trait, Trait> {
        let traitBinding = this.getTraitBinding(bindingName);
        if (traitBinding === null) {
          traitBinding = new constructor(this, bindingName);
          this.setTraitBinding(bindingName, traitBinding);
        }
        return traitBinding;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: TraitFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: TraitFlags = 1 << 1;
  /** @hidden */
  static readonly ConsumingFlag: TraitFlags = 1 << 2;

  static readonly mountFlags: ModelFlags = 0;
  static readonly powerFlags: ModelFlags = 0;
  static readonly insertChildFlags: ModelFlags = 0;
  static readonly removeChildFlags: ModelFlags = 0;
  static readonly insertTraitFlags: ModelFlags = 0;
  static readonly removeTraitFlags: ModelFlags = 0;
  static readonly startConsumingFlags: TraitFlags = 0;
  static readonly stopConsumingFlags: TraitFlags = 0;

  // Forward type declarations
  /** @hidden */
  static Service: typeof TraitService; // defined by TraitService
  /** @hidden */
  static Scope: typeof TraitScope; // defined by TraitScope
  /** @hidden */
  static Binding: typeof TraitBinding; // defined by TraitBinding
  /** @hidden */
  static Generic: typeof GenericTrait; // defined by GenericTrait
}
