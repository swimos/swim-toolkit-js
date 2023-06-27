// Copyright 2015-2023 Swim.inc
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

import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import {Objects} from "@swim/util";
import type {Comparator} from "@swim/util";
import type {Consumer} from "@swim/util";
import {Affinity} from "@swim/component";
import type {FastenerFlags} from "@swim/component";
import {Fastener} from "@swim/component";
import type {AnyModel} from "./Model";
import type {Model} from "./Model";
import type {ModelRelationDescriptor} from "./ModelRelation";
import type {ModelRelationClass} from "./ModelRelation";
import {ModelRelation} from "./ModelRelation";

/** @public */
export interface ModelSetDescriptor<M extends Model = Model> extends ModelRelationDescriptor<M> {
  extends?: Proto<ModelSet<any, any>> | boolean | null;
  ordered?: boolean;
  sorted?: boolean;
}

/** @public */
export interface ModelSetClass<F extends ModelSet<any, any> = ModelSet<any, any>> extends ModelRelationClass<F> {
  /** @internal */
  readonly OrderedFlag: FastenerFlags;
  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface ModelSet<O = unknown, M extends Model = Model> extends ModelRelation<O, M> {
  (model: AnyModel<M>): O;

  /** @override */
  get descriptorType(): Proto<ModelSetDescriptor<M>>;

  /** @override */
  get fastenerType(): Proto<ModelSet<any, any>>;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willUnderive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onUnderive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didUnderive(inlet: ModelSet<unknown, M>): void;

  /** @override */
  get parent(): ModelSet<unknown, M> | null;

  /** @override */
  readonly inlet: ModelSet<unknown, M> | null;

  /** @override */
  bindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @internal @override */
  readonly outlets: ReadonlyArray<ModelSet<unknown, M>> | null;

  /** @internal @override */
  attachOutlet(outlet: ModelSet<unknown, M>): void;

  /** @internal @override */
  detachOutlet(outlet: ModelSet<unknown, M>): void;

  /** @internal */
  readonly models: {readonly [modelId: string]: M | undefined};

  readonly modelCount: number;

  /** @internal */
  insertModelMap(newModel: M, target: Model | null): void;

  /** @internal */
  removeModelMap(oldModel: M): void;

  hasModel(model: Model): boolean;

  addModel(model?: AnyModel<M>, target?: Model | null, key?: string): M;

  addModels(models: {readonly [modelId: string]: M | undefined}, target?: Model | null): void;

  setModels(models: {readonly [modelId: string]: M | undefined}, target?: Model | null): void;

  attachModel(model?: AnyModel<M>, target?: Model | null): M;

  attachModels(models: {readonly [modelId: string]: M | undefined}, target?: Model | null): void;

  detachModel(model: M): M | null;

  detachModels(models?: {readonly [modelId: string]: M | undefined}): void;

  insertModel(parent?: Model | null, model?: AnyModel<M>, target?: Model | null, key?: string): M;

  insertModels(parent: Model | null, models: {readonly [modelId: string]: M | undefined}, target?: Model | null): void;

  removeModel(model: M): M | null;

  removeModels(models?: {readonly [modelId: string]: M | undefined}): void;

  deleteModel(model: M): M | null;

  deleteModels(models?: {readonly [modelId: string]: M | undefined}): void;

  reinsertModel(model: M, target?: Model | null): void;

  /** @internal @override */
  bindModel(model: Model, target: Model | null): void;

  /** @internal @override */
  unbindModel(model: Model): void;

  /** @override */
  detectModel(model: Model): M | null;

  consumeModels(consumer: Consumer): void;

  unconsumeModels(consumer: Consumer): void;

  /** @protected @override */
  onStartConsuming(): void;

  /** @protected @override */
  onStopConsuming(): void;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ModelSet<unknown, M>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  modelKey(model: M): string | undefined;

  /** @internal */
  initOrdered(ordered: boolean): void;

  get ordered(): boolean;

  order(ordered?: boolean): this;

  /** @internal */
  initSorted(sorted: boolean): void;

  get sorted(): boolean;

  sort(sorted?: boolean): this;

  /** @protected */
  willSort(parent: Model | null): void;

  /** @protected */
  onSort(parent: Model | null): void;

  /** @protected */
  didSort(parent: Model | null): void;

  /** @internal */
  sortChildren(parent: Model, comparator?: Comparator<M>): void;

  /** @internal */
  getTargetChild(parent: Model, child: M): Model | null;

  /** @internal */
  compareChildren(a: Model, b: Model): number;

  /** @internal */
  compareTargetChild(a: Model, b: Model): number;

  /** @protected */
  compare(a: M, b: M): number;
}

/** @public */
export const ModelSet = (function (_super: typeof ModelRelation) {
  const ModelSet = _super.extend("ModelSet", {}) as ModelSetClass;

  Object.defineProperty(ModelSet.prototype, "fastenerType", {
    value: ModelSet,
    enumerable: true,
    configurable: true,
  });

  ModelSet.prototype.onDerive = function (this: ModelSet, inlet: ModelSet): void {
    this.setModels(inlet.models);
  };

  ModelSet.prototype.insertModelMap = function <M extends Model>(this: ModelSet<unknown, M>, newModel: M, target: Model | null): void {
    const models = this.models as {[modelId: string]: M | undefined};
    if (target !== null && (this.flags & ModelSet.OrderedFlag) !== 0) {
      (this as Mutable<typeof this>).models = Objects.inserted(models, newModel.uid, newModel, target);
    } else {
      models[newModel.uid] = newModel;
    }
  };

  ModelSet.prototype.removeModelMap = function <M extends Model>(this: ModelSet<unknown, M>, oldModel: M): void {
    const models = this.models as {[modelId: string]: M | undefined};
    delete models[oldModel.uid];
  };

  ModelSet.prototype.hasModel = function (this: ModelSet, model: Model): boolean {
    return this.models[model.uid] !== void 0;
  };

  ModelSet.prototype.addModel = function <M extends Model>(this: ModelSet<unknown, M>, newModel?: AnyModel<M>, target?: Model | null, key?: string): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    if (target === void 0) {
      target = null;
    }
    let parent: Model | null;
    if (this.binds && (parent = this.parentModel, parent !== null)) {
      if (target === null) {
        if (newModel.parent === parent) {
          target = newModel.nextSibling;
        } else {
          target = this.getTargetChild(parent, newModel);
        }
      }
      if (key === void 0) {
        key = this.modelKey(newModel);
      }
      if (newModel.parent !== parent || newModel.nextSibling !== target || newModel.key !== key) {
        this.insertChild(parent, newModel, target, key);
      }
    }
    if (this.models[newModel.uid] === void 0) {
      this.insertModelMap(newModel, target);
      (this as Mutable<typeof this>).modelCount += 1;
      this.willAttachModel(newModel, target);
      this.onAttachModel(newModel, target);
      this.initModel(newModel);
      this.didAttachModel(newModel, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newModel;
  };

  ModelSet.prototype.addModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: string]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.addModel(newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.setModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: string]: M | undefined}, target?: Model | null): void {
    const binds = this.binds;
    const parent = binds ? this.parentModel : null;
    const models = this.models;
    for (const modelId in models) {
      if (newModels[modelId] === void 0) {
        const oldModel = this.detachModel(models[modelId]!);
        if (oldModel !== null && binds && parent !== null && oldModel.parent === parent) {
          oldModel.remove();
        }
      }
    }
    if ((this.flags & ModelSet.OrderedFlag) !== 0) {
      const orderedModels = new Array<M>();
      for (const modeld in newModels) {
        orderedModels.push(newModels[modeld]!);
      }
      for (let i = 0, n = orderedModels.length; i < n; i += 1) {
        const newModel = orderedModels[i]!;
        if (models[newModel.uid] === void 0) {
          const targetModel = i < n + 1 ? orderedModels[i + 1] : target;
          this.addModel(newModel, targetModel);
        }
      }
    } else {
      for (const modelId in newModels) {
        if (models[modelId] === void 0) {
          this.addModel(newModels[modelId]!, target);
        }
      }
    }
  };

