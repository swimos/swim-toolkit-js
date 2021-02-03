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
import {Model} from "../Model";
import {TraitModelType, TraitContextType, Trait} from "../Trait";
import type {TraitObserverType} from "../TraitObserver";
import type {TraitConsumerType, TraitConsumer} from "../TraitConsumer";
import type {TraitService} from "../service/TraitService";
import {TraitScope} from "../scope/TraitScope";
import type {TraitModel} from "../binding/TraitModel";
import type {TraitBinding} from "../binding/TraitBinding";
import type {ModelDownlink} from "../downlink/ModelDownlink";

export class GenericTrait extends Trait {
  constructor() {
    super();
    Object.defineProperty(this, "model", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "key", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitConsumers", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitServices", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitScopes", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitModels", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitBindings", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "traitDownlinks", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  protected willObserve<T>(callback: (this: this, traitObserver: TraitObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      result = callback.call(this, traitObserver as TraitObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, traitObserver: TraitObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const traitObservers = this.traitObservers;
    for (let i = 0, n = traitObservers.length; i < n; i += 1) {
      const traitObserver = traitObservers[i]!;
      result = callback.call(this, traitObserver as TraitObserverType<this>) as T | undefined;
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

  declare readonly model: Model | null;

  /** @hidden */
  setModel(newModel: TraitModelType<this> | null, oldModel: TraitModelType<this> | null): void {
    this.willSetModel(newModel, oldModel);
    if (oldModel !== null) {
      this.detachModel(oldModel);
    }
    Object.defineProperty(this, "model", {
      value: newModel,
      enumerable: true,
      configurable: true,
    });
    this.onSetModel(newModel, oldModel);
    if (newModel !== null) {
      this.attachModel(newModel);
    }
    this.didSetModel(newModel, oldModel);
  }

  protected attachModel(newModel: TraitModelType<this>): void {
    this.attachServices();
    this.attachScopes();
    if (this.isMounted()) {
      this.mountTraitModels();
      this.mountTraitBindings();
      this.mountDownlinks();
    }
  }

  protected detachModel(oldModel: TraitModelType<this>): void {
    if (this.isMounted()) {
      this.unmountDownlinks();
      this.unmountTraitBindings();
      this.unmountTraitModels();
    }
    this.detachScopes();
    this.detachServices();
  }

  remove(): void {
    const model = this.model;
    if (model !== null) {
      model.removeTrait(this);
    }
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    super.onInsertChildModel(childModel, targetModel);
    this.insertTraitModel(childModel);
  }

  protected onRemoveChildModel(childModel: Model): void {
    super.onRemoveChildModel(childModel);
    this.removeTraitModel(childModel);
  }

  protected onInsertTrait(trait: Trait, targetTrait: Trait | null | undefined): void {
    super.onInsertTrait(trait, targetTrait);
    this.insertTraitBinding(trait);
  }

  protected onRemoveTrait(trait: Trait): void {
    super.onRemoveTrait(trait);
    this.removeTraitBinding(trait);
  }

  /** @hidden */
  doMount(): void {
    if ((this.traitFlags & Trait.MountedFlag) === 0) {
      this.setTraitFlags(this.traitFlags | Trait.MountedFlag);
      this.willMount();
      this.onMount();
      this.didMount();
    } else {
      throw new Error("already mounted");
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountTraitModels();
    this.mountTraitBindings();
    this.mountDownlinks();
  }

  /** @hidden */
  doUnmount(): void {
    if ((this.traitFlags & Trait.MountedFlag) !== 0) {
      this.setTraitFlags(this.traitFlags & ~Trait.MountedFlag);
      this.willUnmount();
      this.onUnmount();
      this.didUnmount();
    } else {
      throw new Error("already unmounted");
    }
  }

  protected onUnmount(): void {
    this.unmountDownlinks();
    this.unmountTraitBindings();
    this.unmountTraitModels();
  }

  /** @hidden */
  doPower(): void {
    if ((this.traitFlags & Trait.PoweredFlag) === 0) {
      this.setTraitFlags(this.traitFlags | Trait.PoweredFlag);
      this.willPower();
      this.onPower();
      this.didPower();
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  doUnpower(): void {
    if ((this.traitFlags & Trait.PoweredFlag) !== 0) {
      this.setTraitFlags(this.traitFlags & ~Trait.PoweredFlag);
      this.willUnpower();
      this.onUnpower();
      this.didUnpower();
    } else {
      throw new Error("already unpowered");
    }
  }

  protected onMutate(modelContext: TraitContextType<this>): void {
    super.onMutate(modelContext);
    this.mutateScopes();
  }

  protected onReconcile(modelContext: TraitContextType<this>): void {
    super.onReconcile(modelContext);
    this.reconcileDownlinks();
  }

  protected startConsuming(): void {
    if ((this.traitFlags & Trait.ConsumingFlag) === 0) {
      this.willStartConsuming();
      this.setTraitFlags(this.traitFlags | Trait.ConsumingFlag);
      this.onStartConsuming();
      this.didStartConsuming();
    }
  }

  protected stopConsuming(): void {
    if ((this.traitFlags & Trait.ConsumingFlag) !== 0) {
      this.willStopConsuming();
      this.setTraitFlags(this.traitFlags & ~Trait.ConsumingFlag);
      this.onStopConsuming();
      this.didStopConsuming();
    }
  }

  declare readonly traitConsumers: ReadonlyArray<TraitConsumer>;

  addTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    const oldTraitConsumers = this.traitConsumers;
    const newTraitConsumers = Arrays.inserted(traitConsumer, oldTraitConsumers);
    if (oldTraitConsumers !== newTraitConsumers) {
      this.willAddTraitConsumer(traitConsumer);
      Object.defineProperty(this, "traitConsumers", {
        value: newTraitConsumers,
        enumerable: true,
        configurable: true,
      });
      this.onAddTraitConsumer(traitConsumer);
      this.didAddTraitConsumer(traitConsumer);
      if (oldTraitConsumers.length === 0) {
        this.startConsuming();
      }
    }
  }

  removeTraitConsumer(traitConsumer: TraitConsumerType<this>): void {
    const oldTraitConsumers = this.traitConsumers;
    const newTraitCnsumers = Arrays.removed(traitConsumer, oldTraitConsumers);
    if (oldTraitConsumers !== newTraitCnsumers) {
      this.willRemoveTraitConsumer(traitConsumer);
      Object.defineProperty(this, "traitConsumers", {
        value: newTraitCnsumers,
        enumerable: true,
        configurable: true,
      });
      this.onRemoveTraitConsumer(traitConsumer);
      this.didRemoveTraitConsumer(traitConsumer);
      if (newTraitCnsumers.length === 0) {
        this.stopConsuming();
      }
    }
  }

  /** @hidden */
  declare readonly traitServices: {[serviceName: string]: TraitService<Trait, unknown> | undefined} | null;

  hasTraitService(serviceName: string): boolean {
    const traitServices = this.traitServices;
    return traitServices !== null && traitServices[serviceName] !== void 0;
  }

  getTraitService(serviceName: string): TraitService<this, unknown> | null {
    const traitServices = this.traitServices;
    if (traitServices !== null) {
      const traitService = traitServices[serviceName];
      if (traitService !== void 0) {
        return traitService as TraitService<this, unknown>;
      }
    }
    return null;
  }

  setTraitService(serviceName: string, newTraitService: TraitService<this, unknown> | null): void {
    let traitServices = this.traitServices;
    if (traitServices === null) {
      traitServices = {};
      Object.defineProperty(this, "traitServices", {
        value: traitServices,
        enumerable: true,
        configurable: true,
      });
    }
    const oldTraitService = traitServices[serviceName];
    if (oldTraitService !== void 0 && this.isMounted()) {
      oldTraitService.detach();
    }
    if (newTraitService !== null) {
      traitServices[serviceName] = newTraitService;
      if (this.isMounted()) {
        newTraitService.attach();
      }
    } else {
      delete traitServices[serviceName];
    }
  }

  /** @hidden */
  protected attachServices(): void {
    const traitServices = this.traitServices;
    for (const serviceName in traitServices) {
      const traitService = traitServices[serviceName]!;
      traitService.attach();
    }
  }

  /** @hidden */
  protected detachServices(): void {
    const traitServices = this.traitServices;
    for (const serviceName in traitServices) {
      const traitService = traitServices[serviceName]!;
      traitService.detach();
    }
  }

  /** @hidden */
  declare readonly traitScopes: {[scopeName: string]: TraitScope<Trait, unknown> | undefined} | null;

  hasTraitScope(scopeName: string): boolean {
    const traitScopes = this.traitScopes;
    return traitScopes !== null && traitScopes[scopeName] !== void 0;
  }

  getTraitScope(scopeName: string): TraitScope<this, unknown> | null {
    const traitScopes = this.traitScopes;
    if (traitScopes !== null) {
      const traitScope = traitScopes[scopeName];
      if (traitScope !== void 0) {
        return traitScope as TraitScope<this, unknown>;
      }
    }
    return null;
  }

  setTraitScope(scopeName: string, newTraitScope: TraitScope<this, unknown> | null): void {
    let traitScopes = this.traitScopes;
    if (traitScopes === null) {
      traitScopes = {};
      Object.defineProperty(this, "traitScopes", {
        value: traitScopes,
        enumerable: true,
        configurable: true,
      });
    }
    const oldTraitScope = traitScopes[scopeName];
    if (oldTraitScope !== void 0 && this.isMounted()) {
      oldTraitScope.detach();
    }
    if (newTraitScope !== null) {
      traitScopes[scopeName] = newTraitScope;
      if (this.isMounted()) {
        newTraitScope.attach();
      }
    } else {
      delete traitScopes[scopeName];
    }
  }

  /** @hidden */
  mutateScopes(): void {
    const traitScopes = this.traitScopes;
    for (const scopeName in traitScopes) {
      const traitScope = traitScopes[scopeName]!;
      traitScope.onMutate();
    }
  }

  /** @hidden */
  protected attachScopes(): void {
    const traitScopes = this.traitScopes;
    for (const scopeName in traitScopes) {
      const traitScope = traitScopes[scopeName]!;
      traitScope.attach();
    }
  }

  /** @hidden */
  protected detachScopes(): void {
    const traitScopes = this.traitScopes;
    for (const scopeName in traitScopes) {
      const traitScope = traitScopes[scopeName]!;
      traitScope.detach();
    }
  }

  /** @hidden */
  declare readonly traitModels: {[bindingName: string]: TraitModel<Trait, Model> | undefined} | null;

  hasTraitModel(bindingName: string): boolean {
    const traitModels = this.traitModels;
    return traitModels !== null && traitModels[bindingName] !== void 0;
  }

  getTraitModel(bindingName: string): TraitModel<this, Model> | null {
    const traitModels = this.traitModels;
    if (traitModels !== null) {
      const traitModel = traitModels[bindingName];
      if (traitModel !== void 0) {
        return traitModel as TraitModel<this, Model>;
      }
    }
    return null;
  }

  setTraitModel(bindingName: string, newTraitModel: TraitModel<this, any> | null): void {
    let traitModels = this.traitModels;
    if (traitModels === null) {
      traitModels = {};
      Object.defineProperty(this, "traitModels", {
        value: traitModels,
        enumerable: true,
        configurable: true,
      });
    }
    const oldTraitModel = traitModels[bindingName];
    if (oldTraitModel !== void 0 && this.isMounted()) {
      oldTraitModel.unmount();
    }
    if (newTraitModel !== null) {
      traitModels[bindingName] = newTraitModel;
      if (this.isMounted()) {
        newTraitModel.mount();
        if (newTraitModel.child === true) {
          const childModel = this.getChildModel(newTraitModel.name);
          if (childModel !== null) {
            newTraitModel.doSetModel(childModel);
          }
        }
      }
    } else {
      delete traitModels[bindingName];
    }
  }

  /** @hidden */
  protected mountTraitModels(): void {
    const traitModels = this.traitModels;
    for (const bindingName in traitModels) {
      const traitModel = traitModels[bindingName]!;
      traitModel.mount();
      if (traitModel.child === true) {
        const childModel = this.getChildModel(traitModel.name);
        if (childModel !== null) {
          traitModel.doSetModel(childModel);
        }
      }
    }
  }

  /** @hidden */
  protected unmountTraitModels(): void {
    const traitModels = this.traitModels;
    for (const bindingName in traitModels) {
      const traitModel = traitModels[bindingName]!;
      traitModel.unmount();
    }
  }

  /** @hidden */
  protected insertTraitModel(childModel: Model): void {
    const bindingName = childModel.key;
    if (bindingName !== void 0) {
      const traitModel = this.getLazyTraitModel(bindingName);
      if (traitModel !== null && traitModel.child === true) {
        traitModel.doSetModel(childModel);
      }
    }
  }

  /** @hidden */
  protected removeTraitModel(childModel: Model): void {
    const bindingName = childModel.key;
    if (bindingName !== void 0) {
      const traitModel = this.getTraitModel(bindingName);
      if (traitModel !== null && traitModel.child === true) {
        traitModel.doSetModel(null);
      }
    }
  }

  /** @hidden */
  declare readonly traitBindings: {[bindingName: string]: TraitBinding<Trait, Trait> | undefined} | null;

  hasTraitBinding(bindingName: string): boolean {
    const traitBindings = this.traitBindings;
    return traitBindings !== null && traitBindings[bindingName] !== void 0;
  }

  getTraitBinding(bindingName: string): TraitBinding<this, Trait> | null {
    const traitBindings = this.traitBindings;
    if (traitBindings !== null) {
      const traitBinding = traitBindings[bindingName];
      if (traitBinding !== void 0) {
        return traitBinding as TraitBinding<this, Trait>;
      }
    }
    return null;
  }

  setTraitBinding(bindingName: string, newTraitBinding: TraitBinding<this, any> | null): void {
    let traitBindings = this.traitBindings;
    if (traitBindings === null) {
      traitBindings = {};
      Object.defineProperty(this, "traitBindings", {
        value: traitBindings,
        enumerable: true,
        configurable: true,
      });
    }
    const oldTraitBinding = traitBindings[bindingName];
    if (oldTraitBinding !== void 0 && this.isMounted()) {
      oldTraitBinding.unmount();
    }
    if (newTraitBinding !== null) {
      traitBindings[bindingName] = newTraitBinding;
      if (this.isMounted()) {
        newTraitBinding.mount();
        if (newTraitBinding.sibling === true) {
          const trait = this.getTrait(newTraitBinding.name);
          if (trait !== null) {
            newTraitBinding.doSetTrait(trait);
          }
        }
      }
    } else {
      delete traitBindings[bindingName];
    }
  }

  /** @hidden */
  protected mountTraitBindings(): void {
    const traitBindings = this.traitBindings;
    for (const bindingName in traitBindings) {
      const traitBinding = traitBindings[bindingName]!;
      traitBinding.mount();
      if (traitBinding.sibling === true) {
        const trait = this.getTrait(traitBinding.name);
        if (trait !== null) {
          traitBinding.doSetTrait(trait);
        }
      }
    }
  }

  /** @hidden */
  protected unmountTraitBindings(): void {
    const traitBindings = this.traitBindings;
    for (const bindingName in traitBindings) {
      const traitBinding = traitBindings[bindingName]!;
      traitBinding.unmount();
    }
  }

  /** @hidden */
  protected insertTraitBinding(trait: Trait): void {
    const bindingName = trait.key;
    if (bindingName !== void 0) {
      const traitBinding = this.getLazyTraitBinding(bindingName);
      if (traitBinding !== null && traitBinding.sibling === true) {
        traitBinding.doSetTrait(trait);
      }
    }
  }

  /** @hidden */
  protected removeTraitBinding(trait: Trait): void {
    const bindingName = trait.key;
    if (bindingName !== void 0) {
      const traitBinding = this.getTraitBinding(bindingName);
      if (traitBinding !== null && traitBinding.sibling === true) {
        traitBinding.doSetTrait(null);
      }
    }
  }

  /** @hidden */
  declare readonly traitDownlinks: {[downlinkName: string]: ModelDownlink<Trait> | undefined} | null;

  hasModelDownlink(downlinkName: string): boolean {
    const traitDownlinks = this.traitDownlinks;
    return traitDownlinks !== null && traitDownlinks[downlinkName] !== void 0;
  }

  getModelDownlink(downlinkName: string): ModelDownlink<this> | null {
    const traitDownlinks = this.traitDownlinks;
    if (traitDownlinks !== null) {
      const traitDownlink = traitDownlinks[downlinkName];
      if (traitDownlink !== void 0) {
        return traitDownlink as ModelDownlink<this>;
      }
    }
    return null;
  }

  setModelDownlink(downlinkName: string, newTraitDownlink: ModelDownlink<this> | null): void {
    let traitDownlinks = this.traitDownlinks;
    if (traitDownlinks === null) {
      traitDownlinks = {};
      Object.defineProperty(this, "traitDownlinks", {
        value: traitDownlinks,
        enumerable: true,
        configurable: true,
      });
    }
    const oldTraitDownlink = traitDownlinks[downlinkName];
    if (oldTraitDownlink !== void 0 && this.isMounted()) {
      oldTraitDownlink.unmount();
    }
    if (newTraitDownlink !== null) {
      traitDownlinks[downlinkName] = newTraitDownlink;
      if (this.isMounted()) {
        newTraitDownlink.mount();
      }
    } else {
      delete traitDownlinks[downlinkName];
    }
  }

  /** @hidden */
  protected mountDownlinks(): void {
    const traitDownlinks = this.traitDownlinks;
    for (const downlinkName in traitDownlinks) {
      const traitDownlink = traitDownlinks[downlinkName]!;
      traitDownlink.mount();
    }
  }

  /** @hidden */
  protected unmountDownlinks(): void {
    const traitDownlinks = this.traitDownlinks;
    for (const downlinkName in traitDownlinks) {
      const traitDownlink = traitDownlinks[downlinkName]!;
      traitDownlink.unmount();
    }
  }

  /** @hidden */
  protected reconcileDownlinks(): void {
    const traitDownlinks = this.traitDownlinks;
    for (const downlinkName in traitDownlinks) {
      const traitDownlink = traitDownlinks[downlinkName]!;
      traitDownlink.reconcile();
    }
  }
}

TraitScope({
  type: Object,
  inherit: true,
  modelScope: {
    type: Object,
    inherit: true,
    updateFlags: Model.NeedsReconcile,
  },
})(Trait.prototype, "warpRef");