  ModelSet.prototype.attachModel = function <M extends Model>(this: ModelSet<unknown, M>, newModel?: AnyModel<M>, target?: Model | null): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    if (this.models[newModel.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      this.insertModelMap(newModel, target);
      (this as Mutable<typeof this>).modelCount += 1;
      this.willAttachModel(newModel, target);
      this.onAttachModel(newModel, target);
      this.initModel(newModel);
      this.didAttachModel(newModel, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newModel;
  };

  ModelSet.prototype.attachModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: string]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.attachModel(newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.detachModel = function <M extends Model>(this: ModelSet<unknown, M>, oldModel: M): M | null {
    if (this.models[oldModel.uid] !== void 0) {
      (this as Mutable<typeof this>).modelCount -= 1;
      this.removeModelMap(oldModel);
      this.willDetachModel(oldModel);
      this.onDetachModel(oldModel);
      this.deinitModel(oldModel);
      this.didDetachModel(oldModel);
      this.setCoherent(true);
      this.decohereOutlets();
      return oldModel;
    }
    return null;
  };

  ModelSet.prototype.detachModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: string]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.detachModel(models[modelId]!);
    }
  };

  ModelSet.prototype.insertModel = function <M extends Model>(this: ModelSet<unknown, M>, parent?: Model | null, newModel?: AnyModel<M>, target?: Model | null, key?: string): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    if (parent === void 0) {
      parent = null;
    }
    if (this.binds || this.models[newModel.uid] === void 0 || newModel.parent === null || parent !== null || key !== void 0) {
      if (parent === null) {
        parent = this.parentModel;
      }
      if (target === void 0) {
        target = null;
      }
      if (key === void 0) {
        key = this.modelKey(newModel);
      }
      if (parent !== null && (newModel.parent !== parent || newModel.key !== key)) {
        if (target === null) {
          target = this.getTargetChild(parent, newModel);
        }
        this.insertChild(parent, newModel, target, key);
      }
      if (this.models[newModel.uid] === void 0) {
        this.insertModelMap(newModel, target);
        (this as Mutable<typeof this>).modelCount += 1;
        this.willAttachModel(newModel, target);
        this.onAttachModel(newModel, target);
        this.initModel(newModel);
        this.didAttachModel(newModel, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
    return newModel;
  };

  ModelSet.prototype.insertModels = function <M extends Model>(this: ModelSet, parent: Model | null, newModels: {readonly [modelId: string]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.insertModel(parent, newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.removeModel = function <M extends Model>(this: ModelSet<unknown, M>, model: M): M | null {
    if (this.hasModel(model)) {
      model.remove();
      return model;
    }
    return null;
  };

  ModelSet.prototype.removeModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: string]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.removeModel(models[modelId]!);
    }
  };

  ModelSet.prototype.deleteModel = function <M extends Model>(this: ModelSet<unknown, M>, model: M): M | null {
    const oldModel = this.detachModel(model);
    if (oldModel !== null) {
      oldModel.remove();
    }
    return oldModel;
  };

  ModelSet.prototype.deleteModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: string]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.deleteModel(models[modelId]!);
    }
  };

  ModelSet.prototype.reinsertModel = function <M extends Model>(this: ModelSet<unknown, M>, model: M, target?: Model | null): void {
    if (this.models[model.uid] !== void 0 && (target !== void 0 || (this.flags & ModelSet.SortedFlag) !== 0)) {
      const parent = model.parent;
      if (parent !== null) {
        if (target === void 0) {
          target = this.getTargetChild(parent, model);
        }
        parent.reinsertChild(model, target);
      }
    }
  };

  ModelSet.prototype.bindModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model, target: Model | null): void {
    if (!this.binds) {
      return;
    }
    const newModel = this.detectModel(model);
    if (newModel === null || this.models[newModel.uid] !== void 0) {
      return;
    }
    this.insertModelMap(newModel, target);
    (this as Mutable<typeof this>).modelCount += 1;
    this.willAttachModel(newModel, target);
    this.onAttachModel(newModel, target);
    this.initModel(newModel);
    this.didAttachModel(newModel, target);
    this.setCoherent(true);
    this.decohereOutlets();
  };

  ModelSet.prototype.unbindModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model): void {
    if (!this.binds) {
      return;
    }
    const oldModel = this.detectModel(model);
    if (oldModel === null || this.models[oldModel.uid] === void 0) {
      return;
    }
    (this as Mutable<typeof this>).modelCount -= 1;
    this.removeModelMap(oldModel);
    this.willDetachModel(oldModel);
    this.onDetachModel(oldModel);
    this.deinitModel(oldModel);
    this.didDetachModel(oldModel);
    this.setCoherent(true);
    this.decohereOutlets();
  };

  ModelSet.prototype.detectModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model): M | null {
    if (typeof this.modelType === "function" && model instanceof this.modelType) {
      return model as M;
    }
    return null;
  };

  ModelSet.prototype.consumeModels = function <M extends Model>(this: ModelSet<unknown, M>, consumer: Consumer): void {
    const models = this.models;
    for (const modelId in models) {
      const model = models[modelId]!;
      model.consume(consumer);
    }
  };

  ModelSet.prototype.unconsumeModels = function <M extends Model>(this: ModelSet<unknown, M>, consumer: Consumer): void {
    const models = this.models;
    for (const modelId in models) {
      const model = models[modelId]!;
      model.unconsume(consumer);
    }
  };

  ModelSet.prototype.onStartConsuming = function (this: ModelSet): void {
    this.consumeModels(this);
  };

  ModelSet.prototype.onStopConsuming = function (this: ModelSet): void {
    this.unconsumeModels(this);
  };

  ModelSet.prototype.decohereOutlets = function (this: ModelSet): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ModelSet.prototype.decohereOutlet = function (this: ModelSet, outlet: ModelSet): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ModelSet.prototype.recohere = function (this: ModelSet, t: number): void {
    let inlet: ModelSet | null;
    if ((this.flags & Fastener.DerivedFlag) === 0 || (inlet = this.inlet) === null) {
      return;
    }
    this.setModels(inlet.models);
  };

  ModelSet.prototype.modelKey = function <M extends Model>(this: ModelSet<unknown, M>, model: M): string | undefined {
    return void 0;
  };

  ModelSet.prototype.initOrdered = function (this: ModelSet, ordered: boolean): void {
    if (ordered) {
      (this as Mutable<typeof this>).flags = this.flags | ModelSet.OrderedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ModelSet.OrderedFlag;
    }
  };

  Object.defineProperty(ModelSet.prototype, "ordered", {
    get(this: ModelSet): boolean {
      return (this.flags & ModelSet.OrderedFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  ModelSet.prototype.order = function (this: ModelSet,  ordered?: boolean): typeof this {
    if (ordered === void 0) {
      ordered = true;
    }
    if (ordered) {
      this.setFlags(this.flags | ModelSet.OrderedFlag);
    } else {
      this.setFlags(this.flags & ~ModelSet.OrderedFlag);
    }
    return this;
  };

  ModelSet.prototype.initSorted = function (this: ModelSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ModelSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ModelSet.SortedFlag;
    }
  };

  Object.defineProperty(ModelSet.prototype, "sorted", {
    get(this: ModelSet): boolean {
      return (this.flags & ModelSet.SortedFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  ModelSet.prototype.sort = function (this: ModelSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    if (sorted) {
      const parent = this.parentModel;
      this.willSort(parent);
      this.setFlags(this.flags | ModelSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else {
      this.setFlags(this.flags & ~ModelSet.SortedFlag);
    }
    return this;
  };

  ModelSet.prototype.willSort = function (this: ModelSet, parent: Model | null): void {
    // hook
  };

  ModelSet.prototype.onSort = function (this: ModelSet, parent: Model | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  ModelSet.prototype.didSort = function (this: ModelSet, parent: Model | null): void {
    // hook
  };

  ModelSet.prototype.sortChildren = function <M extends Model>(this: ModelSet<unknown, M>, parent: Model, comparator?: Comparator<M>): void {
    parent.sortChildren(this.compareChildren.bind(this));
  };

  ModelSet.prototype.getTargetChild = function <M extends Model>(this: ModelSet<unknown, M>, parent: Model, child: M): Model | null {
    if ((this.flags & ModelSet.SortedFlag) !== 0) {
      return parent.getTargetChild(child, this.compareTargetChild.bind(this));
    } else {
      return null;
    }
  };

  ModelSet.prototype.compareChildren = function <M extends Model>(this: ModelSet<unknown, M>, a: Model, b: Model): number {
    const models = this.models;
    const x = models[a.uid];
    const y = models[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  ModelSet.prototype.compareTargetChild = function <M extends Model>(this: ModelSet<unknown, M>, a: M, b: Model): number {
    const models = this.models;
    const y = models[b.uid];
    if (y !== void 0) {
      return this.compare(a, y);
    } else {
      return y !== void 0 ? -1 : 0;
    }
  };

  ModelSet.prototype.compare = function <M extends Model>(this: ModelSet<unknown, M>, a: M, b: M): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  ModelSet.construct = function <F extends ModelSet<any, any>>(fastener: F | null, owner: F extends ModelSet<infer O, any> ? O : never): F {
    if (fastener === null) {
      fastener = function (newModel: F extends ModelRelation<any, infer M> ? AnyModel<M> : never): F extends ModelSet<infer O, any> ? O : never {
        fastener!.addModel(newModel);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initOrdered((flagsInit & ModelSet.OrderedFlag) !== 0);
      fastener.initSorted((flagsInit & ModelSet.SortedFlag) !== 0);
    }
    (fastener as Mutable<typeof fastener>).models = {};
    (fastener as Mutable<typeof fastener>).modelCount = 0;
    return fastener;
  };

  ModelSet.refine = function (fastenerClass: ModelSetClass<any>): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "ordered")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.ordered) {
        flagsInit |= ModelSet.OrderedFlag;
      } else {
        flagsInit &= ~ModelSet.OrderedFlag;
      }
      delete (fastenerPrototype as ModelSetDescriptor).ordered;
    }

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "sorted")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.sorted) {
        flagsInit |= ModelSet.SortedFlag;
      } else {
        flagsInit &= ~ModelSet.SortedFlag;
      }
      delete (fastenerPrototype as ModelSetDescriptor).sorted;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        enumerable: true,
        configurable: true,
      });
    }
  };

  (ModelSet as Mutable<typeof ModelSet>).OrderedFlag = 1 << (_super.FlagShift + 0);
  (ModelSet as Mutable<typeof ModelSet>).SortedFlag = 1 << (_super.FlagShift + 1);

  (ModelSet as Mutable<typeof ModelSet>).FlagShift = _super.FlagShift + 2;
  (ModelSet as Mutable<typeof ModelSet>).FlagMask = (1 << ModelSet.FlagShift) - 1;

  return ModelSet;
})(ModelRelation);
